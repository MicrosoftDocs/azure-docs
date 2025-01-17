---
title: Best practices for memory management for Azure Managed Redis (preview)
description: Learn how to manage your Azure Managed Redis memory effectively with Azure Managed Redis.

ms.service: azure-managed-redis
ms.custom:
  - ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---

# Memory management for Azure Managed Redis (preview)

## Eviction policy

Choose an [eviction policy](https://redis.io/topics/lru-cache)that works for your application. The default policy for Azure Managed Redis (preview) is `volatile-lru`, which means that only keys that have a TTL value set with a command like [EXPIRE](https://redis.io/commands/expire) are eligible for eviction.  If no keys have a TTL value, then the system won't evict any keys.  If you want the system to allow any key to be evicted if under memory pressure, then you may want to consider the `allkeys-lru` policy.

## Keys expiration

Set an expiration value on your keys. An expiration removes keys proactively instead of waiting until there's memory pressure.  When eviction happens because of memory pressure, it can cause more load on your server. For more information, see the documentation for the [EXPIRE](https://redis.io/commands/expire) and [EXPIREAT](https://redis.io/commands/expireat) commands.

## Monitor memory usage

Consider adding alerting on "Used Memory Percentage" metric to ensure that you don't run out of memory and have the chance to scale your cache before seeing issues. If your "Used Memory Percentage" is consistently over 75%, consider increasing your memory by scaling to a higher tier. See [here](managed-redis-architecture.md#sharding-configuration) for information on tiers.

## Next steps

- [Best practices for development](managed-redis-best-practices-development.md)
- [maxmemory-reserved setting](managed-redis-configure.md#memory-policies)
- [Best practices for scaling](managed-redis-best-practices-scale.md)
