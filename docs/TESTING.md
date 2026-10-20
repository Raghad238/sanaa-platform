# Testing Strategy

This document defines the testing strategy for the Sana'a Wedding Marketplace. It is a planning document only and does not imply that the implementation already exists or that tests have been executed.

## 1. Testing Goals

The project should validate:

- product and business rules
- permissions and authorization behavior
- status transitions and visibility logic
- API contract and validation behavior
- operational safety and deployment readiness
- regression protection as the project grows

## 2. Test Types

### 2.1 Unit tests

Unit tests should validate business logic in isolation, particularly in service and utility modules.

Recommended focus areas:

- subscription and trial state transitions
- visibility and hiding rules after expiration
- product limit enforcement
- store status rules
- product and service activation behavior
- review eligibility based on Contact Event
- report and moderation decision logic
- category validation and admin-managed taxonomy behavior
- ownership and permission checks

### 2.2 Integration tests

Integration tests should validate the interaction between service, repository, middleware, and API layers.

Recommended scenarios:

- store creation with immediate ACTIVE state
- product creation with immediate ACTIVE state
- service creation with immediate ACTIVE state
- trial expiry and visibility behavior
- subscription reactivation and visibility restoration
- moderation actions and status changes
- seller ownership enforcement
- admin moderation flows
- contact event recording and review eligibility

### 2.3 API tests

API tests should validate HTTP behavior and contract expectations.

Areas to cover:

- HTTP status codes
- request validation failures
- authentication and authorization boundaries
- pagination and filtering behavior
- response contract consistency
- soft-deletion or visibility semantics where exposed

### 2.4 End-to-end tests

E2E tests should cover critical customer, seller, and admin journeys.

#### Customer flow

1. browse public marketplace
2. search for category or vendor
3. open a store or service listing
4. contact the seller via the listed channel
5. review eligibility is checked based on contact event rules

#### Seller flow

1. create account
2. create store and complete storefront details
3. store enters `PENDING_ACTIVATION` and remains hidden from public discovery until admin approval
4. add products and services only according to the active seller workflow
5. review subscription or trial state
6. receive moderation or operational notes

#### Admin flow

1. log in to admin dashboard
2. review reports or store activity
3. manage categories, stores, products, and services
4. suspend or reactivate content when required

## 3. Acceptance Tests for Dynamic Categories and Reviews

Upcoming acceptance tests should cover:

- creating a category without code changes
- editing a category name and description
- reordering and activating or disabling categories
- creating a category hierarchy for nested wedding-related niches
- ensuring category data is resolved from the backend, not a fixed UI list
- review eligibility based on contact events and moderation rules
- permissions for customer, seller, and admin actions
- public browsing without login

## 4. Security Testing

Security tests should cover:

- auth failures
- authorization boundary checks
- validation bypass attempts
- rate limiting behavior
- cookie security and CORS behavior
- XSS and injection review where user-generated content appears
- privilege boundary enforcement

## 5. Manual Testing

Manual testing remains necessary when:

- UX flow validation is needed
- moderation judgment depends on human review
- public discovery quality needs product judgment
- category management is being validated with user-facing workflows

## 6. Regression Testing Expectations

Regression testing should verify:

- public browsing remains available without login
- pending activation remains the default for newly created stores until a server-authorized admin approves them
- no hardcoded category assumptions are introduced
- trial and subscription expirations preserve seller data
- contact-event review model remains intact
- admin moderation actions keep working after product changes

## 7. Definition of Done

The day is not complete unless the project-specific checks for that implementation are run and the evidence is recorded.

Required standard:

- failed required checks mean the day is not complete
- skipped checks must be explicitly justified
- no success claim should be made without actual execution evidence

## 8. Test Data and Isolation

- test data must be isolated from production data
- fixtures should model real business rules from the PRD and business rules documents
- no test should validate a payment integration before the final payment phase

## 9. Performance and Non-Functional Testing

Future testing should include:

- response time measurement for public discovery and search endpoints
- pagination behavior under large datasets
- database index review for category and store queries
- image optimization and lazy-loading review
- cache invalidation strategy review for public listing data
- rate limiting and abuse protection checks
- health checks and operational monitoring

## 10. Documentation Rule

The testing strategy must remain aligned with the PRD, business rules, architecture, and coding standards. It must not claim behaviors that have not been implemented or verified.
