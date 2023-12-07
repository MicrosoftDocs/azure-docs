---
title: Scale an Azure Cache for Redis instance
description: Learn how to scale your Azure Cache for Redis instances using the Azure portal, and tools such as Azure PowerShell, and Azure CLI
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 08/24/2023
ms.devlang: csharp
ms.custom: devx-track-azurepowershell, devx-track-azurecli

---

# Scale an Azure Cache for Redis instance

Azure Cache for Redis has different tier offerings that provide flexibility in the choice of cache size and features. Through scaling, you can change the size, tier, and number of nodes after creating a cache instance to match your application needs. This article shows you how to scale your cache using the Azure portal, plus tools such as Azure PowerShell and Azure CLI.

## Types of scaling

There are fundamentally two ways to scale an Azure Cache for Redis Instance:

- _Scaling up_ increases the size of the Virtual Machine (VM) running the Redis server, adding more memory, Virtual CPUs (vCPUs), and network bandwidth. Scaling up is also called _vertical scaling_. The opposite of scaling up is _Scaling down_. 

- _Scaling out_ divides the cache instance into more nodes of the same size, increasing memory, vCPUs, and network bandwidth through parallelization. Scaling out is also referred to as _horizontal scaling_ or _sharding_. The opposite of scaling out is **Scaling in**. In the Redis community, scaling out is frequently called [_clustering_](https://redis.io/docs/management/scaling/).


## Scope of availability

|Tier     | Basic and Standard | Premium  | Enterprise and Enterprise Flash  |
|---------|---------|---------|----------|
|Scale Up  | Yes    | Yes  | Yes (preview) |
|Scale Down  | Yes    | Yes  | No |
|Scale Out  | No    | Yes  | Yes (preview) |
|Scale In  | No    | Yes  | No |

## When to scale

You can use the [monitoring](cache-how-to-monitor.md) features of Azure Cache for Redis to monitor the health and performance of your cache. Use that information to determine when to scale the cache.

You can monitor the following metrics to determine if you need to scale.

- **Redis Server Load**
  - High Redis server load means that the server is unable to keep pace with requests from all the clients. Because a Redis server is a single threaded process, it's typically more helpful to _scale out_ rather than _scale up_. Scaling out by enabling clustering helps distribute overhead functions across multiple Redis processes. Scaling out also helps distribute TLS encryption/decryption and connection/disconnection, speeding up cache instances using TLS. 
  - Scaling up can still be helpful in reducing server load because background tasks can take advantage of the more vCPUs and free up the thread for the main Redis server process.
  - The Enterprise and Enterprise Flash tiers use Redis Enterprise rather than open source Redis. One of the advantages of these tiers is that the Redis server process can take advantage of multiple vCPUs. Because of that, both scaling up and scaling out in these tiers can be helpful in reducing server load. For more information, see [Best Practices for the Enterprise and Enterprise Flash tiers of Azure Cache for Redis](cache-best-practices-enterprise-tiers.md).
- **Memory Usage**
  - High memory usage indicates that your data size is too large for the current cache size. Consider scaling to a cache size with larger memory. Either _scaling up_ or _scaling out_ is effective here.
- **Client connections**
  - Each cache size has a limit to the number of client connections it can support. If your client connections are close to the limit for the cache size, consider _scaling up_ to a larger tier. _Scaling out_ doesn't increase the number of supported client connections.
  - For more information on connection limits by cache size, see [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/).
- **Network Bandwidth**
  - If the Redis server exceeds the available bandwidth, clients requests could time out because the server can't push data to the client fast enough. Check "Cache Read" and "Cache Write" metrics to see how much server-side bandwidth is being used. If your Redis server is exceeding available network bandwidth, you should consider scaling out or scaling up to a larger cache size with higher network bandwidth.
  - For Enterprise tier caches using the _Enterprise cluster policy_, scaling out doesn't increase network bandwidth.
  - For more information on network available bandwidth by cache size, see [Azure Cache for Redis planning FAQs](./cache-planning-faq.yml).

For more information on determining the cache pricing tier to use, see [Choosing the right tier](cache-overview.md#choosing-the-right-tier) and [Azure Cache for Redis planning FAQs](./cache-planning-faq.yml).

> [!NOTE]
> For more information on how to optimize the scaling process, see the [best practices for scaling guide](cache-best-practices-scale.md)
>

## Prerequisites/limitations of scaling Azure Cache for Redis

You can scale up/down to a different pricing tier with the following restrictions:

- You can't scale from a higher pricing tier to a lower pricing tier.
  - You can't scale from an **Enterprise** or **Enterprise Flash** cache down to any other tier.
  - You can't scale from a **Premium** cache down to a **Standard** or a **Basic** cache.
  - You can't scale from a **Standard** cache down to a **Basic** cache.
- You can scale from a **Basic** cache to a **Standard** cache but you can't change the size at the same time. If you need a different size, you can later do a scaling operation to the wanted size.
- You can't scale from a **Basic** cache directly to a **Premium** cache. First, scale from **Basic** to **Standard** in one scaling operation, and then from **Standard** to **Premium** in the next scaling operation.
- You can't scale from a larger size down to the **C0 (250 MB)** size. However, you can scale down to any other size within the same pricing tier. For example, you can scale down from C5 Standard to C1 Standard.
- You can't scale from a **Premium**, **Standard**, or **Basic** cache up to an **Enterprise** or **Enterprise Flash** cache.
- You can't scale between **Enterprise** and **Enterprise Flash**.

You can scale out/in with the following restrictions:

- _Scale out_ is only supported on the **Premium**, **Enterprise**, and **Enterprise Flash** tiers.
- _Scale in_ is only supported on the **Premium** tier.
- On the **Premium** tier, clustering must be enabled first before scaling in or out.
- Only the **Enterprise** and **Enterprise Flash** tiers can scale up and scale out simultaneously.

## How to scale - Basic, Standard, and Premium tiers

### [Scale up and down with Basic, Standard, and Premium](#tab/scale-up-and-down-with-basic-standard-and-premium)

#### Scale up and down using the Azure portal

1. To scale your cache, [browse to the cache](cache-configure.md#configure-azure-cache-for-redis-settings) in the [Azure portal](https://portal.azure.com) and select **Scale** from the Resource menu.

    :::image type="content" source="media/cache-how-to-scale/scale-a-cache.png" alt-text="Screenshot showing Scale on the resource menu.":::

1. Choose a pricing tier in the working pane and then choose **Select**.
    
    :::image type="content" source="media/cache-how-to-scale/select-a-tier.png" alt-text="Screenshot showing the Azure Cache for Redis tiers.":::

1. While the cache is scaling to the new tier, a **Scaling Redis Cache** notification is displayed.

    :::image type="content" source="media/cache-how-to-scale/scaling-notification.png" alt-text="Screenshot showing the notification of scaling.":::

1.  When scaling is complete, the status changes from **Scaling** to **Running**.

 > [!NOTE]
 > When you scale a cache up or down using the portal, both `maxmemory-reserved` and `maxfragmentationmemory-reserved` settings automatically scale in proportion to the cache size. 
 > For example, if `maxmemory-reserved` is set to 3 GB on a 6-GB cache, and you scale to 12-GB cache, the settings automatically get updated to 6 GB during scaling.
 > When you scale down, the reverse happens.
 >

#### Scale up and down using PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

You can scale your Azure Cache for Redis instances with PowerShell by using the [Set-AzRedisCache](/powershell/module/az.rediscache/set-azrediscache) cmdlet when the `Size`or `Sku` properties are modified. The following example shows how to scale a cache named `myCache` to a 6-GB cache in the same tier.

```powershell
   Set-AzRedisCache -ResourceGroupName myGroup -Name myCache -Size 6GB
```
For more information on scaling with PowerShell, see [To scale an Azure Cache for Redis using PowerShell](cache-how-to-manage-redis-cache-powershell.md#scale).

#### Scale up and down using Azure CLI

To scale your Azure Cache for Redis instances using Azure CLI, call the [az redis update](/cli/azure/redis#az-redis-update) command. Use the `sku.capcity` property to scale within a tier, for example from a Standard C0 to Standard C1 cache: 

```azurecli
az redis update --cluster-name myCache --resource-group myGroup --set "sku.capacity"="2"
```

Use the 'sku.name' and 'sku.family' properties to scale up to a different tier, for instance from a Standard C1 cache to a Premium P1 cache:

```azurecli
az redis update --cluster-name myCache --resource-group myGroup --set "sku.name"="Premium" "sku.capacity"="1" "sku.family"="P"
```

For more information on scaling with Azure CLI, see [Change settings of an existing Azure Cache for Redis](cache-manage-cli.md#scale).

> [!NOTE]
> When you scale a cache up or down programatically (e.g. using PowerShell or Azure CLI), any `maxmemory-reserved` or `maxfragmentationmemory-reserved` are ignored as part of the update request. Only your scaling change is honored. You can update these memory settings after the scaling operation has completed.
>

### [Scale out and in - Premium only](#tab/scale-out-and-in---premium-only)

#### Create a new cache that is scaled out using clustering

Clustering is enabled during cache creation from the working pane, when you create a new Azure Cache for Redis.

1. Use the [_Create an open-source Redis cache_ quickstart guide](quickstart-create-redis.md) to start creating a new cache using the Azure portal. 

1. In the **Advanced** tab for a **premium** cache instance, configure the settings for non-TLS port, clustering, and data persistence. To enable clustering, select **Enable**.

    :::image type="content" source="media/cache-how-to-scale/redis-cache-clustering.png" alt-text="Screenshot showing the clustering toggle.":::

    You can have up to 10 shards in the cluster. After selecting **Enable**, slide the slider or type a number between 1 and 10 for **Shard count** and select **OK**.

    Each shard is a primary/replica cache pair managed by Azure. The total size of the cache is calculated by multiplying the number of shards by the cache size selected in the pricing tier.

    :::image type="content" source="media/cache-how-to-scale/redis-cache-clustering-selected.png" alt-text="Screenshot showing the clustering toggle selected.":::

    Once the cache is created, you connect to it and use it just like a nonclustered cache. Redis distributes the data throughout the Cache shards. If diagnostics is [enabled](cache-how-to-monitor.md#use-a-storage-account-to-export-cache-metrics), metrics are captured separately for each shard, and can be [viewed](cache-how-to-monitor.md) in Azure Cache for Redis using the Resource menu.

1. Finish creating the cache using the [quickstart guide](quickstart-create-redis.md).

It takes a while for the cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.

> [!NOTE]
>
> There are some minor differences required in your client application when clustering is configured. For more information, see [Do I need to make any changes to my client application to use clustering?](#do-i-need-to-make-any-changes-to-my-client-application-to-use-clustering)
>


For sample code on working with clustering with the StackExchange.Redis client, see the [clustering.cs](https://github.com/rustd/RedisSamples/blob/master/HelloWorld/Clustering.cs) portion of the [Hello World](https://github.com/rustd/RedisSamples/tree/master/HelloWorld) sample.

#### Scale a running Premium cache in or out

To change the cluster size on a premium cache that you created earlier, and is already running with clustering enabled, select **Cluster size** from the Resource menu.

:::image type="content" source="media/cache-how-to-scale/redis-cache-redis-cluster-size.png" alt-text="Screenshot of working pane with Cluster size selected. ":::

To change the cluster size, use the slider or type a number between 1 and 10 in the **Shard count** text box. Then, select **OK** to save.

Increasing the cluster size increases max throughput and cache size. Increasing the cluster size doesn't increase the max. connections available to clients.

#### Scale out and in using PowerShell

You can scale out your Azure Cache for Redis instances with PowerShell by using the [Set-AzRedisCache](/powershell/module/az.rediscache/set-azrediscache) cmdlet when the `ShardCount` property is modified. The following example shows how to scale out a cache named `myCache` out to use three shards (that is, scale out by a factor of three)

```powershell
   Set-AzRedisCache -ResourceGroupName myGroup -Name myCache -ShardCount 3
```

For more information on scaling with PowerShell, see [To scale an Azure Cache for Redis using PowerShell](cache-how-to-manage-redis-cache-powershell.md#scale).

#### Scale out and in using Azure CLI

To scale your Azure Cache for Redis instances using Azure CLI, call the [az redis update](/cli/azure/redis#az-redis-update) command and use the `shard-count` property. The following example shows how to scale out a cache named `myCache` to use three shards (that is, scale out by a factor of three).

```azurecli
az redis update --cluster-name myCache --resource-group myGroup --set shard-count=3
```

For more information on scaling with Azure CLI, see [Change settings of an existing Azure Cache for Redis](cache-manage-cli.md#scale).

> [!NOTE]
> When you scale a cache up or down programmatically (e.g. using PowerShell or Azure CLI), any `maxmemory-reserved` or `maxfragmentationmemory-reserved` are ignored as part of the update request. Only your scaling change is honored. You can update these memory settings after the scaling operation has completed.
>

> [!NOTE]
> Scaling a cluster runs the [MIGRATE](https://redis.io/commands/migrate) command, which is an expensive command. For minimal impact, consider running this operation during non-peak hours. During the migration process, you see a spike in server load. Scaling a cluster is a long running process and the amount of time taken depends on the number of keys and size of the values associated with those keys.
>
>
---
## How to scale up and out - Enterprise and Enterprise Flash tiers

The Enterprise and Enterprise Flash tiers are able to scale up and scale out in one operation. Other tiers require separate operations for each action.

> [!CAUTION]
> The Enterprise and Enterprise Flash tiers do not yet support _scale down_ or _scale in_ operations.
>


### Scale using the Azure portal

1. To scale your cache, [browse to the cache](cache-configure.md#configure-azure-cache-for-redis-settings) in the [Azure portal](https://portal.azure.com) and select **Scale** from the Resource menu.
    
   :::image type="content" source="media/cache-how-to-scale/cache-enterprise-scale.png" alt-text="Screenshot showing Scale selected in the Resource menu for an Enterprise cache.":::

1. To scale up, choose a different **Cache type** and then choose **Save**. 
   > [!IMPORTANT]
   > You can only scale up at this time. You cannot scale down.

   :::image type="content" source="media/cache-how-to-scale/cache-enterprise-scale-up.png" alt-text="Screenshot showing the Enterprise tiers in the working pane.":::

1. To scale out, increase the **Capacity** slider. Capacity increases in increments of two. This number reflects how many underlying Redis Enterprise nodes are being added. This number is always a multiple of two to reflect nodes being added for both primary and replica shards. 
   > [!IMPORTANT]
   > You can only scale out, increasing capacity, at this time. You cannot scale in.

    :::image type="content" source="media/cache-how-to-scale/cache-enterprise-capacity.png" alt-text="Screenshot showing Capacity in the working pane a red box around it.":::

1. While the cache is scaling to the new tier, a **Scaling Redis Cache** notification is displayed.

    :::image type="content" source="media/cache-how-to-scale/cache-enterprise-notifications.png" alt-text="Screenshot showing notification of scaling an Enterprise cache.":::
    

1. When scaling is complete, the status changes from **Scaling** to **Running**.


### Scale using PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

You can scale your Azure Cache for Redis instances with PowerShell by using the [Update-AzRedisEnterpriseCache](/powershell/module/az.redisenterprisecache/update-azredisenterprisecache) cmdlet. You can modify the `Sku` property to scale the instance up. You can modify the `Capacity` property to scale out the instance. The following example shows how to scale a cache named `myCache` to an Enterprise E20 (25 GB) instance with capacity of 4.

```powershell
   Update-AzRedisEnterpriseCache -ResourceGroupName myGroup -Name myCache -Sku Enterprise_E20 -Capacity 4
```

### Scale using Azure CLI

To scale your Azure Cache for Redis instances using Azure CLI, call the [az redisenterprise update](/cli/azure/redisenterprise#az-redisenterprise-update) command. You can modify the `sku` property to scale the instance up. You can modify the `capacity` property to scale out the instance. The following example shows how to scale a cache named `myCache` to an Enterprise E20 (25 GB) instance with capacity of 4.

```azurecli
az redisenterprise update --cluster-name "myCache" --resource-group "myGroup" --sku "Enterprise_E20" --capacity 4
```

## Scaling FAQ

The following list contains answers to commonly asked questions about Azure Cache for Redis scaling.

- [Can I scale to, from, or within a Premium cache?](#can-i-scale-to-from-or-within-a-premium-cache)
- [After scaling, do I have to change my cache name or access keys?](#after-scaling-do-i-have-to-change-my-cache-name-or-access-keys)
- [How does scaling work?](#how-does-scaling-work)
- [Do I lose data from my cache during scaling?](#do-i-lose-data-from-my-cache-during-scaling)
- [Can I use all the features of Premium tier after scaling?](#can-i-use-all-the-features-of-premium-tier-after-scaling)
- [Is my custom databases setting affected during scaling?](#is-my-custom-databases-setting-affected-during-scaling)
- [Will my cache be available during scaling?](#will-my-cache-be-available-during-scaling)
- [Are there scaling limitations with geo-replication?](#are-there-scaling-limitations-with-geo-replication)
- [Operations that aren't supported](#operations-that-arent-supported)
- [How long does scaling take?](#how-long-does-scaling-take)
- [How can I tell when scaling is complete?](#how-can-i-tell-when-scaling-is-complete)
- [Do I need to make any changes to my client application to use clustering?](#do-i-need-to-make-any-changes-to-my-client-application-to-use-clustering)
- [How are keys distributed in a cluster?](#how-are-keys-distributed-in-a-cluster)
- [What is the largest cache size I can create?](#what-is-the-largest-cache-size-i-can-create)
- [Do all Redis clients support clustering?](#do-all-redis-clients-support-clustering)
- [How do I connect to my cache when clustering is enabled?](#how-do-i-connect-to-my-cache-when-clustering-is-enabled)
- [Can I directly connect to the individual shards of my cache?](#can-i-directly-connect-to-the-individual-shards-of-my-cache)
- [Can I configure clustering for a previously created cache?](#can-i-configure-clustering-for-a-previously-created-cache)
- [Can I configure clustering for a basic or standard cache?](#can-i-configure-clustering-for-a-basic-or-standard-cache)
- [Can I use clustering with the Redis ASP.NET Session State and Output Caching providers?](#can-i-use-clustering-with-the-redis-aspnet-session-state-and-output-caching-providers)
- [I'm getting MOVE exceptions when using StackExchange.Redis and clustering, what should I do?](#im-getting-move-exceptions-when-using-stackexchangeredis-and-clustering-what-should-i-do)
- [What is the difference between OSS Clustering and Enterprise Clustering on Enterprise-tier caches?](#what-is-the-difference-between-oss-clustering-and-enterprise-clustering-on-enterprise-tier-caches)
- [How many shards do Enterprise tier caches use?](#how-many-shards-do-enterprise-tier-caches-use)

### Can I scale to, from, or within a Premium cache?

- You can't scale from a **Premium** cache down to a **Basic** or **Standard** pricing tier.
- You can scale from one **Premium** cache pricing tier to another.
- You can't scale from a **Basic** cache directly to a **Premium** cache. First, scale from **Basic** to **Standard** in one scaling operation, and then from **Standard** to **Premium** in a later scaling operation.
- You can't scale from a **Premium** cache to an **Enterprise** or **Enterprise Flash** cache.
- If you enabled clustering when you created your **Premium** cache, you can change the cluster size. If your cache was created without clustering enabled, you can configure clustering at a later time.

### After scaling, do I have to change my cache name or access keys?

No, your cache name and keys are unchanged during a scaling operation.

### How does scaling work?

- When you scale a **Basic** cache to a different size, it's shut down, and a new cache is provisioned using the new size. During this time, the cache is unavailable and all data in the cache is lost.
- When you scale a **Basic** cache to a **Standard** cache, a replica cache is provisioned and the data is copied from the primary cache to the replica cache. The cache remains available during the scaling process.
- When you scale a **Standard**, **Premium**, **Enterprise**, or **Enterprise Flash** cache to a different size, one of the replicas is shut down and reprovisioned to the new size and the data transferred over, and then the other replica does a failover before it's reprovisioned, similar to the process that occurs during a failure of one of the cache nodes.
- When you scale out a clustered cache, new shards are provisioned and added to the Redis server cluster. Data is then resharded across all shards.
- When you scale in a clustered cache, data is first resharded and then cluster size is reduced to required shards.
- In some cases, such as scaling or migrating your cache to a different cluster, the underlying IP address of the cache can change. The DNS record for the cache changes and is transparent to most applications. However, if you use an IP address to configure the connection to your cache, or to configure NSGs, or firewalls allowing traffic to the cache, your application might have trouble connecting sometime after the DNS record updates.

### Do I lose data from my cache during scaling?

- When you scale a **Basic** cache to a new size, all data is lost and the cache is unavailable during the scaling operation.
- When you scale a **Basic** cache to a **Standard** cache, the data in the cache is typically preserved.
- When you scale a **Standard**, **Premium**, **Enterprise**, or **Enterprise Flash** cache to a larger size, all data is typically preserved. When you scale a Standard or Premium cache to a smaller size, data can be lost if the data size exceeds the new smaller size when it's scaled down. If data is lost when scaling down, keys are evicted using the [allkeys-lru](https://redis.io/topics/lru-cache) eviction policy.

 ### Can I use all the features of Premium tier after scaling?

No, some features can only be set when you create a cache in Premium tier, and are not available after scaling. 

These features cannot be added after you create the Premium cache:

- VNet injection
- Adding zone redundancy
- Using multiple replicas per primary

To use any of these  features, you must create a new cache instance in the Premium tier. 

### Is my custom databases setting affected during scaling?

If you configured a custom value for the `databases` setting during cache creation, keep in mind that some pricing tiers have different [databases limits](cache-configure.md#databases). Here are some considerations when scaling in this scenario:

- When you scale to a pricing tier with a lower `databases` limit than the current tier:
  - If you're using the default number of `databases`, which is 16 for all pricing tiers, no data is lost.
  - If you're using a custom number of `databases` that falls within the limits for the tier to which you're scaling, this `databases` setting is kept and no data is lost.
  - If you're using a custom number of `databases` that exceeds the limits of the new tier, the `databases` setting is lowered to the limits of the new tier and all data in the removed databases is lost.
- When you scale to a pricing tier with the same or higher `databases` limit than the current tier, your `databases` setting is kept and no data is lost.

While Standard, Premium, Enterprise, and Enterprise Flash caches have a SLA for availability, there's no SLA for data loss.

### Will my cache be available during scaling?

- **Standard**, **Premium**, **Enterprise**, and **Enterprise Flash** caches remain available during the scaling operation. However, connection blips can occur while scaling these caches, and also while scaling from **Basic** to **Standard** caches. These connection blips are expected to be small and redis clients can generally re-establish their connection instantly.
- For **Enterprise** and **Enterprise Flash** caches using active geo-replication, scaling only a subset of linked caches can introduce issues over time in some cases. We recommend scaling all caches in the geo-replication group together where possible. 
- **Basic** caches are offline during scaling operations to a different size. Basic caches remain available when scaling from **Basic** to **Standard** but might experience a small connection blip. If a connection blip occurs, Redis clients can generally re-establish their connection instantly.

### Are there scaling limitations with geo-replication?

With [passive geo-replication](cache-how-to-geo-replication.md) configured, you might notice that you can’t scale a cache or change the shards in a cluster. A geo-replication link between two caches prevents you from scaling operation or changing the number of shards in a cluster. You must unlink the cache to issue these commands. For more information, see [Configure Geo-replication](cache-how-to-geo-replication.md).

With [active geo-replication](cache-how-to-active-geo-replication.md) configured, you can't scale a cache. All caches in a geo replication group must be the same size and capacity. 

### Operations that aren't supported

- You can't scale from a higher pricing tier to a lower pricing tier.
  - You can't scale from a **Premium** cache down to a **Standard** or a **Basic** cache.
  - You can't scale from a **Standard** cache down to a **Basic** cache.
- You can scale from a **Basic** cache to a **Standard** cache but you can't change the size at the same time. If you need a different size, you can do a scaling operation to the size you want at a later time.
- You can't scale from a **Basic** cache directly to a **Premium** cache. First scale from **Basic** to **Standard** in one scaling operation, and then scale from **Standard** to **Premium** in a later operation.
- You can't scale from a **Premium** cache to an **Enterprise** or **Enterprise Flash** cache.
- You can't scale from a larger size down to the **C0 (250 MB)** size.

If a scaling operation fails, the service tries to revert the operation, and the cache will revert to the original size.

### How long does scaling take?

Scaling time depends on a few factors. Here are some factors that can affect how long scaling takes.

- Amount of data: Larger amounts of data take a longer time to be replicated
- High write requests: Higher number of writes mean more data replicates across nodes or shards
- High server load: Higher server load means Redis server is busy and has limited CPU cycles to complete data redistribution

Generally, when you scale a cache with no data, it takes approximately 20 minutes. For clustered caches, scaling takes approximately 20 minutes per shard with minimal data.

### How can I tell when scaling is complete?

In the Azure portal, you can see the scaling operation in progress. When scaling is complete, the status of the cache changes to **Running**.

### Do I need to make any changes to my client application to use clustering?

* When clustering is enabled, only database 0 is available. If your client application uses multiple databases and it tries to read or write to a database other than 0, the following exception is thrown: `Unhandled Exception: StackExchange.Redis.RedisConnectionException: ProtocolFailure on GET --->` `StackExchange.Redis.RedisCommandException: Multiple databases are not supported on this server; cannot switch to database: 6`
  
  For more information, see [Redis Cluster Specification - Implemented subset](https://redis.io/topics/cluster-spec#implemented-subset).
* If you're using [StackExchange.Redis](https://www.nuget.org/packages/StackExchange.Redis/), you must use 1.0.481 or later. You connect to the cache using the same [endpoints, ports, and keys](cache-configure.md#properties) that you use when connecting to a cache where clustering is disabled. The only difference is that all reads and writes must be done to database 0.
  
  Other clients may have different requirements. See [Do all Redis clients support clustering?](#do-all-redis-clients-support-clustering)
* If your application uses multiple key operations batched into a single command, all keys must be located in the same shard. To locate keys in the same shard, see [How are keys distributed in a cluster?](#how-are-keys-distributed-in-a-cluster)
* If you're using Redis ASP.NET Session State provider, you must use 2.0.1 or higher. See [Can I use clustering with the Redis ASP.NET Session State and Output Caching providers?](#can-i-use-clustering-with-the-redis-aspnet-session-state-and-output-caching-providers)

> [!IMPORTANT]
> When using the Enterprise or Enterprise FLash tiers, you are given the choice of _OSS Cluster Mode_ or _Enterprise Cluster Mode_. OSS Cluster Mode is the same as clustering on the Premium tier and follows the open source clustering specification. Enterprise Cluster Mode can be less performant, but uses Redis Enterprise clustering which doesn't require any client changes to use. For more information, see [Clustering on Enterprise](cache-best-practices-enterprise-tiers.md#clustering-on-enterprise).
>
>

### How are keys distributed in a cluster?

Per the Redis documentation on [Keys distribution model](https://redis.io/topics/cluster-spec#keys-distribution-model): The key space is split into 16,384 slots. Each key is hashed and assigned to one of these slots, which are distributed across the nodes of the cluster. You can configure which part of the key is hashed to ensure that multiple keys are located in the same shard using hash tags.

* Keys with a hash tag - if any part of the key is enclosed in `{` and `}`, only that part of the key is hashed for the purposes of determining the hash slot of a key. For example, the following three keys would be located in the same shard: `{key}1`, `{key}2`, and `{key}3` since only the `key` part of the name is hashed. For a complete list of keys hash tag specifications, see [Keys hash tags](https://redis.io/topics/cluster-spec#keys-hash-tags).
* Keys without a hash tag - the entire key name is used for hashing, resulting in a statistically even distribution across the shards of the cache.

For best performance and throughput, we recommend distributing the keys evenly. If you're using keys with a hash tag, it's the application's responsibility to ensure the keys are distributed evenly.

For more information, see [Keys distribution model](https://redis.io/topics/cluster-spec#keys-distribution-model), [Redis Cluster data sharding](https://redis.io/topics/cluster-tutorial#redis-cluster-data-sharding), and [Keys hash tags](https://redis.io/topics/cluster-spec#keys-hash-tags).

For sample code about working with clustering and locating keys in the same shard with the StackExchange.Redis client, see the [clustering.cs](https://github.com/rustd/RedisSamples/blob/master/HelloWorld/Clustering.cs) portion of the [Hello World](https://github.com/rustd/RedisSamples/tree/master/HelloWorld) sample.

### What is the largest cache size I can create?

The largest cache size you can have is 4.5 TB. This result is a clustered F1500 cache with capacity 9. For more information, see [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/).

### Do all Redis clients support clustering?

Many clients libraries support Redis clustering but not all. Check the documentation for the library you're using to verify you're using a library and version that support clustering. StackExchange.Redis is one library that does support clustering, in its newer versions. For more information on other clients, see the [Playing with the cluster](https://redis.io/topics/cluster-tutorial#playing-with-the-cluster) section of the [Redis cluster tutorial](https://redis.io/topics/cluster-tutorial).

The Redis clustering protocol requires each client to connect to each shard directly in clustering mode, and also defines new error responses such as 'MOVED' na 'CROSSSLOTS'. When you attempt to use a client library that doesn't support clustering, with a cluster mode cache, the result can be many [MOVED redirection exceptions](https://redis.io/topics/cluster-spec#moved-redirection), or just break your application, if you're doing cross-slot multi-key requests.

> [!NOTE]
> If you're using StackExchange.Redis as your client, verify that you are using the latest version of [StackExchange.Redis](https://www.nuget.org/packages/StackExchange.Redis/) 1.0.481 or later for clustering to work correctly. For more information on any issues with move exceptions, see [move exceptions](#im-getting-move-exceptions-when-using-stackexchangeredis-and-clustering-what-should-i-do).
>
### How do I connect to my cache when clustering is enabled?

You can connect to your cache using the same [endpoints](cache-configure.md#properties), [ports](cache-configure.md#properties), and [keys](cache-configure.md#access-keys) that you use when connecting to a cache that doesn't have clustering enabled. Redis manages the clustering on the backend so you don't have to manage it from your client.

### Can I directly connect to the individual shards of my cache?

The clustering protocol requires the client to make the correct shard connections, so the client should make share connections for you. With that said, each shard consists of a primary/replica cache pair, collectively known as a cache instance. You can connect to these cache instances using the Redis-CLI utility in the [unstable](https://redis.io/download) branch of the Redis repository at GitHub. This version implements basic support when started with the `-c` switch. For more information, see [Playing with the cluster](https://redis.io/topics/cluster-tutorial#playing-with-the-cluster) on [https://redis.io](https://redis.io) in the [Redis cluster tutorial](https://redis.io/topics/cluster-tutorial).

You need to use the `-p` switch to specify the correct port to connect to. Use the [CLUSTER NODES](https://redis.io/commands/cluster-nodes/) command to determine the exact ports used for the primary and replica nodes. The following port ranges are used:

- For non-TLS Premium tier caches, ports are available in the `130XX` range
- For TLS enabled Premium tier caches, ports are available in the `150XX` range
- For Enterprise and Enterprise Flash caches using OSS clustering, the initial connection is through port 10000. Connecting to individual nodes can be done using ports in the 85XX range. The 85xx ports will change over time and shouldn't be hardcoded into your application. 

### Can I configure clustering for a previously created cache?

Yes. First, ensure that your cache is in the Premium tier by scaling it up. Next, you can see the cluster configuration options, including an option to enable cluster. Change the cluster size after the cache is created, or after you have enabled clustering for the first time.

>[!IMPORTANT]
>You can't undo enabling clustering. And a cache with clustering enabled and only one shard behaves _differently_ than a cache of the same size with _no_ clustering.

All Enterprise and Enterprise Flash tier caches are always clustered.

### Can I configure clustering for a basic or standard cache?

Clustering is only available for Premium, Enterprise, and Enterprise Flash caches.

### Can I use clustering with the Redis ASP.NET Session State and Output Caching providers?

* **Redis Output Cache provider** - no changes required.
* **Redis Session State provider** - to use clustering, you must use [RedisSessionStateProvider](https://www.nuget.org/packages/Microsoft.Web.RedisSessionStateProvider) 2.0.1 or higher or an exception is thrown, which is a breaking change. For more information, see [v2.0.0 Breaking Change Details](https://github.com/Azure/aspnet-redis-providers/wiki/v2.0.0-Breaking-Change-Details).

### I'm getting MOVE exceptions when using StackExchange.Redis and clustering, what should I do?
If you're using StackExchange.Redis and receive `MOVE` exceptions when using clustering, ensure that you're using [StackExchange.Redis 1.1.603](https://www.nuget.org/packages/StackExchange.Redis/) or later. For instructions on configuring your .NET applications to use StackExchange.Redis, see [Configure the cache clients](cache-dotnet-how-to-use-azure-redis-cache.md#configure-the-cache-client).

### What is the difference between OSS Clustering and Enterprise Clustering on Enterprise tier caches?

OSS Cluster Mode is the same as clustering on the Premium tier and follows the open source clustering specification. Enterprise Cluster Mode can be less performant, but uses Redis Enterprise clustering, which doesn't require any client changes to use.  For more information, see [Clustering on Enterprise](cache-best-practices-enterprise-tiers.md#clustering-on-enterprise).

### How many shards do Enterprise tier caches use?

Unlike Basic, Standard, and Premium tier caches, Enterprise and Enterprise Flash caches can take advantage of multiple shards on a single node. For more information, see [Sharding and CPU utilization](cache-best-practices-enterprise-tiers.md#sharding-and-cpu-utilization).

## Next steps

- [Configure your maxmemory-reserved setting](cache-best-practices-memory-management.md#configure-your-maxmemory-reserved-setting)
- [Best practices for scaling](cache-best-practices-scale.md)
