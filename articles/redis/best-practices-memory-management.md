---
title: Best practices for memory management for Azure Managed Redis
description: Learn how to manage your Azure Managed Redis memory effectively with Azure Managed Redis.
ms.date: 05/18/2025
ms.topic: best-practice
ms.custom:
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Managed Redis
---

# Memory management for Azure Managed Redis

In this article, we discuss effective memory management of an Azure Managed Redis cache.

## Understand how memory usage is reported

The **Used Memory** metric reports the total memory consumed by your database, including all shards. When High Availability is enabled, this metric includes the memory used by both primary and replica shards. This means the reported value can be roughly **twice** the size of your actual dataset.

For example, if you store 10 GB of data in a cache with High Availability enabled, the **Used Memory** metric reports approximately 20 GB.

The **Used Memory** metric doesn't include memory fragmentation. Actual physical memory consumption on the server can be higher due to allocator overhead. For more details on what each metric includes, see the [monitoring data reference](monitor-cache-reference.md#details-about-azure-managed-redis-metrics).

## Estimate memory for capacity planning

When planning the memory you need, account for these factors beyond just the raw size of your values:

- **Per-key overhead**: Each key stored in Redis includes internal metadata (pointers, type info, expiration tracking). This overhead is typically 50 to 100 bytes per key, depending on the key name length and value type. For large numbers of small keys, this overhead can be significant.
- **Key names**: The memory used to store your key names adds up at scale. Shorter key names help reduce memory usage.
- **Expiration tracking**: Keys with a TTL set consume extra memory for expiration bookkeeping.
- **High Availability replication**: With High Availability enabled, the dataset is replicated. The **Used Memory** metric reflects both primary and replica memory, but the SKU memory limit already accounts for this. You don't need to choose a larger SKU to accommodate replication — select a SKU based on your actual dataset size.

To check the exact memory cost of a specific key, use the Redis [`MEMORY USAGE`](https://redis.io/commands/memory-usage) command:

```
MEMORY USAGE <your_key_name>
```

This command returns the total bytes consumed by a key, including all internal overhead. Use this to validate your per-key memory estimates against actual usage.

## Eviction policy

Choose an [eviction policy](https://redis.io/topics/lru-cache)that works for your application. The default policy for Azure Managed Redis is `volatile-lru`, which means that only keys that have a TTL value set with a command like [EXPIRE](https://redis.io/commands/expire) are eligible for eviction. If no keys have a TTL value, then the system doesn't evict any keys. If you want the system to allow any key to be evicted if under memory pressure, then consider the `allkeys-lru` policy.

## Keys expiration

Set an expiration value on your keys. An expiration removes keys proactively instead of waiting until there's memory pressure. When eviction happens because of memory pressure, it can cause more load on your server. For more information, see the documentation for the [EXPIRE](https://redis.io/commands/expire) and [EXPIREAT](https://redis.io/commands/expireat) commands.

## Monitor memory usage

We recommend monitoring the **Used Memory Percentage** metric rather than raw **Used Memory**. The percentage metric already accounts for your SKU's total memory limit, including High Availability replication, so it gives you a straightforward view of how close you are to capacity without needing to mentally adjust for replica memory.

Add alerting on **Used Memory Percentage** to ensure that you don't run out of memory and have the chance to scale your cache before seeing issues. If your **Used Memory Percentage** is consistently over 75%, consider increasing your memory by scaling to a higher tier. For information on tiers, see [Architecture](architecture.md#sharding-configuration).

## Related content

- [Monitoring data reference](monitor-cache-reference.md)
- [Best practices for development](best-practices-development.md)
- [Best practices for scaling](best-practices-scale.md)
