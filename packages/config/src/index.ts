type EnvironmentLike = {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

export const appConfig = {
  appName: "Sana'a Platform",
  environment:
    (globalThis as typeof globalThis & EnvironmentLike).process?.env?.NODE_ENV ?? 'development',
} as const;
