---
title: Azure Cosmos DB integrated cache
description: The Azure Cosmos DB integrated cache is an in-memory cache that helps you ensure manageable costs and low latency as your request volume grows.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 08/29/2022
ms.author: sidandrews
ms.reviewer: jucocchi
---

# Azure Cosmos DB integrated cache - Overview
[!INCLUDE[NoSQL](includes/appliesto-nosql.md)]

The Azure Cosmos DB integrated cache is an in-memory cache that helps you ensure manageable costs and low latency as your request volume grows. The integrated cache is easy to set up and you don’t need to spend time writing custom code for cache invalidation or managing backend infrastructure. Your integrated cache uses a [dedicated gateway](dedicated-gateway.md) within your Azure Cosmos DB account. The integrated cache is the first of many Azure Cosmos DB features that will utilize a dedicated gateway for improved performance. You can choose from three possible dedicated gateway sizes based on the number of cores and memory needed for your workload.

An integrated cache is automatically configured within the dedicated gateway. The integrated cache has two parts: 

* An item cache for point reads 
* A query cache for queries

The integrated cache is a read-through, write-through cache with a Least Recently Used (LRU) eviction policy. The item cache and query cache share the same capacity within the integrated cache and the LRU eviction policy applies to both. In other words, data is evicted from the cache strictly based on when it was least recently used, regardless of whether it is a point read or query.

> [!NOTE]
> Do you have any feedback about the integrated cache? We want to hear it! Feel free to share feedback directly with the Azure Cosmos DB engineering team:
cosmoscachefeedback@microsoft.com

## Workloads that benefit from the integrated cache

The main goal of the integrated cache is to reduce costs for read-heavy workloads. Low latency, while helpful, is not the main benefit of the integrated cache because Azure Cosmos DB is already fast without caching.

Point reads and queries that hit the integrated cache will have an RU charge of 0. Cache hits will have a much lower per-operation cost than reads from the backend database.

Workloads that fit the following characteristics should evaluate if the integrated cache will help lower costs:

-	Read-heavy workloads
-	Many repeated point reads on large items
-	Many repeated high RU queries
-	Hot partition key for reads

The biggest factor in expected savings is the degree to which reads repeat themselves. If your workload consistently executes the same point reads or queries within a short period of time, it is a great candidate for the integrated cache. When using the integrated cache for repeated reads, you only use RU's for the first read. Subsequent reads routed through the same dedicated gateway node (within the `MaxIntegratedCacheStaleness` window and if the data hasn't been evicted) won't use throughput.

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

You don't need special code when working with the query cache, even if your queries have multiple pages of results. The best practices and code for query pagination are the same whether your query hits the integrated cache or is executed on the backend query engine.

The query cache will automatically cache query continuation tokens where applicable. If you have a query with multiple pages of results, any pages that are stored in the integrated cache will have an RU charge of 0. If your subsequent pages of query results require backend execution, they'll have a continuation token from the previous page so they can avoid duplicating previous work.

> [!NOTE]
> Integrated cache instances within different dedicated gateway nodes have independent caches from one another. If data is cached within one node, it is not necessarily cached in the others. Multiple pages of the same query are not guaranteed to be routed to the same dedicated gateway node.

## Integrated cache consistency

The integrated cache supports read requests with session and eventual [consistency](consistency-levels.md) only. If a read has consistent prefix, bounded staleness, or strong consistency, it will always bypass the integrated cache and be served from the backend. 

The easiest way to configure either session or eventual consistency for all reads is to [set it at the account-level](consistency-levels.md#configure-the-default-consistency-level). However, if you would only like some of your reads to have a specific consistency, you can also configure consistency at the [request-level](how-to-manage-consistency.md#override-the-default-consistency-level).

> [!NOTE]
> Write requests with other consistencies will still populate the cache, but in order to read from the cache the request must have either session or eventual consistency.

### Session consistency

[Session consistency](consistency-levels.md#session-consistency) is the most widely used consistency level for both single region as well as globally distributed Azure Cosmos DB accounts. When using session consistency, single client sessions can read their own writes. When using the integrated cache, clients outside of the session performing writes will see eventual consistency.

## MaxIntegratedCacheStaleness

The `MaxIntegratedCacheStaleness` is the maximum acceptable staleness for cached point reads and queries, regardless of the selected consistency. The `MaxIntegratedCacheStaleness` is configurable at the request-level. For example, if you set a `MaxIntegratedCacheStaleness` of 2 hours, your request will only return cached data if the data is less than 2 hours old. To increase the likelihood of repeated reads utilizing the integrated cache, you should set the `MaxIntegratedCacheStaleness` as high as your business requirements allow.

It's important to understand that the `MaxIntegratedCacheStaleness`, when configured on a request that ends up populating the cache, doesn't impact how long that request will be cached. `MaxIntegratedCacheStaleness` enforces consistency when you try to use cached data. There's no global TTL or cache retention setting, so data will only be evicted from the cache if either the integrated cache is full or a new read is run with a lower `MaxIntegratedCacheStaleness` than the age of the current cached entry.

This is an improvement from how most caches work and allows the following additional customization:

- You can set different staleness requirements for each point read or query
- Different clients, even if they run the same point read or query, can configure different `MaxIntegratedCacheStaleness` values
- If you wanted to modify read consistency when using cached data, changing `MaxIntegratedCacheStaleness` will have an immediate effect on read consistency

> [!NOTE]
> When not explicitly configured, the MaxIntegratedCacheStaleness defaults to 5 minutes.

To better understand the `MaxIntegratedCacheStaleness` parameter, consider the following example:

| Time       | Request                                         | Response                                                     |
| ---------- | ----------------------------------------------- | ------------------------------------------------------------ |
| t = 0 sec  | Run Query A with MaxIntegratedCacheStaleness = 30 seconds | Return results from backend database (normal RU charges) and populate cache     |
| t = 0 sec  | Run Query B with MaxIntegratedCacheStaleness = 60 seconds | Return results from backend database (normal RU charges) and populate cache     |
| t = 20 sec | Run Query A with MaxIntegratedCacheStaleness = 30 seconds | Return results from integrated cache (0 RU charge)           |
| t = 20 sec | Run Query B with MaxIntegratedCacheStaleness = 60 seconds | Return results from integrated cache (0 RU charge)           |
| t = 40 sec | Run Query A with MaxIntegratedCacheStaleness = 30 seconds | Return results from backend database (normal RU charges) and refresh cache |
| t = 40 sec | Run Query B with MaxIntegratedCacheStaleness = 60 seconds | Return results from integrated cache (0 RU charge)           |
| t = 50 sec | Run Query B with MaxIntegratedCacheStaleness = 20 seconds | Return results from backend database (normal RU charges) and refresh cache |

[Learn to configure the `MaxIntegratedCacheStaleness`.](how-to-configure-integrated-cache.md#adjust-maxintegratedcachestaleness)

## Metrics

When using the integrated cache, it is helpful to monitor some key metrics. The integrated cache metrics include:

- `DedicatedGatewayCPUUsage` - CPU usage with Avg, Max, or Min Aggregation types for data across all dedicated gateway nodes.
- `DedicatedGatewayAverageCPUUsage` - (Deprecated) Average CPU usage across all dedicated gateway nodes.
- `DedicatedGatewayMaximumCPUUsage` - (Deprecated) Maximum CPU usage across all dedicated gateway nodes.
- `DedicatedGatewayMemoryUsage` - Memory usage with Avg, Max, or Min Aggregation types for data across all dedicated gateway nodes. 
- `DedicatedGatewayAverageMemoryUsage` - (Deprecated) Average memory usage across all dedicated gateway nodes.
- `DedicatedGatewayRequests` - Total number of dedicated gateway requests across all dedicated gateway nodes.
- `IntegratedCacheEvictedEntriesSize` – The average amount of data evicted from the integrated cache due to LRU across all dedicated gateway nodes. This value does not include data that expired due to exceeding the `MaxIntegratedCacheStaleness` time.
- `IntegratedCacheItemExpirationCount` - The average number of items that are evicted from the integrated cache due to cached point reads exceeding the `MaxIntegratedCacheStaleness` time across all dedicated gateway nodes. 
- `IntegratedCacheQueryExpirationCount` - The average number of queries that are evicted from the integrated cache due to cached queries exceeding the `MaxIntegratedCacheStaleness` time across all dedicated gateway nodes.
- `IntegratedCacheItemHitRate` – The proportion of point reads that used the integrated cache (out of all point reads routed through the dedicated gateway with session or eventual consistency). This value is an average of integrated cache instances across all dedicated gateway nodes.
- `IntegratedCacheQueryHitRate` – The proportion of queries that used the integrated cache (out of all queries routed through the dedicated gateway with session or eventual consistency). This value is an average of integrated cache instances across all dedicated gateway nodes.

All existing metrics are available, by default, from the **Metrics** blade (not Metrics classic):

   :::image type="content" source="./media/integrated-cache/integrated-cache-metrics.png" alt-text="Screenshot of the Azure Portal that shows the location of integrated cache metrics." border="false":::

Metrics are either an average, maximum, or sum across all dedicated gateway nodes. For example, if you provision a dedicated gateway cluster with five nodes, the metrics reflect the aggregated value across all five nodes. It isn't possible to determine the metric values for each individual node.

## Troubleshooting common issues

The below examples show how to debug some common scenarios:

### I can’t tell if my application is using the dedicated gateway

Check the `DedicatedGatewayRequests`. This metric includes all requests that use the dedicated gateway, regardless of whether they hit the integrated cache. If your application uses the standard gateway or direct mode with your original connection string, you won't see an error message but the `DedicatedGatewayRequests` will be zero.

### I can’t tell if my requests are hitting the integrated cache

Check the `IntegratedCacheItemHitRate` and `IntegratedCacheQueryHitRate`. If both of these values are zero, then requests are not hitting the integrated cache. Check that you are using the dedicated gateway connection string, [connecting with gateway mode](nosql/sdk-connection-modes.md), and [have set session or eventual consistency](consistency-levels.md#configure-the-default-consistency-level).

### I want to understand if my dedicated gateway is too small

Check the `IntegratedCacheItemHitRate` and `IntegratedCacheQueryHitRate`. If these values are high (for example, above 0.7-0.8), this is a good sign that the dedicated gateway is large enough.

If the `IntegratedCacheItemHitRate` or `IntegratedCacheQueryHitRate`is low, look at the `IntegratedCacheEvictedEntriesSize`. If the `IntegratedCacheEvictedEntriesSize` is high, it may mean that a larger dedicated gateway size would be beneficial. You can experiment by increasing the dedicated gateway size and comparing the new `IntegratedCacheItemHitRate` and `IntegratedCacheQueryHitRate`. If a larger dedicated gateway doesn't improve the `IntegratedCacheItemHitRate` or `IntegratedCacheQueryHitRate`, it's possible that reads simply don't repeat themselves enough for the integrated cache to be impactful.

### I want to understand if my dedicated gateway is too large

It is more difficult to measure if a dedicated gateway is too large than it is to measure if a dedicated gateway is too small. In general, you should start small and slowly increase the dedicated gateway size until the `IntegratedCacheItemHitRate` and `IntegratedCacheQueryHitRate` stop improving. In some cases, only one of the two cache hit metrics will be important, not both. For example, if your workload is primarily queries, rather than point reads, the `IntegratedCacheQueryHitRate` is much more important than the `IntegratedCacheItemHitRate`.

If most data is evicted from the cache due to exceeding the `MaxIntegratedCacheStaleness`, rather than LRU, your cache might be larger than required. If `IntegratedCacheItemExpirationCount` and `IntegratedCacheQueryExpirationCount` combined are nearly as large as `IntegratedCacheEvictedEntriesSize`, you can experiment with a smaller dedicated gateway size and compare performance.

### I want to understand if I need to add more dedicated gateway nodes

In some cases, if latency is unexpectedly high, you may need more dedicated gateway nodes rather than bigger nodes. Check the `DedicatedGatewayCPUUsage` and `DedicatedGatewayMemoryUsage` to determine if adding more dedicated gateway nodes would reduce latency. It's good to keep in mind that since all instances of the integrated cache are independent from one another, adding more dedicated gateway nodes won't reduce the `IntegratedCacheEvictedEntriesSize`. Adding more nodes will improve the request volume that your dedicated gateway cluster can handle, though.

## Next steps

- [Integrated cache FAQ](integrated-cache-faq.md)
- [Configure the integrated cache](how-to-configure-integrated-cache.md)
- [Dedicated gateway](dedicated-gateway.md)
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    - If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md) 
    - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)
