import assert from 'node:assert/strict';
import test from 'node:test';

import express from 'express';
import request from 'supertest';

import app from './app.js';
import { errorHandler } from './middleware/error-handler.js';

test('GET /api/v1/health returns ok', async () => {
  const response = await request(app).get('/api/v1/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.status, 'ok');
});

test('GET /api/v1/unknown returns 404 JSON', async () => {
  const response = await request(app).get('/api/v1/unknown');

  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
  assert.match(response.body.error.code, /NOT_FOUND|RESOURCE_NOT_FOUND/i);
});

test('centralized error handler returns structured error', async () => {
  const errorApp = express();
  const loggedMessages: string[] = [];
  const originalError = console.error;

  errorApp.get('/boom', () => {
    throw new Error('private internal detail');
  });
  errorApp.use(errorHandler);

  console.error = (message?: unknown) => loggedMessages.push(String(message));
  let response;

  try {
    response = await request(errorApp).get('/boom');
  } finally {
    console.error = originalError;
  }

  assert.equal(response.status, 500);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, 'INTERNAL_ERROR');
  assert.equal(typeof response.body.error.message, 'string');
  assert.doesNotMatch(JSON.stringify(response.body), /private internal detail|stack/i);
  assert.doesNotMatch(loggedMessages.join(' '), /private internal detail/);
});
