---
title: 'Quickstart: Create an Azure Route Server using PowerShell'
description: Learn how to create and configure Azure Route Server with BGP peering to network virtual appliances using Azure PowerShell for dynamic routing in your virtual network.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: quickstart
ms.date: 09/17/2025
ms.custom: devx-track-azurepowershell, mode-api
---

# Quickstart: Create an Azure Route Server using PowerShell

This quickstart shows you how to create an Azure Route Server and configure BGP peering with a network virtual appliance (NVA) using Azure PowerShell. Azure Route Server enables dynamic routing between your virtual network and network virtual appliances, automatically exchanging routes through BGP protocols.

By completing this quickstart, you have a functioning Route Server that can facilitate dynamic route exchange with network virtual appliances in your Azure virtual network.

:::image type="content" source="./media/route-server-diagram.png" alt-text="Diagram showing Azure Route Server deployment environment with BGP peering to network virtual appliances using Azure PowerShell.":::

[!INCLUDE [route server preview note](../../includes/route-server-note-preview-date.md)]

## Prerequisites

Before you begin, ensure you have the following requirements:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Familiarity with [Azure Route Server service limits](route-server-faq.md#limitations).
- Access to Azure Cloud Shell or Azure PowerShell installed locally.

### Azure PowerShell setup

The steps in this article use Azure PowerShell cmdlets that you can run interactively in [Azure Cloud Shell](/azure/cloud-shell/overview). To use Cloud Shell, select **Open Cloud Shell** at the upper-right corner of a code block, then select **Copy** to copy the code and paste it into Cloud Shell.

Alternatively, you can [install Azure PowerShell locally](/powershell/azure/install-azure-powershell) and run the cmdlets from your local environment. If you use PowerShell locally, sign in to Azure using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

## Create a Route Server

This section walks you through creating the foundational infrastructure for Azure Route Server, including the resource group, virtual network, and Route Server instance.

 ### Create resource group and virtual network

Route Server requires a dedicated subnet named **RouteServerSubnet** with a minimum size of /26. First, create the resource group and virtual network infrastructure:

1. Create a resource group using the [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup) cmdlet:

    ```azurepowershell-interactive
    # Create a resource group
    New-AzResourceGroup -Name 'myResourceGroup' -Location 'EastUS'
    ```

1. Create a subnet configuration for **RouteServerSubnet** using the [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) cmdlet:

    ```azurepowershell-interactive
    # Create subnet configuration for Route Server
    $subnet = New-AzVirtualNetworkSubnetConfig -Name 'RouteServerSubnet' -AddressPrefix '10.0.1.0/26'
    ```

1. Create a virtual network using the [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) cmdlet:

    ```azurepowershell-interactive
    # Create a virtual network and store in a variable
    $vnet = New-AzVirtualNetwork -Name 'myVirtualNetwork' -ResourceGroupName 'myResourceGroup' -Location 'EastUS' -AddressPrefix '10.0.0.0/16' -Subnet $subnet
    
    # Store the subnet ID in a variable for later use
    $subnetId = (Get-AzVirtualNetworkSubnetConfig -Name 'RouteServerSubnet' -VirtualNetwork $vnet).Id
    ```

### Create public IP and Route Server

Route Server requires a public IP address to ensure connectivity to the backend management service:

1. Create a Standard public IP address using the [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) cmdlet:

    ```azurepowershell-interactive
    # Create a Standard public IP for Route Server
    $publicIp = New-AzPublicIpAddress -ResourceGroupName 'myResourceGroup' -Name 'myRouteServerIP' -Location 'EastUS' -AllocationMethod 'Static' -Sku 'Standard' -IpAddressVersion 'Ipv4'
    ```

1. Configure Route Server's capacity using the [New-AzVirtualRouterAutoScaleConfiguration](/powershell/module/az.network/new-azvirtualrouterautoscaleconfiguration) cmdlet. For more information, see [Route Server Capacity](route-server-capacity.md).
     ```azurepowershell-interactive
    $autoscale = New-AzVirtualRouterAutoScaleConfiguration -MinCapacity 4
    ```

1. Create the Route Server using the [New-AzRouteServer](/powershell/module/az.network/new-azrouteserver) cmdlet:

    ```azurepowershell-interactive
    # Create the Route Server
    New-AzRouteServer -RouteServerName 'myRouteServer' -ResourceGroupName 'myResourceGroup' -Location 'EastUS' -HostedSubnet $subnetId -PublicIP $publicIp -VirtualRouterAutoScaleConfiguration $autoscale
    ```

    [!INCLUDE [Deployment note](../../includes/route-server-note-creation-time.md)]

## Configure BGP peering with network virtual appliance

After creating the Route Server, configure BGP peering with your network virtual appliance to enable dynamic route exchange.

### Establish BGP peering

Use the [Add-AzRouteServerPeer](/powershell/module/az.network/add-azrouteserverpeer) cmdlet to create a BGP peering session between Route Server and your NVA:

```azurepowershell-interactive
# Create BGP peering with the network virtual appliance
Add-AzRouteServerPeer -ResourceGroupName 'myResourceGroup' -RouteServerName 'myRouteServer' -PeerName 'myNVA' -PeerAsn '65001' -PeerIp '10.0.0.4'
```

This command creates a peer named **myNVA** with:
- **Peer IP address**: 10.0.0.4 (the NVA's IP address)
- **Autonomous System Number (ASN)**: 65001 (see [supported ASN values](route-server-faq.md#what-autonomous-system-numbers-asns-can-i-use))

> [!NOTE]
> The peer name doesn't need to match the actual NVA name; it's just an identifier for the BGP peering session.

### Get Route Server BGP information

To complete the BGP peering configuration on your NVA, you need the Route Server's IP addresses and ASN. Use the [Get-AzRouteServer](/powershell/module/az.network/get-azrouteserver) cmdlet to retrieve this information:

```azurepowershell-interactive
# Get Route Server details for NVA configuration
Get-AzRouteServer -ResourceGroupName 'myResourceGroup' -RouteServerName 'myRouteServer'
```

The command returns output similar to the following example. Note the **RouteServerAsn** and **RouteServerIps** values needed for your NVA configuration:

```output
ResourceGroupName Name          Location RouteServerAsn RouteServerIps       ProvisioningState HubRoutingPreference AllowBranchToBranchTraffic
----------------- ----          -------- -------------- --------------       ----------------- -------------------- --------------------------
myResourceGroup   myRouteServer eastus   65515          {10.0.1.4, 10.0.1.5} Succeeded         ExpressRoute         False
```

Use these values to configure BGP on your NVA:
- **ASN**: 65515 (RouteServerAsn)
- **Peer IP addresses**: 10.0.1.4 and 10.0.1.5 (RouteServerIps)

[!INCLUDE [NVA peering note](../../includes/route-server-note-nva-peering.md)]

## Clean up resources

When you no longer need the Route Server and associated resources, delete the resource group using the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) cmdlet:

```azurepowershell-interactive
# Delete the resource group and all contained resources
Remove-AzResourceGroup -Name 'myResourceGroup' -Force
```

## Next step

Now that you've created a Route Server and established BGP peering, learn more about Route Server capabilities:

> [!div class="nextstepaction"]
> [Tutorial: Configure BGP peering between Route Server and network virtual appliance](peer-route-server-with-virtual-appliance.md)
