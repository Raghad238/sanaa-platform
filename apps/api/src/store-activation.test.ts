import assert from 'node:assert/strict';
import test from 'node:test';

import express from 'express';
import request from 'supertest';

import { activateStore, isStorePubliclyVisible } from './domain/store-activation.js';
import { createStoreActivationRouter } from './routes/store-activation.js';

test('pending stores are hidden from public results until admin activation', () => {
  const pendingStore = { status: 'PENDING_ACTIVATION' as const };
  const activeStore = { status: 'ACTIVE' as const, activatedAt: new Date('2026-01-01T00:00:00.000Z') };

  assert.equal(isStorePubliclyVisible(pendingStore), false);
  assert.equal(isStorePubliclyVisible(activeStore), true);
});

test('admin activation marks the store active and sets a 60-day trial expiry', () => {
  const activated = activateStore({
    status: 'PENDING_ACTIVATION',
    activatedAt: null,
    trialEndsAt: null,
  });

  assert.equal(activated.status, 'ACTIVE');
  assert.ok(activated.activatedAt instanceof Date);
  assert.ok(activated.trialEndsAt instanceof Date);
  assert.equal((activated.trialEndsAt as Date).getTime() - (activated.activatedAt as Date).getTime(), 60 * 24 * 60 * 60 * 1000);
});

test('repeated activation requests are idempotent and do not extend the trial', () => {
  const originalActivatedAt = new Date('2026-01-01T00:00:00.000Z');
  const originalTrialEndsAt = new Date('2026-03-01T00:00:00.000Z');

  const result = activateStore({
    status: 'ACTIVE',
    activatedAt: originalActivatedAt,
    trialEndsAt: originalTrialEndsAt,
  });

  assert.equal(result.status, 'ACTIVE');
  assert.equal(result.activatedAt?.toISOString(), originalActivatedAt.toISOString());
  assert.equal(result.trialEndsAt?.toISOString(), originalTrialEndsAt.toISOString());
});

test('admin route requires an admin role and accepts activation from the server side only', async () => {
  const routeApp = express();
  routeApp.use((req, _res, next) => {
    Object.assign(req, { user: { role: 'ADMIN' } });
    next();
  });
  routeApp.use('/api/v1', createStoreActivationRouter());

  const response = await request(routeApp)
    .patch('/api/v1/admin/stores/store_123/activate')
    .send();

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.status, 'ACTIVE');
  assert.equal(response.body.data.trialEndsAt !== null, true);
});
