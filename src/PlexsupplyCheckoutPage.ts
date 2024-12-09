import { expect, Page, Locator } from '@playwright/test';
import { urls } from '../data/urlData';
import { BasePage } from './BasePage';

/**
 * Page for plexsupply.com home page
 */
export class PlexsupplyCheckotPage extends BasePage {

    protected readonly url: string = urls.checkout;
    protected readonly deleteBtn: string = '.product > .delete';
    protected readonly submitItemRemoveBtn: string = '.action-accept';
    protected readonly emptyCartMessage: string = '.cart-empty';
    protected readonly shippngTotal: string = 'span[data-th="Shipping"]';
    protected readonly countrySelect: string = 'div[name="shippingAddress.country_id"] [name="country_id"]';
    protected readonly stateSelect: string = 'div[name="shippingAddress.region_id"] [name="region_id"]';

    /**
     * Remove single order item on checkout page.
     */
    public async removeSingleOrderItem() {
        this.page.setDefaultTimeout(30000);
        await this.page.locator(this.deleteBtn).click();
        // await this.page.locator(this.submitItemRemoveBtn).click();
    }

    /**
     * Set value in state/region select input
     * @param region 
     */
    public async setStateSelectValue(region: string) {
        await this.page.waitForSelector(this.stateSelect, { state: 'visible', timeout: 10000 });
        await this.page.locator(this.stateSelect).isEditable()

        await this.page.selectOption(this.stateSelect, region);
    }

    /**
     * Set value in country select input
     * @param region 
     */
    public async setCountrySelectValue(countryCode: string) {
        await this.page.waitForSelector(this.countrySelect, { state: 'visible', timeout: 10000 });
        await this.page.locator(this.countrySelect).scrollIntoViewIfNeeded();
        await this.page.locator(this.countrySelect).isEditable()


        await this.page.selectOption(this.countrySelect, countryCode);
    }

    /**
     * Get total shipping cost
     * 
     * @returns 
     */
    public async getShippingCost(): Promise<number> {
        // await this.page.locator(this.shippngTotal).scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(4000);
        let shippingTotalLocator = this.page.locator(this.shippngTotal);
        let shippingCostText = await shippingTotalLocator.textContent();
        let shippingCost = 0;
        if (null != shippingCostText) {
            shippingCost = parseFloat(shippingCostText.replace('$', '').trim());
        }

        return shippingCost;
    }
}