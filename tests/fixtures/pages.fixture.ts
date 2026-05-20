import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { SignupPage } from "../pages/signup.page";
import { use } from "react";
// Объявляем тип наших кастомных фикстур.
// Ключи — имена фикстур, которые будут доступны в тестах.
// Значения — типы объектов, которые фикстура отдаёт.

type Pages = {
  loginPage: LoginPage;
  signupPage: SignupPage;
};

// Расширяем базовый test, добавляя наши фикстуры.
// base — это оригинальный test из Playwright.
// Через extend мы создаём НОВЫЙ test, в котором есть всё что было + наше.
export const test = base.extend<Pages>({
  // Фикстура определяется как async-функция с двумя параметрами:
  // 1. Объект с другими фикстурами, которые НАМ нужны ({ page })
  // 2. Функция use — критический концепт, объясняю ниже

  loginPage: async ({ page }, use) => {
    // SETUP (Arrange): код ДО use() — выполняется перед тестом
    const loginPage = new LoginPage(page);
    // Передаём объект в тест и ЖДЁМ, пока тест отработает.
    // Здесь происходит выполнение твоего test('...', async ({ loginPage }) => {...})
    await use(loginPage);

    // TEARDOWN: код ПОСЛЕ use() — выполняется после теста.
    // Сейчас нечего убирать, но позже здесь будут:
    // - закрытие соединений
    // - удаление тестовых данных
    // - снятие моков
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
});
// Реэкспортируем expect — чтобы в тестах импортировать всё из одного места.
export { expect } from "@playwright/test";
