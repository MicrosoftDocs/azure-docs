---
title: Set Redis version for Azure Cache for Redis (Preview)
description: Learn how to configure Redis version
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: conceptual
ms.date: 09/30/2020
---

# Set Redis version for Azure Cache for Redis (Preview)
In this article, you'll learn how to configure the Redis software version to be used with your cache instance. Azure Cache for Redis offers the latest major version of Redis and at least one previous version. It will update these versions regularly as newer Redis software is released. You can choose between the two available versions. Keep in mind that your cache will be upgraded to the next version automatically if the  version it's using currently is no longer supported.

> [!NOTE]
> Redis 6 is currently in preview. At this time, Redis 6 does not support clustering, zone redundancy, ACL, PowerShell, Azure CLI, Terraform, and geo-replication between a Redis 4.0 and 6.0 cache. The Redis version also cannot be changed once a cache is created. 
>

> [!IMPORTANT]
> Once Redis 6.0 is generally available (GA), Redis 6.0 will be the default Redis version for new caches. You will still have the option to create Redis 4.0 caches. 
>

## Prerequisites
* Azure subscription - [create one for free](https://azure.microsoft.com/free/)

## Create a cache
To create a cache, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource**.
  
1. On the **New** page, select **Databases** and then select **Azure Cache for Redis**.

    :::image type="content" source="media/cache-create/new-cache-menu.png" alt-text="Select Azure Cache for Redis.":::
   
1. On the **Basics** page, configure the settings for your new cache.
   
    | Setting      | Suggested value  | Description |
    | ------------ |  ------- | -------------------------------------------------- |
    | **Subscription** | Select your subscription. | The subscription under which to create this new Azure Cache for Redis instance. | 
    | **Resource group** | Select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your cache and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. | 
    | **DNS name** | Enter a globally unique name. | The cache name must be a string between 1 and 63 characters that contains only numbers, letters, or hyphens. The name must start and end with a number or letter, and can't contain consecutive hyphens. Your cache instance's *host name* will be *\<DNS name>.redis.cache.windows.net*. | 
    | **Location** | Select a location. | Select a [region](https://azure.microsoft.com/regions/) near other services that will use your cache. |
    | **Cache type** | Select a [cache tier and size](https://azure.microsoft.com/pricing/details/cache/). |  The pricing tier determines the size, performance, and features that are available for the cache. For more information, see [Azure Cache for Redis Overview](cache-overview.md). |
   
1. On the **Advanced** page, choose a Redis version to use.
   
    :::image type="content" source="media/cache-how-to-version/select-redis-version.png" alt-text="Redis version.":::

1. Select **Create**. 
   
    It takes a while for the cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.

    > [!NOTE]
    > At this time, the Redis version can't be changed once a cache is created.
    >

## FAQ

### What features aren't supported with Redis 6?

Currently, Redis 6 does not support clustering, zone redundancy, ACL, PowerShell, Azure CLI, Terraform, and geo-replication between a Redis 4.0 and 6.0 cache. 

### Can I change the version of my cache after it's created?

Currently, you cannot change the version of your cache once it's created.

## Next Steps
Learn more about Azure Cache for Redis features.

> [!div class="nextstepaction"]
> [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
