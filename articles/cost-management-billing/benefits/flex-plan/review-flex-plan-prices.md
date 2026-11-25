---
title: Review Flex Plan prices in your price sheet
titleSuffix: Microsoft Cost Management
description: Learn how to find Flex Plan prices in your price sheet, compare them with on-demand prices, and identify the Flex Plan offer for each price.
author: Britt-Henderson
ms.author: britth
ms.reviewer: vikdesai
ms.service: cost-management-billing
ms.subservice: cost-management
ms.topic: how-to
ms.date: 11/19/2026
---

# Review Flex Plan prices in your price sheet

Your price sheet lists a Flex Plan price for each meter that a Flex Plan offer covers. Use it to confirm that the prices you were quoted are the prices you're charged, and to compare Flex Plan prices with on-demand prices for the same meter.

## Prerequisites

- A Microsoft Customer Agreement billing account.
- The billing profile owner, contributor, reader, or invoice manager role.

## Get your price sheet

You can export or download your price sheet. Both include Flex Plan prices and the `priceFactors` column.

### Export your price sheet

1. In the Azure portal, go to **Cost Management** and select your billing profile scope.
1. Select **Exports**, and then select **Create**.
1. Select **Price sheet**.
1. For the dataset version, select **2026-10-01**.
1. Select a storage account and a schedule, and then create the export.

Dataset version 2026-10-01 includes the `priceFactors` column, which you need to identify Flex Plan prices. For more information, see [Create and manage exports](../../costs/tutorial-improved-exports.md).

### Download your price sheet

You can also download the price sheet from the Azure portal. A downloaded price sheet doesn't use dataset version 2026-10-01, but it includes the `priceFactors` column at the end of the file. For more information, see [View and download your organization's Azure pricing](../../manage/ea-pricing.md#download-pricing-for-an-mca-or-mpa-account) and [Compare downloads and exports](../../understand/compare-downloads-exports.md).

## Find Flex Plan prices

In the price sheet, a Flex Plan price is a row with these values:

| Column | Value |
| --- | --- |
| `priceType` | `FlexPlan` |
| `term` | The term of the Flex Plan offer, such as `P1M` (one month) or `P1Y` (one year) |
| `priceFactors` | A factor with `Type` set to `FlexPlan` and the `ProductCode` of the Flex Plan offer |

The `priceFactors` column is a JSON array that was added with the 2026-10-01 Cost Management exports dataset version. In the price sheet, the column describes the benefits that are associated with a price. In the case of Flex Plan, for example, `priceFactors` might look like this:

```json
[{"Factors":[{"Type":"FlexPlan","Extensions":{"ProductCode":"<product-code>"}}]}]
```
For more information, see [Understand price factors and supplemental charge details](../../automate/understand-price-factors-supplemental-charge-details.md#identify-flex-plan-charges).

## Compare Flex Plan and on-demand prices

1. Filter the price sheet to one meter by its `meterId`.
1. Find the row where `priceType` is `Consumption`. That row is the on-demand price.
1. Find the rows where `priceType` is `FlexPlan`. There's one row for each Flex Plan offer that covers the meter.
1. Compare `unitPrice` across the rows.

If more than one Flex Plan offer covers the meter, the rows can have the same price and term and differ only in the product code. To find out which offer each row belongs to, look up its product code.

## Identify the Flex Plan offer

To find out which offer a Flex Plan price belongs to, take the product code from the row's `priceFactors` column and look it up. For instructions, see [Discover available offers and prices](automate-flex-plan.md#discover-available-offers-and-prices).

Compare the offer details with your quote, such as:

- The offer and SKU names
- The term, such as one month or one year
- How often the commitment is billed, such as monthly or up front
- The minimum and maximum commitment amounts
- Whether the offer is a standard, trial, or promotional offer

Looking up a product code applies only to the price sheet. To identify the Flex Plan that covered usage in your cost and usage details, use the `benefitId` column instead. For more information, see [Understand price factors and supplemental charge details](../../automate/understand-price-factors-supplemental-charge-details.md#identify-flex-plan-charges).

## Related content

- [Microsoft Customer Agreement price sheet schema](../../dataset-schema/price-sheet-mca.md)
- [Terms in your Microsoft Customer Agreement price sheet](../../manage/mca-understand-pricesheet.md)
- [View Flex Plan costs and usage in Cost Management](view-flex-plan-costs.md)
- [Reconcile Flex Plan charges and calculate savings](reconcile-flex-plan-charges.md)
- [Buy a Flex Plan](buy-flex-plan.md)
