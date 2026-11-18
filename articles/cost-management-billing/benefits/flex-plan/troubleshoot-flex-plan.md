---
title: Troubleshoot Flex Plan
titleSuffix: Microsoft Cost Management
description: Resolve common Flex Plan discovery, purchase, benefit application, billing, utilization, and scope issues.
author: pri-mittal
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 11/10/2026
ms.author: primittal
---

# Troubleshoot Flex Plan

Use this article to diagnose common Flex Plan issues in the Azure portal and automated workflows.

## Flex Plan offer doesn't appear

Possible causes include:

- The billing account or channel isn't supported.
- The billing account isn't eligible for the offer.

## Seller-purchased Flex Plan doesn't appear

A Flex Plan purchased by a seller on your behalf appears under the account used for the purchase. You don't need to purchase it again.

If you can't find it:

- Confirm the account and subscription used for the purchase with your seller.
- Confirm that you're signed in to the correct Microsoft Entra tenant.
- Ask an administrator to verify your permissions to view the plan.
- Check **Flex Plans** in the Azure portal.

When you have the appropriate permissions, you can view details, monitor utilization and remaining balance, and change benefit scope. See [Manage a seller-purchased Flex Plan](manage-flex-plan.md#manage-a-seller-purchased-flex-plan).

## Commitment amount isn't accepted

The amount must be within the minimum and maximum for the selected term and billing frequency.

If the range changes after you open the purchase experience, refresh the offer and enter an amount that satisfies the current limits.

## Purchase fails

Check:

- Billing and Azure permissions
- Billing profile and subscription status
- Whether the offer is available to the billing account
- Commitment amount, currency, term, and billing frequency
- Offer availability
- Benefit scope validity

For a seller-assisted purchase, verify that the selected billing profile belongs to the applicable billing account.

## Benefit isn't applied

Verify that:

- The plan is active.
- The product and SKU are covered.
- The usage region is covered.
- The resource is within the benefit scope.
- A less flexible benefit didn't apply first.
- Another applicable Flex Plan was selected first.
- The plan has remaining balance.
- The usage occurred before the plan expired or ended.

Recently reported usage might take time to appear in cost and utilization views.

## Remaining balance looks incorrect

The balance reduces by using the applicable price shown in the customer's usage and billing records, not necessarily the retail price.

Compare:

- Retail usage
- Applied price
- Benefit amount consumed
- Other Flex Plans applied to the same products

Use usage details to identify the plan that covered each charge.

## Monthly charge is higher than expected

A monthly billed plan normally charges at least the monthly minimum. The charge increases when cumulative covered usage exceeds cumulative finalized charges. Each charge is capped at the uncollected commitment, so the final charge can be less than the monthly minimum.

For more information, see [Understand Flex Plan billing and charges](flex-plan-billing.md).

## Scope can't be changed

Confirm that:

- The destination scope is supported by the offer.
- You have access to the destination subscription, resource group, or management group.
- The source and destination belong to the same billing entity.
- The plan isn't in a state that blocks updates.

Changing the parent subscription doesn't automatically change the benefit scope.

## CSP Flex Plan was canceled

For Cloud Solution Provider (CSP) subscriptions, the associated Flex Plan is automatically canceled when you initiate subscription cancellation or transfer, not when the operation completes.

Check whether cancellation or transfer of the associated subscription was initiated. This automatic cancellation is separate from self-service cancellation of a Flex Plan, which isn't supported.

## Get support

If the issue remains [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Next steps

- [Manage a Flex Plan](manage-flex-plan.md)
- [Understand Flex Plan billing and charges](flex-plan-billing.md)
- [Automate Flex Plan operations](automate-flex-plan.md)
