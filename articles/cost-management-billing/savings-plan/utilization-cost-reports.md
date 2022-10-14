---
title: View Azure savings plan cost and usage
titleSuffix: Microsoft Cost Management
description: Learn how to view saving plan cost and usage details.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: reservations
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 10/14/2022
ms.author: banders
---

# View Azure savings plan cost and usage details

Enhanced data for savings plan costs and usage is available for Enterprise Agreement (EA) and Microsoft Customer Agreement (MCA) usage in Cost management. This article helps you:

- Get savings plan purchase data
- Know which subscription, resource group or resource used the savings plan
- Calculate savings plan savings
- Get savings plan under-utilization data
- Amortize savings plan costs

## Savings plan charges in Azure cost data

Fields in the Azure cost data that are relevant to savings plan scenarios are listed below.

- `BenefitId` and `BenefitName` - They are their own fields in the data and correspond to the Savings Plan ID and Savings Plan name associated with your purchase.
- `PricingModel` - This field will be "SavingsPlan" for purchase and usage cost records that are relevant to a Savings Plan.
- `ProductOrderId` - The savings plan order ID, added as its own field.
- `ProductOrderName` - The product name of the purchased savings plan.
- `Term` – The time period associated with your savings plan purchase.

In Azure Cost Management, cost details provide savings plan cost in two separate data sets: _Actual Cost_ and _Amortized Cost_. How these two datasets differ:

**Actual Cost** - Provides data to reconcile with your monthly bill. The data has savings plan purchase costs and savings plan application details. With the data, you can know which subscription or resource group or resource received the savings plan discount in a particular day. The `EffectivePrice` for the usage that receives the savings plan discount is zero.

**Amortized Cost** - This dataset is similar to the Actual Cost dataset except that - the `EffectivePrice` for the usage that gets savings plan discount is the prorated cost of the savings plan (instead of being zero). It helps you know the monetary value of savings plan consumption by a subscription, resource group or a resource, and it can help you charge back for the savings plan utilization internally. The dataset also has unused hours in the savings plan that have been charged for the hourly commitment amount. The dataset doesn't have savings plan purchase records.

Here's a comparison of the two data sets:

| **Data** | **Actual Cost data set** | **Amortized Cost data set** |
| --- | --- | --- |
| Savings plan purchases | Available in the view.<br><br>To get the data, filter on ChargeType = `Purchase`.<br><br>Refer to `BenefitID` or `BenefitName` to know which savings plan the charge is for. | Not applicable to the view.<br><br>Purchase costs aren't provided in amortized data. |
| `EffectivePrice` | The value is zero for usage that gets savings plan discount. | The value is per-hour prorated cost of the savings plan for usage that has the savings plan discount. |
| Unused Savings Plan (provides the number of hours the savings plan wasn't used in a day and the monetary value of the waste) | Not applicable in the view. | Available in the view.<br><br>To get the data, filter on ChargeType = `UnusedSavingsPlan`.<br><br>Refer to `BenefitID` or `BenefitName` to know which savings plan was underutilized. Indicates how much of the savings plan was wasted for the day. |
| UnitPrice (price of the resource from your price sheet) | Available | Available |

## Get Azure consumption and savings plan cost data using API

You can get the data using the API or download it from Azure portal. Call the [Cost Details API](/rest/api/cost-management/generate-cost-details-report/create-operation) to get the new data. For details about terminology, see [Usage terms](../understand/understand-usage.md). To learn more about how to call the Cost Details API, see [Get cost data on demand](../automate/get-small-usage-datasets-on-demand.md).

Information in the following table about metric and filter can help solve for common savings plan problems.

| **Type of API data**   | **API call action**   |
|---|---|
| **All Charges (usage and purchases)**  | Request for an ActualCost report.  |
| **Usage that got savings plan discount**   | Request for an ActualCost report.<br><br> Once you've ingested all of the usage, look for records with ChargeType = 'Usage' and PricingModel = 'SavingsPlan'. |
| **Usage that didn't get savings plan discount**   | Request for an ActualCost report.<br><br> Once you've ingested all of the usage, filter for usage records with PricingModel = 'OnDemand'. |
| **Amortized charges (usage and purchases)**  | Request for an AmortizedCost report.  |
| **Unused savings plan report**   | Request for an AmortizedCost report.<br><br> Once you've ingested all of the usage, filter for usage records with ChargeType = 'UnusedSavingsPlan' and PricingModel ='SavingsPlan'. |
| **Savings plan purchases**   | Request for an ActualCost report.<br><br> Once you've ingested all of the usage, filter for usage records with ChargeType = 'Purchase' and PricingModel = 'SavingsPlan'. |
| **Refunds**   | Request for an ActualCost report.<br><br> Once you've ingested all of the usage, filter for usage records with ChargeType = 'Refund'. |

## Download the cost CSV file with new data

To download your saving plan cost and usage file, using the information in the following sections.

### Download for EA customers

If you're an EA admin, you can download the CSV file that contains new cost data from the Azure portal. This data isn't available from the EA portal (ea.azure.com), you must download the cost file from Azure portal (portal.azure.com) to see the new data.

In the Azure portal, navigate to [Cost Management + Billing](https://portal.azure.com/#blade/Microsoft_Azure_Billing/ModernBillingMenuBlade/BillingAccounts).

1. Select the enrollment.
1. Select **Usage + charges**.
1. Select **Download**.
1. In **Download Usage + Charges**, under **Usage Details Version 2**, select **All Charges (usage and purchases)** and then select download. Repeat for **Amortized charges (usage and purchases)**.

### Download for MCA customers

If you're an Owner, Contributor, or Reader on your Billing Account, you can download the CSV file that contains new usage data from the Azure portal. In the Azure portal, navigate to Cost Management + Billing.

1. Select the billing account.
2. Select **Invoices.**
3. Download the Actual Cost CSV file based on your scenario.
  1. To download the usage for the current month, select **Download pending usage**.
  2. To download the usage for a previous invoice, select the ellipsis symbol (**...**) and select **Prepare Azure usage file**.
4. If you want to download the Amortized Cost CSV file, you'll need to use Exports or our Cost Details API.
  1. To use Exports, see [Export data](../costs/tutorial-export-acm-data.md).
  2. To use the Cost Details API, see [Get small cost datasets on demand](../automate/get-small-usage-datasets-on-demand.md).

## Common cost and usage tasks

The following sections are common tasks that most people use to view their savings plan cost and usage data.

### Get savings plan purchase costs

Savings plan purchase costs are available in Actual Cost data. Filter for ChargeType = `Purchase`. Refer to `ProductOrderID` to determine which savings plan order the purchase is for.

### Get underutilized savings plan quantity and costs

Get amortized cost data and filter for `ChargeType` = `UnusedSavingsPlan` and `PricingModel` = `SavingsPlan`. You get the daily unused savings plan quantity and the cost. You can filter the data for a savings plan or savings plan order using `BenefitId` and `ProductOrderId` fields, respectively. If a savings plan was 100% utilized, the record has a quantity of 0.

### Amortized savings plan costs

Get amortized cost data and filter for a savings plan order using `ProductOrderID` to get daily amortized costs for a savings plan.

### Chargeback for a savings plan

You can charge-back savings plan use to other organizations by subscription, resource groups, or tags. Amortized cost data provides the monetary value of a savings plan's utilization at the following data types:

- Resources (such as a VM)
- Resource group
- Tags
- Subscription

### Determine savings plan savings

Get the Amortized costs data and filter the data for a savings plan instance. Then:

1. Get estimated pay-as-you-go costs. Multiply the _UnitPrice_ value with _Quantity_ values to get estimated pay-as-you-go costs, if the savings plan discount didn't apply to the usage.
2. Get the savings plan costs. Sum the _Cost_ values to get the monetary value of what you paid for the savings plan. It includes the used and unused costs of the savings plan.
3. Subtract savings plan costs from estimated pay-as-you-go costs to get the estimated savings.

Keep in mind that if you have an underutilized savings plan, the _UnusedSavingsPlan_ entry for _ChargeType_ becomes a factor to consider. When you have a fully utilized savings plan, you receive the maximum savings possible. Any _UnusedSavingsPlan_ quantity reduces savings.

## Purchase and amortization costs in cost analysis

Savings plan costs are available in [cost analysis](https://aka.ms/costanalysis). By default, cost analysis shows **Actual cost**, which is how costs are shown on your bill. To view savings plan purchases broken down and associated with the resources that used the benefit, switch to **Amortized cost**. Here's an example.

:::image type="content" source="./media/utilization-cost-reports/portal-cost-analysis-amortized-view.png" alt-text="Example showing where to select amortized cost in cost analysis." lightbox="./media/utilization-cost-reports/portal-cost-analysis-amortized-view.png" :::

Group by _Charge Type_ to see a breakdown of usage, purchases, and refunds; or by _Pricing Model_ for a breakdown of savings plan and on-demand costs. You can also group by _Benefit_ and use the _BenefitId_ and _BenefitName_ associated with your Savings Plan to identify the costs related to specific savings plan purchases. The only savings plan costs that you see when looking at actual cost are purchases. Costs aren't allocated to the individual resources that used the benefit when looking at amortized cost. You'll also see a new _**UnusedSavingsPlan**_ plan charge type when looking at amortized cost.

## Next steps

- Learn more about how to [Charge back Azure saving plan costs](charge-back-costs.md).
