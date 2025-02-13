---
title: Azure Managed Redis (preview) with Azure Private Link
description: Learn how to create an Azure Cache, an Azure Virtual Network, and a Private Endpoint using the Azure portal with a managed Redis cache.



ms.service: azure-managed-redis
ms.custom: devx-track-azurecli, devx-track-azurepowershell, ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
---

# What is Azure Managed Redis (preview) with Azure Private Link?

In this article, you learn how to create a virtual network and an Azure Managed Redis (preview) instance with a private endpoint using the Azure portal. You also learn how to add a private endpoint to an existing Azure Managed Redis instance.

Azure Private Endpoint is a network interface that connects you privately and securely to Azure Managed Redis powered by Azure Private Link.

>[!Important]
> Using private endpoint to connect to a Virtual Network is the recommended solution for securing your Azure Managed Redis (Preview) resource at the networking layer.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)

## Create a private endpoint with a new Azure Managed Redis instance

In this section, you create a new Azure Managed Redis instance with a private endpoint.

### Create a virtual network for your new cache

To create a cache using the portal:

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource**.

    :::image type="content" source="media/managed-redis-private-link/1-create-resource.png" alt-text="Select Create a resource.":::

2. On the **New** page, select **Networking** and then select **Virtual network**.

3. Select **Add** to create a virtual network.

4. In **Create virtual network**, enter or select this information in the **Basics** tab:

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Subscription** | Drop down and select your subscription. | The subscription where you create this virtual network. |
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your virtual network and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. |
   | **Name** | Enter a virtual network name. | The name must: begin with a letter or number; end with a letter, number, or underscore; and contain only letters, numbers, underscores, periods, or hyphens. |
   | **Region** | Drop down and select a region. | Select a [region](https://azure.microsoft.com/regions/) near other services that use your virtual network. |

5. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

6. In the **IP Addresses** tab, specify the **IPv4 address space** as one or more address prefixes in CIDR notation (for example, 192.168.1.0/24).

7. Under **Subnet name**, select on **default** to edit the subnet's properties.

8. In the **Edit subnet** pane, specify a **Subnet name** and the **Subnet address range**. The subnet's address range should be in CIDR notation (for example, 192.168.1.0/24). It must be contained by the address space of the virtual network.

9. Select **Save**.

10. Select the **Review + create** tab or select the **Review + create** button.

11. Verify that all the information is correct and select **Create** to create the virtual network.

### Create an Azure Managed Redis instance with a private endpoint

To create a cache instance, follow these steps:

1. Go back to the Azure portal homepage or open the sidebar menu, then select **Create a resource**.

1. In the search box, type _Azure Cache for Redis_. Refine your search to Azure services only, and select **Azure Cache for Redis**.

1. On the **New Redis Cache** page, configure the settings for your new cache.
    1. Select an Azure Managed Redis cache in **Cache SKU**.
    1. Select an appropriate option in **Cache size**.

1. Select the **Networking** tab or select the **Networking** button at the bottom of the page.

1. In the **Networking** tab, select **Private Endpoint** for the connectivity method.

1. Select the **Add** button to create your private endpoint.

   :::image type="content" source="media/managed-redis-private-link/3-add-private-endpoint.png" alt-text="In networking, add a private endpoint.":::

1. On the **Create a private endpoint** page, configure the settings for your private endpoint with the virtual network and subnet you created in the last section and select **OK**.

1. Select the **Next: Advanced** tab or select the **Next: Advanced** button on the bottom of the page.

1. In the **Advanced** tab for a basic or standard cache instance, select the enable toggle if you want to enable a non-TLS port.

1. In the **Advanced** tab for premium cache instance, configure the settings for non-TLS port, clustering, and data persistence.

1. Select the **Next: Tags** tab or select the **Next: Tags** button at the bottom of the page.

1. Optionally, in the **Tags** tab, enter the name and value if you wish to categorize the resource.

1. Select **Review + create**. You're taken to the Review + create tab where Azure validates your configuration.

1. After the green Validation passed message appears, select **Create**.

It takes a while for the cache to create. You can monitor progress on the Azure Managed Redis **Overview** page. When **Status** shows as **Running**, the cache is ready to use.

## Create a private endpoint with an existing Azure Managed Redis instance

In this section, you add a private endpoint to an existing Azure Managed Redis instance.

### Create a virtual network for your existing cache

To create a virtual network, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource**.

1. On the **New** page, select **Networking** and then select **Virtual network**.

1. Select **Add** to create a virtual network.

1. In **Create virtual network**, enter or select this information in the **Basics** tab:

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Subscription** | Drop down and select your subscription. | The subscription where you create this virtual network. |
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your virtual network and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. |
   | **Name** | Enter a virtual network name. | The name must: begin with a letter or number; end with a letter, number, or underscore; and contain only letters, numbers, underscores, periods, or hyphens. |
   | **Region** | Drop down and select a region. | Select a [region](https://azure.microsoft.com/regions/) near other services that use your virtual network. |

1. Select the **IP Addresses** tab or select the **Next: IP Addresses** button at the bottom of the page.

1. In the **IP Addresses** tab, specify the **IPv4 address space** as one or more address prefixes in CIDR notation (for example, 192.168.1.0/24).

1. Under **Subnet name**, select on **default** to edit the subnet's properties.

1. In the **Edit subnet** pane, specify a **Subnet name** and the **Subnet address range**. The subnet's address range should be in CIDR notation (for example, 192.168.1.0/24). It must be contained by the address space of the virtual network.

1. Select **Save**.

1. Select the **Review + create** tab or select the **Review + create** button.

1. Verify that all the information is correct and select **Create** to create the virtual network.

### Create a private endpoint

To create a private endpoint, follow these steps:

1. In the Azure portal, search for **Azure Cache for Redis**. Then, press enter or select it from the search suggestions for your cache.

    <!-- :::image type="content" source="media/managed-redis-private-link/4-search-for-cache.png" alt-text="Search for Azure Managed Redis."::: -->

1. Select the cache instance you want to add a private endpoint to.

1. On the left side of the screen, select **Private Endpoint**.

1. Select the **Private Endpoint** button to create your private endpoint.

    <!-- :::image type="content" source="media/managed-redis-private-link/5-add-private-endpoint.png" alt-text="Add private endpoint."::: -->

1. On the **Create a private endpoint page**, configure the settings for your private endpoint.

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Subscription** | Drop down and select your subscription. | The subscription where you create this private endpoint. |
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your private endpoint and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. |
   | **Name** | Enter a private endpoint name. | The name must: begin with a letter or number; end with a letter, number, or underscore; and can contain only letters, numbers, underscores, periods, or hyphens. |
   | **Region** | Drop down and select a region. | Select a [region](https://azure.microsoft.com/regions/) near other services that use your private endpoint. |

1. Select the **Next: Resource** button at the bottom of the page.

1. In the **Resource** tab, select your subscription, choose the resource type as `Microsoft.Cache/redisEnterprise`, and then select the cache you want to connect the private endpoint to.

1. Select the **Next: Configuration** button at the bottom of the page.

1. Select the **Next: Virtual Network** button at the bottom of the page.

1. In the **Configuration** tab, select the virtual network and subnet you created in the previous section.

1. In the **Virtual Network** tab, select the virtual network and subnet you created in the previous section.

1. Select the **Next: Tags** button at the bottom of the page.

1. Optionally, in the **Tags** tab, enter the name and value if you wish to categorize the resource.

1. Select **Review + create**. You're taken to the **Review + create** tab where Azure validates your configuration.

1. After the green **Validation passed** message appears, select **Create**.

> [!IMPORTANT]
>
> There is a `publicNetworkAccess` flag which is `Disabled` by default.
> You can set the value to `Disabled` or `Enabled`. When set to enabled, this flag allows both public and private endpoint access to the cache. When set to `Disabled`, it allows only private endpoint access. For more information on how to change the value, see the [FAQ](#how-can-i-change-my-private-endpoint-to-be-disabled-or-enabled-from-public-network-access).
>
## Create a private endpoint using Azure PowerShell

To create a private endpoint named _MyPrivateEndpoint_ for an existing Azure Managed Redis instance, run the following PowerShell script. Replace the variable values with the details for your environment:

```azurepowershell-interactive

$SubscriptionId = "<your Azure subscription ID>"
# Resource group where the Azure Managed Redis instance and virtual network resources are located
$ResourceGroupName = "myResourceGroup"
# Name of the Azure Managed Redis instance
$redisCacheName = "mycacheInstance"

# Name of the existing virtual network
$VNetName = "myVnet"
# Name of the target subnet in the virtual network
$SubnetName = "mySubnet"
# Name of the private endpoint to create
$PrivateEndpointName = "MyPrivateEndpoint"
# Location where the private endpoint can be created. The private endpoint should be created in the same location where your subnet or the virtual network exists
$Location = "westcentralus"

$redisCacheResourceId = "/subscriptions/$($SubscriptionId)/resourceGroups/$($ResourceGroupName)/providers/Microsoft.Cache/Redis/$($redisCacheName)"

$privateEndpointConnection = New-AzPrivateLinkServiceConnection -Name "myConnectionPS" -PrivateLinkServiceId $redisCacheResourceId -GroupId "redisCache"
 
$virtualNetwork = Get-AzVirtualNetwork -ResourceGroupName  $ResourceGroupName -Name $VNetName  
 
$subnet = $virtualNetwork | Select -ExpandProperty subnets | Where-Object  {$_.Name -eq $SubnetName}  
 
$privateEndpoint = New-AzPrivateEndpoint -ResourceGroupName $ResourceGroupName -Name $PrivateEndpointName -Location "westcentralus" -Subnet  $subnet -PrivateLinkServiceConnection $privateEndpointConnection
```

## Retrieve a private endpoint using Azure PowerShell

To get the details of a private endpoint, use this PowerShell command:

```azurepowershell-interactive
Get-AzPrivateEndpoint -Name $PrivateEndpointName -ResourceGroupName $ResourceGroupName
```

## Remove a private endpoint using Azure PowerShell

To remove a private endpoint, use the following PowerShell command:

```azurepowershell-interactive
Remove-AzPrivateEndpoint -Name $PrivateEndpointName -ResourceGroupName $ResourceGroupName
```

## Create a private endpoint using Azure CLI

To create a private endpoint named _myPrivateEndpoint_ for an existing Azure Managed Redis instance, run the following Azure CLI script. Replace the variable values with the details for your environment:

```azurecli-interactive
# Resource group where the Azure Managed Redis and virtual network resources are located
ResourceGroupName="myResourceGroup"

# Subscription ID where the Azure Managed Redis and virtual network resources are located
SubscriptionId="<your Azure subscription ID>"

# Name of the existing Azure Managed Redis instance
redisCacheName="mycacheInstance"

# Name of the virtual network to create
VNetName="myVnet"

# Name of the subnet to create
SubnetName="mySubnet"

# Name of the private endpoint to create
PrivateEndpointName="myPrivateEndpoint"

# Name of the private endpoint connection to create
PrivateConnectionName="myConnection"

az network vnet create \
    --name $VNetName \
    --resource-group $ResourceGroupName \
    --subnet-name $SubnetName

az network vnet subnet update \
    --name $SubnetName \
    --resource-group $ResourceGroupName \
    --vnet-name $VNetName \
    --disable-private-endpoint-network-policies true

az network private-endpoint create \
    --name $PrivateEndpointName \
    --resource-group $ResourceGroupName \
    --vnet-name $VNetName  \
    --subnet $SubnetName \
    --private-connection-resource-id "/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.Cache/redisEnterprise/$redisCacheName" \
    --group-ids "redisEnterprise" \
    --connection-name $PrivateConnectionName
```

## Retrieve a private endpoint using Azure CLI

To get the details of a private endpoint, use the following CLI command:

```azurecli-interactive
az network private-endpoint show --name MyPrivateEndpoint --resource-group MyResourceGroup
```

## Remove a private endpoint using Azure CLI

To remove a private endpoint, use the following CLI command:

```azurecli-interactive
az network private-endpoint delete --name MyPrivateEndpoint --resource-group MyResourceGroup
```

## FAQ

- [How do I connect to my cache with private endpoint?](#how-do-i-connect-to-my-cache-with-private-endpoint)
- [Why can't I connect to a private endpoint?](#why-cant-i-connect-to-a-private-endpoint)
- [What features aren't supported with private endpoints?](#what-features-arent-supported-with-private-endpoints)
- [How do I verify if my private endpoint is configured correctly?](#how-do-i-verify-if-my-private-endpoint-is-configured-correctly)
- [How can I change my private endpoint to be disabled or enabled from public network access?](#how-can-i-change-my-private-endpoint-to-be-disabled-or-enabled-from-public-network-access)
- [How can I have multiple endpoints in different virtual networks?](#how-can-i-have-multiple-endpoints-in-different-virtual-networks)
- [What happens if I delete all the private endpoints on my cache?](#what-happens-if-i-delete-all-the-private-endpoints-on-my-cache)
- [Are network security groups (NSG) enabled for private endpoints?](#are-network-security-groups-nsg-enabled-for-private-endpoints)
- [My private endpoint instance isn't in my VNet, so how is it associated with my VNet?](#my-private-endpoint-instance-isnt-in-my-vnet-so-how-is-it-associated-with-my-vnet)

### How do I connect to my cache with private endpoint?

Your application should connect to `<cachename>.<region>.redis.azure.net` on port `10000`. A private DNS zone, named `*.privatelink.redis.azure.net`, is automatically created in your subscription. The private DNS zone is vital for establishing the TLS connection with the private endpoint. We recommend avoiding the use of `<cachename>.privatelink.redis.azure.net` in configuration for client connection.

For more information, see [Azure services DNS zone configuration](/azure/private-link/private-endpoint-dns).

### Why can't I connect to a private endpoint?

- Private endpoints can't be used with your cache instance if your cache is already a virtual network (VNet) injected cache.
  
- Azure Managed Redis caches are limited to 84 private links.

- You try to [persist data to storage account](managed-redis-how-to-persistence.md) where firewall rules are applied might prevent you from creating the Private Link.

- You might not connect to your private endpoint if your cache instance is using an [unsupported feature](#what-features-arent-supported-with-private-endpoints).

### What features aren't supported with private endpoints?

- There's no restriction for using private endpoint with Azure Managed Redis (Preview).

### How do I verify if my private endpoint is configured correctly?

Go to **Overview** in the Resource menu on the portal. You see the **Host name** for your cache in the working pane. To verify that the command resolves to the private IP address for the cache, run a command like `nslookup <hostname>` from within the VNet that is linked to the private endpoint.

   :::image type="content" source="media/managed-redis-private-link/managed-redis-private-ip-address.png" alt-text="In the Azure portal, private endpoint D N S settings.":::

### How can I change my private endpoint to be disabled or enabled from public network access?

To change the value in the Azure portal, follow these steps:

  1. In the Azure portal, search for **Azure Managed Redis**. Then, press enter or select it from the search suggestions.

  1. Select the cache instance you want to change the public network access value.

  1. On the left side of the screen, select **Private Endpoint**.

  1. Delete the private endpoint.

### How can I have multiple endpoints in different virtual networks?

To have multiple private endpoints in different virtual networks, the private DNS zone must be manually configured to the multiple virtual networks before creating the private endpoint. For more information, see [Azure Private Endpoint DNS configuration](/azure/private-link/private-endpoint-dns).

### What happens if I delete all the private endpoints on my cache?

If you delete all private endpoints on your Azure Managed Redis (preview) cache, networking defaults to have public network access.

### Are network security groups (NSG) enabled for private endpoints?

No, they're disabled for private endpoints. While subnets containing the private endpoint can have NSG associated with it, the rules aren't effective on traffic processed by the private endpoint. You must have [network policies enforcement disabled](/azure/private-link/disable-private-endpoint-network-policy) to deploy private endpoints in a subnet. NSG is still enforced on other workloads hosted on the same subnet. Routes on any client subnet use a /32 prefix, changing the default routing behavior requires a similar UDR.

Control the traffic by using NSG rules for outbound traffic on source clients. Deploy individual routes with /32 prefix to override private endpoint routes. NSG Flow logs and monitoring information for outbound connections are still supported and can be used.

### My private endpoint instance isn't in my VNet, so how is it associated with my VNet?

Your private endpoint is only linked to your VNet. Because it's not in your VNet, NSG rules don't need to be modified for dependent endpoints.

## Related content

- To learn more about Azure Private Link, see the [Azure Private Link documentation](/azure/private-link/private-link-overview).
- To compare various network isolation options for your cache, see [Azure Cache for Redis network isolation options documentation](../cache-network-isolation.md).
