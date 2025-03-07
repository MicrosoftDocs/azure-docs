---
title: Configure active geo-replication for Enterprise Azure Cache for Redis instances
description: Learn how to replicate your Azure Cache for Redis Enterprise instances across Azure regions.
ms.custom: devx-track-azurecli, ignite-2024
ms.topic: conceptual
ms.date: 01/15/2025
---

# Configure active geo-replication for Enterprise Azure Cache for Redis instances

In this article, you learn how to configure an active geo-replicated cache using the Azure portal.

Active geo-replication groups up to five instances of Enterprise Azure Cache for Redis into a single cache that spans across Azure regions. All instances act as the local, primary caches. An application decides which instance or instances to use for read and write requests.

> [!NOTE]
> Data transfer between Azure regions is charged at standard [bandwidth rates](https://azure.microsoft.com/pricing/details/bandwidth/).
>

## Scope of availability

|Tier      | Basic, Standard  | Premium  |Enterprise, Enterprise Flash  |
|--------- |:------------------:|:----------:|:---------:|
|Available | No          | No       |  Yes  |

The Premium tier of Azure Cache for Redis offers a version of geo-replication called [_passive geo-replication_](cache-how-to-geo-replication.md). Passive geo-replication provides an active-passive configuration.

## Active geo-replication prerequisites

There are a few restrictions when using active geo replication:

- Only the [RediSearch](cache-redis-modules.md#redisearch) and [RedisJSON](cache-redis-modules.md#redisjson) modules are supported
- On the _Enterprise Flash_ tier, only the _No Eviction_ eviction policy can be used. All eviction policies are supported on the _Enterprise_ tier.
- Data persistence isn't supported because active geo-replication provides a superior experience.
- You can't add an existing (that is, running) cache to a geo-replication group. You can only add a cache to a geo-replication group when you create the cache.
- All caches within a geo-replication group must have the same configuration. For example, all caches must have the same SKU, capacity, eviction policy, clustering policy, modules, and TLS setting.
- You can't use the `FLUSHALL` and `FLUSHDB` Redis commands when using active geo-replication. Prohibiting the commands prevents unintended deletion of data. Use the [flush operation](#flush-operation) from the portal instead.
- Active geo-replication is not supported on E1 and any Flash SKUs.

## Create or join an active geo-replication group

1. When creating a new Azure Cache for Redis resource, select the **Advanced** tab. Complete the first part of the form including clustering policy. For more information on choosing **Clustering policy**, see [Clustering](managed-redis/managed-redis-architecture.md#clustering) .

1. Select **Configure** to set up **Active geo-replication**.

    :::image type="content" source="media/cache-how-to-active-geo-replication/cache-active-geo-replication-configure.png" alt-text="Screenshot of advanced tab of create new Redis cache page.":::

1. Create a new replication group for a first cache instance. Or, select an existing one from the list.

    :::image type="content" source="media/cache-how-to-active-geo-replication/cache-active-geo-replication-new-group.png" alt-text="Screenshot showing replication groups.":::

1. Select **Configure** to finish.

1. Wait for the first cache to be created successfully. When complete, you see **Configured** set for **Active geo-replication**. Repeat the above steps for each cache instance in the geo-replication group.

     :::image type="content" source="media/cache-how-to-active-geo-replication/cache-active-geo-replication-configured.png" alt-text="Screenshot showing active geo-replication is configured.":::

## Remove from an active geo-replication group

To remove a cache instance from an active geo-replication group, you just delete the instance. The remaining instances then reconfigure themselves automatically.

## Force unlink if there's a region outage

In case one of the caches in your replication group is unavailable due to region outage, you can forcefully remove the unavailable cache from the replication group. After you apply **Force-unlink** to a cache, you can't sync any data that is written to that cache back to the replication group after force-unlinking.

You should remove the unavailable cache because the remaining caches in the replication group start storing the metadata that wasn't shared to the unavailable cache. When this happens, the available caches in your replication group might run out of memory.

1. Go to Azure portal and select one of the caches in the replication group that is still available.

1. Select to **Active geo-replication** in the Resource menu on the left to see the settings in the working pane.

    :::image type="content" source="media/cache-how-to-active-geo-replication/cache-active-geo-replication-group.png" alt-text="Screenshot of active geo-replication group.":::

1. Select the cache that you need to force-unlink by checking the box.

1. Select **Force unlink** and then **OK** to confirm.

    :::image type="content" source="media/cache-how-to-active-geo-replication/cache-cache-active-geo-replication-unlink.png" alt-text="Screenshot of unlinking in active geo-replication.":::

1. Once the affected region's availability is restored, you need to delete the affected cache, and recreate it to add it back to your replication group.

## Set up active geo-replication using the Azure CLI or PowerShell

### Azure CLI

Use the Azure CLI to create a new cache and geo-replication group, or to add a new cache to an existing geo-replication group. For more information, see [az redisenterprise create](/cli/azure/redisenterprise#az-redisenterprise-create).

#### Create new Enterprise instance in a new geo-replication group using Azure CLI

This example creates a new Azure Cache for Redis Enterprise E10 cache instance called _Cache1_ in the East US region. Then, the cache is added to a new active geo-replication group called _replicationGroup_:

```azurecli-interactive
az redisenterprise create --location "East US" --cluster-name "Cache1" --sku "Enterprise_E10" --resource-group "myResourceGroup" --group-nickname "replicationGroup" --linked-databases id="/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache1/databases/default"
```

To configure active geo-replication properly, the ID of the cache instance being created must be added with the `--linked-databases` parameter. The ID is in the format:

`/subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group-name>/providers/Microsoft.Cache/redisEnterprise/<your-cache-name>/databases/default`

#### Create new Enterprise instance in an existing geo-replication group using Azure CLI

This example creates a new Enterprise E10 cache instance called _Cache2_ in the West US region. Then, the script adds the cache to the `replicationGroup` active geo-replication group create in a previous procedure. This way, it's linked in an active-active configuration with _Cache1_.

```azurecli-interactive
az redisenterprise create --location "West US" --cluster-name "Cache2" --sku "Enterprise_E10" --resource-group "myResourceGroup" --group-nickname "replicationGroup" --linked-databases id="/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache1/databases/default" --linked-databases id="/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache2/databases/default"
```

As before, you need to list both _Cache1_ and _Cache2_ using the `--linked-databases` parameter.

### Azure PowerShell

Use Azure PowerShell to create a new cache and geo-replication group, or to add a new cache to an existing geo-replication group. For more information, see [New-AzRedisEnterpriseCache](/powershell/module/az.redisenterprisecache/new-azredisenterprisecache).

#### Create new Enterprise instance in a new geo-replication group using PowerShell

This example creates a new Azure Cache for Redis Enterprise E10 cache instance called _Cache1_ in the East US region. Then, the cache is added to a new active geo-replication group called _replicationGroup_:

```powershell-interactive
New-AzRedisEnterpriseCache -Name "Cache1" -ResourceGroupName "myResourceGroup" -Location "East US" -Sku "Enterprise_E10" -GroupNickname "replicationGroup" -LinkedDatabase '{id:"/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache1/databases/default"}'
```

To configure active geo-replication properly, the ID of the cache instance being created must be added with the `-LinkedDatabase` parameter. The ID is in the format:

`/subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group-name>/providers/Microsoft.Cache/redisEnterprise/<your-cache-name>/databases/default`

#### Create new Enterprise instance in an existing geo-replication group using PowerShell

This example creates a new Enterprise E10 cache instance called _Cache2_ in the West US region. Then, the script adds the cache to the _replicationGroup_ active geo-replication group created in the previous procedure. After the running the command, the two caches, _Cache1_ and _Cache2_, are linked in an active-active configuration.

```powershell-interactive
New-AzRedisEnterpriseCache -Name "Cache2" -ResourceGroupName "myResourceGroup" -Location "West US" -Sku "Enterprise_E10" -GroupNickname "replicationGroup" -LinkedDatabase '{id:"/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache1/databases/default"}', '{id:"/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache2/databases/default"}'
```

As before, you need to list both _Cache1_ and _Cache2_ using the `-LinkedDatabase` parameter.

## Scaling instances in a geo-replication group

It's possible to scale instances that are configured to use active geo-replication. However, a geo-replication group with a mix of different cache sizes can introduce problems. To prevent these issues from occurring, all caches in a geo replication group need to be the same size and capacity.

Because it's difficult to simultaneously scale all instances in the geo-replication group, Azure Cache for Redis has a locking mechanism. If you scale one instance in a geo-replication group, the underlying VM is scaled, but the memory available is capped at the original size until the other instances are scaled up as well. Any other scaling operations for the remaining instances are locked until they match the same configuration as the first cache to be scaled.

### Scaling example

For example, you might have three instances in your geo-replication group, all Enterprise E10 instances:

| Instance Name |   Redis00   |    Redis01   |   Redis02  |
|-----------|:--------------------:|:--------------------:|:--------------------:|
| Type | Enterprise E10 | Enterprise E10 | Enterprise E10 |

Let's say you want to scale up each instance in this geo-replication group to an Enterprise E20 instance. You would first scale one of the caches up to an E20:

| Instance Name |   Redis00   |    Redis01   |   Redis02  |
|-----------|:--------------------:|:--------------------:|:--------------------:|
| Type | Enterprise E20 | Enterprise E10 | Enterprise E10 |

At this point, the `Redis01` and `Redis02` instances can only scale up to an Enterprise E20 instance. All other scaling operations are blocked.
>[!NOTE]
> The `Redis00` instance isn't blocked from scaling further at this point. But it's blocked once either `Redis01` or `Redis02` is scaled to be an Enterprise E20.
>

Once each instance is scaled to the same tier and size, all scaling locks are removed:

| Instance Name |   Redis00   |    Redis01   |   Redis02  |
|-----------|:--------------------:|:--------------------:|:--------------------:|
| Type | Enterprise E20 | Enterprise E20 | Enterprise E20 |

## Flush operation

Due to the potential for inadvertent data loss, you can't use the `FLUSHALL` and `FLUSHDB` Redis commands with any cache instance residing in a geo-replication group. Instead, use the **Flush Cache(s)** button located at the top of the **Active geo-replication** working pane.

:::image type="content" source="media/cache-how-to-active-geo-replication/cache-active-flush.png" alt-text="Screenshot showing Active geo-replication selected in the Resource menu and the Flush cache feature has a red box around it.":::

## Geo-replication Metric

The _Geo Replication Healthy_ metric in the Enterprise tier of Azure Cache for Redis helps monitor the health of geo-replicated clusters. You use this metric to monitor the sync status among geo-replicas.  

To monitor the _Geo Replication Healthy_ metric in the Azure portal:

1. Open the Azure portal and select your Azure Cache for Redis instance.

1. On the Resource menu, select **Metrics** under the **Monitoring** section.

1. Select **Add Metric** and select the **Geo Replication Healthy** metric.

1. If needed, apply filters for specific geo-replicas.

1. You can configure an alert to notify you if the **Geo replication Healthy** metric emits an unhealthy value (0) continuously for over 60 minutes.

    1. Select **New Alert Rule**.

    1. Define the condition to trigger if the metric value is 0 for at least 60 minutes, the recommended time.

    1. Add action groups for notifications, for example: email, SMS, and others.

    1. Save the alert.

    1. For more information on how to set up alerts for you Redis Enterprise cache, see the alert section in [Monitor Redis Caches](/azure/azure-cache-for-redis/monitor-cache?tabs=enterprise-enterprise-flash).

> [!IMPORTANT]
> This metric might temporarily show as unhealthy due to routine operations like maintenance events or scaling, initiated either by Azure or the customer. To avoid false alarms, we recommend setting up an observation window of 60 minutes, where the metric continues to stay unhealthy as the appropriate time for generating an alert as it might indicate a problem that requires intervention.

## Common Client-side issues that can cause sync issues among geo-replicas

- Use of custom Hash tags – Using custom hashtags in Redis can lead to uneven distribution of data across shards, which might cause performance issues and synchronization problems in geo-replicas therefore avoid using custom hashtags unless the database needs to perform multiple key operations.

- Large Key Size - Large keys can create synchronization issues among geo-replicas. To maintain smooth performance and reliable replication, we recommend keeping key sizes under 500MB when using geo-replication. If individual key size gets close to 2GB the cache faces geo-replication health issues.  

### Flush caches using Azure CLI or PowerShell

The Azure CLI and PowerShell can also be used to trigger a flush operation. For more information on using Azure CLI, see [az redisenterprise database flush](/cli/azure/redisenterprise#az-redisenterprise-database-flush). For more information on using PowerShell, see [Invoke-AzRedisEnterpriseCacheDatabaseFlush](/powershell/module/az.redisenterprisecache/invoke-azredisenterprisecachedatabaseflush).

> [!IMPORTANT]
> Be careful when using the **Flush Caches** feature. Selecting the button removes all data from the current cache and from ALL linked caches in the geo-replication group.
>

Manage access to the feature using [Azure role-based access control](../role-based-access-control/overview.md). Only authorized users should be given access to flush all caches.

## Next steps

Learn more about Azure Cache for Redis features.

- [Azure Cache for Redis service tiers](cache-overview.md#service-tiers)
- [High availability for Azure Cache for Redis](cache-high-availability.md)
