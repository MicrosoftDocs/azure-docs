---
title: Markup - Microsoft Azure operated by 21Vianet
description: This article explains how to configure markup rules for use in Microsoft Azure operated by 21Vianet.
author: bandersmsft
ms.reviewer: shrshett
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 06/28/2023
ms.author: banders
ms.custom: references_regions, subject-reliability
---

# Markup - Microsoft Azure operated by 21Vianet

Markup enables you to publish prices and costs to end customers that are inclusive of any uplift you may wish to charge for any value-added services offered. The markup feature in Microsoft Cost Management enables you to configure markup that reflected in your end customers' pricing and cost management experiences for all applicable Microsoft first party products and services. Markup doesn't apply to third party marketplace products and seat-based products.

This feature provides estimated prices and accumulated costs to your end customers so they can better anticipate their bills. As a billing partner, you're responsible for all financial transactions with the customer.

>[!IMPORTANT]
> Microsoft doesn't access or use the configured markup and associated prices for any purpose unless explicitly authorized by you

## Prerequisites

>[!IMPORTANT]
> Configuring markup is currently available only for partner use with customers on the Microsoft Customer Agreement (MCA) with Azure operated by 21Vianet.

If you're a billing account or billing profile admin, you can create and manage markup rules for the customers linked to your billing profile. Only one markup rule can be set up per customer billing profile for a defined time period. The markup rule applies to the customer billing profile only for first party Azure prices and charges. 

## Create a markup rule

1. Sign in to the Azure operated by 21Vianet portal at https://portal.azure.cn/.
1. Navigate to  **Cost Management**.
 Don't navigate to **Cost Management + Billing**.
1. Navigate to **Settings** > **Manage billing account.**
1. Select the **Markup** card.

    :::image type="content" source="./media/markup-china/manage-billing-account-markup.png" alt-text="Screenshot showing navigation to the Markup card." lightbox="./media/markup-china/manage-billing-account-markup.png" :::

1. Select **Add**.
1. On the New Markup rule page, enter or select the following information and then select **Create**.
 
    :::image type="content" source="./media/markup-china/new-markup-rule.png" alt-text="Screenshot showing the New Markup rule page." lightbox="./media/markup-china/new-markup-rule.png" :::
   
    - **Billing account**: Shows your billing account name at billing account scope.
    - **Billing profiles**: Select one or more billing profiles. Note: Only billing profiles under the current billing account that are linked to your customers are shown.
    - **Adjust price by**: Enter markup or markdown value that adjusts your (partner's) price and costs and appears in the customer's cost and price views.
    - **Effective from**: During an open month, markup always defaults to the start of the month. You can't set the date for any previous month (closed periods).
    - **End date:** An optional field. If not selected, the markup rule has no end date unless the rule is explicitly inactivated.
    - **Description**: Optional field to capture notes or comments as needed.

>[!NOTE]
> After you configure a markup rule, it can take 8-24 hours to complete processing.

## Markup examples

As a partner, you can configure a markup or a markdown percentage value. If you set the markup percentage as 0%, then customers see the same prices and costs that you do.

Here are some examples of markup application for hypothetical usage costs, purchase prices and credits.

### Markup 10%

| **Charge type** | **Partner** | **Customer** |
| --- | --- | --- |
| **Usage charges** | $1000 | $1100 |
| **Resource price** | $2.00/hour | $2.2/hour |
| **Credit balance** | $500 of $1500 remaining | $550 of $1650 remaining |

### Markup 0%

| **Charge type** | **Partner** | **Customer** |
| --- | --- | --- |
| **Usage charges** | $1000 | $1000 |
| **Resource price** | $2.00/hour | $2.00/hour |
| **Credit balance** | $500 of $1500 remaining | $500 of $1500 remaining |

### Markup -10%

| **Charge type** | **Partner** | **Customer** |
| --- | --- | --- |
| **Usage charges** | $1000 | $990 |
| **Resource price** | $2.00/hour | $1.9/hour |
| **Credit balance** | $500 of $1500 remaining | $450 of $1350 remaining |

>[!NOTE]
> Markup isn't applied to third party marketplace products and services or any seat-based products. Customers will see same costs and prices as the partner for marketplace and seat-based products.

## Markup not configured

If you choose not to publish markup, customers see all cost management and pricing experiences at _retail or pay-as-you-go prices_ and costs.

>[!NOTE]
> Credit experiences show _actual balances_ with messaging that indicates that the charges are estimated only.

## Edit markup rules

When editing markup rules, keep the following points in mind.

- Change markup % only
  - Changing the markup % on an existing rule sets the end date the current rule to the end of the previous month. The new markup % is effective from the current month start date.
    - For all prior months, the customer costs and price are shown with the old markup %.
- Change markup % and start date
  - Changing the markup % and start date sets the end date of the current rule to the new effective start date minus one day. The new markup % is effective from the new start date that you select.
   - For the period before the new effective start date, the customer costs and prices are shown with the old markup %.

## Delete markup rules

Deleting a markup rule sets the end date of the current rule to the current date. Customers see costs and prices with the old markup % for historical costs.

If no new markup rule is defined for the customer, they see retail/pay-as-you-go prices and costs after the markup rule is deleted. Markup isn't configured.

## Customer views with markup

After you configure markup rules, end customers see prices with markup and costs computed at markup prices.

Markup rule effects include:

- All Azure deployment experiences show prices with markup applied.
- All Azure first-party purchase experiences like reservations show markup prices.
- For Azure Savings plan purchases, when markup is published, the final customer committed amount is marked-down by the markup % to the invoice the partner. If markup isn't published, the customer committed amount is based on the retail or pay-as-you-go price. The partner is invoiced the same amount.
- All Cost Management experiences (Cost analysis, budgets, usage details, Exports, price sheet, and credits) show prices and costs with markup for actual and amortized costs views.
- Recommendations in Azure Advisor show prices and costs with markup.

If you don't configure or define markup rules, end customers see retail prices and costs in the experiences mentioned previously.

## Next Steps

[Use Cost analysis for common tasks](../costs/cost-analysis-common-uses.md).
