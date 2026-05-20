import { test, expect } from "@playwright/test";

test.describe("Login — мокированные ответы сервера", () => {
  // Эти тесты работают с анонимной сессией (как login.spec.ts)
  test.use({ storageState: { cookies: [], origins: [] } });

  test("UI показывает ошибку при 500 от сервера", async ({ page }) => {
    // ПЕРЕХВАТ: ловим запрос логина к Supabase ДО перехода на страницу.
    // Важно: route ставится ПЕРЕД действием, которое вызовет запрос.
    //Мой комент! То есть мы создаем фэйковый ответ от бэкенд и fulfill заполняем какой именно
    await page.route("**/auth/v1/token**", async (route) => {
      // FULFILL: отвечаем сами, не пуская запрос к Supabase.
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    });

    await page.goto("/login");
    await page.getByLabel("Email").fill("test-aqa@postplan.local");
    await page.getByLabel("Пароль").fill("TestPassword123!");
    await page.getByRole("button", { name: "Войти" }).click();

    // Даже с ВАЛИДНЫМИ кредами логин провалится — потому что мы замокали 500.
    // Проверяем что UI не упал, а показал ошибку:
    await expect(page.getByRole("alert")).toBeVisible();
    // И что не было редиректа на dashboard:
    await expect(page).toHaveURL(/\/login/);
  });

  test("UI показывает loading во время запроса", async ({ page }) => {
    await page.route("**/auth/v1/token**", async (route) => {
      // Задержка перед ответом — симулируем медленный сервер
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Продолжаем к реальному серверу после задержки
      await route.continue();
    });

    await page.goto("/login");
    await page.getByLabel("Email").fill("test-aqa@postplan.local");
    await page.getByLabel("Пароль").fill("TestPassword123!");
    await page.getByRole("button", { name: "Войти" }).click();

    // Пока запрос "висит" 2 секунды, кнопка должна быть disabled
    // Во время загрузки текст становится «Вхожу…», ловим его и проверяем disabled
    await expect(page.getByRole("button", { name: /Вхожу/ })).toBeDisabled();
  });
});
