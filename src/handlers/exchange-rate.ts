import { Currency } from '../constants/currencies';
import { BadRequest } from '../helpers/errors';
import {
  CryptoCurrencyExchangeRatesInFiat,
  CurrencyBase,
  FiatCurrencyExchangeRatesInCrypto,
  HistoricalExchangeRatesDto,
} from '../models';
import { getDependencies } from './dependencies';

const { exchangeRateController } = getDependencies();

export const getExchangeRates = async <TBase extends CurrencyBase>(
  base: TBase,
): Promise<FiatCurrencyExchangeRatesInCrypto | CryptoCurrencyExchangeRatesInFiat> => {
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

export const getHistoricalRates = async (
  baseCurrency: Currency,
  targetCurrency: Currency,
  fromTimestamp: string,
  toTimestamp?: string,
): Promise<HistoricalExchangeRatesDto> => {
  const historicalRates = await exchangeRateController.getHistoricalRates(
    baseCurrency,
    targetCurrency,
    fromTimestamp,
    toTimestamp,
  );
  return {
    results: historicalRates,
  };
};
