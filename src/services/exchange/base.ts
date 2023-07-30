import { FiatCurrency, CryptoCurrency } from '../../constants/currencies';
import { GetExchangeRatesResponse } from './coinbase/models';

export abstract class BaseExchangeService {
  // TechDebt: Authentication and other connection options can be included here or under exchange services
  // We only use Coinbase service now to get exchange rates which doesn't require any authentication
  constructor(protected readonly baseUrl: string) {}

  abstract getExchangeRates(baseCurreny: FiatCurrency | CryptoCurrency): Promise<GetExchangeRatesResponse>;
}
