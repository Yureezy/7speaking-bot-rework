import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {

    const username = process.env.website_test_username;
    const password = process.env.website_test_password;

    // Perform authentication steps. Replace these actions with your own.
    await page.goto('https://user.7speaking.com/login');
    await page.getByRole('textbox',{ name: "username"}).fill(username);
    await page.getByRole('textbox',{name:"password"}).fill(password);
    await page.locator('button.login__submit__button','button').click();
    // Wait until the page receives the cookies.
    //
    // Sometimes login flow sets cookies in the process of several redirects.
    // Wait for the final URL to ensure that the cookies are actually set.
    await page.waitForURL('https://user.7speaking.com/home');
    // Alternatively, you can wait until the page reaches a state where all cookies are set.
    await expect(page.locator('img[alt="user avatar"]')).toBeVisible();

    // End of authentication steps.

    await page.context().storageState({ path: authFile });
});