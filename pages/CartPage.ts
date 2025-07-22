import { Page, Locator } from "@playwright/test";
import { step } from "@tools/Decorator";

export class CartPage {
	private page: Page;
    public itemInCart: Locator;
    public continueShoppingButton: Locator;

    constructor(page: Page) {
		this.page = page;
        this.itemInCart = page.locator(".cart_item");
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    }

    @step
    async isProductInCart(productName: string): Promise<boolean> {
		return await this.itemInCart.filter({ hasText: productName }).count() > 0;
    }

    @step
    async removeFromCart(productName: string) {
		await this.itemInCart.filter({ hasText: productName }).locator('button', { hasText: 'Remove' }).click();
    }

    @step
    async continueShopping() {
		await this.continueShoppingButton.click();
    }
}