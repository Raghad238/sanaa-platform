import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError } from '../common/errors/app-error.js';
import { errorResponse } from '../common/utils/response.js';

export function errorHandler(error: unknown, _req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json(
      errorResponse(
        'VALIDATION_ERROR',
        'Request validation failed.',
        error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })),
      ),
    );
    return;
  }

  if (
    error instanceof AppError &&
    error.statusCode === 503 &&
    error.code === 'DATABASE_UNAVAILABLE'
  ) {
    res.status(503).json(errorResponse('DATABASE_UNAVAILABLE', 'Database is unavailable.'));
    return;
  }

  if (error instanceof AppError && error.statusCode >= 400 && error.statusCode < 500) {
    res.status(error.statusCode).json(errorResponse(error.code, error.message, error.details));
    return;
  }

  console.error('Unhandled API error.');
  res.status(500).json(errorResponse('INTERNAL_ERROR', 'An unexpected error occurred.'));
}
