import { type Page, type Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly forgotPassword: Locator;
  readonly signupLink: Locator;
  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", { name: "С возвращением" });
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Пароль");
    this.submitButton = page.getByRole("button", { name: "Войти" });
    this.errorAlert = page.getByRole("alert");
    this.forgotPassword = page.getByRole("link", { name: "Забыли пароль?" });
    this.signupLink = page.getByRole("link", { name: "Создать" });
  }

  async goTo() {
    await this.page.goto("/login");
    //check is it login page?
    await expect(this.heading).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
