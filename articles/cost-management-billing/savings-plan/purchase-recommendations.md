---
title: Savings plan recommendations
titleSuffix: Microsoft Cost Management
description: Learn about how Azure makes savings plan purchase recommendations.
author: nwokolo
ms.author: onwokolo
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: concept-article
ms.date: 03/14/2026
---

# Savings plan recommendations

You can get savings plan purchase recommendations through [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/Cost), the savings plan purchase experience in the [Azure portal](https://portal.azure.com/), and the [Savings plan benefit recommendations API](/rest/api/cost-management/benefit-recommendations/list).

This article covers recommendations for both compute and database savings plans.

## How savings plan recommendations are generated

The goal of the savings plan recommendations is to help you make the most cost-effective commitment. The recommendation system generates savings plan recommendations using your actual on-demand usage and costs, including any negotiated on-demand discounts.

The recommendation system starts by looking at your hourly and total on-demand usage costs for savings plan-eligible resources over the last 7, 30, and 60 days. It determines the optimal savings plan commitment for each hour by applying the appropriate savings plan discounts to all your savings plan-eligible usage in that hour. Each of these commitments is a candidate for a savings plan recommendation. The recommendation system runs hundreds of simulations using these candidates to determine what your total cost would be if you purchased a savings plan with each candidate commitment amount.

These simulations compare each candidate's total cost with your actual total on-demand costs. The simulated total cost is calculated as (hourly commitment * 24 hours * number of days in the simulation period) + remaining on-demand charges for usage not covered by the simulated savings plan. Only candidates that result in net savings are considered for recommendations. The recommendation system presents up to 10 of the best recommendations. For each recommendation, it also calculates the percentage of your eligible usage costs that the recommended savings plan and any previously purchased reservations or savings plans would cover. The recommendations with the greatest savings for the one-year and three-year terms are highlighted. If the recommendation system doesn't present recommendations for a combination of scope and term, it couldn't calculate a savings plan commitment that would result in cost savings for that combination. This condition is most likely because there are too many hours in which most of the commitment would go unused.

Here's a video that explains how savings plan recommendations are generated.


>[!VIDEO https://www.youtube.com/embed/4HV9GT9kX6A]


To account for significant reductions in your usage, such as those caused by recently decommissioned services, the recommendation system runs additional simulations using only the last three days of usage. It presents the lower of the 3-day and 30-day commitment recommendations, even when the 30-day recommendation might appear to provide greater savings. This approach helps prevent outdated usage data from leading to a recommendation that overcommits you.

Some compute and database products can benefit from both savings plans and reservations. If you buy either a savings plan or a reservation, wait at least seven days for recommendation systems to update and reflect your purchase before considering the other option. Avoid purchasing both products at the same time to ensure recommendations are accurate and to maximize your savings.

Keep the following points in mind:

- Recommendations are refreshed several times a day.
- After you purchase a savings plan, recommendations for the purchase scope and other scopes can take up to seven days to reflect the purchase.
    - For example, if you purchase based on shared scope recommendations, the recommendations for individual subscription scopes can take up to seven days to decrease.

## Recommendations in Azure Advisor

Azure Advisor provides one-year and three-year savings plan recommendations for each billing subscription. Keep the following points in mind:

- If you want to see recommendations for shared and resource group scopes, navigate to the savings plan purchase experience in the Azure portal.
- Recommendations in Advisor currently consider only your last 30 days of usage.
- If you recently purchased a savings plan or reservation, it might take up to seven days for the purchase to affect your recommendations in Advisor and the Azure portal.

## Recommendations in the Azure portal

The Azure portal presents up to 10 savings plan commitment recommendations for each savings plan term and benefit scope. Each recommendation includes the commitment amount, the estimated savings percentage compared with your current pay-as-you-go costs, and the percentage of your eligible usage costs that the recommended savings plan and previously purchased savings plans and reservations would cover.

By default, the recommendations are for the entire billing scope (billing profile for a Microsoft Customer Agreement (MCA) and enrollment for an Enterprise Agreement (EA)). You can also view separate management group, subscription, and resource group-level recommendations by changing benefit application to one of those levels.

Currently, all savings plan recommendations in the Azure portal are based on a 30-day lookback period.

Recommendations are term-specific. To view one-year or three-year recommendations at each scope level, select the corresponding term option.

The highlighted recommendation is projected to result in the greatest savings. The other recommendations show how increasing or decreasing your commitment could affect your savings. They also show how much of your total eligible usage cost savings plans or reservation commitments would cover. If you increase the commitment amount, your savings might decline because you use a smaller percentage of your commitment each hour. If you lower the commitment, your savings could also decrease. In this case, although you use a greater percentage of your commitment, there are more hours in which your savings plan doesn't fully cover your usage. Usage beyond your hourly commitment is charged at the higher pay-as-you-go rates.


## Recommendations API

For more information about retrieving savings plan commitment recommendations, see the savings plan [Benefit Recommendations API](/rest/api/cost-management/benefit-recommendations).

## Reservation trade-in recommendations

When you [trade in](reservation-trade-in.md) one or more reservations for a savings plan, you transfer the remaining balance of your previous commitments to a new savings plan commitment. For example, if you have a one-year reservation with a value of $500 and trade it in halfway through the term, you still have an outstanding commitment of about $250. The minimum hourly commitment equals the outstanding amount divided by (24 * the new savings plan term length in days).

As part of the trade-in, the outstanding commitment is automatically included in your new savings plan. The minimum hourly commitment equals the outstanding commitment divided by the number of hours in the new savings plan term. In the previous example, the $250 amount would be converted into an hourly commitment of about $0.029 for a new one-year savings plan. If you're trading in multiple reservations, the total outstanding commitment is used. You can choose a higher hourly commitment, but you can't choose one below this minimum.

The minimum value doesn't necessarily represent the hourly commitment necessary to cover the resources that were covered by the exchanged reservation. If you want to cover those resources, you most likely need to increase the hourly commitment. To determine the appropriate hourly commitment, see [Determine savings plan commitment needed to replace your reservation](reservation-trade-in.md#determine-savings-plan-commitment-needed-to-replace-your-reservation).

## Related content

- Learn about [how the savings plan discount is applied](discount-application.md).
- Learn about how to [trade in reservations](reservation-trade-in.md) for a savings plan.
