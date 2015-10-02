<properties 
	pageTitle="How to configure Redis clustering for a Premium Azure Redis Cache" 
	description="Learn how to create and manage Redis clustering for your Premium tier Azure Redis Cache instances" 
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
	ms.date="10/02/2015" 
	ms.author="sdanie"/>

# How to configure Redis clustering for a Premium Azure Redis Cache
Azure Redis Cache has different cache offerings which provide flexibility in the choice of cache size and features, including the new Premium tier, currently in preview.

The Azure Redis Cache premium tier includes clustering, persistence, and virtual network support. This article describes how to configure clustering in a premium Azure Redis Cache instance.

For information on other premium cache features, see [How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md) and [How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md).

>[AZURE.NOTE] The Azure Redis Cache Premium tier is currently in preview.

## What is Redis Cluster?
Azure Redis Cache offers Redis cluster as [implemented in Redis](http://redis.io/topics/cluster-tutorial). With Redis Cluster, you get the following benefits. 

-	The ability to automatically split your dataset among multiple nodes. 
-	The ability to continue operations when a subset of the nodes are experiencing failures or are unable to communicate with the rest of the cluster. 
-	More throughput: Throughput increases linearly as you increase the number of shards. 
-	More memory size: Increases linearly as you increase the number of shards.  

Please see the [Azure Redis Cache FAQ](cache-faq.md#what-redis-cache-offering-and-size-should-i-use) for more details about size, throughput, and bandwidth with premium caches. 

In Azure, Redis cluster is offered as a primary/replica model where each shard has a primary/replica pair with replication where the replication is managed by Azure Redis Cache service. 

## Clustering
Clustering is configured on the **New Redis Cache** blade during cache creation. To create a cache, sign-in to the [Azure preview portal](https://portal.azure.com) and click **New**->**Data + Storage**>**Redis Cache**.

![Create a Redis Cache][redis-cache-new-cache-menu]

To configure clustering, first select one of the **Premium** caches in the **Choose your pricing Tier** blade.

![Choose your pricing tier][redis-cache-premium-pricing-tier]

Clustering is configured on the **Redis Cluster** blade.

![Clustering][redis-cache-clustering]

You can have up to 10 shards in the cluster. Click **Enabled** and slide the slider or type a number between 1 and 10 for **Shard count** and click **OK**.

Each shard is a primary/replica cache pair managed by Azure, and the total size of the cache is calculated by multiplying the number of shards by the cache size selected in the pricing tier. 

![Clustering][redis-cache-clustering-selected]

Once the cache is created you connect to it and use it just like a non-clustered cache, and Redis will distribute the data throughout the Cache shards. If diagnostics is [enabled](cache-how-to-monitor.md#enable-cache-diagnostics), metrics are captured separately for each shard and can be [viewed](cache-how-to-monitor.md) in the Redis Cache blade. 

## Clustering FAQ

The following list contains answers to commonly asked questions about Azure Redis Cache clustering.

## Do I need to make any changes to my client application to use clustering?

-	When clustering is enabled, only database 0 is available. If your client application uses multiple databases and it tries to read or write to a database other than 0, the following exception is thrown. `Unhandled Exception: StackExchange.Redis.RedisConnectionException: ProtocolFailure on GET --->` `StackExchange.Redis.RedisCommandException: Multiple databases are not supported on this server; cannot switch to database: 6`
-	If you are using [StackExchange.Redis](https://www.nuget.org/packages/StackExchange.Redis/) you must use 1.0.481 or later. You connect to the cache using the same [endpoints, ports, and keys](cache-configure.md#properties) that you use when connecting to a cache that does not have clustering enabled. The only difference is that all reads and writes must be done to database 0.
	-	Other clients may have different requirements. See [Do all Redis clients support clustering?](#do-all-redis-clients-support-clustering).
-	If your application uses multiple key operations batched into a single command, all keys must be located in the same shard. To accomplish this, see [How are keys distributed in a cluster?](#how-are-keys-distributed-in-a-cluster).
-	If you are using Redis ASP.NET Session State provider you must use 2.0.0 or higher. See [Can I use clustering with the Redis ASP.NET Session State and Output Caching providers?](#can-i-use-clustering-with-the-redis-asp.net-session-state-and-output-caching-providers).

## How are keys distributed in a cluster?

Per the Redis [Keys distribution model](http://redis.io/topics/cluster-spec#keys-distribution-model) documentation: The key space is split into 16384 slots. Each key is hashed and assigned to one of these slots, which are distributed across the nodes of the cluster. You can configure which part of the key is hashed to ensure that multiple keys are located in the same shard using hash tags.

-	Keys with a hash tag - if any part of the key is enclosed in `{` and `}`, only that part of the key is hashed for the purposes of determining the hash slot of a key. For example, the following 3 keys would be located in the same shard: `{key}1`, `{key}2`, and `{key}3` since only the `key` part of the name is hashed. For a complete list of keys hash tag specifications, see [Keys hash tags](http://redis.io/topics/cluster-spec#keys-hash-tags).
-	Keys without a hash tag - the entire key name is used for hashing. This results in a statistically even distribution across the shards of the cache.

For best performance and throughput, we recommend to distribute the keys evenly. If you are using keys with a hash tag it is the application's responsibility to ensure the keys are distributed evenly.

For more information, see [Keys distribution model](http://redis.io/topics/cluster-spec#keys-distribution-model), [Redis Cluster data sharding](http://redis.io/topics/cluster-tutorial#redis-cluster-data-sharding), and [Keys hash tags](http://redis.io/topics/cluster-spec#keys-hash-tags).

## What is the largest cache size I can create?

The largest premium cache size is 53 GB. You can create up to 10 shards giving you a maximum size of 530 GB. If you need a larger size you can [request more](mailto:wapteams@microsoft.com?subject=Redis%20Cache%20quota%20increase). For more information, see [Azure Redis Cache Pricing](https://azure.microsoft.com/pricing/details/cache/).

## Do all Redis clients support clustering?

At the present time not all clients support Redis clustering. StackExchange.Redis is one that does support for it. For more information on other clients, see the [Playing with the cluster](http://redis.io/topics/cluster-tutorial#playing-with-the-cluster) section of the [Redis cluster tutorial](http://redis.io/topics/cluster-tutorial).

>[AZURE.NOTE] If you are using StackExchange.Redis as your client, ensure you are using the latest version of [StackExchange.Redis](https://www.nuget.org/packages/StackExchange.Redis/) 1.0.481 or later for clustering to work correctly.

## How do I connect to my cache when clustering is enabled?

You can connect to your cache using the same [endpoints, ports, and keys](cache-configure.md#properties) that you use when connecting to a cache that does not have clustering enabled. Redis manages the clustering on the backend so you don't have to manage it from your client.

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

## Can I use clustering with the Redis ASP.NET Session State and Output Caching providers?

-	**Redis Output Cache provider** - no changes required.
-	**Redis Session State provider** - to use clustering, you must use [RedisSessionStateProvider](https://www.nuget.org/packages/Microsoft.Web.RedisSessionStateProvider) 2.0.0 or higher or an exception is thrown. This is a breaking change; for more information see [v2.0.0 Breaking Change Details](https://github.com/Azure/aspnet-redis-providers/wiki/v2.0.0-Breaking-Change-Details).

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

