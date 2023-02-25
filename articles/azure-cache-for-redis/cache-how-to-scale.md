---
title: Scale an Azure Cache for Redis instance
description: Learn how to scale your Azure Cache for Redis instances using the Azure portal, and tools such as Azure PowerShell, and Azure CLI
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 03/22/2022
ms.devlang: csharp
ms.custom: devx-track-azurepowershell, devx-track-azurecli

---

# Scale an Azure Cache for Redis instance

Azure Cache for Redis has different cache offerings that provide flexibility in the choice of cache size and features. Through scaling, you can change the size, tier, and number of nodes after creating a cache instance to match your application needs. This article shows you how to scale your cache using the Azure portal, plus tools such as Azure PowerShell and Azure CLI.

## Types of Scaling

There are fundamentally two ways to scale an Azure Cache for Redis Instance:

- **Scaling up** increases the size of the VM running Redis, adding additional memory, vCPUs, and network bandwidth. This is also called _vertical scaling_. The opposite of scaling up is **Scaling down**. 
- **Scaling out** divides the cache instance into additional nodes of the same size, increasing memory, vCPUs, and network bandwidth through parallelization. This is also referred to as _horizontal scaling_ or _sharding_, and in the Redis world is often called [_clustering_](https://redis.io/docs/management/scaling/). The opposite of scaling out is **Scaling in**.  


## Scope of availability

|Tier     | Basic and Standard | Premium  | Enterprise and Enterprise Flash  |
|---------|---------|---------|----------|
|Scale Up  | Yes    | Yes  | Yes (preview) |
|Scale Down  | Yes    | Yes  | No |
|Scale Out  | No    | Yes  | Yes (preview) |
|Scale In  | No    | Yes  | No |

## When to scale

You can use the [monitoring](cache-how-to-monitor.md) features of Azure Cache for Redis to monitor the health and performance of your cache. Use that information determine when to scale the cache.

You can monitor the following metrics to help determine if you need to scale.

- **Redis Server Load**
  - High Redis server load means that the server is unable to keep pace with requests from all the clients. Because Redis server is a single threaded process, it is typically more helpful to _scale out_ rather than _scale up_. Scaling out by enabling clustering helps distribute overhead functions across multiple Redis processes. Scaling out also helps distribute TLS encryption/decryption and connection/disconnection, speeding up cache instances using TLS. 
  - Scaling up can still be helpful in reducing server load because background tasks will take advantage of the additional vCPUs and free up the thread for the main Redis server process.
  - The Enterprise and Enterprise Flash tiers use Redis Enterprise rather than open source Redis. One of the advantages of these tiers is that the Redis server process can take advantage of multiple vCPUs. Because of that, scaling up and scaling out in these tiers can be helpful in reducing server load. See the [Enterprise tier best practices](cache-best-practices-enterprise.md) page for more detail.
  - For more information, see [Set up clustering](cache-how-to-premium-clustering.md#set-up-clustering).
- **Memory Usage**
  - High memory usage indicates that your data size is too large for the current cache size. Consider scaling to a cache size with larger memory. Either _scaling up_ or _scaling out_ is effective here.
- **Client connections**
  - Each cache size has a limit to the number of client connections it can support. If your client connections are close to the limit for the cache size, consider _scaling up_ to a larger tier. _Scaling out_ does not increase the number of supported client connections.
  - For more information on connection limits by cache size, see [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/).
- **Network Bandwidth**
  - If the Redis server exceeds the available bandwidth, clients requests could time out because the server can't push data to the client fast enough. Check "Cache Read" and "Cache Write" metrics to see how much server-side bandwidth is being used. If your Redis server is exceeding available network bandwidth, you should consider scaling up to a larger cache size with higher network bandwidth.
  - For more information on network available bandwidth by cache size, see [Azure Cache for Redis planning FAQs](./cache-planning-faq.yml).

For more information on determining the cache pricing tier to use, see [Choosing the right tier](cache-overview.md#choosing-the-right-tier) and [Azure Cache for Redis planning FAQs](./cache-planning-faq.yml).

> [!NOTE]
> For tips on how to optimize the scaling process, see the [best practices for scaling guide](cache-best-practices-scale.md)
>

## Prerequisites/Limitations of Scaling Azure Cache for Redis

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

- Scale out is only supported on the **Premium**, **Enterprise**, and **Enterprise Flash** tiers.
- Scale in is only supported on the **Premium** tier.
- On the **Premium** tier, clustering must be enbaled first before scaling in or out.

## How to scale a cache up or down

### Scale using the Azure portal

1. To scale your cache, [browse to the cache](cache-configure.md#configure-azure-cache-for-redis-settings) in the [Azure portal](https://portal.azure.com) and select **Scale** on the left.

    :::image type="content" source="media/cache-how-to-scale/scale-a-cache.png" alt-text="scale on the resource menu":::

1. Choose a pricing tier on the right and then choose **Select**.
    
    :::image type="content" source="media/cache-how-to-scale/select-a-tier.png" alt-text="Azure Cache for Redis tiers":::


While the cache is scaling to the new tier, a **Scaling Redis Cache** notification is displayed.

:::image type="content" source="media/cache-how-to-scale/scaling-notification.png" alt-text="notification of scaling":::

When scaling is complete, the status changes from **Scaling** to **Running**.

> [!NOTE]
> When you scale a cache up or down using the portal, both `maxmemory-reserved` and `maxfragmentationmemory-reserved` settings automatically scale in proportion to the cache size. For example, if `maxmemory-reserved` is set to 3 GB on a 6-GB cache, and you scale to 12-GB cache, the settings automatically get updated to 6 GB during scaling. When you scale down, the reverse happens.
>


### Scale using PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

You can scale your Azure Cache for Redis instances with PowerShell by using the [Set-AzRedisCache](/powershell/module/az.rediscache/set-azrediscache) cmdlet when the `Size`, `Sku`, or `ShardCount` properties are modified. The following example shows how to scale a cache named `myCache` to a 2.5-GB cache.

```powershell
   Set-AzRedisCache -ResourceGroupName myGroup -Name myCache -Size 2.5GB
```

For more information on scaling with PowerShell, see [To scale an Azure Cache for Redis using PowerShell](cache-how-to-manage-redis-cache-powershell.md#scale).

### Scale using Azure CLI

To scale your Azure Cache for Redis instances using Azure CLI, call the `azure rediscache set` command and pass in the configuration changes you want that include a new size, sku, or cluster size, depending on the scaling operation you wish.

For more information on scaling with Azure CLI, see [Change settings of an existing Azure Cache for Redis](cache-manage-cli.md#scale).

> [!NOTE]
> When you scale a cache up or down programatically (e.g. using PowerShell or Azure CLI), any `maxmemory-reserved` or `maxfragmentationmemory-reserved` are ignored as part of the update request. Only your scaling change is honored. You can update these memory settings after the scaling operation has completed.
>


## Scaling FAQ

The following list contains answers to commonly asked questions about Azure Cache for Redis scaling.

- [Can I scale to, from, or within a Premium cache?](#can-i-scale-to-from-or-within-a-premium-cache)
- [After scaling, do I have to change my cache name or access keys?](#after-scaling-do-i-have-to-change-my-cache-name-or-access-keys)
- [How does scaling work?](#how-does-scaling-work)
- [Will I lose data from my cache during scaling?](#will-i-lose-data-from-my-cache-during-scaling)
- [Is my custom databases setting affected during scaling?](#is-my-custom-databases-setting-affected-during-scaling)
- [Will my cache be available during scaling?](#will-my-cache-be-available-during-scaling)
- [Are there scaling limitations with geo-replication?](#are-there-scaling-limitations-with-geo-replication)
- [Operations that aren't supported](#operations-that-arent-supported)
- [How long does scaling take?](#how-long-does-scaling-take)
- [How can I tell when scaling is complete?](#how-can-i-tell-when-scaling-is-complete)

### Can I scale to, from, or within a Premium cache?

- You can't scale from a **Premium** cache down to a **Basic** or **Standard** pricing tier.
- You can scale from one **Premium** cache pricing tier to another.
- You can't scale from a **Basic** cache directly to a **Premium** cache. First, scale from **Basic** to **Standard** in one scaling operation, and then from **Standard** to **Premium** in a later scaling operation.
- If you enabled clustering when you created your **Premium** cache, you can [change the cluster size](cache-how-to-premium-clustering.md#set-up-clustering). If your cache was created without clustering enabled, you can configure clustering at a later time.

For more information, see [How to configure clustering for a Premium Azure Cache for Redis](cache-how-to-premium-clustering.md).

### After scaling, do I have to change my cache name or access keys?

No, your cache name and keys are unchanged during a scaling operation.

### How does scaling work?

- When you scale a **Basic** cache to a different size, it's shut down and a new cache is provisioned using the new size. During this time, the cache is unavailable and all data in the cache is lost.
- When you scale a **Basic** cache to a **Standard** cache, a replica cache is provisioned and the data is copied from the primary cache to the replica cache. The cache remains available during the scaling process.
- When you scale a **Standard** cache to a different size or to a **Premium** cache, one of the replicas is shut down and reprovisioned to the new size and the data transferred over, and then the other replica does a failover before it's reprovisioned, similar to the process that occurs during a failure of one of the cache nodes.
- When you scale out a clustered cache, new shards are provisioned and added to the Redis server cluster. Data is then resharded across all shards.
- When you scale in a clustered cache, data is first resharded and then cluster size is reduced to required shards.
- In some cases, such as scaling or migrating your cache to a different cluster, the underlying IP address of the cache can change. The DNS record for the cache changes and is transparent to most applications. However, if you use an IP address to configure the connection to your cache, or to configure NSGs, or firewalls allowing traffic to the cache, your application might have trouble connecting sometime after that the DNS record updates.

### Will I lose data from my cache during scaling?

- When you scale a **Basic** cache to a new size, all data is lost and the cache is unavailable during the scaling operation.
- When you scale a **Basic** cache to a **Standard** cache, the data in the cache is typically preserved.
- When you scale a **Standard** cache to a larger size or tier, or a **Premium** cache is scaled to a larger size, all data is typically preserved. When you scale a Standard or Premium cache to a smaller size, data can be lost if the data size exceeds the new smaller size when it's scaled down. If data is lost when scaling down, keys are evicted using the [allkeys-lru](https://redis.io/topics/lru-cache) eviction policy.

### Is my custom databases setting affected during scaling?

If you configured a custom value for the `databases` setting during cache creation, keep in mind that some pricing tiers have different [databases limits](cache-configure.md#databases). Here are some considerations when scaling in this scenario:

- When you scale to a pricing tier with a lower `databases` limit than the current tier:
  - If you're using the default number of `databases`, which is 16 for all pricing tiers, no data is lost.
  - If you're using a custom number of `databases` that falls within the limits for the tier to which you're scaling, this `databases` setting is kept and no data is lost.
  - If you're using a custom number of `databases` that exceeds the limits of the new tier, the `databases` setting is lowered to the limits of the new tier and all data in the removed databases is lost.
- When you scale to a pricing tier with the same or higher `databases` limit than the current tier, your `databases` setting is kept and no data is lost.

While Standard and Premium caches have a 99.9% SLA for availability, there's no SLA for data loss.

### Will my cache be available during scaling?

- **Standard** and **Premium** caches remain available during the scaling operation. However, connection blips can occur while scaling Standard and Premium caches, and also while scaling from Basic to Standard caches. These connection blips are expected to be small and redis clients can generally re-establish their connection instantly.
- **Basic** caches are offline during scaling operations to a different size. Basic caches remain available when scaling from **Basic** to **Standard** but might experience a small connection blip. If a connection blip occurs, Redis clients can generally re-establish their connection instantly.

### Are there scaling limitations with geo-replication?

With geo-replication configured, you might notice that you can’t scale a cache or change the shards in a cluster. A geo-replication link between two caches prevents you from scaling operation or changing the number of shards in a cluster. You must unlink the cache to issue these commands. For more information, see [Configure Geo-replication](cache-how-to-geo-replication.md).

### Operations that aren't supported

- You can't scale from a higher pricing tier to a lower pricing tier.
  - You can't scale from a **Premium** cache down to a **Standard** or a **Basic** cache.
  - You can't scale from a **Standard** cache down to a **Basic** cache.
- You can scale from a **Basic** cache to a **Standard** cache but you can't change the size at the same time. If you need a different size, you can do a scaling operation to the size you want at a later time.
- You can't scale from a **Basic** cache directly to a **Premium** cache. First scale from **Basic** to **Standard** in one scaling operation, and then scale from **Standard** to **Premium** in a later operation.
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
