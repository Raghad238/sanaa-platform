import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

type RequestSource = 'body' | 'params' | 'query';

export function validateRequest(schema: ZodType, source: RequestSource = 'body'): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      next(result.error);
      return;
    }

    const validated = (res.locals.validatedRequest ?? {}) as Partial<
      Record<RequestSource, unknown>
    >;
    res.locals.validatedRequest = { ...validated, [source]: result.data };
    next();
  };
}
