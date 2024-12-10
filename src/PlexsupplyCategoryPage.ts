import { expect, Page, Locator } from '@playwright/test';
import { urls } from '../data/urlData';
import { BasePage } from './BasePage';

/**
 * Page for plexsupply.com home page
 */
export class PlexsupplyCategoryPage extends BasePage {

    protected readonly cookieBtn: string = '#btn-cookie-allow';
    protected readonly categoryTitle: string = '//*[@id="page-title-heading"]/span';
    protected readonly closeCartMessageButton: string = '.close-message';
    protected readonly addToCartBtn: string = 'button[title="Add to Cart"]';
    protected readonly priceSlider: string = '.smile-es-range-slider > .ui-slider';
    protected readonly submitPriceFilterBtn: string = 'a.action.primary.small';
    protected readonly productQty: string = 'p.toolbar-amount > span.toolbar-number';
    protected readonly displayedProductCard: string = 'main li.item.product.product-item';
    protected readonly productCardFinalPrice: string = 'main li.item.product.product-item';
    protected readonly filterFromPrice: string = '.smile-es-range-slider div[data-role="from-label"]';
    protected readonly filterToPrice: string = '.smile-es-range-slider div[data-role="to-label"]';


    protected readonly url: string = '';

    /**
     * Add first product to shopping cart from category
     */
    public async addFirstProductToShoppingCart() {
        await this.page.locator(this.addToCartBtn).click();
        let cartMsg = await this.page.locator(this.closeCartMessageButton);
        if (await this.page.locator(this.closeCartMessageButton).isVisible()) {
            this.page.locator(this.closeCartMessageButton).click();
        }
    }

    /**
     * Set price filter on category or search result page
     * 
     * @param minPercent 
     */
    public async setPriceFilter(minPercent: number) {
        await this.page.waitForSelector(this.priceSlider, { state: 'visible', timeout: 10000  });
        const slider = await this.page.locator('.smile-es-range-slider > .ui-slider');
        await this.page.locator('.smile-es-range-slider > .ui-slider').isVisible();

        const sliderOffsetWidth = await slider.evaluate(el => {
            return el.getBoundingClientRect().width
        })
        const selectedRange = (sliderOffsetWidth / 100) * (100 - minPercent);
        await slider.hover({ force: true, position: { x: 0, y: 0 } });
        await this.page.mouse.down();
        await slider.hover({ force: true, position: { x: sliderOffsetWidth - selectedRange, y: 0 } });
        await this.page.mouse.up();
        await this.page.locator(this.submitPriceFilterBtn).click();
    }

    /**
     * Use filter on category or search result page
     * 
     * @param filterName 
     */
    public async useFilter(filterName: string) {
        let filterSelector = "//span[text()='" + filterName + "']";
        // await this.page.locator(filterSelector).waitFor({ state: 'visible' }); 
        this.page.locator(filterSelector).click();
    }

    /**
     * Get qty of products in category from displayed qty number
     * 
     * @returns 
     */
    public async getCategoryProductsQty(): Promise<number> {
        let qtyNumber = await this.page.locator(this.productQty);
        let qtyText = await qtyNumber.textContent();

        return parseInt(qtyText || '0');
    }

    /**
     * Get qty of products in category by displayed product cards
     * 
     * @returns 
     */
    public async getDisplayedCategoryProducts(): Promise<number> {
        const productCards = await this.page.locator(this.displayedProductCard);
        return await productCards.count();
    }

    /**
     * Check results of search by price action
     * 
     */
    public async checkResultsOfPriceSearch() {
        let fromPriceText = await this.page.locator(this.filterFromPrice).innerText(); 
        let fromPrice = parseFloat(fromPriceText.replace("$", ""));
        let toPriceText = await this.page.locator(this.filterToPrice).innerText();
        let toPrice = parseFloat(toPriceText.replace("$", ""));
        let priceElements = await this.page.locator(this.productCardFinalPrice).allTextContents();

        for (const priceText of priceElements) {
            let regularPrice = priceText.match(/\$\d+\.\d+/);
            if (null != regularPrice) {
                let price = regularPrice[0];
                const cleanPriceText = price.replace("$", "");
                const currentTruePrice = parseFloat(cleanPriceText);
                await expect(currentTruePrice).toBeGreaterThanOrEqual(fromPrice);
                await expect(currentTruePrice).toBeLessThanOrEqual(toPrice);
            }
            
        }
    }
}