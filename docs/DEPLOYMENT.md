# Deployment Strategy

This document defines the recommended deployment approach for Sana'a Marketplace. It is a planning document only and does not create production infrastructure, initialize applications, or commit secrets.

## 1. Deployment objectives

The deployment approach should support:

- isolated development, staging, and production environments
- secure configuration management
- MySQL-backed persistence through Prisma-based workflows
- safe deployment for the public marketplace, seller dashboard, and admin dashboard
- low-risk rollout and rollback behavior
- operational logging, monitoring, and health checks

## 2. Environment Model

### Development

- Local or team environment for day-to-day implementation
- Intended for feature work, iteration, and debugging
- Should use local Docker-based services where applicable
- Use development credentials and non-production environment variables only

### Staging

- Environment for validation before production release
- Should mirror production configuration as closely as practical without exposing production data
- Intended for final verification of business rules, API responses, moderation flows, and deployment checks

### Production

- Real marketplace environment for live users
- Must enforce production security and operational controls
- Must use HTTPS, strict secrets handling, and protection against misuse

## 3. Environment Separation

Each environment should have its own:

- app configuration
- database instance or logical database
- secrets
- CORS settings
- cookie policy configuration
- rate limiting policy
- log level
- health check endpoints

The environments must remain isolated so a failure in development or staging does not affect production.

## 4. Environment Variables and Secrets

### Required categories of environment variables

- database connection values
- JWT secret material
- session or cookie configuration
- API base URLs for internal services
- CORS origin values
- logging configuration
- environment name
- app-specific flags

### Secrets handling

- Secrets must never be committed into the repository.
- Secrets should be injected via environment variables or secret management systems supported by the deployment environment.
- No real credentials or production secret values are to be documented in the repository.

## 5. MySQL and Prisma

### Database strategy

- MySQL 8+ is the backend database target.
- Prisma is the intended ORM.
- Database configuration must stay in environment variables and deployment configuration.

### Prisma migration strategy

- Prisma migrations should be run as an explicit deployment step.
- Database schema changes must be versioned and reviewed before production rollout.
- Migration execution should be coordinated with application release sequencing.
- Migration safety should be validated in staging before production deployment.

### Database migration principles

- Do not create database schemas in Day 3; this is a documentation-only phase.
- Do not perform destructive database operations without explicit justification and approval.
- Migration rollback needs to be considered before applying changes to production data.

## 6. Docker and Build Process

### Docker

- Docker is part of the development architecture target.
- Docker should be used to standardize local service configuration and ensure the runtime environment is repeatable.

### Build process

- The backend should build with TypeScript.
- The frontend and admin applications should build using their respective frameworks and tools.
- Build steps should run in CI and in deployment pipelines before release.

### Package manager

- pnpm is the target package manager.
- Repository layout is expected to be a monorepo with shared packages and application workspaces.

## 7. Deployment Process

### Development deployment

- Local or branch-based deployment for active feature testing.
- Use development credentials and test data only.
- Keep logs and debugging output explicit and isolated.

### Staging deployment

- Requires successful build and test validation.
- Must run migration checks in a non-production environment.
- Verified business rule checks should be performed before promotion.

### Production deployment

- Must follow a controlled release process with readiness checks.
- Production deployment should include health verification before broad user access is allowed.
- Deployment should be reversible through rollback planning.

## 8. Health Checks and Monitoring

### Health checks

- Provide a health endpoint to confirm the application is alive.
- Provide a readiness endpoint for dependencies and infrastructure checks.
- Health checks should cover application uptime and database readiness where relevant.

### Logging

- Capture application logs, error logs, request logs, and operational metrics.
- Log security-sensitive actions such as auth failures, moderation actions, subscription changes, and admin operations.

### Monitoring

- Monitor service health, database availability, high error rates, and critical exceptions.
- Track major business events such as subscription expiration, content visibility changes, and moderation outcomes.
- Monitor rate limits, warnings, and abnormal traffic patterns.

## 9. Backup, Restore, and Disaster Recovery

### Backup strategy

- MySQL backups should be scheduled and retained according to operational policy.
- Backup coverage should include application data required for marketplace continuity.
- Backup validation should be part of regular operational checks.

### Restore considerations

- Restoration procedures should define the expected steps to recover database state and application configuration.
- Recovery should preserve audit data, seller information, and subscription records without deleting seller data.

### Rollback considerations

- Rollback plans should account for application deployment and database migration changes.
- If a release introduces issues, rollback should be designed to minimize disruption and preserve data integrity.

## 10. Production Security Requirements

- Require HTTPS in production.
- Use secure cookie configuration in production.
- Restrict CORS to approved origins.
- Apply rate limiting to public and authenticated endpoints as needed.
- Ensure JWTs are handled securely and not exposed in JavaScript-accessible storage.
- Keep admin routes separate from public routes.
- Restrict access to admin and seller APIs through backend authorization boundaries.

## 11. HTTPS, Cookies, and CORS

### HTTPS expectations

- Production deployment should enforce HTTPS.
- Redirect insecure HTTP traffic to HTTPS.

### Cookie configuration by environment

- Development may use relaxed cookie configuration when necessary for local testing.
- Staging and production should use secure cookie settings with appropriate domain, path, and same-site settings.
- JWT + HTTP-only cookies should be configured to minimize client-side access and cross-site risk.

### CORS configuration

- CORS must be limited to approved frontends and admin surfaces.
- Public websites and admin dashboards should not share more access than needed.
- No broad wildcard CORS policy should be used in production.

## 12. Rate Limiting and Failure Handling

### Rate limiting

- Apply rate limiting to public endpoints where appropriate.
- Protect auth flows and high-risk endpoints with stricter limits.
- Admin APIs should also have operational throttling and abuse protections.

### Failure handling

- Design the app to fail gracefully when dependencies are unavailable.
- Handle dependency errors without exposing internal information.
- Return consistent error payloads and meaningful operational logs.
- Use health checks to identify failing services and protect user experience during downtime.

## 13. Operational Runbook Expectations

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

This is documentation-only Day 3 work. The deployment plan does not create infrastructure or define production credentials. It intentionally avoids:

- committing secrets
- choosing paid infrastructure without explicit product requirements
- inventing production credentials
- creating live deployment assets

## 15. Future Considerations

Future deployment work may include:

- container orchestration patterns
- production load balancing and reverse proxy configuration
- centralized log pipelines
- CI/CD pipeline automation
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
