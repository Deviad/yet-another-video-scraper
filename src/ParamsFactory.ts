import InputParams from './InputParams';
import { IIndexable } from '@typings';
class ParamsFactory {
  private readonly args: InputParams;
  constructor(args: InputParams) {
    this.args = args;
  }

  public init(): any {
    const i = new InputParams({});
    // const { stdout } = await pExec(`pwd`);

    let tmpObj: IIndexable = {
      password: '',
      url: '',
      username: ''
    };
    // console.log(this.args);
    if (this.args !== null) {
      for (const a in this.args) {
        if (this.args.hasOwnProperty(a)) {
          if (a === 'url') {
            tmpObj.url = `${this.args.url}`;
          }
          if (a === 'username') {
            tmpObj.username = `${this.args.username}`;
          }
          if (a === 'password') {
            tmpObj.password = `${this.args.password}`;
          }
        }
      }
      for (const el of Object.keys(tmpObj)) {
        i[el] = tmpObj[el];
      }

      tmpObj = null;
      return i;
    }
  }
}

export default ParamsFactory;
