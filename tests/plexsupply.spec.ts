import { test, expect } from '@playwright/test';
import { urls } from '../data/urlData';
import { categories } from '../data/categories'
import { filters } from '../data/filters';
import { PlexsupplyCheckotPage } from '../src/PlexsupplyCheckoutPage';
import { PlexsupplyHomePage } from '../src/PlexsupplyHomePage';
import { PlexsupplyCategoryPage } from '../src/PlexsupplyCategoryPage';


test('Remove single item from checkout page B-004', async ({ page }) => {
  // Better start directly from product page
  await page.goto(urls.exampleProductPage1);
  await page.locator('#product-addtocart-button').click();
  const checkotPage = new PlexsupplyCheckotPage(page);
  await checkotPage.openPage();
  await page.waitForLoadState('load'); 
  await checkotPage.removeSingleOrderItem();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.locator('.cart-empty')).toContainText('You have no items in your shopping cart.');
});

test('Check change shipping cost', async ({ page }) => {
  await page.goto(urls.exampleProductPage1);
  await page.waitForLoadState('load'); 

  await page.locator('#product-addtocart-button').click();
  const checkotPage = new PlexsupplyCheckotPage(page);
  await checkotPage.openPage();
  const closeElements1 = await page.locator('.close-message');

  if (await closeElements1.count() > 0) {
    await closeElements1.first().click();
  }
  await page.waitForLoadState('load'); 
  await checkotPage.setCountrySelectValue('US');
  await checkotPage.submitCookie();
  await checkotPage.setStateSelectValue('1');
  let shippingPrice1: number = await checkotPage.getShippingCost();
  await page.goto(urls.exampleProductPage2);
  await page.waitForLoadState('load'); 
  const closeElements2 = await page.locator('.close-message');

  if (await closeElements2.count() > 0) {
    await closeElements2.first().click();
  }
  await page.locator('#product-addtocart-button').click();
  await checkotPage.openPage();
  await page.waitForLoadState('load'); 
  let shippingPrice2: number = await checkotPage.getShippingCost();
  await expect(shippingPrice1).not.toEqual(shippingPrice2);
  
});

