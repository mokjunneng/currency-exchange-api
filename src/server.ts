import * as http from 'http';

const host = 'localhost';
const port = 8000;

const requestListener: http.RequestListener = function (req, res) {
  // Handle incoming requests
  res.writeHead(200);
  res.end('Hello!');
};

function init() {
  const server = http.createServer(requestListener);
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}
init();
