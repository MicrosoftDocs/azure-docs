---
title: Log Analytics query examples - security records | Microsoft Docs
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


## Count security events by activity ID


This example relies on the fixed structure of the **Activity** column: \<ID\>-\<Name\>.
It parses the **Activity** value into two new columns, and counts the occurrence of each **activityID**.

```Kusto
SecurityEvent
| where TimeGenerated > ago(30m) 
| project Activity 
| parse Activity with activityID " - " activityDesc
| summarize count() by activityID
```

## Count security events related to permissions
This example shows the number of **securityEvent** records, in which the **Activity** column contains the whole term _Permissions_. The query applies to records created over the last 30 minutes.

```Kusto
SecurityEvent
| where TimeGenerated > ago(30m)
| summarize EventCount = countif(Activity has "Permissions")
```

## Find accounts that failed to log in from computers with a security detection
This example finds and counts accounts that failed to log in from computers on which we identify a security detection.

```Kusto
let detections = toscalar(SecurityDetection
| summarize makeset(Computer));
SecurityEvent
| where Computer in (detections) and EventID == 4624
| summarize count() by Account
```

## Is my security data available?
Starting data exploration often starts with data availability check. This example shows the number of **SecurityEvent** records in the last 30 minutes.

```Kusto
SecurityEvent 
| where TimeGenerated  > ago(30m) 
| count
```

## Parse activity name and ID
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

## Explicit credentials processes
The following example shows a pie chart of processes that used explicit credentials in the last week

```Kusto
SecurityEvent
| where TimeGenerated > ago(7d)
// filter by id 4648 ("A logon was attempted using explicit credentials")
| where EventID == 4648
| summarize count() by Process
| render piechart 
```

## Top running processes

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


## Find repeating failed log in attempts by the same account from different IPs

The following example finds failed log in attempts by the same account from more than 5 different IPs, in the last 6 hours, and then enumerates the IPs.

```Kusto
SecurityEvent 
| where AccountType == "User" and EventID == 4625 and TimeGenerated > ago(6h) 
| summarize IPCount = dcount(IpAddress), makeset(IpAddress)  by Account
| where IPCount > 5
| sort by IPCount desc
```

## Find user accounts that failed to log in 
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



See other lessons for using the Log Analytics query language:

- [String operations](string-operations.md)
- [Date and time operations](datetime-operations.md)
- [Advanced aggregations](advanced-aggregations.md)
- [JSON and data structures](json-data-structures.md)
- [Advanced query writing](advanced-query-writing.md)
- [Joins](joins.md)
- [Charts](charts.md)
