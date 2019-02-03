import { Page } from 'puppeteer';
import { Constructor } from '@typings';

function GenericScrapingService<IGenericScrapingService extends Constructor>(Base: IGenericScrapingService) {
  return class extends Base {
    private readonly page: Page;
  };
}
