import axios from 'axios';
import { Currency } from '../../../constants/currencies';
import { BaseExchangeService } from '../base';
import { GetExchangeRatesResponse } from './models';

export class CoinBaseService extends BaseExchangeService {
  // TechDebt: Can use a global axios instance
  async getExchangeRates(baseCurreny: Currency): Promise<GetExchangeRatesResponse> {
    const response = await axios.request<GetExchangeRatesResponse>({
      method: 'get',
      url: `${this.baseUrl}/exchange-rates`,
      params: {
        currency: baseCurreny,
      },
    });
    return response.data;
  }
}
