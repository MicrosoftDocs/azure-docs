---
title: "include file"
description: "include file"
author: DCtheGeek
ms.service: azure-policy
ms.topic: "include"
ms.date: 08/07/2020
ms.author: dacoulte
---

There's a maximum count for each object type for Azure Policy. An entry of _Scope_ means either
the subscription or the [management group](../articles/governance/management-groups/overview.md).

| Where | What | Maximum count |
|---|---|---|
| Scope | Policy definitions | 500 |
| Scope | Initiative definitions | 200 |
| Tenant | Initiative definitions | 2,500 |
| Scope | Policy or initiative assignments | 200 |
| Policy definition | Parameters | 20 |
| Initiative definition | Policies | 1000 |
| Initiative definition | Parameters | 100 |
| Policy or initiative assignments | Exclusions (notScopes) | 400 |
| Policy rule | Nested conditionals | 512 |
| Remediation task | Resources | 500 |
