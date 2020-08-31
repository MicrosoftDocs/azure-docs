---
title: Azure Cache for Redis with Azure Private Link (Preview)
description: Azure Private Endpoint is a network interface that connects you privately and securely to Azure Cache for Redis powered by Azure Private Link. In this article, you will learn how to create an Azure Cache, an Azure virtual network, and a Private Endpoint using the Azure portal.  
author: curib
ms.author: cauribeg
ms.service: cache
ms.topic: conceptual
ms.date: 08/31/2020
---

# Azure Cache for Redis with Azure Private Link (Public Preview)
In this article, you'll learn how to create a virtual network and an Azure Cache for Redis instance with a Private Endpoint using the Azure portal. You'll also learn how to add a Private Endpoint to an existing Azure Cache for Redis instance.

Azure Private Endpoint is a network interface that connects you privately and securely to Azure Cache for Redis powered by Azure Private Link. 

> [!IMPORTANT]
> This preview is provided without a service level agreement, and it's not recommended for production workloads. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews.](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) 
> 

## Prerequisites
* Azure subscription - [create one for free](https://azure.microsoft.com/free/)

> [!NOTE]
> This feature is currently public preview for limited regions. If you don't have the option to create a Private Endpoint, [contact us](mailto:azurecache@microsoft.com). To use Private Endpoints, your Azure Cache for Redis instance needs to have been created after July 28th, 2020.
>

## Create a Private Endpoint with a new Azure Cache for Redis Instance 

In this section, you'll create a new Azure Cache for Redis instance with a private endpoint.

### Create a Virtual Network 

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource**.

    :::image type="content" source="media/cache-private-link/1-create-resource.png" alt-text="Select Create a resource.":::

2. On the **New** page, select **Networking** and then select **Virtual network**.

    :::image type="content" source="media/cache-private-link/0-select-vnet.png" alt-text="Create a virtual net.":::

3. Select **+ Add** to create a virtual network.

4. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Drop down and select your subscription.                                  |
    | Resource Group   | Drop down and select a resource group. |
    | **Instance details** |                                                                 |
    | Name             | Enter **\<virtual-network-name>**                                    |
    | Region           | Select **\<region-name>** |

5. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

6. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **\<IPv4-address-space>** |

7. Under **Subnet name**, select the word **default**.

8. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **\<subnet-name>** |
    | Subnet address range | Enter **\<subnet-address-range>**

9. Select **Save**.

10. Select the **Review + create** tab or select the **Review + create** button.

11. Select **Create**.

### Create an Azure Cache for Redis Instance with a Private Endpoint
1. To create a cache, go back to the homepage of Azure portal and select **Create a resource**. 

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

1. Select the **Networking** tab or select the **Networking** button at the bottom of the page.

1. In the **Networking** tab, select Private Endpoint for the connectivity method.

1. Select **+ Add** button to create your private endpoint.

    :::image type="content" source="media/cache-private-link/4-add-private-endpoint.png" alt-text="In networking, add a private endpoint.":::

1. On the **Create a private endpoint** page, configure the settings for your private endpoint with the virtual network and subnet you created in the last section and press **OK**. 

    :::image type="content" source="media/cache-private-link/5-create-private-endpoint.png" alt-text="Create a private endpoint.":::

1. Select the **Next: Advanced** tab or the **Next: Advanced** button on the bottom of the page.

1. In the **Advanced** tab for a basic or standard cache instance, select the enable toggle if you want to enable a non-TLS port.

1. In the **Advanced** tab for premium cache instance, configure the settings for non-TLS port, clustering, and data persistence.

    :::image type="content" source="media/cache-private-link/6-advanced.png" alt-text="Configure advanced Azure Cache for Redis instance settings.":::

1. Select the **Next: Tags** tab or the **Next: Tags** button at the bottom of the page.

1. In the **Tags** tab, enter the name and value if you wish to categorize the resource. This step is optional.

1. Select **Review + create**. You're taken to the Review + create tab where Azure validates your configuration.

1. Once the green Validation passed message appears, select **Create**.

It takes a while for the cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use. 
    

## Create a Private Endpoint with an existing Azure Cache for Redis instance 

In this section, you'll add a Private Endpoint to an existing Azure Cache for Redis instance. 

### Create a Virtual Network 

1. Sign in to the [Azure portal](https://portal.azure.com) and and select **Create a resource**.

    :::image type="content" source="media/cache-private-link/1-create-resource.png" alt-text="Select Create a resource.":::

2. On the **New** page, select **Networking** and then select **Virtual network**.

    :::image type="content" source="media/cache-private-link/0-select-vnet.png" alt-text="Create a virtual net.":::

3. Select **+ Add** to create a virtual network.

4. In **Create virtual network**, enter or select this information in the **Basics** tab:

    | **Setting**          | **Value**                                                           |
    |------------------|-----------------------------------------------------------------|
    | **Project Details**  |                                                                 |
    | Subscription     | Drop down and select your subscription.                                  |
    | Resource Group   | Drop down and select a resource group. |
    | **Instance details** |                                                                 |
    | Name             | Enter **\<virtual-network-name>**                                    |
    | Region           | Select **\<region-name>** |

5. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

6. In the **IP Addresses** tab, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | IPv4 address space | Enter **\<IPv4-address-space>** |

7. Under **Subnet name**, select the word **default**.

8. In **Edit subnet**, enter this information:

    | Setting            | Value                      |
    |--------------------|----------------------------|
    | Subnet name | Enter **\<subnet-name>** |
    | Subnet address range | Enter **\<subnet-address-range>**

9. Select **Save**.

10. Select the **Review + create** tab or select the **Review + create** button.

11. Select **Create**.


### Create a Private Endpoint for an existing Azure Cache for Redis instance

1. In the Azure Portal, search for **Azure Cache for Redis** and press enter or select it from the search suggestions.

    :::image type="content" source="media/cache-private-link/8-search-for-cache.png" alt-text="Search for Azure Cache for Redis.":::

2. Select on the cache instance you want to add a private endpoint to.

    :::image type="content" source="media/cache-private-link/9-select-cache-instance.png" alt-text="Select cache instance.":::

3. On the left side of the screen, select **(PREVIEW) Private Endpoint**.

    :::image type="content" source="media/cache-private-link/10-select-private-endpoint.png" alt-text="Select private endpoint from list.":::

4. Select the **+ Private Endpoint** button to create your private endpoint.

    :::image type="content" source="media/cache-private-link/11-add-private-endpoint.png" alt-text="Select private endpoint from list.":::

5. On the **Create a private endpoint page**, configure the settings for your private endpoint.

    | Setting | Value |
    | ------- | ----- |
    | **PROJECT DETAILS** | |
    | Subscription | Drop down and select your subscription. |
    | Resource group | Drop down and select a resource group. |
    | **INSTANCE DETAILS** |  |
    | Name |Enter a name for your private endpoint.  |
    | Region |Drop down and select a location. |
    |||

6. Select the **Next: Resource** button at the bottom of the page.

7. In the **Resource** tab, select your subscription, choose the resource type as Microsoft.Cache/Redis, and then select the cache you want to connect the private endpoint to.

    :::image type="content" source="media/cache-private-link/12-resource-private-endpoint.png" alt-text="Resources for private link.":::

8. Select the **Next: Configuration** button at the bottom of the page.

9. In the **Configuration** tab, select the virtual network and subnet you created in the previous section.

    :::image type="content" source="media/cache-private-link/13-configuration-private-endpoint.png" alt-text="Configuration for private link.":::

10. Select the **Next: Tags** button at the bottom of the page.

11. In the **Tags** tab, enter the name and value if you wish to categorize the resource. This step is optional.

    :::image type="content" source="media/cache-private-link/14-tags-private-endpoint.png" alt-text="Tags for private link.":::

12. Select **Review + create**. You're taken to the **Review + create** tab where Azure validates your configuration.

13. Once the green **Validation passed** message appears, select **Create**.


## Next Steps

To learn more about Private Link, see the [Azure Private Link documentation](https://docs.microsoft.com/azure/private-link/private-link-overview). 

