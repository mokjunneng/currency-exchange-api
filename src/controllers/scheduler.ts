import { schedule, ScheduledTask, ScheduleOptions } from 'node-cron';
import { ALL_AVAILABLE_CURRENCIES } from '../constants/currencies';
import { ExchangeRates } from '../models/index';
import { BaseExchangeService } from '../services/exchange/base';
import { ExchangeRatePersistenceService } from '../services/persistence/exchange-rate';

const scheduleOptions: ScheduleOptions = {
  scheduled: false,
  timezone: 'Asia/Singapore',
  name: 'exchange-rate',
  // Enable this if exchange service API allows us to query by datetime
  // recoverMissedExecutions: true
};

export class ExchangeRateScheduler {
  private task: ScheduledTask | null = null;
  constructor(
    private readonly exchangeService: BaseExchangeService,
    private readonly exchangeRatePersistenceService: ExchangeRatePersistenceService,
  ) {}

  private async scheduleAction() {
    console.log('Getting exchange rates from exchange service...');
    const allExchangeRates: ExchangeRates[] = await Promise.all(
      ALL_AVAILABLE_CURRENCIES.map(async (baseCurrency) => {
        const response = await this.exchangeService.getExchangeRates(baseCurrency);
        return {
          baseCurrency,
          rates: response.data.rates,
        };
      }, this),
    );
    console.log('Got all exchange rates, inserting into persistence now...');
    await this.exchangeRatePersistenceService.createExchangeRates(allExchangeRates);
    console.log('Persistence updated with latest exchange rates!');
  }

  async start() {
    if (!this.task) {
      // TODO: Move schedule's cron string to env variable
      this.task = schedule('0 * * * * *', async () => this.scheduleAction(), scheduleOptions);
    }
    await this.task.start();
  }

  async stop() {
    if (!this.task) {
      throw Error('Scheduled task not found');
    }
    await this.task.stop();
  }
}
