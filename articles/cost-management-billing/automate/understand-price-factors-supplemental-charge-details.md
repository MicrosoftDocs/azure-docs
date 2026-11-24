---
title: Understand price factors and supplemental charge details
titleSuffix: Microsoft Cost Management
description: Learn how to read the priceFactors and supplementalChargeDetails columns in cost and usage details and price sheet data, including Flex Plan prices and Flex Plan and Spot Plus charges.
author: Britt-Henderson
ms.author: britth
ms.reviewer: vikdesai
ms.service: cost-management-billing
ms.subservice: cost-management
ms.topic: concept-article
ms.date: 11/23/2026
---

# Understand price factors and supplemental charge details

Cost and usage details and price sheet data include a `priceFactors` column. Cost and usage details also include a `supplementalChargeDetails` column. Use these columns to see how a charge or price was set, for example, whether a contracted price, a savings plan, a Flex Plan, or a Spot Plus discount applied.

## Where the columns appear

| Dataset | Agreement types | Columns added in version 2026-10-01 |
| --- | --- | --- |
| Cost and usage details | EA, MCA, MPA, CSP | `priceFactors`, `supplementalChargeDetails` |
| Price sheet | EA, MCA | `priceFactors` |

How you get the columns depends on how you get your data:

- **Exports**: The columns are available in dataset version 2026-10-01. Older dataset versions don't include them. To get the columns, create or update an export and select dataset version 2026-10-01. For more information, see [Create and manage exports](../costs/tutorial-improved-exports.md).
- **Downloads**: Usage files and price sheets that you download from the Azure portal, or by using the download APIs, don't use dataset version 2026-10-01. Their version doesn't change. Instead, the new columns are added at the end of the file.

Flex Plan is available for Microsoft Customer Agreement (MCA) and Microsoft Partner Agreement (MPA) billing accounts. Enterprise Agreement (EA) data doesn't include Flex Plan prices, charges, or factors.

## Understand `priceFactors`

The `priceFactors` column is a JSON array that describes how the price you were charged or quoted was set, such as the best price available to you or a benefit that applied. In the price sheet, the column describes the benefits that are associated with a price, such as a savings plan or a Flex Plan. It's empty when none apply. In cost and usage details, a usage charge can have one or more factors. The column can be empty, for example, when the market price applies with no adjustment.

Each item in the array is a group that contains a `Factors` array. Each factor has these properties:

| Property | Description |
| --- | --- |
| `Type` | The kind of adjustment, such as `SavingsPlan`, `FlexPlan`, or `DynamicPrice`. Compare values without regard to case. |
| `Extensions` | Details for that type of adjustment, such as the `ProductCode` of the benefit or offer. The properties depend on the type. |

A factor can appear as a JSON object or as a JSON string that contains the object. Before you read a factor's properties, check whether it's a string, and if it is, parse it as JSON.

The following example shows a Flex Plan price in the price sheet, where the factor is a JSON object:

```json
[
  {
    "Factors": [
      {
        "Type": "FlexPlan",
        "Extensions": {
          "ProductCode": "<product-code>"
        }
      }
    ]
  }
]
```

The following example shows usage that a Flex Plan covered in cost and usage details, where the factor is a JSON string:

```json
[
  {
    "Factors": [
      "{\"Type\":\"FlexPlan\",\"Extensions\":{\"ProductCode\":\"<product-code>\",\"BenefitId\":\"<benefit-id>\",\"BenefitOrderId\":\"<benefit-order-id>\"}}"
    ]
  }
]
```

### How factors combine

In cost and usage details, groups and factors show how adjustments were applied to the market price:

- Factors in the same group apply together. Their discounts add together.
- Groups apply in order. Each group applies to the price that results from the previous group.

In the price sheet, all factors for a price are in the first group. The grouping and order of factors don't show how the factors combine or the order in which they apply. Use each factor's `Type` and `Extensions` to understand it.

### Factor types

| Type | Meaning | Appears in | Extensions |
| --- | --- | --- | --- |
| `BestOfPrice` | Your contracted price, or the best of the prices available to you that don't come from a benefit, was used. `PriceType` names the price that was used, such as `EffectivePrice` or `MarketPrice`. | Cost and usage details | `PriceType` |
| `SavingsPlan` | A savings plan commitment applies. | Cost and usage details, price sheet | Cost and usage details: `ProductCode`, `BenefitId`, `BenefitOrderId`. Price sheet: `ProductCode`. |
| `FlexPlan` | A Flex Plan commitment applies. Appears only for MCA and MPA. | Cost and usage details, price sheet | Cost and usage details: `ProductCode`, `BenefitId`, `BenefitOrderId`. Price sheet: `ProductCode`. |
| `AzurePromotion` | A consumption promotion applies. | Price sheet | `ProductCode` |
| `Credit` | A sponsorship credit applies. | Cost and usage details | `ProductCode`, `BenefitId`, `BenefitOrderId`, `PriceType` |
| `DynamicPrice` | A price adjustment applies to the usage, such as a Spot Plus discount. | Cost and usage details | `SubType`, `ValueType`, `Value` |

In cost and usage details, `BenefitId` and `BenefitOrderId` identify the savings plan, Flex Plan, promotion, or credit that applied to the usage. In the price sheet, `SavingsPlan`, `FlexPlan`, and `AzurePromotion` factors include only `ProductCode`, because a price isn't tied to a specific purchase. The `Extensions` properties that appear depend on the factor type, and a property can be missing or `null`. Check for a property before you use it.

For a `DynamicPrice` factor, `SubType` identifies the program, such as `SpotPlus`. `ValueType` describes how to read `Value`. For example, when `ValueType` is `DiscountPercentage`, a `Value` of `0.15` means a 15% discount. To see which price the discount applies to, check `priceTarget` in the matching price modifier in `supplementalChargeDetails`.

Other factor types and subtypes can appear. Design reports and scripts to handle values they don't recognize.

## Understand `supplementalChargeDetails`

The `supplementalChargeDetails` column contains a JSON object, stored as text, with supplemental pricing details for a charge. It's empty when no supplemental details apply, such as for a typical on-demand charge. This column appears only in cost and usage details, not in the price sheet. When the column has a value, it contains one of the following:

| When | What the column contains |
| --- | --- |
| A price modifier applies to the charge, such as a Spot Plus discount | An `ExternalizedPrice` object with a `priceModifiers` array. Each modifier has an `id`, `value`, `modifier`, and `priceTarget`. The `id` matches the `SubType` of the `DynamicPrice` factor in `priceFactors`. `modifier` describes the kind of adjustment, such as `discount`. Compare it without regard to case. `priceTarget` names the price that the modifier applies to, such as `RetailPrice`. |
| A cost or quantity cap was applied to the charge | `{"CapApplied": true}` |

The following example shows a Spot Plus discount of 15% that applies to the retail price:

```json
{
  "ExternalizedPrice": {
    "priceModifiers": [
      {
        "id": "SpotPlus",
        "value": 0.15,
        "modifier": "discount",
        "priceTarget": "RetailPrice"
      }
    ]
  }
}
```
## Uses for `priceFactors` and `supplementalChargeDetails`

 The `priceFactors` and `supplementalChargeDetails` fields are useful for identifying prices and charges that are associated with benefits such as Flex Plan and Spot Plus.

## Identify Flex Plan charges

| To find | Look for |
| --- | --- |
| A Flex Plan purchase | `chargeType` is `Purchase` and `pricingModel` is `FlexPlan`. |
| Usage that a Flex Plan covered | `chargeType` is `Usage` and `pricingModel` is `FlexPlan`. `priceFactors` has a `FlexPlan` factor. |
| The Flex Plan that covered the usage | `benefitId`. To see the plan's commitment, term, and remaining balance, open the plan in the Azure portal. For more information, see [Manage a Flex Plan](../benefits/flex-plan/manage-flex-plan.md#open-a-flex-plan). |

To identify the Flex Plan that covered usage, use `benefitId`. The `ProductCode` in a `FlexPlan` factor identifies the Flex Plan offer, not the plan that you bought. Looking up a product code, as described in [Identify Flex Plan prices in the price sheet](#identify-flex-plan-prices-in-the-price-sheet), applies only to the price sheet.

In actual cost, a Flex Plan purchase shows its cost, and usage that the plan covers shows zero cost. Amortized cost doesn't include the purchase. Instead, usage that the plan covers shows the amount drawn from the plan, so you can allocate it to the subscriptions, resource groups, and resources that used the plan.

`pricingModel` isn't limited to dataset version 2026-10-01, so you can identify Flex Plan charges in earlier dataset versions too. In exports, you need version 2026-10-01 only for `priceFactors` and `supplementalChargeDetails`.

## Identify Flex Plan prices in the price sheet

Flex Plan prices appear as separate rows for each meter that a Flex Plan offer covers. Compared with the consumption row for the same meter, a Flex Plan row has:

- `priceType` set to `FlexPlan`.
- `term` set to the term of the Flex Plan offer, such as `P1M` or `P1Y`.
- `priceFactors` with the product code of the Flex Plan offer.

If more than one Flex Plan offer covers a meter, the price sheet has a row for each offer. The rows can have the same price and term and differ only in the product code.

To see details about an offer in the price sheet, such as its terms and its minimum and maximum commitment amounts, look up its product code. For more information, see [Discover available offers and prices](../benefits/flex-plan/automate-flex-plan.md#discover-available-offers-and-prices).

## Identify Spot Plus charges

[Spot Plus](/azure/virtual-machines/spot-plus-public-preview-azure-compute-technical) is a tier of Azure Spot Virtual Machines. In cost and usage details, look for these values:

| To find | Look for |
| --- | --- |
| Spot Plus usage and its discount | A `priceFactors` factor with `Type` set to `DynamicPrice` and `Extensions.SubType` set to `SpotPlus`. When `Extensions.ValueType` is `DiscountPercentage`, `Extensions.Value` is the discount. |
| The Spot Plus price modifier | A `supplementalChargeDetails` price modifier with `id` set to `SpotPlus`. |

The following example shows a Spot Plus discount of 15% in `priceFactors`:

```json
[
  {
    "Factors": [
      "{\"Type\":\"DynamicPrice\",\"Extensions\":{\"SubType\":\"SpotPlus\",\"ValueType\":\"DiscountPercentage\",\"Value\":0.15}}"
    ]
  }
]
```

## Related content

- [Microsoft Customer Agreement cost and usage details file schema](../dataset-schema/cost-usage-details-mca.md)
- [Microsoft Customer Agreement price sheet schema](../dataset-schema/price-sheet-mca.md)
- [Understand cost details fields](understand-usage-details-fields.md)
- [Create and manage exports](../costs/tutorial-improved-exports.md)
- [Manage a Flex Plan](../benefits/flex-plan/manage-flex-plan.md)
