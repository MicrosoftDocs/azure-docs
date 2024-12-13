---
title: Troubleshoot data loss in Azure Managed Redis (preview)
description: Learn how to resolve data-loss problems with Azure Managed Redis, such as partial loss of keys, key expiration, or complete loss of keys.


ms.service: azure-managed-redis
ms.custom:
  - ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---

# Troubleshoot data loss in Azure Managed Redis (preview)

This article discusses how to diagnose actual or perceived data losses that might occur in Azure Managed Redis (preview).

- [Partial loss of keys](#partial-loss-of-keys)
  - [Key expiration](#key-expiration)
  - [Key eviction](#key-eviction)
  - [Key deletion](#key-deletion)
  - [Async replication](#async-replication)
- [Major or complete loss of keys](#major-or-complete-loss-of-keys)
  - [Key flushing](#key-flushing)
  - [Redis instance failure](#redis-instance-failure)

> [!NOTE]
> Several of the troubleshooting steps in this guide include instructions to run Redis commands and monitor various performance metrics. For more information and instructions, see the articles in the [Additional information](#additional-information) section.
>

## Partial loss of keys

Azure Managed Redis doesn't randomly delete keys after they've been stored in memory. However, it does remove keys in response to expiration policies, eviction policies, and to explicit key-deletion commands. You can run these commands through the [CLI](managed-redis-how-to-redis-cli-tool.md).

Keys that have been written to the primary node in an Azure Managed Redis instance also might not be available on a replica right away. Data is replicated from the primary to the replica in an asynchronous and non-blocking manner.

If you find that keys have disappeared from your cache, check the following possible causes:

| Cause | Description |
|---|---|
| [Key expiration](#key-expiration) | Keys are removed because of time-outs set on them. |
| [Key eviction](#key-eviction) | Keys are removed under memory pressure. |
| [Key deletion](#key-deletion) | Keys are removed by explicit delete commands. |
| [Async replication](#async-replication) | Keys are not available on a replica because of data-replication delays. |

### Key expiration

Azure Managed Redis removes a key automatically if the key is assigned a time-out and that period has passed. For more information about Redis key expiration, see the [EXPIRE](https://redis.io/commands/expire) command documentation. Time-out values also can be set by using the [SET](https://redis.io/commands/set), [SETEX](https://redis.io/commands/setex), [GETSET](https://redis.io/commands/getset), and other **\*STORE** commands.

To get stats on how many keys have expired, use the [INFO](https://redis.io/commands/info) command. The `Stats` section shows the total number of expired keys. The `Keyspace` section provides more information about the number of keys with time-outs and the average time-out value.

```azurecli-interactive

# Stats

expired_keys:46583

# Keyspace

db0:keys=3450,expires=2,avg_ttl=91861015336
```

You can also look at diagnostic metrics for your cache, to see if there's a correlation between when the key went missing and a spike in expired keys. See the Appendix of [Debugging Redis Keyspace Misses](https://gist.github.com/JonCole/4a249477142be839b904f7426ccccf82#appendix) for information about using `keyspace` notifications or `MONITOR`  to debug these types of issues.

### Key eviction

Azure Managed Redis requires memory space to store data. It purges keys to free up available memory when necessary. When the **used_memory** or **used_memory_rss** values in the [INFO](https://redis.io/commands/info) command approach the configured **maxmemory** setting, Azure Managed Redis starts evicting keys from memory based on [cache policy](https://redis.io/topics/lru-cache).

You can monitor the number of evicted keys by using the [INFO](https://redis.io/commands/info) command:

```azurecli-interactive
# Stats

evicted_keys:13224
```

You can also look at diagnostic metrics for your cache, to see if there's a correlation between when the key went missing and a spike in evicted keys. See the Appendix of [Debugging Redis Keyspace Misses](https://gist.github.com/JonCole/4a249477142be839b904f7426ccccf82#appendix) for information about using keyspace notifications or **MONITOR** to debug these types of issues.

### Key deletion

Redis clients can issue the [DEL](https://redis.io/commands/del) or [HDEL](https://redis.io/commands/hdel) command to explicitly remove keys from Azure Managed Redis. You can track the number of delete operations by using the [INFO](https://redis.io/commands/info) command. If **DEL** or **HDEL** commands have been called, they'll be listed in the `Commandstats` section.

```azurecli-interactive
# Commandstats

cmdstat_del:calls=2,usec=90,usec_per_call=45.00

cmdstat_hdel:calls=1,usec=47,usec_per_call=47.00
```

### Async replication

Any Azure Managed Redis instance with high availability enabled is configured with a primary node and at least one replica. Data is copied from the primary to a replica asynchronously by using a background process. The [redis.io](https://redis.io/topics/replication) website describes how Redis data replication works in general. For scenarios where clients write to Redis frequently, partial data loss can occur because replication is not guaranteed to be instantaneous. For example, if the primary goes down *after* a client writes a key to it, but *before* the background process has a chance to send that key to the replica, the key is lost when the replica takes over as the new primary.

## Major or complete loss of keys

If most or all keys have disappeared from your cache, check the following possible causes:

| Cause | Description |
|---|---|
| [Key flushing](#key-flushing) | Keys have been purged manually. |
| [Redis instance failure](#redis-instance-failure) | The Redis server is unavailable. |

### Key flushing

Clients can call the [FLUSHDB](https://redis.io/commands/flushdb) or [FLUSHALL](https://redis.io/commands/flushall) command to remove all keys from the Redis instance. To find out whether keys have been flushed, use the [INFO](https://redis.io/commands/info) command. The `Commandstats` section shows whether either `FLUSH` command has been called:

```azurecli-interactive
# Commandstats

cmdstat_flushall:calls=2,usec=112,usec_per_call=56.00

cmdstat_flushdb:calls=1,usec=110,usec_per_call=52.00
```

### Redis instance failure

Redis is an in-memory data store. Data is kept on the physical or virtual machines (VM) that host the Redis cache. Azure Managed Redis caches offer high resiliency against data loss by providing Zone Resilient caches by default. When the primary shard in such a cache fails, the replica shard takes over to serve data automatically. These VMs are located on separate domains for faults and updates, to minimize the chance of both becoming unavailable simultaneously. If a major data center outage happens, however, the VMs might still go down together. Your data will be lost in these rare cases.

Consider using [Redis data persistence](https://redis.io/topics/persistence) and [geo-replication](../cache-how-to-geo-replication.md) to improve protection of your data against these infrastructure failures.

## Additional information

These articles provide more information on avoiding data loss:

- [Troubleshoot Azure Managed Redis server-side issues](managed-redis-troubleshoot-server.md)
- [Choosing the right tier](managed-redis-overview.md#choosing-the-right-tier)
- [Monitor Azure Managed Redis](../monitor-cache.md)
- [How can I run Redis commands?](managed-redis-development-faq.yml#how-can-i-run-redis-commands-)
