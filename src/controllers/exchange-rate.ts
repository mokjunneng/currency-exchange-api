import {
  AVAILABLE_CRYPTO_CURRENCIES,
  AVAILABLE_FIAT_CURRENCIES,
  CryptoCurrency,
  Currency,
  FiatCurrency,
} from '../constants/currencies';
import {
  CryptoCurrencyExchangeRatesInFiat,
  FiatCurrencyExchangeRatesInCrypto,
  HistoricalExchangeRates,
} from '../models';
import { ExchangeRatePersistenceService } from '../services/persistence/exchange-rate';

export class ExchangeRateController {
  constructor(private readonly persistenceService: ExchangeRatePersistenceService) {}

  async getFiatCurrencyExhangeRatesInCrypto(): Promise<FiatCurrencyExchangeRatesInCrypto> {
    // For each available fiat currency, we get the respective crypto exchange rates
    const fiatCurrencyExchangeRates = await Promise.all(
      AVAILABLE_FIAT_CURRENCIES.map((currency) => {
        return this.persistenceService.getLatestExchangeRates(currency, AVAILABLE_CRYPTO_CURRENCIES.slice());
      }, this),
    );

    // Combine all the rates
    const fiatCurrencyExchangeRatesInCrypto = fiatCurrencyExchangeRates.reduce((combinedRates, rates) => {
      combinedRates[rates.baseCurrency as FiatCurrency] = rates.rates;
      return combinedRates;
    }, {} as FiatCurrencyExchangeRatesInCrypto);

    return fiatCurrencyExchangeRatesInCrypto;
  }

  async getCryptoCurrencyExhangeRatesInFiat(): Promise<CryptoCurrencyExchangeRatesInFiat> {
    // For each available crypto currency, we get the respective fiat exchange rates
    const cryptoCurrencyExchangeRates = await Promise.all(
      AVAILABLE_CRYPTO_CURRENCIES.map((currency) => {
        return this.persistenceService.getLatestExchangeRates(currency, AVAILABLE_FIAT_CURRENCIES.slice());
      }, this),
    );

    // Combine all the rates
    const cryptoCurrencyExchangeRatesInFiat = cryptoCurrencyExchangeRates.reduce((combinedRates, rates) => {
      combinedRates[rates.baseCurrency as CryptoCurrency] = rates.rates;
      return combinedRates;
    }, {} as CryptoCurrencyExchangeRatesInFiat);

    return cryptoCurrencyExchangeRatesInFiat;
  }

  async getHistoricalRates(
    baseCurrency: Currency,
    targetCurrency: Currency,
    fromTimestamp: string,
    toTimestamp?: string,
  ): Promise<HistoricalExchangeRates> {
    return this.persistenceService.getHistoricalRates(
      baseCurrency,
      targetCurrency,
      fromTimestamp,
      toTimestamp,
    );
  }
}
