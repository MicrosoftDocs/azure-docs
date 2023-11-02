---
title: View Azure savings plan cost and usage
titleSuffix: Microsoft Cost Management
description: Learn how to view saving plan cost and usage details.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 06/14/2023
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

In Cost Management, cost details provide savings plan cost in two separate data sets: _Actual Cost_ and _Amortized Cost_. How these two datasets differ:

**Actual Cost** - Provides data to reconcile with your monthly bill. The data has savings plan purchase costs and savings plan application details. With the data, you can know which subscription or resource group, or resource received the savings plan discount on a particular day. The EffectivePrice for the usage that receives the savings plan discount is zero.

**Amortized Cost** - The dataset is like the Actual Cost dataset except that - the EffectivePrice for the usage that gets savings plan discount is the prorated cost of the savings plan (instead of being zero). It helps you know the monetary value of savings plan consumption by a subscription, resource group or a resource, and can help you charge back for the savings plan utilization internally. The dataset also has unused hours in the savings plan that have been charged for the hourly commitment amount. The dataset doesn't have savings plan purchase records.

The following fields in the Azure cost data that are relevant to savings plan scenarios.

- `BenefitId` and `BenefitName` - They are their own fields in the data and correspond to the Savings Plan ID and Savings Plan name associated with your purchase.
- `PricingModel` - The field will be `SavingsPlan` for purchase and usage cost records that are relevant to a Savings Plan.
- `ProductOrderId` - The savings plan order ID, added as its own field.
- `ProductOrderName` - The product name of the purchased savings plan.
- `Term` – The period associated with your savings plan purchase.


Comparison of two data sets:

| **Data** | **Actual Cost data set** | **Amortized Cost data set** |
| --- | --- | --- |
| Savings plan purchases | To get the data filter on `ChargeType` = `Purchase`.<br><br> Refer to `BenefitID` or `BenefitName` to know which savings plan the charge is for. | Purchase costs aren't provided in amortized data. |
| `EffectivePrice` | The value is zero for usage that gets savings plan discount. | The value is per-hour prorated cost of the savings plan for usage that has the savings plan discount. |
| Unused benefit (provides the number of hours the savings plan wasn't used in a day and the monetary value of the waste) | Not applicable in the view. | To get the data, filter on `ChargeType` = `UnusedSavingPlan`.<br><br> Refer to `BenefitID` or `BenefitName` to know which savings plan was underutilized. It's how much of the savings plan was wasted for the day. |
| `UnitPrice` (price of the resource from your price sheet) | Available | Available |

## Get Azure consumption and savings plan cost data using API

You can get the data using the API or download it from Azure portal. Call the [Cost Details API](/rest/api/cost-management/generate-cost-details-report/create-operation)to get the new data. For details about terminology, see [usage terms](../understand/understand-usage.md). For more information about how to call the Cost Details API, see [Get cost data on demand](../automate/get-small-usage-datasets-on-demand.md).

Information in the following table about metrics and filters can help solve for common savings plan problems.

| Type of API data  | API call action  |
| --- | --- |
| All Charges (usage and purchases)  | Request for an ActualCost report.  |
| Usage that got savings plan discount  | Request for an ActualCost report.
 Once you've ingested all the usage, look for records with ChargeType = `Usage` and `PricingModel` = `SavingsPlan`. |
| Usage that didn't get savings plan discount  | Request for an ActualCost report. <br><br> Once you've ingested all the usage, filter for usage records with `PricingModel` = `OnDemand`. |
| Amortized charges (usage and purchases)  | Request for an AmortizedCost report.  |
| Unused savings plan report  | Request for an AmortizedCost report.<br><br> Once you've ingested all of the usage, filter for usage records with ChargeType = `UnusedSavingsPlan` and `PricingModel` =`SavingsPlan`. |
| Savings plan purchases  | Request for an ActualCost report. <br><br> Once you've ingested all the usage, filter for usage records with `ChargeType` = `Purchase` and `PricingModel` = `SavingsPlan`. |
| Refunds  | Request for an ActualCost report. <br><br> Once you've ingested all the usage, filter for usage records with `ChargeType` = `Refund`. |

## Download the cost CSV file with new data

To download your saving plan cost and usage file, use the information in the following sections.

### EA customers

If you're an EA admin, you can download the CSV file that contains new cost data from the Azure portal. This data isn't available from the [EA portal](https://ea.azure.com/), you must download the cost file from Azure portal (portal.azure.com) to see the new data.

In the Azure portal, navigate to [Cost Management + Billing](https://portal.azure.com/#blade/Microsoft_Azure_Billing/ModernBillingMenuBlade/BillingAccounts).

1. Select the billing account.
2. In the left menu, select **Usage + charges**.
3. Select **Download**.  
    :::image type="content" source="./media/utilization-cost-reports/download-usage-file.png" alt-text="Screenshot showing the download usage file option." lightbox="./media/utilization-cost-reports/download-usage-file.png" :::
4. In **Download Usage + Charges**, under **Usage Details Version 2**, select **All Charges (usage and purchases)** and then select download. 
    - Repeat for **Amortized charges (usage and purchases)**.

### MCA customers

To view and download usage data for a billing profile, you must be a billing profile Owner, Contributor, Reader, or Invoice manager.

To download usage for billed charges:

1. Search for **Cost Management + Billing**.
2. Select a billing profile.
3. Select **Invoices**.
4. In the invoice grid, find the row of the invoice corresponding to the usage that you want to download.
5. Select the ellipsis (**...**) at the end of the row.
6. In the download context menu, select **Azure usage and charges**.

## Common cost and usage tasks

The following sections are common tasks that are used to view savings plan cost and usage data.

### Get savings plan purchase costs

Savings plan purchase costs are available in Actual Cost data. Filter for `ChargeType` = `Purchase`. Refer to `ProductOrderID` to determine which savings plan order the purchase is for.

### Get underutilized savings plan quantity and costs

Get Amortized Cost data and filter for `ChargeType` = `UnusedSavingsPlan` and `PricingModel` = `SavingsPlan`. You get the daily unused savings plan quantity and the cost. You can filter the data for a Savings Plan or Savings Plan order using `BenefitId` and `ProductOrderId` fields, respectively. If a Savings Plan was 100% utilized, the record has a quantity of 0.

### Amortize savings plan costs

Get Amortized Cost data and filter for a savings plan order using `ProductOrderID` to get daily amortized costs for a savings plan.

### Chargeback for a savings plan

You can charge back savings plan use to other organizations by subscription, resource groups, or tags. Amortized cost data provides monetary value of a savings plan's utilization at the following data types:

- Resources (such as a VM)
- Resource group
- Tags
- Subscription

### Determine savings resulting from savings plan

Get the Amortized costs data and filter the data for a `PricingModel` = `SavingsPlan`. Then:

1. Get estimated pay-as-you-go costs or customer discounted cost. Multiply the `UnitPrice` value with `Quantity` values to get estimated pay-as-you-go costs if the savings plan discount didn't apply to the usage.
2. Get the savings plan costs. Sum the `Cost` values to get the monetary value of what you paid for the savings plan. It includes the used and unused costs of the savings plan.
3. Subtract estimated pay-as-you-go costs from savings plan costs to get the estimated savings.

To determine the savings from the pay-as-you-go list price:

1. To get the pay-as-you-go list price cost (`PayGPriceCost`), multiply the `PayGPrice` value with the `Quantity` value.
1. Subtract `PayGPriceCost` from `Cost` to determine the savings from the savings plan.

To determine the savings percentage from the discounted price:

1. Subtract `PayGPrice` from `Cost` to get the savings from the savings plan against discounts.
1. Divide `Cost` by `PayGPrice` and then divide by 100 to get the discount percentage applied, per line item.

Keep in mind that if you have an underutilized savings plan, the `UnusedSavingsPlan` entry for `ChargeType` becomes a factor to consider. When you have a fully utilized savings plan, you receive the maximum savings possible. Any `UnusedSavingsPlan` quantity reduces savings.

### Savings plan purchases and amortization in cost analysis

Savings plan costs are available in [cost analysis](https://aka.ms/costanalysis). By default, cost analysis shows  **Actual cost** , which is how costs will be shown on your bill. To view savings plan purchases broken down and associated with the resources that used the benefit, switch to **Amortized cost**. Here's an example.

:::image type="content" source="./media/utilization-cost-reports/portal-cost-analysis-amortized-view.png" alt-text="Example showing where to select amortized cost in cost analysis." lightbox="./media/utilization-cost-reports/portal-cost-analysis-amortized-view.png" :::

Group by **Charge Type** to see a breakdown of usage, purchases, and refunds; or by **Pricing Model** for a breakdown of savings plan and on-demand costs. You can also group by **Benefit** and use the **BenefitId** and **BenefitName** associated with your savings plan to identify the costs related to specific savings plan purchases. The only savings plan costs you'll see when looking at actual cost are purchases. Costs will be allocated to the individual resources that used the benefit when looking at amortized cost. You'll also see a new **UnusedSavingsPlan** plan charge type when looking at amortized cost.

## Next steps

- Learn more about how to [Charge back Azure saving plan costs](charge-back-costs.md).
