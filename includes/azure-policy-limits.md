---
title: "include file"
description: "include file"
author: davidsmatlak
ms.service: azure-policy
ms.topic: "include"
ms.date: 09/30/2020
ms.author: davidsmatlak
---

There's a maximum count for each object type for Azure Policy. For definitions, an entry of _Scope_ means the [management group](../articles/governance/management-groups/overview.md) or subscription. For assignments and exemptions, an entry of _Scope_ means the [management group](../articles/governance/management-groups/overview.md), subscription, resource group, or individual resource.

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

Policy rules have additional limits to the number of conditions and their complexity. See [Policy rule limits](../articles/governance/policy/concepts/definition-structure.md#policy-rule-limits) for more details.
