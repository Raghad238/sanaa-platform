# Coding Standards

This document defines the coding standards for the Sana'a Marketplace project and should be treated as the baseline standard for all future implementation work. These standards are documentation-only for Day 2 and do not create application code.

## 1. General Standards

### TypeScript
- Use TypeScript in strict mode for all implementation work.
- Prefer explicit types and clear interfaces over implicit any.
- Avoid unsafe type assertions unless there is a justified reason and documentation.

### Naming
- Use clear, descriptive names for domains, variables, functions, and modules.
- Favor domain language over UI or framework jargon whenever possible.
- Prefer names that communicate business meaning over technical shorthand.

### Small modules
- Keep modules focused and cohesive.
- Avoid large files with unrelated responsibilities.
- Split work by domain and boundary rather than by implementation convenience.

### Separation of concerns
- Keep API concerns separate from business logic.
- Keep persistence concerns separate from service logic.
- Keep validation separate from controller logic.
- Keep configuration separate from runtime logic.

## 2. Backend Architecture Standards

### Controllers
- Controllers handle HTTP concerns only.
- Controllers must not contain core business logic.
- Controllers should not directly query the database or implement domain rules.
- Controllers should delegate orchestration to services.

### Services
- Services own business logic.
- Services orchestrate workflows and policy checks.
- Services decide what constitutes valid state transitions.
- Services should coordinate repositories and shared domain operations.

### Repositories
- Repositories own persistence logic.
- Repositories should encapsulate Prisma and SQL-level logic.
- Repositories should not implement business policy or pricing rules.
- Repositories should not define visibility logic unrelated to persistence.

### Validation
- Use Zod to validate all external input.
- Validate request payloads, params, headers, and query values before business processing.
- Treat frontend validation as a convenience only.

### Error handling
- Centralize API error handling.
- Use consistent error types or error metadata across applications.
- Distinguish validation errors, not-found errors, authorization errors, and business rule violations.
- Do not leak sensitive internals in production responses.

## 3. Business Logic Ownership

The backend is the source of truth for the following:
- permissions
- subscription status
- product limits
- store status
- product/service status
- review eligibility
- admin authorization
- payment state

This must be enforced in backend services and repository-backed logic. Frontend state is never the authoritative source.

## 4. API and Contract Standards

- Keep API contracts clear and consistent.
- Do not change API contracts silently.
- Use shared types and contract validation patterns where applicable.
- Keep response shapes stable and documented.
- Avoid hidden breaking changes across routes and payloads.

## 5. Business Rule Standards

### No duplicated business logic
- Do not duplicate rules across controllers, routes, frontend code, or ad hoc utilities.
- Put business rules in the service layer or shared domain logic.

### No unnecessary abstractions
- Do not over-engineer small domain problems.
- Add abstraction only when it improves clarity, testability, or long-term maintainability.

### No hardcoded product configuration
- Do not hardcode subscription limits.
- Do not hardcode categories.
- Do not hardcode business configuration that belongs in the database.
- Current plan values are retained as product defaults but should become database-driven as the system matures.

### No approval workflow changes
- Do not create approval workflows for Store, Product, or Service publication.
- The business model requires immediate activation without admin pre-approval.

## 6. Security Standards

- Never commit secrets.
- Use environment variables for configuration values and credentials.
- Never trust frontend validation.
- Protect all sensitive APIs behind authentication and authorization.
- Enforce authorization in backend layers, not in the browser.
- Restrict direct database access to repository boundaries.
- Use HTTP-only cookies for JWT-based auth when implemented.

## 7. Environment and Configuration Standards

- Store environment configuration separately from code.
- Use explicit environment variable contracts.
- Ensure production defaults and dev defaults are clearly separated.
- Avoid writing secrets into config files or repository contents.

## 8. Testing Standards

- New behavior requires tests.
- Tests should validate real behavior rather than mock-only outcomes.
- Favor automated tests for service layer rules and edge cases.
- Include validation tests for permissions, status transitions, and business rules.
- Do not claim tests passed unless they were actually executed.

## 9. Lint, Formatting, and Import Standards

### Linting
- Keep lint rules enforced consistently across code.
- Use shared ESLint configuration from the repository packages.

### Formatting
- Format code consistently.
- Follow project formatting conventions and avoid ad hoc formatting.

### Imports
- Use explicit imports.
- Avoid circular imports.
- Prefer stable and well-organized package boundaries.

## 10. Async and Transaction Standards

### Async error handling
- Handle promise rejections explicitly.
- Avoid unhandled async failures.
- Use consistent patterns for transaction boundaries and error propagation.

### Database transactions
- Wrap multi-step state changes in transactions when they are interdependent.
- Use transactions for state transitions that must be atomic, such as subscription-related updates and moderation enforcement when applicable.
- Keep transaction boundaries narrowly scoped to the needed workflow.

## 11. File Organization Standards

- Organize files by domain and responsibility.
- Keep route files, controller files, service files, and repository files in clear folders.
- Keep shared validation and types in dedicated packages.
- Keep configuration and environment concerns isolated.
- Avoid mixing domain logic into UI code.

## 12. Security and Authorization Rules

- Never trust client-side state for permissions.
- Server-side checks are the authority for:
  - admin authorization
  - store ownership
  - product ownership
  - service ownership
  - subscription state
  - review eligibility
  - product limit enforcement
  - status transitions
- Do not expose protected or account-bound information to unauthenticated users.

## 13. Data Integrity and Preservation Standards

- Do not delete seller data when subscription or trial expires.
- Prefer soft deletion or preservation for records where historical or business continuity data matters.
- Keep audit records for moderation and operational changes.
- Avoid destructive database operations without explicit justification and approval.

## 14. Payment Domain Standards

- The implementation must not integrate Jaib before the final payment phase.
- Database models may support SubscriptionPlan, Subscription, and Payment domain concepts from the early phase.
- Payment provider logic should remain abstract and should not be hardcoded to a future provider implementation before the correct phase.

## 15. Implementation Discipline

- Stay within the scope of the current development day.
- Do not continue automatically to another feature.
- Read relevant documentation before modifying code.
- Review git diff before considering work complete.
- Never change architecture or business rules silently.
- If architecture or documentation conflicts are discovered, stop and report them.

## 16. Completion Standards

Before completing a coding day, the team should run the applicable quality checks for the implementation stage, including:
- typecheck
- lint
- tests
- build

This requirement applies when the relevant implementation artifacts exist. The Day 2 documentation phase does not create application code, so no code-based checks are executed here.
