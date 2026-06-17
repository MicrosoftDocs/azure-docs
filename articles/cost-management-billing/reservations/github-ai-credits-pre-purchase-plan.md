---
title: GitHub AI Credits Pre-Purchase Plan
description: Learn about GitHub AI Credits Pre-Purchase Plan in Azure reservations.
author: pri-mittal
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 05/12/2026
ms.author: primittal
---

# Optimize GitHub AI Credits costs with a pre-purchase plan

Save on your GitHub AI Credits costs when you buy a pre-purchase plan. Pre-purchase plans are commit units (CUs) bought at discounted tiers in your purchasing currency for a specific product. The more you buy, the greater the discount. Purchased CUs pay down qualifying costs in US dollars (USD). So, if GitHub AI generates a retail cost of $100 based on GitHub AI Credits usage, then 100 GitHub AI Credits CUs (GHAICCUs) are consumed.

Your GitHub AI Credits pre-purchase plan automatically uses your GHAICCUs to pay for eligible GitHub AI Credits usage during its one-year term or until GitHub AI Credits CUs run out. Your pre-purchase plan GitHub AI Credits CUs start paying for your GitHub AI usage without having to redeploy or reassign the plan. By default, plans are configured to renew at the end of the one-year term.

## How GitHub AI Credits usage maps to your Azure subscription

GitHub AI Credits usage is billed through the Azure subscription linked to your GitHub organization. Understanding this mapping is important for ensuring your pre-purchase plan covers your usage:

- **GitHub organization → Azure subscription**: Each GitHub organization is linked to a specific Azure subscription for billing purposes. All GitHub AI Credits usage from that organization flows to that subscription.
- **Scope alignment**: The scope you select for your pre-purchase plan must include the Azure subscription linked to your GitHub organization. If you have multiple GitHub organizations linked to different Azure subscriptions, consider using **Shared scope** or **Management group** scope to cover all of them.
- **Verifying your linked subscription**: To check which Azure subscription is linked to your GitHub organization, go to your GitHub organization's billing settings and review the Azure subscription ID.

> [!TIP]
> If you're unsure which subscription your GitHub usage is billed to, use **Shared scope** to apply the pre-purchase plan across all eligible subscriptions in your billing context. This ensures no usage is missed.

## Prerequisites

To buy a pre-purchase plan, you must have one of the following Azure subscriptions and roles:
- For an Azure subscription, the owner role or reservation purchaser role is required.
- For an Enterprise Agreement (EA) subscription, the [**Reserved Instances** policy option](../manage/direct-ea-administration.md#view-and-manage-enrollment-policies) must be enabled. To enable that policy option, you must be an EA administrator of the subscription.
- For a Cloud Solution Provider (CSP) subscription, follow one of these articles:
   - [Buy Azure reservations on behalf of a customer](/partner-center/customers/azure-reservations-buying)
   - [Allow the customer to buy their own reservations](/partner-center/customers/give-customers-permission)

## Determine the right size to buy

To get started, estimate your expected GitHub AI Credits usage. This helps you determine the appropriate size for your pre-purchase plan. Each pre-purchase plan has a one-year term.

> [!NOTE]
> The following example uses hypothetical prices and quantities for illustration purposes only. Actual prices, discounts, and tier thresholds may vary. Refer to the Azure portal for current pricing.

For example, suppose you expect to consume 2,000,000 GitHub AI Credits. Assuming a hypothetical pay-as-you-go rate of $0.01 per credit, this would cost $20,000. By purchasing a Tier 1 (20,000 CU) pre-purchase plan at a hypothetical cost of $19,000, you would realize a 5% saving compared to the hypothetical pay-as-you-go rate for the same usage.

## Purchase GitHub AI Credits commit units

Purchase GitHub AI Credits pre-purchase plans in the [Azure portal reservations](https://portal.azure.com/#view/Microsoft_Azure_Reservations/ReservationsBrowseBlade/productType/Reservations). 

1. Go to the [Azure portal](https://portal.azure.com)
2. Navigate to the **Reservations** service.
3. On the **Purchase reservations page**, select **GitHub AI Credits Pre-Purchase Plan**.  
4. On the **Select the product you want to purchase** page, select a subscription. Use the **Subscription** list to select the subscription used to pay for the reserved capacity. The payment method of the subscription is charged the upfront costs for the reserved capacity.
5. Select a scope. The scope determines which Azure subscriptions' GitHub AI Credits usage is covered by this pre-purchase plan. Make sure the scope includes the subscription where your GitHub usage is billed.
6. Select the discount tier you want to purchase.
    :::image type="content" source="./media/github-ai-credits/select-github-ai-credits-plan.png" border="true" alt-text="Screenshot showing the Select the product you want to purchase page with GitHub AI Credits Pre-Purchase Plan tiers." lightbox="./media/github-ai-credits/select-github-ai-credits-plan.png" :::
   - **Single resource group scope** - Applies the reservation discount to the matching resources in the selected resource group only.
   - **Single subscription scope** - Applies the reservation discount to the matching resources in the selected subscription.
   - **Shared scope** - Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For Enterprise Agreement customers, the billing context is the enrollment.
   - **Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.

   > [!NOTE]
   > GitHub usage is billed through the Azure subscription that is linked to your GitHub organization. To ensure your pre-purchase plan covers your GitHub AI Credits usage, verify that the subscription linked to your GitHub organization falls within the scope you select. If the linked subscription is outside the scope, the pre-purchase plan won't apply to that usage.

7. Select how many GitHub AI Credits commit units you want to purchase.
8. Choose to automatically renew the pre-purchase reservation. *The setting is configured to renew automatically by default*. For more information, see [Renew a reservation](reservation-renew.md).

## Change scope and ownership

You can make the following types of changes to a reservation after purchase:

- Update reservation scope
- Update who can view or manage the reservation. For more information, see [Who can manage a reservation by default](manage-reserved-vm-instance.md#who-can-manage-a-reservation-by-default).

You can't split or merge a **GitHub AI Credits Pre-Purchase Plan**. For more information about managing reservations, see [Manage reservations after purchase](manage-reserved-vm-instance.md).

## How does benefit application work?

When you have multiple purchasing options, understanding how benefits are applied helps you maximize your cost savings. You might have several types of purchases for your AI workloads:

- GitHub AI Credits pre-purchase plan - Covers GitHub AI Credits-specific usage
- [GitHub Pre-Purchase plan](/azure/cost-management-billing/reservations/github-pre-purchase) - Covers broader GitHub usage
- [Microsoft Agent prepurchase plan](agent-pre-purchase.md) - Covers broader AI workloads including Copilot Credit, Microsoft Foundry, and GitHub

### Understanding benefit overlap

**What is overlap?** Overlap occurs when multiple benefits can cover the same usage. For example:

- GitHub AI Credits usage is eligible for the GitHub AI Credits pre-purchase plan, the GitHub prepurchase plan, and the Microsoft Agent prepurchase plan

### Benefit application order (precedence)

When overlap occurs, Microsoft applies benefits in this specific order to maximize your savings:

1. **GitHub AI Credits Pre-Purchase Plan**
   - Applied first to GitHub AI Credits-specific usage
   - Most granular benefit preserved for specialized use

2. **GitHub Prepurchase Plan**
   - Applied next to remaining GitHub usage
   - Broader GitHub coverage

3. **Microsoft Agent Prepurchase Plan**
   - Applied last to remaining eligible usage across platforms
   - Broadest coverage for heterogeneous AI workloads

> [!IMPORTANT]
> GitHub AI Credits pre-purchase plan does not cover the purchase cost of other reservations or prepurchase plans - only actual usage costs.

## Cancellations and exchanges

Cancel and exchange operations aren't supported for **GitHub AI Credits Pre-Purchase Plans**. All purchases are final.

## Related content

To learn more about Azure Reservations, see the following articles:
- [What are Azure Reservations?](save-compute-costs-reservations.md)
- [Manage Reservations for Azure resources](manage-reserved-vm-instance.md)
