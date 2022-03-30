import { test, expect, Page } from '@playwright/test';


test.describe('Kantega is the best company', () => {
  test.only('should be found by Google as first hit', async ({ page }) => {
    await page.goto("https://www.google.com/");

    const agreeButton = await page.$('text=/(Godta)|(I agree)/');
    if(agreeButton){
      await Promise.all([
        page.waitForNavigation(/*{ url: 'https://www.google.com/' }*/),
        //page.locator('button:text-matches("Godta","i")').click()
        page.locator('text=/(Godta)|(I agree)/').click()
      ]);
    }

    await page.fill('input[type=text]', 'kantega');

    // Press Enter
    await Promise.all([
      page.waitForNavigation(),
      page.press('input[type=text]', 'Enter')
    ]);

    await page.waitForLoadState("domcontentloaded");

    let firstSearchResult = await page.locator('#rso > div >> nth=0');
    await expect(firstSearchResult).toContainText('https://www.kantega.no');

  });
});
