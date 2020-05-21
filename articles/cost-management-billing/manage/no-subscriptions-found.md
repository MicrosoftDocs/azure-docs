---
title: No subscriptions found error - Azure portal sign in
description: Provides the solution for a problem in which No subscriptions found error occurs when sign in to Azure portal or Azure account center.
author: genlin
ms.reviewer: dcscontentpm
tags: billing
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 02/12/2020
ms.author: banders
ms.custom: seodec18
---

# No subscriptions found sign in error for Azure portal or Azure account center

You might receive a "No subscriptions found" error message when you try to sign in to the [Azure portal](https://portal.azure.com/) or the [Azure Account Center](https://account.windowsazure.com/Subscriptions). This article provides a solution for this problem.

## Symptom

When you try to sign in to the [Azure portal](https://portal.azure.com/) or the [Azure account center](https://account.windowsazure.com/Subscriptions), you receive the following error message: "No subscriptions found".

## Cause

This problem occurs if you selected at the wrong directory, or if your account doesn’t have sufficient permissions.

## Solution

### Scenario 1: Error message is received in the [Azure portal](https://portal.azure.com)

To fix this issue:

* Make sure that the correct Azure directory is selected by clicking your account at the top right.

  ![Select the directory at the top right of the Azure portal](./media/no-subscriptions-found/directory-switch.png)
* If the right Azure directory is selected but you still receive the error message, [assign the Owner role to your account](../../role-based-access-control/role-assignments-portal.md).

### Scenario 2: Error message is received in the [Azure Account Center](https://account.windowsazure.com/Subscriptions)

Check whether the account that you used is the Account Administrator. To verify who the Account Administrator is, follow these steps:

1. Sign in to the [Subscriptions view in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).
1. Select the subscription you want to check, and then look under **Settings**.
1. Select **Properties**. The account administrator of the subscription is displayed in the **Account Admin** box.  

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).
