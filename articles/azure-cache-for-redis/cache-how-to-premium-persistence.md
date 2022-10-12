---
title: Configure data persistence - Premium Azure Cache for Redis
description: Learn how to configure and manage data persistence your Premium tier Azure Cache for Redis instances
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 09/19/2022

---
# Configure data persistence for a Premium Azure Cache for Redis instance

[Redis persistence](https://redis.io/topics/persistence) allows you to persist data stored in Redis. You can also take snapshots and back up the data. If there's a hardware failure, you load the data. The ability to persist data is a huge advantage over the Basic or Standard tiers where all the data is stored in memory. Data loss is possible if a failure occurs where Cache nodes are down.

> [!IMPORTANT]
>
> Check to see if your storage account has soft delete enabled before using the data persistence feature. Using data persistence with soft delete causes very high storage costs. For more information, see [should I enable soft delete?](#how-frequently-does-rdb-and-aof-persistence-write-to-my-blobs-and-should-i-enable-soft-delete).
>

Azure Cache for Redis offers Redis persistence using the Redis database (RDB) and Append only File (AOF):

- **RDB persistence** - When you use RDB persistence, Azure Cache for Redis persists a snapshot of your cache in a binary format. The snapshot is saved in an Azure Storage account. The configurable backup frequency determines how often to persist the snapshot. If a catastrophic event occurs that disables both the primary and replica cache, the cache is reconstructed using the most recent snapshot. Learn more about the [advantages](https://redis.io/topics/persistence#rdb-advantages) and [disadvantages](https://redis.io/topics/persistence#rdb-disadvantages) of RDB persistence.
- **AOF persistence** - When you use AOF persistence, Azure Cache for Redis saves every write operation to a log. The log is saved at least once per second into an Azure Storage account. If a catastrophic event occurs that disables both the primary and replica cache, the cache is reconstructed using the stored write operations. Learn more about the [advantages](https://redis.io/topics/persistence#aof-advantages) and [disadvantages](https://redis.io/topics/persistence#aof-disadvantages) of AOF persistence.

Azure Cache for Redis persistence features are intended to be used to restore data to the same cache after data loss and the RDB/AOF persisted data files can't be imported to a new cache.

To move data across caches, use the Import/Export feature. For more information, see [Import and Export data in Azure Cache for Redis](cache-how-to-import-export-data.md).

To generate any backups of data that can be added to a new cache, you can write automated scripts using PowerShell or CLI to export data periodically.

> [!NOTE]
> Persistence features are intended to be used to restore data to the same cache after data loss.
>
> - RDB/AOF persisted data files cannot be imported to a new cache.
> - Use the Import/Export feature to move data across caches.
> - Write automated scripts using PowerShell or CLI to create a backup of data that can be added to a new cache.

Persistence writes Redis data into an Azure Storage account that you own and manage. You configure the **New Azure Cache for Redis** on the left during cache creation. For existing premium caches, use the **Resource menu**.

> [!NOTE]
>
> Azure Storage automatically encrypts data when it is persisted. You can use your own keys for the encryption. For more information, see [Customer-managed keys with Azure Key Vault](../storage/common/storage-service-encryption.md).

## Set up data persistence

1. To create a premium cache, sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource**. You can create caches in the Azure portal. You can also create them using Resource Manager templates, PowerShell, or Azure CLI. For more information about creating an Azure Cache for Redis, see [Create a cache](cache-dotnet-how-to-use-azure-redis-cache.md#create-a-cache).

    :::image type="content" source="media/cache-how-to-premium-persistence/create-resource.png" alt-text="Screenshot that shows a form to create an Azure Cache for Redis resource.":::
  
2. On the **Create a resource** page, select **Databases** and then select **Azure Cache for Redis**.

    :::image type="content" source="media/cache-how-to-premium-persistence/select-cache.png" alt-text="Screenshot showing Azure Cache for Redis selected as a new database type.":::

3. On the **New Redis Cache** page, configure the settings for your new premium cache.
  
   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **DNS name** | Enter a globally unique name. | The cache name must be a string between 1 and 63 characters that contain only numbers, letters, or hyphens. The name must start and end with a number or letter, and can't contain consecutive hyphens. Your cache instance's *host name* will be *\<DNS name>.redis.cache.windows.net*. |
   | **Subscription** | Drop-down and select your subscription. | The subscription under which to create this new Azure Cache for Redis instance. |
   | **Resource group** | Drop-down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your cache and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. |
   | **Location** | Drop-down and select a location. | Select a [region](https://azure.microsoft.com/regions/) near other services that will use your cache. |
   | **Cache type** | Drop-down and select a premium cache to configure premium features. For details, see [Azure Cache for Redis pricing](https://azure.microsoft.com/pricing/details/cache/). |  The pricing tier determines the size, performance, and features that are available for the cache. For more information, see [Azure Cache for Redis Overview](cache-overview.md). |

4. Select the **Networking** tab or select the **Networking** button at the bottom of the page.

5. In the **Networking** tab, select your connectivity method. For premium cache instances, you connect either publicly, via Public IP addresses or service endpoints. You connect privately using a private endpoint.

6. Select the **Next: Advanced** tab or select the **Next: Advanced** button on the bottom of the page.

7. In the **Advanced** tab for a premium cache instance, configure the settings for non-TLS port, clustering, and data persistence. For data persistence, you can choose either **RDB** or **AOF** persistence.

8. To enable RDB persistence, select **RDB** and configure the settings.
  
   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Backup Frequency** | Drop-down and select a backup interval. Choices include **15 Minutes**, **30 minutes**, **60 minutes**, **6 hours**, **12 hours**, and **24 hours**. | This interval starts counting down after the previous backup operation successfully completes. When it elapses, a new backup starts. |
   | **Storage Account** | Drop-down and select your storage account. | Choose a storage account in the same region and subscription as the cache. A **Premium Storage** account is recommended because it has higher throughput. Also, using the soft delete feature on the storage account is strongly discouraged as it leads to increased storage costs. For more information, see [Pricing and billing](../storage/blobs/soft-delete-blob-overview.md). |
   | **Storage Key** | Drop-down and choose either the **Primary key** or **Secondary key** to use. | If the storage key for your persistence account is regenerated, you must reconfigure the key from the **Storage Key** drop-down. |

    The first backup starts once the backup frequency interval elapses.
  
   > [!NOTE]
   > When RDB files are backed up to storage, they are stored in the form of page blobs.
  
9. To enable AOF persistence, select **AOF** and configure the settings.

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **First Storage Account** | Drop-down and select your storage account. | Choose a storage account in the same region and subscription as the cache. A **Premium Storage** account is recommended because it has higher throughput. Also, using the soft delete feature on the storage account is strongly discouraged as it leads to increased storage costs. For more information, see [Pricing and billing](../storage/blobs/soft-delete-blob-overview.md). |
   | **First Storage Key** | Drop-down and choose either the **Primary key** or **Secondary key** to use. | If the storage key for your persistence account is regenerated, you must reconfigure the key from the **Storage Key** drop-down. |
   | **Second Storage Account** | (Optional) Drop-down and select your secondary storage account. | You can optionally configure another storage account. If a second storage account is configured, the writes to the replica cache are written to this second storage account. |
   | **Second Storage Key** | (Optional) Drop-down and choose either the **Primary key** or **Secondary key** to use. | If the storage key for your persistence account is regenerated, you must reconfigure the key from the **Storage Key** drop-down. |

    With AOF persistence enabled, write operations to the cache are saved to the named storage account (or accounts if you've configured a second storage account). If there's a catastrophic failure that takes down both the primary and replica cache, the stored AOF log is used to rebuild the cache.

10. Select the **Next: Tags** tab or select the **Next: Tags** button at the bottom of the page.

11. Optionally, in the **Tags** tab, enter the name and value if you wish to categorize the resource.

12. Select **Review + create**. You're taken to the Review + create tab where Azure validates your configuration.

13. After the green Validation passed message appears, select **Create**.

It takes a while for the cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.

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

### RDB persistence

- [Can I change the RDB backup frequency after I create the cache?](#can-i-change-the-rdb-backup-frequency-after-i-create-the-cache)
- [Why is there more than 60 minutes between backups when I have an RDB backup frequency of 60 minutes?](#why-is-there-more-than-60-minutes-between-backups-when-i-have-an-rdb-backup-frequency-of-60-minutes)
- [What happens to the old RDB backups when a new backup is made?](#what-happens-to-the-old-rdb-backups-when-a-new-backup-is-made)

### AOF persistence

- [When should I use a second storage account?](#when-should-i-use-a-second-storage-account)
- [Does AOF persistence affect throughout, latency, or performance of my cache?](#does-aof-persistence-affect-throughout-latency-or-performance-of-my-cache)
- [How can I remove the second storage account?](#how-can-i-remove-the-second-storage-account)
- [What is a rewrite and how does it affect my cache?](#what-is-a-rewrite-and-how-does-it-affect-my-cache)
- [What should I expect when scaling a cache with AOF enabled?](#what-should-i-expect-when-scaling-a-cache-with-aof-enabled)
- [How is my AOF data organized in storage?](#how-is-my-aof-data-organized-in-storage)

### Can I enable persistence on a previously created cache?

Yes, Redis persistence can be configured both at cache creation and on existing premium caches.

### Can I enable AOF and RDB persistence at the same time?

No, you can enable RDB or AOF, but not both at the same time.

### How does persistence work with geo-replication?

If you enable data persistence, geo-replication can't be enabled for your premium cache.

### Which persistence model should I choose?

AOF persistence saves every write to a log, which has a significant effect on throughput. Compared AOF with RDB persistence, which saves backups based on the configured backup interval with minimal effect to performance. Choose AOF persistence if your primary goal is to minimize data loss, and you can handle a lower throughput for your cache. Choose RDB persistence if you wish to maintain optimal throughput on your cache, but still want a mechanism for data recovery.

- Learn more about the [advantages](https://redis.io/topics/persistence#rdb-advantages) and [disadvantages](https://redis.io/topics/persistence#rdb-disadvantages) of RDB persistence.
- Learn more about the [advantages](https://redis.io/topics/persistence#aof-advantages) and [disadvantages](https://redis.io/topics/persistence#aof-disadvantages) of AOF persistence.

For more information on performance when using AOF persistence, see [Does AOF persistence affect throughout, latency, or performance of my cache?](#does-aof-persistence-affect-throughout-latency-or-performance-of-my-cache)

### What happens if I've scaled to a different size and a backup is restored that was made before the scaling operation?

For both RDB and AOF persistence:

- If you've scaled to a larger size, there's no effect.
- If you've scaled to a smaller size, and you have a custom [databases](cache-configure.md#databases) setting that is greater than the [databases limit](cache-configure.md#databases) for your new size, data in those databases isn't restored. For more information, see [Is my custom databases setting affected during scaling?](cache-how-to-scale.md#is-my-custom-databases-setting-affected-during-scaling)
- If you've scaled to a smaller size, and there isn't enough room in the smaller size to hold all of the data from the last backup, keys are evicted during the restore process.  Typically, keys are evicted using the [allkeys-lru](https://redis.io/topics/lru-cache) eviction policy.

### Can I use the same storage account for persistence across two different caches?

Yes, you can use the same storage account for persistence across two different caches.

### Will I be charged for the storage being used in Data Persistence?

Yes, you'll be charged for the storage being used as per the pricing model of the storage account being used.

### How frequently does RDB and AOF persistence write to my blobs, and should I enable soft delete?

Enabling soft delete on storage accounts is strongly discouraged when used with Azure Cache for Redis data persistence. RDB and AOF persistence can write to your blobs as frequently as every hour, every few minutes, or every second. Also, enabling soft delete on a storage account means Azure Cache for Redis can't minimize storage costs by deleting the old backup data. Soft delete quickly becomes expensive with the typical data sizes of a cache and write operations every second. For more information on soft delete costs, see [Pricing and billing](../storage/blobs/soft-delete-blob-overview.md).

### Can I change the RDB backup frequency after I create the cache?

Yes, you can change the backup frequency for RDB persistence on the **Data persistence** on the left. For instructions, see Configure Redis persistence.

### Why is there more than 60 minutes between backups when I have an RDB backup frequency of 60 minutes?

The RDB persistence backup frequency interval doesn't start until the previous backup process has completed successfully. If the backup frequency is 60 minutes and it takes a backup process 15 minutes to complete, the next backup won't start until 75 minutes after the start time of the previous backup.

### What happens to the old RDB backups when a new backup is made?

All RDB persistence backups, except for the most recent one, are automatically deleted. This deletion might not happen immediately, but older backups aren't persisted indefinitely. If soft delete is turned on for your storage account, the soft delete setting applies and existing backups continue to reside in the soft delete state.

### When should I use a second storage account?

Use a second storage account for AOF persistence when you believe you've higher than expected set operations on the cache. Setting up the secondary storage account helps ensure your cache doesn't reach storage bandwidth limits.

### Does AOF persistence affect throughout, latency, or performance of my cache?

AOF persistence affects throughput by about 15% – 20% when the cache is below maximum load (CPU and Server Load both under 90%). There shouldn't be latency issues when the cache is within these limits. However, the cache does reach these limits sooner with AOF enabled.

### How can I remove the second storage account?

You can remove the AOF persistence secondary storage account by setting the second storage account to be the same as the first storage account. For existing caches, the **Data persistence** on the left is accessed from the **Resource menu** for your cache. To disable AOF persistence, select **Disabled**.

### What is a rewrite and how does it affect my cache?

When the AOF file becomes large enough, a rewrite is automatically queued on the cache. The rewrite resizes the AOF file with the minimal set of operations needed to create the current data set. During rewrites, you can expect to reach performance limits sooner, especially when dealing with large datasets. Rewrites occur less often as the AOF file becomes larger, but will take a significant amount of time when it happens.

### What should I expect when scaling a cache with AOF enabled?

If the AOF file at the time of scaling is large, then expect the scale operation to take longer than expected because it will be reloading the file after scaling has finished.

For more information on scaling, see [What happens if I've scaled to a different size and a backup is restored that was made before the scaling operation?](#what-happens-if-ive-scaled-to-a-different-size-and-a-backup-is-restored-that-was-made-before-the-scaling-operation)

### How is my AOF data organized in storage?

Data stored in AOF files is divided into multiple page blobs per node to increase performance of saving the data to storage. The following table displays how many page blobs are used for each pricing tier:

| Premium tier | Blobs |
|--------------|-------|
| P1           | 4 per shard    |
| P2           | 8 per shard    |
| P3           | 16 per shard   |
| P4           | 20 per shard   |

When clustering is enabled, each shard in the cache has its own set of page blobs, as indicated in the previous table. For example, a P2 cache with three shards distributes its AOF file across 24 page blobs (eight blobs per shard, with three shards).

After a rewrite, two sets of AOF files exist in storage. Rewrites occur in the background and append to the first set of files. Set operations, sent to the cache during the rewrite, append to the second set. A backup is temporarily stored during rewrites if there's a failure. The backup is promptly deleted after a rewrite finishes. If soft delete is turned on for your storage account, the soft delete setting applies and existing backups continue to stay in the soft delete state.

### Will having firewall exceptions on the storage account affect persistence

Using managed identity adds the cache instance to the [trusted services list](../storage/common/storage-network-security.md?tabs=azure-portal), making firewall exceptions easier to carry out. If you aren't using managed identity and instead authorizing to a storage account using a key, then having firewall exceptions on the storage account tends to break the persistence process.

## Next steps

Learn more about Azure Cache for Redis features.

- [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
