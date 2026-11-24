---
title: Reconcile Flex Plan charges and calculate savings
titleSuffix: Microsoft Cost Management
description: Learn how to check that usage covered by a Flex Plan is charged at the price in your price sheet, and how to calculate what you saved compared with on-demand prices.
author: Britt-Henderson
ms.author: britth
ms.reviewer: vikdesai
ms.service: cost-management-billing
ms.subservice: cost-management
ms.topic: how-to
ms.date: 11/23/2026
---

# Reconcile Flex Plan charges and calculate savings

Use your cost and usage details and your price sheet to check that usage covered by a Flex Plan is charged at the right price, and to calculate how much you saved compared with on-demand prices.

## Prerequisites

- Amortized cost and usage details that include the `priceFactors` column. Export them with dataset version 2026-10-01, or download a usage file, which includes the column at the end of the file. For more information, see [View Flex Plan costs and usage in Cost Management](view-flex-plan-costs.md#export-flex-plan-cost-and-usage-data).
- A price sheet that includes the `priceFactors` column. Export it with dataset version 2026-10-01, or download it. For more information, see [Review Flex Plan prices in your price sheet](review-flex-plan-prices.md#get-your-price-sheet).

## Check that you're charged your Flex Plan price

1. In the cost and usage details, find a row where `pricingModel` is `FlexPlan` and `chargeType` is `Usage`. Note its `meterId`, `effectivePrice`, and the `ProductCode` of the `FlexPlan` factor in `priceFactors`.
1. In the price sheet, find the rows with the same `meterId` where `priceType` is `FlexPlan`.
1. Select the row whose `priceFactors` has the same `ProductCode`.
1. Compare the `effectivePrice` from the cost and usage details with the `unitPrice` from the price sheet.

To identify the Flex Plan that covered the usage, use `benefitId` in the cost and usage details, and then open the plan in the Azure portal. For more information, see [Manage a Flex Plan](manage-flex-plan.md).

## Calculate your savings

Savings depend on the currency of the cost columns that you use. Savings that you calculate in your billing currency can differ from savings that you calculate in another currency, such as your pricing currency. Use cost columns in the same currency for both parts of the calculation.

The following example calculates savings in your billing currency. Your amortized cost and usage details include the cost of each usage row at your Flex Plan price and at the market price, so you don't need to multiply prices by quantities. For each usage row that a Flex Plan covered:

*Savings in billing currency = `paygCostInBillingCurrency` − `costInBillingCurrency`*

1. In the amortized cost and usage details, keep the rows where `pricingModel` is `FlexPlan` and `chargeType` is `Usage`.
1. For each row, subtract `costInBillingCurrency`, the cost at your Flex Plan price, from `paygCostInBillingCurrency`, the cost at the market price.
1. Add up the results by month, product, or Flex Plan.

In this example, `paygCostInBillingCurrency` is based on the market price (`PayGPrice`), not your contracted price. To calculate savings in US dollars instead, use `paygCostInUsd` and `costInUsd`.

Cost Management doesn't show Flex Plan savings in cost analysis, so calculate them from your exported or downloaded data.

## Reconcile with your invoice

Your invoice shows the Flex Plan commitment that you pay for, not the usage that the plan covers. To reconcile the commitment with your invoice, use actual cost. For more information, see [Understand your Flex Plan bill](flex-plan-billing.md).

## Related content

- [View Flex Plan costs and usage in Cost Management](view-flex-plan-costs.md)
- [Review Flex Plan prices in your price sheet](review-flex-plan-prices.md)
- [Microsoft Customer Agreement cost and usage details file schema](../../dataset-schema/cost-usage-details-mca.md)
