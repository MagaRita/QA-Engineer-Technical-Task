import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: '.',
    timeout: 30 * 1000,
    workers: 4,
    reporter: [
		['list'],
        ['allure-playwright', { outputFolder: 'allure-results-api' }],
    ],
    use: {
        headless: false,
        launchOptions: {
              slowMo: 1500,
        },
        actionTimeout: 10_000,
        navigationTimeout: 20_000,
        baseURL: 'https://www.saucedemo.com',
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    }
});