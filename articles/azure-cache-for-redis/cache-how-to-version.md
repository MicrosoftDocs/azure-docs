---
title: Set Redis version for Azure Cache for Redis
description: Learn how to configure Redis version
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 10/07/2021
---

# Set Redis version for Azure Cache for Redis
In this article, you'll learn how to configure the Redis software version to be used with your cache instance. Azure Cache for Redis offers the latest major version of Redis and at least one previous version. It will update these versions regularly as newer Redis software is released. You can choose between the two available versions. Keep in mind that your cache will be upgraded to the next version automatically if the  version it's using currently is no longer supported.

> [!NOTE]
> At this time, Redis 6 does not support ACL, and geo-replication between a Redis 4 and 6 cache.
>

## Prerequisites
* Azure subscription - [create one for free](https://azure.microsoft.com/free/)

## Create a cache using the Azure portal
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


## Create a cache using Azure PowerShell

```azurepowershell
    New-AzRedisCache -ResourceGroupName "ResourceGroupName" -Name "CacheName" -Location "West US 2" -Size 250MB -Sku "Standard" -RedisVersion "6"
```
For more information on how to manage Azure Cache for Redis with Azure PowerShell, see [here](cache-how-to-manage-redis-cache-powershell.md)

## Create a cache using Azure CLI

```azurecli-interactive
az redis create --resource-group resourceGroupName --name cacheName --location westus2 --sku Standard --vm-size c0 --redisVersion="6"
```
For more information on how to manage Azure Cache for Redis with Azure CLI, see [here](cli-samples.md)

## Upgrade an existing Redis 4 cache to Redis 6
Azure Cache for Redis supports upgrading your Redis cache server major version from Redis 4 to Redis 6. Please note that upgrading is permanent and it may cause a brief connection blip. As a precautionary step, we recommend exporting the data from your existing Redis 4 cache and testing your client application with a Redis 6 cache in a lower environment before upgrading. Please see [here](cache-how-to-import-export-data.md) for details on how to export.

> [!NOTE]
> Please note, upgrading is not supported on a cache with a geo-replication link, so you will have to manually unlink your cache instances before upgrading. 
>

To upgrade your cache, follow these steps:

1. In the Azure portal, search for **Azure Cache for Redis**. Then, press enter or select it from the search suggestions.

    :::image type="content" source="media/cache-private-link/4-search-for-cache.png" alt-text="Search for Azure Cache for Redis.":::

1. Select the cache instance you want to upgrade from Redis 4 to Redis 6.

1. On the left side of the screen, select **Advanced setting**. 

1. If your cache instance is eligible to be upgraded, you should see the following blue banner. If you wish to proceed, select the text in the banner.

    :::image type="content" source="media/cache-how-to-version/blue-banner-upgrade-cache.png" alt-text="Blue banner that says you can upgrade your Redis 6 cache with additional features and commands that enhance developer productivity and ease of use. Upgrading your cache instance cannot be reversed.":::
    
1. A dialog box will then popup notifying you that upgrading is permanent and may cause a brief connection blip. Select yes if you would like to upgrade your cache instance.

    :::image type="content" source="media/cache-how-to-version/dialog-version-upgrade.png" alt-text="Dialog with more information about upgrading your cache.":::

1. To check on the status of the upgrade, navigate to **Overview**.

    :::image type="content" source="media/cache-how-to-version/upgrade-status.png" alt-text="Overview shows status of cache being upgraded.":::

## FAQ

### What features aren't supported with Redis 6?

At this time, Redis 6 does not support ACL, and geo-replication between a Redis 4 and 6 cache.

### Can I change the version of my cache after it's created?

You can upgrade your existing Redis 4 caches to Redis 6, please see [here](#upgrade-an-existing-redis-4-cache-to-redis-6) for details. Please note upgrading your cache instance is permanent and you cannot downgrade your Redis 6 caches to Redis 4 caches.

## Next Steps

- To learn more about Redis 6 features, see [Diving Into Redis 6.0 by Redis](https://redis.com/blog/diving-into-redis-6/)
- To learn more about Azure Cache for Redis features:

> [!div class="nextstepaction"]
> [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
