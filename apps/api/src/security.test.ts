import assert from 'node:assert/strict';
import test from 'node:test';

import express from 'express';
import request from 'supertest';
import { ZodError, z } from 'zod';

import app, { createApp } from './app.js';
import { env, parseEnv } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';
import { validateRequest } from './middleware/validate-request.js';
import { createHealthRouter } from './routes/health.js';

test('production environment requires explicit non-wildcard CORS origins', () => {
  assert.throws(
    () => parseEnv({ NODE_ENV: 'production' }),
    (error: unknown) =>
      error instanceof ZodError && error.issues.some((issue) => issue.path[0] === 'CORS_ORIGINS'),
  );

  assert.throws(
    () => parseEnv({ NODE_ENV: 'production', CORS_ORIGINS: '*' }),
    (error: unknown) =>
      error instanceof ZodError && error.issues.some((issue) => issue.path[0] === 'CORS_ORIGINS'),
  );
});

test('invalid environment values fail Zod parsing', () => {
  assert.throws(() => parseEnv({ PORT: 'not-a-port' }), ZodError);
  assert.throws(() => parseEnv({ API_RATE_LIMIT_MAX: '0' }), ZodError);
  assert.throws(
    () => parseEnv({ NODE_ENV: 'production', CORS_ORIGINS: 'https://frontend.example.test/path' }),
    ZodError,
  );
});

test('staging requires a valid MySQL DATABASE_URL', () => {
  assert.throws(
    () => parseEnv({ NODE_ENV: 'staging', CORS_ORIGINS: 'https://frontend.example.test' }),
    (error: unknown) =>
      error instanceof ZodError && error.issues.some((issue) => issue.path[0] === 'DATABASE_URL'),
  );

  assert.throws(
    () =>
      parseEnv({
        NODE_ENV: 'staging',
        CORS_ORIGINS: 'https://frontend.example.test',
        DATABASE_URL: 'postgres://localhost/platform',
      }),
    (error: unknown) =>
      error instanceof ZodError && error.issues.some((issue) => issue.path[0] === 'DATABASE_URL'),
  );

  const config = parseEnv({
    NODE_ENV: 'staging',
    CORS_ORIGINS: 'https://frontend.example.test',
    DATABASE_URL: 'mysql://db_user:db_password@db.example.test:3306/sanaa_marketplace',
  });

  assert.equal(
    config.DATABASE_URL,
    'mysql://db_user:db_password@db.example.test:3306/sanaa_marketplace',
  );
});

test('Helmet security headers are enabled without changing health behavior', async () => {
  const response = await request(app).get('/api/v1/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.data.status, 'ok');
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
  assert.equal(response.headers['x-frame-options'], 'SAMEORIGIN');
});

test('database health succeeds only after the connectivity query resolves', async () => {
  const databaseHealthApp = express();

  databaseHealthApp.use(
    '/api/v1',
    createHealthRouter(async () => undefined),
  );
  databaseHealthApp.use(errorHandler);

  const response = await request(databaseHealthApp).get('/api/v1/health/db');

  assert.equal(response.status, 200);
  assert.equal(response.body.data.status, 'ok');
  assert.equal(response.body.data.database, 'connected');
});

test('database health failure returns a sanitized service-unavailable envelope', async () => {
  const databaseHealthApp = express();

  databaseHealthApp.use(
    '/api/v1',
    createHealthRouter(async () => {
      throw new Error('private database connection detail');
    }),
  );
  databaseHealthApp.use(errorHandler);

  const response = await request(databaseHealthApp).get('/api/v1/health/db');

  assert.equal(response.status, 503);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'DATABASE_UNAVAILABLE');
  assert.doesNotMatch(JSON.stringify(response.body), /private database connection detail/);
});

test('unconfigured Prisma database health returns unavailable without breaking API health', async () => {
  const health = await request(app).get('/api/v1/health');
  const database = await request(app).get('/api/v1/health/db');

  assert.equal(health.status, 200);
  assert.equal(health.body.data.status, 'ok');
  assert.equal(database.status, 503);
  assert.equal(database.body.error.code, 'DATABASE_UNAVAILABLE');
});

test('CORS allows configured origins and omits headers for other origins', async () => {
  const corsApp = createApp({ ...env, CORS_ORIGINS: ['https://frontend.example.test'] });
  const allowed = await request(corsApp)
    .get('/api/v1/health')
    .set('Origin', 'https://frontend.example.test');
  const denied = await request(corsApp)
    .get('/api/v1/health')
    .set('Origin', 'https://unapproved.example.test');

  assert.equal(allowed.headers['access-control-allow-origin'], 'https://frontend.example.test');
  assert.notEqual(allowed.headers['access-control-allow-credentials'], 'true');
  assert.equal(denied.headers['access-control-allow-origin'], undefined);
});

test('API rate limiter returns the standard error envelope after its limit', async () => {
  const limitedApp = createApp({
    ...env,
    API_RATE_LIMIT_MAX: 2,
    API_RATE_LIMIT_WINDOW_MS: 60_000,
  });

  await request(limitedApp).get('/api/v1/health').expect(200);
  await request(limitedApp).get('/api/v1/health').expect(200);
  const limited = await request(limitedApp).get('/api/v1/health');

  assert.equal(limited.status, 429);
  assert.equal(limited.body.success, false);
  assert.equal(limited.body.error.code, 'RATE_LIMIT_EXCEEDED');
});

test('Zod request validation returns the standard validation envelope', async () => {
  const validationApp = express();

  validationApp.use(express.json());
  validationApp.post('/validate', validateRequest(z.object({ name: z.string() })), (_req, res) =>
    res.json({ success: true, data: res.locals.validatedRequest }),
  );
  validationApp.use(errorHandler);

  const response = await request(validationApp).post('/validate').send({ name: 42 });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
  assert.equal(response.body.error.details[0].field, 'name');
});

test('request logger omits query strings and sensitive headers', async () => {
  const loggerApp = express();
  const loggedMessages: string[] = [];
  const originalInfo = console.info;

  loggerApp.use(requestLogger);
  loggerApp.get('/safe', (_req, res) => res.sendStatus(200));
  console.info = (message?: unknown) => loggedMessages.push(String(message));

  try {
    await request(loggerApp)
      .get('/safe?password=query-secret')
      .set('Authorization', 'Bearer header-secret')
      .set('Cookie', 'session=cookie-secret')
      .expect(200);
  } finally {
    console.info = originalInfo;
  }

  assert.equal(loggedMessages.length, 1);
  assert.match(loggedMessages[0], /GET \/safe 200/);
  assert.doesNotMatch(loggedMessages[0], /query-secret|header-secret|cookie-secret/);
});
