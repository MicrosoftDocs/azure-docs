---
title: Manage usage and costs for Azure Monitor Logs
description: Learn how to change the pricing plan and manage data volume and retention policy for your Log Analytics workspace in Azure Monitor.
ms.topic: conceptual
ms.date: 02/18/2022
---
 
# Analyze usage in Log Analytics workspace
This article provides guidance on analyzing the data being collected in your Log Analytics workspace.

## Causes of high usage
Higher than expected usage in a Log Analytics workspace can be caused by the following:

- More nodes than expected sending data to the workspace. See [Understanding nodes sending data](#understanding-nodes-sending-data).
- More data than expected being sent to the workspace. See [Understanding ingested data volume](#understanding-ingested-data-volume).

If you observe high data ingestion reported using the `Usage` records (see the [Data volume by solution](#data-volume-by-solution) section), but you don't observe the same results summing `_BilledSize` directly on the [data type](#data-volume-for-specific-events), it's possible that you have significant late-arriving data. For information about how to diagnose this, see the [Late arriving data](#late-arriving-data) section of this article. 

#

## Create an alert when data collection is high
In order to avoid unexpected bills, you should be proactively notified whenever you experience excessive usage. This allows you analyze your data to address potential anomalies before the end of your billing period.

Create a [log alert rule](../alerts/alerts-unified-log.md) with the details below. This example sends an alert if the billable data volume ingested in the last 24 hours was greater than 50 GB.

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


When you receive an alert, use the guidance in the following sections to troubleshoot why usage is higher than expected.

# Log Analytics Workspace Insights
Start understanding your data volumes in the **Usage** tab in [Log Analytics Workspace Insights](log-analytics-workspace-insights-overview.md#usage-tab) which shows the following:

- Data tables ingesting the most data volume in the main table
- Top resources contributing data
- Trend of data ingestion

Select **Additional Queries** for pre-built queries that help you further understand your data patterns. If you have additional questions, or you want perform deeper analysis, then have a look at the queries in the following sections.



## Understanding ingested data volume
On the **Usage and Estimated Costs** page, the *Data ingestion per solution* chart shows the total volume of data sent and how much is being sent by each solution. This helps you determine trends such as whether the overall data usage or usage by a particular solution is growing, remaining steady, or decreasing. 

### Data volume for specific events
Use a query like the following to analyze the billable usage for a particular table. The clause `where _IsBillable = true` filters out data types from certain solutions for which there is [no ingestion charge](./log-standard-columns.md#_isbillable).

This example analyzes particular event IDs in the  `Event` table. You can modify it for other tables and criteria.

```kusto
Event
| where TimeGenerated > startofday(ago(31d)) and TimeGenerated < startofday(now()) 
| where EventID == 5145 or EventID == 5156
| where _IsBillable == true
| summarize count(), Bytes=sum(_BilledSize) by EventID, bin(TimeGenerated, 1d)
```


### Data volume by solution

Use the following query to view the billable data volume by solution over the last month (excluding the last partial day) can be built using the [Usage](/azure/azure-monitor/reference/tables/usage) data type as:

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
           


