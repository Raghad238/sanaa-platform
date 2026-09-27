# Product Requirements Document (PRD)
# Sana'a Marketplace

## 1. Product Overview

Sana'a Marketplace is a web-based marketplace and discovery platform for the city of Sana'a, Yemen. The platform connects customers with local sellers and service providers who currently market themselves through external channels such as Instagram, Facebook, WhatsApp, TikTok, Telegram, websites, and other direct communication tools. The product is designed to centralize local discovery, improve visibility for sellers, and make it easier for customers to find businesses, products, services, and offers in one place.

The MVP is intentionally limited to Sana'a and is designed to support a future multi-city or broader geographic expansion without requiring a full platform redesign. The product is not a mobile app; it is a web platform with public-facing marketplace pages and separate internal areas for sellers and administrators.

The platform is primarily a discovery marketplace. Customers browse public content, search for products and services, view store profiles, discover offers, and then contact sellers through the seller-provided communication channels. The product does not require the customer to create an account to browse the public marketplace, but account-based features such as favorites, reviews, reports, personal notifications, and identity-linked actions require authentication and user identity.

---

## 2. Problem Statement

Many local businesses and service providers in Sana'a rely on fragmented social media and messaging channels to market their offerings. This creates several challenges:

- Customers struggle to discover trustworthy local stores and service providers in one place.
- Sellers lack a structured, searchable presence that is independent of social media platforms.
- There is no single local marketplace that organizes categories, store information, product listings, services, and offers.
- Store and seller visibility is fragmented across Instagram, Facebook, WhatsApp, TikTok, Telegram, and other channels.
- Customers cannot easily compare offerings or find businesses based on category, location, date, or popularity.
- Sellers often have no reliable way to manage subscriptions, store visibility, and content lifecycle in one place.
- Moderation and administrative oversight are difficult when content lives across multiple unmanaged channels.

The marketplace addresses this by creating a centralized, searchable distribution layer for local commerce and services, while still preserving seller-led communication via their preferred contact channels.

---

## 3. Proposed Solution

Sana'a Marketplace will provide a public web marketplace where customers can discover stores, products, services, offers, categories, and local businesses in Sana'a. Sellers can create and manage storefronts, add products and services, manage contact channels, and maintain store information. Administrators can moderate stores, products, services, categories, reports, reviews, subscriptions, and platform content after publication.

The product follows a lightweight marketplace model:

- Public browsing is available without login.
- Seller accounts are required for managing stores and inventory.
- Customer accounts are required for features that involve identity and personalization.
- Admin accounts manage moderation, listings, categories, subscriptions, reports, audit data, and platform operations.
- Seller contact details remain external to the platform; the platform helps customers discover and initiate contact, but does not replace the seller's communication methods.

The platform will support SEO-friendly public pages to improve search discoverability where appropriate, while maintaining a clear separation between public marketplace pages, seller dashboard workflows, and admin dashboard functions.

---

## 4. Product Vision

To become Sana'a’s trusted, searchable, and accessible local marketplace for products, services, and businesses—while enabling sellers to manage a digital storefront and allowing customers to discover and connect with trusted local providers efficiently.

---

## 5. Goals

### Business Goals
- Create a reliable local marketplace for Sana'a, Yemen.
- Increase seller visibility and customer discovery.
- Support a frictionless browsing and search experience for local products and services.
- Provide a clear public discovery platform without requiring user login for basic browsing.
- Establish a sustainable subscription model for sellers.
- Provide an operational moderation and audit framework for administrators.

### User Goals
- Customers can quickly discover local products, services, and stores.
- Sellers can manage their store and listings from a centralized dashboard.
- Admins can moderate listings, manage subscriptions, and handle reports and reviews.

### Product Goals
- Ship a focused MVP for Sana'a only.
- Support dynamic categories and flexible geographic expansion later.
- Keep public pages SEO-friendly and indexable where appropriate.
- Ensure content visibility is governed by subscription and moderation rules rather than deleting seller data.

---

## 6. Non-Goals

The following are explicitly out of scope for the Day 1 PRD and the MVP phase:

- Building a mobile application.
- Supporting markets outside Sana'a in the initial launch.
- Launching a full payment integration with Jaib.
- Implementing a real-time marketplace with complex bidding or auction flows.
- Full customer social graph, community features, or chat functionality beyond contact tracking and storefront contact channels.
- Hardcoded category assumptions; categories must remain dynamic.
- Full enterprise-grade analytics beyond basic product, store, and subscription tracking.
- Any authentication system implementation details beyond high-level requirements.
- Any admin pre-approval workflow for new stores, products, or services.

---

## 7. Target Market

### Primary Market
- Customers in Sana'a seeking local products and services.
- Small and medium-sized sellers operating locally in Sana'a.
- Service providers who currently rely on social media or messaging channels.

### Secondary Market
- Sellers outside the initial city who may expand into the platform later.
- Admins and moderators whose job is to maintain quality and policy compliance.

---

## 8. Personas

### 8.1 Customer Persona
A customer is a person in Sana'a who wants to discover local stores, products, or services quickly and contact sellers directly. The customer may or may not create an account depending on the feature set. Customers want convenience, trust, and speed in finding relevant local offerings.

Needs:
- Discover stores and listings without login.
- Search by category, store, name, or keyword.
- Compare product or service offers.
- View store reputation indicators, reviews, and contact channels.
- Save favorite stores or items if logged in.
- Submit reports or leave reviews if eligible and authenticated.

### 8.2 Seller Persona
A seller is a business or independent service provider operating in Sana'a. They may already sell through social media or messaging apps and want a better organized online storefront. Sellers need to manage inventory, services, store profiles, and contact information.

Needs:
- Create and manage a store profile.
- Add and update products and services.
- Manage contact channels and store information.
- View subscription and trial status.
- Receive notifications and admin notes.
- Maintain visibility in public discovery where allowed by plan or policy.

### 8.3 Admin Persona
An administrator monitors platform quality, content moderation, categories, subscriptions, notifications, user activity, and operational health. They must be able to intervene when stores, products, services, reports, or reviews require action.

Needs:
- Manage users, sellers, stores, products, and services.
- Moderate categories, reports, and reviews.
- Review subscription and payment records.
- Send notes to sellers.
- Suspend, close, reactivate, or remove listings as needed.
- Maintain audit logs and administrative visibility.

---

## 9. Customer Persona

See Section 8.1. The customer is the primary discovery user. They are not required to log in for public browsing, but may authenticate for identity-linked features such as favorites, reviews, reports, personal notifications, and account management.

---

## 10. Seller Persona

See Section 8.2. Seller accounts are required for business operations. Sellers can create stores, list products and services, manage contact information, and track their subscription and trial status.

---

## 11. Admin Persona

See Section 8.3. The admin persona oversees platform quality, compliance, and business operations. Admins focus on monitoring and moderating platform content and operational records.

---

## 12. User Journeys

### 12.1 Customer Journey
1. Customer opens public marketplace homepage.
2. Customer browses categories, offers, nearby stores, popular products, or services.
3. Customer searches by keyword, category, or store name.
4. Customer opens a store or listing page.
5. Customer views store details, contact channels, pricing, reviews, and service information.
6. Customer contacts the seller through the listed external contact channels.
7. If logged in, customer may save favorites, report concerns, or leave a review if eligible.

### 12.2 Seller Journey
1. Seller creates account and signs in.
2. Seller creates a store profile.
3. Store becomes active immediately and is visible in the public marketplace, subject to subscription/trial rules and later moderation.
4. Seller adds products and/or services.
5. Seller manages contact channels and store details.
6. Seller monitors trial or subscription status.
7. Seller receives notifications and any admin notes.
8. Seller updates inventory or store details as needed.

### 12.3 Admin Journey
1. Admin logs in to admin dashboard.
2. Admin reviews new store creation notifications.
3. Admin reviews and manages users, stores, products, services, reports, reviews, subscriptions, and categories.
4. Admin sends notes, suspends, reactivates, closes, or removes listings where required.
5. Admin reviews audit logs and moderation actions.
6. Admin monitors subscription status and content visibility changes.

---

## 13. Customer Journey

Detailed customer experience is the same as the public marketplace flow described above: discover → search → evaluate → contact → follow-up. The customer experience is intentionally lightweight and does not require an account for typical discovery activity.

---

## 14. Seller Journey

Detailed seller journey: account creation → store creation → product/service listing → contact channel setup → visibility management → subscription monitoring → content updates → moderation support.

---

## 15. Admin Journey

Detailed admin journey: operational review → moderation decisions → communication with sellers → policy enforcement → subscription oversight → system governance.

---

## 16. Functional Requirements

### Authentication
- Public marketplace browsing must not require an account.
- Authentication is required for account-bound features such as favorites, reviews, reports, personal notifications, and seller/admin access.
- The product requires separate user roles for customer, seller, and admin.
- The product must support secure session management and role-based access controls.

### Customer Accounts
- Customers may browse without an account.
- Customers may create an account for personalized behavior.
- Customers must be able to manage favorites, profile settings, and account-linked actions.

### Seller Accounts
- Sellers require an account to create and manage stores, products, and services.
- Sellers can manage store profile details, contact channels, products, services, and subscription information.
- Sellers receive notifications and admin notes.

### Admin Accounts
- Admins require an account and elevated permissions.
- Admins manage users, sellers, stores, products, services, categories, locations, reports, reviews, notifications, subscriptions, payment records, moderation, and audit information.

### Stores
- Sellers can create one or more stores according to business rules.
- Store status becomes ACTIVE immediately when created.
- No admin pre-approval workflow is required.
- Admin receives a notification when a store is created.
- Admin can view, send notes, suspend, close, or reactivate stores.
- Store content can become hidden when subscription expires.

### Products
- Sellers can create product listings.
- Product becomes ACTIVE immediately when created.
- No admin pre-approval workflow is required.
- Admin receives a notification when a product is created.
- Admin can view, send notes, suspend, remove, or reactivate products.
- Product visibility must be consistent with the supporting store’s subscription status and moderation state.

### Services
- Sellers can create service listings.
- Service becomes ACTIVE immediately when created.
- No admin pre-approval workflow is required.
- Admins can later moderate, suspend, remove, or reactivate services as required.

### Categories
- Categories are dynamic and managed by admins.
- Categories must not be assumed to be hardcoded.
- Listings should be categorized dynamically according to admin-managed taxonomy.

### Locations
- The initial MVP targets Sana'a only.
- The architecture must allow future expansion beyond Sana'a.
- Location data must support local-only product discovery in the MVP.

### Search
- Public users and authenticated users must be able to search by product, service, store, keyword, category, and offer.
- Search results should support relevant ordering and ranking without automatically privileging paid subscription listings.

### Discover
- Discover experiences should support categories such as All, Products, Services, Stores, Offers, New, Popular, and Nearby.
- Ranking must not automatically favor paid subscriptions.
- Discovery is part of the public marketplace experience.

### Offers
- Sellers may publish promotional offers relevant to products or services.
- Offers should be discoverable through public marketplace surfaces.
- Offer visibility must reflect moderation and subscription rules.

### Favorites
- Logged-in customers can save favorites for products, services, or stores.
- Favorites are account-bound and require user identity.

### Reviews
- Reviews are based on a Contact Event, not Verified Purchase.
- Review eligibility is determined by future business rules tied to customer contact with the seller.
- The review system supports customer feedback and moderation guidance.

### Reports
- Customers and admins may be able to submit reports related to suspicious, inaccurate, or inappropriate content.
- Report workflows must support review and moderation actions.

### Notifications
- Users receive relevant notifications when applicable.
- Sellers receive store creation and subscription-trial notifications.
- Admins receive alerts for created stores and products.
- Notifications should support account-related operational updates.

### Contact Tracking
- The platform must support tracking of customer contact events with sellers.
- Contact tracking is a key input for future review eligibility.
- Seller contact channels are managed independently and used for customer contact outside the platform.

### Subscription
- Subscription plans, subscription records, and payment records should be supported in database design from early stages.
- Subscription values are not hardcoded in business logic and must eventually come from the database.
- Current plan pricing is 2500 YER monthly.
- Current product limit is 250 products.
- Subscription expiration must hide public listing visibility rather than delete seller data.

### Trial
- Sellers receive a 60-day free trial.
- Trial begins when the store becomes active.
- Trial details must be configurable in the database and not hardcoded into business logic.
- If trial expires, store visibility is removed from public marketplace and related products/services become hidden where required.
- Seller data must remain intact.

### Payment Records
- The database must support subscription plans, subscriptions, and payment records from early stages.
- Jaib is the intended payment provider, but Jaib API integration is postponed to the final payment integration phase.
- No Jaib endpoints, authentication flows, webhooks, or API behavior are to be implemented or specified in this PRD.

### Analytics
- The platform should capture basic analytics on marketplace usage, store views, product views, category performance, and subscription status.
- Analytics should support future business optimization and reporting.

### SEO
- Public marketplace pages must be SEO-friendly.
- Public pages should support indexing where appropriate.
- Store, product, and category pages should be structured to support discoverability in search engines.

### Moderation
- Moderation is necessarily post-publication for stores, products, and services.
- Admins must be able to review and intervene after content goes live.
- Content may be suspended, removed, hidden, or reactivated based on policy and operational action.

### Audit Logging
- System actions must be auditable for moderation, user actions, subscription changes, and administrative changes.
- Audit information is part of admin responsibilities.

---

## 17. Store Requirements

- Sellers can create a store profile.
- Store status becomes ACTIVE immediately upon creation.
- No admin approval is required before store activation.
- Admin is notified when store is created.
- Store must support store information, contact channels, images, location, and category metadata.
- Admin may view, send notes, suspend, close, or reactivate stores.
- A store can be hidden from public access when subscription or trial expires.
- Seller data is retained even if the store is hidden or closed.

---

## 18. Product Requirements

- A seller can create products in the seller dashboard.
- Product becomes ACTIVE immediately.
- No admin pre-approval workflow is required.
- Admin receives notification on product creation.
- Product listing includes title, description, price, category, images, quantity or status metadata where appropriate, and store association.
- Admin can view, send note, suspend, remove, or reactivate product listings.
- Product visibility is hidden when required by store subscription status or moderation action.

---

## 19. Service Requirements

- Sellers can create services using a similar workflow to products.
- Services become ACTIVE immediately.
- No admin approval is required before publication.
- Admin can moderate services after publication.
- Services include service details, pricing or duration model, location applicability, and seller/store association.
- Service visibility must reflect moderation and subscription status.

---

## 20. Search Requirements

- Users can search products, services, stores, offers, and categories.
- Search must support keyword and category-driven discovery.
- Search results should prioritize relevance and local context.
- Paid subscription should not automatically guarantee top ranking.
- Search experiences should support future refinement such as filters by location, category, or store attributes.

---

## 21. Discover Requirements

- The public marketplace should offer a discovery experience that includes concepts such as All, Products, Services, Stores, Offers, New, Popular, and Nearby.
- Discovery surfaces must remain accessible to unregistered users.
- Ranking must not be artificially biased toward paying sellers.
- The discovery experience should support future personalization and localized placement.

---

## 22. Favorites Requirements

- Favorites are an account-based feature.
- A logged-in customer can save products, services, or stores.
- Customers can manage favorites in their profile.
- Favorites are not required for general browsing.

---

## 23. Reviews Requirements

- Customers may leave reviews when they are eligible according to future contact-event business rules.
- Review eligibility is not based on Verified Purchase.
- Review functionality must support moderation and reporting workflows.
- Reviews should be visible on store and/or listing surfaces when appropriate.

---

## 24. Reports Requirements

- Users must be able to report problematic listings or store behavior.
- Reports should capture reason, detail, and relevant item reference.
- Admins can review and resolve reports.
- Reporting should support content moderation and trust-building without needing a full social platform feature set.

---

## 25. Notification Requirements

- Notification functionality is required for user, seller, and admin communication.
- Sellers receive notifications about trial status, subscription status, store creation, and admin notes.
- Admins receive store and product creation notifications.
- Notifications must be role-aware and support future push or email integration as applicable.

---

## 26. Subscription Requirements

- Subscription management is required for seller visibility and platform access.
- Current subscription plan price: 2500 YER per month.
- Billing model: monthly.
- Current product limit: 250 products.
- Subscription values must eventually be stored in the database and not hardcoded in application logic.
- Expired subscriptions must hide content from public access without deleting seller data.
- Reactivation of the subscription should restore public visibility according to business rules.

---

## 27. Trial Rules

- Sellers receive a 60-day free trial.
- Trial begins when the store becomes active.
- The trial is a temporary promotion and not a permanent business rule.
- Trial status and expiry must be managed in a configurable way.
- After trial expiry, public visibility may be hidden until subscription is active again.
- Seller data remains stored regardless of trial or subscription expiration.

---

## 28. Payment Domain Requirements

- The platform must support payment-related domain models from early stages, including subscription plans, subscription records, and payment records.
- Jaib is the intended provider for future payment processing.
- Jaib integration is intentionally deferred until the final payment integration phase.
- This PRD does not define Jaib endpoints, credentials, API contracts, webhooks, or authentication behavior.
- Payment domain requirements are limited to data architecture preparation and business clarity for future integration.

---

## 29. Moderation Rules

- Store, product, and service content can be published immediately and is not subject to admin pre-approval.
- Admin can later intervene when necessary.
- Moderation actions may include sending notes, suspending, removing, closing, or reactivating content.
- Moderation decisions must be logged for audit purposes.
- Administrative notes to sellers must be visible and actionable in the seller dashboard.

---

## 30. Contact Tracking Requirements

- The marketplace must account for customer contact events with sellers.
- Contact tracking is required for future review eligibility logic.
- Contact channels are managed by sellers and used externally to the platform.
- Contact events are business records that support trust and review eligibility rules.

---

## 31. Category Requirements

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
