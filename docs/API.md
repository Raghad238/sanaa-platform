# API Design

This document defines the target API contract for Sana'a Marketplace. It is a design document only and does not implement application code, controllers, routes, or database schemas.

The intended API root is:

- /api/v1

All conceptual paths below are relative to this base path.

## 1. API Scope and Principles

- Public market pages and protected account features share the same backend API base.
- The backend is the source of truth for business rules and permissions.
- Frontend validation is considered convenience only; backend validation is authoritative.
- API behavior must remain consistent with the PRD, Business Rules, Architecture, and Coding Standards documents.
- No Jaib-specific contracts are included; any Jaib integration is deferred to the final payment phase.

## 2. API Versioning

- Base path: /api/v1
- Versioning is path-based.
- Versioning is intended to allow non-breaking evolution while preserving compatibility for public and seller/admin UIs.
- Breaking API changes should be introduced by adding a new version rather than modifying the existing contract silently.

## 3. HTTP Methods and Status Codes

### Standard HTTP methods
- GET: read/query data
- POST: create resources or trigger actions
- PATCH: partial update
- PUT: full update where appropriate; use only when a full replace semantics is clearly required
- DELETE: soft delete / archive / remove where appropriate; delete semantics should not be destructive for critical seller data unless explicitly justified and approved

### Status codes
- 200 OK: successful read/update operation
- 201 Created: resource created successfully
- 202 Accepted: action accepted for later processing (when asynchronous or deferred behavior is used)
- 204 No Content: successful operation with no response body
- 400 Bad Request: malformed request or validation failure
- 401 Unauthorized: missing or invalid authentication
- 403 Forbidden: authenticated but not authorized for this action
- 404 Not Found: resource missing or inaccessible
- 409 Conflict: state conflict such as duplicate object, invalid state transition, or rule conflict
- 422 Unprocessable Entity: semantically invalid input that passes syntax validation but fails business validation
- 429 Too Many Requests: rate limit exceeded
- 500 Internal Server Error: unexpected server-side failure
- 503 Service Unavailable: dependency or service outage

## 4. Response Conventions

### Success response concept

{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "uuid-or-trace-id"
  }
}

### Error response concept

{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "details": [
      {
        "field": "email",
        "message": "Email is required."
      }
    ],
    "requestId": "uuid-or-trace-id"
  }
}

### Response expectations
- Every response should include a success boolean.
- Success responses should include data payloads where appropriate.
- Error responses should include a stable machine-readable code, a human-readable message, and optional details.
- The API should avoid leaking stack traces or internal implementation details to clients.

## 5. Authentication and Authorization

### Authentication target
- Architecture target: JWT + HTTP-only cookies
- Public endpoints require no authentication.
- Seller and admin endpoints require authenticated identity.
- Auth tokens are expected to be validated server-side before protected actions are processed.

### Conceptual authentication behavior
- POST /api/v1/auth/login: validate credentials and issue authenticated session cookie/token
- POST /api/v1/auth/logout: revoke session or clear authentication cookie
- GET /api/v1/auth/me: return current authenticated user summary

### Authorization model
- Public: no authentication required
- Customer: authenticated customer actions only
- Seller: manages own stores, products, services, and subscription visibility context
- Admin: manages moderation, categories, reports, reviews, subscriptions, payment records, and audit-related tasks

Protected endpoints must enforce authorization in the backend. Frontend role state must not be trusted.

## 6. Validation and Error Taxonomy

### Request validation errors
- invalid field values
- missing required fields
- malformed IDs
- malformed dates
- invalid enums or status values
- unsupported query parameters

Conceptual error code examples:
- VALIDATION_ERROR
- INVALID_FIELD
- MISSING_FIELD
- INVALID_DATE
- INVALID_ID
- INVALID_ENUM

### Business errors
- subscription expired or inactive while attempting to publish or maintain public visibility
- store hidden or suspended preventing modification
- product limit exceeded
- review not eligible based on Contact Event rules
- store/product/service not owned by current seller
- seller cannot access admin-only action

Conceptual error codes:
- STORE_SUSPENDED
- PRODUCT_LIMIT_EXCEEDED
- SUBSCRIPTION_INACTIVE
- REVIEW_NOT_ELIGIBLE
- OWNERSHIP_REQUIRED
- BUSINESS_RULE_VIOLATION

### Not-found errors
- missing store
- missing product
- missing service
- missing category
- missing user
- missing notification

Conceptual error codes:
- RESOURCE_NOT_FOUND
- STORE_NOT_FOUND
- PRODUCT_NOT_FOUND
- SERVICE_NOT_FOUND
- USER_NOT_FOUND

### Conflict errors
- duplicate favorite entry
- duplicate report
- invalid state transition such as reactivating an already active record
- store already suspended or closed
- review already submitted for same contact event

Conceptual error codes:
- CONFLICT
- DUPLICATE_FAVORITE
- DUPLICATE_REPORT
- INVALID_STATE_TRANSITION

### Internal errors
- unexpected exception
- dependency failure
- database error
- external provider failure when applicable in future phases

Conceptual error codes:
- INTERNAL_ERROR
- DATABASE_ERROR
- DEPENDENCY_ERROR

## 7. Pagination Contract

A single consistent pagination contract should be used across public and admin list endpoints.

### Conceptual pagination request
- page: integer, default 1
- limit: integer, default 20, max value to be enforced by server
- sort: sort field or sort mode
- order: asc | desc

### Conceptual pagination response
{
  "success": true,
  "data": [
    {}
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 125,
    "totalPages": 7,
    "hasNext": true,
    "hasPrevious": false
  }
}

### Pagination rules
- Applies to stores, products, services, search results, discover pages, notifications, and admin lists.
- Pagination is server-driven and should not rely on frontend assumptions.
- A maximum page size should be enforced by the backend.
- Undefined or invalid page values should return validation errors.

## 8. Filtering and Sorting Conventions

### Filtering
Conceptual filters available where applicable:
- category
- location
- priceMin / priceMax
- availability
- type
- status
- sellerId
- storeId
- createdAfter / createdBefore
- isActive

### Sorting
Conceptual sort values:
- newest
- relevance
- price_asc
- price_desc
- popularity
- name_asc
- name_desc

### Unresolved details
The following details remain intentionally unresolved in current documentation and should be clarified before implementation:
- final weighting of relevance in search results
- exact rules for nearby sorting logic
- exact admin list ordering policy beyond basic sort conventions
- the final definition of popularity metrics

## 9. Search and Discover Parameters

### Search parameters concept
- q: keyword query
- category: category identifier or slug
- location: city or area identifier
- type: product | service | store | offer
- page, limit, sort, order

### Discover parameters concept
- view: all | products | services | stores | offers | new | popular | nearby
- location: Sana'a in the MVP
- category: optional category filter
- page, limit, sort, order

Business rule: paid subscription alone must not automatically guarantee top ranking.

## 10. Date and ID Conventions

### Dates
- Dates should be ISO 8601 strings in UTC when stored or exchanged.
- Conceptual examples:
  - 2026-09-27T10:30:00.000Z
- Date queries may accept ISO 8601 strings and should be normalized by the backend.

### IDs
- Prefer UUIDs for externally referenced entities when possible.
- Use stable IDs for users, stores, products, services, categories, reports, reviews, and notifications.
- IDs should be treated as opaque externally unless business rules require display semantics.

## 11. Planned API Domains

## 11.1 Auth

### POST /api/v1/auth/register
- Purpose: create customer or seller account
- Auth: none
- Allowed role: public
- Request concept: name, email, password, role, optional profile fields
- Response concept: created account summary and authenticated session if applicable
- Important business rules: seller account required for stores; customer and seller roles are distinct
- Common errors: duplicate email, invalid payload, weak password, unsupported role

### POST /api/v1/auth/login
- Purpose: sign in user
- Auth: none
- Allowed role: public
- Request concept: email or username, password
- Response concept: user summary and authenticated session
- Important business rules: only valid credentials may establish session
- Common errors: invalid credentials, account locked or disabled where applicable

### POST /api/v1/auth/logout
- Purpose: invalidate session or clear auth cookie
- Auth: required
- Allowed role: customer, seller, admin
- Response concept: success confirmation
- Common errors: not authenticated, token invalid

### GET /api/v1/auth/me
- Purpose: return current authenticated identity summary
- Auth: required
- Allowed role: customer, seller, admin
- Response concept: current account and role metadata
- Common errors: unauthenticated, invalid session

## 11.2 Users / Account

### GET /api/v1/users/me
- Purpose: read authenticated user profile
- Auth: required
- Allowed role: customer, seller, admin
- Response concept: user profile details
- Common errors: unauthorized, user not found

### PATCH /api/v1/users/me
- Purpose: update account preferences or profile metadata
- Auth: required
- Allowed role: customer, seller, admin
- Request concept: editable profile fields only
- Business rule: users cannot change privileged role assignment through profile update
- Common errors: validation errors, forbidden role changes, conflicts

## 11.3 Stores

### GET /api/v1/stores
- Purpose: list public stores, subject to visibility and moderation rules
- Auth: not required for public listing
- Allowed role: public
- Request concept: pagination, category, location, status filters where applicable, sort
- Response concept: store list with public metadata
- Important business rules: only publicly visible stores should appear; no admin pre-approval workflow; store may be hidden when subscription/trial expires
- Common errors: invalid filters, invalid page values

### GET /api/v1/stores/:storeId
- Purpose: view a single store
- Auth: not required for public view
- Allowed role: public
- Response concept: store profile details and public contact metadata
- Important business rules: not all seller details may be public depending on privacy rules
- Common errors: store not found, store hidden or inactive

## 11.4 Seller Store Management

### POST /api/v1/seller/stores
- Purpose: create a store
- Auth: required
- Allowed role: seller
- Request concept: name, description, category, location, contact channels
- Response concept: created store record
- Important business rules: store becomes ACTIVE immediately; no admin pre-approval; admin receives notification conceptually
- Common errors: validation, seller not authorized, duplicate store name where applicable, business rule violation

### PATCH /api/v1/seller/stores/:storeId
- Purpose: update own store details
- Auth: required
- Allowed role: seller
- Request concept: editable profile fields
- Important business rules: seller cannot change ownership or admin-only status transitions
- Common errors: store not found, ownership mismatch, invalid state

### GET /api/v1/seller/stores
- Purpose: list stores belonging to current seller
- Auth: required
- Allowed role: seller
- Response concept: seller-owned store list
- Business rules: show store status, visibility, and subscription/trial context
- Common errors: unauthorized, invalid filters

## 11.5 Products

### GET /api/v1/products
- Purpose: list public product listings subject to visibility rules
- Auth: not required for public listing
- Allowed role: public
- Request concept: filters, pagination, sorting
- Response concept: product list
- Important business rules: active public products only; paid subscription should not automatically boost ranking
- Common errors: invalid filters, missing category or location filters where applicable

### GET /api/v1/products/:productId
- Purpose: read a product listing
- Auth: not required for public view
- Allowed role: public
- Response concept: product detail
- Common errors: not found, hidden, suspended

## 11.6 Seller Product Management

### POST /api/v1/seller/products
- Purpose: create product listing under seller-owned store
- Auth: required
- Allowed role: seller
- Request concept: storeId, title, description, category, price, availability, images, status metadata
- Response concept: created product record
- Important business rules: product becomes ACTIVE immediately; no admin pre-approval; product limit must be enforced by backend
- Common errors: product limit exceeded, store not found, ownership mismatch, invalid category, invalid price

### PATCH /api/v1/seller/products/:productId
- Purpose: update seller-owned product metadata
- Auth: required
- Allowed role: seller
- Response concept: updated product record
- Common errors: not found, ownership mismatch, store inactive or hidden

### GET /api/v1/seller/products
- Purpose: list products for current seller
- Auth: required
- Allowed role: seller
- Response concept: seller-owned product records with status and visibility metadata

## 11.7 Services

### GET /api/v1/services
- Purpose: list public services subject to visibility rules
- Auth: not required for public listing
- Allowed role: public
- Request concept: filters and pagination
- Response concept: service list
- Important business rules: services become ACTIVE immediately and are subject to moderation after publication
- Common errors: invalid query strings

### GET /api/v1/services/:serviceId
- Purpose: read a service listing
- Auth: not required for public view
- Allowed role: public
- Response concept: service detail
- Common errors: not found, hidden, suspended

## 11.8 Seller Service Management

### POST /api/v1/seller/services
- Purpose: create service listing
- Auth: required
- Allowed role: seller
- Request concept: storeId, title, description, category, price or duration model, location applicability, metadata
- Response concept: created service record
- Important business rules: service becomes ACTIVE immediately; no admin pre-approval
- Common errors: ownership mismatch, store not found, invalid metadata

### PATCH /api/v1/seller/services/:serviceId
- Purpose: update own service listing
- Auth: required
- Allowed role: seller
- Response concept: updated service record
- Common errors: not found, invalid state, seller unauthorized

### GET /api/v1/seller/services
- Purpose: list seller-owned services
- Auth: required
- Allowed role: seller

## 11.9 Categories

### GET /api/v1/categories
- Purpose: list dynamic categories
- Auth: public for listing where applicable
- Allowed role: public
- Request concept: optional type or parent filter
- Response concept: category tree or flat category list
- Business rule: categories are admin-managed and dynamic
- Common errors: invalid parent query, unsupported filter

### POST /api/v1/admin/categories
- Purpose: create a category
- Auth: required
- Allowed role: admin
- Request concept: name, slug, parentId, active status
- Business rule: category taxonomy is not hardcoded and is managed by admin
- Common errors: invalid slug, duplicate name, forbidden access

### PATCH /api/v1/admin/categories/:categoryId
- Purpose: update category metadata
- Auth: required
- Allowed role: admin
- Common errors: category not found, validation issues

## 11.10 Locations

### GET /api/v1/locations
- Purpose: list supported location data
- Auth: public or internal depending on future scope
- Allowed role: public for public marketplace use
- Response concept: city or geographic location list
- Important business rules: MVP is Sana'a only; architecture supports future expansion
- Common errors: missing location data

## 11.11 Search

### GET /api/v1/search
- Purpose: search products, services, stores, offers, and categories
- Auth: not required
- Allowed role: public
- Request concept: q, category, location, type, page, limit, sort
- Response concept: search results grouped by type and rank metadata
- Important business rules: results should favor relevance and local context; paid subscription alone does not guarantee ranking
- Common errors: invalid query, invalid sort, missing category value

## 11.12 Discover

### GET /api/v1/discover
- Purpose: return public discovery collections
- Auth: not required
- Allowed role: public
- Request concept: view, page, limit, category, location
- Response concept: collection results for All, Products, Services, Stores, Offers, New, Popular, Nearby
- Important business rules: no automatic top-ranking for paid subscription; discovery remains accessible to unregistered users
- Common errors: invalid view value, unsupported filter combination

## 11.13 Favorites

### GET /api/v1/favorites
- Purpose: list current customer favorites
- Auth: required
- Allowed role: customer
- Response concept: favorited stores/products/services
- Common errors: unauthorized, invalid filter

### POST /api/v1/favorites
- Purpose: add a favorite item
- Auth: required
- Allowed role: customer
- Request concept: itemType, itemId
- Business rules: item must exist and be visible according to access rules
- Common errors: duplicate favorite, unsupported itemType, invalid itemId

### DELETE /api/v1/favorites/:favoriteId
- Purpose: remove a favorite
- Auth: required
- Allowed role: customer
- Common errors: not found, not owned by current user

## 11.14 Contact Tracking

### POST /api/v1/contact-events
- Purpose: record a customer contact event with a seller
- Auth: required for authenticated customer or system event capture, depending on integration pattern
- Allowed role: customer or internal system
- Request concept: sellerId, channel, source, timestamp, context metadata
- Response concept: created contact event record
- Important business rules: external private conversations must not be inspected; platform records only allowed business events
- Common errors: invalid channel, missing seller reference, duplicate event if policy forbids it

### GET /api/v1/contact-events
- Purpose: list contact events for authorized parties
- Auth: required
- Allowed role: seller, admin, or system owner depending on access scope
- Response concept: contact events list
- Common errors: unauthorized, invalid filters

## 11.15 Reviews

### GET /api/v1/reviews
- Purpose: fetch public reviews for stores or listings
- Auth: not required for public read access where allowed
- Allowed role: public for public reviews
- Request concept: entityType, entityId, page, limit
- Business rule: review eligibility must be derived from Contact Event rules, not Verified Purchase
- Common errors: invalid entity type, missing entityId

### POST /api/v1/reviews
- Purpose: create a review after eligibility is met
- Auth: required
- Allowed role: customer
- Request concept: entityType, entityId, rating, comment, contactEventId
- Business rule: review must be tied to business eligibility and not simply purchase verification
- Common errors: review not eligible, duplicate review, invalid contact event, invalid entity type

### PATCH /api/v1/reviews/:reviewId
- Purpose: update or moderate a review
- Auth: required
- Allowed role: customer for own review, admin for moderation
- Common errors: ownership mismatch, report-related moderation state

## 11.16 Reports

### POST /api/v1/reports
- Purpose: submit a report against a listing, store, review, or content item
- Auth: required
- Allowed role: customer, admin (where applicable)
- Request concept: entityType, entityId, reason, details
- Response concept: created report record
- Business rule: reports feed moderation workflows and admin review
- Common errors: invalid entity type, missing reason, duplicate report if policy prevents it

### GET /api/v1/reports
- Purpose: admin list of reports
- Auth: required
- Allowed role: admin
- Response concept: list of reports with moderation state
- Common errors: unauthorized, invalid filters, missing permission

## 11.17 Notifications

### GET /api/v1/notifications
- Purpose: read current user notifications
- Auth: required
- Allowed role: customer, seller, admin
- Request concept: unreadOnly, page, limit
- Response concept: notification list
- Business rule: notifications are triggered by relevant business events such as store created, trial nearing expiry, moderation notes, subscription change, admin actions
- Common errors: unauthorized

### PATCH /api/v1/notifications/:notificationId/read
- Purpose: mark notification as read
- Auth: required
- Allowed role: customer, seller, admin
- Response concept: updated notification state
- Common errors: not found, ownership mismatch

## 11.18 Subscription Plans

### GET /api/v1/subscription-plans
- Purpose: list available plans
- Auth: not required for public plan listing if exposed publicly
- Allowed role: public or authenticated seller for internal visibility
- Response concept: plan metadata including price and product limit conceptually
- Important business rules: values should eventually come from database; current value is 2500 YER/month and 250 products
- Common errors: invalid filters, missing plan data

## 11.19 Subscriptions

### GET /api/v1/subscriptions/me
- Purpose: read current seller subscription state
- Auth: required
- Allowed role: seller, admin
- Response concept: subscription summary, status, trial details, expiry
- Important business rules: expired subscription hides public visibility without deleting seller data; backend is source of truth
- Common errors: no active subscription, not authorized

### GET /api/v1/admin/subscriptions
- Purpose: admin list of subscriptions
- Auth: required
- Allowed role: admin
- Response concept: subscription list and status summary
- Common errors: unauthorized, invalid filters

## 11.20 Payments

### GET /api/v1/payments/me
- Purpose: read payment records for the current user or seller context
- Auth: required
- Allowed role: seller, admin
- Response concept: payment record history or summary payload
- Important business rules: data model supports payment records; actual Jaib integration is final payment phase only
- Common errors: not found, unauthorized

### GET /api/v1/admin/payments
- Purpose: admin-level payment read view
- Auth: required
- Allowed role: admin
- Response concept: payment record list with status metadata
- Important business rules: no Jaib-specific contracts are defined here
- Common errors: unauthorized, invalid filters

Note: Actual Jaib integration is FINAL PAYMENT PHASE. The API design above treats payments as an internal payment domain only and does not define Jaib endpoints, webhooks, or signatures.

## 11.21 Analytics

### GET /api/v1/analytics/overview
- Purpose: platform or seller analytics summary
- Auth: required
- Allowed role: seller, admin, or public depending on scope
- Response concept: summary metrics for view counts, category performance, subscription status, or marketplace activity
- Business rule: basic analytics only; no broad enterprise BI features in MVP
- Common errors: insufficient permission, invalid scope

## 11.22 Seller Dashboard

### GET /api/v1/seller/dashboard
- Purpose: return the seller dashboard summary
- Auth: required
- Allowed role: seller
- Response concept: stores, products, services, subscription status, notifications, and operational insights
- Business rules: dashboard must use backend truth for subscription and visibility state
- Common errors: unauthorized, no access to dashboard

## 11.23 Admin Dashboard

### GET /api/v1/admin/dashboard
- Purpose: return admin overview summary
- Auth: required
- Allowed role: admin
- Response concept: moderation metrics, created stores, reports needing attention, subscriptions, and platform health summary
- Common errors: unauthorized

## 11.24 Admin Store Management

### GET /api/v1/admin/stores
- Purpose: list all stores for moderation review
- Auth: required
- Allowed role: admin
- Response concept: store list with moderation and visibility state
- Common errors: unauthorized, invalid filters

### PATCH /api/v1/admin/stores/:storeId
- Purpose: apply admin moderation or lifecycle action
- Auth: required
- Allowed role: admin
- Request concept: action, status, note
- Important business rules: admin may send notes, suspend, close, or reactivate stores
- Common errors: store not found, invalid transition, forbidden operation

## 11.25 Admin Product Management

### GET /api/v1/admin/products
- Purpose: list products for moderation
- Auth: required
- Allowed role: admin
- Response concept: moderated product list

### PATCH /api/v1/admin/products/:productId
- Purpose: moderate a product listing
- Auth: required
- Allowed role: admin
- Request concept: suspend, remove, reactivate, note
- Business rule: no pre-approval workflow; moderation happens after publication
- Common errors: not found, invalid state transition

## 11.26 Admin Service Management

### GET /api/v1/admin/services
- Purpose: list services for moderation
- Auth: required
- Allowed role: admin

### PATCH /api/v1/admin/services/:serviceId
- Purpose: moderate a service listing
- Auth: required
- Allowed role: admin
- Request concept: status change, note, visibility update

## 11.27 Admin User Management

### GET /api/v1/admin/users
- Purpose: list user records for moderation and operational management
- Auth: required
- Allowed role: admin
- Response concept: user list with account role metadata
- Common errors: unauthorized

### PATCH /api/v1/admin/users/:userId
- Purpose: update user/admin account properties within admin boundaries
- Auth: required
- Allowed role: admin
- Common errors: not found, invalid role transition

## 11.28 Admin Reports/Reviews

### GET /api/v1/admin/reports
- Purpose: list reports requiring admin action
- Auth: required
- Allowed role: admin

### GET /api/v1/admin/reviews
- Purpose: list reviews for moderation review
- Auth: required
- Allowed role: admin

### PATCH /api/v1/admin/reports/:reportId
- Purpose: resolve report
- Auth: required
- Allowed role: admin

### PATCH /api/v1/admin/reviews/:reviewId
- Purpose: moderate or flag a review
- Auth: required
- Allowed role: admin

## 11.29 Admin Subscription/Payment Read Views

### GET /api/v1/admin/subscriptions
- Purpose: list subscriptions and lifecycle status
- Auth: required
- Allowed role: admin

### GET /api/v1/admin/payments
- Purpose: read payment record list and state
- Auth: required
- Allowed role: admin

## 11.30 Health Endpoints

### GET /api/v1/health
- Purpose: basic service health check
- Auth: none
- Allowed role: public
- Response concept: service name, status, timestamp
- Common errors: service unhealthy, dependency failure

### GET /api/v1/health/ready
- Purpose: readiness check for dependencies
- Auth: none
- Allowed role: public or infrastructure
- Response concept: readiness state and dependency summary
- Common errors: database not ready, dependency outage

## 12. Common Business Rules to Enforce in API Layer

- Store creation without admin approval is allowed and immediately activates the store.
- Product creation without admin approval is allowed and immediately activates the product.
- Service creation without admin approval is allowed and immediately activates the service.
- Store, product, and service moderation occurs after publication.
- Subscription or trial expiry may hide public content but must not delete seller data.
- Reviews must be based on Contact Event rules, not Verified Purchase.
- Categories are dynamic and admin-managed.
- Customer browsing remains public without authentication.
- Seller and admin permission checks are enforced by backend services and must not rely on frontend client state.
- Jaib integration is not part of the API contract in this phase.

## 13. Error Code Catalog (Conceptual)

- VALIDATION_ERROR
- INVALID_FIELD
- MISSING_FIELD
- INVALID_DATE
- INVALID_ID
- INVALID_ENUM
- RESOURCE_NOT_FOUND
- STORE_NOT_FOUND
- PRODUCT_NOT_FOUND
- SERVICE_NOT_FOUND
- USER_NOT_FOUND
- UNAUTHORIZED
- FORBIDDEN
- OWNERSHIP_REQUIRED
- BUSINESS_RULE_VIOLATION
- STORE_SUSPENDED
- PRODUCT_LIMIT_EXCEEDED
- SUBSCRIPTION_INACTIVE
- REVIEW_NOT_ELIGIBLE
- DUPLICATE_FAVORITE
- DUPLICATE_REPORT
- INVALID_STATE_TRANSITION
- CONFLICT
- INTERNAL_ERROR
- DATABASE_ERROR
- DEPENDENCY_ERROR

## 14. Design Constraints for Day 3

- This document defines a target API contract only.
- No API implementation is created in this phase.
- No Jaib endpoints or provider contract is created.
- The planned API surface is intentionally conceptual and subject to honest implementation later.
- Unresolved details in search ranking, popularity metrics, and other product decisions remain explicitly marked as unresolved.
