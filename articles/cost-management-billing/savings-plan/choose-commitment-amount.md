---
title: Choose an Azure saving plan commitment amount
titleSuffix: Microsoft Cost Management
description: This article helps you determine how to choose an Azure saving plan commitment amount.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 11/17/2023
ms.author: banders
---

# Choose an Azure saving plan commitment amount

You should purchase savings plans based on consistent base usage. Committing to a greater spend than your historical usage could result in an underutilized commitment, which should be avoided when possible. Unused commitment doesn't carry over from one hour to the next. Usage exceeding the savings plan commitment is charged using more expensive pay-as-you-go rates.

Software costs aren't covered by savings plans. For more information, see [Software costs not included in saving plans](software-costs-not-included.md).

## Savings plan purchase recommendations

Savings plan purchase recommendations are calculated by analyzing your hourly usage data over the last 7, 30, and 60 days. Azure simulates what your costs would have been if you had a savings plan and compares it with your actual pay-as-you-go costs incurred over the time duration. The commitment amount that maximizes your savings is recommended. To learn more about how recommendations are generated, see [How hourly commitment recommendations are generated](purchase-recommendations.md#how-hourly-commitment-recommendations-are-generated).

For example, you might incur about $500 in hourly pay-as-you-go compute charges most of the time, but sometimes usage spikes to $700. Azure determines your total costs (hourly savings plan commitment plus pay-as-you-go charges) if you had either a $500/hour or a $700/hour savings plan. Since the $700 usage is sporadic, the recommendation calculation is likely to determine that a $500 hourly commitment provides greater total savings. As a result, the $500/hour plan would be the recommended commitment.

:::image type="content" source="./media/choose-commitment-amount/savings-plan-usage-spikes.png" alt-text="Diagram showing usage spikes exceeding savings plan recommendations that would get paid for at PAYG pricing." lightbox="./media/choose-commitment-amount/savings-plan-usage-spikes.png" :::

Note the following points:

- Savings plan recommendations are calculated using the pay-as-you-go rates that apply to you.
- Recommendations are calculated using individual VM sizes, not for the instance size family.
- The recommended commitment for a scope is updated on the same day that you purchase a savings plan for the scope.
    - However, an update for the commitment amount recommendation across scopes can take up to three days. For example, if you purchase based on shared scope recommendations, the single subscription scope recommendations can take up to three days to adjust down.
- Currently, Azure doesn't generate recommendations for the management group scope.

## Recommendations in the Azure portal

The recommendations engine calculates savings plan purchases for the selected term and scope, based on last 30 days of usage. Recommendations are provided through [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/Cost), the savings plan purchase experience in [Azure portal](https://portal.azure.com/), and through the [savings plan benefit recommendations API](/rest/api/cost-management/benefit-recommendations/list).

## Recommendations for management groups

Currently, the Azure portal doesn't provide savings plan recommendations for management groups. However, you can get the details of per hour commitment of Subscriptions based recommendation from Azure portal and combine the amount based on Subscriptions grouping as part of Management group and apply the Savings Plan.


## Need help? Contact us

If you have Azure savings plan for compute questions, contact your account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft only provides Azure savings plan for compute expert support requests in English.

## Next steps

- [Manage Azure savings plans](manage-savings-plan.md)
- [View Azure savings plan cost and usage details](utilization-cost-reports.md)
- [Software costs not included in saving plan](software-costs-not-included.md)
