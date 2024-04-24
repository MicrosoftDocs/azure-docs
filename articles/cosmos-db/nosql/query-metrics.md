---
title: SQL query metrics for Azure Cosmos DB for NoSQL
description: Learn about how to instrument and debug the SQL query performance of Azure Cosmos DB requests.
author: seesharprun
ms.author: sidandrews
ms.reviewer: jucocchi
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 1/5/2023
ms.devlang: csharp
ms.custom: devx-track-csharp
---
# Tuning query performance with Azure Cosmos DB
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

Azure Cosmos DB provides a [API for NoSQL for querying data](query/getting-started.md), without requiring schema or secondary indexes. This article provides the following information for developers:

* High-level details on how Azure Cosmos DB's SQL query execution works
* Tips and best practices for query performance
* Examples of how to utilize SQL query execution metrics to debug query performance

## About SQL query execution

In Azure Cosmos DB data is stored in containers, which can grow to any [storage size or request throughput](../partitioning-overview.md). Azure Cosmos DB seamlessly scales data across physical partitions under the covers to handle data growth or increases in provisioned throughput. You can issue SQL queries to any container using the REST API or one of the supported [SQL SDKs](sdk-dotnet-v3.md).

A brief overview of partitioning: you define a partition key like "city", which determines how data is split across physical partitions. Data belonging to a single partition key (for example, "city" == "Seattle") is stored within a physical partition, and a single physical partition can store data from multiple partition keys. When a partition reaches its storage limit, the service seamlessly splits the partition into two new partitions. Data is distributed evenly across the new partitions, keeping all data for a single partition key together. Since partitions are transient, the APIs use an abstraction of a partition key range, which denotes the ranges of partition key hashes. 

When you issue a query to Azure Cosmos DB, the SDK performs these logical steps:

* Parse the SQL query to determine the query execution plan. 
* If the query includes a filter against the partition key, like `SELECT * FROM c WHERE c.city = "Seattle"`, it's routed to a single partition. If the query doesn't have a filter on the partition key, then it's executed in all partitions and results from each partition are merged client side.
* The query is executed within each partition in series or parallel, based on client configuration. Within each partition, the query might make one or more round trips depending on the query complexity, configured page size, and provisioned throughput of the collection. Each execution returns the number of [request units](../request-units.md) consumed by query execution and query execution statistics. 
* The SDK performs a summarization of the query results across partitions. For example, if the query involves an ORDER BY across partitions, then results from individual partitions are merge-sorted to return results in globally sorted order. If the query is an aggregation like `COUNT`, the counts from individual partitions are summed to produce the overall count.

The SDKs provide various options for query execution. For example, in .NET these options are available in the [`QueryRequestOptions`](/dotnet/api/microsoft.azure.cosmos.queryrequestoptions) class. The following table describes these options and how they affect query execution time. 

| Option | Description |
| ------ | ----------- |
| `EnableScanInQuery` | Only applicable if indexing for the requested filter path is disabled. Must be set to true if you opted out of indexing and want to run queries using a full scan. | 
| `MaxItemCount` | The maximum number of items to return per round trip to the server. You can set it to -1 to let the server manage the number of items to return. |
| `MaxBufferedItemCount` | The maximum number of items that can be buffered client side during parallel query execution. A positive property value limits the number of buffered items to the set value. You can set it to less than 0 to let the system automatically decide the number of items to buffer. |
| `MaxConcurrency` | Gets or sets the number of concurrent operations run client side during parallel query execution. A positive property value limits the number of concurrent operations to the set value. You can set it to less than 0 to let the system automatically decide the number of concurrent operations to run. |
| `PopulateIndexMetrics` | Enables collection of [index metrics](./index-metrics.md) to understand how the query engine used existing indexes and how it could use potential new indexes. This option incurs overhead, so it should only be enabled when debugging slow queries. |
| `ResponseContinuationTokenLimitInKb` | You can limit the maximum size of the continuation token returned by the server. You might need to set this if your application host has limits on response header size, but it can increase the overall duration and RUs consumed for the query.  |

For example, here's a query on a container partitioned by `/city` using the .NET SDK:

```csharp
QueryDefinition query = new QueryDefinition("SELECT * FROM c WHERE c.city = 'Seattle'");
QueryRequestOptions options = new QueryRequestOptions()
{
    MaxItemCount = -1,
    MaxBufferedItemCount = -1,
    MaxConcurrency = -1,
    PopulateIndexMetrics = true
};
FeedIterator<dynamic> feedIterator = container.GetItemQueryIterator<dynamic>(query);

FeedResponse<dynamic> feedResponse = await feedIterator.ReadNextAsync();
```

Each query execution corresponds to a REST API `POST` with headers set for the query request options and the SQL query in the body. For details on the REST API request headers and options, see [Querying resources using the REST API](/rest/api/cosmos-db/querying-cosmosdb-resources-using-the-rest-api).

## Best practices for query performance

The following factors commonly have the biggest effect on Azure Cosmos DB query performance. We dig deeper into each of these factors in this article.

| Factor | Tip | 
| ------ | -----| 
| Provisioned throughput | Measure RU per query, and ensure that you have the required provisioned throughput for your queries. | 
| Partitioning and partition keys | Favor queries with the partition key value in the filter clause for low latency. |
| SDK and query options | Follow SDK best practices like direct connectivity, and tune client-side query execution options. |
| Network latency | Run your application in the same region as your Azure Cosmos DB account wherever possible to reduce latency. |
| Indexing policy | Ensure that you have the required indexing paths/policy for the query. |
| Query execution metrics | Analyze the query execution metrics to identify potential rewrites of query and data shapes.  |

### Provisioned throughput

In Azure Cosmos DB, you create containers of data, each with reserved throughput expressed in request units (RU) per-second. A read of a 1-KB document is one RU, and every operation (including queries) is normalized to a fixed number of RUs based on its complexity. For example, if you have 1000 RU/s provisioned for your container, and you have a query like `SELECT * FROM c WHERE c.city = 'Seattle'` that consumes 5 RUs, then you can execute (1000 RU/s) / (5 RU/query) = 200 of these queries per second. 

If you submit more than 200 queries/sec (or some other operations that saturate all provisioned RUs), the service starts rate-limiting incoming requests. The SDKs automatically handle rate-limiting by performing a backoff/retry, therefore you might notice higher latency for these queries. Increasing the provisioned throughput to the required value improves your query latency and throughput. 

To learn more about request units, see [Request units](../request-units.md).

### Partitioning and partition keys

With Azure Cosmos DB, the following scenarios for reading data are ordered from what is typically fastest/most efficient to the slowest/least efficient. 

* GET on a single partition key and item id, also known as a point read
* Query with a filter clause on a single partition key
* Query with an equality or range filter clause on any property
* Query without filters

Queries that need to be executed on all partitions have higher latency, and can consume higher RUs. Since each partition has automatic indexing against all properties, the query can be served efficiently from the index in this case. You can make queries that span partitions faster by using the parallelism options.

To learn more about partitioning and partition keys, see [Partitioning in Azure Cosmos DB](../partitioning-overview.md).

### SDK and query options

See [query performance tips](performance-tips-query-sdk.md) and [performance testing](performance-testing.md) for how to get the best client-side performance from Azure Cosmos DB using our SDKs.

### Network latency

See [Azure Cosmos DB global distribution](tutorial-global-distribution.md) for how to set up global distribution and connect to the closest region. Network latency has a significant effect on query performance when you need to make multiple round-trips or retrieve a large result set from the query. 

You can use [query execution metrics](#query-execution-metrics) to retrieve the server execution time of queries, allowing you to differentiate time spent in query execution from time spent in network transit.

### Indexing policy

See [configuring indexing policy](../index-policy.md) for indexing paths, kinds, and modes, and how they impact query execution. By default, Azure Cosmos DB applies automatic indexing to all data and uses range indexes for strings and numbers, which is effective for equality queries. For high performance insert scenarios, consider excluding paths to reduce the RU cost for each insert operation. 

You can use the [index metrics](./index-metrics.md) to identify which indexes are used for each query and if there are any missing indexes that would improve query performance.

## Query execution metrics

Detailed metrics are returned for each query execution in the [Diagnostics](./troubleshoot-dotnet-sdk.md#capture-diagnostics) for the request. These metrics describe where time is spent during query execution and enable advanced troubleshooting. 

Learn more about [getting the query metrics](./query-metrics-performance.md).

| Metric | Unit | Description | 
| ------ | -----| ----------- |
| `TotalTime` | milliseconds | Total query execution time |  
| `DocumentLoadTime` | milliseconds | Time spent loading documents  | 
| `DocumentWriteTime` | milliseconds | Time spent writing and serializing the output documents | 
| `IndexLookupTime` | milliseconds | Time spent in physical index layer | 
| `QueryPreparationTime` | milliseconds | Time spent in preparing query | 
| `RuntimeExecutionTime` | milliseconds | Total query runtime execution time | 
| `VMExecutionTime` | milliseconds | Time spent in query runtime executing the query | 
| `OutputDocumentCount` | count | Number of output documents in the result set | 
| `OutputDocumentSize` | count | Total size of outputted documents in bytes | 
| `RetrievedDocumentCount` | count | Total number of retrieved documents  | 
| `RetrievedDocumentSize` | bytes | Total size of retrieved documents in bytes  | 
| `IndexHitRatio` | ratio [0,1] | Ratio of number of documents matched by the filter to the number of documents loaded  | 

The client SDKs can internally make multiple query requests to serve the query within each partition. The client makes more than one call per-partition if the total results exceed the max item count request option, if the query exceeds the provisioned throughput for the partition, if the query payload reaches the maximum size per page, or if the query reaches the system allocated timeout limit. Each partial query execution returns query metrics for that page. 

Here are some sample queries, and how to interpret some of the metrics returned from query execution: 

| Query | Sample Metric | Description | 
| ------ | -----| ----------- |
| `SELECT TOP 100 * FROM c` | `"RetrievedDocumentCount": 101` | The number of documents retrieved is 100+1 to match the TOP clause. Query time is mostly spent in `WriteOutputTime` and `DocumentLoadTime` since it's a scan. | 
| `SELECT TOP 500 * FROM c` | `"RetrievedDocumentCount": 501` | RetrievedDocumentCount is now higher (500+1 to match the TOP clause). | 
| `SELECT * FROM c WHERE c.N = 55` | `"IndexLookupTime": "00:00:00.0009500"` | About 0.9 ms is spent in IndexLookupTime for a key lookup, because it's an index lookup on `/N/?`. | 
| `SELECT * FROM c WHERE c.N > 55` | `"IndexLookupTime": "00:00:00.0017700"` | Slightly more time (1.7 ms) spent in IndexLookupTime over a range scan, because it's an index lookup on `/N/?`. | 
| `SELECT TOP 500 c.N FROM c` | `"IndexLookupTime": "00:00:00.0017700"` | Same time spent on `DocumentLoadTime` as previous queries, but lower `DocumentWriteTime` because we're projecting only one property. | 
| `SELECT TOP 500 udf.toPercent(c.N) FROM c` | `"RuntimeExecutionTime": "00:00:00.2136500"` | About 213 ms is spent in `RuntimeExecutionTime` executing the UDF on each value of `c.N`. |
| `SELECT TOP 500 c.Name FROM c WHERE STARTSWITH(c.Name, 'Den')` | `"IndexLookupTime": "00:00:00.0006400", "RuntimeExecutionTime": "00:00:00.0074100"` | About 0.6 ms is spent in `IndexLookupTime` on `/Name/?`. Most of the query execution time (~7 ms) in `RuntimeExecutionTime`. |
| `SELECT TOP 500 c.Name FROM c WHERE STARTSWITH(LOWER(c.Name), 'den')` | `"IndexLookupTime": "00:00:00", "RetrievedDocumentCount": 2491,  "OutputDocumentCount": 500` | Query is performed as a scan because it uses `LOWER`, and 500 out of 2491 retrieved documents are returned. |

## Next steps
* To learn about the supported SQL query operators and keywords, see [SQL query](query/getting-started.md). 
* To learn about request units, see [request units](../request-units.md).
* To learn about indexing policy, see [indexing policy](../index-policy.md)
