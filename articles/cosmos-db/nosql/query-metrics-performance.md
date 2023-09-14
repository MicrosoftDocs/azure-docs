---
title: Get SQL query performance & execution metrics
description: Learn how to retrieve SQL query execution metrics and profile SQL query performance of Azure Cosmos DB requests.
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 05/17/2019
ms.author: girobins
ms.custom: devx-track-csharp, ignite-2022, devx-track-dotnet
---
# Get SQL query execution metrics and analyze query performance using .NET SDK
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article presents how to profile SQL query performance on Azure Cosmos DB. This profiling can be done using `ServerSideCumulativeMetrics` retrieved from the .NET SDK and is detailed here. [ServerSideCumulativeMetrics](/dotnet/api/microsoft.azure.cosmos.serversidemetrics) is a strongly typed object with information about the backend query execution. These metrics are documented in more detail in the [Tune Query Performance](./query-metrics.md) article.

## Get query metrics
The following code sample shows how to retrieve metrics from a [FeedResponse](/dotnet/api/microsoft.azure.cosmos.feedresponse):

```csharp
// Initialize the Collection
Container collection = null;

QueryDefinition query = new QueryDefinition("SELECT TOP 5 * FROM c");
FeedIterator<Document> feedIterator = this.Container.GetItemQueryIterator<Document>(query);

while (feedIterator.HasMoreResults)
{
    // Execute one continuation of the query
    FeedResponse<Document> feedResponse = await feedIterator.ReadNextAsync();

    // Retrieve the ServerSideCumulativeMetrics object from the FeedResponse
    ServerSideCumulativeMetrics metrics = feedResponse.Diagnostics.GetQueryMetrics();
    
    // At this point you have the CumulativeMetrics, which are the metrics aggregated over all partitions
    ServerSideMetrics cumulativeMetrics = metrics.CumulativeMetrics;

    // Or you can look at the per-partition metrics
    List<PartitionedServerSideMetrics> partitionedMetrics = metrics.PartitionedMetrics;
}
```

## CumulativeMetrics vs PartitionedMetrics


`feedResponse.CumulativeMetrics` returns a [ServerSideMetrics](/dotnet/api/microsoft.azure.cosmos.serversidemetrics) object which contains the query metrics aggregated over all partitions for the single round trip.

`feedResponse.CumulativeMetrics` returns a list of [PartitionedServerSideMetrics](/dotnet/api/microsoft.azure.cosmos.partitionedserversidemetrics) objects, which have the per-partition metrics for the round trip. These, when accumulated over all round trips, allow you to see if a specific partition is causing performance issues when compared to others.

```csharp
List<PartitionedServerSideMetrics> partitionedMetrics = metrics.PartitionedMetrics;

foreach (PartitionedServerSideMetrics perPartitionMetrics in partitionedMetrics)
{
    // partitions can be identified by their FeedRange
    string feedRange = perPartitionMetrics.FeedRange;

    // partitions can also be identified by their partition key range id. Note that this value will be null when using gateway mode.
    string feedRange = perPartitionMetrics.PartitionKeyRangeId;
}
```

## LINQ queries

You can also get the `FeedResponse` from a LINQ Query using the `ToFeedIterator()` method:

```csharp
FeedIterator feedIterator = container.GetItemLinqQueryable<Document>()
    .Take(1)
    .Where(document => document.Id == "42")
    .OrderBy(document => document.Timestamp)
    .ToFeedIterator();

while (feedIterator.HasMoreResults)
{
    FeedResponse<Document> feedResponse = await feedIterator.ReadNextAsync();
    ServerSideCumulativeMetrics metrics = feedResponse.Diagnostics.GetQueryMetrics();
}
```

## Expensive queries

You can capture the request units consumed by each query to investigate expensive queries or queries that consume high throughput. You can get the request charge by using the [RequestCharge](/dotnet/api/microsoft.azure.documents.client.feedresponse-1.requestcharge) property in `FeedResponse`. To learn more about how to get the request charge using the Azure portal and different SDKs, see [find the request unit charge](find-request-unit-charge.md) article.

```csharp
QueryDefinition query = new QueryDefinition("SELECT * FROM c");
FeedIterator<Document> feedIterator = this.Container.GetItemQueryIterator<Document>(query);

while (feedIterator.HasMoreResults)
{
    // Execute one continuation of the query
    FeedResponse<Document> feedResponse = await feedIterator.ReadNextAsync();
    double requestCharge = feedResponse.RequestCharge;
    
    // Log the RequestCharge how ever you want.
    DoSomeLogging(requestCharge);
}
```

## Get the query execution time

When calculating the time required to execute a client-side query, make sure that you only include the time to call the `ExecuteNextAsync` method and not other parts of your code base. Just these calls help you in calculating how long the query execution took as shown in the following example:

```csharp
QueryDefinition query = new QueryDefinition("SELECT * FROM c");
FeedIterator<Document> feedIterator = this.Container.GetItemQueryIterator<Document>(query);

Stopwatch queryExecutionTimeEndToEndTotal = new Stopwatch();
while (feedIterator.HasMoreResults)
{
    // Execute one continuation of the query
    queryExecutionTimeEndToEndTotal.Start();
    FeedResponse<Document> feedResponse = await feedIterator.ReadNextAsync();
    queryExecutionTimeEndToEndTotal.Stop();
}

// Log the elapsed time
DoSomeLogging(queryExecutionTimeEndToEndTotal.Elapsed);
```

## Scan queries (commonly slow and expensive)

A scan query refers to a query that wasn't served by the index, due to which, many documents are loaded before returning the result set.

Below is an example of a scan query:

```sql
SELECT VALUE c.description 
FROM   c 
WHERE UPPER(c.description) = "BABYFOOD, DESSERT, FRUIT DESSERT, WITHOUT ASCORBIC ACID, JUNIOR"
```

This query's filter uses the system function UPPER, which isn't served from the index. Executing this query against a large collection produced the following query metrics for the first continuation:

```
CumulativeServerSideMetrics

Retrieved Document Count                 :          60,951
Retrieved Document Size                  :     399,998,938 bytes
Output Document Count                    :               7
Output Document Size                     :             510 bytes
Index Utilization                        :            0.00 %
Total Query Execution Time               :        4,500.34 milliseconds
  Query Preparation Times
    Query Compilation Time               :            0.09 milliseconds
    Logical Plan Build Time              :            0.05 milliseconds
    Physical Plan Build Time             :            0.04 milliseconds
    Query Optimization Time              :            0.01 milliseconds
  Index Lookup Time                      :            0.01 milliseconds
  Document Load Time                     :        4,177.66 milliseconds
  Runtime Execution Times
    Query Engine Times                   :          322.16 milliseconds
    System Function Execution Time       :           85.74 milliseconds
    User-defined Function Execution Time :            0.00 milliseconds
  Document Write Time                    :            0.01 milliseconds
```

Note the following values from the query metrics output:

```
Retrieved Document Count                 :          60,951
Retrieved Document Size                  :     399,998,938 bytes
```

This query loaded 60,951 documents, which totaled 399,998,938 bytes. Loading this many bytes results in high cost or request unit charge. It also takes a long time to execute the query, which is clear with the total time spent property:

```
Total Query Execution Time               :        4,500.34 milliseconds
```

Meaning that the query took 4.5 seconds to execute (and this was only one continuation).

To optimize this example query, avoid the use of UPPER in the filter. Instead, when documents are created or updated, the `c.description` values must be inserted in all uppercase characters. The query then becomes: 

```sql
SELECT VALUE c.description 
FROM   c 
WHERE c.description = "BABYFOOD, DESSERT, FRUIT DESSERT, WITHOUT ASCORBIC ACID, JUNIOR"
```

This query is now able to be served from the index.

To learn more about tuning query performance, see the [Tune Query Performance](./query-metrics.md) article.

## <a id="References"></a>References

- [Azure Cosmos DB SQL specification](query/getting-started.md)
- [ANSI SQL 2011](https://www.iso.org/iso/iso_catalogue/catalogue_tc/catalogue_detail.htm?csnumber=53681)
- [JSON](https://json.org/)
- [LINQ](/previous-versions/dotnet/articles/bb308959(v=msdn.10)) 

## Next steps

- [Tune query performance](query-metrics.md)
- [Indexing overview](../index-overview.md)
- [Azure Cosmos DB .NET samples](https://github.com/Azure/azure-cosmos-dotnet-v3)
