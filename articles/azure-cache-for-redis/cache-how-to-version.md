---
title: Set the Redis version of Azure Cache for Redis
description: Learn how to configure the version of Azure Cache for Redis
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.custom: devx-track-azurepowershell, devx-track-azurecli
ms.topic: how-to
ms.date: 06/02/2023
---

# Set Redis version for Azure Cache for Redis

In this article, you'll learn how to configure the Redis software version to be used with your cache instance. Azure Cache for Redis offers the latest major version of Redis and at least one previous version. It will update these versions regularly as newer Redis software is released. You can choose between the two available versions. Keep in mind that your cache will be upgraded to the next version automatically if the version it's using currently is no longer supported.

> [!NOTE]
> At this time, Redis 6 does not directly support Access Control Lists (ACL) but ACLs can be setup through [Active AD](cache-configure-role-based-access-control.md). For more information, seee to [Use Microsoft Entra ID for cache authentication](cache-azure-active-directory-for-authentication.md)
> Presently, Redis 6 does not support geo-replication between a Redis 4 cache and Redis 6 cache.
>

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)

## How to create a cache using the Azure portal

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

    It takes a while for the cache to be created. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.

## Create a cache using Azure PowerShell

To create a cache using PowerShell:

```azurepowershell
    New-AzRedisCache -ResourceGroupName "ResourceGroupName" -Name "CacheName" -Location "West US 2" -Size 250MB -Sku "Standard" -RedisVersion "6"
```

For more information on how to manage Azure Cache for Redis with Azure PowerShell, see [here](cache-how-to-manage-redis-cache-powershell.md)

## Create a cache using Azure CLI

To create a cache using Azure CLI:

```azurecli-interactive
az redis create --resource-group resourceGroupName --name cacheName --location westus2 --sku Standard --vm-size c0 --redisVersion="6"
```

For more information on how to manage Azure Cache for Redis with Azure CLI, see [here](cli-samples.md)

<!-- 
## Upgrade an existing Redis 4 cache to Redis 6

Azure Cache for Redis supports upgrading your Redis cache server major version from Redis 4 to Redis 6. Upgrading is permanent and it might cause a brief connection blip. As a precautionary step, we recommend exporting the data from your existing Redis 4 cache and testing your client application with a Redis 6 cache in a lower environment before upgrading. For more information, see [here](cache-how-to-import-export-data.md) for details on how to export.

> [!NOTE]
> Please note, upgrading is not supported on a cache with a geo-replication link, so you will have to manually unlink your cache instances before upgrading. 
>

To upgrade your cache, follow these steps:

### Upgrade using the Azure portal

1. In the Azure portal, search for **Azure Cache for Redis**. Then, press enter or select it from the search suggestions.

    :::image type="content" source="media/cache-private-link/4-search-for-cache.png" alt-text="Search for Azure Cache for Redis.":::

1. Select the cache instance you want to upgrade from Redis 4 to Redis 6.

1. On the left side of the screen, select **Advanced setting**. 

1. If your cache instance is eligible to be upgraded, you should see the following blue banner. If you wish to proceed, select the text in the banner.

    :::image type="content" source="media/cache-how-to-version/blue-banner-upgrade-cache.png" alt-text="Blue banner that says you can upgrade your Redis 6 cache with additional features and commands that enhance developer productivity and ease of use. Upgrading your cache instance cannot be reversed.":::

1. A dialog box displays a popup notifying you that upgrading is permanent and might cause a brief connection blip. Select **Yes** if you would like to upgrade your cache instance.

    :::image type="content" source="media/cache-how-to-version/dialog-version-upgrade.png" alt-text="Dialog with more information about upgrading your cache.":::

1. To check on the status of the upgrade, navigate to **Overview**.

    :::image type="content" source="media/cache-how-to-version/upgrade-status.png" alt-text="Overview shows status of cache being upgraded.":::

### Upgrade using Azure CLI

To upgrade a cache from 4 to 6 using the Azure CLI, use the following command:

```azurecli-interactive
az redis update --name cacheName --resource-group resourceGroupName --set redisVersion=6
```

### Upgrade using PowerShell

To upgrade a cache from 4 to 6 using PowerShell, use the following command:

```powershell-interactive
Set-AzRedisCache -Name "CacheName" -ResourceGroupName "ResourceGroupName" -RedisVersion "6"
```
 -->

## How to check the version of a cache

You can check the Redis version of a cache by selecting **Properties** from the Resource menu of the Azure Cache for Redis.

:::image type="content" source="media/cache-how-to-version/cache-version-portal.png" alt-text="Screenshot of properties selected in the Resource menu.":::

## FAQ

### What features aren't supported with Redis 6?

At this time, Redis 6 doesn't support Access Control Lists (ACL). Geo-replication between a Redis 4 cache and a Redis 6 cache is also not supported.

### Can I change the version of my cache after it's created?

You can upgrade your existing Redis 4 caches to Redis 6. Upgrading your cache instance is permanent and you can't downgrade your Redis 6 caches to Redis 4 caches.

For more information, see [How to upgrade an existing Redis 4 cache to Redis 6](cache-how-to-upgrade.md).

## Next Steps

- To learn more about upgrading your cache, see [How to upgrade an existing Redis 4 cache to Redis 6](cache-how-to-upgrade.md)
- To learn more about Redis 6 features, see [Diving Into Redis 6.0 by Redis](https://redis.com/blog/diving-into-redis-6/)
- To learn more about Azure Cache for Redis features: [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
