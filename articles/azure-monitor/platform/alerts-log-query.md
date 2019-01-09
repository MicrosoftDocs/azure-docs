---
title: Log alert queries in Azure Monitor | Microsoft Docs
description: Use the Azure Monitor to author, view and manage log alert rules in Azure.
author: msvijayn
services: azure-monitor
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 01/08/2019
ms.author: bwren
ms.component: alerts
---
# Log alert queries in Azure Monitor
This article provides recommendations on writing efficient queries for [log alerts in Azure Monitor](alerts-unified-log.md). Since alert rules must run these queries at regular intervals, you should ensure that they are written to minimize overhead and latency.

## Types of log queries
[Queries in Log Analytics](../log-query/log-query-overview.md) start with either a table or a [search](/azure/kusto/query/searchoperator) command. The [union](/azure/kusto/query/unionoperator) command with `union *` operates similar to `search`.

For example the following query is scoped to the _SecurityEvent_ table and searches for specific event ID. This is the only table included in the query.

``` Kusto
SecurityEvent | where EventID == 4624 
```

Queries that start with [search](/azure/kusto/query/searchoperator) or [union](/azure/kusto/query/unionoperator) allow you to search across multiple multiple columns in a table or even multiple tables. The following examples show multiple methods for searching the term _Memory_:

```Kusto
search "Memory"

search * | where == "Memory"

search ObjectName: "Memory"

search ObjectName == "Memory"

union * | where ObjectName == "Memory"
```
 

Although [search](/azure/kusto/query/searchoperator) and [union](/azure/kusto/query/unionoperator) operators are useful during data exploration and for searching terms over the entire data model, they are less efficient than using a table since they must scan across multiple columns and tables. Since queries in alert rules are run at regular intervals, this can result in excessive overhead adding latency to the alert.

Because of this overhead, queries for log alert rules in Azure should always start with a table to define a clear scope, which improves both query performance and the relevance of the results.

Starting ______,2019, creating or modifying log alert rules that use `search`, or `union` operators will not be supported the in Azure portal. Using the operators in an alert rule will return an error message like _alert incompatible command like 'search', 'union *' used._. 

Existing alert rules and alert rules created and edited with the Log Analytics API are not affected by this change. You should still consider changing any alert rules that use these types of queries though to improve their efficiency.  

Log alert rules using [cross-resource queries](../log-query/cross-workspace-query.md) are not affected by this change since cross-resource queries use `union`, which limits the query scope to specific resources. This is not equivalent of `union *`.  The following example would be valid in a log alert rule:

```Kusto
union 
app('Contoso-app1').requests, 
app('Contoso-app2').requests, 
workspace('Contoso-workspace1').Perf 
```
 

## Examples
The following examples include log queries that use `search` and `union` and provide steps you can use to modify these queries for use with alert rules.

### Example 1
You want to create a log alert rule using the following query which retrieves performance information: 

``` Kusto
search ObjectName =="Memory" and CounterName=="% Committed Bytes In Use"  
| summarize Avg_Memory_Usage =avg(CounterValue) by Computer 
| where Avg_Memory_Usage between(90 .. 95)  
| count 
```
  

To modify the query, start by using the following query to identify the table that the properties belong to:

``` Kusto
search ObjectName=="Memory" and CounterName=="% Committed Bytes In Use" 
| summarize by $table 
```
 

The result of this query would show that the _ObjectName_ and _CounterName_ property came from the _Perf_ table. You can use this result to create the following query which you would use for the alert rule:

``` Kusto
Perf 
| where ObjectName =="Memory" and CounterName=="% Committed Bytes In Use" 
| summarize Avg_Memory_Usage=avg(CounterValue) by Computer 
| where Avg_Memory_Usage between(90 .. 95)  
| count 
```
 

### Example 2

You want to create a log alert rule using the following query which uses both _search_ and _union_ to retrieve performance information: 

``` Kusto
search (ObjectName == "Processor" and CounterName == "% Idle Time" and InstanceName == "_Total")  
| where Computer !in ((union * | where CounterName == "% Processor Utility" | summarize by Computer))
| summarize Avg_Idle_Time = avg(CounterValue) by Computer|  count  
```
 

To modify the query, start by using the following query to identify the table that the properties in the first part of the query belong to: 

``` Kusto
search (ObjectName == "Processor" and CounterName == "% Idle Time" and InstanceName == "_Total")  
| summarize by $table 
```

The result of this query would show that all these properties came from the _Perf_ table. Now use `union` with `withsource` command to identify which  source table has contributed each row.

``` Kusto
union withsource=table * | where CounterName == "% Processor Utility" 
| summarize by table 
```
 

The result of this query would show that these properties also came from the _Perf_ table. You can use these results to create the following query which you would use for the alert rule: 

``` Kusto
Perf 
| where ObjectName == "Processor" and CounterName == "% Idle Time" and InstanceName == "_Total" 
| where Computer !in ( 
    (Perf 
    | where CounterName == "% Processor Utility" 
    | summarize by Computer)) 
| summarize Avg_Idle_Time = avg(CounterValue) by Computer 
| count 
``` 

### Example 4
You want to create a log alert rule using the following query which uses joins the results of two search commands:

```Kusto
search Type == 'SecurityEvent' and EventID == '4625' 
| summarize by Computer, Hour = bin(TimeGenerated, 1h) 
| join kind = leftouter ( 
    search in (Heartbeat) OSType == 'Windows' 
    | summarize arg_max(TimeGenerated, Computer) by Computer , Hour = bin(TimeGenerated, 1h) 
    | project Hour , Computer  
)  
on Hour 
| count 
```
 

To modify the query, start by using the following query to identify the table that contains the properties in the left side of the join: 

``` Kusto
search Type == 'SecurityEvent' and EventID == '4625' 
| summarize by $table 
```
 

The result indicates that the properties in the left side of the join belong to _SecurityEvent_ table. Now use the following query to identify the table that contains the properties in the right side of the join: 

 
``` Kusto
search in (Heartbeat) OSType == 'Windows' 
| summarize by $table 
```

 
The result indicates that the properties in the right side of the join belong to Heartbeat table. You can use these results to create the following query which you would use for the alert rule: 


``` Kusto
SecurityEvent
| where EventID == '4625'
| summarize by Computer, Hour = bin(TimeGenerated, 1h)
| join kind = leftouter (
    Heartbeat  
    | where OSType == 'Windows' 
    | summarize arg_max(TimeGenerated, Computer) by Computer , Hour = bin(TimeGenerated, 1h) 
    | project Hour , Computer  
)  
on Hour 
| count 
```

## Next steps
