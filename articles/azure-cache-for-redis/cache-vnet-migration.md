---
title: Migrate from VNet injection caches to Private Link caches
description: Learn how to migrate your Azure Cache for Redis Virtual Network (VNet) caches to Private Link caches.
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 07/19/2021
---

# Migrate from VNet injection caches to Private Link caches
This article describes a number of approaches to migrate an Azure Cache for Redis Virtual Network (VNet) injected cache instances to Azure Cache for Redis Private Link cache instances. 

[Azure Private Link](../private-link/private-link-overview.md) simplifies the network architecture and secures the connection between endpoints in Azure. You can connect to an Azure Cache instance from your virtual network via a private endpoint, which is assigned a private IP address in a subnet within the virtual network. Advantages of using Azure Private Link for Azure Cache for Redis include: 

* **Tier flexibility** – Azure Private Link is supported on all our tiers; Basic, Standard, Premium, Enterprise, and Enterprise Flash. Compared to Virtual Network injection, which is only offered on our premium tier.   

* **Simplified Network Security Group (NSG) Rule Management** - NSG rules do not need to be configured to adhere to requirements from Azure Cache for Redis.

* **Azure Policy Support** – Ensure all caches in your organization are created with Private Link and audit your organization’s existing caches to verify they all utilize Private Link.

## Migration options

You can switch from VNet injection to Private Link using a few different ways. Depending on where your cache is and how your application interacts with it, one method will be more useful than the others. Some of the frequently used migration strategies are detailed below. 

### If you're using any combination of geo-replication, clustering, or ARM VNet:

   | Option       | Advantages | Disadvantages |
   | ------------ | ---------- | ------------- |
   | Dual-write data to two caches | No data loss or downtime. Uninterrupted operations of the existing cache. Easier testing of the new cache. | Needs two caches for an extended period of time. | 
   | Create a new cache | Simplest to implement. | Need to repopulate data to the new cache, which might not work with many applications. |
   | Export and import data via RDB file | Data migration is required. | Some data could be lost, if they're written to the existing cache after the RDB file is generated. | 
   | Migrate data programmatically | Full control over how data are moved. | Requires custom code. | 

### Write to two Redis caches simultaneously during migration period

Rather than moving data directly between caches, you may use your application to write data to both an existing cache and a new one you're setting up. The application will still read data from the existing cache initially. When the new cache has the necessary data, you switch the application to that cache and retire the old one. Let's say, for example, you use Redis as a session store and the application sessions are valid for seven days. After writing to the two caches for a week, you'll be certain the new cache contains all non-expired session information. You can safely rely on it from that point onward without concern over data loss.

General steps to implement this option are:

1. Create a new [Azure Cache for Redis instance with private endpoints](cache-private-link.md) that is the same size as (or bigger than) the existing cache.

2. Modify application code to write to both the new and the original instances.

3. Continue reading data from the original instance until the new instance is sufficiently populated with data.

4. Update the application code to reading and writing from the new instance only.

5. Delete the original instance.

### Create a new Azure Cache for Redis

This approach technically isn't a migration. If losing data isn't a concern, the easiest way to move to Azure Cache for Redis is to create cache instance and connect your application to it. For example, if you use Redis as a look-aside cache of database records, you can easily rebuild the cache from scratch.

General steps to implement this option are:

1. Create a new [Azure Cache for Redis instance with private endpoints](cache-private-link.md).

2. Update your application to use the new instance.

3. Delete the old Redis instance.

### Export data to an RDB file and import it into Azure Cache for Redis (Premium tier only)

Open-source Redis defines a standard mechanism for taking a snapshot of a cache's in-memory dataset and saving it to a file. This file, called RDB, can be read by another Redis cache. [Azure Cache for Redis premium tier](cache-overview.md#service-tiers) supports importing data into a cache instance via RDB files. You can use an RDB file to transfer data from an existing cache to Azure Cache for Redis.

> [!IMPORTANT]
> RDB file format can change between Redis versions and may not maintain backward-compatibility. The Redis version of the cache you're exporting from should be equal or less than the version provided by Azure Cache for Redis.
>

General steps to implement this option are:

1. Create a new [Azure Cache for Redis instance with private endpoints](cache-private-link.md) in the premium tier that is the same size as (or bigger than) the existing cache.

2. Save a snapshot of the existing Redis cache. You can [configure Redis to save snapshots](https://redis.io/topics/persistence) periodically, or run the process manually using the [SAVE](https://redis.io/commands/save) or [BGSAVE](https://redis.io/commands/bgsave) commands. The RDB file is named “dump.rdb” by default and will be located at the path specified in the *redis.conf* configuration file.

    > [!NOTE]
    > If you’re migrating data within Azure Cache for Redis, see [these instructions on how to export an RDB file](cache-how-to-import-export-data.md) or use the [PowerShell Export cmdlet](/powershell/module/azurerm.rediscache/export-azurermrediscache) instead.
    >

3. Copy the RDB file to an Azure storage account in the region where your new cache is located. You can use AzCopy for this task.

4. Import the RDB file into the new cache using these [import instructions](cache-how-to-import-export-data.md) or the [PowerShell Import cmdlet](/powershell/module/azurerm.rediscache/import-azurermrediscache).

5. Update your application to use the new cache instance.

### Migrate programmatically

Create a custom migration process by programmatically reading data from an existing cache and writing them into Azure Cache for Redis. This [open-source tool](https://github.com/deepakverma/redis-copy) can be used to copy data from one Azure Cache for Redis instance to another. This tool is useful for moving data between cache instances in different Azure Cache regions. A [compiled version](https://github.com/deepakverma/redis-copy/releases/download/alpha/Release.zip) is available as well. You may also find the source code to be a useful guide for writing your own migration tool.

> [!NOTE]
> This tool isn't officially supported by Microsoft. 
>

General steps to implement this option are:

1. Create a VM in the region where the existing cache is located. If your dataset is large, choose a relatively powerful VM to reduce copying time.

2. Create a new [Azure Cache for Redis instance with private endpoints](cache-private-link.md)

3. Flush data from the new cache to ensure that it's empty. This step is required because the copy tool itself doesn't overwrite any existing key in the target cache.

    > [!IMPORTANT]
    > Make sure to NOT flush from the source cache.
    >

4. Use an application such as the open-source tool above to automate the copying of data from the source cache to the target. Remember that the copy process could take a while to complete depending on the size of your dataset.


## Next steps
* Learn more about [network isolation options](cache-network-isolation.md). 
* Learn how to [configure private endpoints for all Azure Cache for Redis tiers](cache-private-link.md).