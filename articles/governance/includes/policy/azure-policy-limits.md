---
ms.topic: include
ms.service: azure-policy
ms.date: 03/04/2025
ms.author: davidsmatlak
author: davidsmatlak
---

There's a maximum count for each object type for Azure Policy. For definitions, an entry of _Scope_ means the [management group](../../management-groups/overview.md) or subscription. For assignments and exemptions, an entry of _Scope_ means the management group, subscription, resource group, or individual resource.

| Where | What | Maximum count |
|---|---|---|
| Scope | Policy definitions | 500 |
| Scope | Initiative definitions | 200 |
| Tenant | Initiative definitions | 2,500 |
| Scope | Policy or initiative assignments | 200 |
| Scope | Exemptions | 1000 |
| Policy definition | Parameters | 20 |
| Initiative definition | Policies | 1000 |
| Initiative definition | Parameters | 400 |
| Policy or initiative assignments | Exclusions (notScopes) | 400 |
| Policy rule | Nested conditionals | 512 |
| Remediation task | Resources | 50,000 |
| Policy definition, initiative, or assignment request body | Bytes | 1,048,576 |

Policy rules have more limits to the number of conditions and their complexity. For more information, see [Policy rule limits](../../policy/concepts/definition-structure-policy-rule.md#policy-rule-limits).
