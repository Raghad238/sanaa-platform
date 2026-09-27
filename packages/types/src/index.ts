export type AppEnvironment = 'development' | 'staging' | 'production';

export interface PlatformConfig {
  appName: string;
  environment: AppEnvironment;
}
