---
title: Azure subscription states
description: This article describes the different states and status of an Azure subscription.
keywords: azure subscription state status
author: anuragdalmia
ms.reviewer: banders
tags: billing
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 03/03/2020
ms.author: andalmia
---

# Azure subscription states

This article describes the various states that an Azure subscription may have. You'll find these states show up as **Status** in Azure portal subscription areas.

| Subscription State | Description |
|-------------| ----------------|
| **Active** | Your Azure subscription is active. You can use the subscription to deploy new resources and manage existing ones.|
| **Deleted** | Your Azure subscription has been deleted along with all underlying resources/data. |
| **Disabled** | Your Azure subscription is disabled and can no longer be used to create or manage Azure resources. While in this state, your virtual machines are de-allocated, temporary IP addresses are freed, storage is read-only and other services are disabled. A subscription can get disabled because of the following reasons: Your credit may have expired. You may have reached your spending limit. You have a past due bill. Your credit card limit was exceeded. Or, it was explicitly disabled or canceled. Depending on the subscription type, a subscription may remain disabled between 1 - 90 days. After which, it's permanently deleted. For more information, see [Reactivate a disabled Azure subscription](subscription-disabled.md). |
| **Expired** | Your Azure subscription is expired because it was canceled. You can reactivate an expired subscription. For more information, see [Reactivate a disabled Azure subscription](subscription-disabled.md).|
| **Past Due** | Your Azure subscription has an outstanding payment pending. Your subscription is still active but failure to pay the dues may result in subscription being disabled. For more information, see [Resolve past due balance for your Azure subscription.](resolve-past-due-balance.md). |
