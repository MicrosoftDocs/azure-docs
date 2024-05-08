---
title: Azure savings plan recommendations
titleSuffix: Microsoft Cost Management
description: Learn about how Azure makes saving plan purchase recommendations.
author: bandersmsft
ms.author: banders
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: conceptual
ms.date: 04/15/2024
---

# Azure savings plan recommendations

Azure savings plan purchase recommendations are provided through [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/Cost), the savings plan purchase experience in [Azure portal](https://portal.azure.com/), and through the [Savings plan benefit recommendations API](/rest/api/cost-management/benefit-recommendations/list).

## How savings plan recommendations are generated

The goal of our savings plan recommendation is to help you make the most cost-effective commitment. Saving plan recommendations are generated using your actual on-demand usage and costs (including any negotiated on-demand discounts).

We start by looking at your hourly and total on-demand usage costs incurred from savings plan-eligible resources in the last 7, 30, and 60 days. We determine what the optimal savings plan commitment would be for each of these hours - we apply the appropriate savings plan discounts to all your savings plan-eligible usage in each hour. We consider each one of these commitments a candidate for a savings plan recommendation. We then run hundreds of simulations using each of these candidates to determine what your total cost would be if you purchased a savings plan equal to the candidate.

Here's a video that explains how savings plan recommendations are generated.

>[!VIDEO https://www.youtube.com/embed/4HV9GT9kX6A]

The goal of these simulations is to compare each candidate's total cost ((hourly commitment * 24 hours * # of days in simulation period) + total on-demand cost incurred during the simulation period) to the actual total on-demand costs. Only candidates that result in net savings are eligible for consideration as actual recommendations. We take up to 10 of the best recommendations and present them to you. For each recommendation, we also calculate the percentage of your compute usage costs are now covered by this savings plan, and any other previously purchased reservations or savings plan. The recommendations with the greatest savings for one year and three years are the highlighted options.

To account for scenarios where there were significant reductions in your usage, including recently decommissioned services, we run more simulations using only the last three days of usage. The lower recommendation (between the three day and 30-day recommendations) is shared, even in situations where the 30-day recommendation might appear to provide greater savings. It gets done to ensure that we don't inadvertently recommend overcommitment based on stale data.

Keep the following points in mind:

- Recommendations are refreshed several times a day.
- The savings plan recommendation for a specific scope is reduced on the same day that you purchase a savings plan for that scope. However, updates to recommendations for other scopes can take up to 25 days.
    - For example, if you purchase based on shared scope recommendations, the single subscription scope recommendations can take up to 25 days to adjust down.

## Recommendations in Azure Advisor

When available, a savings plan purchase recommendation can also be found in Azure Advisor. While we might generate up to 10 recommendations, Azure Advisor only surfaces the single three-year recommendation with the greatest savings for each billing subscription. Keep the following points in mind:

- If you want to see recommendations for a one-year term or for other scopes, navigate to the savings plan purchase experience in Azure portal. For example, enrollment account, billing profile, resource groups, and so on. For more information, see [Permissions to buy an Azure savings plan](permission-buy-savings-plan.md).
- Recommendations in Advisor currently only consider your last 30 days of usage.
- Recommendations in Advisor are only for three-year savings plans.
- If you recently purchased a savings plan or reserved instance, it can take up to five days for the purchases to affect your recommendations in Advisor and Azure portal.

## Purchase recommendations in the Azure portal

When available, up to 10 savings plan commitment recommendations can be found in the savings plan purchase experience in Azure portal. For more information, see [Permissions to buy an Azure savings plan](permission-buy-savings-plan.md). Each recommendation includes the commitment amount, the estimated savings percentage (off your current pay-as-you-go costs), and the percentage of your compute usage costs that would get covered by this and any other previously purchased savings plans and reservations.

By default, the recommendations are for the entire billing scope (billing profile for MCA and enrollment account for EA). You can also view separate subscription and resource group-level recommendations by changing benefit application to one of those levels. We don't currently support management group-level recommendations.

Recommendations are term-specific, so you see the one-year or three-year recommendations at each level by toggling the term options.

The highlighted recommendation is projected to result in the greatest savings. The other values allow you to see how increasing or decreasing your commitment could affect both your savings. They also show how much of your total compute usage cost would get covered by savings plans or reservation commitments. When the commitment amount is increased, your savings might decline because you have lower utilization each hour. If you lower the commitment, your savings could also be reduced. In this case, although you have greater utilization, there are more hours where your savings plan doesn't fully cover your usage. Usage beyond your hourly commitment is charged at the more expensive pay-as-you-go rates.

## Purchase recommendations with REST API

For more information about retrieving savings plan commitment recommendations, see the saving plan [Benefit Recommendations API](/rest/api/cost-management/benefit-recommendations).

## Reservation trade in recommendations

When you trade one or more reservations for a savings plan, you're shifting the balance of your previous commitments to a new savings plan commitment. For example, if you have a one-year reservation with a value of $500, and halfway through the term you look to trade it for a savings plan, you will still have an outstanding commitment of about $250. The minimum hourly commitment must be at least equal to the outstanding amount divided by (24 * the term length in days).

As part of the trade in, the outstanding commitment is automatically included in your new savings plan. We do it by dividing the outstanding commitment by the number of hours in the term of the new savings plan. For example, 24 times the term length in days. And by making the value the minimum hourly commitment you can make during as part of the trade-in. Using the previous example, the $250 amount would be converted into an hourly commitment of about $0.029 for a new one-year savings plan. If you're trading multiple reservations, the total outstanding commitment is used. You can choose to increase the value, but you can't decrease it.

The minimum value doesn't necessarily represent the hourly commitment necessary to cover the resources that were covered by the exchanged reservation. If you want to cover those resources, you most likely need to increase the hourly commitment. To determine the appropriate hourly commitment, see [Determine savings plan commitment needed to replace your reservation](reservation-trade-in.md#determine-savings-plan-commitment-needed-to-replace-your-reservation).

## Next steps

- Learn about [how the Azure savings plan discount is applied](discount-application.md).
- Learn about how to [trade in reservations](reservation-trade-in.md) for a savings plan.
