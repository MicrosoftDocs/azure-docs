---
title: SQL query metrics for Azure Cosmos DB SQL API
description: Learn about how to instrument and debug the SQL query performance of Azure Cosmos DB requests.
author: SnehaGunda
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 05/23/2019
ms.author: sngun

---
# Tuning query performance with Azure Cosmos DB

Azure Cosmos DB provides a [SQL API for querying data](how-to-sql-query.md), without requiring schema or secondary indexes. This article provides the following information for developers:

* High-level details on how Azure Cosmos DB's SQL query execution works
* Details on query request and response headers, and client SDK options
* Tips and best practices for query performance
* Examples of how to utilize SQL execution statistics to debug query performance

## About SQL query execution

In Azure Cosmos DB, you store data in containers, which can grow to any [storage size or request throughput](partition-data.md). Azure Cosmos DB seamlessly scales data across physical partitions under the covers to handle data growth or increase in provisioned throughput. You can issue SQL queries to any container using the REST API or one of the supported [SQL SDKs](sql-api-sdk-dotnet.md).

A brief overview of partitioning: you define a partition key like "city", which determines how data is split across physical partitions. Data belonging to a single partition key (for example, "city" == "Seattle") is stored within a physical partition, but typically a single physical partition has multiple partition keys. When a partition reaches its storage size, the service seamlessly splits the partition into two new partitions, and divides the partition key evenly across these partitions. Since partitions are transient, the APIs use an abstraction of a "partition key range", which denotes the ranges of partition key hashes. 

When you issue a query to Azure Cosmos DB, the SDK performs these logical steps:

* Parse the SQL query to determine the query execution plan. 
* If the query includes a filter against the partition key, like `SELECT * FROM c WHERE c.city = "Seattle"`, it is routed to a single partition. If the query does not have a filter on partition key, then it is executed in all partitions, and results are merged client side.
* The query is executed within each partition in series or parallel, based on client configuration. Within each partition, the query might make one or more round trips depending on the query complexity, configured page size, and provisioned throughput of the collection. Each execution returns the number of [request units](request-units.md) consumed by query execution, and optionally, query execution statistics. 
* The SDK performs a summarization of the query results across partitions. For example, if the query involves an ORDER BY across partitions, then results from individual partitions are merge-sorted to return results in globally sorted order. If the query is an aggregation like `COUNT`, the counts from individual partitions are summed to produce the overall count.

The SDKs provide various options for query execution. For example, in .NET these options are available in the `FeedOptions` class. The following table describes these options and how they impact query execution time. 

| Option | Description |
| ------ | ----------- |
| `EnableCrossPartitionQuery` | Must be set to true for any query that requires to be executed across more than one partition. This is an explicit flag to enable you to make conscious performance tradeoffs during development time. |
| `EnableScanInQuery` | Must be set to true if you have opted out of indexing, but want to run the query via a scan anyway. Only applicable if indexing for the requested filter path is disabled. | 
| `MaxItemCount` | The maximum number of items to return per round trip to the server. By setting to -1, you can let the server manage the number of items. Or, you can lower this value to retrieve only a small number of items per round trip. 
| `MaxBufferedItemCount` | This is a client-side option, and used to limit the memory consumption when performing cross-partition ORDER BY. A higher value helps reduce the latency of cross-partition sorting. |
| `MaxDegreeOfParallelism` | Gets or sets the number of concurrent operations run client side during parallel query execution in the Azure Cosmos DB database service. A positive property value limits the number of concurrent operations to the set value. If it is set to less than 0, the system automatically decides the number of concurrent operations to run. |
| `PopulateQueryMetrics` | Enables detailed logging of statistics of time spent in various phases of query execution like compilation time, index loop time, and document load time. You can share output from query statistics with Azure Support to diagnose query performance issues. |
| `RequestContinuation` | You can resume query execution by passing in the opaque continuation token returned by any query. The continuation token encapsulates all state required for query execution. |
| `ResponseContinuationTokenLimitInKb` | You can limit the maximum size of the continuation token returned by the server. You might need to set this if your application host has limits on response header size. Setting this may increase the overall duration and RUs consumed for the query.  |

For example, let's take an example query on partition key requested on a collection with `/city` as the partition key and provisioned with 100,000 RU/s of throughput. You request this query using `CreateDocumentQuery<T>` in .NET like the following:

```cs
IDocumentQuery<dynamic> query = client.CreateDocumentQuery(
    UriFactory.CreateDocumentCollectionUri(DatabaseName, CollectionName), 
    "SELECT * FROM c WHERE c.city = 'Seattle'", 
    new FeedOptions 
    { 
        PopulateQueryMetrics = true, 
        MaxItemCount = -1, 
        MaxDegreeOfParallelism = -1, 
        EnableCrossPartitionQuery = true 
    }).AsDocumentQuery();

FeedResponse<dynamic> result = await query.ExecuteNextAsync();
```

The SDK snippet shown above, corresponds to the following REST API request:

```
POST https://arramacquerymetrics-westus.documents.azure.com/dbs/db/colls/sample/docs HTTP/1.1
x-ms-continuation: 
x-ms-documentdb-isquery: True
x-ms-max-item-count: -1
x-ms-documentdb-query-enablecrosspartition: True
x-ms-documentdb-query-parallelizecrosspartitionquery: True
x-ms-documentdb-query-iscontinuationexpected: True
x-ms-documentdb-populatequerymetrics: True
x-ms-date: Tue, 27 Jun 2017 21:52:18 GMT
authorization: type%3dmaster%26ver%3d1.0%26sig%3drp1Hi83Y8aVV5V6LzZ6xhtQVXRAMz0WNMnUuvriUv%2b4%3d
x-ms-session-token: 7:8,6:2008,5:8,4:2008,3:8,2:2008,1:8,0:8,9:8,8:4008
Cache-Control: no-cache
x-ms-consistency-level: Session
User-Agent: documentdb-dotnet-sdk/1.14.1 Host/32-bit MicrosoftWindowsNT/6.2.9200.0
x-ms-version: 2017-02-22
Accept: application/json
Content-Type: application/query+json
Host: arramacquerymetrics-westus.documents.azure.com
Content-Length: 52
Expect: 100-continue

{"query":"SELECT * FROM c WHERE c.city = 'Seattle'"}
```

Each query execution page corresponds to a REST API `POST` with the `Accept: application/query+json` header, and the SQL query in the body. Each query makes one or more round trips to the server with the `x-ms-continuation` token echoed between the client and server to resume execution. The configuration options in FeedOptions are passed to the server in the form of request headers. For example, `MaxItemCount` corresponds to `x-ms-max-item-count`. 

The request returns the following (truncated for readability) response:

```
HTTP/1.1 200 Ok
Cache-Control: no-store, no-cache
Pragma: no-cache
Transfer-Encoding: chunked
Content-Type: application/json
Server: Microsoft-HTTPAPI/2.0
Strict-Transport-Security: max-age=31536000
x-ms-last-state-change-utc: Tue, 27 Jun 2017 21:01:57.561 GMT
x-ms-resource-quota: documentSize=10240;documentsSize=10485760;documentsCount=-1;collectionSize=10485760;
x-ms-resource-usage: documentSize=1;documentsSize=884;documentsCount=2000;collectionSize=1408;
x-ms-item-count: 2000
x-ms-schemaversion: 1.3
x-ms-alt-content-path: dbs/db/colls/sample
x-ms-content-path: +9kEANVq0wA=
x-ms-xp-role: 1
x-ms-documentdb-query-metrics: totalExecutionTimeInMs=33.67;queryCompileTimeInMs=0.06;queryLogicalPlanBuildTimeInMs=0.02;queryPhysicalPlanBuildTimeInMs=0.10;queryOptimizationTimeInMs=0.00;VMExecutionTimeInMs=32.56;indexLookupTimeInMs=0.36;documentLoadTimeInMs=9.58;systemFunctionExecuteTimeInMs=0.00;userFunctionExecuteTimeInMs=0.00;retrievedDocumentCount=2000;retrievedDocumentSize=1125600;outputDocumentCount=2000;writeOutputTimeInMs=18.10;indexUtilizationRatio=1.00
x-ms-request-charge: 604.42
x-ms-serviceversion: version=1.14.34.4
x-ms-activity-id: 0df8b5f6-83b9-4493-abda-cce6d0f91486
x-ms-session-token: 2:2008
x-ms-gatewayversion: version=1.14.33.2
Date: Tue, 27 Jun 2017 21:59:49 GMT
```

The key response headers returned from the query include the following:

| Option | Description |
| ------ | ----------- |
| `x-ms-item-count` | The number of items returned in the response. This is dependent on the supplied `x-ms-max-item-count`, the number of items that can be fit within the maximum response payload size, the provisioned throughput, and query execution time. |  
| `x-ms-continuation:` | The continuation token to resume execution of the query, if additional results are available. | 
| `x-ms-documentdb-query-metrics` | The query statistics for the execution. This is a delimited string containing statistics of time spent in the various phases of query execution. Returned if `x-ms-documentdb-populatequerymetrics` is set to `True`. | 
| `x-ms-request-charge` | The number of [request units](request-units.md) consumed by the query. | 

For details on the REST API request headers and options, see [Querying resources using the REST API](https://docs.microsoft.com/rest/api/cosmos-db/querying-cosmosdb-resources-using-the-rest-api).

## Best practices for query performance
The following are the most common factors that impact Azure Cosmos DB query performance. We dig deeper into each of these topics in this article.

| Factor | Tip | 
| ------ | -----| 
| Provisioned throughput | Measure RU per query, and ensure that you have the required provisioned throughput for your queries. | 
| Partitioning and partition keys | Favor queries with the partition key value in the filter clause for low latency. |
| SDK and query options | Follow SDK best practices like direct connectivity, and tune client-side query execution options. |
| Network latency | Account for network overhead in measurement, and use multi-homing APIs to read from the nearest region. |
| Indexing Policy | Ensure that you have the required indexing paths/policy for the query. |
| Query execution metrics | Analyze the query execution metrics to identify potential rewrites of query and data shapes.  |

### Provisioned throughput
In Cosmos DB, you create containers of data, each with reserved throughput expressed in request units (RU) per-second. A read of a 1-KB document is 1 RU, and every operation (including queries) is normalized to a fixed number of RUs based on its complexity. For example, if you have 1000 RU/s provisioned for your container, and you have a query like `SELECT * FROM c WHERE c.city = 'Seattle'` that consumes 5 RUs, then you can perform (1000 RU/s) / (5 RU/query) = 200 query/s such queries per second. 

If you submit more than 200 queries/sec, the service starts rate-limiting incoming requests above 200/s. The SDKs automatically handle this case by performing a backoff/retry, therefore you might notice a higher latency for these queries. Increasing the provisioned throughput to the required value improves your query latency and throughput. 

To learn more about request units, see [Request units](request-units.md).

### Partitioning and partition keys
With Azure Cosmos DB, typically queries perform in the following order from fastest/most efficient to slower/less efficient. 

* GET on a single partition key and item key
* Query with a filter clause on a single partition key
* Query without an equality or range filter clause on any property
* Query without filters

Queries that need to consult all partitions need higher latency, and can consume higher RUs. Since each partition has automatic indexing against all properties, the query can be served efficiently from the index in this case. You can make queries that span partitions faster by using the parallelism options.

To learn more about partitioning and partition keys, see [Partitioning in Azure Cosmos DB](partition-data.md).

### SDK and query options
See [Performance Tips](performance-tips.md) and [Performance testing](performance-testing.md) for how to get the best client-side performance from Azure Cosmos DB. This includes using the latest SDKs, configuring platform-specific configurations like default number of connections, frequency of garbage collection, and using lightweight connectivity options like Direct/TCP. 


#### Max Item Count
For queries, the value of `MaxItemCount` can have a significant impact on end-to-end query time. Each round trip to the server will return no more than the number of items in `MaxItemCount` (Default of 100 items). Setting this to a higher value (-1 is maximum, and recommended) will improve your query duration overall by limiting the number of round trips between server and client, especially for queries with large result sets.

```cs
IDocumentQuery<dynamic> query = client.CreateDocumentQuery(
    UriFactory.CreateDocumentCollectionUri(DatabaseName, CollectionName), 
    "SELECT * FROM c WHERE c.city = 'Seattle'", 
    new FeedOptions 
    { 
        MaxItemCount = -1, 
    }).AsDocumentQuery();
```

#### Max Degree of Parallelism
For queries, tune the `MaxDegreeOfParallelism` to identify the best configurations for your application, especially if you perform cross-partition queries (without a filter on the partition-key value). `MaxDegreeOfParallelism`  controls the maximum number of parallel tasks, i.e., the maximum of partitions to be visited in parallel. 

```cs
IDocumentQuery<dynamic> query = client.CreateDocumentQuery(
    UriFactory.CreateDocumentCollectionUri(DatabaseName, CollectionName), 
    "SELECT * FROM c WHERE c.city = 'Seattle'", 
    new FeedOptions 
    { 
        MaxDegreeOfParallelism = -1, 
        EnableCrossPartitionQuery = true 
    }).AsDocumentQuery();
```

Let’s assume that
* D = Default Maximum number of parallel tasks (= total number of processor in the client machine)
* P = User-specified maximum number of parallel tasks
* N = Number of partitions that needs  to be visited for answering a query

Following are implications of how the parallel queries would behave for different values of P.
* (P == 0) => Serial Mode
* (P == 1) => Maximum of one task
* (P > 1) => Min (P, N) parallel tasks 
* (P < 1) => Min (N, D) parallel tasks

For SDK release notes, and details on implemented classes and methods see [SQL SDKs](sql-api-sdk-dotnet.md)

### Network latency
See [Azure Cosmos DB global distribution](tutorial-global-distribution-sql-api.md) for how to set up global distribution, and connect to the closest region. Network latency has a significant impact on query performance when you need to make multiple round-trips or retrieve a large result set from the query. 

The section on query execution metrics explains how to retrieve the server execution time of queries ( `totalExecutionTimeInMs`), so that you can differentiate between time spent in query execution and time spent in network transit.

### Indexing policy
See [Configuring indexing policy](index-policy.md) for indexing paths, kinds, and modes, and how they impact query execution. By default, the indexing policy uses Hash indexing for strings, which is effective for equality queries, but not for range queries/order by queries. If you need range queries for strings, we recommend specifying the Range index type for all strings. 

By default, Azure Cosmos DB will apply automatic indexing to all data. For high performance insert scenarios, consider excluding paths as this will reduce the RU cost for each insert operation. 

## Query execution metrics
You can obtain detailed metrics on query execution by passing in the optional `x-ms-documentdb-populatequerymetrics` header (`FeedOptions.PopulateQueryMetrics` in the .NET SDK). The value returned in `x-ms-documentdb-query-metrics` has the following key-value pairs meant for advanced troubleshooting of query execution. 

```cs
IDocumentQuery<dynamic> query = client.CreateDocumentQuery(
    UriFactory.CreateDocumentCollectionUri(DatabaseName, CollectionName), 
    "SELECT * FROM c WHERE c.city = 'Seattle'", 
    new FeedOptions 
    { 
        PopulateQueryMetrics = true, 
    }).AsDocumentQuery();

FeedResponse<dynamic> result = await query.ExecuteNextAsync();

// Returns metrics by partition key range Id
IReadOnlyDictionary<string, QueryMetrics> metrics = result.QueryMetrics;

```

| Metric | Unit | Description | 
| ------ | -----| ----------- |
| `totalExecutionTimeInMs` | milliseconds | Query execution time | 
| `queryCompileTimeInMs` | milliseconds | Query compile time  | 
| `queryLogicalPlanBuildTimeInMs` | milliseconds | Time to build logical query plan | 
| `queryPhysicalPlanBuildTimeInMs` | milliseconds | Time to build physical query plan | 
| `queryOptimizationTimeInMs` | milliseconds | Time spent in optimizing query | 
| `VMExecutionTimeInMs` | milliseconds | Time spent in query runtime | 
| `indexLookupTimeInMs` | milliseconds | Time spent in physical index layer | 
| `documentLoadTimeInMs` | milliseconds | Time spent in loading documents  | 
| `systemFunctionExecuteTimeInMs` | milliseconds | Total time spent executing system (built-in) functions in milliseconds  | 
| `userFunctionExecuteTimeInMs` | milliseconds | Total time spent executing user-defined functions in milliseconds | 
| `retrievedDocumentCount` | count | Total number of retrieved documents  | 
| `retrievedDocumentSize` | bytes | Total size of retrieved documents in bytes  | 
| `outputDocumentCount` | count | Number of output documents | 
| `writeOutputTimeInMs` | milliseconds | Query execution time in milliseconds | 
| `indexUtilizationRatio` | ratio (<=1) | Ratio of number of documents matched by the filter to the number of documents loaded  | 

The client SDKs may internally make multiple query operations to serve the query within each partition. The client makes more than one call per-partition if the total results exceed `x-ms-max-item-count`, if the query exceeds the provisioned throughput for the partition, or if the query payload reaches the maximum size per page, or if the query reaches the system allocated timeout limit. Each partial query execution returns a `x-ms-documentdb-query-metrics` for that page. 

Here are some sample queries, and how to interpret some of the metrics returned from query execution: 

| Query | Sample Metric | Description | 
| ------ | -----| ----------- |
| `SELECT TOP 100 * FROM c` | `"RetrievedDocumentCount": 101` | The number of documents retrieved is 100+1 to match the TOP clause. Query time is mostly spent in `WriteOutputTime` and `DocumentLoadTime` since it is a scan. | 
| `SELECT TOP 500 * FROM c` | `"RetrievedDocumentCount": 501` | RetrievedDocumentCount is now higher (500+1 to match the TOP clause). | 
| `SELECT * FROM c WHERE c.N = 55` | `"IndexLookupTime": "00:00:00.0009500"` | About 0.9 ms is spent in IndexLookupTime for a key lookup, because it's an index lookup on `/N/?`. | 
| `SELECT * FROM c WHERE c.N > 55` | `"IndexLookupTime": "00:00:00.0017700"` | Slightly more time (1.7 ms) spent in IndexLookupTime over a range scan, because it's an index lookup on `/N/?`. | 
| `SELECT TOP 500 c.N FROM c` | `"IndexLookupTime": "00:00:00.0017700"` | Same time spent on `DocumentLoadTime` as previous queries, but lower `WriteOutputTime` because we're projecting only one property. | 
| `SELECT TOP 500 udf.toPercent(c.N) FROM c` | `"UserDefinedFunctionExecutionTime": "00:00:00.2136500"` | About 213 ms is spent in `UserDefinedFunctionExecutionTime` executing the UDF on each value of `c.N`. |
| `SELECT TOP 500 c.Name FROM c WHERE STARTSWITH(c.Name, 'Den')` | `"IndexLookupTime": "00:00:00.0006400", "SystemFunctionExecutionTime": "00:00:00.0074100"` | About 0.6 ms is spent in `IndexLookupTime` on `/Name/?`. Most of the query execution time (~7 ms) in `SystemFunctionExecutionTime`. |
| `SELECT TOP 500 c.Name FROM c WHERE STARTSWITH(LOWER(c.Name), 'den')` | `"IndexLookupTime": "00:00:00", "RetrievedDocumentCount": 2491,  "OutputDocumentCount": 500` | Query is performed as a scan because it uses `LOWER`, and 500 out of 2491 retrieved documents are returned. |


## Next steps
* To learn about the supported SQL query operators and keywords, see [SQL query](sql-query-getting-started.md). 
* To learn about request units, see [request units](request-units.md).
* To learn about indexing policy, see [indexing policy](index-policy.md) 


