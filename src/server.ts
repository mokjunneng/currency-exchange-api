import express from 'express';
import { getExchangeRates } from './handlers/exchange-rate';
import { startScheduler, stopScheduler } from './handlers/scheduler';
import { getMandatoryEnvironmentVariable } from './helpers/environment';
import { ClientError } from './helpers/errors';
import { jsonError } from './helpers/json-response';
import { CurrencyBase } from './models';

const host = getMandatoryEnvironmentVariable('HOST');
const port = Number(getMandatoryEnvironmentVariable('PORT'));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/exchange-rates', async (req, res) => {
  if (req.query.base) {
    try {
      const exchangeRates = await getExchangeRates(req.query.base as CurrencyBase);
      return res.status(200).json(exchangeRates);
    } catch (error) {
      const response = handleApiError(error as Error);
      return res.status(response.statusCode).json(JSON.parse(response.body));
    }
  } else {
    return res
      .status(400)
      .json({ message: 'Query string `base` is required (e.g. /exchange-rate?base=crypto)' });
  }
});

app.post('/start-scheduler', async (req, res) => {
  await startScheduler();
  return res.json({ message: 'OK' });
});

app.post('/stop-scheduler', async (req, res) => {
  await stopScheduler();
  return res.json({ message: 'OK' });
});

// Handle 4XX client errors and 5XX server errors here
const handleApiError = function (err: Error) {
  const potentialClientError = err as ClientError;
  if (potentialClientError.isClientError) {
    const response = jsonError(potentialClientError.message, potentialClientError.httpStatus);
    console.warn({
      message: 'Client error occurred when processing HTTP request',
      // JSON.stringify returns {} for an error type by default
      error: JSON.stringify(err, Object.getOwnPropertyNames(err)),
      response,
    });
    return response;
  }
  // Catch any unexpected errors here, and return a generic internal server error response
  console.error({
    message: 'Unexpected error occurred when processing HTTP request',
    // JSON.stringify returns {} for an error type by default
    error: JSON.stringify(err, Object.getOwnPropertyNames(err)),
  });
  return jsonError('Internal server error', 500);
};

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
