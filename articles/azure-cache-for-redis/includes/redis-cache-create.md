---
title: "include file"
description: "include file"
services: redis-cache
author: flang-msft
ms.service: cache
ms.topic: "include"
ms.date: 05/07/2024
ms.author: franlanglois
ms.custom: "include file"
---

1. To create a cache, sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource**.

    :::image type="content" source="media/redis-cache-create/create-resource.png" alt-text="Create a resource is highlighted in the left navigation pane.":::

1. On the **Get Started** page, type _Azure Cache for Redis_ in the search box. Then, select **Create**.

    :::image type="content" source="media/redis-cache-create/select-cache.png" alt-text="Screenshot of the Azure Marketplace with Azure Cache for Redis in the search box and create is highlighted with a red box.":::

1. On the **New Redis Cache** page, configure the settings for your cache.

   | Setting      | Choose a value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Subscription** | Drop down and select your subscription. | The subscription under which to create this new Azure Cache for Redis instance. |
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your cache and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. |
   | **DNS name** | Enter a unique name. | The cache name must be a string between 1 and 63 characters that contain only numbers, letters, or hyphens. The name must start and end with a number or letter, and can't contain consecutive hyphens. Your cache instance's *host name* is *\<DNS name>.redis.cache.windows.net*. |
   | **Location** | Drop down and select a location. | Select a [region](https://azure.microsoft.com/regions/) near other services that use your cache. |
   | **Cache SKU** | Drop down and select a [**SKU**](https://azure.microsoft.com/pricing/details/cache/). |  The SKU determines the size, performance, and features parameters that are available for the cache. For more information, see [Azure Cache for Redis Overview](../cache-overview.md). |
   | **Cache size** | Drop down and select a size of your cache |  For more information, see [Azure Cache for Redis Overview](../cache-overview.md). |

1. Select the **Networking** tab or select the **Networking** button at the bottom of the page.

1. In the **Networking** tab, select your connectivity method.

1. Select the **Next: Advanced** tab or select the **Next: Advanced** button on the bottom of the page to see the **Advanced** tab.

      :::image type="content" source="media/redis-cache-create/cache-redis-version.png" alt-text="Screenshot showing the Advanced tab in the working pane and the available option to select.":::

   - For Basic or Standard caches, toggle the selection for a non-TLS port. You can also select if you want to enable **Microsoft Entra Authentication**.
   - For a Premium cache, configure the settings for non-TLS port, clustering, managed identity, and data persistence. You can also select if you want to enable **Microsoft Entra Authentication**.

1. Select the **Next: Tags** tab or select the **Next: Tags** button at the bottom of the page.

1. Optionally, in the **Tags** tab, enter the name and value if you wish to categorize the resource.

1. Select **Review + create**. You're taken to the Review + create tab where Azure validates your configuration.

1. After the green Validation passed message appears, select **Create**.

It takes a while for a cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.
