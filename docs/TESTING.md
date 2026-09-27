# Testing Strategy

This document defines the recommended testing strategy for Sana'a Marketplace. The focus is documentation and planning only. It does not create application code or run implementation checks.

## 1. Testing Goals

The project should validate:
- product rules and business logic
- permission and authorization behavior
- risk-prone status transitions
- API contracts and validation logic
- safe deployment and operational readiness
- regression protection as development continues

## 2. Test Types

### 2.1 Unit tests
Unit tests should validate business logic in isolation, especially in services and utility modules.

Recommended unit test focus:
- subscription state transitions
- trial expiry and visibility logic
- product limit enforcement
- store visibility rules
- product/service activation logic
- review eligibility rules based on Contact Event
- report and moderation decision logic
- category validation and admin-managed taxonomy enforcement
- permissions and ownership checks
- notification generation logic where domain logic is available

Unit tests should validate the real domain rules, not mock-only behavior. They should remain focused, fast, and deterministic.

### 2.2 Integration tests
Integration tests should validate the interaction between service, repository, persistence, middleware, and API layers.

Recommended integration test subjects:
- service + repository transactions
- store creation with immediate ACTIVE state
- product creation with immediate ACTIVE state
- service creation with immediate ACTIVE state
- trial expiry and visibility behavior
- subscription reactivation and public visibility restoration
- moderation actions and status transitions
- seller ownership enforcement
- admin moderation flows
- contact event recording and review eligibility logic
- favorites and report workflows

### 2.3 API tests
API tests should validate request handling, validation, authentication, authorization, and response contracts.

Test areas:
- HTTP status codes
- request validation failures
- authentication failure and success cases
- authorization failure and role boundaries
- response contract consistency
- error response contract consistency
- pagination contract behavior
- filtering and sorting behavior
- soft-deletion and visibility semantics where exposed by API

### 2.4 End-to-end (E2E) tests
E2E tests should cover critical customer, seller, and admin journeys.

#### Seller flow
1. Register
2. Login
3. Create Store
4. Trial starts
5. Add Product
6. Manage Store
7. Receive notifications or admin notes when relevant

#### Customer flow
1. Browse public marketplace
2. Search for products or services
3. Open store or listing
4. Contact seller through supported channel
5. Contact Event recorded
6. Review becomes eligible under business rules
7. Submit a review if eligible

#### Admin flow
1. Login
2. Inspect content and reports
3. Send note
4. Suspend or reactivate store/product/service
5. Review audit trail or moderation actions

#### Subscription flow
1. Store created
2. Trial starts
3. Trial expires
4. Store becomes hidden from public access
5. Seller data remains preserved
6. Subscription becomes active again
7. Store visibility can be restored according to policy

#### Payment domain test posture
- No real Jaib tests are required until the final payment phase.
- Payment tests should focus on internal domain state and provider abstraction boundaries only when the implementation phase includes them.

## 3. Security Testing

Security tests should cover:
- authentication failures
- authorization boundary violations
- validation bypass attempts
- rate limiting behavior
- cookie configuration and handling
- CORS policy behavior
- injection risk checks
- XSS-related risk review for rendered content and user-provided values
- CSRF considerations where cookies and stateful auth are used
- file upload validation where implemented
- secret handling and accidental exposure
- privilege boundary enforcement

All backend logic must be treated as the authority for permission and access decisions.

## 4. Manual Testing

Manual testing is required when:
- UX flows need human validation
- business rules depend on editorial judgment or moderation review
- notification experience and seller/admin communication require confirmation
- public discovery or search relevance needs review by product stakeholders
- subscription visibility behavior must be demonstrated in realistic scenarios

Manual testing should be used after automated checks when human validation is important.

## 5. Regression Testing Expectations

Regression testing should verify:
- previously accepted business rules remain unchanged
- status transitions remain valid
- trial and subscription logic still works after changes
- store, product, and service activations remain immediate and without pre-approval
- public browsing remains available without login
- no silent change to the Contact Event review model
- categories remain admin-managed and dynamic
- data preservation is maintained when visibility changes due to expiration

## 6. Definition of Done (Daily Checkpoint)

The day is not complete unless the required validation checks are performed for the implementation that exists that day.

Daily checkpoint concept:

Implementation where applicable
→ TypeScript
→ Lint
→ Tests
→ Build
→ Manual test where required
→ Business rule verification
→ Git diff review
→ Checkpoint
→ Commit

### Required standard
- A failed required check means the day is not complete.
- A skipped required check must be explicitly justified and documented.
- No success claim should be made without actual execution evidence.

## 7. Test Data and Isolation

- Test data should be isolated from production data.
- Test fixtures should model the business rules in the PRD and Business Rules documents.
- Test scenarios should reflect the Sana'a-only MVP and not assume broader market behaviors prematurely.
- No test should validate a fictional Jaib integration path before the final payment phase.

## 8. Non-Functional Testing Considerations

The project should eventually validate:
- error resilience
- service uptime expectations
- database connectivity resilience
- health endpoint behavior
- log quality and situational usefulness
- deployment rollback readiness
- environment configuration safety

## 9. Testing Priorities by Phase

### Phase 1 priority
- store create/activate rules
- product create/activate rules
- service create/activate rules
- trial expiry visibility rules
- seller data preservation rules
- review eligibility based on Contact Event
- admin moderation actions
- permissions and authorization checks

### Phase 2 priority
- search relevance and discover ranking behavior
- notification generation
- category management
- seller dashboard workflows
- admin dashboard workflows

### Final payment phase priority
- payment domain readiness
- provider abstraction boundaries only when applicable
- no Jaib-specific API contract tests before the final payment phase

## 10. Documentation Rule

The testing strategy must remain aligned with the product and architecture documents. It must not introduce unsupported assumptions or claim behaviors not defined by the PRD, Business Rules, or Architecture documents.
