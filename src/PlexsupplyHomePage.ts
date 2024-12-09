import { expect, Page, Locator } from '@playwright/test';
import { urls } from '../data/urlData';
import { BasePage } from './BasePage';

/**
 * Page for plexsupply.com home page
 */
export class PlexsupplyHomePage extends BasePage {

    protected readonly url: string = urls.homePage;

}
