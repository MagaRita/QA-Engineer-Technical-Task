import { test, expect } from "@playwright/test";
import { ProductsPage } from "../../pages/ProductsPage";
import { CartPage } from "../../pages/CartPage";
import { LoginPage } from "../../pages/LoginPage";
import { USERS, PRODUCT_NAMES, ERROR_MESSAGES } from "../../data/testData";

test.describe.parallel("Cart Functionality", () => {
	let cartPage: CartPage;
    let productsPage: ProductsPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        cartPage = new CartPage(page);
        productsPage = new ProductsPage(page);
        await loginPage.goto();
        await loginPage.submitLoginForm(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
        await expect(productsPage.inventoryList, "User logs in and redirects to the inventory page.").toBeVisible();
        expect(await productsPage.isInventoryListVisible(), "The inventory url should include '/inventory'").toEqual(true);
    });

	test("Verify user can add a single product to the cart and remove it", async ({ page }) => {
		const productName = PRODUCT_NAMES.SAUCE_LABS_BACKPACK;
		await productsPage.addToCart(productName);

		await expect(productsPage.shoppingCartBadge, "Cart badge should show: 1.").toHaveText("1");
        await productsPage.redirectToCart();
        await expect(page, "The user should redirect to the cart page.").toHaveURL(/.*cart\.html/);
        expect(await cartPage.isProductInCart(productName), "The product should be visible in the cart.").toBeTruthy();

        await cartPage.removeFromCart(productName);
        await expect(cartPage.itemInCart.filter({ hasText: productName }), "The product should be removed from the cart.").not.toBeVisible();
        await expect(productsPage.shoppingCartBadge, "Cart badge should not be visible.").not.toBeVisible();
    });

    test('Verify user can add many products to the cart', async ({ page }) => {
		const products = [PRODUCT_NAMES.SAUCE_LABS_BACKPACK,
			PRODUCT_NAMES.SAUCE_LABS_BIKE_LIGHT,
			PRODUCT_NAMES.SAUCE_LABS_BOLT_T_SHIRT
		];

		for (const product of products) {
			await productsPage.addToCart(product);
        }

        await productsPage.redirectToCart();
        await expect(productsPage.shoppingCartBadge, `Cart badge should show: ${products.length}`).toHaveText(products.length.toString());
        await expect(page, "The user should redirect to the cart page.").toHaveURL(/.*cart\.html/);

        for (const product of products) {
			await expect(cartPage.itemInCart.filter({ hasText: product }), `${product} should be visible in the cart.`).toBeVisible();
        }

        await expect(cartPage.itemInCart, `The added item number should be: ${products.length}`).toHaveCount(products.length);
    });

	test("Verify user can add and remove any number of products", async ({ page }) => {
		const products = [PRODUCT_NAMES.SAUCE_LABS_BACKPACK,
			PRODUCT_NAMES.SAUCE_LABS_BIKE_LIGHT,
        ];

        const removeItem = products[1];
        const addItem = PRODUCT_NAMES.SAUCE_LABS_BOLT_T_SHIRT;
        let cartItemCount = 0;

        for (const product of products) {
			await productsPage.addToCart(product);
            cartItemCount++;
            await expect(productsPage.shoppingCartBadge, `Cart badge should show: ${cartItemCount}`).toHaveText(cartItemCount.toString());
        }

        await productsPage.redirectToCart();
        await expect(page, "User should be on the cart page").toHaveURL(/.*cart\.html/);

        for(const product of products) {
			await expect(cartPage.itemInCart.filter({ hasText: product }), `The following product should be added in the cart: ${product}`).toBeVisible();
        }
		await expect(cartPage.itemInCart, `Cart should have the following number of items: ${cartItemCount}`).toHaveCount(cartItemCount);

        await cartPage.removeFromCart(removeItem);
        cartItemCount--;

        await expect(cartPage.itemInCart.filter({ hasText: products[0] }), `The following product should be in the cart: ${products[0]}`).toBeVisible();
        await expect(cartPage.itemInCart.filter({ hasText: removeItem }), `The following product should NOT be in the cart: ${products[1]}`).not.toBeVisible();
        await expect(productsPage.shoppingCartBadge, `Cart badge should show: ${cartItemCount}`).toHaveText(cartItemCount.toString());

        await cartPage.continueShopping();
        await expect(page, "User should navigate back to the inventory page").toHaveURL(/.*inventory\.html/);

        await productsPage.addToCart(addItem);
        cartItemCount++;
        await expect(productsPage.shoppingCartBadge, `Cart badge should show: ${cartItemCount}`).toHaveText(cartItemCount.toString());

        await productsPage.redirectToCart();
        await expect(page, "User should be on the cart page.").toHaveURL(/.*cart\.html/);

        await expect(cartPage.itemInCart.filter({ hasText: products[0] }), `The following product should be in the cart: ${products[0]}`).toBeVisible();
        await expect(cartPage.itemInCart.filter({ hasText: addItem }), `The following product should be in the cart: ${addItem}`).toBeVisible();
        await expect(cartPage.itemInCart, `Cart badge should show:  ${cartItemCount}`).toHaveCount(cartItemCount);
    });
});