import { PrismaClient } from '@prisma/client';
import { Config } from '../config';
import { ExchangeRateController } from '../controllers/exchange-rate';
import { ExchangeRateScheduler } from '../controllers/scheduler';
import { CoinBaseService } from '../services/exchange/coinbase';
import { ExchangeRatePersistenceService } from '../services/persistence/exchange-rate';

export function getDependencies() {
  const config = Config.loadFromEnvironmentVariables();
  const dbClient = new PrismaClient({
    log: ['warn', 'error'],
  });

  // Initialize services
  const coinbaseService = new CoinBaseService(config.coinbaseBaseUrl);
  const exchangeRatePersistenceService = new ExchangeRatePersistenceService(dbClient);

  // Initialize controllers
  const exchangeRateController = new ExchangeRateController(exchangeRatePersistenceService);
  const exchangeRateScheduler = new ExchangeRateScheduler(coinbaseService, exchangeRatePersistenceService);

  return {
    exchangeRateController,
    exchangeRateScheduler,
  };
}
