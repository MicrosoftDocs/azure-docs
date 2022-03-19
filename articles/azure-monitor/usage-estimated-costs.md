---
title: Azure Monitor cost and usage
description: Overview of how Azure Monitor is billed and how to analyze billable usage.
services: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.reviewer: Dale.Koetke
ms.date: 03/11/2022
---
# Azure Monitor cost and usage
The basic Azure Monitor billing model is a cloud-friendly, consumption-based pricing (pay-as-you-go) where you pay for only what you use. The following table describes the different types of usage that are charged in Azure Monitor. Detailed costs are provided in [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

| Type | Description |
|:---|:---|
| Logs | Ingestion, retention, and export of data in Log Analytics workspaces and legacy Application insights resources. There are also costs for retrieving data from tables Configured for [Basic Logs](logs/basic-logs-configure.md) or [Archived Logs](logs/data-retention-archive.md). This will typically be the bulk of Azure Monitor charges for most customers. See [Azure Monitor Logs pricing details](logs/cost-logs.md) or details on how charges for Logs data are calculated. |
| Platform Logs | [Diagnostic and auditing information](essentials/resource-logs.md) charged for [certain services](essentials/resource-logs-categories.md#costs) when sent to destinations other than a Log Analytics workspace. |
| Metrics | There is no charge for [standard metrics](essentials/metrics-supported.md) collected from Azure resources. There is a cost for cost for collecting [custom metrics](essentials/metrics-custom-overview.md) and for retrieving metrics from the [REST API](essentials/rest-api-walkthrough.md#retrieve-metric-values). |
| Alerts | Charged based on the type and number of of signals used by the alert rule, its frequency, and the type of notification used in response.  |
| Multi-step web tests | There is a cost for [multi-step web tests](app/availability-multistep.md) in Application Insights, but this feature has been deprecated.


## Viewing Azure Monitor usage and charges
There are multiple ways to view and analyze your Azure Monitor billing and estimated charges.

- **Azure Cost Management + Billing** gives you multiple options to analyze your monthly charges for different Azure Monitor features and their projected cost over time. This is the primary tool that you'll use to analyze your usage and costs.
- **Usage and Estimated Costs** provides a listing of monthly charges for different Azure Monitor features. For Log Analytics workspaces, it helps you to select your pricing tier by showing how your cost would be different at different tiers.

### Azure Cost Management + Billing
To analyze your Azure Monitor charges, open [Cost Management + Billing](../cost-management-billing/costs/quick-acm-cost-analysis.md?toc=/azure/billing/TOC.json) in the Azure portal. Select **Cost Management** and then **Cost analysis**. Select your subscription or another [scope](../cost-management-billing/costs/understand-work-scopes.md).

>[!NOTE]
>You might need additional access to Cost Management data. See [Assign access to Cost Management data](../cost-management-billing/costs/assign-access-acm-data.md).

To limit the view to Azure Monitor charges, [create a filter](../cost-management-billing/costs/group-filter.md) for the following **Service names**:

- **Azure Monitor**
- **Application Insights**
- **Log Analytics**
- **Insight and Analytics**

Other services such as Microsoft Defender for Cloud and Microsoft Sentinel also bill their usage against Log Analytics workspace resources, so you may want to add them to your filter. See [Common cost analysis uses](../cost-management-billing/costs/cost-analysis-common-uses.md) for details on using this view.

![Screenshot that shows Azure Cost Management with cost information.](./media/usage-estimated-costs/010.png)

>[!NOTE]
>Alternatively, you can go to the **Overview** page of a Log Analytics workspace or Application Insights resource and click **View Cost** in the upper right corner of the **Essentials** section. This will launch the **Cost Analysis** from Azure Cost Management + Billing already scoped to the workspace or application.
> :::image type="content" source="../logs/media/view-bill/view-cost-option.png" lightbox="media/view-bill/view-cost-option.png" alt-text="Screenshot of option to view cost for Log Analytics workspace.":::


### Application Insights meters
Most Application Insights usage is reported on meters with **Log Analytics** for **Meter Category**, because there's a single log back end for all Azure Monitor components. Only Application Insights resources on legacy pricing tiers and multiple-step web tests are reported with **Application Insights** for **Meter Category**. The usage is shown in the **Consumed Quantity** column, and the unit for each entry is shown in the **Unit of Measure** column. See [understand your Microsoft Azure bill](../cost-management-billing/understand/review-individual-bill.md) for more details. 

To separate costs from your Log Analytics or Application Insights usage, [create a filter](../cost-management-billing/costs/group-filter.md)  on **Resource type**. To see all Application Insights costs, filter **Resource type** to **microsoft.insights/components**. For Log Analytics costs, filter **Resource type** to **microsoft.operationalinsights/workspaces**. 


### Download usage
More details about your usage are available if you [download your usage from the Azure portal](../cost-management-billing/understand/download-azure-daily-usage.md). In the downloaded Excel spreadsheet, you can see usage per Azure resource per day. You can find usage from your Application Insights resources by filtering on the **Meter Category** column to show **Application Insights** and **Log Analytics**. Then add a **contains microsoft.insights/components** filter on the **Instance ID** column. 



## Usage and estimated costs

Another option for viewing your Azure Monitor usage is the **Usage and estimated costs** page in the Monitor hub. This page shows the usage of core monitoring features such as [alerting, metrics, and notifications](https://azure.microsoft.com/pricing/details/monitor/); [Azure Log Analytics](https://azure.microsoft.com/pricing/details/log-analytics/); and [Azure Application Insights](https://azure.microsoft.com/pricing/details/application-insights/). For customers on the pricing plans available before April 2018, this page also includes Log Analytics usage purchased through the Insights and Analytics offer.

On this page, users can view their resource usage for the past 31 days, aggregated per subscription. Drill-ins show usage trends over the 31-day period. A lot of data needs to come together for this estimate, so please be patient as the page loads.

This example shows monitoring usage and an estimate of the resulting costs:

![Screenshot of the Azure portal that shows usage and estimated costs.](./media/usage-estimated-costs/001.png)

Select the link in the **MONTHLY USAGE** column to open a chart that shows usage trends over the last 31-day period: 

![Screenshot that shows a bar chart for included data volume per node.](./media/usage-estimated-costs/002.png)



## Estimate Azure Monitor usage and costs
If you're new to Azure Monitor, you can use the [Azure Monitor pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=monitor) to estimate your costs. In the **Search** box, enter "Azure Monitor", and then select the **Azure Monitor** tile. The pricing calculator will help you estimate your likely costs based on your expected utilization.

The bulk of your costs will typically be from data ingestion and retention for your Log Analytics workspaces and Application Insights workspaces. It's difficult to give accurate estimates for data volumes that you can expect since they'll vary based on your configuration. A common strategy is to enable monitoring for a small group of resources and then use those data volumes with the calculator to determine your costs for a full environment. See [Analyze usage in Log Analytics workspace](logs/analyze-usage.md) for queries and other methods to measure the billable data in your Log Analytics workspace.

Following is basic guidance that you can use for common resources:

- **Virtual machines.** With typical monitoring enabled, a virtual machine will generate between 1 GB to 3 GB of data per month. This is highly dependent on the configuration of your agents.
- **Application Insights.** See the following section for different methods to estimate data from your applications.
- **Container insights.** See [Estimating costs to monitor your AKS cluster](containers/container-insights-cost.md#estimating-costs-to-monitor-your-aks-cluster) for guidance on estimating data for your ASK cluster.

## Estimate application usage
There are two methods that you can use to estimate the amount of data from an application:

- Estimate your likely data ingestion based on what other similar applications generate.
- Use of default monitoring and adaptive sampling, which is available in the ASP.NET SDK.

### Learn from what similar applications collect
In the Azure Monitoring Pricing calculator for Application Insights, click to enable the **Estimate data volume based on application activity**. Here you can provide inputs about your application (requests per month and page views per month, in case you'll collect client-side telemetry), and then the calculator will tell you the median and 90th percentile amount of data collected by similar applications. These applications span the range of Application Insights configuration (e.g some have default [sampling](app/sampling.md), some have no sampling etc.), so you still have the control to reduce the volume of data you ingest far below the median level using sampling. 

### Data collection when using sampling
With the ASP.NET SDK's [adaptive sampling](app/sampling.md#adaptive-sampling), the data volume is adjusted automatically to keep within a specified maximum rate of traffic for default Application Insights monitoring. If the application produces a low amount of telemetry, such as when debugging or due to low usage, items won't be dropped by the sampling processor as long as volume is below the configured events per second level. For a high volume application, with the default threshold of five events per second, adaptive sampling will limit the number of daily events to 432,000. Considering a typical average event size of 1 KB, this corresponds to 13.4 GB of telemetry per 31-day month per node hosting your application since the sampling is done local to each node.

For SDKs that don't support adaptive sampling, you can employ [ingestion sampling](app/sampling.md#ingestion-sampling), which samples when the data is received by Application Insights based on a percentage of data to retain, or [fixed-rate sampling for ASP.NET, ASP.NET Core, and Java websites](app/sampling.md#fixed-rate-sampling) to reduce the traffic sent from your web server and web browsers


## Understand your usage and optimizing your pricing tier
To learn about your usage trends and choose the most cost-effective pricing tier for your Log Analytics workspace, select **Usage and Estimated Costs** from the **Log Analytics workspace** menu in the Azure portal. This shows how much data is collected by each solution, how much data is being retained, and an estimate of your costs for each pricing tier based on recent data ingestion patterns. 

:::image type="content" source="logs/media/manage-cost-storage/usage-estimated-cost-dashboard-01.png" alt-text="Usage and estimated costs":::

To explore the data in more detail, click on the icon in the upper-right corner of either chart on the **Usage and Estimated Costs** page. Now you can work with this query to explore more details of your usage.  

:::image type="content" source="logs/media/manage-cost-storage/logs.png" alt-text="Logs view":::

From the **Usage and Estimated Costs** page, you can review your data volume for the month. This includes all the billable data received and retained in your Log Analytics workspace.  
 
Log Analytics charges are added to your Azure bill. You can see details of your Azure bill under the **Billing** section of the Azure portal or in the [Azure Billing Portal](https://account.windowsazure.com/Subscriptions).  





## Operations Management Suite subscription entitlements

Customers who purchased Microsoft Operations Management Suite E1 and E2 are eligible for per-node data ingestion entitlements for [Log Analytics](https://www.microsoft.com/cloud-platform/operations-management-suite) and [Application Insights](app/pricing.md). Each Application Insights node includes up to 200 MB of data ingested per day (separate from Log Analytics data ingestion), with 90-day data retention at no extra cost.

To receive these entitlements for Log Analytics workspaces or Application Insights resources in a subscription, they must be use the Per-Node (OMS) pricing tier. This entitlement isn't visible in the estimated costs shown in the Usage and estimated cost pane. 

Depending on the number of nodes of the suite that your organization purchased, moving some subscriptions into a Per GB (pay-as-you-go) pricing tier might be advantageous, but this requires careful consideration.


Also, if you move a subscription to the new Azure monitoring pricing model in April 2018, the Per GB tier is the only tier available. Moving a subscription to the new Azure monitoring pricing model isn't advisable if you have an Operations Management Suite subscription.

> [!TIP]
> If your organization has Microsoft Operations Management Suite E1 or E2, it's usually best to keep your Log Analytics workspaces in the Per-Node (OMS) pricing tier and your Application Insights resources in the Enterprise pricing tier. 
>

## Next steps

