import { getDependencies } from './dependencies';

const { exchangeRateScheduler } = getDependencies();

export const startScheduler = async () => {
  console.log('Starting scheduler...');
  return exchangeRateScheduler.start();
};

export const stopScheduler = async () => {
  console.log('Stopping scheduler...');
  return exchangeRateScheduler.stop();
};
