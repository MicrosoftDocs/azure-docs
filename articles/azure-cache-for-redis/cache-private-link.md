---
title: Azure Cache for Redis with Azure Private Link
description: Azure Private Endpoint is a network interface that connects you privately and securely to Azure Cache for Redis powered by Azure Private Link. In this article, you will learn how to create an Azure Cache, an Azure Virtual Network, and a Private Endpoint using the Azure portal.  
author: curib
ms.author: cauribeg
ms.service: cache
ms.topic: conceptual
ms.date: 3/31/2021
---

# Azure Cache for Redis with Azure Private Link
In this article, you'll learn how to create a virtual network and an Azure Cache for Redis instance with a private endpoint using the Azure portal. You'll also learn how to add a private endpoint to an existing Azure Cache for Redis instance.

Azure Private Endpoint is a network interface that connects you privately and securely to Azure Cache for Redis powered by Azure Private Link. 

## Prerequisites
* Azure subscription - [create one for free](https://azure.microsoft.com/free/)

> [!IMPORTANT]
> Currently, zone redundancy, portal console support, firewall storage accounts, and persistence is not supported. 
>
>

## Create a private endpoint with a new Azure Cache for Redis instance 

In this section, you'll create a new Azure Cache for Redis instance with a private endpoint.

### Create a virtual network 

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource**.

    :::image type="content" source="media/cache-private-link/1-create-resource.png" alt-text="Select Create a resource.":::

2. On the **New** page, select **Networking** and then select **Virtual network**.

3. Select **Add** to create a virtual network.

4. In **Create virtual network**, enter or select this information in the **Basics** tab:

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Subscription** | Drop down and select your subscription. | The subscription under which to create this virtual network. | 
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your virtual network and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. | 
   | **Name** | Enter a virtual network name. | The name must begin with a letter or number, end with a letter, number or underscore, and may contain only letters, numbers, underscores, periods, or hyphens. | 
   | **Region** | Drop down and select a region. | Select a [region](https://azure.microsoft.com/regions/) near other services that will use your virtual network. |

5. Select the **IP Addresses** tab or click the **Next: IP Addresses** button at the bottom of the page.

6. In the **IP Addresses** tab, specify the **IPv4 address space** as one or more address prefixes in CIDR notation (e.g. 192.168.1.0/24).

7. Under **Subnet name**, click on **default** to edit the subnet's properties.

8. In the **Edit subnet** pane, specify a **Subnet name** as well as the **Subnet address range**. The subnet's address range should be in CIDR notation (e.g. 192.168.1.0/24). It must be contained by the address space of the virtual network.

9. Select **Save**.

10. Select the **Review + create** tab or click the **Review + create** button.

11. Verify that all the information is correct and click **Create** to provision the virtual network.

### Create an Azure Cache for Redis instance with a private endpoint
To create a cache instance, follow these steps.

1. Go back to the Azure portal homepage or open the sidebar menu, then select **Create a resource**. 
   
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

1. Select the **Networking** tab or click the **Networking** button at the bottom of the page.

1. In the **Networking** tab, select **Private Endpoint** for the connectivity method.

1. Click the **Add** button to create your private endpoint.

    :::image type="content" source="media/cache-private-link/3-add-private-endpoint.png" alt-text="In networking, add a private endpoint.":::

1. On the **Create a private endpoint** page, configure the settings for your private endpoint with the virtual network and subnet you created in the last section and select **OK**. 

1. Select the **Next: Advanced** tab or click the **Next: Advanced** button on the bottom of the page.

1. In the **Advanced** tab for a basic or standard cache instance, select the enable toggle if you want to enable a non-TLS port.

1. In the **Advanced** tab for premium cache instance, configure the settings for non-TLS port, clustering, and data persistence.

1. Select the **Next: Tags** tab or click the **Next: Tags** button at the bottom of the page.

1. Optionally, in the **Tags** tab, enter the name and value if you wish to categorize the resource. 

1. Select **Review + create**. You're taken to the Review + create tab where Azure validates your configuration.

1. After the green Validation passed message appears, select **Create**.

It takes a while for the cache to create. You can monitor progress on the Azure Cache for Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use. 
    
> [!IMPORTANT]
> 
> There is a `publicNetworkAccess` flag which is `Disabled` by default. 
> This flag is meant to allow you to optionally allow both public and private endpoint access to the cache if it is set to `Enabled`. If set to `Disabled`, it will only allow private endpoint access. You can set the value to `Disabled` or `Enabled` with the following PATCH request. Edit the value to reflect which flag you want for your cache.
> ```http
> PATCH  https://management.azure.com/subscriptions/{subscription}/resourceGroups/{resourcegroup}/providers/Microsoft.Cache/Redis/{cache}?api-version=2020-06-01
> {    "properties": {
>        "publicNetworkAccess":"Disabled"
>    }
> }
> ```
>

## Create a private endpoint with an existing Azure Cache for Redis instance 

In this section, you'll add a private endpoint to an existing Azure Cache for Redis instance. 

### Create a virtual network 
To create a virtual network, follow these steps.

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource**.

2. On the **New** page, select **Networking** and then select **Virtual network**.

3. Select **Add** to create a virtual network.

4. In **Create virtual network**, enter or select this information in the **Basics** tab:

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Subscription** | Drop down and select your subscription. | The subscription under which to create this virtual network. | 
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your virtual network and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. | 
   | **Name** | Enter a virtual network name. | The name must begin with a letter or number, end with a letter, number or underscore, and may contain only letters, numbers, underscores, periods, or hyphens. | 
   | **Region** | Drop down and select a region. | Select a [region](https://azure.microsoft.com/regions/) near other services that will use your virtual network. |

5. Select the **IP Addresses** tab or click the **Next: IP Addresses** button at the bottom of the page.

6. In the **IP Addresses** tab, specify the **IPv4 address space** as one or more address prefixes in CIDR notation (e.g. 192.168.1.0/24).

7. Under **Subnet name**, click on **default** to edit the subnet's properties.

8. In the **Edit subnet** pane, specify a **Subnet name** as well as the **Subnet address range**. The subnet's address range should be in CIDR notation (e.g. 192.168.1.0/24). It must be contained by the address space of the virtual network.

9. Select **Save**.

10. Select the **Review + create** tab or click the **Review + create** button.

11. Verify that all the information is correct and click **Create** to provision the virtual network.

### Create a private endpoint 

To create a private endpoint, follow these steps.

1. In the Azure portal, search for **Azure Cache for Redis** and press enter or select it from the search suggestions.

    :::image type="content" source="media/cache-private-link/4-search-for-cache.png" alt-text="Search for Azure Cache for Redis.":::

2. Select the cache instance you want to add a private endpoint to.

3. On the left side of the screen, select **Private Endpoint**.

4. Click the **Private Endpoint** button to create your private endpoint.

    :::image type="content" source="media/cache-private-link/5-add-private-endpoint.png" alt-text="Add private endpoint.":::

5. On the **Create a private endpoint page**, configure the settings for your private endpoint.

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Subscription** | Drop down and select your subscription. | The subscription under which to create this private endpoint. | 
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your private endpoint and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. | 
   | **Name** | Enter a private endpoint name. | The name must begin with a letter or number, end with a letter, number or underscore, and may contain only letters, numbers, underscores, periods, or hyphens. | 
   | **Region** | Drop down and select a region. | Select a [region](https://azure.microsoft.com/regions/) near other services that will use your private endpoint. |

6. Click the **Next: Resource** button at the bottom of the page.

7. In the **Resource** tab, select your subscription, choose the resource type as `Microsoft.Cache/Redis`, and then select the cache you want to connect the private endpoint to.

8. Click the **Next: Configuration** button at the bottom of the page.

9. In the **Configuration** tab, select the virtual network and subnet you created in the previous section.

10. Click the **Next: Tags** button at the bottom of the page.

11. Optionally, in the **Tags** tab, enter the name and value if you wish to categorize the resource.

12. Select **Review + create**. You're taken to the **Review + create** tab where Azure validates your configuration.

13. After the green **Validation passed** message appears, select **Create**.

## FAQ

### Why can't I connect to a private endpoint?
If your cache is already a VNet injected cache, private endpoints cannot be used with your cache instance. If your cache instance is using an unsupported feature (listed below), you won't be able to connect to your private endpoint instance.

### What features are not supported with private endpoints?
Currently, zone redundancy, portal console support, firewall storage accounts, and persistence is not supported. 

### How can I change my private endpoint to be disabled or enabled from public network access?
There is a `publicNetworkAccess` flag which is `Disabled` by default. 
This flag is meant to allow you to optionally allow both public and private endpoint access to the cache if it is set to `Enabled`. If set to `Disabled`, it will only allow private endpoint access. You can set the value to `Disabled` or `Enabled` with the following PATCH request. Edit the value to reflect which flag you want for your cache.

```http
PATCH  https://management.azure.com/subscriptions/{subscription}/resourceGroups/{resourcegroup}/providers/Microsoft.Cache/Redis/{cache}?api-version=2020-06-01
{    "properties": {
       "publicNetworkAccess":"Disabled"
   }
}
```

### How can I have multiple endpoints in different virtual networks?
To have multiple private endpoints in different virtual networks, the private DNS zone needs to be manually configured to the multiple virtual networks _before_ creating the private endpoint. For more information, see [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md). 

### Are network security groups (NSG) enabled for private endpoints?
No, they are disabled for private endpoints. While subnets containing the private endpoint can have NSG associated with it, the rules will not be effective on traffic processed by the private endpoint. You must have [network policies enforcement disabled](../private-link/disable-private-endpoint-network-policy.md) to deploy private endpoints in a subnet. NSG is still enforced on other workloads hosted on the same subnet. Routes on any client subnet will be using an /32 prefix, changing the default routing behavior requires a similar UDR. 

Control the traffic by using NSG rules for outbound traffic on source clients. Deploy individual routes with /32 prefix to override private endpoint routes. NSG Flow logs and monitoring information for outbound connections are still supported and can be used

### Since my private endpoint instance is not in my VNet, how is it associated with my VNet?
It is only linked to your VNet. Since it is not in your VNet, NSG rules do not need to be modified for dependent endpoints.

### How can I migrate my VNet injected cache to a private endpoint cache?
You will need to delete your VNet injected cache and create a new cache instance with a private endpoint. For more information, see [migrate to Azure Cache for Redis](cache-migration-guide.md)

## Next steps
* To learn more about Azure Private Link, see the [Azure Private Link documentation](../private-link/private-link-overview.md).
* To compare various network isolation options for your cache instance, see [Azure Cache for Redis network isolation options documentation](cache-network-isolation.md).
