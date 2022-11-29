---
title: "include file"
description: "include file"
author: kenieva
ms.service: azure-policy
ms.topic: "include"
ms.date: 11/28/2022
ms.author: kenieva
---

This table describes if a resource will be protected from deletion given the resource applicable to the assigned denyAction policy and the targeted scope of the DELETE call. In the conetext of this table, an indexed  is a resource that supports tags and locations. Non-indexed is a resource that does not support tags or locations. For more information on indexed and non-indexed resourxe, please reference [definition modes](../articles/governance/policy/concepts/definition-structure.md). Child resources are resources that exist only within the context of another resource. For example, an virtual machines extension resource is a child of the virtual machine, whom is the parent resource. 

| Resource applicable to DenyAction definition | Delete call targeted scope | Action taken |
|---|---|---|
| Resource | Resource | Protected |
| Resource | Subscription | Deleted |
| Indexed resource | Resource group| Depends on `cascadeBehaviors` |
| Non indexed resource | Resource group | Deleted |
| Parent resource | Child resource | Parent is protected; child is deleted |
| Child resource | Parent resource | Deleted |


