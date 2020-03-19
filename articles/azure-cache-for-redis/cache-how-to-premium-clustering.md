---
title: Configure Redis clustering - Premium Azure Cache for Redis
description: Learn how to create and manage Redis clustering for your Premium tier Azure Cache for Redis instances
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: conceptual
ms.date: 06/13/2018
---
# How to configure Redis clustering for a Premium Azure Cache for Redis
Azure Cache for Redis has different cache offerings, which provide flexibility in the choice of cache size and features, including Premium tier features such as clustering, persistence, and virtual network support. This article describes how to configure clustering in a premium Azure Cache for Redis instance.

For information on other premium cache features, see [Introduction to the Azure Cache for Redis Premium tier](cache-premium-tier-intro.md).

## What is Redis Cluster?
Azure Cache for Redis offers Redis cluster as [implemented in Redis](https://redis.io/topics/cluster-tutorial). With Redis Cluster, you get the following benefits: 

* The ability to automatically split your dataset among multiple nodes. 
* The ability to continue operations when a subset of the nodes is experiencing failures or are unable to communicate with the rest of the cluster. 
* More throughput: Throughput increases linearly as you increase the number of shards. 
* More memory size: Increases linearly as you increase the number of shards.  

Clustering does not increase the number of connections available for a clustered cache. For more information about size, throughput, and bandwidth with premium caches, see [What Azure Cache for Redis offering and size should I use?](cache-faq.md#what-azure-cache-for-redis-offering-and-size-should-i-use)

In Azure, Redis cluster is offered as a primary/replica model where each shard has a primary/replica pair with replication where the replication is managed by Azure Cache for Redis service. 

## Clustering
Clustering is enabled on the **New Azure Cache for Redis** blade during cache creation. 

[!INCLUDE [redis-cache-create](../../includes/redis-cache-premium-create.md)]

Clustering is configured on the **Redis Cluster** blade.

![Clustering][redis-cache-clustering]

You can have up to 10 shards in the cluster. Click **Enabled** and slide the slider or type a number between 1 and 10 for **Shard count** and click **OK**.

Each shard is a primary/replica cache pair managed by Azure, and the total size of the cache is calculated by multiplying the number of shards by the cache size selected in the pricing tier. 

![Clustering][redis-cache-clustering-selected]

Once the cache is created you connect to it and use it just like a non-clustered cache, and Redis distributes the data throughout the Cache shards. If diagnostics is [enabled](cache-how-to-monitor.md#enable-cache-diagnostics), metrics are captured separately for each shard and can be [viewed](cache-how-to-monitor.md) in the Azure Cache for Redis blade. 

> [!NOTE]
> 
> There are some minor differences required in your client application when clustering is configured. For more information, see [Do I need to make any changes to my client application to use clustering?](#do-i-need-to-make-any-changes-to-my-client-application-to-use-clustering)
> 
> 

For sample code on working with clustering with the StackExchange.Redis client, see the [clustering.cs](https://github.com/rustd/RedisSamples/blob/master/HelloWorld/Clustering.cs) portion of the [Hello World](https://github.com/rustd/RedisSamples/tree/master/HelloWorld) sample.

<a name="cluster-size"></a>

## Change the cluster size on a running premium cache
To change the cluster size on a running premium cache with clustering enabled, click **Cluster Size** from the **Resource menu**.

![Redis cluster size][redis-cache-redis-cluster-size]

To change the cluster size, use the slider or type a number between 1 and 10 in the **Shard count** text box and click **OK** to save.

Increasing the cluster size increases max throughput and cache size. Increasing the cluster size doesn't increase the max. connections available to clients.

> [!NOTE]
> Scaling a cluster runs the [MIGRATE](https://redis.io/commands/migrate) command, which is an expensive command, so for minimal impact, consider running this operation during non-peak hours. During the migration process, you will see a spike in server load. Scaling a cluster is a long running process and the amount of time taken depends on the number of keys and size of the values associated with those keys.
> 
> 

## Clustering FAQ
The following list contains answers to commonly asked questions about Azure Cache for Redis clustering.

* [Do I need to make any changes to my client application to use clustering?](#do-i-need-to-make-any-changes-to-my-client-application-to-use-clustering)
* [How are keys distributed in a cluster?](#how-are-keys-distributed-in-a-cluster)
* [What is the largest cache size I can create?](#what-is-the-largest-cache-size-i-can-create)
* [Do all Redis clients support clustering?](#do-all-redis-clients-support-clustering)
* [How do I connect to my cache when clustering is enabled?](#how-do-i-connect-to-my-cache-when-clustering-is-enabled)
* [Can I directly connect to the individual shards of my cache?](#can-i-directly-connect-to-the-individual-shards-of-my-cache)
* [Can I configure clustering for a previously created cache?](#can-i-configure-clustering-for-a-previously-created-cache)
* [Can I configure clustering for a basic or standard cache?](#can-i-configure-clustering-for-a-basic-or-standard-cache)
* [Can I use clustering with the Redis ASP.NET Session State and Output Caching providers?](#can-i-use-clustering-with-the-redis-aspnet-session-state-and-output-caching-providers)
* [I am getting MOVE exceptions when using StackExchange.Redis and clustering, what should I do?](#i-am-getting-move-exceptions-when-using-stackexchangeredis-and-clustering-what-should-i-do)

### Do I need to make any changes to my client application to use clustering?
* When clustering is enabled, only database 0 is available. If your client application uses multiple databases and it tries to read or write to a database other than 0, the following exception is thrown. `Unhandled Exception: StackExchange.Redis.RedisConnectionException: ProtocolFailure on GET --->` `StackExchange.Redis.RedisCommandException: Multiple databases are not supported on this server; cannot switch to database: 6`
  
  For more information, see [Redis Cluster Specification - Implemented subset](https://redis.io/topics/cluster-spec#implemented-subset).
* If you are using [StackExchange.Redis](https://www.nuget.org/packages/StackExchange.Redis/), you must use 1.0.481 or later. You connect to the cache using the same [endpoints, ports, and keys](cache-configure.md#properties) that you use when connecting to a cache that does not have clustering enabled. The only difference is that all reads and writes must be done to database 0.
  
  * Other clients may have different requirements. See [Do all Redis clients support clustering?](#do-all-redis-clients-support-clustering)
* If your application uses multiple key operations batched into a single command, all keys must be located in the same shard. To locate keys in the same shard, see [How are keys distributed in a cluster?](#how-are-keys-distributed-in-a-cluster)
* If you are using Redis ASP.NET Session State provider you must use 2.0.1 or higher. See [Can I use clustering with the Redis ASP.NET Session State and Output Caching providers?](#can-i-use-clustering-with-the-redis-aspnet-session-state-and-output-caching-providers)

### How are keys distributed in a cluster?
Per the Redis [Keys distribution model](https://redis.io/topics/cluster-spec#keys-distribution-model) documentation: The key space is split into 16384 slots. Each key is hashed and assigned to one of these slots, which are distributed across the nodes of the cluster. You can configure which part of the key is hashed to ensure that multiple keys are located in the same shard using hash tags.

* Keys with a hash tag - if any part of the key is enclosed in `{` and `}`, only that part of the key is hashed for the purposes of determining the hash slot of a key. For example, the following 3 keys would be located in the same shard: `{key}1`, `{key}2`, and `{key}3` since only the `key` part of the name is hashed. For a complete list of keys hash tag specifications, see [Keys hash tags](https://redis.io/topics/cluster-spec#keys-hash-tags).
* Keys without a hash tag - the entire key name is used for hashing. This results in a statistically even distribution across the shards of the cache.

For best performance and throughput, we recommend distributing the keys evenly. If you are using keys with a hash tag it is the application's responsibility to ensure the keys are distributed evenly.

For more information, see [Keys distribution model](https://redis.io/topics/cluster-spec#keys-distribution-model), [Redis Cluster data sharding](https://redis.io/topics/cluster-tutorial#redis-cluster-data-sharding), and [Keys hash tags](https://redis.io/topics/cluster-spec#keys-hash-tags).

For sample code on working with clustering and locating keys in the same shard with the StackExchange.Redis client, see the [clustering.cs](https://github.com/rustd/RedisSamples/blob/master/HelloWorld/Clustering.cs) portion of the [Hello World](https://github.com/rustd/RedisSamples/tree/master/HelloWorld) sample.

### What is the largest cache size I can create?
The largest premium cache size is 120 GB. You can create up to 10 shards giving you a maximum size of 1.2TB GB. If you need a larger size you can [request more](mailto:wapteams@microsoft.com?subject=Redis%20Cache%20quota%20increase). For more information, see [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/).

### Do all Redis clients support clustering?
Not all clients support Redis clustering! Please check the documentation for the library you are using, to verify you are using a  library and version which support clustering. StackExchange.Redis is one library that does support clustering, in its newer versions. For more information on other clients, see the [Playing with the cluster](https://redis.io/topics/cluster-tutorial#playing-with-the-cluster) section of the [Redis cluster tutorial](https://redis.io/topics/cluster-tutorial). 

The Redis clustering protocol requires each client to connect to each shard directly in clustering mode, and also defines new error responses such as 'MOVED' na 'CROSSSLOTS'. Attempting to use a client that doesn't support clustering with a cluster mode cache can result in a lot of [MOVED redirection exceptions](https://redis.io/topics/cluster-spec#moved-redirection), or just break your application, if you are doing cross-slot multi-key requests.

> [!NOTE]
> If you are using StackExchange.Redis as your client, ensure you are using the latest version of [StackExchange.Redis](https://www.nuget.org/packages/StackExchange.Redis/) 1.0.481 or later for clustering to work correctly. If you have any issues with move exceptions, see [move exceptions](#move-exceptions) for more information.
>

### How do I connect to my cache when clustering is enabled?
You can connect to your cache using the same [endpoints](cache-configure.md#properties), [ports](cache-configure.md#properties), and [keys](cache-configure.md#access-keys) that you use when connecting to a cache that does not have clustering enabled. Redis manages the clustering on the backend so you don't have to manage it from your client.

### Can I directly connect to the individual shards of my cache?
The clustering protocol requires that the client make the correct shard connections. So the client should do this correctly for you. With that said, each shard consists of a primary/replica cache pair, collectively known as a cache instance. You can connect to these cache instances using the redis-cli utility in the [unstable](https://redis.io/download) branch of the Redis repository at GitHub. This version implements basic support when started with the `-c` switch. For more information, see [Playing with the cluster](https://redis.io/topics/cluster-tutorial#playing-with-the-cluster) on [https://redis.io](https://redis.io) in the [Redis cluster tutorial](https://redis.io/topics/cluster-tutorial).

For non-ssl, use the following commands.

    Redis-cli.exe –h <<cachename>> -p 13000 (to connect to instance 0)
    Redis-cli.exe –h <<cachename>> -p 13001 (to connect to instance 1)
    Redis-cli.exe –h <<cachename>> -p 13002 (to connect to instance 2)
    ...
    Redis-cli.exe –h <<cachename>> -p 1300N (to connect to instance N)

For ssl, replace `1300N` with `1500N`.

### Can I configure clustering for a previously created cache?
Yes. First ensure that your cache is premium, by scaling if is not. Next, you should be able to see the cluster configuration options, including an option to enable cluster. You can change the cluster size after the cache is created, or after you have enabled clustering for the first time.

   >[!IMPORTANT]
   >You can't undo enabling clustering. And a cache with clustering enabled and only one shard behaves *differently* than a cache of the same size with *no* clustering.

### Can I configure clustering for a basic or standard cache?
Clustering is only available for premium caches.

### Can I use clustering with the Redis ASP.NET Session State and Output Caching providers?
* **Redis Output Cache provider** - no changes required.
* **Redis Session State provider** - to use clustering, you must use [RedisSessionStateProvider](https://www.nuget.org/packages/Microsoft.Web.RedisSessionStateProvider) 2.0.1 or higher or an exception is thrown. This is a breaking change; for more information, see [v2.0.0 Breaking Change Details](https://github.com/Azure/aspnet-redis-providers/wiki/v2.0.0-Breaking-Change-Details).

<a name="move-exceptions"></a>

### I am getting MOVE exceptions when using StackExchange.Redis and clustering, what should I do?
If you are using StackExchange.Redis and receive `MOVE` exceptions when using clustering, ensure that you are using [StackExchange.Redis 1.1.603](https://www.nuget.org/packages/StackExchange.Redis/) or later. For instructions on configuring your .NET applications to use StackExchange.Redis, see [Configure the cache clients](cache-dotnet-how-to-use-azure-redis-cache.md#configure-the-cache-clients).

## Next steps
Learn how to use more premium cache features.

* [Introduction to the Azure Cache for Redis Premium tier](cache-premium-tier-intro.md)

<!-- IMAGES -->

[redis-cache-clustering]: ./media/cache-how-to-premium-clustering/redis-cache-clustering.png

[redis-cache-clustering-selected]: ./media/cache-how-to-premium-clustering/redis-cache-clustering-selected.png

[redis-cache-redis-cluster-size]: ./media/cache-how-to-premium-clustering/redis-cache-redis-cluster-size.png
