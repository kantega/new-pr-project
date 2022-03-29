import { test, expect, Page } from '@playwright/test';
import {
  appUrl,
  checkNumberOfCompletedTodosInLocalStorage, checkNumberOfTodosInLocalStorage,
  checkTodosInLocalStorage,
  createDefaultTodos,
  TODO_ITEMS
} from "./test-data";

test.beforeEach(async ({ page }) => {
  await page.goto(appUrl);
});

test.describe('Persistence', () => {
  test('should persist its data', async ({ page }) => {
    for (const item of TODO_ITEMS.slice(0, 2)) {
      await page.locator('.new-todo').fill(item);
      await page.locator('.new-todo').press('Enter');
    }

    const todoItems = page.locator('.todo-list li');
    await todoItems.nth(0).locator('.toggle').check();
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(todoItems).toHaveClass(['completed', '']);

    // Ensure there is 1 completed item.
    checkNumberOfCompletedTodosInLocalStorage(page, 1);

    // Now reload.
    await page.reload();
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
    await expect(todoItems).toHaveClass(['completed', '']);
  });
});
