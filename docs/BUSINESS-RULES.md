# Business Rules

This document defines the authoritative business rules for the Sana'a Wedding Marketplace. It complements the product requirements in [docs/PRD.md](PRD.md) and should be treated as the operating interpretation of the product rules while preserving the existing marketplace and admin framework already in the repository.

## 1. Product and Market Scope

- Product type: web platform, not a standalone mobile application.
- Initial launch market: Sana'a, Yemen only.
- Future geographic expansion is allowed, but the MVP remains local to Sana'a.
- Public browsing is a primary product experience.
- Seller-to-customer contact remains external to the platform via seller-managed communication channels.
- The platform acts as a discovery and storefront layer rather than a private messaging app.

## 2. Customer Rules

### 2.1 Public browsing

- Any visitor may browse the public marketplace without creating an account.
- Public browsing includes storefronts, product listings, services, offers, categories, and wedding-focused discovery pages where visible.
- Public marketplace browsing must continue to work without login.
- Public pages should support SEO where appropriate and permitted by platform policy.

### 2.2 Authentication requirements

- Authentication is required for identity-linked actions.
- Examples include favorites, reviews, reports, personal notifications, and account management.
- Sellers and admins require dedicated, role-based access.
- Customers are not required to authenticate for general discovery.

### 2.3 Favorites

- Favorites are a customer account feature.
- Logged-in customers may save favorite vendors, products, and services.
- Favorites must remain user-specific and not publicly visible unless designed otherwise in future work.

### 2.4 Reviews

- Reviews are not based on Verified Purchase.
- Eligibility is based on contact events and business rules executed by the backend.
- Customer contact with a seller creates a contact event, which may later support review eligibility.
- Reviews remain subject to moderation and reporting.

### 2.5 Reports

- Authenticated users may report suspicious, inaccurate, or inappropriate listings or behavior.
- Admins review and resolve reports.
- Reports can be raised against stores, products, services, reviews, or other relevant wedding marketplace content.

### 2.6 Contact events

- The system records contact events when a customer initiates or completes contact with a seller through supported channels.
- Supported conceptual channels include WhatsApp, Instagram, Facebook, Telegram, phone, website, and other seller-managed channels.
- The platform records the business contact event, but does not inspect private conversations on external platforms.

## 3. Seller Rules

### 3.1 Seller account

- A seller must have an account to create and manage store operations.
- Seller accounts are separate from customer and admin accounts.
- Seller access supports storefront management, listing operations, and notification consumption.

### 3.2 Store ownership

- Sellers own the stores and associated listings they are authorized to manage.
- Ownership must be enforced by role and authorization rules.
- A seller may not edit a store or listing they do not own.
- Admin actions may supersede regular seller editing when moderation requires it.

### 3.3 Store management

- Sellers can create, edit, and maintain wedding-related store records.
- Store profiles must include the fields needed for discovery and direct customer contact.
- Contact channels remain seller-managed and external to the platform’s core message layer.

### 3.4 Products and services

- Sellers may create products and services associated with their authorized store.
- Products and services are created under seller ownership and store association.
- Product and service metadata must support discovery, category placement, pricing, and direct contact.
- Visibility must remain consistent with active store status, subscription or trial state, and moderation actions.

### 3.5 Subscription

- Seller subscriptions are required to keep public access under the current business model.
- Current business value: 2500 YER per month.
- Current product limit: 250 listings per store or account.
- These values remain the current product defaults but must eventually come from the database instead of code.

### 3.6 Trial

- Sellers receive a 60-day free trial when the store becomes active.
- Trial starts when the store becomes active.
- Trial expiration must not delete seller data.
- When the trial expires, public-facing visibility may be hidden until the subscription is active again.

### 3.7 Notifications

- Sellers receive operational notifications for events such as:
  - store creation
  - trial and subscription changes
  - admin notes
  - moderation actions
  - other relevant store updates

## 4. Store Business Rules

### 4.1 Store creation

- Sellers may create a store under their authenticated seller account.
- Store creation is allowed without admin approval in the initial model.
- Store creation triggers admin notification.

### 4.2 Immediate activation

- Newly created stores become ACTIVE immediately.
- Immediate activation is a core product rule and must not be changed silently.

### 4.3 No pre-approval workflow

- There is no admin pre-approval workflow for store creation.
- Admin intervention happens after publication.

### 4.4 Store status values

The following status values are conceptually relevant:

- ACTIVE
- SUSPENDED
- CLOSED
- hidden or inactive due to subscription or trial expiration

### 4.5 Admin intervention

- Admin may view, send notes to, suspend, close, or reactivate stores.
- Admin actions may alter public visibility or store operational status.

### 4.6 Public visibility

- A store is publicly visible when it is active and otherwise eligible to appear.
- Visibility depends on store state, moderation state, and subscription or trial status.
- Content may be hidden when a subscription or trial expires.

### 4.7 Subscription visibility behavior

- When a subscription or trial expires, the store may become hidden from public access.
- Related products and services should also be hidden where required.
- Seller data is preserved even when public visibility is removed.

## 5. Product and Service Business Rules

### 5.1 Product creation

- Sellers can create wedding-related products under a valid store.
- Product creation is permitted under seller ownership and authorization.
- Product creation triggers admin notification in the business model.

### 5.2 Product activation

- Products become ACTIVE immediately on creation.
- No admin pre-approval workflow is required.

### 5.3 Service creation

- Sellers can create services under an authorized store.
- Services become ACTIVE immediately.
- Admin can later intervene via moderation and visibility controls.

### 5.4 Ownership and association

- Products and services remain associated with their store and seller.
- A seller may not manage content outside their authorized store ownership.

### 5.5 Categories

- Categories are dynamic and admin-managed.
- Wedding categories must not be hardcoded into the application façade or frontend.
- Admins can create, enable, disable, reorder, and manage category taxonomy over time.
- Subcategories and category-specific custom fields may be introduced later as a domain configuration problem, not as a hardcoded UI list.

### 5.6 Price and availability

- Price metadata and availability must remain seller-managed and backend-validated.
- Availability and listing status influence customer trust and discoverability.

### 5.7 Product limit

- The current business value is 250 listings per seller store or business account.
- This value must be configurable in the data layer rather than hardcoded in code.

### 5.8 Suspension and reactivation

- Admin may suspend or remove a product or service.
- Admin may reactivate it when the moderation or business rule allows it.

## 6. Subscription and Trial Rules

### 6.1 Subscription plan

- The platform supports a subscription domain model from early stages.
- Current plan value: 2500 YER/month.
- Current product limit: 250 listings.
- The real configuration should eventually come from the database and not from fixed code.

### 6.2 Trial lifecycle

- Sellers receive a 60-day free trial when the store becomes active.
- Trial duration must be tracked and visible to the seller and admin.
- Expired trial may require hiding public content until a subscription becomes active again.

### 6.3 Expiration

- Expiration of trial or subscription may hide public listings and store visibility.
- Data must not be deleted merely because a plan has expired.

### 6.4 Public visibility rules

- When a subscription or trial expires, a store or listing may become hidden from public access.
- Once active again, public visibility may be restored according to business rules.

## 7. Reviews, Contact Events, and Reports

### 7.1 Review eligibility

- Review eligibility is based on contact events, not Verified Purchase.
- The workflow is: customer contact → contact event recorded → review eligibility checked under business rules.

### 7.2 Contact tracking

- The platform records business contact events with sellers.
- Contact channels remain external and seller-managed.
- The system does not inspect private conversations in external social channels.

### 7.3 Reporting rules

- Reports may be raised against stores, products, services, reviews, or other content where applicable.
- Reports include reason and relevant reference metadata.
- Admins review and act on reports according to moderation policy.

## 8. Search, Discovery, and Categories

### 8.1 Search

- Customers can search across stores, products, services, offers, and categories.
- Search should prefer relevance and local context.
- Paid plans should not automatically guarantee top ranking.

### 8.2 Discovery

- Discovery surfaces should support concepts such as All, Products, Services, Stores, Offers, New, Popular, and Nearby.
- Public discovery must remain available without login.

### 8.3 Dynamic categories policy

- Category management is admin-driven and data-backed.
- No static category list should be embedded in the product interface or business logic as a replacement for the real data model.
- A category can be added, renamed, reordered, deactivated, or nested without a code change or redeploy.

## 9. Moderation, Admin Notes, and Auditability

### 9.1 Moderation

- There is no pre-approval workflow for stores, products, or services.
- Admin moderation occurs after publication.
- Moderation actions may include notes, suspension, closure, removal, or reactivation.

### 9.2 Soft deletion and preservation

- Seller data must be preserved when content becomes hidden or removed from public display.
- The platform should prefer soft deletion and visibility changes instead of destructive deletion where historical or operational value exists.

### 9.3 Audit logging

The system should eventually log actions including:

- store creation and status changes
- product and service creation or moderation
- admin notes
- subscription and trial changes
- report and review actions
- category management changes
- user and permissions changes

## 10. Customer, Seller, and Admin Access Summary

- Customers may access public marketplace pages without login.
- Customers authenticate for favorites, reviews, reports, and account-linked actions.
- Sellers authenticate to manage storefronts and listings.
- Admins authenticate to manage moderation, categories, and subscriptions.
- Backend authorization remains the source of truth.

## 11. Operational Constraints

- Subscription and trial values must not remain permanently hardcoded in business logic.
- Categories must not be hardcoded.
- Business configuration belongs in the data layer and admin-managed configuration rather than fixed code.
- The platform does not inspect private conversations on external social channels.
- Jaib integration remains outside the current phase and must not be invented prematurely.
- Clear separation remains necessary between public discovery, seller actions, and admin functions.

## 12. Canonical Rule Clarification

The current canonical product rules for this project are:

- 2500 YER/month subscription price
- 250 listing limit
- 60-day free trial
- Sana'a-only market scope
- no pre-approval workflow
- immediate activation by store, product, or service
- data preservation on visibility or subscription expiration

These values are the operating defaults unless product governance explicitly changes them.
