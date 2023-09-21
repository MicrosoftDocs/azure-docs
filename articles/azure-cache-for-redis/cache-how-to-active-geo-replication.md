---
title: Configure active geo-replication for Enterprise Azure Cache for Redis instances
description: Learn how to replicate your Azure Cache for Redis Enterprise instances across Azure regions.
author: flang-msft

ms.service: cache
ms.custom: devx-track-azurecli
ms.topic: conceptual
ms.date: 03/23/2023
ms.author: franlanglois
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
- You can't use the `FLUSHALL` and `FLUSHDB` Redis commands when using active geo-replication. Prohibiting the commands prevents unintended deletion of data. Use the [flush control plane operation](#flush-operation) instead.  

## Create or join an active geo-replication group

1. When creating a new Azure Cache for Redis resource, select the **Advanced** tab. Complete the first part of the form including clustering policy. For more information on choosing **Clustering policy**, see [Clustering Policy](quickstart-create-redis-enterprise.md#clustering-policy).

1. Select **Configure** to set up **Active geo-replication**.

    :::image type="content" source="media/cache-how-to-active-geo-replication/cache-active-geo-replication-configure.png" alt-text="Screenshot of advanced tab of create new Redis cache page.":::

1. Create a new replication group for a first cache instance. Or, select an existing one from the list.

    :::image type="content" source="media/cache-how-to-active-geo-replication/cache-active-geo-replication-new-group.png" alt-text="Screenshot showing replication groups.":::

1. Select **Configure** to finish.

1. Wait for the first cache to be created successfully. When complete, you see **Configured** set for **Active geo-replication**. Repeat the above steps for each cache instance in the geo-replication group.

     :::image type="content" source="media/cache-how-to-active-geo-replication/cache-active-geo-replication-configured.png" alt-text="Screenshot showing active geo-replication is configured.":::

## Remove from an active geo-replication group

To remove a cache instance from an active geo-replication group, you just delete the instance. The remaining instances then reconfigure themselves automatically.

## Force-unlink if there's a region outage

In case one of the caches in your replication group is unavailable due to region outage, you can forcefully remove the unavailable cache from the replication group.

You should remove the unavailable cache because the remaining caches in the replication group start storing the metadata that hasn’t been shared to the unavailable cache. When this happens, the available caches in your replication group might run out of memory.

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
az redisenterprise create --location "East US" --cluster-name "Cache1" --sku "Enterprise_E10" --resource-group "myResourceGroup" --group-nickname "replicationGroup" --linked-databases id="/subscriptions/34b6ecbd-ab5c-4768-b0b8-bf587aba80f6/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache1/databases/default"
```

To configure active geo-replication properly, the ID of the cache instance being created must be added with the `--linked-databases` parameter. The ID is in the format:

`/subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group-name>/providers/Microsoft.Cache/redisEnterprise/<your-cache-name>/databases/default`

#### Create new Enterprise instance in an existing geo-replication group using Azure CLI

This example creates a new Enterprise E10 cache instance called _Cache2_ in the West US region. Then, the script adds the cache to the `replicationGroup` active geo-replication group create in a previous procedure. This way, it's linked in an active-active configuration with _Cache1_.

```azurecli-interactive
az redisenterprise create --location "West US" --cluster-name "Cache2" --sku "Enterprise_E10" --resource-group "myResourceGroup" --group-nickname "replicationGroup" --linked-databases id="/subscriptions/34b6ecbd-ab5c-4768-b0b8-bf587aba80f6/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache1/databases/default" --linked-databases id="/subscriptions/34b6ecbd-ab5c-4768-b0b8-bf587aba80f6/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache2/databases/default"
```

As before, you need to list both _Cache1_ and _Cache2_ using the `--linked-databases` parameter.

### Azure PowerShell

Use Azure PowerShell to create a new cache and geo-replication group, or to add a new cache to an existing geo-replication group. For more information, see [New-AzRedisEnterpriseCache](/powershell/module/az.redisenterprisecache/new-azredisenterprisecache).

#### Create new Enterprise instance in a new geo-replication group using PowerShell

This example creates a new Azure Cache for Redis Enterprise E10 cache instance called _Cache1_ in the East US region. Then, the cache is added to a new active geo-replication group called _replicationGroup_:

```powershell-interactive
New-AzRedisEnterpriseCache -Name "Cache1" -ResourceGroupName "myResourceGroup" -Location "East US" -Sku "Enterprise_E10" -GroupNickname "replicationGroup" -LinkedDatabase '{id:"/subscriptions/34b6ecbd-ab5c-4768-b0b8-bf587aba80f6/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache1/databases/default"}'
```

To configure active geo-replication properly, the ID of the cache instance being created must be added with the `-LinkedDatabase` parameter. The ID is in the format:

`/subscriptions/<your-subscription-ID>/resourceGroups/<your-resource-group-name>/providers/Microsoft.Cache/redisEnterprise/<your-cache-name>/databases/default`

#### Create new Enterprise instance in an existing geo-replication group using PowerShell

This example creates a new Enterprise E10 cache instance called _Cache2_ in the West US region. Then, the script adds the cache to the "replicationGroup" active geo-replication group created in the previous procedure. the links the two caches, _Cache1_ and _Cache2_, in an active-active configuration.

```powershell-interactive
New-AzRedisEnterpriseCache -Name "Cache2" -ResourceGroupName "myResourceGroup" -Location "West US" -Sku "Enterprise_E10" -GroupNickname "replicationGroup" -LinkedDatabase '{id:"/subscriptions/34b6ecbd-ab5c-4768-b0b8-bf587aba80f6/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache1/databases/default"}', '{id:"/subscriptions/34b6ecbd-ab5c-4768-b0b8-bf587aba80f6/resourceGroups/myResourceGroup/providers/Microsoft.Cache/redisEnterprise/Cache2/databases/default"}'
```

As before, you need to list both _Cache1_ and _Cache2_ using the `-LinkedDatabase` parameter.

## Flush operation

Due to the potential for inadvertent data loss, you can't use the `FLUSHALL` and `FLUSHDB` Redis commands with any cache instance residing in a geo-replication group. Instead, use the **Flush Cache(s)** button located at the top of the **Active geo-replication** working pane. 

:::image type="content" source="media/cache-how-to-active-geo-replication/cache-active-flush.png" alt-text="Screenshot showing Active geo-replication selected in the Resource menu and the Flush cache feature has a red box around it.":::

### Flush caches using Azure CLI or PowerShell

The Azure CLI and PowerShell can also be used to trigger a flush operation. For more information on using Azure CLI, see [az redisenterprise database flush](/cli/azure/redisenterprise#az-redisenterprise-database-flush). For more information on using PowerShell, see [Invoke-AzRedisEnterpriseCacheDatabaseFlush](/powershell/module/az.redisenterprisecache/invoke-azredisenterprisecachedatabaseflush). 

> [!IMPORTANT]
> Be careful when using the **Flush Caches** feature. Selecting the button removes all data from the current cache and from ALL linked caches in the geo-replication group. 
>

Manage access to the feature using [Azure role-based access control](../role-based-access-control/overview.md). Only authorized users should be given access to flush all caches.

## Next steps

Learn more about Azure Cache for Redis features.

* [Azure Cache for Redis service tiers](cache-overview.md#service-tiers)
* [High availability for Azure Cache for Redis](cache-high-availability.md)


