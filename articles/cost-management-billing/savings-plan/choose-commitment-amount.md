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

The recommendations engine calculates savings plan purchases for the selected term and scope, based on last 30 days of usage. Recommendations are provided through [Azure Advisor](https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/Cost), the savings plan purchase experience in [Azure portal](https://portal.azure.com/), and through the [savings plan benefit recommendations API](/rest/api/cost-management/benefit-recommendations/list).

## Recommendations for management groups

Currently, the Azure portal doesn't provide savings plan recommendations for management groups. However, you can manually calculate your own per-hour commitment for management groups using the following steps.

1. Download the Usage Detail report from the EA portal or Azure portal to get your usage and cost.
    - EA portal - Sign in to ea.azure.com, navigate to the Reports section, and then download the Usage Details report for the current and previous two months.
    - Azure portal - Sign in to the Azure portal and navigate to Cost Management + Billing. Under Billing, select **Usage + charges** and then download for the current and previous two months.
1. Open the downloaded file in Excel. Or, if the file size is too large to open in Excel, you can use Power BI Desktop.
1. Create the `cost` column by multiplying `PayG Price` * `Quantity` to create `CalculatedCost`.
1. Filter `Charge Type` = `Usage`.
1. Filter `Meter Category` = `Virtual Machines`, `App Service`, `Functions`, `Container Instance` because the savings plan applies to only those services.
1. Filter `ProductOrderName` = `Blank`.
1. Filter `Quantity` >= `23` to consider only items used for 24 hours because a savings plan is per hour commitment, and we have the granularity of per day, not per hour. This step avoids sparse compute records.
1. Filter `Months` for the current and previous two months.
1. If you're using Power BI, export the data to a CSV file and open it in Excel.
1. Copy the subscription names that belong to the management group where you want to apply a savings plan to an Excel sheet.
1. In Excel, use the `Vlookup` function for the subscriptions against the filtered data.
1. Divide `CalculatedCost` by `24` hours to get `PerHour` cost.
1. Create a PivotTable to group the data by subscription and by month and day, and then copy the PivotTable data to a new sheet.
1. Multiply the `PerHour` cost by `0.4`.  
    This step determines the discount for the usage. For example, you committed $100.00 USD and you are charged based on a one or three-year savings plan discount. The discount applies per SKU, so your cost per hour is less than 100 hours. You need more compute cost to get the $100.00 US value. So, 40% is a safe limit.
1. View the range of cost per hour, per day, and per month to determine a safe commitment to make.

## Need help? Contact us

If you have Azure savings plan for compute questions, contact your account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft only provides Azure savings plan for compute expert support requests in English.

## Next steps

- [Manage Azure savings plans](manage-savings-plan.md)
- [View Azure savings plan cost and usage details](utilization-cost-reports.md)
- [Software costs not included in saving plan](software-costs-not-included.md)
