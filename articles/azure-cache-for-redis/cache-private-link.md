---
title: Azure Cache for Redis with Azure Private Link (Preview)
description: Azure Private Endpoint is a network interface that connects you privately and securely to Azure Cache for Redis powered by Azure Private Link. In this article, you will learn how to create an Azure Cache, an Azure virtual network, and a Private Endpoint using the Azure portal.  
author: curib
ms.author: cauribeg
ms.service: cache
ms.topic: conceptual
ms.date: 07/21/2020
---

# Azure Cache for Redis with Azure Private Link (Preview)
Azure Private Endpoint is a network interface that connects you privately and securely to Azure Cache for Redis powered by Azure Private Link. 

In this article, you'll learn how to create an Azure Cache, an Azure virtual network, and a Private Endpoint using the Azure portal.  

> [!IMPORTANT]
> This preview is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews.](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) 
> 

## Prerequisites
* Azure subscription - [create one for free](https://azure.microsoft.com/free/)

> [!NOTE]
> This feature is currently in preview - [contact us](mailto:azurecache@microsoft.com) if you're interested.
>

## Create a cache
1. To create a cache, sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource**. 

    :::image type="content" source="media/cache-private-link/1-create-resource.png" alt-text="Select Create a resource.":::
   
1. On the **New** page, select **Databases** and then select **Azure Cache for Redis**.

    :::image type="content" source="media/cache-private-link/2-select-cache.png" alt-text="Select Azure Cache for Redis.":::
   
1. On the **New Redis Cache** page, configure the settings for your new cache.
   
   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **DNS name** | Enter a globally unique name. | The cache name must be a string between 1 and 63 characters that contains only numbers, letters, or hyphens. The name must start and end with a number or letter, and can't contain consecutive hyphens. Your cache instance's *host name* will be *\<DNS name>.redis.cache.windows.net*. | 
   | **Subscription** | Drop down and select your subscription. | The subscription under which to create this new Azure Cache for Redis instance. | 
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your cache and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. | 
   | **Location** | Drop down and select a location. | Select a [region](https://azure.microsoft.com/regions/) near other services that will use your cache. |
   | **Pricing tier** | Drop down and select a [Pricing tier](https://azure.microsoft.com/pricing/details/cache/). |  The pricing tier determines the size, performance, and features that are available for the cache. For more information, see [Azure Cache for Redis Overview](cache-overview.md). |
   
1. Select **Create**. 
   
    :::image type="content" source="media/cache-private-link/3-new-cache.png" alt-text="Create Azure Cache for Redis.":::
   
   It takes a while for the cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.
    
    :::image type="content" source="media/cache-private-link/4-status.png" alt-text="Azure Cache for Redis created.":::

## Create a virtual network

In this section, you'll create a virtual network and subnet.

1. Select **Create a resource**.

    :::image type="content" source="media/cache-private-link/1-create-resource.png" alt-text="Select Create a resource.":::

2. On the **New** page, select **Networking** and then select **Virtual network**.

    :::image type="content" source="media/cache-private-link/5-select-vnet.png" alt-text="Create a virtual net.":::

3. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Drop down and select your subscription.                                  |
    | Resource Group   | Drop down and select a resource group. |
    | **Instance details** |                                                                 |
    | Name             | Enter **\<virtual-network-name>**                                    |
    | Region           | Select **\<region-name>** |

4. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

5. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **\<IPv4-address-space>** |

6. Under **Subnet name**, select the word **default**.

7. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **\<subnet-name>** |
    | Subnet address range | Enter **\<subnet-address-range>**

8. Select **Save**.

9. Select the **Review + create** tab or select the **Review + create** button.

10. Select **Create**.


## Create a private endpoint 

In this section, you'll create a private endpoint and connect it to the cache you created earlier.

1. Search for **Private Link** and press enter or select it from the search suggestions.

    :::image type="content" source="media/cache-private-link/7-create-private-link.png" alt-text="Search for a private link.":::

2. On the left side of the screen, select **Private endpoints**.

    :::image type="content" source="media/cache-private-link/8-select-private-endpoint.png" alt-text="Select private link.":::

3. Select the **+ Add** button to create your private endpoint. 

    :::image type="content" source="media/cache-private-link/9-add-private-endpoint.png" alt-text="Add a private link.":::

4. On the **Create a private endpoint page**, configure the settings for your private endpoint.

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Drop down and select your subscription. |
    | Resource group | Drop down and select a resource group. |
    | **INSTANCE DETAILS** |  |
    | Name |Enter a name for your private endpoint.  |
    | Region |Drop down and select a location. |
    |||

5. Select the **Next: Resource** button at the bottom of the page.

6. In the **Resource** tab, select your subscription, choose the resource type as Microsoft.Cache/Redis, and then select the cache you made in the previous section.

    :::image type="content" source="media/cache-private-link/10-resource-private-endpoint.png" alt-text="Resources for private link.":::

7. Select the **Next: Configuration** button at the bottom of the page.

8. In the **Configuration** tab, select the virtual network and subnet you created in the previous section.

    :::image type="content" source="media/cache-private-link/11-configuration-private-endpoint.png" alt-text="Configuration for private link.":::

9. Select the **Next: Tags** button at the bottom of the page.

10. In the **Tags** tab, enter the name and value if you wish to categorize the resource. This step is optional.

    :::image type="content" source="media/cache-private-link/12-tags-private-endpoint.png" alt-text="Tags for private link.":::

11. Select **Review + create**. You're taken to the **Review + create** tab where Azure validates your configuration.

12. Once the green **Validation passed** message appears, select **Create**.


## Next Steps

To learn more about Private Link, see the [Azure Private Link documentation](https://docs.microsoft.com/azure/private-link/private-link-overview). 

