import { Router } from 'express';

import { AppError } from '../common/errors/app-error.js';
import { successResponse } from '../common/utils/response.js';

export type DatabaseHealthCheck = () => Promise<unknown>;

async function checkDatabaseConnection(): Promise<unknown> {
  const databasePackageName = '@sanaa-platform/database';
  const { prisma } = await import(databasePackageName);

  return prisma.$queryRaw`SELECT 1`;
}

export function createHealthRouter(
  checkDatabase: DatabaseHealthCheck = checkDatabaseConnection,
): Router {
  const healthRouter: Router = Router();

  healthRouter.get('/health', (_req, res) => {
    res.status(200).json(successResponse({ status: 'ok' }));
  });

  healthRouter.get('/health/db', (_req, res, next) => {
    void checkDatabase()
      .then(() => {
        res.status(200).json(successResponse({ status: 'ok', database: 'connected' }));
      })
      .catch(() => {
        next(new AppError(503, 'DATABASE_UNAVAILABLE', 'Database is unavailable.'));
      });
  });

  return healthRouter;
}

export const healthRouter = createHealthRouter();
