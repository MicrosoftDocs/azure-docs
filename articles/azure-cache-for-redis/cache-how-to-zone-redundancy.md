---
title: Enable zone redundancy for Azure Cache for Redis
description: Learn how to set up zone redundancy for your Premium and Enterprise tier Azure Cache for Redis instances
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 06/07/2022

---

# Enable zone redundancy for Azure Cache for Redis

In this article, you'll learn how to configure a zone-redundant Azure Cache instance using the Azure portal.

Azure Cache for Redis Standard, Premium, and Enterprise tiers provide built-in redundancy by hosting each cache on two dedicated virtual machines (VMs). Even though these VMs are located in separate [Azure fault and update domains](../virtual-machines/availability.md) and highly available, they're susceptible to datacenter level failures. Azure Cache for Redis also supports zone redundancy in its Premium and Enterprise tiers. A zone-redundant cache runs on VMs spread across multiple [Availability Zones](../reliability/availability-zones-overview.md). It provides higher resilience and availability.

> [!NOTE]
> Data transfer between Azure Availability Zones will be charged at standard [bandwidth rates](https://azure.microsoft.com/pricing/details/bandwidth/).

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)

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
    | **Cache type** | Select a [Premium or Enterprise tier](https://azure.microsoft.com/pricing/details/cache/) cache. |  The pricing tier determines the size, performance, and features that are available for the cache. For more information, see [Azure Cache for Redis Overview](cache-overview.md). |

1. On the **Advanced** page, for a Premium tier cache, choose **Replica count**.

    :::image type="content" source="media/cache-how-to-multi-replicas/create-multi-replicas.png" alt-text="Replica count":::

1. Select **Availability zones**.

    :::image type="content" source="media/cache-how-to-zone-redundancy/create-zones.png" alt-text="Availability zones":::

1. Configure your settings for clustering and/or RDB persistence.  

   > [!NOTE]
   > Zone redundancy doesn't support Append-only File (AOF) persistence with multiple replicas (more than one replica).
   > Zone redundancy doesn't work with geo-replication currently.
   >

1. Select **Create**.

    It takes a while for the cache to be created. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.

    > [!NOTE]
    > Availability zones can't be changed or enabled after a cache is created.

## Zone Redundancy FAQ

- [Why can't I enable zone redundancy when creating a Premium cache?](#why-cant-i-enable-zone-redundancy-when-creating-a-premium-cache)
- [Why can't I select all three zones during cache create?](#why-cant-i-select-all-three-zones-during-cache-create)
- [Can I update my existing Premium cache to use zone redundancy?](#can-i-update-my-existing-premium-cache-to-use-zone-redundancy)
- [How much does it cost to replicate my data across Azure Availability Zones?](#how-much-does-it-cost-to-replicate-my-data-across-azure-availability-zones)

### Why can't I enable zone redundancy when creating a Premium cache?

Zone redundancy is available only in Azure regions that have Availability Zones. See [Azure regions with Availability Zones](../availability-zones/az-region.md#azure-regions-with-availability-zones) for the latest list.

### Why can't I select all three zones during cache create?

A Premium cache has one primary and one replica node by default. To configure zone redundancy for more than two Availability Zones, you need to add [more replicas](cache-how-to-multi-replicas.md) to the cache you're creating.

### Can I update my existing Premium cache to use zone redundancy?

No, updating an existing Premium cache to use zone redundancy isn't supported currently.

### How much does it cost to replicate my data across Azure Availability Zones?

When your cache uses zone redundancy configured with multiple Availability Zones, data is replicated from the primary cache node in one zone to the other node(s) in another zone(s). The data transfer charge is the network egress cost of data moving across the selected Availability Zones. For more information, see [Bandwidth Pricing Details](https://azure.microsoft.com/pricing/details/bandwidth/).

## Next Steps

Learn more about Azure Cache for Redis features.

- [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
