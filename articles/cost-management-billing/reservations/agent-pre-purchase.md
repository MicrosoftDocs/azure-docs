---
title: Microsoft Agent Pre-Purchase Plan
description: Learn about Microsoft Agent Pre-Purchase Plan in Azure reservations.
author: pri-mittal
ms.reviewer: primittal
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: conceptual
ms.date: 01/15/2026
ms.author: primittal
---

# Optimize Microsoft Foundry and Copilot Credit costs with Microsoft Agent pre-purchase plan 

Save on your Copilot Credit and Microsoft Foundry costs when you buy a pre-purchase plan. Pre-purchase plans are commit units (CUs) bought at discounted tiers in your purchasing currency for a specific product. The more you buy, the greater the discount. Purchased CUs pay down qualifying costs in US dollars (USD). So, for example if Microsoft Copilot Studio or Microsoft Foundry generates a retail cost of $100 based on Copilot Credit and Microsoft Foundry usage, then 100 Agent CUs (ACUs) are consumed.

Your Microsoft Agent pre-purchase plan automatically uses your ACUs to pay for eligible Copilot and AI Foundry usage during its one-year term or until Agent CUs run out. Your pre-purchase plan Agent CUs start paying for your Copilot Credit and Microsoft Foundry usage without having to redeploy or reassign the plan. By default, plans are configured to renew at the end of the one-year term.

## Prerequisites

To buy a pre-purchase plan, you must have one of the following Azure subscriptions and roles:
- For an Azure subscription, the owner role or reservation purchaser role is required.
- For an Enterprise Agreement (EA) subscription, the [**Reserved Instances** policy option](../manage/direct-ea-administration.md#view-and-manage-enrollment-policies) must be enabled. To enable that policy option, you must be an EA administrator of the subscription.
- For a Cloud Solution Provider (CSP) subscription, follow one of these articles:
   - [Buy Azure reservations on behalf of a customer](/partner-center/customers/azure-reservations-buying)
   - [Allow the customer to buy their own reservations](/partner-center/customers/give-customers-permission)

## Determine the right size to buy

To get started, estimate your expected Copilot Credit and Microsoft Foundry usage for the term. This helps you determine the appropriate size for your pre-purchase plan. Each pre-purchase plan has a one-year term.

**Example calculation:**

Consider a hypothetical scenario where your organization plans to use:
- **Copilot Credit**: 1,500,000 credits for custom agents in Microsoft Copilot Studio
- **Microsoft Foundry PTUs**: 5,000 PTU hours for AI model deployments in Microsoft Foundry

**Assumed pay-as-you-go rates (for illustration purposes):**
- Copilot Credit at hypothetical $0.01 per credit = $15,000
- PTU usage at assumed $1.00 per PTU = $5,000
- **Total estimated pay-as-you-go cost: $20,000**

**Assuming Tier 1 pre-purchase plan (20,000 CUs):**
- Estimated plan cost: $19,000
- **Potential savings: $1,000 (approximately 5% discount)**

This example demonstrates how the pre-purchase plan can provide cost savings for organizations with predictable AI workload usage patterns.

## Purchase Microsoft Agent Pre-Purchase Plan commit units

Purchase Microsoft Agent Pre-Purchase Plans in the [Azure portal reservations](https://portal.azure.com/#view/Microsoft_Azure_Reservations/ReservationsBrowseBlade/productType/Reservations). 

1. Go to the [Azure portal](https://portal.azure.com)
2. Navigate to the **Reservations** service.
3. On the **Purchase reservations page**, select **Microsoft Agent Pre-Purchase Plan**.  
4. On the **Select the product you want to purchase** page, select a subscription. Use the **Subscription** list to select the subscription used to pay for the purchase. The payment method of the subscription is charged the upfront cost for the reservation. Charges are **not** deducted from the enrollment's Azure Prepayment (previously called monetary commitment) balance or charged as overage.
5. Select a scope.
   - **Single resource group scope** - Applies the reservation discount to the matching resources in the selected resource group only.
   - **Single subscription scope** - Applies the reservation discount to the matching resources in the selected subscription.
   - **Shared scope** - Applies the reservation discount to matching resources in eligible subscriptions that are in the billing context. For Enterprise Agreement customers, the billing context is the enrollment.
   - **Management group** - Applies the reservation discount to the matching resource in the list of subscriptions that are a part of both the management group and billing scope.
6. Select how many Agent Credit commit units you want to purchase.
7. Choose to automatically renew the pre-purchase reservation. *The setting is configured to renew automatically by default*. For more information, see [Renew a reservation](reservation-renew.md).

## Change scope and ownership

You can make the following types of changes to a reservation after purchase:

- Update reservation scope
- Update who can view or manage the reservation. For more information, see [Who can manage a reservation by default](manage-reserved-vm-instance.md#who-can-manage-a-reservation-by-default).

You can't split or merge a **Microsoft Agent Pre-Purchase Plan**. For more information about managing reservations, see [Manage reservations after purchase](manage-reserved-vm-instance.md).

## How does benefit application work?

When you have multiple AI-related purchasing options, understanding how benefits are applied helps you maximize your cost savings. You might have several types of purchases for your AI workloads:

- [Microsoft Foundry Provisioned Throughput reservation](microsoft-foundry.md) - Covers Microsoft Foundry PTU (Provisioned Throughput Units) usage
- [Copilot Credit pre-purchase plan](copilot-credit-p3.md) - Covers Copilot Credit-specific usage  
- Microsoft Agent pre-purchase plan - Covers broader AI workloads including both Copilot Credit and Microsoft Foundry

### Understanding benefit overlap

**What is overlap?** Overlap occurs when multiple benefits can cover the same usage. For example:
- Copilot credits are eligible for both Copilot Credit pre-purchase plan and Microsoft Agent pre-purchase plan
- Microsoft Foundry PTU workloads are eligible for both Microsoft Foundry PTU reservations and Microsoft Agent pre-purchase plan

### Benefit application order (precedence)

When overlap occurs, Microsoft applies benefits in this specific order to maximize your savings:

1. **Microsoft Foundry PTU Reservations**
   - Always applied first to PTU usage
   - PTU-specific and most cost-effective for provisioned throughput

2. **Copilot Credit Pre-Purchase Plan** 
   - Applied next to Copilot-specific workloads
   - More granular benefit preserved for specialized use for Copilot Credit usage

3. **Microsoft Agent Pre-Purchase Plan**
   - Applied last to remaining AI usage across both platforms
   - Broader coverage for heterogeneous AI workloads for Copilot Credit and Microsoft Foundry usage

> [!IMPORTANT]
> Microsoft Agent pre-purchase plan does not cover the purchase cost of other reservations or pre-purchase plans - only actual usage costs.

### Benefit application scenarios

These scenarios show how benefits work together in different purchasing combinations:

#### Scenario 1: Microsoft Foundry reservation only

**What you have:**
- Microsoft Foundry PTU reservation for 10 PTUs

**How benefits apply:**
1. Reservation covers first 10 PTUs at discounted rate
2. Additional PTU usage beyond 10 PTUs charged at pay-as-you-go rates
3. Non-PTU AI usage (like Copilot) charged at pay-as-you-go rates

#### Scenario 2: Copilot Credit + Microsoft Agent pre-purchase plans

**What you have:**
- Copilot Credit pre-purchase plan: 5,000 CCCUs
- Microsoft Agent pre-purchase plan: 20,000 ACUs  

**How benefits apply:**
1. Copilot workloads consume Copilot Credit pre-purchase plan first (up to 5,000 CCCUs)
2. Additional Copilot usage draws from Microsoft Agent pre-purchase plan
3. Microsoft Foundry usage draws from Microsoft Agent pre-purchase plan

#### Scenario 3: Microsoft Foundry reservation + Microsoft Agent pre-purchase plan

**What you have:**
- Microsoft Foundry PTU reservation: 15 PTUs
- Microsoft Agent pre-purchase plan: 25,000 CUs

**How benefits apply:**
1. Foundry PTU reservation covers first 15 PTUs  
2. Overflow PTU usage draws from Agent pre-purchase plan
3. All Copilot usage draws from remaining Agent pre-purchase plan

#### Scenario 4: Complete coverage (all three benefits)

**What you have:**
- Microsoft Foundry PTU reservation: 10 PTUs
- Copilot Credit pre-purchase plan: 3,000 CUs
- Microsoft Agent pre-purchase plan: 15,000 CUs

**How benefits apply:**
1. Foundry reservation covers PTU usage (up to 10 PTUs)
2. Copilot Credit pre-purchase plan covers Copilot usage (up to 3,000 CUs)  
3. Agent pre-purchase plan covers overflow from both platforms

> [!NOTE]
> **Tiered pricing optimization:** Microsoft Agent pre-purchase plan automatically applies benefits at smallest tier pricing rates. For example, if you're using Custom Entity Lookup skills, benefits are calculated using the 0-1M text records pricing tier.

## Cancellations and exchanges

Cancel and exchange operations aren't supported for **Microsoft Agent pre-purchase plans**. All purchases are final.

## Related content

To learn more about Azure Reservations, see the following articles:
- [What are Azure Reservations?](save-compute-costs-reservations.md)
- [Manage Reservations for Azure resources](manage-reserved-vm-instance.md)
