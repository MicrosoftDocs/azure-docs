---
title: "include file"
description: "include file"
author: kenieva
ms.service: azure-policy
ms.topic: "include"
ms.date: 11/28/2022
ms.author: kenieva
---

This table describes if a resource will be protected from deletion given the resource applicable to the assigned denyAction policy and the targeted scope of the DELETE call. In the context of this table, an indexed resource is one that supports tags and locations and a non-indexed resource is one that doesn't support tags or locations. For more information on indexed and non-indexed resources,  reference [definition modes](../articles/governance/policy/concepts/definition-structure.md). Child resources are resources that exist only within the context of another resource. For example, a virtual machines extension resource is a child of the virtual machine, whom is the parent resource. 

| Entity being deleted| Entity applicable to policy conditions | Action taken |
|---|---|---|
| Resource | Resource | Protected |
| Subscription | Resource | Deleted |
| Resource group | Indexed resource| Depends on `cascadeBehaviors` |
| Resource group | Non indexed resource| Deleted |
| Child resource | Parent resource | Parent is protected; child is deleted |
| Parent resource | Child resource | Deleted |