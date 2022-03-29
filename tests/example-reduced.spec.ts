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

test.describe('New Todo, Complete marks, Items', () => {
  test('should allow me to add todo items', async ({ page }) => {
    // Create 1st todo.
    await page.locator('.new-todo').fill(TODO_ITEMS[0]);
    await page.locator('.new-todo').press('Enter');

    // Make sure the list only has one todo item.
    await expect(page.locator('.view label')).toHaveText([
      TODO_ITEMS[0]
    ]);

    await expect(page.locator('.new-todo'), 'should clear text input field when an item is added').toBeEmpty();

    await expect(page.locator('.main')).toBeVisible();
    await expect(page.locator('.footer')).toBeVisible();
    await checkNumberOfTodosInLocalStorage(page, 1);

    // Create 2nd todo.
    await page.locator('.new-todo').fill(TODO_ITEMS[1]);
    await page.locator('.new-todo').press('Enter');

    // Create 3rd todo.
    await page.locator('.new-todo').fill(TODO_ITEMS[2]);
    await page.locator('.new-todo').press('Enter');

    // Make sure the list now has two todo items.
    await expect(page.locator('.view label >> nth=2')).toHaveText(TODO_ITEMS[2]
    );

    // Check all items in one call.
    await expect(page.locator('.view label')).toHaveText(TODO_ITEMS);
    await checkNumberOfTodosInLocalStorage(page, 3);

    // Check test using different methods.
    await expect(page.locator('.todo-count')).toHaveText('3 items left');
    await expect(page.locator('.todo-count')).toContainText('3');
    await expect(page.locator('.todo-count')).toHaveText(/3/);

    // Complete all todos.
    const toggleAll = page.locator('.toggle-all');
    await toggleAll.check();

    // Ensure all todos have 'completed' class.
    await expect(page.locator('.todo-list li'),'should allow me to mark all items as completed').toHaveClass(['completed', 'completed', 'completed']);
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    await toggleAll.uncheck();
    // Should be no completed classes.
    await expect(page.locator('.todo-list li'),'should allow me to clear the complete state of all items').toHaveClass(['', '', '']);

    await toggleAll.check();
    await expect(toggleAll).toBeChecked();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    // Uncheck first todo.
    const firstTodo = page.locator('.todo-list li').nth(0);
    await firstTodo.locator('.toggle').uncheck();

    // Reuse toggleAll locator and make sure its not checked.
    await expect(toggleAll).not.toBeChecked();

    await firstTodo.locator('.toggle').check();
    await checkNumberOfCompletedTodosInLocalStorage(page, 3);

    // Assert the toggle all is checked again.
    await expect(toggleAll).toBeChecked();

    // Check Items
    await toggleAll.uncheck();

    await firstTodo.locator('.toggle').check();
    await expect(firstTodo, 'should allow me to mark items as complete').toHaveClass('completed');

    // Check second item.
    const secondTodo = page.locator('.todo-list li').nth(1);
    await expect(secondTodo).not.toHaveClass('completed');
    await secondTodo.locator('.toggle').check();
    await expect(secondTodo).toHaveClass('completed');

    await firstTodo.locator('.toggle').check();
    await expect(firstTodo).toHaveClass('completed');
    await checkNumberOfCompletedTodosInLocalStorage(page, 2);

    await firstTodo.locator('.toggle').uncheck();
    await expect(firstTodo,'should allow me to un-mark items as complete').not.toHaveClass('completed');

    await checkNumberOfCompletedTodosInLocalStorage(page, 1);


    const todoItems = page.locator('.todo-list li');

    await secondTodo.dblclick();
    await expect(secondTodo.locator('.edit')).toHaveValue(TODO_ITEMS[1]);
    await secondTodo.locator('.edit').fill('buy some sausages');
    await secondTodo.locator('.edit').press('Enter');

    // Explicitly assert the new text value.
    await expect(todoItems).toHaveText([
      TODO_ITEMS[0],
      'buy some sausages',
      TODO_ITEMS[2]
    ]);
    await checkTodosInLocalStorage(page, 'buy some sausages');
  });
});
