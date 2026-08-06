---
title: Choose a savings plan commitment amount
titleSuffix: Microsoft Cost Management
description: This article helps you determine how to choose a savings plan commitment amount.
author: nwokolo
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: how-to
ms.date: 03/14/2026
ms.author: onwokolo
---

# Choose a savings plan commitment amount

To calculate savings plan purchase recommendations, Azure analyzes your hourly pay-as-you-go usage and cost data. It generates recommendations for the selected savings plan term (1- or 3-year), [benefit scope](scope-savings-plan.md) (shared, management group, subscription, and resource group), and look back period (7-, 30-, or 60-day). Azure calculates your potential savings by simulating the total costs you would have under a savings plan. It examines each combination of term, benefit scope, and look back period. It then compares these simulated costs with the actual pay-as-you-go costs you incurred. The commitment amount that returns the greatest savings for each term, benefit scope, and look back period combination is highlighted. To learn more about how recommendations are generated, see [How savings plan recommendations are generated](purchase-recommendations.md#how-savings-plan-recommendations-are-generated).

Some products can benefit from both savings plans and reservations. If you buy either a savings plan or a reservation, allow at least 7 days for recommendation systems to update and reflect your purchase before considering the other option. Avoid purchasing both products at the same time to ensure recommendations are accurate and to maximize your savings.

Savings plan recommendations are available in [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/Cost), the [Azure portal](https://portal.azure.com/), and the [Savings plan benefit recommendations API](/rest/api/cost-management/benefit-recommendations/list).

## Recommendations in Azure Advisor
Recommendations for one and three-year savings plans in [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/Cost) are currently only available for subscription scopes. These recommendations currently only have a 30-day look back period.

## Recommendations in Azure portal
Recommendations for one- and three-year savings plans in the [Azure portal](https://portal.azure.com/) are available for shared, management group, subscription, and resource group scopes. These recommendations currently only have a 30-day look back period.

## Savings plan Recommendations API
One- and three-year savings plan recommendations from the [Savings plan benefit recommendations API](/rest/api/cost-management/benefit-recommendations/list) are available for shared, management group, subscription, and resource group scopes. These recommendations are available for 7-, 30-, and 60-day look back periods.

## Need help? Contact us

If you have savings plan questions, contact your account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft only provides savings plan expert support requests in English.

## Next steps

- [Manage savings plans](manage-savings-plan.md)
- [View savings plan cost and usage details](utilization-cost-reports.md)
- [Software costs not included in savings plans](software-costs-not-included.md)
