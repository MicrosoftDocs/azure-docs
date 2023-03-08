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
ms.date: 02/03/2023
ms.author: banders
---

# Choose an Azure saving plan commitment amount

You should purchase savings plans based on consistent base usage. Committing to a greater spend than your historical usage could result in an underutilized commitment, which should be avoided when possible. Unused commitment doesn't carry over from one hour to the next. Usage exceeding the savings plan commitment is charged using more expensive pay-as-you-go rates.

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

Savings plan purchases are calculated by the recommendations engine for the selected term and scope, based on last 30 days of usage. Recommendations are provided through [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/Cost), the savings plan purchase experience in [Azure portal](https://portal.azure.com/), and through the [savings plan benefit recommendations API](/rest/api/cost-management/benefit-recommendations/list).

## Savings plan purchase recommendations for customers using Management groups
Currently Azure portal doesn't provide Savings plan recommendations for Management groups, but customers can calculate their own per-hour commitment for Management groups by using the following steps until Azure portal provides Management group-level recommendations.
1. Download Usage Detail report from EA portal or Azure portal to get the accurate usage and cost.
    - From EA portal - By logging into ea.azure.com, navigating to Reports section, and downloading Usage Details report for the current month and the past 2 months.
    - From Azure portal - By logging into Azure portal and searching for cost management and billing. Under Billing, click on Usage + charges and click on download against the month to download current and past 2 months.
1. Open the downloaded file in Excel. If the file size is huge open it in Power BI.
1. Create cost column by multiplying PayG Price * Quantity (i.e. calculated cost).
1. Filter Charge Type = "Usage".
1. Filter Meter Category = "Virtual Machines", "App Service", "Functions", "Container Instance" - As the SP is applied on only these services.
1. Filter ProductOrderName = Blank 
1. Filter Quantity >= 23 to consider only items which ran 24 hours as SP is per hour commitment, and we have the granularity of per day and not per hour. This will avoid any sparse compute.
1. Filter Months for current and previous 2 months. 
1. If you are doing this in Power BI export the data to .csv file and copy into Excel. 
1. Now copy the subscription names that belong to the management group on which you want to apply Savings plan on in Excel sheet.
1. Do a Vlookup against the internal subscriptions against the filter data. 
1. Divide calculated cost with 24 hours to get per hour cost.
1. Create pivot to group the data by subscription by month and day, and copy this pivot data into new sheet.
1. Multiply per hour cost with .4. Reason for this is you will get a discount on the usage. For example, you have committed 100 rupees you will be charged based on 1 or 3 year Savings plan discount applicable for SKU hence your cost per hour will be less than 100 hours and hence you will be needing more cost of compute to get the value of 100. 40% is the safe limit. 
1. Now see the range of cost per hour per day and per month to get view of the sage commitment you can make.

## Need help? Contact us

If you have Azure savings plan for compute questions, contact your account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft will only provide Azure savings plan for compute expert support requests in English.

## Next steps

- [Manage Azure savings plans](manage-savings-plan.md)
- [View Azure savings plan cost and usage details](utilization-cost-reports.md)
- [Software costs not included in saving plan](software-costs-not-included.md)
