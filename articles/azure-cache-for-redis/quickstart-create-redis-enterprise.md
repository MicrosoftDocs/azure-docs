---
title: 'Quickstart: Create a Redis Enterprise cache'
description: Learn how to create an instance of Azure Cache for Redis to use in the Enterprise tier.

ms.custom: mvc, mode-other
ms.topic: quickstart
ms.date: 04/12/2023
#Customer intent: As a Redis Enterprise developer who is new to Azure Cache for Redis, I want to create a new cache in the Enterprise tier of Azure Cache for Redis.
---

# Quickstart: Create a Redis Enterprise cache

The Enterprise tiers for Azure Cache for Redis provide fully integrated and managed [Redis Enterprise](https://redislabs.com/redis-enterprise/) on Azure.

The Enterprise tiers include two tier options:

- **Enterprise**: This tier uses volatile memory (dynamic random access memory (DRAM)) on a virtual machine to store data.
- **Enterprise Flash**: This tier uses both volatile and nonvolatile memory (NVM Express (NVMe) or solid-state drive (SSD)) to store data.

Both Enterprise and Enterprise Flash support open-source Redis 6 and some new features that aren't yet available in the Basic, Standard, or Premium tiers. The supported features include some Redis modules that enable other features like search, bloom filters, and time series.  

## Prerequisites

- An Azure subscription. [Create one for free](https://azure.microsoft.com/free/). For more information, see [Special considerations for Enterprise tiers](cache-overview.md#special-considerations-for-enterprise-tiers).

### Availability by region

Azure Cache for Redis continually expands to new regions in Azure. To check the availability by region for all tiers, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=redis-cache&regions=all).

## Create a cache

1. To create a cache, sign in to the [Azure portal](https://portal.azure.com). On the portal menu, select **Create a resource**.

1. On the **New** pane, select **Databases**. In the search results, select **Azure Cache for Redis**.

   :::image type="content" source="media/cache-create/new-cache-menu.png" alt-text="Screenshot that highlights Azure Cache for Redis in search results on the New pane to create a new Azure resource.":::

1. On the **New Redis Cache** pane, on the **Basics** tab, configure the following settings for your cache:

   | Setting      |  Action  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Subscription** | Select your Azure subscription. | The subscription to use to create the new instance of Azure Cache for Redis. |
   | **Resource group** | Select a resource group, or select **Create new** and enter a new resource group name. | A name for the resource group in which to create your cache and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. |
   | **DNS name** | Enter a name that is unique in the Azure region. | The cache name must be a string of 1 to 63 characters that contains only numbers, letters, and hyphens. (If the cache name is fewer than 45 characters long, it should work in all currently available regions.) The name must start and end with a number or letter, and it can't contain consecutive hyphens. Your cache instance's _host name_ is  `\<DNS name\>.\<Azure region\>.redisenterprise.cache.azure.net`. |
   | **Location** | Select a location. | An [Azure region](https://azure.microsoft.com/regions/) that is near other services that use your cache. Enterprise tiers are available in selected Azure regions. |
   | **Cache type** | Select **Enterprise** or **Enterprise Flash** tier and a cache size. |  The tier determines the size, performance, and features that are available for your cache. |

   :::image type="content" source="media/cache-create/enterprise-tier-basics.png" alt-text="Screenshot that shows the Enterprise tier Basics tab on the New Redis Cache pane.":::

   > [!IMPORTANT]
   > Be sure to select the checkbox for **Terms** before you proceed.
   >

1. Select **Next: Networking** and skip.

1. Select **Next: Advanced**.

1. On the **Advanced** tab, configure these settings:

   1. Select the **Non-TLS access only** checkbox _only_ if you plan to connect to the new cache without using Transport Layer Security (TLS). We recommend that you don't disable TLS.

   1. For **Clustering Policy**, for a nonclustered cache, select **Enterprise**. For a clustered cache, select **OSS**.

      For more information about choosing the clustering policy to use for your cache, see [Clustering on Enterprise](cache-best-practices-enterprise-tiers.md#clustering-on-enterprise).

   :::image type="content" source="media/cache-create/cache-clustering-policy.png" alt-text="Screenshot that shows the Enterprise tier Advanced tab on the New Redis Cache pane.":::

   > [!IMPORTANT]
   > - The Enterprise tier and the Enterprise Flash tier are inherently clustered, in contrast to the Basic, Standard, and Premium tiers. Redis Enterprise offers two clustering policies:
   >
   >   - Use the **Enterprise** clustering policy to access your cache by using the Redis API.
   >   - Use the **OSS** clustering policy to use the OSS Cluster API.
   >
   >   For more information, see [Clustering on Enterprise](cache-best-practices-enterprise-tiers.md#clustering-on-enterprise).
   >
   > - You can't change the clustering policy of an Enterprise cache after you create it. If you use [RediSearch](cache-redis-modules.md#redisearch), the Enterprise clustering policy is required, and `NoEviction` is the only supported eviction policy.
   >
   > - If you use this cache in a geo-replication group, you can't change eviction policies after you create the cache. Be sure to know the eviction policies of your primary nodes before you create the cache.
   >
   >   For more information about active geo-replication, see [Active geo-replication prerequisites](cache-how-to-active-geo-replication.md#active-geo-replication-prerequisites).
   >
   > - You can't change modules after you create a cache. Modules must be enabled at the time you create your instance of Azure Cache for Redis. There is no option to enable the configuration of a module after you create a cache.
   >

1. Select **Next: Tags** (skip), and then select **Next: Review + create**.

   :::image type="content" source="media/cache-create/enterprise-tier-summary.png" alt-text="Screenshot that shows the Enterprise tier Review + create tab on the New Redis Cache pane.":::

1. On the **Review + create** tab, review the settings, and then select **Create**.

It takes some time for the cache deployment to finish. You can monitor progress on the Azure Cache for Redis Overview pane. When **Status** displays **Running**, the cache is ready to use.
  
## Related content

- [Create an ASP.NET web app that uses Azure Cache for Redis](cache-web-app-aspnet-core-howto.md)
- [Best practices for the Enterprise tiers](cache-best-practices-enterprise-tiers.md)
