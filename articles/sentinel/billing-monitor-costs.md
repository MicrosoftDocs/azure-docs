---
title: Manage and monitor costs for Microsoft Sentinel
description: Learn how to manage and monitor costs and billing for Microsoft Sentinel by using cost analysis in the Azure portal and other methods.
author: EdB-MSFT
ms.author: edbaynash
ms.custom: subject-cost-optimization
ms.topic: how-to
ms.date: 03/29/2026
ms.collection: usx-security
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal


#Customer intent: As a cloud administrator, I want to manage and monitor costs for Microsoft Sentinel so that I can optimize spending and prevent budget overruns.

---

# Manage and monitor costs for Microsoft Sentinel

After you start using Microsoft Sentinel resources, use built-in Cost Management features to confidently manage budgets, monitor costs and security performance. You can also review forecasted costs and identify spending trends to optimize. With the Sentinel data lake enabled, you can also view your usage directly in the Microsoft Defender portal.

Microsoft Sentinel costs are only a portion of your monthly Azure bill. Although this article explains how to manage and monitor costs for Microsoft Sentinel, you're billed for all Azure services and resources your Azure subscription uses, including Partner services.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Prerequisites

To view cost data and perform cost analysis in Cost Management, you must have a supported Azure account type, with at least read access.

While cost analysis in Cost Management supports most Azure account types, not all are supported. To view the full list of supported account types, see [Understand Cost Management data](../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

For information about assigning access to Microsoft Cost Management data, see [Assign access to data](../cost-management/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Manage and monitor costs for the analytics tier

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

   The costs shown in the following image are for illustrative purposes only. They're not intended to reflect actual costs.

   :::image type="content" source="media/billing-monitor-costs/cost-management.png" alt-text="Screenshot of a cost management + billing cost analysis screen." lightbox="media/billing-monitor-costs/cost-management.png":::

You could also apply further controls. For example, to view only the costs associated with Microsoft Sentinel, select **Add filter**, select **Service name**, and then select the service names **Sentinel**, **Log Analytics**, and **Azure Monitor**.

Microsoft Sentinel analytics tier data ingestion volumes appear under **Security Insights** in some portal Usage Charts.

The Microsoft Sentinel classic pricing tiers don't include Log Analytics charges, so you might see those charges billed separately. Microsoft Sentinel simplified pricing combines the two costs into one set of tiers. To learn more about Microsoft Sentinel's pricing tiers, see [Understand the full billing model for Microsoft Sentinel](billing.md#understand-the-full-billing-model-for-microsoft-sentinel).

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

### Deploy a workbook to visualize data ingestion into the analytics tier

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

You can create budgets with filters for specific resources or services in Azure if you want finer granularity in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you more money. For more information about the filter options available when you create a budget, see [Group and filter options](../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

### Use a playbook for cost management alerts

To help you control your Analytics tier budget, you can create a cost management playbook. The playbook sends you an alert if your Microsoft Sentinel workspace exceeds a budget, which you define, within a given timeframe.

The Microsoft Sentinel GitHub community provides the [`Send-IngestionCostAlert`](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Send-IngestionCostAlert) cost management playbook on GitHub. This playbook is activated by a recurrence trigger, and gives you a high level of flexibility. You can control execution frequency, ingestion volume, and the message to trigger, based on your requirements.

## Manage and monitor costs for the data lake tier

Once onboarded, usage of data lake tier capabilities is billed using new Microsoft Sentinel data lake meters. For more information on the new meters, see [Data lake tier](billing.md#data-lake-tier).

### Microsoft Sentinel cost management in the Microsoft Defender portal

The new cost management experience, currently in preview and under **Microsoft Sentinel** > **Cost management** in the [Microsoft Defender portal](https://security.microsoft.com), helps you manage and monitor costs associated with your use of the data lake tier.

>[!IMPORTANT]
>You must have both the Billing Administrator and Security Administrator roles to access the Sentinel cost management pages. 

#### Usage

The Usage summary lets you visualize usage by capability over time. Select a meter from the **Meters** dropdown to view its usage. Once selected, daily usage is displayed for the chosen time range. By default, data is shown for a single month, but you can adjust the time window using the filter. The summary card shows the total usage for the selected period.

:::image type="content" source="media/billing-monitor-costs/usage-summary-chart.png" alt-text="Screenshot of the Usage summary chart in Microsoft Sentinel cost management." lightbox="media/billing-monitor-costs/usage-summary-chart.png":::

After the summary chart, usage details vary by meter. For **Data lake query** and **Advanced data insights**, usage is split between **interactive analysis** and **scheduled analysis**.

:::image type="content" source="media/billing-monitor-costs/usage-details-by-analysis-type.png" alt-text="Screenshot of usage details split by analysis type for selected meters." lightbox="media/billing-monitor-costs/usage-details-by-analysis-type.png":::

After the charts, a table provides a breakdown of the resources contributing to the selected meter’s usage.

:::image type="content" source="media/billing-monitor-costs/usage-resource-contributors-table.png" alt-text="Screenshot of the usage table showing resources contributing to meter usage." lightbox="media/billing-monitor-costs/usage-resource-contributors-table.png":::

Select a resource to view a detailed breakdown in the side panel.

:::image type="content" source="media/billing-monitor-costs/resource-usage-side-panel.png" alt-text="Screenshot of the side panel with detailed resource usage breakdown." lightbox="media/billing-monitor-costs/resource-usage-side-panel.png":::

#### Notification

The **Configure Policies** wizard lets you set threshold‑based alerts for Microsoft Sentinel data lake capabilities. These policies help you track usage and receive email notifications before unexpected charges occur. Currently, email notifications are sent to the billing administrator who configured the policy.

You can also enable **threshold enforcement** to block usage after a configured limit is exceeded. Enforcement is supported for:

- **Data Lake Query** (interactive KQL queries and jobs)

- **Advanced Data Insights** (notebook runs and notebook jobs)

After enforcement is enabled and the threshold is exceeded, future queries, jobs, or sessions fail. Users see a **Limit exceeded** error indicating that you reached the configured limit.

> [!NOTE]
> Enforcement isn't real time. After a limit is reached, it can take up to **4 hours** for the enforced threshold to take effect.

To configure alerts or enforced thresholds on a capability:

1. In **Microsoft Sentinel** > **Cost management**, select **Configure Policies** in the top right corner.

   :::image type="content" source="media/billing-monitor-costs/configure-policies-button.png" alt-text="Screenshot of the Configure Policies button in Microsoft Sentinel cost management." lightbox="media/billing-monitor-costs/configure-policies-button.png":::

1. On the **Configure Policies** page, select the policy you want to edit.

   :::image type="content" source="media/billing-monitor-costs/configure-policies-page.png" alt-text="Screenshot of the Configure Policies page with a selected policy." lightbox="media/billing-monitor-costs/configure-policies-page.png":::

1. In the **Edit policy** side panel, enter a value for the total threshold.

   :::image type="content" source="media/billing-monitor-costs/edit-policy-total-threshold.png" alt-text="Screenshot of the Edit policy panel with total threshold input." lightbox="media/billing-monitor-costs/edit-policy-total-threshold.png":::

1. Enter an **Alert percentage** to define when email notifications are sent relative to the total threshold.

   :::image type="content" source="media/billing-monitor-costs/edit-policy-alert-percentage.png" alt-text="Screenshot of the alert percentage setting in the Edit policy panel." lightbox="media/billing-monitor-costs/edit-policy-alert-percentage.png":::

1. To block usage after the threshold is exceeded, enable **Enforcement.**

   :::image type="content" source="media/billing-monitor-costs/edit-policy-enforcement-toggle.png" alt-text="Screenshot of the enforcement toggle enabled in the Edit policy panel." lightbox="media/billing-monitor-costs/edit-policy-enforcement-toggle.png":::

1. Review your settings and select **Submit.**

   :::image type="content" source="media/billing-monitor-costs/configure-policies-submit.png" alt-text="Screenshot of submitting policy settings in the Configure Policies workflow." lightbox="media/billing-monitor-costs/configure-policies-submit.png":::

1. After enforcement is enabled and usage exceeds the configured threshold, supported actions fail. For KQL and Notebooks, users see a **Limit exceeded** error.

   :::image type="content" source="media/billing-monitor-costs/limit-exceeded-error.png" alt-text="Screenshot of the Limit exceeded error after threshold enforcement is triggered." lightbox="media/billing-monitor-costs/limit-exceeded-error.png":::

## Using Azure Prepayment with Microsoft Sentinel

You can pay for Microsoft Sentinel charges with your Azure Prepayment credit. You can't use Azure Prepayment credit to pay non-Microsoft organizations for their products and services, or for products from Azure Marketplace.

## Next steps

- [Reduce costs for Microsoft Sentinel](billing-reduce-costs.md)
- Learn [how to optimize your cloud investment with Microsoft Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
- For more tips on reducing Log Analytics data volume, see [Azure Monitor best practices - Cost management](/azure/azure-monitor/best-practices-cost).
