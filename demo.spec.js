import { test, expect } from '@playwright/test';

test('Playwright demo test', async ({ page }) => {
  // Go to Playwright official website
  await page.goto('https://playwright.dev/');

  // Check that the title contains "Playwright"
  await expect(page).toHaveTitle(/Playwright/);

  // Click the "Get Started" link
  await page.click('text=Get started');

  // Take a screenshot
  await page.screenshot({ path: 'demo-screenshot.png' });
});
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    video: 'on',  // records every test run
  },
});
