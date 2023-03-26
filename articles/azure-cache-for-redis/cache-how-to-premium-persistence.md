---
title: Configure data persistence - Premium Azure Cache for Redis
description: Learn how to configure and manage data persistence your Premium tier Azure Cache for Redis instances
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 03/24/2023


---
# Configure data persistence for an Azure Cache for Redis instance

[Redis persistence](https://redis.io/topics/persistence) allows you to persist data stored in cache instance. If there's a hardware failure, the cache instance is rehydrated with data from the persistence file when it comes back online. The ability to persist data is an important way to boost the durability of a cache instance because all cache data is stored in memory. Data loss is possible if a failure occurs when cache nodes are down. Persistence should be a key part of your [high availability and disaster recovery](cache-high-availability.md) strategy with Azure Cache for Redis.

> [!WARNING]
>
> If you are using persistence on the Premium tier, check to see if your storage account has soft delete enabled before using the data persistence feature. Using data persistence with soft delete causes very high storage costs. For more information, see [should I enable soft delete?](#how-frequently-does-rdb-and-aof-persistence-write-to-my-blobs-and-should-i-enable-soft-delete).
>

## Scope of availability

|Tier     | Basic, Standard  | Premium  |Enterprise, Enterprise Flash  |
|---------|---------|---------|---------|
|Available  | No         | Yes        |  Yes (preview)  |

## Types of data persistence in Redis

You have two options for persistence with Azure Cache for Redis: the _Redis database_ (RDB) format and _Append only File_ (AOF) format:

- _RDB persistence_ - When you use RDB persistence, Azure Cache for Redis persists a snapshot of your cache in a binary format. The snapshot is saved in an Azure Storage account. The configurable backup frequency determines how often to persist the snapshot. If a catastrophic event occurs that disables both the primary and replica cache, the cache is reconstructed using the most recent snapshot. Learn more about the [advantages](https://redis.io/topics/persistence#rdb-advantages) and [disadvantages](https://redis.io/topics/persistence#rdb-disadvantages) of RDB persistence.
- _AOF persistence_ - When you use AOF persistence, Azure Cache for Redis saves every write operation to a log. The log is saved at least once per second in an Azure Storage account. If a catastrophic event occurs that disables both the primary and replica caches, the cache is reconstructed using the stored write operations. Learn more about the [advantages](https://redis.io/topics/persistence#aof-advantages) and [disadvantages](https://redis.io/topics/persistence#aof-disadvantages) of AOF persistence.

Azure Cache for Redis persistence features are intended to be used to restore data to the same cache after data loss. The RDB/AOF persisted data files can't be imported to a new cache. To move data across caches, use the _Import and Export_ feature. For more information, see [Import and Export data in Azure Cache for Redis](cache-how-to-import-export-data.md).

To generate any backups of data that can be added to a new cache, you can write automated scripts using PowerShell or CLI that export data periodically.

## Prerequisites and limitations

Persistence features are intended to be used to restore data to the same cache after data loss.

- RDB/AOF persisted data files can't be imported to a new cache. Use the [Import/Export](cache-how-to-import-export-data.md) feature instead.
- Persistence isn't supported with caches using [passive geo-replication](cache-how-to-geo-replication.md) or [active geo-replication](cache-how-to-active-geo-replication.md).
- On the _Premium_ tier, AOF persistence isn't supported with [multiple replicas](cache-how-to-multi-replicas.md). 
- On the _Premium_ tier, data must be persisted to a storage account in the same region as the cache instance. 

## Differences between persistence in the Premium and Enterprise tiers

On the **Premium** tier, data is persisted directly to an [Azure Storage](../storage/common/storage-introduction.md) account that you own and manage. Azure Storage automatically encrypts data when it's persisted, but you can also use your own keys for the encryption. For more information, see [Customer-managed keys for Azure Storage encryption](../storage/common/customer-managed-keys-overview.md).

> [!WARNING]
>
> If you are using persistence on the Premium tier, check to see if your storage account has soft delete enabled before using the data persistence feature. Using data persistence with soft delete causes very high storage costs. For more information, see [should I enable soft delete?](#how-frequently-does-rdb-and-aof-persistence-write-to-my-blobs-and-should-i-enable-soft-delete).
>

On the **Enterprise** and **Enterprise Flash** tiers, data is persisted to a managed disk attached directly to the cache instance. The location isn't configurable nor accessible to the user. Using a managed disk increases the performance of persistence. The disk is encrypted using Microsoft managed keys (MMK) by default, but customer managed keys (CMK) can also be used. For more information, see [managing data encryption](#managing-data-encryption). 

## How to set up data persistence using the Azure portal

### [Using the portal (Premium tier)](#tab/premium)

1. To create a Premium cache, sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource**. You can create caches in the Azure portal. You can also create them using Resource Manager templates, PowerShell, or Azure CLI. For more information about creating an Azure Cache for Redis, see [Create a cache](cache-dotnet-how-to-use-azure-redis-cache.md#create-a-cache).

    :::image type="content" source="media/cache-how-to-premium-persistence/create-resource.png" alt-text="Screenshot that shows a form to create an Azure Cache for Redis resource.":::
  
2. On the **Create a resource** page, select **Databases** and then select **Azure Cache for Redis**.

    :::image type="content" source="media/cache-how-to-premium-persistence/select-cache.png" alt-text="Screenshot showing Azure Cache for Redis selected as a new database type.":::

3. On the **New Redis Cache** page, configure the settings for your new premium cache.
  
   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **DNS name** | Enter a globally unique name. | The cache name must be a string between 1 and 63 characters that contain only numbers, letters, or hyphens. The name must start and end with a number or letter, and can't contain consecutive hyphens. The *host name* for your cache instance's is `\<DNS name>.redis.cache.windows.net`. |
   | **Subscription** | Drop-down and select your subscription. | The subscription under which to create this new Azure Cache for Redis instance. |
   | **Resource group** | Drop-down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your cache and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. |
   | **Location** | Drop-down and select a location. | Select a [region](https://azure.microsoft.com/regions/) near other services that use your cache. |
   | **Cache type** | Drop-down and select a premium cache to configure premium features. For details, see [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/). |  The pricing tier determines the size, performance, and features that are available for the cache. For more information, see [Azure Cache for Redis Overview](cache-overview.md). |

4. Select the **Networking** tab or select the **Networking** button at the bottom of the page.

5. In the **Networking** tab, select your connectivity method. For premium cache instances, you connect either publicly, via Public IP addresses or service endpoints. You connect privately using a private endpoint.

6. Select the **Next: Advanced** tab or select the **Next: Advanced** button on the bottom of the page.

7. In the **Advanced** tab for a premium cache instance, configure the settings for non-TLS port, clustering, and data persistence. For data persistence, you can choose either **RDB** or **AOF** persistence.

8. To enable RDB persistence, select **RDB** and configure the settings.
  
   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Backup Frequency** | Drop-down and select a backup interval. Choices include **15 Minutes**, **30 minutes**, **60 minutes**, **6 hours**, **12 hours**, and **24 hours**. | This interval starts counting down after the previous backup operation successfully completes. When it elapses, a new backup starts. |
   | **Storage Account** | Drop-down and select your storage account. | Choose a storage account in the same region and subscription as the cache. A **Premium Storage** account is recommended because it has higher throughput. Also, we _strongly_ recommend that you disable the soft delete feature on the storage account as it leads to increased storage costs. For more information, see [Pricing and billing](../storage/blobs/soft-delete-blob-overview.md). |
   | **Storage Key** | Drop-down and choose either the **Primary key** or **Secondary key** to use. | If the storage key for your persistence account is regenerated, you must reconfigure the key from the **Storage Key** drop-down. |

    The first backup starts once the backup frequency interval elapses.
  
   > [!NOTE]
   > When RDB files are backed up to storage, they are stored in the form of page blobs.
  
9. To enable AOF persistence, select **AOF** and configure the settings.

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **First Storage Account** | Drop-down and select your storage account. | Choose a storage account in the same region and subscription as the cache. A **Premium Storage** account is recommended because it has higher throughput. Also, we _strongly_ recommend that you disable the soft delete feature on the storage account as it leads to increased storage costs. For more information, see [Pricing and billing](/azure/storage/blobs/soft-delete-blob-overview). |
   | **First Storage Key** | Drop-down and choose either the **Primary key** or **Secondary key** to use. | If the storage key for your persistence account is regenerated, you must reconfigure the key from the **Storage Key** drop-down. |
   | **Second Storage Account** | (Optional) Drop-down and select your secondary storage account. | You can optionally configure another storage account. If a second storage account is configured, the writes to the replica cache are written to this second storage account. |
   | **Second Storage Key** | (Optional) Drop-down and choose either the **Primary key** or **Secondary key** to use. | If the storage key for your persistence account is regenerated, you must reconfigure the key from the **Storage Key** drop-down. |

    With AOF persistence enabled, write operations to the cache are saved to the named storage account (or accounts if you've configured a second storage account). If there's a catastrophic failure that takes down both the primary and replica cache, the stored AOF log is used to rebuild the cache.

10. Select the **Next: Tags** tab or select the **Next: Tags** button at the bottom of the page.

11. Optionally, in the **Tags** tab, enter the name and value if you wish to categorize the resource.

12. Select **Review + create**. You're taken to the Review + create tab where Azure validates your configuration.

13. After the green Validation passed message appears, select **Create**.

It takes a while for the cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.

### [Using the portal (Enterprise tiers)](#tab/enterprise)

1. Sign in to the [Azure portal](https://portal.azure.com) and start following the instructions in the [Enterprise tier quickstart guide](quickstart-create-redis-enterprise.md).

1. When you reach the **Advanced** tab, select either _RDB_ or _AOF_ options in the **(PREVIEW) Data Persistence** section.

    :::image type="content" source="media/cache-how-to-premium-persistence/cache-advanced-persistence.png" alt-text="Screenshot that shows the Enterprise tier Advanced tab and Data persistence is highlighted with a red box.":::

1. To enable RDB persistence, select **RDB** and configure the settings.

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Backup Frequency** | Use the drop-down and select a backup interval. Choices include **60 Minutes**, **6 hours**, and **12 hours**. | This interval starts counting down after the previous backup operation successfully completes. When it elapses, a new backup starts. |

1. To enable AOF persistence, select **AOF** and configure the settings.

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Backup Frequency** | Drop down and select a backup interval. Choices include **Write every second** and **Always write**. | The _Always write_ option will append new entries to the AOF file after every write to the cache. This choice offers the best durability but does lower cache performance. |
   
1. Finish creating the cache by following the rest of the instructions in the [Enterprise tier quickstart guide](quickstart-create-redis-enterprise.md). 

> [!NOTE]
> You can add persistence to a previously created Enterprise tier cache at any time by navigating to the **Advanced settings** in the Resource menu.
>

---

## How to set up data persistence using PowerShell and Azure CLI

### [Using PowerShell (Premium tier)](#tab/premium)

The [New-AzRedisCache](/powershell/module/az.rediscache/new-azrediscache) command can be used to create a new Premium-tier cache using data persistence. See examples for [RDB persistence](/powershell/module/az.rediscache/new-azrediscache#example-5-configure-data-persistence-for-a-premium-azure-cache-for-redis) and [AOF persistence](/powershell/module/az.rediscache/new-azrediscache#example-6-configure-data-persistence-for-a-premium-azure-cache-for-redis-aof-backup-enabled)

Existing caches can be updated using the [Set-AzRedisCache](/powershell/module/az.rediscache/set-azrediscache) command. See examples of [adding persistence to an existing cache](/powershell/module/az.rediscache/set-azrediscache#example-3-modify-azure-cache-for-redis-if-you-want-to-add-data-persistence-after-azure-redis-cache-created).


### [Using PowerShell (Enterprise tier)](#tab/enterprise)

The [New-AzRedisEnterpriseCache](/powershell/module/az.redisenterprisecache/new-azredisenterprisecache) command can be used to create a new Enterprise-tier cache using data persistence. Use the `RdbPersistenceEnabled`, `RdbPersistenceFrequency`, `AofPersistenceEnabled`, and `AofPersistenceFrequency` parameters to configure the persistence setup. This example creates a new E10 Enterprise tier cache using RDB persistence with one hour frequency:

```powershell-interactive
New-AzRedisEnterpriseCache -Name "MyCache" -ResourceGroupName "MyGroup" -Location "West US" -Sku "Enterprise_E10" -RdbPersistenceEnabled -RdbPersistenceFrequency "1h"
```

Existing caches can be updated using the [Update-AzRedisEnterpriseCacheDatabase](/powershell/module/az.redisenterprisecache/update-azredisenterprisecachedatabase) command. This example adds RDB persistence with 12 hour frequency to an existing cache instance:

```powershell-interactive
Update-AzRedisEnterpriseCacheDatabase -Name "MyCache" -ResourceGroupName "MyGroup" -RdbPersistenceEnabled -RdbPersistenceFrequency "12h"
```

---

### [Using Azure CLI (Premium tier)](#tab/premium)

The [az redis create](/cli/azure/redis#az-redis-create) command can be used to create a new Premium-tier cache using data persistence. For instance:

```azurecli
az redis create --location westus2 --name MyRedisCache --resource-group MyResourceGroup --sku Premium --vm-size p1 --redis-configuration @"config_rdb.json"
```

Existing caches can be updated using the [az redis update](/cli/azure/redis#az-redis-update) command. For instance:

```azurecli
az redis update --name MyRedisCache --resource-group MyResourceGroup --set "redisConfiguration.rdb-storage-connection-string"="BlobEndpoint=https//..." "redisConfiguration.rdb-backup-enabled"="true" "redisConfiguration.rdb-backup-frequency"="15" "redisConfiguration.rdb-backup-max-snapshot-count"="1"
```

### [Using Azure CLI (Enterprise tier)](#tab/enterprise)

The [az redisenterprise create](/cli/azure/redisenterprise#az-redisenterprise-create) command can be used to create a new Enterprise-tier cache using data persistence. Use the `rdb-enabled`, `rdb-frequency`, `aof-enabled`, and `aof-frequency` parameters to configure the persistence setup. This example creates a new E10 Enterprise tier cache using RDB persistence with one hour frequency:

```azurecli
az redisenterprise create --cluster-name "cache1" --resource-group "rg1" --location "East US" --sku "Enterprise_E10" --persistence rdb-enabled=true rdb-frequency="1h" 
```

Existing caches can be updated using the [az redisenterprise update](/cli/azure/redisenterprise#az-redisenterprise-update) command. This example adds RDB persistence with 12 hour frequency to an existing cache instance:

```azurecli
az redisenterprise database update --cluster-name "cache1" --resource-group "rg1" --persistence rdb-enabled=true rdb-frequency="12h" 
```

---

## Managing data encryption
Because Redis persistence creates data at rest, encrypting this data is an important concern for many users. Encryption options vary based on the tier of Azure Cache for Redis being used. 

With the **Premium** tier, data is streamed directly from the cache instance to Azure Storage when persistence is initiated. Various encryption methods can be used with Azure Storage, including Microsoft-managed keys, customer-managed keys, and customer-provided keys. For information on encryption methods, see [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md). 

With the **Enterprise** and **Enterprise Flash** tiers, data is stored on a managed disk mounted to the cache instance. By default, the disk holding the persistence data, and the OS disk are encrypted using Microsoft-managed keys. A customer-managed key (CMK) can also be used to control data encryption. See [Encryption on Enterprise tier caches](cache-how-to-encryption.md) for instructions.  

## Persistence FAQ

The following list contains answers to commonly asked questions about Azure Cache for Redis persistence.

- [Can I enable persistence on a previously created cache?](#can-i-enable-persistence-on-a-previously-created-cache)
- [Can I enable AOF and RDB persistence at the same time?](#can-i-enable-aof-and-rdb-persistence-at-the-same-time)
- [How does persistence work with geo-replication?](#how-does-persistence-work-with-geo-replication)
- [Which persistence model should I choose?](#which-persistence-model-should-i-choose)
- [What happens if I've scaled to a different size and a backup is restored that was made before the scaling operation?](#what-happens-if-ive-scaled-to-a-different-size-and-a-backup-is-restored-that-was-made-before-the-scaling-operation)
- [Can I use the same storage account for persistence across two different caches?](#can-i-use-the-same-storage-account-for-persistence-across-two-different-caches)
- [Will I be charged for the storage being used in Data Persistence](#will-i-be-charged-for-the-storage-being-used-in-data-persistence)
- [How frequently does RDB and AOF persistence write to my blobs, and should I enable soft delete?](#how-frequently-does-rdb-and-aof-persistence-write-to-my-blobs-and-should-i-enable-soft-delete)
- [Will having firewall exceptions on the storage account affect persistence](#will-having-firewall-exceptions-on-the-storage-account-affect-persistence)
- [How do I check if soft delete is enabled on my storage account?](#how-do-i-check-if-soft-delete-is-enabled-on-my-storage-account)

### RDB persistence

- [Can I change the RDB backup frequency after I create the cache?](#can-i-change-the-rdb-backup-frequency-after-i-create-the-cache)
- [Why is there more than 60 minutes between backups when I have an RDB backup frequency of 60 minutes?](#why-is-there-more-than-60-minutes-between-backups-when-i-have-an-rdb-backup-frequency-of-60-minutes)
- [What happens to the old RDB backups when a new backup is made?](#what-happens-to-the-old-rdb-backups-when-a-new-backup-is-made)

### AOF persistence

- [When should I use a second storage account?](#when-should-i-use-a-second-storage-account)
- [Does AOF persistence affect throughput, latency, or performance of my cache?](#does-aof-persistence-affect-throughput-latency-or-performance-of-my-cache)
- [How can I remove the second storage account?](#how-can-i-remove-the-second-storage-account)
- [What is a rewrite and how does it affect my cache?](#what-is-a-rewrite-and-how-does-it-affect-my-cache)
- [What should I expect when scaling a cache with AOF enabled?](#what-should-i-expect-when-scaling-a-cache-with-aof-enabled)
- [How is my AOF data organized in storage?](#how-is-my-aof-data-organized-in-storage)
- [Can I have AOF persistence enabled if I have more than one replica?](#can-i-have-aof-persistence-enabled-if-i-have-more-than-one-replica)

### Can I enable persistence on a previously created cache?

Yes, persistence can be configured both at cache creation and on existing Premium, Enterprise, or Enterprise Flash caches.

### Can I enable AOF and RDB persistence at the same time?

No, you can enable RDB or AOF, but not both at the same time.

### How does persistence work with geo-replication?

If you enable data persistence, geo-replication can't be enabled for your cache.

### Which persistence model should I choose?

AOF persistence saves every write to a log, which has a significant effect on throughput. Compared AOF with RDB persistence, which saves backups based on the configured backup interval with minimal effect to performance. Choose AOF persistence if your primary goal is to minimize data loss, and you can handle a lower throughput for your cache. Choose RDB persistence if you wish to maintain optimal throughput on your cache, but still want a mechanism for data recovery.

- Learn more about the [advantages](https://redis.io/topics/persistence#rdb-advantages) and [disadvantages](https://redis.io/topics/persistence#rdb-disadvantages) of RDB persistence.
- Learn more about the [advantages](https://redis.io/topics/persistence#aof-advantages) and [disadvantages](https://redis.io/topics/persistence#aof-disadvantages) of AOF persistence.

For more information on performance when using AOF persistence, see [Does AOF persistence affect throughput, latency, or performance of my cache?](#does-aof-persistence-affect-throughput-latency-or-performance-of-my-cache)

### Does AOF persistence affect throughput, latency, or performance of my cache?

AOF persistence does affect throughput. AOF runs on both the primary and replica process, therefore you see higher CPU and Server Load for a cache with AOF persistence than an identical cache without AOF persistence. AOF offers the best consistency with the data in memory because each write and delete is persisted with only a few seconds of delay. The trade-off is that AOF is more compute intensive.

As long as CPU and Server Load are both less than 90%, there is a penalty on throughput, but the cache operates normally, otherwise. Above 90% CPU and Server Load, the throughput penalty can get much higher, and the latency of all commands processed by the cache increases. This is because AOF persistence runs on both the primary and replica process, increasing the load on the node in use, and putting persistence on the critical path of data. 

### What happens if I've scaled to a different size and a backup is restored that was made before the scaling operation?

For both RDB and AOF persistence:

- If you've scaled to a larger size, there's no effect.
- If you've scaled to a smaller size, and you have a custom [databases](cache-configure.md#databases) setting that is greater than the [databases limit](cache-configure.md#databases) for your new size, data in those databases isn't restored. For more information, see [Is my custom databases setting affected during scaling?](cache-how-to-scale.md#is-my-custom-databases-setting-affected-during-scaling)
- If you've scaled to a smaller size, and there isn't enough room in the smaller size to hold all of the data from the last backup, keys are evicted during the restore process. Typically, keys are evicted using the [allkeys-lru](https://redis.io/topics/lru-cache) eviction policy.

### Can I use the same storage account for persistence across two different caches?

Yes, you can use the same storage account for persistence across two different caches.

### Will I be charged for the storage being used in data persistence?

- For **Premium** caches, you're charged for the storage being used per the pricing model of the storage account being used.
- For **Enterprise** and **Enterprise Flash** caches, you aren't charged for the managed disk storage. It's included in the price.

### How frequently does RDB and AOF persistence write to my blobs, and should I enable soft delete?

We recommend that you avoid enabling soft delete on storage accounts when used with Azure Cache for Redis data persistence with the Premium tier. RDB and AOF persistence can write to your blobs as frequently as every hour, every few minutes, or every second. Also, enabling soft delete on a storage account means Azure Cache for Redis can't minimize storage costs by deleting the old backup data. 

Soft delete quickly becomes expensive with the typical data sizes of a cache that also performs write operations every second. For more information on soft delete costs, see [Pricing and billing](../storage/blobs/soft-delete-blob-overview.md).

### Can I change the RDB backup frequency after I create the cache?

Yes, you can change the backup frequency for RDB persistence using the Azure portal, CLI, or PowerShell. 

### Why is there more than 60 minutes between backups when I have an RDB backup frequency of 60 minutes?

The RDB persistence backup frequency interval doesn't start until the previous backup process has completed successfully. If the backup frequency is 60 minutes and it takes a backup process 15 minutes to complete, the next backup won't start until 75 minutes after the start time of the previous backup.

### What happens to the old RDB backups when a new backup is made?

All RDB persistence backups, except for the most recent one, are automatically deleted. This deletion might not happen immediately, but older backups aren't persisted indefinitely. If you're using the Premium tier for persistence, and soft delete is turned on for your storage account, the soft delete setting applies, and existing backups continue to reside in the soft delete state.

### When should I use a second storage account?

Use a second storage account for AOF persistence when you think you've higher than expected set operations on the cache. Setting up the secondary storage account helps ensure your cache doesn't reach storage bandwidth limits. This option is only available for Premium tier caches.



### How can I remove the second storage account?

You can remove the AOF persistence secondary storage account by setting the second storage account to be the same as the first storage account. For existing caches, access  **Data persistence** from the **Resource menu** for your cache. To disable AOF persistence, select **Disabled**.

### What is a rewrite and how does it affect my cache?

When the AOF file becomes large enough, a rewrite is automatically queued on the cache. The rewrite resizes the AOF file with the minimal set of operations needed to create the current data set. During rewrites, you can expect to reach performance limits sooner, especially when dealing with large datasets. Rewrites occur less often as the AOF file becomes larger, but take a significant amount of time when it happens.

### What should I expect when scaling a cache with AOF enabled?

If the AOF file at the time of scaling is large, then expect the scale operation to take longer than expected because it reloads the file after scaling has finished.

For more information on scaling, see [What happens if I've scaled to a different size and a backup is restored that was made before the scaling operation?](#what-happens-if-ive-scaled-to-a-different-size-and-a-backup-is-restored-that-was-made-before-the-scaling-operation)

### How is my AOF data organized in storage?

When you use the Premium tier, data stored in AOF files is divided into multiple page blobs per node to increase performance of saving the data to storage. The following table displays how many page blobs are used for each pricing tier:

| Premium tier | Blobs |
|--------------|-------|
| P1           | 4 per shard    |
| P2           | 8 per shard    |
| P3           | 16 per shard   |
| P4           | 20 per shard   |

When clustering is enabled, each shard in the cache has its own set of page blobs, as indicated in the previous table. For example, a P2 cache with three shards distributes its AOF file across 24 page blobs (eight blobs per shard, with three shards).

After a rewrite, two sets of AOF files exist in storage. Rewrites occur in the background and append to the first set of files. Set operations, sent to the cache during the rewrite, append to the second set. A backup is temporarily stored during rewrites if there's a failure. The backup is promptly deleted after a rewrite finishes. If soft delete is turned on for your storage account, the soft delete setting applies and existing backups continue to stay in the soft delete state.

### Will having firewall exceptions on the storage account affect persistence?

Using managed identity adds the cache instance to the [trusted services list](../storage/common/storage-network-security.md?tabs=azure-portal), making firewall exceptions easier to carry out. If you aren't using managed identity and instead authorizing to a storage account using a key, then having firewall exceptions on the storage account tends to break the persistence process. This only applies to persistence in the Premium tier. 


### Can I have AOF persistence enabled if I have more than one replica?

With the Premium tier, you can't use Append-only File (AOF) persistence with multiple replicas. In the Enterprise and Enterprise Flash tiers, replica architecture is more complicated, but AOF persistence is supported when Enterprise caches are used in zone redundant deployment.  

### How do I check if soft delete is enabled on my storage account?

Select the storage account that your cache is using for persistence. Select **Data Protection** from the Resource menu. In the working pane, check the state of *Enable soft delete for blobs*.

## Next steps

Learn more about Azure Cache for Redis features.

- [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
- [Add replicas to Azure Cache for Redis](cache-how-to-multi-replicas.md)
