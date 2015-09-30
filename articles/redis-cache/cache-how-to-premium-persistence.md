<properties 
	pageTitle="How to configure data persistence for a Premium Azure Redis Cache" 
	description="Learn how to configure and manage data persistence your Premium tier Azure Redis Cache instances" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/30/2015" 
	ms.author="sdanie"/>

# How to configure data persistence for a Premium Azure Redis Cache

Azure Redis Cache has different cache offerings which provide flexibility in the choice of cache size and features, including the new Premium tier, currently in preview.

The Azure Redis Cache premium tier includes clustering, persistence, and virtual network support. This article describes how to configure persistence in a premium Azure Redis Cache instance.

For information on other premium cache features, see [How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md) and [How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md).

>[AZURE.NOTE] The Azure Redis Cache Premium tier is currently in preview. During the preview period, persistence cannot be used in conjunction with clustering or virtual networks.

## What is data persistence?
Redis persistence allows you to persist data stored in Redis. You can also take snapshots and back up the data which you can load in case of a hardware failure. This is a huge advantage over Basic or Standard tier where all the data is stored in memory and there can be potential data loss in case of a failure where Cache nodes are down.

Azure Redis Cache offers Redis persistence where the data is stored in a Azure storage account. For the public preview we support the RDB model and will support AOF soon.

## Data persistence
When persistence is configured, Azure Redis Cache persists a snapshot of the Redis cache in a Redis binary format to disk based on a configurable backup frequency. If a catastrophic event occurs that disables both the primary and replica cache, the cache is reconstructed using the most recent snapshot.

Persistence is configured on the **New Redis Cache** blade during cache creation. To create a cache, sign-in to the [Azure preview portal](https://portal.azure.com) and click **New**->**Data + Storage**>**Redis Cache**.

![Create a Redis Cache][redis-cache-new-cache-menu]

To configure persistence, first select one of the **Premium** caches in the **Choose your pricing Tier** blade.

![Choose your pricing tier][redis-cache-premium-pricing-tier]

Once a premium pricing tier is selected, click **Redis persistence**.

![Redis persistence][redis-cache-persistence]

Click **Enabled** to enable RDB (Redis database) backup.

Select a **Backup Frequency** from the drop-down list. Choices include **60 minutes**, **6 hours**, **12 hours**, and **24 hours**. This interval starts counting down after the previous backup operation completes and when it elapses a new backup is initiated.

Click **Storage Account** to select the storage account to use. The **Storage Key** is automatically populated, but if the key is regenerated for the storage account you can update it here. A **Premium Storage** account is recommended because premium storage has higher throughput.

>[AZURE.NOTE] AOF is not available during the premium tier preview period, but the Cache team is working on adding this feature. For more information about RDB and AOF and the advantages of each, see [Redis Persistence](http://redis.io/topics/persistence).

![Redis persistence][redis-cache-persistence-selected]

Click **OK** to save the persistence configuration.

After the cache is created, the first backup is initiated once the backup frequency interval elapses.

## Persistence FAQ

The following list contains answers to commonly asked questions about Azure Redis Cache persistence.

## Can I enable persistence on a previously created cache?

During the preview period you can only enable and configure persistence during the creation process of a premium cache. During the public preview scaling from Basic/Standard to Premium is not supported, but it is coming soon.

## Can I change the backup frequency after I create the cache?

During the preview period you can only configure persistence during the cache creation process. To change the persistence configuration, delete the cache and create a new cache with the desired persistence configuration. This is a limitation of the preview and support for this is coming soon.

## Why if I have a backup frequency of 60 minutes there is more than 60 minutes between backups?

The backup frequency interval does not start until the previous backup process has completed successfully. If the backup frequency is 60 minutes and it takes a backup process 15 minutes to successfully complete, the next backup won't start until 75 minutes after the start time of the previous backup.

## What happens to the old backups when a new backup is made

All backups except for the most recent one are automatically deleted. This deletion may not happen immediately but older backups are not persisted indefinitely.

## Next steps

Learn how to use more premium cache features.
-	[How to configure clustering for a Premium Azure Redis Cache](cache-how-to-premium-clustering.md)
-	[How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md)
  
<!-- IMAGES -->

[redis-cache-new-cache-menu]: ./media/cache-how-to-premium-persistence/redis-cache-new-cache-menu.png

[redis-cache-premium-pricing-tier]: ./media/cache-how-to-premium-persistence/redis-cache-premium-pricing-tier.png

[redis-cache-persistence]: ./media/cache-how-to-premium-persistence/redis-cache-persistence.png

[redis-cache-persistence-selected]: ./media/cache-how-to-premium-persistence/redis-cache-persistence-selected.png
