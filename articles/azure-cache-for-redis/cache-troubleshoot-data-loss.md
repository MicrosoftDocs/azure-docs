---
title: Troubleshoot Azure Cache for Redis data loss | Microsoft Docs
description: Learn how to resolve data loss issues with Azure Cache for Redis
services: cache
documentationcenter: ''
author: yegu-ms
manager: maiye
editor: ''

ms.assetid:
ms.service: cache
ms.workload: tbd
ms.tgt_pltfrm: cache
ms.devlang: na
ms.topic: article
ms.date: 10/17/2019
ms.author: yegu

---

# Troubleshoot Azure Cache for Redis data loss

This section discusses how to diagnose actual or perceived data losses that may occur in Azure Cache for Redis.

- [Partial loss of keys](#partial-loss-of-keys)
- [Major or complete loss of keys](#major-or-complete-loss-of-keys)

> [!NOTE]
> Several of the troubleshooting steps in this guide include instructions to run Redis commands and monitor various performance metrics. For more information and instructions, see the articles in the [Additional information](#additional-information) section.
>

## Partial loss of keys

Redis doesn't randomly delete keys once they have been stored in memory. It will remove keys, however, in response to expiration or eviction policies as well as explicit key deletion commands. In addition, keys that have been written to the master node in a Premium or Standard Azure Cache for Redis may not be available on a replica right away. Data are replicated from the master to the replica in an asynchronous and non-blocking manner.

If you find that keys have disappeared from your cache, you can check the following to see which may be the cause:

| Cause | Description |
|---|---|
| [Key expiration](#key-expiration) | Keys are removed due to timeouts set on them |
| [Key eviction](#key-eviction) | Keys are removed under memory pressure |
| [Key deletion](#key-deletion) | Keys are removed by explicit delete commands |
| [Async replication](#async-replication) | Keys are not available on a replica due to data replication delays |

### Key expiration

Redis will remove a key automatically if it is assigned a timeout and that period has passed. You can find more details around Redis key expiration in the [EXPIRE](http://redis.io/commands/expire) command documentation. Timeout values also can be set through [SET](http://redis.io/commands/set), [SETEX](https://redis.io/commands/setex), [GETSET](https://redis.io/commands/getset), and other \*STORE commands.

You can use the [INFO](http://redis.io/commands/info) command to get stats on how many keys have expired. The *Stats* section shows the total number of expired keys. The *Keyspace* section provides additional information on the number of keys with timeouts and the average timeout value.

```
# Stats

expired_keys:46583

# Keyspace

db0:keys=3450,expires=2,avg_ttl=91861015336
```

Furthermore, you can look at diagnostic metrics for your cache to see if there is a correlation between when the key went missing and a spike in expired keys. See the [Appendix](https://gist.github.com/JonCole/4a249477142be839b904f7426ccccf82#appendix) for information on using Keyspace Notifications or MONITOR to debug these types of issues.

### Key eviction

Redis requires memory space to store data. It will purge keys to free up available memory when necessary. When the **used_memory** or **used_memory_rss** values in the [INFO](http://redis.io/commands/info) command approach the configured **maxmemory** setting, Redis will start evicting keys from memory based on [cache policy](http://redis.io/topics/lru-cache).

You can monitor the number of keys evicted using the [INFO](http://redis.io/commands/info) command.

```
# Stats

evicted_keys:13224
```

Furthermore, you can look at diagnostic metrics for your cache to see if there is a correlation between when the key went missing and a spike in evicted keys. See the [Appendix](https://gist.github.com/JonCole/4a249477142be839b904f7426ccccf82#appendix) for information on using Keyspace Notifications or MONITOR to debug these types of issues.

### Key deletion

Redis clients can issue the [DEL](http://redis.io/commands/del) or [HDEL](http://redis.io/commands/hdel) command to explicitly remove keys from Redis. You can track the number of delete operations using the [INFO](http://redis.io/commands/info) command. If DEL or HDEL commands have been called, they will be listed in the *Commandstats* section.

```
# Commandstats

cmdstat_del:calls=2,usec=90,usec_per_call=45.00

cmdstat_hdel:calls=1,usec=47,usec_per_call=47.00
```

### Async replication

Any Azure Cache for Redis in the Standard or Premium tier is configured with a master node and at least one replica. Data is copied from the master to a replica asynchronously using a background process. The [redis.io](http://redis.io/topics/replication) website describes how Redis data replication works in general. For scenarios where clients are writing to Redis frequently, partial data loss can occur due to the fact that this replication is guaranteed to be instantaneous. For instance, if the master goes down _after_ a client writes a key to it but _before_ the background process has a chance to send this key to the replica, the key is lost when the replica takes over as the new master.

## Major or complete loss of keys

If you find that most of or all keys have disappeared from your cache, you can check the following to see which may be the cause:

| Cause | Description |
|---|---|
| [Key flushing](#key-flushing) | Keys have been manually purged |
| [Incorrect database selection](#incorrect-database-selection) | Redis is set to use a non-default database |
| [Redis instance failure](#redis-instance-failure) | Redis server is unavailable |

### Key flushing

Clients can call the [FLUSHDB](http://redis.io/commands/flushdb) command to remove all keys in a **single** database or [FLUSHALL](http://redis.io/commands/flushall) to remove all keys from **all** databases in a Redis cache. You can find out whether keys have been flushed using the [INFO](http://redis.io/commands/info) command. It will show if either FLUSH command has been called in the *Commandstats* section.

```
# Commandstats

cmdstat_flushall:calls=2,usec=112,usec_per_call=56.00

cmdstat_flushdb:calls=1,usec=110,usec_per_call=52.00
```

### Incorrect database selection

Azure Cache for Redis uses the **db0** database by default. If you switch to another database (e.g., db1) and try to read keys from it, Redis won't find them there because every database is a logically separate unit and holds a different data set. Use the [SELECT](http://redis.io/commands/select) command to use other available databases and look for keys in each of them.

### Redis instance failure

Redis is an in-memory data store. Data are kept on the physical or virtual machines that host Redis. An Azure Cache for Redis instance in the Basic tier runs on only a single virtual machine (VM). If that VM is down, all data that you've stored in the cache is lost. Caches in the Standard and Premium tiers offer much higher resiliency against data loss by using two VMs in a replicated configuration. When the master node in such a cache fails, the replica node will take over to serve data automatically. These VMs are located on separate fault and update domains to minimize the chance of both becoming unavailable simultaneously. In the event of a major datacenter outage, however, the VMs can still go down together. Your data will be lost in these rare cases.

You should consider using [Redis data persistence](http://redis.io/topics/persistence) and [geo-replication](https://docs.microsoft.com/azure/azure-cache-for-redis/cache-how-to-geo-replication) to improve protection of your data against these infrastructure failures.

## Additional information

- [Troubleshoot Azure Cache for Redis server-side issues](cache-troubleshoot-server.md)
- [What Azure Cache for Redis offering and size should I use?](cache-faq.md#what-azure-cache-for-redis-offering-and-size-should-i-use)
- [How to monitor Azure Cache for Redis](cache-how-to-monitor.md)
- [How can I run Redis commands?](cache-faq.md#how-can-i-run-redis-commands)
