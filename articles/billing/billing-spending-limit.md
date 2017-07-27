---
title: Understand Azure spending limit | Microsoft Docs
description: Describes how Azure spending limit works and how to remove it
services: ''
documentationcenter: ''
author: genlin
manager: jlian
editor: ''
tags: billing

ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/12/2017
ms.author: genli

---
# Understand Azure spending limit and how to remove it

Azure spending limit is a limit on how much your Azure subscription can spend. All new customers who sign up for the trial offer or offers that includes credits over multiple months have the spending limit turned by default. The spending limit is $0. It can’t be changed. The spending limit isn’t available for subscription types such as Pay-As-You-Go subscriptions and commitment plans. See the [full list of Azure offers and the availability of the spending limit](https://azure.microsoft.com/support/legal/offer-details/).

## What happens when I reach the spending limit?

When your usage results in charges that exhaust the monthly amounts included in your offer, the services that you deployed are disabled for the rest of that billing month. For example, Cloud Services that you deployed are removed from production and your Azure virtual machines are stopped and de-allocated. To prevent your services from being disabled, you can choose to remove your spending limit. When your services are disabled, the data in your storage accounts and databases are available in a read-only manner for administrators. At the beginning of the next billing month, if your offer includes credits over multiple months, your subscription will be re-enabled. Then you can redeploy your Cloud Services and have full access to your storage accounts and databases.

After the free trial subscription reaches the spending limit, you can re-enable the subscription and have it automatically [upgrade to our standard Pay-As-You-Go offer](billing-upgrade-azure-subscription.md) within 90 days.

You receive notifications when you hit the spending limit for your offer. Log on to the [Azure Account Center](https://account.windowsazure.com), select **ACCOUNT**, and then select **subscriptions**. You see notifications about subscriptions that have reached the spending limit.

## Things you are charged for even if you have a spending limit enabled

Some Azure services and [Marketplace purchases](https://azure.microsoft.com/marketplace/) can incur charges under the payment method (CC) even if a spending limit is set. Examples are Visual studio licenses, Azure Active Directory premium, support plans, and most third-party branded services sold through the Marketplace.


## When not to use the spending limit

The spending limit could prevent you from deploying or using certain marketplace and Microsoft services. Here are the scenarios where you should remove the spending limit on your subscription.

- You plan to deploy first party images like Oracle and services such as Visual Studio Team Services. This scenario causes you to exceed your spending limit almost immediately and causes your subscription to be disabled.

- You have services that cannot be disrupted.

- You have services and resources with settings like virtual IP addresses that you don't want to lose. These settings are lost when the services and resources are deallocated.


## Remove the spending limit

You can remove the spending limit at any time as long as there's a valid payment method associated with your subscription. For offers that have credit over multiple months, you can also re-enable the spending limit at the beginning of your next billing cycle.

To remove your spending limit, follow these steps:

1. Log on to the [Azure Account Center](https://account.windowsazure.com).

2. Select a subscription.

3. If the subscription is disabled due to the Spending Limit being reached, click this notification: "Subscription reached the Spending Limit and has been disabled to prevent charges." Otherwise, click **Remove spending limit** in the **SUBSCRIPTION STATUS** area.

4. Select an option that is appropriate for you.

|Option|Effect|
|-------|-----|
|Remove spending limit indefinitely|Removes the spending limit without turning it on automatically at the start of the next billing period.|
|Remove spending limit for the current billing period|Removes the spending limit so that it turns back on automatically at the start of the next billing period.|

## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.