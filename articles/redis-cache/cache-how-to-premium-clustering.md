<properties 
	pageTitle="How to configure clustering for a Premium Azure Redis Cache" 
	description="Learn how to create and manage clustering for your Premium tier Azure Redis Cache instances" 
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

# How to configure clustering for a Premium Azure Redis Cache
Azure Redis Cache has different cache offerings which provide flexibility in the choice of cache size and features, including the new Premium tier, currently in preview.

The Azure Redis Cache premium tier includes clustering, persistence, and virtual network support. This article describes how to configure clustering in a premium Azure Redis Cache instance.

For information on other premium cache features, see [How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md) and [How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md).

>[AZURE.NOTE] The Azure Redis Cache Premium tier is currently in preview.

## Clustering
Clustering is configured on the **New Redis Cache** blade during cache creation. To create a cache, sign-in to the [Azure preview portal](https://portal.azure.com) and click **New**->**Data + Storage**>**Redis Cache**.

![Create a Redis Cache][redis-cache-new-cache-menu]

To configure clustering, first select one of the **Premium** caches in the **Choose your pricing Tier** blade.

![Choose your pricing tier][redis-cache-premium-pricing-tier]

Clustering is configured on the **Redis Cluster** blade.

![Clustering][redis-cache-clustering]

You can have up to 10 shards in the cluster. Each shard is a primary/replica cache pair managed by Azure, and the total size of the cache is calculated by multiplying the number of shards by the cache size selected in the pricing tier. 

Click **Enabled** and slide the slider or type a number between 1 and 10 for **Shard count** and click **OK**.

![Clustering][redis-cache-clustering-selected]

Once the cache is created you connect to it and use it just like a non-clustered cache, and Redis will distribute the data throughout the Cache shards.

## Clustering FAQ

The following list contains answers to commonly asked questions about Azure Redis Cache clustering.

## What is the largest cache size I can create?

The largest premium cache size is 53 GB. You can create up to 10 shards giving you a maximum size of 530 GB. If you need a larger size you can request more. For more information, see [Azure Redis Cache Pricing](https://azure.microsoft.com/pricing/details/cache/).

## Do all Redis clients support clustering

At the present time not all clients support Redis clustering. StackExchange.Redis is one that does support for it. For more information on other clients, see the [Playing with the cluster](http://redis.io/topics/cluster-tutorial#playing-with-the-cluster) section of the [Redis cluster tutorial](http://redis.io/topics/cluster-tutorial).

## Can I directly connect to the individual shards of my cache?

This is not officially supported. With that said, each shard consists of a primary/replica cache pair that are collectively known as a cache instance. You can connect to these cache instances using redis-cli.exe using the following pattern.

For non-ssl use the following commands.

	Redis-cli.exe –h <<cachename>> -p 13000 (to connect to instance 0)
	Redis-cli.exe –h <<cachename>> -p 13001 (to connect to instance 1)
	Redis-cli.exe –h <<cachename>> -p 13002 (to connect to instance 2)
	...
	Redis-cli.exe –h <<cachename>> -p 1300N (to connect to instance N)

For ssl, replace `1300N` with `1500N`.

## Can I configure clustering for a previously created cache?

During the preview period you can only enable and configure clustering when you create a cache.

## Can I configure clustering for a basic or standard cache?

Clustering is only available for premium caches.

## Next steps

Learn how to use more premium cache features.
-	[How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md)
-	[How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md)
  
<!-- IMAGES -->

[redis-cache-new-cache-menu]: ./media/cache-how-to-premium-clustering/redis-cache-new-cache-menu.png

[redis-cache-premium-pricing-tier]: ./media/cache-how-to-premium-clustering/redis-cache-premium-pricing-tier.png

[NewCacheMenu]: ./media/cache-how-to-premium-clustering/redis-cache-new-cache-menu.png

[CacheCreate]: ./media/cache-how-to-premium-clustering/redis-cache-cache-create.png

[redis-cache-premium-pricing-group]: ./media/cache-how-to-premium-clustering/redis-cache-premium-pricing-group.png

[redis-cache-premium-features]: ./media/cache-how-to-premium-clustering/redis-cache-premium-features.png

[redis-cache-clustering]: ./media/cache-how-to-premium-clustering/redis-cache-clustering.png

[redis-cache-clustering-selected]: ./media/cache-how-to-premium-clustering/redis-cache-clustering-selected.png

