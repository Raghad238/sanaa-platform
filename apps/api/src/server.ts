import http from 'node:http';

import app from './app.js';
import { env } from './config/env.js';

const port = env.PORT;

const server = http.createServer(app);

const shutdown = (signal: string) => {
  console.info(`Received ${signal}, shutting down HTTP server...`);

  server.close((error) => {
    if (error) {
      console.error('Error while closing server:', error);
      process.exitCode = 1;
      return;
    }

    console.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

server.listen(port, () => {
  console.info(`Sana'a Platform API listening on http://localhost:${port}`);
});

export default server;
