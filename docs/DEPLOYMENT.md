# Deployment Strategy

This document defines the recommended deployment approach for the Sana'a Wedding Marketplace. It is a planning document only and does not create production infrastructure, define live secrets, or implement a final deployment pipeline.

## 1. Deployment Objectives

The deployment approach should support:

- isolated development, staging, and production environments
- secure configuration management
- MySQL-backed persistence through Prisma-based workflows
- safe rollout for public web, seller dashboards, and admin tools
- low-risk rollback and recovery behavior
- monitoring, health checks, and logging for operational stability

## 2. Environment Model

### Development

- local environment for feature work and debugging
- use local Docker services where appropriate
- use non-production credentials and test data only

### Staging

- environment for validation before production release
- should mirror production configuration where practical
- intended for business-rule verification and deployment readiness checks

### Production

- live marketplace environment for real users
- must enforce secure configuration and production safeguards
- must use HTTPS, secure cookies, and controlled secrets handling

## 3. Environment Separation

Each environment should have separate:

- app configuration
- database instance or logical database
- secrets and credentials
- CORS settings
- cookie policy
- rate limiting policy
- log levels
- health checks

The environments must remain isolated so a failure in development or staging does not affect production.

## 4. Environment Variables and Secrets

### Required categories

- database connection values
- JWT secret values
- session and cookie configuration
- base URLs for internal services
- CORS origin values
- logging configuration
- environment name
- app-specific flags

### Secrets handling

- secrets must never be committed to the repository
- secrets should be injected via environment variables or an approved secret manager
- no production credentials should be documented in the repository

## 5. MySQL and Prisma

### Database strategy

- MySQL 8+ remains the target database
- Prisma remains the intended ORM
- database configuration belongs in environment variables and deployment configuration

### Migration strategy

- Prisma migrations should be run as explicit deployment steps
- schema changes must be reviewed and verified before production rollout
- staging checks should validate migration safety before production promotion

### Migration principles

- this phase remains documentation-focused and does not create final schema work
- destructive database operations require explicit justification and approval
- rollback planning should be considered for any migration-heavy release

## 6. Docker and Build Process

### Docker

- Docker remains part of the development and environment standard
- local docker-based services should be used when needed for repeatability

### Build process

- backend should build with TypeScript
- frontend and admin apps should build with their respective tools
- build checks should run in CI and deployment pipelines

### Package manager

- pnpm remains the package manager
- monorepo layout remains the repository standard

## 7. Deployment Process

### Development deployment

- local or branch-based deployment for feature verification
- use test data and development credentials only

### Staging deployment

- requires successful build and validation checks
- migration safety should be validated in a non-production environment
- business rules should be checked before promotion

### Production deployment

- requires a controlled release workflow and health verification
- deployment should be reversible when needed
- special attention should be given to content visibility, subscription expiry, and moderation health

## 8. Health Checks and Monitoring

### Health checks

- provide an application health endpoint
- provide a readiness check for dependencies such as database connectivity
- monitor application uptime and service health

### Logging and monitoring

- capture application logs, request logs, and error logs
- log auth failures, moderation actions, subscription changes, and operational anomalies
- monitor SQL health, error rates, and peak marketplace activity

## 9. Backup, Restore, and Disaster Recovery

### Backup strategy

- schedule MySQL backups according to operational policy
- include data needed for platform continuity and business operations
- validate restore procedures regularly

### Restore considerations

- restore procedures should account for application configuration and DB state
- restoration should preserve seller records, subscription state, moderation history, and audit data
- avoid deleting seller data when content is hidden or a plan expires

### Rollback considerations

- rollback must account for both application and database migration changes
- rollback should minimize disruption and preserve data integrity

## 10. Production Security Requirements

- enforce HTTPS in production
- use secure cookie settings for authenticated sessions
- restrict CORS to approved origins
- apply rate limiting to public and protected endpoints
- keep JWTs off JavaScript-accessible storage
- keep admin routes separate from public routes
- enforce backend authorization boundaries at all protected access points

## 11. HTTPS, Cookies, and CORS

### HTTPS

- production deployment should redirect insecure HTTP traffic to HTTPS

### Cookie configuration

- development may use relaxed settings for local testing
- staging and production should use secure cookie policy and appropriate same-site settings

### CORS

- CORS must be limited to approved origins
- no broad wildcard CORS policy should be used in production

## 12. Rate Limiting and Failure Handling

### Rate limiting

- apply rate limiting to public browsing endpoints and auth flows
- protect admin and seller endpoints with additional abuse controls

### Failure handling

- design the app to fail gracefully when dependencies are unavailable
- return consistent error payloads
- maintain meaningful logs without exposing internal implementation details

## 13. Operational Runbooks

The project should maintain operational runbooks for:

- deployment process
- rollback process
- database restore and recovery
- auth incident response
- moderation incident response
- subscription expiry handling
- major data integrity anomalies
- logs and monitoring review

## 14. Deployment Constraints for This Phase

This phase remains focused on documentation and alignment. The deployment plan does not create infrastructure, define real production credentials, or commit secrets. It also avoids:

- premature production infrastructure choices
- vendor-specific implementation details beyond architecture-level planning
- front-loaded payment infrastructure work

## 15. Future Considerations

Future work may include:

- container orchestration patterns
- reverse proxy and load balancing configuration
- central log aggregation
- CI/CD automation
- performance benchmarking during seasonal wedding traffic peaks

## 16. Special Considerations for Wedding Marketplace Demand

Wedding marketplace traffic can be seasonal and campaign-driven. Future deployments should plan for:

- peak traffic periods before wedding seasons and special occasions
- image-heavy storefront pages and catalog views
- public search performance on category-heavy and city-localized listings
- admin workload increases during moderation and report review periods

These concerns should be handled with load planning and performance testing rather than speculative infrastructure assumptions.

- environment promotion workflows
- scheduled database backup verification
- application-level observability

## 16. Deployment Checklist

Before releasing any environment, the team should confirm:

- environment variables and secrets are in place
- MySQL connectivity and Prisma migrations are validated
- build completes successfully
- tests pass in that environment
- health endpoints behave as expected
- cookie and CORS settings are correct for the environment
- rate limits and security protections are active
- rollback plan is documented
- logs and monitoring are ready
- business rules are verified in a non-production environment before production release
