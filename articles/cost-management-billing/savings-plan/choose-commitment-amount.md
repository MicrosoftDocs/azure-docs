---
title: Choose an Azure saving plan commitment amount
titleSuffix: Microsoft Cost Management
description: This article helps you determine how to choose an Azure saving plan commitment amount.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: reservations
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 10/12/2022
ms.author: banders
---

# Choose an Azure saving plan commitment amount

You should purchase savings plans based on consistent base usage. Committing to a greater spend than your historical usage could result in an underutilized commitment, which should be avoided when possible. Unused commitment doesn't carry over from one hour to next. Usage exceeding the savings plan commitment is charged using more expensive pay-as-you-go rates.

## Savings plan purchase recommendations

Savings plan purchase recommendations are calculated by analyzing your hourly usage data over the last 7, 30, and 60 days. Azure calculates what your costs would have been if you had a savings plan and compares it with your actual pay-as-you-go costs incurred over the time duration. The calculation is performed for every quantity that you used during the time frame. The commitment amount that maximizes your savings is recommended.

For example, you might use 500 VMs most of the time, but sometimes usage spikes to 700 VMs. In this example, Azure calculates your savings for both the 500 and 700 VM quantities. Since the 700 VM usage is sporadic, the recommendation calculation determines that savings are maximized for a savings plan commitment that is sufficient to cover 500 VMs and the recommendation is provided for that commitment.

Note the following points:

- Savings plan recommendations are calculated using the on-demand usage rates that apply to you.
- Recommendations are calculated using individual sizes, not for the instance size family.
- The recommended commitment for a scope is reduced on the same day that you purchase a commitment for the scope.
  - However, an update for the commitment amount recommendation across scopes can take up to 25 days. For example, if you purchase based on shared scope recommendations, the single subscription scope recommendations can take up to 25 days to adjust down.
- Currently, Azure doesn't generate recommendations for the management group scope.

## Recommendations in the Azure portal

Savings plan purchases are calculated by the recommendations engine for the selected term and scope, based on last 30-days of usage. Recommendations are shown in the savings plan purchase experience in the Azure portal.

## Need help? Contact us.

If you have Azure savings plan for compute questions, contact your  account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft will only provide Azure savings plan for compute expert support requests in English.

## Next steps

- [Manage Azure savings plans](manage-savings-plan.md)
- [View Azure savings plan cost and usage details](utilization-cost-reports.md)
- [Software costs not included in saving plan](software-costs-not-included.md)
