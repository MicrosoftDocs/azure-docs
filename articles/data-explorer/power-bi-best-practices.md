---
title: 'Visualize data using the Azure Data Explorer connector for Power BI'
description: 'In this article, you learn how to use Power BI to visualize Azure Data Explorer data.'
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: conceptual
ms.date: 08/22/2019

# Customer intent: As a data analyst, I want to choose the connection options to Power BI so I can select the one most appropriate to my scenario. I also want to visualize my data for additional insights.
---

# Using Power BI

Using Azure Data Explorer native connector for creating Power BI dashboards is straightforward. You can build dashboards using either Import mode or DirectQuery mode depending on the scenario, scale and performance requirements (you can read about the differences between the two modes in the Power BI Desktop documentation).

## Import or Direct Query

The Power BI Kusto Connector supports both Import and Direct Query connectiviy modes (You can
read about the differences between the two modes in the [Power BI Desktop documentation](https://docs.microsoft.com/en-us/power-bi/desktop-directquery-about)).

You should use **Import** mode when:

 * Your data set is relatively small - Import mode retrieves all the data and retain it with the Power BI reporthh
 * You do not need near-real-time data - data can be refreshed via Scheduled Refresh (at a 30 minutes granularity) 
 * Your data is already aggregated, or you already perform aggregation in Kusto (e.g. via Kusto Functions)

You should use **Direct Query** mode when:
 
 * Your data set is very large - it is not feasible to import it all. DirectQuery requires no large transfer of data, as it is queried in place
 * You need near-real-time data - every time data is displayed, it is being queried directly from your Kusto cluster

## Best practices

When working with terabytes of fresh, raw data it is recommended to follow these guidelines to keep Power BI dashboards and reports snappy and up to date:

**Travel light** - use the flexibility of Kusto Query Language and bring to Power BI only the data you need for your reports. For full-fledged raw data interactive analysis it is recommended to use one of Azure Data Explorer dedicated clients like the Web UI and Kusto.Explorer, which are optimized for ad-hoc exploration with Azure Data Explorer.

**Composite model** - use composite model and utilize “Import mode” for snappy interaction of smaller datasets side by side with “DirectQuery mode” for large, frequently updated datasets. The concept of composite model is using a combination of aggregated data for top level dashboards with filtered raw data for more operational data. You should clearly define in which cases you need to use raw data and in which an aggregated view is sufficient for answering the business questions at hand.
Dimension tables should be created using “Import mode” since they tend to be small and do not change very often. You should set the refresh interval according to the expected rate of data update of that source.
Fact tables, which are usually big and contain raw data, should be created using “DirectQuery mode”. In many cases these tables are used for presenting filtered data with using Power BI drillthrough.

**Parallelism** – Azure Data explorer is a linearly scalable data platform, therefor in general you can improve performance of dashboard rendering by increasing the parallelism of the E2E flow. You have a few means for doing that:

a.	Increase the number of concurrent queries in Power BI desktop properties pane as documented [here]().

    img

b.	Use weak consistency to improve parallelism. This might have an impact on the freshness of the data.

**Effective slicers** – you can use Sync Slicers to prevent reports from loading data before everything is set and ready. When you’re done with structuring the dataset, placing all visuals and marking all slicers you can click the sync slicer to load only the data needed.

**Filters, filters and some more filters** - send as many filters as possible, since this will focus Azure Data Explorer search on the relevant data shards.

**Efficient visuals** – some visuals are more performant then others. Try the alternatives to check which are more performant in your case.

**Using complex queries in Power BI** - If you have complex queries - queries that are more easily expressed in CSL than in Power Query - it is better to implement those queries as Kusto Functions, and invoke thsoe functions in Power BI. One such scenario where this is not only recommended, but required, it when you have let statements in your queries, and you are using Direct Query (which might result in joins). Because Power BI will take 2 queries and join them, this might result in syntax errors (since let statements cannot be used with the join operator). In this scenario, you should save each leg of the join as a Kusto Function and let Power BI join between these 2 functions.

## How to simulate `Timestamp < ago(1d)`

PowerBI doesn't have a "relative" date-time operator, such as ago(), which is quite
common in Kusto.

In order to simulate it, we can do use a combination of PowerBI functions -
`DateTime.FixedLocalNow()` and the `#duration` constructor:

```
let
    Source = Kusto.Contents("help", "Samples", "StormEvents", []),
    #"Filtered Rows" = Table.SelectRows(Source, each [StartTime] > (DateTime.FixedLocalNow()-#duration(5,0,0,0)))
in
    #"Filtered Rows"
```
The query is equivalent to one of the following Kusto's CSL queries:

<!-- csl -->
```
    StormEvents | where StartTime > (now()-5d)
    StormEvents | where StartTime > ago(5d)
```

### Reaching Kusto query limits 

Kusto queries return by default up to 500,000 rows or 64MB, as described in the [Query Limits](../concepts/querylimits.md) section). You can override these defaults using the Advances options section of the connection form:

![alt text](./Images/KustoTools-PowerBIConnector/step4.png "step4")

These options issue [set statements](../query/setstatement.md) with your query, so change Kusto's query limits:

  * **Limit query result record number** generates a `set truncationmaxrecords`
  * **Limit query result data size in Bytes** generates a `set truncationmaxsize`
  * **Disable result-set truncation** generates a `set notruncation`


## Using Query Parameters

You can use Query Parameters to modify your query dynamically. 

### Using a Query Parameter in the connection details

1. Open the relevant query with the Advanced Editor 
2. Find the following section of the query:

   ```Source = Kusto.Contents("<Cluster>", "<Database>", "<Query>", [])```
   
   For example:

   ```Source = Kusto.Contents("help", "Samples", "StormEvents | where State == 'ALABAMA' | take 100", [])```

3. Replace the relevant part of the query with your parameter. Splitting the query into multiple parts, and concatenate them back using the & sign, along with the parameter.

   For example, in the query above, we'll take the ```State == 'ALABAMA'``` part, and split it to: ```State == '``` and ```'``` and we'll place the ```State``` parameter between them:
   
   ```"StormEvents | where State == '" & State & "' | take 100"```

4. If your query contains double-quotes, make sure to encode them correctly. For example, if we have the query: 

   ``` "StormEvents | where State == "ALABAMA" | take 100" ```

   If will appear in the Advanced Editor as (notice the 2 double-quotes):

   ```"StormEvents | where State == ""ALABAMA"" | take 100"```

   And it should be replaced with (notice the 3 double-quotes):

   ```"StormEvents | where State == """ & State & """ | take 100"```


### Using a Query Parameter in the query steps

You can use Query Parameters to in any query step that supports it. For example, to filter the results based on the value of a Parameter:

![alt text](./Images/KustoTools-PowerBIConnector/Filter-using-parameter.png "Filter-using-parameter")

## Change the timeout of a Power BI query

When generating a Power BI query in Kusto Explorer, the timeout used in the query is taken from tools->options->connections->query server timeout. It's also possible to edit the generated query manually and change both client and server timeouts:

```
let KustoQuery = 
    let Source = Json.Document(Web.Contents("...",#"x-ms-app"="PowerQuery",#"properties"="{""Options"":{""servertimeout"":""00:04:00""}}"], Timeout=#duration(0,0,4,0)])),
    ...
in KustoQuery
```

## Limitations and known issues

There are a number of limitations and known issues one must consider when
using Power BI to query Kusto:

1. **Do not use Power BI to issue control commands to Kusto.**
   Power BI includes a data refresh scheduler, capable of periodically issuing
   queries against a data source (such as Kusto) with no user present. This mechanism
   should not be used to schedule control commands to Kusto, as Power BI assumes
   all queries are read-only (and therefore idempotent) and does not guarantee
   exactly-once queries.

2. **Power BI can only send short (&lt;2000) queries to Kusto.**
   If running a query in Power BI results in an error of: _"DataSource.Error: Web.Contents failed to get contents from..."_, most likely the reason is that the query is longer than 2000 characters. Power BI uses Power Query to query Kusto, and does so by issuing a HTTP GET
   request which encodes the query as part of the URI being retrieved. This means
   that Kusto queries issued by Power BI are limited to the maximum length of
   a request URI (2000 characters, minus some small offset). The workaround is
   to define a [stored function](../management/functions.md) in Kusto,
   and have Power BI use that function in the query.
   <br>(Why isn't HTTP POST used instead? Turns out Power Query currently
   only supports anonymous HTTP POST requests.)


