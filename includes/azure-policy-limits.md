---
title: "include file"
description: "include file"
services: azure-policy
author: DCtheGeek
ms.service: azure-policy
ms.topic: "include"
ms.date: 08/16/2018
ms.author: dacoulte
ms.custom: "include file"
---

There is a maximum count for each object type for Azure Policy. An entry of _Scope_ means either
the subscription or the [management group](../articles/azure-resource-manager/management-groups-overview.md).

| Where | What | Maximum count |
|---|---|---|
| Scope | Policy Definitions | 250 |
| Scope | Initiative Definitions | 100 |
| Tenant | Initiative Definitions | 1000 |
| Scope | Policy/Initiative Assignments | 100 |
| Policy Definition | Parameters | 20 |
| Initiative Definition | Policies | 100 |
| Initiative Definition | Parameters | 100 |
| Policy/Initiative Assignments | Exclusions (notScopes) | 100 |
| Policy Rule | Nested Conditionals | 512 |
