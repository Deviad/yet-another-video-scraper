// @ts-ignore
import { Browser, Page } from 'puppeteer';
class PageBuilder {
  private browser: Browser;
  private page: Page;

  constructor(browser: Browser) {
    this.browser = browser;
    this.page = null;
  }

  async build(): Promise<Page> {
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1400, height: 800 });
    return this.page;
  }
}

export default PageBuilder;
