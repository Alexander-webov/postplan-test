// КРИТИЧНО: импортируем test и expect из нашей фикстуры, НЕ из @playwright/test.
// Иначе расширения не подхватятся.
import { test, expect } from "../../fixtures/pages.fixture";

import { LoginPage } from "../../pages/login.page";

test.describe("Login page", () => {
  let loginPage: LoginPage;
  // Никаких let loginPage. Никакого beforeEach.
  test.use({ storageState: { cookies: [], origins: [] } });
  test("Chek Login form @smoke", async ({ page, loginPage }) => {
    // Эти тесты должны идти БЕЗ сохранённой сессии.
    // storageState: { cookies: [], origins: [] } — это "пустой" state.

    await loginPage.goTo();
    //Chek the Title page
    await expect(page).toHaveTitle(/Вход/);

    await expect(loginPage.heading).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.signupLink).toBeVisible();
    await expect(loginPage.forgotPassword).toBeVisible();
  });

  //bad registration
  test("negative login: show error in bad registration", async ({ page, loginPage }) => {
    await loginPage.goTo();
    await loginPage.login("nonexistent@example.com", "wrongpassword123");
    await expect(loginPage.errorAlert).toBeVisible();

    //addition check in order do not have rederict to dashboard
    await expect(loginPage.page).toHaveURL(/\/login/);
  });

  test("negative login: (HTML5 validation)", async ({ page, loginPage }) => {
    await loginPage.goTo();
    await loginPage.submitButton.click();
    // Браузер сам блокирует отправку из-за required-полей.
    // Проверяем что мы остались на той же странице.
    await expect(loginPage.page).toHaveURL(/\/login/);
  });

  test("positive login", async ({ page, loginPage }) => {
    await loginPage.goTo();
    await loginPage.login("test-aqa@postplan.local", "TestPassword123!");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
