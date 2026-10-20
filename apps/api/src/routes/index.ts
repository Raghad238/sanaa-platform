import { Router } from 'express';

import { healthRouter } from './health.js';
import { createStoreActivationRouter } from './store-activation.js';

export const apiRouter: Router = Router();

apiRouter.use('/v1', healthRouter);
apiRouter.use('/v1', createStoreActivationRouter());
