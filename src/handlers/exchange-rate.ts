import { BadRequest } from '../helpers/errors';
import {
  CryptoCurrencyExchangeRatesInFiat,
  CurrencyBase,
  FiatCurrencyExchangeRatesInCrypto,
} from '../models';
import { getDependencies } from './dependencies';

const { exchangeRateController } = getDependencies();

export const getExchangeRates = async <TBase extends CurrencyBase>(
  base: TBase,
): Promise<TBase extends 'fiat' ? FiatCurrencyExchangeRatesInCrypto : CryptoCurrencyExchangeRatesInFiat> => {
  switch (base) {
    case 'fiat': {
      return exchangeRateController.getFiatCurrencyExhangeRatesInCrypto();
    }
    case 'crypto': {
      return exchangeRateController.getCryptoCurrencyExhangeRatesInFiat();
    }
    default: {
      throw new BadRequest(`Only "fiat" or "crypto" base is accepted. Received ${base} instead`);
    }
  }
};
