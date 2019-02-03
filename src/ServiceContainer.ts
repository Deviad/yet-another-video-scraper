import { IIndexable } from '@typings';

class ServiceContainer {
  private services: IIndexable = {};

  private static instance: ServiceContainer;

  private constructor() {}

  /** Get an instance of the service container
   * @returns ServiceContainer
   */
  public static getInstance(): ServiceContainer {
    if (ServiceContainer.instance == null) {
      ServiceContainer.instance = new ServiceContainer();
    }

    // console.log("ServiceContainer.instance.services", ServiceContainer.instance.services);

    return ServiceContainer.instance;
  }

  /** Add an instance of a class or the result of a function to the service container
   * After all functions in Javascript ar first class objects
   * @param  {Object|Function} service
   * @returns ServiceContainer
   */
  addService(service: Object | Function): ServiceContainer {
    let name = null;

    // console.log("<<<>>> SERVICE ADDED <<<>>>>", service);

    if (Object.prototype.toString.call(service) === '[object Object]' && service.constructor) {
      name = service.constructor.name;
    } else if (Object.prototype.toString.call(service) === '[object Function]' && (service as Function).name) {
      name = (service as Function).name;
    }
    if (Object.prototype.toString.call(service) === '[object Object]') {
      this.services[`${name}`] = service;
    } else if (Object.prototype.toString.call(service) === '[object Function]') {
      this.services[`${name}`] = (service as CallableFunction)();
    }
    return this;
  }

  /** Get a singleton instance of a class or the result of a function from the service container.
   * @param  {string} name
   * @returns any
   */
  getService(name: string): any {
    // console.log(`this.services[${name}]`, this.services[`${name}`]);

    return this.services[`${name}`];
  }
}

export default ServiceContainer;
