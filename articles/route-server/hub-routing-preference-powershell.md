---
title: Configure routing preference (preview) to influence route selection - PowerShell
titleSuffix: Azure Route Server
description: Learn how to configure routing preference (preview) in Azure Route Server using Azure PowerShell to influence its route selection.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 07/31/2023
---

# Configure routing preference to influence route selection using PowerShell

Learn how to use [routing preference (preview)](hub-routing-preference.md) setting in Azure Route Server to influence its route selection. 

> [!IMPORTANT]
> Routing preference is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure Cloud Shell or Azure PowerShell installed locally.

## Create a virtual network

Before you can create a virtual network, you have to create a resource group. Use [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup) to create the resource group. This example creates a resource group named **myResourceGroup** in the **EastUS** region.

Use [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) to create the virtual network. This example creates a virtual network named **myVirtualNetwork** in the **EastUS** region. You need a dedicated subnet called **RouteServerSubnet** for the Route Server. Use [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) to create the subnet configuration of RouteServerSubnet.

```azurepowershell-interactive
# Create a resource group.
New-AzResourceGroup -Name 'myResourceGroup' -Location 'EastUS'

# Create RouteServerSubnet configuration and place it into a variable.
$subnet = New-AzVirtualNetworkSubnetConfig -Name 'RouteServerSubnet' -AddressPrefix '10.0.1.0/24'

# Create the virtual network and place it into a variable.
$vnet = New-AzVirtualNetwork -Name 'myVirtualNetwork' -ResourceGroupName 'myResourceGroup' -Location 'EastUS' -AddressPrefix '10.0.0.0/16' -Subnet $subnet

# Place the subnet ID into a variable.
$subnetId = (Get-AzVirtualNetworkSubnetConfig -Name RouteServerSubnet -VirtualNetwork $vnet).Id
```

## Create the Route Server

Before you create the Route Server, create a standard public IP using [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress). Then use [New-AzRouteServer](/powershell/module/az.network/new-azrouteserver) to create the route server with a routing preference set to **VpnGateway**. When you choose VpnGateway as a routing preference, Route Server prefers routes learned through VPN/SD-WAN connections over routes learned through ExpressRoute.

```azurepowershell-interactive
# Create a standard public IP for the Route Server.
$publicIp = New-AzPublicIpAddress -Name 'RouteServerIP' -IpAddressVersion 'IPv4' -Sku 'Standard' -AllocationMethod 'Static' -ResourceGroupName 'myResourceGroup' -Location 'EastUS'

# Create a Route Server with routing preference set to VpnGateway
New-AzRouteServer -RouteServerName 'myRouteServer' -HubRoutingPreference 'VpnGateway' -HostedSubnet $subnetId -PublicIpAddress $publicIp -ResourceGroupName 'myResourceGroup' -Location 'EastUS'

# Create a Route Server with routing preference set to ExpressRoute
New-AzRouteServer -RouteServerName 'myRouteServer' -HubRoutingPreference 'ExpressRoute' -HostedSubnet $subnetId -PublicIpAddress $publicIp -ResourceGroupName 'myResourceGroup' -Location 'EastUS'

# Create a Route Server with routing preference set to ASPath
New-AzRouteServer -RouteServerName 'myRouteServer' -HubRoutingPreference 'ASPath' -HostedSubnet $subnetId -PublicIpAddress $publicIp -ResourceGroupName 'myResourceGroup' -Location 'EastUS'
```

## Update routing preference

To update the routing preference of an existing Route Server, use [Update-AzRouteServer](/powershell/module/az.network/update-azrouteserver). This example updates the routing preference to AS Path.

```azurepowershell-interactive
# Change the routing preference to AS Path.
Update-AzRouteServer -RouteServerName 'myRouteServer' -HubRoutingPreference 'ASPath' -ResourceGroupName 'myResourceGroup'

# Change the routing preference to VPN Gateway.
Update-AzRouteServer -RouteServerName 'myRouteServer' -HubRoutingPreference 'VPNGateway' -ResourceGroupName 'myResourceGroup'

# Change the routing preference to ExpressRoute.
Update-AzRouteServer -RouteServerName 'myRouteServer' -HubRoutingPreference 'ExpressRoute' -ResourceGroupName 'myResourceGroup'
```

## Next steps

- To learn more about configuring Azure Route Servers, see [Create and configure Route Server using Azure PowerShell](quickstart-configure-route-server-powershell.md).
- To learn more about Azure Route Server, see [Azure Route Server FAQ](route-server-faq.md).
