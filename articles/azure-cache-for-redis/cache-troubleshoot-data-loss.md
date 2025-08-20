---
title: Troubleshoot data loss
description: Learn to troubleshoot data-loss problems with Azure Cache for Redis, including partial or complete loss of keys.



ms.topic: conceptual
ms.date: 05/22/2025
appliesto:
  - ✅ Azure Cache for Redis

---

# Troubleshoot data loss in Azure Cache for Redis

This article discusses how to diagnose [partial](#partial-key-loss) or [complete](#complete-key-loss) data loss that occurs in Azure Cache for Redis.

## Partial key loss

Azure Cache for Redis doesn't randomly delete keys after they're stored in memory, but it does remove keys in response to expiration policies, eviction policies, and explicit key-deletion commands. You can run these commands on the [console](cache-configure.md#redis-console) or through the [Redis CLI](cache-how-to-redis-cli-tool.md).

Keys written to the primary node in a Premium or Standard Azure Redis instance might not be available on a replica right away. Data is replicated from the primary to the replica in an asynchronous and nonblocking manner.

If some keys disappear from your cache, check the following possible causes:

| Cause | Description |
|---|---|
| [Key expiration](#key-expiration) | Keys were removed because of timeouts set on them. |
| [Key eviction](#key-eviction) | Keys were removed under memory pressure. |
| [Key deletion](#key-deletion) | Keys were removed by explicit delete commands. |
| [Async replication](#async-replication) | Keys weren't available on a replica because of data replication delays. |

### Key expiration

Azure Cache for Redis removes a key automatically if the key is assigned a timeout and that period passes. For more information about Redis key expiration, see the Redis [EXPIRE](https://redis.io/commands/expire) command documentation. Timeout values can also be set by using the [SET](https://redis.io/commands/set), [SETEX](https://redis.io/commands/setex), [GETSET](https://redis.io/commands/getset), and other `*STORE` commands.

To get statistics on how many keys have expired, use the [INFO](https://redis.io/commands/info) command. The `Stats` section shows the total number of expired keys. The `Keyspace` section provides more information about the number of keys with timeouts and the average timeout value.

```output
# Stats

expired_keys:46583

# Keyspace

db0:keys=3450,expires=2,avg_ttl=91861015336
```

### Key eviction

Azure Cache for Redis requires memory space to store data and purges keys to free up available memory when necessary. When the `used_memory` or `used_memory_rss` values approach the configured `maxmemory` setting, Azure Redis starts evicting keys from memory based on [cache policy](https://redis.io/topics/lru-cache).

You can monitor the number of evicted keys by using the [INFO](https://redis.io/commands/info) command.

```output
# Stats

evicted_keys:13224
```

### Key deletion

Redis clients can issue the Redis [DEL](https://redis.io/commands/del) or [HDEL](https://redis.io/commands/hdel) commands to explicitly remove keys from Azure Redis. You can track the number of delete operations by using the [INFO](https://redis.io/commands/info) command. If `DEL` or `HDEL` commands were called, they're listed in the `Commandstats` section.

```output
# Commandstats

cmdstat_del:calls=2,usec=90,usec_per_call=45.00

cmdstat_hdel:calls=1,usec=47,usec_per_call=47.00
```

### Async replication

Standard or Premium tier Azure Cache for Redis instances are configured with a primary node and at least one replica. Data is copied from the primary to a replica asynchronously by using a background process.

[Redis replication](https://redis.io/topics/replication) on the Redis website describes how Redis data replication works in general. For scenarios where clients write to Redis frequently, partial data loss can occur because replication isn't designed to be instantaneous.

For example, if the primary goes down after a client writes a key to it, but before the background process has a chance to send that key to the replica, the key is lost when the replica takes over as the new primary.

## Complete key loss

If most or all keys disappear from your cache, check the following possible causes:

| Cause | Description |
|---|---|
| [Key flushing](#key-flushing) | Keys were purged manually. |
| [Incorrect database selection](#incorrect-database-selection) | Azure Redis is set to use a nondefault database. |
| [Redis instance failure](#redis-instance-failure) | The Redis server is unavailable. |

### Key flushing

Azure Redis clients can call the Redis [FLUSHDB](https://redis.io/commands/flushdb) command to remove all keys in a single database or [FLUSHALL](https://redis.io/commands/flushall) to remove all keys from all databases in a Redis cache. To find out whether keys were flushed, use the [INFO](https://redis.io/commands/info) command. The `Commandstats` section shows whether either `FLUSH` command was called.

```output
# Commandstats

cmdstat_flushall:calls=2,usec=112,usec_per_call=56.00

cmdstat_flushdb:calls=1,usec=110,usec_per_call=52.00
```

### Incorrect database selection

Every database is a logically separate unit and holds a different dataset. Azure Cache for Redis uses the `db0` database by default. If you switch to another database such as `db1` and try to read keys from it, Azure Redis doesn't find them. Use the Redis [SELECT](https://redis.io/commands/select) command to look for keys in other available databases.

### Redis instance failure

Redis keeps data in memory on the physical or virtual machines (VMs) that host the Redis cache. A Basic-tier Azure Cache for Redis instance runs on only a single virtual machine (VM). If that VM goes down, all data that you stored in the cache is lost.

Caches in the Standard and Premium tiers offer higher resiliency against data loss by using two VMs in a replicated configuration. When the primary node in such a cache fails, the replica node takes over to serve data automatically.

These VMs are located on separate domains for faults and updates, to minimize the chance of both VMs becoming unavailable at once. If a major datacenter outage happens, however, both VMs could go down. In these rare cases, your data is lost. Consider using [data persistence](cache-how-to-premium-persistence.md) and [geo-replication](cache-how-to-geo-replication.md) to improve data protection against infrastructure failures.

## Related content

- [Use the Redis command-line tool with Azure Cache for Redis](cache-how-to-redis-cli-tool.md)
- [Data persistence in Azure Cache for Redis](cache-how-to-premium-persistence.md)
- [Monitor Azure Cache for Redis](../redis/monitor-cache.md)
