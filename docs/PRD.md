# Product Requirements Document (PRD)

# Sana'a Wedding Marketplace

## 1. Product Overview

Sana'a Wedding Marketplace is a web-based discovery and booking platform focused on wedding preparations in Sana'a, Yemen. It brings together wedding vendors, service providers, and product sellers under one searchable marketplace so customers can discover stores, compare offers, and contact businesses through the communication channels they already use.

The product is not a standalone mobile app. It is a public web platform with dedicated areas for customer discovery, seller storefront management, and admin moderation. The initial scope remains Sana'a only, but the architecture supports future regional expansion without redesigning the product around a fixed city or vendor list.

The platform supports a broad wedding ecosystem, including but not limited to:

- hair and beauty studios and makeup centers
- bridal gowns and wedding fashion stores
- accessories and jewelry
- perfumes and fragrance boutiques
- clothing and tailoring shops
- wedding halls and event venues
- event planners and coordinators
- wedding decor and venue setup providers
- invitation printing and stationery shops
- catering and hospitality providers
- singers and performers
- photography and videography teams
- any additional wedding-related categories that may be added later

The marketplace is designed to help customers quickly find the right vendor and contact them through the communication channels listed on the storefront, without forcing them to create an account before browsing.

---

## 2. Problem Statement

The wedding-related market in Sana'a is still fragmented across Instagram, WhatsApp, Facebook, Telegram, direct phone calls, and isolated websites. This creates several issues:

- Customers struggle to discover trusted wedding vendors in one place.
- Wedding businesses do not have a stable searchable storefront independent of social media.
- The category structure changes often as new wedding-related services appear.
- Customers cannot easily compare offer quality, style, pricing, and availability.
- Sellers have no unified way to manage public visibility, store information, and subscription status.
- Moderation is difficult when content is spread across unmanaged channels.

The platform solves this by centralizing discovery for a wedding ecosystem while preserving the seller's chosen communications, such as WhatsApp, Instagram, Facebook, Telegram, phone, or an external website.

---

## 3. Proposed Solution

Sana'a Wedding Marketplace provides a public web marketplace where customers can discover wedding stores, products, services, and related offers. Sellers can create and manage storefronts, publish wedding-related products and services, and maintain their public profile and contact information. Administrators can moderate content, manage categories, track reports and reviews, and monitor subscriptions and store visibility.

The platform follows a lightweight marketplace model:

- public browsing is available without login
- seller accounts are required for managing stores and listings
- customer accounts are required for identity-linked actions
- admin accounts oversee moderation, categories, reports, subscriptions, and operational health
- seller contact details remain external to the platform and are managed by the store owner

The platform supports SEO-friendly public pages and clear separation between public discovery, seller dashboard workflows, and admin operations.

---

## 4. Product Vision

To become Sana'a’s trusted destination for discovering and comparing wedding vendors, products, and services—while helping businesses manage a digital storefront and enabling customers to find the right partner for their event with confidence and speed.

---

## 5. Goals

### Business Goals

- create a reliable wedding marketplace for Sana'a, Yemen
- increase discovery of local wedding vendors and services
- support a clear, searchable buying journey for wedding preparation needs
- keep public browsing easy without requiring login
- maintain a sustainable seller subscription model
- provide a moderation and operational framework for admin oversight

### User Goals

- customers can discover wedding-related stores and services quickly
- sellers can manage their storefront and offerings from one dashboard
- admins can moderate categories, listings, reports, and subscriptions

### Product Goals

- ship a focused MVP for Sana'a only
- support dynamic wedding categories and future subcategories
- maintain public page visibility and SEO where appropriate
- respect subscription and moderation rules without deleting seller data

---

## 6. Non-Goals

The following remain outside scope for this phase:

- building a mobile app
- expanding beyond Sana'a in the initial launch
- implementing a real payment integration
- building live chat as a platform-native communication layer
- hardcoded category lists that require code changes for each new category
- full enterprise analytics beyond core business reporting
- real payment provider integration before the final payment phase

---

## 7. Target Market

### Primary Market

- customers planning weddings in Sana'a
- local wedding vendors and service providers in Sana'a
- businesses that already rely on social media and messaging channels

### Secondary Market

- future expansion beyond Sana'a
- admin and moderation users
- local business owners who need structured storefront visibility

---

## 8. Personas

### 8.1 Customer Persona

A customer is a person in Sana'a looking for a wedding vendor, product, or service. They may browse without an account and may create one when they need identity-linked actions such as favorites, reports, or reviews.

Needs:

- discover wedding businesses without login
- search by category, vendor name, keyword, or service type
- compare offers and contact methods
- review store details, social handles, and service offerings
- contact sellers through their preferred channels

### 8.2 Seller Persona

A seller is a wedding business or service provider operating in Sana'a. They need a clean storefront to present products and services to customers and manage their public profile.

Needs:

- create and manage a store profile
- add products and services
- manage contact channels and business details
- track trial or subscription status
- receive admin notes and operational updates

### 8.3 Admin Persona

An administrator monitors listing quality, category structure, subscriptions, moderation, and operational issues across the platform.

Needs:

- manage users, stores, categories, and reports
- review reviews and moderation outcomes
- monitor subscription and visibility rules
- send notes or take action on seller content

---

## 9. User Journeys

### 9.1 Customer Journey

1. Customer opens the homepage.
2. Customer browses wedding categories, featured vendors, or popular services.
3. Customer searches for a type of vendor or service.
4. Customer opens a store or service listing.
5. Customer reviews details, pricing, contact channels, and availability.
6. Customer contacts the seller directly using WhatsApp, Instagram, Facebook, Telegram, phone, or website.
7. If logged in, the customer can save favorites, report inappropriate content, or leave a review if eligible.

### 9.2 Seller Journey

1. Seller creates an account.
2. Seller creates a storefront and completes the required business details.
3. The store enters `PENDING_ACTIVATION` and remains hidden from public search until admin approval.
4. Seller adds products or services only after the store is approved or according to the current seller workflow.
5. Seller manages category placement, store details, and contact channels.
6. Seller tracks the store activation status, trial period, and subscription state.
7. Seller receives clarifying notes or moderation action if needed.

### 9.3 Admin Journey

1. Admin logs in to the admin dashboard.
2. Admin reviews new store or seller activity.
3. Admin manages categories, reports, reviews, and subscriptions.
4. Admin sends notes or changes content visibility when required.
5. Admin monitors subscription expiration and public visibility rules.

---

## 10. Functional Requirements

### Authentication

- public discovery must not require an account
- authentication is required for identity-linked actions
- separate roles are required for customer, seller, and admin
- backend enforcement remains the source of truth for permissions

### Customer Accounts

- visitors may browse without creating an account
- customers may create an account for favorites, reviews, reports, and personal settings
- customer accounts do not replace public marketplace browsing

### Seller Accounts

- sellers require an account to create and manage stores, products, and services
- sellers can manage their store profile, contact channels, and business details
- sellers receive relevant notifications and admin notes

### Admin Accounts

- admins manage categories, stores, products, services, subscriptions, reports, reviews, and audit logs
- admin role must be separate from seller and customer access

### Stores

- sellers can create one or more stores and complete their storefront details normally
- newly created stores enter `PENDING_ACTIVATION` and remain hidden from public search and store listings until an admin activates them
- stores awaiting activation appear in the admin dashboard for action
- admin activation is a server-authorized action that records `activatedAt` and sets `trialEndsAt` to 60 days after activation
- repeated activation attempts are idempotent and do not reset or extend the trial period
- admins can suspend, close, or reactivate stores independently from subscription and trial status

### Products and Services

- sellers add wedding-related products and services under their store
- listings become ACTIVE immediately when created
- no admin pre-approval is required
- admin can moderate, suspend, remove, or reactivate listings when necessary
- visibility follows moderation and subscription rules

### Dynamic Categories

- categories are managed from the database and admin tools, not hardcoded in the application
- a category may be active or inactive, ordered, renamed, or nested under a parent category
- categories are suitable for future wedding niches and new wedding-related verticals
- category-specific metadata and custom fields should be configurable as a later design need, not hardcoded per screen
- adding a new category must not require app redeployment or code changes

### Search and Discovery

- customers can search by keyword, category, store name, product name, or service type
- discovery surfaces should support wedding-focused browsing such as products, services, stores, offers, new arrivals, and popular local businesses
- ranking should remain relevant and local, without automatically favoring paid listings

### Offers and Promotions

- sellers may publish offers for products or services
- offer visibility must reflect moderation and subscription status
- public discovery remains available without login

### Reviews

- reviews are based on a Contact Event, not Verified Purchase
- review eligibility rules remain a business rule handled by backend services
- reviews support trust and moderation workflows

### Reports

- users may report problematic stores, products, services, or reviews
- admin reviews reports and resolves them by policy

### Notifications

- sellers and admins receive relevant notifications
- notifications are role-aware and should remain aligned with future email or in-app notification strategies

### Contact Tracking

- the platform records customer contact events with sellers for trust and future review logic
- direct communication remains external to the platform

### Subscription and Trial

- current monthly subscription price is 2500 YER
- current product limit is 250 items per seller store or business account
- sellers receive a 60-day free trial from the store activation date
- subscription expiry hides public content without deleting seller data

### SEO and Performance

- public store and category pages should be SEO-friendly when appropriate
- the marketplace must support pagination, response time awareness, and efficient database access

### Moderation and Audit

- moderation is post-publication rather than pre-approval
- admin actions must be auditable and visible to the seller when relevant

---

## 11. Product Scope and MVP

### MVP Scope

The initial MVP includes:

- public marketplace browsing without login
- seller storefront creation
- store activation without admin pre-approval
- product and service management
- dynamic category support in principle, managed via admin configuration and data sources
- standard review, report, and notification concepts
- search, discovery, and public listing visibility
- subscription and trial lifecycle management
- admin moderation and visibility controls

### In-Scope Business Rules

- Sana'a is the initial market
- the platform remains web-based only
- public discovery is available without account creation
- seller and admin roles remain separate
- dynamic categories do not require code changes to add a new type
- subscription expiry hides content, but does not delete data
- direct payment integration remains deferred to the final payment phase

### Out-of-Scope for This Phase

- real payment provider integration
- full booking engine or complex event scheduling
- full native mobile application
- final category attribute system implementation beyond design-level readiness

---

## 12. Acceptance Criteria

### Customer Discovery

- a visitor can browse the public marketplace without login
- a customer can search for wedding-related stores or services
- a customer can open a store page and contact the seller using the listed communication channel

### Seller Management

- a seller can create a store and activate it immediately
- a seller can add products and services under the store
- a seller can see the subscription or trial state

### Admin Management

- an admin can review and moderate stores, products, services, reports, and reviews
- an admin can manage categories and activation state for categories
- an admin can review a seller’s status and visibility settings

### Subscription and Visibility

- expired trial or subscription hides public-facing content without deleting data
- reactivation restores visibility when the subscription is valid again

### Dynamic Categories

- a category can be created, edited, ordered, enabled or disabled, and optionally nested
- a new category does not require a code change to appear in the public marketplace

---

## 13. Constraints and Requirements

- do not hardcode wedding categories in code
- keep business values such as pricing and product limits configurable in the data layer whenever possible
- do not start the payment phase in this stage
- do not claim the platform supports a real payment integration before it is actually implemented
- keep all authorization and visibility checks enforced in the backend
- use pagination and efficient queries for public and admin lists

---

## 14. Summary

This PRD reframes the existing marketplace concept into a wedding-specialized platform for Sana'a while preserving the proven base rules of the project: public discovery, separate seller and admin roles, subscription-aware visibility, moderation, and a dynamic category model. The implementation remains intentionally scoped to the current development day and does not jump ahead to future database or payment work.

- Categories are dynamic and managed by admin.
- The taxonomy must be configurable and not hardcoded into the application.
- Categories are used across stores, products, services, offers, and search/discover surfaces.
- Category hierarchy may evolve over time, including future expansion beyond Sana'a.

---

## 32. Location Requirements

- The MVP is scoped to Sana'a, Yemen.
- The architecture should support future expansion to additional cities or regions.
- Current location logic should treat Sana'a as the primary supported market.
- Store and listing location metadata must be consistent with the Sana'a-first scope.

---

## 33. SEO Requirements

- Public pages should be search-engine accessible and SEO-friendly where appropriate.
- Public pages should be structured for indexing where allowed by business policy.
- Core pages should support metadata, visible URL structures, and crawl-friendly layouts.
- Store, product, category, and offer pages should be designed with discoverability in mind.

---

## 34. Analytics Requirements

- The platform should collect and report basic analytics at a minimum.
- Analytics may cover product, service, store, and category performance.
- Basic metrics can support discoverability optimization and seller insights.
- Analytics should not be treated as a substitute for full business intelligence or enterprise reporting in the MVP.

---

## 35. Security Requirements

- The platform must enforce role-based access for customer, seller, and admin operations.
- Public marketplace browsing must remain accessible without login.
- Seller and admin functionality must be protected by authentication and authorization.
- Personal data and account-bound features must be stored and processed with care.
- Audit trails must protect administrative actions and moderation history.

---

## 36. Privacy Considerations

- Public marketplace browsing should not require personal data collection for the base experience.
- Identity-linked behaviors such as favorites, reviews, reports, and personal notifications require account-level identity.
- Seller contact details should be managed as seller-provided public or business contact information as appropriate.
- The system must support user privacy, data minimization, and responsible handling of reports and moderation records.
- Seller and customer data must not be deleted simply because a subscription or trial expires.

---

## 37. MVP Scope

The MVP includes the following:

- Public web marketplace for Sana'a.
- Customer browsing without login.
- Seller account creation and store management.
- Product and service listing management by sellers.
- Store creation with immediate activation.
- Dynamic categories managed by admin.
- Search and discover experiences for public users.
- Favorites for logged-in customers.
- Review eligibility based on contact-event rule model.
- Reporting workflows.
- Seller notifications and admin notices.
- Subscription and trial management framework.
- Payment records and subscription plan data model.
- Moderation and admin intervention tools.
- Audit logging and admin management.
- Basic SEO and analytics support for the public marketplace.

---

## 38. Explicitly Out-of-Scope Items

The following items are explicitly excluded from the MVP and Day 1 scope:

- Mobile application development.
- Non-Sana'a markets in the initial launch.
- Full Jaib payment integration.
- Real-time messaging or chat platform features.
- Social networking, community feed, or influencer features.
- Hardcoded category and plan assumptions.
- Database-driven configuration for subscription values is required, but the implementation of that data layer is part of future product build and not a frontend or backend application implementation in this document.
- Full settlement, fraud management, or financial operations beyond payment record domain support.
- Verified Purchase models for reviews.

---

## 39. Future Roadmap

### Phase 1: MVP Launch (Sana'a)

- Seller onboarding and storefront creation.
- Public discovery pages and search.
- Seller product and service management.
- Basic subscription and trial tracking.
- Admin moderation and audit tooling.
- Payment domain model preparation for future payment integration.

### Phase 2: Marketplace Expansion and Quality Improvements

- Expanded category depth and stronger filtering.
- Improved product/service search relevance and ranking models.
- Better review quality controls and contact-event tracking logic.
- Enhanced seller dashboard analytics and notification experiences.

### Phase 3: Geographic Expansion

- Multi-city or broader-region rollout beyond Sana'a.
- More advanced location management.
- Scalable category and moderation operations.

### Phase 4: Payment Integration and Monetization Maturity

- Jaib integration in a final payment integration phase.
- Expanded subscription plan logic and pricing configuration in the database.
- Automated billing workflows and reconciliation as needed.

---

## 40. Acceptance Criteria

### Store Acceptance Criteria

- A seller can create a store and the store is ACTIVE immediately.
- The system sends a notification to admins when a store is created.
- Admin can view, send a note, suspend, close, or reactivate a store.
- A store can be hidden when its subscription or trial expires.

### Product Acceptance Criteria

- A seller can create a product and the product is ACTIVE immediately.
- The system sends a notification to admin on product creation.
- Admin can view, send a note, suspend, remove, or reactivate a product.
- Product visibility follows moderation and store subscription rules.

### Service Acceptance Criteria

- A seller can create a service and it is ACTIVE immediately.
- Service moderation rules align with the same post-publication model as stores and products.
- Admin can intervene when needed.

### Customer & Public Marketplace Acceptance Criteria

- A customer can browse the public marketplace without creating an account.
- A customer can search and discover products, services, stores, and offers.
- A logged-in customer can save favorites and engage in account-bound activities.

### Review and Reporting Acceptance Criteria

- The system tracks contact events that support future review eligibility decisions.
- Reviews are not based on Verified Purchase.
- Customers and admins can report inappropriate or suspicious listings.

### Subscription & Trial Acceptance Criteria

- The seller receives a 60-day trial when the store becomes active.
- Current subscription values are recognized as 2500 YER monthly and 250 product limit, to be configured in database later.
- Expired subscription or trial results in hiding public content without deleting seller data.

### Admin Acceptance Criteria

- Admin can manage users, sellers, stores, products, services, categories, locations, reports, reviews, notifications, subscriptions, payment records, moderation, and audits.
- Admin can act on moderation and operational issues after publication.

### Payment Domain Acceptance Criteria

- The system has clear domain support for subscription plans, subscriptions, and payment records.
- Jaib is not implemented in the MVP or this phase.

### SEO & Analytics Acceptance Criteria

- Public marketplace pages are structured for SEO-friendliness.
- Basic analytics on marketplace behavior are supported.

---

## 41. Business Rules Summary

This section consolidates the key business rules that must be preserved in the MVP and future product design:

- Sana'a is the supported MVP market; future expansion is reserved for later phases.
- The product is a web platform, not a mobile app.
- Customers can browse the public marketplace without an account.
- Identity-linked features require account-based access.
- Store activation is immediate and does not require admin approval.
- Product activation is immediate and does not require admin approval.
- Service activation is immediate and does not require admin approval.
- Admin moderation is post-publication, not pre-publication.
- Trial is 60 days and starts when the store becomes active.
- Current subscription price is 2500 YER/month and product limit is 250.
- These values must eventually be database-driven rather than hardcoded.
- Expired subscription or trial hides public content but does not delete seller data.
- Reviews are based on Contact Event logic rather than Verified Purchase.
- Categories are dynamic and admin-managed.
- Jaib is intended for future payment integration and is explicitly not implemented in this phase.

---

## 42. Risks, Assumptions, and Dependencies

### Assumptions

- A working business and operational entity for sellers and admins will exist in later implementation phases.
- Future architecture will include separate public website, seller dashboard, and admin dashboard experiences.
- Data models will support subscription configuration, payment records, and future geographic expansion.

### Dependencies

- Role-based access model for customer, seller, and admin.
- Database support for dynamic categories, locations, subscriptions, payment records, and audit records.
- Seller contact channel management and tracking of contact events.

### Risks

- Marketplace trust may be negatively affected if moderation is weak.
- Subscription expiry could create confusion if hiding content is not clearly communicated.
- Review quality depends on the later Contact Event rule model and its implementation.

---

## 43. Decision Log / Clarifications

- The product is expressly a web platform, not mobile.
- The marketplace is discovery-led and not built as a full social commerce platform.
- Sellers remain responsible for their external contact communication channels.
- Jaib is reserved for a future integration phase and is not part of this PRD’s implementation scope.
- The platform must support public browsing without login, while identity-linked actions remain account-based.

---

## 44. Summary

Sana'a Marketplace is a Sana'a-first, web-based discovery marketplace that helps customers find local products, services, stores, and offers while giving sellers a structured storefront and admin teams a moderation and operational toolkit. The MVP deliberately focuses on speed, clarity, and local availability without overbuilding the product. It supports immediate publication for stores, products, and services, follows a post-publication moderation model, supports a 60-day trial, and establishes the subscription, payment-record, category, and localization foundations needed for a sustainable marketplace.

This PRD is intentionally scoped to Day 1 and the initial MVP. It does not implement authentication, payment integration, or application code, and it does not define Jaib APIs or other controller-level details beyond the required domain and business rule boundaries.
