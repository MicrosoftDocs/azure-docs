---
title: Azure savings plan recommendations
titleSuffix: Microsoft Cost Management
description: Learn about how Azure makes saving plan purchase recommendations.
author: bandersmsft
ms.author: banders
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: reservations
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 10/12/2022
---

# Azure savings plan recommendations

Azure savings plan purchase recommendations are provided through [Azure Advisor](../../advisor/advisor-reference-cost-recommendations.md#reserved-instances), and through the savings plan purchase experience in the Azure portal. The recommended commitment is calculated for the highest possible usage, and it's based on your historical usage. Your recommendation might not be for 100% utilization if you have inconsistent usage. To maximize savings with savings plans, try to purchase reservations as close to the recommendation as possible.

The following steps define how recommendations are calculated:

1. The recommendation engine evaluates the hourly usage for your resources in the given scope over the past 7, 30, and 60 days.
2. Based on the usage data, the engine simulates your costs with and without a savings plan.
3. The costs are simulated for different commitment amounts, and the commitment amount that maximizes the savings is recommended.
4. The recommendation calculations include any discounts that you might have on your on-demand usage rates.

## Purchase recommendations in the Azure portal

The savings plan purchase experience shows up to 10 commitment amounts. All recommendations are based on the last 30 days of usage. For each amount, we include the percentage (off of your current pay-as-you-go costs) that the amount could save you. The percentage of your total compute usage that would be covered with the commitment amount is also included.

By default, the recommendations are for the entire billing scope (billing account or billing profile for MCA and enrollment for EA). You can view subscription and resource group-level recommendations by restricting benefit application to one of those levels. We don't currently support management group-level recommendations.

The first recommendation value is the one that is projected to result in the highest percent savings. The other values allow you to see how increasing or decreasing your commitment could affect both your savings and compute coverage. When the commitment amount is increased, your savings could be reduced because you could end up with reduced utilization. In other words, you'd pay for an hourly commitment that isn't fully used. If you lower the commitment, your savings could also be reduced. Although you'll have increased utilization, there will likely be periods when your savings plan won't fully cover your use. Usage beyond your hourly commitment will be charged at the more expensive pay-as-you-go rates.

## Reservation trade in recommendations

When you trade one or more reservations for a savings plan, you're shifting the balance of your previous commitments to a new savings plan commitment. For example, if you have a one year reservation with a value of $500, and half way through the term you look to trade it for a savings plan, you would still have an outstanding commitment of about $250. 

The minimum hourly commitment must be at least equal to the outstanding amount divided by (24 times the term length in days).

As part of the trade in, the outstanding commitment is automatically included in your new savings plan. We do it by dividing the outstanding commitment by the number of hours in the term of the new savings plan. For example, 24 \* term length in days. And by making the value the minimum hourly commitment you can make during as part of the trade-in. Using the previous example, the $250 amount would be converted into an hourly commitment of ~ $0.029 for a new one year savings plan. 

If you're trading multiple reservations, the aggregate outstanding commitment is used. You may choose to increase the value, but you can't decrease it. The new savings plan will be used to cover usage of eligible resources.

The minimum value doesn't necessarily represent the hourly commitment necessary to cover the resources that were covered by the exchanged reservation. If you want to cover those resources, you'll most likely have to increase the hourly commitment. To determine the appropriate hourly commitment:

1. Download your price list.
2. For each reservation order you're returning, find the product in the price sheet and determine its unit price under either a 1-year or 3-year savings plan (filter by term and price type).
3. Multiple the rate by the number of instances that are being returned.
4. Repeat for each reservation order to be returned.
5. Sum the values and enter it as the hourly commitment.

## Recommendations in Azure Advisor

When appropriate, a savings plan purchase recommendation can also be found in Azure Advisor. Keep in mind the following points:

- The savings plan recommendations are for a single-subscription scope. If you want to see recommendations for the entire billing scope (billing account or billing profile), then:
    - In the Azure portal, navigate to Savings plans > **Add** and then select the type that you want to see the recommendations for.
- Recommendations available in Advisor consider your past 30-day usage trend.
- The recommendation is for a three-year savings plan.
- The recommendation calculations include any special discounts that you might have on your on-demand usage rates.
- If you recently purchased a savings plan, Advisor reservation purchase and Azure saving plan recommendations can take up to five days to disappear.

## Next steps

- Learn about [How the Azure savings plan discount is applied](discount-application.md).
- Learn about how to [trade in reservations](reservation-trade-in.md) for a savings plan.
