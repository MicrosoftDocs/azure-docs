---
title: Choose an Azure saving plan commitment amount
titleSuffix: Microsoft Cost Management
description: This article helps you determine how to choose an Azure saving plan commitment amount.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.topic: how-to
ms.date: 11/17/2023
ms.author: banders
---

# Choose an Azure saving plan commitment amount

Savings plan purchase recommendations are calculated by analyzing your hourly pay-as-you-go usage and cost data. Recommendations are generated for the selected savings plan term (1- or 3-years), [benefit scope](scope-savings-plan.md) (shared, subscription  and look back period (7-, 30-, or 60-days). For each term, benefit scope and look back period combination, Azure simulates what your total costs would have been if you had a savings plan, and compares this simulated cost to the pay-as-you-go costs you actually incurred. The commitment amount that returns the greatest savings for each term, benefit scope and look back period combination is highlighted. To learn more about how recommendations are generated, see [How savings plan recommendations are generated](purchase-recommendations.md#how-savings-plan-recommendations-are-generated).

Azure doesn't currently provide savings plan recommendations for management groups. See [Recommendations for management groups](choose-commitment-amount.md#recommendations-for-management-groups) for more details

Savings plan recommendations are available [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/Cost), [Azure portal](https://portal.azure.com/) and the [Savings plan benefit recommendations API](/rest/api/cost-management/benefit-recommendations/list).

## Recommendations in Azure Advisor
Recommendations for 1- and 3-year savings plans in [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/Cost) are currently only available for subscription scopes. These recommendations currently only have a 30-day look back period.

## Recommendations in Azure portal
Recommendations for 1- and 3-year savings plans in [Azure portal](https://portal.azure.com/) are available for shared, subscription, and resource group scopes. These recommendations currently only have a 30-day look back period.

## Savings plan Recommendations API
1- and 3-year savings plan recommendations from the [Savings plan benefit recommendations API](/rest/api/cost-management/benefit-recommendations/list) are available for shared, subscription and resource group scopes. These recommendations are available for 7-, 30- and 60-day look back periods.

## Recommendations for management groups
Currently, the Azure portal doesn't provide savings plan recommendations for management groups. As a workaround, you can perform the following steps:
1. Aggregate the recommended hourly commitments for all subscriptions within the management group.
2. Purchase up to ~70% of the above value.
3. Wait at least 3 days for the newly purchased savings plan to affect your subscription recommendations.
4. Repeat steps 1-3 until you have achieved your desired coverage levels.


## Need help? Contact us

If you have Azure savings plan for compute questions, contact your account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft only provides Azure savings plan for compute expert support requests in English.

## Next steps

- [Manage Azure savings plans](manage-savings-plan.md)
- [View Azure savings plan cost and usage details](utilization-cost-reports.md)
- [Software costs not included in saving plan](software-costs-not-included.md)
