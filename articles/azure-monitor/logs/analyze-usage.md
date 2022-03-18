---
title: Analyze usage in Log Analytics workspace in Azure Monitor
description: Methods and queries to analyze the data in your Log Analytics workspace to help you understand usage and potential cause for high usage.
ms.topic: conceptual
ms.date: 02/18/2022
---
 
# Analyze usage in Log Analytics workspace
This article provides guidance on analyzing the data being collected in your Log Analytics workspace. This can assist in controlling your costs by determining the cause of higher than expected usage and also to predict your costs as you monitor additional resources and configure different Azure Monitor features.


## Create an alert when data collection is high
In order to avoid unexpected bills, you should be proactively notified whenever you experience excessive usage. This allows you analyze your data to address potential anomalies before the end of your billing period. When you receive an alert, use the guidance in this article to determine why usage is higher than expected and make changes before you generate significant additional charges.

The following example is a [log alert rule](../alerts/alerts-unified-log.md) that sends an alert if the billable data volume ingested in the last 24 hours was greater than 50 GB. Modify the **Alert Logic** to use a different threshold based on the usage in your environment.

| Setting | Value |
|:---|:---|
| **Scope** | |
| Target scope | Select your Log Analytics workspace. |
| **Condition** | |
| Query | `Usage \| where IsBillable \| summarize DataGB = sum(Quantity / 1000.)` |
| Measurement | Measure: *DataGB*<br>Aggregation type: Total<br>Aggregation granularity: 1 day |
| Alert Logic | Operator: Greater than<br>Threshold value: 50<br>Frequency of evaluation: 1 day |
| Actions | Select or add an [action group](../alerts/action-groups.md) to notify you when the threshold is exceeded. |
| **Details** | |
| Severity| Warning |
| Alert rule name | Billable data volume greater than 50 GB in 24 hours |



## Causes of high usage
Higher than expected usage in a Log Analytics workspace is typically caused by on of the following conditions:

- More nodes than expected sending data to the workspace. See [Understanding nodes sending data](#understanding-nodes-sending-data).
- More data than expected being sent to the workspace. See [Understanding ingested data volume](#understanding-ingested-data-volume).

If you observe high data ingestion reported using the `Usage` records (see the [Data volume by solution](#data-volume-by-solution) section), but you don't observe the same results summing `_BilledSize` directly on the [data type](#data-volume-for-specific-events), it's possible that you have significant late-arriving data. For information about how to diagnose this, see the [Late arriving data](#late-arriving-data) section of this article. 

#

# Log Analytics Workspace Insights
Start understanding your the data volumes collected by your workspace with in [Log Analytics Workspace Insights](log-analytics-workspace-insights-overview.md#usage-tab) which provides a quick summary of the following:

- Data tables ingesting the most data volume in the main table
- Top resources contributing data
- Trend of data ingestion

See the **Usage** tab for a breakdown of ingestion by solution and table. This can help you quickly identify the tables that contribute to the bulk of your data volume. Select **Additional Queries** for pre-built queries that help you further understand your data patterns. If you have additional questions, or you want perform deeper analysis, then have a look at the queries in the following sections.


## Understanding ingested data volume
The *Data ingestion per solution* chart on the **Usage and Estimated Costs** page for each workspace shows the total volume of data sent and how much is being sent by each solution over the previous 31 days. This helps you determine trends such as whether any increase is from overall data usage or usage by a particular solution. 


## Log queries
To work with the data interactively and drill down on the usage details, use the following queries in [Log Analytics](log-analytics-overview.md). These queries use the [Usage](/azure/azure-monitor/reference/tables/usage) table that collects usage data for each table in the workspace. 

The clause with `TimeGenerated` is only to ensure that the query experience in the Azure portal looks back beyond the default 24 hours. When using the **Usage** data type, `StartTime` and `EndTime` represent the time buckets for which results are presented. The clause `where _IsBillable = true` filters out any data  from certain solutions for which there is [no ingestion charge](./log-standard-columns.md#_isbillable). The **_BilledSize** [property](./log-standard-columns.md#_billedsize), which provides the size in bytes:

> [!WARNING]
> Some of the columns in the **Usage** table, while still in the schema, have been deprecated and their values are no longer populated. 
> These are **Computer**, as well as fields related to ingestion (**TotalBatches**, **BatchesWithinSla**, **BatchesOutsideSla**, **BatchesCapped** and **AverageProcessingTimeMs**).

### Data volume by solution
 use following query that uses the  to view the billable data volume by solution over the last month (excluding the last partial day):

```kusto
Usage 
| where TimeGenerated > ago(32d)
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000. by bin(StartTime, 1d), Solution 
| render columnchart
```

### Data volume by type
Use a similar query to perform the same analysis grouped by data type.

```kusto
Usage 
| where TimeGenerated > ago(32d)
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000. by bin(StartTime, 1d), DataType 
| render columnchart
```

Or to see a table by solution and type for the last month.

```kusto
Usage 
| where TimeGenerated > ago(32d)
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000 by Solution, DataType
| sort by Solution asc, DataType asc
```

### Data volume for specific events
If you find that a particular data type is collecting excessive data, you may want to analyze the data in that table to determine particular records that are increasing. This example filters particular event IDs in the  `Event` table and then provides a count for each ID. You can modify this queries using the columns from other tables.

```kusto
Event
| where TimeGenerated > startofday(ago(31d)) and TimeGenerated < startofday(now()) 
| where EventID == 5145 or EventID == 5156
| where _IsBillable == true
| summarize count(), Bytes=sum(_BilledSize) by EventID, bin(TimeGenerated, 1d)
```

### Data volume by computer
The **Usage** table doesn't include information about data collected from virtual machines, so you need to use the [find operator](/azure/data-explorer/kusto/query/findoperator) to search all tables that include a computer name. The **Usage** type is omitted because this is only for analytics of data trends. 

> [!IMPORTANT]
> Use these `find` queries sparingly because scans across data types are [resource intensive](./query-optimization.md#query-performance-pane) to execute. If you don't need results **per computer**, query on the **Usage** data type.

 To see the **size** of ingested billable data per computer: 
 
```kusto
find where TimeGenerated > ago(24h) project _BilledSize, _IsBillable, Computer, Type
| where _IsBillable == true and Type != "Usage"
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| summarize BillableDataBytes = sum(_BilledSize) by  computerName 
| sort by BillableDataBytes desc nulls last
```


To see the **count** of billable events ingested per computer:

```kusto
find where TimeGenerated > ago(24h) project _IsBillable, Computer
| where _IsBillable == true and Type != "Usage"
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| summarize eventCount = count() by computerName  
| sort by eventCount desc nulls last
```

### Data volume by Azure resource, resource group, or subscription

> [!TIP]
> Use these `find` queries sparingly because scans across data types are [resource intensive](./query-optimization.md#query-performance-pane) to execute. If you don't need results per subscription, resouce group, or resource name, query on the **Usage** data type.

Use the [_ResourceId property](./log-standard-columns.md#_resourceid) for data from resources hosted in Azure. , you can get the **size** of ingested data __per computer__, , which provides the full path to the resource:

```kusto
find where TimeGenerated > ago(24h) project _ResourceId, _BilledSize, _IsBillable
| where _IsBillable == true 
| summarize BillableDataBytes = sum(_BilledSize) by _ResourceId | sort by BillableDataBytes nulls last
```

Use the [_ResourcenId](./log-standard-columns.md#_resourceid) for data from all resources in a resource group.

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


Use the [_SubscriptionId](./log-standard-columns.md#_subscriptionid) for data from all resources in an Azure subscription.

For data from nodes hosted in Azure, you can get the **size** of ingested data __per Azure subscription__ by  property as:

```kusto
find where TimeGenerated > ago(24h) project _BilledSize, _IsBillable, _SubscriptionId
| where _IsBillable == true 
| summarize BillableDataBytes = sum(_BilledSize) by _SubscriptionId | sort by BillableDataBytes nulls last
```
## Querying for common data types

To dig deeper into the source of data for a particular data type, here are some useful example queries:

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

## Application insights
There are two approaches to investigating data volumes for Application Insights. For workspace-based Application Insights resources, use the `_BilledSize` property that is available on each ingested event. For classic Application insights resources, you can use the same method or use aggregated information in the [systemEvents](/azure/azure-monitor/reference/tables/appsystemevents) table.


### Aggregated data volume information
The following queries can only be used for classic Application Insights resources since the `systemEvents` table doesn't have data size information for workspace-based resources.

Show the data volume ingested in the last 24 hours:

```kusto
systemEvents
| where timestamp >= ago(24h)
| where type == "Billing"
| extend BillingTelemetryType = tostring(dimensions["BillingTelemetryType"])
| extend BillingTelemetrySizeInBytes = todouble(measurements["BillingTelemetrySize"])
| summarize sum(BillingTelemetrySizeInBytes)
```

Display a chart of data volume (in bytes) by data type for the last 30 days:

```kusto
systemEvents
| where timestamp >= startofday(ago(30d))
| where type == "Billing"
| extend BillingTelemetryType = tostring(dimensions["BillingTelemetryType"])
| extend BillingTelemetrySizeInBytes = todouble(measurements["BillingTelemetrySize"])
| summarize sum(BillingTelemetrySizeInBytes) by BillingTelemetryType, bin(timestamp, 1d) | render barchart  
```

Show the count of events by type using the query:

```kusto
systemEvents
| where timestamp >= startofday(ago(30d))
| where type == "Billing"
| extend BillingTelemetryType = tostring(dimensions["BillingTelemetryType"])
| summarize count() by BillingTelemetryType, bin(timestamp, 1d)
| render barchart  
```

### Use data size per event information
The following queries can only be used for either classic or workspace-based Application Insights resources.

Display which operations generate the most data volume in the last 30 days:

```kusto
dependencies
| where timestamp >= startofday(ago(30d))
| summarize sum(_BilledSize) by operation_Name
| render barchart  
```


### Data volume for workspace-based Application Insights resources
To look at the data volume trends for [workspace-based Application Insights resources](create-workspace-resource.md), use a query that includes all of the Application insights tables. The following queries use the [tables names specific to workspace-based resources](../app/apm-tables#table-schemas.md).


Display a chart with the data volume trends for all Application Insights resources in a workspace for the last week:

```kusto
union (AppAvailabilityResults),
      (AppBrowserTimings),
      (AppDependencies),
      (AppExceptions),
      (AppEvents),
      (AppMetrics),
      (AppPageViews),
      (AppPerformanceCounters),
      (AppRequests),
      (AppSystemEvents),
      (AppTraces)
| where TimeGenerated >= startofday(ago(7d)) and TimeGenerated < startofday(now())
| summarize sum(_BilledSize) by _ResourceId, bin(TimeGenerated, 1d)
| render areachart
```

Display a chart with the data volume trends for a specific Application Insights resource in a workspace for the last week:

```kusto
union (AppAvailabilityResults),
      (AppBrowserTimings),
      (AppDependencies),
      (AppExceptions),
      (AppEvents),
      (AppMetrics),
      (AppPageViews),
      (AppPerformanceCounters),
      (AppRequests),
      (AppSystemEvents),
      (AppTraces)
| where TimeGenerated >= startofday(ago(7d)) and TimeGenerated < startofday(now())
| where _ResourceId contains "<myAppInsightsResourceName>"
| summarize sum(_BilledSize) by Type, bin(TimeGenerated, 1d)
| render areachart
```




## Understanding nodes sending data
If you don't have excessive data from any particular source, you may have an excessive number of agents that are sending data.

> [!IMPORTANT]
> Use these `find` queries sparingly because scans across data types are [resource intensive](./query-optimization.md#query-performance-pane) to execute. If you don't need results **per computer**, then query on the **Usage** data type.


Count of nodes that are reporting heartbeats from the agent each day in the last month:

```kusto
Heartbeat 
| where TimeGenerated > startofday(ago(31d))
| summarize nodes = dcount(Computer) by bin(TimeGenerated, 1d)    
| render timechart
```

Count of nodes sending any data in the last 24 hours:

```kusto
find where TimeGenerated > ago(24h) project Computer
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| summarize nodes = dcount(computerName)
```

List of nodes sending any data and the amount of data sent by each:

```kusto
find where TimeGenerated > ago(24h) project _BilledSize, Computer
| extend computerName = tolower(tostring(split(Computer, '.')[0]))
| where computerName != ""
| summarize TotalVolumeBytes=sum(_BilledSize) by computerName
```

### Nodes billed by the legacy Per Node pricing tier
The [legacy Per Node pricing tier](#legacy-pricing-tiers) bills for nodes with hourly granularity and also doesn't count nodes that are only sending a set of security data types. To get a list of computers that will be billed as nodes if the workspace is in the legacy Per Node pricing tier, look for nodes that are sending billed data types since some data types are free. In this case, use the leftmost field of the fully qualified domain name. 

Return the count of computers with billed data per hour. The number of units on your bill is in units of node months, which is represented by `billableNodeMonthsPerDay` in the query. If the workspace has the Update Management solution installed, add the **Update** and **UpdateSummary** data types to the list in the where clause in the above query. 

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

### Security and Automation node counts

Number of distinct Security nodes:

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

Number of distinct Automation nodes:

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
Situations can arise where data is ingested with old timestamps. For example, an agent has a connectivity issue or a host may have an incorrect time date/time. This can result in an apparent discrepancy between the ingested data reported by the [Usage](/azure/azure-monitor/reference/tables/usage) data type and a query summing [_BilledSize](./log-standard-columns.md#_billedsize) over the raw data for a particular day specified by **TimeGenerated**, the timestamp when the event was generated.

To diagnose late-arriving data issues, use the [_TimeReceived](./log-standard-columns.md#_timereceived) column  in addition to the [TimeGenerated](./log-standard-columns.md#_timegenerated) column. `_TimeReceived` is the time when the record was received by the Azure Monitor ingestion point in the Azure cloud.

The following example is in response to high ingested data volumes of [W3CIISLog](./log-standard-columns.md#w3ciislog) data on May 2, 2021 to identify the timestamps on this ingested data. The `where TimeGenerated > datetime(1970-01-01)` statement is included to provide the clue to the Log Analytics user interface to look over all data. 

```Kusto
W3CIISLog
| where TimeGenerated > datetime(1970-01-01)
| where _TimeReceived >= datetime(2021-05-02) and _TimeReceived < datetime(2021-05-03) 
| where _IsBillable == true
| summarize BillableDataMB = sum(_BilledSize)/1.E6 by bin(TimeGenerated, 1d)
| sort by TimeGenerated asc 
```

## Next steps
