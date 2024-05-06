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

Savings plan purchase recommendations are calculated by analyzing your hourly usage data over the last 7, 30, and 60 days. Azure simulates what your costs would have been if you had a savings plan and compares it with your actual pay-as-you-go costs incurred over the time duration. The commitment amount that returns the greatest savings is recommended. Recommendations are generated for the selected term and benefit scope. To learn more about how recommendations are generated, see [How savings plan recommendations are generated](purchase-recommendations.md#how-savings-plan-recommendations-are-generated).

Currently, savings plan recommendations in [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/Cost), and within the savings plan purchase experience in [Azure portal](https://portal.azure.com/), are solely based on the last 30 days of usage. Savings plan recommendations from the [savings plan benefit recommendations API](/rest/api/cost-management/benefit-recommendations/list) are available for 7, 30 and 60 day look back periods.

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
