---
title: "include file"
description: "include file"
services: redis-cache
author: curib
ms.service: cache
ms.topic: "include"
ms.date: 10/06/2020
ms.author: cauribeg
ms.custom: "include file"
---

1. To create a cache, sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource**.

    :::image type="content" source="media/redis-cache-create/create-resource.png" alt-text="Select Azure Cache for Redis.":::

   
1. On the **New** page, select **Databases** and then select **Azure Cache for Redis**.

    :::image type="content" source="media/redis-cache-create/select-cache.png" alt-text="Select Azure Cache for Redis.":::
   
1. On the **New Redis Cache** page, configure the settings for your new cache.
   
   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **DNS name** | Enter a globally unique name. | The cache name must be a string between 1 and 63 characters that contains only numbers, letters, or hyphens. The name must start and end with a number or letter, and can't contain consecutive hyphens. Your cache instance's *host name* will be *\<DNS name>.redis.cache.windows.net*. | 
   | **Subscription** | Drop down and select your subscription. | The subscription under which to create this new Azure Cache for Redis instance. | 
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your cache and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. | 
   | **Location** | Drop down and select a location. | Select a [region](https://azure.microsoft.com/regions/) near other services that will use your cache. |
   | **Pricing tier** | Drop down and select a [Pricing tier](https://azure.microsoft.com/pricing/details/cache/). |  The pricing tier determines the size, performance, and features that are available for the cache. For more information, see [Azure Cache for Redis Overview](../articles/azure-cache-for-redis/cache-overview.md). |

1. Select the **Networking** tab or click the **Networking** button at the bottom of the page.

1. In the **Networking** tab, select your connectivity method.

1. Select the **Next: Advanced** tab or click the **Next: Advanced** button on the bottom of the page.

1. In the **Advanced** tab for a basic or standard cache instance, select the enable toggle if you want to enable a non-TLS port. You can also select which Redis version you would like use, either 4 or (PREVIEW) 6.

    :::image type="content" source="media/redis-cache-create/redis-version.png" alt-text="Redis version 4 or 6.":::

1. In the **Advanced** tab for premium cache instance, configure the settings for non-TLS port, clustering, and data persistence. You can also select which Redis version you would like use, either 4 or (PREVIEW) 6. 

1. Select the **Next: Tags** tab or click the **Next: Tags** button at the bottom of the page.

1. Optionally, in the **Tags** tab, enter the name and value if you wish to categorize the resource. 

1. Select **Review + create**. You're taken to the Review + create tab where Azure validates your configuration.

1. After the green Validation passed message appears, select **Create**.

It takes a while for the cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use. 