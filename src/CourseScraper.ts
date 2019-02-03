import ScrapingServiceDirector from './scrapingServices/ScrapingServiceDirector';
import { Browser } from 'puppeteer';
import PageBuilder from './PageBuilder';
import { botCheckBypass } from './utils';
import ScrapingServiceFactory from './scrapingServices/ScrapingServiceFactory';
import { IInputParams } from '@typings';

class CourseScraper {
  private readonly browser: Browser;
  private readonly iParams: IInputParams;

  constructor(browser?: Browser, iParams?: IInputParams) {
    this.browser = browser;
    this.iParams = iParams;
  }

  public async scrape(): Promise<void> {
    try {
      const { url = null, username = null, password = null } = this.iParams;

      const page = await new PageBuilder(this.browser).build();

      const scSrvFactory = new ScrapingServiceFactory(url, username, password, page);
      await botCheckBypass(page);
      const scrapServ = new ScrapingServiceDirector({
        instance: scSrvFactory.build()
      });
      await scrapServ.init();
      await this.browser.close();
    } catch (err) {
      throw err;
    }
  }
}

export default CourseScraper;
