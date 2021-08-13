---
title: Monitor usage and estimated costs in Azure Monitor
description: Get an overview of the process of using the page for Azure Monitor usage and estimated costs.
author: dalekoetke
services: azure-monitor

ms.topic: conceptual
ms.date: 10/28/2019
ms.author: lagayhar
ms.reviewer: Dale.Koetke
---
# Monitor usage and estimated costs in Azure Monitor

This article describes how to view usage and estimated costs across multiple Azure monitoring features. 

## Azure Monitor pricing model

The basic Azure Monitor billing model is a cloud-friendly, consumption-based pricing (pay-as-you-go). You pay for only what you use. Pricing details are available for [alerting, metrics, and notifications](https://azure.microsoft.com/pricing/details/monitor/); [Log Analytics](https://azure.microsoft.com/pricing/details/log-analytics/); and [Application Insights](https://azure.microsoft.com/pricing/details/application-insights/). 

In addition to the pay-as-you-go model for log data, Azure Monitor Log Analytics has Commitment Tiers. They enable you to save as much as 30 percent compared to the pay-as-you-go pricing. Commitment Tiers start at 100 gigabytes (GB) a day. Any usage above the Commitment Tier will be billed at the same price per gigabyte as the Commitment Tier. [Learn more about Commitment Tier pricing](https://azure.microsoft.com/pricing/details/monitor/).

Some customers have access to [legacy Log Analytics pricing tiers](logs/manage-cost-storage.md#legacy-pricing-tiers) and the [legacy Enterprise Application Insights pricing tier](app/pricing.md#legacy-enterprise-per-node-pricing-tier). 

## Azure Monitor costs

There are two phases for understanding costs: estimating costs when you're considering Azure Monitor as your monitoring solution, and then tracking actual costs after deployment. 

### Estimate the costs to manage your environment

If you're not yet using Azure Monitor Logs, you can use the [Azure Monitor pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=monitor) to estimate the cost of using Azure Monitor. Start by entering **Azure Monitor** in the **Search** box, and then selecting the **Azure Monitor** tile. Scroll down the page to **Azure Monitor**, and select one of the options from the **Type** dropdown list:

- **Metrics queries and Alerts**  
- **Log Analytics**
- **Application Insights**

In each of these types, the pricing calculator will help you estimate your likely costs based on your expected utilization.

For example, with Log Analytics, you can enter the number of virtual machines (VMs) and the gigabytes of data that you expect to collect from each VM. Typically, 1 GB to 3 GB of data per month is ingested from an Azure VM. If you're already evaluating Azure Monitor Logs, you can use your data statistics from your own environment. You can determine the [number of monitored VMs](logs/manage-cost-storage.md#understanding-nodes-sending-data) and the [volume of data that your workspace is ingesting](logs/manage-cost-storage.md#understanding-ingested-data-volume).

For Application Insights, if you enable the **Estimate data volume based on application activity** functionality, you can provide inputs about your application (requests per month and page views per month, if you'll collect client-side telemetry). Then the calculator will tell you the median and 90th percentile amount of data that similar applications collect. 

These applications span the range of Application Insights configuration. For example, some have default sampling, some have no sampling, and some have custom sampling. So you still have the control to reduce the volume of data that you ingest far below the median level by using sampling. But this is a starting point to understand what similar customers are seeing. [Learn more about estimating costs for Application Insights](app/pricing.md#estimating-the-costs-to-manage-your-application).

### Track usage and costs

It's important to understand and track your usage after you start using Azure Monitor. A rich set of tools can help facilitate this tracking. 

#### Azure Cost Management + Billing

Azure provides useful functionality in the [Azure Cost Management + Billing](../cost-management-billing/costs/quick-acm-cost-analysis.md?toc=/azure/billing/TOC.json) hub. After you open the hub, select **Cost Management** and select the [scope](../cost-management-billing/costs/understand-work-scopes.md) (the set of resources to investigate). 

To see the Azure Monitor costs for the last 30 days, select the **Daily Costs** tile, select **Last 30 days** under **Relative dates**, and add a filter that selects the service names:

- **Azure Monitor**
- **Application Insights**
- **Log Analytics**
- **Insight and Analytics**

The result is a view like the following example:

![Screenshot that shows Azure Cost Management with cost information.](./media/usage-estimated-costs/010.png)

You can drill in from this accumulated cost summary to get the finer details in the **Cost by resource** view. In the current pricing tiers, Azure log data is charged on the same set of meters whether it originates from Log Analytics or Application Insights. 

To separate costs from your Log Analytics or Application Insights usage, you can add a filter on **Resource type**. To see all Application Insights costs, filter **Resource type** to **microsoft.insights/components**. For Log Analytics costs, filter **Resource type** to **microsoft.operationalinsights/workspaces**. 

More details about your usage is available if you [download your usage from the Azure portal](../cost-management-billing/understand/download-azure-daily-usage.md). In the downloaded Excel spreadsheet, you can see usage per Azure resource per day. You can find usage from your Application Insights resources by filtering on the **Meter Category** column to show **Application Insights** and **Log Analytics**. Then add a **contains microsoft.insights/components** filter on the **Instance ID** column. 

Most Application Insights usage is reported on meters with **Log Analytics** for **Meter Category**, because there's a single log back end for all Azure Monitor components. Only Application Insights resources on legacy pricing tiers and multiple-step web tests are reported with **Application Insights** for **Meter Category**. The usage is shown in the **Consumed Quantity** column, and the unit for each entry is shown in the **Unit of Measure** column. More details are available to help you [understand your Microsoft Azure bill](../cost-management-billing/understand/review-individual-bill.md). 

#### Usage and estimated costs

Another option for viewing your Azure Monitor usage is the **Usage and estimated costs** page in the Monitor hub. This page shows the usage of core monitoring features such as [alerting, metrics, and notifications](https://azure.microsoft.com/pricing/details/monitor/); [Azure Log Analytics](https://azure.microsoft.com/pricing/details/log-analytics/); and [Azure Application Insights](https://azure.microsoft.com/pricing/details/application-insights/). For customers on the pricing plans available before April 2018, this page also includes Log Analytics usage purchased through the Insights and Analytics offer.

On this page, users can view their resource usage for the past 31 days, aggregated per subscription. Drill-ins show usage trends over the 31-day period. A lot of data needs to come together for this estimate, so please be patient as the page loads.

This example shows monitoring usage and an estimate of the resulting costs:

![Screenshot of the Azure portal that shows usage and estimated costs.](./media/usage-estimated-costs/001.png)

Select the link in the **MONTHLY USAGE** column to open a chart that shows usage trends over the last 31-day period: 

![Screenshot that shows a bar chart for included data volume per node.](./media/usage-estimated-costs/002.png)

> [!NOTE]
> Using **Cost Management** in the **Azure Cost Management + Billing** hub is the preferred approach to broadly understanding monitoring costs.  The **Usage and estimated costs** experiences for [Log Analytics](logs/manage-cost-storage.md#understand-your-usage-and-estimate-costs)  and [Application Insights](app/pricing.md#understand-your-usage-and-estimate-costs) provide deeper insights for each of those parts of Azure Monitor.

## Operations Management Suite subscription entitlements

Customers who purchased Microsoft Operations Management Suite E1 and E2 are eligible for per-node data ingestion entitlements for [Log Analytics](https://www.microsoft.com/cloud-platform/operations-management-suite) and [Application Insights](app/pricing.md). For customers to receive these entitlements for Log Analytics workspaces or Application Insights resources in a subscription: 

- Log Analytics workspaces should use the Per-Node (OMS) pricing tier.
- Application Insights resources should use the Enterprise pricing tier.

Depending on the number of nodes of the suite that your organization purchased, moving some subscriptions into a Per GB (pay-as-you-go) pricing tier might be advantageous, but this requires careful consideration.

> [!TIP]
> If your organization has Microsoft Operations Management Suite E1 or E2, it's usually best to keep your Log Analytics workspaces in the Per-Node (OMS) pricing tier, and your Application Insights resources in the Enterprise pricing tier. 
>

## Next steps

Get cost information for specific components of Azure Monitor:

- [Manage usage and costs with Azure Monitor Logs](logs/manage-cost-storage.md) describes how to control your costs by changing your data retention period, and how to analyze and alert on your data usage.
- [Manage usage and costs for Application Insights](app/pricing.md) describes how to analyze data usage in Application Insights.