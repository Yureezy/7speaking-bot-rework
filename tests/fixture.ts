import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
export const test = base.extend<{
    context: BrowserContext;
    extensionId: string;
}>({
    context: async ({}, use) => {
        // The extension build is located at the repository root `build/chrome-mv3-dev`.
        // __dirname is the `tests` directory, so go up one level.
        const pathToExtension = path.join(__dirname, '..', 'build', 'chrome-mv3-dev');
        const authFile = path.join(__dirname, '../playwright/.auth/user.json');
        console.log(pathToExtension)
        const context = await chromium.launchPersistentContext('', {
            channel: 'chromium',
            args: [
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
            ],
            storageState: authFile,
        });
        await use(context);
        await context.close();
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