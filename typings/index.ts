// declare module 'puppeteer' {
//     interface Element {
//       textContent: any;
// }
//     interface Document { }
// }
  export declare interface ExtendedWindow {
    writeABString: any;
    arrayBufferToString: any;
    chrome: any;
    navigator: any
  }
  export interface ExtendedNavigator {
    permissions: any;
  }

// declare interface ScrapingService {
//     new(page: Page): any;
// }

export declare interface IInputParams extends IIndexable {
  readonly url?: String;
  readonly username?: String;
  readonly password?: String;
}
export declare interface IScrapingService extends IIndexable {
  login(): any;

  scrape(): any;
}
export declare type CourseFolderFactory = (downloadFolderName: string, courseName: string) => void;
export declare type TimeFactory = (a?: number, b?: number) => number;
export declare interface StringArrayPromise extends IIndexable {
  (): Promise<void | IIndexable>;
}
export declare type Downloader = (url: string, title: string, cb: CallableFunction) => Promise<void>;
export declare type UrlArrayFactory = (a: Element[]) => string[];
export declare type TitleArrayFactory = (a: Element[]) => string[];

export declare interface IIndexable {
  [key: string]: any;
  [key: number]: any;
}
export declare type Constructor<T = {}> = new (...args: any[]) => T;
