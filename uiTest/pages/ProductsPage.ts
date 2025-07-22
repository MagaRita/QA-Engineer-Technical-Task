import { Page, Locator } from "@playwright/test";
import { step } from "@tools/Decorator";

export class ProductsPage {
	private page: Page;
    public inventoryList: Locator;
    private brokenImage: Locator;
    private shoppingCart: Locator;
    public shoppingCartBadge: Locator;
    public menuButton: Locator;
    public logoutLink: Locator;

    constructor(page: Page) {
		this.page = page;
        this.inventoryList = page.locator(".inventory_list");
        this.brokenImage = page.locator('img[src*="/static/media/sl-404."]');
        this.shoppingCart = page.locator(".shopping_cart_link");
        this.shoppingCartBadge = page.locator(".shopping_cart_badge");
        this.menuButton = this.page.locator(".bm-burger-button");
        this.logoutLink = this.page.locator("[data-test='logout-sidebar-link']");
    }

	@step
    async isInventoryListVisible(): Promise<boolean> {
		return await this.inventoryList.isVisible() && this.page.url().includes("/inventory");
    }

    @step
    async addToCart(productName: string) {
		await this.page.locator(".inventory_item").filter({ hasText: productName }).locator("button").click();
    }

    @step
    async redirectToCart() {
		await this.shoppingCart.click();
    }

    @step
    async existBrokenImages(): Promise<boolean> {
		return await this.brokenImage.count() > 0;
    }

	@step
    async logout(): Promise<void> {
		await this.menuButton.click();
        await this.logoutLink.click();
    }
}