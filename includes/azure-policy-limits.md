---
title: "include file"
description: "include file"
author: DCtheGeek
ms.service: azure-policy
ms.topic: "include"
ms.date: 09/30/2020
ms.author: dacoulte
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
| Initiative definition | Parameters | 300 |
| Policy or initiative assignments | Exclusions (notScopes) | 400 |
| Policy rule | Nested conditionals | 512 |
| Remediation task | Resources | 50,000 |

Policy rules have additional limits to the number of conditions and their complexity. See [Policy rule limits](../articles/governance/policy/concepts/definition-structure.md#policy-rule-limits) for more details.

For Policy and PolicySet definition properties and Policy assignment properties such as displayname and resource name different naming restrictions apply based on the scope. See [Resource naming restrictions](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/resource-name-rules#microsoftauthorization) for more details.
