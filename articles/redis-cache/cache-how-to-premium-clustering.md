<properties 
	pageTitle="How to configure Redis clustering for a Premium Azure Redis Cache | Microsoft Azure" 
	description="Learn how to create and manage Redis clustering for your Premium tier Azure Redis Cache instances" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/22/2016" 
	ms.author="sdanie"/>

# How to configure Redis clustering for a Premium Azure Redis Cache
Azure Redis Cache has different cache offerings which provide flexibility in the choice of cache size and features, including the new Premium tier.

The Azure Redis Cache premium tier includes clustering, persistence, and virtual network support. This article describes how to configure clustering in a premium Azure Redis Cache instance.

For information on other premium cache features, see [How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md) and [How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md).

## What is Redis Cluster?
Azure Redis Cache offers Redis cluster as [implemented in Redis](http://redis.io/topics/cluster-tutorial). With Redis Cluster, you get the following benefits. 

-	The ability to automatically split your dataset among multiple nodes. 
-	The ability to continue operations when a subset of the nodes are experiencing failures or are unable to communicate with the rest of the cluster. 
-	More throughput: Throughput increases linearly as you increase the number of shards. 
-	More memory size: Increases linearly as you increase the number of shards.  

Please see the [Azure Redis Cache FAQ](cache-faq.md#what-redis-cache-offering-and-size-should-i-use) for more details about size, throughput, and bandwidth with premium caches. 

In Azure, Redis cluster is offered as a primary/replica model where each shard has a primary/replica pair with replication where the replication is managed by Azure Redis Cache service. 

## Clustering
Clustering is enabled on the **New Redis Cache** blade during cache creation. 

[AZURE.INCLUDE [redis-cache-create](../../includes/redis-cache-premium-create.md)]

Clustering is configured on the **Redis Cluster** blade.

![Clustering][redis-cache-clustering]

You can have up to 10 shards in the cluster. Click **Enabled** and slide the slider or type a number between 1 and 10 for **Shard count** and click **OK**.

Each shard is a primary/replica cache pair managed by Azure, and the total size of the cache is calculated by multiplying the number of shards by the cache size selected in the pricing tier. 

![Clustering][redis-cache-clustering-selected]

Once the cache is created you connect to it and use it just like a non-clustered cache, and Redis will distribute the data throughout the Cache shards. If diagnostics is [enabled](cache-how-to-monitor.md#enable-cache-diagnostics), metrics are captured separately for each shard and can be [viewed](cache-how-to-monitor.md) in the Redis Cache blade. 

For sample code on working with clustering with the StackExchange.Redis client, see the [clustering.cs](https://github.com/rustd/RedisSamples/blob/master/HelloWorld/Clustering.cs) portion of the [Hello World](https://github.com/rustd/RedisSamples/tree/master/HelloWorld) sample.

<a name="cluster-size"></a>
## Change the cluster size on a running premium cache

To change the cluster size on a running premium cache with clustering enabled, click **(PREVIEW) Redis Cluster Size** from the **Settings** blade.

>[AZURE.NOTE] Note that while the Azure Redis Cache Premium tier has been released to General Availability, the Redis Cluster Size feature is currently in preview.

![Redis cluster size][redis-cache-redis-cluster-size]

To change the cluster size, use the slider or type a number between 1 and 10 in the **Shard count** text box and click **OK** to save.

## Clustering FAQ

The following list contains answers to commonly asked questions about Azure Redis Cache clustering.

-	[Do I need to make any changes to my client application to use clustering?](#do-i-need-to-make-any-changes-to-my-client-application-to-use-clustering)
-	[How are keys distributed in a cluster?](#how-are-keys-distributed-in-a-cluster)
-	[What is the largest cache size I can create?](#what-is-the-largest-cache-size-i-can-create)
-	[Do all Redis clients support clustering?](#do-all-redis-clients-support-clustering)
-	[How do I connect to my cache when clustering is enabled?](#how-do-i-connect-to-my-cache-when-clustering-is-enabled)
-	[Can I directly connect to the individual shards of my cache?](#can-i-directly-connect-to-the-individual-shards-of-my-cache)
-	[Can I configure clustering for a previously created cache?](#can-i-configure-clustering-for-a-previously-created-cache)
-	[Can I configure clustering for a basic or standard cache?](#can-i-configure-clustering-for-a-basic-or-standard-cache)
-	[Can I use clustering with the Redis ASP.NET Session State and Output Caching providers?](#can-i-use-clustering-with-the-redis-aspnet-session-state-and-output-caching-providers)
-	[I am getting MOVE exceptions when using StackExchange.Redis and clustering, what should I do?](#i-am-getting-move-exceptions-when-using-stackexchangeredis-and-clustering-what-should-i-do)

### Do I need to make any changes to my client application to use clustering?

-	When clustering is enabled, only database 0 is available. If your client application uses multiple databases and it tries to read or write to a database other than 0, the following exception is thrown. `Unhandled Exception: StackExchange.Redis.RedisConnectionException: ProtocolFailure on GET --->` `StackExchange.Redis.RedisCommandException: Multiple databases are not supported on this server; cannot switch to database: 6`

    For more information, see [Redis Cluster Specification - Implemented subset](http://redis.io/topics/cluster-spec#implemented-subset).

-	If you are using [StackExchange.Redis](https://www.nuget.org/packages/StackExchange.Redis/) you must use 1.0.481 or later. You connect to the cache using the same [endpoints, ports, and keys](cache-configure.md#properties) that you use when connecting to a cache that does not have clustering enabled. The only difference is that all reads and writes must be done to database 0.
	-	Other clients may have different requirements. See [Do all Redis clients support clustering?](#do-all-redis-clients-support-clustering).
-	If your application uses multiple key operations batched into a single command, all keys must be located in the same shard. To accomplish this, see [How are keys distributed in a cluster?](#how-are-keys-distributed-in-a-cluster).
-	If you are using Redis ASP.NET Session State provider you must use 2.0.1 or higher. See [Can I use clustering with the Redis ASP.NET Session State and Output Caching providers?](#can-i-use-clustering-with-the-redis-aspnet-session-state-and-output-caching-providers).

### How are keys distributed in a cluster?

Per the Redis [Keys distribution model](http://redis.io/topics/cluster-spec#keys-distribution-model) documentation: The key space is split into 16384 slots. Each key is hashed and assigned to one of these slots, which are distributed across the nodes of the cluster. You can configure which part of the key is hashed to ensure that multiple keys are located in the same shard using hash tags.

-	Keys with a hash tag - if any part of the key is enclosed in `{` and `}`, only that part of the key is hashed for the purposes of determining the hash slot of a key. For example, the following 3 keys would be located in the same shard: `{key}1`, `{key}2`, and `{key}3` since only the `key` part of the name is hashed. For a complete list of keys hash tag specifications, see [Keys hash tags](http://redis.io/topics/cluster-spec#keys-hash-tags).
-	Keys without a hash tag - the entire key name is used for hashing. This results in a statistically even distribution across the shards of the cache.

For best performance and throughput, we recommend to distribute the keys evenly. If you are using keys with a hash tag it is the application's responsibility to ensure the keys are distributed evenly.

For more information, see [Keys distribution model](http://redis.io/topics/cluster-spec#keys-distribution-model), [Redis Cluster data sharding](http://redis.io/topics/cluster-tutorial#redis-cluster-data-sharding), and [Keys hash tags](http://redis.io/topics/cluster-spec#keys-hash-tags).

For sample code on working with clustering and locating keys in the same shard with the StackExchange.Redis client, see the [clustering.cs](https://github.com/rustd/RedisSamples/blob/master/HelloWorld/Clustering.cs) portion of the [Hello World](https://github.com/rustd/RedisSamples/tree/master/HelloWorld) sample.

### What is the largest cache size I can create?

The largest premium cache size is 53 GB. You can create up to 10 shards giving you a maximum size of 530 GB. If you need a larger size you can [request more](mailto:wapteams@microsoft.com?subject=Redis%20Cache%20quota%20increase). For more information, see [Azure Redis Cache Pricing](https://azure.microsoft.com/pricing/details/cache/).

### Do all Redis clients support clustering?

At the present time not all clients support Redis clustering. StackExchange.Redis is one that does support for it. For more information on other clients, see the [Playing with the cluster](http://redis.io/topics/cluster-tutorial#playing-with-the-cluster) section of the [Redis cluster tutorial](http://redis.io/topics/cluster-tutorial).

>[AZURE.NOTE] If you are using StackExchange.Redis as your client, ensure you are using the latest version of [StackExchange.Redis](https://www.nuget.org/packages/StackExchange.Redis/) 1.0.481 or later for clustering to work correctly. If you have any issues with move exceptions, see [move exceptions](#move-exceptions) for more information.

### How do I connect to my cache when clustering is enabled?

You can connect to your cache using the same [endpoints, ports, and keys](cache-configure.md#properties) that you use when connecting to a cache that does not have clustering enabled. Redis manages the clustering on the backend so you don't have to manage it from your client.

### Can I directly connect to the individual shards of my cache?

This is not officially supported. With that said, each shard consists of a primary/replica cache pair that are collectively known as a cache instance. You can connect to these cache instances using the redis-cli utility in the [unstable](http://redis.io/download) branch of the Redis repository at GitHub. This version implements basic support when started with the `-c` switch. For more information see [Playing with the cluster](http://redis.io/topics/cluster-tutorial#playing-with-the-cluster) on [http://redis.io](http://redis.io) in the [Redis cluster tutorial](http://redis.io/topics/cluster-tutorial).

For non-ssl use the following commands.

	Redis-cli.exe –h <<cachename>> -p 13000 (to connect to instance 0)
	Redis-cli.exe –h <<cachename>> -p 13001 (to connect to instance 1)
	Redis-cli.exe –h <<cachename>> -p 13002 (to connect to instance 2)
	...
	Redis-cli.exe –h <<cachename>> -p 1300N (to connect to instance N)

For ssl, replace `1300N` with `1500N`.

### Can I configure clustering for a previously created cache?

At this time you can only enable clustering when you create a cache. You can change the cluster size after the cache is created, but you can't add clustering to a premium cache or remove clustering from a premium cache after the cache is created. A premium cache with clustering enabled and only one shard is different than a premium cache of the same size with no clustering.

### Can I configure clustering for a basic or standard cache?

Clustering is only available for premium caches.

### Can I use clustering with the Redis ASP.NET Session State and Output Caching providers?

-	**Redis Output Cache provider** - no changes required.
-	**Redis Session State provider** - to use clustering, you must use [RedisSessionStateProvider](https://www.nuget.org/packages/Microsoft.Web.RedisSessionStateProvider) 2.0.1 or higher or an exception is thrown. This is a breaking change; for more information see [v2.0.0 Breaking Change Details](https://github.com/Azure/aspnet-redis-providers/wiki/v2.0.0-Breaking-Change-Details).

<a name="move-exceptions"></a>
### I am getting MOVE exceptions when using StackExchange.Redis and clustering, what should I do?

If you are using StackExchange.Redis and receive `MOVE` exceptions when using clustering, ensure that you are using [StackExchange.Redis 1.1.603](https://www.nuget.org/packages/StackExchange.Redis/) or later. For instructions on configuring your .NET applications to use StackExchange.Redis, see [Configure the cache clients](cache-dotnet-how-to-use-azure-redis-cache.md#configure-the-cache-clients).

## Next steps
Learn how to use more premium cache features.

-	[How to configure persistence for a Premium Azure Redis Cache](cache-how-to-premium-persistence.md)
-	[How to configure Virtual Network support for a Premium Azure Redis Cache](cache-how-to-premium-vnet.md)
  
<!-- IMAGES -->

[redis-cache-clustering]: ./media/cache-how-to-premium-clustering/redis-cache-clustering.png

[redis-cache-clustering-selected]: ./media/cache-how-to-premium-clustering/redis-cache-clustering-selected.png

[redis-cache-redis-cluster-size]: ./media/cache-how-to-premium-clustering/redis-cache-redis-cluster-size.png







