---
title: Reactivate a disabled Azure subscription
description: Describes when you might have an Azure subscription disabled and how to reactivate it.
keywords: azure subscription disabled
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 01/22/2025
ms.author: banders
---

# Reactivate a disabled Azure subscription

Your Azure subscription can get disabled because your credit expired or you reached your spending limit. It can also get disabled if you have an overdue bill, hit your credit card limit, or because the Account Administrator canceled the subscription. Some subscriptions can also get automatically disabled. See what issue applies to you and follow the steps in this article to get your subscription reactivated.

## Your credit is expired

When you sign up for an Azure free account, you get a Free Trial subscription, which provides you $200 Azure credit in your billing currency for 30 days and 12 months of free services. At the end of 30 days, Azure disables your subscription. Your subscription is disabled to protect you from accidentally incurring charges for usage beyond the credit and free services included with your subscription. To continue using Azure services, you must [upgrade your subscription](upgrade-azure-subscription.md). After you upgrade the subscription, you still have access to free services for 12 months. You only get charged for usage beyond the free service quantity limits.

## You reached your spending limit

Azure subscriptions with credit such as Free Trial and Visual Studio Enterprise have spending limits on them. You can only use services up to the included credit. When your usage reaches the spending limit, Azure disables your subscription for the rest of that billing period. Your subscription is disabled to protect you from accidentally incurring charges for usage beyond the credit included with your subscription. To remove your spending limit, see [Remove the spending limit in the Azure portal](spending-limit.md#remove).

> [!NOTE]
> If you have a Free Trial subscription and you remove the spending limit, your subscription converts to an individual subscription with pay-as-you-go rates at the end of the Free Trial. You keep your remaining credit for the full 30 days after you created the subscription. You also have access to free services for 12 months.

To monitor and manage billing activity for Azure, see [Plan to manage Azure costs](../understand/plan-manage-costs.md).

## Your bill is past due

To resolve a past due balance, see one of the following articles:

- For Microsoft Online Subscription Program subscriptions including pay-as-you-go, see [Resolve past due balance for your Azure subscription after getting an email from Azure](resolve-past-due-balance.md).
- For Microsoft Customer Agreement subscriptions, see [How to pay your bill for Microsoft Azure](../understand/pay-bill.md).

## The bill exceeds your credit card limit

To resolve the issue, [switch to a different credit card](change-credit-card.md). Or if you're representing a business, you can [switch to pay by invoice](pay-by-invoice.md).

## The subscription was canceled

If you're the Account Administrator or subscription Owner and you canceled a pay-as-you-go subscription, you can reactivate it in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to Subscriptions and then select the canceled subscription.
1. Select **Reactivate**.  
    :::image type="content" source="./media/subscription-disabled/reactivate-sub.png" alt-text="Screenshot that shows Confirm reactivation." :::

If you have questions or need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).

## Reactivation process time

It can take up to 24 hours for your subscription to get reactivated after you pay your balance.

## After reactivation

After your subscription is reactivated, there might be a delay in creating or managing resources. If the delay exceeds 30 minutes, contact [Azure Billing Support](https://go.microsoft.com/fwlink/?linkid=2083458) for assistance. Most Azure resources automatically resume and don't require any action. However, we recommend that you check your Azure service resources and restart them if, if necessary.

## Upgrade a disabled free account

If you use resources that aren’t free and your subscription gets disabled because you run out of credit, and then you upgrade your subscription, the resources get enabled after upgrade. This situation results in you getting charged for the resources used. For more information about upgrading a free account, see [Upgrade your Azure account](upgrade-azure-subscription.md).

## Subscription blocked or automatically deleted

If you have a subscription that was blocked due to inactivity, see [What happens if my subscription is blocked?](avoid-unused-subscriptions.md#what-happens-if-my-subscription-is-blocked) If your subscription was deleted due to inactivity, it can't be reactivated. You must create a new subscription.

If you had an Access to Active Azure Directory subscription (MS-AZR-0110P) that was retired and deactivated and you want to reactivate it, Azure support can’t reactivate it for you. Microsoft deprecated the subscription offer. The subscription type was used to access the Azure portal. The subscription type is no longer needed because the Azure portal now uses your Microsoft Entra ID identity for access (previously named Azure Active Directory). So, Azure deprecated the subscription offer. You can sign up for new a subscription at [Azure sign up](https://signup.azure.com/signup).

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps
- Learn how to [Plan to manage Azure costs](../understand/plan-manage-costs.md).
