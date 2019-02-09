---
title: Writing efficient log queries in Azure Monitor | Microsoft Docs
description: References to resources for learning how to write queries in Log Analytics.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 01/17/2019
ms.author: bwren
---

# Writing efficient log queries in Azure Monitor
This article provides recommendations for writing efficient log queries in Azure Monitor. Using these strategies, you can ensure that your queries will run quickly and with minimal overheard.

## Scope your query
Having your query process more data than you actually need may lead to a long-running query and often result in too much data in your results to effectively analyze. In extreme cases the query may even time out and fail.

### Specify your data source
The first step in writing an efficient query is limiting its scope to its required data sources. Specifying a table is always preferred over running an wide text search, such as `search *`. To query a specific table, start your query with the table name as in the following:

``` Kusto
requests | ...
```

You can use [search](/azure/kusto/query/searchoperator) to search for a value across multiple columns in specific tables using a query like the following:

``` Kusto
search in (exceptions) "The server was not found"

search in (exceptions, customEvents) "timeout"
```

Use [union](/azure/kusto/query/unionoperator) to query several tables like the following:

``` Kusto
union requests, traces | ...
```

### Specify a time range
You should also limit your query to the time range of data that you require. By default, your query will include data collected in the last 24 hours. You can change that option in the [Time range selector](get-started-portal.md#select-a-time-range) or add it explicitly to your query. It's best to add the time filter immediately after the table name so that the rest of your query only processes data within that range:

``` Kusto
requests | where timestamp > ago(1h)

requests | where timestamp between (ago(1h) .. ago(30m))
```
   
### Get only the latest records

To return only the latest records, use the *top* operator as in the following query which returns the latest 10 records logged in the *traces* table:

``` Kusto
traces | top 10 by timestamp
```

   
### Filter records
To review only logs that match a given condition, use the *where* operator as in the following query that returns only records in which the _severityLevel_ value is higher than 0:

``` Kusto
traces | where severityLevel > 0
```



## String comparisons
When [evaluating strings](/azure/kusto/query/datatypes-string-operators), you should usually use `has` instead of `contains` when looking for full tokens. `has` is more efficient since it doesn't have to look-up for substrings.

## Returned columns

Use [project](/azure/kusto/query/projectoperator) to narrow the set of columns being processed to only those you need:

``` Kusto
traces 
| project timestamp, severityLevel, client_City 
| ...
```

While you can use [extend](/azure/kusto/query/extendoperator) to calculate values and create your own columns, it will typically be more efficient to filter on a table column.

For example, the first query below that filters on _operation\_Name_ would be more efficient than the second which creates a new _subscription_ column and filters on it:

``` Kusto
customEvents 
| where split(operation_Name, "/")[2] == "acb"

customEvents 
| extend subscription = split(operation_Name, "/")[2] 
| where subscription == "acb"
```

## Using joins
When using the [join](/azure/kusto/query/joinoperator) operator, choose the table with fewer rows to be on the left side of the query.


## Next steps
To learn more about query best practices, see [Query best practices](/azure/kusto/query/best-practices).