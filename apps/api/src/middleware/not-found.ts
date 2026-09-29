import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../common/errors/app-error.js';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, 'RESOURCE_NOT_FOUND', `Route not found: ${req.method} ${req.path}`));
}
