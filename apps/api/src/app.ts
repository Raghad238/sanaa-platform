import cors from 'cors';
import express, { type Express } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

import { AppError } from './common/errors/app-error.js';
import { env, type AppEnv } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import { requestLogger } from './middleware/request-logger.js';
import { apiRouter } from './routes/index.js';

export function createApp(config: AppEnv = env): Express {
  const app: Express = express();
  const allowedOrigins = new Set(config.CORS_ORIGINS);

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)),
      credentials: false,
    }),
  );
  app.use(
    '/api',
    rateLimit({
      windowMs: config.API_RATE_LIMIT_WINDOW_MS,
      limit: config.API_RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (_req, _res, next) => {
        next(
          new AppError(429, 'RATE_LIMIT_EXCEEDED', 'Too many requests. Please try again later.'),
        );
      },
    }),
  );

  app.use(requestLogger);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  if (config.NODE_ENV !== 'production') {
    app.set('json spaces', 2);
  }

  return app;
}

const app = createApp();

export default app;
