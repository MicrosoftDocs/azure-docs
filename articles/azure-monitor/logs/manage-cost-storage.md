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










## Investigate your Log Analytics usage
<a name="troubleshooting-why-usage-is-higher-than-expected"></a>

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

## Tips for reducing data volume

This table lists some suggestions for reducing the volume of logs collected.

| Source of high data volume | How to reduce data volume |
| -------------------------- | ------------------------- |
| Data Collection Rules      | The [Azure Monitor Agent](../agents/azure-monitor-agent-overview.md) uses Data Collection Rules to manage the collection of data. You can [limit the collection of data](../agents/data-collection-rule-azure-monitor-agent.md#limit-data-collection-with-custom-xpath-queries) using custom XPath queries. | 
| Container Insights         | [Configure Container Insights](../containers/container-insights-cost.md#controlling-ingestion-to-reduce-cost) to collect only the data you required. |
| Microsoft Sentinel | Review any [Sentinel data sources](../../sentinel/connect-data-sources.md) that you recently enabled as sources of additional data volume. [Learn more](../../sentinel/azure-sentinel-billing.md) about Sentinel costs and billing. |
| Security events            | Select [common or minimal security events](../../security-center/security-center-enable-data-collection.md#data-collection-tier). <br> Change the security audit policy to collect only needed events. In particular, review the need to collect events for: <br> - [audit filtering platform](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd772749(v=ws.10)). <br> - [audit registry](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd941614(v%3dws.10)). <br> - [audit file system](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd772661(v%3dws.10)). <br> - [audit kernel object](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd941615(v%3dws.10)). <br> - [audit handle manipulation](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/dd772626(v%3dws.10)). <br> - audit removable storage. |
| Performance counters       | Change the [performance counter configuration](../agents/data-sources-performance-counters.md) to: <br> - Reduce the frequency of collection. <br> - Reduce the number of performance counters. |
| Event logs                 | Change the [event log configuration](../agents/data-sources-windows-events.md) to: <br> - Reduce the number of event logs collected. <br> - Collect only required event levels. For example, do not collect *Information* level events. |
| Syslog                     | Change the [syslog configuration](../agents/data-sources-syslog.md) to: <br> - Reduce the number of facilities collected. <br> - Collect only required event levels. For example, do not collect *Info* and *Debug* level events. |
| AzureDiagnostics           | Change the [resource log collection](../essentials/diagnostic-settings.md#create-in-azure-portal) to: <br> - Reduce the number of resources that send logs to Log Analytics. <br> - Collect only required logs. |
| Solution data from computers that don't need the solution | Use [solution targeting](../insights/solution-targeting.md) to collect data from only required groups of computers. |
| Application Insights | Review options for [managing Application Insights data volume](../app/pricing.md#managing-your-data-volume). |
| [SQL Analytics](../insights/azure-sql.md) | Use [Set-AzSqlServerAudit](/powershell/module/az.sql/set-azsqlserveraudit) to tune the auditing settings. |                                                             
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

> [!TIP]
> Use these `find` queries sparingly because scans across data types are [resource intensive](./query-optimization.md#query-performance-pane) to execute. If you don't need results **per computer**, then query on the **Usage** data type.

### Nodes billed by the legacy Per Node pricing tier

The [legacy Per Node pricing tier](#legacy-pricing-tiers) bills for nodes with hourly granularity and also doesn't count nodes that are only sending a set of security data types. To get a list of computers that will be billed as nodes if the workspace is in the legacy Per Node pricing tier, look for nodes that are sending **billed data types** (some data types are free). To do this, use the [_IsBillable property](./log-standard-columns.md#_isbillable) and use the leftmost field of the fully qualified domain name. This returns the count of computers with billed data per hour:

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
> Use these `find` queries sparingly because scans across data types are [resource intensive](./query-optimization.md#query-performance-pane) to execute. If you don't need results **per computer**, then query on the **Usage** data type.
                  
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

- Whether the workspace is using Microsoft Defender for Cloud by setting **workspaceHasSecurityCenter** to **true** or **false**. 
- Update the prices if you have specific discounts.
- Specify the number of days to look back and analyze by setting **daysToEvaluate**. This is useful if the query is taking too long trying to look at seven days of data.

Here is the pricing tier recommendation query:

```kusto
// Set these parameters before running query
// Pricing details available at https://azure.microsoft.com/pricing/details/monitor/
let daysToEvaluate = 7; // Enter number of previous days to analyze (reduce if the query is taking too long)
let workspaceHasSecurityCenter = false;  // Specify if the workspace has Defender for Cloud (formerly known as Azure Security Center)
let PerNodePrice = 15.; // Enter your monthly price per monitored nodes
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

<a name="allocations"></a>

## Viewing data allocation benefits

To view data allocation benefits from sources such as [Microsoft Defender for Servers](https://azure.microsoft.com/pricing/details/defender-for-cloud/), [Microsoft Sentinel benefit for Microsoft 365 E5, A5, F5 and G5 customers](https://azure.microsoft.com/offers/sentinel-microsoft-365-offer/), or the [Sentinel Free Trial](https://azure.microsoft.com/pricing/details/microsoft-sentinel/), you need to [export your usage details](#viewing-log-analytics-usage-on-your-azure-bill). Open the exported usage spreadsheet and filter the "Instance ID" column to your workspace. (To select all of your workspaces in the spreadsheet, filter the Instance ID column to "contains /workspaces/".) Next, filter the ResourceRate column to show only rows where this is equal to zero. Now you will see the data allocations from these various sources. 

> [!NOTE]
> Data allocations from Defender for Servers 500 MB/server/day will appear in rows with the meter name "Data Included per Node" and the meter category to "Insight and Analytics" (the name of a legacy offer still used with this meter.)  If the workspace is in the legacy Per Node Log Analytics pricing tier, this meter will also include the data allocations from this Log Analytics pricing tier.

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
