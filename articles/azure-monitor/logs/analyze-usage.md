---
title: Analyze usage in Log Analytics workspace in Azure Monitor
description: Methods and queries to analyze the data in your Log Analytics workspace to help you understand usage and potential cause for high usage.
ms.topic: conceptual
ms.reviewer: Dale.Koetke
ms.date: 08/25/2022
---
 
# Analyze usage in Log Analytics workspace
Azure Monitor costs can vary significantly based on the volume of data being collected in your Log Analytics workspace. This volume is affected by the set of solutions using the workspace and the amount of data collected by each. This article provides guidance on analyzing your collected data to assist in controlling your data ingestion costs. It helps you determine the cause of higher than expected usage and also to predict your costs as you monitor additional resources and configure different Azure Monitor features.

## Causes for higher than expected usage
Each Log Analytics workspace is charged as a separate service and contributes to the bill for your Azure subscription. The amount of data ingestion can be considerable, depending on the following factors: 

  - Set of insights and services enabled and their configuration
  - Number and type of monitored resources
  - Volume of data collected from each monitored resource

An unexpected increase in any of these factors can result in increased charges for data retention. The rest of this article provides methods for detecting such a situation and then analyzing collected data to identify and mitigate the source of the increased usage.

## Usage analysis in Azure Monitor
You should start your analysis with existing tools in Azure Monitor. These require no configuration and can often provide the information you require with minimal effort. If you need deeper analysis into your collected data than existing Azure Monitor features, you use any of the following [log queries](log-query-overview.md) in [Log Analytics](log-analytics-overview.md). 
### Log Analytics Workspace Insights
[Log Analytics Workspace Insights](log-analytics-workspace-insights-overview.md#usage-tab) provides you with a quick understanding of the data in your workspace including the following:

- Data tables ingesting the most data volume in the main table
- Top resources contributing data
- Trend of data ingestion

See the **Usage** tab for a breakdown of ingestion by solution and table. This can help you quickly identify the tables that contribute to the bulk of your data volume. It also shows trending of data collection over time to determine if data collection steadily increases over time or suddenly increased in response to a particular configuration change.

Select **Additional Queries** for pre-built queries that help you further understand your data patterns.

### Usage and Estimated Costs
The *Data ingestion per solution* chart on the [Usage and Estimated Costs](../usage-estimated-costs.md#usage-and-estimated-costs) page for each workspace shows the total volume of data sent and how much is being sent by each solution over the previous 31 days. This helps you determine trends such as whether any increase is from overall data usage or usage by a particular solution. 


## Log queries
You can use [log queries](log-query-overview.md) in [Log Analytics](log-analytics-overview.md) if you need deeper analysis into your collected data. Each table in a Log Analytics workspace has the following standard columns that can assist you in analyzing billable data.

- [_IsBillable](log-standard-columns.md#_isbillable) identifies records for which there is an ingestion charge. Use this column to filter out non-billable data.
- [_BilledSize](log-standard-columns.md#_billedsize) provides the size in bytes of the record.

## Data volume by solution
Analyze the amount of billable data collected by a particular service or solution. These queries use the [Usage](/azure/azure-monitor/reference/tables/usage) table that collects usage data for each table in the workspace. 


> [!NOTE] 
> The clause with `TimeGenerated` is only to ensure that the query experience in the Azure portal looks back beyond the default 24 hours. When using the **Usage** data type, `StartTime` and `EndTime` represent the time buckets for which results are presented.  

**Billable data volume by solution over the past month**

```kusto
Usage 
| where TimeGenerated > ago(32d)
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000. by bin(StartTime, 1d), Solution 
| render columnchart
```

**Billable data volume by type over the past month**

```kusto
Usage 
| where TimeGenerated > ago(32d)
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000. by bin(StartTime, 1d), DataType 
| render columnchart
```

**Billable data volume by solution and type over the past month**

```kusto
Usage 
| where TimeGenerated > ago(32d)
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000 by Solution, DataType
| sort by Solution asc, DataType asc
```

**Billable data volume for specific events**
If you find that a particular data type is collecting excessive data, you may want to analyze the data in that table to determine particular records that are increasing. This example filters particular event IDs in the  `Event` table and then provides a count for each ID. You can modify this queries using the columns from other tables.

```kusto
Event
| where TimeGenerated > startofday(ago(31d)) and TimeGenerated < startofday(now()) 
| where EventID == 5145 or EventID == 5156
| where _IsBillable == true
| summarize count(), Bytes=sum(_BilledSize) by EventID, bin(TimeGenerated, 1d)
```

## Data volume by computer
Analyze the amount of billable data collect from a virtual machine or set of virtual machines. The **Usage** table doesn't include information about data collected from virtual machines, so these queries use the [find operator](/azure/data-explorer/kusto/query/findoperator) to search all tables that include a computer name. The **Usage** type is omitted because this is only for analytics of data trends. 

> [!WARNING]
> Use [find](/azure/data-explorer/kusto/query/findoperator?pivots=azuremonitor) queries sparingly because scans across data types are [resource intensive](./query-optimization.md#query-details-pane) to execute. If you don't need results per subscription, resource group, or resource name, use the [Usage](/azure/azure-monitor/reference/tables/usage) table as in the queries above.

**Billable data volume by computer for the last full day**
  
```kusto
find where TimeGenerated between(startofday(ago(1d))..startofday(now())) project _BilledSize, _IsBillable, Computer, Type
| where _IsBillable == true and Type != "Usage"
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| summarize BillableDataBytes = sum(_BilledSize) by  computerName 
| sort by BillableDataBytes desc nulls last
```

**Count of billable events by computer for the last full day**

```kusto
find where TimeGenerated between(startofday(ago(1d))..startofday(now())) project _IsBillable, Computer, Type
| where _IsBillable == true and Type != "Usage"
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| summarize eventCount = count() by computerName  
| sort by eventCount desc nulls last
```

## Data volume by Azure resource, resource group, or subscription
Analyze the amount of billable data collected from a particular resource or set of resources. These queries use the [_ResourceId](./log-standard-columns.md#_resourceid) and [_SubscriptionId](./log-standard-columns.md#_subscriptionid) columns for data from resources hosted in Azure. 

> [!WARNING]
> Use [find](/azure/data-explorer/kusto/query/findoperator?pivots=azuremonitor) queries sparingly because scans across data types are [resource intensive](./query-optimization.md#query-details-pane) to execute. If you don't need results per subscription, resource group, or resource name, use the [Usage](/azure/azure-monitor/reference/tables/usage) table as in the queries above.

**Billable data volume by resource ID for the last full day**

```kusto
find where TimeGenerated between(startofday(ago(1d))..startofday(now())) project _ResourceId, _BilledSize, _IsBillable
| where _IsBillable == true 
| summarize BillableDataBytes = sum(_BilledSize) by _ResourceId 
| sort by BillableDataBytes nulls last
```

**Billable data volume by resource group for the last full day**

```kusto
find where TimeGenerated between(startofday(ago(1d))..startofday(now())) project _ResourceId, _BilledSize, _IsBillable
| where _IsBillable == true 
| summarize BillableDataBytes = sum(_BilledSize) by _ResourceId
| extend resourceGroup = tostring(split(_ResourceId, "/")[4] )
| summarize BillableDataBytes = sum(BillableDataBytes) by resourceGroup 
| sort by BillableDataBytes nulls last
```

It may be helpful to parse the **_ResourceId** :

```Kusto
| parse tolower(_ResourceId) with "/subscriptions/" subscriptionId "/resourcegroups/" 
    resourceGroup "/providers/" provider "/" resourceType "/" resourceName   
```

**Billable data volume by subscription for the last full day**

```kusto
find where TimeGenerated between(startofday(ago(1d))..startofday(now())) project _BilledSize, _IsBillable, _SubscriptionId
| where _IsBillable == true 
| summarize BillableDataBytes = sum(_BilledSize) by _SubscriptionId 
| sort by BillableDataBytes nulls last
```

> [!TIP]
> For workspaces with large data volumes, doing queries such as shown in this section -- which query large volumes of raw data -- might need to be restricted to a single day. To track trends over time, consider settting up a [Power BI report](./log-powerbi.md) and using [incremental refresh](./log-powerbi.md#collect-data-with-power-bi-dataflows) to collect data volumes per resource once a day. 

## Querying for common data types
If you find that you have excessive billable data for a particular data type, then you may need to perform a query to analyze data in that table. The following queries provide samples for some common data types:

**Security** solution

```kusto
SecurityEvent 
| summarize AggregatedValue = count() by EventID
| order by AggregatedValue desc nulls last
```

**Log Management** solution

```kusto
Usage 
| where Solution == "LogManagement" and iff(isnotnull(toint(IsBillable)), IsBillable == true, IsBillable == "true") == true 
| summarize AggregatedValue = count() by DataType
| order by AggregatedValue desc nulls last
```

**Perf** data type

```kusto
Perf 
| summarize AggregatedValue = count() by CounterPath
```

```kusto
Perf 
| summarize AggregatedValue = count() by CounterName
```

**Event** data type

```kusto
Event 
| summarize AggregatedValue = count() by EventID
```

```kusto
Event 
| summarize AggregatedValue = count() by EventLog, EventLevelName
```

**Syslog** data type

```kusto
Syslog 
| summarize AggregatedValue = count() by Facility, SeverityLevel
```

```kusto
Syslog 
| summarize AggregatedValue = count() by ProcessName
```

**AzureDiagnostics** data type

```kusto
AzureDiagnostics 
| summarize AggregatedValue = count() by ResourceProvider, ResourceId
```

## Application insights data
There are two approaches to investigating the amount of data collected for Application Insights, depending on whether you have a classic or workspace-based application. Use the `_BilledSize` property that is available on each ingested event for both workspace-based and classic resources. You can also use aggregated information in the [systemEvents](/azure/azure-monitor/reference/tables/appsystemevents) table for classic resources.


> [!NOTE]
> Queries against Application Insights table except `SystemEvents` will work for both a workspace-based and classic Application Insights resource, since [backwards compatibility](../app/convert-classic-resource.md#understand-log-queries) allows you to continue to use [legacy table names](../app/apm-tables.md). For a workspace-based resource, open **Logs** from the **Log Analytics workspace** menu. For a classic resource, open **Logs** from the **Application Insights** menu.

**Dependency operations generate the most data volume in the last 30 days (workspace-based or classic)**

```kusto
dependencies
| where timestamp >= startofday(ago(30d))
| summarize sum(_BilledSize) by operation_Name
| render barchart  
```

**Daily data volume by type for this Application Insights resource the last 7 days (classic only)**

```kusto
systemEvents
| where timestamp >= startofday(ago(7d)) and timestamp < startofday(now())
| where type == "Billing"
| extend BillingTelemetryType = tostring(dimensions["BillingTelemetryType"])
| extend BillingTelemetrySizeInBytes = todouble(measurements["BillingTelemetrySize"])
| summarize sum(BillingTelemetrySizeInBytes) by BillingTelemetryType, bin(timestamp, 1d)  
```

### Data volume trends for workspace-based resources
To look at the data volume trends for [workspace-based Application Insights resources](../app/create-workspace-resource.md), use a query that includes all of the Application insights tables. The following queries use the [tables names specific to workspace-based resources](../app/apm-tables.md#table-schemas).


**Daily data volume by type for all Application Insights resources in a workspace for the 7 days**

```kusto
union AppAvailabilityResults,
      AppBrowserTimings,
      AppDependencies,
      AppExceptions,
      AppEvents,
      AppMetrics,
      AppPageViews,
      AppPerformanceCounters,
      AppRequests,
      AppSystemEvents,
      AppTraces
| where TimeGenerated >= startofday(ago(7d)) and TimeGenerated < startofday(now())
| summarize sum(_BilledSize) by _ResourceId, bin(TimeGenerated, 1d)
```

To look at the data volume trends for only a single Application Insights resource, add the following line before the `summarize` in the above query:

```kusto
| where _ResourceId contains "<myAppInsightsResourceName>"
```

> [!TIP]
> For workspaces with large data volumes, doing queries such as this one above which query large volumes of raw data might need to be restricted to a single day. To track trends over time, consider settting up a [Power BI report](./log-powerbi.md) and using [incremental refresh](./log-powerbi.md#collect-data-with-power-bi-dataflows) to collect data volumes per resource once a day. 

## Understanding nodes sending data
If you don't have excessive data from any particular source, you may have an excessive number of agents that are sending data.

**Count of agent nodes that are sending a heartbeat each day in the last month**

```kusto
Heartbeat 
| where TimeGenerated > startofday(ago(31d))
| summarize nodes = dcount(Computer) by bin(TimeGenerated, 1d)    
| render timechart
```

> [!WARNING]
> Use [find](/azure/data-explorer/kusto/query/findoperator?pivots=azuremonitor) queries sparingly because scans across data types are [resource intensive](./query-optimization.md#query-details-pane) to execute. If you don't need results per subscription, resource group, or resource name, use the [Usage](/azure/azure-monitor/reference/tables/usage) table as in the queries above.
**Count of nodes sending any data in the last 24 hours**

```kusto
find where TimeGenerated > ago(24h) project Computer
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| summarize nodes = dcount(computerName)
```

**Data volume sent by each node in the last 24 hours**

```kusto
find where TimeGenerated > ago(24h) project _BilledSize, Computer
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| summarize TotalVolumeBytes=sum(_BilledSize) by computerName
```

## Nodes billed by the legacy Per Node pricing tier
The [legacy Per Node pricing tier](cost-logs.md#legacy-pricing-tiers) bills for nodes with hourly granularity and also doesn't count nodes that are only sending a set of security data types. To get a list of computers that will be billed as nodes if the workspace is in the legacy Per Node pricing tier, look for nodes that are sending billed data types since some data types are free. In this case, use the leftmost field of the fully qualified domain name. 

The following queries return the count of computers with billed data per hour. The number of units on your bill is in units of node months, which is represented by `billableNodeMonthsPerDay` in the query. If the workspace has the Update Management solution installed, add the **Update** and **UpdateSummary** data types to the list in the `where` clause. 

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
> [!NOTE]
> There's some additional complexity in the actual billing algorithm when solution targeting is used that's not represented in the above query. 

## Security and Automation node counts

**Count of distinct security nodes**

```kusto
union
(
    Heartbeat
    | where (Solutions has 'security' or Solutions has 'antimalware' or Solutions has 'securitycenter')
    | project Computer
),
(
    ProtectionStatus
    | where Computer !in (Heartbeat | project Computer)
    | project Computer
)
| distinct Computer
| project lowComputer = tolower(Computer)
| distinct lowComputer
| count
```

**Number of distinct Automation nodes**

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

## Late-arriving data
If you observe high data ingestion reported using `Usage` records, but you don't observe the same results summing `_BilledSize` directly on the data type, it's possible that you have late-arriving data. This is when data is ingested with old timestamps. 

For example, an agent may have a connectivity issue and send accumulated data once it reconnects. Or a host may have an incorrect time. This can result in an apparent discrepancy between the ingested data reported by the [Usage](/azure/azure-monitor/reference/tables/usage) data type and a query summing [_BilledSize](./log-standard-columns.md#_billedsize) over the raw data for a particular day specified by **TimeGenerated**, the timestamp when the event was generated.

To diagnose late-arriving data issues, use the [_TimeReceived](./log-standard-columns.md#_timereceived) column  in addition to the [TimeGenerated](./log-standard-columns.md#timegenerated) column. `_TimeReceived` is the time when the record was received by the Azure Monitor ingestion point in the Azure cloud.

The following example is in response to high ingested data volumes of [W3CIISLog](/azure/azure-monitor/reference/tables/w3ciislog) data on May 2, 2021 to identify the timestamps on this ingested data. The `where TimeGenerated > datetime(1970-01-01)` statement is included to provide the clue to the Log Analytics user interface to look over all data. 

```Kusto
W3CIISLog
| where TimeGenerated > datetime(1970-01-01)
| where _TimeReceived >= datetime(2021-05-02) and _TimeReceived < datetime(2021-05-03) 
| where _IsBillable == true
| summarize BillableDataMB = sum(_BilledSize)/1.E6 by bin(TimeGenerated, 1d)
| sort by TimeGenerated asc 
```

## Next steps

- See [Azure Monitor Logs pricing details](cost-logs.md) for details on how charges are calculated for data in a Log Analytics workspace and different configuration options to reduce your charges.
- See [Azure Monitor cost and usage](../usage-estimated-costs.md) for a description of the different types of Azure Monitor charges and how to analyze them on your Azure bill.
- See [Azure Monitor best practices - Cost management](../best-practices-cost.md) for best practices on configuring and managing Azure Monitor to minimize your charges.
- See [Data collection transformations in Azure Monitor (preview)](../essentials/data-collection-transformations.md) for details on using transformations to reduce the amount of data you collected in a Log Analytics workspace by filtering unwanted records and columns.
