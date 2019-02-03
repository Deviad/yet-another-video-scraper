import { IScrapingService } from '@typings';

class ScrapingServiceDirector {
  private readonly instance: IScrapingService;

  constructor(args: { instance: IScrapingService }) {
    this.instance = args.instance;
  }

  public async login(): Promise<IScrapingService> {
    try {
      await this.instance.login();
      return this;
    } catch (err) {
      throw err;
    }
  }

  public async scrape(): Promise<IScrapingService> {
    try {
      await this.instance.scrape();
      return this;
    } catch (err) {
      throw err;
    }
  }

  public async checkInput(): Promise<IScrapingService> {
    if (this.instance.constructor.name === 'CourseHunterScrapingService' || 'UdemyScrapingService') {
      const mandatoryParams: string[] = ['_url', '_username', '_password'];
      for (const param of mandatoryParams) {
        if (
          this.instance[param.split('_')[1]] === typeof 'undefined' ||
          this.instance[param.split('_')[1]] == null ||
          this.instance[param.split('_')[1]] === ''
        ) {
          throw new Error(`${param.split('_')[1]} , unfortunately, is undefined`);
        }
      }
    }
    return this;
  }

  public init(): Promise<IScrapingService> {
    return this.checkInput()
      .then(() => this.login())
      .then(() => this.scrape())
      .catch(err => {
        throw err;
      });
  }
}

export default ScrapingServiceDirector;
