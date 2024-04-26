---
title: "include file"
description: "include file"
services: storage
author: pauljewellmsft
ms.service: azure-storage
ms.topic: "include"
ms.date: 01/19/2024
ms.author: pauljewell
ms.custom: "include file"
---

If a user tries to perform an action in the assigned role that is *not* an action restricted by the condition, `!(ActionMatches)` evaluates to true and the overall condition evaluates to true. This result allows the action to be performed.

To learn more about how conditions are formatted and evaluated, see [Conditions format](../articles/role-based-access-control/conditions-format.md).
