import { test, expect } from "../../fixtures/pages.fixture";

test.describe("signup page", () => {
  // Эти тесты должны идти БЕЗ сохранённой сессии.
  // storageState: { cookies: [], origins: [] } — это "пустой" state.
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Look at form registration  @smoke", async ({ page, signupPage }) => {
    await signupPage.goto();

    await expect(page).toHaveTitle(/Регистрация|Создать/);
    await expect(signupPage.emailInput).toBeVisible();
    await expect(signupPage.passwordInput).toBeVisible();
    await expect(signupPage.submitButton).toBeVisible();
  });

  test("negative signup: (HTML5 validation)", async ({ page, signupPage }) => {
    await signupPage.goto();
    await signupPage.signup(`unique-${Date.now()}@test.com`, "short");

    await expect(page).toHaveURL(/\/signup/);
  });

  test("positive signup", async ({ page, signupPage }) => {
    await signupPage.goto();

    // Используем уникальный email через timestamp, чтобы тест не падал
    // на повторных запусках с "email уже занят"

    await signupPage.signup(`aqa-test-${Date.now()}@postplan.local`, "ValidPassword123!", "AQA Test");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
