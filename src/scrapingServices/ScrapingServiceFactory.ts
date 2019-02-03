import CourseHunterScrapingService from './CourseHunterScrapingService';
import { Page } from 'puppeteer';
import ParamsFactory from '../ParamsFactory';
import container from '../ServiceContainer';
import CourseHunterVideoMapFactory from '../videoMapFactories/CourseHunterVideoMapFactory';
import UdemyScrapingService from './UdemyScrapingService';
import UdemyVideoMapFactory from '../videoMapFactories/UdemyVideoMapFactory';
import { IIndexable, IScrapingService } from '@typings';
class ScrapingServiceFactory {
  constructor(
    private readonly url: String,
    private readonly username: String,
    private readonly password: String,
    private readonly page: Page
  ) {}

  build(): IScrapingService {
    let hostname: string[] = null;
    let classToInstantiate: string = null;

    const pFactoryInstance: ParamsFactory = container.getInstance().getService(ParamsFactory.name);

    if (this.url !== null) {
      if (this.url.indexOf('http://') > -1) {
        hostname = this.url.split('http://');
      }
      if (this.url.indexOf('https://') > -1) {
        hostname = this.url.split('https://');
      }

      if (hostname[hostname.length - 1].indexOf('coursehunters.net') > -1) {
        classToInstantiate = 'CourseHunterScrapingService';
      } else if (hostname[hostname.length - 1].indexOf('udemy.com') > -1) {
        classToInstantiate = 'UdemyScrapingService';
      }
    }
    const classMap: IIndexable = {
      UdemyScrapingService: new UdemyScrapingService(
        pFactoryInstance.init(),
        this.page,
        new UdemyVideoMapFactory(this.page)
      ),
      CourseHunterScrapingService: new CourseHunterScrapingService(
        pFactoryInstance.init(),
        this.page,
        new CourseHunterVideoMapFactory(this.page)
      )
    };
    return <IScrapingService>classMap[classToInstantiate];
  }
}

export default ScrapingServiceFactory;
