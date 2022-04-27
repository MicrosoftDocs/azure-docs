---
title: 'Quickstart: Create a Redis Enterprise cache'
description: In this quickstart, learn how to create an instance of Azure Cache for Redis in Enterprise tiers
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.custom: mvc, mode-other
ms.topic: quickstart
ms.date: 04/12/2022

---
# Quickstart: Create a Redis Enterprise cache

The Azure Cache for Redis Enterprise tiers provide fully integrated and managed [Redis Enterprise](https://redislabs.com/redis-enterprise/) on Azure. These new tiers are:

* Enterprise, which uses volatile memory (DRAM) on a virtual machine to store data
* Enterprise Flash, which uses both volatile and non-volatile memory (NVMe or SSD) to store data.

Both Enterprise and Enterprise Flash support open-source Redis 6 and some new features that aren't yet available in the Basic, Standard, or Premium tiers. The supported features include some Redis modules that enable other features like search, bloom filters, and time series.  

## Prerequisites

You'll need an Azure subscription before you begin. If you don't have one, create an [account](https://azure.microsoft.com/). For more information, see [special considerations for Enterprise tiers](cache-overview.md#special-considerations-for-enterprise-tiers).

### Availability by region

Azure Cache for Redis is continually expanding into new regions. To check the availability by region for all tiers, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=redis-cache&regions=all).

## Create a cache

1. To create a cache, sign in to the Azure portal and select **Create a resource**.

1. On the **New** page, select **Databases** and then select **Azure Cache for Redis**.

   :::image type="content" source="media/cache-create/new-cache-menu.png" alt-text="Select Azure Cache for Redis":::

1. On the **New Redis Cache** page, configure the settings for your new cache.

   | Setting      |  Choose a value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Subscription** | Drop down and select your subscription. | The subscription under which to create this new Azure Cache for Redis instance. |
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your cache and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. |
   | **DNS name** | Enter a name that is unique in the region. | The cache name must be a string between 1 and 63 characters that contain only numbers, letters, or hyphens. The name must start and end with a number or letter, and can't contain consecutive hyphens. Your cache instance's *host name* will be *\<DNS name\>.\<Azure region\>.redisenterprise.cache.azure.net*. |
   | **Location** | Drop down and select a location. | Enterprise tiers are available in selected Azure regions. |
   | **Cache type** | Drop down and select an *Enterprise* or *Enterprise Flash* tier and a size. |  The tier determines the size, performance, and features that are available for the cache. |

   :::image type="content" source="media/cache-create/enterprise-tier-basics.png" alt-text="Enterprise tier Basics tab":::

   > [!IMPORTANT]
   > Be sure to select **Terms** before you proceed.
   >

1. Select **Next: Networking** and skip.

1. Select **Next: Advanced**.

   Enable **Non-TLS access only** if you plan to connect to the new cache without using TLS. Disabling TLS is **not** recommended, however.

   Set **Clustering policy** to **Enterprise** for a non-clustered cache. For more information on choosing **Clustering policy**, see [Clustering Policy](#clustering-policy).

   :::image type="content" source="media/cache-create/cache-clustering-policy.png" alt-text="Screenshot that shows the Enterprise tier Advanced tab.":::

   > [!NOTE]
   > Redis Enterprise supports two clustering policies. Use the **Enterprise** policy to access your cache using the regular Redis API. Use **OSS** to use the OSS Cluster API.
   >

   > [!NOTE]
   > You can't change modules after you create the cache instance. The setting is create-only.
   >

1. Select **Next: Tags** and skip.

1. Select **Next: Review + create**.

   :::image type="content" source="media/cache-create/enterprise-tier-summary.png" alt-text="Enterprise tier Review + Create tab":::

1. Review the settings and select **Create**.

   It takes some time for the cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.

## Clustering Policy

The OSS Cluster mode allows clients to communicate with Redis using the same Redis Cluster API as open-source Redis. This mode provides optimal latency and near-linear scalability improvements when scaling the cluster. Your client library must support clustering to use the OSS Cluster mode.

The Enterprise Cluster mode is a simpler configuration that exposes a single endpoint for client connections. This mode allows an application designed to use a standalone, or non-clustered, Redis server to seamlessly operate with a scalable, multi-node, Redis implementation. Enterprise Cluster mode abstracts the Redis Cluster implementation from the client by internally routing requests to the correct node in the cluster. Clients aren't required to support OSS Cluster mode.

## Next steps

In this quickstart, you learned how to create an Enterprise tier instance of Azure Cache for Redis.

> [!div class="nextstepaction"]
> [Create an ASP.NET web app that uses an Azure Cache for Redis.](./cache-web-app-howto.md)
