import { getMandatoryEnvironmentVariable } from './helpers/environment';

export class Config {
  constructor(readonly coinbaseBaseUrl: string) {}

  static loadFromEnvironmentVariables(): Config {
    return new Config(getMandatoryEnvironmentVariable('COIN_BASE_BASE_URL'));
  }
}
