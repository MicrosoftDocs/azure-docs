---
title: Configure Redis clustering - Premium Azure Cache for Redis
description: Learn how to create and manage Redis clustering for your Premium tier Azure Cache for Redis instances
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 05/11/2023

---

# Configure Redis clustering for a Premium Azure Cache for Redis instance

Azure Cache for Redis offers Redis cluster as [implemented in Redis](https://redis.io/topics/cluster-tutorial). With Redis Cluster, you get the following benefits:

* The ability to automatically split your dataset among multiple nodes.
* The ability to continue operations when a subset of the nodes is experiencing failures or are unable to communicate with the rest of the cluster.
* More throughput: Throughput increases linearly as you increase the number of shards.
* More memory size: Increases linearly as you increase the number of shards.  

Clustering doesn't increase the number of connections available for a clustered cache. For more information about size, throughput, and bandwidth with premium caches, see [Choosing the right tier](cache-overview.md#choosing-the-right-tier)

In Azure, Redis cluster is offered as a primary/replica model where each shard has a primary/replica pair with replication, where the replication is managed by Azure Cache for Redis service.

## Azure Cache for Redis now supports up to 30 shards (preview)

Azure Cache for Redis now supports upto 30 shards for clustered caches. Clustered caches configured with two replicas can support upto 20 shards and clustered caches configured with three replicas can support upto 15 shards.

### Limitations

- Shard limit for caches with Redis version 4 is 10.
- Shard limit for [caches affected by cloud service retirement](./cache-faq.yml#caches-with-a-dependency-on-cloud-services--classic) is 10.
- Maintenance will take longer as each node take roughly 20 minutes to update. Other maintenance operations will be blocked while your cache is under maintenance.

## Set up clustering

Clustering is enabled  **New Azure Cache for Redis** on the left during cache creation.

1. To create a premium cache, sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource**. Besides creating caches in the Azure portal, you can also create them using Resource Manager templates, PowerShell, or Azure CLI. For more information about creating an Azure Cache for Redis, see [Create a cache](cache-dotnet-how-to-use-azure-redis-cache.md#create-a-cache).

    :::image type="content" source="media/cache-private-link/1-create-resource.png" alt-text="Create resource.":::

1. On the **New** page, select **Databases** and then select **Azure Cache for Redis**.

    :::image type="content" source="media/cache-private-link/2-select-cache.png" alt-text="Select Azure Cache for Redis.":::

1. On the **New Redis Cache** page, configure the settings for your new premium cache.

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **DNS name** | Enter a globally unique name. | The cache name must be a string between 1 and 63 characters. The string can only contain numbers, letters, or hyphens. The name must start and end with a number or letter, and can't contain consecutive hyphens. Your cache instance's *host name* will be *\<DNS name>.redis.cache.windows.net*. |
   | **Subscription** | Drop-down and select your subscription. | The subscription under which to create this new Azure Cache for Redis instance. |
   | **Resource group** | Drop-down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your cache and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. |
   | **Location** | Drop-down and select a location. | Select a [region](https://azure.microsoft.com/regions/) near other services that will use your cache. |
   | **Cache type** | Drop-down and select a premium cache to configure premium features. For details, see [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/). |  The pricing tier determines the size, performance, and features that are available for the cache. For more information, see [Azure Cache for Redis Overview](cache-overview.md). |

1. Select the **Networking** tab or select the **Networking** button at the bottom of the page.

1. In the **Networking** tab, select your connectivity method. For premium cache instances, you can connect either publicly, via Public IP addresses or service endpoints, or privately, using a private endpoint.

1. Select the **Next: Advanced** tab or select the **Next: Advanced** button on the bottom of the page.

1. In the **Advanced** tab for a premium cache instance, configure the settings for non-TLS port, clustering, and data persistence. To enable clustering, select **Enable**.

    :::image type="content" source="media/cache-how-to-premium-clustering/redis-cache-clustering.png" alt-text="Clustering toggle.":::

    You can have up to 10 shards in the cluster. After selecting **Enable**, slide the slider or type a number between 1 and 10 for **Shard count** and select **OK**.

    Each shard is a primary/replica cache pair managed by Azure, and the total size of the cache is calculated by multiplying the number of shards by the cache size selected in the pricing tier.

    :::image type="content" source="media/cache-how-to-premium-clustering/redis-cache-clustering-selected.png" alt-text="Clustering toggle selected.":::

    Once the cache is created, you connect to it and use it just like a non-clustered cache. Redis distributes the data throughout the Cache shards. If diagnostics is [enabled](cache-how-to-monitor.md#use-a-storage-account-to-export-cache-metrics), metrics are captured separately for each shard, and can be [viewed](cache-how-to-monitor.md) in Azure Cache for Redis on the left.

1. Select the **Next: Tags** tab or select the **Next: Tags** button at the bottom of the page.

1. Optionally, in the **Tags** tab, enter the name and value if you wish to categorize the resource.

1. Select **Review + create**. You're taken to the Review + create tab where Azure validates your configuration.

1. After the green Validation passed message appears, select **Create**.

It takes a while for the cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.

> [!NOTE]
>
> There are some minor differences required in your client application when clustering is configured. For more information, see [Do I need to make any changes to my client application to use clustering?](#do-i-need-to-make-any-changes-to-my-client-application-to-use-clustering)
>
>

For sample code on working with clustering with the StackExchange.Redis client, see the [clustering.cs](https://github.com/rustd/RedisSamples/blob/master/HelloWorld/Clustering.cs) portion of the [Hello World](https://github.com/rustd/RedisSamples/tree/master/HelloWorld) sample.

## Change the cluster size on a running premium cache

To change the cluster size on a premium cache that you created earlier, and is already running with clustering enabled, select **Cluster size** from the Resource menu.

:::image type="content" source="media/cache-how-to-premium-clustering/redis-cache-redis-cluster-size.png" alt-text="Screenshot of Resource Manager with Cluster size selected. ":::

To change the cluster size, use the slider or type a number between 1 and 10 in the **Shard count** text box. Then, select **OK** to save.

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
* [I'm getting MOVE exceptions when using StackExchange.Redis and clustering, what should I do?](#im-getting-move-exceptions-when-using-stackexchangeredis-and-clustering-what-should-i-do)
* [Does scaling out using clustering help to increase the number of supported client connections?](#does-scaling-out-using-clustering-help-to-increase-the-number-of-supported-client-connections)

### Do I need to make any changes to my client application to use clustering?

* When clustering is enabled, only database 0 is available. If your client application uses multiple databases and it tries to read or write to a database other than 0, the following exception is thrown: `Unhandled Exception: StackExchange.Redis.RedisConnectionException: ProtocolFailure on GET --->` `StackExchange.Redis.RedisCommandException: Multiple databases are not supported on this server; cannot switch to database: 6`
  
  For more information, see [Redis Cluster Specification - Implemented subset](https://redis.io/topics/cluster-spec#implemented-subset).
* If you're using [StackExchange.Redis](https://www.nuget.org/packages/StackExchange.Redis/), you must use 1.0.481 or later. You connect to the cache using the same [endpoints, ports, and keys](cache-configure.md#properties) that you use when connecting to a cache where clustering is disabled. The only difference is that all reads and writes must be done to database 0.
  
  Other clients may have different requirements. See [Do all Redis clients support clustering?](#do-all-redis-clients-support-clustering)
* If your application uses multiple key operations batched into a single command, all keys must be located in the same shard. To locate keys in the same shard, see [How are keys distributed in a cluster?](#how-are-keys-distributed-in-a-cluster)
* If you're using Redis ASP.NET Session State provider, you must use 2.0.1 or higher. See [Can I use clustering with the Redis ASP.NET Session State and Output Caching providers?](#can-i-use-clustering-with-the-redis-aspnet-session-state-and-output-caching-providers)

### How are keys distributed in a cluster?

Per the Redis [Keys distribution model](https://redis.io/topics/cluster-spec#keys-distribution-model) documentation: The key space is split into 16,384 slots. Each key is hashed and assigned to one of these slots, which are distributed across the nodes of the cluster. You can configure which part of the key is hashed to ensure that multiple keys are located in the same shard using hash tags.

* Keys with a hash tag - if any part of the key is enclosed in `{` and `}`, only that part of the key is hashed for the purposes of determining the hash slot of a key. For example, the following three keys would be located in the same shard: `{key}1`, `{key}2`, and `{key}3` since only the `key` part of the name is hashed. For a complete list of keys hash tag specifications, see [Keys hash tags](https://redis.io/topics/cluster-spec#keys-hash-tags).
* Keys without a hash tag - the entire key name is used for hashing, resulting in a statistically even distribution across the shards of the cache.

For best performance and throughput, we recommend distributing the keys evenly. If you're using keys with a hash tag, it's the application's responsibility to ensure the keys are distributed evenly.

For more information, see [Keys distribution model](https://redis.io/topics/cluster-spec#keys-distribution-model), [Redis Cluster data sharding](https://redis.io/topics/cluster-tutorial#redis-cluster-data-sharding), and [Keys hash tags](https://redis.io/topics/cluster-spec#keys-hash-tags).

For sample code about working with clustering and locating keys in the same shard with the StackExchange.Redis client, see the [clustering.cs](https://github.com/rustd/RedisSamples/blob/master/HelloWorld/Clustering.cs) portion of the [Hello World](https://github.com/rustd/RedisSamples/tree/master/HelloWorld) sample.

### What is the largest cache size I can create?

The largest cache size you can have is 1.2 TB. This result is a clustered P5 cache with 10 shards. For more information, see [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/).

### Do all Redis clients support clustering?

Many clients libraries support Redis clustering but not all. Check the documentation for the library you're using to verify you're using a library and version that support clustering. StackExchange.Redis is one library that does support clustering, in its newer versions. For more information on other clients, see [Scaling with Redis Cluster](https://redis.io/topics/cluster-tutorial).

The Redis clustering protocol requires each client to connect to each shard directly in clustering mode, and also defines new error responses such as 'MOVED' na 'CROSSSLOTS'. When you attempt to use a client library that doesn't support clustering, with a cluster mode cache, the result can be many [MOVED redirection exceptions](https://redis.io/topics/cluster-spec#moved-redirection), or just break your application, if you're doing cross-slot multi-key requests.

> [!NOTE]
> If you're using StackExchange.Redis as your client, ensure you're using the latest version of [StackExchange.Redis](https://www.nuget.org/packages/StackExchange.Redis/) 1.0.481 or later for clustering to work correctly. For more information on any issues with move exceptions, see [move exceptions](#im-getting-move-exceptions-when-using-stackexchangeredis-and-clustering-what-should-i-do).
>

### How do I connect to my cache when clustering is enabled?

You can connect to your cache using the same [endpoints](cache-configure.md#properties), [ports](cache-configure.md#properties), and [keys](cache-configure.md#access-keys) that you use when connecting to a cache that doesn't have clustering enabled. Redis manages the clustering on the backend so you don't have to manage it from your client as long as the client library supports Redis clustering.

### Can I directly connect to the individual shards of my cache?

The clustering protocol requires the client to make the correct shard connections, so the client should make share connections for you. With that said, each shard consists of a primary/replica cache pair, collectively known as a cache instance. You can connect to these cache instances using the redis-cli utility in the [unstable](https://redis.io/download) branch of the Redis repository at GitHub. This version implements basic support when started with the `-c` switch. For more information, see [Redis cluster tutorial](https://redis.io/topics/cluster-tutorial).

For non-TLS, use the following commands.

```bash
Redis-cli.exe –h <<cachename>> -p 13000 (to connect to instance 0)
Redis-cli.exe –h <<cachename>> -p 13001 (to connect to instance 1)
Redis-cli.exe –h <<cachename>> -p 13002 (to connect to instance 2)
...
Redis-cli.exe –h <<cachename>> -p 1300N (to connect to instance N)
```

For TLS, replace `1300N` with `1500N`.

### Can I configure clustering for a previously created cache?

Yes. First, ensure that your cache is premium by scaling it up. Next, you can see the cluster configuration options, including an option to enable cluster. Change the cluster size after the cache is created, or after you have enabled clustering for the first time.

   >[!IMPORTANT]
   >You can't undo enabling clustering. And a cache with clustering enabled and only one shard behaves *differently* than a cache of the same size with *no* clustering.

### Can I configure clustering for a basic or standard cache?

Clustering is only available for premium caches.

### Can I use clustering with the Redis ASP.NET Session State and Output Caching providers?

* **Redis Output Cache provider** - no changes required.
* **Redis Session State provider** - to use clustering, you must use [RedisSessionStateProvider](https://www.nuget.org/packages/Microsoft.Web.RedisSessionStateProvider) 2.0.1 or higher or an exception is thrown, which is a breaking change. For more information, see [v2.0.0 Breaking Change Details](https://github.com/Azure/aspnet-redis-providers/wiki/v2.0.0-Breaking-Change-Details).

### I'm getting MOVE exceptions when using StackExchange.Redis and clustering, what should I do?

If you're using StackExchange.Redis and receive `MOVE` exceptions when using clustering, ensure that you're using [StackExchange.Redis 1.1.603](https://www.nuget.org/packages/StackExchange.Redis/) or later. For instructions on configuring your .NET applications to use StackExchange.Redis, see [Configure the cache clients](cache-dotnet-how-to-use-azure-redis-cache.md#configure-the-cache-client).

### Does scaling out using clustering help to increase the number of supported client connections?

No, scaling out using clustering and increasing the number of shards doesn't help in increasing the number of supported client connections.

## Next steps

Learn more about Azure Cache for Redis features.

* [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
