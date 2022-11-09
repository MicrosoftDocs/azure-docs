---
title: Schedule indexer execution
titleSuffix: Azure Cognitive Search
description: Learn how to schedule Azure Cognitive Search indexers to index content at specific intervals, or at specific dates and times.

author: HeidiSteen
manager: nitinme
ms.author: heidist
ms.service: cognitive-search
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 01/21/2022
---

# Schedule an indexer in Azure Cognitive Search

Indexers can be configured to run on a schedule when you set the "schedule" property in the indexer definition. By default, an indexer runs once, immediately after it is created. Afterwards, you can run it again on demand or on a schedule. Some situations where indexer scheduling is useful include:

+ Source data is changing over time, and you want the indexer to automatically process the difference.

+ A search index is populated from multiple data sources, and you want to stagger the indexer jobs to reduce conflicts.

+ Source data is very large and you want to spread the indexer processing over time. 

  Indexer jobs are subject to a maximum running time of 24 hours for regular data sources and 2 hours for indexers with skillsets. If indexing cannot complete within the maximum interval, you can configure a schedule that runs every 2 hours. Indexers can automatically pick up where they left off, based on an internal high water mark that marks where indexing last ended. Running an indexer on a recurring 2-hour schedule allows it to process a very large data set (many millions of documents) beyond the 24-interval allowed for a single job. For more information about indexing large data volumes, see [How to index large data sets in Azure Cognitive Search](search-howto-large-index.md).

## Prerequisites

+ A valid indexer configured with a data source and index.

+ Change detection in the data source. Azure Storage and SharePoint have built-in change detection. Other data sources, such as [Azure SQL](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md) and [Azure Cosmos DB](search-howto-index-cosmosdb.md) must be enabled manually.

## Schedule definition

A schedule is part of the indexer definition. If the "schedule" property is omitted, the indexer will only run on demand. The property has two parts.

| Property | Description |
|----------|-------------|
| "interval" | (required) The amount of time between the start of two consecutive indexer executions. The smallest interval allowed is 5 minutes, and the longest is 1440 minutes (24 hours). It must be formatted as an XSD "dayTimeDuration" value (a restricted subset of an [ISO 8601 duration](https://www.w3.org/TR/xmlschema11-2/#dayTimeDuration) value). </br></br>The pattern for this is: `P(nD)(T(nH)(nM))`. </br></br>Examples: `PT15M` for every 15 minutes, `PT2H` for every 2 hours.|
| "startTime" | (optional) Start time is specified in coordinated universal time (UTC). If omitted, the current time is used. This time can be in the past, in which case the first execution is scheduled as if the indexer has been running continuously since the original start time.|

The following example is a schedule that starts on January 1 at midnight and runs every 50 minutes.

```json
{
    "dataSourceName" : "hotels-ds",
    "targetIndexName" : "hotels-idx",
    "schedule" : { "interval" : "PT50M", "startTime" : "2022-01-01T00:00:00Z" }
}
```

## Configure a schedule

Schedules are specified in an indexer definition. To set up a schedule, you can use Azure portal, REST APIs, or an Azure SDK.

### [**Azure portal**](#tab/portal)

1. [Sign in to Azure portal](https://portal.azure.com) and open the search service page.
1. On the **Overview** page, select the **Indexers** tab.
1. Select an indexer.
1. Select **Settings**.
1. Scroll down to **Schedule**, and then choose Hourly, Daily, or Custom to set a specific date, time, or custom interval.

### [**REST**](#tab/rest)

1. Call [Create Indexer](/rest/api/searchservice/create-indexer) or [Update Indexer](/rest/api/searchservice/update-indexer).

1. Set the schedule property in the body of the request:

    ```http
    PUT /indexers/<indexer-name>?api-version=2020-06-30
    {
        "dataSourceName" : "myazuresqldatasource",
        "targetIndexName" : "my-target-index-name",
        "schedule" : { "interval" : "PT10M", "startTime" : "2021-01-01T00:00:00Z" }
    }
    ```

### [**.NET SDK**](#tab/csharp)

Call the [IndexingSchedule](/dotnet/api/azure.search.documents.indexes.models.indexingschedule) class when creating or updating an indexer using the [SearchIndexerClient](/dotnet/api/azure.search.documents.indexes.searchindexerclient). 

The IndexingSchedule constructor requires an interval parameter specified using a TimeSpan object. Recall that the smallest interval value allowed is 5 minutes, and the largest is 24 hours. The second StartTime parameter, specified as a DateTimeOffset object, is optional.

The following C# example creates an indexer, using a predefined data source and index, and sets its schedule to run once every day, starting now:

```csharp
var schedule = new IndexingSchedule(TimeSpan.FromDays(1))
{
    StartTime = DateTimeOffset.Now
};

var indexer = new SearchIndexer("demo-idxr", dataSource.Name, searchIndex.Name)
{
    Description = "Demo data indexer",
    Schedule = schedule
};

await indexerClient.CreateOrUpdateIndexerAsync(indexer);
```

---

## Scheduling behavior

For text-based indexing, the scheduler can kick off as many indexer jobs as the search service supports, which is determined by the number of search units. For example, if the service has three replicas and four partitions, you can generally have twelve indexer jobs in active execution, whether initiated on demand or on a schedule.

Skills-based indexers run in a different [execution environment](search-howto-run-reset-indexers.md#indexer-execution). For this reason, the number of service units has no bearing on the number of skills-based indexer jobs you can run. Multiple skills-based indexers can run in parallel, but doing so depends on node availability within the execution environment.

Although multiple indexers can run simultaneously, a given indexer is single instance. You cannot run two copies of the same indexer concurrently. If an indexer happens to still be running when its next scheduled execution is set to start, the pending execution is postponed until the next scheduled occurrence, allowing the current job to finish.

Let’s consider an example to make this more concrete. Suppose we configure an indexer schedule with an interval of hourly and a start time of June 1, 2021 at 8:00:00 AM UTC. Here's what could happen when an indexer run takes longer than an hour:

+ The first indexer execution starts at or around June 1, 2021 at 8:00 AM UTC. Assume this execution takes 20 minutes (or any time less than 1 hour).

+ The second execution starts at or around June 1, 2021 9:00 AM UTC. Suppose that this execution takes 70 minutes - more than an hour – and it will not complete until 10:10 AM UTC.

+ The third execution is scheduled to start at 10:00 AM UTC, but at that time the previous execution is still running. This scheduled execution is then skipped. The next execution of the indexer will not start until 11:00 AM UTC.

> [!NOTE]
> If an indexer is set to a certain schedule but repeatedly fails on the same document each time, the indexer will begin running on a less frequent interval (up to the maximum interval of at least once every 24 hours) until it successfully makes progress again. If you believe you have fixed whatever the underlying issue, you can [run the indexer manually](search-howto-run-reset-indexers.md), and if indexing succeeds, the indexer will return to its regular schedule.

## Next steps

For indexers that run on a schedule, you can monitor operations by retrieving status from the search service, or obtain detailed information by enabling resource logging.

+ [Monitor search indexer status](search-howto-monitor-indexers.md)
+ [Collect and analyze log data](monitor-azure-cognitive-search.md)
+ [Index large data sets](search-howto-large-index.md)
