---
title: Troubleshoot Azure subscription sign-in issues
description: Helps to resolve the issues in which you can't sign in to the Azure portal.
services: cost-management-billing
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: troubleshooting
ms.date: 03/21/2024
ms.author: banders
---

# Troubleshoot Azure subscription sign-in issues

This guide helps to resolve the issues in which you can't sign in to the Azure portal.

> [!NOTE]
> If you are having issues signing up for a new Azure account, see [Troubleshoot Azure subscription sign-up issues](./troubleshoot-azure-sign-up.md).

## Page hangs in the loading status

If your internet browser page hangs, try each of the following steps until you can get to the Azure portal.

- Refresh the page.
- Use a different internet browser.
- Use the private browsing mode for your browser:

   - **Edge:** Open **Settings** (the three dots by your profile picture), select **New InPrivate window**, and then browse and sign in to the [Azure portal](https://portal.azure.com).
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
   - **Edge:** Open **Settings** (the three dots by your profile picture), select **New InPrivate window**, and then browse and sign in to the [Azure portal](https://portal.azure.com).
   - **Chrome:** Choose **Incognito** mode.
   - **Safari:** Choose **File**, then **New Private Window**.

## I can sign in, but I see the error, No subscriptions found

This problem occurs if you selected at the wrong directory, or if your account doesn't have sufficient permissions.

**Scenario:** You receive the error signing into the [Azure portal](https://portal.azure.com).

To fix this issue:

- Verify that the correct Azure directory is selected by selecting your account at the top-right corner.
- If the correct Azure directory is selected, but you still receive the error message, have your account [added as an Owner](../manage/add-change-subscription-administrator.md).

## Additional help resources

Other troubleshooting articles for Azure Billing and Subscriptions

- [Declined card](../troubleshoot-billing/troubleshoot-declined-card.md)
- [Subscription sign-up issues](./troubleshoot-azure-sign-up.md)
- [No subscriptions found](./no-subscriptions-found.md)
- [Enterprise cost view disabled](../troubleshoot-billing/enterprise-mgmt-grp-troubleshoot-cost-view.md)
- [Azure Billing documentation](../index.yml)

## Contact us for help

If you have questions or need help but can't sign in to the Azure portal, [create a support request](https://support.microsoft.com/oas/?prid=15470).
