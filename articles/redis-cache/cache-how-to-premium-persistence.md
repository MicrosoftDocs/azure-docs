<properties 
	pageTitle="How to configure data persistence for a Premium Azure Redis Cache" 
	description="Learn how to configure and manage data persistence your Premium tier Azure Redis Cache instances" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/23/2016" 
	ms.author="sdanie"/>

# How to configure data persistence for a Premium Azure Redis Cache

Azure Redis Cache has different cache offerings which provide flexibility in the choice of cache size and features, including the new Premium tier.

The Azure Redis Cache premium tier includes clustering, persistence, and virtual network support. This article describes how to configure persistence in a premium Azure Redis Cache instance.

For information on other premium cache features, see [How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md) and [How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md).

## What is data persistence?
Redis persistence allows you to persist data stored in Redis. You can also take snapshots and back up the data which you can load in case of a hardware failure. This is a huge advantage over Basic or Standard tier where all the data is stored in memory and there can be potential data loss in case of a failure where Cache nodes are down. 

Azure Redis Cache offers Redis persistence using the [RDB model](http://redis.io/topics/persistence), where the data is stored in an Azure storage account. When persistence is configured, Azure Redis Cache persists a snapshot of the Redis cache in a Redis binary format to disk based on a configurable backup frequency. If a catastrophic event occurs that disables both the primary and replica cache, the cache is reconstructed using the most recent snapshot.

Persistence can be configured from the **New Redis Cache** blade during cache creation and on the **Settings** blade for existing premium caches.

## Create a premium cache

To create a cache and configure persistence, sign-in to the [Azure Portal](https://portal.azure.com) and click **New**->**Data + Storage**>**Redis Cache**.

![Create a Redis Cache][redis-cache-new-cache-menu]

To configure persistence, first select one of the **Premium** caches in the **Choose your pricing Tier** blade.

![Choose your pricing tier][redis-cache-premium-pricing-tier]

Once a premium pricing tier is selected, click **Redis persistence**.

![Redis persistence][redis-cache-persistence]

The steps in the following section describe how to configure Redis persistence on your new premium cache. Once Redis persistence is configured, click **Create** to create your new premium cache with Redis persistence.

## Configure Redis persistence

Redis persistence is configured on the **Redis data persistence** blade. For new caches, this blade is accessed during the cache creation process, as described in the previous section. For existing caches, the **Redis data persistence** blade is accessed from the **Settings** blade for your cache.

![Redis settings][redis-cache-settings]

To enable Redis persistence, click **Enabled** to enable RDB (Redis database) backup. To disable Redis persistence on a previously enabled premium cache, click **Disabled**.

To configure the backup interval, select a **Backup Frequency** from the drop-down list. Choices include **15 Minutes**, **30 minutes**, **60 minutes**, **6 hours**, **12 hours**, and **24 hours**. This interval starts counting down after the previous backup operation successfully completes and when it elapses a new backup is initiated.

Click **Storage Account** to select the storage account to use, and choose either the **Primary key** or **Secondary key** to use from the **Storage Key** drop-down. You must choose a storage account in the same region as the cache, and a **Premium Storage** account is recommended because premium storage has higher throughput. 

>[AZURE.IMPORTANT] If the storage key for your persistence account is regenerated, you must re-choose the desired key from the **Storage Key** drop-down.

![Redis persistence][redis-cache-persistence-selected]

Click **OK** to save the persistence configuration.

The next backup (or first backup for new caches) is initiated once the backup frequency interval elapses.



## Persistence FAQ

The following list contains answers to commonly asked questions about Azure Redis Cache persistence.

-	[Can I enable persistence on a previously created cache?](#can-i-enable-persistence-on-a-previously-created-cache)
-	[Can I change the backup frequency after I create the cache?](#can-i-change-the-backup-frequency-after-i-create-the-cache)
-	[Why if I have a backup frequency of 60 minutes there is more than 60 minutes between backups?](#why-if-i-have-a-backup-frequency-of-60-minutes-there-is-more-than-60-minutes-between-backups)
-	[What happens to the old backups when a new backup is made?](#what-happens-to-the-old-backups-when-a-new-backup-is-made)
-	[What happens if I have scaled to a different size and a backup is restored that was made before the scaling operation?](#what-happens-if-i-have-scaled-to-a-different-size-and-a-backup-is-restored-that-was-made-before-the-scaling-operation)

### Can I enable persistence on a previously created cache?

Yes, Redis persistence can be configured both at cache creation and on existing premium caches.

### Can I change the backup frequency after I create the cache?

Yes, you can change the backup frequency on the **Redis data persistence** blade. For instructions, see [Configure Redis persistence](#configure-redis-persistence).

### Why if I have a backup frequency of 60 minutes there is more than 60 minutes between backups?

The backup frequency interval does not start until the previous backup process has completed successfully. If the backup frequency is 60 minutes and it takes a backup process 15 minutes to successfully complete, the next backup won't start until 75 minutes after the start time of the previous backup.

### What happens to the old backups when a new backup is made?

All backups except for the most recent one are automatically deleted. This deletion may not happen immediately but older backups are not persisted indefinitely.

### What happens if I have scaled to a different size and a backup is restored that was made before the scaling operation?

-	If you have scaled to a larger size there is no impact.
-	If you have scaled to a smaller size and you have a custom [databases](cache-configure.md#databases) setting that is greater than the [databases limit](cache-configure.md#databases) for your new size, data in those databases won't be restored. For more information see [Is my custom databases setting affected during scaling?](#is-my-custom-databases-setting-affected-during-scaling)
-	If you have scaled to a smaller size and there isn't enough room in the smaller size to hold all of the data from the last backup, keys will be evicted during the restore process, typically using the using the [allkeys-lru](http://redis.io/topics/lru-cache) eviction policy.

## Next steps
Learn how to use more premium cache features.

-	[How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md)
-	[How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md)
  
<!-- IMAGES -->

[redis-cache-new-cache-menu]: ./media/cache-how-to-premium-persistence/redis-cache-new-cache-menu.png

[redis-cache-premium-pricing-tier]: ./media/cache-how-to-premium-persistence/redis-cache-premium-pricing-tier.png

[redis-cache-persistence]: ./media/cache-how-to-premium-persistence/redis-cache-persistence.png

[redis-cache-persistence-selected]: ./media/cache-how-to-premium-persistence/redis-cache-persistence-selected.png

[redis-cache-settings]: ./media/cache-how-to-premium-persistence/redis-cache-settings.png