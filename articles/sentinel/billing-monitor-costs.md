---
title: Manage and monitor costs for Microsoft Sentinel
description: Learn how to manage and monitor costs and billing for Microsoft Sentinel by using cost analysis in the Azure portal and other methods.
author: cwatson-cat
ms.author: cwatson
ms.custom: subject-cost-optimization
ms.topic: conceptual
ms.date: 03/07/2024
ms.collection: usx-security
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal


#Customer intent: As a cloud administrator, I want to manage and monitor costs for Microsoft Sentinel so that I can optimize spending and prevent budget overruns.

---

# Manage and monitor costs for Microsoft Sentinel

After you've started using Microsoft Sentinel resources, use Cost Management features to set budgets and monitor costs. You can also review forecasted costs and identify spending trends to identify areas where you might want to act. 

Costs for Microsoft Sentinel are only a portion of the monthly costs in your Azure bill. Although this article explains how to manage and monitor costs for Microsoft Sentinel, you're billed for all Azure services and resources your Azure subscription uses, including Partner services.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Prerequisites

To view cost data and perform cost analysis in Cost Management, you must have a supported Azure account type, with at least read access.

While cost analysis in Cost Management supports most Azure account types, not all are supported. To view the full list of supported account types, see [Understand Cost Management data](../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

For information about assigning access to Microsoft Cost Management data, see [Assign access to data](../cost-management/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Managage and monitor costs for the Analytics tier
As you use Azure resources with Microsoft Sentinel, you incur costs. Azure resource usage unit costs vary by time intervals such as seconds, minutes, hours, and days, or by unit usage, like bytes and megabytes.

### View costs by using cost analysis
As soon as Microsoft Sentinel starts to ingest billable data, it incurs costs. View these costs by using cost analysis in the Azure portal. For more information, see [Start using cost analysis](../cost-management/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

When you use cost analysis, you view Microsoft Sentinel costs in graphs and tables for different time intervals. Some examples are by day, current and prior month, and year. You also view costs against budgets and forecasted costs. Switching to longer views over time can help you identify spending trends. And you see where overspending might have occurred. If you created budgets, you can also easily see where they're exceeded.

The [Microsoft Cost Management + Billing](../cost-management-billing/costs/quick-acm-cost-analysis.md) hub provides useful functionality. After you open **Cost Management + Billing** in the Azure portal, select **Cost Management** in the left navigation and then select the [scope](..//cost-management-billing/costs/understand-work-scopes.md) or set of resources to investigate, such as an Azure subscription or resource group.

The **Cost Analysis** screen shows detailed views of your Azure usage and costs, with the option to apply various controls and filters.

For example, to see charts of your daily costs for a certain time frame:

1. Select the drop-down caret in the **View** field and select **Accumulated costs** or **Daily costs**.
1. Select the drop-down caret in the date field and select a date range.
1. Select the drop-down caret next to **Granularity** and select **Daily**.

   The costs shown in the following image are for example purposes only. They're not intended to reflect actual costs.

   :::image type="content" source="media/billing-monitor-costs/cost-management.png" alt-text="Screenshot of a cost management + billing cost analysis screen." lightbox="media/billing-monitor-costs/cost-management.png":::

You could also apply further controls. For example, to view only the costs associated with Microsoft Sentinel, select **Add filter**, select **Service name**, and then select the service names **Sentinel**, **Log Analytics**, and **Azure Monitor**.

Microsoft Sentinel analytics tier data ingestion volumes appear under **Security Insights** in some portal Usage Charts.

The Microsoft Sentinel classic pricing tiers don't include Log Analytics charges, so you might see those charges billed separately. Microsoft Sentinel simplified pricing combines the two costs into one set of tiers. To learn more about Microsoft Sentinel's simplified pricing tiers, see [Simplified pricing tiers](billing.md#simplified-pricing-tiers).

For more information on reducing costs, see [Create budgets](#create-budgets) and [Reduce costs in Microsoft Sentinel](billing-monitor-costs.md).

### Run queries to understand your analytics tier data ingestion

Microsoft Sentinel uses an extensive query language to analyze, interact with, and derive insights from huge volumes of operational data in seconds. Here are some Kusto queries you can use to understand your data ingestion volume.

Run the following query to show data ingestion volume by solution:

```kusto
Usage
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000. by bin(StartTime, 1d), Solution
| extend Solution = iff(Solution == "SecurityInsights", "AzureSentinel", Solution)
| render columnchart
```

Run the following query to show data ingestion volume by data type:

```kusto
Usage
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000. by bin(StartTime, 1d), DataType
| render columnchart
```

Run the following query to show data ingestion volume by both solution and data type:

```kusto
Usage
| where TimeGenerated > ago(32d)
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000. by Solution, DataType
| extend Solution = iff(Solution == "SecurityInsights", "AzureSentinel", Solution)
| sort by Solution asc, DataType asc
```

See more information on the following items used in the preceding examples, in the Kusto documentation:
- [***where*** operator](/kusto/query/where-operator?view=microsoft-sentinel&preserve-view=true)
- [***extend*** operator](/kusto/query/extend-operator?view=microsoft-sentinel&preserve-view=true)
- [***summarize*** operator](/kusto/query/summarize-operator?view=microsoft-sentinel&preserve-view=true)
- [***render*** operator](/kusto/query/render-operator?view=microsoft-sentinel&preserve-view=true)
- [***sort*** operator](/kusto/query/sort-operator?view=microsoft-sentinel&preserve-view=true)
- [***iff()*** function](/kusto/query/iff-function?view=microsoft-sentinel&preserve-view=true)
- [***ago()*** function](/kusto/query/ago-function?view=microsoft-sentinel&preserve-view=true)
- [***now()*** function](/kusto/query/now-function?view=microsoft-sentinel&preserve-view=true)
- [***bin()*** function](/kusto/query/bin-function?view=microsoft-sentinel&preserve-view=true)
- [***startofday()*** function](/kusto/query/startofday-function?view=microsoft-sentinel&preserve-view=true)
- [***count()*** aggregation function](/kusto/query/count-aggregation-function?view=microsoft-sentinel&preserve-view=true)
- [***sum()*** aggregation function](/kusto/query/sum-aggregation-function?view=microsoft-sentinel&preserve-view=true)

[!INCLUDE [kusto-reference-general-no-alert](includes/kusto-reference-general-no-alert.md)]

### Deploy a workbook to visualize data ingestion into analytics tier

The **Workspace Usage Report workbook** provides your workspace's data consumption, cost, and usage statistics. The workbook gives the workspace's data ingestion status and amount of free and billable data. You can use the workbook logic to monitor data ingestion and costs, and to build custom views and rule-based alerts.

This workbook also provides granular ingestion details. The workbook breaks down the data in your workspace by data table, and provides volumes per table and entry to help you better understand your ingestion patterns.

To enable the Workspace Usage Report workbook:

1. In the Microsoft Sentinel left navigation, select **Threat management** > **Workbooks**.
1. Enter *workspace usage* in the Search bar, and then select **Workspace Usage Report**.
1. Select **View template** to use the workbook as is, or select **Save** to create an editable copy of the workbook. If you save a copy, select **View saved workbook**.
1. In the workbook, select the **Subscription** and **Workspace** you want to view, and then set the **TimeRange** to the time frame you want to see. You can set the **Show help** toggle to **Yes** to display in-place explanations in the workbook.

## Export cost data

You can also [export your cost data](../cost-management-billing/costs/tutorial-improved-exports.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. Exporting cost data is helpful when you need or others to do more data analysis for costs. For example, a finance team can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.

### Create budgets

You can create [budgets](../cost-management/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to track costs and create [alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy.

You can create budgets with filters for specific resources or services in Azure if you want more granularity in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you more money. For more information about the filter options available when you create a budget, see [Group and filter options](../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

### Use a playbook for cost management alerts

To help you control your Analytics tier budget, you can create a cost management playbook. The playbook sends you an alert if your Microsoft Sentinel workspace exceeds a budget, which you define, within a given timeframe.

The Microsoft Sentinel GitHub community provides the [`Send-IngestionCostAlert`](https://github.com/iwafula025/Azure-Sentinel/tree/master/Playbooks/Send-IngestionCostAlert) cost management playbook on GitHub. This playbook is activated by a recurrence trigger, and gives you a high level of flexibility. You can control execution frequency, ingestion volume, and the message to trigger, based on your requirements.

## Managage and monitor costs for the Data lake tier

Once onboarded, usage of data lake tier capabilities will being to be billed using new Microsoft Sentienl data lake meters. For more infromation on the new meters, see [Data lake tier](billing.md#data-lake-tier).

Starting with the data lake Public Preview, we are releasing a set of cost management experiences that we are working to expand as we progress towards General Availability.

### Microsoft Sentinel Cost Management in the Microsoft Defender portal

The new Cost Management experience, currently in preview, under **Microsoft Sentinel > Cost Management** in the [Microsoft Defender portal](https://security.microsoft.com), helps you manage and monitor costs associated with your use of the data lake tier.

On the overview page, you will find entry points to relevant cost tracking capabilities, as well as a direct link to usage reports and settings, to help you navigate to the cost management action most relevant to you.

1. Usage reports - visualize your usage by capability over time. Can be found under **Currently billed capabilities**.
2. Cost management - leads you to the **Cost Management + Billing** blade in the Azure portal to help track costs and create budgets. For more information on how to use Cost Management + Billing in the Azure portal, see [Start using cost analysis](../cost-management/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
3. Cost forecast - leads you to a forecast report in the **Cost Management + Billing** blade in the Azure portal. For more information on how to use the forecast functionality, see [View forecast costs](/azure/cost-management-billing/costs/cost-analysis-common-uses#view-forecast-costs).
4. Microsoft Sentinel settings - opens the Microsoft Sentinel settings to show your relevant billing information, such as subscription and resource group selected for the data lake.

#### Usage reports

When clicking on one of the capabilities under **Currently billed capabilties**, you will a usage report for that capability that will display a trend line of your billable usage for that capability.
Data is shown for the last 90 days and you can use a filter to adjust the default single month time window. A card will show your total usage for the filtered time period and if enough historic data is available, will also show the trend change compared to the period prior to the one selected in the filter.

:::image type="content" source="media/billing-monitor-costs/usage-report.png" alt-text="Screenshot of a cost management in the Microsoft Defender portal showing a usage graph for data lake ingestion." lightbox="media/billing-monitor-costs/usage-report.png":::

## Using Azure Prepayment with Microsoft Sentinel

You can pay for Microsoft Sentinel charges with your Azure Prepayment credit. However, you can't use Azure Prepayment credit to pay bills to non-Microsoft organizations for their products and services, or for products from the Azure Marketplace.

## Next steps

- [Reduce costs for Microsoft Sentinel](billing-reduce-costs.md)
- Learn [how to optimize your cloud investment with Microsoft Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
- For more tips on reducing Log Analytics data volume, see [Azure Monitor best practices - Cost management](/azure/azure-monitor/best-practices-cost).
