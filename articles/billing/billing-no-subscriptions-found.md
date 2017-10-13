---
title: No subscriptions found error when try to sign in to Azure portal or Azure account center | Microsoft Docs
description: Provides the solution for a problem in which No subscriptions found error occurs when sign in to Azure portal or Azure account center.
services: ''
documentationcenter: ''
author: genlin
manager: jlian
editor: ''
tags: billing

ms.assetid: d1545298-99db-4941-8e97-f24a06bb7cb6
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/21/2017
ms.author: genli
---

# No subscriptions found error in Azure portal or Azure account center
You might receive a "No subscriptions found" error message when you try to sign in to the [Azure portal](https://portal.azure.com/) or the [Azure account center](https://account.windowsazure.com/Subscriptions). This article provides a solution for this problem.

## Symptom

When you try to sign in to the [Azure portal](https://portal.azure.com/) or the [Azure account center](https://account.windowsazure.com/Subscriptions), you receive the following error message: "No subscriptions found".

## Cause

This problem occurs if your account doesn’t have sufficient permissions. 

## Solution

Make sure that you log in as the correct administrator. An Account Administrator can access only the Account Center. Service Administrators (SA) and Co-Administrators (CA) have access permission only to the Azure portal or the Azure classic portal.

### Scenario 1: Error message is received in the [Azure portal](https://portal.azure.com)

To fix this issue:

* Make sure that the correct Azure directory is selected by clicking your account at the top right.

  ![Select the directory at the top right of the Azure portal](./media/billing-no-subscriptions-found/directory-switch.png)

* If the right Azure directory is selected but you still receive the error message, [have your account added as an Owner](billing-add-change-azure-subscription-administrator.md).

### Scenario 2: Error message is received in the [Azure account center](https://account.windowsazure.com/Subscriptions)

Check whether the account that you used is the Account Administrator. To verify who the Account Administrator is, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the Hub menu, select **Subscription**.
3. Select the subscription that you want to check, and then select **Settings**.
4. Select **Properties**. The account administrator of the subscription is displayed in the **Account Admin** box.

## Need help? Contact support.
If you still need help, [contact support](http://go.microsoft.com/fwlink/?linkid=544831&clcid=0x409) to get your issue resolved quickly. 
