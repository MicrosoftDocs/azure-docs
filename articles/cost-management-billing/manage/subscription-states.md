---
title: Azure subscription states
description: Learn about the different states of an Azure subscription, including active, deleted, and disabled states, and how they affect resource management.
keywords: azure subscription state status
author: bandersmsft
ms.reviewer: macyso
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: concept-article
ms.date: 01/08/2025
ms.author: banders
#customer intent: As a billing administrator, I want to understand the different states and status of an Azure subscription so that I can manage my subscriptions effectively.
---

# Azure subscription states

This article describes the various states that an Azure subscription might have. The following subscription states appear as **Status** in Azure portal subscription areas.

## Active/Enabled

Your Azure subscription is active. You can use the subscription to deploy new resources and manage existing ones.

All operations (PUT, PATCH, DELETE, POST, GET) are available for the resource providers that are [registered for your subscription](../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal).

## Deleted

Your Azure subscription was deleted along with all underlying resources/data.

No operations are available.

## Disabled

Your Azure subscription is disabled and can no longer be used to create or manage Azure resources. While in this state, your virtual machines are deallocated, temporary IP addresses are freed, storage is read-only and other services are disabled. A subscription can get disabled because of the following reasons:

- Your credit expired.
- You reached your spending limit.
- Your bill is past due.
- Your credit card limit was exceeded. Or, it was explicitly disabled or canceled. Depending on the subscription type, a subscription might remain disabled between 1 - 90 days. After which, it gets permanently deleted. For more information, see [Reactivate a disabled Azure subscription](subscription-disabled.md).

Operations to create or update resources (PUT, PATCH) are disabled. Operations that take an action (POST) are also disabled. Your resources are still available, so you can retrieve or delete them (GET, DELETE). Transferring ownership of the subscription is disabled.

## Expired

Your Azure subscription is expired because it was canceled. You can reactivate an expired subscription. For more information, see [Reactivate a disabled Azure subscription](subscription-disabled.md).

Operations to create or update resources (PUT, PATCH) are disabled. Operations that take an action (POST) are also disabled. You can retrieve or delete resources (GET, DELETE).

## Past Due

Your Azure subscription has an outstanding payment pending. Your subscription is still active but failure to pay the dues might result in subscription being disabled. For more information, see [Resolve past due balance for your Azure subscription](resolve-past-due-balance.md).

All operations are available.


## Warned

Your Azure subscription is in a warned state. If the warning isn't addressed, the subscription gets disabled. A subscription might be in warned state if its past due, canceled by a user, or if the subscription expired.

You can retrieve or delete resources (GET/DELETE), but you can't create any resources (PUT/PATCH/POST).

Resources in this state go offline but can be recovered when the subscription resumes an active/enabled state. A subscription in this state isn't charged.

## Related content

- [Resolve past due balance for your Azure subscription.](resolve-past-due-balance.md)
- [Reactivate a disabled Azure subscription](subscription-disabled.md)