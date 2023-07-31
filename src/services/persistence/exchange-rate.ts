import { PrismaClient } from '@prisma/client';
import { ExchangeRates, Rates } from '../../models';
import { v4 as uuid } from 'uuid';
import { Currency } from '../../constants/currencies';

export class ExchangeRatePersistenceService {
  constructor(private readonly dbClient: PrismaClient) {}

  async createExchangeRates(exchangeRatesArray: ExchangeRates[]) {
    const timestamp = new Date();
    await this.dbClient.currencyExchange.createMany({
      data: exchangeRatesArray.flatMap((exchangeRates) => {
        const baseCurrency = exchangeRates.baseCurrency;
        return Object.entries(exchangeRates.rates).map(([targetCurrency, rate]) => {
          return {
            id: uuid(),
            baseCurrency,
            targetCurrency,
            rate,
            timestamp,
          };
        });
      }),
    });
  }

  async getLatestExchangeRates(baseCurrency: Currency, targetCurrencies: Currency[]): Promise<ExchangeRates> {
    const latestRates = await this.dbClient.currencyExchange.findMany({
      where: {
        baseCurrency: {
          equals: baseCurrency,
        },
        targetCurrency: {
          in: targetCurrencies,
        },
      },
      orderBy: [
        {
          timestamp: 'desc',
        },
      ],
      distinct: ['baseCurrency', 'targetCurrency'],
    });
    return {
      baseCurrency,
      rates: latestRates.reduce((combinedRates, rate) => {
        combinedRates[rate.targetCurrency as Currency] = rate.rate;
        return combinedRates;
      }, {} as Rates),
    };
  }
}
