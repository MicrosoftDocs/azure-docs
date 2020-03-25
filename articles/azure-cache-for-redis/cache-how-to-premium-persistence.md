---
title: Configure data persistence - Premium Azure Cache for Redis
description: Learn how to configure and manage data persistence your Premium tier Azure Cache for Redis instances
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: conceptual
ms.date: 08/24/2017
---
# How to configure data persistence for a Premium Azure Cache for Redis
Azure Cache for Redis has different cache offerings which provide flexibility in the choice of cache size and features, including Premium tier features such as clustering, persistence, and virtual network support. This article describes how to configure persistence in a premium Azure Cache for Redis instance.

For information on other premium cache features, see [Introduction to the Azure Cache for Redis Premium tier](cache-premium-tier-intro.md).

## What is data persistence?
[Redis persistence](https://redis.io/topics/persistence) allows you to persist data stored in Redis. You can also take snapshots and back up the data, which you can load in case of a hardware failure. This is a huge advantage over Basic or Standard tier where all the data is stored in memory and there can be potential data loss in case of a failure where Cache nodes are down. 

Azure Cache for Redis offers Redis persistence using the following models:

* **RDB persistence** - When RDB (Redis database) persistence is configured, Azure Cache for Redis persists a snapshot of the Azure Cache for Redis in a Redis binary format to disk based on a configurable backup frequency. If a catastrophic event occurs that disables both the primary and replica cache, the cache is reconstructed using the most recent snapshot. Learn more about the [advantages](https://redis.io/topics/persistence#rdb-advantages) and [disadvantages](https://redis.io/topics/persistence#rdb-disadvantages) of RDB persistence.
* **AOF persistence** - When AOF (Append only file) persistence is configured, Azure Cache for Redis saves every write operation to a log that is saved at least once per second into an Azure Storage account. If a catastrophic event occurs that disables both the primary and replica cache, the cache is reconstructed using the stored write operations. Learn more about the [advantages](https://redis.io/topics/persistence#aof-advantages) and [disadvantages](https://redis.io/topics/persistence#aof-disadvantages) of AOF persistence.

Persistence writes Redis data into an Azure Storage account that you own and manage. You can configure from the **New Azure Cache for Redis** blade during cache creation and on the **Resource menu** for existing premium caches.

> [!NOTE]
> 
> Azure Storage automatically encrypts data when it is persisted. You can use your own keys for the encryption. For more information, see [Customer-managed keys with Azure Key Vault](/azure/storage/common/storage-service-encryption).
> 
> 

[!INCLUDE [redis-cache-create](../../includes/redis-cache-premium-create.md)]

Once a premium pricing tier is selected, click **Redis persistence**.

![Redis persistence][redis-cache-persistence]

The steps in the next section describe how to configure Redis persistence on your new premium cache. Once Redis persistence is configured, click **Create** to create your new premium cache with Redis persistence.

## Enable Redis persistence

Redis persistence is enabled on the **Data persistence** blade by choosing either **RDB** or **AOF** persistence. For new caches, this blade is accessed during the cache creation process, as described in the previous section. For existing caches, the **Data persistence** blade is accessed from the **Resource menu** for your cache.

![Redis settings][redis-cache-settings]


## Configure RDB persistence

To enable RDB persistence, click **RDB**. To disable RDB persistence on a previously enabled premium cache, click **Disabled**.

![Redis RDB persistence][redis-cache-rdb-persistence]

To configure the backup interval, select a **Backup Frequency** from the drop-down list. Choices include **15 Minutes**, **30 minutes**, **60 minutes**, **6 hours**, **12 hours**, and **24 hours**. This interval starts counting down after the previous backup operation successfully completes and when it elapses a new backup is initiated.

Click **Storage Account** to select the storage account to use, and choose either the **Primary key** or **Secondary key** to use from the **Storage Key** drop-down. You must choose a storage account in the same region as the cache, and a **Premium Storage** account is recommended because premium storage has higher throughput. 

> [!IMPORTANT]
> If the storage key for your persistence account is regenerated, you must reconfigure the desired key from the **Storage Key** drop-down.
> 
> 

Click **OK** to save the persistence configuration.

The next backup (or first backup for new caches) is initiated once the backup frequency interval elapses.

## Configure AOF persistence

To enable AOF persistence, click **AOF**. To disable AOF persistence on a previously enabled premium cache, click **Disabled**.

![Redis AOF persistence][redis-cache-aof-persistence]

To configure AOF persistence, specify a **First Storage Account**. This storage account must be in the same region as the cache, and a **Premium Storage** account is recommended because premium storage has higher throughput. You can optionally configure an additional storage account named **Second Storage Account**. If a second storage account is configured, the writes to the replica cache are written to this second storage account. For each configured storage account, choose either the **Primary key** or **Secondary key** to use from the **Storage Key** drop-down. 

> [!IMPORTANT]
> If the storage key for your persistence account is regenerated, you must reconfigure the desired key from the **Storage Key** drop-down.
> 
> 

When AOF persistence is enabled, write operations to the cache are saved to the designated storage account (or accounts if you have configured a second storage account). In the event of a catastrophic failure that takes down both the primary and replica cache, the stored AOF log is used to rebuild the cache.

## Persistence FAQ
The following list contains answers to commonly asked questions about Azure Cache for Redis persistence.

* [Can I enable persistence on a previously created cache?](#can-i-enable-persistence-on-a-previously-created-cache)
* [Can I enable AOF and RDB persistence at the same time?](#can-i-enable-aof-and-rdb-persistence-at-the-same-time)
* [Which persistence model should I choose?](#which-persistence-model-should-i-choose)
* [What happens if I have scaled to a different size and a backup is restored that was made before the scaling operation?](#what-happens-if-i-have-scaled-to-a-different-size-and-a-backup-is-restored-that-was-made-before-the-scaling-operation)


### RDB persistence
* [Can I change the RDB backup frequency after I create the cache?](#can-i-change-the-rdb-backup-frequency-after-i-create-the-cache)
* [Why if I have an RDB backup frequency of 60 minutes there is more than 60 minutes between backups?](#why-if-i-have-an-rdb-backup-frequency-of-60-minutes-there-is-more-than-60-minutes-between-backups)
* [What happens to the old RDB backups when a new backup is made?](#what-happens-to-the-old-rdb-backups-when-a-new-backup-is-made)

### AOF persistence
* [When should I use a second storage account?](#when-should-i-use-a-second-storage-account)
* [Does AOF persistence affect throughout, latency, or performance of my cache?](#does-aof-persistence-affect-throughout-latency-or-performance-of-my-cache)
* [How can I remove the second storage account?](#how-can-i-remove-the-second-storage-account)
* [What is a rewrite and how does it affect my cache?](#what-is-a-rewrite-and-how-does-it-affect-my-cache)
* [What should I expect when scaling a cache with AOF enabled?](#what-should-i-expect-when-scaling-a-cache-with-aof-enabled)
* [How is my AOF data organized in storage?](#how-is-my-aof-data-organized-in-storage)


### Can I enable persistence on a previously created cache?
Yes, Redis persistence can be configured both at cache creation and on existing premium caches.

### Can I enable AOF and RDB persistence at the same time?

No, you can enable only RDB or AOF, but not both at the same time.

### Which persistence model should I choose?

AOF persistence saves every write to a log, which has some impact on throughput, compared with RDB persistence which saves backups based on the configured backup interval, with minimal impact on performance. Choose AOF persistence if your primary goal is to minimize data loss, and you can handle a decrease in throughput for your cache. Choose RDB persistence if you wish to maintain optimal throughput on your cache, but still want a mechanism for data recovery.

* Learn more about the [advantages](https://redis.io/topics/persistence#rdb-advantages) and [disadvantages](https://redis.io/topics/persistence#rdb-disadvantages) of RDB persistence.
* Learn more about the [advantages](https://redis.io/topics/persistence#aof-advantages) and [disadvantages](https://redis.io/topics/persistence#aof-disadvantages) of AOF persistence.

For more information on performance when using AOF persistence, see [Does AOF persistence affect throughout, latency, or performance of my cache?](#does-aof-persistence-affect-throughout-latency-or-performance-of-my-cache)

### What happens if I have scaled to a different size and a backup is restored that was made before the scaling operation?

For both RDB and AOF persistence:

* If you have scaled to a larger size, there is no impact.
* If you have scaled to a smaller size, and you have a custom [databases](cache-configure.md#databases) setting that is greater than the [databases limit](cache-configure.md#databases) for your new size, data in those databases isn't restored. For more information, see [Is my custom databases setting affected during scaling?](cache-how-to-scale.md#is-my-custom-databases-setting-affected-during-scaling)
* If you have scaled to a smaller size, and there isn't enough room in the smaller size to hold all of the data from the last backup, keys will be evicted during the restore process, typically using the [allkeys-lru](https://redis.io/topics/lru-cache) eviction policy.

### Can I change the RDB backup frequency after I create the cache?
Yes, you can change the backup frequency for RDB persistence on the **Data persistence** blade. For instructions, see Configure Redis persistence.

### Why if I have an RDB backup frequency of 60 minutes there is more than 60 minutes between backups?
The RDB persistence backup frequency interval does not start until the previous backup process has completed successfully. If the backup frequency is 60 minutes and it takes a backup process 15 minutes to successfully complete, the next backup won't start until 75 minutes after the start time of the previous backup.

### What happens to the old RDB backups when a new backup is made?
All RDB persistence backups except for the most recent one are automatically deleted. This deletion may not happen immediately but older backups are not persisted indefinitely.


### When should I use a second storage account?

You should use a second storage account for AOF persistence when you believe you have higher than expected set operations on the cache.  Setting up the secondary storage account helps ensure your cache doesn't reach storage bandwidth limits.

### Does AOF persistence affect throughout, latency, or performance of my cache?

AOF persistence affects throughput by about 15% – 20% when the cache is below maximum load (CPU and Server Load both under 90%). There should not be latency issues when the cache is within these limits. However, the cache will reach these limits sooner with AOF enabled.

### How can I remove the second storage account?

You can remove the AOF persistence secondary storage account by setting the second storage account to be the same as the first storage account. For instructions, see [Configure AOF persistence](#configure-aof-persistence).

### What is a rewrite and how does it affect my cache?

When the AOF file becomes large enough, a rewrite is automatically queued on the cache. The rewrite resizes the AOF file with the minimal set of operations needed to create the current data set. During rewrites, expect to reach performance limits sooner especially when dealing with large datasets. Rewrites occur less often as the AOF file becomes larger, but will take a significant amount of time when it happens.

### What should I expect when scaling a cache with AOF enabled?

If the AOF file at the time of scaling is significantly large, then expect the scale operation to take longer than expected since it will be reloading the file after scaling has finished.

For more information on scaling, see [What happens if I have scaled to a different size and a backup is restored that was made before the scaling operation?](#what-happens-if-i-have-scaled-to-a-different-size-and-a-backup-is-restored-that-was-made-before-the-scaling-operation)

### How is my AOF data organized in storage?

Data stored in AOF files is divided into multiple page blobs per node to increase performance of saving the data to storage. The following table displays how many page blobs are used for each pricing tier:

| Premium tier | Blobs |
|--------------|-------|
| P1           | 4 per shard    |
| P2           | 8 per shard    |
| P3           | 16 per shard   |
| P4           | 20 per shard   |

When clustering is enabled, each shard in the cache has its own set of page blobs, as indicated in the previous table. For example, a P2 cache with three shards distributes its AOF file across 24 page blobs (8 blobs per shard, with 3 shards).

After a rewrite, two sets of AOF files exist in storage. Rewrites occur in the background and append to the first set of files, while set operations that are sent to the cache during the rewrite append to the second set. A backup is temporarily stored during rewrites in case of failure, but is promptly deleted after a rewrite finishes.


## Next steps
Learn how to use more premium cache features.

* [Introduction to the Azure Cache for Redis Premium tier](cache-premium-tier-intro.md)

<!-- IMAGES -->

[redis-cache-premium-pricing-tier]: ./media/cache-how-to-premium-persistence/redis-cache-premium-pricing-tier.png

[redis-cache-persistence]: ./media/cache-how-to-premium-persistence/redis-cache-persistence.png

[redis-cache-rdb-persistence]: ./media/cache-how-to-premium-persistence/redis-cache-rdb-persistence.png

[redis-cache-aof-persistence]: ./media/cache-how-to-premium-persistence/redis-cache-aof-persistence.png

[redis-cache-settings]: ./media/cache-how-to-premium-persistence/redis-cache-settings.png
