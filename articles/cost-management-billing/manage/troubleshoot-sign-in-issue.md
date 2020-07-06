---
title: Troubleshoot Azure subscription sign-in issues
description: Helps to resolve the issues in which you can't sign in to the Azure portal or Azure account center.
services: cost-management-billing
author: v-miegge
manager: dcscontentpm
tags: billing
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 02/12/2020
ms.author: v-miegge
---

# Troubleshoot Azure subscription sign-in issues

This guide helps to resolve the issues in which you can't sign in to the Azure portal or Azure account center.

> [!NOTE]
> If you are having issues signing up for a new Azure account, see [Troubleshoot Azure subscription sign-up issues](https://docs.microsoft.com/azure/cost-management-billing/manage/troubleshoot-azure-sign-up).

## Page hangs in the loading status

If your internet browser page hangs, try each of the following steps until you can get to the Azure portal.

- Refresh the page.
- Use a different internet browser.
- Use the private browsing mode for your browser:

   - **Edge:** Open **Settings** (the three dots by your profile picture), select **New InPrivate window**, and then browse and sign in to the [Azure portal](https://portal.azure.com/) or [Azure account center](https://account.azure.com/Subscriptions). 
   - **Chrome:** Choose **Incognito** mode.
   - **Safari:** Choose **File**, then **New Private Window**.

- Clear the cache and delete Internet cookies:

   - **Edge:** Open **Settings** and select **Privacy and Services**. Follow the steps under **Clear Browsing Data**. Verify that the check boxes for **Browsing history**, **Download history**, and **Cached images and files** are selected, and then select **Delete**.
   - **Chrome:** Choose **Settings** and select **Clear browsing data** under **Privacy and Security**.

## You are automatically signed in as a different user

This issue can occur if you use more than one user account in an internet browser.

To resolve the issue, try one of the following methods:

- Clear the cache and delete Internet cookies.

   - **Edge:** Open **Settings** and select **Privacy and Services**. Follow the steps under **Clear Browsing Data**. Verify that the check boxes for **Browsing history**, **Download history**, **Cookies**, and **Cached images and files** are selected, and then select **Delete**.
   - **Chrome:** Choose **Settings** and select **Clear browsing data** under **Privacy and Security**.
- Reset your browser settings to defaults.
- Use the private browsing mode for your browser. 
   - **Edge:** Open **Settings** (the three dots by your profile picture), select **New InPrivate window**, and then browse and sign in to the [Azure portal](https://portal.azure.com/) or [Azure account center](https://account.azure.com/Subscriptions). 
   - **Chrome:** Choose **Incognito** mode.
   - **Safari:** Choose **File**, then **New Private Window**.

## I can sign in, but I see the error, No subscriptions found

This problem occurs if you selected at the wrong directory, or if your account doesn't have sufficient permissions.

**Scenario 1:** You receive the error signing into the [Azure portal](https://portal.azure.com/)

To fix this issue:

- Verify that the correct Azure directory is selected by selecting your account at the top-right corner.
- If the correct Azure directory is selected, but you still receive the error message, have your account [added as an Owner](https://docs.microsoft.com/azure/cost-management-billing/manage/add-change-subscription-administrator).

**Scenario 2:** You receive the error signing into the [Azure Account Center](https://account.windowsazure.com/Subscriptions)

Check whether the account that you used is the Account Administrator. To verify who the Account Administrator is, follow these steps:

1.	Sign in to the [Subscriptions view in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).
1.	Select the subscription that you want to check, and then select **Settings**.
1.	Select **Properties**. The account administrator of the subscription is displayed in the **Account Admin** box.

## Additional help resources

Other troubleshooting articles for Azure Billing and Subscriptions

- [Declined card](https://docs.microsoft.com/azure/cost-management-billing/manage/troubleshoot-declined-card)
- [Subscription sign-up issues](https://docs.microsoft.com/azure/cost-management-billing/manage/troubleshoot-azure-sign-up)
- [No subscriptions found](https://docs.microsoft.com/azure/cost-management-billing/manage/no-subscriptions-found)
- [Enterprise cost view disabled](https://docs.microsoft.com/azure/cost-management-billing/manage/enterprise-mgmt-grp-troubleshoot-cost-view)
- [Azure Billing documentation](https://docs.microsoft.com/azure/cost-management-billing/)

## Contact us for help

If you have questions or need help, [create a support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).
