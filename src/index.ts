import { promisify } from 'util';
import { exec } from 'child_process';
import * as argv from 'minimist';
import ParamsFactory from './ParamsFactory';
import CourseScraper from './CourseScraper';
import * as puppeteer from 'puppeteer';
import container from './ServiceContainer';
import { Browser } from 'puppeteer';
import Constants from './Constants';
import { FolderFactory } from './utils';
import { IInputParams } from '@typings';
const pExec = promisify(exec);
const args = argv(process.argv.slice(2)) as IInputParams;
// const path = require('path');
// global.appRoot = path.resolve(__dirname);
async function main() {
  try {
    container.getInstance().addService(new ParamsFactory(args));
    container.getInstance().addService(new FolderFactory('download'));

    const userAgent = Constants.General.USER_AGENT;
    /*We add a new instance of Browser and add it to the service container 
    */
    container.getInstance().addService(
      await puppeteer.launch({
        args: [
          '--shm-size=1gb',
          '--ignore-certificate-errors',
          `--user-agent=${userAgent}`,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          /*
          Simulate real browser
         */

          // `--user-data-dir=${require('os').homedir()}/Library/Application\ Support/Google/Chrome`,
          '--profile-directory=Default',
          '--disable-background-networking',
          '--disable-background-timer-throttling',
          '--disable-client-side-phishing-detection',
          '--disable-default-apps',
          '--disable-dev-shm-usage',
          // '--disable-extensions',
          '--disable-hang-monitor',
          '--disable-popup-blocking',
          '--disable-prompt-on-repost',
          '--disable-sync',
          '--disable-translate',
          '--metrics-recording-only',
          '--no-first-run',
          '--safebrowsing-disable-auto-update'
        ],
        headless: false
        // executablePath: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
      })
    );

    const pFactoryInstance: ParamsFactory = container.getInstance().getService(ParamsFactory.name); //params.init();
    const browser: Browser = container.getInstance().getService('Browser');
    const i: IInputParams = pFactoryInstance.init();
    const sc = new CourseScraper(browser, i);
    await sc.scrape();
  } catch (err) {
    console.error(err);
  }
}
main();
// const readFileAsync = promisify(fs.readFile);

// const filePath = `${path.join(__dirname, '/')}/vhost.conf`;
