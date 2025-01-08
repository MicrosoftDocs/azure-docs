---
title: Configure active geo-replication for Azure Managed Redis (preview) instances
description: Learn how to replicate your Azure Managed Redis instances across Azure regions.


ms.service: azure-managed-redis
ms.custom: devx-track-azurecli, ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---

# Configure active geo-replication for Azure Managed Redis (preview) instances

In this article, you learn how to configure an active geo-replicated cache using the Azure portal.

Active geo-replication groups up to five instances of Azure Managed Redis (preview) into a single cache that spans across Azure regions. All instances act as the local, primary caches. An application decides which instance or instances to use for read and write requests.

> [!NOTE]
> Data transfer between Azure regions is charged at standard [bandwidth rates](https://azure.microsoft.com/pricing/details/bandwidth/).
>

## How active geo-replication works
Active geo-replication uses conflict-free replicated data types (CRDTs) to seamlessly distribute data across Redis instances that can be distributed across continents. These instances are connected in an active-active configuration, where writes to one instance are automatically reflected in the other instances in the same geo-replication group. This bi-directional data replication differs from unidirectional active-passive replication approaches, where data is replicated from the primary to a geo-replica, but not the other direction. This is a powerful tool that is commonly used in several ways:
- _Providing local latency by distributing caching closer to users_. By using a network of active geo-replicated Redis instances, you can place caches geographically closer to users in each region, reducing latency and improving app performance.
- _Synchronizing global applications_. Since geo-replicated caches appear like a single Redis instance, you can globally distribute data without needing to segment data by regions. For example, you can use a single Redis [sorted set to provide a gaming leaderboard](https://redis.io/solutions/leaderboards/) for all users worldwide, rather than provide a separate leaderboard for each geographic region. 
- _Reducing downtime and risk from regional outages_. Because each Redis instance in the geo-replication group is constantly being updated with the latest data from the other instances in the group, data is well preserved in the case of a regional outage. Applications can temporarily switch to use one of the other instances in the group, and when the region comes back online, the Redis instance there will automatically be re-loaded with data from the other geo-replicated caches. 

For a more detailed breakdown of how active geo-replication works, see [Active-Active geo-distribution (CRDTS-based)](https://redis.io/active-active/)

## Scope of availability

|Tier      | Memory Optimized, Balanced, Compute Optimized  | Flash Optimized  |
|--------- |:------------------:|:----------:|
|Available | Yes (except B0 and B1)        | Yes       |

> [!IMPORTANT]
> The Balanced B0 and B1 SKUs do not support active geo-replication.
>

## Active geo-replication prerequisites

There are a few restrictions when using active geo replication:

- Active geo-replication is only supported when Azure Managed Redis is in a high availability configuration (i.e. it is using replication).
- Only the [RediSearch](managed-redis-redis-modules.md#redisearch) and [RedisJSON](managed-redis-redis-modules.md#redisjson) modules are supported
- On the _Flash Optimized_ tier, only the _No Eviction_ eviction policy can be used. All eviction policies are supported on the other tiers.
- Data persistence isn't supported because active geo-replication provides a superior experience.
- All caches within a geo-replication group must have the same configuration. For example, all caches must have the same SKU, capacity, eviction policy, clustering policy, modules, and TLS setting.
- If one instance in a geo-replication group is scaled, the other instances in that group must be scaled to the same size before any additional scaling can occur. See [Scaling instances in a geo-replication group](#scaling-instances-in-a-geo-replication-group) for more information.
- You can't use the `FLUSHALL` and `FLUSHDB` Redis commands when using active geo-replication. Prohibiting the commands prevents unintended deletion of data. Use the [flush operation](#flush-operation) instead.

## Create or join an active geo-replication group

1. When creating a new Azure Managed Redis resource, select the **Advanced** tab. Complete the first part of the form including clustering policy. For more information on choosing **Clustering policy**, see [Clustering in Azure Managed Redis](managed-redis-architecture.md#cluster-policies).

1. Select **Configure** to set up **Active geo-replication**.

   :::image type="content" source="media/managed-redis-how-to-active-geo-replication/managed-redis-active-geo-replication-configure.png" alt-text="Screenshot of advanced tab of create new Redis cache page.":::

1. Create a new replication group for a first cache instance. Or, select an existing one from the list.

   :::image type="content" source="media/managed-redis-how-to-active-geo-replication/managed-redis-active-geo-replication-new-group.png" alt-text="Screenshot showing replication groups.":::

1. Select **Configure** to finish.

1. Wait for the first cache to be created successfully. When complete, you see **Configured** set for **Active geo-replication**. Repeat the above steps for each cache instance in the geo-replication group.

   :::image type="content" source="media/managed-redis-how-to-active-geo-replication/managed-redis-active-geo-replication-configured.png" alt-text="Screenshot showing active geo-replication is configured.":::

## Add an existing instance to an active geo-replication group

To add an existing cache instance to an active geo-replication group, you can [use the REST API to perform a force-link action](/rest/api/redis/redisenterprisecache/databases/force-link-to-replication-group).

All data in the cache instance being linked will be discarded. The instance will also be temporarily unavailable for several minutes while joining the geo-replication group. Portal and CLI support are not yet available for this feature. 

## Remove from an active geo-replication group

To remove a cache instance from an active geo-replication group, you just delete the instance. The remaining instances then reconfigure themselves automatically.

### Force-unlink if there's a region outage

Active geo-replication is a powerful feature to dramatically boost availability when using Azure Managed Redis. You should take steps, however, to prepare your caches if there's a regional outage.

For example, consider these tips:

- Identify in advance which other cache in the geo-replication group to switch over to if a region goes down.
- Ensure that firewalls are set so that any applications and clients can access the identified backup cache.
- Each cache in the geo-replication group has its own access key. Determine how the application switches to different access keys when targeting a backup cache.
- If a cache in the geo-replication group goes down, a buildup of metadata starts to occur in all the caches in the geo-replication group. The metadata can't be discarded until writes can be synced again to all caches. You can prevent the metadata build-up by _force unlinking_ the cache that is down. Consider monitoring the available memory in the cache and unlinking if there's memory pressure, especially for write-heavy workloads.

It's also possible to use a [circuit breaker pattern](/azure/architecture/patterns/circuit-breaker). Use the pattern to automatically redirect traffic away from a cache experiencing a region outage, and towards a backup cache in the same geo-replication group. Use Azure services such as [Azure Traffic Manager](/azure/traffic-manager/traffic-manager-overview) or [Azure Load Balancer](/azure/load-balancer/load-balancer-overview) to enable the redirection.


In case one of the caches in your replication group is unavailable due to region outage, you can forcefully remove the unavailable cache from the replication group.

You should remove the unavailable cache because the remaining caches in the replication group start storing the metadata that hasn’t been shared to the unavailable cache. When this happens, the available caches in your replication group might run out of memory.

1. Go to Azure portal and select one of the caches in the replication group that is still available.

1. Select to **Active geo-replication** in the Resource menu on the left to see the settings in the working pane.

    :::image type="content" source="media/managed-redis-how-to-active-geo-replication/managed-redis-active-geo-replication-group.png" alt-text="Screenshot of active geo-replication group.":::

1. Select the cache that you need to force-unlink by checking the box.

1. Select **Force unlink** and then **OK** to confirm.

    :::image type="content" source="media/managed-redis-how-to-active-geo-replication/managed-redis-cache-active-geo-replication-unlink.png" alt-text="Screenshot of unlinking in active geo-replication.":::

1. Once the affected region's availability is restored, you need to delete the affected cache, and recreate it to add it back to your replication group.

## Set up active geo-replication using the Azure CLI or PowerShell

### Azure CLI

Use the Azure CLI to create a new cache and geo-replication group, or to add a new cache to an existing geo-replication group. For more information, see [az redisenterprise create](/cli/azure/redisenterprise#az-redisenterprise-create).

#### Create a new Azure Managed Redis instance in a new geo-replication group using Azure CLI

This example creates a new Azure Managed Redis Balanced B10 instance called _Cache1_ in the East US region. Then, the cache is added to a new active geo-replication group called _replicationGroup_:

```azurecli-interactive
az redisenterprise create --location "East US" --cluster-name "Cache1" --sku "Balanced_B10" --resource-group "myResourceGroup" --group-nickname "replicationGroup" --linked-databases id="/subscriptions/34b6ecbd-ab5c-4768-b0b8-bf587aba80f6/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache1/databases/default"
```

To configure active geo-replication properly, the ID of the cache instance being created must be added with the `--linked-databases` parameter. The ID is in the format:

`/subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group-name>/providers/Microsoft.Cache/redisEnterprise/<your-cache-name>/databases/default`

#### Create new Azure Managed Redis instance in an existing geo-replication group using Azure CLI

This example creates a new Balanced B10 cache instance called _Cache2_ in the West US region. Then, the script adds the cache to the `replicationGroup` active geo-replication group create in a previous procedure. This way, it's linked in an active-active configuration with _Cache1_.

```azurecli-interactive
az redisenterprise create --location "West US" --cluster-name "Cache2" --sku "Balanced_B10" --resource-group "myResourceGroup" --group-nickname "replicationGroup" --linked-databases id="/subscriptions/34b6ecbd-ab5c-4768-b0b8-bf587aba80f6/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache1/databases/default" --linked-databases id="/subscriptions/34b6ecbd-ab5c-4768-b0b8-bf587aba80f6/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache2/databases/default"
```

As before, you need to list both _Cache1_ and _Cache2_ using the `--linked-databases` parameter.

### Azure PowerShell

Use Azure PowerShell to create a new cache and geo-replication group, or to add a new cache to an existing geo-replication group. For more information, see [New-AzRedisEnterpriseCache](/powershell/module/az.redisenterprisecache/new-azredisenterprisecache).

#### Create new Azure Managed Redis instance in a new geo-replication group using PowerShell

This example creates a new Azure Managed Redis Balanced B10 cache instance called _Cache1_ in the East US region. Then, the cache is added to a new active geo-replication group called _replicationGroup_:

```powershell-interactive
New-AzRedisEnterpriseCache -Name "Cache1" -ResourceGroupName "myResourceGroup" -Location "East US" -Sku "Balanced_B10" -GroupNickname "replicationGroup" -LinkedDatabase '{id:"/subscriptions/34b6ecbd-ab5c-4768-b0b8-bf587aba80f6/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache1/databases/default"}'
```

To configure active geo-replication properly, the ID of the cache instance being created must be added with the `-LinkedDatabase` parameter. The ID is in the format:

`/subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group-name>/providers/Microsoft.Cache/redisEnterprise/<your-cache-name>/databases/default`

#### Create new Azure Managed Redis instance in an existing geo-replication group using PowerShell

This example creates a new Balanced B10 cache instance called _Cache2_ in the West US region. Then, the script adds the cache to the  active geo-replication group,"replicationGroup", created in the previous procedure. The result is the two caches, _Cache1_ and _Cache2_, are linked in an active-active configuration.

```powershell-interactive
New-AzRedisEnterpriseCache -Name "Cache2" -ResourceGroupName "myResourceGroup" -Location "West US" -Sku "Balanced_B10" -GroupNickname "replicationGroup" -LinkedDatabase '{id:"/subscriptions/34b6ecbd-ab5c-4768-b0b8-bf587aba80f6/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache1/databases/default"}', '{id:"/subscriptions/34b6ecbd-ab5c-4768-b0b8-bf587aba80f6/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache2/databases/default"}'
```

As before, you need to list both _Cache1_ and _Cache2_ using the `-LinkedDatabase` parameter.

## Scaling instances in a geo-replication group
It is possible to scale instances that are configured to use active geo-replication. However, a geo-replication group with a mix of different cache sizes can introduce problems. To prevent these issues from occurring, all caches in a geo replication group need to be the same size and performance tier. 

Since scaling requires changing the size or tier and it is difficult to simultaneously scale all instances in the geo-replication group, Azure Managed Redis has a locking mechanism. If you scale one instance in a geo-replication group, the underlying VM will be scaled, but the memory available will be capped at the original size until the other instances are scaled up as well. And any other scaling operations for the remaining instances are locked until they match the same configuration as the first cache to be scaled.

### Scaling example
For example, you may have three instances in your geo-replication group, all Memory Optimized M10 instances:

| Instance Name |   Redis00   |    Redis01   |   Redis02  |
|-----------|:--------------------:|:--------------------:|:--------------------:|
| Type | Memory Optimized M10 | Memory Optimized M10 | Memory Optimized M10 |

Let's say you want to scale up each instance in this geo-replication group to a Compute Optimized X20 instance. You would first scale one of the caches up to an X20:

| Instance Name |   Redis00   |    Redis01   |   Redis02  |
|-----------|:--------------------:|:--------------------:|:--------------------:|
| Type | Compute Optimized X20 | Memory Optimized M10 | Memory Optimized M10 |

At this point, the `Redis01` and `Redis02` instances can only scale up a Compute Optimized X20 instance. All other scaling operations are blocked. 
>[!NOTE]
> The `Redis00` instance is not blocked from scaling further at this point. But it will be blocked once either `Redis01` or `Redis02` is scaled to be a Compute Optimized X20.
>

Once each instance has been scaled to the same tier and size, all scaling locks are removed:

| Instance Name |   Redis00   |    Redis01   |   Redis02  |
|-----------|:--------------------:|:--------------------:|:--------------------:|
| Type | Compute Optimized X20 | Compute Optimized X20 | Compute Optimized X20 |


## Flush operation

Due to the potential for inadvertent data loss, you can't use the `FLUSHALL` and `FLUSHDB` Redis commands with any cache instance residing in a geo-replication group. Instead, use the **Flush Cache(s)** button located at the top of the **Active geo-replication** working pane.

:::image type="content" source="media/managed-redis-how-to-active-geo-replication/managed-redis-active-flush.png" alt-text="Screenshot showing Active geo-replication selected in the Resource menu and the Flush cache feature has a red box around it.":::

### Flush caches using Azure CLI or PowerShell

The Azure CLI and PowerShell can also be used to trigger a flush operation. For more information on using Azure CLI, see [az redisenterprise database flush](/cli/azure/redisenterprise#az-redisenterprise-database-flush). For more information on using PowerShell, see [Invoke-AzRedisEnterpriseCacheDatabaseFlush](/powershell/module/az.redisenterprisecache/invoke-azredisenterprisecachedatabaseflush).

> [!IMPORTANT]
> Be careful when using the **Flush Caches** feature. Selecting the button removes all data from the current cache and from ALL linked caches in the geo-replication group.
>

Manage access to the feature using [Azure role-based access control](/azure/role-based-access-control/overview). Only authorized users should be given access to flush all caches.

## Next steps

- [Azure Managed Redis service tiers](managed-redis-overview.md#choosing-the-right-tier)
- [High availability for Azure Cache for Redis](managed-redis-high-availability.md)
