---
title: 'Quickstart: Create a Redis Enterprise cache'
description: In this quickstart, learn how to create an instance of Azure Cache for Redis in Enterprise tiers
author: yegu-ms

ms.author: yegu
ms.service: cache
ms.custom: mvc
ms.topic: quickstart
ms.date: 02/08/2021
#Customer intent: As a developer new to Azure Cache for Redis, I want to create an instance of Azure Cache for Redis Enterprise tier.
---
# Quickstart: Create a Redis Enterprise cache

Azure Cache for Redis' Enterprise tiers provide fully integrated and managed [Redis Enterprise](https://redislabs.com/redis-enterprise/) on Azure. These new tiers are:
* Enterprise, which uses volatile memory (DRAM) on a virtual machine to store data
* Enterprise Flash, which uses both volatile and non-volatile memory (NVMe or SSD) to store data.

## Prerequisites

You'll need an Azure subscription before you begin. If you don't have one, create an [account](https://azure.microsoft.com/). For more information, see [special considerations for Enterprise tiers](cache-overview.md#special-considerations-for-enterprise-tiers).

## Create a cache
1. To create a cache, sign in to the Azure portal and select **Create a resource**.

1. On the **New** page, select **Databases** and then select **Azure Cache for Redis**.
   
   :::image type="content" source="media/cache-create/new-cache-menu.png" alt-text="Select Azure Cache for Redis":::
   
1. On the **New Redis Cache** page, configure the settings for your new cache.
   
   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Subscription** | Drop down and select your subscription. | The subscription under which to create this new Azure Cache for Redis instance. | 
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your cache and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. | 
   | **DNS name** | Enter a globally unique name. | The cache name must be a string between 1 and 63 characters that contains only numbers, letters, or hyphens. The name must start and end with a number or letter, and can't contain consecutive hyphens. Your cache instance's *host name* will be *\<DNS name>.<Azure region>.redisenterprise.cache.azure.net*. | 
   | **Location** | Drop down and select a location. | Enterprise tiers are available in selected Azure regions. |
   | **Cache type** | Drop down and select an *Enterprise* or *Enterprise Flash* tier and a size. |  The tier determines the size, performance, and features that are available for the cache. |
   
   :::image type="content" source="media/cache-create/enterprise-tier-basics.png" alt-text="Enterprise tier Basics tab":::

   > [!NOTE] 
   > Be sure to check the box under "Terms" before proceeding.
   >

1. Select **Next: Networking** and skip.

1. Select **Next: Advanced** and set **Clustering policy** to **Enterprise**. Enable **Non-TLS access only** if you plan to connect to the new cache without using TLS. This is not recommended, however.

   :::image type="content" source="media/cache-create/enterprise-tier-advanced.png" alt-text="Enterprise tier Advanced tab":::

1. Select **Next: Tags** and skip.

1. Select **Next: Review + create**.

   :::image type="content" source="media/cache-create/enterprise-tier-summary.png" alt-text="Enterprise tier Review + Create tab":::

1. Review the settings and click **Create**.
   
   It takes some time for the cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.

## Next steps

In this quickstart, you learned how to create an Enterprise tier instance of Azure Cache for Redis.

> [!div class="nextstepaction"]
> [Create an ASP.NET web app that uses an Azure Cache for Redis.](./cache-web-app-howto.md)

