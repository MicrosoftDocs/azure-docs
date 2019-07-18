---
title: Query containers in Azure Cosmos DB
description: Learn how to query containers in Azure Cosmos DB
author: markjbrown
ms.service: cosmos-db
ms.topic: sample
ms.date: 05/23/2019
ms.author: mjbrown
---

# Query an Azure Cosmos container

This article explains how to query a container (collection, graph, or table) in Azure Cosmos DB.

## In-partition query

When you query data from containers, if the query has a partition key filter specified, Azure Cosmos DB handles the query automatically. It routes the query to the partitions corresponding to the partition key values specified in the filter. For example, the following query is routed to the `DeviceId` partition, which holds all the documents corresponding to partition key value `XMS-0001`.

```csharp
// Query using partition key into a class called, DeviceReading
IQueryable<DeviceReading> query = client.CreateDocumentQuery<DeviceReading>(
    UriFactory.CreateDocumentCollectionUri("myDatabaseName", "myCollectionName"))
    .Where(m => m.MetricType == "Temperature" && m.DeviceId == "XMS-0001");
```

## Cross-partition query

The following query doesn't have a filter on the partition key (`DeviceId`), and is fanned out to all partitions where it is run against the partition's index. To run a query across partitions, set `EnableCrossPartitionQuery` to true (or `x-ms-documentdb-query-enablecrosspartition` in the REST API).

The EnableCrossPartitionQuery property accepts a boolean value. When set to true and if your query doesn't have a partition key, Azure Cosmos DB fans out the query across partitions. The fan out is done by issuing individual queries to all the partitions. To read the query results, the client applications should consume the results from the FeedResponse and check for the ContinuationToken property. To read all the results, keep iterating on the data until the ContinuationToken is null. 

```csharp
// Query across partition keys into a class called, DeviceReading
IQueryable<DeviceReading> crossPartitionQuery = client.CreateDocumentQuery<DeviceReading>(
    UriFactory.CreateDocumentCollectionUri("myDatabaseName", "myCollectionName"),
    new FeedOptions { EnableCrossPartitionQuery = true })
    .Where(m => m.MetricType == "Temperature" && m.MetricValue > 100);
```

Azure Cosmos DB supports aggregate functions COUNT, MIN, MAX, and AVG over containers by using SQL. The aggregate functions over containers starting from the SDK version 1.12.0 and later. Queries must include a single aggregate operator, and must include a single value in the projection.

## Parallel cross-partition query

The Azure Cosmos DB SDKs 1.9.0 and later support parallel query execution options. Parallel cross-partition queries allow you to perform low latency, cross-partition queries. For example, the following query is configured to run in parallel across partitions.

```csharp
// Cross-partition Order By Query with parallel execution
IQueryable<DeviceReading> crossPartitionQuery = client.CreateDocumentQuery<DeviceReading>(
    UriFactory.CreateDocumentCollectionUri("myDatabaseName", "myCollectionName"),  
    new FeedOptions { EnableCrossPartitionQuery = true, MaxDegreeOfParallelism = 10, MaxBufferedItemCount = 100})
    .Where(m => m.MetricType == "Temperature" && m.MetricValue > 100)
    .OrderBy(m => m.MetricValue);
```

You can manage parallel query execution by tuning the following parameters:

- **MaxDegreeOfParallelism**: Sets the maximum number of simultaneous network connections to the container's partitions. If you set this property to -1, the SDK manages the degree of parallelism. If the `MaxDegreeOfParallelism` is not specified or set to 0, which is the default value, there is a single network connection to the container's partitions.

- **MaxBufferedItemCount**: Trades query latency versus client-side memory utilization. If this option is omitted or to set to -1, the SDK manages the number of items buffered during parallel query execution.

With the same state of the collection, a parallel query returns results in the same order as a serial execution. When performing a cross-partition query that includes sorting operators (ORDER BY, TOP), the Azure Cosmos DB SDK issues the query in parallel across partitions. It merges partially sorted results in the client side to produce globally ordered results.

## Next steps

See the following articles to learn about partitioning in Azure Cosmos DB:

- [Partitioning in Azure Cosmos DB](partitioning-overview.md)
- [Synthetic partition keys in Azure Cosmos DB](synthetic-partition-keys.md)
