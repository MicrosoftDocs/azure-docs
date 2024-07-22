---
title: 'Configure custom BGP communities for Azure ExpressRoute private peering'
description: Learn how to apply or update BGP community value for a new or an existing virtual network.
services: expressroute
author: duongau
ms.service: expressroute
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 09/05/2023
ms.author: duau
---

# Configure custom BGP communities for Azure ExpressRoute private peering

BGP communities are groupings of IP prefixes tagged with a community value. This value can be used to make routing decisions on the router's infrastructure. You can apply filters or specify routing preferences for traffic sent to your on-premises from Azure with BGP community tags. This article explains how to apply a custom BGP community value for your virtual networks using Azure PowerShell. Once configured, you can view the regional BGP community value and the custom community value of your virtual network. This value will be used for outbound traffic sent over ExpressRoute when originating from that virtual network.

## Prerequisites

* Review the [prerequisites](expressroute-prerequisites.md), [routing requirements](expressroute-routing.md), and [workflows](expressroute-workflows.md) before you begin configuration.

* You must have an active ExpressRoute circuit.
  * Follow the instructions to [create an ExpressRoute circuit](expressroute-howto-circuit-arm.md) and have the circuit enabled by your connectivity provider. 
  * Ensure that you have Azure private peering configured for your circuit. See the [configure routing](expressroute-howto-routing-arm.md) article for routing instructions. 
  * Ensure that Azure private peering gets configured and establishes BGP peering between your network and Microsoft for end-to-end connectivity.
  
### Working with Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

[!INCLUDE [expressroute-cloudshell](../../includes/expressroute-cloudshell-powershell-about.md)]

## Apply a custom BGP community value for a new virtual network

1. To start the configuration, sign in to your Azure account and select the subscription that you want to use.

   [!INCLUDE [sign in](../../includes/expressroute-cloud-shell-connect.md)]

1. Create a resource group to store the new virtual network.

    ```azurepowershell-interactive
    $rg = @{
        Name = 'myERRG'
        Location = 'WestUS'
    }
    New-AzResourceGroup @rg
    ```

1. Create a new virtual network with the `-BgpCommunity` flag to apply a BGP community value.

    ```azurepowershell-interactive
    $vnet = @{
        Name = 'myVirtualNetwork'
        ResourceGroupName = 'myERRG'
        Location = 'WestUS'
        AddressPrefix = '10.0.0.0/16'
        BgpCommunity = '12076:20001'    
    }
    New-AzVirtualNetwork @vnet
    ```
    
    > [!NOTE]
    > The `12076:` is required before your custom community value.
    >

1. Retrieve your virtual network and review its properties. You'll notice a *BgpCommunities* section that contains a **RegionalCommunity** value and a **VirtualNetworkCommunity** value. The *RegionalCommunity* value is predefined based on the Azure region of the virtual network. The *VirtualNetworkCommunity* value should match your custom definition.

    ```azurepowershell-interactive
    $virtualnetwork = @{
        Name = 'myVirtualNetwork'
        ResourceGroupName = 'myERRG'
    } 
    Get-AzVirtualNetwork @virtualnetwork
    ```

## Applying or updating the custom BGP value for an existing virtual network

1. Get the virtual network you want to apply or update the BGP community value and store it to a variable.

    ```azurepowershell-interactive
    $virtualnetwork = @{
        Name = 'myVirtualNetwork'
        ResourceGroupName = 'myERRG'
    } 
    $vnet = Get-AzVirtualNetwork @virtualnetwork
    ```

1. Update the `VirtualNetworkCommunity` value for your virtual network.

    ```azurepowershell-interactive
    $vnet.BgpCommunities = @{VirtualNetworkCommunity = '12076:20002'}
    $vnet | Set-AzVirtualNetwork
    ```

    > [!NOTE]
    > The `12076:` is required before your custom community value.
    >

1. Retrieve your virtual network and review its updated properties. The **RegionalCommunity** value is predefined based on the Azure region of the virtual network; to view the regional BGP community values for private peering, see [ExpressRoute routing requirements](./expressroute-routing.md#bgp). The **VirtualNetworkCommunity** value should match your custom definition.

    ```azurepowershell-interactive
    $virtualnetwork = @{
        Name = 'myVirtualNetwork'
        ResourceGroupName = 'myERRG'
    } 
    Get-AzVirtualNetwork @virtualnetwork
    ```


## Next steps

- [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md).
- [Troubleshoot your network performance](expressroute-troubleshooting-network-performance.md)
