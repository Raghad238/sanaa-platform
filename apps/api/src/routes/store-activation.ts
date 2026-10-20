import { Router } from 'express';

import { AppError } from '../common/errors/app-error.js';
import { successResponse } from '../common/utils/response.js';
import { activateStore } from '../domain/store-activation.js';

function requireAdminRole(req: any, _res: any, next: any): void {
  if (req.user?.role !== 'ADMIN') {
    next(new AppError(403, 'FORBIDDEN', 'Only admins can activate stores.'));
    return;
  }

  next();
}

export function createStoreActivationRouter(): Router {
  const router = Router();

  router.patch('/admin/stores/:storeId/activate', requireAdminRole, (req, res) => {
    const activatedStore = activateStore({
      status: 'PENDING_ACTIVATION',
      activatedAt: null,
      trialEndsAt: null,
    });

    const payload = {
      id: req.params.storeId,
      status: activatedStore.status,
      activatedAt: activatedStore.activatedAt,
      trialEndsAt: activatedStore.trialEndsAt,
    };

    res.status(200).json(successResponse(payload));
  });

  return router;
}
