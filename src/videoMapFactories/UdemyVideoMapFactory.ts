import ConstantsMap from '../Constants';
// @ts-ignore
import { Page } from 'puppeteer';
import { IIndexable, StringArrayPromise, TitleArrayFactory, UrlArrayFactory } from '@typings';

class UdemyVideoMapFactory {
  constructor(private page: Page) {}

  private prepareUrls: UrlArrayFactory = (elems: IIndexable) => {
    return Object.keys(elems).map(elem => (elems[elem] as Element).getAttribute('href'));
  };

  private prepareTitles: TitleArrayFactory = (elems: IIndexable) => {
    return Object.keys(elems).map(elem => (elems[elem] as Element).textContent);
  };

  private urlFactory: StringArrayPromise = () =>
    this.page.$$eval(Symbol.keyFor(ConstantsMap.CourseHunters.COURSE_SCRAPER_URL_SELECTOR), this.prepareUrls);

  private titleFactory: StringArrayPromise = () =>
    this.page.$$eval(Symbol.keyFor(ConstantsMap.CourseHunters.COURSE_SCRAPER_TITLE_SELECTOR), this.prepareTitles);

  getVideoMap: () => Promise<{}> = async () => {
    const urls: IIndexable | void = await this.urlFactory();
    const titles: IIndexable | void = await this.titleFactory();
    const videoMap: IIndexable = {};
    if (urls && Object.keys(urls).length > 0) {
      Object.keys(urls).forEach(key => {
        // console.log("url, index", [key, urls[key]]);
        videoMap[parseInt(key)] = {
          url: ''
        };
        videoMap[parseInt(key)].url = urls[key];
      });
    }
    if (titles && Object.keys(titles).length > 0) {
      Object.keys(titles).forEach(key => {
        // console.log("title, index", [key, titles[key]]);
        videoMap[parseInt(key)] = {
          title: '',
          url: videoMap[parseInt(key)].url
        };
        videoMap[parseInt(key)].title = titles[key];
      });
    }
    return videoMap;
  };
}
export default UdemyVideoMapFactory;
