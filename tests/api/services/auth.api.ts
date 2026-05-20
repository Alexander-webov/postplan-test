import { type APIRequestContext, type APIResponse } from "playwright/test";

// Типы ответов Supabase — выносим в отдельный интерфейс.
// На реальном проекте такие типы часто генерят из OpenAPI/Swagger.

export interface SupabaseLoginResponse {
  access_token: string;
  refresh_token: string;
  expres_in: number;
  token_type: "bearer";
  user: {
    id: string;
    email: string;
    email_confirmed_at: string | null;
  };
}

export class AuthApi {
  constructor(
    private request: APIRequestContext,
    private supabaseUrl: string,
    private anonKey: string,
  ) {}

  /**
   * Логин через Supabase Auth API.
   * Возвращает сырой APIResponse — пусть тест решает, проверять успех или нет.
   */

  async login(email: string, password: string): Promise<APIResponse> {
    return this.request.post(`${this.supabaseUrl}/auth/v1/token?grant_type=password`, {
      headers: this.defaultHeaders(),
      data: { email, password },
    });
  }

  /**
   * Регистрация нового пользователя.
   */

  async signup(email: string, password: string): Promise<APIResponse> {
    return this.request.post(`${this.supabaseUrl}/auth/v1/signup`, {
      headers: this.defaultHeaders(),
      data: { email, password },
    });
  }

  /**
   * Внутренний helper для headers, которые нужны всем эндпоинтам Supabase Auth.
   * private — наружу не торчит, это деталь имплементации.
   */

  private defaultHeaders(): Record<string, string> {
    return {
      apikey: this.anonKey,
      "Content-Type": "application/json",
    };
  }
}
