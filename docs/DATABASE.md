# Database Design — Sanaa Marketplace

**Project:** Sanaa Marketplace
**Database:** MySQL 8+
**ORM:** Prisma
**Status:** Design / Documentation
**Scope:** MVP

---

## 1. Purpose

This document defines the database design for the Sanaa Marketplace platform.

The database supports:

- Customers discovering products and services.
- Customers discovering online sellers and stores.
- Sellers managing one or more stores.
- Products and services listed by sellers.
- Dynamic, hierarchical product and service categories.
- Store locations.
- External seller contact channels.
- Favorites.
- Reviews linked to a platform-recorded contact event (not a verified purchase).
- Offers and discounted products.
- Reports and admin notes.
- Subscriptions and payments.
- Notifications.
- Analytics events.
- Roles and permissions.
- Audit logs.

This document defines the target database design for the MVP. It is a design document, not a claim that every listed relationship is already implemented in Prisma.

The current Prisma schema is partial relative to this target: it enforces one store per seller, has no `UserRole` or `ContactEvent` models, does not link reviews to contact events, has no category ordering field, and associates subscriptions with sellers while storing trial end on stores. The Day 8 scope documents the target only; schema and migration changes belong to the later database implementation day.

---

# 2. Database Technology

## 2.1 Database

MySQL 8+

## 2.2 ORM

Prisma

## 2.3 Environment

The database connection must be provided through environment configuration.

Example:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"
```

The actual credentials must never be committed to Git.

---

# 3. General Database Rules

## 3.1 Primary Keys

All main entities should use stable unique primary keys.

The implementation should use UUIDs or another stable non-sequential identifier strategy consistently across the project.

The exact Prisma implementation must be decided during database implementation and documented before migrations are created.

---

## 3.2 Timestamps

Entities that represent mutable business data should generally contain:

- `created_at`
- `updated_at`

Where applicable, records that can be archived, suspended, or soft-deleted may also contain:

- `deleted_at`

The exact use of soft deletion must follow the business rules of the entity.

---

## 3.3 Status Fields

Statuses must use a controlled set of values.

The application must not create arbitrary status strings.

Where Prisma enums are appropriate, they should be preferred.

---

## 3.4 Currency

Product and service prices are stored in **Yemeni Riyal (YER)**.

The database must avoid floating-point values for monetary amounts.

Monetary values should use an appropriate fixed-precision decimal representation.

Example:

```text
price = DECIMAL
currency = YER
```

Platform subscription prices are defined in **YER**.

---

## 3.5 JSON Fields

JSON fields may be used where flexible structured data is required, such as:

- subscription plan features
- analytics metadata
- selected configuration data

JSON must not be used as a replacement for normal relational tables when the data requires relationships, querying, constraints, or indexing.

---

# 4. Core Entities

The MVP database contains the following 29 core tables:

1. `users`
2. `sellers`
3. `stores`
4. `categories`
5. `products`
6. `product_images`
7. `services`
8. `service_images`
9. `locations`
10. `store_locations`
11. `contact_channels`
12. `offers`
13. `reviews`
14. `favorite_products`
15. `favorite_stores`
16. `favorite_services`
17. `reports`
18. `admin_notes`
19. `subscription_plans`
20. `subscriptions`
21. `payments`
22. `notifications`
23. `analytics_events`
24. `roles`
25. `permissions`
26. `role_permissions`
27. `audit_logs`
28. `user_roles`
29. `contact_events`

---

# 5. Table Definitions

## 5.1 users

Represents all platform users.

Users may be customers, sellers, or administrators depending on their assigned role(s). Role assignments are stored separately so a user can have the authorized combination of roles without adding role-specific columns to `users`.

### Main fields

- `id`
- `email`
- `password_hash`
- `name`
- `phone`
- `status`
- `created_at`
- `updated_at`
- role assignments through `user_roles`

### Rules

- `email` must be unique.
- Passwords must never be stored in plaintext.
- Only password hashes are stored.
- A user may become a seller through the `sellers` table.
- User-to-role assignments are stored in `user_roles`; role capabilities are defined through `role_permissions`.

---

# 5.2 sellers

Represents seller-specific information.

### Main fields

- `id`
- `user_id`
- `created_at`
- `updated_at`

### Relationships

- One `user` can have zero or one `seller` profile.
- One `seller` may own one or more stores.

### Rules

- `user_id` must be unique.
- A seller profile may own multiple stores; each store has an independent activation and subscription lifecycle.

---

# 5.3 stores

Represents a seller's public store.

### Main fields

- `id`
- `seller_id`
- `name`
- `slug`
- `description`
- `logo_url`
- `cover_image_url`
- `status`
- `activated_at`
- `created_at`
- `updated_at`

### Relationships

- One seller → many stores.
- One store → many products.
- One store → many services.
- One store → many contact channels.
- One store → many reviews.
- One store → many locations through `store_locations`.
- One store → many favorites through `favorite_stores`.

### Rules

- `seller_id` is indexed and references the owning seller.
- `slug` must be unique.
- A newly created store has status `PENDING_ACTIVATION` and is visible to administrators, not public visitors.
- Only an authorized administrator can activate a pending store.
- The first successful activation records `activated_at` and starts the store's 60-day trial. Repeated activation must not reset or extend the trial.
- Trial timestamps are stored on the store's subscription record.
- Store status and subscription/trial status are separate: a valid subscription does not override a suspended or closed store.
- A store is publicly visible only after activation and while its trial or subscription is valid.
- Expiration hides the store from public discovery but preserves its data.

---

# 5.4 categories

Represents product and service categories.

### Main fields

- `id`
- `name`
- `slug`
- `description`
- `parent_id`
- `sort_order`
- `status`
- `created_at`
- `updated_at`

### Relationships

Categories may have a hierarchical structure:

```text
Category
 ├── Parent Category
 └── Child Categories
```

### Rules

- A category may have a parent category.
- A category may have many child categories.
- Categories can be used by both products and services.
- Categories are database-managed: administrators can create, rename, reorder, activate/deactivate, and nest them without an application redeployment.
- Sellers may select available categories when creating products or services.
- A category's slug is unique. Inactive categories remain stored and are unavailable for new public listings.
- Category-specific custom-field definitions are a later design concern and are not introduced by this MVP model.

---

# 5.5 products

Represents products listed by sellers.

### Main fields

- `id`
- `store_id`
- `category_id`
- `name`
- `slug`
- `description`
- `price`
- `currency`
- `status`
- `created_at`
- `updated_at`

### Relationships

- One store → many products.
- One category → many products.
- One product → many product images.
- One product → offers.
- One product → many favorite records.

### Rules

- Product prices are stored in YER.
- Product activation is immediate after creation.
- Admin does not approve products before publication.
- Admin may later moderate, suspend, remove, or reactivate products.
- A seller may add any supported product type.
- Maximum products per store in the MVP: **250**.
- Expired subscription hides public products but preserves their data.

---

# 5.6 product_images

Represents images belonging to products.

### Main fields

- `id`
- `product_id`
- `image_url`
- `sort_order`
- `created_at`

### Relationships

- One product → many product images.

### Rules

- Images belong to exactly one product.
- `sort_order` controls display order.

---

# 5.7 services

Represents services offered by sellers.

### Main fields

- `id`
- `store_id`
- `category_id`
- `name`
- `slug`
- `description`
- `price`
- `currency`
- `status`
- `created_at`
- `updated_at`

### Relationships

- One store → many services.
- One category → many services.
- One service → many service images.
- One service → many favorite records.

### Rules

- Service prices are stored in YER when a service has a price.
- Services are activated immediately after creation.
- Admin does not approve services before publication.
- Admin may later moderate, suspend, remove, or reactivate services.
- Expired subscription hides public services but preserves their data.

---

# 5.8 service_images

Represents images belonging to services.

### Main fields

- `id`
- `service_id`
- `image_url`
- `sort_order`
- `created_at`

### Relationships

- One service → many service images.

---

# 5.9 locations

Represents reusable geographic locations.

### Main fields

- `id`
- `name`
- `type`
- `parent_id`
- `created_at`
- `updated_at`

### Purpose

Locations allow stores to be associated with geographic areas without duplicating location data.

The MVP is initially focused on Sana'a.

---

# 5.10 store_locations

Junction table connecting stores with locations.

### Main fields

- `store_id`
- `location_id`
- `created_at`

### Relationships

```text
stores N:M locations
```

### Rules

A store may be associated with one or more locations.

---

# 5.11 contact_channels

Represents the external communication channels through which customers can contact a seller.

### Main fields

- `id`
- `store_id`
- `type`
- `value`
- `label`
- `is_primary`
- `is_active`
- `created_at`
- `updated_at`

### Supported channel types

- WhatsApp
- Instagram
- Facebook
- TikTok
- Telegram
- Website
- Phone
- Other

### Rules

The platform provides links or actions that allow customers to contact sellers through external channels.

The platform cannot read or inspect conversations occurring on those external services.

---

# 5.12 offers

Represents promotional offers for products.

### Main fields

- `id`
- `product_id`
- `old_price`
- `new_price`
- `discount_percentage`
- `start_at`
- `end_at`
- `status`
- `created_at`
- `updated_at`

### Rules

- `new_price` must be lower than `old_price`.
- The MVP allows only one active offer per product.
- Offers may have a start and end date.
- Expired offers must not be presented as active offers.
- The original product price remains represented by the product price field according to the final implementation decision.

---

# 5.13 reviews

Represents customer reviews of stores.

### Main fields

- `id`
- `user_id`
- `store_id`
- `contact_event_id`
- `rating`
- `comment`
- `status`
- `created_at`
- `updated_at`

### Relationships

- One user → many reviews.
- One store → many reviews.

### Rules

- Reviews are allowed only after a contact event with the seller.
- A contact event does not mean a verified purchase.
- The review references a `contact_events` record for the same customer and store. This verifies only a platform-side contact action, not a conversation or purchase.
- One customer may submit at most one review per store.
- Database uniqueness should enforce:

```text
UNIQUE(user_id, store_id)
```

- Review content may be moderated by administrators.
- The backend must verify that the referenced contact event belongs to the same user and store. Do not treat this relationship as verified purchase.

---

# 5.14 favorite_products

Junction table for users favoriting products.

### Main fields

- `user_id`
- `product_id`
- `created_at`

### Rules

A user cannot favorite the same product more than once.

Recommended constraint:

```text
UNIQUE(user_id, product_id)
```

---

# 5.15 favorite_stores

Junction table for users favoriting stores.

### Main fields

- `user_id`
- `store_id`
- `created_at`

### Rules

A user cannot favorite the same store more than once.

Recommended constraint:

```text
UNIQUE(user_id, store_id)
```

---

# 5.16 favorite_services

Junction table for users favoriting services.

### Main fields

- `user_id`
- `service_id`
- `created_at`

### Rules

A user cannot favorite the same service more than once.

Recommended constraint:

```text
UNIQUE(user_id, service_id)
```

---

# 5.17 reports

Represents reports submitted by users or administrators about platform content.

### Main fields

- `id`
- `reporter_user_id`
- `target_type`
- `target_id`
- `reason`
- `description`
- `status`
- `resolved_by`
- `resolved_at`
- `created_at`
- `updated_at`

### Possible target types

Examples include:

- store
- product
- service
- review
- user

### Important rule

The relationship is polymorphic:

```text
target_type + target_id
```

MySQL foreign keys cannot directly enforce this polymorphic relationship.

Therefore:

**Backend validation is required.**

The API must verify that the target exists and that the target type is valid before creating or processing a report.

---

# 5.18 admin_notes

Represents internal administrative notes associated with platform entities.

### Main fields

- `id`
- `admin_user_id`
- `target_type`
- `target_id`
- `note`
- `created_at`
- `updated_at`

### Purpose

Administrators may use notes to document moderation actions, observations, or follow-up information.

### Polymorphic relationship

```text
target_type + target_id
```

This relationship must be validated by backend logic.

Admin notes are internal and should not be exposed to ordinary customers.

---

# 5.19 subscription_plans

Represents available subscription plans.

### MVP plan

The initial marketplace subscription configuration is:

```text
Price: 2500 YER
Billing interval: Monthly
Free trial: 60 days
Maximum products: 250
```

### Main fields

- `id`
- `name`
- `description`
- `price`
- `currency`
- `billing_interval`
- `trial_days`
- `max_products`
- `features`
- `status`
- `created_at`
- `updated_at`

### Rules

The plan configuration should be stored in the database rather than hard-coded throughout the application.

Additional plan features may be stored in a JSON field when appropriate.

---

# 5.20 subscriptions

Represents a store's subscription to a subscription plan.

### Main fields

- `id`
- `store_id`
- `plan_id`
- `status`
- `trial_started_at`
- `trial_ends_at`
- `current_period_start`
- `current_period_end`
- `cancelled_at`
- `created_at`
- `updated_at`

### Relationships

- One store → many subscriptions over time.
- One subscription plan → many subscriptions.

### Rules

The store's subscription status determines whether that store and its public content should be visible. A store's initial trial is created only when an administrator first activates it. Each store has an independent trial and subscription lifecycle.

When a subscription expires:

- Public store is hidden.
- Public products are hidden.
- Public services are hidden.
- Existing data is preserved.
- The seller's data is not automatically deleted.

---

# 5.21 payments

Represents payment transactions associated with subscriptions.

### Main fields

- `id`
- `subscription_id`
- `amount`
- `currency`
- `provider`
- `provider_transaction_id`
- `status`
- `paid_at`
- `metadata`
- `created_at`
- `updated_at`

### Supported payment provider direction

The intended payment provider is:

```text
JEEB
```

### Important scope rule

Payment integration is intentionally postponed to the final major implementation phase.

The database may contain payment structures before the actual JEEB API integration is implemented.

No payment gateway credentials should be required for the early development stages.

---

# 5.22 notifications

Represents notifications shown to platform users.

### Main fields

- `id`
- `user_id`
- `type`
- `title`
- `message`
- `data`
- `read_at`
- `created_at`

### Purpose

Notifications may inform users about relevant platform events.

Examples:

- New store activity.
- Product activity.
- Service activity.
- Subscription events.
- Moderation actions.
- Administrative messages.

### Admin notification requirements

Administrators should receive notifications when:

- A new store is created.
- A new product is created.
- A new service is created.

These notifications do not block activation.

---

# 5.23 analytics_events

Represents platform events used for analytics and business tracking.

### Main fields

- `id`
- `user_id`
- `event_type`
- `target_type`
- `target_id`
- `metadata`
- `created_at`

### Examples

Possible events include:

- product_view
- store_view
- service_view
- favorite_product
- favorite_store
- favorite_service
- contact_click
- search
- category_view

### Important rule

The platform may track that a user clicked a seller's contact channel.

The platform cannot inspect or read the actual conversation on:

- WhatsApp
- Instagram
- Facebook
- TikTok
- Telegram
- Phone calls
- Other external communication systems

Analytics must therefore represent platform-side events only.

---

# 5.24 roles

Represents authorization roles.

### Main fields

- `id`
- `name`
- `description`
- `created_at`
- `updated_at`

### Examples

Potential roles include:

- customer
- seller
- admin
- super_admin

The exact role implementation may evolve as authorization is implemented.

---

# 5.25 permissions

Represents individual permissions.

### Main fields

- `id`
- `name`
- `description`
- `created_at`
- `updated_at`

### Examples

Potential permissions include:

```text
store.create
store.update
store.delete
product.create
product.update
product.delete
service.create
service.update
service.delete
review.moderate
report.manage
subscription.manage
user.manage
audit.read
```

The final permission list should be defined during authorization implementation.

---

# 5.26 role_permissions

Junction table connecting roles and permissions.

### Main fields

- `role_id`
- `permission_id`

### Relationships

```text
roles N:M permissions
```

### Rules

A role may have many permissions.

A permission may belong to many roles.

Recommended uniqueness:

```text
UNIQUE(role_id, permission_id)
```

---

# 5.27 audit_logs

Represents security and administrative audit records.

### Main fields

- `id`
- `user_id`
- `action`
- `target_type`
- `target_id`
- `metadata`
- `created_at`

### Purpose

Audit logs provide traceability for important administrative and system actions.

Examples:

- Store suspension.
- Store reactivation.
- Product removal.
- Service removal.
- User status change.
- Role change.
- Subscription-related administrative action.

### Polymorphic relationship

```text
target_type + target_id
```

As with reports and admin notes, target validation must be implemented in backend logic.

Audit logs should be append-oriented and should not be casually modified or deleted.

---

## 5.28 user_roles

Junction table assigning roles to users.

### Main fields

- `user_id`
- `role_id`
- `created_at`

### Relationships and constraints

- One user may have multiple roles, and one role may be assigned to multiple users.
- Primary key: `(user_id, role_id)`.
- Role assignment does not replace server-side authorization checks.

---

## 5.29 contact_events

Records a customer's platform-side action to open or initiate contact with a store through one of its external contact channels.

### Main fields

- `id`
- `user_id` (nullable for anonymous platform-side contact clicks)
- `store_id`
- `contact_channel_id`
- `created_at`

### Relationships and rules

- A contact event belongs to one store; it may be associated with an authenticated user. The channel reference identifies the channel selected at the time.
- A store and an authenticated user may each have many contact events.
- A contact event may support at most one review.
- Only a contact event associated with the same authenticated user as the review can satisfy review eligibility; anonymous events cannot qualify a review.
- The event proves only that the customer initiated a contact action on the platform. It does not prove a completed conversation or purchase.
- The platform must not collect or inspect messages on external services.

---

# 6. Entity Relationships

The core relationships are:

```text
USERS 1 ── 0..1 SELLERS
SELLERS 1 ── N STORES
STORES 1 ── N PRODUCTS ── N IMAGES
PRODUCTS 1 ── N OFFERS
STORES 1 ── N SERVICES ── N IMAGES
STORES 1 ── N CONTACT_CHANNELS
STORES 1 ── N REVIEWS
STORES 1 ── N CONTACT_EVENTS
STORES N ── M LOCATIONS (through STORE_LOCATIONS)
```

Users interact with products, stores, and services through favorites:

```text
users
 ├── N : M ── products
 ├── N : M ── stores
 └── N : M ── services
```

Subscriptions:

```text
SELLERS 1 ── N STORES 1 ── N SUBSCRIPTIONS N ── 1 SUBSCRIPTION_PLANS
SUBSCRIPTIONS 1 ── N PAYMENTS
```

Authorization:

```text
roles
   │
   └── N : M ── permissions
          │
    role_permissions
```

---

# 7. Mermaid ERD

The following ERD represents the intended high-level relational structure.

```mermaid
erDiagram
        USERS ||--o| SELLERS : has
        SELLERS ||--o{ STORES : owns
        USERS ||--o{ USER_ROLES : assigned
        ROLES ||--o{ USER_ROLES : includes
    STORES ||--o{ PRODUCTS : contains
    STORES ||--o{ SERVICES : offers
    STORES ||--o{ CONTACT_CHANNELS : provides
        STORES ||--o{ REVIEWS : receives
        STORES ||--o{ CONTACT_EVENTS : records
        USERS o|--o{ CONTACT_EVENTS : initiates
        CONTACT_CHANNELS ||--o{ CONTACT_EVENTS : used_for
    CATEGORIES ||--o{ PRODUCTS : categorizes
    CATEGORIES ||--o{ SERVICES : categorizes
    CATEGORIES ||--o{ CATEGORIES : contains
    PRODUCTS ||--o{ PRODUCT_IMAGES : has
    PRODUCTS ||--o{ OFFERS : has
    SERVICES ||--o{ SERVICE_IMAGES : has
    STORES ||--o{ STORE_LOCATIONS : has
    LOCATIONS ||--o{ STORE_LOCATIONS : used_by
    USERS ||--o{ FAVORITE_PRODUCTS : favorites
    PRODUCTS ||--o{ FAVORITE_PRODUCTS : favorited
    USERS ||--o{ FAVORITE_STORES : favorites
    STORES ||--o{ FAVORITE_STORES : favorited
    USERS ||--o{ FAVORITE_SERVICES : favorites
    SERVICES ||--o{ FAVORITE_SERVICES : favorited
        USERS ||--o{ REVIEWS : writes
        CONTACT_EVENTS ||--o| REVIEWS : supports
    USERS ||--o{ REPORTS : creates
    USERS ||--o{ ADMIN_NOTES : writes
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ ANALYTICS_EVENTS : generates
    USERS ||--o{ AUDIT_LOGS : performs
        STORES ||--o{ SUBSCRIPTIONS : has
    SUBSCRIPTION_PLANS ||--o{ SUBSCRIPTIONS : defines
    SUBSCRIPTIONS ||--o{ PAYMENTS : contains
    ROLES ||--o{ ROLE_PERMISSIONS : grants
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : included_in
```

---

# 8. Important Constraints

The following constraints are business-critical.

## 8.1 Store Ownership

```text
UNIQUE(sellers.user_id)
INDEX(stores.seller_id)
```

A seller profile belongs to one user and may own multiple stores, as permitted by the PRD. Each store has its own activation, trial, and subscription lifecycle.

---

## 8.2 Maximum 250 Products

Each seller/store is limited to:

```text
250 products
```

This limit is associated with the subscription plan.

The backend must enforce the limit.

The database should not rely solely on frontend validation.

---

## 8.3 Unique Store Slug

```text
stores.slug UNIQUE
```

Each public store must have a unique URL slug.

---

## 8.4 Unique User Email

```text
users.email UNIQUE
```

---

## 8.5 Dynamic Category Constraints

```text
categories.slug UNIQUE
INDEX(categories.parent_id, categories.sort_order, categories.status)
```

Category hierarchy and display order are stored as data; adding or reordering a category must not require an application code change.

---

## 8.6 One Review per Customer per Store

```text
UNIQUE(reviews.user_id, reviews.store_id)
```

A user cannot create multiple reviews for the same store.

---

## 8.7 One Favorite per User and Target

Products:

```text
UNIQUE(user_id, product_id)
```

Stores:

```text
UNIQUE(user_id, store_id)
```

Services:

```text
UNIQUE(user_id, service_id)
```

---

## 8.8 One Active Offer per Product

The MVP allows only one active offer for each product.

The backend must enforce this rule.

Database implementation may use an appropriate constraint or application-level transaction logic depending on the final MySQL/Prisma implementation.

---

## 8.9 Offer Price Validation

For an offer:

```text
new_price < old_price
```

This rule must be enforced by backend validation.

---

## 8.10 Review Contact Requirement

A review can only be created when the system has evidence that the customer previously initiated a contact event with the seller.

This is a business rule and requires analytics/contact-event verification.

It does **not** represent verified purchase. A unique `contact_event_id` foreign key on `reviews` should reference the qualifying event, and the backend must verify that its user and store match the review.

---

## 8.11 First Activation Starts Trial

The first authorized activation is the only event that starts the free trial:

```text
PENDING_ACTIVATION
        -> admin activates
        -> store becomes ACTIVE; activated_at is recorded
        -> trial_started_at and trial_ends_at are recorded on the store subscription
```

Pending stores have no running trial. Activation is idempotent and must not reset either trial timestamp. Store moderation status remains independent of subscription status.

---

# 9. Subscription Visibility Rules

Subscription state affects public visibility.

## Active subscription

The seller's:

- store
- products
- services

may be publicly visible.

## Trial subscription

The seller's public content may be visible according to the trial's active period.

## Expired subscription

The seller's:

- store
- products
- services

must be hidden from public discovery.

However:

- database records remain.
- seller data remains.
- products remain stored.
- services remain stored.
- favorites remain stored.
- historical information remains stored where applicable.

The system must not automatically delete seller content simply because a subscription expires.

---

# 10. Activation and Moderation Rules

Store activation requires an administrator action. Product and service creation do not require administrator pre-approval, though administrators may moderate them after creation.

The expected flow is:

```text
Store created
        -> PENDING_ACTIVATION; visible in the admin dashboard only
        -> authorized admin activates the store
        -> activated_at and the 60-day trial start are recorded once
        -> public visibility is allowed while the store is active and its trial or subscription is valid
```

Product and service creation remains immediately active, subject to store eligibility and later moderation. Administrators may:

- add notes
- suspend
- close
- remove
- reactivate

according to the relevant entity rules.

Therefore, database status fields must support the necessary lifecycle states.

---

# 11. Notifications

The database supports notifications for platform events.

At minimum, administrators should receive notifications when:

- a new store is created
- a new product is created
- a new service is created

The notification does not activate a pending store; activation remains an explicit administrator action.

For example:

```text
Seller creates store
        -> store remains pending and hidden from public discovery
        -> admin is notified
        -> admin explicitly activates the store
```

---

# 12. Contact Tracking

The platform can track customer interactions with seller contact channels.

Example:

```text
Customer clicks WhatsApp
        ↓
Platform records contact_click event
        ↓
Customer is redirected to external WhatsApp
```

The platform cannot:

- read the WhatsApp conversation
- verify what was discussed
- read Instagram messages
- read Facebook messages
- read Telegram messages
- inspect phone calls

Therefore, contact tracking represents only the platform-side interaction.

---

# 13. Polymorphic Targets

The following tables use polymorphic target references:

- `reports`
- `admin_notes`
- `analytics_events`
- `audit_logs`

Typical structure:

```text
target_type
target_id
```

Example:

```text
target_type = "product"
target_id = "..."
```

Because MySQL foreign keys cannot enforce multiple possible target tables from one pair of fields, the backend must validate:

1. `target_type` is allowed.
2. `target_id` exists.
3. The target belongs to the expected entity type.
4. The current user has permission to perform the operation.

---

# 14. Indexing Guidelines

The final Prisma implementation should add indexes for frequently queried fields.

Likely indexes include:

### users

```text
email
status
```

### stores

```text
slug
seller_id
status
```

### products

```text
store_id
category_id
status
created_at
```

### services

```text
store_id
category_id
status
created_at
```

### reviews

```text
store_id
user_id
created_at
```

### subscriptions

```text
store_id
plan_id
status
trial_started_at
trial_ends_at
current_period_end
```

### categories

```text
slug
parent_id
sort_order
status
```

### contact_events

```text
user_id
store_id
contact_channel_id
created_at
```

### notifications

```text
user_id
read_at
created_at
```

### analytics_events

```text
user_id
event_type
target_type
target_id
created_at
```

### audit_logs

```text
user_id
action
target_type
target_id
created_at
```

Indexes must be confirmed during Prisma schema implementation based on actual query patterns.

---

# 15. Deletion Strategy

Deletion behavior must be explicitly defined per entity before implementation.

The system should avoid destructive cascading deletes when they could cause loss of business or audit information.

In particular:

- Expired subscriptions must not delete stores.
- Expired subscriptions must not delete products.
- Expired subscriptions must not delete services.
- Audit logs should be preserved.
- Historical payment records should be preserved.
- Moderation history should be preserved where required.

Where appropriate, entities should use status changes or soft deletion rather than physical deletion.

---

# 16. Data Integrity

Business rules must be enforced at multiple layers.

## Frontend

Used for:

- user-friendly validation
- immediate feedback

## API validation

Used for:

- request validation
- business rules
- authorization
- cross-entity validation

## Database

Used for:

- uniqueness
- required fields
- relationships
- indexes
- basic data integrity

No critical business rule should depend only on frontend validation.

---

# 17. Security Rules

The database must never store:

- plaintext passwords
- payment secrets
- API keys
- JWT secrets
- external service credentials

Secrets belong in environment configuration.

Sensitive fields should not be returned by public API endpoints.

Examples:

```text
password_hash
payment metadata containing sensitive information
internal admin notes
audit information
```

must be protected according to authorization rules.

---

# 18. Payment Architecture

Payment integration is intentionally postponed until the final major implementation phase.

The database design already provides:

```text
subscription_plans
subscriptions
payments
```

This allows the application architecture to support subscriptions without implementing the JEEB integration during early development.

The final payment phase will define:

- JEEB API integration
- payment initiation
- callback/webhook handling
- payment verification
- transaction reconciliation
- failed payment handling
- subscription activation/renewal
- idempotency
- payment security

These details must not be invented during earlier phases.

---

# 19. Migration Rules

Database migrations must be created through Prisma.

Do not manually modify the database schema in production without documenting the change.

Every schema change should:

1. Update `DATABASE.md` when the design changes.
2. Update the Prisma schema.
3. Create a migration.
4. Run tests.
5. Verify affected API behavior.
6. Update relevant documentation.

---

# 20. Database Implementation Scope

This document defines the intended design.

It does **not** mean that the following must be implemented immediately:

- Prisma schema
- MySQL database
- migrations
- seed data
- authentication
- payment integration
- JEEB integration
- analytics implementation
- authorization implementation

These are implemented according to the project's development phases.

---

# 21. Source of Truth

For database-related development:

```text
docs/DATABASE.md
        ↓
Prisma schema
        ↓
Prisma migrations
        ↓
MySQL database
        ↓
API implementation
```

If an implementation conflicts with this document, the discrepancy must be identified and resolved before proceeding.

Do not silently change the database design in code.

---

# 22. Change Management

Any intentional database design change must:

1. Identify the affected tables.
2. Identify affected relationships.
3. Identify affected business rules.
4. Update this document.
5. Update Prisma schema.
6. Create the required migration.
7. Update tests.
8. Review API impact.

Database changes must not be introduced merely to make an implementation easier if they conflict with established business requirements.

---

# 23. MVP Database Summary

The MVP database is designed around the following core model:

```text
User
 └── Seller
      └── Store
           ├── Products
           ├── Services
           ├── Contact Channels
           ├── Reviews
           └── Locations

User
 ├── Favorite Products
 ├── Favorite Stores
 └── Favorite Services

Seller
 └── Subscriptions
      └── Payments

Subscription Plan
 └── Subscriptions

Roles
 └── Role Permissions
      └── Permissions

Users/Admins
 ├── Reports
 ├── Admin Notes
 ├── Notifications
 ├── Analytics Events
 └── Audit Logs
```

The database is intentionally designed to support the marketplace's MVP requirements while allowing future expansion without coupling early implementation to payment or advanced features.
