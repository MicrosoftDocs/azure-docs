---
title: Analyze Azure costs with the Power BI App
description: This article explains how to install and use the Cost Management Power BI App.
author: bandersmsft
ms.author: banders
ms.date: 09/14/2023
ms.topic: how-to
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: benshy
---

# Analyze cost with the Cost Management Power BI App for Enterprise Agreements (EA)

This article explains how to install and use the Cost Management Power BI app. The app helps you analyze and manage your Azure costs in Power BI. You can use the app to monitor costs, usage trends, and identify cost optimization options to reduce your expenditures.

The Cost Management Power BI app currently supports only customers with an [Enterprise Agreement](https://azure.microsoft.com/pricing/enterprise-agreement/).

The app limits customizability. If you want to modify and extend the default filters, views, and visualizations to customize for your needs, use [Cost Management connector in Power BI Desktop](/power-bi/connect-data/desktop-connect-azure-cost-management) instead. With the Cost Management connector you can join additional data from other sources to create customized reports to get holistic views of your overall business cost. The connector also supports Microsoft Customer Agreements.

> [!NOTE]
> Power BI template apps don't support downloading the PBIX file.

## Prerequisites

- A [Power BI Pro license](/power-bi/service-self-service-signup-for-power-bi) is required to install and use the app.
- To connect to data, you must use an [Enterprise Administrator](../manage/understand-ea-roles.md) account. The Enterprise Administrator (read only) role is supported.

## Installation steps

To install the app:

1. Open [Cost Management Power BI App](https://aka.ms/costmgmt/ACMApp).
1. On the Power BI AppSource page, select **Get it now**.
1. Select **Continue** to agree to the terms of use and privacy policy.
1. In the **Install this Power BI app** box, select **Install**.
1. If needed, create a workspace and select **Continue**.
1. When installation completes, notification appears saying that your new app is ready.
1. Select the app that you installed.
1. On the Getting started page, select **Connect your data**.
    :::image type="content" source="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/connect-your-data.png" alt-text="Screenshot highlighting the Connect your data link." lightbox="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/connect-your-data.png" :::
1. In the dialog that appears, enter your EA enrollment number for **BillingProfileIdOrEnrollmentNumber**. Specify the number of months of data to get. Leave the default **Scope** value of **Enrollment Number**, then select **Next**.  
    >[!NOTE]
    > The default value for Scope is `Enrollment Number`. Do not change the value, otherwise the initial data connection will fail.  

    :::image type="content" source="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ea-number.png" alt-text="Screenshot showing where you enter your E A enrollment information." lightbox="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ea-number.png" :::
1. The next installation step connects to your EA enrollment and requires an [Enterprise Administrator](../manage/understand-ea-roles.md) account. Leave all the default values. Select **Sign in and continue**.  
    :::image type="content" source="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ea-auth.png" alt-text="Screenshot showing the Connect to Cost Management App dialog box with default values to connect with." lightbox="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ea-auth.png" :::
1. The final dialog connects to Azure and gets data. *Leave the default values as configured* and select **Sign in and connect**.  
    :::image type="content" source="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/autofit.png" alt-text="Screenshot showing the Connect to Cost Management App dialog box with default values." lightbox="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/autofit.png" :::
1. You are prompted to authenticate with your EA enrollment. Authenticate with Power BI. After you're authenticated, a Power BI data refresh starts.
    > [!NOTE]
    > The data refresh process might take quite a while to complete. The length depends on the number of months specified and the amount of data needed to sync.

After the data refresh is complete, select the Cost Management App to view the pre-created reports.

## Reports available with the app

The following reports are available in the app.

**Getting Started** - Provides useful links to documentation and links to provide feedback.

**Account overview** - The report shows the current billing month summary of information, including:

- Charges against credits
- New purchases
- Azure Marketplace charges
- Overages and total charges

The Billing account overview page might show costs that differ from costs shown in the EA portal. 

>[!NOTE]
>The **Select date range** selector doesn’t affect or change overview tiles. Instead, the overview tiles show the costs for the current billing month. This behavior is intentional.

Data shown in the bar graph is determined by the date selection.

Here's how values in the overview tiles are calculated.

- The value shown in the **Charges against credit** tile is calculated as the sum of `adjustments`.
- The value shown in the **Service overage** tile is calculated as the sum of `ServiceOverage`.
- The value shown in the **Billed separately** tile is calculated as the sum of `chargesBilledseparately`.
- The value shown in the **Azure Marketplace** tile is calculated as the sum of `azureMarketplaceServiceCharges`.
- The value shown in the **New purchase amount** tile is calculated as the sum of `newPurchases`.
- The value shown in the **Total charges** tile is calculated as the sum of (`adjustments` + `ServiceOverage` + `chargesBilledseparately` + `azureMarketplaceServiceCharges`).

The EA portal doesn't show the Total charges column. The Power BI template app includes Adjustments, Service Overage, Charges billed separately, and Azure Marketplace service charges as Total charges.
 
The Prepayment Usage shown in the EA portal isn't available in the Template app as part of the total charges.

**Usage by Subscriptions and Resource Groups** - Provides a cost over time view and charts showing cost by subscription and resource group.

**Usage by Services** - Provides a view over time of usage by MeterCategory. You can track your usage data and drill into any anomalies to understand usage spikes or dips.

**Top 5 Usage drivers** - The report shows a filtered cost summarization by the top 5 MeterCategory and corresponding MeterName.

**Windows Server AHB Usage** - The report shows the number virtual machines that have Azure Hybrid Benefit enabled. It also shows a count of cores/vCPUs used by the virtual machines.

:::image type="content" source="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ahb-report-full.png" alt-text="Screenshot showing the full Azure Hybrid Benefits report." lightbox="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ahb-report-full.png" :::

The report also identifies Windows VMs where Hybrid Benefit is **enabled** but there are _fewer than_ 8 vCPUs. It also shows where Hybrid Benefit is **not enabled** that have 8 _or more_ vCPUs. This information helps you fully use your Hybrid Benefit. Apply the benefit to your most expensive virtual machines to maximize your potential savings.

:::image type="content" source="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ahb-report.png" alt-text="Screenshot showing the Less than 8 vCPUs and vCPUs not enabled area of the Azure Hybrid Benefits report." lightbox="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ahb-report.png" :::

**RI Chargeback** - The report helps you understand where and how much of a reserved instance (RI) benefit is applied per region, subscription, resource group, or resource. The report uses amortized usage data to show the view.

You can apply a filter on _chargetype_ to view RI underutilization data.

For more information about amortized data, see [Get Enterprise Agreement reservation costs and usage](../reservations/understand-reserved-instance-usage-ea.md).

**RI Savings** - The report shows the savings accrued by reservations for subscription, resource group, and the resource level. It displays:

- Cost with reservation
- Estimated on-demand cost if the reservation didn't apply to the usage
- Cost savings accrued from the reservation

 The report subtracts any under-utilized reservation waste cost from the total savings. The waste wouldn't occur without a reservation.

You can use the amortized usage data to build on the data.

<a name="shared-recommendation"></a>
**VM RI Coverage (shared recommendation)** - The report is split between on-demand VM usage and RI VM usage over the selected period. It provides recommendations for VM RI purchases at a shared scope.

To use the report, select the drill-down filter.

:::image type="content" source="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ri-drill-down2.png" alt-text="Screenshot showing the select drill down option in the VM RI coverage report." lightbox="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ri-drill-down2.png" :::

Select the region that you want to analyze. Then select the instance size flexibility group, and so on.

For each drill-down level, the following filters are applied to the report:

- The coverage data on the right is the filter showing how much usage is charged using the on-demand rate vs. how much is covered by the reservation.
- Recommendations are also filtered.

The recommendations table provides recommendations for the reservation purchase, based on the VM sizes used.

The _Normalized Size_ and _Recommended Quantity Normalized_ values help you normalize the purchase to the smallest size for an instance size flexibility group. The information is helpful if you plan to purchase just one reservation for all sizes in the instance size flexibility group.

:::image type="content" source="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ri-recommendations.png" alt-text="Screenshot showing the RI recommendations report." lightbox="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ri-recommendations.png" :::

**VM RI Coverage (single recommendation)** - The report is split between on-demand VM usage and RI VM usage over the selected time period. It provides recommendations for VM RI purchases at a subscription scope.

For details about how to use the report, see the [VM RI Coverage (shared recommendation)](#shared-recommendation) section.

**RI purchases** - The report shows RI purchases over the specified period.

**Price sheet** - The report shows a detailed list of prices specific to a Billing account or EA enrollment.

## Troubleshoot problems

If you're having issues with the Power BI app, the following troubleshooting information might help.

### Error processing the data in the dataset

You might get an error stating:

```
There was an error when processing the data in the dataset.
Data source error: {"error":{"code":"ModelRefresh_ShortMessage_ProcessingError","pbi.error":{"code":"ModelRefresh_ShortMessage_ProcessingError","parameters":{},"details":[{"code":"Message","detail":{"type":1,"value":"We cannot convert the value \"Required Field: 'Enr...\" to type List."}}],"exceptionCulprit":1}}} Table: <TableName>.
```

A table name would appear instead of `<TableName>`.

#### Cause

The default **Scope** value of `Enrollment Number` was changed in the connection to Cost Management.

#### Solution

Reconnect to Cost Management and set the **Scope** value to `Enrollment Number`. Do not enter your organization's enrollment number, instead type `Enrollment Number` exactly as it appears in the following image.

:::image type="content" source="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ea-number-troubleshoot.png" alt-text="Screenshot showing that the default text of Enrollment Number must not change." lightbox="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/ea-number-troubleshoot.png" :::

### BudgetAmount error

You might get an error stating:

```
Something went wrong
There was an error when processing the data in the dataset.
Please try again later or contact support. If you contact support, please provide these details.
Data source error: The 'budgetAmount' column does not exist in the rowset. Table: Budgets.
```

#### Cause

This error occurs because of a bug with the underlying metadata. The issue happens because there's no budget available under **Cost Management > Budget** in the Azure portal. The bug fix is in the process of getting deployed to the Power BI Desktop and Power BI service.

#### Solution

- Until the bug is fixed, you can work around the problem by adding a test budget in the Azure portal at the billing account/EA enrollment level. The test budget unblocks connecting with Power BI. For more information about creating a budget, see [Tutorial: Create and manage budgets](tutorial-acm-create-budgets.md).

### Invalid credentials for AzureBlob error

You might get an error stating:

```
Failed to update data source credentials: The credentials provided for the AzureBlobs source are invalid.
```

#### Cause

This error occurs if you change the authentication method for your data source connection.

#### Solution

1. Connect to your data.
1. After you enter your EA enrollment and number of months, make sure that you leave the default value of **Anonymous** for Authentication method and **None** for the Privacy level setting.  
  :::image type="content" source="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/autofit-troubleshoot.png" alt-text="Screenshot shows the Connect to Cost Management App dialog box with Anonymous and None values entered." lightbox="./media/analyze-cost-data-azure-cost-management-power-bi-template-app/autofit-troubleshoot.png" :::
1. On the next page, set **OAuth2** for the Authentication method and **None** set for Privacy level. Then, sign in to authenticate with your enrollment. This step also starts a Power BI data refresh.

## Data reference

The following information summarizes the data available through the app. There's also links to APIs that give in-depth details for data fields and values.

| **Table reference** | **Description** |
| --- | --- |
| **AutoFitComboMeter** | Data included in the app to normalize the RI recommendation and usage to the smallest size in the instance family group. |
| [**Balance summary**](/rest/api/billing/enterprise/billing-enterprise-api-balance-summary#response) | Summary of the balance for Enterprise Agreements. |
| [**Budgets**](/rest/api/consumption/budgets/get#definitions) | Budget details to view actual costs or usage against existing budget targets. |
| [**Pricesheets**](/rest/api/billing/enterprise/billing-enterprise-api-pricesheet#see-also) | Applicable meter rates for the provided billing profile or EA enrollment. |
| [**RI charges**](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-charges#response) | Charges associated to your reserved instances over the last 24 months. |
| [**RI recommendations (shared)**](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation#response) | Reserved instance purchase recommendations based on all your subscription usage trends for the last 7 days. |
| [**RI recommendations (single)**](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-recommendation#response-1) | Reserved instance purchase recommendations based on your single subscription usage trends for the last 7 days. |
| [**RI usage details**](/rest/api/billing/enterprise/billing-enterprise-api-reserved-instance-usage#response) | Consumption details for your existing reserved instances over the last month. |
| [**RI usage summary**](/rest/api/consumption/reservationssummaries/list) | Daily Azure reservation usage percentage. |
| [**Usage details**](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail#usage-details-field-definitions) | A breakdown of consumed quantities and estimated charges for the given billing profile in the EA enrollment. |
| [**Usage details amortized**](/rest/api/billing/enterprise/billing-enterprise-api-usage-detail#usage-details-field-definitions) | A breakdown of consumed quantities and estimated amortized charges for the given billing profile in the EA enrollment. |

## Next steps

For more information about configuring data, refresh, sharing reports, and additional report customization see the following articles:

- [Configure scheduled refresh](/power-bi/refresh-scheduled-refresh)
- [Share Power BI dashboards and reports with coworkers and others](/power-bi/service-share-dashboards)
- [Subscribe yourself and others to reports and dashboards in the Power BI service](/power-bi/service-report-subscribe)
- [Download a report from the Power BI service to Power BI Desktop](/power-bi/service-export-to-pbix)
- [Save a report in Power BI service and Power BI Desktop](/power-bi/service-report-save)
- [Create a report in the Power BI service by importing a dataset](/power-bi/service-report-create-new)
