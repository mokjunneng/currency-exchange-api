import * as http from 'http';
import { URL } from 'node:url';
import { getExchangeRates } from './handlers/exchange-rate';
import { getMandatoryEnvironmentVariable } from './helpers/environment';
import { ClientError } from './helpers/errors';
import { jsonError, jsonResponse } from './helpers/json-response';
import { CurrencyBase } from './models';

const host = 'localhost';
const port = 8000;

const requestListener: http.RequestListener = async function (req, res) {
  // Handle incoming requests
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/exchange-rates') {
    const queryParams = url.searchParams;
    try {
      const exchangeRates = await getExchangeRates(queryParams.get('base') as CurrencyBase);
      const response = jsonResponse(exchangeRates);
      res.writeHead(response.statusCode, response.headers);
      res.end(response.body);
    } catch (error) {
      const errorResponse = handleApiError(error);
      res.writeHead(errorResponse.statusCode, errorResponse.headers);
      res.end(errorResponse.body);
    }
  } else {
    // Unidentifiable request URL, response with a 404 not found error
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
};

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

function init() {
  const server = http.createServer(requestListener);
  server.listen(
    Number(getMandatoryEnvironmentVariable('PORT')),
    getMandatoryEnvironmentVariable('HOST'),
    () => {
      console.log(`Server is running on http://${host}:${port}`);
    },
  );
}
init();
