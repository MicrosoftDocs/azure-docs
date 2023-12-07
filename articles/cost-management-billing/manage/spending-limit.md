---
title: Azure spending limit
description: This article describes how an Azure spending limit works and how to remove it.
author: bandersmsft
ms.reviewer: judupont
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 04/05/2023
ms.author: banders
---

# Azure spending limit

The spending limit in Azure prevents spending over your credit amount. All new customers who sign up for an Azure free account or subscription types that include credits over multiple months have the spending limit turned on by default. The spending limit is equal to the amount of credit. You can't change the amount of the spending limit. For example, if you signed up for Azure free account, your spending limit is $200 and you can't change it to $500. However, you can remove the spending limit. So, you either have no limit, or you have a limit equal to the amount of credit. The limit prevents you from most kinds of spending.

The spending limit isn’t available for subscriptions with commitment plans or with pay-as-you-go pricing. For those types of subscriptions, a spending limit isn't shown in the Azure portal and you can't enable one. See the [full list of Azure subscription types and the availability of the spending limit](https://azure.microsoft.com/support/legal/offer-details/).

## Reaching a spending limit

When your usage results in charges that exhaust your spending limit, the services that you deployed are disabled for the rest of that billing period.

For example, when you spend all the credit included with your Azure free account, Azure resources that you deployed are removed from production and your Azure virtual machines are stopped and de-allocated. The data in your storage accounts are available as read-only.

If your subscription type includes credits over multiple months, your subscription is re-enabled automatically at the beginning of the next billing period. Then you can redeploy your Azure resources and have full access to your storage accounts and databases.

Azure sends email notifications when you reach the spending limit. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) to see notifications about subscriptions that have reached the spending limit.

If you signed up for an Azure free account and reach the spending limit, you can upgrade to a [pay-as-you-go](upgrade-azure-subscription.md) pricing to remove the spending limit and automatically re-enable your subscription.

## Remove the spending limit in Azure portal

You can remove the spending limit at any time as long as there's a valid payment method associated with your Azure subscription. For subscription types that have credit over multiple months such as Visual Studio Enterprise and Visual Studio Professional, you can choose to remove the spending limit indefinitely or only for the current billing period. If you choose the current billing period only, the spending limit will be automatically enabled at the beginning of your next billing period.

If you have an Azure free account, see [Upgrade your Azure subscription](upgrade-azure-subscription.md) to remove your spending limit. Otherwise, follow these steps to remove your spending limit:

<a id="remove"></a>

1. Sign in to the [Azure portal](https://portal.azure.com) as the Account Administrator.
1. Search for **Cost Management + Billing**.  
    :::image type="content" source="./media/spending-limit/search-bar.png" alt-text="Screenshot that shows search for cost management + billing." lightbox="./media/spending-limit/search-bar.png" :::
1. In the **My subscriptions** list, select your subscription. For example, *Visual Studio Enterprise*.  
    :::image type="content" source="./media/spending-limit/cost-management-overview-msdn-x.png" alt-text="Screenshot that shows my subscriptions grid in overview." lightbox="./media/spending-limit/cost-management-overview-msdn-x.png" :::
    > [!NOTE]
    > If you don't see some of your Visual Studio subscriptions here, it might be because you changed a subscription directory at some point. For these subscriptions, you need to switch the directory to the original directory (the directory in which you initially signed up). Then, repeat step 2.
1. In the Subscription overview, select the banner to remove the spending limit.  
    :::image type="content" source="./media/spending-limit/msdn-remove-spending-limit-banner-x.png" alt-text="Screenshot that shows remove spending limit banner." lightbox="./media/spending-limit/msdn-remove-spending-limit-banner-x.png" :::
1. Choose whether you want to remove the spending limit indefinitely or for the current billing period only.  
    :::image type="content" source="./media/spending-limit/remove-spending-limit-blade-x.png" alt-text="Screenshot that shows remove spending limit page." lightbox="./media/spending-limit/remove-spending-limit-blade-x.png" :::
    - Selecting the **Remove spending limit indefinitely** option prevents the spending limit from automatically getting enabled at the start of the next billing period. However, you can turn it back on yourself at any time.
    - Selecting the **Remove spending limit for the current billing period** option automatically turns the spending limit back on at the start of the next billing period.
1. Select **Select payment method** to choose a payment method for your subscription. The payment method becomes the active payment method for your subscription.
1. Select **Finish**.

## Why you might want to remove the spending limit

The spending limit could prevent you from deploying or using certain third-party and Microsoft services. Here are the situations where you should remove the spending limit on your subscription.

-  You plan to deploy third-party images like Oracle or services such as Azure DevOps Services. This situation causes you to reach your spending limit almost immediately and causes your subscription to be disabled.
- You have services that you don't want disrupted. When you reach your spending limit, Azure resources that you deployed are removed from production and your Azure virtual machines are stopped and de-allocated. If you have services that you don't want disrupted, you must remove your spending limit.
- You have services and resources with settings like virtual IP addresses that you don't want to lose. These settings are lost when your reach your spending limit and the services and resources are de-allocated.

## Turn on the spending limit after removing

This feature is available only when the spending limit has been removed indefinitely for subscription types that include credits over multiple months. You can use this feature to turn on your spending limit automatically at the start of the next billing period.

1. Sign in to the [Azure portal](https://portal.azure.com) as the Account Administrator.
1. Search for **Cost Management + Billing**.  
    :::image type="content" source="./media/spending-limit/search-bar.png" alt-text="Screenshot that shows search for cost management + billing." lightbox="./media/spending-limit/search-bar.png" :::
1. In the **My subscriptions** list, select your subscription. For example, *Visual Studio Enterprise*.  
    :::image type="content" source="./media/spending-limit/cost-management-overview-msdn-x.png" alt-text="Screenshot that shows my subscriptions grid where the banner appears." lightbox="./media/spending-limit/cost-management-overview-msdn-x.png" :::
    > [!NOTE]
    > If you don't see some of your Visual Studio subscriptions here, it might be because you changed a subscription directory at some point. For these subscriptions, you need to switch the directory to the original directory (the directory in which you initially signed up). Then, repeat step 2.
1. In the Subscription overview, select the banner at the top of the page to turn the spending limit back on.  
    :::image type="content" source="./media/spending-limit/turn-on-spending-limit.png" alt-text="Screenshot showing the enable spending limit banner." lightbox="./media/spending-limit/turn-on-spending-limit.png" :::
1. When prompted with **Are you sure you want to turn the spending limit on**, select **Yes**.

## Custom spending limit

Custom spending limits aren't available.

## A spending limit doesn't prevent all charges

[Some external services published in the Azure Marketplace](../understand/understand-azure-marketplace-charges.md) can't be used with your subscription credits, and can incur separate charges even when your spending limit is set. Examples include Visual Studio licenses, Microsoft Entra ID P1 or P2, support plans, and most third-party branded services. When you create a new external service, a warning is shown to let you know the services are billed separately:

![Marketplace purchase warning](./media/spending-limit/marketplace-warning01.png)

## Troubleshoot spending limit banner

If the spending limit banner doesn't appear, you can manually navigate to your subscription's URL.

1. Ensure that you've navigated to the correct tenant/directory in the Azure portal.
1. Navigate to `https://portal.azure.com/#blade/Microsoft_Azure_Billing/RemoveSpendingLimitBlade/subscriptionId/11111111-1111-1111-1111-111111111111` and replace the example subscription ID with your subscription ID.

The spending limit banner should appear.

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps
- Upgrade to a plan with [pay-as-you-go](upgrade-azure-subscription.md) pricing.
