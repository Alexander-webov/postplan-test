import { test, expect } from "@playwright/test";
import { AuthApi, type SupabaseLoginResponse } from "./services/auth.api";

// Достаём конфиг один раз на файл.
// Throw если переменных нет — лучше упасть рано, чем получить cryptic ошибку в тесте.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY обязательны");
}

test.describe("Supabase Auth API", () => {
  let authApi: AuthApi;

  test.beforeEach(({ request }) => {
    authApi = new AuthApi(request, SUPABASE_URL, SUPABASE_ANON_KEY);
  });

  test("позитивный: логин с валидными кредами возвращает токен @smoke", async () => {
    const response = await authApi.login("test-aqa@postplan.local", "TestPassword123!");

    expect(response.status()).toBe(200);

    // as SupabaseLoginResponse — даём TS подсказку про тип, чтобы был автокомплит
    const body = (await response.json()) as SupabaseLoginResponse;

    // Contract checks — что ответ соответствует ожидаемой структуре
    expect(body).toHaveProperty("access_token");
    expect(body).toHaveProperty("refresh_token");
    expect(body.token_type).toBe("bearer");
    expect(body.user.email).toBe("test-aqa@postplan.local");

    // access_token должен быть JWT (3 части через точки)
    expect(body.access_token.split(".").length).toBe(3);
  });

  test("негативный: неверный пароль возвращает 400", async () => {
    const response = await authApi.login("test-aqa@postplan.local", "wrongpassword");

    expect(response.status()).toBe(400);

    const body = await response.json();
    // Supabase возвращает error_description с человекочитаемой ошибкой
    // Проверяем то, что РЕАЛЬНО возвращается, не то что мы предполагали
    expect(body).toMatchObject({
      code: 400,
      error_code: "invalid_credentials",
    });
    // msg — человекочитаемая ошибка
    expect(body.msg).toContain("Invalid");
  });

  test("негативный: несуществующий email возвращает 400", async () => {
    const response = await authApi.login("nonexistent@test.local", "anypassword");
    expect(response.status()).toBe(400);
  });

  test("негативный: пустой email возвращает 400", async () => {
    const response = await authApi.login("", "password");
    expect(response.status()).toBe(400);
  });

  test("signup создаёт пользователя", async () => {
    const email = `aqa-api-${Date.now()}@postplan.local`;
    const response = await authApi.signup(email, "ValidPassword123!");

    expect([200, 201]).toContain(response.status());

    const body = await response.json();

    // Supabase возвращает либо плоский user-объект (когда auto-confirm выкл),
    // либо обёрнутый в session (когда auto-confirm вкл).
    // Извлекаем user независимо от формата:
    const user = body.user ?? body;

    expect(user).toHaveProperty("id");
    expect(user.email).toBe(email);
  });
});
