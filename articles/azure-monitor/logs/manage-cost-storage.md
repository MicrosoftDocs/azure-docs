---
title: Manage usage and costs for Azure Monitor Logs
description: Learn how to change the pricing plan and manage data volume and retention policy for your Log Analytics workspace in Azure Monitor.
services: azure-monitor
documentationcenter: azure-monitor
author: bwren
manager: carmonm
editor: ''
ms.assetid: 
ms.service: azure-monitor
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 02/18/2022
ms.author: bwren
ms.custom: devx-track-azurepowershell
---
 
# Manage usage and costs with Azure Monitor Logs

> [!NOTE]
> This article describes how to understand and control your costs for Azure Monitor Logs. A related article, [Monitoring usage and estimated costs](..//usage-estimated-costs.md) describes how to view usage and estimated costs across multiple Azure monitoring features using [Azure Cost Management + Billing](../logs/manage-cost-storage.md#viewing-log-analytics-usage-on-your-azure-bill). All prices and costs in this article are for example purposes only. 

Azure Monitor Logs is designed to scale and support collecting, indexing, and storing massive amounts of data per day from any source in your enterprise or deployed in Azure.  Although this might be a primary driver for your organization, cost-efficiency is ultimately the underlying driver. To that end, it's important to understand that the cost of a Log Analytics workspace isn't based only on the volume of data collected; it's also dependent on the selected plan, and how long you stored data generated from your connected sources.  

This article reviews how you can proactively monitor ingested data volume and storage growth. It also discusses how to define limits to control those associated costs. 





## Estimating the costs to manage your environment 

If you're not yet using Azure Monitor Logs, you can use the [Azure Monitor pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=monitor) to estimate the cost of using Log Analytics. In the **Search** box, enter "Azure Monitor", and then select the resulting Azure Monitor tile. Scroll down the page to **Azure Monitor**, and then expand the **Log Analytics** section. Here you can enter the GB of data that you expect to collect. If you're already evaluating Azure Monitor Logs, you can use data statistics from your own environment. See below for how to determine the [number of monitored VMs](#understanding-nodes-sending-data) and the [volume of data your workspace is ingesting](#understanding-ingested-data-volume). If you're not yet running Log Analytics, here is some guidance for estimating data volumes:

1. **Monitoring VMs:** with typical monitoring enabled, 1 GB to 3 GB of data month is ingested per monitored VM. 
2. **Monitoring Azure Kubernetes Service (AKS) clusters:** details on expected data volumes for monitoring a typical AKS cluster are available [here](../containers/container-insights-cost.md#estimating-costs-to-monitor-your-aks-cluster). Follow these [best practices](../containers/container-insights-cost.md#controlling-ingestion-to-reduce-cost) to control your AKS cluster monitoring costs. 
3. **Application monitoring:** the Azure Monitor pricing calculator includes a data volume estimator using on your application's usage and based on a statistical analysis of  Application Insights data volumes. In the Application Insights section of the pricing calculator, toggle the switch next to "Estimate data volume based on application activity" to use this. 

## Viewing Log Analytics usage on your Azure bill 

The easiest way to view your billed usage for a particular Log Analytics workspace is to go to the **Overview** page of the workspace and click **View Cost** in the upper right corner of the Essentials section at the top of the page. This will launch the Cost Analysis from Azure Cost Management + Billing already scoped to this workspace.  You might need additional access to Cost Management data ([learn more](../../cost-management-billing/costs/assign-access-acm-data.md))

Alternatively, you can start in the [Azure Cost Management + Billing](../../cost-management-billing/costs/quick-acm-cost-analysis.md?toc=%2fazure%2fbilling%2fTOC.json) hub. here you can use the "Cost analysis" functionality to view your Azure resource expenses. To track your Log Analytics expenses, you can add a filter by "Resource type" (to microsoft.operationalinsights/workspace for Log Analytics and microsoft.operationalinsights/cluster for Log Analytics Clusters). For **Group by**, select **Meter category** or **Meter**. Other services, like Microsoft Defender for Cloud and Microsoft Sentinel, also bill their usage against Log Analytics workspace resources. To see the mapping to the service name, you can select the Table view instead of a chart. 

<a name="export-usage"></a>
<a name="download-usage"></a>

To gain more understanding of your usage, you can [download your usage from the Azure portal](../../cost-management-billing/understand/download-azure-daily-usage.md). For step-by-step instructions, review this [tutorial](../../cost-management-billing/costs/tutorial-export-acm-data.md).
In the downloaded spreadsheet, you can see usage per Azure resource (for example, Log Analytics workspace) per day. In this Excel spreadsheet, usage from your Log Analytics workspaces can be found by first filtering on the "Meter Category" column to show "Log Analytics", "Insight and Analytics" (used by some of the legacy pricing tiers), and "Azure Monitor" (used by commitment tier pricing tiers), and then adding a filter on the "Instance ID" column that is "contains workspace" or "contains cluster" (the latter to include Log Analytics Cluster usage). The usage is shown in the "Consumed Quantity" column, and the unit for each entry is shown in the "Unit of Measure" column. For more information, see [Review your individual Azure subscription bill](../../cost-management-billing/understand/review-individual-bill.md). 










|                                                             


                           


## Viewing data allocation benefits

To view data allocation benefits from sources such as [Microsoft Defender for Servers](https://azure.microsoft.com/pricing/details/defender-for-cloud/), [Microsoft Sentinel benefit for Microsoft 365 E5, A5, F5 and G5 customers](https://azure.microsoft.com/offers/sentinel-microsoft-365-offer/), or the [Sentinel Free Trial](https://azure.microsoft.com/pricing/details/microsoft-sentinel/), you need to [export your usage details](#viewing-log-analytics-usage-on-your-azure-bill). Open the exported usage spreadsheet and filter the "Instance ID" column to your workspace. (To select all of your workspaces in the spreadsheet, filter the Instance ID column to "contains /workspaces/".) Next, filter the ResourceRate column to show only rows where this is equal to zero. Now you will see the data allocations from these various sources. 

> [!NOTE]
> Data allocations from Defender for Servers 500 MB/server/day will appear in rows with the meter name "Data Included per Node" and the meter category to "Insight and Analytics" (the name of a legacy offer still used with this meter.)  If the workspace is in the legacy Per Node Log Analytics pricing tier, this meter will also include the data allocations from this Log Analytics pricing tier.


## Data transfer charges using Log Analytics

Sending data to Log Analytics might incur data bandwidth charges. However, that's limited to Virtual Machines where a Log Analytics agent is installed and doesn't apply when using Diagnostics settings or with other connectors that are built in to Microsoft Sentinel. As described in the [Azure Bandwidth pricing page](https://azure.microsoft.com/pricing/details/bandwidth/), data transfer between Azure services located in two regions is charged as outbound data transfer at the normal rate. Inbound data transfer is free. However, this charge is very small compared to the costs for Log Analytics data ingestion. So, controlling costs for Log Analytics needs to focus on your [ingested data volume](#understanding-ingested-data-volume). 

## Troubleshooting why Log Analytics is no longer collecting data

If you're on the legacy Free pricing tier and have sent more than 500 MB of data in a day, data collection stops for the rest of the day. Reaching the daily limit is a common reason that Log Analytics stops collecting data, or data appears to be missing. Log Analytics creates an **Operation** type event when data collection starts and stops. Run the following query in search to check whether you're reaching the daily limit and missing data: 

```kusto
Operation | where OperationCategory == 'Data Collection Status'
```

When data collection stops, the **OperationStatus** is **Warning**. When data collection starts, the **OperationStatus** is **Succeeded**. The following table lists reasons that data collection stops and a suggested action to resume data collection.

|Reason collection stops| Solution| 
|-----------------------|---------|
|Daily cap of your workspace was reached|Wait for collection to automatically restart, or increase the daily data volume limit described in manage the maximum daily data volume. The daily cap reset time is shows on the **Daily Cap** page. |
| Your workspace has hit the [Data Ingestion Volume Rate](../service-limits.md#log-analytics-workspaces) | The default ingestion volume rate limit for data sent from Azure resources using diagnostic settings is approximately 6 GB/min per workspace. This is an approximate value because the actual size can vary between data types, depending on the log length and its compression ratio. This limit doesn't apply to data that's sent from agents or the Data Collector API. If you send data at a higher rate to a single workspace, some data is dropped, and an event is sent to the Operation table in your workspace every 6 hours while the threshold continues to be exceeded. If your ingestion volume continues to exceed the rate limit or you are expecting to reach it sometime soon, you can request an increase to your workspace by sending an email to LAIngestionRate@microsoft.com or by opening a support request. The event to look for that indicates a data ingestion rate limit can be found by the query `Operation | where OperationCategory == "Ingestion" | where Detail startswith "The rate of data crossed the threshold"`. |
|Daily limit of legacy Free pricing tier  reached |Wait until the following day for collection to automatically restart, or change to a paid pricing tier.|
|Azure subscription is in a suspended state due to:<br> Free trial ended<br> Azure pass expired<br> Monthly spending limit reached (such as on an MSDN or Visual Studio subscription)|Convert to a paid subscription<br> Remove limit, or wait until limit resets|

To be notified when data collection stops, use the steps described in the [Alert when daily cap is reached](#alert-when-daily-cap-is-reached) section. To configure an e-mail, webhook, or runbook action for the alert rule, use the steps described in [create an action group](../alerts/action-groups.md). 

## Limits summary

There are additional Log Analytics limits, some of which depend on the Log Analytics pricing tier. These are documented at [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md#log-analytics-workspaces).


## Next steps

- See [Log searches in Azure Monitor Logs](../logs/log-query-overview.md) to learn how to use the search language. You can use search queries to perform additional analysis on the usage data.
- Use the steps described in [create a new log alert](../alerts/alerts-metric.md) to be notified when a search criteria is met.
- Use [solution targeting](../insights/solution-targeting.md) to collect data from only required groups of computers.
- To configure an effective event collection policy, review [Microsoft Defender for Cloud filtering policy](../../security-center/security-center-enable-data-collection.md).
- Change [performance counter configuration](../agents/data-sources-performance-counters.md).
- To modify your event collection settings, review [event log configuration](../agents/data-sources-windows-events.md).
- To modify your syslog collection settings, review [syslog configuration](../agents/data-sources-syslog.md).
- To modify your syslog collection settings, review [syslog configuration](../agents/data-sources-syslog.md).
