---
title: Azure Monitor Logs pricing details
description: Cost details for data stored in a Log Analytics workspace in Azure Monitor, including commitment tiers and data size calculation.
ms.topic: conceptual
ms.date: 02/18/2022
---
 
# Azure Monitor Logs pricing details
Several features in Azure Monitor do not have a direct cost but add to the data collected in your Log Analytics workspace which has charges for data ingestion and retention. This article describes how data charges are calculated for your workspaces and the different configuration options that affect your costs.

## Overview
The default pricing for Azure Monitor Logs is a cloud-friendly, consumption-based pricing **Pay-As-You-Go** model that's based on ingested data volume and optionally for longer data retention. Data volume is measured as the size of the data that will be stored in GB (10^9 bytes). Each Log Analytics workspace is charged as a separate service and contributes to the bill for your Azure subscription. 

The amount of data ingestion can be considerable, depending on the following factors: 

  - The set of insights and services enabled and their configuration
  - The number and type of monitored resources
  - Type of data collected from each monitored resource

## Data size calculation
In all pricing tiers, an event's data size is calculated from a string representation of the properties that are stored in the Log Analytics workspace for that event, regardless of whether the data is sent from an agent or added during the ingestion process. This includes any custom columns added by the [custom logs API](custom-logs-overview.md), [ingestion-time transformations](ingestion-time-transformations.md), or [custom fields](custom-fields.md) that are added as data is collected and then stored in the workspace. 

### Excluded columns
The following [standard columns](log-standard-columns.md) that are common to all tables, are excluded in the calculation of the event size. All other columns stored in Log Analytics are included in the calculation of the event size. To determine whether an event was excluded from billing for data ingestion, you can use the [_IsBillable](log-standard-columns.md#_isbillable) property as shown in [Data volume for specific events](analyze-usage.md#data-volume-for-specific-events). 

- `_ResourceId`
- `_SubscriptionId`
- `_ItemId`
- `_IsBillable`
- `_BilledSize`
- `Type`


### Excluded tables
The following tables are free from data ingestion charges altogether.

- [AzureActivity](/azure/azure-monitor/reference/tables/azureactivity)
- [Heartbeat](/azure/azure-monitor/reference/tables/heartbeat)
- [Usage](/azure/azure-monitor/reference/tables/usage)
- [Operation](/azure/azure-monitor/reference/tables/operation)

### Charges for other solutions and services
Some solutions have more solution-specific policies about free data ingestion, for example [Azure Migrate](https://azure.microsoft.com/pricing/details/azure-migrate/) makes dependency visualization data free for the first 180-days of a Server Assessment. Services such as [Microsoft Defender for Cloud](https://azure.microsoft.com/pricing/details/azure-defender/), [Microsoft Sentinel](https://azure.microsoft.com/pricing/details/azure-sentinel/), and [Configuration management](https://azure.microsoft.com/pricing/details/automation/) have their own pricing models. 

See the documentation for different services and solutions for any unique billing calculations.

## Commitment Tiers
In addition to the Pay-As-You-Go model, Log Analytics has **Commitment Tiers**, which can save you as much as 30 percent compared to the Pay-As-You-Go price. With commitment tier pricing, you can commit to buy data ingestion starting at 100 GB/day at a lower price than Pay-As-You-Go pricing. Any usage above the commitment level (overage) is billed at that same price per GB as provided by the current commitment tier. The commitment tiers have a 31-day commitment period from the time a commitment tier is selected. 

- During the commitment period, you can change to a higher commitment tier (which restarts the 31-day commitment period), but you can't move back to Pay-As-You-Go or to a lower commitment tier until after you finish the commitment period. 
- At the end of the commitment period, the workspace retains the selected commitment tier, and the workspace can be moved to Pay-As-You-Go or to a different commitment tier at any time. 
 
Billing for the commitment tiers is done on a daily basis. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for a detailed listing of the commitment tiers and their prices. 


> [!NOTE]
> Starting June 2, 2021, **Capacity Reservations** are now called **Commitment Tiers**. Data collected above your commitment tier level (overage) is now billed at the same price-per-GB as the current commitment tier level, lowering costs compared to the old method of billing at the Pay-As-You-Go rate, and reducing the need for users with large data volumes to fine-tune their commitment level. Three new commitment tiers were also added: 1000, 2000, and 5000 GB/day. 

## Dedicated clusters
[Azure Monitor Logs dedicated clusters](logs-dedicated-clusters.md) are collections of workspaces in a single managed Azure Data Explorer cluster to support advanced scenarios, like [customer-managed keys](customer-managed-keys.md). Dedicated clusters use the same commitment tier pricing model as workspaces, except that a cluster must have a commitment level of at least 500 GB/day. Any usage above the commitment level (overage) is billed at that same price per GB as provided by the current commitment tier.  There is no Pay-As-You-Go option for clusters. 

The cluster commitment tier has a 31-day commitment period after the commitment level is increased. During the commitment period, the commitment tier level can't be reduced, but it can be increased at any time. When workspaces are associated to a cluster, the data ingestion billing for those workspaces is done at the cluster level using the configured commitment tier level. 

There are two modes of billing for usage on a cluster. These can be specified by the `billingType` parameter when [creating a cluster](logs-dedicated-clusters.md#create-a-dedicated-cluster) or configured after creation.  

- **Cluster (default)**: Billing for ingested data is done at the cluster level. The ingested data quantities from each workspace associated to a cluster are aggregated to calculate the daily bill for the cluster. Per-node allocations from [Microsoft Defender for Cloud](../../security-center/index.yml) are applied at the workspace level prior to this aggregation of aggregated data across all workspaces in the cluster. 

- **Workspaces**: Commitment tier costs for your cluster are attributed proportionately to the workspaces in the cluster, by each workspace's data ingestion volume (after accounting for per-node allocations from [Microsoft Defender for Cloud](../../security-center/index.yml) for each workspace.) If the total data volume ingested into a cluster for a day is less than the commitment tier, each workspace is billed for its ingested data at the effective per-GB commitment tier rate by billing them a fraction of the commitment tier, and the unused part of the commitment tier is billed to the cluster resource. If the total data volume ingested into a cluster for a day is more than the commitment tier, each workspace is billed for a fraction of the commitment tier, based on its fraction of the ingested data that day and each workspace for a fraction of the ingested data above the commitment tier. If the total data volume ingested into a workspace for a day is above the commitment tier, nothing is billed to the cluster resource.

In cluster billing options, data retention is billed for each workspace. Cluster billing starts when the cluster is created, regardless of whether workspaces are associated with the cluster. Workspaces 
associated to a cluster no longer have their own pricing tier.

If your linked workspace is using legacy Per Node pricing tier, it will be billed based on data ingested against the cluster's Commitment Tier, and no longer Per Node. Per-node data allocations from Microsoft Defender for Cloud will continue to be applied.

When you link workspaces to a cluster, the pricing tier is changed to cluster, and ingestion is billed based on cluster's Commitment Tier. Workspaces can be unlinked from a cluster at any time, and pricing tier change to per-GB.

## Application insights billing
Data ingestion and data retention for a [classic Application Insights resource](../app/create-new-resource.md) are reported with a meter category of **Log Analytics**.

Since [workspace-based Application Insights resources](../app/create-workspace-resource.md) store their data in a Log Analytics workspace, the billing for data ingestion and retention is done by the workspace where the Application Insights data is located. This enables you to leverage all options of the Log Analytics [pricing model](cost-logs.md), including [commitment tiers](#commitment-tiers) in addition to Pay-As-You-Go.

[Multi-step web tests](../app/availability-multistep.md) incur extra charges. There's no separate charge for ping tests of a single page. Telemetry from ping tests and multi-step tests is charged the same as data usage for other telemetry from your app. Usage of web tests and enabling alerting on custom metric dimensions is still reported through Application Insights. There's no data volume charge for using the [Live Metrics Stream](../app/live-stream.md). 

The Application Insights option to [Enable alerting on custom metric dimensions](../app/pre-aggregated-metrics-log-metrics.md#custom-metrics-dimensions-and-pre-aggregation) can also increase costs because this can result in the creation of more pre-aggregation metrics. Learn more about log-based and pre-aggregated metrics in Application Insights and about pricing for Azure Monitor custom metrics.

## Workspaces with Microsoft Sentinel
When Microsoft Sentinel is enabled in a Log Analytics workspace, all data collected in that workspace is subject to Sentinel charges in addition to Log Analytics charges. For this reason, you will often separate your security and operational data in different workspaces so that you don't incur Sentinel charges for operational data. There may be particular situations though where combining this data  can actually result in a cost savings. This is typically when you aren't collecting enough security and operational data to each reach a commitment tier on their own, but the combined data is enough to reach a commitment tier. See **Combining your SOC and non-SOC data** in [Design your Microsoft Sentinel workspace architecture](../../sentinel/design-your-workspace-architecture.md#decision-tree) for details and a sample cost calculation.
## Workspaces with Microsoft Defender for Cloud
[Microsoft Defender for Servers (part of Defender for Cloud)](../../security-center/index.yml) billing is closely tied to Log Analytics billing. Microsoft Defender for Servers [bills by the number of monitored services](https://azure.microsoft.com/pricing/details/azure-defender/) and provides 500 MB/server/day data allocation that is applied to the following subset of [security data types](/azure/azure-monitor/reference/tables/tables-category#security):

- [WindowsEvent](/azure/azure-monitor/reference/tables/windowsevent)
- [SecurityAlert](/azure/azure-monitor/reference/tables/securityalert)
- [SecurityBaseline](/azure/azure-monitor/reference/tables/securitybaseline)
- [SecurityBaselineSummary](/azure/azure-monitor/reference/tables/securitybaselinesummary)
- [SecurityDetection](/azure/azure-monitor/reference/tables/securitydetection)
- [SecurityEvent](/azure/azure-monitor/reference/tables/securityevent)
- [WindowsFirewall](/azure/azure-monitor/reference/tables/windowsfirewall)
- [MaliciousIPCommunication](/azure/azure-monitor/reference/tables/maliciousipcommunication)
- [LinuxAuditLog](/azure/azure-monitor/reference/tables/linuxauditlog)
- [SysmonEvent](/azure/azure-monitor/reference/tables/sysmonevent)
- [ProtectionStatus](/azure/azure-monitor/reference/tables/protectionstatus)
- [Update](/azure/azure-monitor/reference/tables/update) and [UpdateSummary](/azure/azure-monitor/reference/tables/updatesummary) when the Update Management solution isn't running in the workspace or solution targeting is enabled. See [What data types are included in the 500-MB data daily allowance?](../../defender-for-cloud/enhanced-security-features-overview.md#what-data-types-are-included-in-the-500-mb-data-daily-allowance)
 
The count of monitored servers is calculated on an hourly granularity. The daily data allocation contributions from each monitored server are aggregated at the workspace level. If the workspace is in the legacy Per Node pricing tier, the Microsoft Defender for Cloud and Log Analytics allocations are combined and applied jointly to all billable ingested data.  

To view the daily Defender for Servers data allocations for a workspace, you need to [export your usage details](../usage-estimated-costs.md#viewing-azure-monitor-usage-and-charges), open the usage spreadsheet and filter the meter category to "Insight and Analytics".  You'll then see usage with the meter name "Data Included per Node" which has a zero price per GB.  The consumed quantity column will show the number of GBs of Defender for Cloud data allocation for the day. (If the workspace is in the legacy Per Node Log Analytics pricing tier, this meter will also include the data allocations from this Log Analytics pricing tier.) 


## Legacy pricing tiers
Subscriptions that contained a Log Analytics workspace or Application Insights resource on April 2, 2018, or are linked to an Enterprise Agreement that started before February 1, 2019 and is still active, will continue to have access to use the the following legacy pricing tiers: 

- Free Trial
- Standalone (Per GB)
- Per Node (OMS)

### Free Trial pricing tier
Workspaces in the **Free Trial** pricing tier will have daily data ingestion limited to 500 MB (except for security data types collected by [Microsoft Defender for Cloud](../../security-center/index.yml)), and the data retention is limited to seven days. The Free Trial pricing tier is intended only for evaluation purposes. No SLA is provided for the Free tier.  Workspaces in the Standalone or Per Node pricing tiers have user-configurable retention from 30 to 730 days.

### Standalong pricing tier
Usage on the **Standalone** pricing tier is billed by the ingested data volume. It is reported in the **Log Analytics** service and the meter is named "Data Analyzed". 

### Per Node pricing tier
The **Per Node** pricing tier charges per monitored VM (node) on an hour granularity. For each monitored node, the workspace is allocated 500 MB of data per day that's not billed. This allocation is calculated with hourly granularity and is aggregated at the workspace level each day. Data ingested above the aggregate daily data allocation is billed per GB as data overage. On your bill, the service will be **Insight and Analytics** for Log Analytics usage if the workspace is in the Per Node pricing tier. Usage is reported on three meters:

- **Node**: this is usage for the number of monitored nodes (VMs) in units of node months.
- **Data Overage per Node**: this is the number of GB of data ingested in excess of the aggregated data allocation.
- **Data Included per Node**: this is the amount of ingested data that was covered by the aggregated data allocation. This meter is also used when the workspace is in all pricing tiers to show the amount of data covered by the Microsoft Defender for Cloud.

> [!TIP]
> If your workspace has access to the **Per Node** pricing tier but you're wondering whether it would cost less in a Pay-As-You-Go tier, you can [use the query below](#evaluate-the-legacy-per-node-pricing-tier) for a recommendation. 

Workspaces created before April 2016 can continue to use the **Standard** and **Premium** pricing tiers that have fixed data retention of 30 days and 365 days, respectively. New workspaces can't be created in the **Standard** or **Premium** pricing tiers, and if a workspace is moved out of these tiers, it can't be moved back. Data ingestion meters on your Azure bill for these legacy tiers are called "Data analyzed."

### Application Insights legacy enterprise (per node) pricing tier

For early adopters of Azure Application Insights, there are still two possible pricing tiers: Basic and Enterprise. The Basic pricing tier is the same as described above and is the default tier. It includes all Enterprise tier features, at no extra cost. The Basic tier bills primarily on the volume of data that's ingested.

These legacy pricing tiers have been renamed. The Enterprise pricing tier is now called **Per Node** and the Basic pricing tier is now called **Per GB**. These new names are used below and in the Azure portal.  

The Per Node (formerly Enterprise) tier has a per-node charge, and each node receives a daily data allowance. In the Per Node pricing tier, you're charged for data ingested above the included allowance. If you're using Operations Management Suite, you should choose the Per Node tier. In April 2018, we [introduced](https://azure.microsoft.com/blog/introducing-a-new-way-to-purchase-azure-monitoring-services/) a new pricing model for Azure monitoring. This model adopts a simple "pay-as-you-go" model across the complete portfolio of monitoring services. Learn more about the [new pricing model](..//usage-estimated-costs.md).

For current prices in your currency and region, see [Application Insights pricing](https://azure.microsoft.com/pricing/details/application-insights/).

#### Understanding billed usage on the legacy Enterprise (Per Node) tier 

As described below in more detail, the legacy Enterprise (Per Node) tier combines usage from across all Application Insights resources in a subscription to calculate the number of nodes and the data overage. Due to this combination process, **usage for all Application Insights resources in a subscription are reported against just one of the resources**.  This makes reconciling your [billed usage](#viewing-application-insights-usage-on-your-azure-bill) with the usage you observe for each Application Insights resource complicated.

> [!WARNING]
> Because of the complexity of tracking and understanding usage of Application Insights resources in the legacy Enterprise (Per Node) tier we strongly recommend using the current Pay-As-You-Go pricing tier. 

#### Per Node tier and Operations Management Suite subscription entitlements

Customers who purchase Operations Management Suite E1 and E2 can get Application Insights Per Node as an supplemental component at no extra cost as [previously announced](/archive/blogs/msoms/azure-application-insights-enterprise-as-part-of-operations-management-suite-subscription). Specifically, each unit of Operations Management Suite E1 and E2 includes an entitlement to one node of the Application Insights Per Node tier. Each Application Insights node includes up to 200 MB of data ingested per day (separate from Log Analytics data ingestion), with 90-day data retention at no extra cost. The tier is described in more detailed later in the article.

Because this tier is applicable only to customers with an Operations Management Suite subscription, customers who don't have an Operations Management Suite subscription don't see an option to select this tier.

> [!NOTE]
> To ensure that you get this entitlement, your Application Insights resources must be in the Per Node pricing tier. This entitlement applies only as nodes. Application Insights resources in the Per GB tier don't realize any benefit. 
> This entitlement isn't visible in the estimated costs shown in the **Usage and estimated cost** pane. Also, if you move a subscription to the new Azure monitoring pricing model in April 2018, the Per GB tier is the only tier available. Moving a subscription to the new Azure monitoring pricing model isn't advisable if you have an Operations Management Suite subscription.

#### How the Per Node tier works

* You pay for each node that sends telemetry for any apps in the Per Node tier.
  * A *node* is a physical or virtual server machine or a platform-as-a-service role instance that hosts your app.
  * Development machines, client browsers, and mobile devices don't count as nodes.
  * If your app has several components that send telemetry, such as a web service and a back-end worker, the components are counted separately.
  * [Live Metrics Stream](./live-stream.md) data isn't counted for pricing purposes. In a subscription, your charges are per node, not per app. If you have five nodes that send telemetry for 12 apps, the charge is for five nodes.
* Although charges are quoted per month, you're charged only for any hour in which a node sends telemetry from an app. The hourly charge is the quoted monthly charge divided by 744 (the number of hours in a 31-day month).
* A data volume allocation of 200 MB per day is given for each node that's detected (with hourly granularity). Unused data allocation isn't carried over from one day to the next.
  * If you choose the Per Node pricing tier, each subscription gets a daily allowance of data based on the number of nodes that send telemetry to the Application Insights resources in that subscription. So, if you have five nodes that send data all day, you'll have a pooled allowance of 1 GB applied to all Application Insights resources in that subscription. It doesn't matter if certain nodes send more data than other nodes because the included data is shared across all nodes. If on a given day, the Application Insights resources receive more data than is included in the daily data allocation for this subscription, the per-GB overage data charges apply. 
  * The daily data allowance is calculated as the number of hours in the day (using UTC) that each node sends telemetry divided by 24 multiplied by 200 MB. So, if you have four nodes that send telemetry during 15 of the 24 hours in the day, the included data for that day would be ((4 &#215; 15) / 24) &#215; 200 MB = 500 MB. At the price of 2.30 USD per GB for data overage, the charge would be 1.15 USD if the nodes send 1 GB of data that day.
  * The Per Node tier daily allowance isn't shared with applications for which you have chosen the Per GB tier. Unused allowance isn't carried over from day-to-day.

#### Examples of how to determine distinct node count

| Scenario                               | Total daily node count |
|:---------------------------------------|:----------------:|
| 1 application using 3 Azure App Service instances and 1 virtual server | 4 |
| 3 applications running on 2 VMs; the Application Insights resources for these applications are in the same subscription and in the Per Node tier | 2 | 
| 4 applications whose Applications Insights resources are in the same subscription; each application running 2 instances during 16 off-peak hours, and 4 instances during 8 peak hours | 13.33 |
| Cloud services with 1 Worker Role and 1 Web Role, each running 2 instances | 4 | 
| A 5-node Azure Service Fabric cluster running 50 microservices; each microservice running 3 instances | 5|

* The precise node counting depends on which Application Insights SDK your application is using. 
  * In SDK versions 2.2 and later, both the Application Insights [Core SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights/) and the [Web SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) report each application host as a node. Examples are the computer name for physical server and VM hosts or the instance name for cloud services.  The only exception is an application that uses only the [.NET Core](https://dotnet.github.io/) and the Application Insights Core SDK. In that case, only one node is reported for all hosts because the host name isn't available.
  * For earlier versions of the SDK, the [Web SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights.Web/) behaves like the newer SDK versions, but the [Core SDK](https://www.nuget.org/packages/Microsoft.ApplicationInsights/) reports only one node, regardless of the number of application hosts.
  * If your application uses the SDK to set **roleInstance** to a custom value, by default, that same value is used to determine node count.
  * If you're using a new SDK version with an app that runs from client machines or mobile devices, the node count might return a number that's large (because of the large number of client machines or mobile devices).



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
It's often difficult to assess the decision of whether workspaces with access to the legacy **Per Node** pricing tier are better off in that tier or in a current **Pay-As-You-Go** or **Commitment Tier**.  This involves understanding the trade-off between the fixed cost per monitored node in the Per Node pricing tier and its included data allocation of 500 MB/node/day and the cost of just paying for ingested data in the Pay-As-You-Go (Per GB) tier.

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
