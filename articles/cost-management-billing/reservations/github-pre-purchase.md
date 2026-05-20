---
title: GitHub Prepurchase Plan
description: Learn about GitHub Prepurchase Plan in Azure reservations.
author: pri-mittal
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: how-to
ms.date: 05/12/2026
ms.author: primittal
---

# Optimize GitHub costs with a prepurchase plan

Save on your GitHub costs when you buy a prepurchase plan. Prepurchase plans are commit units (CUs) bought at discounted tiers in your purchasing currency for a specific product. The more you buy, the greater the discount. Purchased CUs pay down qualifying costs in US dollars (USD). So, if GitHub generates a retail cost of $100 based on GitHub usage, then 100 GitHub CUs (GCUs) are consumed.

Your GitHub prepurchase plan automatically uses your GCUs to pay for eligible GitHub usage during its one-year term or until GitHub CUs run out. Your prepurchase plan GitHub CUs start paying for your GitHub usage without having to redeploy or reassign the plan. By default, plans are configured to renew at the end of the one-year term.

## Services covered by GitHub prepurchase plan

The GitHub prepurchase plan covers usage across all products under the GitHub services umbrella, including GitHub Enterprise, GitHub Copilot, GitHub Advanced Security, and GitHub Actions, Codespaces, Packages, Large File Storage and any GitHub AI Overage Units among others.

## How GitHub usage maps to your Azure subscription

GitHub usage is billed through the Azure subscription linked to your GitHub organization. Understanding this mapping is important for ensuring your prepurchase plan covers your usage:

- **GitHub organization → Azure subscription**: Each GitHub organization is linked to a specific Azure subscription for billing purposes. All GitHub usage from that organization — including GitHub Copilot and GitHub Actions — flows to that subscription.
- **Scope alignment**: The scope you select for your prepurchase plan must include the Azure subscription linked to your GitHub organization. If you have multiple GitHub organizations linked to different Azure subscriptions, consider using **Shared scope** or **Management group** scope to cover all of them.
- **Verifying your linked subscription**: To check which Azure subscription is linked to your GitHub organization, go to your GitHub organization's billing settings and review the Azure subscription ID.

> [!TIP]
> If you're unsure which subscription your GitHub usage is billed to, use **Shared scope** to apply the prepurchase plan across all eligible subscriptions in your billing context. This ensures no usage is missed.

## Prerequisites

To buy a prepurchase plan, you must have one of the following Azure subscriptions and roles:
- For an Azure subscription, the owner role or reservation purchaser role is required.
- For an Enterprise Agreement (EA) subscription, the [**Reserved Instances** policy option](../manage/direct-ea-administration.md#view-and-manage-enrollment-policies) must be enabled. To enable that policy option, you must be an EA administrator of the subscription.
- For a Cloud Solution Provider (CSP) subscription, follow one of these articles:
   - [Buy Azure reservations on behalf of a customer](/partner-center/customers/azure-reservations-buying)
   - [Allow the customer to buy their own reservations](/partner-center/customers/give-customers-permission)

## Determine the right size to buy

To get started, estimate your expected GitHub usage for the term. This helps you determine the appropriate size for your prepurchase plan. Each prepurchase plan has a one-year term.

**Example calculation:**

> [!NOTE]
> The following examples use hypothetical prices and quantities for illustration purposes only. Actual prices, discounts, and tier thresholds may vary. Refer to the Azure portal for current pricing.

Suppose a customer expects to consume:

| Item | Quantity | Hypothetical Annual Total |
|------|----------|-------------|
| GHCP Business | 970 seats | $221,160 |
| GitHub Enterprise | 560 seats | $141,120 |
| Code Security | 380 seats | $136,800 |
| AI Credits | 92,000 credits | $920 |
| **Total** | | **$500,000** |

By purchasing Tier 3 (500,000 GitHub Commit Units) GitHub P3 at a hypothetical cost of $425,000, the customer realizes a 15% savings compared to the hypothetical pay-as-you-go rate for the same level of usage.

Consider a hypothetical scenario where your organization plans to use:
- **GitHub Copilot**: 500 seats of GitHub Copilot Business
- **GitHub Actions**: 50,000 minutes of compute usage

**Assumed pay-as-you-go rates (for illustration purposes):**
- GitHub Copilot Business at hypothetical $19 per seat/month = $114,000/year
- GitHub Actions at assumed rates = $6,000/year
- **Total estimated pay-as-you-go cost: $120,000**

**Assuming Tier 2 prepurchase plan (120,000 CUs):**
- Estimated plan cost: $112,800
- **Potential savings: $7,200 (approximately 6% discount)**

This example demonstrates how the prepurchase plan can provide cost savings for organizations with predictable GitHub usage patterns.

## Purchase GitHub Prepurchase Plan commit units

Purchase GitHub Prepurchase Plans in the [Azure portal reservations](https://portal.azure.com/#view/Microsoft_Azure_Reservations/ReservationsBrowseBlade/productType/Reservations). 

1. Go to the [Azure portal](https://portal.azure.com)
2. Navigate to the **Reservations** service.
3. On the **Purchase reservations page**, select **GitHub Prepurchase Plan**.
4. On the **Select the product you want to purchase** page, select a subscription. Use the **Subscription** list to select the subscription used to pay for the purchase. The payment method of the subscription is charged the upfront cost for the reservation.
5. Select a scope. The scope determines which Azure subscriptions' GitHub usage is covered by this prepurchase plan. Make sure the scope includes the subscription where your GitHub usage is billed.
   - **Single resource group scope** - Applies the reservation discount to the matching resources in the selected resource group only.
   - **Single subscription scope** - Applies the reservation discount to the matching resources in the selected subscription.
   - **Shared scope** - Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For Enterprise Agreement customers, the billing context is the enrollment.
   - **Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.

> [!NOTE]
> GitHub usage is billed through the Azure subscription that is linked to your GitHub organization. To ensure your prepurchase plan covers your GitHub usage, verify that the subscription linked to your GitHub organization falls within the scope you select. If the linked subscription is outside the scope, the prepurchase plan won't apply to that usage.
6. Select how many GitHub commit units you want to purchase.
7. Choose to automatically renew the prepurchase reservation. *The setting is configured to renew automatically by default*. For more information, see [Renew a reservation](reservation-renew.md).

## Change scope and ownership

You can make the following types of changes to a reservation after purchase:

- Update reservation scope
- Update who can view or manage the reservation. For more information, see [Who can manage a reservation by default](manage-reserved-vm-instance.md#who-can-manage-a-reservation-by-default).

You can't split or merge a **GitHub Prepurchase Plan**. For more information about managing reservations, see [Manage reservations after purchase](manage-reserved-vm-instance.md).

## How does benefit application work?

When you have multiple AI-related purchasing options, understanding how benefits are applied helps you maximize your cost savings. You might have several types of purchases for your AI workloads:

- [GitHub AI Credits pre-purchase plan](github-ai-credits-pre-purchase-plan.md) - Covers GitHub AI Credits-specific usage
- GitHub prepurchase plan - Covers broader GitHub usage
- [Microsoft Agent prepurchase plan](agent-pre-purchase.md) - Covers broader AI workloads including Copilot Credit, Microsoft Foundry, and GitHub

### Understanding benefit overlap

**What is overlap?** Overlap occurs when multiple benefits can cover the same usage. For example:

- GitHub usage is eligible for the GitHub AI Credits pre-purchase plan, the GitHub prepurchase plan, and the Microsoft Agent prepurchase plan

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
> GitHub prepurchase plan does not cover the purchase cost of other reservations or prepurchase plans - only actual usage costs.

## Cancellations and exchanges

Cancel and exchange operations aren't supported for **GitHub Prepurchase Plans**. All purchases are final.

## Related content

To learn more about Azure Reservations, see the following articles:
- [What are Azure Reservations?](save-compute-costs-reservations.md)
- [Manage Reservations for Azure resources](manage-reserved-vm-instance.md)
