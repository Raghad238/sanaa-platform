# Coding Standards

This document defines the coding standards for the Sana'a Wedding Marketplace project and should be treated as the baseline standard for future implementation work. These standards are documentation-only for the current day and do not create application code.

## 1. General Standards

### TypeScript

- Use TypeScript in strict mode for implementation work.
- Prefer explicit types and clear interfaces over implicit any.
- Avoid unsafe assertions unless there is a documented reason.

### Naming

- Use clear, descriptive names for domains, variables, functions, and modules.
- Favor domain language over UI or framework jargon.

### Small modules

- Keep modules focused and cohesive.
- Avoid large files with unrelated responsibilities.

### Separation of concerns

- Keep API concerns separate from business logic.
- Keep persistence concerns separate from service logic.
- Keep validation separate from controller logic.
- Keep configuration separate from runtime logic.

## 2. Backend Architecture Standards

### Controllers

- Controllers handle HTTP concerns only.
- Controllers must not contain core business logic.
- Controllers delegate orchestration to services.

### Services

- Services own business logic.
- Services orchestrate workflows and policy checks.
- Services decide valid state transitions.

### Repositories

- Repositories own persistence logic.
- Repositories encapsulate Prisma and database-level detail.
- Repositories do not define business policy or category taxonomy behavior.

### Validation

- Use Zod for external input validation.
- Validate request payloads and query values before business processing.

### Error handling

- Centralize API error handling.
- Distinguish validation, authorization, business-rule, and not-found errors.

## 3. Business Logic Ownership

The backend is the source of truth for:

- permissions
- subscription state
- listing limits
- store status
- review eligibility
- admin authorization
- visibility rules

Frontend state is never authoritative.

## 4. API and Contract Standards

- Keep contracts clear and consistent.
- Do not change API contracts silently.
- Keep response shapes stable and documented.

## 5. Business Rule Standards

### No duplicate business logic

- Do not duplicate rules across controllers, routes, frontend code, or ad hoc utilities.
- Keep business rules in service layer or shared domain logic.

### No hardcoded configuration

- Do not hardcode subscription values.
- Do not hardcode categories or wedding vendor taxonomies.
- Do not hardcode business configuration that belongs in the database.

### No approval workflow changes

- Do not create admin approval workflows for store, product, or service activation.
- The business model requires immediate activation without pre-approval.

### No static category lists

- Never embed a fixed wedding category list in code as a replacement for data-driven taxonomy.
- The admin-managed category model must remain dynamic and not require code changes to add a category.

## 6. Security Standards

- Never commit secrets.
- Use environment variables and secure configuration.
- Never trust frontend validation.
- Protect APIs with backend authorization.
- Use HTTP-only cookies for JWT-based auth when implemented.

## 7. Environment and Configuration Standards

- Store environment configuration separately from code.
- Use explicit environment variable contracts.
- Ensure production and development defaults are clearly separated.

## 8. Testing Standards

- New behavior requires tests.
- Tests should validate real behavior rather than mock-only outcomes.
- Include validation tests for permissions, visibility states, and review eligibility.
- Do not claim a test passed unless it was actually executed.

## 9. Lint, Formatting, and Import Standards

### Linting

- Keep lint rules enforced consistently across the monorepo.

### Formatting

- Format code consistently.
- Follow the repository’s existing style and avoid ad hoc formatting.

### Imports

- Use explicit imports.
- Avoid circular imports.

## 10. Async, Transaction, and Data Standards

- Handle promise rejections explicitly.
- Use transactions where multi-step state changes must be atomic.
- Preserve seller data when subscription or trial expires.

## 11. File Organization Standards

- Organize files by domain and responsibility.
- Keep route, controller, service, and repository files separated.
- Keep validation and types in shared packages.

## 12. Security and Authorization Rules

- Never trust client-side state for permissions.
- Server-side checks remain authoritative for:
  - admin authorization
  - store ownership
  - product and service ownership
  - subscription state
  - review eligibility
  - status transitions

## 13. Data Integrity and Preservation Standards

- Do not delete seller data when a subscription or trial expires.
- Prefer visibility changes or soft deletion where historical continuity matters.
- Keep moderation and audit records for operational traceability.

## 14. Payment Domain Standards

- Do not integrate a real payment provider in this phase.
- Keep payment domain concepts abstract and future-facing until the final payment stage.

## 15. Implementation Discipline

- Stay within the scope of the current development day.
- Read the relevant documentation before modifying code.
- Review git diff before considering work complete.
- If architecture or documentation conflicts appear, stop and report them.

## 16. Completion Standards

Before completing a coding day, run the relevant checks for the implementation in scope, including:

- typecheck
- lint
- tests
- build

If a required check is not relevant, document the reason explicitly.

- lint
- tests
- build

This requirement applies when the relevant implementation artifacts exist. The Day 2 documentation phase does not create application code, so no code-based checks are executed here.
