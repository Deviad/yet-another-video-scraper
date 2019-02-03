import { IIndexable } from '@typings';

class ServiceContainer {
  private services: IIndexable = {};

  private static instance: ServiceContainer;

  private constructor() {}

  public static getInstance(): ServiceContainer {
    if (ServiceContainer.instance == null) {
      ServiceContainer.instance = new ServiceContainer();
    }

    // console.log("ServiceContainer.instance.services", ServiceContainer.instance.services);

    return ServiceContainer.instance;
  }

  addService(service: any): void {
    let name = null;

    // console.log("<<<>>> SERVICE ADDED <<<>>>>", service);

    if (Object.prototype.toString.call(service) === '[object Object]' && service.constructor) {
      name = service.constructor.name;
    } else if (Object.prototype.toString.call(service) === '[object Function]' && service.name) {
      name = service.name;
    }

    this.services[`${name}`] = service;
  }

  getService(name: string): any {
    // console.log(`this.services[${name}]`, this.services[`${name}`]);

    return this.services[`${name}`];
  }
}

export default ServiceContainer;
