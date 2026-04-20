---
title: Azure Managed Redis with Azure Private Link
description: Learn how to create an Azure Cache, an Azure Virtual Network, and a Private Endpoint using the Azure portal with a managed Redis cache.
ms.date: 01/20/2026
ms.topic: article
ai-usage: ai-assisted
ms.custom:
  - ignite-2024
  - build-2025
appliesto:
  - ✅ Azure Managed Redis
---

# What is Azure Managed Redis with Azure Private Link?

In this article, you learn how to create a virtual network and use it with an Azure Managed Redis instance with a private endpoint. Azure Private Endpoint is a network interface that connects you privately and securely to Azure Managed Redis powered by Azure Private Link.

The process is accomplished in two steps:

1. First, create a virtual network to use with a cache.

1. Then, depending on whether you already have a cache:
   1. Add the virtual network when you create a [new cache](#create-an-azure-managed-redis-instance-with-a-private-endpoint-connected-to-a-virtual-network-subnet).
   1. Add the virtual network to your [existing cache](#create-an-azure-managed-redis-cache-connected-to-a-private-endpoint-using-azure-powershell).

>[!Important]
> Using private endpoint to connect to a virtual network is the recommended solution for securing your Azure Managed Redis resource at the networking layer.

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)

## Create a virtual network with a subnet

First, create a virtual network by using the portal. Use this virtual network when you create a [new cache](#create-an-azure-managed-redis-instance-with-a-private-endpoint-connected-to-a-virtual-network-subnet) or with an [existing cache](#create-an-azure-managed-redis-cache-connected-to-a-private-endpoint-using-azure-powershell).

1. Sign in to the [Azure portal](https://portal.azure.com) and select **Create a resource**.

1. On the **New** pane, select **Networking** and then select **Virtual network**.

1. Select **Add** to create a virtual network.

1. In **Create virtual network**, enter or select this information in the **Basics** pane:

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Subscription** | Drop down and select your subscription. | The subscription where you create this virtual network. |
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your virtual network and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. |
   | **Virtual network name** | Enter a virtual network name. | The name must: begin with a letter or number; end with a letter, number, or underscore; and contain only letters, numbers, underscores, periods, or hyphens. |
   | **Region** | Drop down and select a region. | Select a [region](https://azure.microsoft.com/regions/) near other services that use your virtual network. |

1. Select the **IP Addresses** pane or select the **Next: IP Addresses** button at the bottom of the pane.

1. In the **IP Addresses** pane, specify the **IPv4 address space**  or **IPv6 address space**. For this procedure, use **IPv4 address space**.

1. Select **Add a subnet**. Under **Subnet name**, select  **default** or add a name. You can also edit the subnet properties as needed for your application.

1. Select **Add**.

1. Select the **Review + create** pane or select the **Review + create** button.

1. Verify that all the information is correct, and select **Create** to create the virtual network.

## Create an Azure Managed Redis instance with a private endpoint connected to a Virtual Network Subnet

To create an Azure Managed Redis cache instance and add a private endpoint, follow these steps. You first must [create a virtual network](#create-a-virtual-network-with-a-subnet) to use with your cache.

1. Go to the Azure portal home page, or open the sidebar menu, and select **Create a resource**.

1. In the search box, type _Azure Managed Redis_. Refine your search to Azure services only, and select **Azure Managed Redis**.

1. On the **New Azure Managed Redis** pane, configure the basic settings for your new cache.

1. Select the **Networking** tab, or select the **Next: Networking** at the bottom of the working pane.

1. In the **Networking** pane, select **Private Endpoint** for the connectivity method.

1. Select the **Add private endpoint** to add your private endpoint.

1. On the **Create private endpoint** pane, configure the settings for your private endpoint with the virtual network and subnet you created in the last section and select **Add**.

1. Proceed with other tabs to fill out the configuration settings as needed.

1. Select **Review + create**. You're taken to the Review + create pane where Azure validates your configuration.

1. After the green Validation passed message appears, select **Create**.

It takes a while for the cache to create. You can monitor progress on the Azure Managed Redis **Overview** pane. When **Status** shows as **Running**, the cache is ready to use.

## Add a private endpoint to an existing Azure Managed Redis instance

In this section, you add a private endpoint to an existing Azure Managed Redis instance.

1. [Create a virtual network](#create-a-virtual-network-with-a-subnet) for use with your existing cache.

1. Open your cache in the portal and add the [subnet you created](#create-a-virtual-network-with-a-subnet) in the first step.

   After you create a private endpoint, follow these steps:

1. In the Azure portal, select the cache instance you want to add a private endpoint to.

1. Select **Private Endpoint** from the resource menu under **Administration** to create your private endpoint for your cache.

1. On the **Private endpoint** pane, select **+ Private Endpoint** to add the settings for your private endpoint.

   | Setting      | Suggested value  | Description |
   | ------------ |  ------- | -------------------------------------------------- |
   | **Subscription** | Drop down and select your subscription. | The subscription where you created your virtual network. |
   | **Resource group** | Drop down and select a resource group, or select **Create new** and enter a new resource group name. | Name for the resource group in which to create your private endpoint and other resources. By putting all your app resources in one resource group, you can easily manage or delete them together. |
   | **Name** | Enter a private endpoint name. | The name must: begin with a letter or number; end with a letter, number, or underscore; and can contain only letters, numbers, underscores, periods, or hyphens. |
   | **Network Interface Name** | Autogenerated based on the **Name**. | The name must: begin with a letter or number; end with a letter, number, or underscore; and can contain only letters, numbers, underscores, periods, or hyphens. |
   | **Region** | Drop down and select a region. | Select a [region](https://azure.microsoft.com/regions/) near other services that use your private endpoint. |

1. Select **Next: Resource** at the bottom of the pane.

1. In the **Resource** pane, select your **Subscription**.

    1. Choose the **Resource type** as `Microsoft.Cache/redisEnterprise`.
    1. Select the cache you want to connect the private endpoint to for the **Resource** property.

1. Select the **Next: Virtual Network** button at the bottom of the pane.

1. In the **Virtual Network** pane, select the **Virtual Network** and **Subnet** you created in the [previous section](#create-a-virtual-network-with-a-subnet).

1. Select the **Next: Tags** button at the bottom of the pane.

1. Optionally, in the **Tags** pane, enter the name and value if you wish to categorize the resource.

1. Select **Review + create**. You're taken to the **Review + create** pane where Azure validates your configuration.

1. After the green **Validation passed** message appears, select **Create**.

## Enabling public network access

With the `publicNetworkAccess` property, you can restrict public IP traffic independently of private links to virtual networks (VNets).

Previously, Azure Managed Redis was designed with two exclusive network configurations: enabling public traffic required private endpoints to be disabled; and enabling private endpoints automatically restricted all public access. This setting ensured clear network boundaries, but it limited flexibility for scenarios like migrations where both public and private access are needed simultaneously.

With `publicNetworkAccess`, the following network configurations are now supported:

- Public traffic without Private Links
- Public traffic with Private Links
- Private traffic without Private Links
- Private traffic with Private Links

Disabling `publicNetworkAccess` and protecting your cache by using a VNet along with a Private Endpoint and Private Links is the most secure option. A VNet enables network controls and adds an extra layer of security. Private Links restrict traffic to one-way communication from the virtual network, offering enhanced network isolation. Using a VNet means that even if the Azure Managed Redis resource is compromised, other resources within the virtual network remain secure.

### Updating a cache to use `publicNetworkAccess` by using the portal

Use the Azure portal to follow the instructions to add `publicNetworkAccess` to your existing cache.

1. Go to the [Azure portal](https://aka.ms/publicportal).

1. Browse to your **Azure Managed Redis resource \| Administration \| Networking** in the resource menu.

1. Select **Enable public access from all networks** to enable public access. To disable public access, select **Disable public access and use private access**.

   :::image type="content" source="media/private-link/public-access-setting.png" alt-text="Screenshot of the Azure portal showing the publicNetworkAccess property settings with options to disable or enable public network access." lightbox="media/private-link/public-access-setting.png":::

### API changes

The `publicNetworkAccess` property is introduced in [Microsoft.Cache redisEnterprise 2025-07-01](/rest/api/redis/redisenterprisecache/redis-enterprise/create?view=rest-redis-redisenterprisecache-2025-07-01&tabs=dotnet). Since this change is a security-related breaking change, API versions before 2025-07-01 will be deprecated in October 2026.

The value of `publicNetworkAccess` property is effectively NULL in caches created before 2025-07-01. Once you set the value to `Enabled` or `Disabled`, you can't reset it back to NULL.

After October 2026:

- You can only set `publicNetworkAccess` property by using API versions 2025-07-01 or later.
- You can no longer send API calls with versions before 2025-07-01.
- Your older caches provisioned with the older versions of the APIs continue to work, but other operations on it require calls to be made with API versions 2025-07-01 or later.

## Create an Azure Managed Redis cache connected to a private endpoint using Azure PowerShell

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

$redisCacheResourceId = "/subscriptions/$($SubscriptionId)/resourceGroups/$($ResourceGroupName)/providers/Microsoft.Cache/redisEnterprise/$($redisCacheName)"

$privateEndpointConnection = New-AzPrivateLinkServiceConnection -Name "myConnectionPS" -PrivateLinkServiceId $redisCacheResourceId -GroupId "redisEnterprise"
 
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

## Create an Azure Managed Redis cache connected to a private endpoint using Azure CLI

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

## Azure Managed Redis Private Endpoint Private DNS zone value

Your application should connect to `<cachename>.<region>.redis.azure.net` on port `10000`. A private DNS zone, named `*.privatelink.redis.azure.net`, is automatically created in your subscription. The private DNS zone is vital for establishing the TLS connection with the private endpoint. Avoid using `<cachename>.privatelink.redis.azure.net` in configuration for client connection.

For more information, see [Azure services DNS zone configuration](/azure/private-link/private-endpoint-dns).

## FAQ

- [Why can't I connect to a private endpoint?](#why-cant-i-connect-to-a-private-endpoint)
- [What features aren't supported with private endpoints?](#what-features-arent-supported-with-private-endpoints)
- [How do I verify if my private endpoint is configured correctly?](#how-do-i-verify-if-my-private-endpoint-is-configured-correctly)
- [How can I change my private endpoint to be disabled or enabled from public network access?](#how-can-i-change-my-private-endpoint-to-be-disabled-or-enabled-from-public-network-access)
- [How can I have multiple endpoints in different virtual networks?](#how-can-i-have-multiple-endpoints-in-different-virtual-networks)
- [What happens if I delete all the private endpoints on my cache?](#what-happens-if-i-delete-all-the-private-endpoints-on-my-cache)
- [Are network security groups (NSG) enabled for private endpoints?](#are-network-security-groups-nsg-enabled-for-private-endpoints)
- [My private endpoint instance isn't in my VNet, so how is it associated with my VNet?](#my-private-endpoint-instance-isnt-in-my-vnet-so-how-is-it-associated-with-my-vnet)

### Why can't I connect to a private endpoint?

- You can't use private endpoints with your cache instance if your cache is already a virtual network (VNet) injected cache.
  
- Azure Managed Redis caches are limited to 84 private links.

- You try to [persist data to storage account](how-to-persistence.md) where firewall rules are applied might prevent you from creating the Private Link.

- You might not connect to your private endpoint if your cache instance is using an [unsupported feature](#what-features-arent-supported-with-private-endpoints).

### What features aren't supported with private endpoints?

- There's no restriction for using private endpoint with Azure Managed Redis.

### How do I verify if my private endpoint is configured correctly?

Go to **Overview** in the Resource menu on the portal. You see the **Host name** for your cache in the working pane. To verify that the command resolves to the private IP address for the cache, run a command like `nslookup <hostname>` from within the VNet that is linked to the private endpoint.

### How can I change my private endpoint to be disabled or enabled from public network access?

To change the value in the Azure portal, follow these steps:

  1. In the Azure portal, search for **Azure Managed Redis**. Then, press enter or select it from the search suggestions.

  1. Select the cache instance you want to change the public network access value.

  1. On the left side of the screen, select **Private Endpoint**.

  1. Delete the private endpoint.

### How can I have multiple endpoints in different virtual networks?

To have multiple private endpoints in different virtual networks, you must manually configure the private DNS zone to the multiple virtual networks before creating the private endpoint. For more information, see [Azure Private Endpoint DNS configuration](/azure/private-link/private-endpoint-dns).

### What happens if I delete all the private endpoints on my cache?

If you delete all private endpoints on your Azure Managed Redis cache, networking defaults to have public network access.

### Are network security groups (NSG) enabled for private endpoints?

Network policies are disabled for private endpoints. To enforce Network Security Group (NSG) and User-Defined Route (UDR) rules on private endpoint traffic, you must enable network policies on the subnet. When network policies are disabled (required to deploy private endpoints), NSG and UDR rules don't apply to traffic processed by the private endpoint. For more information, see [Manage network policies for private endpoints](/azure/private-link/disable-private-endpoint-network-policy?tabs=network-policy-portal). NSG and UDR rules continue to apply normally to other workloads in the same subnet.

Traffic from client subnets to private endpoints uses a /32 prefix. To override this default routing behavior, create a corresponding UDR with a /32 route.

### My private endpoint instance isn't in my VNet, so how is it associated with my VNet?

Your private endpoint is only linked to your VNet. Because it's not in your VNet, you don't need to modify NSG rules for dependent endpoints.

## Related content

- For more information about Azure Private Link, see the [Azure Private Link documentation](/azure/private-link/private-link-overview).
- For a comparison of different network isolation options for your cache, see [Azure Cache for Redis network isolation options documentation](../azure-cache-for-redis/cache-network-isolation.md).
