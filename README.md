# Currency Exchange API

## Prerequisites

`Yarn` version - ^3.6.1  
`Node` version - ^20.6.0

## Install

```
yarn install
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the server in the development mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

## APIs

### Get Exchange Rates

Get current exchange rates. Allow to specify rates in fiat or crypto

#### HTTP Request

`GET {base_url}/exchange-rates`

#### Arguments
| Parameter   | Type   | Required | Description        |
|-------------|--------|----------| -------------------|
| base        | string | Optional | "fiat" or "crypto" |

> Example request

`curl https://localhost:8000/exchange-rates?base=crypto`

> Example response

```JSON
{
  "BTC": {
    "USD": "29717.50",
    "SGD": "40873.42",
    "EUR": "27519.47"
  },
  "DOGE": {
    "USD": "0.084",
    "SGD": "0.12",
    "EUR": "0.075"
  },
  "ETH": {
    "USD": "2022.43",
    "SGD": "2853.29",
    "EUR": "1945.12"
  }
}
```
