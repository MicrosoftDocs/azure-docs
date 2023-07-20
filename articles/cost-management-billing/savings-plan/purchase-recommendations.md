---
title: Azure savings plan recommendations
titleSuffix: Microsoft Cost Management
description: Learn about how Azure makes saving plan purchase recommendations.
author: bandersmsft
ms.author: banders
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 04/18/2023
---

# Azure savings plan recommendations

Azure savings plan purchase recommendations are provided through [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/Cost), the savings plan purchase experience in [Azure portal](https://portal.azure.com/), and through the [Savings plan benefit recommendations API](/rest/api/cost-management/benefit-recommendations/list).

## How hourly commitment recommendations are generated

The goal of our savings plan recommendation is to help you make the most cost-effective commitment. Calculations are based on your actual on-demand costs, and don't include usage covered by existing reservations or savings plans.

We start by looking at your hourly and total on-demand usage costs incurred from savings plan-eligible resources in the last 7, 30, and 60 days. These costs are inclusive of any negotiated discounts that you have. We then run hundreds of simulations of what your total cost would have been if you had purchased either a one or three-year savings plan with an hourly commitment equivalent to your hourly costs.

As we simulate each candidate recommendation, some hours will result in savings. For example, when savings plan-discounted usage plus the hourly commitment less than that hour’s historic on-demand charge. In other hours, no savings would be realized. For example, when discounted usage plus  the hourly commitment is greater than or greater than on-demand charges. We sum up the simulated hourly charges for each candidate and compare it to your actual total on-demand charge. Only candidates that result in savings are eligible for consideration as recommendations. We also calculate the percentage of your compute usage costs that would be covered by the recommendation, plus any other previously purchased reservations or savings plan.

Finally, we present a differentiated set of one-year and three-year recommendations (currently up to 10 each). The recommendations provide the greatest savings across different compute coverage levels. The recommendations with the greatest savings for one year and three years are the highlighted options.

To account for scenarios where there were significant reductions in your usage, including recently decommissioned services, we run more simulations using only the last three days of usage. The lower of the three day and 30-day recommendations are highlighted, even in situations where the 30-day recommendation may appear to provide greater savings. The lower recommendation is to ensure that we don't encourage overcommitment based on stale data.

Note the following points:

- Recommendations are refreshed several times a day.
- The recommended quantity for a scope is reduced on the same day that you purchase a savings plan for the scope. However, an update for the savings plan recommendation across scopes can take up to 25 days.
    - For example, if you purchase based on shared scope recommendations, the single subscription scope recommendations can take up to 25 days to adjust down.

## Recommendations in Azure Advisor

When available, a savings plan purchase recommendation can also be found in Azure Advisor. While we may generate up to 10 recommendations, Azure Advisor only surfaces the single three-year recommendation with the greatest savings for each billing subscription. Keep the following points in mind:

- If you want to see recommendations for a one-year term or for other scopes, navigate to the savings plan purchase experience in Azure portal. For example,  enrollment account, billing profile, resource groups, and so on. For more information, see [Who can buy a savings plan](buy-savings-plan.md#who-can-buy-a-savings-plan).
- Recommendations available in Advisor currently only consider your last 30 days of usage.
- Recommendations are for three-year savings plans.
- If you recently purchased a savings plan, Advisor reservation purchase and Azure saving plan recommendations can take up to five days to disappear.

## Purchase recommendations in the Azure portal

When available, up to 10 savings plan commitment recommendations can be found in the savings plan purchase experience in Azure portal. For more information, see [Who can buy a savings plan](buy-savings-plan.md#who-can-buy-a-savings-plan). Each recommendation includes the commitment amount, the estimated savings percentage (off your current pay-as-you-go costs) and the percentage of your compute usage costs that would be covered by this and any other previously purchased savings plans and reservations.

By default, the recommendations are for the entire billing scope (billing account or billing profile for MCA and billing account for EA). You can also view separate subscription and resource group-level recommendations by changing benefit application to one of those levels.

Recommendations are term-specific, so you'll see the one-year or three-year recommendations at each level by toggling the term options. We don't currently support management group-level recommendations.

The highlighted recommendation is projected to result in the greatest savings. The other values allow you to see how increasing or decreasing your commitment could affect both your savings. They also show how much of your total compute usage cost would be covered by savings plans or reservation commitments. When the commitment amount is increased, your savings could be reduced because you may end up with lower utilization each hour. If you lower the commitment, your savings could also be reduced. In this case, although you'll likely have greater utilization each hour, there will likely be other hours where your savings plan won't fully cover your usage. Usage beyond your hourly commitment is charged at the more expensive pay-as-you-go rates.

## Purchase recommendations with REST API

For more information about retrieving savings plan commitment recommendations, see the saving plan [Benefit Recommendations API](/rest/api/cost-management/benefit-recommendations).

## Reservation trade in recommendations

When you trade one or more reservations for a savings plan, you're shifting the balance of your previous commitments to a new savings plan commitment. For example, if you have a one-year reservation with a value of $500, and halfway through the term you look to trade it for a savings plan, you would still have an outstanding commitment of about $250.

The minimum hourly commitment must be at least equal to the outstanding amount divided by (24 times the term length in days).

As part of the trade in, the outstanding commitment is automatically included in your new savings plan. We do it by dividing the outstanding commitment by the number of hours in the term of the new savings plan. For example, 24 times the term length in days. And by making the value the minimum hourly commitment you can make during as part of the trade-in. Using the previous example, the $250 amount would be converted into an hourly commitment of about $0.029 for a new one-year savings plan.

If you're trading multiple reservations, the aggregate outstanding commitment is used. You may choose to increase the value, but you can't decrease it. The new savings plan is used to cover usage of eligible resources.

The minimum value doesn't necessarily represent the hourly commitment necessary to cover the resources that were covered by the exchanged reservation. If you want to cover those resources, you'll most likely have to increase the hourly commitment. To determine the appropriate hourly commitment:

1.	Download your price list.
2.	For each reservation order you're returning, find the product in the price sheet and determine its unit price under either a one-year or three-year savings plan (filter by term and price type).
3.	Multiply unit price by the number of instances that are being returned. The result gives you the total hourly commitment required to cover the product with your savings plan.
4.	Repeat for each reservation order to be returned.
5.	Sum the values and enter the total as the hourly commitment.

## Next steps

- Learn about [how the Azure savings plan discount is applied](discount-application.md).
- Learn about how to [trade in reservations](reservation-trade-in.md) for a savings plan.
