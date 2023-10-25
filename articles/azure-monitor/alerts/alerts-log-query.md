---
title: Optimize log alert queries | Microsoft Docs
description: This article gives recommendations for writing efficient alert queries.
ms.topic: conceptual
ms.date: 5/30/2023
ms.reviewer: yalavi
---
# Optimize log alert queries

This article describes how to write and convert [log alert](./alerts-unified-log.md) queries to achieve optimal performance. Optimized queries reduce latency and load of alerts, which run frequently.

## Start writing an alert log query

Alert queries start from [querying the log data in Log Analytics](alerts-log.md#create-a-new-log-alert-rule-in-the-azure-portal) that indicates the issue. To understand what you can discover, see [Using queries in Azure Monitor Log Analytics](../logs/queries.md). You can also [get started on writing your own query](../logs/log-analytics-tutorial.md).

### Queries that indicate the issue and not the alert

The alert flow was built to transform the results that indicate the issue to an alert. For example, in the case of a query like:

``` Kusto
SecurityEvent
| where EventID == 4624
```

If the intent of the user is to alert, when this event type happens, the alerting logic appends `count` to the query. The query that runs will be:

``` Kusto
SecurityEvent
| where EventID == 4624
| count
```

There's no need to add alerting logic to the query, and doing that might even cause issues. In the preceding example, if you include `count` in your query, it will always result in the value 1, because the alert service will do `count` of `count`.

### Avoid limit and take operators

Using `limit` and `take` in queries can increase latency and load of alerts because the results aren't consistent over time. Use them only if needed.

## Log query constraints

[Log queries in Azure Monitor](../logs/log-query-overview.md) start with either a table, [`search`](/azure/kusto/query/searchoperator), or [`union`](/azure/kusto/query/unionoperator) operator.

Queries for log alert rules should always start with a table to define a clear scope, which improves query performance and the relevance of the results. Queries in alert rules run frequently. Using `search` and `union` can result in excessive overhead that adds latency to the alert because it requires scanning across multiple tables. These operators also reduce the ability of the alerting service to optimize the query.

We don't support creating or modifying log alert rules that use `search` or `union` operators, except for cross-resource queries.

For example, the following alerting query is scoped to the _SecurityEvent_ table and searches for a specific event ID. It's the only table that the query must process.

``` Kusto
SecurityEvent
| where EventID == 4624
```

Log alert rules using [cross-resource queries](../logs/cross-workspace-query.md) aren't affected by this change because cross-resource queries use a type of `union`, which limits the query scope to specific resources. The following example would be a valid log alert query:

```Kusto
union
app('00000000-0000-0000-0000-000000000001').requests,
app('00000000-0000-0000-0000-000000000002').requests,
workspace('00000000-0000-0000-0000-000000000003').Perf 
```

>[!NOTE]
> [Cross-resource queries](../logs/cross-workspace-query.md) are supported in the new [scheduledQueryRules API](/rest/api/monitor/scheduledqueryrule-2021-08-01/scheduled-query-rules). If you still use the [legacy Log Analytics Alert API](./api-alerts.md) for creating log alerts, see [Upgrade legacy rules management to the current Azure Monitor Log Alerts API](./alerts-log-api-switch.md) to learn about switching.

## Examples

The following examples include log queries that use `search` and `union`. They provide steps you can use to modify these queries for use in alert rules.

### Example 1

You want to create a log alert rule by using the following query that retrieves performance information using `search`: 

``` Kusto
search *
| where Type == 'Perf' and CounterName == '% Free Space'
| where CounterValue < 30
```

1. To modify this query, start by using the following query to identify the table that the properties belong to:
    
    ``` Kusto
    search *
    | where CounterName == '% Free Space'
    | summarize by $table
    ```

   The result of this query would show that the _CounterName_ property came from the _Perf_ table.

1. Use this result to create the following query that you would use for the alert rule:

    ``` Kusto
    Perf
    | where CounterName == '% Free Space'
    | where CounterValue < 30
    ```

### Example 2

You want to create a log alert rule by using the following query that retrieves performance information using `search`:

``` Kusto
search ObjectName =="Memory" and CounterName=="% Committed Bytes In Use"
| summarize Avg_Memory_Usage =avg(CounterValue) by Computer
| where Avg_Memory_Usage between(90 .. 95)  
```

1. To modify this query, start by using the following query to identify the table that the properties belong to:
    
    ``` Kusto
    search ObjectName=="Memory" and CounterName=="% Committed Bytes In Use"
    | summarize by $table
    ```
    
   The result of this query would show that the _ObjectName_ and _CounterName_ properties came from the _Perf_ table.

1. Use this result to create the following query that you would use for the alert rule:

    ``` Kusto
    Perf
    | where ObjectName =="Memory" and CounterName=="% Committed Bytes In Use"
    | summarize Avg_Memory_Usage=avg(CounterValue) by Computer
    | where Avg_Memory_Usage between(90 .. 95)
    ```

### Example 3

You want to create a log alert rule by using the following query that uses both `search` and `union` to retrieve performance information:

``` Kusto
search (ObjectName == "Processor" and CounterName == "% Idle Time" and InstanceName == "_Total")
| where Computer !in (
    union *
    | where CounterName == "% Processor Utility"
    | summarize by Computer)
| summarize Avg_Idle_Time = avg(CounterValue) by Computer
```

1. To modify this query, start by using the following query to identify the table that the properties in the first part of the query belong to: 

    ``` Kusto
    search (ObjectName == "Processor" and CounterName == "% Idle Time" and InstanceName == "_Total")
    | summarize by $table
    ```

   The result of this query would show that all these properties came from the _Perf_ table.

1. Use `union` with the `withsource` command to identify which source table has contributed each row:

    ``` Kusto
    union withsource=table *
    | where CounterName == "% Processor Utility"
    | summarize by table
    ```

   The result of this query would show that these properties also came from the _Perf_ table.

1. Use these results to create the following query that you would use for the alert rule: 

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

You want to create a log alert rule by using the following query that joins the results of two `search` queries:

```Kusto
search Type == 'SecurityEvent' and EventID == '4625'
| summarize by Computer, Hour = bin(TimeGenerated, 1h)
| join kind = leftouter (
    search in (Heartbeat) OSType == 'Windows'
    | summarize arg_max(TimeGenerated, Computer) by Computer , Hour = bin(TimeGenerated, 1h)
    | project Hour , Computer
) on Hour
```

1. To modify the query, start by using the following query to identify the table that contains the properties in the left side of the join:
    
    ``` Kusto
    search Type == 'SecurityEvent' and EventID == '4625'
    | summarize by $table
    ```

   The result indicates that the properties in the left side of the join belong to the _SecurityEvent_ table.

1. Use the following query to identify the table that contains the properties in the right side of the join:
 
    ``` Kusto
    search in (Heartbeat) OSType == 'Windows'
    | summarize by $table
    ```
 
   The result indicates that the properties in the right side of the join belong to the _Heartbeat_ table.

1. Use these results to create the following query that you would use for the alert rule:
    
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
- Learn about [log queries](../logs/log-query-overview.md).
