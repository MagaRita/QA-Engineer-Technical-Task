import { Page, Locator, expect } from "@playwright/test";
import { step } from "@tools/Decorator";

export class LoginPage {
	private page: Page;
    private usernameInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;
    private errorMessage: Locator;

    constructor(page: Page) {
		this.page = page;
        this.usernameInput = page.locator("[data-test='username']");
        this.passwordInput = page.locator("[data-test='password']");
        this.loginButton = page.locator("[data-test='login-button']");
        this.errorMessage = page.locator("[data-test='error']");
    }

    @step
    async goto() {
		await this.page.goto("/");
    }

    @step
    async submitLoginForm(username: string, password: string) {
		await this.usernameInput.fill(username);
		await this.passwordInput.fill(password);
		await this.loginButton.click();
    }

    @step
    async measureLoginTime(username: string, password: string): Promise<number> {
        const startTime = Date.now();
        await this.submitLoginForm(username, password);
        await this.page.waitForURL(/.*\/inventory.html/, { timeout: 10_000 });
        const endTime = Date.now();
        return endTime - startTime;
    }

    @step
    async expectedErrorMessage(errorMessageText: string) {
		await expect(this.errorMessage, `The error message should be: ${errorMessageText}`).toContainText(errorMessageText);
        await expect(this.errorMessage).toBeVisible();
    }
}