---
title: Move from Azure Cache for Redis to Azure Managed Redis (preview)
description: Why and how to move from Azure Cache for Redis to Azure Managed Redis.

ms.service: azure
ms.custom:
  - ignite-2024
  - references_regions
ms.topic: how-to
ms.date: 11/15/2024

#CustomerIntent: As a developer, I want to see how to move from Azure Cache for Redis to Azure Managed Redis.
---
# Move from Azure Cache for Redis to Azure Managed Redis (preview)

In this article, you learn to migrate from Azure Cache for Redis instance to an Azure Managed Redis (preview) instance.

> [!IMPORTANT]
> Azure Managed Redis is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- An instance of any Azure Cache for Redis

## Feature comparison between Azure Cache for Redis and Azure Managed Redis (preview)

| Feature Description | Basic | Standard | Premium | Balanced (preview) | Memory Optimized (preview) | Compute Optimized (preview) |
| ------------------- | :-----: | :------: | :---: | :---: | :---: |:---: |
| Availability |N/A|99.9%|99.9%|N/A|N/A|N/A |
| Data encryption in transit |Yes|Yes|Yes|Yes|Yes|Yes|
| Network isolation |Yes|Yes|Yes|Yes|Yes|Yes|
| Scaling up/out |Yes|Yes|Yes|Yes|Yes|Yes|
| Scaling down/in |Yes|Yes|Yes|No|No|No|
| OSS clustering |No|No|Yes|Yes|Yes|Yes|
| Data persistence |No|No|Yes|Yes|Yes|Yes|
| Zone redundancy |No|Yes (preview)|Yes|Yes|Yes|Yes |
| Geo-replication |No|No|Yes (Passive) |Yes (Active) |Yes (Active) | Yes (Active)|
| Connection audit logs |No|No|Yes|Yes(Event-based)|Yes(Event-based)|Yes(Event-based) |
| Redis Modules |No|No|No|Yes|Yes|Yes|
| Import/Export |No|No|Yes|Yes|Yes|Yes|
| Reboot |Yes|Yes|Yes|No|No|No|
| Scheduled updates |Yes|Yes|Yes|No|No|No|
| Microsoft Entra ID authentication |Yes|Yes|Yes|Yes|Yes|Yes|
| Microsoft Entra ID RBAC |Yes|Yes|Yes|No|No|No|
| Keyspace notification |Yes|Yes|Yes|No|No|No|
| Non High-availability |N/A|No|No|Yes|Yes|Yes|

Here are some other differences that aren't covered by the previous mapping. Consider these client application changes:

| Feature Description | Azure Cache for Redis | Azure Managed Redis (preview) |
|:-------------------- |:--------------------|:---------------------------|
| DNS suffix (only for PROD cloud)| `.redis.cache.windows.net`|`<region>.redis.azure.net`|
| TLS port | 6380 | 10000 |
| Non-TLS port | 6379 | Not supported |
| Individual node TLS ports | 130XX | 85xx |
| Individual node non-TLS port | 150XX | Not supported |
| Clustering support | OSS clustering mode | OSS and Enterprise cluster modes |
| Unsupported commands | Unsupported commands | Multi-key commands|
| Regional availability | All Azure regions | * See the list of regions after this section.|
| Redis version | 6 | 7.4 |
| Supported TLS versions | 1.2 and 1.3 | 1.2 and 1.3 |

## Regional availability for Azure Managed Redis

Azure Managed Redis is current supported in the following regions. This list is updated regularly. Eventually, Azure Managed Redis will be supported all regions in Azure. Work with your sales contact to raise requests on regions where you need support.

| Americas | Europe | Middle East | Africa | Asia Pacific |
|---|---|---|---|---|
|Brazil South |Germany West Central | | |East Asia |
|West Central US | UK South  |   |   | Australia East |
|North Central US | West Europe |   |   | Japan East |
|West US 3 |Sweden Central | | |South East Asia |
|East US 2 | | | |Central India |
|South Central US | | | | |
|West US 2 | | | | |
|East US | | | | |
|West US | | | | |
|Central US | | | | |
|Canada Central | | | | |

## Migrate your Azure Cache for Redis instance to Azure Managed Redis

> [!NOTE]
> Make sure to update the rest of your application and related Azure resources as needed to use the cache.

### Select the cache you want to move from the Azure portal

#### Azure Cache for Redis Basic / Standard / Premium nonclustered

> [!NOTE]
> Use non High Availability option of Azure Managed Redis for Migrating Basic SKUs

| Azure Cache for Redis | Azure Managed Redis | Additional memory (%) |
|-----------------------| :-----------------: | :-------------------: |
| Basic/Standard - C0 | Balanced - B0 | 50 |
| Basic/Standard - C1 | Balanced - B1 | 0 |
| Basic/Standard - C2 | Balanced - B3 | 17 |
| Basic/Standard - C3 | Balanced - B5 | 0 |
| Basic/Standard - C4 | Memory Optimized – M10* | -8 |
| Basic/Standard – C4 | Memory Optimized – M20** | 46 |
| Basic/Standard - C5 | Memory Optimized – M20* | -8 |
| Basic/Standard – C5 | Memory Optimized – M50** | 57 |
| Basic/Standard - C6 | Memory Optimized - M50 | 12 |
| Premium - P1 | Balanced - B5 | 0 |
| Premium - P2 | Balanced - B10* | -8 |
| Premium - P2 | Balanced - B20** | 46 |
| Premium - P3 | Balanced - B20* | -8 |
| Premium - P3 | Balanced - B50** | 57 |
| Premium - P4 | Balanced - B50 | 12 |
| Premium - P5 | Balanced - B100 | 0 |

- *This option is for cost efficiency. Ensure the peak of total used memory in the past month is less than the suggested Azure Managed Redis memory to choose this option.
- ** This option is for abundant memory consumption.

#### Azure Cache for Redis Premium clustered

- For sharded cluster, choose a Memory Optimized tier that has equivalent total memory.
- For clusters with more than one read replica, choose a Compute Optimized tier with equivalent total memory as the primary replica.

### Migration options

Client applications should be able to use an Azure Managed Redis instance that has different clustering modes and endpoints. Azure Cache for Redis and Azure Managed Redis (preview) are compatible so no application code changes other than connection configurations are required for most scenarios.

Learn more at:

- [Scale an Azure Managed Redis (preview) instance](../managed-redis/managed-redis-how-to-scale.md)

#### Options for Migrating Azure Cache for Redis to Azure Managed Redis

   | Option       | Advantages | Disadvantages |
   | ------------ | ---------- | ------------- |
   | Create a new cache | Simplest to implement. | Need to repopulate data to the new cache, which might not work with many applications. |
   | Export and import data via RDB file | Compatible with any Redis cache generally. | Some data could be lost, if they're written to the existing cache after the RDB file is generated. |
   | Dual-write data to two caches | No data loss or downtime. Uninterrupted operations of the existing cache. Easier testing of the new cache. | Needs two caches for an extended period of time. |
   | Migrate data programmatically | Full control over how data are moved. | Requires custom code. |

#### Create a new Azure Cache for Redis

This approach technically isn't a migration. If losing data isn't a concern, the easiest way to move to Azure Managed Redis tier is to create new cache instance and connect your application to it. For example, if you use Redis as a look-aside cache of database records, you can easily rebuild the cache from scratch.
General steps to implement this option are:

1. Create a new Azure Managed Redis instance.
1. Update your application to use the new instance.
1. Delete the old Azure Cache for Redis instance.

#### Export data to an RDB file and import it into Azure Managed Redis

This option is applicable only to premium tier caches. Open-source Redis defines a standard mechanism for taking a snapshot of a cache's in-memory dataset and saving it to a file. Another Redis cache can read the RDB file that was exported. [Azure Cache for Redis premium tier](../cache-overview.md#service-tiers) supports exporting data from a cache instance via RDB files. You can use an RDB file to transfer data from an existing Azure Cache for Redis instance to Azure Managed Redis instance.

General steps to implement this option are:

1. Create a new Azure Managed Redis instance that is the same size (or bigger than) the existing Azure Cache for Redis instance.
1. Export the RDB file from existing Azure Cache for Redis instance using these [export instructions](../cache-how-to-import-export-data.md#export) or the [PowerShell Export cmdlet](/powershell/module/az.rediscache/export-azrediscache)
1. Import the RDB file into new Azure Managed Redis instance using these import instructions or the PowerShell Import cmdlet
1. Update your application to use the new Azure Managed Redis instance connection string.

**Export Data**:

```cli
az redis export --resource-group <ResourceGroupName> --name <Azure Cache for Redis instance name> --prefix <BlobPrefix> --container <ContainerName> --file-format <FileFormat>
```

**Import Data**:

```cli
az redis import --resource-group <ResourceGroupName> --name <Azure Managed Redis instance name> --files <BlobUris>
```

Replace *ResourceGroupName*, *CacheName*, *BlobPrefix*, *ContainerName*, and *FileFormat* with your specific values. The--file-format_ can be either RDB or AOF.

#### Write to two Redis caches simultaneously during migration period

Rather than moving data directly between caches, you can use your application to write data to both an existing cache and a new one you're setting up. The application still reads data from the existing cache initially. When the new cache has the necessary data, you switch the application to that cache and retire the old one. Let's say, for example, you use Redis as a session store and the application sessions are valid for seven days. After writing to the two caches for a week, you'll be certain the new cache contains all nonexpired session information. You can safely rely on it from that point onward without concern over data loss.

General steps to implement this option are:

1. Create a new Azure Managed Redis instance that is the same size as (or bigger than) the existing Azure Cache for Redis instance.
1. Modify application code to write to both the new and the original instances.
1. Continue reading data from the original instance until the new instance is sufficiently populated with data.
1. Update the application code to reading and writing from the new instance only.
1. Delete the original instance.

#### Migrate programmatically

Create a custom migration process by programmatically reading data from an existing Azure Cache for Redis instance and writing them into Azure Managed Redis instance. There are two open source tools you can try:

- [Redis-copy](https://github.com/deepakverma/redis-copy)
  - This open-source tool can be used to copy data from one Azure Cache for Redis instance to another. This tool is useful for moving data between cache instances in different Azure Cache regions. A [compiled version](https://github.com/deepakverma/redis-copy/releases/download/alpha/Release.zip) is available as well. You can also find the source code to be a useful guide for writing your own migration tool.
- [RIOT](https://redis.io/docs/latest/integrate/riot/)
  - RIOT is another popular migration tool tested by Redis community. It's a command-line utility designed to help you get data in and out of Redis.

> [!NOTE]
> This tool isn't officially supported by Microsoft.

General steps to implement this option are:

1. Create a VM in the region where the existing cache is located. If your dataset is large, choose a relatively powerful VM to reduce copying time.
2. Create a new Azure Managed Redis instance.
3. Flush data from the new cache to ensure that it's empty. This step is required because the copy tool itself doesn't overwrite any existing key in the target cache.
 Important: Make sure to NOT flush from the source cache.
4. Use an application such as the open-source tool mentioned previously to automate the copying of data from the source cache to the target. Remember that the copy process could take a while to complete depending on the size of your dataset.

## Related content

- [What is Azure Managed Redis?](../managed-redis/managed-redis-overview.md)
