import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    DATABASE_URL: z.string().min(1).optional(),
    CORS_ORIGINS: z.string().optional(),
    API_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
    API_RATE_LIMIT_MAX: z.coerce.number().int().positive().optional(),
  })
  .superRefine((values, context) => {
    const origins =
      values.CORS_ORIGINS?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean) ?? [];

    if (values.NODE_ENV === 'production' && origins.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['CORS_ORIGINS'],
        message: 'CORS_ORIGINS is required in production.',
      });
    }

    if (['staging', 'production'].includes(values.NODE_ENV) && !values.DATABASE_URL) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['DATABASE_URL'],
        message: 'DATABASE_URL is required in staging and production.',
      });
    }

    if (values.DATABASE_URL) {
      try {
        if (new globalThis.URL(values.DATABASE_URL).protocol !== 'mysql:') {
          throw new Error('Invalid protocol');
        }
      } catch {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['DATABASE_URL'],
          message: 'DATABASE_URL must be a valid MySQL connection URL.',
        });
      }
    }

    if (origins.includes('*')) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['CORS_ORIGINS'],
        message: 'Wildcard CORS origins are not allowed.',
      });
    }

    for (const origin of origins) {
      try {
        const parsedOrigin = new globalThis.URL(origin);
        if (
          !['http:', 'https:'].includes(parsedOrigin.protocol) ||
          parsedOrigin.origin !== origin
        ) {
          throw new Error('Invalid origin');
        }
      } catch {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['CORS_ORIGINS'],
          message: 'CORS_ORIGINS must contain absolute HTTP(S) origins without paths.',
        });
      }
    }
  });

export type AppEnv = {
  NODE_ENV: z.infer<typeof envSchema>['NODE_ENV'];
  PORT: number;
  DATABASE_URL?: string;
  CORS_ORIGINS: string[];
  API_RATE_LIMIT_WINDOW_MS: number;
  API_RATE_LIMIT_MAX: number;
};

export function parseEnv(input: Record<string, string | undefined>): AppEnv {
  const values = envSchema.parse(input);
  const defaultOrigins = ['http://localhost:3000', 'http://localhost:3001'];

  return {
    NODE_ENV: values.NODE_ENV,
    PORT: values.PORT,
    ...(values.DATABASE_URL ? { DATABASE_URL: values.DATABASE_URL } : {}),
    CORS_ORIGINS:
      values.CORS_ORIGINS?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean) ?? (values.NODE_ENV === 'production' ? [] : defaultOrigins),
    API_RATE_LIMIT_WINDOW_MS: values.API_RATE_LIMIT_WINDOW_MS,
    API_RATE_LIMIT_MAX:
      values.API_RATE_LIMIT_MAX ?? (values.NODE_ENV === 'production' ? 100 : 1000),
  };
}

export const env = parseEnv(process.env);

export const isProduction = env.NODE_ENV === 'production';
