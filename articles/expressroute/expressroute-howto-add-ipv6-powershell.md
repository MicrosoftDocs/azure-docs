---
title: 'Azure ExpressRoute: Add IPv6 support using Azure PowerShell'
description: Learn how to add IPv6 support to connect to Azure deployments using Azure PowerShell.
services: expressroute
author: duongau
ms.service: expressroute
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 03/02/2021
ms.author: duau
---

# Add IPv6 support for private peering using Azure PowerShell

This article describes how to add IPv6 support to connect via ExpressRoute to your resources in Azure using Azure PowerShell.

## Working with Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

[!INCLUDE [expressroute-cloudshell](../../includes/expressroute-cloudshell-powershell-about.md)]

## Add IPv6 Private Peering to your ExpressRoute circuit

1. [Create an ExpressRoute circuit](./expressroute-howto-circuit-arm.md) or use an existing circuit. Retrieve the circuit by running the **Get-AzExpressRouteCircuit** command:

    ```azurepowershell-interactive
    $ckt = Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"
    ```

2. Retrieve the private peering configuration for the circuit by running **Get-AzExpressRouteCircuitPeeringConfig**:

    ```azurepowershell-interactive
    Get-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt
    ```

3. Add an IPv6 Private Peering to your existing IPv4 Private Peering configuration. Provide a pair of /126 IPv6 subnets that you own for your primary link and secondary links. From each of these subnets, you will assign the first usable IP address to your router as Microsoft uses the second usable IP for its router.

    > [!Note]
    > The peer ASN and VlanId should match those in your IPv4 Private Peering configuration.

    ```azurepowershell-interactive
    Set-AzExpressRouteCircuitPeeringConfig -Name "AzurePrivatePeering" -ExpressRouteCircuit $ckt -PeeringType AzurePrivatePeering -PeerASN 100 -PrimaryPeerAddressPrefix "3FFE:FFFF:0:CD30::/126" -SecondaryPeerAddressPrefix "3FFE:FFFF:0:CD30::4/126" -VlanId 200 -PeerAddressType IPv6

    Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
    ```

4. After the configuration has been saved successfully, get the circuit again by running the **Get-AzExpressRouteCircuit** command. The response should look similar to the following example:

    ```azurepowershell
    Name                             : ExpressRouteARMCircuit
    ResourceGroupName                : ExpressRouteResourceGroup
    Location                         : eastus
    Id                               : /subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit
    Etag                             : W/"################################"
    ProvisioningState                : Succeeded
    Sku                              : {
                                         "Name": "Standard_MeteredData",
                                         "Tier": "Standard",
                                         "Family": "MeteredData"
                                       }
    CircuitProvisioningState         : Enabled
    ServiceProviderProvisioningState : Provisioned
    ServiceProviderNotes             :
    ServiceProviderProperties        : {
                                         "ServiceProviderName": "Equinix",
                                         "PeeringLocation": "Washington DC",
                                         "BandwidthInMbps": 50
                                       }
    ExpressRoutePort                 : null
    BandwidthInGbps                  :
    Stag                             : 29
    ServiceKey                       : **************************************
    Peerings                         : [
                                         {
                                           "Name": "AzurePrivatePeering",
                                           "Etag": "W/\"facc8972-995c-4861-a18d-9a82aaa7167e\"",
                                           "Id": "/subscriptions/***************************/resourceGroups/ExpressRouteResourceGroup/providers/Microsoft.Network/expressRouteCircuits/ExpressRouteARMCircuit/peerings/AzurePrivatePeering",
                                           "PeeringType": "AzurePrivatePeering",
                                           "State": "Enabled",
                                           "AzureASN": 12076,
                                           "PeerASN": 100,
                                           "PrimaryPeerAddressPrefix": "192.168.15.16/30",
                                           "SecondaryPeerAddressPrefix": "192.168.15.20/30",
                                           "PrimaryAzurePort": "",
                                           "SecondaryAzurePort": "",
                                           "VlanId": 200,
                                           "ProvisioningState": "Succeeded",
                                           "GatewayManagerEtag": "",
                                           "LastModifiedBy": "Customer",
                                           "Ipv6PeeringConfig": {
                                             "State": "Enabled",
                                             "PrimaryPeerAddressPrefix": "3FFE:FFFF:0:CD30::/126",
                                             "SecondaryPeerAddressPrefix": "3FFE:FFFF:0:CD30::4/126"
                                           },
                                           "Connections": [],
                                           "PeeredConnections": []
                                         },
                                       ]
    Authorizations                   : []
    AllowClassicOperations           : False
    GatewayManagerEtag               :
    ```

## Update your connection to an existing virtual network

Follow the steps below if you have an existing environment of Azure resources that you would like to use your IPv6 Private Peering with.

1. Retrieve the virtual network that your ExpressRoute circuit is connected to.

    ```azurepowershell-interactive
    $vnet = Get-AzVirtualNetwork -Name "VirtualNetwork" -ResourceGroupName "ExpressRouteResourceGroup"
    ```

2. Add an IPv6 address space to your virtual network.

    ```azurepowershell-interactive
    $vnet.AddressSpace.AddressPrefixes.add("ace:daa:daaa:deaa::/64")
    Set-AzVirtualNetwork -VirtualNetwork $vnet
    ```

3. Add IPv6 address space to your gateway subnet. The gateway IPv6 subnet should be /64 or larger.

    ```azurepowershell-interactive
    Set-AzVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet -AddressPrefix "10.0.0.0/26", "ace:daa:daaa:deaa::/64"
    Set-AzVirtualNetwork -VirtualNetwork $vnet
    ```

4. If you have an existing zone-redundant gateway, run the following to enable IPv6 connectivity (note that it may take up to 1 hour for changes to reflect). Otherwise, [create the virtual network gateway](./expressroute-howto-add-gateway-resource-manager.md) using any SKU. If you plan to use FastPath, use UltraPerformance or ErGw3AZ (note that this is only available for circuits using ExpressRoute Direct).

    ```azurepowershell-interactive
    $gw = Get-AzVirtualNetworkGateway -Name "GatewayName" -ResourceGroupName "ExpressRouteResourceGroup"
    Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw
    ```
>[!NOTE]
> If you have an existing gateway that is not zone-redundant (meaning it is Standard, High Performance, or Ultra Performance SKU), you will need to delete and [recreate the gateway](./expressroute-howto-add-gateway-resource-manager.md#add-a-gateway) using any SKU and a Standard, Static public IP address.

## Create a connection to a new virtual network

Follow the steps below if you plan to connect to a new set of Azure resources using your IPv6 Private Peering.

1. Create a dual-stack virtual network with both IPv4 and IPv6 address space. For more information, see [Create a virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network).

2. [Create the dual-stack gateway subnet](./expressroute-howto-add-gateway-resource-manager.md#add-a-gateway).

3. [Create the virtual network gateway](./expressroute-howto-add-gateway-resource-manager.md#add-a-gateway) using any SKU. If you plan to use FastPath, use UltraPerformance or ErGw3AZ (note that this is only available for circuits using ExpressRoute Direct).

4. [Link your virtual network to your ExpressRoute circuit](./expressroute-howto-linkvnet-arm.md).

## Limitations
While IPv6 support is available for connections to deployments in Public Azure regions, it does not support the following use cases:

* Connections to *existing* ExpressRoute gateways that are not zone-redundant. Note that *newly* created ExpressRoute gateways of any SKU (both zone-redundant and not) using  a Standard, Static IP address can be used for dual-stack ExpressRoute connections
* Global Reach connections between ExpressRoute circuits
* Use of ExpressRoute with virtual WAN
* FastPath with non-ExpressRoute Direct circuits
* FastPath with circuits in the following peering locations: Dubai
* Coexistence with VPN Gateway

## Next steps

To troubleshoot ExpressRoute problems, see the following articles:

* [Verifying ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
* [Troubleshooting network performance](expressroute-troubleshooting-network-performance.md)
