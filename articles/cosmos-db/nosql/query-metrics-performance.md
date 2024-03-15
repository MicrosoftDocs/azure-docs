---
title: Get SQL query performance & execution metrics
description: Learn how to retrieve SQL query execution metrics and profile SQL query performance of Azure Cosmos DB requests.
author: ginamr
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 1/5/2023
ms.author: girobins
ms.custom: devx-track-csharp, devx-track-dotnet
---
# Get SQL query execution metrics and analyze query performance using .NET SDK
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article presents how to profile SQL query performance on Azure Cosmos DB using [ServerSideCumulativeMetrics](/dotnet/api/microsoft.azure.cosmos.serversidecumulativemetrics) retrieved from the .NET SDK. `ServerSideCumulativeMetrics` is a strongly typed object with information about the backend query execution. It contains cumulative metrics that are aggregated across all physical partitions for the request, a list of metrics for each physical partition, and the total request charge. These metrics are documented in more detail in the [Tune Query Performance](./query-metrics.md#query-execution-metrics) article.

## Get query metrics

Query metrics are available as a strongly typed object in the .NET SDK beginning in [version 3.36.0](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.36.0). Prior to this version, or if you're using a different SDK language, you can retrieve query metrics by parsing the `Diagnostics`. The following code sample shows how to retrieve `ServerSideCumulativeMetrics` from the `Diagnostics` in a [FeedResponse](/dotnet/api/microsoft.azure.cosmos.feedresponse-1):

```csharp
CosmosClient client = new CosmosClient(myCosmosEndpoint, myCosmosKey);
Container container = client.GetDatabase(myDatabaseName).GetContainer(myContainerName);

QueryDefinition query = new QueryDefinition("SELECT TOP 5 * FROM c");
FeedIterator<MyClass> feedIterator = container.GetItemQueryIterator<MyClass>(query);

while (feedIterator.HasMoreResults)
{
    // Execute one continuation of the query
    FeedResponse<MyClass> feedResponse = await feedIterator.ReadNextAsync();

    // Retrieve the ServerSideCumulativeMetrics object from the FeedResponse
    ServerSideCumulativeMetrics metrics = feedResponse.Diagnostics.GetQueryMetrics();
}
```

You can also get query metrics from the `FeedResponse` of a LINQ query using the `ToFeedIterator()` method:

```csharp
FeedIterator<MyClass> feedIterator = container.GetItemLinqQueryable<MyClass>()
    .Take(5)
    .ToFeedIterator();

while (feedIterator.HasMoreResults)
{
    FeedResponse<MyClass> feedResponse = await feedIterator.ReadNextAsync();
    ServerSideCumulativeMetrics metrics = feedResponse.Diagnostics.GetQueryMetrics();
}
```

### Cumulative Metrics

`ServerSideCumulativeMetrics` contains a `CumulativeMetrics` property that represents the query metrics aggregated over all partitions for the single round trip.

```csharp
// Retrieve the ServerSideCumulativeMetrics object from the FeedResponse
ServerSideCumulativeMetrics metrics = feedResponse.Diagnostics.GetQueryMetrics();

// CumulativeMetrics is the metrics for this continuation aggregated over all partitions
ServerSideMetrics cumulativeMetrics = metrics.CumulativeMetrics;
```

You can also aggregate these metrics across all round trips for the query. The following is an example of how to aggregate query execution time across all round trips for a given query using LINQ:

```csharp
QueryDefinition query = new QueryDefinition("SELECT TOP 5 * FROM c");
FeedIterator<MyClass> feedIterator = container.GetItemQueryIterator<MyClass>(query);

List<ServerSideCumulativeMetrics> metrics = new List<ServerSideCumulativeMetrics>();
TimeSpan cumulativeTime;
while (feedIterator.HasMoreResults)
{
    // Execute one continuation of the query
    FeedResponse<MyClass> feedResponse = await feedIterator.ReadNextAsync();

    // Store the ServerSideCumulativeMetrics object to aggregate values after all round trips
    metrics.Add(response.Diagnostics.GetQueryMetrics());
}

// Aggregate values across trips for metrics of interest
TimeSpan totalTripsExecutionTime = metrics.Aggregate(TimeSpan.Zero, (currentSum, next) => currentSum + next.CumulativeMetrics.TotalTime);
DoSomeLogging(totalTripsExecutionTime);
```

### Partitioned Metrics

`ServerSideCumulativeMetrics` contains a `PartitionedMetrics` property that is a list of per-partition metrics for the round trip. If multiple physical partitions are reached in a single round trip, then metrics for each of them appear in the list. Partitioned metrics are represented as [ServerSidePartitionedMetrics](/dotnet/api/microsoft.azure.cosmos.serversidepartitionedmetrics) with a unique identifier for each physical partition and request charge for that partition. 

```csharp
// Retrieve the ServerSideCumulativeMetrics object from the FeedResponse
ServerSideCumulativeMetrics metrics = feedResponse.Diagnostics.GetQueryMetrics();

// PartitionedMetrics is a list of per-partition metrics for this continuation
List<ServerSidePartitionedMetrics> partitionedMetrics = metrics.PartitionedMetrics;
```

When accumulated over all round trips, per partition metrics allow you to see if a specific partition is causing performance issues when compared to others. The following is an example of how to group partition metrics for each trip using LINQ:

```csharp
QueryDefinition query = new QueryDefinition("SELECT TOP 5 * FROM c");
FeedIterator<MyClass> feedIterator = container.GetItemQueryIterator<MyClass>(query);

List<ServerSideCumulativeMetrics> metrics = new List<ServerSideCumulativeMetrics>();
while (feedIterator.HasMoreResults)
{
    // Execute one continuation of the query
    FeedResponse<MyClass> feedResponse = await feedIterator.ReadNextAsync();

    // Store the ServerSideCumulativeMetrics object to aggregate values after all round trips
    metrics.Add(response.Diagnostics.GetQueryMetrics());
}

// Group metrics by partition key range id
var groupedPartitionMetrics = metrics.SelectMany(m => m.PartitionedMetrics).GroupBy(p => p.PartitionKeyRangeId);
foreach(var partitionGroup in groupedPartitionMetrics)
{
    foreach(var tripMetrics in partitionGroup)
    {
        DoSomethingWithMetrics();
    }
}
```

## Get the query request charge

You can capture the request units consumed by each query to investigate expensive queries or queries that consume high throughput. You can get the total request charge using the `TotalRequestCharge` property in `ServerSideCumulativeMetrics` or you can look at the request charge from each partition using the `RequestCharge` property for each `ServerSidePartitionedMetrics` returned.

The total request charge is also available using the `RequestCharge` property in `FeedResponse`. To learn more about how to get the request charge using the Azure portal and different SDKs, see [find the request unit charge](find-request-unit-charge.md) article.

```csharp
QueryDefinition query = new QueryDefinition("SELECT TOP 5 * FROM c");
FeedIterator<MyClass> feedIterator = container.GetItemQueryIterator<MyClass>(query);

while (feedIterator.HasMoreResults)
{
    // Execute one continuation of the query
    FeedResponse<MyClass> feedResponse = await feedIterator.ReadNextAsync();
    double requestCharge = feedResponse.RequestCharge;

    // Log the RequestCharge how ever you want.
    DoSomeLogging(requestCharge);
}
```

## Get the query execution time

You can capture query execution time for each trip from the query metrics. When looking at request latency, it's important to differentiate query execution time from other sources of latency, such as network transit time. The following example shows how to get cumulative query execution time for each round trip:

```csharp
QueryDefinition query = new QueryDefinition("SELECT TOP 5 * FROM c");
FeedIterator<MyClass> feedIterator = container.GetItemQueryIterator<MyClass>(query);

TimeSpan cumulativeTime;
while (feedIterator.HasMoreResults)
{
    // Execute one continuation of the query
    FeedResponse<MyClass> feedResponse = await feedIterator.ReadNextAsync();
    ServerSideCumulativeMetrics metrics = response.Diagnostics.GetQueryMetrics();
    cumulativeTime = metrics.CumulativeMetrics.TotalTime;
}

// Log the elapsed time
DoSomeLogging(cumulativeTime);
```

## Get the index utilization

Looking at the index utilization can help you debug slow queries. Queries that can't use the index result in a full scan of all documents in a container before returning the result set.

Here's an example of a scan query:

```sql
SELECT VALUE c.description 
FROM   c 
WHERE UPPER(c.description) = "BABYFOOD, DESSERT, FRUIT DESSERT, WITHOUT ASCORBIC ACID, JUNIOR"
```

This query's filter uses the system function UPPER, which isn't served from the index. Executing this query against a large collection produced the following query metrics for the first continuation:

```
QueryMetrics

Retrieved Document Count                 :          60,951
Retrieved Document Size                  :     399,998,938 bytes
Output Document Count                    :               7
Output Document Size                     :             510 bytes
Index Utilization                        :            0.00 %
Total Query Execution Time               :        4,500.34 milliseconds
Query Preparation Time                   :             0.2 milliseconds
Index Lookup Time                        :            0.01 milliseconds
Document Load Time                       :        4,177.66 milliseconds
Runtime Execution Time                   :           407.9 milliseconds
Document Write Time                      :            0.01 milliseconds
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

This query is now able to be served from the index. Alternatively, you can use [computed properties](query/computed-properties.md) to index the results of system functions or complex calculations that would otherwise result in a full scan.

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
