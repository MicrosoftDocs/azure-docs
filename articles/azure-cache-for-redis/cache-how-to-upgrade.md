---
title: How to upgrade the Redis version of Azure Cache for Redis
description: Learn how to upgrade the version of Azure Cache for Redis
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: how-to
ms.date: 09/04/2022
ms.custom: template-how-to 
---

# How to upgrade an existing Redis 4 cache to Redis 6

Azure Cache for Redis supports upgrading the version of your Azure Cache for Redis from Redis 4 to Redis 6. Upgrading is permanent, and it might cause a brief connection issue similar to regular monthly maintenance. As a precautionary step, we recommend exporting the data from your existing Redis 4 cache and testing your client application with a Redis 6 cache in a lower environment before upgrading.

For more information, see [here](cache-how-to-import-export-data.md) for details on how to export.

> [!NOTE]
> Please note, upgrading is not supported on a cache with a geo-replication link. You must manually unlink your cache instances before upgrading.
>

## How to check the version of a cache

You can check the Redis version of a cache by selecting **Properties** from the Resource menu of the Azure Cache for Redis.

:::image type="content" source="media/cache-how-to-upgrade/cache-version-portal.png" alt-text="Screenshot of properties selected in the Resource menu.":::

### Limitations

- Upgrading a basic cache will result in brief unavailability and data loss.
- Upgrading on geo-replicated cache is not supported. You will have to manually unlink the cache instances before upgrading.
- Upgrading a cache with a dependency on Cloud Services is not supported. You should migrate your cache instance to virtual machine scale set before upgrading.For more information, see [Caches with a dependency on Cloud Services (classic)](/azure/azure-cache-for-redis/cache-faq) for details on cloud services hosted caches.

## Upgrade using the Azure portal

1. In the Azure portal, search for **Azure Cache for Redis**. Then, press enter or select it from the search suggestions.

    :::image type="content" source="media/cache-private-link/4-search-for-cache.png" alt-text="Screenshot showing a search for Azure Cache for Redis.":::

1. Select the cache instance you want to upgrade from Redis 4 to Redis 6.

1. On the left side of the screen, select **Advanced settings**.

1. If your cache instance is eligible to be upgraded, you should see the following blue banner. If you want to proceed, select the text in the banner.

    :::image type="content" source="media/cache-how-to-upgrade/blue-banner-upgrade-cache.png" alt-text="Screenshot showing a Blue banner that says you can upgrade your Redis 6 cache with additional features and commands that enhance developer productivity and ease of use. Upgrading your cache instance cannot be reversed.":::

1. A dialog box displays a popup notifying you that upgrading is permanent and might cause a brief connection issue. Select **Yes** if you would like to upgrade your cache instance.

    :::image type="content" source="media/cache-how-to-upgrade/dialog-version-upgrade.png" alt-text="Screenshot showing a dialog with more information about upgrading your cache.":::

1. To check on the status of the upgrade, navigate to **Overview**.

    :::image type="content" source="media/cache-how-to-upgrade/upgrade-status.png" alt-text="Overview shows status of cache being upgraded.":::

## Upgrade using Azure CLI

To upgrade a cache from 4 to 6 using the Azure CLI, use the following command:

```azurecli-interactive
az redis update --name cacheName --resource-group resourceGroupName --set redisVersion=6
```

## Upgrade using PowerShell

To upgrade a cache from 4 to 6 using PowerShell, use the following command:

```powershell-interactive
Set-AzRedisCache -Name "CacheName" -ResourceGroupName "ResourceGroupName" -RedisVersion "6"
```

## Next steps
- To learn more about Azure Cache for Redis versions, see [How to upgrade an existing Redis 4 cache to Redis 6](cache-how-to-upgrade.md)
- To learn more about Redis 6 features, see [Diving Into Redis 6.0 by Redis](https://redis.com/blog/diving-into-redis-6/)
- To learn more about Azure Cache for Redis features: [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
