import { CryptoCurrency, Currency, FiatCurrency } from '../constants/currencies';

export const Fiat = 'fiat';
export const Crypto = 'crypto';
export type CurrencyBase = typeof Fiat | typeof Crypto;

export type CryptoCurrencyExchangeRatesInFiat = {
  [C in CryptoCurrency]: { [F in FiatCurrency]: string };
};

export type FiatCurrencyExchangeRatesInCrypto = {
  [F in FiatCurrency]: { [C in CryptoCurrency]: string };
};

export interface ExchangeRates {
  baseCurrency: Currency;
  rates: Rates;
}

export type Rates = {
  [C in Currency]: string;
};

export type HistoricalExchangeRates = { timestamp: number; value: string }[];
export interface HistoricalExchangeRatesDto {
  results: HistoricalExchangeRates;
}
