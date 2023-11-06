---
title: Get started with log queries in Azure Monitor | Microsoft Docs
description: This article provides a tutorial for getting started writing log queries in Azure Monitor.
ms.topic: tutorial
author: guywi-ms
ms.author: guywild
ms.reviewer: ilanawaitser
ms.date: 10/31/2023

---

# Get started with log queries in Azure Monitor

> [!NOTE]
> If you're collecting data from at least one virtual machine, you can work through this exercise in your own environment. For other scenarios, use our [demo environment](https://portal.azure.com/#blade/Microsoft_Azure_Monitoring_Logs/DemoLogsBlade), which includes plenty of sample data.
>
> If you already know how to query in Kusto Query Language (KQL) but need to quickly create useful queries based on resource types, see the saved example queries pane in [Use queries in Azure Monitor Log Analytics](../logs/queries.md).

In this tutorial, you learn to write log queries in Azure Monitor. The article shows you how to:

- Understand query structure.
- Sort query results.
- Filter query results.
- Specify a time range.
- Select which fields to include in the results.
- Define and use custom fields.
- Aggregate and group results.

For a tutorial on using Log Analytics in the Azure portal, see [Get started with Azure Monitor Log Analytics](./log-analytics-tutorial.md).

For more information about log queries in Azure Monitor, see [Overview of log queries in Azure Monitor](../logs/log-query-overview.md).

Here's a video version of this tutorial:

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE42pGX]

[!INCLUDE [log-analytics-query-permissions](../../../includes/log-analytics-query-permissions.md)]

## Write a new query

Queries can start with either a table name or the `search` command. It's a good idea to start with a table name because it defines a clear scope for the query. It also improves query performance and the relevance of the results.

> [!NOTE]
> KQL, which is used by Azure Monitor, is case sensitive. Language keywords are usually written in lowercase. When you use names of tables or columns in a query, be sure to use the correct case, as shown on the schema pane.

### Table-based queries

Azure Monitor organizes log data in tables, each composed of multiple columns. All tables and columns are shown on the schema pane in Log Analytics in the Analytics portal. Identify a table that you're interested in, and then take a look at a bit of data:

```Kusto
SecurityEvent
| take 10
```

The preceding query returns 10 results from the `SecurityEvent` table, in no specific order. This common way to get a glance at a table helps you to understand its structure and content. Let's examine how it's built:

* The query starts with the table name `SecurityEvent`, which defines the scope of the query.
* The pipe (|) character separates commands, so the output of the first command is the input of the next. You can add any number of piped elements.
* Following the pipe is the `take` command, which returns a specific number of arbitrary records from the table.

We could run the query even without adding `| take 10`. The command would still be valid, but it could return up to 30,000 results.

### Search queries

Search queries are less structured. They're better suited for finding records that include a specific value in any of their columns:

```Kusto
search in (SecurityEvent) "Cryptographic"
| take 10
```

This query searches the `SecurityEvent` table for records that contain the phrase "Cryptographic." Of those records, 10 records are returned and displayed. If you omit the `in (SecurityEvent)` part and run only `search "Cryptographic"`, the search goes over *all* tables. The process would then take longer and be less efficient.

> [!IMPORTANT]
> Search queries are ordinarily slower than table-based queries because they have to process more data.

## Sort and top
Although `take` is useful for getting a few records, the results are selected and displayed in no particular order. To get an ordered view, you could `sort` by the preferred column:

```Kusto
SecurityEvent	
| sort by TimeGenerated desc
```

The preceding query could return too many results though, and it might also take some time. The query sorts the entire `SecurityEvent` table by the `TimeGenerated` column. The Analytics portal then limits the display to only 30,000 records. This approach isn't optimal.

The best way to get only the latest 10 records is to use `top`, which sorts the entire table on the server side and then returns the top records:

```Kusto
SecurityEvent
| top 10 by TimeGenerated
```

Descending is the default sorting order, so you would usually omit the `desc` argument. The output looks like this example.
<!-- convertborder later -->
:::image type="content" source="media/get-started-queries/top10.png" lightbox="media/get-started-queries/top10.png" alt-text="Screenshot that shows the top 10 records sorted in descending order." border="false":::

## The where operator: Filter on a condition
Filters, as indicated by their name, filter the data by a specific condition. Filtering is the most common way to limit query results to relevant information.

To add a filter to a query, use the `where` operator followed by one or more conditions. For example, the following query returns only `SecurityEvent` records where `Level equals _8`:

```Kusto
SecurityEvent
| where Level == 8
```

When you write filter conditions, you can use the following expressions:

| Expression | Description | Example |
|:---|:---|:---|
| == | Check equality<br>(case-sensitive) | `Level == 8` |
| =~ | Check equality<br>(case-insensitive) | `EventSourceName =~ "microsoft-windows-security-auditing"` |
| !=, <> | Check inequality<br>(both expressions are identical) | `Level != 4` |
| `and`, `or` | Required between conditions| `Level == 16 or CommandLine != ""` |

To filter by multiple conditions, you can use either of the following approaches:

Use `and`, as shown here:

```Kusto
SecurityEvent
| where Level == 8 and EventID == 4672
```

Pipe multiple `where` elements, one after the other, as shown here:

```Kusto
SecurityEvent
| where Level == 8 
| where EventID == 4672
```

> [!NOTE]
> Values can have different types, so you might need to cast them to perform comparisons on the correct type. For example, the `SecurityEvent Level` column is of type String, so you must cast it to a numerical type, such as `int` or `long`, before you can use numerical operators on it, as shown here:
> `SecurityEvent | where toint(Level) >= 10`

## Specify a time range

You can specify a time range by using the time picker or a time filter.

### Use the time picker

The time picker is displayed next to the **Run** button and indicates that you're querying records from only the last 24 hours. This default time range is applied to all queries. To get records from only the last hour, select **Last hour** and then run the query again.
<!-- convertborder later -->
:::image type="content" source="media/get-started-queries/timepicker.png" lightbox="media/get-started-queries/timepicker.png" alt-text="Screenshot that shows the time picker and its list of time-range commands." border="false":::

### Add a time filter to the query

You can also define your own time range by adding a time filter to the query. It's best to place the time filter immediately after the table name:

```Kusto
SecurityEvent
| where TimeGenerated > ago(30m) 
| where toint(Level) >= 10
```

In the preceding time filter, `ago(30m)` means "30 minutes ago." This query returns records from only the last 30 minutes, which is expressed as, for example, 30m. Other units of time include days (for example, 2d) and seconds (for example, 10s).

## Use project and extend to select and compute columns

Use `project` to select specific columns to include in the results:

```Kusto
SecurityEvent 
| top 10 by TimeGenerated 
| project TimeGenerated, Computer, Activity
```

The preceding example generates the following output:
<!-- convertborder later -->
:::image type="content" source="media/get-started-queries/project.png" lightbox="media/get-started-queries/project.png" alt-text="Screenshot that shows the query 'project' results list." border="false":::

You can also use `project` to rename columns and define new ones. The next example uses `project` to do the following:

* Select only the `Computer` and `TimeGenerated` original columns.
* Display the `Activity` column as `EventDetails`.
* Create a new column named `EventCode`. The `substring()` function is used to get only the first four characters from the `Activity` field.

```Kusto
SecurityEvent
| top 10 by TimeGenerated 
| project Computer, TimeGenerated, EventDetails=Activity, EventCode=substring(Activity, 0, 4)
```

You can use `extend` to keep all original columns in the result set and define other ones. The following query uses `extend` to add the `EventCode` column. This column might not be displayed at the end of the table results. You would need to expand the details of a record to view it.

```Kusto
SecurityEvent
| top 10 by TimeGenerated
| extend EventCode=substring(Activity, 0, 4)
```

## Use summarize to aggregate groups of rows
Use `summarize` to identify groups of records according to one or more columns and apply aggregations to them. The most common use of `summarize` is `count`, which returns the number of results in each group.

The following query reviews all `Perf` records from the last hour, groups them by `ObjectName`, and counts the records in each group:

```Kusto
Perf
| where TimeGenerated > ago(1h)
| summarize count() by ObjectName
```

Sometimes it makes sense to define groups by multiple dimensions. Each unique combination of these values defines a separate group:

```Kusto
Perf
| where TimeGenerated > ago(1h)
| summarize count() by ObjectName, CounterName
```

Another common use is to perform mathematical or statistical calculations on each group. The following example calculates the average `CounterValue` for each computer:

```Kusto
Perf
| where TimeGenerated > ago(1h)
| summarize avg(CounterValue) by Computer
```

Unfortunately, the results of this query are meaningless because we mixed together different performance counters. To make the results more meaningful, calculate the average separately for each combination of `CounterName` and `Computer`:

```Kusto
Perf
| where TimeGenerated > ago(1h)
| summarize avg(CounterValue) by Computer, CounterName
```

### Summarize by a time column
Grouping results can also be based on a time column or another continuous value. Simply summarizing `by TimeGenerated`, though, would create groups for every single millisecond over the time range because these values are unique.

To create groups based on continuous values, it's best to break the range into manageable units by using `bin`. The following query analyzes `Perf` records that measure free memory (`Available MBytes`) on a specific computer. It calculates the average value of each 1-hour period over the last 7 days:

```Kusto
Perf 
| where TimeGenerated > ago(7d)
| where Computer == "ContosoAzADDS2" 
| where CounterName == "Available MBytes" 
| summarize avg(CounterValue) by bin(TimeGenerated, 1h)
```

To make the output clearer, you can select to display it as a time chart, which shows the available memory over time.
<!-- convertborder later -->
:::image type="content" source="media/get-started-queries/chart.png" lightbox="media/get-started-queries/chart.png" alt-text="Screenshot that shows the values of a query memory over time." border="false":::

## Frequently asked questions

This section provides answers to common questions.

### Why am I seeing duplicate records in Azure Monitor Logs?

Occasionally, you might notice duplicate records in Azure Monitor Logs. This duplication is typically from one of the following two conditions:
          
- Components in the pipeline have retries to ensure reliable delivery at the destination. Occasionally, this capability might result in duplicates for a small percentage of telemetry items.
- If the duplicate records come from a virtual machine, you might have both the Log Analytics agent and Azure Monitor Agent installed. If you still need the Log Analytics agent installed, configure the Log Analytics workspace to no longer collect data that's also being collected by the data collection rule used by Azure Monitor Agent.


## Next steps

- To learn more about using string data in a log query, see [Work with strings in Azure Monitor log queries](/azure/data-explorer/kusto/query/samples?&pivots=azuremonitor#string-operations).
- To learn more about aggregating data in a log query, see [Advanced aggregations in Azure Monitor log queries](/azure/data-explorer/write-queries#advanced-aggregations).
- To learn how to join data from multiple tables, see [Joins in Azure Monitor log queries](/azure/data-explorer/kusto/query/samples?&pivots=azuremonitor#joins).
- Get documentation on the entire Kusto Query Language in the [KQL language reference](/azure/kusto/query/).
