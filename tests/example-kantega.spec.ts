import { test, expect, Page } from '@playwright/test';


test.describe('Kantega is the best company', () => {
  test('should be found by Google as first hit', async ({ page }) => {
    await page.goto("https://www.google.com/");

    // Click button:has-text("I agree")
    await Promise.all([
      page.waitForNavigation(/*{ url: 'https://www.google.com/' }*/),
      //page.locator('button:text-matches("Godta","i")').click()
        page.locator('text=/(Godta)|(I agree)/').click()
    ]);

    await page.fill('input[type=text]', 'kantega');

    // Press Enter
    await Promise.all([
      page.waitForNavigation(/*{ url: 'https://www.google.com/search?q=fiskeridirektoratet&source=hp&ei=6uyUYczRGMmExc8PgpKZiAE&iflsig=ALs-wAMAAAAAYZT6-v5CJFd3Mu4JJy_d2i98EZWlQRi0&oq=kantega&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUILhCABDIFCAAQgAQyBQgAEIAEOgsILhCABBDHARDRAzoLCC4QgAQQxwEQowI6CwguEIAEEMcBEK8BOgcILhCABBAKOgcIABCABBAKUMgLWKUaYPolaAFwAHgAgAGdAYgBjgWSAQM1LjKYAQCgAQGwAQA&sclient=gws-wiz&ved=0ahUKEwjM7q7gqp_0AhVJQvEDHQJJBhEQ4dUDCAc&uact=5' }*/),
      page.press('input[type=text]', 'Enter')
    ]);

    await page.waitForLoadState("domcontentloaded");

    let firstSearchResult = await page.locator('#rso > div >> nth=0');
    await expect(firstSearchResult).toContainText('https://www.kantega.no');

  });
});
