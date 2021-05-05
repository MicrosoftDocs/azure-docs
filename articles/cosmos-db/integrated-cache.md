---
title: Azure Cosmos DB integrated cache
description: Learn about the integrated cache in Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 05/25/2021
ms.author: tisande
---

# Azure Cosmos DB integrated cache - Overview
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

The Azure Cosmos DB integrated cache is an in-memory cache that helps you ensure manageable costs and low latency as your request volume grows. The integrated cache is easy to set up and you don’t need to spend time writing custom code for cache invalidation or managing backend infrastructure. Your integrated cache uses a [dedicated gateway](dedicated-gateway.md) within your Azure Cosmos DB account. The integrated cache is the first of many Azure Cosmos DB features that will utilize a dedicated gateway for improved performance. You can choose from a variety of dedicated gateway sizes based on the number of cores and memory needed for your workload.

An integrated cache is automatically configured within the dedicated gateway. The integrated cache has two components: an item cache for point reads and and a query cache for queries. The integrated cache is a read-through, write-through cache with a Least Recently Used (LRU) eviction policy. The item cache and query cache share the same capacity within the integrated cache and the LRU eviction policy applies to both. In other words, data is evicted from the cache strictly based on when it was least recently used, regardless of whether it is a point read or query.

## Workloads that benefit from the integrated cache

The main goal of the integrated cache is to reduce costs for read-heavy workloads. Low latency, while helpful, is not the main benefit of the integrated cache because Azure Cosmos DB is fast without caching.

Point reads and queries that hit the integrated cache won't use any RU's. In other words, any cache hits will have an RU charge of 0. Cache hits will have a much lower per-operation cost than reads from the backend database.

Workloads that fit one or many of the following characteristics should evaluate if the integrated cache will help lower costs:

-	Read-heavy workloads
-	Hot partition key for reads
-	Many repeated point reads on large items
-	Many repeated high RU queries

The biggest factor in expected savings is the degree to which reads repeat themselves. If your workload consistently executes the same point reads or queries within a short period of time, it is a great candidate for the integrated cache. When using the integrated cache for repeated reads, you would along use RU's for the first read. Subsequent reads routed through that same dedicated gateway node within the cache retention time wouldn't use throughput.

Some workloads should not consider the integrated cache. These include:

-	Write-heavy workloads
-   Rarely repeated point reads or queries

## Item cache:

You can use the item cache for point reads (in other words, key/value look ups based on the Item id and partition key).

### Populating the item cache:

- New writes, updates, and deletes are automatically applied to the item cache
- If the app tries to read an specific item that wasn’t previously in the cache (cache miss), the item would now be stored in the item cache

### Item cache invalidation and eviction:

- Item update or delete
- Least recently used (LRU)
- Cache retention time (in other words, cache TTL)

## Query cache:

The query cache can be used to cache queries. The query cache transforms a query into a key/value lookup where the key is the query text and the value is the backend's response for that particular query.

### Populating the query cache

- If the cache does not have a result for that query (cache miss), the query is sent to the backend. After the query is run, the cache will store the results for that query

### Query cache eviction:

- Least recently used (LRU)
- Cache retention time (in other words, cache TTL)

> [!NOTE]
> Integrated cache instances within different dedicated gateway nodes have independent caches from one another.

## Integrated cache consistency

The integrated cache supports eventual [consistency](consistency-levels.md) only. If a read has consistent prefix, session, bounded staleness, or strong consistency, it will always bypass the integrated cache.

The easiest way to configure eventual consistency for all reads is to [set it at the account-level](consistency-levels.md#configure-the-default-consistency-level). However, if you would only like some of your reads to have eventual consistency, you can also configure consistency at the [request-level](how-to-manage-consistency.md#override-the-default-consistency-level).

## Integrated cache retention time:

The cache retention time is the maximum retention for cached data. You can set the cache retention time by configuring the `MaxCacheStaleness` for each request. 

Your`MaxCacheStaleness` is the maximum time in which you are willing to tolerate stale cached data. For example, if you set a `MaxCacheStaleness` of 2 hours, your request will only return cached data if it is less than 2 hours old. To increase the likelihood of repeated reads utilizing the integrated cache, you should set the `MaxCacheStaleness` as high as your business requirements allow.

> [!NOTE]
> When not explicitly configured, the MaxCacheStaleness defaults to 5 minutes

To better understand the `MaxCacheStaleness` parameter, consider the following example:

| Time       | Request                                         | Response                                                     |
| ---------- | ----------------------------------------------- | ------------------------------------------------------------ |
| t = 0 sec  | Run Query A with MaxCacheStaleness = 30 seconds | Return results from backend database (normal RU charges)     |
| t = 0 sec  | Run Query B with MaxCacheStaleness = 60 seconds | Return results from backend database (normal RU charges)     |
| t = 20 sec | Run Query A with MaxCacheStaleness = 30 seconds | Return results from integrated cache (0 RU charge)           |
| t = 20 sec | Run Query B with MaxCacheStaleness = 60 seconds | Return results from integrated cache (0 RU charge)           |
| t = 40 sec | Run Query A with MaxCacheStaleness = 30 seconds | Return results from backend database (normal RU charges), evict stale cached query results, and repopulate cache |
| t = 40 sec | Run Query B with MaxCacheStaleness = 60 seconds | Return results from integrated cache (0 RU charge)           |
| t = 50 sec | Run Query B with MaxCacheStaleness = 20 seconds | Return results from backend database (normal RU charges), evict stale cached query results, and repopulate cache |

> [!NOTE]
> Customizing `MaxCacheStaleness` is only supported in the latest .NET and Java SDK's

[Learn to configure the MaxCacheStaleness](how-to-configure-integrated-cache.md#maxcachestaleness)

## Metrics

When using the integrated cache, it is helpful to monitor a few key metrics. These include:

- IntegratedCacheEvictedEntriesSize – the total amount of data evicted from the cache
- IntegratedCacheTTLExpirationCount  - the amount of data evicted from the cache specifically due to TTL
- IntegratedCacheHitRate – the number of requests that used the cache
- IntegratedCacheSize – the amount of data in the cache

All existing metrics are available, by default, in the Metrics blade (not Metrics classic):

:::image type="content" source="./media/integrated-cache/integrated-cache-metrics.png" alt-text="An image that shows the location of integrated cache metrics" border="false":::

## Troubleshooting common issues

The below examples show how to debug some common scenarios:

### I can’t tell if my requests are hitting the integrated cache:

Check the `IntegratedCacheHitRate`. If this value is zero, then requests are hitting the integrated cache. Check that you are using the right connect string with eventual consistency.

### I want to understand if my integrated cache is too small:

Check the `IntegratedCacheHitRate`. If this value is very high (say above 0.7-0.8), this is a good sign that the integrated cache is at least the right size. 

If the IntegratedCacheHitRate is low, compare the `IntegratedCacheEvictedEntriesSize` and `IntegratedCacheTTLExpirationCount`. If `IntegratedCacheTTLExpirationCount` is significantly smaller than `IntegratedCacheEvictedEntriesSize`, it may mean that you could achieve a higher IntegratedCacheHitRate with a larger instance size.

### I want to understand if my cache is too big:

This is tougher to measure. In general, you should start smaller and slowly increase integrated cache size until the IntegratedCacheHitRate stops improving.

If most data is evicted from the cache due to TTL, rather than LRU, this may mean your cache is bigger than required. Check if `IntegratedCacheTTLExpirationCount` is nearly as large as `IntegratedCacheEvictedEntriesSize`.

Check the `IntegratedCacheSize`. Is this similar in size to the total integrated cache size? Approx. 70% of dedicated gateway memory can be used for caching. Therefore, if you have a 16 GB dedicated gateway instance, you should expect to have approximately 11 GB of memory available for caching.

Next steps:

- [Integrated cache FAQ](integrated-cache-faq.md)
- [Configure the integrated cache](how-to-configure-integrated-cache.md)
- [Dedicated gateway](dedicated-gateway.md)