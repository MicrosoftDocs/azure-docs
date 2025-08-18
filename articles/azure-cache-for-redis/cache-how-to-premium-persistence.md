---
title: Data persistence
description: Learn about Redis persistence, and how to configure and manage data persistence in your Premium and Enterprise tier Azure Cache for Redis instances.

ms.custom: devx-track-azurecli
ms.topic: conceptual
ms.date: 04/21/2025
appliesto:
  - ✅ Azure Cache for Redis
---
# Data persistence in Azure Cache for Redis

If an Azure Cache for Redis cache failure occurs, data loss is possible when nodes are down. [Redis persistence](https://redis.io/topics/persistence) allows you to persist the data stored in cache instances. If there's a hardware failure, the cache instance rehydrates with data from the persistence file when it comes back online.

This article describes Redis persistence, and how to configure and manage data persistence in your Premium and Enterprise-tier Azure Redis cache instances. The data persistence feature isn't available in Basic or Standard tiers, and is in preview in Enterprise and Enterprise Flash tiers.

The ability to persist data is an important way to boost the durability of a cache instance, because it stores all cache data in memory. Persistence should be a key part of your Azure Redis [high availability and disaster recovery](cache-high-availability.md) strategy.

>[!IMPORTANT]
>The data persistence functionality provides resilience for unexpected Redis node failures. Data persistence isn't a data backup or point in time recovery (PITR) feature. If corrupted data is written to the Redis instance, the corrupted data is also persisted. To make backups of your Redis instance, use the [Export](cache-how-to-import-export-data.md) feature.

#### [Premium tier](#tab/premium)

>[!IMPORTANT]
>If you're using persistence on the Premium tier, check to see if your storage account has soft delete enabled before using the data persistence feature. Using data persistence with soft delete causes high storage costs. For more information, see [Should I enable soft delete?](#how-frequently-does-rdb-and-aof-persistence-write-to-my-blobs-and-should-i-enable-soft-delete)

#### [Enterprise tiers](#tab/enterprise)

>[!IMPORTANT]
>The *always write* option for AOF persistence on the Enterprise and Enterprise Flash tiers is retired and no longer recommended. This option had significant performance limitations. Use the *write every second* option or use RDB persistence instead.

---

## Scope of availability

|Tier     | Basic, Standard  | Premium  |Enterprise, Enterprise Flash  |
|---------|---------|---------|---------|
|Available  | No         | Yes        |  Yes (preview)  |

## Types of Redis data persistence

Azure Redis offers two types of data persistence, the *Redis database* (RDB) format and the *Append-only File* (AOF) format.

- **RDB persistence** persists a snapshot of your cache in a binary format and saves it in an [Azure Storage account](/azure/storage/common/storage-introduction). You configure the backup frequency to determine how often to persist the snapshot. If a catastrophic event occurs that disables both the primary and replica cache, the cache reconstructs automatically using the most recent snapshot. For more information, see [RDB advantages](https://redis.io/topics/persistence#rdb-advantages) and [RDB disadvantages](https://redis.io/topics/persistence#rdb-disadvantages).

- **AOF persistence** saves every write operation to a log, and saves the log once per second to an Azure Storage account. If a catastrophic event occurs that disables both the primary and replica caches, the cache reconstructs automatically using the stored write operations. For more information, see [AOF advantages](https://redis.io/topics/persistence#aof-advantages) and [AOF disadvantages](https://redis.io/topics/persistence#aof-disadvantages).

## Requirements and limitations

- Data persistence functionality provides resilience for unexpected Redis node failures. Data persistence isn't a data backup or PITR feature. If corrupted data is written to the Redis instance, the corrupted data also persists. To back up your Redis instance, use the [Export](cache-how-to-import-export-data.md) feature.

- Azure Cache for Redis persistence features are intended to restore data automatically to the same cache after data loss. You can't import persisted data files to a new or existing cache.

  - To move data across caches, use the [Import and Export data](cache-how-to-import-export-data.md) features.

  - To generate any backups of data that can be added to a new cache, you can use automated scripts using PowerShell or Azure CLI that export data periodically.

- Persistence isn't supported with caches that use [passive geo-replication](cache-how-to-geo-replication.md) or [active geo-replication](cache-how-to-active-geo-replication.md).

#### [Premium tier](#tab/premium)

- On the Premium tier, data is persisted directly to an Azure Storage account that you own and manage.

- The storage account for Premium-tier data persistence must be in the same region as the cache instance. However, you can use a storage account in a different subscription to persist data if you use [managed identity](cache-managed-identity.md) to connect to the storage account.

- It's best to disable the soft delete feature on the storage account you use for Premium-tier data persistence. Using data persistence with soft delete causes high storage costs. For more information, see [Pricing and billing](/azure/storage/blobs/soft-delete-blob-overview) and [Should I enable soft delete?](#how-frequently-does-rdb-and-aof-persistence-write-to-my-blobs-and-should-i-enable-soft-delete)

- RDB files are backed up to storage in the form of page blobs. Page blobs aren't supported in storage accounts with Hierarchical Namespace (HNS) enabled, such as Azure Data Lake Storage Gen2, so persistence tends to fail in those storage accounts.

- On the Premium tier, AOF persistence isn't supported with [multiple replicas](cache-how-to-multi-replicas.md).

#### [Enterprise tiers](#tab/enterprise)

- On the Enterprise and Enterprise Flash tiers, data is persisted to a managed disk attached directly to the cache instance. The location isn't configurable nor accessible to the user. Using a managed disk improves persistence performance.

>[!NOTE]
>The *always write* option for AOF persistence on the Enterprise and Enterprise Flash tiers is retired and no longer recommended. This option had significant performance limitations. Use the *write every second* option or use RDB persistence instead.

---

## Data encryption

Because Redis persistence creates data at rest, it's important to encrypt this data. Encryption options vary based on the Azure Redis tier you use.

#### [Premium tier](#tab/premium)

For the Premium tier, data streams directly from the cache instance to Azure Storage when persistence is initiated. Azure Storage automatically encrypts data when persisting it, but you can use several encryption methods, including Microsoft-managed keys (MMKs), customer-managed keys (CMKs), and customer-provided keys. For more information, see [Azure Storage encryption for data at rest](/azure/storage/common/storage-service-encryption) and [Customer-managed keys for Azure Storage encryption](/azure/storage/common/customer-managed-keys-overview).

#### [Enterprise tiers](#tab/enterprise)

For the Enterprise and Enterprise Flash tiers, data is stored on a managed disk mounted to the cache instance. By default, the OS disk and the disk holding the persistence data are encrypted using Microsoft-managed keys (MMKs), but you can also use customer-managed keys (CMKs). For more information, see [Encryption on Enterprise tier caches](cache-how-to-encryption.md).

---

## Set up data persistence

You can use the Azure portal, Azure Resource Manager (ARM) templates, PowerShell, or Azure CLI to create and set up data persistence for Premium or Enterprise tier Azure Redis caches.

### Prerequisites

- To create and add persistence to Azure Redis caches, you need write access and permissions to create Premium or Enterprise-level caches in an Azure subscription.
- For Premium-tier caches, you need an [Azure Storage account](/azure/storage/common/storage-account-create) in the same region as your cache to store the cache data. If you use [managed identity](cache-managed-identity.md) as the authentication method, you can use a storage account in a different subscription than your cache.
- For the Azure PowerShell procedures, you need [Azure PowerShell installed](/powershell/azure/install-azure-powershell), or use [Azure Cloud Shell](/azure/cloud-shell/get-started/ephemeral?tabs=powershell) with the PowerShell environment in the Azure portal.
- For the Azure CLI procedures, you need [Azure CLI installed](/cli/azure/install-azure-cli), or use [Azure Cloud Shell](/azure/cloud-shell/get-started/ephemeral?tabs=azurecli) with the Bash environment in the Azure portal.

### Set up data persistence in the Azure portal

In the Azure portal, you can set up data persistence when you create your Azure Redis Premium or Enterprise-level cache instance.

#### [Premium tier](#tab/premium)

>[!NOTE]
>You can also add persistence to a previously created cache by navigating to **Data persistence** under **Settings** in the left navigation menu for your cache.

1. To create a Premium cache in the [Azure portal](https://portal.azure.com), follow the instructions at [Quickstart: Create an open-source Redis cache](quickstart-create-redis.md), and select **Premium** for the **Cache SKU** on the **Basics** tab.

   :::image type="content" source="media/cache-how-to-premium-persistence/create-resource.png" alt-text="Screenshot that shows a form to create an Azure Cache for Redis resource.":::

1. When you fill out the **Advanced** tab, select either **RDB** or **AOF** persistence for **Backup file** under **Data persistence**, and configure the relevant settings.

   :::image type="content" source="media/cache-how-to-premium-persistence/select-cache.png" alt-text="Screenshot showing the settings for RDB data persistence.":::

   - For **RDB**, configure these settings:

     | Setting      | Value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
     | **Authentication Method** | Select **Managed Identity** or **Storage Key**| Using [managed identity](cache-managed-identity.md) allows you to use a storage account in a different subscription than your cache. |
     | **Subscription** | Select the subscription that contains your managed identity. | This item appears only if you chose **Managed Identity** authentication. |
     | **Backup Frequency** | Select a backup interval: **15 minutes**, **30 minutes**, **60 minutes**, **6 hours**, **12 hours**, or **24 hours**. | This interval starts counting down after the previous backup operation successfully completes. When the interval elapses, a new backup starts. |
     | **Storage Account** | Select your storage account. | The storage account must be in the same region as the cache. A Premium storage account is recommended because it has higher throughput. |
     | **Storage Key** | Select either the **Primary key** or the **Secondary key** to use. | This item appears only if you chose **Storage Key** authentication. If the storage key for your persistence storage account is regenerated, you must reconfigure the key from the **Storage Key** dropdown. |

   - For **AOF**, configure these settings:

     | Setting      | Value  | Description |
     | ------------ |  ------- | -------------------------------------------------- |
     | **Authentication Method** | Select **Managed Identity** or **Storage Key**| Using [managed identity](cache-managed-identity.md) allows you to use a storage account in a different subscription than your cache. |
     | **Subscription** | Select the subscription that contains your managed identity. | This item appears only if you chose **Managed Identity** authentication. |
     | **First Storage Account** | Select your storage account. | The storage account must be in the same region as the cache. A Premium storage account is recommended because it has higher throughput. |
     | **First Storage Key** | Select either the **Primary key** or **Secondary key** to use. | This item appears only if you chose **Storage Key** authentication. If the storage key is regenerated, you must reconfigure the key from the **Storage Key** dropdown list. |
     | **Second Storage Account** | Optionally select a secondary storage account. | If you configure a secondary storage account, the writes to the replica cache are persisted to this second storage account. |
     | **Second Storage Key** | Choose either the **Primary key** or **Secondary key** to use. | This item appears only if you chose **Storage Key** authentication. If the storage key is regenerated, you must reconfigure the key. |

1. Complete all the tabs and finish creating the cache by following the rest of the instructions at [Quickstart: Create an open-source Redis cache](quickstart-create-redis.md).

With RDB persistence, the first backup starts once the backup frequency interval elapses.

With AOF persistence, write operations to the cache save to the named storage account or accounts. If there's a catastrophic failure that takes down both the primary and replica caches, the stored AOF log is used to rebuild the cache.

#### [Enterprise tiers](#tab/enterprise)

>[!NOTE]
>You can also add persistence to a previously created cache by navigating to **Advanced settings** under **Settings** in the left navigation menu for your cache.

1. When you fill out the **Advanced** tab, select either **RDB** or **AOF** persistence for **Backup file** under **(PREVIEW) Data Persistence**.

1. Set the **Backup Frequency**.

   - For RDB, select either **60 Minutes**, **6 hours**, or **12 hours**. This interval starts counting down after the previous backup operation successfully completes. When it elapses, a new backup starts.
   - For AOF, keep **Write every second**.
     >[!NOTE]
     >The **Always write** option for AOF persistence is retired. This option appended new entries to the AOF file after every write to the cache, but caused significant performance degradation.

   :::image type="content" source="media/cache-how-to-premium-persistence/cache-advanced-persistence.png" alt-text="Screenshot that shows the Enterprise tier Advanced tab and Data persistence is highlighted with a red box.":::


---

### Set up data persistence using Azure PowerShell

You can use Azure PowerShell to set up data persistence when you create an Azure Redis Premium or Enterprise-tier cache, or to add persistence to a previously created cache.

#### [Premium tier](#tab/premium)

You can use the [New-AzRedisCache](/powershell/module/az.rediscache/new-azrediscache) command to create a new Azure Redis Premium-tier cache that uses data persistence.

- For RDB persistence, follow instructions at [Configure data persistence for a Premium Azure Redis cache](/powershell/module/az.rediscache/new-azrediscache#example-5-configure-data-persistence-for-a-premium-azure-cache-for-redis).
- For AOF persistence, follow instructions at [Configure data persistence for an AOF backup enabled Premium Azure Redis cache](/powershell/module/az.rediscache/new-azrediscache#example-6-configure-data-persistence-for-a-premium-azure-cache-for-redis-aof-backup-enabled)

To update existing caches to use data persistence, run the [Set-AzRedisCache](/powershell/module/az.rediscache/set-azrediscache) command. For instructions, see [Add persistence to an existing cache](/powershell/module/az.rediscache/set-azrediscache#example-3-modify-azure-cache-for-redis-if-you-want-to-add-data-persistence-after-azure-redis-cache-created).

#### [Enterprise tiers](#tab/enterprise)

You can use the [New-AzRedisEnterpriseCache](/powershell/module/az.redisenterprisecache/new-azredisenterprisecache) command to create a new Azure Redis Enterprise-tier cache that uses data persistence. You use the `RdbPersistenceEnabled` and `RdbPersistenceFrequency` parameters or the `AofPersistenceEnabled` and `AofPersistenceFrequency` parameters to configure the persistence setup.

The following example creates a new E10 Enterprise-tier cache using RDB persistence with a one-hour backup frequency:

```azurepowershell-interactive
New-AzRedisEnterpriseCache -Name "MyCache" -ResourceGroupName "MyGroup" -Location "West US" -Sku "Enterprise_E10" -RdbPersistenceEnabled -RdbPersistenceFrequency "1h"
```

To update an existing cache, use the [Update-AzRedisEnterpriseCacheDatabase](/powershell/module/az.redisenterprisecache/update-azredisenterprisecachedatabase) command. The following example adds RDB persistence with 12 hour backup frequency to an existing Enterprise cache instance.

```azurepowershell-interactive
Update-AzRedisEnterpriseCacheDatabase -Name "MyCache" -ResourceGroupName "MyGroup" -RdbPersistenceEnabled -RdbPersistenceFrequency "12h"
```

---

### Set up data persistence using Azure CLI

You can use Azure CLI to set up data persistence when you create an Azure Redis Premium or Enterprise-tier cache, or to add persistence to a previously created cache.

#### [Premium tier](#tab/premium)

You can use the [az redis create](/cli/azure/redis#az-redis-create) command to create a new Premium-tier cache that uses data persistence. For example:

```azurecli-interactive
az redis create --location westus2 --name MyRedisCache --resource-group MyResourceGroup --sku Premium --vm-size p1 --redis-configuration @"config_rdb.json"
```

To update an existing cache, use the [az redis update](/cli/azure/redis#az-redis-update) command. For example:

```azurecli-interactive
az redis update --name MyRedisCache --resource-group MyResourceGroup --set "redisConfiguration.rdb-storage-connection-string"="BlobEndpoint=https//..." "redisConfiguration.rdb-backup-enabled"="true" "redisConfiguration.rdb-backup-frequency"="15" "redisConfiguration.rdb-backup-max-snapshot-count"="1"
```

#### [Enterprise tiers](#tab/enterprise)

You can use the [az redisenterprise create](/cli/azure/redisenterprise#az-redisenterprise-create) command to create a new Enterprise-tier cache that uses data persistence. Use the `rdb-enabled` and `rdb-frequency` or `aof-enabled` and `aof-frequency` parameters to configure the persistence setup. The following example creates a new E10 Enterprise tier cache that uses RDB persistence with one hour frequency.

```azurecli-interactive
az redisenterprise create --cluster-name "cache1" --resource-group "rg1" --location "East US" --sku "Enterprise_E10" --persistence rdb-enabled=true rdb-frequency="1h" 
```

To update an existing cache, use the [az redisenterprise database update](/cli/azure/redisenterprise/database#az-redisenterprise-database-update) command. The following example adds RDB persistence with 12 hour frequency to an existing cache instance.

```azurecli-interactive
az redisenterprise database update --cluster-name "cache1" --resource-group "rg1" --persistence rdb-enabled=true rdb-frequency="12h" 
```

---

## Persistence FAQ

This section contains answers to commonly asked questions about Azure Redis cache persistence.

- [Can I enable persistence on an existing cache?](#can-i-enable-persistence-on-a-previously-created-cache)
- [Can I enable both AOF and RDB persistence?](#can-i-enable-aof-and-rdb-persistence-at-the-same-time)
- [Does persistence work with geo-replication?](#how-does-persistence-work-with-geo-replication)
- [Which persistence model should I choose?](#which-persistence-model-should-i-choose)
- [What happens if I scale to a different size, and a backup from before the scaling operation is restored?](#what-happens-if-i-scale-to-a-different-size-and-a-backup-is-restored-that-was-made-before-the-scaling-operation)
- [Can I use the same storage account for persistence across two different caches?](#can-i-use-the-same-storage-account-for-persistence-across-two-different-caches)
- [Am I charged for the storage data persistence uses?](#am-i-charged-for-the-storage-being-used-in-data-persistence)
- [How frequently do RDB and AOF persistence write to storage? Should I enable soft delete?](#how-frequently-does-rdb-and-aof-persistence-write-to-my-blobs-and-should-i-enable-soft-delete)
- [Do firewall exceptions on the storage account affect persistence?](#does-having-firewall-exceptions-on-the-storage-account-affect-persistence)
- [How do I check if soft delete is enabled on my storage account?](#how-do-i-check-if-soft-delete-is-enabled-on-my-storage-account)
- [Can I use a storage account in a different subscription from the one where my cache is located?](#can-i-use-a-storage-account-in-a-different-subscription-from-the-one-where-my-cache-is-located)

**RDB persistence**

- [Can I change RDB backup frequency after I create the cache?](#can-i-change-the-rdb-backup-frequency-after-i-create-the-cache)
- [Why are there more than 60 minutes between backups when I have an RDB backup frequency of 60 minutes?](#why-is-there-more-than-60-minutes-between-backups-when-i-have-an-rdb-backup-frequency-of-60-minutes)
- [What happens to the old RDB backups when a new backup is made?](#what-happens-to-the-old-rdb-backups-when-a-new-backup-is-made)

**AOF persistence**

- [When should I use a second storage account?](#when-should-i-use-a-second-storage-account)
- [Does AOF persistence affect cache throughput, latency, or performance?](#does-aof-persistence-affect-throughput-latency-or-performance-of-my-cache)
- [How can I remove the second storage account?](#how-can-i-remove-the-second-storage-account)
- [What is a rewrite, and how does it affect my cache?](#what-is-a-rewrite-and-how-does-it-affect-my-cache)
- [What should I expect when scaling a cache with AOF enabled?](#what-should-i-expect-when-scaling-a-cache-with-aof-enabled)
- [How is my AOF data organized in storage?](#how-is-my-aof-data-organized-in-storage)
- [Can I have AOF persistence enabled if I have more than one replica?](#can-i-have-aof-persistence-enabled-if-i-have-more-than-one-replica)

### Can I enable persistence on a previously created cache?

Yes, you can configure persistence at cache creation and on existing Premium, Enterprise, or Enterprise Flash caches.

### Can I enable AOF and RDB persistence at the same time?

No, you can enable RDB or AOF, but not both at once.

### How does persistence work with geo-replication?

Data persistence doesn't work with geo-replication enabled.

### Which persistence model should I choose?

AOF persistence writes to a log once per second, while RDB persistence saves backups based on the configured backup interval. RDB persistence has less effect on throughput and performance than AOF persistence.

Choose AOF persistence if your primary goal is to minimize data loss and you can handle a lower throughput for your cache. Choose RDB persistence if you wish to maintain optimal throughput on your cache but still want a mechanism for data recovery.

For more information, see [RDB advantages](https://redis.io/topics/persistence#rdb-advantages), [RDB disadvantages](https://redis.io/topics/persistence#rdb-disadvantages), [AOF advantages](https://redis.io/topics/persistence#aof-advantages), and [AOF disadvantages](https://redis.io/topics/persistence#aof-disadvantages).

### Does AOF persistence affect throughput, latency, or performance of my cache?

AOF persistence affects throughput. Because AOF runs on both the primary and replica process, you see higher CPU and Server Load for a cache with AOF persistence than on an identical cache without AOF persistence. AOF offers the best consistency with the data in memory because each write and delete is persisted with only a few seconds of delay. The tradeoff is that AOF is more compute intensive.

As long as CPU and Server Load are both less than 90%, there's a penalty on throughput, but the cache operates normally. Above 90% CPU and Server Load, the throughput penalty can get higher, and the latency of all commands processed by the cache increases. Latency increases because AOF persistence runs on both the primary and replica process, increasing the load on the node in use, and putting persistence on the critical path of data.

### What happens if I scale to a different size and a backup is restored that was made before the scaling operation?

- If you scaled to a larger size, there's no effect.
- If you scaled to a smaller size, and you have a custom [databases](cache-configure.md#databases) setting that's greater than the [databases limit](cache-configure.md#databases) for your new size, data in those databases isn't restored. For more information, see [Is my custom databases setting affected during scaling?](cache-how-to-scale.md#is-my-custom-databases-setting-affected-during-scaling)
- If you scaled to a smaller size, and there isn't enough room in the smaller size to hold all the data from the last backup, keys are evicted during the restore process. Typically, keys are evicted using the [allkeys-lru](https://redis.io/topics/lru-cache) eviction policy.

### Can I use the same storage account for persistence across two different caches?

No, you must use different storage accounts. Each cache must have its own storage account to set up for persistence.

> [!IMPORTANT]
> Also use separate storage accounts for persistence and performing periodic export operations on a cache.

### Am I charged for the storage being used in data persistence?

- For Premium caches, you're charged for the storage used per the pricing model of the storage account.
- For Enterprise and Enterprise Flash caches, the managed disk storage is included in the price and doesn't incur extra charges.

### How frequently does RDB and AOF persistence write to my blobs, and should I enable soft delete?

RDB and AOF persistence can write to your storage blobs as frequently as every hour, every few minutes, or every second. Soft delete quickly becomes expensive with the typical data sizes of a cache that also performs write operations every second. Enabling soft delete on a storage account also means Azure Redis can't minimize storage costs by deleting the old backup data.

It's best to avoid enabling soft delete on storage accounts you use for Azure Redis Premium-tier data persistence. For more information on soft delete costs, see [Pricing and billing](/azure/storage/blobs/soft-delete-blob-overview).

### Can I change the RDB backup frequency after I create the cache?

Yes, you can change the backup frequency for RDB persistence by using the Azure portal, Azure CLI, or Azure PowerShell.

### Why is there more than 60 minutes between backups when I have an RDB backup frequency of 60 minutes?

The RDB persistence backup frequency interval doesn't start until the previous backup process completes successfully. If the backup frequency is 60 minutes and it takes a backup process 15 minutes to complete, the next backup doesn't start until 75 minutes after the start time of the previous backup.

### What happens to the old RDB backups when a new backup is made?

All RDB persistence backups, except for the most recent one, are automatically deleted. This deletion might not happen immediately, but older backups aren't persisted indefinitely. If you're using the Premium tier for persistence, and soft delete is turned on for your storage account, the existing backups continue to reside in the soft delete state.

### When should I use a second storage account?

Use a second storage account for AOF persistence when you expect to have higher than usual SET operations on the cache. Using the secondary storage account helps ensure your cache doesn't reach storage bandwidth limits. This option is available only for Premium-tier caches.

### How can I remove the second storage account?

You can remove the AOF persistence secondary storage account by setting the second storage account to be the same as the first storage account. To change the settings for existing caches, select  **Data persistence** under **Settings** on the left navigation menu of your cache page. To disable persistence entirely, select **Disabled** on the **Data persistence** page.

### What is a rewrite and how does it affect my cache?

When an AOF file becomes large enough, a rewrite is automatically queued on the cache. The rewrite resizes the AOF file with the minimal set of operations needed to create the current data set.

During rewrites, you can expect to reach performance limits sooner, especially when dealing with large datasets. Rewrites occur less often as the AOF file becomes larger, but take a significant amount of time when they occur.

### What should I expect when scaling a cache with AOF enabled?

If the AOF file at the time of scaling is large, expect the scale operation to take longer than usual, because it reloads the file after scaling finishes. Also see [What happens if I scale to a different size and a backup is restored that was made before the scaling operation?](#what-happens-if-i-scale-to-a-different-size-and-a-backup-is-restored-that-was-made-before-the-scaling-operation)

### How is my AOF data organized in storage?

When you use the Premium tier, data stored in AOF files is divided into multiple page blobs per shard. By default, half of the blobs are saved in the primary storage account and half are saved in the secondary storage account. Splitting the data across multiple page blobs and two different storage accounts improves performance.

If the peak rate of writes to the cache isn't high, this extra performance might not be needed. In that case, the secondary storage account configuration can be removed, and all the AOF files stored in the single primary storage account. The following table displays how many total page blobs each pricing tier uses.

|Premium tier|Blobs|
|------------|---------------|
|P1           |8 per shard    |
|P2           |16 per shard   |
|P3           |32 per shard   |
|P4           |40 per shard   |

When clustering is enabled, each shard in the cache has its own set of page blobs, per the preceding table. For example, a P2 cache with three shards distributes its AOF file across 48 page blobs: Sixteen blobs per shard, with three shards.

After a rewrite, two sets of AOF files exist in storage. Rewrites occur in the background and append to the first set of files. SET operations sent to the cache during the rewrite append to the second set of files.

If there's a failure during a rewrite, a backup is temporarily stored. The backup is promptly deleted after the rewrite finishes. If soft delete is turned on for your storage account, the soft delete setting applies and existing backups continue to stay in the soft delete state.

### Does having firewall exceptions on the storage account affect persistence?

Yes. For persistence in the Premium tier, using [firewall settings on the storage account](/azure/storage/common/storage-network-security) can prevent the persistence feature from working.

You can check for errors in persisting data by viewing the [Errors metric](/azure/redis/monitor-cache-reference#azure-cache-for-redis-metrics). This metric indicates if the cache is unable to persist data due to firewall restrictions on the storage account or other problems.

To use data persistence with a storage account that has a firewall set up, use [managed identity based authentication](cache-managed-identity.md) to connect to storage. Using managed identity adds the cache instance to the [trusted services list](/azure/storage/common/storage-network-security), making firewall exceptions easier to apply. If you authorize to the storage account using a key instead of managed identity, having firewall exceptions on the storage account tends to break the persistence process.

### Can I have AOF persistence enabled if I have more than one replica?

With the Premium tier, you can't use AOF persistence with multiple replicas. In the Enterprise and Enterprise Flash tiers, replica architecture is more complicated, but AOF persistence is supported when Enterprise caches are used in zone redundant deployments.

### How do I check if soft delete is enabled on my storage account?

In the Azure portal, select the storage account your cache uses for persistence, and select **Data protection** under **Data management** in its left navigation menu. On the **Data protection** page, check whether **Enable soft delete for blobs** is enabled. For more information on soft delete in Azure storage accounts, see [Enable soft delete for blobs](/azure/storage/blobs/soft-delete-blob-enable?tabs=azure-portal).

### Can I use a storage account in a different subscription from the one where my cache is located?

You can choose a storage account in a different subscription only if you use managed identity as the storage account authentication method.

## Related content

Learn more about Azure Cache for Redis features.

- [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
- [Add replicas to Azure Cache for Redis](cache-how-to-multi-replicas.md)
- [Managed identity for storage accounts](cache-managed-identity.md)
