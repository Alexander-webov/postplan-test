import { test, expect } from "@playwright/test";

test.describe("Dashboard (требует логина)", () => {
  test("страница dashboard открывается у залогиненного юзера @smoke", async ({ page }) => {
    // НИКАКОГО логина в теле теста. Playwright сам подгрузил сессию из файла.
    await page.goto("/dashboard");

    // Если бы мы не были залогинены — middleware редиректнул бы на /login.
    // Проверяем что НЕ редиректнуло и URL остался на dashboard:
    await expect(page).toHaveURL(/\/dashboard/);

    // Проверяем что увидели контент dashboard-а — заголовок страницы 'Обзор'
    await expect(page).toHaveTitle(/Обзор/);
  });

  test("доступ к защищённой странице /dashboard/channels @smoke", async ({ page }) => {
    await page.goto("/dashboard/channels");
    await expect(page).toHaveURL(/\/dashboard\/channels/);
  });
});
