# AI Rules for Sana'a Marketplace

This document defines mandatory rules for any AI coding agent working on Sana'a Marketplace. These rules are designed to keep implementation aligned with the PRD, product governance, and architecture guidance.

## 1. Mandatory Documentation First

1. Read relevant docs before modifying code.
2. Treat [docs/PRD.md](PRD.md) as the authoritative product requirement source.
3. Use [docs/BUSINESS-RULES.md](BUSINESS-RULES.md), [docs/ARCHITECTURE.md](ARCHITECTURE.md), and [docs/CODING-STANDARDS.md](CODING-STANDARDS.md) as implementation guardrails.

## 2. Architecture and Scope Rules

4. Never modify architecture without explicit approval.
5. Stay inside the scope of the current development day.
6. Do not continue automatically to another feature.
7. Do not start the next development day without explicit direction.
8. Do not create application code in documentation-only phases.
9. Do not initialize frameworks, services, or project scaffolding without approval.

## 3. Business Rule Protection

10. Never change business rules silently.
11. Never create approval workflows for Store, Product, or Service publication.
12. Never hardcode subscription limits.
13. Never hardcode categories.
14. Never hardcode business configuration that belongs in the database.
15. Do not delete seller data when subscription expires.
16. Do not create arbitrary database tables.
17. Do not make assumptions that contradict the PRD.

## 4. Security and Validation Rules

18. Never expose secrets.
19. Never trust frontend validation.
20. Validate every external input.
21. Protected APIs require authentication and authorization.
22. Backend authorization is the source of truth.
23. Never perform destructive database operations without explicit justification and approval.

## 5. Payment and Integration Rules

24. Do not integrate Jaib before the final payment phase.
25. Do not invent Jaib endpoints, authentication methods, webhooks, or API behavior.
26. Do not implement a JeebProvider or JaibProvider during the current phase.
27. Do not create payment logic that contradicts the final payment integration phase timing.

## 6. API and Contract Rules

28. Never change API contracts silently.
29. Validate API behavior against the documented architecture and business rules.
30. Keep controller logic thin and business logic in service layers.
31. Repositories own persistence logic only.

## 7. Quality Rules

32. New behavior requires tests.
33. Do not claim tests passed unless they were actually executed.
34. Review git diff before considering work complete.
35. Do not duplicate business logic.
36. Avoid unnecessary abstractions and overly broad refactors.

## 8. Platform and Product Rules

37. Do not hardcode business configuration that belongs in the database.
38. Keep categories dynamic and admin-managed.
39. Keep the MVP scoped to Sana'a.
40. Respect the public browsing without login requirement.
41. Respect the difference between customer, seller, and admin roles.
42. Respect the post-publication moderation model.
43. Respect the Contact Event based review model and do not use Verified Purchase as the rule.
44. Respect the division of responsibilities between public website, seller dashboard, and admin dashboard.

## 9. Conflict Handling

45. If architecture or documentation conflicts are discovered, stop and report them.
46. Do not silently fix a fundamental PRD conflict.
47. Report contradictions clearly and escalate the mismatch before continuing.

## 10. Day Completion Rule

48. Before completing a coding day, run the required applicable checks where relevant:
- typecheck
- lint
- tests
- build
49. If a check is not applicable, document why it was not run.

## 11. Final Guardrail

Any implementation decision must be traceable to the PRD, BUSINESS-RULES, ARCHITECTURE, or CODING-STANDARDS documents. If a decision cannot be traced, it should not be made without explicit approval.
