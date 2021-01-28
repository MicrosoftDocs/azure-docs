---
title: Schedule indexer execution
titleSuffix: Azure Cognitive Search
description: Schedule Azure Cognitive Search indexers to index content periodically or at specific times.

author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 01/28/2021
---

# How to schedule indexers in Azure Cognitive Search

An indexer normally runs once, immediately after it is created. You can run it again on demand using the portal, the [Run Indexer (REST API](/rest/api/searchservice/run-indexer), or the .NET SDK. You can also configure an indexer to run periodically on a schedule. Some situations where indexer scheduling is useful:

* Source data will change over time, and you want the Azure Cognitive Search indexers to automatically process the changed data.
* The index will be populated from multiple data sources and you want to make sure the indexers run at different times to reduce conflicts.
* The source data is very large and you want to spread the indexer processing over time. For more information about indexing large volumes of data, see [How to index large data sets in Azure Cognitive Search](search-howto-large-index.md).

The scheduler is a built-in feature of Azure Cognitive Search. You can't use an external scheduler to control search indexers.

## Schedule properties

A schedule is part of the indexer definition. If the **schedule** property is omitted, the indexer will only run once immediately after it is created. An indexer **schedule** property has two parts.

| Property | Description |
|----------|-------------|
|**Interval** | (required) The between the start of two consecutive indexer executions. The smallest interval allowed is 5 minutes, and the longest is 1440 minutes (24 hours). It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](https://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). The pattern for this is: `P(nD)(T(nH)(nM))`. <br/><br/>Examples: `PT15M` for every 15 minutes, `PT2H` for every 2 hours.|
| **Start Time (UTC)** | (optional) Indicates when scheduled executions should begin. If omitted, the current UTC time is used. This time can be in the past, in which case the first execution is scheduled as if the indexer has been running continuously since the original **startTime**. |

Only one execution of an indexer can run at a time. If an indexer is already running when its next execution is scheduled, that execution is postponed until the next scheduled time.

Let’s consider an example to make this more concrete. Suppose we configure an indexer schedule with an **Interval** of hourly and a **Start Time** of June 1, 2019 at 8:00:00 AM UTC. Here’s what could happen when an indexer run takes longer than an hour:

* The first indexer execution starts at or around June 1, 2019 at 8:00 AM UTC. Assume this execution takes 20 minutes (or any time less than 1 hour).
* The second execution starts at or around June 1, 2019 9:00 AM UTC. Suppose that this execution takes 70 minutes - more than an hour – and it will not complete until 10:10 AM UTC.
* The third execution is scheduled to start at 10:00 AM UTC, but at that time the previous execution is still running. This scheduled execution is then skipped. The next execution of the indexer will not start until 11:00 AM UTC.

> [!NOTE]
> If an indexer is set to a certain schedule but repeatedly fails on the same document over and over again each time it runs, the indexer will begin running on a less frequent interval (up to the maximum of at least once every 24 hours) until it successfully makes progress again.  If you believe you have fixed whatever the issue that was causing the indexer to be stuck at a certain point, you can perform an on demand run of the indexer, and if that successfully makes progress, the indexer will return to its set schedule interval again.

## Schedule using REST

Specify the **schedule** property when creating or updating the indexer.

```http
    PUT https://myservice.search.windows.net/indexers/myindexer?api-version=2020-06-30
    Content-Type: application/json
    api-key: admin-key

    {
        "dataSourceName" : "myazuresqldatasource",
        "targetIndexName" : "target index name",
        "schedule" : { "interval" : "PT10M", "startTime" : "2015-01-01T00:00:00Z" }
    }
```

## Schedule using .NET

The following C# example creates an Azure SQL database indexer, using a predefined data source and index, and sets its schedule to run once every day, starting now:

```csharp
var schedule = new IndexingSchedule(TimeSpan.FromDays(1))
{
    StartTime = DateTimeOffset.Now
};

var indexer = new SearchIndexer("hotels-sql-idxr", dataSource.Name, searchIndex.Name)
{
    Description = "Data indexer",
    Schedule = schedule
};

await indexerClient.CreateOrUpdateIndexerAsync(indexer);
```

The .NET SDK lets you control indexer operations using the [SearchIndexerClient](/dotnet/api/azure.search.documents.indexes.searchindexerclient). 

The schedule is defined using the [IndexingSchedule](/dotnet/api/azure.search.documents.indexes.models.indexingschedule) class. The **IndexingSchedule** constructor requires an **Interval** parameter specified using a **TimeSpan** object. The smallest interval value allowed is 5 minutes, and the largest is 24 hours. The second **StartTime** parameter, specified as a **DateTimeOffset** object, is optional.

## Next steps

For indexers that run on a schedule, you can monitor operations by retrieving status from the search service, or get more detailed information by enabling diagnostic logging.

* [Monitor search indexer status](search-howto-monitor-indexers.md)
* [Collect and analyze log data](search-monitor-logs.md)