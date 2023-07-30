// Available fiat currencies, include more as the need arises
export const USD = 'USD';
export const SGD = 'SGD';
export const EUR = 'EUR';

export type FiatCurrency = (typeof AVAILABLE_FIAT_CURRENCIES)[number];
export const AVAILABLE_FIAT_CURRENCIES = [USD, SGD, EUR] as const;

// Available crypto currencies, include more as the need arises
export const BTC = 'BTC';
export const DOGE = 'DOGE';
export const ETH = 'ETH';

export type CryptoCurrency = (typeof AVAILABLE_CRYPTO_CURRENCIES)[number];
export const AVAILABLE_CRYPTO_CURRENCIES = [BTC, DOGE, ETH] as const;

export type Currency = FiatCurrency | CryptoCurrency;
export const ALL_AVAILABLE_CURRENCIES = [USD, SGD, EUR, BTC, DOGE, ETH] as const;
