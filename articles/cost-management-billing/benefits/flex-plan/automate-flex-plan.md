---
title: Automate Flex Plan operations
titleSuffix: Microsoft Cost Management
description: Learn how to automate Flex Plan discovery, purchasing, management, monitoring, and cost-data retrieval.
author: pri-mittal
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 11/10/2026
ms.author: primittal
---

# Automate Flex Plan operations

Use Azure Billing Benefits and Cost Management interfaces to integrate Flex Plan tasks into FinOps and purchasing workflows.

> [!NOTE]
> Tool and API availability can differ by operation and purchasing channel. Use the [Azure Billing Benefits REST API](/rest/api/billingbenefits/operation-groups) to identify the Flex Plan operations available for your account and API version.

## Before you begin

Your application or identity needs permission on the relevant:

- Billing account or billing profile
- Billing subscription
- Flex Plan order and resource
- Benefit scope

Use Microsoft Entra authentication and least-privilege role assignments.

## Discover available offers and prices

Automate offer discovery to retrieve Flex Plans available to the customer. The response can include:

- Offer and SKU identifiers
- Terms and billing frequencies
- Minimum and maximum commitment amounts
- Currency and region
- Covered products and SKUs
- Benefit prices
- Whether the offer is available to the account

Don't hard-code offer configuration. Availability and pricing can change. Retrieve the current offer before validating a request or presenting purchase options.

## Retrieve recommendations

Use the [Benefit Recommendations API](/rest/api/cost-management/benefit-recommendations/list) to retrieve available purchase recommendations. A recommendation can include:

- Recommended commitment amount
- Term and billing frequency
- Lookback period
- Estimated savings
- Covered usage
- Cost details

Validate that a recommendation is still within the offer's current minimum and maximum before purchasing.

## Validate a purchase

Before submitting a purchase through an available Flex Plan purchase operation, retrieve the current offer and validate:

- Commitment purchase amount
- Payment schedule
- Currency
- Applicable purchase price
- Benefit scope
- Start date

Repeat validation after changing the term, billing frequency, commitment amount, or offer. Don't submit a request that uses cached limits or expired offer data.

## Purchase a Flex Plan

When an automated purchase operation is available for the customer's channel, the request typically supplies:

- Billing scope
- Subscription or resource placement
- Offer identifier
- Commitment amount
- Term
- Billing frequency
- Benefit scope
- Start date

Use the idempotency or alias mechanism documented for the operation. Record the returned order and plan identifiers, and read the created resource before reporting success.

Seller-assisted and Cloud Solution Provider purchases can use different transaction interfaces while creating the same type of Flex Plan benefit.

## View and manage plans

Automate retrieval of:

- Status and dates
- Original and remaining commitment
- Benefit scope
- Covered usage and utilization

Use the Flex Plan operations listed in the [Billing Benefits REST API reference](/rest/api/billingbenefits/operation-groups) to change supported settings. Re-read the resource after an update to confirm the effective configuration.

You can manage plans that a seller purchases on your behalf through supported operations with the appropriate permissions. See [Manage a seller-purchased Flex Plan](manage-flex-plan.md#manage-a-seller-purchased-flex-plan).

## Export usage and cost data

Create a [Cost Management export](../../costs/tutorial-improved-exports.md) or use the [Cost Management query API](/rest/api/cost-management/query) to retrieve available cost and usage data, including:

- Flex Plan benefit identifier
- Amount of benefit consumed
- Covered product and resource
- Retail and effective costs
- Amortized cost
- Uncovered usage

Join cost data to the Flex Plan order and plan identifiers for reporting.

## Handle errors

Automation should explicitly handle:

- Insufficient permissions
- Commitment outside the permitted range
- Unsupported term or billing frequency
- Offer no longer available
- Expired offer availability period
- Invalid benefit scope
- Conflicting or concurrent updates

Don't treat an empty or partial response as a successful purchase.

## Next steps

- [Buy a Flex Plan](buy-flex-plan.md)
- [Manage a Flex Plan](manage-flex-plan.md)
- [Troubleshoot Flex Plan](troubleshoot-flex-plan.md)
