---
title: Scale an Azure Managed Redis (preview) instance
description: Learn how to scale your Azure Managed Redis instances using the Azure portal, and tools such as Azure PowerShell, and Azure CLI


ms.service: azure
ms.topic: conceptual
ms.date: 11/15/2024
ms.devlang: csharp
ms.custom: devx-track-azurepowershell, devx-track-azurecli, ignite-2024
---

# Scale an Azure Managed Redis (preview) instance

Azure Managed Redis (preview) has different SKU and tier offerings that provide flexibility in the choice of cache size and performance. You can scale up to a larger memory size or change to a tier with more compute performance. This article shows you how to scale your cache using the Azure portal, plus tools such as Azure PowerShell and Azure CLI.

> [!NOTE]
> Because each tier of Azure Managed Redis has virtually the same features, scaling is typically used just to change memory and performance characteristics.
>

> [!IMPORTANT]
> Currently, only scaling up to larger memory sizes or a higher performance tier is supported. Scaling down memory sizes or to a less performant tier is not yet supported.
>

## Types of scaling

Azure Managed Redis supports scaling in two dimensions:

- **Memory** Increasing memory increases the size of the Redis instance, allowing you to store more data.

- **vCPUs** Azure Managed Redis offers three tiers (_Memory Optimized_, _Balanced_, and _Compute Optimized_) that have an increasing number of vCPUs for each level of memory. Scaling to a tier with more vCPUs increases the performance of your instance without requiring you to increase memory. Unlike the community edition of Redis, which can only utilize a single vCPU, Azure Managed Redis uses the Redis Enterprise stack, which is able to use multiple vCPUs. This means that the number of vCPUs used by your Redis instance directly correlates with throughput and latency performance.

## Performance tiers

There are four tiers of Azure Managed Redis available, each with different performance characteristics and price levels.

Three tiers are for in-memory data:

- _Memory Optimized_. Ideal for memory-intensive use cases that require a high memory-to-vCPU ratio (8:1) but don't need the highest throughput performance. It provides a lower price point for scenarios where less processing power or throughput is necessary, making it an excellent choice for development and testing environments.
- _Balanced (Memory + Compute)_. Offers a balanced memory-to-vCPU (4:1) ratio, making it ideal for standard workloads. It provides a healthy balance of memory and compute resources.
- _Compute Optimized_. Designed for performance-intensive workloads requiring maximum throughput, with a low memory-to-vCPU (2:1) ratio. It's ideal for applications that demand the highest performance.

One tier stores data both in-memory and on-disk:

- _Flash Optimized_. Enables Redis clusters to automatically move less frequently accessed data from memory (RAM) to NVMe storage. This reduces performance, but allows for cost-effective scaling of caches with large datasets.

## Tiers and SKUs at glance

:::image type="content" source="media/managed-redis-how-to-scale/tier-diagram.png" alt-text="Table showing the different memory and vCPU configurations for each SKU and tier of Azure Managed Redis.":::

## Performance (Throughput and Latency)

For performance benchmarks and more information on how to measure the performance of each SKU and tier, see [Performance testing with Azure Managed Redis](managed-redis-best-practices-performance.md)

## When to scale

You can use the [monitoring](../monitor-cache.md) features of Azure Managed Redis to monitor the health and performance of your cache. Use that information to determine when to scale the cache.

You can monitor the following metrics to determine if you need to scale.

- **CPU**
  - High CPU usage means that the Redis server is unable to keep pace with requests from all the clients. Scaling up to more vCPUs helps distribute requests across multiple Redis processes. Scaling also helps distribute TLS encryption/decryption and connection/disconnection, speeding up cache instances using TLS.
- **Memory Usage**
  - High memory usage indicates that your data size is too large for the current cache size. Consider scaling to a cache size with larger memory.
- **Client connections**
  - Each cache size has a limit to the number of client connections it can support. If your client connections are close to the limit for the cache size, consider scaling to a larger memory size or a higher performance tier.
  - For more information on connection limits by cache size, see [Performance testing with Azure Managed Redis](managed-redis-best-practices-performance.md).
- **Network Bandwidth**
  - If the Redis server exceeds the available bandwidth, clients requests could time out because the server can't push data to the client fast enough. To see how much server-side bandwidth is being used, check "Cache Read" and "Cache Write" metrics. If your Redis server is exceeding available network bandwidth, consider scaling to a higher performance tier or a larger cache size.
  - The choice of cluster policy affects network bandwidth available. Generally, the _OSS_ cluster policy has higher network bandwidth than the _Enterprise_ cluster policy. For more information, see [Cluster policy](managed-redis-architecture.md#cluster-policies)
  - For more information on network available bandwidth by cache size, see [Performance testing with Azure Managed Redis](managed-redis-best-practices-performance.md).

For more information on determining the cache pricing tier to use, see [Choosing the right tier](managed-redis-overview.md#choosing-the-right-tier).

> [!NOTE]
> For more information on how to optimize the scaling process, see the [best practices for scaling guide](managed-redis-best-practices-scale.md)
>

## Prerequisites/limitations of scaling Azure Managed Redis

- You can't scale from the **Memory Optimized**, **Balanced**, or **Compute Optimized** tiers to the **Flash Optimized** tier, or vice-versa.
- You can't scale down from to a SKU with fewer vCPUs. (Across tiers or within a tier.)
- You can't scale down to a smaller memory size, even if it has the same or more vCPUs.
- In some cases when scaling, the underlying IP address of the Redis instance can change. The DNS record for the instance changes and is transparent to most applications. However, if you use an IP address to configure the connection to your cache, or to configure NSGs, or firewalls allowing traffic to the cache, your application might have trouble connecting sometime after the DNS record updates.
- Scaling an instance in a geo-replication group has some more limitations. See [Are there scaling limitations with geo-replication?](#are-there-scaling-limitations-with-geo-replication) for more information.
  
## How to scale

> [!TIP]
> You can change both the memory size and performance tier in one operation.
>

### Scale using the Azure portal

1. To scale your cache, [browse to the cache](managed-redis-configure.md#configure-azure-managed-redis-settings) in the [Azure portal](https://portal.azure.com) and select **Scale** from the Resource menu.

   :::image type="content" source="media/managed-redis-how-to-scale/managed-redis-enterprise-scale.png" alt-text="Screenshot showing Scale selected in the Resource menu for an Enterprise cache.":::

1. To scale up, choose a different **Cache type** and then choose **Save**.
   > [!IMPORTANT]
   > If you select a SKU that cannot be scaled to, the **Save** option is disabled. Review the [Prerequisites/limitations of scaling Azure Managed Redis](#prerequisiteslimitations-of-scaling-azure-managed-redis) section for details on which scaling options are allowed.

   :::image type="content" source="media/managed-redis-how-to-scale/managed-redis-enterprise-scale-up.png" alt-text="Screenshot showing the Enterprise tiers in the working pane.":::

1. While the cache is scaling to the new tier, a **Scaling Redis Cache** notification is displayed.

    :::image type="content" source="media/managed-redis-how-to-scale/managed-redis-enterprise-notifications.png" alt-text="Screenshot showing notification of scaling an Enterprise cache.":::

1. When scaling is complete, the status changes from **Scaling** to **Running**.

### Scale using PowerShell

You can scale your Azure Managed Redis instances with PowerShell by using the [Update-AzRedisEnterpriseCache](/powershell/module/az.redisenterprisecache/update-azredisenterprisecache) cmdlet. You can modify the `Sku` property to select the tier and SKU you need. The following example shows how to scale a cache named `myCache` to a Compute Optimized X20 (24 GB) instance.

```powershell
   Update-AzRedisEnterpriseCache -ResourceGroupName myGroup -Name myCache -Sku ComputeOptimized_X20
```

### Scale using Azure CLI

To scale your Azure Managed Redis instances using Azure CLI, call the [az redisenterprise update](/cli/azure/redisenterprise#az-redisenterprise-update) command. You can modify the `sku` property to select the tier and SKU you need. The following example shows how to scale a cache named `myCache` to a Compute Optimized X20 (24 GB) instance.

```azurecli
az redisenterprise update --cluster-name "myCache" --resource-group "myGroup" --sku "ComputeOptimized_X20"
```

## Scaling FAQ

The following list contains answers to commonly asked questions about Azure Managed Redis scaling.

- [Can I scale within or across tiers?](#can-i-scale-within-or-across-tiers)
- [After scaling, do I have to change my cache name or access keys?](#after-scaling-do-i-have-to-change-my-cache-name-or-access-keys)
- [How does scaling work?](#how-does-scaling-work)
- [Do I lose data from my cache during scaling?](#do-i-lose-data-from-my-cache-during-scaling)
- [Will my cache be available during scaling?](#will-my-cache-be-available-during-scaling)
- [Are there scaling limitations with geo-replication?](#are-there-scaling-limitations-with-geo-replication)
- [How long does scaling take?](#how-long-does-scaling-take)
- [How can I tell when scaling is complete?](#how-can-i-tell-when-scaling-is-complete)
- [Does Azure Managed Redis use clustering?](#does-azure-managed-redis-use-clustering)
  [How many shards does each Azure Managed Redis SKU use?](#how-many-shards-does-each-azure-managed-redis-sku-use)
- [How are keys distributed in a cluster?](#how-are-keys-distributed-in-a-cluster)
- [What is the largest cache size I can create?](#what-is-the-largest-cache-size-i-can-create)
- [What is the difference between the OSS and Enterprise cluster policies?](#what-is-the-difference-between-the-oss-and-enterprise-cluster-policies)

### Can I scale within or across tiers?

You can always scale to a higher performance tier at the same memory size or a larger memory size within the same performance tier. For scaling to a lower performance tier or smaller memory size, see the [Prerequisites/limitations of scaling Azure Managed Redis](#prerequisiteslimitations-of-scaling-azure-managed-redis).

### After scaling, do I have to change my cache name or access keys?

No, your cache name and keys are unchanged during a scaling operation.

### How does scaling work?

- When you scale a Redis instance, one of the nodes in the Redis cluster is shut down and reprovisioned to the new size. Then data transferred over, and then the other node does a similar failover before it's reprovisioned. This is similar to the process that occurs during patching or a failure of one of the cache nodes.
- When scaling to an instance with more vCPUs, new shards are provisioned and added to the Redis server cluster. Data is then resharded across all shards.

For more information on how Azure Managed Redis handles sharding, see [Sharding configuration](managed-redis-architecture.md#sharding-configuration).

### Do I lose data from my cache during scaling?

- If high availability mode is enabled, all data should be preserved during scaling operations.
- If you're scaling down to a smaller memory level, data can be lost if the data size exceeds the new smaller size when the cache is scaled down. If data is lost when scaling down, keys are evicted using the [allkeys-lru](https://redis.io/topics/lru-cache) eviction policy.
- If high availability mode is disabled, all data is lost and the cache is unavailable during the scaling operation.

### Will my cache be available during scaling?

- Azure Managed Redis instances with high availability mode enabled remain available during the scaling operation. However, connection blips can occur while scaling these caches. These connection blips are typically short and Redis clients can generally re-establish their connection instantly.
- If high availability mode is disabled, the Azure Managed Redis instance is offline during scaling operations.

### Are there scaling limitations with geo-replication?

With [active geo-replication](managed-redis-how-to-active-geo-replication.md) configured, you can't mix and match cache sizes in a geo-replication group. As a result, scaling the caches in a geo-replication group requires a few more steps. See [Scaling instances in a geo-replication group](managed-redis-how-to-active-geo-replication.md#scaling-instances-in-a-geo-replication-group) for instructions.

### How long does scaling take?

Scaling time depends on a few factors. Here are some factors that can affect how long scaling takes.

- Amount of data: Larger amounts of data take a longer time to be replicated
- High write requests: Higher number of writes mean more data replicates across nodes or shards
- High CPU usage: Higher CPU usage means the Redis server is busy and limited CPU cycles are available to complete data redistribution

Generally, when you scale an instance with no data, it takes approximately 10 minutes.

### How can I tell when scaling is complete?

In the Azure portal, you can see the scaling operation in progress. When scaling is complete, the status of the cache changes to **Running**.

### Does Azure Managed Redis use clustering?

Unlike Azure Cache for Redis, Azure Managed Redis uses clustering across all tiers and SKUs. Clustering enables significant performance optimizations. Each SKU of Azure Managed Redis is configured for an optimized number of shards for the number of vCPUs available. The number of shards isn't user configurable.

### How many shards does each Azure Managed Redis SKU use?

Because Azure Managed Redis runs on Redis Enterprise software, shards can be used in a denser configuration than in community Redis. To learn about the specific number of shards used in each SKU, see [Sharding configuration](managed-redis-architecture.md#sharding-configuration).

### How are keys distributed in a cluster?

Per the Redis documentation on [Keys distribution model](https://redis.io/topics/cluster-spec#keys-distribution-model): The key space is split into 16,384 slots. Each key is hashed and assigned to one of these slots, which are distributed across the nodes of the cluster. You can configure which part of the key is hashed to ensure that multiple keys are located in the same shard using hash tags.

- Keys with a hash tag - if any part of the key is enclosed in `{` and `}`, only that part of the key is hashed for the purposes of determining the hash slot of a key. For example, the following three keys would be located in the same shard: `{key}1`, `{key}2`, and `{key}3` since only the `key` part of the name is hashed. For a complete list of keys hash tag specifications, see [Keys hash tags](https://redis.io/topics/cluster-spec#keys-hash-tags).
- Keys without a hash tag - the entire key name is used for hashing, resulting in a statistically even distribution across the shards of the cache.

For best performance and throughput, we recommend distributing the keys evenly. If you're using keys with a hash tag, it's the application's responsibility to ensure the keys are distributed evenly.

For more information, see [Keys distribution model](https://redis.io/topics/cluster-spec#keys-distribution-model), [Redis Cluster data sharding](https://redis.io/topics/cluster-tutorial#redis-cluster-data-sharding), and [Keys hash tags](https://redis.io/topics/cluster-spec#keys-hash-tags).

### What is the largest cache size I can create?

The largest cache size you can have is 4.5 TB, called Flash Optimized A4500 instance. [Azure Cache for Redis Pricing](https://azure.microsoft.com/pricing/details/cache/).

### What is the difference between the OSS and Enterprise cluster policies?

OSS cluster policy is the same as clustering approach used in community edition Redis. Typically OSS cluster policy is more performant. Enterprise cluster policy implements clustering so that it appears to a client as a nonclustered Redis instance. This approach can be less performant, but can prevent client compatibility issues. It isn't currently possible to switch between cluster policies on a running instance. For more information, see [Cluster policy](managed-redis-architecture.md#cluster-policies).

## Next steps

- [Best practices for scaling](managed-redis-best-practices-scale.md)
