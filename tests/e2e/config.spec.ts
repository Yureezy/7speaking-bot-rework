import { test, expect } from './fixture';

test('extension is loaded on website', async ({ page }) => {
  await page.goto('https://user.7speaking.com/');

  await expect(page.locator('#plasmo-overlay-0 > *')).toBeVisible();
});

test('extension is not loaded outside', async ({ page }) => {
  await page.goto('https://7speaking.com/');

  await expect(page.locator('#plasmo-overlay-0 > *')).not.toBeVisible();
});