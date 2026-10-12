# Architecture

This document describes the target architecture for the Sana'a Wedding Marketplace. It is design-level guidance only and does not create application code or implement the final database schema, APIs, or payment flows.

## 1. Product Architecture Overview

The platform is divided into three primary domains:

- public marketplace website
- seller dashboard and storefront management
- admin dashboard for moderation and governance

The three domains share a common backend and data model but remain separate in responsibility, access patterns, and business rules.

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

### Development and tooling

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

This repo structure is the currently accepted baseline for the project. The architecture remains a planning document for this phase and does not expand beyond the current day’s scope.

## 3. High-Level Architecture

Public web app
↓
API layer
↓
Business services
↓
Repository layer
↓
MySQL database via Prisma

The backend remains the owner of business logic, permissions, visibility checks, and status transitions.

## 4. Backend Layering

The backend should follow this sequence:

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

- define API routes by domain or resource
- group middleware for auth, roles, rate limiting, request logging, and request validation
- delegate to controller logic
- keep route files thin and not business-heavy

### 4.2 Controller

Responsibilities:

- handle HTTP concerns only
- parse params, query, and body
- call services with validated data
- convert domain errors into HTTP responses
- keep response contracts consistent

### 4.3 Service

Responsibilities:

- enforce business rules
- coordinate domain logic across repositories
- decide visibility and moderation outcomes
- validate subscription status, store ownership, and review eligibility
- coordinate transactions where needed

### 4.4 Repository

Responsibilities:

- encapsulate persistence logic
- execute Prisma queries
- hide database details from services
- keep persistence concerns separate from business rules

### 4.5 Database

Responsibilities:

- store persistent marketplace records
- support MySQL 8+ and Prisma access
- enforce integrity constraints where practical
- keep the business model aligned with the PRD and business rules

## 5. Dynamic Category Architecture

### 5.1 Design principle

Categories are not a fixed frontend list. They are a data-driven business domain controlled by admin actions and stored in the data layer.

The platform should support:

- creating categories
- editing category names and descriptions
- reordering categories
- enabling or disabling categories
- creating hierarchical relationships between parent and child categories
- storing category metadata and custom field definitions where needed by category type

### 5.2 Why this matters

Wedding-related categories evolve constantly. New niches may appear, such as a specific event style, a décor service, a new venue category, or a specialized package. Those categories should be manageable without code changes or application redeploys.

### 5.3 Recommended architecture pattern

The architecture should treat categories as a dynamic domain entity with at least the following characteristics:

- id
- parentCategoryId
- name
- slug
- description
- sortOrder
- isActive
- createdAt / updatedAt
- optional metadata for category-specific fields

These values should be stored in the database and resolved at runtime by the API. Public and admin pages read them from the backend instead of relying on a static list in UI code.

### 5.4 Category field configuration

When a category requires different data fields from another category, the system should capture those fields as category configuration metadata rather than hardcoding one-off UI logic. The platform should support the principle that category configuration can vary by category without requiring a new code push.

This is a future-ready design concept for the right phase and should not be forced into a database design before the team reaches the relevant implementation day.

## 6. Validation and Input Boundaries

### 6.1 Validation layer

- use Zod at the API boundary for external input
- validate request payloads before service logic executes
- keep frontend validation as convenience only

### 6.2 Business validation

- service layer remains the source of truth for visibility, subscription state, ownership, moderation, and review eligibility
- backend must enforce all authorization and policy rules

## 7. Authentication and Authorization

### 7.1 Authentication boundaries

- public browsing remains unauthenticated
- seller and admin actions require authenticated sessions
- JWT should be issued by the server and stored in HTTP-only cookies

### 7.2 Authorization boundaries

- authorization checks occur in backend services and middleware
- seller ownership must be verified against the authenticated user and store association
- admin authorization remains independent from seller role checks

## 8. Error Handling, Logging, and Observability

### 8.1 Error handling

- centralize API error handling
- distinguish validation, authorization, business-rule, not-found, and internal errors
- avoid exposing internal stack traces to clients

### 8.2 Logging

- log auth failures, moderation changes, subscription states, and operational anomalies
- keep business logs separate from display or presentation logic

## 9. Configuration and Shared Data

### 9.1 Configuration

- use environment variables for secret and deployment configuration
- do not commit secrets to source control
- keep business configuration in the database when appropriate

### 9.2 Shared types and contracts

- shared domain types belong in a common package
- avoid duplicating business rules across apps

## 10. Frontend, Admin, and API Separation

- public storefront pages remain distinct from seller and admin dashboards
- seller dashboard focuses on store operations
- admin dashboard focuses on moderation, categories, subscriptions, and reports
- frontend apps should rely on stable API contracts, not duplicate business logic

## 11. Dependency Direction

The intended dependency direction is:

- apps/web → packages/types, packages/validation, API contracts
- apps/admin → packages/types, packages/validation, API contracts
- api → services → repositories → database package
- packages/validation → no dependency on application runtime logic
- packages/config → shared config only

## 12. Performance and Scalability Principles

- paginate large lists for public search and admin review pages
- avoid loading all stores or listings in one request
- index fields relevant to category, location, activation status, and subscription state
- optimize image serving and use lazy loading where needed
- review caching for public catalog data with explicit invalidation rules
- apply rate limiting and request controls for public and admin endpoints
- separate long-running operations from direct user requests when required
- monitor uptime, errors, and response times

## 13. Deployment, Security, and Recovery Principles

- use Docker and environment isolation for local, staging, and production environments
- keep secret values outside source control
- maintain regular database backups and recovery plans
- enforce HTTPS and secure cookies in production
- apply rate limiting and CORS policies based on approved origin lists
- perform performance testing and error monitoring before production rollout

## 14. Architecture Guardrails for This Phase

This phase remains limited to documentation and project alignment. The project must not:

- create full database schema design prematurely
- invent a real payment integration
- implement hardcoded category lists
- bypass the backend for authorization checks
- change the approved technology stack without a documented reason and approval

The platform must remain compatible with the current monorepo and service boundaries while preparing the architecture for dynamic wedding categories and future growth.

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
