---
title: Aggregations in Azure Log Analytics queries| Microsoft Docs
description: Describes aggregation functions in Log Analytics queries that offer useful ways to analyze your data.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/16/2018
ms.author: bwren
ms.component: na
---


# Log Analytics query examples - security records



## Calculate the average size of perf usage reports per computer

This example calculates the average size of perf usage reports per computer, over the last 3 hours.
The results are shown in a bar chart.
```Kusto
Usage 
| where TimeGenerated > ago(3h)
| where DataType == "Perf" 
| where QuantityUnit == "MBytes" 
| summarize avg(Quantity) by Computer
| sort by avg_Quantity desc nulls last
| render barchart
```

## Chart a week-over-week view of the number of computers sending data

The following example charts the number of distinct computers that sent heartbeats, each week.

```Kusto
Heartbeat
| where TimeGenerated >= startofweek(ago(21d))
| summarize dcount(Computer) by endofweek(TimeGenerated) | render barchart kind=default
```

## Chart the record-count per table in the last 5 hours

The following example collects all records of all tables from the last 5 hours, and counts how many records were in each table, in each point in time.
The results are shown in a timechart.

```Kusto
union withsource=sourceTable *
| where TimeGenerated > ago(5h) 
| summarize count() by bin(TimeGenerated,10m), sourceTable
| render timechart
```

## Computers Still Missing Updates

The following example shows a list of Computers that were missing one or more critical updates a few days ago and are still missing updates.
```Kusto
let ComputersMissingUpdates3DaysAgo = Update
| where TimeGenerated between (ago(3d)..ago(2d))
| where  Classification == "Critical Updates" and UpdateState != "Not needed" and UpdateState != "NotNeeded"
| summarize makeset(Computer);

Update
| where TimeGenerated > ago(1d)
| where  Classification == "Critical Updates" and UpdateState != "Not needed" and UpdateState != "NotNeeded"
| where Computer in (ComputersMissingUpdates3DaysAgo)
| summarize UniqueUpdatesCount = dcount(Product) by Computer, OSType
```

## Computers with non-reporting protection status duration

The following example lists computers that had a list one "Not Reporting" protection status.
It also measures the duration they were in this status (assuming it's a single event, not several "fragmentations" in reporting).
```Kusto
ProtectionStatus
| where ProtectionStatus == "Not Reporting"
| summarize count(), startNotReporting = min(TimeGenerated), endNotReporting = max(TimeGenerated) by Computer, ProtectionStatusDetails
| join ProtectionStatus on Computer
| summarize lastReporting = max(TimeGenerated), startNotReporting = any(startNotReporting), endNotReporting = any(endNotReporting) by Computer
| extend durationNotReporting = endNotReporting - startNotReporting
```

## Computers with unhealthy latency

The following example creates a list of distinct computers with unhealthy latency.
```Kusto
NetworkMonitoring 
| where LatencyHealthState <> "Healthy" 
| where Computer != "" 
| distinct Computer
```

## Join computer perf records to correlate memory and CPU

This example correlates a given computer's perf records, and creates 2 time charts: the average CPU and maximum memory, in 30-minute bins.

```Kusto
let StartTime = now()-5d;
let EndTime = now()-4d;
Perf
| where CounterName == "% Processor Time"  
| where TimeGenerated > StartTime and TimeGenerated < EndTime
and TimeGenerated < EndTime
| project TimeGenerated, Computer, cpu=CounterValue 
| join kind= inner (
   Perf
    | where CounterName == "% Used Memory"  
    | where TimeGenerated > StartTime and TimeGenerated < EndTime
    | project TimeGenerated , Computer, mem=CounterValue 
) on TimeGenerated, Computer
| summarize avgCpu=avg(cpu), maxMem=max(mem) by TimeGenerated bin=30m  
| render timechart
```

## Count all logs collected over the last hour, per type

The following example search everything reported in the last hour and counts the records of each table using the system column $table.
The results are displayed in a bar chart.

```Kusto
search *
| where TimeGenerated > ago(1h) 
| summarize CountOfRecords = count() by $table
| render barchart
```

## Count and chart alerts severity, per day

The following example creates an unstacked bar chart of alert count by severity, per day:
```Kusto
Alert 
| where TimeGenerated > ago(7d)
| summarize count() by AlertSeverity, bin(TimeGenerated, 1d)
| render barchart kind=unstacked
```

## Count Azure diagnostics records per category

Count Azure diagnostics records for each unique category.

```Kusto
AzureDiagnostics 
| where TimeGenerated > ago(1d)
| summarize count() by Category
```

## Count security events by activity ID

This example relies on the fixed structure of the Activity column: <ID>-<Name>.
It parses the Activity value into 2 new columns, and counts the occurrence of each activity ID
```Kusto
SecurityEvent
| where TimeGenerated > ago(30m) 
| project Activity 
| parse Activity with activityID " - " activityDesc
| summarize count() by activityID
```

## Count security events related to permissions

This example show the number of securityEvent records, in which the Activity column contains the whole term "Permissions".
The query applies to records created over the last 30m.
```Kusto
SecurityEvent
| where TimeGenerated > ago(30m)
| summarize EventCount = countif(Activity has "Permissions")
```





See other lessons for using the Log Analytics query language:

- [String operations](string-operations.md)
- [Date and time operations](datetime-operations.md)
- [Advanced aggregations](advanced-aggregations.md)
- [JSON and data structures](json-data-structures.md)
- [Advanced query writing](advanced-query-writing.md)
- [Joins](joins.md)
- [Charts](charts.md)
