---
title: Azure Security Center FAQ - questions about permissions
description: This FAQ answers questions about permissions in Azure Security Center, a product that helps you prevent, detect, and respond to threats.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: be2ab6d5-72a8-411f-878e-98dac21bc5cb
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/25/2020
ms.author: memildin

---

# Permissions

## How do permissions work in Azure Security Center?

Azure Security Center uses [Role-Based Access Control (RBAC)](../role-based-access-control/role-assignments-portal.md), which provides [built-in roles](../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure.

Security Center assesses the configuration of your resources to identify security issues and vulnerabilities. In Security Center, you only see information related to a resource when you are assigned the role of Owner, Contributor, or Reader for the subscription or resource group that a resource belongs to.

See [Permissions in Azure Security Center](security-center-permissions.md) to learn more about roles and allowed actions in Security Center.



## Who can modify a security policy?

To modify a security policy, you must be a Security Admin or an Owner or Contributor of that subscription.

To learn how to configure a security policy, see [Setting security policies in Azure Security Center](tutorial-security-policy.md).