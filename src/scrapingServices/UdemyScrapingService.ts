import { Cookie, Page, Response } from 'puppeteer';
import { isEmpty, flatMap } from 'lodash';
import * as fs from 'fs';
import * as request from 'request';
// @ts-ignore
import * as ProgressBar from 'progress';

import { downloadFolderFactory, sleep, timeFactory } from '@utils';
import UdemyVideoMapFactory from '../videoMapFactories/UdemyVideoMapFactory';
import container from '../ServiceContainer';
import FolderFactory from '../utils/FolderFactory';
import { has } from 'lodash';
import { Downloader, IIndexable, IInputParams, IScrapingService } from '@typings';

class UdemyScrapingService implements IScrapingService {
  private readonly _url: String;
  private readonly _username: String;
  private readonly _password: String;
  private isLogged: boolean;
  private readonly page: Page;
  private videoMap: Object;
  private accessToken: String;
  private courseId: String;
  private vMapFactory: UdemyVideoMapFactory;
  private courseMaterial: IIndexable;
  private readonly fFactory: FolderFactory = container.getInstance().getService(FolderFactory.name);

  constructor(i: IInputParams, page: Page, vMapFactory: UdemyVideoMapFactory) {
    this._url = i.url;
    this._username = i.username;
    this._password = i.password;
    this.page = page;
    this.isLogged = false;
    this.videoMap = {};
    this.vMapFactory = vMapFactory;
    this.courseMaterial = {};
  }

  get url() {
    console.log('the url is ', this._url);
    return this._url;
  }

  get username() {
    return this._username;
  }

  get password() {
    return this._password;
  }

  async login() {
    await this.page.goto('https://www.udemy.com');
    console.log('<<>>> figaaaaa <<>>');

    if (!isEmpty(await this.page.evaluate(() => document.querySelector('[data-purpose="my-courses"]')))) {
      this.isLogged = true;
      return this;
    }
    console.log('>><<>> PAGE', await this.page.title());
    await this.page.waitForSelector('[data-purpose="header-login"]');
    await this.page.click('[data-purpose="header-login"]');
    await sleep(1000);
    await this.page.waitForSelector('[name="email"]');
    await sleep(1000);
    await this.page.click('[name="email"]');
    await sleep(1000);
    console.log('username', this.username);
    await this.page.type('[name="email"]', `${this.username}`);
    await this.page.click('[name="password"]');
    await sleep(1000);
    await this.page.type('[name="password"]', `${this.password}`);
    await sleep(1000);
    await this.page.click('[name="submit"]');
    await this.page.waitForSelector("[data-purpose='my-courses']");
    this.isLogged = true;
    return this;
  }

  downloader: Downloader = (url, title, cb) => {
    return new Promise((resolve, reject) => {
      // const fileName = url.split("/").slice(-1);
      // downloadFolderFactory();

      const dest = `${this.fFactory.downloadPath}/${title}`;
      const file = fs.createWriteStream(dest);
      const sendReq = request.get(url);
      // verify response code
      sendReq.on('response', response => {
        if (response.statusCode !== 200) {
          reject(cb('Response status was ' + response.statusCode));
        }
        const len = parseInt(response.headers['content-length'], 10);
        const bar = new ProgressBar(`${title} -- downloading [:bar] :rate/bps :percent :etas`, {
          complete: '=',
          incomplete: ' ',
          width: 20,
          total: len
        });
        sendReq.on('data', chunk => {
          bar.tick(chunk.length);
        });
        sendReq.on('end', function() {
          console.log('\n');
          resolve(cb('end'));
        });
        sendReq.pipe(file);
      });
      // close() is async, call cb after close completes
      file.on('finish', () => file.close());
      // check for request errors
      sendReq.on('error', err => {
        fs.unlink(dest, () => reject(cb(err.message)));
      });
      file.on('error', err => {
        // Handle errors
        // @ts-ignore
        fs.unlink(dest, () => reject(cb(err.message))); // Delete the file async. (But we don't check the result)
      });
    });
  };

  getDownloadUrl = (lectureId: string) =>
    new Promise((resolve, reject) => {
      request(
        {
          uri: `https://www.udemy.com/api-2.0/users/me/subscribed-courses/${
            this.courseId
          }/lectures/${lectureId}?fields%5Basset%5D=@min,download_urls,external_url,slide_urls,status,captions,thumbnail_url,time_estimation,stream_urls&fields%5Bcaption%5D=@default,is_translation&fields%5Bcourse%5D=id,url,locale&fields%5Blecture%5D=@default,course,can_give_cc_feedback,download_url`,
          method: 'GET',
          headers: {
            authorization: `Bearer ${this.accessToken}`
          }
        },
        (error, response, body) => {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(err);
          }
        }
      );
    });

  downloadGenerator(courseMaterial: IIndexable, downloader: Function) {
    console.log('COURSE MATERIAL', courseMaterial[1]);
    const scraperInstance = this;
    return async function*() {
      for (let key of Object.keys(courseMaterial)) {
        const fileName: string = has(courseMaterial, `${key}.asset.filename`) ? courseMaterial[key].asset.filename : '';
        console.log('key is', key);
        if (courseMaterial[key]['_class'] === 'chapter') {
          yield () => scraperInstance.fFactory.createChapterFolder(courseMaterial[key]['title']);
        }

        if (courseMaterial[key]['_class'] === 'lecture' && fileName.indexOf('.mp4') > -1) {
          const lectureId: string = courseMaterial[key]['id'];
          console.log('LECTURE_ID', lectureId);
          const url = ((await scraperInstance.getDownloadUrl(lectureId)) as IIndexable)['asset']['download_urls'][
            'Video'
          ][0]['file'];
          yield () => downloader(url, fileName, (message: string) => console.log(message));
        } else {
          yield () => {};
        }
      }
    };
  }

  responseHandler = (resolve: Function) => (respEvent: Response) => {
    return ((respEvent, resolve: Function) => {
      try {
        if (
          respEvent.url().match('https://www.udemy.com/api-2.0/courses/[0-9]+/cached-subscriber-curriculum-items/(.)+')
        ) {
          this.courseId = respEvent
            .url()
            .match('^((.*?)(\\/courses\\/[0-9]+\\/))*(.*)')[3]
            .split('/')[2];
          console.log('COURSE ID', this.courseId);
          respEvent
            .json()
            .then(res => {
              resolve(res.results);
            })
            .catch(err => {
              throw err;
            });
        }
      } catch (err) {
        throw err;
      }
    })(respEvent, resolve);
  };
  getCourseMaterial = () => {
    return new Promise((resolve, reject) => {
      try {
        this.page.on('response', this.responseHandler(resolve));
      } catch (err) {
        reject(err);
      }
    });
  };

  async scrape() {
    try {
      const screenshot1 = 'udemy-login.png';
      const screenshot2 = 'udemy-course.png';
      await this.page.screenshot({ path: screenshot1 });
      console.log('See screenshot1: ' + screenshot1);
      console.log('mannaggiaaa');
      if ((((await this.page.goto(`${this.url}`)).status() / 100) | 0) == 4) {
        throw new Error('Error: Page not found');
      }
      await this.page.goto(`${this.url}`);

      if (!isEmpty(await this.page.evaluate(() => document.querySelector('[data-purpose="buy-this-course-button"]')))) {
        await this.page.click('[data-purpose="buy-this-course-button"]');
      }

      this.courseMaterial = (await this.getCourseMaterial()) as IIndexable;
      // await sleep(0, () => console.log("figaaa", ( this.courseMaterial as IIndexable)));
      await this.page.waitForSelector('[data-purpose="curriculum-section-container"]');
      this.accessToken = (await this.page.cookies())
        .filter((x: Cookie) => x.name === 'access_token')
        .map(x => x.value)[0];

      await this.page.screenshot({ path: screenshot2 });
      console.log('See screenshot2: ' + screenshot2);
      // console.log(await this.page.evaluate(() => document.title));
      // await this.page.click('[data-purpose="lecture-item-1-1"] a');
      await sleep(2000);
      const courseName = this._url.split('https://')[1].split('/')[1];
      console.log('courseName', courseName);
      // this.videoMap = await new UdemyVideoMapFactory(this.page).getVideoMap();
      this.fFactory.createCourseFolder(courseName);
      const dl = this.downloadGenerator(this.courseMaterial, this.downloader)();
      for await (let key of Object.keys(this.courseMaterial)) {
        const time: number = timeFactory();
        if (parseInt(key) < 2) {
          (await dl.next()).value();
        } else {
          await sleep(0, () => {
            console.log('>>>SLEEPING %s SECONDS<<<', time / 1000);
          });
          await sleep(time, () => {
            console.log('>>>%s SECONDS HAVE PASSED<<<', time / 1000);
          });
          (await dl.next()).value();
        }
      }
      return this;
    } catch (err) {
      throw err;
    }
  }
}

export default UdemyScrapingService;
