---
title: 'Write queries in Azure Kusto'
description: 'In this how-to, you learn how to perform basic and more advanced queries using the Azure Kusto Query Language.'
services: kusto
author: mgblythe
ms.author: mblythe
ms.reviewer: mblythe
ms.service: kusto
ms.topic: conceptual
ms.date: 09/24/2018
---

# Write queries in Azure Kusto

In this article, you learn how to use the Azure Kusto Query Language to
perform basic queries with the most common operators. You also get
exposure to some of the more advanced features of the language.

## Prerequisites

You can run the queries in this article in one of two ways:

- On the Kusto *help cluster* that we have set up to aid learning.
    [Sign in to the
    cluster](https://kusto.azure.com/clusters/help/databases/samples)
    with an organizational email account that is a member of Azure
    Active directory.

- On your own cluster that includes the StormEvents sample data. For
    more information, see [Quickstart: Create an Azure Kusto cluster and
    database](create-cluster-database-portal.md).

## Overview of the Kusto Query Language

A Kusto query is a read-only request to process data and return results.
The request is stated in plain text, using a data-flow model designed to
make the syntax easy to read, author, and automate. The query uses schema
entities that are organized in a hierarchy similar to SQL: databases, tables,
and columns.

The query consists of a sequence of query statements, delimited by a semicolon
(`;`), with at least one statement being a [**tabular expression statement**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_tabularexpressionstatements.html),
which is a statement that produces data arranged in a table-like mesh of
columns and rows. The query's tabular expression statements produce the results of the
query.

The syntax of the tabular expression statement has tabular data flow from one
tabular query operator to another, starting with data source (e.g. a table
in a database, or an operator that produces data) and then flowing through
a set of data transformation operators that are bound together through the
use of the pipe (`|`) delimiter.

For example, the following Kusto query has a single statement, which is a
tabular expression statement. The statement starts with a reference to a table
called `StormEvents` (the database that host this table is implicit here, and part
of the connection information). The data (rows) for that table are then filtered
by the value of the `StartTime` column, and then filtered by the value of the
`State` column. The query then returns the count of "surviving" rows.

```Kusto
StormEvents
| where StartTime >= datetime(2007-11-01) and StartTime < datetime(2007-12-01)
| where State == "FLORIDA"  
| count
```

In this case, the result is:

|Count|
|-----|
|   28|

## Most common operators

The operators covered in this section are the building blocks to
understanding Kusto queries. Most queries you write will include several
of these operators.

To run queries:

1. Copy each query into Kusto Query Explorer, and then either select
    the query or place your cursor in the query.

1. At the top of Query Explorer, select **Run**.

[**count**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_countoperator.html):
Returns the count of rows in the table.

The following query returns the count of rows in the StormEvents table.

```Kusto
StormEvents | count
```

[**take**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_takeoperator.html):
Returns up to the specified number of rows of data.

The following query returns five rows from the StormEvents table. The
keyword *limit* is an alias for *take.*

```Kusto
StormEvents | take 5
```

> [!TIP]
> There is no guarantee which records are returned unless the source
> data is sorted.

[**project**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_projectoperator.html):
Selects a subset of columns.

The following query returns a specific set of columns.

```Kusto
StormEvents
| take 5
| project StartTime, EndTime, State, EventType, DamageProperty,
EpisodeNarrative
```

[**where**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_whereoperator.html):
Filters a table to the subset of rows that satisfy a predicate.

The following query filters the data by `EventType` and `State`.

```Kusto
StormEvents
| where EventType == 'Flood' and State == 'WASHINGTON'
| take 5
| project StartTime, EndTime, State, EventType, DamageProperty,
EpisodeNarrative
```

[**sort**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_sortoperator.html):
Sort the rows of the input table into order by one or more columns.

The following query sorts the data in descending order by
`DamageProperty`.

```Kusto
StormEvents
| where EventType == 'Flood' and State == 'WASHINGTON'
| sort by DamageProperty desc
| take 5
| project StartTime, EndTime, State, EventType, DamageProperty,
EpisodeNarrative
```

> [!NOTE]
> The order of operations is important. Try putting `take 5`
> before `sort by`. Do you get different results?

[**top**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_topoperator.html):
Returns the first *N* records sorted by the specified columns.

The following query returns the same results as above with one less
operator.

```Kusto
StormEvents
| where EventType == 'Flood' and State == 'WASHINGTON'
| top 5 by DamageProperty desc
| project StartTime, EndTime, State, EventType, DamageProperty,
EpisodeNarrative
```

[**extend**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_extendoperator.html):
Computes derived columns.

The following query creates a new column by computing a value in every
row.

```Kusto
StormEvents
| where EventType == 'Flood' and State == 'WASHINGTON'
| top 5 by DamageProperty desc
| extend Duration = EndTime - StartTime
| project StartTime, EndTime, Duration, State, EventType,
DamageProperty, EpisodeNarrative
```

Expressions can include all the usual operators (+, -, *, /, %), and
there's a range of useful functions that you can call.

[**summarize**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_summarizeoperator.html): Aggregates groups of rows.

The following query returns the count of events by `State`.

```Kusto
StormEvents
| summarize event_count = count() by State
```

The **summarize** operator groups together rows that have the same
values in the **by** clause, and then uses the aggregation function
(such as **count**) to combine each group into a single row. So, in this
case, there's a row for each state, and a column for the count of rows
in that state.

There's a range of aggregation functions, and you can use several of
them in one **summarize** operator to produce several computed columns.
For example, you could get the count of storms in each state and the
unique number of storms per state, then use **top** to get the most
storm-affected states.

```Kusto
StormEvents
| summarize StormCount = count(), TypeOfStorms = dcount(EventType) by
State
| top 5 by StormCount desc
```

The result of a **summarize** operation has:

- Each column named in **by**

- A column for each computed expression

- A row for each combination of by values

[**bin**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_binfunction.html):
Rounds values down to an integer multiple of a given bin size.

The following query calculates the count with a bucket size of 1 day.

```Kusto
StormEvents
| where StartTime > datetime(2007-02-14) and StartTime <
datetime(2007-02-21)
| summarize event_count = count() by bin(StartTime, 1d)
```

[**render**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_renderoperator.html):
Renders results as a graphical output.

The following query displays a column chart.

```Kusto
StormEvents
| summarize event_count=count(), mid = avg(BeginLat) by State
| sort by mid
| where event_count > 1800
| project State, event_count
| render columnchart
```

The following query displays a simple time chart.

```Kusto
StormEvents
| summarize event_count=count() by bin(StartTime, 1d)
| render timechart
```

The following query counts events by the time modulo one day, binned into hours, and displays a time chart.

```Kusto
StormEvents
| extend hour = floor(StartTime % 1d , 1h)
| summarize event_count=count() by hour
| sort by hour asc
| render timechart
```

The following query compares multiple daily series on a time chart.

```Kusto
StormEvents
| extend hour= floor( StartTime % 1d , 1h)
| where State in ("GULF OF
MEXICO","MAINE","VIRGINIA","WISCONSIN","NORTH DAKOTA","NEW
JERSEY","OREGON")
| summarize event_count=count() by hour, State
| render timechart
```

> [!NOTE]
> The **render** operator is a client-side feature rather than part
> of the engine. It's integrated into the language for ease of use.

[**case**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_casefunction.html):
Evaluates a list of predicates, and returns the first result expression
whose predicate is satisfied, or the final **else** expression. You can
use this to categorize or group data:

The following query returns a new column `deaths_bucket` and groups the deaths by number.

```Kusto
StormEvents
| summarize deaths = sum(DeathsDirect) by State
| extend deaths_bucket = case (
    deaths > 50, "large",
    deaths > 10, "medium",
    deaths > 0, "small",
    "N/A")
| sort by State asc
```

## Scalar operators

This section covers some of the most important scalar operators that we
didn't cover in the previous section.

[**extract**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_extractfunction.html?q=extract):
Gets a match for a regular expression from a text string.

The following query extracts specific attribute values from a trace.

```Kusto
let MyData = datatable (Trace: string) ["A=1, B=2, Duration=123.45,
...", "A=1, B=5, Duration=55.256, ..."];
MyData
| extend Duration = extract("Duration=([0-9.]+)", 1, Trace,
typeof(real)) * time(1s)
```

This query uses a **let** statement, which binds a name (in this case
`MyData`) to an expression. For the rest of the scope in which the
**let** statement appears (global scope or in a function body scope),
the name can be used to refer to its bound value.

[**extractjson()**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_extractjsonfunction.html?q=extract):
Gets a specified element out of a JSON text using a path expression

The following query extracts the JSON elements from an array.

```Kusto
let MyData = datatable (Trace: string)
['{"duration":[{"value":118.0,"count":5.0,"min":100.0,"max":150.0,"stdDev":0.0}]}'];
MyData
| extend Value= extractjson("$.duration[0].value",Trace)
| extend Count= extractjson("$.duration[0].count",Trace)
| extend Min= extractjson("$.duration[0].min",Trace)
| extend StdDev= extractjson("$.duration[0].stdDev",Trace)
```

The following query extracts the JSON elements.

```Kusto
let MyData = datatable (Trace: string)
['{"value":118.0,"count":5.0,"min":100.0,"max":150.0,"stdDev":0.0}'];
MyData
| extend Value= extractjson("$.value",Trace)
| extend Count= extractjson("$.count",Trace)
| extend Min= extractjson("$.min",Trace)
| extend StdDev= extractjson("$.stdDev",Trace)
```

The following query extracts the JSON elements with a dynamic data type.

```Kusto
let MyData = datatable (Trace: dynamic)
[dynamic({"value":118.0,"counter":5.0,"min":100.0,"max":150.0,"stdDev":0.0})];
MyData
| project Trace.value, Trace.counter, Trace.min, Trace.max,
Trace.stdDev
```

[**[ago]**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_agofunction.html?q=ago):
Subtracts the given timespan from the current UTC clock time.

The following query returns data for the last 12 hours.

```Kusto
//The first two lines generate sample data, and the last line uses
the ago() operator to get records for last 12 hours.
print TimeStamp= range(now(-5d), now(), 1h), SomeCounter = range(1,121)
| mvexpand TimeStamp, SomeCounter
| where TimeStamp > ago(12h)
```

[**startofweek()**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_startofweekfunction.html?q=startof):
Returns the start of the week containing the date, shifted by an offset,
if provided

The following query returns the start of the week with different
offsets.

```Kusto
range offset from -1 to 1 step 1
| project weekStart = startofweek(now(), offset),offset
```

This query uses the **range** operator, which generates a single-column
table of values. See also:
[**startofday()**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_startofdayfunction.html?q=start%20of)*,*
[**startofweek()**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_startofweekfunction.html?q=startofweek)*,*
[**startofyear()**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_startofyearfunction.html?q=startofyear())*,*
[**startofmonth()**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_startofmonthfunction.html?q=startofmonth)*,*
[**endofday()**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_endofdayfunction.html?q=endofday)*,*
[**endofweek()**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_endofweekfunction.html?q=endofweek)*,*
[**endofmonth()**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_endofmonthfunction.html?q=endofmonth),
and
[**endofyear()**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_endofyearfunction.html?q=endofyear).
```

[**between**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_betweenoperator.html?q=between):
Matches the input that is inside the inclusive range.

The following query filters the data by a given date range.

```Kusto
StormEvents
| where StartTime between (datetime(2007-07-27) ..
datetime(2007-07-30))
| count
```

The following query filters the data by a given date range, with the
slight variation of three days (`3d`) from the start date.

```Kusto
StormEvents
| where StartTime between (datetime(2007-07-27) .. 3d)
| count
```

[**parse**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_parseoperator.html?q=parse): Evaluates a string expression and parses its value into one or more calculated columns. There are three ways to parse: simple (the default), regex, and relaxed.

The following query parses a trace and extracts the relevant values, using a default of simple parsing. The expression (referred to as StringConstant) is a regular string value and the match is strict: extended columns must match the required types.

```Kusto
let MyTrace = datatable (EventTrace:string)
[
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=23, lockTime=02/17/2016 08:40:01,
releaseTime=02/17/2016 08:40:01, previousLockTime=02/17/2016
08:39:01)',
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=15, lockTime=02/17/2016 08:40:00,
releaseTime=02/17/2016 08:40:00, previousLockTime=02/17/2016
08:39:00)',
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=20, lockTime=02/17/2016 08:40:01,
releaseTime=02/17/2016 08:40:01, previousLockTime=02/17/2016
08:39:01)',
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=22, lockTime=02/17/2016 08:41:01,
releaseTime=02/17/2016 08:41:00, previousLockTime=02/17/2016
08:40:01)',
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=16, lockTime=02/17/2016 08:41:00,
releaseTime=02/17/2016 08:41:00, previousLockTime=02/17/2016 08:40:00)'
];
MyTrace
| parse EventTrace with * "resourceName=" resourceName ",
totalSlices=" totalSlices:long * "sliceNumber=" sliceNumber:long *
"lockTime=" lockTime ", releaseTime=" releaseTime:date "," *
"previousLockTime=" previousLockTime:date ")" *
| project resourceName ,totalSlices , sliceNumber , lockTime ,
releaseTime , previousLockTime
```

The following query parses a trace and extracts the relevant values, using `kind = regex`. The StringConstant can be a regular expression.

```Kusto
let MyTrace = datatable (EventTrace:string)
[
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=23, lockTime=02/17/2016 08:40:01,
releaseTime=02/17/2016 08:40:01, previousLockTime=02/17/2016
08:39:01)',
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=15, lockTime=02/17/2016 08:40:00,
releaseTime=02/17/2016 08:40:00, previousLockTime=02/17/2016
08:39:00)',
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=20, lockTime=02/17/2016 08:40:01,
releaseTime=02/17/2016 08:40:01, previousLockTime=02/17/2016
08:39:01)',
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=22, lockTime=02/17/2016 08:41:01,
releaseTime=02/17/2016 08:41:00, previousLockTime=02/17/2016
08:40:01)',
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=16, lockTime=02/17/2016 08:41:00,
releaseTime=02/17/2016 08:41:00, previousLockTime=02/17/2016 08:40:00)'
];
MyTrace
| parse kind = regex EventTrace with "(.*?)[a-zA-Z]*="
resourceName @", totalSlices=\s*\d+\s*.*?sliceNumber="
sliceNumber:long ".*?(previous)?lockTime=" lockTime
".*?releaseTime=" releaseTime ".*?previousLockTime="
previousLockTime:date "\\)"
| project resourceName , sliceNumber , lockTime , releaseTime ,
previousLockTime
```

The following query parses a trace and extracts the relevant values, using `kind = relaxed`. The StringConstant is a regular string value and the match is relaxed: extended columns can partially match the required types.

```Kusto
let MyTrace = datatable (EventTrace:string) 
[
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=23, lockTime=02/17/2016 08:40:01,
releaseTime=02/17/2016 08:40:01, previousLockTime=02/17/2016
08:39:01)',
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=15, lockTime=02/17/2016 08:40:00,
releaseTime=02/17/2016 08:40:00, previousLockTime=02/17/2016
08:39:00)',
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=20, lockTime=02/17/2016 08:40:01,
releaseTime=02/17/2016 08:40:01, previousLockTime=02/17/2016
08:39:01)',
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=22, lockTime=02/17/2016 08:41:01,
releaseTime=02/17/2016 08:41:00, previousLockTime=02/17/2016
08:40:01)',
'Event: NotifySliceRelease (resourceName=PipelineScheduler,
totalSlices=27, sliceNumber=16, lockTime=02/17/2016 08:41:00,
releaseTime=02/17/2016 08:41:00, previousLockTime=02/17/2016 08:40:00)'
];
MyTrace
| parse kind = relaxed "Event: NotifySliceRelease
(resourceName=PipelineScheduler, totalSlices=NULL, sliceNumber=23,
lockTime=02/17/2016 08:40:01, releaseTime=NULL,
previousLockTime=02/17/2016 08:39:01)" with * "resourceName="
resourceName ", totalSlices=" totalSlices:long * "sliceNumber="
sliceNumber:long * "lockTime=" lockTime ", releaseTime="
releaseTime:date "," * "previousLockTime=" previousLockTime:date
")" *
| project resourceName ,totalSlices , sliceNumber , lockTime ,
releaseTime , previousLockTime
```

## Advanced aggregations

We covered basic aggregations, like **count** and **summarize**, earlier
in this article. This section introduces more advanced options

[**top-nested**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_topnestedoperator.html?q=top-nested):
Produces hierarchical top results, where each level is a drill-down
based on previous level values.

This operator is useful for dashboard visualization scenarios, or when
it is necessary to answer a question like the following: "Find the top-N
values of K1 (using some aggregation); for each of them, find what are
the top-M values of K2 (using another aggregation); ..."

The following query returns a hierarchical table with `State` at the
top level, followed by `Sources`.

```Kusto
StormEvents
| top-nested 2 of State by sum(BeginLat),
top-nested 3 of Source by sum(BeginLat),
top-nested 1 of EndLocation by sum(BeginLat)
```

[**pivot
plugin**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_pivotplugin.html?q=pivot):
Rotates a table by turning the unique values from one column in the
input table into multiple columns in the output table. The operator
performs aggregations where they are required on any remaining column
values in the final output.

The following query applies a filter and pivots the rows into columns.

```Kusto
StormEvents
| project State, EventType
| where State startswith "AL"
| where EventType has "Wind"
| evaluate pivot(State)
```

[**dcount**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_dcount_aggfunction.html?q=dcount):
Returns an estimate of the number of distinct values of an expression in
the group. Use
[**count()**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_countoperator.html?q=count)
to count all values.

The following query counts distinct `Source` by `State`.

```Kusto
StormEvents
| summarize Sources = dcount(Source) by State
```

[**dcountif**:](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_dcountif_aggfunction.html?q=dcount)
Returns an estimate of the number of distinct values of the expression
for rows for which the predicate evaluates to true.

The following query counts the distinct values of `Source` where
`DamageProperty < 5000`.

```Kusto
StormEvents | take 100
| summarize Sources = dcountif(Source, DamageProperty < 5000) by State
```

[**dcount_hll**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_dcount_hllfunction.html?q=dcount):
Calculates the **dcount** from HyperLogLog results (generated
by [**hll**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_hll_aggfunction.html) or [**hll_merge**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_hll_merge_aggfunction.html)).

The following query uses the HLL algorithm to generate the count.

```Kusto
StormEvents
| summarize hllRes = hll(DamageProperty) by bin(StartTime,10m)
| summarize hllMerged = hll_merge(hllRes)
| project dcount_hll(hllMerged)
```

[**arg_max**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_arg_max_aggfunction.html?q=arg_max):
Finds a row in the group that maximizes an expression, and returns the
value of another expression (or * to return the entire row).

The following query returns the time of the last flood report in each
state.

```Kusto
StormEvents
| where EventType == "Flood"
| summarize arg_max(StartTime, *) by State
| project State, StartTime, EndTime, EventType
```

[**makeset**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_makeset_aggfunction.html?q=makeset):
Returns a dynamic (JSON) array of the set of distinct values that an
expression takes in the group.

The following query returns all the times when a flood was reported by
each state and creates an array from the set of distinct values.

```Kusto
StormEvents
| where EventType == "Flood"
| summarize FloodReports = makeset(StartTime) by State
| project State, FloodReports
```

[**mvexpand**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_mvexpandoperator.html?q=mvexpand):
Expands multi-value collection(s) from
a [**dynamic**](https://kusto.azurewebsites.net/docs/concepts/concepts_datatypes_dynamic.html)-typed
column so that each value in the collection gets a separate row. All the
other columns in an expanded row are duplicated. It's the opposite of
makelist.

The following query generates sample data by creating a set and then
using it to demonstrate the **mvexpand** capabilities.

```Kusto
let FloodDataSet = StormEvents
| where EventType == "Flood"
| summarize FloodReports = makeset(StartTime) by State
| project State, FloodReports;
FloodDataSet
| mvexpand FloodReports
```

[**percentiles()**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_percentiles_aggfunction.html):
Returns an estimate for the specified [**nearest-rank
percentile**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_percentiles_aggfunction.html) of
the population defined by an expression. The accuracy depends on the
density of population in the region of the percentile. Can be used only
in the context of aggregation
inside [**summarize**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_summarizeoperator.html).

The following query calculates percentiles for storm duration.

```Kusto
StormEvents
| extend duration = EndTime - StartTime
| where duration > 0s
| where duration < 3h
| summarize percentiles(duration, 5, 20, 50, 80, 95)
```

The following query calculates percentiles for storm duration by state
and normalizes the data by five minute bins (`5m`).

```Kusto
StormEvents
| extend duration = EndTime - StartTime
| where duration > 0s
| where duration < 3h
| summarize event_count = count() by bin(duration, 5m), State
| summarize percentiles(duration, 5, 20, 50, 80, 95) by State
```

### Cross Dataset

This section covers elements that enable you to create more complex
queries, join data across tables, and query across databases and
clusters.

[**let**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_letstatement.html):
Improves modularity and reuse. The **let** statement allows you to break
a potentially complex expression into multiple parts, each bound to a
name, and compose those parts together. A **let** statement can also be
used to create user-defined functions and views (expressions over tables
whose results look like a new table). Expressions bound by a **let**
statement can be of scalar type, of tabular type, or user-defined
function (lambdas).

The following example creates a tabular type variable and uses it in a subsequent expression.

```Kusto
let LightningStorms =
StormEvents
| where EventType == "Lightning";
let AvalancheStorms =
StormEvents
| where EventType == "Avalanche";
LightningStorms
| join (AvalancheStorms) on State
| distinct State
```

[**join**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_joinoperator.html):
Merge the rows of two tables to form a new table by matching values of
the specified column(s) from each table. Kusto supports a full range of
join types:
**fullouter**, **inner**, **innerunique**, **leftanti**, **leftantisemi**,
**leftouter**, **leftsemi**, **rightanti**, **rightantisemi**, **rightouter**, **rightsemi**.

The following example joins two tables with an inner join.

```Kusto
let X = datatable(Key:string, Value1:long)
[
    'a',1,
    'b',2,
    'b',3
    'c',4
];
let Y = datatable(Key:string, Value2:long)
[
    'b',10,
    'c',20,
    'c',30,
    'd',40
];
X | join kind=inner Y on Key
```

> [!TIP]
> Use **where** and **project** operators to reduce the numbers of
> rows and columns in the input tables, before the join. If one table is
> always smaller than the other, use it as the left (piped) side of the
> join. The columns for the join match must have the same name. Use the
> **project** operator if necessary to rename a column in one of the
> tables.

[**serialize**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_serializeoperator.html?q=serialize):
Serializes the row set so you can use functions that require serialized
data, like **row_number()**.

The following query fails, because the data is not serialized.

```Kusto
StormEvents
| summarize count() by State
| extend row_number = row_number()
```

Once the data is serialized, the query succeeds.

```Kusto
StormEvents
| summarize count() by State
| serialize
| extend row_number = row_number()
```

The row set is also considered as serialized if it's a result of:
**sort**, **top**, or **range** operators, optionally followed by
**project**, **project-away**, **extend**, **where**, **parse**,
**mvexpand**, or **take** operators.

```Kusto
StormEvents
| summarize count() by State
| sort by State asc
| extend row_number = row_number()
```
    
[Cross-Database and Cross-Cluster Queries](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_syntax.html?q=cross): You can query a database on the same cluster by referring it as `database(“MyDatabase”).MyTable`. You can query a database on a remote cluster by referring to it as `cluster(“MyCluster”).database(“MyDatabase”).MyTable`.

The following query is called from one cluster and queries data from
`MyCluster` cluster.

```Kusto
cluster("MyCluster").database("Wiki").PageViews
| where Views < 2000
| take 1000;
```

### User Analytics 

This section include elements and queries that demonstrate how easy it
is perform analysis of user behaviors in Kusto.

[**activity_counts_metrics
plugin**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_activity_counts_metrics_plugin.html):
Calculates useful activity metrics (total count values, distinct count
values, distinct count of new values, and aggregated distinct count).
Metrics are calculated for each time window, then they are compared, and
aggregated to and with all previous time windows.

The following query analyzes user adoption by calculating daily activity
counts.

```Kusto
let start=datetime(2017-08-01);
let end=datetime(2017-08-04);
let window=1d;
let T = datatable(UserId:string, Timestamp:datetime)
[
'A', datetime(2017-08-01),
'D', datetime(2017-08-01),
'J', datetime(2017-08-01),
'B', datetime(2017-08-01),
'C', datetime(2017-08-02),
'T', datetime(2017-08-02),
'J', datetime(2017-08-02),
'H', datetime(2017-08-03),
'T', datetime(2017-08-03),
'T', datetime(2017-08-03),
'J', datetime(2017-08-03),
'B', datetime(2017-08-03),
'S', datetime(2017-08-03),
'S', datetime(2017-08-04),
];
T
| evaluate activity_counts_metrics(UserId, Timestamp, start, end,
window)
```

[**activity_engagement
plugin**)(https://kusto.azurewebsites.net/docs/queryLanguage/query_language_activity_engagement_plugin.html):
Calculates activity engagement ratio based on ID column over a sliding
timeline window. **activity_engagement plugin** can be used for
calculating DAU, WAU, and MAU (daily, weekly, and monthly active users).

The following query returns the ratio of total distinct users using an application daily compared to total distinct users using the application weekly, on a moving seven-day window.

```Kusto
// Generate random data of user activities
let _start = datetime(2017-01-01);
let _end = datetime(2017-01-31);
range _day from _start to _end step 1d
| extend d = tolong((_day - _start)/1d)
| extend r = rand()+1
| extend _users=range(tolong(d*50*r), tolong(d*50*r+100*r-1), 1)
| mvexpand id=_users to typeof(long) limit 1000000
// Calculate DAU/WAU ratio
| evaluate activity_engagement(['id'], _day, _start, _end, 1d,
7d)
| project _day, Dau_Wau=activity_ratio*100
| render timechart
```

> [!TIP]
> When calculating DAU/MAU, change the end data and the moving window period (OuterActivityWindow).

[**activity_metrics
plugin**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_activity_metrics_plugin.html):
Calculates useful activity metrics (distinct count values, distinct
count of new values, retention rate, and churn rate) based on the
current period window vs. the previous period window.

The following query calculates the churn and retention rate for a given
dataset.

```Kusto
// Generate random data of user activities
let _start = datetime(2017-01-02);
let _end = datetime(2017-05-31);
range _day from _start to _end step 1d
| extend d = tolong((_day - _start)/1d)
| extend r = rand()+1
| extend _users=range(tolong(d*50*r), tolong(d*50*r+200*r-1), 1)
| mvexpand id=_users to typeof(long) limit 1000000
| where _day > datetime(2017-01-02)
| project _day, id
// Calculate weekly retention rate
| evaluate activity_metrics(['id'], _day, _start, _end, 7d)
| project _day, retention_rate*100, churn_rate*100
| render timechart
```

[**new_activity_metrics
plugin**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_new_activity_metrics_plugin.html):
Calculates useful activity metrics (distinct count values, distinct
count of new values, retention rate, and churn rate) for the cohort of
new users. The concept of this plugin is similar to [**activity_metrics
plugin**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_activity_metrics_plugin.html),
but focuses on new users.

The following query calculates a retention and churn rate with a
week-over-week window for the new users cohort (users that arrived on
the first week).

```Kusto
// Generate random data of user activities
let _start = datetime(2017-05-01);
let _end = datetime(2017-05-31);
range Day from _start to _end step 1d
| extend d = tolong((Day - _start)/1d)
| extend r = rand()+1
| extend _users=range(tolong(d*50*r), tolong(d*50*r+200*r-1), 1)
| mvexpand id=_users to typeof(long) limit 1000000
// Take only the first week cohort (last parameter)
| evaluate new_activity_metrics(['id'], Day, _start, _end, 7d,
_start)
| project from_Day, to_Day, retention_rate, churn_rate
```

[**session_count
plugin**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_session_count_plugin.html):
Calculates the count of sessions based on ID column over a timeline.

The following query returns the count of sessions. A session is considered active if a user ID appears at least once at a timeframe of 100-time slots, while the session look-back window is 41-time slots.

```Kusto
let _data = range Timeline from 1 to 9999 step 1
| extend __key = 1
| join kind=inner (range Id from 1 to 50 step 1 | extend __key=1) on
__key
| where Timeline % Id == 0
| project Timeline, Id;
// End of data definition
_data
| evaluate session_count(Id, Timeline, 1, 10000, 100, 41)
| render linechart
```

[**funnel_sequence
plugin**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_funnel_sequence_plugin.html):
Calculates the distinct count of users who have taken a sequence of
states; shows the distribution of previous and next states that have led
to or were followed by the sequence.

The following query shows what event happens before and after all
Tornado events in 2007.

```Kusto
// Looking on StormEvents statistics:
// Q1: What happens before Tornado event?
// Q2: What happens after Tornado event?
StormEvents
| evaluate funnel_sequence(EpisodeId, StartTime, datetime(2007-01-01),
datetime(2008-01-01), 1d,365d, EventType, dynamic(['Tornado']))
```

[**funnel_sequence_completion
plugin**](https://kusto.azurewebsites.net/docs/queryLanguage/query_language_funnel_sequence_completion_plugin.html):
Calculates the funnel of completed sequence steps within different time
periods.

The following query checks the completion funnel of the
sequence: `Hail -> Tornado -> Thunderstorm Wind` in "overall"
times of one hour, four hours, and one day (`[1h, 4h, 1d]`).

```Kusto
let _start = datetime(2007-01-01);
let _end = datetime(2008-01-01);
let _windowSize = 365d;
let _sequence = dynamic(['Hail', 'Tornado', 'Thunderstorm
Wind']);
let _periods = dynamic([1h, 4h, 1d]);
StormEvents
| evaluate funnel_sequence_completion(EpisodeId, StartTime, _start,
_end, _windowSize, EventType, _sequence, _periods)
```

## Functions

This section covers
[**functions**](https://kusto.azurewebsites.net/docs/controlCommands/controlcommands_functions.html?q=function):
reusable queries that are stored on the server. Functions can be invoked
by queries and other functions (recursion is not supported).

The following example creates a function that takes a state name
(`MyState`) as an argument.

```Kusto
.create function with (folder="Demo")
MyFunction (MyState: string)
{
StormEvents
| where State =~ MyState
}
```

The following example calls a function, which gets data for the state
of Texas.

```Kusto
MyFunction ("Texas")
| summarize count()
```

The following example deletes the function that was created in the
first step.

```Kusto
.drop function MyFunction
```

## Next steps

> [!div class="nextstepaction"]
> [What is Kusto?](https://docs.microsoft.com/azure)

