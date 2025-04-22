---
title: Best practices for memory management
description: Learn how to manage your Azure Cache for Redis memory effectively.


ms.topic: conceptual
ms.custom:
  - ignite-2024
ms.date: 04/14/2025
appliesto:
  - ✅ Azure Cache for Redis

---

# Memory management

This article describes best practices for memory management in Azure Cache for Redis.

## Choose the right eviction policy

Choose an [eviction policy](https://redis.io/topics/lru-cache) that works for your application. The default policy for Azure Cache for Redis is `volatile-lru`, which means that only keys that have a time to live (TTL) value set with a command like [EXPIRE](https://redis.io/commands/expire) are eligible for eviction. If no keys have a TTL value, the system doesn't evict any keys. If you want the system to allow any key to be evicted if under memory pressure, consider the `allkeys-lru` policy.

## Set a keys expiration date

Eviction due to memory pressure can cause more load on your server. Set an expiration value on your keys to remove keys proactively instead of waiting until there's memory pressure. For more information, see the documentation for the Redis [EXPIRE](https://redis.io/commands/expire) and [EXPIREAT](https://redis.io/commands/expireat) commands.

## Minimize memory fragmentation

Large key values can leave memory fragmented on eviction and might lead to high memory usage and server load.

## Monitor memory usage

[Monitor memory usage](/azure/redis/monitor-cache#view-cache-metrics) to ensure that you don't run out of memory. [Create alerts](/azure/redis/monitor-cache#create-alerts) to give you a chance to scale your cache before issues occur.

## Configure your maxmemory-reserved setting

Configure your [maxmemory-reserved settings](cache-configure.md#memory-policies) to maximize system responsiveness. Sufficient reservation settings are especially important for write-heavy workloads, or if you're storing values of 100 KB or more in your cache.

- The `maxmemory-reserved` setting configures the amount of memory, in MB per instance in a cluster, reserved for noncache operations such as replication during failover. Setting this value allows you to have a more consistent Redis server experience when your load varies.

- The `maxfragmentationmemory-reserved` setting configures the amount of memory, in MB per instance in a cluster, reserved to accommodate memory fragmentation. When you set this value, the Redis server experience is more consistent when the cache is full or close to full and the fragmentation ratio is high.

When memory is reserved for these operations, it's unavailable for storing cached data. By default when you create a cache, approximately 10% of the available memory is reserved for `maxmemory-reserved`, and another 10% is reserved for `maxfragmentationmemory-reserved`. You can increase the amounts reserved if you have write-heavy loads.

The allowed ranges for `maxmemory-reserved` and for `maxfragmentationmemory-reserved` are 10%-60% of `maxmemory`. If you try to set these values lower than 10% or higher than 60%, they're reevaluated and set to the 10% minimum and 60% maximum.

When you scale a cache up or down, both `maxmemory-reserved` and `maxfragmentationmemory-reserved` settings automatically scale in proportion to the cache size. For example, if `maxmemory-reserved` is set to 3 GB on a 6-GB cache, and you scale to a 12-GB cache, the setting automatically updates to 6 GB during scaling. If you scale down, the reverse happens.

Consider how changing a `maxmemory-reserved` or `maxfragmentationmemory-reserved` memory reservation value might affect a cache with a large amount of data in it that is already running. For instance, if you have a 53-GB cache with the reserved values set to the 10% minimums, the maximum available memory for the system is approximately 42 GB. If either your current `used_memory` or `used_memory_rss` values are higher than 42 GB, the system must evict data until both `used_memory` and `used_memory_rss` are below 42 GB.

Eviction can increase server load and memory fragmentation. For more information on cache metrics such as `used_memory` and `used_memory_rss`, see [Create your own metrics](/azure/redis/monitor-cache#create-your-own-metrics).

> [!NOTE]
> When you scale a cache up or down programmatically by using Azure PowerShell, Azure CLI, or REST API, any included `maxmemory-reserved` or `maxfragmentationmemory-reserved` settings are ignored as part of the update request. Only your scaling change is honored. You can update the memory settings after the scaling operation completes.

## Related content

- [Memory policies](cache-configure.md#memory-policies)
- [Troubleshoot high memory usage](cache-troubleshoot-timeouts.md#high-memory-usage)
- [Best practices for scaling](cache-best-practices-scale.md)
- [Best practices for development](cache-best-practices-development.md)
- [Azure Cache for Redis development FAQs](cache-development-faq.yml)
