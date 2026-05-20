import { type Page, type Locator, expect } from "@playwright/test";

export class SignupPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly successMesage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole("heading", { name: "Создать аккаунт" });
    this.nameInput = page.getByLabel(/Имя/);
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Пароль");
    this.submitButton = page.getByRole("button", { name: "Создать аккаунт" });
    this.errorAlert = page.getByRole("alert");
    this.successMesage = page.getByText("Подтверди email");
  }

  async goto() {
    await this.page.goto("/signup");

    await expect(this.heading).toBeVisible();
  }

  async signup(email: string, password: string, name?: string) {
    if (name) {
      await this.nameInput.fill(name);
    }
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    await this.submitButton.click();
  }
}
