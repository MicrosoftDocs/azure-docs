---
title: KQL in Azure Sentinel
description: This article describes how KQL integrates with Azure Sentinel
author: yelevin
ms.author: yelevin
ms.service: azure-sentinel
ms.topic: conceptual
ms.date: 10/19/2021
---

# KQL in Microsoft Sentinel

Read this article to learn how to use Kusto Query Language (KQL) in Microsoft Sentinel.

Microsoft Sentinel data is stored in Azure Monitor [Log Analytics](https://docs.microsoft.com/azure/azure-monitor/logs/log-analytics-overview) workspaces. Log Analytics is build on top of [Azure Data Explorer](https://docs.microsoft.com/azure/data-explorer/), and uses the same [KQL language](https://docs.microsoft.com/azure/data-explorer/kusto/query/) (with specific Azure Monitor features) to retrieve, visualize, and analyze, and parse data. In Microsoft Sentinel, you use KQL when you visualize and analyze data, build rules and workbooks, and hunt for threats.

## KQL queries

KQL queries are plain text and read-only. They don't modify data or metadata. Queries operate on data that's gathered into [databases](https://docs.microsoft.com/azure/data-explorer/kusto/query/schema-entities/databases), [tables](https://docs.microsoft.com/azure/data-explorer/kusto/query/schema-entities/tables), and [columns](https://docs.microsoft.com/azure/data-explorer/kusto/query/schema-entities/columns), similar to SQL. You start KQL queries with a data source (table) and then perform actions on those tables with operators and functions. You tie tables and operators together with a [pipe (|) delimiter](https://docs.microsoft.com/azure/data-explorer/kusto/query/queries).


## KQL demo environment

You can practice KQL statements in a [Log Analytics demo environment](https://aka.ms/lademo) in the Azure portal. The practice environment has no charges. You just need an account to sign into Azure.

The demo environment has a number of tables with columns (shown on the left). You type one or more queries into the query window, and run them.

:::image type="content" source="./media/kql-overview/demo-environment.png" alt-text="Shows the Log Analytics demo environment.":::

In this article all the examples are run in the demo environment, so you can try them out. 

## Before you start

Before you start trying out KQL queries for Microsoft Sentinel, review some [query best practices](https://docs.microsoft.com/azure/data-explorer/kusto/query/best-practices).

## Using KQL in Sentinel

When you search for data in Microsoft Sentinel, you typically move through a query process as follows.


:::image type="content" source="./media/kql-overview/pipe-command.png" alt-text="Shows how the pipe command works.":::

1. **Step 1: Retrieve data**: Data that streams into Microsoft Sentinel is stored in Log Analytics tables. You select tables that contain the data you want to query.
2. **Step 2: Narrow down**. 
    - **Filter**: Use operators to filter table and column data.
    - **Parse and prepare**. Prepare the filtered data further by parsing, aggregating etc. 
    - **Analyze**: Analyze the prepared results. After analysis, you might filter or parse again to hone in more sharply.
3. **Step 3: Gather the evidence**: Prepare the results so that they're useful in your Microsoft Sentinel environment.

You can query and filter data in the Microsoft Sentinel console  > **Logs** page. You can select a table and drill down to see columns. You can modify the default columns shown, and the default time range for queries.

:::image type="content" source="./media/kql-overview/portal-placement.png" alt-text="Shows where to run KQL queries in the Sentinel portal.":::

## Retrieve data

Microsoft Sentinel data is organized into different types of tables: 

- Tables created by default in Log Analytics.
- Tables created when you set up data connectors and Microsoft Sentinel ingests data.
- Custom tables that are created when you set up [custom connectors](create-custom-connector.md).

You can retrieve data from a standard table, a custom table, or use operators to retrieve and manipulate tables.


### Example 1
```kusto
//Count the records in the SecurityEvent table.
SecurityEvent 
| count
```
#### Results
:::image type="content" source="./media/kql-overview/table-count-results.png" alt-text="Shows the result for counting records in the SecurityEvent table.":::


### Example 2

```kusto
//Use union to return all rows in the SecurityEvent and SecurityAlert tables.
SecurityEvent 
| union SecurityAlert  
```
#### Results

:::image type="content" source="./media/kql-overview/table-union-results.png" alt-text="Shows the union of the SecurityEvent and SecurityAlert tables.":::


### Limit and sort data

For datasets that are large you might want to sort results, or limit data that's returned.

#### Example 1

```kusto
//Use order to sort data in descending order in the TimeGenerated column. 
//Get the first five records in the results.
SecurityEvent 
| order by TimeGenerated desc
| take 5
```

##### Results

:::image type="content" source="./media/kql-overview/table-sort-limit.png" alt-text="Shows five records of sorted data in the TimeGenerated column.":::

#### Example 2

```kusto
//If two or more records in the TimeGenerated column have the same value, sort by the AccountName column
// Get the first five records.
SecurityEvent 
| order by TimeGenerated, AcccountName desc
| take 5
```

##### Results

:::image type="content" source="./media/kql-overview/table-sort-multiple.png" alt-text="Shows five records by AccountName column for duplicated TimeGenerated values.":::

#### Example 3

```kusto
// Sort security events (newest first).
// Focus on the project columns for the last seven days (default time period).
SecurityEvent
| project TimeGenerated, Account, Activity, Computer
| sort by TimeGenerated desc
```

##### Results

:::image type="content" source="./media/kql-overview/table-security-events-newest.png" alt-text="Show latest security events for columns specified by project operator.AccountName column for duplicated TimeGenerated values.":::


## Filter data

After retrieving and perhaps sorting table data, you can filter it to narrow down results to points of interest.

### Using where

The where operator is one of the most common filters. It's best to use *where* early in a query. This improves performance by reducing the amount of data you need to process as you dig down into the query results.

#### Example 1

```kusto
//Retrieve the latest 10 occurrences of EventID 4624 (successful Windows logon) in the SecurityEvent table.
SecurityEvent
| where EventID == 4624
| order by TimeGenerated desc
| take 10
```

##### Results

:::image type="content" source="./media/kql-overview/table-where-event-sort.png" alt-text="Get occurrences of EventID 4624 in the SecurityEvent table.":::

![Get occurrences of EventID 4624 in the SecurityEvent table](./media/kql-overview/table-where-event-sort.png)


#### Example 2

```kusto
//Retrieve 10 occurrences (descending TimeGenerated order) of EventID 4624 or 4634 in the SecurityEvent table, seven or more days ago. Note that you can combine where statements.
SecurityEvent
| where EventID in (4624, 4634)
| where TimeGenerated >= ago(7d)
| order by TimeGenerated, AccountName desc
| take 10
```

##### Results

:::image type="content" source="/media/kql-overview/table-where-multiple-events.png" alt-text="Get 10 occurrences in descending order for EventID 4624, 4634.":::

#### Example 3

```kusto
//Combine where statements using the and operator.
SecurityEvent
| where EventID == 4624
  and TimeGenerated <= ago(1d)
| take 10
```

##### Results

:::image type="content" source="./media/kql-overview/table-where-and.png" alt-text="Get 10 occurrences of EventID 4624 using the where with and operator.":::



#### Example 4

```kusto
//This example turns the EventID value into a string to filter on all EventIDs that start with "47"

SecurityEvent  
| where tostring(EventId) startswith "47" 
```

##### Results

:::image type="content" source="./media/kql-overview/table-where-event-string.png" alt-text="Turn EventIDs that start with 47 into string operators.":::


### Time queries

Many Microsoft Sentinel rule queries and examples use time filters. KQL is optimized for time filters, and they're useful in narrowing down results. By default Microsoft Sentinel filters on the last 24 hours.

#### Example 1

```kusto
//Retrieves occurrences of EventID 4624 from the SecurityEvent table between five and seven days ago.

SecurityEvent
| where TimeGenerated between (ago(7d) .. ago(5d) ) 
  and EventID == 4624
```

##### Results

:::image type="content" source="./media/kql-overview/table-time-five-seven-days.png" alt-text="Get EventID 4624 occurrences from 5 to 7 days ago.":::

#### Example 2

```kusto
//Retrieves occurrences of EventID 4624 from the SecurityEvent table from July 1 until 9 a.m on July 30 2020.

SecurityEvent
| where TimeGenerated between ( datetime(2020-07-01) .. datetime(2020-07-30, 09:00) )
  and EventID == 4624
```

#### Results

:::image type="content" source="./media/kql-overview/table-time-between-dates.png" alt-text="Get EventID 4624 occurrences from July 1 to July 30.":::


#### Example 4

```kusto
//Operators that use the present time as start point return data changes each time your run the query.
//This example uses the [startofday function](https://docs.microsoft.com/azure/data-explorer/kusto/query/startofdayfunction) as a fixed point in time (one day ago), until the present time. 

SecurityEvent
| where TimeGenerated > startofday(ago(1d))
  and EventID == 4624
```
##### Results

The query ran on October 26 2021, sorted in ascending order.

:::image type="content" source="./media/kql-overview/table-start-day.png" alt-text="Get occurrences of EventID 4624 with the startofday function.":::


#### Example 5 

```kusto
//This example combines the startofday function with the endofday function, to guarantee two fixed points for retrieving , with the same results each time the query runs. In this example we mix and match hours and days. Startofday is set to two days ago, endofday is set to one day ago.

SecurityEvent
| where TimeGenerated between ( startofday(ago(48hrs)) .. endofday(ago(1d)) )
  and EventID == 4624
```

##### Results

The query ran on October 26 2021, sorted in ascending order. The first record is close to midnight on October 24th, 2021.

:::image type="content" source="./media/kql-overview/table-start-end-day.png" alt-text="Get occurrences of EventID 4624 with the startofday and endofday functions.":::



#### More examples

There are additional timeline examples in Clive Watson's [TechCommunity blog](https://techcommunity.microsoft.com/t5/azure-sentinel/how-to-align-your-analytics-with-time-windows-in-azure-sentinel/ba-p/1667574), and in the [KQL docs](https://docs.microsoft.com/azure/data-explorer/kusto/query/samples?pivots=azuremonitor#date-and-time-operations).


## Prepare data

After initial filtering, you can manipulate data to make it more useful. Typically, you might summarize to aggregate data and output a new table, parse data, add or remove table columns, or join tables. 

After preparing the data, you might then refilter to further pin down results.

:::image type="content" source="./media/kql-overview/filter-flow.png" alt-text="Shows the query filtering flow.":::

![Shows the query filtering flow](./media/kql-overview/filter-flow.png)


### Summarize data

Use *summarize* to query table data and output a new table aggregated by one or more columns that you specify.

#### Example 1

```kusto
//Return multiple EventIDs in the SecurityEvent table using the [count() aggregation function](https://docs.microsoft.com/azure/data-explorer/kusto/query/count-aggfunction).
// count_ is the automatically generated column name for the count() of requests for each EventID.

SecurityEvent
| summarize count() by EventID
| order by count_
```

##### Results

:::image type="content" source="./media/kql-overview/table-summarize-event.png" alt-text="Count the occurrence of different EventIDs in the SecurityEvent table.":::


#### Example 2

```kusto
// Retrieve entries from the Classification table where security or critical updates are needed in the last 10 days.
// Show the results by Classification, Computer, and Resource ID

Update
| where Classification in ("Security Updates", "Critical Updates")
| where UpdateState == 'Needed' and Optional == false and Approved == true
| where TimeGenerated <= ago(10d)
| summarize count() by Classification, Computer, _ResourceId
// This query requires the Security or Update solutions
```

##### Results

:::image type="content" source="./media/kql-overview/table-security-updates.png" alt-text="Count the occurrence of different EventIDs in the SecurityEvent table.":::



### Other aggregation options

In addition to count() aggregation, there are a lot of other KQL [aggregation functions](https://docs.microsoft.com/azure/data-explorer/kusto/query/aggregation-functions) you might use in Microsoft Sentinel.  Let's look at a few examples.

