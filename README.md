# Currency Exchange API

## Prerequisites

`Yarn` version - ^3.6.1  
`Node` version - ^20.6.0
`Docker` version - 23.0.5 (what I used for the project, previous versions should work)


## Install

```
yarn install
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the server in the development mode.\
Open [http://localhost:8000](http://localhost:8000) to view it in the browser.

## Local Development

> Note that no data will be returned when calling `GET /exchange-rates` endpoint initially. To populate data in your local database, call the `POST /start-scheduler` endpoint after following the steps below. Refer to the APIs section for more details.

1. Run a docker container hosting PostgreSQL database locally `yarn start-docker-db` (to spin down container, simply run `yarn stop-docker-db`)
2. Run `yarn prisma:migrate-deploy` to apply all pending migrations, and create the database if it does not exist.
> **_NOTE:_** `prisma migrate deploy` usually runs on non-development environment. However, since we need to persist the data fetched by the cron service to perform more robust testing, we can go with this. In case there's a schema drift or there's a need to reset the database, feel free to run `prisma migrate dev` or `prisma migrate reset`. See [here](https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-dev) for more information.
3. Export the database URL using `./scripts/export-db-url.sh` for Prisma Client to connect.
4. Generate Prisma Client types `yarn prisma:generate`
5. Start the server `yarn start`

---
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

### Get Historical Exchange Rates

`GET /historical-rates`

#### Arguments
| Parameter       | Type   | Required | Description                 |
|-----------------|--------|----------| ----------------------------|
| base_currency   | string | Required | The reference base currency |
| target_currency | string | Required | The target currency         |
| start           | string | Required | The starting Unix timestamp in UTC, in milliseconds. |
| end             | string | Optional | The ending Unix 2mestamp in UTC (in milliseconds). If undefined, it assumes the current time. |

> Example request

`curl https://localhost:8000/historical-rates?base_currency=USD&target_currency=ETH&start=1672508225000&end=1675013825000`

> Example response

```JSON
{
  "results": [
    {
      "timestamp": 1672508225000,
      "value": "0.00049"
    },
    {
      "timestamp": 1672508325000,
      "value": "0.00052"
    },
    {
      "timestamp": 1672508425000,
      "value": "0.00050"
    },
    // ... more results
  ]
}
```

### Start Scheduler

`POST {base_url}/start-scheduler`

Start the cron scheduler to run background task to fetch exchange rates data from an exchange service API and insert them into persistence database. The scheduled task will run at the **start of every minute**.

### Stop Scheduler

`POST {base_url}/stop-scheduler`

Stop the scheduler
