import { AVAILABLE_CRYPTO_CURRENCIES, AVAILABLE_FIAT_CURRENCIES } from '../constants/currencies';
import { CryptoCurrencyExchangeRatesInFiat, FiatCurrencyExchangeRatesInCrypto } from '../models';
import { BaseExchangeService } from '../services/exchange/base';

export class ExchangeRateController {
  constructor(private readonly exchangeService: BaseExchangeService) {}

  async getFiatCurrencyExhangeRatesInCrypto(): Promise<FiatCurrencyExchangeRatesInCrypto> {
    // For each available fiat currency, we get the respective exchange rates
    const fiatCurrencyExchangeRates = await Promise.all(
      AVAILABLE_FIAT_CURRENCIES.map(async (currency) => {
        return (await this.exchangeService.getExchangeRates(currency)).data;
      }, this),
    );

    // For each available fiat currency, we find the respective crypto exchange rates and combine them
    const fiatCurrencyExchangeRatesInCrypto = fiatCurrencyExchangeRates.reduce((combinedRates, rates) => {
      combinedRates[rates.currency] = Object.fromEntries(
        AVAILABLE_CRYPTO_CURRENCIES.map((cryptoCurrency) => [cryptoCurrency, rates.rates[cryptoCurrency]]),
      );
      return combinedRates;
    }, {} as FiatCurrencyExchangeRatesInCrypto);

    return fiatCurrencyExchangeRatesInCrypto;
  }

  async getCryptoCurrencyExhangeRatesInFiat(): Promise<CryptoCurrencyExchangeRatesInFiat> {
    // For each available crypto currency, we get the respective exchange rates
    const cryptoCurrencyExchangeRates = await Promise.all(
      AVAILABLE_CRYPTO_CURRENCIES.map(async (currency) => {
        return (await this.exchangeService.getExchangeRates(currency)).data;
      }, this),
    );

    // For each available crypto currency, we find the respective fiat exchange rates and combine them
    const cryptoCurrencyExchangeRatesInFiat = cryptoCurrencyExchangeRates.reduce((combinedRates, rates) => {
      combinedRates[rates.currency] = Object.fromEntries(
        AVAILABLE_FIAT_CURRENCIES.map((fiatCurrency) => [fiatCurrency, rates.rates[fiatCurrency]]),
      );
      return combinedRates;
    }, {} as FiatCurrencyExchangeRatesInCrypto);

    return cryptoCurrencyExchangeRatesInFiat;
  }
}
