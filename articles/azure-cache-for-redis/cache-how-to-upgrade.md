---
title: How to upgrade the Redis version of Azure Cache for Redis
description: Learn how to upgrade the version of Azure Cache for Redis
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: how-to
ms.date: 08/17/2023
ms.custom: template-how-to, devx-track-azurecli
---


# How to upgrade an existing Redis 4 cache to Redis 6

Azure Cache for Redis supports upgrading the version of your Azure Cache for Redis from Redis 4 to Redis 6. Upgrading is similar to regular monthly maintenance. Upgrading follows the same pattern as maintenance: First, the Redis version on the replica node is updated, followed by an update to the primary node. Your client application should treat the upgrade operation exactly like a planned maintenance event.

As a precautionary step, we recommend exporting the data from your existing Redis 4 cache and testing your client application with a Redis 6 cache in a lower environment before upgrading.

For more information on how to export, see [Import and Export data in Azure Cache for Redis](cache-how-to-import-export-data.md).

> [!IMPORTANT]
> As announced in [What's new](cache-whats-new.md#upgrade-your-azure-cache-for-redis-instances-to-use-redis-version-6-by-june-30-2023), we'll retire version 4 for Azure Cache for Redis instances on June 30, 2023. Before that date, you need to upgrade any of your cache instances to version 6.
>
> For more information on the retirement of Redis 4, see [Retirements](cache-retired-features.md) and [Frequently asked questions](cache-retired-features.md#redis-4-retirement-questions)
>

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)

### Limitations

- When you upgrade a cache in the Basic tier, it's unavailable for several minutes and results in data loss.
- Upgrading on geo-replicated cache isn't supported. You must manually unlink the cache instances before upgrading.
- Upgrading a cache with a dependency on Cloud Services isn't supported. You should migrate your cache instance to Virtual Machine Scale Set before upgrading.
  - For more information, see [Caches with a dependency on Cloud Services (classic)](./cache-faq.yml) for details on cloud services hosted caches.
- When trying to upgrade to Redis 6, your VNet must be configured in accord with the requirements. Your upgrade might fail or the cache might not function properly after the upgrade if not configured correctly.
  - For more information on the VNet requirements, see [What are some common misconfiguration issues with Azure Cache for Redis and virtual networks](cache-how-to-premium-vnet.md#what-are-some-common-misconfiguration-issues-with-azure-cache-for-redis-and-virtual-networks).

### Check the version of a cache

Before you upgrade, check the Redis version of a cache by selecting **Properties** from the Resource menu of the Azure Cache for Redis. We recommend you use Redis 6.

:::image type="content" source="media/cache-how-to-upgrade/cache-version-portal.png" alt-text="Screenshot of properties selected in the Resource menu.":::

## Upgrade using the Azure portal

1. In the Azure portal, select the Azure Cache for Redis instance that you want to upgrade from Redis 4 to Redis 6.

1. On the left side of the screen, select **Advanced settings**.

1. If your cache instance is eligible to be upgraded, you should see the following blue banner. If you want to proceed, select the text in the banner.

    :::image type="content" source="media/cache-how-to-upgrade/blue-banner-upgrade-cache.png" alt-text="Screenshot informing you that you can upgrade your cache to Redis 6 with more features. Upgrading your cache instance can't be reversed.":::

1. A dialog box displays a popup notifying you that upgrading is permanent and might cause a brief connection blip. Select **Yes** if you would like to upgrade your cache instance.

    :::image type="content" source="media/cache-how-to-upgrade/dialog-version-upgrade.png" alt-text="Screenshot showing a dialog with more information about upgrading your cache with Yes selected.":::

1. To check on the status of the upgrade, navigate to **Overview**.

    :::image type="content" source="media/cache-how-to-upgrade/upgrade-status.png" alt-text="Screenshot showing Overview in the Resource menu. Status shows cache is being upgraded.":::

## Upgrade using Azure CLI

To upgrade a cache from 4 to 6 using the Azure CLI that is not using Private Endpoint, use the following command. 

```azurecli-interactive
az redis update --name cacheName --resource-group resourceGroupName --set redisVersion=6
```

### Private Endpoint

If Private Endpoint is enabled on the cache, use the command that is appropriate based on whether `PublicNetworkAccess` is enabled or disabled:

If `PublicNetworkAccess` is enabled:

```azurecli
 az redis update --name <cacheName> --resource-group <resourceGroupName> --set publicNetworkAccess=Enabled redisVersion=6
```

If `PublicNetworkAccess` is disabled:

```azurecli
az redis update --name <cacheName> --resource-group <resourceGroupName> --set publicNetworkAccess=Disabled redisVersion=6
```

## Upgrade using PowerShell

To upgrade a cache from 4 to 6 using PowerShell, use the following command:

```powershell-interactive
Set-AzRedisCache -Name "CacheName" -ResourceGroupName "ResourceGroupName" -RedisVersion "6"
```

## Next steps

- To learn more about Azure Cache for Redis versions, see [Set Redis version for Azure Cache for Redis](cache-how-to-version.md)
- To learn more about Redis 6 features, see [Diving Into Redis 6.0 by Redis](https://redis.com/blog/diving-into-redis-6/)
- To learn more about Azure Cache for Redis features: [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
