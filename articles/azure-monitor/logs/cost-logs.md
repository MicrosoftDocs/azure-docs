---
title: Azure Monitor Logs pricing details
description: Cost details for data stored in a Log Analytics workspace in Azure Monitor, including commitment tiers and data size calculation.
ms.topic: conceptual
ms.reviewer: Dale.Koetke
ms.date: 03/24/2022
ms.reviwer: dalek git 
---
 
# Azure Monitor Logs pricing details
The most significant charges for most Azure Monitor implementations will typically be ingestion and retention of data in your Log Analytics workspaces. Several features in Azure Monitor do not have a direct cost but add to the workspace data that's collected. This article describes how data charges are calculated for your Log Analytics workspaces and Application Insights resources and the different configuration options that affect your costs.

## Pricing model
The default pricing for Log Analytics is a Pay-As-You-Go model that's based on ingested data volume and data retention. Each Log Analytics workspace is charged as a separate service and contributes to the bill for your Azure subscription. [Pricing for Log Analytics](https://azure.microsoft.com/pricing/details/monitor/) is set regionally. The amount of data ingestion can be considerable, depending on the following factors:

- The set of management solutions enabled and their configuration
- The number and type of monitored resources
- The types of data collected from each monitored resource

## Data size calculation
Data volume is measured as the size of the data that will be stored in GB (10^9 bytes). The data size of a single record is calculated from a string representation of the columns that are stored in the Log Analytics workspace for that record, regardless of whether the data is sent from an agent or added during the ingestion process. This includes any custom columns added by the [logs ingestion API](logs-ingestion-api-overview.md), [transformations](../essentials/data-collection-transformations.md), or [custom fields](custom-fields.md) that are added as data is collected and then stored in the workspace. 

>[!NOTE]
>The billable data volume calculation is generally substantially smaller than the size of the entire incoming JSON-packaged event. Including the effect of the standard columns excluded from billing, on average across all event types the billed size is around 25% less than the incoming data size. This can be up to 50% for small events. It is essential to understand this calculation of billed data size when estimating costs and comparing to other pricing models. 

### Excluded columns
The following [standard columns](log-standard-columns.md) that are common to all tables, are excluded in the calculation of the record size. All other columns stored in Log Analytics are included in the calculation of the record size. 

- `_ResourceId`
- `_SubscriptionId`
- `_ItemId`
- `_IsBillable`
- `_BilledSize`
- `Type`


### Excluded tables
Some tables are free from data ingestion charges altogether, including [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity), [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat), [Usage](/azure/azure-monitor/reference/tables/usage), [Operation](/azure/azure-monitor/reference/tables/operation). This will always be indicated by the [_IsBillable](log-standard-columns.md#_isbillable) column, which indicates whether a record was excluded from billing for data ingestion. 



### Charges for other solutions and services
Some solutions have more specific policies about free data ingestion. For example [Azure Migrate](https://azure.microsoft.com/pricing/details/azure-migrate/) makes dependency visualization data free for the first 180-days of a Server Assessment. Services such as [Microsoft Defender for Cloud](https://azure.microsoft.com/pricing/details/azure-defender/), [Microsoft Sentinel](https://azure.microsoft.com/pricing/details/azure-sentinel/), and [Configuration management](https://azure.microsoft.com/pricing/details/automation/) have their own pricing models. 

See the documentation for different services and solutions for any unique billing calculations.

## Commitment Tiers
In addition to the Pay-As-You-Go model, Log Analytics has **Commitment Tiers**, which can save you as much as 30 percent compared to the Pay-As-You-Go price. With commitment tier pricing, you can commit to buy data ingestion for a workspace, starting at 100 GB/day, at a lower price than Pay-As-You-Go pricing. Any usage above the commitment level (overage) is billed at that same price per GB as provided by the current commitment tier. The commitment tiers have a 31-day commitment period from the time a commitment tier is selected. 

- During the commitment period, you can change to a higher commitment tier (which restarts the 31-day commitment period), but you can't move back to Pay-As-You-Go or to a lower commitment tier until after you finish the commitment period. 
- At the end of the commitment period, the workspace retains the selected commitment tier, and the workspace can be moved to Pay-As-You-Go or to a different commitment tier at any time. 
 
Billing for the commitment tiers is done per workspace on a daily basis. If the workspace is part of a [dedicated cluster](#dedicated-clusters), the billing is done for the cluster (see below). See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for a detailed listing of the commitment tiers and their prices. 

Azure Commitment Discounts such as those received from [Microsoft Enterprise Agreements](https://www.microsoft.com/licensing/licensing-programs/enterprise) are applied to Azure Monitor Logs Commitment Tier pricing just as they are to Pay-As-You-Go pricing (whether the usage is being billed per workspace or per dedicated cluster). 

> [!TIP]
> The **Usage and estimated costs** menu item for each Log Analytics workspace hows an estimate of your monthly charges at each commitment level. You should periodically review this information to determine if you can reduce your charges by moving to another tier. See [Usage and estimated costs](../usage-estimated-costs.md#usage-and-estimated-costs) for information on this view.

## Dedicated clusters
An [Azure Monitor Logs dedicated cluster](logs-dedicated-clusters.md) is a collection of workspaces in a single managed Azure Data Explorer cluster. Dedicated clusters support advanced features such as [customer-managed keys](customer-managed-keys.md) and use the same commitment tier pricing model as workspaces although they must have a commitment level of at least 500 GB/day. Any usage above the commitment level (overage) is billed at that same price per GB as provided by the current commitment tier.  There is no Pay-As-You-Go option for clusters. 

The cluster commitment tier has a 31-day commitment period after the commitment level is increased. During the commitment period, the commitment tier level can't be reduced, but it can be increased at any time. When workspaces are associated to a cluster, the data ingestion billing for those workspaces is done at the cluster level using the configured commitment tier level. 

There are two modes of billing for a cluster that you specify when you create the cluster.  

- **Cluster (default)**: Billing for ingested data is done at the cluster level. The ingested data quantities from each workspace associated to a cluster are aggregated to calculate the daily bill for the cluster. Per-node allocations from [Microsoft Defender for Cloud](../../security-center/index.yml) are applied at the workspace level prior to this aggregation of data across all workspaces in the cluster. 

- **Workspaces**: Commitment tier costs for your cluster are attributed proportionately to the workspaces in the cluster, by each workspace's data ingestion volume (after accounting for per-node allocations from [Microsoft Defender for Cloud](../../security-center/index.yml) for each workspace.)<br><br>If the total data volume ingested into a cluster for a day is less than the commitment tier, each workspace is billed for its ingested data at the effective per-GB commitment tier rate by billing them a fraction of the commitment tier. The unused part of the commitment tier is then billed to the cluster resource.<br><br>If the total data volume ingested into a cluster for a day is more than the commitment tier, each workspace is billed for a fraction of the commitment tier, based on its fraction of the ingested data that day and each workspace for a fraction of the ingested data above the commitment tier. If the total data volume ingested into a workspace for a day is above the commitment tier, nothing is billed to the cluster resource.

In cluster billing options, data retention is billed for each workspace. Cluster billing starts when the cluster is created, regardless of whether workspaces are associated with the cluster.

When you link workspaces to a cluster, the pricing tier is changed to cluster, and ingestion is billed based on the cluster's commitment tier.  Workspaces associated to a cluster no longer have their own pricing tier. Workspaces can be unlinked from a cluster at any time, and pricing tier change to per-GB.

If your linked workspace is using legacy Per Node pricing tier, it will be billed based on data ingested against the cluster's Commitment Tier, and no longer Per Node. Per-node data allocations from Microsoft Defender for Cloud will continue to be applied.

See [Create a dedicated cluster](logs-dedicated-clusters.md#create-a-dedicated-cluster) for details on creating a dedicated cluster and specifying its billing type.

## Basic Logs
You can configure certain tables in a Log Analytics workspace to use [Basic Logs](basic-logs-configure.md). Data in these tables has a significantly reduced ingestion charge and a limited retention period. There is a charge though to search against these tables. Basic Logs are intended for high-volume verbose logs you use for debugging, troubleshooting and auditing, but not for analytics and alerts.

The charge for searching against Basic Logs is based on the GB of data scanned in performing the search. 

See [Configure Basic Logs in Azure Monitor](basic-logs-configure.md) for details on Basic Logs including how to configure them and query their data.

## Log data retention and archive
In addition to data ingestion, there is a charge for the retention of data in each Log Analytics workspace. You can set the retention period for the entire workspace or for each table. After this period, the data is either removed or archived. Archived Logs have a reduced retention charge, and there is a charge to search against them. Use Archive Logs to reduce your costs for data that you must store for compliance or occasional investigation.

See [Configure data retention and archive policies in Azure Monitor Logs](data-retention-archive.md) for details on data retention and archiving including how to configure these settings and access archived data. 

## Search jobs
Searching against Archived Logs uses [search jobs](search-jobs.md). Search jobs are asynchronous queries that fetch records into a new search table within your workspace for further analytics. Search jobs are billed by the number of GB of data scanned on each day that is accessed to perform the search. 

## Log data restore
For situations in which older or archived logs need to be intensively queried with the full analytic query capabilities, the [data restore](restore.md) feature is a powerful tool. The restore operation makes a specific time range of data in a table available in the hot cache for high-performance queries. You can later dismiss the data when you're done. Log data restore is billed by the amount of data restored, and by the time the restore is kept active.  The minimal values billed for any data restore are 2 TB and 12 hours. Data restored of more than 2 TB and/or more than 12 hours in duration are billed on a pro-rated basis. 

## Log data export
[Data export](logs-data-export.md) in Log Analytics workspace lets you continuously export data per selected tables in your workspace, to an Azure Storage Account or Azure Event Hubs as it arrives to Azure Monitor pipeline. Charges for the use of data export are based on the amount of data exported. The size of data exported is the number of bytes in the exported JSON formatted data.

## Application insights billing
Since [workspace-based Application Insights resources](../app/create-workspace-resource.md) store their data in a Log Analytics workspace, the billing for data ingestion and retention is done by the workspace where the Application Insights data is located. This enables you to leverage all options of the Log Analytics pricing model, including [commitment tiers](#commitment-tiers) in addition to Pay-As-You-Go.

Data ingestion and data retention for a [classic Application Insights resource](../app/create-new-resource.md) follow the same Pay-As-You-Go pricing as workspace-based resources, but they can't leverage commitment tiers.

Telemetry from ping tests and multi-step tests is charged the same as data usage for other telemetry from your app. Use of web tests and enabling alerting on custom metric dimensions is still reported through Application Insights. There's no data volume charge for using the [Live Metrics Stream](../app/live-stream.md).

See [Application Insights legacy enterprise (per node) pricing tier](../app/legacy-pricing.md) for details about legacy tiers that are available to early adopters of Application Insights.

## Workspaces with Microsoft Sentinel
When Microsoft Sentinel is enabled in a Log Analytics workspace, all data collected in that workspace is subject to Sentinel charges in addition to Log Analytics charges. For this reason, you will often separate your security and operational data in different workspaces so that you don't incur [Sentinel charges](../../sentinel/billing.md) for operational data. For some particular situations though, combining this data can actually result in a cost savings. This is typically when you aren't collecting enough security and operational data to each reach a commitment tier on their own, but the combined data is enough to reach a commitment tier. See **Combining your SOC and non-SOC data** in [Design your Microsoft Sentinel workspace architecture](../../sentinel/design-your-workspace-architecture.md#decision-tree) for details and a sample cost calculation.
## Workspaces with Microsoft Defender for Cloud
[Microsoft Defender for Servers (part of Defender for Cloud)](../../security-center/index.yml)  [bills by the number of monitored services](https://azure.microsoft.com/pricing/details/azure-defender/) and provides 500 MB/server/day data allocation that is applied to the following subset of [security data types](/azure/azure-monitor/reference/tables/tables-category#security):

- [WindowsEvent](/azure/azure-monitor/reference/tables/windowsevent)
- [SecurityAlert](/azure/azure-monitor/reference/tables/securityalert)
- [SecurityBaseline](/azure/azure-monitor/reference/tables/securitybaseline)
- [SecurityBaselineSummary](/azure/azure-monitor/reference/tables/securitybaselinesummary)
- [SecurityDetection](/azure/azure-monitor/reference/tables/securitydetection)
- [SecurityEvent](/azure/azure-monitor/reference/tables/securityevent)
- [WindowsFirewall](/azure/azure-monitor/reference/tables/windowsfirewall)
- [LinuxAuditLog](/azure/azure-monitor/reference/tables/linuxauditlog)
- [SysmonEvent](/azure/azure-monitor/reference/tables/sysmonevent)
- [ProtectionStatus](/azure/azure-monitor/reference/tables/protectionstatus)
- [Update](/azure/azure-monitor/reference/tables/update) and [UpdateSummary](/azure/azure-monitor/reference/tables/updatesummary) when the Update Management solution isn't running in the workspace or solution targeting is enabled. See [What data types are included in the 500-MB data daily allowance?](../../defender-for-cloud/enhanced-security-features-overview.md#what-data-types-are-included-in-the-500-mb-data-daily-allowance)
 
The count of monitored servers is calculated on an hourly granularity. The daily data allocation contributions from each monitored server are aggregated at the workspace level. If the workspace is in the legacy Per Node pricing tier, the Microsoft Defender for Cloud and Log Analytics allocations are combined and applied jointly to all billable ingested data.  

## Legacy pricing tiers
Subscriptions that contained a Log Analytics workspace or Application Insights resource on April 2, 2018, or are linked to an Enterprise Agreement that started before February 1, 2019 and is still active, will continue to have access to use the following legacy pricing tiers: 

- Standalone (Per GB)
- Per Node (OMS)

Access to the legacy Free Trial pricing tier will be further limited starting July 1, 2022 (see below.)

### Free Trial pricing tier
Workspaces in the **Free Trial** pricing tier will have daily data ingestion limited to 500 MB (except for security data types collected by [Microsoft Defender for Cloud](../../security-center/index.yml)), and the data retention is limited to seven days. The Free Trial pricing tier is intended only for evaluation purposes. No SLA is provided for the Free tier.   

> [!NOTE]
> Creating new workspaces in, or moving existing workspaces into, the legacy Free Trial pricing tier is possible only until July 1, 2022.

### Standalone pricing tier
Usage on the **Standalone** pricing tier is billed by the ingested data volume. It is reported in the **Log Analytics** service and the meter is named "Data Analyzed". Workspaces in the Standalone pricing tier have user-configurable retention from 30 to 730 days. Workspaces in the Standalone pricing tier do not support the use of [Basic Logs](basic-logs-configure.md).

### Per Node pricing tier
The **Per Node** pricing tier charges per monitored VM (node) on an hour granularity. For each monitored node, the workspace is allocated 500 MB of data per day that's not billed. This allocation is calculated with hourly granularity and is aggregated at the workspace level each day. Data ingested above the aggregate daily data allocation is billed per GB as data overage. On your bill, the service will be **Insight and Analytics** for Log Analytics usage if the workspace is in the Per Node pricing tier. Workspaces in the Per Node pricing tier have user-configurable retention from 30 to 730 days. Workspaces in the Per Node pricing tier do not support the use of [Basic Logs](basic-logs-configure.md). Usage is reported on three meters:

- **Node**: this is usage for the number of monitored nodes (VMs) in units of node months.
- **Data Overage per Node**: this is the number of GB of data ingested in excess of the aggregated data allocation.
- **Data Included per Node**: this is the amount of ingested data that was covered by the aggregated data allocation. This meter is also used when the workspace is in all pricing tiers to show the amount of data covered by the Microsoft Defender for Cloud.

> [!TIP]
> If your workspace has access to the **Per Node** pricing tier but you're wondering whether it would cost less in a Pay-As-You-Go tier, you can [use the query below](#evaluate-the-legacy-per-node-pricing-tier) for a recommendation. 

### Standard and Premium pricing tiers 

Workspaces created before April 2016 can continue to use the **Standard** and **Premium** pricing tiers that have fixed data retention of 30 days and 365 days, respectively. New workspaces can't be created in the **Standard** or **Premium** pricing tiers, and if a workspace is moved out of these tiers, it can't be moved back. Workspaces in these pricing tiers do not support the use of [Basic Logs](basic-logs-configure.md). Data ingestion meters on your Azure bill for these legacy tiers are called "Data analyzed." 

### Microsoft Defender for Cloud with legacy pricing tiers 
Following are considerations between legacy Log Analytics tiers and how usage is billed for [Microsoft Defender for Cloud](../../security-center/index.yml). 

- If the workspace is in the legacy Standard or Premium tier, Microsoft Defender for Cloud is billed only for Log Analytics data ingestion, not per node.
- If the workspace is in the legacy Per Node tier, Microsoft Defender for Cloud is billed using the current [Microsoft Defender for Cloud node-based pricing model](https://azure.microsoft.com/pricing/details/security-center/). 
- In other pricing tiers (including commitment tiers), if Microsoft Defender for Cloud was enabled before June 19, 2017, Microsoft Defender for Cloud is billed only for Log Analytics data ingestion. Otherwise, Microsoft Defender for Cloud is billed using the current Microsoft Defender for Cloud node-based pricing model.

More details of pricing tier limitations are available at [Azure subscription and service limits, quotas, and constraints](../../azure-resource-manager/management/azure-subscription-service-limits.md#log-analytics-workspaces).

None of the legacy pricing tiers have regional-based pricing.  

> [!NOTE]
> To use the entitlements that come from purchasing OMS E1 Suite, OMS E2 Suite, or OMS Add-On for System Center, choose the Log Analytics *Per Node* pricing tier.

## Evaluate the legacy Per Node pricing tier
It's often difficult to determine whether workspaces with access to the legacy **Per Node** pricing tier are better off in that tier or in a current **Pay-As-You-Go** or **Commitment Tier**.  This involves understanding the trade-off between the fixed cost per monitored node in the Per Node pricing tier and its included data allocation of 500 MB/node/day and the cost of just paying for ingested data in the Pay-As-You-Go (Per GB) tier.

The following query can be used to make a recommendation for the optimal pricing tier based on a workspace's usage patterns. This query looks at the monitored nodes and data ingested into a workspace in the last seven days, and for each day, it evaluates which pricing tier would have been optimal. To use the query, you need to specify:

- Whether the workspace is using Microsoft Defender for Cloud by setting **workspaceHasSecurityCenter** to **true** or **false**. 
- Update the prices if you have specific discounts.
- Specify the number of days to look back and analyze by setting **daysToEvaluate**. This is useful if the query is taking too long trying to look at seven days of data.

```kusto
// Set these parameters before running query
// For Pay-As-You-Go (per-GB) and commitment tier pricing details, see https://azure.microsoft.com/pricing/details/monitor/.
// You can see your per-node costs in your Azure usage and charge data. For more information, see https://docs.microsoft.com/en-us/azure/cost-management-billing/understand/download-azure-daily-usage.  
let PerNodePrice = 15.; // Monthly price per monitored node
let PerNodeOveragePrice = 2.30; // Price per GB for data overage in the Per Node pricing tier
let PerGBPrice = 2.30; // Enter the Pay-as-you-go price for your workspace's region (from https://azure.microsoft.com/pricing/details/monitor/)
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


## Next steps
- See [Azure Monitor cost and usage](../usage-estimated-costs.md) for a description of the different types of Azure Monitor charges and how to analyze them on your Azure bill.
- See [Analyze usage in Log Analytics workspace](analyze-usage.md) for details on analyzing the data in your workspace to determine to source of any higher than expected usage and opportunities to reduce your amount of data collected.
- See [Set daily cap on Log Analytics workspace](daily-cap.md) to control your costs by configuring a maximum volume that may be ingested in a workspace each day.
- See [Azure Monitor best practices - Cost management](../best-practices-cost.md) for best practices on configuring and managing Azure Monitor to minimize your charges.
