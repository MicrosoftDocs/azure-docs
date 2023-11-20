---
title: include file
description: include file
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.topic: include
ms.date: 04/10/2023
ms.author: barclayn
ms.custom: include file,licensing
---

In the source tenant: Using this feature requires Azure AD Premium P1 licenses. Each user who is synchronized with cross-tenant synchronization must have a P1 license in their home/source tenant. To find the right license for your requirements, see [Compare generally available features of Azure AD](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

In the target tenant: Cross-tenant sync relies on the Azure AD External Identities billing model. To understand the external identities licensing model, see [MAU billing model for Azure AD External Identities](../external-identities/external-identities-pricing.md). You also need at least one Azure AD Premium P1 license in the target tenant to enable auto-redemption.