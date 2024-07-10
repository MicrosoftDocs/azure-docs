---
title: Optimize costs with a prepurchase plan
titleSuffix: Microsoft Sentinel
description: Learn how to save costs and buy a Microsoft Sentinel prepurchase plan
author: austinmccollum
ms.topic: how-to
ms.date: 07/10/2024
ms.author: austinmc
#customerintent: As a SOC administrator or a billing specialist, I want to know how to buy a prepurchase plan and whether commit units will benefit us financially.
---

# Optimize Microsoft Sentinel costs with a prepurchase plan

Save on your Microsoft Sentinel costs when you prepurchase Microsoft Sentinel commit units (CUs). Think of the prepurchase plan as a pool of credits, called commit units (CUs), where CUs are equivalent to your purchase currency value. So, in US dollars (USD), 1 CU = $1 USD. Use the prepurchased CUs at any time during the one year purchase term. Any eligible Microsoft Sentinel costs deduct first from the prepurchased CUs automatically. You don't need to redeploy or assign a prepurchased plan to your Microsoft Sentinel workspaces for the CU usage to get the prepurchase discounts.

## Prerequisites

To buy a prepurchase plan, you must have one of the following Azure subscriptions and roles:

- For an Azure subscription, the owner role or reservation purchaser role is required.
- For an Enterprise Agreement (EA) subscription, the [**Reserved Instances** policy option](../cost-management-billing/manage/direct-ea-administration.md#view-and-manage-enrollment-policies) must be enabled. To enable that policy option, you must be an EA administrator of the subscription.
- For a Cloud Solution Provider (CSP) subscription, follow either the [buy Azure reservations on behalf of a customer](/partner-center/customers/azure-reservations-buying) or the [allow the customer to buy their own reservations](/partner-center/customers/give-customers-permission) steps.

## Determine the right size to buy

Prepurchase plans pair nicely with Microsoft Sentinel commitment tiers. Once you plan your Microsoft Sentinel ingestion volume and reduce complexity with a simplified pricing tier, choose an appropriate commitment tier. Then it's easier to decide on the size of a prepurchase plan to buy.

Here's an example of the decision making and cost savings for a prepurchase plan. If you have a simplified pricing commitment tier of 200 GB/day, there's an associated monthly estimated cost. For example purposes, let's say that's $20,000 USD and provides a 39% savings over pay-as-you-go. A $100,000 USD prepurchase plan covers 5 months of that commitment tier but is valid for paying Microsoft Sentinel costs for 12 months. That prepurchase plan is bought at a 22% discount for $78,000 USD. The savings for the commitment tier and the prepurchase plan combine. The original pay-as-you-go price for 5 months of 200 GB/day ingestion and analysis costs is about $160,000 USD. With an accurate commitment tier and a prepurchase plan, the cost reduced to $78,000 USD for a combined savings of over 51%.

For more information, see the following articles:
- [Switch to simplified pricing](enroll-simplified-pricing-tier.md)
- [Set or change commitment tier](billing-reduce-costs.md#set-or-change-pricing-tier)

>[!IMPORTANT]
> The prices mentioned are for example purposes only. To determine the latest commitment tier prices, see [Microsoft Sentinel pricing](https://azure.microsoft.com/pricing/details/microsoft-sentinel/).

The Microsoft Sentinel prepurchase CUs are applied to all Microsoft Sentinel costs. From your Microsoft Sentinel bill, these costs are all the entries with the **Sentinel** service name. Keep in mind, Microsoft Sentinel integrates with many other Azure services that have separate costs. For more information, see [Costs and pricing for other services](billing.md#costs-and-pricing-for-other-services).

## Purchase Microsoft Sentinel commit units

Purchase Microsoft Sentinel prepurchase plans in the [Azure portal reservations](https://portal.azure.com/#view/Microsoft_Azure_Reservations/ReservationsBrowseBlade/productType/Reservations). 

1. Go to the [Azure portal](https://portal.azure.com)
1. Navigate to the **Reservations** service.
1. On the Purchase reservations page, select **Microsoft Sentinel Pre-Purchase Plan**.
1. On the Select the product you want to purchase page, select a subscription. Use the **Subscription** list to select the subscription used to pay for the reserved capacity. The payment method of the subscription is charged the upfront costs for the reserved capacity. Charges are deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
1. Select a scope.

   - Single resource group scope - Applies the reservation discount to the matching resources in the selected resource group only.
   - Single subscription scope - Applies the reservation discount to the matching resources in the selected subscription.
   - Shared scope - Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For Enterprise Agreement customers, the billing context is the enrollment.
   - Management group - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.
1. Select how many Microsoft Sentinel commit units you want to purchase.
   **Need screenshot here**
   :::image type="content" source="../cost-management-billing/reservations/media/synapse-analytics-pre-purchase-plan/buy-synapse-analytics-pre-purchase-plan.png" alt-text="Screenshot showing prepurchase plan discount tiers and their term lengths.":::

## Change scope and ownership

You can make the following types of changes to a reservation after purchase:

- Update reservation scope
- Azure role-based access control (Azure RBAC) of the reservation

You can't split or merge a Microsoft Sentinel commit unit Pre-Purchase Plan. For more information about managing reservations, see [Manage reservations after purchase](../cost-management-billing/reservations/manage-reserved-vm-instance.md).

## Cancellations and exchanges

Cancel and exchange isn't supported for Synapse Pre-Purchase Plans. All purchases are final.

## Related content

To learn more about Azure Reservations, see the following articles:

- [What are Azure Reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md)
- [Manage Azure Reservations](../cost-management-billing/reservations/manage-reserved-vm-instance.md)

To learn more about Microsoft Sentinel costs, see [Plan costs and understand Microsoft Sentinel pricing and billing](billing.md).