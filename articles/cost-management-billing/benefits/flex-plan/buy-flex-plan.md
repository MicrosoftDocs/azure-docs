---
title: Buy a Flex Plan
titleSuffix: Microsoft Cost Management
description: Learn the permissions, commitment considerations, and Azure portal steps for purchasing a Flex Plan.
author: pri-mittal
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 11/10/2026
ms.author: primittal
---

# Buy a Flex Plan

Use the Flex Plan purchase experience to select an available offer, choose a commitment amount and benefit scope, and submit the purchase.

## Prerequisites and permissions

Before purchasing:

- Confirm that your billing account and subscription support the Flex Plan offer.
- Confirm that you're in the correct Microsoft Entra tenant.
- Verify that you have permission on the billing scope and subscription used for the purchase.
- Decide where the benefit should apply.
- Estimate the commitment amount needed for the plan term.

A user assigned the Owner role on the subscription used for the purchase can add a Flex Plan. For a Microsoft Customer Agreement, an eligible role can include Subscription owner when subscription-based purchasing is available.

The purchase experience validates your permissions and whether the billing account, billing profile, and subscription are eligible for the selected offer.

## Choose a commitment amount

Choose a commitment that reflects the covered usage you expect during the plan term. Consider:

- The products and SKUs covered by the plan.
- Existing reservations, pre-purchase plans, savings plans, and Flex Plans.
- Expected growth, reductions, launches, retirements, and seasonal changes.
- Whether the offer uses upfront or monthly billing.

Don't base the commitment on total cloud spending if some of that spending isn't covered by the Flex Plan.

### Use a recommendation

When a recommendation is available, the purchase experience shows a recommended commitment based on historical covered usage. Recommendations can include:

- Recommended commitment amount
- Lookback period
- Estimated savings
- Estimated coverage
- Average utilization
- Cost comparison

Select **Recommended amount** to use the recommendation. Select **View details** to compare calculated commitments and review the cost details. You can apply a different recommendation or select **Custom amount**.

> [!IMPORTANT]
> Recommendations are estimates, not guarantees. Future usage, benefit prices, product coverage, and scope changes can affect actual savings.

If a recommendation isn't available, estimate the covered usage for the full term and enter an amount within the displayed commitment range.

## Purchase in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Flex Plans**.
1. Select **Create**.
1. Under **Select a subscription**, select the subscription to use for the purchase. Subscriptions where you don't have the required permission are unavailable.
1. Browse the available Flex Plan offers, or use **Search offers** to search by offer, product, or SKU.
1. Review the products, SKUs, and terms displayed on each offer card. Select **View all** to see the complete list displayed for an offer.
1. On the offer that you want, select **Purchase**.

## Promotions and free usage offers

Promotions and free usage offers appear in the purchase experience when your billing account is eligible. If an offer doesn't appear, it isn't currently available for your billing account.

Review the displayed offer details and terms before selecting it. For more information, see [Promotions and free usage offers](flex-plan-overview.md#promotions-and-free-usage-offers).

## Complete the Basics tab

On the **Basics** tab, complete the following sections.

### Project details

- **Subscription**: Select the subscription where the Flex Plan resource is created.
- **Resource group**: Select an existing resource group or select **Create new**.

### Instance details

- **Name**: Enter a name for the Flex Plan resource.
- **Region**: Flex Plan resources use the **Global** region.

### Benefit application scope

Select where the benefit applies:

- **Shared across the subscription billing scope**
- **Only in the selected subscription**
- **In a specific resource group of the selected subscription**
- **In a management group of the selected subscription**

The subscription containing the Flex Plan resource and the benefit application scope are separate settings.

### Plan configuration

1. Select an **Available offer**.
1. Review the displayed commitment range, term, and billing frequency.
1. Use the recommended commitment amount, when available, or enter a custom **Total spend commitment** within the displayed range.

For monthly billing, the displayed cost represents the minimum monthly charge. Additional charges can apply when covered usage outpaces cumulative collection. For more information, see [Understand Flex Plan billing and charges](flex-plan-billing.md).

Select **Next**.

## Complete the remaining tabs

1. On the **Tags** tab, add tags if needed, and then select **Next**.
1. On the **Additional information** tab, review the purchase information and legal terms, and then select **Next**.
1. On the **Review + submit** tab, verify:
   - Subscription and resource group
   - Resource name
   - Benefit application scope
   - Offer, term, and billing frequency
   - Commitment amount and cost
1. Submit the purchase.

Self-service cancellation and exchanges aren't supported. Any unused balance is forfeited when the term expires.

For Cloud Solution Provider (CSP) subscriptions, the associated Flex Plan is automatically canceled when you initiate subscription cancellation or transfer, not when the operation completes.

## After purchase

The Flex Plan appears in the Azure portal after the transaction completes. You can then:

- Review its status, commitment, term, and billing frequency.
- Change its benefit scope.
- Monitor utilization.
- Manage access and tags.

## If a seller purchases on your behalf

If a seller purchases a Flex Plan on your behalf, it appears under the account used for the purchase. You don't need to repeat the purchase steps.

To find and manage the plan:

1. Sign in to the Azure portal in the tenant associated with the purchase.
1. Search for and select **Flex Plans**.
1. Select the plan associated with the account used for the purchase.

With the appropriate permissions, you can view the plan details, monitor utilization and remaining balance, and change its benefit scope. See [Manage a seller-purchased Flex Plan](manage-flex-plan.md#manage-a-seller-purchased-flex-plan).

If you can't find the plan, confirm the account used for the purchase with your seller and ask an administrator to verify your access.

## Troubleshoot purchase access

If a subscription or offer isn't available:

- Confirm that you're in the correct Microsoft Entra tenant.
- Confirm that the billing profile and subscription belong to the expected billing account.
- Verify your role at the billing and Azure resource scopes.
- Check whether the subscription is enabled.
- Check whether purchasing is disabled by a billing policy.
- Ask a billing or subscription administrator to assign an applicable role.

## Next steps

- [Manage a Flex Plan](manage-flex-plan.md)
- [Understand Flex Plan billing and charges](flex-plan-billing.md)
- [Troubleshoot Flex Plan](troubleshoot-flex-plan.md)
