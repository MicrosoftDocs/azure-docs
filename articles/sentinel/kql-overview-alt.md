---
title: Kusto Query Language (KQL) in Azure Sentinel
description: This article describes how Kusto Query Language (KQL) is used in Azure Sentinel, and provides some basic familiarity with the language.
author: yelevin
ms.author: yelevin
ms.service: azure-sentinel
ms.topic: conceptual
ms.date: 10/19/2021
---

# Kusto Query Language (KQL) in Microsoft Sentinel

Read this article to learn some basic uses for Kusto Query Language (KQL) in Microsoft Sentinel.

## Background - Why KQL?

Microsoft Sentinel is built on top of the Azure Monitor service and it uses Azure Monitor’s [Log Analytics](../azure-monitor/logs/log-analytics-overview.md) workspaces to store all of its data. This data includes both:
- the data ingested from external sources and 
- data created by Sentinel itself, resulting from the analyses Sentinel creates and performs. 

[Kusto Query Language](/data-explorer/kusto/query/) (KQL) was developed as part of the [Azure Data Explorer](/data-explorer/) service, and it’s therefore optimized for searching through big-data stores in a cloud environment. Inspired by famed undersea explorer Jacques Cousteau (and pronounced accordingly "koo-STOH"), it’s designed to help you dive deep into your oceans of data and explore their hidden treasures. 

KQL is also used in Azure Monitor (and therefore in Microsoft Sentinel), using specific additional Azure Monitor features, to retrieve, visualize, analyze, and parse data in Log Analytics data stores. In Microsoft Sentinel, you use Kusto Query Language whenever you’re visualizing and analyzing data and hunting for threats, whether in existing rules and workbooks, or to build your own.

Because Kusto Query Language is a part of nearly everything you do in Microsoft Sentinel, a clear understanding of how KQL works will help you get that much more out of your SIEM.

## KQL queries

A KQL query is a read-only request to process data and return results – it doesn’t write any data. Queries operate on data that's organized into a hierarchy of [databases](/data-explorer/kusto/query/schema-entities/databases), [tables](/data-explorer/kusto/query/schema-entities/tables), and [columns](/data-explorer/kusto/query/schema-entities/columns), similar to SQL.

KQL requests are stated in plain language and use a data-flow model designed to make the syntax easy to read, write, and automate.

KQL queries are made up of *statements* separated by semicolons. There are many kinds of statements, but only two widely used types that we’ll discuss here:

- ***let* statements** allow you to create and define variables and constants outside the body of the query, for easier readability and versatility. Optional. [Learn more](/azure/data-explorer/kusto/query/letstatement)

- **tabular expression statements** are what we typically mean when we talk about queries – these are the actual body of the query. Required. [Learn more](/azure/data-explorer/kusto/query/tabularexpressionstatements)

You start KQL queries (actually, tabular expression statements) with a data source (a table or an expression representing a virtual table, possibly defined by a function or a *let* statement). You then perform a sequence of actions on those tables using operators to transform the data. Each of these actions passes the resulting data to the next action, and this passing is symbolized in the query by a pipe (|) delimiter.

## KQL demo environment

You can practice KQL statements in a [Log Analytics demo environment](https://aka.ms/lademo) in the Azure portal. There is no charge to use this practice environment, but you do need an Azure account to access it.

Explore the demo environment. Like Log Analytics in your production environment, it can be used in a number of ways:

- **Choose a table on which to build a query.** From the default **Tables** tab (shown in the red rectangle at the upper left), select a table from the list of tables grouped by topics (shown at the lower left). Expand the topics to see the individual tables, and you can further expand each table to see all its fields (columns). Double-clicking on a table or a field name will place it at the point of the cursor in the query window. Type the rest of your query following the table name, as directed below.

- **Find an existing query to study or modify.** Select the **Queries** tab (shown in the red rectangle at the upper left) to see a list of queries available out-of-the-box. By default they are grouped by category, and expanding the Security category will show you the security-related queries already available. You can also group them by solution, and you can then expand *Microsoft Sentinel* to see the relevant queries. Double-clicking a query will place the whole query in the query window at the point of the cursor.


:::image type="content" source="./media/kql-overview/demo-environment.png" alt-text="Shows the Log Analytics demo environment.":::

In this article all the examples are run in the demo environment, so you can try them out. 

## Before you start

Before you start trying out KQL queries for Microsoft Sentinel, review some [query best practices](/data-explorer/kusto/query/best-practices).

## Data flow in Kusto queries

When you want to glean usable information from large amounts of data in Microsoft Sentinel, you follow a query process that starts with a set of data. Each step in the process takes the data fed into it, transforms that data, and passes it to the next step in the process using the ` ! ` (pipe) delimiter. These are the essential steps in a simple query process:

`Get data | Filter | Summarize | Sort | Select`

Here’s an example that illustrates this process:

```kusto
SigninLogs
| where RiskLevelDuringSignIn != 'none'
   and TimeGenerated >= ago(7d)
| summarize Count = count() by UserDisplayName
| order by Count desc
| take 5
```

1. **Get data:** You start by selecting a data set. This can be a single table in Log Analytics, a group of tables, or a virtual table defined by a function or a let statement. In the example above, we chose the `SigninLogs` table, which is ingested into Microsoft Sentinel through the Azure Active Directory data connector.

1. **Filter:** You use the `where` operator (for example) to narrow down the data you want, by criteria appropriate to the data. We’ve chosen two filters here. One, by checking the text value of a particular column, `RiskLevelDuringSignIn`, and eliminating any records where the value is “none”. The other, by checking the date/time value in the `TimeGenerated` column and including only those records where that value is greater than or equal to (that is, more recent than or just as recent as) seven days ago. This combination of filters will give us a resulting data set of all the sign-ins during the past week where the user had some risk attached.

1. **Summarize:** Since a plain list of all the sign-ins fitting those criteria may well still leave us with a long list that we’d still have to sift through to find usable, actionable information, we need to further massage this data. By summarizing it, we can leave ourselves with a quickly readable and understandable result. In this example, we’re using a count-type summarization by the `UserDisplayName` column, meaning that for each user that had sign-ins matching the filter criteria, the results will show how many sign-ins that user had.

1. **Sort:** To further simplify and clarify the results, we will use the `order by` operator to list these users in descending order of the number of sign-ins they had. The users that had the most, which may mean they are of the greatest concern to us, will be at the top.

1. **Select:** Finally, we can choose to display only a subset of all the records that answered all the criteria, and we can also choose to display only the most relevant columns from the original table. In this example, we only want the top five users by number of risky sign-ins. The `take` operator is one way to choose a subset of rows. The `project` operator is one way to choose a subset of columns. We'll discuss these more below.

**Output**

| UserDisplayName  | Count |
| ---------------- | ----- |
| Hannah Jarvis    | 782   |
| Sam Cantrell     | 466   |
| Miguel Reyes     | 60    |
| Wesley Brooks    | 5     |
| Avery Howard     | 2     |
|

More complex queries can contain additional analysis operations, and also feature multiple layers of filtering, analysis, and summarization.

For example, we can add a level of summarization so that we can break down each user's number of sign-ins by risk level:

```kusto
SigninLogs
| where RiskLevelDuringSignIn != 'none'
   and TimeGenerated >= ago(10d)
| summarize Count = count() by UserDisplayName, RiskLevel = RiskLevelDuringSignIn
| order by Count desc
| take 10
```
And here's the output now:

| UserDisplayName  | RiskLevel | Count |
| ---------------- | --------- | ----- |
| Hannah Jarvis    | low       | 782   |
| Sam Cantrell     | high      | 270   |
| Sam Cantrell     | medium    | 113   |
| Sam Cantrell     | low       | 83    |
| Miguel Reyes     | low       | 56    |
| Wesley Brooks    | low       | 5     |
| Miguel Reyes     | medium    | 4     |
| Avery Howard     | medium    | 2     |
|

> [!NOTE]
> Where you place your operators in the pipeline affects the data you will receive in the results. 
> - If, for example, you placed the `take 5` line before the summarization and sorting operators, the query would select five random records from the filtered data.
> - If you placed the `take 5` line before the filter operators, the query would select five random records from unfiltered data, and then filter and summarize only those records - in other words, the query would be of no use to you at all.
>
> The location of operations in the pipeline can also affect performance. That's why it's a good idea to put your filtering operations as close as possible to the beginning of your query statement, so that only the relevant data gets passed to the next operations in the pipeline.

Now, let's go through some examples of various queries, starting with the simplest and increasing in complexity.

## Show a sample of rows

You've just set up your Microsoft Sentinel workspace and connected your first data sources. You want to see if there's any data being ingested, so you don't want any filters on your data, but at the same time, you don't want a deluge. Let's use the [take](/azure/data-explorer/kusto/query/takeoperator) operator to get a random sample of just 10 rows in a given table:

```kusto
CommonSecurityLog
| take 10
```

> [!TIP]
> The `take` operator shows *n* rows from a table, in no particular order. If `take` is used after a `sort` operation, though, it will take the first *n* rows in the sort.

## Count rows

The **SecurityAlert** table contains data about alerts that have been generated by Microsoft Sentinel as the result of [analytics rules](detect-threats-custom.md), or ingested from other compatible alert-producing platforms (like Microsoft 365 Defender or Microsoft Defender for Cloud). Alerts represent events or groups of events that could affect your security. To find out how large the table of alerts is, we'll pipe its content into a summarization operator - one that counts rows.

This query takes the entire `SecurityAlert` table and passes it to the [count operator](/azure/data-explorer/kusto/query/countoperator). The `count` operator displays the results because the operator is the last command in the query.

```kusto
//Count the records in the SecurityAlert table.
SecurityAlert | count
```

:::image type="content" source="media/kql-overview/table-count-results.png" alt-text="Screenshot of table count results.":::

## Filter by Boolean expression: *where*

Now we want to see the actual rows in the SecurityAlert table, but only those representing *high-severity* alerts during a specific week.

The [where](/azure/data-explorer/kusto/query/whereoperator) operator is one of the most common in the Kusto Query Language. This operator filters a table to rows that match specific criteria. In the following example, the query uses multiple operations. First, it gets all records for the table. Then, it filters the data for records that are in the specified time range. Finally, it filters those results for records that have a severity level of "High".

> [!NOTE]
> In addition to specifying a filter in your query by using the `TimeGenerated` column, you can specify the time range in Log Analytics. For more information, see [Log query scope and time range in Azure Monitor Log Analytics](/azure/azure-monitor/log-query/scope).

```kusto
SecurityAlert
| where TimeGenerated > datetime(10-01-2021) and TimeGenerated < datetime(10-07-2021)
| where AlertSeverity == "High"
```

:::image type="content" source="media/kql-overview/table-where-timegen-severity.png" alt-text="Screenshot that shows the results of the where operator example." lightbox="media/kql-overview/table-where-timegen-severity.png":::

## Select a subset of columns 

### *project*

Now, a lot of times you'll have a dataset that has a lot of columns, only a few of which you have any interest in seeing, while the rest are just noise. Use the [project](/azure/data-explorer/kusto/query/projectoperator) operator to display only the columns you want. Building on the preceding example, let's limit the output to certain columns:

```kusto
SecurityAlert
| where TimeGenerated > datetime(10-01-2021) and TimeGenerated < datetime(10-07-2021)
| where AlertSeverity == "High"
| project AlertName, ProductName, TimeGenerated, Entities
```

:::image type="content" source="media/kql-overview/table-project.png" lightbox="images/tutorial/azure-monitor-project-results.png" alt-text="Screenshot that shows the results of the project operator example.":::

### *project-away*

Sometimes you'll have the opposite scenario: you have a dataset with, say, ten columns, but you have no need for just two of them. Instead of a long `project` operation where you have to list the eight columns you want, you can opt for [project-away](/azure/data-explorer/kusto/query/projectawayoperator) and list only the two columns you *don't* want to keep.

The project-away operator can be useful if you are using this query as the basis of an analytics rule, as the alerts produced by these rules have a size limit.

```kusto
SecurityAlert
| where TimeGenerated > datetime(10-01-2021) and TimeGenerated < datetime(10-07-2021)
| where AlertSeverity == "High"
| project-away DisplayName, Description, RemediationSteps
```

## Order results 

### *sort / order*

Instead of random records, we can return the latest five records by first sorting by time:

```kusto
SecurityAlert
| sort by TimeGenerated desc 
| take 5
| project TimeGenerated, AlertName, AlertSeverity, ProductName
```

The [order](/azure/data-explorer/kusto/query/orderoperator) and [sort](/azure/data-explorer/kusto/query/sortoperator) operators are synonymous. Sorting can be done in ascending order with the `asc` keyword, or in descending order with `desc`.

### *top*

You can get the same behavior as with the combination of `sort` and `take`, by instead using the [top](/azure/data-explorer/kusto/query/topoperator) operator: 

```kusto
SecurityAlert
| top 5 by TimeGenerated desc 
| project TimeGenerated, AlertName, AlertSeverity, ProductName
```

:::image type="content" source="media/kql-overview/table-top.png" lightbox="media/kql-overview/table-top.png" alt-text="Screenshot that shows the results of the top operator example.":::

## Compute derived columns: *extend*

The [extend](/azure/data-explorer/kusto/query/extendoperator) operator is similar to [project](/azure/data-explorer/kusto/query/projectoperator), but it adds to the set of columns instead of replacing them. You can use both operators to create a new column based on a computation on each row.

Let's see which alerts have taken the longest to generate after collecting all their events. We'll do this by creating a new column, `LagTime`, which will subtract the timestamp of the last event in the alert from the timestamp of the alert's publishing. We'll use `top` to see the alerts with the longest lag time.

```kusto
SecurityAlert
| extend LagTime = ProcessingEndTime - EndTime 
| top 5 by LagTime desc 
| project LagTime, TimeGenerated, AlertName, ProductName, SystemAlertId
```

:::image type="content" source="media/kql-overview/table-extend-sort.png" lightbox="media/kql-overview/table-extend-sort.png" alt-text="Screenshot that shows the results of the extend operator example.":::

## Aggregate groups of rows: *summarize*

The [summarize](/azure/data-explorer/kusto/query/summarizeoperator) operator groups together rows that have the same value in the column specified by the `by` keyword. Then, it uses an aggregation function like `count` to summarize each group in a single row. Summarizations can be a count, a sum, an average, and many more. A full range of [aggregation functions](/azure/data-explorer/kusto/query/summarizeoperator#list-of-aggregation-functions) are available. You can use several aggregation functions in one `summarize` operator to produce several computed columns. 

We can see here how many alerts of each kind we have received, broken down further by which product they came from.

```kusto
SecurityAlert
| summarize count() by AlertName, ProductName
```

:::image type="content" source="media/kql-overview/table-summarize-alert.png" lightbox="media/kql-overview/table-summarize-alert.png" alt-text="Screenshot that shows the results of the summarize count operator example.":::

If you use multiple values in a `summarize by` clause, as we did here, the chart displays a separate series for each unique combination of values.

## Summarize by scalar values

You can aggregate by scalar values like numbers and time values, but you should use the [bin()](/azure/data-explorer/kusto/query/binfunction) function to group rows into distinct sets of data. For example, if you aggregate by `TimeGenerated`, you'll get a row for each represented time value. Use `bin()` to group time values into whole hours or days.

Let's see how many new alerts we get in our table each day:

```kusto
SecurityAlert
| summarize count() by bin(TimeGenerated, 1d)
| sort by TimeGenerated desc 
```

:::image type="content" source="media/kql-overview/table-summarize-alert.png" lightbox="media/kql-overview/table-summarize-alert.png" alt-text="Screenshot that shows the results of the summarize operator example with time aggregation.":::


## Assign a result to a variable: *let*

Use [let](/azure/data-explorer/kusto/query/letstatement) to make queries easier to read and manage. You can use this operator to assign the results of a query to a variable that you can use later. By using the `let` statement, the query in the preceding example can be rewritten as:

 
```kusto
let PhysicalComputer = VMComputer
    | distinct Computer, PhysicalMemoryMB;
let AvailableMemory = InsightsMetrics
    | where Namespace == "Memory" and Name == "AvailableMB"
    | project TimeGenerated, Computer, AvailableMemoryMB = Val;
PhysicalComputer
| join kind=inner (AvailableMemory) on Computer
| project TimeGenerated, Computer, PercentMemory = AvailableMemoryMB / PhysicalMemoryMB * 100
```

:::image type="content" source="images/tutorial/azure-monitor-let-results.png" lightbox="images/tutorial/azure-monitor-let-results.png" alt-text="Screenshot that shows the results of the let operator example.":::


## Join data from two tables

What if you need to retrieve data from two tables in a single query? You can use the [join](/azure/data-explorer/kusto/query/joinoperator?pivots=azuremonitor) operator to combine rows from multiple tables in a single result set. Each table must have a column that has a matching value so that the join understands which rows to match.

[VMComputer](/azure/azure-monitor/reference/tables/vmcomputer) is a table that Azure Monitor uses for VMs to store details about virtual machines that it monitors. [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) contains performance data that's collected from those virtual machines. One value collected in *InsightsMetrics* is available memory, but not the percentage memory that's available. To calculate the percentage, we need the physical memory for each virtual machine. That value is in `VMComputer`.

The following example query uses a join to perform this calculation. The [distinct](/azure/data-explorer/kusto/query/distinctoperator) operator is used with `VMComputer` because details are regularly collected from each computer. As result, the table contains multiple rows for each computer. The two tables are joined using the `Computer` column. A row is created in the resulting set that includes columns from both tables for each row in `InsightsMetrics`, where the value in `Computer` has the same value in the `Computer` column in `VMComputer`.

```kusto
VMComputer
| distinct Computer, PhysicalMemoryMB
| join kind=inner (
    InsightsMetrics
    | where Namespace == "Memory" and Name == "AvailableMB"
    | project TimeGenerated, Computer, AvailableMemoryMB = Val
) on Computer
| project TimeGenerated, Computer, PercentMemory = AvailableMemoryMB / PhysicalMemoryMB * 100
```

:::image type="content" source="images/tutorial/azure-monitor-join-results.png" lightbox="images/tutorial/azure-monitor-join-results.png" alt-text="Screenshot that shows the results of the join operator example.":::

## Next steps
