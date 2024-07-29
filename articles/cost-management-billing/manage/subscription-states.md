---
title: Azure subscription states
description: This article describes the different states and status of an Azure subscription.
keywords: azure subscription state status
author: bandersmsft
ms.reviewer: andalmia
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 03/21/2024
ms.author: banders
---

# Azure subscription states

This article describes the various states that an Azure subscription may have. You'll find these states show up as **Status** in Azure portal subscription areas.

| Subscription State | Description |
|-------------| ----------------|
| **Active**/**Enabled** | Your Azure subscription is active. You can use the subscription to deploy new resources and manage existing ones.<br><br>All operations (PUT, PATCH, DELETE, POST, GET) are available for the resource providers that are [registered for your subscription](../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal). |
| **Deleted** | Your Azure subscription has been deleted along with all underlying resources/data.<br><br>No operations are available. |
| **Disabled** | Your Azure subscription is disabled and can no longer be used to create or manage Azure resources. While in this state, your virtual machines are de-allocated, temporary IP addresses are freed, storage is read-only and other services are disabled. A subscription can get disabled because of the following reasons: Your credit may have expired. You may have reached your spending limit. You have a past due bill. Your credit card limit was exceeded. Or, it was explicitly disabled or canceled. Depending on the subscription type, a subscription may remain disabled between 1 - 90 days. After which, it's permanently deleted. For more information, see [Reactivate a disabled Azure subscription](subscription-disabled.md).<br><br>Operations to create or update resources (PUT, PATCH) are disabled. Operations that take an action (POST) are also disabled. You can retrieve or delete resources (GET, DELETE). Your resources are still available. |
| **Expired** | Your Azure subscription is expired because it was canceled. You can reactivate an expired subscription. For more information, see [Reactivate a disabled Azure subscription](subscription-disabled.md).<br><br>Operations to create or update resources (PUT, PATCH) are disabled. Operations that take an action (POST) are also disabled. You can retrieve or delete resources (GET, DELETE).|
| **Past Due** | Your Azure subscription has an outstanding payment pending. Your subscription is still active but failure to pay the dues may result in subscription being disabled. For more information, see [Resolve past due balance for your Azure subscription.](resolve-past-due-balance.md).<br><br>All operations are available. |
| **Warned** | Your Azure subscription is in a warned state and will be disabled shortly if the warning reason isn't addressed. A subscription may be in warned state if its past due, canceled by user, or if the subscription has expired.<br><br>You can retrieve or delete resources (GET/DELETE), but you can't create any resources (PUT/PATCH/POST) <p> Resources in this state go offline but can be recovered when the subscription resumes an active/enabled state. A subscription in this state isn't charged. |
