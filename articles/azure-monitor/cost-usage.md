---
title: Azure Monitor cost and usage
description: Overview of how Azure Monitor is billed and how to analyze billable usage.
services: azure-monitor
ms.topic: conceptual
ms.reviewer: Dale.Koetke
ms.date: 11/13/2023
---

# Azure Monitor cost and usage
This article describes the different ways that Azure Monitor charges for usage and how to evaluate charges on your Azure bill.

[!INCLUDE [azure-monitor-cost-optimization](../../includes/azure-monitor-cost-optimization.md)]

## Pricing model
Azure Monitor uses a consumption-based pricing (pay-as-you-go) billing model where you only pay for what you use. Features of Azure Monitor that are enabled by default do not incur any charge, including collection and alerting on the [Activity log](essentials/activity-log.md) and collection and analysis of [platform metrics](essentials/metrics-supported.md). 

Several other features don't have a direct cost, but you instead pay for the ingestion and retention of data that they collect. The following table describes the different types of usage that are charged in Azure Monitor. Detailed current pricing for each is provided in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).


| Type | Description |
|:---|:---|
| Logs | Ingestion, retention, and export of data in [Log Analytics workspaces](logs/log-analytics-workspace-overview.md) and [legacy Application insights resources](app/convert-classic-resource.md). This will typically be the bulk of Azure Monitor charges for most customers. There is no charge for querying this data except in the case of [Basic Logs](logs/basic-logs-configure.md) or [Archived Logs](logs/data-retention-archive.md).<br><br>Charges for Logs can vary significantly on the configuration that you choose. See [Azure Monitor Logs pricing details](logs/cost-logs.md) for details on how charges for Logs data are calculated and the different pricing tiers available. |
| Platform Logs | Processing of [diagnostic and auditing information](essentials/resource-logs.md) is charged for [certain services](essentials/resource-logs-categories.md#costs) when sent to destinations other than a Log Analytics workspace. There's no direct charge when this data is sent to a Log Analytics workspace, but there is a charge for the workspace data ingestion and collection. |
| Metrics | There is no charge for [standard metrics](essentials/metrics-supported.md) collected from Azure resources. There is a cost for collecting [custom metrics](essentials/metrics-custom-overview.md) and for retrieving metrics from the [REST API](essentials/rest-api-walkthrough.md#retrieve-metric-values). |
| Prometheus Metrics | Pricing for [Azure Monitor managed service for Prometheus](essentials/prometheus-metrics-overview.md) is based on [data samples ingested](essentials/prometheus-metrics-enable.md)  and [query samples processed](essentials/azure-monitor-workspace-manage.md#link-a-grafana-workspace). Data is retained for 18 months at no extra charge. |
| Alerts | Alerts are charged based on the type and number of [signals](alerts/alerts-overview.md) used by the alert rule, its frequency, and the type of [notification](alerts/action-groups.md) used in response. For [log alerts](alerts/alerts-unified-log.md) configured for [at scale monitoring](alerts/alerts-unified-log.md#split-by-alert-dimensions), the cost will also depend on the number of time series created by the dimensions resulting from your query. |
| Web tests | There is a cost for [standard web tests](app/availability-standard-tests.md) and [multi-step web tests](app/availability-multistep.md) in Application Insights. Multi-step web tests have been deprecated.


### Data transfer charges 
Sending data to Azure Monitor can incur data bandwidth charges. As described in the [Azure Bandwidth pricing page](https://azure.microsoft.com/pricing/details/bandwidth/), data transfer between Azure services located in two regions charged as outbound data transfer at the normal rate. Inbound data transfer is free. Data transfer charges for Azure Monitor though are typically very small compared to the costs for data ingestion and retention. You should focus more on your ingested data volume to control your costs.

> [!NOTE]
> Data sent to a different region using [Diagnostic Settings](essentials/diagnostic-settings.md) does not incur data transfer charges

## View Azure Monitor usage and charges
There are two primary tools to view, analyze and optimize your Azure Monitor costs. Each is described in detail in the following sections.

| Tool | Description |
|:---|:---|
| [Azure Cost Management + Billing](#azure-cost-management--billing) | Gives you powerful capabilities use to understand your billed costs. There are multiple options to analyze your charges for different Azure Monitor features and their projected cost over time. |
| [Usage and Estimated Costs](#usage-and-estimated-costs) | Provides estimates of log data ingestion costs based on your daily usage patterns to help you optimize to use the most cost-effective logs pricing tier. |


## Azure Cost Management + Billing
To get started analyzing your Azure Monitor charges, open [Cost Management + Billing](../cost-management-billing/costs/quick-acm-cost-analysis.md?toc=/azure/billing/TOC.json) in the Azure portal. This tool includes several built-in dashboards for deep cost analysis like cost by resource and invoice details.  Select **Cost Management** and then **Cost analysis**. Select your subscription or another [scope](../cost-management-billing/costs/understand-work-scopes.md).

>[!NOTE]
>You might need additional access to use Cost Management data. See [Assign access to Cost Management data](../cost-management-billing/costs/assign-access-acm-data.md).


:::image type="content" source="media/usage-estimated-costs/010.png" lightbox="media/usage-estimated-costs/010.png" alt-text="Screenshot that shows Azure Cost Management with cost information.":::

To limit the view to Azure Monitor charges, [create a filter](../cost-management-billing/costs/group-filter.md) for the following **Service names**. See [Azure Monitor billing meter names](cost-meters.md) for the different charges that are included in each service.

- Azure Monitor
- Log Analytics
- Insight and Analytics
- Application Insights

Other services such as Microsoft Defender for Cloud and Microsoft Sentinel also bill their usage against Log Analytics workspace resources, so you might want to add them to your filter. See [Common cost analysis uses](../cost-management-billing/costs/cost-analysis-common-uses.md) for details on using this view.


>[!NOTE]
>Alternatively, you can go to the **Overview** page of a Log Analytics workspace or Application Insights resource and click **View Cost** in the upper right corner of the **Essentials** section. This will launch the **Cost Analysis** from Azure Cost Management + Billing already scoped to the workspace or application.
> :::image type="content" source="logs/media/view-bill/view-cost-option.png" lightbox="logs/media/view-bill/view-cost-option.png" alt-text="Screenshot of option to view cost for Log Analytics workspace.":::

### Automated mails and alerts
Rather than manually analyzing your costs in the Azure portal, you can automate delivery of information using the following methods.

  - **Daily cost analysis emails.** Once you've configured your Cost Analysis view, you should click **Subscribe** at the top of the screen to receive regular email updates from Cost Analysis.
  - **Budget alerts.** To be notified if there are significant increases in your spending, create a [budget alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md) for a single workspace or group of workspaces. 

### Export usage details

To gain deeper understanding of your usage and costs, create exports using **Cost Analysis**. See [Tutorial: Create and manage exported data](../cost-management-billing/costs/tutorial-export-acm-data.md) to learn how to automatically create a daily export you can use for regular analysis.

These exports are in CSV format and will contain a list of daily usage (billed quantity and cost) by resource, billing meter, and several other fields such as [AdditionalInfo](../cost-management-billing/automate/understand-usage-details-fields.md#list-of-fields-and-descriptions). You can use Microsoft Excel to do rich analyses of your usage not possible in the **Cost Analytics** experiences in the portal.

The usage export has both the number of units of usage and their cost. Consequently, you can use this export to see the amount of benefits you are receiving from various offers such as the [Defender for Servers data allowance](logs/cost-logs.md#workspaces-with-microsoft-defender-for-cloud) and the [Microsoft Sentinel benefit for Microsoft 365 E5, A5, F5, and G5 customers](https://azure.microsoft.com/offers/sentinel-microsoft-365-offer/). 

For example, usage from Log Analytics can be found by first filtering on the **Meter Category** column to show 

1. **Log Analytics** (for Pay-as-you-go data ingestion and interactive Data Retention), 
2. **Insight and Analytics** (used by some of the legacy pricing tiers), and 
3. **Azure Monitor** (used by most other Log Analytics features such as Commitment Tiers, Basic Logs ingesting, Data Archive, Search Queries, Search Jobs, etc.) 

Add a filter on the **Instance ID** column for **contains workspace** or **contains cluster**. The usage is shown in the **Consumed Quantity** column. The unit for each entry is shown in the **Unit of Measure** column.

> [!NOTE]
> See [Azure Monitor billing meter names](cost-meters.md) for a reference of the billing meter names used by Azure Monitor in Azure Cost Management + Billing. 


## Usage and estimated costs
You can get additional usage details about Log Analytics workspaces and Application Insights resources from the **Usage and Estimated Costs** option for each.

### Log Analytics workspace
To learn about your usage trends and optimize your costs using the most cost-effective [commitment tier](logs/cost-logs.md#commitment-tiers) for your Log Analytics workspace, select **Usage and Estimated Costs** from the **Log Analytics workspace** menu in the Azure portal. 

:::image type="content" source="media/cost-usage/usage-estimated-cost-dashboard-01.png" lightbox="media/cost-usage/usage-estimated-cost-dashboard-01.png" alt-text="Screenshot of usage and estimated costs screen in Azure portal.":::

This view includes the following:

A. Estimated monthly charges based on usage from the past 31 days using the current pricing tier.<br>
B. Estimated monthly charges using different commitment tiers.<br>
C. Billable data ingestion by solution from the past 31 days.

To explore the data in more detail, click on the icon in the upper-right corner of either chart to work with the query in Log Analytics.  

:::image type="content" source="logs/media/manage-cost-storage/logs.png" lightbox="logs/media/manage-cost-storage/logs.png" alt-text="Screenshot of log query with Usage table in Log Analytics.":::

### Application insights
To learn about your usage trends for your classic Application Insights resource, select **Usage and Estimated Costs** from the **Applications** menu in the Azure portal. 

:::image type="content" source="media/usage-estimated-costs/app-insights-usage.png" lightbox="media/usage-estimated-costs/app-insights-usage.png" alt-text="Screenshot of usage and estimated costs for Application Insights in Azure portal.":::

This view includes the following:

A. Estimated monthly charges based on usage from the past month.<br>
B. Billable data ingestion by table from the past month.

To investigate your Application Insights usage more deeply, open the **Metrics** page, add the metric named *Data point volume*, and then select the *Apply splitting* option to split the data by "Telemetry item type".


## View data allocation benefits

To view data allocation benefits from sources such as [Microsoft Defender for Servers](https://azure.microsoft.com/pricing/details/defender-for-cloud/), [Microsoft Sentinel benefit for Microsoft 365 E5, A5, F5 and G5 customers](https://azure.microsoft.com/offers/sentinel-microsoft-365-offer/), or the [Sentinel Free Trial](https://azure.microsoft.com/pricing/details/microsoft-sentinel/), you need to [export your usage details](#export-usage-details). 

1. Open the exported usage spreadsheet and filter the *Instance ID* column to your workspace. To select all of your workspaces in the spreadsheet, filter the *Instance ID* column to "contains /workspaces/". 
2. Filter the *ResourceRate* column to show only rows where this is equal to zero. Now you will see the data allocations from these various sources. 

> [!NOTE]
> Data allocations from Defender for Servers 500 MB/server/day will appear in rows with the meter name "Data Included per Node" and the meter category to "Insight and Analytics" (the name of a legacy offer still used with this meter.)  If the workspace is in the legacy Per Node Log Analytics pricing tier, this meter will also include the data allocations from this Log Analytics pricing tier.


## Operations Management Suite subscription entitlements

Customers who purchased Microsoft Operations Management Suite E1 and E2 are eligible for per-node data ingestion entitlements for Log Analytics and Application Insights. Each Application Insights node includes up to 200 MB of data ingested per day (separate from Log Analytics data ingestion), with 90-day data retention at no extra cost.

To receive these entitlements for Log Analytics workspaces or Application Insights resources in a subscription, they must use the Per-Node (OMS) pricing tier. This entitlement isn't visible in the estimated costs shown in the Usage and estimated cost pane. 

Depending on the number of nodes of the suite that your organization purchased, moving some subscriptions into a Per GB (pay-as-you-go) pricing tier might be advantageous, but this requires careful consideration.


Also, if you move a subscription to the new Azure monitoring pricing model in April 2018, the Per GB tier is the only tier available. Moving a subscription to the new Azure monitoring pricing model isn't advisable if you have an Operations Management Suite subscription.

> [!TIP]
> If your organization has Microsoft Operations Management Suite E1 or E2, it's usually best to keep your Log Analytics workspaces in the Per-Node (OMS) pricing tier and your Application Insights resources in the Enterprise pricing tier. 
>

## Next steps

- See [Azure Monitor Logs pricing details](logs/cost-logs.md) for details on how charges are calculated for data in a Log Analytics workspace and different configuration options to reduce your charges.
- See [Analyze usage in Log Analytics workspace](logs/analyze-usage.md) for details on analyzing the data in your workspace to determine to source of any higher than expected usage and opportunities to reduce your amount of data collected.
- See [Set daily cap on Log Analytics workspace](logs/daily-cap.md) to control your costs by setting a daily limit on the amount of data that might be ingested in a workspace.
- See [Azure Monitor best practices - Cost management](best-practices-cost.md) for best practices on configuring and managing Azure Monitor to minimize your charges.
