---
title: Troubleshoot Azure subscription sign-in issues
description: Helps to resolve the issues in which you can't sign-in the Azure portal or Azure account center.
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

This guide helps to resolve the issues in which you can't sign-in the Azure portal or Azure account center.

## Issues

### Page hangs in the loading status

If your internet browser page hangs, try each of the following steps until you can get to the Azure portal.

- Refresh the page.
- Use a different internet browser.
- Use the private browsing mode for your browser. For Internet Explorer: Click **Tools** > **Safety** > **InPrivate Browsing**, and then browse and sign-in to the [Azure portal](https://portal.azure.com/) or [Azure account center](https://account.azure.com/Subscriptions).

### You are automatically signed in as a different user

This issue can occur if you use more than one user account in an internet browser.

To resolve the issue, try one of the following methods:

- Clear the cache and delete Internet cookies. In Internet Explorer, click **Tools** > **Internet Options** > **Delete**. Make sure that the check boxes for temporary files, cookies, password, and browsing history are selected, and then click Delete.
- Reset the Internet Explorer settings to revert any personal settings that you've made. Click **Tools** > **Internet Options** > **Advanced** > select the **Delete personal settings** box > **Reset**.
- Use the private browsing mode for your browser. For Internet Explorer:  Click **Tools** > **Safety** > **InPrivate Browsing**, and then browse and sign-in to the [Azure portal](https://portal.azure.com/) or [Azure account center](https://account.azure.com/Subscriptions).

### I can sign-in but I see *No subscriptions found*

This problem occurs if you selected at the wrong directory, or if your account doesn't have sufficient permissions.

**Scenario 1:** Error message is received in the [Azure portal](https://portal.azure.com/)

To fix this issue:

- Make sure that the correct Azure directory is selected by clicking your account at the top right.
- If the right Azure directory is selected but you still receive the error message, have your account [added as an Owner](add-change-subscription-administrator.md).

**Scenario 2:** Error message is received in the [Azure Account Center](https://account.windowsazure.com/Subscriptions)

Check whether the account that you used is the Account Administrator. To verify who the Account Administrator is, follow these steps:

1. Sign in to the [Subscriptions view in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).

2. Select the subscription you want to check, and then look under **Settings**.

3. Select **Properties**. The account administrator of the subscription is displayed in the **Account Admin** box.

## Additional help resources

Other troubleshooting articles for Azure Billing and Subscriptions

- [Declined card](troubleshoot-declined-card.md)
- [Subscription sign-up issues](troubleshoot-azure-sign-up.md)
- [No subscriptions found](no-subscriptions-found.md)
- [Enterprise cost view disabled](enterprise-mgmt-grp-troubleshoot-cost-view.md)

## Contact us for help

If you have questions or need help, [create a support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- [Azure Billing documentation](../../billing/index.md)
