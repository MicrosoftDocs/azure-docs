---
title: Configure data persistence - Azure Managed Redis (preview)
description: Learn how to configure and manage data persistence your Azure Managed Redis instances



ms.service: azure-managed-redis
ms.custom: devx-track-azurecli, ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---
# Configure data persistence for an Azure Managed Redis (preview) instance

[Redis persistence](https://redis.io/topics/persistence) allows you to persist data stored in cache instance. If there's a hardware failure, the cache instance is rehydrated with data from the persistence file when it comes back online. The ability to persist data is an important way to boost the durability of a cache instance because all cache data is stored in memory. Data loss is possible if a failure occurs when cache nodes are down. Persistence should be a key part of your [high availability and disaster recovery](managed-redis-high-availability.md) strategy with Azure Managed Redis (preview).

> [!IMPORTANT]
>
> Data persistence is meant to provide resilience for unexpected Redis node failures, but it is not a data backup or point in time recovery (PITR) feature. If corrupted data is written to the Redis instance this data will also be persisted. To make backups of your Redis instance, use the [export feature](managed-redis-how-to-import-export-data.md).  
>

## Scope of availability

|Tier     | Memory Optimized, Balanced, Compute Optimized  | Flash Optimized  |
|---------|---------|---------|
|Available  | Yes       | Yes        |

## Types of data persistence in Redis

You have two options for persistence with Azure Managed Redis: the _Redis database_ (RDB) format and _Append only File_ (AOF) format:

- _RDB persistence_ - When you use RDB persistence, Azure Managed Redis persists a snapshot of your cache in a binary format. The snapshot is saved on a managed disk mounted to the Redis instance. The configurable backup frequency determines how often to persist the snapshot. If a catastrophic event occurs that disables both the primary and replica, the cache is reconstructed automatically using the most recent snapshot. Learn more about the [advantages](https://redis.io/topics/persistence#rdb-advantages) and [disadvantages](https://redis.io/topics/persistence#rdb-disadvantages) of RDB persistence.
- _AOF persistence_ - When you use AOF persistence, Azure Managed Redis saves every write operation to a log. The log is saved once per second on a managed disk mounted to the Redis instance. If a catastrophic event occurs that disables both the primary and replica caches, the cache is reconstructed automatically using the stored write operations. Learn more about the [advantages](https://redis.io/topics/persistence#aof-advantages) and [disadvantages](https://redis.io/topics/persistence#aof-disadvantages) of AOF persistence.

> [!IMPORTANT]
> Azure Managed Redis persistence features are intended to be used to restore data automatically to the same cache after data loss. The RDB/AOF persisted data files can neither be accessed by users nor imported to a new or existing cache. To move data across caches, use the _Import and Export_ feature. For more information, see [Import and Export data in Azure Managed Redis](managed-redis-how-to-import-export-data.md).
> 


To generate any backups of data that can be added to a new cache, you can write automated scripts using PowerShell or Azure CLI that export data periodically.

## Prerequisites and limitations

Persistence features are intended to be used to restore data to the same cache after data loss.

- RDB/AOF persisted data files can't be imported to a new cache or the existing cache. Use the [Import/Export](managed-redis-how-to-import-export-data.md) feature instead.
- Persistence isn't supported with caches using [active geo-replication](managed-redis-how-to-active-geo-replication.md).
- The managed disk holding persisted data files is encrypted using Microsoft managed keys (MMK) by default, but customer managed keys (CMK) can also be used. For more information, see [managing data encryption](#managing-data-encryption).

## How to set up data persistence using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) and start following the instructions in the [Azure Managed Redis quickstart guide](../quickstart-create-managed-redis.md).

1. When you reach the **Advanced** tab, select either _RDB_ or _AOF_ options in the **Data Persistence** section.

    :::image type="content" source="media/managed-redis-how-to-persistence/managed-redis-advanced-persistence.png" alt-text="Screenshot that shows the Enterprise tier Advanced tab and Data persistence is highlighted with a red box.":::

1. To enable RDB persistence, select **RDB** and configure the settings.

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Backup Frequency** | Use the drop-down and select a backup interval. Choices include **60 Minutes**, **6 hours**, and **12 hours**. | This interval starts counting down after the previous backup operation successfully completes. When it elapses, a new backup starts. |

1. To enable AOF persistence, select **AOF**. Only one backup frequency option is available. 

1. Finish creating the cache by following the rest of the instructions in the [Azure Managed Redis quickstart guide](../quickstart-create-managed-redis.md).

 
> [!NOTE]
> You can add persistence to a previously created Azure Managed Redis instance at any time by navigating to the **Advanced settings** in the Resource menu.
>

## How to set up data persistence using PowerShell and Azure CLI

### Using PowerShell

The [New-AzRedisEnterpriseCache](/powershell/module/az.redisenterprisecache/new-azredisenterprisecache) command can be used to create a new Azure Managed Redis instance using data persistence. Use the `RdbPersistenceEnabled`, `RdbPersistenceFrequency`, `AofPersistenceEnabled`, and `AofPersistenceFrequency` parameters to configure the persistence setup. This example creates a new Balanced B10 instance using RDB persistence with one hour frequency:

```powershell-interactive
New-AzRedisEnterpriseCache -Name "MyCache" -ResourceGroupName "MyGroup" -Location "West US" -Sku "Balanced_B10" -RdbPersistenceEnabled -RdbPersistenceFrequency "1h"
```

Existing caches can be updated using the [Update-AzRedisEnterpriseCacheDatabase](/powershell/module/az.redisenterprisecache/update-azredisenterprisecachedatabase) command. This example adds RDB persistence with 12 hour frequency to an existing instance:

```powershell-interactive
Update-AzRedisEnterpriseCacheDatabase -Name "MyCache" -ResourceGroupName "MyGroup" -RdbPersistenceEnabled -RdbPersistenceFrequency "12h"
```

### Using Azure CLI

The [az redisenterprise create](/cli/azure/redisenterprise#az-redisenterprise-create) command can be used to create a new Azure Managed Redis instance using data persistence. Use the `rdb-enabled`, `rdb-frequency`, `aof-enabled`, and `aof-frequency` parameters to configure the persistence setup. This example creates a new Balanced B10 instance using RDB persistence with one hour frequency:

```azurecli
az redisenterprise create --cluster-name "cache1" --resource-group "rg1" --location "East US" --sku "Balanced_B10" --persistence rdb-enabled=true rdb-frequency="1h" 
```

Existing caches can be updated using the [az redisenterprise database update](/cli/azure/redisenterprise/database#az-redisenterprise-database-update) command. This example adds RDB persistence with 12 hour frequency to an existing cache instance:

```azurecli
az redisenterprise database update --cluster-name "cache1" --resource-group "rg1" --persistence rdb-enabled=true rdb-frequency="12h" 
```

## Managing data encryption

Because Redis persistence creates data at rest, encrypting this data is an important concern for many users. On Azure Managed Redis, data is stored on a managed disk mounted to the cache instance. By default, the disk holding the persistence data, and the OS disk are encrypted using Microsoft-managed keys. A customer-managed key (CMK) can also be used to control data encryption. See [Encryption on Azure Managed Redis](managed-redis-how-to-encryption.md) for instructions.  

## Persistence FAQ

The following list contains answers to commonly asked questions about Azure Managed Redis persistence.

- [Can I enable persistence on a previously created cache?](#can-i-enable-persistence-on-a-previously-created-cache)
- [Can I enable AOF and RDB persistence at the same time?](#can-i-enable-aof-and-rdb-persistence-at-the-same-time)
- [How does persistence work with geo-replication?](#how-does-persistence-work-with-geo-replication)
- [Which persistence model should I choose?](#which-persistence-model-should-i-choose)
- [What happens if I've scaled to a different size and a backup is restored that was made before the scaling operation?](#what-happens-if-ive-scaled-to-a-different-size-and-a-backup-is-restored-that-was-made-before-the-scaling-operation)
- [Will I be charged for the managed disk being used in Data Persistence](#will-i-be-charged-for-the-managed-disk-being-used-in-data-persistence)

### RDB persistence

- [Can I change the RDB backup frequency after I create the cache?](#can-i-change-the-rdb-backup-frequency-after-i-create-the-cache)
- [Why is there more than 60 minutes between backups when I have an RDB backup frequency of 60 minutes?](#why-is-there-more-than-60-minutes-between-backups-when-i-have-an-rdb-backup-frequency-of-60-minutes)
- [What happens to the old RDB backups when a new backup is made?](#what-happens-to-the-old-rdb-backups-when-a-new-backup-is-made)

### AOF persistence

- [Does AOF persistence affect throughput, latency, or performance of my cache?](#does-aof-persistence-affect-throughput-latency-or-performance-of-my-cache)
- [What is a rewrite and how does it affect my cache?](#what-is-a-rewrite-and-how-does-it-affect-my-cache)
- [What should I expect when scaling a cache with AOF enabled?](#what-should-i-expect-when-scaling-a-cache-with-aof-enabled)

### Can I enable persistence on a previously created cache?

Yes, persistence can be configured both at cache creation and on existing Azure Managed Redis instances.

### Can I enable AOF and RDB persistence at the same time?

No, you can enable RDB or AOF, but not both at the same time.

### How does persistence work with geo-replication?

If you enable data persistence, geo-replication can't be enabled for your cache. This is because active geo-replication provides better resiliency than data persistence in case of a regional outage. If you need to export a copy of your data as a backup, use the [export feature](managed-redis-how-to-import-export-data.md) instead.

### Which persistence model should I choose?

AOF persistence saves every write to a log, which can have a significant effect on throughput. RDB persistence saves backups based on the configured backup interval with minimal effect to performance. Choose AOF persistence if your primary goal is to minimize data loss, and you can handle a lower throughput for your cache. Choose RDB persistence if you wish to maintain optimal throughput on your cache, but still want a mechanism for data recovery.

- Learn more about the [advantages](https://redis.io/topics/persistence#rdb-advantages) and [disadvantages](https://redis.io/topics/persistence#rdb-disadvantages) of RDB persistence.
- Learn more about the [advantages](https://redis.io/topics/persistence#aof-advantages) and [disadvantages](https://redis.io/topics/persistence#aof-disadvantages) of AOF persistence.

For more information on performance when using AOF persistence, see [Does AOF persistence affect throughput, latency, or performance of my cache?](#does-aof-persistence-affect-throughput-latency-or-performance-of-my-cache)

### Does AOF persistence affect throughput, latency, or performance of my cache?

Using AOF persistence does impact throughput. AOF runs on all primary processes, therefore you see higher CPU and Server Load for a cache with AOF persistence than an identical cache without AOF persistence. AOF offers the best consistency with the data in memory because each write and delete is persisted with only a few seconds of delay. The trade-off is that AOF is more compute intensive.

### What happens if I've scaled to a different size and a backup is restored that was made before the scaling operation?

For both RDB and AOF persistence:

- If you've scaled to a larger size, there's no effect.
- If you've scaled to a smaller size, and there isn't enough room in the smaller size to hold all of the data from the last backup, keys are evicted during the restore process. Typically, keys are evicted using the [allkeys-lru](https://redis.io/topics/lru-cache) eviction policy.

### Will I be charged for the managed disk being used in data persistence?

You aren't charged for the managed disk storage. It's included in the price.

### Can I change the RDB backup frequency after I create the cache?

Yes, you can change the backup frequency for RDB persistence using the Azure portal, CLI, or PowerShell.

### Why is there more than 60 minutes between backups when I have an RDB backup frequency of 60 minutes?

The RDB persistence backup frequency interval doesn't start until the previous backup process has completed successfully. If the backup frequency is 60 minutes and it takes a backup process 15 minutes to complete, the next backup won't start until 75 minutes after the start time of the previous backup.

### What happens to the old RDB backups when a new backup is made?

All RDB persistence backups, except for the most recent one, are automatically deleted. This deletion might not happen immediately, but older backups aren't persisted indefinitely. 

### What is a rewrite and how does it affect my cache?

When the AOF file becomes large enough, a rewrite is automatically queued on the cache. The rewrite resizes the AOF file with the minimal set of operations needed to create the current data set. During rewrites, you can expect to reach performance limits sooner, especially when dealing with large datasets. Rewrites occur less often as the AOF file becomes larger, but take a significant amount of time when it happens.

### What should I expect when scaling a cache with AOF enabled?

If the AOF file at the time of scaling is large, then expect the scale operation to take longer than normal because it reloads the file after scaling has finished.

For more information on scaling, see [What happens if I've scaled to a different size and a backup is restored that was made before the scaling operation?](#what-happens-if-ive-scaled-to-a-different-size-and-a-backup-is-restored-that-was-made-before-the-scaling-operation)

## Next steps

- [Azure Managed Redis service tiers](managed-redis-overview.md#choosing-the-right-tier)
- [Export data from Azure Managed Redis](managed-redis-how-to-import-export-data.md)
- [High availability and disaster recovery](managed-redis-high-availability.md)
