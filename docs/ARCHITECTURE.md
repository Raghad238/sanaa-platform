# Architecture

This document describes the target architecture for Sana'a Marketplace. It is a design-level document only and does not create application code or implement APIs, database schemas, or payment integrations.

## 1. Product Architecture Overview

The platform is divided into three primary functional domains:

- Public marketplace website
- Seller dashboard / operations area
- Admin dashboard / moderation and governance area

These three domains share a common backend and data model but are intentionally separated in responsibility and access boundaries.

## 2. Target Technology Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS

### Admin

- Next.js
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- MySQL 8+

### ORM

- Prisma

### Validation

- Zod

### Authentication

- JWT
- HTTP-only cookies

### Development / Tooling

- Docker
- pnpm

### Repository structure

- pnpm monorepo
- apps/
  - web/
  - api/
  - admin/
- packages/
  - database/
  - types/
  - validation/
  - config/
  - eslint-config/

This is the intended monorepo layout and is documented for architecture planning only. The applications are not created in Day 2.

## 3. High-Level Architecture

Public web application
↓
API layer
↓
Business services
↓
Repository layer
↓
MySQL database via Prisma

The architecture follows a layered service model in which the backend owns business logic, permissions, and state transitions.

## 4. Backend Layering

The backend should be organized using the following sequence:

Route
↓
Controller
↓
Service
↓
Repository
↓
Database

### 4.1 Route

Responsibilities:

- define HTTP routes
- group endpoints by domain or resource
- compose middleware for auth, roles, rate limiting, request context, and request logging
- delegate to controller handlers
- do not contain business logic

### 4.2 Controller

Responsibilities:

- handle HTTP concerns only
- parse request data, params, query, and body
- call services with validated context
- translate domain errors into HTTP responses
- return consistent API response shapes
- do not contain business rules or persistence logic

Important rule:

- Controllers must not contain core business logic.

### 4.3 Service

Responsibilities:

- enforce business rules
- orchestrate business logic across repositories and domain objects
- validate business conditions
- determine visibility, status, eligibility, and moderation outcomes
- coordinate transactions where required
- own the business rules for subscription, moderation, review eligibility, and permissions

Important rule:

- Services own business logic.

### 4.4 Repository

Responsibilities:

- encapsulate persistence and database access
- execute Prisma queries
- map database entities to domain semantics when needed
- hide database-specific implementation details from services
- own persistence logic only

Important rule:

- Repositories own persistence logic.

### 4.5 Database

Responsibilities:

- store persisted marketplace records
- support MySQL 8+ and Prisma-based data access
- enforce integrity rules where practical
- keep domain data model aligned with business requirements

## 5. Validation and Input Boundaries

### 5.1 Validation layer

- Use Zod schemas for external input validation.
- Validation occurs at the API boundary before business logic.
- Validation ensures data consistency and server-side safety.
- Frontend validation is never considered authoritative.

### 5.2 Validation boundaries

- Route/middleware layer may run schema validation for request payloads.
- Controllers should not trust raw input.
- Business services should still validate critical domain state when required.
- The backend is the source of truth for permissions, subscription status, product limits, store status, listing status, review eligibility, admin authorization, and payment state.

## 6. Authentication and Authorization Boundaries

### 6.1 Authentication boundaries

- Public marketplace access remains unauthenticated.
- Seller and admin functions require authenticated sessions.
- Authentication should use JWTs issued to the server and stored in HTTP-only cookies.
- Tokens should be validated centrally before protected endpoints are processed.

### 6.2 Authorization boundaries

- Permission checks must occur in backend service or middleware boundaries.
- Seller authorization is based on store ownership, role assignment, and policy checks.
- Admin authorization is separate and must be enforced independently from seller role checks.
- Authorization must not be inferred from frontend state.

### 6.3 Security boundaries

- API server must enforce access control at the backend.
- Public routes can be anonymous but must not expose protected or account-level business data.
- Sensitive fields and internal system data must be redacted from public responses.
- Secrets must never be committed to source code or configuration files.

## 7. Error Handling and Logging

### 7.1 Error handling

- Centralize API error handling.
- Domain rules should raise structured business errors or service-level errors.
- Controllers should translate errors into standard HTTP responses without leaking internal data.
- Validation failures, authorization failures, and business rule violations must be clearly distinguishable.

### 7.2 Logging

- Log security-relevant events and operational actions.
- Log admin moderation actions, report actions, subscription status changes, and process failures.
- Keep logs operational and separate from business data rendering.

## 8. Configuration and Shared Data

### 8.1 Configuration

- Configuration must use environment variables.
- No secrets should be committed to source control.
- Values that belong in business configuration should be stored in the database when appropriate.

### 8.2 Shared types

- Shared domain types and interfaces should live in a common package rather than being duplicated across apps and packages.
- Shared contracts should be versioned and kept consistent.

### 8.3 Database package

- Prisma should be packaged in a central database layer.
- Database access should be encapsulated via the repository layer.
- A shared package should be used for Prisma schema management and generated types if appropriate for the repo structure.

## 9. Frontend / API Separation

- Public-facing marketplace pages should be served by a dedicated web app or UI surface.
- Seller dashboard and admin dashboard should remain distinct from each other and from public pages.
- Frontend apps should rely on API contracts and not duplicate system-of-record business logic.
- Public browsing may be performed without login, but protected actions must call authenticated APIs.

## 10. Admin / API Separation

- Admin functionality should be isolated in a dedicated admin app or internal admin surface.
- Admin routes must enforce backend authorization.
- Admin workflows should not be exposed to the public marketplace code path.
- Moderation, subscription management, payment record review, and user management should be protected by clear admin-only API boundaries.

## 11. Dependency Direction

The intended dependency direction is:

- apps/web → packages/types, packages/validation, api contracts
- apps/admin → packages/types, packages/validation, api contracts
- api → services → repositories → database package
- packages/validation → no dependency on application runtime logic
- packages/config → shared config only

The important rule is that high-level layers must not depend on lower-level implementation concerns directly. Domain logic should not leak into the frontend or route layer.

## 12. Data Model Principles

- Business configuration such as subscription plan values, category datasets, and status definitions should eventually be database-driven where appropriate.
- Public visibility should be derived from active status and business policy, not from ad hoc client-side assumptions.
- Product limits, subscription state, review eligibility, and store status must be enforced by the backend.
- Data retention should favor preservation and soft deletion over destructive deletion for critical seller and moderation records.

## 13. Payment Architecture

### 13.1 Current architecture position

- The database must support the following domain concepts from early stages:
  - SubscriptionPlan
  - Subscription
  - Payment
- Actual Jaib integration is explicitly not part of the current implementation.
- Jaib API integration is deferred to the final payment integration phase.

### 13.2 Provider abstraction

- A payment provider abstraction can be introduced during the final payment phase.
- This abstraction should isolate provider-specific logic from the core subscription and payment domain in a future implementation stage.
- The abstraction should not be designed prematurely as a fictional Jaib implementation.

### 13.3 Explicit constraints

- Do not invent Jaib endpoints.
- Do not invent Jaib authentication flows.
- Do not invent Jaib webhooks.
- Do not implement JeebProvider or JaibProvider in this architecture document.
- This document only establishes an architecture-ready domain plan for future payment integration.

## 14. Business Domain Boundaries

### 14.1 Public marketplace domain

- store discovery
- product discovery
- service discovery
- search and discover surfaces
- category browsing
- public listing pages
- offer discovery

### 14.2 Seller domain

- account lifecycle
- seller store management
- product/service management
- subscription overview
- notification access
- admin note visibility

### 14.3 Admin domain

- moderation
- suspension and reactivation
- report handling
- category management
- store and listing review
- subscription oversight
- audit review

## 15. Architecture Principles

- Keep business rules in the backend services.
- Keep persistence logic in repositories.
- Validate all incoming input.
- Treat frontend validation as convenience, not truth.
- Avoid duplicated business logic.
- Avoid unnecessary abstraction before the need is clear.
- Prefer small, cohesive modules.
- Prefer explicit contracts and API boundaries.
- Keep public, seller, and admin access separated.
- Favor data preservation and operational traceability over destructive deletion.

## 16. Non-Goals for the Current Phase

- full Jaib implementation
- complete payment automation beyond domain design
- creation of apps/admin/web/api projects
- build of production-grade frontend features
- full database schema implementation
- any API implementation beyond architecture documentation
