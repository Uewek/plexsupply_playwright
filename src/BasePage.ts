import { expect, Page, Locator } from '@playwright/test';

/**
 * Base class for all pages
 */
export abstract class BasePage {

    protected readonly page: Page;
    protected readonly cookieBtn: string = '#btn-cookie-allow';
    protected readonly checkoutMiniCartButton: string = '#top-cart-btn-checkout';
    protected readonly shoppingCartBtn: string = '.showcart';
    protected readonly url: string;

    /**
     * Constructor of all pages
     * @param page 
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Open page by url
     */
    public async openPage()
    {
        await this.page.goto(this.url);
        await this.page.goto(this.url, { waitUntil: 'load' });

    }

    /**
     * Get page element selector by page element name
     * 
     * @param selector 
     * @returns 
     */
    public async getPageElementSelector(selector: string)
    // public async getPageElementSelector(selector: string): Promise<string>
    {
        if (selector in this) {
            return (this as any)[selector];
        }
        return '';
    }

    /**
     * Hover on item of navigation menu
     * 
     * @param title 
     */
    public async hoverOnNavItem(title: string) 
    {
        await this.page.getByRole('link', { name: title }).waitFor({ state: 'visible' }); 
        await this.page.getByRole('link', { name: title }).hover();
    }

    /**
     * Open one of categories from header or navigation menu
     * (in real test must be used specially created for test purpose category)
     * 
     * @param title 
     */
    public async openLinkByTitle(title: string)
    {
        await this.page.getByRole('link', { name: title }).waitFor({ state: 'visible' }); 
        await this.page.getByRole('link', { name: title }).click();
    }

    /**
     * Click on accept cookie button
     */
    public async submitCookie()
    {
        await this.page.locator(this.cookieBtn).click();
    }

    /**
     * Expand mini shopping cart on any page
     */
    public async expandShoppingCart()
    {
        await this.page.locator(this.shoppingCartBtn).click();
    } 

    /**
     * Open checkout page from already expanded mini cart
     * Function separated with expandShoppingCart because previous function can be part of assertions
     */
    public async goToCheckoutFromMiniCart()
    {
        await this.page.locator(this.checkoutMiniCartButton).click();
    }
}