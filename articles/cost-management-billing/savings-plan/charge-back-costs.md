---
title: Charge back Azure saving plan costs
titleSuffix: Microsoft Cost Management
description: Learn how to view Azure saving plan costs for chargeback.
author: bandersmsft
ms.reviewer: onwokolo
ms.service: cost-management-billing
ms.subservice: savings-plan
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 06/14/2023
ms.author: banders
---

# Charge back Azure saving plan costs

Enterprise Agreement and Microsoft Customer Agreement billing readers can view amortized cost data for savings plans. They can use the cost data to charge back the monetary value for a subscription, resource group, resource, or a tag to their partners. In amortized data, the effective price is the prorated hourly savings plan cost. The cost is the total cost of savings plan usage by the resource on that day.

Users with an individual subscription can get the amortized cost data from their usage file. When a resource gets a savings plan discount, the _AdditionalInfo_ section in the usage file contains the savings plan details. For more information, see [View and download your Azure usage and charges](../understand/download-azure-daily-usage.md).

## View savings plan usage data for show back and charge back

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Navigate to **Cost Management + Billing**.
3. Select **Cost analysis** from the left navigation menu.
4. Under **Actual Cost**, select the **Amortized Cost** metric.
5. To see which resources were used by a savings plan, apply a filter for **Pricing Model** and then select **SavingsPlan**.
6. Set the **Granularity** to **Monthly** or **Daily**.
7. Set the chart type to **Table**.
8. Set the **Group by** option to **Resource**.


## Get the data for show back and charge back

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Navigate to **Cost Management + Billing**.
3. Select **Export** from the left navigation menu.
4. Select **Add**.
5. Select **Amortized cost** as the metric and set up your export.

The *EffectivePrice* for the usage that gets savings plan discount is the prorated cost of the savings plan, instead of being zero. It helps you know the monetary value of savings plan consumption by a subscription, resource group or a resource. It can help you charge back for the savings plan utilization internally. The dataset also has unused savings plan benefits.

## Get Azure consumption and savings plan usage data using API

You can get the data using the API or download it from Azure portal.

You call the [Usage Details API](/rest/api/consumption/usagedetails/list) to get the new data. For more information about terminology, see [Usage terms](../understand/understand-usage.md).

Here's an example call to the Usage Details API:

```http
https://management.azure.com/providers/Microsoft.Billing/billingAccounts/{enrollmentId}/providers/Microsoft.Billing/billingPeriods/{billingPeriodId}/providers/Microsoft.Consumption/usagedetails?metric={metric}&amp;api-version=2019-05-01&amp;$filter={filter}

```

For more information about `{enrollmentId}` and `{billingPeriodId}`, see the [Usage Details – List](/rest/api/consumption/usagedetails/list) API article.

Information in the following table about metric and filter can help solve common savings plan problems.

| Type of API data | API call action |
| --- | --- |
| **All Charges (usage and purchases)** | Request for an ActualCost report. |
| **Usage that got savings plan discount**  | Request for an ActualCost report. <br><br> Once you've ingested all of the usage, look for records with ChargeType = 'Usage' and PricingModel = 'SavingsPlan'. |
| **Usage that didn't get savings plan discount**  | Request for an ActualCost report.<br><br> Once you've ingested all of the usage, filter for usage records with PricingModel = 'OnDemand'. |
| **Amortized charges (usage and purchases)** | Request for an AmortizedCost report. |
| **Unused savings plan report**  | Request for an AmortizedCost report.<br><br> Once you've ingested all of the usage, filter for usage records with ChargeType = 'UnusedSavingsPlan' and PricingModel ='SavingsPlan'. |
| **Savings plan purchases**  | Request for an AmortizedCost report.<br><br> Once you've ingested all of the usage, filter for usage records with ChargeType = 'Purchase' and PricingModel = 'SavingsPlan'. |
| **Refunds**  | Request for an AmortizedCost report.<br><br> Once you've ingested all of the usage, filter for usage records with ChargeType = 'Refund'. |

## Download the usage CSV file with new data

If you're an EA admin, you can download the CSV file that contains new usage data from Azure portal. This data isn't available from the EA portal (ea.azure.com), you must download the usage file from Azure portal (portal.azure.com) to see the new data.

In the Azure portal, navigate to [Cost management + billing](https://portal.azure.com/#blade/Microsoft_Azure_Billing/ModernBillingMenuBlade/BillingAccounts).

1. Select the scope.
    1. For EA, your scope is the enrollment.
    1. For MCA, your scope is the billing account.
1. Select **Usage + charges**.
1. Select **Download**.
1. In **Usage Details**, select **Amortized usage data**.

The CSV files that you download contain actual costs and amortized costs.

## Need help? Contact us.

If you have Azure savings plan for compute questions, contact your  account team, or [create a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Temporarily, Microsoft will only provide Azure savings plan for compute expert support requests in English.

## Next steps

To learn more about Azure savings plan usage data, see the following articles:

- [View Azure savings plan cost and usage details](utilization-cost-reports.md)
 
