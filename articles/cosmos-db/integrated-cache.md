---
title: Azure Cosmos DB integrated cache
description: The Azure Cosmos DB integrated cache is an in-memory cache that helps you ensure manageable costs and low latency as your request volume grows.
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 05/25/2021
ms.author: tisande
---

# Azure Cosmos DB integrated cache - Overview (Preview)
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

The Azure Cosmos DB integrated cache is an in-memory cache that helps you ensure manageable costs and low latency as your request volume grows. The integrated cache is easy to set up and you don’t need to spend time writing custom code for cache invalidation or managing backend infrastructure. Your integrated cache uses a [dedicated gateway](dedicated-gateway.md) within your Azure Cosmos DB account. The integrated cache is the first of many Azure Cosmos DB features that will utilize a dedicated gateway for improved performance. You can choose from three possible dedicated gateway sizes based on the number of cores and memory needed for your workload.

An integrated cache is automatically configured within the dedicated gateway. The integrated cache has two parts: 

* An item cache for point reads 
* A query cache for queries

The integrated cache is a read-through, write-through cache with a Least Recently Used (LRU) eviction policy. The item cache and query cache share the same capacity within the integrated cache and the LRU eviction policy applies to both. In other words, data is evicted from the cache strictly based on when it was least recently used, regardless of whether it is a point read or query.

## Workloads that benefit from the integrated cache

The main goal of the integrated cache is to reduce costs for read-heavy workloads. Low latency, while helpful, is not the main benefit of the integrated cache because Azure Cosmos DB is already fast without caching.

Point reads and queries that hit the integrated cache won't use any RUs. In other words, any cache hits will have an RU charge of 0. Cache hits will have a much lower per-operation cost than reads from the backend database.

Workloads that fit the following characteristics should evaluate if the integrated cache will help lower costs:

-	Read-heavy workloads
-	Many repeated point reads on large items
-	Many repeated high RU queries
-	Hot partition key for reads

The biggest factor in expected savings is the degree to which reads repeat themselves. If your workload consistently executes the same point reads or queries within a short period of time, it is a great candidate for the integrated cache. When using the integrated cache for repeated reads, you only use RU's for the first read. Subsequent reads routed through the same dedicated gateway node (within the `MaxIntegratedCacheStaleness` window and provided that the data hasn't been evicted) won't use throughput.

Some workloads should not consider the integrated cache, including:

-	Write-heavy workloads
-  Rarely repeated point reads or queries

## Item cache

You can use the item cache for point reads (in other words, key/value look ups based on the Item ID and partition key).

### Populating the item cache

- New writes, updates, and deletes are automatically populated in the item cache
- If your app tries to read a specific item that wasn’t previously in the cache (cache miss), the item would now be stored in the item cache

### Item cache invalidation and eviction

- Item update or delete
- Least recently used (LRU)
- Cache retention time (in other words, the `MaxIntegratedCacheStaleness`)

## Query cache

The query cache can be used to cache queries. The query cache transforms a query into a key/value lookup where the key is the query text and the value is query results. The integrated cache doesn't have a query engine, it only stores the key/value lookup for each query.

### Populating the query cache

- If the cache does not have a result for that query (cache miss), the query is sent to the backend. After the query is run, the cache will store the results for that query

### Query cache eviction

- Least recently used (LRU)
- Cache retention time (in other words, the `MaxIntegratedCacheStaleness`)

### Working with the query cache

You don't need special code when working with the query cache, even if your queries have multiple pages of results. The best practices and code for query pagination are the same, whether your query hits the integrated cache or is executed on the backend query engine.

The query cache will automatically cache query continuation tokens, where applicable. If you have a query with multiple pages of results, any pages that are stored in the integrated cache will have an RU charge of 0. If you subsequent pages of query results require backend execution, they'll have a continuation token from the previous page so they can avoid duplicating previous work.

> [!NOTE]
> Integrated cache instances within different dedicated gateway nodes have independent caches from one another. If data is cached within one node, it is not necessarily cached in the others.

## Integrated cache consistency

The integrated cache supports eventual [consistency](consistency-levels.md) only. If a read has consistent prefix, session, bounded staleness, or strong consistency, it will always bypass the integrated cache.

The easiest way to configure eventual consistency for all reads is to [set it at the account-level](consistency-levels.md#configure-the-default-consistency-level). However, if you would only like some of your reads to have eventual consistency, you can also configure consistency at the [request-level](how-to-manage-consistency.md#override-the-default-consistency-level).

## Integrated cache retention time

The cache retention time is the maximum retention for cached data. During the preview, the `MaxIntegratedCacheStaleness` is always set to 5 minutes and isn't possible to customize.

## Metrics

When using the integrated cache, it is helpful to monitor a few key metrics. The integrated cache metrics include:

- `DedicatedGatewayCpuUsage` - CPU usage by each dedicated gateway node
- `DedicatedGatewayMemoryUsage` - Memory usage by each dedicated gateway node for both routing requests and caching
- `DedicatedGatewayRequests` - The number of requests routed through each dedicated gateway node
- `IntegratedCacheEvictedEntriesSize` – The amount of data evicted from the integrated cache
- `IntegratedCacheTTLExpirationCount`  - The number of entries evicted from the integrated cache specifically due to cached data exceeding the `MaxIntegratedCacheStaleness` time.
- `IntegratedCacheHitRate` – The ratio of point reads and queries that used the integrated cache (out of all dedicated gateway requests that tried to use the integrated cache).

All existing metrics are available, by default, from the **Metrics** blade (not Metrics classic):

   :::image type="content" source="./media/integrated-cache/integrated-cache-metrics.png" alt-text="An image that shows the location of integrated cache metrics" border="false":::

All metrics are exposed as an average across all dedicated gateway nodes. For example, if you provision a dedicated gateway cluster with five nodes, the metrics reflect the average value across all five nodes.

## Troubleshooting common issues

The below examples show how to debug some common scenarios:

### I can’t tell if my application is using the dedicated gateway

Check the `DedicatedGatewayRequests`. This metric includes all requests that use the dedicated gateway, regardless of whether they hit the integrated cache. If your application using the standard gateway or direct mode with your original connection string, you won't see an error message but the `DedicatedGatewayRequests` will be zero.

### I can’t tell if my requests are hitting the integrated cache

Check the `IntegratedCacheHitRate`. If this value is zero, then requests are not hitting the integrated cache. Check that you are using the dedicated gateway connection string, connecting with gateway mode, and have set eventual consistency.

### I want to understand if my dedicated gateway is too small

Check the `IntegratedCacheHitRate`. If this value is high (for example, above 0.5-0.6), this is a good sign that the dedicated gateway is large enough.

If the `IntegratedCacheHitRate` is low, look at the `IntegratedCacheEvictedEntriesSize`. If the `IntegratedCacheEvictedEntriesSize` is high, it may mean that a larger dedicated gateway size would be beneficial.

### I want to understand if my dedicated gateway is too large

This is tougher to measure. In general, you should start small and slowly increase the dedicated gateway size until the `IntegratedCacheHitRate` stops improving.

If most data is evicted from the cache due to exceeding the `MaxIntegratedCacheStaleness`, rather than LRU, your cache might be larger than required. Check if `IntegratedCacheTTLExpirationCount` is nearly as large as `IntegratedCacheEvictedEntriesSize`. If so, you can experiment with a smaller dedicated gateway size and compare performance.

Check the `DedicatedGatewayMemoryUsage` and compare to the dedicated gateway size. If the `DedicatedGatewayMemoryUsage` is less than the dedicated gateway size, then you should try a smaller dedicated gateway size.

## Next steps

- [Integrated cache FAQ](integrated-cache-faq.md)
- [Configure the integrated cache](how-to-configure-integrated-cache.md)
- [Dedicated gateway](dedicated-gateway.md)