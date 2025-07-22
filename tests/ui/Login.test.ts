import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { ProductsPage } from "../../pages/ProductsPage";
import { USERS, ERROR_MESSAGES } from "../../data/testData";

test.describe.parallel("Login Functionality", () => {
	let loginPage: LoginPage;
	let productsPage: ProductsPage;

	test.beforeEach(async ({ page }) => {
		loginPage = new LoginPage(page);
		productsPage = new ProductsPage(page);
        await loginPage.goto();
    });

    test("Verify standard user logs in successfully", async () => {
		await loginPage.submitLoginForm(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
        await expect(productsPage.inventoryList, "User logs in and redirects to the inventory page.").toBeVisible();
        expect(await productsPage.isInventoryListVisible(), "The inventory url should include '/inventory'").toEqual(true);
        await expect(await productsPage.existBrokenImages(), "For Standard user, inventory list should NOT display broken product images.").toBeFalsy();
    });

    test("Verify locked out users cannot login", async ({ page }) => {
		await loginPage.submitLoginForm(USERS.LOCKED_OUT_USER.username, USERS.LOCKED_OUT_USER.password);
        await loginPage.expectedErrorMessage(ERROR_MESSAGES.LOCKED_OUT);
        await expect(productsPage.inventoryList, "The inventory list is not visible for a locked out user.").not.toBeVisible();
        await expect(page, "The user remains on the login page.").toHaveURL("/");
    });

    test("Verify problem user logs in successfully", async () => {
		await loginPage.submitLoginForm(USERS.PROBLEM_USER.username, USERS.PROBLEM_USER.password);
        await expect(productsPage.inventoryList, "User logs in and redirects to the inventory page.").toBeVisible();
        expect(await productsPage.isInventoryListVisible(), "The inventory url should include '/inventory'").toEqual(true);
        await expect(await productsPage.existBrokenImages(), "Broken product images are provided for problem user.").toBeTruthy();
    });

	test("Verify performance glitch user logs in successfully", async ({ page }) => {
		const standardUserLoginTime = await loginPage.measureLoginTime(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);

        await productsPage.logout();
        await expect(page).toHaveURL("https://www.saucedemo.com/");

        const performanceGlitchLoginTime = await loginPage.measureLoginTime(USERS.PERFORMANCE_GLITCH_USER.username, USERS.PERFORMANCE_GLITCH_USER.password);
        const minimumDelay = 2000;
        const minimumDelayMultiplier = 2.0;

        await expect(performanceGlitchLoginTime,
            `Performance Glitch User login (${performanceGlitchLoginTime}ms) should be slower than ${minimumDelay}ms.`)
            .toBeGreaterThan(minimumDelay);

        await expect(performanceGlitchLoginTime,
            `Performance Glitch User login (${performanceGlitchLoginTime}ms) should be at least ${minimumDelayMultiplier}x slower than Standard User (${standardUserLoginTime}ms).`)
            .toBeGreaterThan(standardUserLoginTime * minimumDelayMultiplier);

        await expect(productsPage.inventoryList, "User logs in and redirects to the inventory page.").toBeVisible();
        expect(await productsPage.isInventoryListVisible(), "The inventory url should include '/inventory'").toEqual(true);
    });

	test("Verify error user logs in successfully", async ({ page }) => {
		let errorMessages: string[] = [];

		//Any error which will appear in the browser's console with type 'error' will be added in the array.
        page.on('console', msg => {
			if (msg.type() === 'error') {
				errorMessages.push(msg.text());
			}
		});

		//User logs in and redirects to Inventory List page.
        await loginPage.submitLoginForm(USERS.ERROR_USER.username, USERS.ERROR_USER.password);
        await expect(productsPage.inventoryList, "User logs in and redirects to the inventory page.").toBeVisible();
        await expect(await productsPage.isInventoryListVisible(), "The inventory URL should include '/inventory'.").toBeTruthy();

        let expectedError = false;
        const expectedErrorMessage = "Failed to load resource: the server responded with a status of 401 (Unauthorized)";
        await page.waitForTimeout(7000);
        await expect(errorMessages.length, "At least one console error is added in the array.").toBeGreaterThan(0);

        //Verify the expectedErrorMessage is provided (401 (Unauthorized) error appears).
        const check = errorMessages.some(msg => msg.includes(expectedErrorMessage));
        expect(check, "Check that the console error message appears.").toEqual(true);
    });

	test("Verify visual user logs in successfully", async ({ page }) => {
		await loginPage.submitLoginForm(USERS.VISUAL_USER.username, USERS.VISUAL_USER.password);
        await expect(productsPage.inventoryList, "User logs in and redirects to the inventory page.").toBeVisible();
        expect(await productsPage.isInventoryListVisible(), "The inventory url should include '/inventory'").toEqual(true);
        await expect(await productsPage.existBrokenImages(), "For Visual user, inventory list should display broken product images.").toBeTruthy();
        await page.screenshot({ path: `screenshots/visual_user_products_page.png`});
    });

	test("Verify an error message appears when username and password fields are empty", async ({ page }) => {
		await loginPage.submitLoginForm("","");
        await loginPage.expectedErrorMessage(ERROR_MESSAGES.USERNAME_REQUIRED);
        await expect(productsPage.inventoryList, "The inventory list is not visible.").not.toBeVisible();
        await expect(page, "The user remains on the login page.").toHaveURL("/");
    });

    test("Verify an error message appears when username field is empty", async ({ page }) => {
		await loginPage.submitLoginForm("", USERS.STANDARD_USER.password);
        await loginPage.expectedErrorMessage(ERROR_MESSAGES.USERNAME_REQUIRED);
        await expect(productsPage.inventoryList, "The inventory list is not visible.").not.toBeVisible();
        await expect(page, "The user remains on the login page.").toHaveURL("/");
    });

    test("Verify an error message appears when password field is empty", async ({ page }) => {
        await loginPage.submitLoginForm(USERS.STANDARD_USER.username, "");
        await loginPage.expectedErrorMessage(ERROR_MESSAGES.PASSWORD_REQUIRED);
        await expect(productsPage.inventoryList, "The inventory list is not visible.").not.toBeVisible();
        await expect(page, "The user remains on the login page.").toHaveURL("/");
    });

    test("Verify an error message appears when providing invalid credentials", async ({ page }) => {
        await loginPage.submitLoginForm("invalid_user", "wrong_password");
        await loginPage.expectedErrorMessage(ERROR_MESSAGES.EPIC_SADFACE);
        await expect(productsPage.inventoryList, "The inventory list is not visible.").not.toBeVisible();
        await expect(page, "The user remains on the login page.").toHaveURL("/");
    });

    test("Verify an error message appears when providing an invalid username", async ({ page }) => {
        await loginPage.submitLoginForm("invalid_user", USERS.STANDARD_USER.password);
        await loginPage.expectedErrorMessage(ERROR_MESSAGES.EPIC_SADFACE);
        await expect(productsPage.inventoryList, "The inventory list is not visible.").not.toBeVisible();
        await expect(page, "The user remains on the login page.").toHaveURL("/");
    });

    test("Verify an error message appears when providing an invalid password", async ({ page }) => {
        await loginPage.submitLoginForm(USERS.STANDARD_USER.username, "wrong_password");
        await loginPage.expectedErrorMessage(ERROR_MESSAGES.EPIC_SADFACE);
        await expect(productsPage.inventoryList, "The inventory list is not visible.").not.toBeVisible();
        await expect(page, "The user remains on the login page.").toHaveURL("/");
    });

    test("Verify an error message appears when providing spaces in username and password fields", async ({ page }) => {
        await loginPage.submitLoginForm(" ", " ");
        await loginPage.expectedErrorMessage(ERROR_MESSAGES.EPIC_SADFACE);
        await expect(productsPage.inventoryList, "The inventory list is not visible.").not.toBeVisible();
        await expect(page, "The user remains on the login page.").toHaveURL("/");
    });

    test('Verify an error message appears when trying an SQL injection', async ({ page }) => {
        await loginPage.submitLoginForm("' OR 1=1 --", "' OR 1=1 --");
        await loginPage.expectedErrorMessage(ERROR_MESSAGES.EPIC_SADFACE);
        await expect(productsPage.inventoryList, "The inventory list is not visible.").not.toBeVisible();
        await expect(page, "The user remains on the login page.").toHaveURL("/");
    });

    test("Verify the password field type is 'password'", async () => {
        expect(await loginPage.passwordInput.getAttribute("type"), "Verify the input type is: password").toEqual("password");
    });
});