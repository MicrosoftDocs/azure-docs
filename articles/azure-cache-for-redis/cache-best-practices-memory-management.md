---
title: Best practices for memory management
titleSuffix: Azure Cache for Redis
description: Learn how to manage your Azure Cache for Redis memory effectively.
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 03/22/2022
ms.author: franlanglois

---

# Memory management

## Eviction policy

Choose an [eviction policy](https://redis.io/topics/lru-cache) that works for your application. The default policy for Azure Cache for Redis is `volatile-lru`, which means that only keys that have a TTL value set with a command like [EXPIRE](https://redis.io/commands/expire) are eligible for eviction.  If no keys have a TTL value, then the system won't evict any keys.  If you want the system to allow any key to be evicted if under memory pressure, then you may want to consider the `allkeys-lru` policy.

## Keys expiration

Set an expiration value on your keys. An expiration removes keys proactively instead of waiting until there's memory pressure.  When eviction happens because of memory pressure, it can cause more load on your server. For more information, see the documentation for the [EXPIRE](https://redis.io/commands/expire) and [EXPIREAT](https://redis.io/commands/expireat) commands.

## Minimize memory fragmentation

Large values can leave memory fragmented on eviction and might lead to high memory usage and server load.

## Monitor memory usage

Add monitoring on memory usage to ensure that you don't run out of memory and have the chance to scale your cache before seeing issues.

## Configure your maxmemory-reserved setting

Configure your [maxmemory-reserved setting](cache-configure.md#memory-policies) to improve system responsiveness:

- A sufficient reservation setting is especially important for write-heavy workloads or if you're storing values of 100 KB or more in your cache. By default when you create a cache, approximately 10% of the available memory is reserved for `maxmemory-reserved`. Another 10% is reserved for `maxfragmentationmemory-reserved`. You can increase the amount reserved if you have write-heavy loads.

- The `maxmemory-reserved` setting configures the amount of memory, in MB per instance in a cluster, that is reserved for non-cache operations, such as replication during failover. Setting this value allows you to have a more consistent Redis server experience when your load varies. This value should be set higher for workloads that write large amounts of data. When memory is reserved for such operations, it's unavailable for storage of cached data. The allowed range for `maxmemory-reserved` is 10% - 60% of `maxmemory`. If you try to set these values lower than 10% or higher than 60%, they are re-evaluated and set to the 10% minimum and 60% maximum. The values are rendered in megabytes.

- The `maxfragmentationmemory-reserved` setting configures the amount of memory, in MB per instance in a cluster, that is reserved to accommodate for memory fragmentation. When you set this value, the Redis server experience is more consistent when the cache is full or close to full and the fragmentation ratio is high. When memory is reserved for such operations, it's unavailable for storage of cached data. The allowed range for `maxfragmentationmemory-reserved` is 10% - 60% of `maxmemory`. If you try to set these values lower than 10% or higher than 60%, they are re-evaluated and set to the 10% minimum and 60% maximum. The values are rendered in megabytes.

- One thing to consider when choosing a new memory reservation value (`maxmemory-reserved` or `maxfragmentationmemory-reserved`) is how this change might affect a cache with large amounts of data in it that is already running. For instance, if you have a 53-GB cache with 49 GB of data and then change the reservation value to 8 GB, the max available memory for the system will drop to 45 GB. If either your current `used_memory` or your `used_memory_rss` values are higher than the new limit of 45 GB, then the system must evict data until both `used_memory` and `used_memory_rss` are below 45 GB. Eviction can increase server load and memory fragmentation. For more information on cache metrics such as `used_memory` and `used_memory_rss`, see [Create your own metrics](cache-how-to-monitor.md#create-your-own-metrics).

> [!NOTE]
> When you scale a cache up or down, both `maxmemory-reserved` and `maxfragmentationmemory-reserved` settings automatically scale in proportion to the cache size. For example, if `maxmemory-reserved` is set to 3 GB on a 6-GB cache, and you scale to 12-GB cache, the settings automatically get updated to 6 GB during scaling. When you scale down, the reverse happens.
> When you scale a cache up or down programmatically, using PowerShell, CLI or Rest API, any `maxmemory-reserved` or `maxfragmentationmemory-reserved` are ignored as part of the update request. Only your scaling change is honored. You can update these memory settings after the scaling operation has completed.

## Next steps

- [Best practices for development](cache-best-practices-development.md)
- [Azure Cache for Redis development FAQs](cache-development-faq.yml)
- [maxmemory-reserved setting](cache-configure.md#memory-policies)
- [Best practices for scaling](cache-best-practices-scale.md)
