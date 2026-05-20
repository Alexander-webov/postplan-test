import { test as setup, expect } from "@playwright/test";
import path from "path";
// Путь, куда сохраним сессию. Один файл для всего юзера.
// Лежит в node_modules-стиле — не коммитим, не показываем в репорте.

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("аутентификация: логин и сохранение сессии", async ({ page }) => {
  // Логинимся через UI — точно так же, как в обычных тестах
  await page.goto("/login");
  await page.getByLabel("Email").fill("test-aqa@postplan.local");
  await page.getByLabel("Пароль").fill("TestPassword123!");
  await page.getByRole("button", { name: "Войти" }).click();

  // Дожидаемся редиректа — это сигнал, что логин успешен.
  // Если этот expect упадёт — значит логин не сработал, дальше нет смысла сохранять.
  await expect(page).toHaveURL(/\/dashboard/);

  // Сохраняем cookies + localStorage в файл.
  // page.context() — это сессия браузера, которая помнит куки.
  // storageState({ path }) — записывает её в JSON.
  await page.context().storageState({ path: authFile });
});
