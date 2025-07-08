---
title: Migrate to Azure Cache for Redis
description: Learn how to migrate an existing cache to Azure Cache for Redis or migrate between Azure Cache for Redis instances.
ms.topic: conceptual
ms.custom:
  - ignite-2024
ms.collection: 
 - migration
 - aws-to-azure
ms.date: 05/22/2025
appliesto:
  - ✅ Azure Cache for Redis

---
# Migrate to or between Azure Cache for Redis instances

This article describes several Azure Cache for Redis migration scenarios. You can migrate open-source Redis caches running on-premises or in cloud virtual machines (VMs), or hosted caches from other cloud platforms, to Azure Cache for Redis.

You can also migrate one Azure Cache for Redis instance to another instance. If you only need to move an Azure Redis cache from one Azure region to another, see [Move Azure Cache for Redis instances to different regions](cache-moving-resources.md).

Open-source Redis can run in many compute environments, such as private on-premises data centers or cloud-hosted VMs. Other hosting platforms like Amazon Web Services (AWS) host Redis cache services like AWS ElastiCache. You can usually migrate these Redis caches to Azure Cache for Redis with minimal interruption or downtime.

## Migration options

How you migrate from one cache to another depends on where your cache exists and how your application interacts with it. The following table lists frequently used migration strategies.

   | Option       | Advantages | Disadvantages |
   | ------------ | ---------- | ------------- |
   | Create a new cache | Simplest to implement. | Must repopulate data to the new cache, which might not work with some applications. |
   | Export and import data via read-only database (RDB) file. | Compatible with any Redis cache. | Data written to the existing cache after the RDB file is generated could be lost. | 
   | Dual-write data to two caches. | No data loss or downtime, no interrupted cache operations, and easier testing. | Needs two caches for an extended time period. | 
   | Migrate data programmatically. | Full control over how data is moved. | Requires custom code. | 

### Create a new cache

If uninterrupted operations and potential data loss aren't concerns, the easiest way to move data to Azure Cache for Redis is to create an Azure Redis cache instance and connect your application to it. For example, if you use Redis as a look-aside cache of database records, you can easily rebuild the cache from scratch. This approach isn't technically a migration.

General steps to implement this option are:

1. Create a new Azure Cache for Redis instance. Optionally, try out [Azure Managed Redis](../redis/overview.md).
1. Update your application to use the new Azure Redis instance.
3. Delete the old Redis instance.

### Export data to an RDB file and import it into Azure Cache for Redis

Open-source Redis defines a standard mechanism to take a snapshot of a cache's in-memory dataset and save it to an RDB file that any Redis cache can read. Azure Cache for Redis [Premium tier](cache-overview.md#service-tiers) supports importing data into a cache instance via RDB file. You can use the RDB file to transfer data from an existing cache to Azure Cache for Redis.

> [!IMPORTANT]
> RDB file format can change between Redis versions and might not maintain backward compatibility. The Redis version of the cache you export should be equal to or lower than the version that Azure Cache for Redis provides.

General steps to implement this option are:

1. Save a snapshot of the existing Redis cache. You can [configure Redis to save snapshots](https://redis.io/topics/persistence) periodically, or save one manually using the [SAVE](https://redis.io/commands/save) or [BGSAVE](https://redis.io/commands/bgsave) commands. The RDB file is named *dump.rdb* by default and is located at the path specified in the *redis.conf* configuration file.
1. Create a new Premium-tier Azure Cache for Redis instance that's at least as large as the existing cache.
1. Copy the RDB file to an Azure storage account in the region where your new cache is located. You can use `AzCopy` for this task.
1. [Import](cache-how-to-import-export-data.md#import) the RDB file into the new cache. You can also use the PowerShell [Import-AzRedisCache](/powershell/module/az.rediscache/import-azrediscache) cmdlet.
1. Update your application to use the new cache instance.

> [!NOTE]
> To migrate data from another Azure Redis instance, first [export](cache-how-to-import-export-data.md#export) the RDB file from that instance, or use the PowerShell [Export-AzRedisCache](/powershell/module/az.rediscache/export-azrediscache) cmdlet.

### Write to two Redis caches during migration

Rather than moving data between caches, you can temporarily set your application to write data to both an existing cache and a new one. The application reads data from the existing cache initially. When the new cache has enough data, you can switch the application to that cache and retire the old one.

For example, suppose you use Redis as a session store and the application sessions expire after seven days. After writing to both caches for seven days, you know the new cache contains all nonexpired session information and you can safely rely on it from that point on. You can then retire the old cache.

General steps to implement this option are:

1. Create a new Premium-tier Azure Cache for Redis instance that's at least as large as the existing cache.
1. Modify your application code to write to both the new and the original instances.
1. Continue using data from the original instance until the new instance is sufficiently populated with data.
1. Update the application code to reading and writing from the new instance only.
1. Delete the original instance.

### Migrate programmatically

You can create a custom migration by programmatically reading data from an existing cache and writing it into Azure Cache for Redis. For example, you can use the open-source [redis-copy](https://github.com/deepakverma/redis-copy) tool to copy data from one Azure Redis instance to another.

The source code can be a useful guide for writing your own migration tool. A [compiled version](https://github.com/deepakverma/redis-copy/releases/download/alpha/Release.zip) is also available.

> [!NOTE]
> This tool isn't officially supported by Microsoft. 

General steps to implement this option are:

1. Create an Azure virtual machine (VM) in the same region as the existing cache. If your dataset is large, choose a powerful VM to reduce copying time.
1. Create a new Azure Cache for Redis instance and make sure that it's empty. The `redis-copy` tool doesn't overwrite any existing keys in the target cache.
4. Use an application such as `redis-copy` to automate copying the data from the source cache to the target cache. The copy process could take a while depending on the size of your dataset.

## Related content

- [Azure Cache for Redis service tiers](cache-overview.md#service-tiers)
- [Import and export data](cache-how-to-import-export-data.md#import)
