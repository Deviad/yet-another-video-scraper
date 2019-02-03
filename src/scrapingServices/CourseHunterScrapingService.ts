import { Page } from 'puppeteer';
import * as fs from 'fs';
import * as request from 'request';
// @ts-ignore
import * as ProgressBar from 'progress';

import { timeFactory, sleep, promisifiedGetRequest, downloadFolderFactory } from '@utils';
import CourseHunterVideoMapFactory from '../videoMapFactories/CourseHunterVideoMapFactory';
import { Downloader, IIndexable, IInputParams, IScrapingService } from '@typings';

class CourseHunterScrapingService implements IScrapingService {
  private readonly _url: String;
  private readonly _username: String;
  private readonly _password: String;
  private isLogged: boolean;
  private readonly page: Page;
  private videoMap: Object;
  private vMapFactory: CourseHunterVideoMapFactory;

  constructor(i: IInputParams, page: Page, vMapFactory: CourseHunterVideoMapFactory) {
    this._url = i.url;
    this._username = i.username;
    this._password = i.password;
    this.page = page;
    this.isLogged = false;
    this.videoMap = {};
    this.vMapFactory = vMapFactory;
  }

  get url() {
    // console.log("the url is ", this._url);
    return this._url;
  }

  get username() {
    return this._username;
  }

  get password() {
    return this._password;
  }

  async login() {
    if (!this.isLogged) {
      await this.page.goto('https://coursehunters.net/admin/#/login');
      await this.page.type('[formcontrolname="e_mail"]', `${this.username}`);
      await this.page.type('[formcontrolname="password"]', `${this.password}`);

      await this.page.click('[type="submit"]');
      await this.page.waitForSelector('.plans');
      await this.page.cookies();
      this.isLogged = true;
    }
    return this;
  }

  downloader: Downloader = (url, title, cb) => {
    const sanitizedTitle = title[0].replace(/[.\-\\/+()*[\]={}!@#$%^&<>,:;"'| ]/g, '_');
    return new Promise((resolve, reject) => {
      const extension = url
        .split('/')
        .slice(-1)[0]
        .split('.')
        .slice(-1)[0];
      downloadFolderFactory();
      const dest = `./download/${sanitizedTitle}.${extension}`;
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

  downloadGenerator(videoMap: IIndexable, downloader: Function) {
    return function*() {
      for (let key of Object.keys(videoMap)) {
        // console.log("key is", key);
        const url = videoMap[key]['url'];
        const title =
          (videoMap[key]['title'] as string).indexOf('Урок') > -1
            ? (videoMap[key]['title'] as string).trim().split('Урок')[0]
            : videoMap[key]['title'];
        yield () => downloader(url, title, (message: string) => console.log(message));
      }
    };
  }

  async scrape() {
    try {
      const screenshot1 = 'coursehunters-login.png';
      const screenshot2 = 'coursehunters-course.png';
      await this.page.screenshot({ path: screenshot1 });
      console.log('See screenshot1: ' + screenshot1);
      console.log('mannaggiaaa');

      await promisifiedGetRequest(`${this.url}`, (message: string) => console.log(message)); //check if url exists
      await this.page.goto(`${this.url}`);
      await this.page.waitForSelector('.jwplayer');

      await this.page.screenshot({ path: screenshot2 });
      console.log('See screenshot2: ' + screenshot2);

      console.log(await this.page.evaluate(() => document.title));

      await this.page.click('.lessons-list__more');

      this.videoMap = await new CourseHunterVideoMapFactory(this.page).getVideoMap();

      console.log('videoMap', JSON.stringify(this.videoMap));

      const dl = this.downloadGenerator(this.videoMap, this.downloader)();
      for await (let key of Object.keys(this.videoMap)) {
        const time: number = timeFactory();
        if (parseInt(key) === 0) {
          await dl.next().value();
        } else {
          await sleep(time, () => {
            console.log('>>>SLEEPING %s SECONDS<<<', time / 1000);
          });
          await sleep(time, () => {
            console.log('>>>%s SECONDS HAVE PASSED<<<', time / 1000);
          });
          await dl.next().value();
        }
      }
      return this;
    } catch (err) {
      throw err;
    }
  }
}

export default CourseHunterScrapingService;
