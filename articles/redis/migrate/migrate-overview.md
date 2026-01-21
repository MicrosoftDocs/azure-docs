---
title: Move from Basic, Standard, Premium, and Enterprise tiers to Azure Managed Redis
description: In this article, you learn how and why to migrate an Enterprise cache from Azure Cache for Redis to Azure Managed Redis
ms.date: 09/28/2025
ms.topic: conceptual
ms.custom:
  - ignite-2024
  - references_regions
  - build-2025
ai-usage: ai-assisted
appliesto:
  - ✅ Azure Cache for Redis
  - ✅ Azure Managed Redis

#customer intent: As a developer who has Azure Cache for Redis instance, I want to migrate them to Azure Managed Redis caches.
---
# Migrate from Basic, Standard, Premium, and Enterprise tiers to Azure Managed Redis
This article explains why and how to migrate from Azure Cache for Redis (including Basic, Standard, Premium, and Enterprise tiers) to Azure Managed Redis.

You learn about:

- The benefits of choosing Azure Managed Redis over previous tiers.
- Key feature differences between the services.
- Strategies for migrating your cache data.
- Ways to ensure a smooth migration process.
- Guidance on selecting the right Azure Managed Redis SKU and performance tier for your needs.
- Considerations and recommendations for updating your client applications.

Whether you're using Basic, Standard, Premium, orEnterprise or OSS tiers, this guide helps you plan and execute your migration to Azure Managed Redis.

The document divides into two sections. One is about Enterprise instances. The other is about the Basic, Standard, and Premium tiers of Azure Cache for Redis.

- [Benefits of moving from Enterprise to Azure Managed Redis](#benefits-of-moving-from-enterprise-to-azure-managed-redis)
- [Benefits of moving from Basic, Standard, or Premium caches to Azure Managed Redis](#benefits-of-moving-from-basic-standard-or-premium-caches-to-azure-managed-redis)


## Benefits of moving from Enterprise to Azure Managed Redis

Azure Managed Redis is built on the advanced Redis Enterprise software. Azure Managed Redis is an Azure first party offering, meaning there's no Azure Marketplace component involved and users don't have to transact with Marketplace separately. You provision, manage, and pay for Azure Managed Redis like any other native Azure service or product.

Azure Managed Redis doesn't need the _quorum node_ that leads to underused resources and limits the regions or clouds where Azure Cache for Redis Enterprise can be offered. Azure Managed Redis is now available in most Azure regions with plans to be supported in other sovereign clouds. For more information about quorum node, see [Enterprise and Enterprise Flash tiers](/azure/azure-cache-for-redis/cache-high-availability#enterprise-and-enterprise-flash-tiers). By removing the unused _quorum node_, you get increased cost-efficiency because all nodes can be used as data nodes.

Azure Managed Redis is zone redundant by default.

You can use Azure Managed Redis without high availability (HA) for your development and test environments. Using nonproduction environments without HA halves the cost of your instance.

The SKU structure for Azure Managed Redis is based on your memory and performance needs. Instead of managing scale factors or capacity as with Azure Cache for Redis Enterprise, you can select from three performance tiers in Azure Managed Redis. For more information, see [Choosing the right tier](../overview.md#choosing-the-right-tier).

Finally, Azure Managed Redis offers the Microsoft Entra ID authentication when you create a cache to improve the security posture of your workload.

### Feature comparison

| Feature                           | Azure Cache for Redis Enterprise                  | Azure Managed Redis               |
|-----------------------------------|:-------------------------------------------------:|:---------------------------------:|
| Redis version                     | 7.2                                               | 7.4                               |
| Clustering policy                 | OSS, Enterprise                                   | OSS, Enterprise, Nonclustered    |
| Geo-replication                   | Active                                            | Active                            |
| SLA                               | Up to 99.999%                                     | Up to 99.999%                     |
| Zone redundancy                   | Yes                                               | \*Yes with high availability    |
| Non-HA mode                       | No                                                | Yes (for dev/test)                |
| Data persistence                  | Yes (in preview)                                  | Yes                               |
| Scaling                           | Yes                                               | Yes                               |
| TLS version support               | 1.2,1.3                                           | 1.2,1.3                           |
| Microsoft Entra ID authentication | No                                                | Yes                               |
| Azure Region support              | Limited                                           | Extensive                         |
| Azure Sovereign Cloud support     | No                                                | Yes (coming soon)                 |
| Hostname DNS suffix               | `<name>.<region>.redisenterprise.cache.azure.net` | `<name>.<region>.redis.azure.net` |

\* When **High availability** is enabled, Azure Managed Redis is zone redundant in regions with multiple availability zones. For more information, see [Reliability in Azure Managed Redis](/azure/reliability/reliability-managed-redis).

## Considerations when you move from Enterprise to Azure Managed Redis

Azure Managed Redis uses the same software stack as Azure Cache for Redis Enterprise, so your existing applications using Enterprise tier don't need many changes. The significant exception is the need to change connection credentials.

### Different hostname and suffix

While the core software for Azure Cache for Redis Enterprise and Azure Managed Redis is similar, the DNS suffix for your Redis cluster hostname is different. When you move to Azure Managed Redis, your application needs to change the Redis cluster hostname. If you use access keys for connecting to your cache, you must also update access key that it uses to connect to the cache.

> [!IMPORTANT]
> Consider updating the code that connects to the cache. Instead of using access keys, use Microsoft Entra ID. We recommend using Microsoft Entra ID instead of access keys.

## Choosing the right Azure Managed Redis size and SKU

Azure Managed Redis offers many memory sizes and three performance tiers. You can read more information about memory sizes and performance tiers here [Choosing the right tier](../overview.md#choosing-the-right-tier).

### Identify memory size of existing Azure Cache for Redis Enterprise instance

Azure Cache for Redis Enterprise instances can be scaled out to provide both more memory and more compute resources, so it's important to note the scale-out factor for your cache. Scaling out is also related to capacity, which is essentially the number of virtual machines running for your cluster.

To choose the right Azure Managed Redis memory size: 

1. Go to the Azure portal, and select **Overview** from the resource menu. 
1. Check the **Status** field in the **Overview** of your Enterprise instance.
    The **Status** field shows the memory size of your Redis Enterprise instance.

Let's look at a possible scenario. 

:::image type="content" source="../media/migrate-overview/enterprise-overview-resource.png" alt-text="Screenshot of the overview of an Enterprise cache." lightbox="../media/migrate-overview/enterprise-overview-resource.png":::

Looking at the **Status** on **Overview** pane, you see **Running - Enterprise 8GB (2 x 4GB)**. This notation means the cache is currently using a E5 Enterprise SKU with a scale of 2, yielding an 8-GB cache. Therefore, you should start with at least 10GB cache on Azure Managed Redis. 

In this case, use any of the tiers that offer 12 GB of memory.

| SKU     |    Tier           |
|---------|-------------------|
| M10     | Memory Optimized  |
| B10     | Balanced          |
| X10     | Compute Optimized |


### Identify performance tier

You should also consider if your workload is memory intensive or compute intensive. If your current Enterprise instance is more likely to run out of memory before CPU, then your workload is memory-intensive. Consider choosing from the **Memory Optimized** performance tier.

If your workload throughput intensive or has too much latency, then your workload is compute intensive. Consider choosing from **Compute Optimized** performance tier.

If you're unsure, you can start with the **Balanced** performance tier because it offers a healthy mix of memory and performance.

If you're currently using Redis Enterprise Flash tier, then you should choose the Flash Optimized tier.

### Create a new Azure Managed Redis instance

After you choose the memory and performance tier for your new Azure Managed Redis instance, you can create the new Azure Managed Redis instance. For more information on creating a cache, see [Quickstart: Create an Azure Managed Redis Instance](../quickstart-create-managed-redis.md).

Next, you need to choose a strategy for moving your data. And finally, you need to update your application to use the new cache.

#### Update app to connect to Azure Managed Redis instance

Once you create a new Azure Managed Redis instance, you must change the Redis endpoint/hostname and the access key in your application to point to your new Azure Managed Redis instance. We recommend publishing this endpoint change during off-business hours because it results in connectivity a blip.

> [!NOTE]
> If you connect to your existing Redis Enterprise instance through a private endpoint, ensure that your new Azure Managed Redis cache is also peered to the virtual network of your application. The new cache must have a similar set-up as existing Redis Enterprise instance.

Verify that your application is running as expected and then delete your previous Redis Enterprise instance.

## Moving your data from your Enterprise cache to a new Azure Managed Redis cache

When migrating to Azure Managed Redis instance, you need to consider the best way to move your data from the existing Redis Enterprise instance to your new Azure Managed Redis instance. If your application can tolerate data loss, or has other mechanisms to rehydrate the cache without negative effects, then you skip this step and proceed to the next steps.

If your application needs to ensure that data is also migrated to the new Azure Managed Redis instance, choose one of the following options:

### Data Export and Import using an RDB File

- Pros: Preserves data snapshot.
- Cons: Risk of data loss if writes occur after snapshot.

Here's the basic export/import procedure:

1. Export RDB from existing Redis Enterprise cache to your Azure Storage account.
1. Import data from Azure Storage account into a new Azure Managed Redis cache.
1. Read more about data export/import here [Import and Export data in Azure Managed Redis](../how-to-import-export-data.md).

### Dual-Write Strategy

- Pros: Zero downtime, safe transition.
- Cons: Requires temporary dual-cache setup.

Here's the basic dual-write procedure: 

1. Modify your application to write to existing both the Azure Cache for Redis Enterprise cache and new Azure Managed Redis cache.
1. Continue reading and writing from Redis Enterprise cache.
1. After sufficient data sync, switch reads to Azure Managed Redis and delete Redis Enterprise instance

### Programmatic Migration using RIOT-X

RIOT-X provides a way to migrate your content from Enterprise to Azure Managed Redis. For more information, see [Data Migration with RIOT-X for Azure Managed Redis](https://techcommunity.microsoft.com/blog/azure-managed-redis/data-migration-with-riot-x-for-azure-managed-redis/4404672).

- Pros: Full control, customizable.
- Cons: Requires development effort.

## Benefits of moving from Basic, Standard, or Premium caches to Azure Managed Redis

If you use any of the OSS SKUs, Basic, Standard, or Premium, moving to Azure Managed Redis offers you more features at every level cache.

Here's a table that compares the features from Azure Cache for Redis to the features in Azure Managed Redis

| Feature Description               | Basic<br>_OSS_ | Standard<br>_OSS_ | Premium<br>_OSS_ | Balanced<br>_AMR_                | Memory Optimized<br>_AMR_        | Compute Optimized<br>_AMR_       |
|-----------------------------------|:--------------:|:-----------------:|:----------------:|:--------------------------------:|:--------------------------------:|:--------------------------------:|
| Availability                      | N/A            | 99.9%             | 99.9%            | Up to 99.999%                    | Up to 99.999%                    | Up to 99.999%                    |
| Data encryption in transit        | Yes            | Yes               | Yes              | Yes                              | Yes                              | Yes                              |
| Network isolation                 | Yes            | Yes               | Yes              | Yes                              | Yes                              | Yes                              |
| Scaling up/out                    | Yes            | Yes               | Yes              | Yes                              | Yes                              | Yes                              |
| Scaling down/in                   | Yes            | Yes               | Yes              | No                               | No                               | No                               |
| OSS clustering                    | No             | No                | Yes              | Yes                              | Yes                              | Yes                              |
| Data persistence                  | No             | No                | Yes              | Yes                              | Yes                              | Yes                              |
| Zone redundancy                   | No             | Yes (preview)     | Yes              | \*Yes with high availability     | \*Yes with high availability     | \*Yes with high availability     |
| Geo-replication                   | No             | No                | Yes (Passive)    | Yes (Active)                     | Yes (active)                     | Yes (active)                     |
| Connection audit logs             | No             | No                | Yes              | Yes(Event-based)                 | Yes(Event-based)                 | Yes(Event-based)                 |
| Redis Modules                     | No             | No                | No               | Yes                              | Yes                              | Yes                              |
| Import/Export                     | No             | No                | Yes              | Yes                              | Yes                              | Yes                              |
| Reboot                            | Yes            | Yes               | Yes              | No                               | No                               | No                               |
| Scheduled updates                 | Yes            | Yes               | Yes              | No                               | No                               | No                               |
| Microsoft Entra ID authentication | Yes            | Yes               | Yes              | Yes                              | Yes                              | Yes                              |
| Microsoft Entra ID RBAC           | Yes            | Yes               | Yes              | No                               | No                               | No                               |
| Keyspace notification             | Yes            | Yes               | Yes              | No                               | No                               | No                               |
| Non High-availability             | N/A            | No                | No               | Yes                              | Yes                              | Yes                              |

_OSS_ refers to Azure Cache for Redis<br>
_AMR_ refers to Azure Managed Redis

\* When **High availability** is enabled, Azure Managed Redis is zone redundant in regions with multiple Availability Zones.


Here are some other differences to consider when implementing Azure Managed Redis. Consider these client application changes:

| Feature Description              | Azure Cache for Redis      | Azure Managed Redis                           |
|:---------------------------------|:---------------------------|:----------------------------------------------|
| DNS suffix (only for PROD cloud) | `.redis.cache.windows.net` | `<region>.redis.azure.net`                    |
| TLS port                         | 6380                       | 10000                                         |
| Non-TLS port                     | 6379                       | Not supported                                 |
| Individual node TLS ports        | 13XXX                      | 85xx                                          |
| Individual node non-TLS port     | 15XXX                      | Not supported                                 |
| Clustering support               | OSS clustering mode        | OSS and Enterprise cluster modes              |
| Unsupported commands             | Unsupported commands       | Multi-key commands                            |
| Regional availability            | All Azure regions          | * See the list of regions after this section. |
| Redis version                    | 6                          | 7.4                                           |
| Supported TLS versions           | 1.2 and 1.3                | 1.2 and 1.3                                   |


### Migrate your Basic, Standard, or Premium cache to Azure Managed Redis

Based on the table, here are some mappings between the Azure Cache for Redis SKUs and options for caches in Azure Managed Redis.

> [!NOTE]
> Use non High Availability option of Azure Managed Redis for Migrating Basic SKUs

| Azure Cache for Redis | Azure Managed Redis      | Additional memory (%) |
|:-----------------------|:------------------------|---------------------:|
| Basic/Standard - C0   | Balanced - B0            | 50                    |
| Basic/Standard - C1   | Balanced - B1            | 0                     |
| Basic/Standard - C2   | Balanced - B3            | 17                    |
| Basic/Standard - C3   | Balanced - B5            | 0                     |
| Basic/Standard - C4   | Memory Optimized – M10*  | -8                    |
| Basic/Standard – C4   | Memory Optimized – M20** | 46                    |
| Basic/Standard - C5   | Memory Optimized – M20*  | -8                    |
| Basic/Standard – C5   | Memory Optimized – M50** | 57                    |
| Basic/Standard - C6   | Memory Optimized - M50   | 12                    |
| Premium - P1          | Balanced - B5            | 0                     |
| Premium - P2          | Balanced - B10*          | -8                    |
| Premium - P2          | Balanced - B20**         | 46                    |
| Premium - P3          | Balanced - B20*          | -8                    |
| Premium - P3          | Balanced - B50**         | 57                    |
| Premium - P4          | Balanced - B50           | 12                    |
| Premium - P5          | Balanced - B100          | 0                     |

- \* This option is for cost efficiency. Ensure the peak of total used memory in the past month is less than the suggested Azure Managed Redis memory to choose this option.
- \*\* This option is for abundant memory consumption.

#### Azure Cache for Redis Premium clustered

- For sharded cluster, choose a Memory Optimized tier that has equivalent total memory.
- For clusters with more than one read replica, choose a Compute Optimized tier with equivalent total memory as the primary replica.
 
### Migration options

Client applications should be able to use an Azure Managed Redis instance that has different clustering modes and endpoints. Azure Cache for Redis and Azure Managed Redis are compatible so no application code changes other than connection configurations are required for most scenarios.

Learn more at:

- [Scale an Azure Managed Redis instance](../how-to-scale.md)

#### Options for Migrating Azure Cache for Redis to Azure Managed Redis

| Option                              | Advantages                                                                                                 | Disadvantages                                                                                      |
|-------------------------------------|------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Create a new cache                  | Simplest to implement.                                                                                     | Need to repopulate data to the new cache, which might not work with many applications.             |
| Export and import data via RDB file | Compatible with any Redis cache generally.                                                                 | Some data could be lost, if they're written to the existing cache after the RDB file is generated. |
| Dual-write data to two caches       | No data loss or downtime. Uninterrupted operations of the existing cache. Easier testing of the new cache. | Needs two caches for an extended period of time.                                                   |
| Migrate data programmatically       | Full control over how data are moved.                                                                      | Requires custom code.                                                                              |

#### Create a new Azure Managed Redis Instance

This approach technically isn't a migration. If losing data isn't a concern, the easiest way to move to Azure Managed Redis tier is to create a new cache instance and connect your application to it. For example, if you use Redis as a look-aside cache of database records, you can easily rebuild the cache from scratch.
General steps to implement this option are:

1. Create a new Azure Managed Redis instance.
1. Update your application to use the new instance.
1. Delete the old Azure Cache for Redis instance.

#### Export data to an RDB file and import it into Azure Managed Redis

This option is applicable only to premium tier caches. Open-source Redis defines a standard mechanism for taking a snapshot of a cache's in-memory dataset and saving it to a file. Another Redis cache can read the RDB file that was exported. [Azure Cache for Redis premium tier](../../azure-cache-for-redis/cache-overview.md#service-tiers)  supports exporting data from a cache instance via RDB files. You can use an RDB file to transfer data from an existing Azure Cache for Redis instance to Azure Managed Redis instance.

General steps to implement this option are:

1. Create a new Azure Managed Redis instance that is the same size (or bigger than) the existing Azure Cache for Redis instance.
1. Export the RDB file from existing Azure Cache for Redis instance using these [export instructions](../../azure-cache-for-redis/cache-how-to-import-export-data.md#export) or the [PowerShell Export cmdlet](/powershell/module/az.rediscache/export-azrediscache)
1. Import the RDB file into new Azure Managed Redis instance using these import instructions or the PowerShell Import cmdlet
1. Update your application to use the new Azure Managed Redis instance connection string.

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
1. Create a new Azure Managed Redis instance.
1. Flush data from the new cache to ensure that it's empty. This step is required because the copy tool itself doesn't overwrite any existing key in the target cache.
 Important: Make sure to NOT flush from the source cache.
1. Use an application such as the open-source tool mentioned previously to automate the copying of data from the source cache to the target. Remember that the copy process could take a while to complete depending on the size of your dataset.
 
## Regional availability for Azure Managed Redis

Azure Managed Redis is continually expanding into new regions. To check the availability by region, see [Products available by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

## Related content

- [What is Azure Managed Redis?](../overview.md)
- [Azure Managed Redis architecture](../architecture.md)

