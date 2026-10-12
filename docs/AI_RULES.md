# AI Rules for Sana'a Wedding Marketplace

This document defines mandatory rules for any AI coding agent working on the Sana'a Wedding Marketplace. The goal is to preserve the existing project architecture while aligning all future work with the wedding-specialized product strategy and the approved operational guardrails.

## 1. Mandatory Documentation First

1. Read the relevant docs before modifying code.
2. Treat [docs/PRD.md](PRD.md) as the authoritative product requirement source.
3. Use [docs/BUSINESS-RULES.md](BUSINESS-RULES.md), [docs/ARCHITECTURE.md](ARCHITECTURE.md), and [docs/CODING-STANDARDS.md](CODING-STANDARDS.md) as implementation guardrails.

## 2. Architecture and Scope Rules

4. Never modify architecture without explicit approval.
5. Stay within the scope of the current development day.
6. Do not continue automatically to another feature.
7. Do not move to the next day without direction.
8. Do not create application code in documentation-only phases.
9. Do not initialize new frameworks or scaffolds without approval.

## 3. Business Rule Protection

10. Never change business rules silently.
11. Never create approval workflows for Store, Product, or Service publication.
12. Never hardcode subscription limits or pricing values.
13. Never hardcode wedding categories or vendor lists.
14. Never hardcode business configuration that belongs in the database.
15. Do not delete seller data when a subscription or trial expires.
16. Do not create arbitrary database tables without explicit design approval.
17. Do not make assumptions that contradict the PRD or business rules.

## 4. Security and Validation Rules

18. Never expose secrets.
19. Never trust frontend validation.
20. Validate every external input.
21. Protected APIs require authentication and authorization.
22. Backend authorization is the source of truth.
23. Never perform destructive database operations without explicit justification and approval.

## 5. Payment and Integration Rules

24. Do not integrate a real payment provider before the final payment phase.
25. Do not invent provider endpoints, auth flows, or webhook logic.
26. Do not implement provider-specific logic before the correct phase.

## 6. API and Contract Rules

27. Never change API contracts silently.
28. Validate API behavior against the documented architecture and business rules.
29. Keep controller logic thin and business logic in service layers.
30. Repositories own persistence logic only.

## 7. Quality Rules

31. New behavior requires tests.
32. Do not claim tests passed unless they were actually executed.
33. Review git diff before considering work complete.
34. Do not duplicate business logic.
35. Avoid unnecessary abstractions and overly broad refactors.

## 8. Platform and Product Rules

36. Do not hardcode business configuration that belongs in the database.
37. Keep categories dynamic and admin-managed.
38. Keep the MVP scoped to Sana'a.
39. Respect the public browsing without login requirement.
40. Respect the distinction between customer, seller, and admin roles.
41. Respect the post-publication moderation model.
42. Respect the Contact Event review model and do not replace it with Verified Purchase logic.
43. Preserve the division of responsibilities between public website, seller dashboard, and admin dashboard.
44. Treat the platform as a wedding marketplace, not as a general marketplace or unrelated service directory.

## 9. Category and Data Integrity Rules

45. Never rely on a fixed category array as the product’s category model.
46. Never assume new wedding categories require a code rebuild or redeploy.
47. Ensure category changes remain data-driven and admin-managed.
48. Preserve custom category metadata as configuration, not as hardcoded UI assumptions.

## 10. Conflict Handling

49. If architecture or documentation conflicts are discovered, stop and report them.
50. Do not silently fix a fundamental PRD conflict.
51. Report contradictions clearly and escalate them before continuing.

## 11. Day Completion Rule

52. Before completing a coding day, run the relevant checks where applicable:

- typecheck
- lint
- tests
- build

53. If a check is not applicable, document why it was not run.

## 12. Final Guardrail

Any implementation decision must be traceable to the PRD, business rules, architecture, or coding standards documents. If a decision cannot be traced, it should not be made without explicit approval.
