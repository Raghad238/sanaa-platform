# Business Rules

This document defines the authoritative business rules for Sana'a Marketplace. It complements the product requirements in [docs/PRD.md](PRD.md) and should be treated as the operational interpretation of the product rules.

## 1. Product and Market Scope

- Product type: web platform, not mobile application.
- Initial launch market: Sana'a, Yemen only.
- Future geographic growth is allowed, but the MVP is limited to Sana'a.
- Public marketplace discovery is a primary product function.
- Seller-to-customer contact remains primarily external to the platform through seller-managed channels.
- The platform acts as a discovery and marketplace layer, not as a private messaging platform.

## 2. Customer Rules

### 2.1 Public browsing

- Any visitor may browse the public marketplace without creating an account.
- Public browsing includes viewing storefronts, products, services, offers, category pages, and discovery surfaces where visible.
- Public browsing must remain available without login.
- Public marketplace pages must support SEO where appropriate and where business policy allows.

### 2.2 Authentication requirements

- Authentication is required for identity-linked actions.
- Authentication is required for features such as favorites, reviews, reports, personal notifications, and account management.
- Seller and admin accounts require explicit role-based access.
- Customers are not required to authenticate for general discovery.

### 2.3 Favorites

- Favorites are a customer account feature.
- Logged-in customers may save favorite products, stores, and services.
- Favorites are user-specific and not publicly visible unless explicitly designed otherwise in future product iterations.
- Favorites do not replace a seller’s public storefront listing and do not grant access to private data.

### 2.4 Reviews

- Reviews are not based on Verified Purchase.
- Review eligibility is based on a Contact Event according to future business rules.
- The operational concept is: Customer contacts seller → Contact Event recorded → customer becomes eligible to review according to business rules.
- Reviews must not be treated as verified purchase proof.
- Review moderation and reporting remain admin responsibilities.

### 2.5 Reports

- Authenticated users may report suspicious, misleading, illegal, harmful, or inappropriate listings or behavior.
- Admins are responsible for reviewing and acting on reports.
- Reported entities may include stores, products, services, reviews, or other relevant marketplace content.
- Reports must be associated with the reported entity and reason metadata.

### 2.6 Contact events

- The system records contact events when a customer initiates or completes contact with a seller using supported channels.
- Supported conceptual contact channels include:
  - WhatsApp
  - Instagram
  - Facebook
  - TikTok
  - Telegram
  - Website
  - Phone
  - Other relevant business contact channels
- The platform must record the event as a business fact, not as a private conversation inspection mechanism.
- The system must not inspect or attempt to read private conversations from external platforms.
- Contact events are a business record supporting future eligibility rules for reviews and trust-related features.

## 3. Seller Rules

### 3.1 Seller account

- A seller must have an account to create and manage store-related operations.
- Seller accounts are distinct from customer accounts and admin accounts.
- Seller account access must support storefront management, listing operations, and notification consumption.

### 3.2 Store ownership

- Sellers own their own store records and associated product/service listings for which they are authorized.
- Ownership must be restricted by authorization rules and role permissions.
- A seller may not modify a store or listing they do not own.
- Administrative actions may supersede regular seller actions in moderation cases.

### 3.3 Store management

- Sellers can create, edit, manage, and maintain store records.
- Stores must contain the information required for public browsing and buyer contact.
- Store contact channels are seller-managed and external to the core platform messaging layer.
- Seller-managed store detail changes must be reflected in the public listing according to the store’s status and visibility rules.

### 3.4 Products

- Sellers may create products associated with their authorized store.
- Product creation occurs under seller ownership and seller-managed store association.
- Product price, category, availability, and related metadata are seller-controlled, subject to moderation and business policy.
- Product visibility must remain consistent with active store status, subscription/trial state, and moderation actions.

### 3.5 Services

- Sellers may create services associated with their authorized store.
- Services follow the same lifecycle model as products with respect to activation, moderation, visibility, and suspension.
- Service metadata must include the business information required for discovery and contact.

### 3.6 Subscription

- Seller subscriptions are required to maintain public access under the current business model.
- The current business value in the PRD is 2500 YER per month.
- The current product limit in the PRD is 250 products.
- These values are treated as current business defaults but must eventually come from database configuration instead of being hardcoded in business logic.
- Subscription and plan values are domain entities intended to be managed from the database from early stages.

### 3.7 Trial

- Sellers receive a 60-day free trial when the store becomes active.
- Trial begins when the store becomes active.
- Trial duration is an active business rule and is not a substitute for a paid subscription.
- Trial expiration must not delete seller data.
- If the trial expires, the seller’s public-facing content must be hidden according to visibility rules pending reactivation or renewal.

### 3.8 Notifications

- Sellers receive notifications for relevant platform events, including:
  - store creation
  - subscription and trial status changes
  - admin notes
  - moderation actions affecting their content
  - operational notices relevant to their store or listings
- Notifications are role-aware and should eventually support channels such as in-app, email, or other delivery mechanisms as appropriate.

## 4. Store Business Rules

### 4.1 Store creation

- Sellers may create a store under their authenticated seller account.
- Store creation is allowed without admin approval in the initial business model.
- Store creation triggers admin notification.
- Store creation is not blocked by a pre-approval workflow.

### 4.2 Immediate activation

- A newly created store becomes ACTIVE immediately.
- Immediate activation is a core product rule and must not be changed silently.
- The store becomes publicly discoverable subject to visibility and moderation rules.

### 4.3 No pre-approval workflow

- There is no admin pre-approval workflow for stores.
- Stores are created and activated immediately.
- Admin intervention is post-publication rather than pre-publication.

### 4.4 Store status values

The following conceptual status values are relevant:

- ACTIVE
- SUSPENDED
- CLOSED
- Hidden/inactive due to subscription or trial expiration (visibility state, not necessarily data deletion)

### 4.5 Admin intervention

- Admin may view stores.
- Admin may send notes to sellers.
- Admin may suspend a store.
- Admin may close a store.
- Admin may reactivate a store.
- Admin actions may change public visibility or store operational status.

### 4.6 Public visibility

- A store is publicly visible when it is active and the store is otherwise permitted to appear.
- Public visibility depends on active store status, moderation state, and subscription/trial state.
- Content may become hidden when a subscription or trial expires.
- Hidden content must retain seller data and storage records.

### 4.7 Subscription visibility behavior

- When a subscription or trial expires, the store may become hidden from public access.
- Products and services associated with the expired store should also be hidden where required.
- Seller data must not be deleted as a result of expiration.
- Once the subscription becomes active again, the store may become publicly visible according to business rules.

## 5. Product Business Rules

### 5.1 Product creation

- Sellers can create products associated with a valid store.
- Product creation is permitted under seller ownership and authorization.
- Product creation triggers admin notification in the business model.

### 5.2 Immediate activation

- Product becomes ACTIVE immediately upon creation.
- Immediate activation is a core business rule.
- No admin pre-approval workflow exists for products.

### 5.3 Ownership and association

- Products belong to the associated seller and store.
- A seller may not manage products outside their authorized store ownership.
- Product records remain associated with the store even if store visibility changes later.

### 5.4 Categories

- Categories are dynamic and admin-managed.
- Product categorization must not be hardcoded.
- Admins can create and maintain category taxonomy over time.

### 5.5 Price

- Products may have price metadata consistent with the seller’s local business rules.
- Price is part of the marketplace listing data and must be validated before use in public display.

### 5.6 Availability

- Product availability is seller-managed and must be visible in product metadata where relevant.
- Availability may affect public listing behavior and customer purchase intent.

### 5.7 Product limit

- The current business value is 250 products per seller store or business account in the current plan as defined by the product requirements.
- The product limit must eventually be driven by database configuration and not hardcoded in business logic.

### 5.8 Suspension, removal, reactivation

- Admin may suspend a product.
- Admin may remove a product.
- Admin may reactivate a product.
- Product visibility must be consistent with store status, moderation state, and subscription visibility rules.

## 6. Service Business Rules

Services mirror the same lifecycle model as products with the following rule set:

- Seller creates service under an authorized store.
- Service becomes ACTIVE immediately.
- No admin pre-approval workflow is used.
- Admin can later intervene via moderation actions.
- Service status may be ACTIVE, suspended, hidden, or removed depending on moderation and visibility rules.
- Service visibility must respect the supporting store’s active status and subscription/trial state.
- Seller data associated with the service must be preserved even when the service is hidden or removed.

## 7. Subscription and Trial Rules

### 7.1 Subscription plan

- The platform is intended to support a subscription domain model from early stages.
- The database should support subscription plans, subscription records, and payment records.
- Current plan value in the PRD: 2500 YER/month.
- Current product limit in the PRD: 250 products.
- These values must eventually be database-driven rather than hardcoded into application logic.

### 7.2 Trial lifecycle

- Sellers receive a 60-day free trial.
- Trial begins when the store becomes active.
- Trial status should be tracked and visible to the seller and admin.
- Expired trial may require public content to be hidden until a subscription becomes active again.
- Trial expiration must not delete seller data.

### 7.3 Subscription lifecycle

- Subscription lifecycle includes plan assignment, activation, status tracking, expiration, and reactivation.
- Subscription status must be authoritative in the backend and not trusted from frontend state.
- Subscription status controls public visibility and seller access to certain features where relevant.

### 7.4 Expiration

- Expiration of trial or subscription may hide public listings and store visibility.
- The system should preserve seller records and marketplace metadata rather than deleting data.
- Expiration does not imply account deletion or merchant data erasure.

### 7.5 Data preservation

- Seller accounts, store records, products, and services must not be deleted merely because trial or subscription expiration occurs.
- Preservation is preferred for auditability, business continuity, and compliance with marketplace operational expectations.

### 7.6 Public visibility rules

- If a subscription expires, public visibility may be removed from the store and associated listing objects.
- If a subscription becomes active again, public visibility can be restored according to business rules.
- Paid subscription alone must not automatically guarantee top ranking in search or discovery.

## 8. Reviews, Contact Events, and Reports

### 8.1 Review eligibility

- Review eligibility is based on Contact Event records.
- The conceptual flow is: customer contact → contact event recorded → future business rules determine review eligibility.
- Reviews are not based on Verified Purchase.

### 8.2 Contact tracking

- Contact tracking is required for business trust and future review logic.
- Seller contact channels may include social media handles, phone numbers, websites, and direct business contact information.
- The system records the business contact event and must not inspect private external conversations.
- Contact tracking data must be accurate, consent-aware, and operationally limited to marketplace business purposes.

### 8.3 Reporting rules

- Reports may be raised against stores, products, services, reviews, or other content where applicable.
- Reports should include a reason, content reference, and enough metadata for moderation review.
- Reports may be handled by admins according to moderation policy.
- Reporting is not a substitute for direct external platform moderation and must remain consistent with the marketplace’s operational boundaries.

## 9. Search and Discovery Rules

### 9.1 Search

- Customers should be able to search across products, services, stores, offers, and categories.
- Search is expected to support keyword-based discovery and category-driven navigation.
- Search results should prefer relevance and local context.
- Paid subscription alone must not automatically guarantee top ranking.

### 9.2 Discover

- Discovery surfaces should support concepts such as:
  - All
  - Products
  - Services
  - Stores
  - Offers
  - New
  - Popular
  - Nearby
- Discovery must remain available to public users without login.
- Ranking should not be driven solely by paid subscriptions.

## 10. Categories and Locations

### 10.1 Categories

- Categories are dynamic.
- Admin manages the category taxonomy.
- Categories are not assumed to be hardcoded in the product code.
- Categories apply to stores, products, services, and discovery surfaces.

### 10.2 Locations

- The MVP is limited to Sana'a.
- The architecture should allow future expansion beyond Sana'a, but all MVP business rules assume Sana'a as the core market.
- Location metadata should support local discovery in Sana'a and future city expansion.

## 11. Moderation, Admin Notes, and Auditability

### 11.1 Moderation

- There is no pre-approval workflow for store creation, product creation, or service creation.
- Admin moderation occurs after publication.
- Administrative intervention may include notes, suspension, closure, removal, or reactivation.
- Moderation actions must respect visibility and subscription rules.

### 11.2 Admin notes

- Admin may send moderation or management notes to sellers where relevant.
- Notes are operational records and should be visible to the seller in the seller dashboard.
- Notes should support communication without forcing a complete approval workflow.

### 11.3 Soft deletion and preservation

The platform should prefer preservation and soft deletion for conceptual records where appropriate, including:

- Seller accounts and profile data
- Stores after suspension or closure
- Products and services after removal or hidden status
- Subscription records and payment records for audit and reconciliation
- Reports and review records that may be needed for moderation history
- Audit log entries and admin actions

The design should avoid destructive deletion of seller data when operational visibility ends.

### 11.4 Audit logging

The system should eventually capture auditable actions including:

- store creation and status changes
- product and service creation, updates, suspension, removal, reactivation
- admin notes and moderation decisions
- subscription and trial changes
- payment record state changes
- report creation and resolution
- review creation and moderation action
- category management changes
- user and account role changes

## 12. Customer, Seller, and Admin Access Summary

- Customers may access public marketplace pages without login.
- Customers must authenticate for favorites, reviews, reports, and account-linked actions.
- Sellers must authenticate to create and manage stores, products, and services.
- Admins must authenticate and have elevated permissions to manage moderation, subscriptions, categories, reports, notifications, and audit records.
- Backend permission enforcement is the source of truth for authorization and business policy.

## 13. Operational Notes and Constraints

- Subscription and trial values must not be hardcoded into main business logic indefinitely.
- Categories must not be hardcoded.
- Business configuration belongs in the database, not in fixed application code.
- The system must not inspect or parse private external social media conversations.
- The platform does not implement Jaib in this phase and must not invent Jaib endpoints or API behavior.
- The platform keeps a clear separation between public discovery, seller operations, and admin operations.

## 14. Canonical Rule Clarification

The PRD currently establishes the canonical business values for the MVP as:

- 2500 YER/month subscription price
- 250 product limit
- 60-day free trial
- Sana'a-only market scope
- no pre-approval workflow
- immediate activation by store/product/service
- data preservation on expiration

This document treats these values as the current authoritative product rules unless they are explicitly changed by product governance.
