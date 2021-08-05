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
ms.date: 07/29/2021
ms.author: bwren 
ms.custom: devx-track-azurepowershell
---
 
# Manage usage and costs with Azure Monitor Logs	

> [!NOTE]
> This article describes how to understand and control your costs for Azure Monitor Logs. A related article, [Monitoring usage and estimated costs](../usage-estimated-costs.md), describes how to view usage and estimated costs across multiple Azure monitoring features for different pricing models. All prices and costs in this article are for example purposes only. 

Azure Monitor Logs is designed to scale and support collecting, indexing, and storing massive amounts of data per day from any source in your enterprise or deployed in Azure.  Although this might be a primary driver for your organization, cost-efficiency is ultimately the underlying driver. To that end, it's important to understand that the cost of a Log Analytics workspace isn't based only on the volume of data collected; it's also dependent on the selected plan, and how long you stored data generated from your connected sources.  

This article reviews how you can proactively monitor ingested data volume and storage growth. It also discusses how to define limits to control those associated costs. 

## Pricing model

The default pricing for Log Analytics is a **Pay-As-You-Go** model that's based on ingested data volume and, optionally, for longer data retention. Data volume is measured as the size of the data that will be stored in GB (10^9 bytes). Each Log Analytics workspace is charged as a separate service and contributes to the bill for your Azure subscription. The amount of data ingestion can be considerable, depending on the following factors: 

  - The number of management solutions enabled and their configuration
  - The number of monitored virtual machines (VMs)
  - Type of data collected from each monitored VM 
  
In addition to the Pay-As-You-Go model, Log Analytics has **Commitment Tiers**, which can save you as much as 30 percent compared to the Pay-As-You-Go price. With the commitment tier pricing, you can commit to buy data ingestion starting at 100 GB/day at a lower price than Pay-As-You-Go pricing. Any usage above the commitment level (overage) is billed at that same price per GB as provided by the current commitment tier. The commitment tiers have a 31-day commitment period. During the commitment period, you can change to a higher commitment tier (which restarts the 31-day commitment period), but you can't move back to Pay-As-You-Go or to a lower commitment tier until after you finish the commitment period. Billing for the commitment tiers is done on a daily basis. [Learn more](https://azure.microsoft.com/pricing/details/monitor/) about Log Analytics Pay-As-You-Go and Commitment Tier pricing. 

> [!NOTE]
> Starting June 2, 2021, **Capacity Reservations** are now called **Commitment Tiers**. Data collected above your commitment tier level (overage) is now billed at the same price-per-GB as the current commitment tier level, lowering costs compared to the old method of billing at the Pay-As-You-Go rate, and reducing the need for users with large data volumes to fine-tune their commitment level. There are also three new larger commitment tiers: 1000, 2000, and 5000 GB/day. 

In all pricing tiers, an event's data size is calculated from a string representation of the properties that are stored in Log Analytics for this event, regardless of whether the data is sent from an agent or added during the ingestion process. This includes any [custom fields](custom-fields.md) that are added as data is collected and then stored in Log Analytics. Several properties common to all data types, including some [Log Analytics Standard Properties](./log-standard-columns.md), are excluded in the calculation of the event size. This includes `_ResourceId`, `_SubscriptionId`, `_ItemId`, `_IsBillable`, `_BilledSize` and `Type`. All other properties stored in Log Analytics are included in the calculation of the event size. Some data types are free from data ingestion charges altogether, for example the [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity), [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat), [Usage](/azure/azure-monitor/reference/tables/usage) and [Operation](/azure/azure-monitor/reference/tables/operation) types. To determine whether an event was excluded from billing for data ingestion, you can use the [_IsBillable](log-standard-columns.md#_isbillable) property as shown [below](#data-volume-for-specific-events). Usage is reported in GB (1.0E9 bytes). 


Also, some solutions, such as [Azure Defender (Security Center)](https://azure.microsoft.com/pricing/details/azure-defender/), [Azure Sentinel](https://azure.microsoft.com/pricing/details/azure-sentinel/), and [Configuration management](https://azure.microsoft.com/pricing/details/automation/) have their own pricing models. 

### Log Analytics Dedicated Clusters

[Log Analytics Dedicated Clusters](logs-dedicated-clusters.md) are collections of workspaces in a single managed Azure Data Explorer cluster to support advanced scenarios, like [Customer-Managed Keys](customer-managed-keys.md). Log Analytics Dedicated Clusters use the same commitment tier pricing model as workspaces, except that a cluster must have a commitment level of at least 500 GB/day. There is no Pay-As-You-Go option for clusters. The cluster commitment tier has a 31-day commitment period after the commitment level is increased. During the commitment period, the commitment tier level can't be reduced, but it can be increased at any time. When workspaces are associated to a cluster, the data ingestion billing for those workspaces is done at the cluster level using the configured commitment tier level. Learn more about [creating a Log Analytics Clusters](customer-managed-keys.md#create-cluster) and [associating workspaces to it](customer-managed-keys.md#link-workspace-to-cluster). For information about commitment tier pricing, see the [Azure Monitor pricing page]( https://azure.microsoft.com/pricing/details/monitor/).

The cluster commitment tier level is programmatically configured with Azure Resource Manager using the `Capacity` parameter under `Sku`. The `Capacity` is specified in units of GB and can have values of 500, 1000, 2000 or 5000 GB/day. Any usage above the commitment level (overage) is billed at that same price per GB as provided by the current commitment tier.  For more information, see [Azure Monitor customer-managed key](customer-managed-keys.md).

There are two modes of billing for usage on a cluster. These can be specified by the `billingType` parameter when [creating a cluster](logs-dedicated-clusters.md#creating-a-cluster) or set after creation. The two modes are: 

- **Cluster**: in this case (which is the default), billing for ingested data is done at the cluster level. The ingested data quantities from each workspace associated to a cluster are aggregated to calculate the daily bill for the cluster. Per-node allocations from [Azure Defender (Security Center)](../../security-center/index.yml) are applied at the workspace level prior to this aggregation of aggregated data across all workspaces in the cluster. 

- **Workspaces**: the commitment tier costs for your cluster are attributed proportionately to the workspaces in the cluster, by each workspace's data ingestion volume (after accounting for per-node allocations from [Azure Defender (Security Center)](../../security-center/index.yml) for each workspace.) If the total data volume ingested into a cluster for a day is less than the commitment tier, each workspace is billed for its ingested data at the effective per-GB commitment tier rate by billing them a fraction of the commitment tier, and the unused part of the commitment tier is billed to the cluster resource. If the total data volume ingested into a cluster for a day is more than the commitment tier, each workspace is billed for a fraction of the commitment tier, based on its fraction of the ingested data that day and each workspace for a fraction of the ingested data above the commitment tier. If the total data volume ingested into a workspace for a day is above the commitment tier, nothing is billed to the cluster resource.

In cluster billing options, data retention is billed for each workspace. Cluster billing starts when the cluster is created, regardless of whether workspaces are associated with the cluster. Workspaces associated to a cluster no longer have their own pricing tier.

## Estimating the costs to manage your environment 

If you're not yet using Azure Monitor Logs, you can use the [Azure Monitor pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=monitor) to estimate the cost of using Log Analytics. In the **Search** box, enter "Azure Monitor", and then select the resulting Azure Monitor tile. Scroll down the page to **Azure Monitor**, and then select **Log Analytics** in the **Type** dropdown list. Here you can enter the number of virtual machines and the number of gigabytes of data that you expect to collect from each VM. Typically, 1 GB to 3 GB of data per month is ingested from a typical Azure Virtual Machine. If you're already evaluating Azure Monitor Logs, you can use data statistics from your own environment. See below for how to determine the [number of monitored VMs](#understanding-nodes-sending-data) and the [volume of data your workspace is ingesting](#understanding-ingested-data-volume). 

If you're not yet running Log Analytics, here is some guidance for estimating data volumes:

1. **Monitoring VMs:** with typical monitoring enabled, 1 GB to 3 GB of data month is ingested per monitored VM. 
2. **Monitoring Azure Kubernetes Service (AKS) clusters:** details on expected data volumes for monitoring a typical AKS cluster are available [here](../containers/container-insights-cost.md#estimating-costs-to-monitor-your-aks-cluster). Follow these [best practices](../containers/container-insights-cost.md#controlling-ingestion-to-reduce-cost) to control your AKS cluster monitoring costs. 
3. **Application monitoring:** the Azure Monitor pricing calculator includes a data volume estimator using on your application's usage and based on a statistical analysis of  Application Insights data volumes. In the Application Insights section of the pricing calculator, toggle the switch next to "Estimate data volume based on application activity" to use this. 

## Understand your usage and estimate costs

If you're using Azure Monitor Logs now, it's easy to understand what the costs are likely be, based on recent usage patterns. To do this, use **Log Analytics Usage and Estimated Costs** to review and analyze data usage. This shows how much data is collected by each solution, how much data is being retained, and an estimate of your costs based on the amount of data ingested and any additional retention beyond the included amount.

:::image type="content" source="media/manage-cost-storage/usage-estimated-cost-dashboard-01.png" alt-text="Usage and estimated costs":::

To explore your data in more detail, select on the icon in the upper-right corner of either chart on the **Usage and Estimated Costs** page. Now you can work with this query to explore more details of your usage.  

:::image type="content" source="media/manage-cost-storage/logs.png" alt-text="Logs view":::

From the **Usage and Estimated Costs** page, you can review your data volume for the month. This includes all the billable data received and retained in your Log Analytics workspace.  
 
Log Analytics charges are added to your Azure bill. You can see details of your Azure bill under the **Billing** section of the Azure portal or in the [Azure Billing Portal](https://account.windowsazure.com/Subscriptions).  

## Viewing Log Analytics usage on your Azure bill 

Azure provides a great deal of useful functionality in the [Azure Cost Management + Billing](../../cost-management-billing/costs/quick-acm-cost-analysis.md?toc=%2fazure%2fbilling%2fTOC.json) hub. For example, you can use the "Cost analysis" functionality to view your Azure resource expenses. To track your Log Analytics expenses, you can add a filter by "Resource type" (to microsoft.operationalinsights/workspace for Log Analytics and microsoft.operationalinsights/cluster for Log Analytics Clusters). For **Group by**, select **Meter category** or **Meter**. Other services, like Azure Defender (Security Center) and Azure Sentinel, also bill their usage against Log Analytics workspace resources. To see the mapping to the service name, you can select the Table view instead of a chart. 

To gain more understanding of your usage, you can [download your usage from the Azure portal](../../cost-management-billing/understand/download-azure-daily-usage.md). 
In the downloaded spreadsheet, you can see usage per Azure resource (for example, Log Analytics workspace) per day. In this Excel spreadsheet, usage from your Log Analytics workspaces can be found by first filtering on the "Meter Category" column to show "Log Analytics", "Insight and Analytics" (used by some of the legacy pricing tiers), and "Azure Monitor" (used by commitment tier pricing tiers), and then adding a filter on the "Instance ID" column that is "contains workspace" or "contains cluster" (the latter to include Log Analytics Cluster usage). The usage is shown in the "Consumed Quantity" column, and the unit for each entry is shown in the "Unit of Measure" column. For more information, see [Review your individual Azure subscription bill](../../cost-management-billing/understand/review-individual-bill.md). 

## Changing pricing tier

To change the Log Analytics pricing tier of your workspace:

1. In the Azure portal, open **Usage and estimated costs** from your workspace; you'll see a list of each of the pricing tiers available to this workspace.

2. Review the estimated costs for each pricing tier. This estimate is based on the last 31 days of usage, so this cost estimate relies on the last 31 days being representative of your typical usage. In the example below, you can see how, based on the data patterns from the last 31 days, this workspace would cost less in the Pay-As-You-Go tier (#1) compared to the 100 GB/day commitment tier (#2).  

:::image type="content" source="media/manage-cost-storage/pricing-tier-estimated-costs.png" alt-text="Pricing tiers":::
    
3. After reviewing the estimated costs based on the last 31 days of usage, if you decide to change the pricing tier, select **Select**.  

### Changing pricing tier via ARM

You can also [set the pricing tier via Azure Resource Manager](./resource-manager-workspace.md) using the `sku` object to set the pricing tier, and the `capacityReservationLevel` parameter if the pricing tier is `capacityresrvation`. (Learn more about [setting workspace properties via ARM](/azure/templates/microsoft.operationalinsights/2020-08-01/workspaces?tabs=json#workspacesku-object).) Here is a sample Azure Resource Manager template to set your workspace to a 300 GB/day commitment tier (in Resource Manager, it's called `capacityreservation`). 

```
{
  "$schema": https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#,
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "name": "YourWorkspaceName",
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2020-08-01",
      "location": "yourWorkspaceRegion",
      "properties": {
                    "sku": {
                      "name": "capacityreservation",
                      "capacityReservationLevel": 300
                    }
      }
    }
  ]
}
```

To use this template in PowerShell, after [installing the Azure Az PowerShell module](/powershell/azure/install-az-ps), sign in to Azure using `Connect-AzAccount`, select the subscription containing your workspace using `Select-AzSubscription -SubscriptionId YourSubscriptionId`, and apply the template (saved in a file named template.json):

```
New-AzResourceGroupDeployment -ResourceGroupName "YourResourceGroupName" -TemplateFile "template.json"
```

To set the pricing tier to other values such as Pay-As-You-Go (called `pergb2018` for the SKU), omit the `capacityReservationLevel` property. Learn more about [creating ARM templates](../../azure-resource-manager/templates/template-tutorial-create-first-template.md),  [adding a resource to your template](../../azure-resource-manager/templates/template-tutorial-add-resource.md), and [applying templates](../resource-manager-samples.md). 

## Legacy pricing tiers

Subscriptions that contained a Log Analytics workspace or Application Insights resource on April 2, 2018, or are linked to an Enterprise Agreement that started before February 1, 2019 and is still active, will continue to have access to use the legacy pricing tiers: **Free Trial**, **Standalone (Per GB)**, and **Per Node (OMS)**. Workspaces in the Free Trial pricing tier will have daily data ingestion limited to 500 MB (except for security data types collected by [Azure Defender (Security Center)](../../security-center/index.yml)) and the data retention is limited to seven days. The Free Trial pricing tier is intended only for evaluation purposes. No SLA is provided for the Free tier.  Workspaces in the Standalone or Per Node pricing tiers have user-configurable retention from 30 to 730 days.

Usage on the Standalone pricing tier is billed by the ingested data volume. It is reported in the **Log Analytics** service and the meter is named "Data Analyzed". 

The Per Node pricing tier charges per monitored VM (node) on an hour granularity. For each monitored node, the workspace is allocated 500 MB of data per day that's not billed. This allocation is calculated with hourly granularity and is aggregated at the workspace level each day. Data ingested above the aggregate daily data allocation is billed per GB as data overage. On your bill, the service will be **Insight and Analytics** for Log Analytics usage if the workspace is in the Per Node pricing tier. Usage is reported on three meters:

- **Node**: this is usage for the number of monitored nodes (VMs) in units of node months.
- **Data Overage per Node**: this is the number of GB of data ingested in excess of the aggregated data allocation.
- **Data Included per Node**: this is the amount of ingested data that was covered by the aggregated data allocation. This meter is also used when the workspace is in all pricing tiers to show the amount of data covered by the Azure Defender (Security Center).

> [!TIP]
> If your workspace has access to the **Per Node** pricing tier but you're wondering whether it would cost less in a Pay-As-You-Go tier, you can [use the query below](#evaluating-the-legacy-per-node-pricing-tier) to easily get a recommendation. 

Workspaces created before April 2016 can also access the original **Standard** and **Premium** pricing tiers that have fixed data retention of 30 days and 365 days, respectively. New workspaces can't be created in the **Standard** or **Premium** pricing tiers, and if a workspace is moved out of these tiers, it can't be moved back. Data ingestion meters for these legacy tiers are called "Data analyzed."

There are also some behaviors between the use of legacy Log Analytics tiers and how usage is billed for [Azure Defender (Security Center)](../../security-center/index.yml). 

- If the workspace is in the legacy Standard or Premium tier, Azure Defender is billed only for Log Analytics data ingestion, not per node.
- If the workspace is in the legacy Per Node tier, Azure Defender is billed using the current [Azure Defender node-based pricing model](https://azure.microsoft.com/pricing/details/security-center/). 
- In other pricing tiers (including commitment tiers), if Azure Defender was enabled before June 19, 2017, Azure Defender is billed only for Log Analytics data ingestion. Otherwise, Azure Defender is billed using the current Azure Defender node-based pricing model.

More details of pricing tier limitations are available at [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md#log-analytics-workspaces).

None of the legacy pricing tiers have regional-based pricing.  

> [!NOTE]
> To use the entitlements that come from purchasing OMS E1 Suite, OMS E2 Suite, or OMS Add-On for System Center, choose the Log Analytics *Per Node* pricing tier.

## Log Analytics and Azure Defender (Security Center)

[Azure Defender (Security Center)](../../security-center/index.yml) billing is closely tied to Log Analytics billing. Azure Defender provides 500 MB/node/day allocation against the following subset of [security data types](/azure/azure-monitor/reference/tables/tables-category#security) (WindowsEvent, SecurityAlert, SecurityBaseline, SecurityBaselineSummary, SecurityDetection, SecurityEvent, WindowsFirewall, MaliciousIPCommunication, LinuxAuditLog, SysmonEvent, ProtectionStatus) and the Update and UpdateSummary data types when the Update Management solution isn't running on the workspace or solution targeting is enabled ([learn more](../../security-center/security-center-pricing.md#what-data-types-are-included-in-the-500-mb-data-daily-allowance)). If the workspace is in the legacy Per Node pricing tier, the Azure Defender and Log Analytics allocations are combined and applied jointly to all billable ingested data.  

## Change the data retention period

The following steps describe how to configure how long log data is kept by in your workspace. Data retention at the workspace level can be configured from 30 to 730 days (2 years) for all workspaces unless they're using the legacy Free Trial pricing tier. Retention for individual data types can be set as low as 4 days. [Learn more](https://azure.microsoft.com/pricing/details/monitor/) about pricing for longer data retention. To retain data longer than 730 days, consider using [Log Analytics workspace data export](logs-data-export.md).

### Workspace level default retention

To set the default retention for your workspace:
 
1. In the Azure portal, from your workspace, select **Usage and estimated costs** in the left pane.
2. On the **Usage and estimated costs** page, select **Data Retention** at the top of the page.
3. On the pane, move the slider to increase or decrease the number of days, and then select **OK**.  If you're on the *free* tier, you can't modify the data retention period; you need to upgrade to the paid tier to control this setting.

:::image type="content" source="media/manage-cost-storage/manage-cost-change-retention-01.png" alt-text="Change workspace data retention setting":::

When the retention is lowered, there's a grace period of several days before the data older than the new retention setting is removed. 

The **Data Retention** page allows retention settings of 30, 31, 60, 90, 120, 180, 270, 365, 550, and 730 days. If another setting is required, that can be configured using [Azure Resource Manager](./resource-manager-workspace.md) using the `retentionInDays` parameter. When you set the data retention to 30 days, you can trigger an immediate purge of older data using the `immediatePurgeDataOn30Days` parameter (eliminating the grace period). This might be useful for compliance-related scenarios where immediate data removal is imperative. This immediate purge functionality is only exposed via Azure Resource Manager. 

Workspaces with 30 days retention might actually retain data for 31 days. If it's imperative that data be kept for only 30 days, use the Azure Resource Manager to set the retention to 30 days and with the `immediatePurgeDataOn30Days` parameter.  

By default, two data types - `Usage` and `AzureActivity` - are retained for a minimum of 90 days at no charge. If the workspace retention is increased to more than 90 days, the retention of these data types is also increased. These data types are also free from data ingestion charges. 

Data types from workspace-based Application Insights resources (`AppAvailabilityResults`, `AppBrowserTimings`, `AppDependencies`, `AppExceptions`, `AppEvents`, `AppMetrics`, `AppPageViews`, `AppPerformanceCounters`, `AppRequests`, `AppSystemEvents`, and `AppTraces`) are also retained for 90 days at no charge by default. Their retention can be adjusted using the retention by data type functionality. 

The Log Analytics [purge API](/rest/api/loganalytics/workspacepurge/purge) doesn't affect retention billing and is intended to be used for very limited cases. To reduce your retention bill, the retention period must be reduced either for the workspace or for specific data types. 

### Retention by data type

It's also possible to specify different retention settings for individual data types from 4 to 730 days (except for workspaces in the legacy Free Trial pricing tier) that override the workspace-level default retention. Each data type is a sub-resource of the workspace. For example, the SecurityEvent table can be addressed in [Azure Resource Manager](../../azure-resource-manager/management/overview.md) as:

```
/subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent
```

Note that the data type (table) is case-sensitive. To get the current per-data-type retention settings of a particular data type (in this example SecurityEvent), use:

```JSON
    GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent?api-version=2017-04-26-preview
```

> [!NOTE]
> Retention is only returned for a data type if the retention is explicitly set for it. Data types that don't have retention explicitly set (and thus inherit the workspace retention) don't return anything from this call. 

To get the current per-data-type retention settings for all data types in your workspace that have had their per-data-type retention set, just omit the specific data type, for example:

```JSON
    GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables?api-version=2017-04-26-preview
```

To set the retention of a particular data type (in this example SecurityEvent) to 730 days, use:

```JSON
    PUT /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent?api-version=2017-04-26-preview
    {
        "properties": 
        {
            "retentionInDays": 730
        }
    }
```

Valid values for `retentionInDays` are from 30 through 730.

The `Usage` and `AzureActivity` data types can't be set with custom retention. They take on the maximum of the default workspace retention or 90 days. 

A great tool to connect directly to Azure Resource Manager to set retention by data type is the OSS tool [ARMclient](https://github.com/projectkudu/ARMClient).  Learn more about ARMclient from articles by [David Ebbo](http://blog.davidebbo.com/2015/01/azure-resource-manager-client.html) and Daniel Bowbyes.  Here's an example using ARMClient, setting SecurityEvent data to a 730-day retention:

```
armclient PUT /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent?api-version=2017-04-26-preview "{properties: {retentionInDays: 730}}"
```

> [!TIP]
> Setting retention on individual data types can be used to reduce your costs for data retention. For data collected starting in October 2019 (when this feature was released), reducing the retention for some data types can reduce your retention cost over time. For data collected earlier, setting a lower retention for an individual type won't affect your retention costs.  

## Manage your maximum daily data volume

You can configure a daily cap and limit the daily ingestion for your workspace, but use care because your goal shouldn't be to hit the daily limit. Otherwise, you lose data for the remainder of the day, which can impact other Azure services and solutions whose functionality may depend on up-to-date data being available in the workspace. As a result, your ability to observe and receive alerts when the health conditions of resources supporting IT services are impacted. The daily cap is intended to be used as a way to manage an **unexpected increase** in data volume from your managed resources and stay within your limit, or when you want to limit unplanned charges for your workspace. It's not appropriate to set a daily cap so that it's met each day on a workspace.

Each workspace has its daily cap applied on a different hour of the day. The reset hour is shown in the **Daily Cap** page (see below). This reset hour can't be configured. 

Soon after the daily limit is reached, the collection of billable data types stops for the rest of the day. Latency inherent in applying the daily cap means that the cap isn't applied at precisely the specified daily cap level. A warning banner appears across the top of the page for the selected Log Analytics workspace, and an operation event is sent to the *Operation* table under the **LogManagement** category. Data collection resumes after the reset time defined under *Daily limit will be set at*. We recommend defining an alert rule that's based on this operation event, configured to notify when the daily data limit is reached. For more information, see [Alert when daily cap is reached](#alert-when-daily-cap-is-reached) section. 

> [!NOTE]
> The daily cap can't stop data collection at precisely the specified cap level and some excess data is expected, particularly if the workspace is receiving high volumes of data. If data is collected above the cap, it's still billed. For a query that is helpful in studying the daily cap behavior, see the [View the effect of the Daily Cap](#view-the-effect-of-the-daily-cap) section in this article. 

> [!WARNING]
> The daily cap doesn't stop the collection of data types **WindowsEvent**, **SecurityAlert**, **SecurityBaseline**, **SecurityBaselineSummary**, **SecurityDetection**, **SecurityEvent**, **WindowsFirewall**, **MaliciousIPCommunication**, **LinuxAuditLog**, **SysmonEvent**, **ProtectionStatus**, **Update**, and **UpdateSummary**, except for workspaces in which Azure Defender (Security Center) was installed before June 19, 2017. 

### Identify what daily data limit to define

To understand the data ingestion trend and the daily volume cap to define, review [Log Analytics Usage and estimated costs](../usage-estimated-costs.md). Consider it with care, because you can't monitor your resources after the limit is reached. 

### Set the daily cap

The following steps describe how to configure a limit to manage the volume of data that Log Analytics workspace will ingest per day.  

1. From your workspace, select **Usage and estimated costs** in the left pane.
2. On the **Usage and estimated costs** page for the selected workspace, select **Data Cap** at the top of the page. 
3. By default, **Daily cap** is set to **OFF**. To enable it, select **ON**, and then set the data volume limit in GB/day.

:::image type="content" source="media/manage-cost-storage/set-daily-volume-cap-01.png" alt-text="Log Analytics configure data limit":::
	
You can use Azure Resource Manager to configure the daily cap. To configure it, set the `dailyQuotaGb` parameter under `WorkspaceCapping` as described at [Workspaces - Create Or Update](/rest/api/loganalytics/workspaces/createorupdate#workspacecapping). 

You can track changes made to the daily cap using this query:

```kusto
_LogOperation | where Operation == "Workspace Configuration" | where Detail contains "Daily quota"
```

Learn more about the [_LogOperation](./monitor-workspace.md) function. 

### View the effect of the daily cap

To view the effect of the daily cap, it's important to account for the security data types that aren't included in the daily cap, and the reset hour for your workspace. The daily cap reset hour is visible on the **Daily Cap** page. The following query can be used to track the data volumes that are subject to the daily cap between daily cap resets. In this example, the workspace's reset hour is 14:00. You'll need to update this for your workspace.

```kusto
let DailyCapResetHour=14;
Usage
| where Type !in ("SecurityAlert", "SecurityBaseline", "SecurityBaselineSummary", "SecurityDetection", "SecurityEvent", "WindowsFirewall", "MaliciousIPCommunication", "LinuxAuditLog", "SysmonEvent", "ProtectionStatus", "WindowsEvent")
| extend TimeGenerated=datetime_add("hour",-1*DailyCapResetHour,TimeGenerated)
| where TimeGenerated > startofday(ago(31d))
| where IsBillable
| summarize IngestedGbBetweenDailyCapResets=sum(Quantity)/1000. by day=bin(TimeGenerated, 1d) | render areachart  
```

(In the Usage data type, the units of `Quantity` are in MB.)

### Alert when daily cap is reached

Azure portal has a visual cue when your data limit threshold is met, but this behavior doesn't necessarily align to how you manage operational issues that require immediate attention. To receive an alert notification, you can create a new alert rule in Azure Monitor. To learn more, see [how to create, view, and manage alerts](../alerts/alerts-metric.md).

To get you started, here are the recommended settings for the alert querying the `Operation` table using the `_LogOperation` function ([learn more](./monitor-workspace.md)). 

- Target: Select your Log Analytics resource
- Criteria: 
   - Signal name: Custom log search
   - Search query: `_LogOperation | where Operation == "Data collection Stopped" | where Detail contains "OverQuota"`
   - Based on: Number of results
   - Condition: Greater than
   - Threshold: 0
   - Period: 5 (minutes)
   - Frequency: 5 (minutes)
- Alert rule name: Daily data limit reached
- Severity: Warning (Sev 1)

After an alert is defined and the limit is reached, an alert is triggered and performs the response defined in the Action Group. It can notify your team in the following ways:

- Email and text messages
- Automated actions using webhooks
- Azure Automation runbooks
- [Integrated with an external ITSM solution](../alerts/itsmc-definition.md#create-itsm-work-items-from-azure-alerts). 

## Troubleshooting why usage is higher than expected

Higher usage is caused by one, or both, of the following:
- More nodes than expected sending data to Log Analytics workspace. For information, see the [Understanding nodes sending data](#understanding-nodes-sending-data) section of this article.
- More data than expected being sent to Log Analytics workspace (perhaps due to starting to use a new solution or a configuration change to an existing solution). For information, see the [Understanding ingested data volume](#understanding-ingested-data-volume) section of this article.

If you observe high data ingestion reported using the `Usage` records (see the [Data volume by solution](#data-volume-by-solution) section), but you don't observe the same results summing `_BilledSize` directly on the [data type](#data-volume-for-specific-events), it's possible that you have significant late-arriving data. For information about how to diagnose this, see the [Late arriving data](#late-arriving-data) section of this article. 

### Log Analytics Workspace Insights

Start understanding your data volumes in the **Usage** tab of the [Log Analytics Workspace Insights workbook](log-analytics-workspace-insights-overview.md). On the **Usage Dashboard**, you can easily see:
- Which data tables are ingesting the most data volume in the main table,  
- What are the top resources contributing data, and 
- What is the trend of data ingestion.

You can pivot to the **Additional Queries** to easily execution more queries useful to understanding your data patterns. 

Learn more about the [capabilities of the Usage tab](log-analytics-workspace-insights-overview.md#usage-tab). 

While this workbook can answer many of the questions without even needing to run a query, to answer more specific questions or do deeper analyses, the queries in the next two sections will help to get you started. 

## Understanding nodes sending data

To understand the number of nodes that are reporting heartbeats from the agent each day in the last month, use this query:

```kusto
Heartbeat 
| where TimeGenerated > startofday(ago(31d))
| summarize nodes = dcount(Computer) by bin(TimeGenerated, 1d)    
| render timechart
```
The get a count of nodes sending data in the last 24 hours, use this query: 

```kusto
find where TimeGenerated > ago(24h) project Computer
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| summarize nodes = dcount(computerName)
```

To get a list of nodes sending any data (and the amount of data sent by each), use this query:

```kusto
find where TimeGenerated > ago(24h) project _BilledSize, Computer
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| summarize TotalVolumeBytes=sum(_BilledSize) by computerName
```

### Nodes billed by the legacy Per Node pricing tier

The [legacy Per Node pricing tier](#legacy-pricing-tiers) bills for nodes with hourly granularity and also doesn't count nodes that are only sending a set of security data types. Its daily count of nodes would be close to the following query:

```kusto
find where TimeGenerated >= startofday(ago(7d)) and TimeGenerated < startofday(now()) project Computer, _IsBillable, Type, TimeGenerated
| where Type !in ("SecurityAlert", "SecurityBaseline", "SecurityBaselineSummary", "SecurityDetection", "SecurityEvent", "WindowsFirewall", "MaliciousIPCommunication", "LinuxAuditLog", "SysmonEvent", "ProtectionStatus", "WindowsEvent")
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| where _IsBillable == true
| summarize billableNodesPerHour=dcount(computerName) by bin(TimeGenerated, 1h)
| summarize billableNodesPerDay = sum(billableNodesPerHour)/24., billableNodeMonthsPerDay = sum(billableNodesPerHour)/24./31.  by day=bin(TimeGenerated, 1d)
| sort by day asc
```

The number of units on your bill is in units of node months, which is represented by `billableNodeMonthsPerDay` in the query. 
If the workspace has the Update Management solution installed, add the **Update** and **UpdateSummary** data types to the list in the where clause in the above query. Finally, there's some additional complexity in the actual billing algorithm when solution targeting is used that's not represented in the above query. 


> [!TIP]
> Use these `find` queries sparingly because scans across data types are [resource intensive](./query-optimization.md#query-performance-pane) to execute. If you don't need results **per computer**, then query on the **Usage** data type (see below).

## Understanding ingested data volume

On the **Usage and Estimated Costs** page, the *Data ingestion per solution* chart shows the total volume of data sent and how much is being sent by each solution. You can determine trends like whether the overall data usage (or usage by a particular solution) is growing, remaining steady, or decreasing. 

### Data volume for specific events

To look at the size of ingested data for a particular set of events, you can query the specific table (in this example `Event`) and then restrict the query to the events of interest (in this example event ID 5145 or 5156):

```kusto
Event
| where TimeGenerated > startofday(ago(31d)) and TimeGenerated < startofday(now()) 
| where EventID == 5145 or EventID == 5156
| where _IsBillable == true
| summarize count(), Bytes=sum(_BilledSize) by EventID, bin(TimeGenerated, 1d)
``` 

Note that the clause `where _IsBillable = true` filters out data types from certain solutions for which there is no ingestion charge. [Learn more](./log-standard-columns.md#_isbillable) about `_IsBillable`.

### Data volume by solution

The query used to view the billable data volume by solution over the last month (excluding the last partial day) can be built using the [Usage](/azure/azure-monitor/reference/tables/usage) data type as:

```kusto
Usage 
| where TimeGenerated > ago(32d)
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000. by bin(StartTime, 1d), Solution 
| render columnchart
```

The clause with `TimeGenerated` is only to ensure that the query experience in the Azure portal looks back beyond the default 24 hours. When using the **Usage** data type, `StartTime` and `EndTime` represent the time buckets for which results are presented. 

### Data volume by type

You can drill in further to see data trends for by data type:

```kusto
Usage 
| where TimeGenerated > ago(32d)
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000. by bin(StartTime, 1d), DataType 
| render columnchart
```

Or to see a table by solution and type for the last month,

```kusto
Usage 
| where TimeGenerated > ago(32d)
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000 by Solution, DataType
| sort by Solution asc, DataType asc
```

### Data volume by computer

The **Usage** data type doesn't include information at the computer level. To see the **size** of ingested billable data per computer, use the **_BilledSize** [property](./log-standard-columns.md#_billedsize), which provides the size in bytes:

```kusto
find where TimeGenerated > ago(24h) project _BilledSize, _IsBillable, Computer, Type
| where _IsBillable == true and Type != "Usage"
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| summarize BillableDataBytes = sum(_BilledSize) by  computerName 
| sort by BillableDataBytes desc nulls last
```

The **_IsBillable** [property](./log-standard-columns.md#_isbillable) specifies whether the ingested data will incur charges. The **Usage** type is omitted because this is only for analytics of data trends. 

To see the **count** of billable events ingested per computer, use 

```kusto
find where TimeGenerated > ago(24h) project _IsBillable, Computer
| where _IsBillable == true and Type != "Usage"
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| summarize eventCount = count() by computerName  
| sort by eventCount desc nulls last
```

> [!TIP]
> Use these `find` queries sparingly because scans across data types are [resource intensive](./query-optimization.md#query-performance-pane) to execute. If you don't need results **per computer**, query on the **Usage** data type.

### Data volume by Azure resource, resource group, or subscription

For data from nodes hosted in Azure, you can get the **size** of ingested data __per computer__, use the [_ResourceId property](./log-standard-columns.md#_resourceid), which provides the full path to the resource:

```kusto
find where TimeGenerated > ago(24h) project _ResourceId, _BilledSize, _IsBillable
| where _IsBillable == true 
| summarize BillableDataBytes = sum(_BilledSize) by _ResourceId | sort by BillableDataBytes nulls last
```

For data from nodes hosted in Azure, you can get the **size** of ingested data __per Azure subscription__ by using the **_SubscriptionId** property as:

```kusto
find where TimeGenerated > ago(24h) project _BilledSize, _IsBillable, _SubscriptionId
| where _IsBillable == true 
| summarize BillableDataBytes = sum(_BilledSize) by _SubscriptionId | sort by BillableDataBytes nulls last
```

To get data volume by resource group, you can parse **_ResourceId**:

```kusto
find where TimeGenerated > ago(24h) project _ResourceId, _BilledSize, _IsBillable
| where _IsBillable == true 
| summarize BillableDataBytes = sum(_BilledSize) by _ResourceId
| extend resourceGroup = tostring(split(_ResourceId, "/")[4] )
| summarize BillableDataBytes = sum(BillableDataBytes) by resourceGroup | sort by BillableDataBytes nulls last
```

If needed, you can also parse the **_ResourceId** more fully:

```Kusto
| parse tolower(_ResourceId) with "/subscriptions/" subscriptionId "/resourcegroups/" 
    resourceGroup "/providers/" provider "/" resourceType "/" resourceName   
```

> [!TIP]
> Use these `find` queries sparingly because scans across data types are [resource intensive](./query-optimization.md#query-performance-pane) to execute. If you don't need results per subscription, resouce group, or resource name, query on the **Usage** data type.

> [!WARNING]
> Some of the fields of the **Usage** data type, while still in the schema, have been deprecated and their values are no longer populated. 
> These are **Computer**, as well as fields related to ingestion (**TotalBatches**, **BatchesWithinSla**, **BatchesOutsideSla**, **BatchesCapped** and **AverageProcessingTimeMs**).

## Late-arriving data 	

Situations can arise where data is ingested with old timestamps. For example, if an agent can't communicate to Log Analytics because of a connectivity issue or when a host has an incorrect time date/time. This can manifest itself by an apparent discrepancy between the ingested data reported by the **Usage** data type and a query summing **_BilledSize** over the raw data for a particular day specified by **TimeGenerated**, the timestamp when the event was generated.

To diagnose late-arriving data issues, use the **_TimeReceived** column ([learn more](./log-standard-columns.md#_timereceived)) in addition to the **TimeGenerated** column. **_TimeReceived** is the time when the record was received by the Azure Monitor ingestion point in the Azure cloud. For example, when using the **Usage** records, you have observed high ingested data volumes of **W3CIISLog** data on May 2, 2021, here is a query that identifies the timestamps on this ingested data: 

```Kusto
W3CIISLog
| where TimeGenerated > datetime(1970-01-01)
| where _TimeReceived >= datetime(2021-05-02) and _TimeReceived < datetime(2021-05-03) 
| where _IsBillable == true
| summarize BillableDataMB = sum(_BilledSize)/1.E6 by bin(TimeGenerated, 1d)
| sort by TimeGenerated asc 
```

The `where TimeGenerated > datetime(1970-01-01)` statement is present only to provide the clue to the Log Analytics user interface to look over all data.  

## Querying for common data types

To dig deeper into the source of data for a particular data type, here are some useful example queries:

+ **Workspace-based Application Insights** resources
  - Learn more at [Manage usage and costs for Application Insights](../app/pricing.md#data-volume-for-workspace-based-application-insights-resources)
+ **Security** solution
  - `SecurityEvent | summarize AggregatedValue = count() by EventID`
+ **Log Management** solution
  - `Usage | where Solution == "LogManagement" and iff(isnotnull(toint(IsBillable)), IsBillable == true, IsBillable == "true") == true | summarize AggregatedValue = count() by DataType`
+ **Perf** data type
  - `Perf | summarize AggregatedValue = count() by CounterPath`
  - `Perf | summarize AggregatedValue = count() by CounterName`
+ **Event** data type
  - `Event | summarize AggregatedValue = count() by EventID`
  - `Event | summarize AggregatedValue = count() by EventLog, EventLevelName`
+ **Syslog** data type
  - `Syslog | summarize AggregatedValue = count() by Facility, SeverityLevel`
  - `Syslog | summarize AggregatedValue = count() by ProcessName`
+ **AzureDiagnostics** data type
  - `AzureDiagnostics | summarize AggregatedValue = count() by ResourceProvider, ResourceId`

## Tips for reducing data volume

This table lists some suggestions for reducing the volume of logs collected.

| Source of high data volume | How to reduce data volume |
| -------------------------- | ------------------------- |
| Data Collection Rules      | The [Azure Monitor Agent](../agents/azure-monitor-agent-overview.md) uses Data Collection Rules to manage the collection of data. You can [limit the collection of data](../agents/data-collection-rule-azure-monitor-agent.md#limit-data-collection-with-custom-xpath-queries) using custom XPath queries. | 
| Container Insights         | [Configure Container Insights](../containers/container-insights-cost.md#controlling-ingestion-to-reduce-cost) to collect only the data you required. |
| Azure Sentinel | Review any [Sentinel data sources](../../sentinel/connect-data-sources.md) that you recently enabled as sources of additional data volume. [Learn more](../../sentinel/azure-sentinel-billing.md) about Sentinel costs and billing. |
| Security events            | Select [common or minimal security events](../../security-center/security-center-enable-data-collection.md#data-collection-tier). <br> Change the security audit policy to collect only needed events. In particular, review the need to collect events for: <br> - [audit filtering platform](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd772749(v=ws.10)). <br> - [audit registry](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd941614(v%3dws.10)). <br> - [audit file system](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd772661(v%3dws.10)). <br> - [audit kernel object](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd941615(v%3dws.10)). <br> - [audit handle manipulation](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd772626(v%3dws.10)). <br> - audit removable storage. |
| Performance counters       | Change the [performance counter configuration](../agents/data-sources-performance-counters.md) to: <br> - Reduce the frequency of collection. <br> - Reduce the number of performance counters. |
| Event logs                 | Change the [event log configuration](../agents/data-sources-windows-events.md) to: <br> - Reduce the number of event logs collected. <br> - Collect only required event levels. For example, do not collect *Information* level events. |
| Syslog                     | Change the [syslog configuration](../agents/data-sources-syslog.md) to: <br> - Reduce the number of facilities collected. <br> - Collect only required event levels. For example, do not collect *Info* and *Debug* level events. |
| AzureDiagnostics           | Change the [resource log collection](../essentials/diagnostic-settings.md#create-in-azure-portal) to: <br> - Reduce the number of resources that send logs to Log Analytics. <br> - Collect only required logs. |
| Solution data from computers that don't need the solution | Use [solution targeting](../insights/solution-targeting.md) to collect data from only required groups of computers. |
| Application Insights | Review options for [managing Application Insights data volume](../app/pricing.md#managing-your-data-volume). |
| [SQL Analytics](../insights/azure-sql.md) | Use [Set-AzSqlServerAudit](/powershell/module/az.sql/set-azsqlserveraudit) to tune the auditing settings. |

### Getting nodes as billed in the Per Node pricing tier

To get a list of computers that will be billed as nodes if the workspace is in the legacy Per Node pricing tier, look for nodes that are sending **billed data types** (some data types are free). 
To do this, use the [_IsBillable property](./log-standard-columns.md#_isbillable) and use the leftmost field of the fully qualified domain name. This returns the count of computers with billed 
data per hour (which is the granularity at which nodes are counted and billed):

```kusto
find where TimeGenerated > ago(24h) project Computer, TimeGenerated
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| summarize billableNodes=dcount(computerName) by bin(TimeGenerated, 1h) | sort by TimeGenerated asc
```

### Getting Security and Automation node counts

To see the number of distinct Security nodes, you can use the query:

```kusto
union
(
    Heartbeat
    | where (Solutions has 'security' or Solutions has 'antimalware' or Solutions has 'securitycenter')
    | project Computer
),
(
    ProtectionStatus
    | where Computer !in~
    (
        (
            Heartbeat
            | project Computer
        )
    )
    | project Computer
)
| distinct Computer
| project lowComputer = tolower(Computer)
| distinct lowComputer
| count
```

To see the number of distinct Automation nodes, use the query:

```kusto
 ConfigurationData 
 | where (ConfigDataType == "WindowsServices" or ConfigDataType == "Software" or ConfigDataType =="Daemons") 
 | extend lowComputer = tolower(Computer) | summarize by lowComputer 
 | join (
     Heartbeat 
       | where SCAgentChannel == "Direct"
       | extend lowComputer = tolower(Computer) | summarize by lowComputer, ComputerEnvironment
 ) on lowComputer
 | summarize count() by ComputerEnvironment | sort by ComputerEnvironment asc
```

## Evaluating the legacy Per Node pricing tier

The decision of whether workspaces with access to the legacy **Per Node** pricing tier are better off in that tier or in a current **Pay-As-You-Go** or **Commitment Tier**  is often difficult for customers to assess.  This involves understanding the trade-off between the fixed cost per monitored node in the Per Node pricing tier and its included data allocation of 500 MB/node/day and the cost of just paying for ingested data in the Pay-As-You-Go (Per GB) tier. 

To facilitate this assessment, the following query can be used to make a recommendation for the optimal pricing tier based on a workspace's usage patterns. This query looks at the monitored nodes and data ingested into a workspace in the last seven days, and for each day, it evaluates which pricing tier would have been optimal. To use the query, you need to specify:

- Whether the workspace is using Azure Defender (Security Center) by setting **workspaceHasSecurityCenter** to **true** or **false**. 
- Update the prices if you have specific discounts.
- Specify the number of days to look back and analyze by setting **daysToEvaluate**. This is useful if the query is taking too long trying to look at seven days of data. 

Here is the pricing tier recommendation query:

```kusto
// Set these parameters before running query
// Pricing details available at https://azure.microsoft.com/pricing/details/monitor/
let daysToEvaluate = 7; // Enter number of previous days to analyze (reduce if the query is taking too long)
let workspaceHasSecurityCenter = false;  // Specify if the workspace has Azure Security Center
let PerNodePrice = 15.; // Enter your montly price per monitored nodes
let PerNodeOveragePrice = 2.30; // Enter your price per GB for data overage in the Per Node pricing tier
let PerGBPrice = 2.30; // Enter your price per GB in the Pay-as-you-go pricing tier
let CommitmentTier100Price = 196.; // Enter your price for the 100 GB/day commitment tier
let CommitmentTier200Price = 368.; // Enter your price for the 200 GB/day commitment tier
let CommitmentTier300Price = 540.; // Enter your price for the 300 GB/day commitment tier
let CommitmentTier400Price = 704.; // Enter your price for the 400 GB/day commitment tier
let CommitmentTier500Price = 865.; // Enter your price for the 500 GB/day commitment tier
let CommitmentTier1000Price = 1700.; // Enter your price for the 1000 GB/day commitment tier
let CommitmentTier2000Price = 3320.; // Enter your price for the 2000 GB/day commitment tier
let CommitmentTier5000Price = 8050.; // Enter your price for the 5000 GB/day commitment tier
// ---------------------------------------
let SecurityDataTypes=dynamic(["SecurityAlert", "SecurityBaseline", "SecurityBaselineSummary", "SecurityDetection", "SecurityEvent", "WindowsFirewall", "MaliciousIPCommunication", "LinuxAuditLog", "SysmonEvent", "ProtectionStatus", "WindowsEvent", "Update", "UpdateSummary"]);
let StartDate = startofday(datetime_add("Day",-1*daysToEvaluate,now()));
let EndDate = startofday(now());
union * 
| where TimeGenerated >= StartDate and TimeGenerated < EndDate
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| summarize nodesPerHour = dcount(computerName) by bin(TimeGenerated, 1h)  
| summarize nodesPerDay = sum(nodesPerHour)/24.  by day=bin(TimeGenerated, 1d)  
| join kind=leftouter (
    Heartbeat 
    | where TimeGenerated >= StartDate and TimeGenerated < EndDate
    | where Computer != ""
    | summarize ASCnodesPerHour = dcount(Computer) by bin(TimeGenerated, 1h) 
    | extend ASCnodesPerHour = iff(workspaceHasSecurityCenter, ASCnodesPerHour, 0)
    | summarize ASCnodesPerDay = sum(ASCnodesPerHour)/24.  by day=bin(TimeGenerated, 1d)   
) on day
| join (
    Usage 
    | where TimeGenerated >= StartDate and TimeGenerated < EndDate
    | where IsBillable == true
    | extend NonSecurityData = iff(DataType !in (SecurityDataTypes), Quantity, 0.)
    | extend SecurityData = iff(DataType in (SecurityDataTypes), Quantity, 0.)
    | summarize DataGB=sum(Quantity)/1000., NonSecurityDataGB=sum(NonSecurityData)/1000., SecurityDataGB=sum(SecurityData)/1000. by day=bin(StartTime, 1d)  
) on day
| extend AvgGbPerNode =  NonSecurityDataGB / nodesPerDay
| extend OverageGB = iff(workspaceHasSecurityCenter, 
             max_of(DataGB - 0.5*nodesPerDay - 0.5*ASCnodesPerDay, 0.), 
             max_of(DataGB - 0.5*nodesPerDay, 0.))
| extend PerNodeDailyCost = nodesPerDay * PerNodePrice / 31. + OverageGB * PerNodeOveragePrice
| extend billableGB = iff(workspaceHasSecurityCenter,
             (NonSecurityDataGB + max_of(SecurityDataGB - 0.5*ASCnodesPerDay, 0.)), DataGB )
| extend PerGBDailyCost = billableGB * PerGBPrice
| extend CommitmentTier100DailyCost = CommitmentTier100Price + max_of(billableGB - 100, 0.)* CommitmentTier100Price/100.
| extend CommitmentTier200DailyCost = CommitmentTier200Price + max_of(billableGB - 200, 0.)* CommitmentTier200Price/200.
| extend CommitmentTier300DailyCost = CommitmentTier300Price + max_of(billableGB - 300, 0.)* CommitmentTier300Price/300.
| extend CommitmentTier400DailyCost = CommitmentTier400Price + max_of(billableGB - 400, 0.)* CommitmentTier400Price/400.
| extend CommitmentTier500DailyCost = CommitmentTier500Price + max_of(billableGB - 500, 0.)* CommitmentTier500Price/500.
| extend CommitmentTier1000DailyCost = CommitmentTier1000Price + max_of(billableGB - 1000, 0.)* CommitmentTier1000Price/1000.
| extend CommitmentTier2000DailyCost = CommitmentTier2000Price + max_of(billableGB - 2000, 0.)* CommitmentTier2000Price/2000.
| extend CommitmentTier5000DailyCost = CommitmentTier5000Price + max_of(billableGB - 5000, 0.)* CommitmentTier5000Price/5000.
| extend MinCost = min_of(
	PerNodeDailyCost,PerGBDailyCost,CommitmentTier100DailyCost,CommitmentTier200DailyCost,
    CommitmentTier300DailyCost, CommitmentTier400DailyCost, CommitmentTier500DailyCost, CommitmentTier1000DailyCost, CommitmentTier2000DailyCost, CommitmentTier5000DailyCost)
| extend Recommendation = case(
    MinCost == PerNodeDailyCost, "Per node tier",
    MinCost == PerGBDailyCost, "Pay-as-you-go tier",
    MinCost == CommitmentTier100DailyCost, "Commitment tier (100 GB/day)",
    MinCost == CommitmentTier200DailyCost, "Commitment tier (200 GB/day)",
    MinCost == CommitmentTier300DailyCost, "Commitment tier (300 GB/day)",
    MinCost == CommitmentTier400DailyCost, "Commitment tier (400 GB/day)",
    MinCost == CommitmentTier500DailyCost, "Commitment tier (500 GB/day)",
    MinCost == CommitmentTier1000DailyCost, "Commitment tier (1000 GB/day)",
    MinCost == CommitmentTier2000DailyCost, "Commitment tier (2000 GB/day)",
    MinCost == CommitmentTier5000DailyCost, "Commitment tier (5000 GB/day)",
    "Error"
)
| project day, nodesPerDay, ASCnodesPerDay, NonSecurityDataGB, SecurityDataGB, OverageGB, AvgGbPerNode, PerGBDailyCost, PerNodeDailyCost, 
    CommitmentTier100DailyCost, CommitmentTier200DailyCost, CommitmentTier300DailyCost, CommitmentTier400DailyCost, CommitmentTier500DailyCost, CommitmentTier1000DailyCost, CommitmentTier2000DailyCost, CommitmentTier5000DailyCost, Recommendation 
| sort by day asc
//| project day, Recommendation // Comment this line to see details
| sort by day asc
```

This query isn't an exact replication of how usage is calculated, but it provides pricing tier recommendations in most cases.  

> [!NOTE]
> To use the entitlements that come from purchasing OMS E1 Suite, OMS E2 Suite, or OMS Add-On for System Center, choose the Log Analytics *Per Node* pricing tier.

## Create an alert when data collection is high

This section describes how to create an alert when the data volume in the last 24 hours exceeded a specified amount, using Azure Monitor [Log Alerts](../alerts/alerts-unified-log.md). 

To alert if the billable data volume ingested in the last 24 hours was greater than 50 GB: 

- **Define alert condition** specify your Log Analytics workspace as the resource target.
- **Alert criteria** specify the following:
   - **Signal Name** select **Custom log search**
   - **Search query** to `Usage | where IsBillable | summarize DataGB = sum(Quantity / 1000.) | where DataGB > 50`.  
   - **Alert logic** is **Based on** *number of results* and **Condition** is *Greater than* a **Threshold** of *0*
   - **Time period** of *1440* minutes and **Alert frequency** to every *1440* minutes to run once a day.
- **Define alert details** specify the following:
   - **Name** to *Billable data volume greater than 50 GB in 24 hours*
   - **Severity** to *Warning*

To be notified when the log alert matches criteria, specify an existing or create a new [action group](../alerts/action-groups.md).

When you receive an alert, use the steps in the above sections about how to troubleshoot why usage is higher than expected.

## Data transfer charges using Log Analytics

Sending data to Log Analytics might incur data bandwidth charges. However, that's limited to Virtual Machines where a Log Analytics agent is installed and doesn't apply when using Diagnostics settings or with other connectors that are built in to Azure Sentinel. As described in the [Azure Bandwidth pricing page](https://azure.microsoft.com/pricing/details/bandwidth/), data transfer between Azure services located in two regions is charged as outbound data transfer at the normal rate. Inbound data transfer is free. However, this charge is very small compared to the costs for Log Analytics data ingestion. So, controlling costs for Log Analytics needs to focus on your [ingested data volume](#understanding-ingested-data-volume). 

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
- To configure an effective event collection policy, review [Azure Defender (Security Center) filtering policy](../../security-center/security-center-enable-data-collection.md).
- Change [performance counter configuration](../agents/data-sources-performance-counters.md).
- To modify your event collection settings, review [event log configuration](../agents/data-sources-windows-events.md).
- To modify your syslog collection settings, review [syslog configuration](../agents/data-sources-syslog.md).
- To modify your syslog collection settings, review [syslog configuration](../agents/data-sources-syslog.md).
