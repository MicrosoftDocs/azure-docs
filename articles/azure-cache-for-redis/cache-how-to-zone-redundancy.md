---
title: Enable zone redundancy for Azure Cache for Redis
description: Learn how to set up zone redundancy for your Premium and Enterprise tier Azure Cache for Redis instances



ms.topic: conceptual
ms.date: 11/15/2024

---

# Enable zone redundancy for Azure Cache for Redis

In this article, you learn how to configure a zone-redundant Azure Cache instance using the Azure portal.

Azure Cache for Redis Standard (preview), Premium, and Enterprise tiers provide built-in redundancy by hosting each cache on two dedicated virtual machines (VMs). Even though these VMs are located in separate [Azure fault and update domains](/azure/virtual-machines/availability) and highly available, they're susceptible to data center-level failures. Azure Cache for Redis also supports zone redundancy in its Standard (preview), Premium, and Enterprise tiers. A zone-redundant cache runs on VMs spread across multiple [Availability Zones](../reliability/availability-zones-overview.md). It provides higher resilience and availability.

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
    | **Location** | Select a location. | Select a [region](https://azure.microsoft.com/regions/) near other services that use your cache. |
    | **Cache type** | Select a [Premium or Enterprise tier](https://azure.microsoft.com/pricing/details/cache/) cache. |  The pricing tier determines the size, performance, and features that are available for the cache. For more information, see [Azure Cache for Redis Overview](cache-overview.md). |

1. For Standard or Premium tier cache, select **Advanced** in the Resource menu. In regions that support zones, Zone redundancy for these tiers can be enabled using couple of ways. (In regions that don't support zones, the option to enable zone redundancy is disabled.)
    1. Using [Automatic Zonal Allocation](#automatic-zonal-allocation):
        - **Allocate zones automatically** is the default option selected for **Availability Zones** for both the above tiers.
        - **Automatic Zonal Allocation** is the only option available for **Standard** tier caches with **Availability zones** setting and it isn't possible for the user to create non-zonal or manually select zones for Standard caches.
            :::image type="content" source="media/cache-how-to-zone-redundancy/create-standard-cache-default-as-az.png" alt-text="Screenshot showing the Advanced tab with a red box around Availability zones for Standard cache.":::
        - However, for **Premium** tier caches, **Availability zones** is an editable setting (the other available values are described below).
            :::image type="content" source="media/cache-how-to-zone-redundancy/create-premium-cache-default-as-az.png" alt-text="Screenshot showing the Advanced tab with a red box around Availability zones for Premium cache.":::
    1. Using **UserDefined Zonal Allocation**:
        - For **Premium** tier caches, **Availability zones** setting can be edited by the user, using which they can select non-zonal or manually select zones for the cache.
			- Selecting NoZones:
                :::image type="content" source="media/cache-how-to-zone-redundancy/create-premium-cache-as-non-az.png" alt-text="Screenshot showing the Advanced tab with a red box around Availability zones and its None option for Premium cache.":::
			- When choosing zones manually, the number of availability zones must always be less than or equal to the total number of nodes for the cache:
                 :::image type="content" source="media/cache-how-to-zone-redundancy/cache-premium-replica-count.png" alt-text="Screenshot showing Availability zones set to one and Replica count set to three.":::

1. For an Enterprise tier cache, select **Advanced** in the Resource menu. For **Zone redundancy**, select **Zone redundant (recommended)**.
:::image type="content" source="media/cache-how-to-zone-redundancy/cache-enterprise-create-zones.png" alt-text="Screenshot showing the Advanced tab with a red box around Zone redundancy.":::

1. Configure your settings for clustering and/or RDB persistence.  

   > [!NOTE]
   > Zone redundancy doesn't support Append-only File (AOF) persistence with multiple replicas (more than one replica).

1. Select **Create**.

    It takes a while for the cache to be created. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.

## Automatic Zonal Allocation

- Azure Cache for Redis automatically allocates zones to the cache on behalf of the user based on the number of nodes per shard and region's zonal support such that the cache is spread across multiple zones for high availability.
- With this type of allocation, users need not worry about choosing the zones manually for the cache and the capacity issues associated with the zones as Azure handle them.
- The actual zones that are allocated to the cache are abstracted from the user.
- The property which indicates the zonal allocation policy in REST API Spec for the cache is **zonalAllocationPolicy**, which can be sent in the request body and can be fetched from the response body while creating or updating the cache.
- The supported values for the property **zonalAllocationPolicy** are:
    1. **Automatic**
        - This value is selected as default option for Premium, Standard caches starting with 2024-11-01 API version if **zonalAllocationPolicy** isn't passed in the request in the regions that support zones.
        - Users can explicitly pass this value if they want to explicitly use **Automatic Zonal Allocation** for Standard, Premium caches and not want Azure to choose the value.
    1. **UserDefined**
        - This value can be passed in the request body for Premium caches while manually selecting the zones for the cache.
    1. **NoZones**
        - This value should be passed in the request body for Premium caches in order to create a non-zonal cache. Since for Standard caches, users can't explicitly choose for non zonal caches, this value can't be passed by user, and Azure will assign the zonalAllocationPolicy for Standard caches based on the region's zonal supportability and capacity.
        - This value is selected as default option for Premium, Standard caches if **zonalAllocationPolicy** isn't passed in the request in the regions that don't support zones.
- REST API spec for this feature can be found at: [ZonalAllocationPolicy (2024-11-01)](https://learn.microsoft.com/rest/api/redis/redis/create?view=rest-redis-2024-11-01&tabs=HTTP&preserve-view=true#zonalallocationpolicy)

    > [!IMPORTANT]
    > Automatic Zonal Allocation can't be modified once enabled for a cache.
    
    > [!IMPORTANT]
    > - Starting with 2024-11-01 API version, Automatic Zonal Allocation is chosen as default option for Premium, Standard caches. In rare cases, when sufficient zonal capacity is unavailable to at-least allocate two zones, and user does not pass **zonalAllocationPolicy** in the request, Azure will create a non-zonal cache which user can verify by checking the **zonalAllocationPolicy** property in the response.
    >    - Hence, it is recommended not to pass **zonalAllocationPolicy** in the request body while creating the cache as it will enable Azure to choose the best option among **Automatic**, **NoZones** for the cache based on the region's zonal supportability and capacity. Otherwise, users can pass **zonalAllocationPolicy** if they want to explicitly use a specific zonal allocation policy.
     
    > [!IMPORTANT]
    > Users can update their existing non-zonal or cache with manually selected zones to use Automatic Zonal Allocation by updating the cache with **zonalAllocationPolicy** set to **Automatic**. For more information regarding the update process, see [Migrate an Azure Cache for Redis instance to availability zone support](#can-i-update-my-existing-standard-or-premium-cache-to-use-zone-redundancy).

## Zone Redundancy FAQ

- [Why can't I enable zone redundancy when creating a Premium cache?](#why-cant-i-enable-zone-redundancy-when-creating-a-premium-cache)
- [Why can't I select all three zones during cache create?](#why-cant-i-select-all-three-zones-during-cache-create)
- [Can I update my existing Standard or Premium cache to use zone redundancy?](#can-i-update-my-existing-standard-or-premium-cache-to-use-zone-redundancy)
- [How much does it cost to replicate my data across Azure Availability Zones?](#how-much-does-it-cost-to-replicate-my-data-across-azure-availability-zones)

### Why can't I enable zone redundancy when creating a Premium cache?

Zone redundancy is available only in Azure regions that have Availability Zones. See [Azure regions with Availability Zones](../availability-zones/az-region.md#azure-regions-with-availability-zones) for the latest list.

### Why can't I select all three zones during cache create?

A Premium cache has one primary and one replica node by default. To configure zone redundancy for more than two Availability Zones, you need to add [more replicas](cache-how-to-multi-replicas.md) to the cache you're creating. The total number of availability zones must not exceed the combined count of nodes within the cache, including both the primary and replica nodes.

### Can I update my existing Standard or Premium cache to use zone redundancy?

- Yes, updating an existing Standard or Premium cache to use zone redundancy is supported. You can enable it by selecting **Allocate Zones automatically** from the **Advanced settings** on the Resource menu. You can't disable zone redundancy once you enable it.
- This can also be done by passing **zonalAllocationPolicy** as **Automatic** in the request body while updating the cache. For more information regarding the update process using REST API, see [ZonalAllocationPolicy (2024-11-01)](https://learn.microsoft.com/rest/api/redis/redis/update?view=rest-redis-2024-11-01&tabs=HTTP&preserve-view=true#zonalallocationpolicy).
    - Updating **zonalAllocationPolicy** to any other value than **Automatic** isn't supported.

  > [!IMPORTANT]
  > Automatic Zonal Allocation can't be modified once enabled for a cache.

  > [!IMPORTANT]
  > Enabling Automatic Zonal Allocation for an existing cache with a different zonal allocation is currently NOT supported for Geo Replicated caches or caches with VNet injection.

### How much does it cost to replicate my data across Azure Availability Zones?

When your cache uses zone redundancy configured with multiple Availability Zones, data is replicated from the primary cache node in one zone to the other nodes in another zone. The data transfer charge is the network egress cost of data moving across the selected Availability Zones. For more information, see [Bandwidth Pricing Details](https://azure.microsoft.com/pricing/details/bandwidth/).

## Next Steps

Learn more about Azure Cache for Redis features.

- [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)
