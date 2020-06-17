---
title: Azure Monitor log query examples | Microsoft Docs
description: Examples of log queries in Azure Monitor using the Kusto query language.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/16/2020

---

# Azure Monitor log query examples
This article includes various examples of [queries](log-query-overview.md) using the [Kusto query language](/azure/kusto/query/) to retrieve different types of log data from Azure Monitor. Different methods are used to consolidate and analyze data, so you can use these samples to identify different strategies that you might use for your own requirements.  

See the [Kusto language reference](https://docs.microsoft.com/azure/kusto/query/) for details on the different keywords used in these samples. Go through a [lesson on creating queries](get-started-queries.md) if you're new to Azure Monitor.

## Events

### Search application-level events described as "Cryptographic"
This example searches the **Events** table for records in which **EventLog** is _Application_ and **RenderedDescription** contains _cryptographic_. Includes records from the last 24 hours.

```Kusto
Event
| where EventLog == "Application" 
| where TimeGenerated > ago(24h) 
| where RenderedDescription contains "cryptographic"
```

### Search events related to unmarshaling
Search tables **Event** and **SecurityEvents** for records that mention _unmarshaling_.

```Kusto
search in (Event, SecurityEvent) "unmarshaling"
```

## Heartbeat

### Chart a week-over-week view of the number of computers sending data

The following example charts the number of distinct computers that sent heartbeats, each week.

```Kusto
Heartbeat
| where TimeGenerated >= startofweek(ago(21d))
| summarize dcount(Computer) by endofweek(TimeGenerated) | render barchart kind=default
```

### Find stale computers

The following example finds computers that were active in the last day but did not send heartbeats in the last hour.

```Kusto
Heartbeat
| where TimeGenerated > ago(1d)
| summarize LastHeartbeat = max(TimeGenerated) by Computer
| where isnotempty(Computer)
| where LastHeartbeat < ago(1h)
```

### Get the latest heartbeat record per computer IP

This example returns the last heartbeat record for each computer IP.
```Kusto
Heartbeat
| summarize arg_max(TimeGenerated, *) by ComputerIP
```

### Match protected status records with heartbeat records

This example finds related protection status records and heartbeat records, matched on both Computer and time.
Note the time field is rounded to the nearest minute. We used runtime bin calculation to do that: `round_time=bin(TimeGenerated, 1m)`.

```Kusto
let protection_data = ProtectionStatus
    | project Computer, DetectionId, round_time=bin(TimeGenerated, 1m);
let heartbeat_data = Heartbeat
    | project Computer, Category, round_time=bin(TimeGenerated, 1m);
protection_data | join (heartbeat_data) on Computer, round_time
```

### Server availability rate

Calculate server availability rate based on heartbeat records. Availability is defined as "at least 1 heartbeat per hour".
So, if a server was available 98 of 100 hours, the availability rate is 98%.

```Kusto
let start_time=startofday(datetime("2018-03-01"));
let end_time=now();
Heartbeat
| where TimeGenerated > start_time and TimeGenerated < end_time
| summarize heartbeat_per_hour=count() by bin_at(TimeGenerated, 1h, start_time), Computer
| extend available_per_hour=iff(heartbeat_per_hour>0, true, false)
| summarize total_available_hours=countif(available_per_hour==true) by Computer 
| extend total_number_of_buckets=round((end_time-start_time)/1h)+1
| extend availability_rate=total_available_hours*100/total_number_of_buckets
```


## Multiple data types

### Chart the record-count per table
The following example collects all records of all tables from the last five hours and counts how many records were in each table. The results are shown in a timechart.

```Kusto
union withsource=sourceTable *
| where TimeGenerated > ago(5h) 
| summarize count() by bin(TimeGenerated,10m), sourceTable
| render timechart
```

### Count all logs collected over the last hour by type
The following example searches everything reported in the last hour and counts the records of each table by **Type**. The results are displayed in a bar chart.

```Kusto
search *
| where TimeGenerated > ago(1h) 
| summarize CountOfRecords = count() by Type
| render barchart
```

## AzureDiagnostics

### Count Azure diagnostics records per category
This example counts all Azure diagnostics records for each unique category.

```Kusto
AzureDiagnostics 
| where TimeGenerated > ago(1d)
| summarize count() by Category
```

### Get a random record for each unique category
This example gets a single random Azure diagnostics record for each unique category.

```Kusto
AzureDiagnostics
| where TimeGenerated > ago(1d) 
| summarize any(*) by Category
```

### Get the latest record per category
This example gets the latest Azure diagnostics record in each unique category.

```Kusto
AzureDiagnostics
| where TimeGenerated > ago(1d) 
| summarize arg_max(TimeGenerated, *) by Category
```

## Network monitoring

### Computers with unhealthy latency
This example creates a list of distinct computers with unhealthy latency.

```Kusto
NetworkMonitoring 
| where LatencyHealthState <> "Healthy" 
| where Computer != "" 
| distinct Computer
```

## Performance

### Join computer perf records to correlate memory and CPU
This example correlates a particular computer's **perf** records and creates two time charts, the average CPU and maximum memory.

```Kusto
let StartTime = now()-5d;
let EndTime = now()-4d;
Perf
| where CounterName == "% Processor Time"  
| where TimeGenerated > StartTime and TimeGenerated < EndTime
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

### Perf CPU Utilization graph per computer
This example calculates and charts the CPU utilization of computers that start with _Contoso_.

```Kusto
Perf
| where TimeGenerated > ago(4h)
| where Computer startswith "Contoso" 
| where CounterName == @"% Processor Time"
| summarize avg(CounterValue) by Computer, bin(TimeGenerated, 15m) 
| render timechart
```

## Protection status

### Computers with non-reporting protection status duration
This example lists computers that had a protection status of _Not Reporting_  and the duration they were in this status.

```Kusto
ProtectionStatus
| where ProtectionStatus == "Not Reporting"
| summarize count(), startNotReporting = min(TimeGenerated), endNotReporting = max(TimeGenerated) by Computer, ProtectionStatusDetails
| join ProtectionStatus on Computer
| summarize lastReporting = max(TimeGenerated), startNotReporting = any(startNotReporting), endNotReporting = any(endNotReporting) by Computer
| extend durationNotReporting = endNotReporting - startNotReporting
```

### Match protected status records with heartbeat records
This example finds related protection status records and heartbeat records matched on both Computer and time.
The time field is rounded to the nearest minute using **bin**.

```Kusto
let protection_data = ProtectionStatus
    | project Computer, DetectionId, round_time=bin(TimeGenerated, 1m);
let heartbeat_data = Heartbeat
    | project Computer, Category, round_time=bin(TimeGenerated, 1m);
protection_data | join (heartbeat_data) on Computer, round_time
```


## Security records

### Count security events by activity ID


This example relies on the fixed structure of the **Activity** column: \<ID\>-\<Name\>.
It parses the **Activity** value into two new columns, and counts the occurrence of each **activityID**.

```Kusto
SecurityEvent
| where TimeGenerated > ago(30m) 
| project Activity 
| parse Activity with activityID " - " activityDesc
| summarize count() by activityID
```

### Count security events related to permissions
This example shows the number of **securityEvent** records, in which the **Activity** column contains the whole term _Permissions_. The query applies to records created over the last 30 minutes.

```Kusto
SecurityEvent
| where TimeGenerated > ago(30m)
| summarize EventCount = countif(Activity has "Permissions")
```

### Find accounts that failed to log in from computers with a security detection
This example finds and counts accounts that failed to log in from computers on which we identify a security detection.

```Kusto
let detections = toscalar(SecurityDetection
| summarize makeset(Computer));
SecurityEvent
| where Computer in (detections) and EventID == 4624
| summarize count() by Account
```

### Is my security data available?
Starting data exploration often starts with data availability check. This example shows the number of **SecurityEvent** records in the last 30 minutes.

```Kusto
SecurityEvent 
| where TimeGenerated  > ago(30m) 
| count
```

### Parse activity name and ID
The two examples below rely on the fixed structure of the **Activity** column: \<ID\>-\<Name\>. The first example uses the **parse** operator to assign values to two new columns: **activityID** and **activityDesc**.

```Kusto
SecurityEvent
| take 100
| project Activity 
| parse Activity with activityID " - " activityDesc
```

This example uses the **split** operator to create an array of separate values
```Kusto
SecurityEvent
| take 100
| project Activity 
| extend activityArr=split(Activity, " - ") 
| project Activity , activityArr, activityId=activityArr[0]
```

### Explicit credentials processes
The following example shows a pie chart of processes that used explicit credentials in the last week

```Kusto
SecurityEvent
| where TimeGenerated > ago(7d)
// filter by id 4648 ("A logon was attempted using explicit credentials")
| where EventID == 4648
| summarize count() by Process
| render piechart 
```

### Top running processes

The following example shows a time line of activity for the five most common processes, over the last three days.

```Kusto
// Find all processes that started in the last three days. ID 4688: A new process has been created.
let RunProcesses = 
    SecurityEvent
    | where TimeGenerated > ago(3d)
    | where EventID == "4688";
// Find the 5 processes that were run the most
let Top5Processes =
RunProcesses
| summarize count() by Process
| top 5 by count_;
// Create a time chart of these 5 processes - hour by hour
RunProcesses 
| where Process in (Top5Processes) 
| summarize count() by bin (TimeGenerated, 1h), Process
| render timechart
```


### Find repeating failed login attempts by the same account from different IPs

The following example finds failed login attempts by the same account from more than five different IPs in the last six hours.

```Kusto
SecurityEvent 
| where AccountType == "User" and EventID == 4625 and TimeGenerated > ago(6h) 
| summarize IPCount = dcount(IpAddress), makeset(IpAddress)  by Account
| where IPCount > 5
| sort by IPCount desc
```

### Find user accounts that failed to log in 
The following example identifies user accounts that failed to log in more than five times in the last day, and when they last attempted to log in.

```Kusto
let timeframe = 1d;
SecurityEvent
| where TimeGenerated > ago(1d)
| where AccountType == 'User' and EventID == 4625 // 4625 - failed log in
| summarize failed_login_attempts=count(), latest_failed_login=arg_max(TimeGenerated, Account) by Account 
| where failed_login_attempts > 5
| project-away Account1
```

Using **join**, and **let** statements we can check if the same suspicious accounts were later able to log in successfully.

```Kusto
let timeframe = 1d;
let suspicious_users = 
    SecurityEvent
    | where TimeGenerated > ago(timeframe)
    | where AccountType == 'User' and EventID == 4625 // 4625 - failed login
    | summarize failed_login_attempts=count(), latest_failed_login=arg_max(TimeGenerated, Account) by Account 
    | where failed_login_attempts > 5
    | project-away Account1;
let suspicious_users_that_later_logged_in = 
    suspicious_users 
    | join kind=innerunique (
        SecurityEvent
        | where TimeGenerated > ago(timeframe)
        | where AccountType == 'User' and EventID == 4624 // 4624 - successful login,
        | summarize latest_successful_login=arg_max(TimeGenerated, Account) by Account
    ) on Account
    | extend was_login_after_failures = iif(latest_successful_login>latest_failed_login, 1, 0)
    | where was_login_after_failures == 1
;
suspicious_users_that_later_logged_in
```

## Usage

The `Usage` data type can be used to track the ingested data volume by solution or data type. There are other techniques to study ingested data volumes by [computer](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#data-volume-by-computer) or [Azure subscription, resource group or resource](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#data-volume-by-azure-resource-resource-group-or-subscription).

#### Data volume by solution

The query used to view the billable data volume by solution over the last month (excluding the last partial day) is:

```kusto
Usage 
| where TimeGenerated > ago(32d)
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000. by bin(StartTime, 1d), Solution | render barchart
```

Note that the clause `where IsBillable = true` filters out data types from certain solutions for which there is no ingestion charge.  Also the clause with `TimeGenerated` is only to ensure that the query experience in the Azure portal will look back beyond the default 24 hours. When using the Usage data type, `StartTime` and `EndTime` represent the time buckets for which results are presented. 

#### Data volume by type

You can drill in further to see data trends for by data type:

```kusto
Usage 
| where TimeGenerated > ago(32d)
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000. by bin(StartTime, 1d), DataType | render barchart
```

Or to see a table by solution and type for the last month,

```kusto
Usage 
| where TimeGenerated > ago(32d)
| where StartTime >= startofday(ago(31d)) and EndTime < startofday(now())
| where IsBillable == true
| summarize BillableDataGB = sum(Quantity) / 1000. by Solution, DataType
| sort by Solution asc, DataType asc
```

> [!NOTE]
> Some of the fields of the Usage data type, while still in the schema, have been deprecated and will their values are no longer populated. 
> These are **Computer** as well as fields related to ingestion (**TotalBatches**, **BatchesWithinSla**, **BatchesOutsideSla**, **BatchesCapped** and **AverageProcessingTimeMs**.

## Updates

### Computers Still Missing Updates
This example shows a list of computers that were missing one or more critical updates a few days ago and are still missing updates.

```Kusto
let ComputersMissingUpdates3DaysAgo = Update
| where TimeGenerated between (ago(30d)..ago(1h))
| where Classification !has "Critical" and UpdateState =~ "Needed"
| summarize makeset(Computer);
Update
| where TimeGenerated > ago(1d)
| where Classification has "Critical" and UpdateState =~ "Needed"
| where Computer in (ComputersMissingUpdates3DaysAgo)
| summarize UniqueUpdatesCount = dcount(Product) by Computer, OSType
```


## Next steps

- Refer to the [Kusto language reference](/azure/kusto/query) for details on the language.
- Walk through a [lesson on writing log queries in Azure Monitor](get-started-queries.md).