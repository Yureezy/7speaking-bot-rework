import { test, expect } from '../fixture';

test('given on home page when bot on : move to page', async ({ page }) => {
    await page.goto('https://user.7speaking.com/home');

    await page.waitForSelector("div[data-testid^=personal-program-item]");
    await page.getByAltText('start bot').click();

    await page.waitForTimeout(1500);
    expect(page.url()).not.toBe("https://user.7speaking.com/home")
});

test('given on home page when bot off : nothing', async ({ page }) => {
    await page.goto('https://user.7speaking.com/');


    await page.waitForSelector("div[data-testid^=personal-program-item]");

    await page.waitForTimeout(500);
    expect(page.url()).toEqual("https://user.7speaking.com/home")
});