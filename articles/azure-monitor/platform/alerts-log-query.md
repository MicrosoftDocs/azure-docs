---
title: Optimizing log alert queries | Microsoft Docs
description:  Recommendations for writing efficient alert queries
author: yanivlavi
ms.author: yalavi
ms.topic: conceptual
ms.date: 02/19/2019
ms.subservice: alerts
---
# Optimizing log alert queries
This article describes how to write and convert [Log Alert](alerts-unified-log.md) queries to achieve optimal performance. Optimized queries reduce latency and load of alerts, which run frequently.

## How to start writing an alert log query

Alert queries start from [querying the log data in Log Analytics](alerts-log.md#create-a-log-alert-rule-with-the-azure-portal) that indicates the issue. You can use the [alert query examples topic](../log-query/saved-queries.md) to understand what you can discover. You may also [get started on writing your own query](../log-query/get-started-portal.md). 

### Queries that indicate the issue and not the alert

The alert flow was built to transform the results that indicate the issue to an alert. For example, in a case of a query like:

``` Kusto
SecurityEvent
| where EventID == 4624
```

If the intent of the user is to alert, when this event type happens, the alerting logic appends `count` to the query. The query that will run will be:

``` Kusto
SecurityEvent
| where EventID == 4624
| count
```

There's no need to add alerting logic to the query and doing that may even cause issues. In the above example, if you include `count` in your query, it will always result in the value 1, since the alert service will do `count` of `count`.

### Avoid `limit` and `take` operators

Using `limit` and `take` in queries can increase latency and load of alerts as the results aren't consistent over time. It's preferred you use it only if needed.

## Log query constraints
[Log queries in Azure Monitor](../log-query/log-query-overview.md) start with either a table, [`search`](/azure/kusto/query/searchoperator), or [`union`](/azure/kusto/query/unionoperator) operator.

Queries for log alert rules should always start with a table to define a clear scope, which improves both query performance and the relevance of the results. Queries in alert rules run frequently, so using `search` and `union` can result in excessive overhead adding latency to the alert, as it requires scanning across multiple tables. These operators also reduce the ability of the alerting service to optimize the query.

We don't support creating or modifying log alert rules that use `search` or `union` operators, expect for cross-resource queries.

For example, the following alerting query is scoped to the _SecurityEvent_ table and searches for specific event ID. It's the only table that the query must process.

``` Kusto
SecurityEvent
| where EventID == 4624
```

Log alert rules using [cross-resource queries](../log-query/cross-workspace-query.md) are not affected by this change since cross-resource queries use a type of `union`, which limits the query scope to specific resources. The following example would be valid log alert query:

```Kusto
union
app('Contoso-app1').requests,
app('Contoso-app2').requests,
workspace('Contoso-workspace1').Perf 
```

>[!NOTE]
> [Cross-resource queries](../log-query/cross-workspace-query.md) are supported in the new [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrules). If you still use the [legacy Log Analytics Alert API](api-alerts.md) for creating log alerts, you can learn about switching [here](alerts-log-api-switch.md).

## Examples
The following examples include log queries that use `search` and `union` and provide steps you can use to modify these queries for use in alert rules.

### Example 1
You want to create a log alert rule using the following query that retrieves performance information using `search`: 

``` Kusto
search *
| where Type == 'Perf' and CounterName == '% Free Space'
| where CounterValue < 30
```

To modify this query, start by using the following query to identify the table that the properties belong to:

``` Kusto
search *
| where CounterName == '% Free Space'
| summarize by $table
```

The result of this query would show that the _CounterName_ property came from the _Perf_ table.

You can use this result to create the following query that you would use for the alert rule:

``` Kusto
Perf
| where CounterName == '% Free Space'
| where CounterValue < 30
```

### Example 2
You want to create a log alert rule using the following query that retrieves performance information using `search`: 

``` Kusto
search ObjectName =="Memory" and CounterName=="% Committed Bytes In Use"
| summarize Avg_Memory_Usage =avg(CounterValue) by Computer
| where Avg_Memory_Usage between(90 .. 95)  
```

To modify this query, start by using the following query to identify the table that the properties belong to:

``` Kusto
search ObjectName=="Memory" and CounterName=="% Committed Bytes In Use"
| summarize by $table
```

The result of this query would show that the _ObjectName_ and _CounterName_ property came from the _Perf_ table.

You can use this result to create the following query that you would use for the alert rule:

``` Kusto
Perf
| where ObjectName =="Memory" and CounterName=="% Committed Bytes In Use"
| summarize Avg_Memory_Usage=avg(CounterValue) by Computer
| where Avg_Memory_Usage between(90 .. 95)
```

### Example 3

You want to create a log alert rule using the following query that uses both `search` and `union` to retrieve performance information: 

``` Kusto
search (ObjectName == "Processor" and CounterName == "% Idle Time" and InstanceName == "_Total")
| where Computer !in (
    union *
    | where CounterName == "% Processor Utility"
    | summarize by Computer)
| summarize Avg_Idle_Time = avg(CounterValue) by Computer
```

To modify this query, start by using the following query to identify the table that the properties in the first part of the query belong to: 

``` Kusto
search (ObjectName == "Processor" and CounterName == "% Idle Time" and InstanceName == "_Total")
| summarize by $table
```

The result of this query would show that all these properties came from the _Perf_ table.

Now use `union` with `withsource` command to identify which  source table has contributed each row.

``` Kusto
union withsource=table *
| where CounterName == "% Processor Utility"
| summarize by table
```

The result of this query would show that these properties also came from the _Perf_ table.

You can use these results to create the following query that you would use for the alert rule: 

``` Kusto
Perf
| where ObjectName == "Processor" and CounterName == "% Idle Time" and InstanceName == "_Total"
| where Computer !in (
    (Perf
    | where CounterName == "% Processor Utility"
    | summarize by Computer))
| summarize Avg_Idle_Time = avg(CounterValue) by Computer
``` 

### Example 4
You want to create a log alert rule using the following query that joins the results of two `search` queries:

```Kusto
search Type == 'SecurityEvent' and EventID == '4625'
| summarize by Computer, Hour = bin(TimeGenerated, 1h)
| join kind = leftouter (
    search in (Heartbeat) OSType == 'Windows'
    | summarize arg_max(TimeGenerated, Computer) by Computer , Hour = bin(TimeGenerated, 1h)
    | project Hour , Computer
) on Hour
```

To modify the query, start by using the following query to identify the table that contains the properties in the left side of the join: 

``` Kusto
search Type == 'SecurityEvent' and EventID == '4625'
| summarize by $table
```

The result indicates that the properties in the left side of the join belong to _SecurityEvent_ table. 

Now use the following query to identify the table that contains the properties in the right side of the join: 
 
``` Kusto
search in (Heartbeat) OSType == 'Windows'
| summarize by $table
```
 
The result indicates that the properties in the right side of the join belong to _Heartbeat_ table.

You can use these results to create the following query that you would use for the alert rule: 

``` Kusto
SecurityEvent
| where EventID == '4625'
| summarize by Computer, Hour = bin(TimeGenerated, 1h)
| join kind = leftouter (
    Heartbeat
    | where OSType == 'Windows'
    | summarize arg_max(TimeGenerated, Computer) by Computer , Hour = bin(TimeGenerated, 1h)
    | project Hour , Computer
) on Hour
```

## Next steps
- Learn about [log alerts](alerts-log.md) in Azure Monitor.
- Learn about [log queries](../log-query/log-query-overview.md).
