---
title: Troubleshoot data loss in Azure Managed Redis
description: Learn how to resolve data-loss problems with Azure Managed Redis, such as partial loss of keys, key expiration, or complete loss of keys.
ms.date: 05/18/2025
ms.topic: conceptual
ms.custom:
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Managed Redis
---

# Troubleshoot data loss in Azure Managed Redis

This article explains how to diagnose actual or perceived data loss that can occur in Azure Managed Redis.

- [Partial loss of keys](#partial-loss-of-keys)
  - [Key expiration](#key-expiration)
  - [Key eviction](#key-eviction)
  - [Key deletion](#key-deletion)
  - [Async replication](#async-replication)
- [Major or complete loss of keys](#major-or-complete-loss-of-keys)
  - [Key flushing](#key-flushing)
  - [Redis instance failure](#redis-instance-failure)

> [!NOTE]
> Some troubleshooting steps in this guide include instructions to run Redis commands and monitor performance metrics. For more information, see the articles in [Related content](#related-content).
>

## Partial loss of keys

Azure Managed Redis doesn't randomly delete keys after storing them in memory. It removes keys because of expiration policies, eviction policies, or explicit key deletion commands. Run these commands by using the [CLI](how-to-redis-cli-tool.md).
Keys written to the primary node in an Azure Managed Redis instance might not be available on a replica right away. Data replicates from the primary to the replica asynchronously and in a nonblocking manner.

If keys disappear from your cache, check the following possible causes:

| Cause | Description |
|---|---|
| [Key expiration](#key-expiration) | Keys are removed because of timeouts set on them. |
| [Key eviction](#key-eviction) | Keys are removed when memory is low. |
| [Key deletion](#key-deletion) | Clients remove keys by running explicit delete commands. |
| [Async replication](#async-replication) | Keys aren't available on a replica because of data replication delays. |

### Key expiration

Azure Managed Redis removes a key automatically when the timeout for that key passes. For more information about Redis key expiration, see the [EXPIRE](https://redis.io/commands/expire) command documentation. You can also set timeout values by using the [SET](https://redis.io/commands/set), [SETEX](https://redis.io/commands/setex), [GETSET](https://redis.io/commands/getset), and other **\*STORE** commands.

To see how many keys expired, use the [INFO](https://redis.io/commands/info) command. The `Stats` section shows the total number of expired keys. The `Keyspace` section gives more information about the number of keys with timeouts and the average timeout value.

```azurecli-interactive

# Stats

expired_keys:46583

# Keyspace

db0:keys=3450,expires=2,avg_ttl=91861015336
```

Check the diagnostic metrics for your cache to see if there's a correlation between when the key went missing and a spike in evicted keys.

### Key eviction

Azure Managed Redis needs memory space to store data. It removes keys to free up memory when needed. When the **used_memory** or **used_memory_rss** values in the [INFO](https://redis.io/commands/info) command approach the configured **maxmemory** setting, Azure Managed Redis starts evicting keys from memory based on [cache policy](https://redis.io/topics/lru-cache).

Monitor the number of evicted keys by using the [INFO](https://redis.io/commands/info) command:

```azurecli-interactive
# Stats

evicted_keys:13224
```

### Key deletion

Redis clients run the [DEL](https://redis.io/commands/del) or [HDEL](https://redis.io/commands/hdel) command to remove keys from Azure Managed Redis. Track the number of delete operations by using the [INFO](https://redis.io/commands/info) command. If **DEL** or **HDEL** commands ran, they're listed in the `Commandstats` section.

```azurecli-interactive
# Commandstats

cmdstat_del:calls=2,usec=90,usec_per_call=45.00

cmdstat_hdel:calls=1,usec=47,usec_per_call=47.00
```

### Async replication

When you enable high availability in Azure Managed Redis, the service creates a primary node and at least one replica. The system copies data from the primary to the replica asynchronously using a background process. See the [Redis replication documentation](https://redis.io/topics/replication) for more details.

Because replication isn't instantaneous, you might experience partial data loss if clients write to Redis frequently. For example, if the primary node fails after a client writes a key but before the background process replicates it, the key is lost when the replica becomes the new primary.

## Major or complete loss of keys

If most or all keys disappear from your cache, check these possible causes:

| Cause | Description |
|---|---|
| [Key flushing](#key-flushing) | Someone purged the keys manually. |
| [Redis instance failure](#redis-instance-failure) | The Redis server isn't available. |

### Key flushing

Clients can call the [FLUSHDB](https://redis.io/commands/flushdb) or [FLUSHALL](https://redis.io/commands/flushall) command to remove all keys from the Redis instance. To check if keys are flushed, use the [INFO](https://redis.io/commands/info) command. The `Commandstats` section shows if either `FLUSH` command runs:

```azurecli-interactive
# Commandstats

cmdstat_flushall:calls=2,usec=112,usec_per_call=56.00

cmdstat_flushdb:calls=1,usec=110,usec_per_call=52.00
```

### Redis instance failure

Redis is an in-memory data store. Data stays on the physical or virtual machines (VM) that host the Redis cache. Azure Managed Redis caches offer high resiliency against data loss by providing zone resilient caches by default. When the primary shard in this cache fails, the replica shard automatically takes over to serve data. These VMs are in separate domains for faults and updates, which minimizes the chance of both becoming unavailable at the same time. If a major data center outage happens, the VMs can still go down together. In these rare cases, you lose your data.

Use [Redis data persistence](https://redis.io/topics/persistence) and [geo-replication](how-to-active-geo-replication.md) to better protect your data against these infrastructure failures.

## Related content

- [Troubleshoot Azure Managed Redis server-side issues](troubleshoot-server.md)
- [Choosing the right tier](overview.md#choosing-the-right-tier)
- [Monitor Azure Managed Redis](monitor-cache.md)
- [How can I run Redis commands?](development-faq.yml#how-can-i-run-redis-commands-)
