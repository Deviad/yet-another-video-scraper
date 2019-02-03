// declare module 'puppeteer' {
//     interface Element {
//       textContent: any;
// }
//     interface Document { }
// }
declare global {
  interface Window {
    writeABString: any;
    arrayBufferToString: any;
  }
  interface Navigator {
    chrome: any;
    permissions: any;
  }
}

// declare interface ScrapingService {
//     new(page: Page): any;
// }

export interface IInputParams extends IIndexable {
  readonly url?: String;
  readonly username?: String;
  readonly password?: String;
}
export interface IScrapingService extends IIndexable {
  login(): any;

  scrape(): any;
}
export type CourseFolderFactory = (downloadFolderName: string, courseName: string) => void;
export type TimeFactory = (a?: number, b?: number) => number;
export interface StringArrayPromise extends IIndexable {
  (): Promise<void | IIndexable>;
}
export type Downloader = (url: string, title: string, cb: CallableFunction) => Promise<void>;
export type UrlArrayFactory = (a: Element[]) => string[];
export type TitleArrayFactory = (a: Element[]) => string[];

export interface IIndexable {
  [key: string]: any;
  [key: number]: any;
}
export type Constructor<T = {}> = new (...args: any[]) => T;
