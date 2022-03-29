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

test.describe('Editing', () => {
  test.beforeEach(async ({ page }) => {
    await createDefaultTodos(page);
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('should hide other controls when editing', async ({ page }) => {
    const todoItem = page.locator('.todo-list li').nth(1);
    await todoItem.dblclick();
    await expect(todoItem.locator('.toggle')).not.toBeVisible();
    await expect(todoItem.locator('label')).not.toBeVisible();
    await checkNumberOfTodosInLocalStorage(page, 3);
  });

  test('should save edits on blur', async ({ page }) => {
    const todoItems = page.locator('.todo-list li');
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).locator('.edit').fill('buy some sausages');
    await todoItems.nth(1).locator('.edit').dispatchEvent('blur');

    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      'buy some sausages',
      TODO_ITEMS[2],
    ]);
    await checkTodosInLocalStorage(page, 'buy some sausages');
  });

  test('should trim entered text', async ({ page }) => {
    const todoItems = page.locator('.todo-list li');
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).locator('.edit').fill('    buy some sausages    ');
    await todoItems.nth(1).locator('.edit').press('Enter');

    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      'buy some sausages',
      TODO_ITEMS[2],
    ]);
    await checkTodosInLocalStorage(page, 'buy some sausages');
  });

  test('should remove the item if an empty text string was entered', async ({ page }) => {
    const todoItems = page.locator('.todo-list li');
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).locator('.edit').fill('');
    await todoItems.nth(1).locator('.edit').press('Enter');

    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[2],
    ]);
  });

  test('should cancel edits on escape', async ({ page }) => {
    const todoItems = page.locator('.todo-list li');
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).locator('.edit').press('Escape');
    await expect(todoItems).toHaveText(TODO_ITEMS);
  });
});
