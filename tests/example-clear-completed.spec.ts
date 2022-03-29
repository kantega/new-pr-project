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


test.describe('Clear completed button', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
  });

  test('should display the correct text', async ({ page }) => {
    await page.locator('.todo-list li .toggle').first().check();
    await expect(page.locator('.clear-completed')).toHaveText('Clear completed');
  });

  test('should remove completed items when clicked', async ({ page }) => {
    const todoItems = page.locator('.todo-list li');
    await todoItems.nth(1).locator('.toggle').check();
    await page.locator('.clear-completed').click();
    await expect(todoItems).toHaveCount(2);
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test('should be hidden when there are no items that are completed', async ({ page }) => {
    await page.locator('.todo-list li .toggle').first().check();
    await page.locator('.clear-completed').click();
    await expect(page.locator('.clear-completed')).toBeHidden();
  });
});
