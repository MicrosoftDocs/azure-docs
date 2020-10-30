---
title: Enable zone redundancy for Azure Cache for Redis (Preview)
description: Learn how to set up zone redundancy for your Premium tier Azure Cache for Redis instances
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: conceptual
ms.date: 08/11/2020
---

# Enable zone redundancy for Azure Cache for Redis (Preview)
In this article, you'll learn how to configure a zone-redundant Azure Cache instance using the Azure portal.

Azure Cache for Redis Standard and Premium tiers provide built-in redundancy by hosting each cache on two dedicated virtual machines (VMs). Even though these VMs are located in separate [Azure fault and update domains](../virtual-machines/manage-availability.md) and highly available, they're susceptible to datacenter level failures. Azure Cache for Redis also supports zone redundancy in its Premium tier. A zone-redundant cache runs on VMs spread across multiple [availability zones](../virtual-machines/manage-availability.md#use-availability-zones-to-protect-from-datacenter-level-failures). It provides higher resilience and availability.

> [!IMPORTANT]
> This preview is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews.](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) 
> 

## Prerequisites
* Azure subscription - [create one for free](https://azure.microsoft.com/free/)

> [!NOTE]
> This feature is currently in preview - [contact us](mailto:azurecache@microsoft.com) if you're interested.
>

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
    | **Cache type** | Select a [Premium tier](https://azure.microsoft.com/pricing/details/cache/) cache. |  The pricing tier determines the size, performance, and features that are available for the cache. For more information, see [Azure Cache for Redis Overview](cache-overview.md). |
   
1. On the **Advanced** page, choose **Replica count**.
   
    :::image type="content" source="media/cache-how-to-multi-replicas/create-multi-replicas.png" alt-text="Replica count":::

1. Select **Availability zones**. 
   
    :::image type="content" source="media/cache-how-to-zone-redundancy/create-zones.png" alt-text="Availability zones":::

1. Leave other options in their default settings. 

    > [!NOTE]
    > Zone redundancy support only works with non-clustered and non-geo-replicated caches currently. In addition, it doesn't support private link, scaling, data persistence, or import/export.
    >

1. Click **Create**. 
   
    It takes a while for the cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.
   
    > [!NOTE]
    > Availability zones can't be changed after a cache is created.
    >

## Next Steps
Learn more about Azure Cache for Redis features.

> [!div class="nextstepaction"]
> [Azure Cache for Redis Premium service tiers](cache-overview.md#service-tiers)