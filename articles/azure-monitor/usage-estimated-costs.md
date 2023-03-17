---
title: Azure Monitor cost and usage
description: Overview of how Azure Monitor is billed and how to estimate and analyze billable usage.
services: azure-monitor
ms.topic: conceptual
ms.reviewer: Dale.Koetke
ms.date: 03/15/2023
---
# Azure Monitor cost and usage

This article describes the different ways that Azure Monitor charges for usage. It also explains how to evaluate charges on your Azure bill and how to estimate charges to monitor your entire environment.

[!INCLUDE [azure-monitor-cost-optimization](../../includes/azure-monitor-cost-optimization.md)]

## Pricing model

Azure Monitor uses consumption-based pricing, which is also known as pay-as-you-go pricing. With this billing model, you only pay for what you use. Features of Azure Monitor that are enabled by default don't incur any charge. These features include collection and alerting on the [Activity log](essentials/activity-log.md) and collection and analysis of [platform metrics](essentials/metrics-supported.md).

Several other features don't have a direct cost, but instead you pay for the ingestion and retention of data that they collect. The following table describes the different types of usage that are charged in Azure Monitor. Detailed pricing for each type is provided in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

| Type | Description |
|:---|:---|
| Logs | Ingestion, retention, and export of data in Log Analytics workspaces and legacy Application Insights resources. For most customers, this category typically incurs the bulk of Azure Monitor charges. There's no charge for querying this data except in the case of [Basic Logs](logs/basic-logs-configure.md) or [Archived Logs](logs/data-retention-archive.md).<br><br>Charges for logs can vary significantly on the configuration that you choose. For information on how charges for logs data are calculated and the different pricing tiers available, see [Azure Monitor logs pricing details](logs/cost-logs.md). |
| Platform logs | Processing of [diagnostic and auditing information](essentials/resource-logs.md) is charged for [certain services](essentials/resource-logs-categories.md#costs) when sent to destinations other than a Log Analytics workspace. There's no direct charge when this data is sent to a Log Analytics workspace, but there's a charge for the workspace data ingestion and collection. |
| Metrics | There's no charge for [standard metrics](essentials/metrics-supported.md) collected from Azure resources. There's a cost for collecting [custom metrics](essentials/metrics-custom-overview.md) and for retrieving metrics from the [REST API](essentials/rest-api-walkthrough.md#retrieve-metric-values). |
| Alerts | Charges are based on the type and number of signals used by the alert rule, its frequency, and the type of [notification](alerts/action-groups.md) used in response. For [Log alerts](alerts/alerts-types.md#log-alerts) configured for [at-scale monitoring](alerts/alerts-types.md#splitting-by-dimensions-in-log-alert-rules), the cost also depends on the number of time series created by the dimensions resulting from your query. |
| Web tests | There's a cost for [standard web tests](app/availability-standard-tests.md) and [multistep web tests](/previous-versions/azure/azure-monitor/app/availability-multistep) in Application Insights. Multistep web tests have been deprecated.

## Data transfer charges

Sending data to Azure Monitor can incur data bandwidth charges. As described in [Bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/), data transfer between Azure services located in two regions is charged as outbound data transfer at the normal rate. Data sent to a different region via [Diagnostic settings](essentials/diagnostic-settings.md) doesn't incur data transfer charges. Inbound data transfer is free. 

Data transfer charges are typically small compared to the costs for data ingestion and retention. Focus on your ingested data volume to control costs for Log Analytics.

## Estimate Azure Monitor usage and costs

If you're new to Azure Monitor, use the [Azure Monitor pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=monitor) to estimate your costs. In the **Search** box, enter **Azure Monitor**, and then select the **Azure Monitor** tile. The pricing calculator helps you estimate your likely costs based on your expected utilization.

The bulk of your costs typically come from data ingestion and retention for your Log Analytics workspaces and Application Insights resources. It's difficult to give accurate estimates for data volumes that you can expect because they'll vary significantly based on your configuration.

A common strategy is to enable monitoring for a small group of resources and use the observed data volumes with the calculator to determine your costs for a full environment.

See [Analyze usage in Log Analytics workspace](logs/analyze-usage.md) for queries and other methods to measure the billable data in your Log Analytics workspace.

Use the following basic guidance for common resources:

- **Virtual machines**: With typical monitoring enabled, a virtual machine generates from 1 GB to 3 GB of data per month. This range is highly dependent on the configuration of your agents.
- **Application Insights**: For different methods to estimate data from your applications, see the following section.
- **Container insights**: For guidance on estimating data for your Azure Kubernetes Service (AKS) cluster, see [Estimating costs to monitor your AKS cluster](containers/container-insights-cost.md#estimating-costs-to-monitor-your-aks-cluster).

The [Azure Monitor pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=monitor) includes data volume estimation calculators for these three cases.

>[!NOTE]
>The billable data volume is calculated by using a customer-friendly, cost-effective method. The billed data volume is defined as the size of the data that will be stored, excluding a set of standard columns and any JSON wrapper that was part of the data received for ingestion. This billable data volume is substantially smaller than the size of the entire JSON-packaged event, often less than 50%.
>
>It's essential to understand this calculation of billed data size when you estimate costs and compare them with other pricing models. For more information on pricing, see [Azure Monitor Logs pricing details](logs/cost-logs.md#data-size-calculation).

## Estimate application usage

There are two methods you can use to estimate the amount of data from an application monitored with Application Insights.

### Learn from what similar applications collect

In the Azure Monitor pricing calculator for Application Insights, enable **Estimate data volume based on application activity**. You use this option to provide inputs about your application. The calculator then tells you the median and 90th percentile amount of data collected by similar applications. These applications span the range of Application Insights configuration, so you can still use options such as [sampling]() to reduce the volume of data you ingest for your application below the median level.

### Data collection when you use sampling

With the ASP.NET SDK's [adaptive sampling](app/sampling.md#adaptive-sampling), the data volume is adjusted automatically to keep within a specified maximum rate of traffic for default Application Insights monitoring.

If the application produces a low amount of telemetry, such as when debugging or because of low usage, items won't be dropped by the sampling processor if the volume is below the configured-events-per-second level.

For a high-volume application, with the default threshold of five events per second, adaptive sampling limits the number of daily events to 432,000. If you consider a typical average event size of 1 KB, this size corresponds to 13.4 GB of telemetry per 31-day month per node hosting your application because the sampling is done locally to each node.

For SDKs that don't support adaptive sampling, you can employ [ingestion sampling](app/sampling.md#ingestion-sampling). This technique samples when the data is received by Application Insights based on a percentage of data to retain. Or you can use [fixed-rate sampling for ASP.NET, ASP.NET Core, and Java websites](app/sampling.md#fixed-rate-sampling) to reduce the traffic sent from your web server and web browsers.

## View Azure Monitor usage and charges

There are two primary tools to view and analyze your Azure Monitor billing and estimated charges:

- [Azure Cost Management + Billing](#azure-cost-management--billing) is the primary tool you'll use to analyze your usage and costs. It gives you multiple options to analyze your monthly charges for different Azure Monitor features and their projected cost over time.
- [Usage and estimated costs](#usage-and-estimated-costs) provides a listing of monthly charges for different Azure Monitor features. This information is useful for Log Analytics workspaces. It helps you to select your pricing tier by showing how your cost would be different at different tiers.

## Azure Cost Management + Billing

Azure Cost Management + Billing includes several built-in dashboards for deep cost analysis like cost by resource and invoice details. To get started analyzing your Azure Monitor charges, open [Cost Management + Billing](../cost-management-billing/costs/quick-acm-cost-analysis.md?toc=/azure/billing/TOC.json) in the Azure portal. Select **Cost Management** > **Cost analysis**. Select your subscription or another [scope](../cost-management-billing/costs/understand-work-scopes.md).

>[!NOTE]
>You might need additional access to cost management data. See [Assign access to cost management data](../cost-management-billing/costs/assign-access-acm-data.md).

To limit the view to Azure Monitor charges, [create a filter](../cost-management-billing/costs/group-filter.md) for the following service names:

- Azure Monitor
- Application Insights
- Log Analytics
- Insight and Analytics

>[!NOTE]
>Usage for Azure Monitor Logs (Log Analytics) can be billed with the **Log Analytics** service (for Pay-as-you-go Data Ingestion and Data Retention), or with the **Azure Monitor** service (for Commitment Tiers, Basic Logs, Search, Search Jobs, Data Archive and Data Export) or with the **Insight and Analytics** service when using the legacy Per Node pricing tier.  Except for a small set of legacy resources, classic Application Insights data ingestion and retention are billed as the **Log Analytics** service. Note then when you change your workspace from a Pay-as-you-go pricing tier to a Commitment Tier, on your bill, the costs will appear to shift from Log Analytics to Azure Monitor, reflecting the service associated to each pricing tier. 

Other services such as Microsoft Defender for Cloud and Microsoft Sentinel also bill their usage against Log Analytics workspace resources, so you might want to add them to your filter. 

To get the most useful view for understanding your cost trends in the **Cost analysis** view, 

1. Select the date range you want to investigate 
2. Select the desired "Granularity" of "Daily" or "Monthly" (not "Accumulated")
3. Set the chart type to "Column (stacked)" in the top right above the chart
4. Set "Group by" to be "Meter"

See [Common cost analysis uses](../cost-management-billing/costs/cost-analysis-common-uses.md) for more information on how to use this Cost analysis view.

![Screenshot that shows Cost Management with cost information.](./media/usage-estimated-costs/010.png)

>[!NOTE]
>Alternatively, you can go to the overview page of a Log Analytics workspace or Application Insights resource and select **View Cost** in the upper-right corner of the **Essentials** section. This option opens **Cost Analysis** from Azure Cost Management + Billing already scoped to the workspace or application.
>
> :::image type="content" source="logs/media/view-bill/view-cost-option.png" lightbox="logs/media/view-bill/view-cost-option.png" alt-text="Screenshot of option to view cost for a Log Analytics workspace.":::

### Download usage

To gain more understanding of your usage, download your usage from the Azure portal. You'll see your usage per Azure resource in the downloaded spreadsheet. See [Tutorial: Create and manage exported data](../cost-management-billing/costs/tutorial-export-acm-data.md) to learn how to automatically create a daily report you can use for regular analysis.

Usage from your Log Analytics workspaces can be found by first filtering on the **Meter Category** column to show **Log Analytics**, **Insight and Analytics** (used by some of the legacy pricing tiers), and **Azure Monitor** (used by commitment-tier pricing tiers). Add a filter on the **Instance ID** column for **contains workspace** or **contains cluster**. The usage is shown in the **Consumed Quantity** column. The unit for each entry is shown in the **Unit of Measure** column.

### Application Insights meters

Most Application Insights usage for both classic and workspace-based resources is reported on meters with **Log Analytics** for **Meter Category** because there's a single log back-end for all Azure Monitor components. Only Application Insights resources on legacy pricing tiers and multiple-step web tests are reported with **Application Insights** for **Meter Category**. The usage is shown in the **Consumed Quantity** column. The unit for each entry is shown in the **Unit of Measure** column. For more information, see [Understand your Microsoft Azure bill](../cost-management-billing/understand/review-individual-bill.md).

To separate costs from your Log Analytics or Application Insights usage, [create a filter](../cost-management-billing/costs/group-filter.md) on **Resource type**. To see all Application Insights costs, filter **Resource type** to **microsoft.insights/components**. For Log Analytics costs, filter **Resource type** to **microsoft.operationalinsights/workspaces**.

## Usage and estimated costs

You can get more usage details about Log Analytics workspaces and Application Insights resources from the **Usage and estimated costs** option for each.

### Log Analytics workspace

To learn about your usage trends and choose the most cost-effective [commitment tier](logs/cost-logs.md#commitment-tiers) for your Log Analytics workspace, select **Usage and estimated costs** from the **Log Analytics workspace** menu in the Azure portal.

:::image type="content" source="logs/media/manage-cost-storage/usage-estimated-cost-dashboard-01.png" alt-text="Screenshot that shows Usage and estimated costs.":::

This view includes:

- Estimated monthly charges based on usage from the past 31 days by using the current pricing tier.<br>
- Estimated monthly charges by using different commitment tiers.<br>
- Billable data ingestion by solution from the past 31 days.

To explore the data in more detail, select the icon in the upper-right corner of either chart to work with the query in Log Analytics.

:::image type="content" source="logs/media/manage-cost-storage/logs.png" lightbox="logs/media/manage-cost-storage/logs.png" alt-text="Screenshot that shows Logs view.":::

### Application Insights

To learn about your usage trends for your classic Application Insights resource, select **Usage and estimated costs** from the **Applications** menu in the Azure portal.

:::image type="content" source="media/usage-estimated-costs/app-insights-usage.png" lightbox="media/usage-estimated-costs/app-insights-usage.png" alt-text="Screenshot that shows Application Insights classic application usage and estimated costs.":::

This view includes:

- Estimated monthly charges based on usage from the past month.<br>
- Billable data ingestion by table from the past month.

To investigate your Application Insights usage more deeply, open the **Metrics** page and add the metric named **Data point volume**. Then select the **Apply splitting** option to split the data by **Telemetry item type**.

## View data allocation benefits

To view data allocation benefits from sources such as [Microsoft Defender for Servers](https://azure.microsoft.com/pricing/details/defender-for-cloud/), [Microsoft Sentinel benefit for Microsoft 365 E5, A5, F5, and G5 customers](https://azure.microsoft.com/offers/sentinel-microsoft-365-offer/), or the [Sentinel Free Trial](https://azure.microsoft.com/pricing/details/microsoft-sentinel/), you need to export your usage details.

Open the exported usage spreadsheet and filter the **Instance ID** column to your workspace. (To select all your workspaces in the spreadsheet, filter the **Instance ID** column to **contains /workspaces/**.) Next, filter the **ResourceRate** column to show only rows where this rate is equal to zero. Now you'll see the data allocations from these various sources.

> [!NOTE]
> Data allocations from Defender for Servers 500 MB/server/day will appear in rows with the meter name **Data Included per Node** and the meter category **Insight and Analytics**. (This name is for a legacy offer still used with this meter.) If the workspace is in the legacy Per-Node Log Analytics pricing tier, this meter also includes the data allocations from this Log Analytics pricing tier.

## Operations Management Suite subscription entitlements

Customers who purchased Operations Management Suite E1 and E2 are eligible for per-node data ingestion entitlements for Log Analytics and Application Insights. Each Application Insights node includes up to 200 MB of data ingested per day (separate from Log Analytics data ingestion), with 90-day data retention at no extra cost.

To receive these entitlements for Log Analytics workspaces or Application Insights resources in a subscription, they must use the Per Node (Operations Management Suite) pricing tier. This entitlement isn't visible in the estimated costs shown in the **Usage and estimated cost** pane.

Depending on the number of nodes of the suite that your organization purchased, moving some subscriptions into a Per GB (pay-as-you-go) pricing tier might be advantageous. This move requires careful consideration.

Also, if you move a subscription to the new Azure monitoring pricing model in April 2018, the Per GB tier is the only tier available. Moving a subscription to the new Azure monitoring pricing model isn't advisable if you have an Operations Management Suite subscription.

> [!TIP]
> If your organization has Operations Management Suite E1 or E2, it's usually best to keep your Log Analytics workspaces in the Per Node (Operations Management Suite) pricing tier and your Application Insights resources in the Enterprise pricing tier.

## Next steps

- For details on how charges are calculated for data in a Log Analytics workspace and different configuration options to reduce your charges, see [Azure Monitor Logs pricing details](logs/cost-logs.md).
- For details on how to analyze the data in your workspace to determine the source of any higher-than-expected usage and opportunities to reduce your amount of data collected, see [Analyze usage in Log Analytics workspace](logs/analyze-usage.md).
- To control your costs by setting a daily limit on the amount of data that can be ingested in a workspace, see [Set daily cap on Log Analytics workspace](logs/daily-cap.md).
- For best practices on how to configure and manage Azure Monitor to minimize your charges, see [Azure Monitor best practices - Cost management](best-practices-cost.md).
