import { IInputParams } from '@typings';

class InputParams implements IInputParams {
  [k: string]: any;
  public readonly url?: String;
  public readonly username?: String;
  public readonly password?: String;
  constructor(args?: { url?: String; username?: String; password?: String }) {
    this.url = args.url;
    this.username = args.username;
    this.password = args.password;
  }
}
export default InputParams;
