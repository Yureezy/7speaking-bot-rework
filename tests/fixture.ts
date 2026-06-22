import fs from 'node:fs';
import path from 'node:path';
import { test as base, chromium, type BrowserContext } from "@playwright/test";

export const test = base.extend<{
    context: BrowserContext;
    extensionId: string;
}>({
    // eslint-disable-next-line no-empty-pattern
    context: async ({}, use) => {
        const pathToExtension = path.join(__dirname, '..', 'build', 'chrome-mv3-dev');
        const authFile = path.join(__dirname, '../playwright/.auth/user.json');
        const context = await chromium.launchPersistentContext('', {
            channel: 'chromium',
            args: [
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
            ],
        });
        const storageState = JSON.parse(fs.readFileSync(authFile, 'utf8'));
        if (storageState.cookies) {
            await context.addCookies(storageState.cookies);
        }
        if (storageState.origins) {
            for (const { origin, localStorage } of storageState.origins) {
                const page = await context.newPage();
                await page.goto(origin);
                await page.evaluate((items) => {
                    for (const { name, value } of items) {
                      globalThis.localStorage.setItem(name, value)
                    }
                }, localStorage || []);
                await page.close();
            }
        }
        await use(context);
        await context.close();
    },
    page: async ({ context }, use) => {
        const page = await context.newPage();
        await use(page);
        await page.close();
    },
    extensionId: async ({ context }, use) => {
        let [serviceWorker] = context.serviceWorkers();
        if (!serviceWorker) {
            serviceWorker = await context.waitForEvent('serviceworker');
        }
        const extensionId = serviceWorker.url().split('/')[2];
        await use(extensionId);
    },
});

export const expect = test.expect;