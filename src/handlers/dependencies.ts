import { Config } from '../config';
import { ExchangeRateController } from '../controllers/exchange-rate';
import { CoinBaseService } from '../services/exchange/coinbase';

export function getDependencies() {
  const config = Config.loadFromEnvironmentVariables();

  // Initialize services
  const coinbaseService = new CoinBaseService(config.coinbaseBaseUrl);

  // Initialize controllers
  const exchangeRateController = new ExchangeRateController(coinbaseService);

  return {
    exchangeRateController,
  };
}
