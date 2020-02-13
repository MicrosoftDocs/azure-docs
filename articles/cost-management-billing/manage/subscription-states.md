---
title: Azure subscription states
description: Describes the different states\status of an Azure subscription
keywords: azure subscription state status
author: anuragdalmia
manager: andalmia
tags: billing
ms.service: cost-management-billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/26/2019
ms.author: andalmia

---
# Azure subscription states
This article describes the various states that an Azure subscription may have. You will find these states show up as "Status" under subscription blades.

| Subscription State | Description |
|-------------| ----------------|
| **Active** | Your Azure subscription is active. You can use this subscription to deploy new resources and manage existing ones.|
| **Past Due** | Your Azure subscription has an outstanding payment pending. Your subscription is still active but failure to pay the dues may result in subscription being disabled. [Resolve past due balance for your Azure subscription.](https://docs.microsoft.com/azure/billing/billing-azure-subscription-past-due-balance) |
| **Disabled** | Your Azure subscription is disabled and can no longer be used to create or manage Azure resources. While in this state, your virtual machines are de-allocated, temporary IP addresses are freed, storage is read-only and other services are disabled. Subscription can get disabled because your credit may have expired, you may have reached your spending limit, you have a past due bill, your credit card limit was exceeded or if you it was explicitly disabled/cancelled. Depending on the subscription type and disable reason, a subscription may remain disabled between 1 - 90 days after which it gets permanently deleted. [Reactivate a disabled Azure subscription.](https://docs.microsoft.com/azure/billing/billing-subscription-become-disable)|
| **Deleted** | Your Azure subscription has been deleted along with all underlying resources/data. |
