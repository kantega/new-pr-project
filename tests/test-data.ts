import {Page} from "@playwright/test";

export const appUrl:string = 'https://demo.playwright.dev/todomvc'
export const TODO_ITEMS = [
    'buy some cheese',
    'feed the cat',
    'book a doctors appointment'
];

export async function createDefaultTodos(page: Page) {
    for (const item of TODO_ITEMS) {
        await page.locator('.new-todo').fill(item);
        await page.locator('.new-todo').press('Enter');
    }
}

export async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
    return await page.waitForFunction(e => {
        return JSON.parse(localStorage['react-todos']).length === e;
    }, expected);
}

export async function checkNumberOfCompletedTodosInLocalStorage(page: Page, expected: number) {
    return await page.waitForFunction(e => {
        return JSON.parse(localStorage['react-todos']).filter(i => i.completed).length === e;
    }, expected);
}

export async function checkTodosInLocalStorage(page: Page, title: string) {
    return await page.waitForFunction(t => {
        return JSON.parse(localStorage['react-todos']).map(i => i.title).includes(t);
    }, title);
}
