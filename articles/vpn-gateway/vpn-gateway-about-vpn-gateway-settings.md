---
title: VPN gateway settings for cross-premises Azure connections | Microsoft Docs
description: Learn about VPN Gateway settings for Azure virtual network gateways.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: ae665bc5-0089-45d0-a0d5-bc0ab4e79899
ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/06/2017
ms.author: cherylmc

---
# About VPN Gateway configuration settings
A VPN gateway is a type of virtual network gateway that sends encrypted traffic between your virtual network and your on-premises location across a public connection. You can also use a VPN gateway to send traffic between virtual networks across the Azure backbone.

A VPN gateway connection relies on the configuration of multiple resources, each of which contains configurable settings. The sections in this article discuss the resources and settings that relate to a VPN gateway for a virtual network created in Resource Manager deployment model. You can find descriptions and topology diagrams for each connection solution in the [About VPN Gateway](vpn-gateway-about-vpngateways.md) article.  

## <a name="gwtype"></a>Gateway types
Each virtual network can only have one virtual network gateway of each type. When you are creating a virtual network gateway, you must make sure that the gateway type is correct for your configuration.

The available values for -GatewayType are: 

* Vpn
* ExpressRoute

A VPN gateway requires the `-GatewayType` *Vpn*.  

Example:

    New-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg `
    -Location 'West US' -IpConfigurations $gwipconfig -GatewayType Vpn `
    -VpnType RouteBased
    
## <a name="gwsku"></a>Gateway SKUs

[!INCLUDE [vpn-gateway-gwsku-include](../../includes/vpn-gateway-gwsku-include.md)]

### Configure the gateway SKU
####Azure portal

If you use the Azure portal to create a Resource Manager virtual network gateway, you can select the gateway SKU by using the dropdown. The options you are presented with correspond to the Gateway type and VPN type that you select.

####PowerShell

The following PowerShell example specifies the `-GatewaySku` as VpnGw1.

    New-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg `
    -Location 'West US' -IpConfigurations $gwipconfig -GatewaySku VpnGw1 `
    -GatewayType Vpn -VpnType RouteBased

####Change (resize) a gateway SKU

If you want to upgrade your gateway SKU to a more powerful SKU, you can use the `Resize-AzureRmVirtualNetworkGateway` PowerShell cmdlet. You can also downgrade the gateway SKU size using this cmdlet.

The following PowerShell example shows a gateway SKU being resized to VpnGw2.

    $gw = Get-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg
    Resize-AzureRmVirtualNetworkGateway -VirtualNetworkGateway $gw -GatewaySku VpnGw2

## <a name="connectiontype"></a>Connection types
In the Resource Manager deployment model, each configuration requires a specific virtual network gateway connection type. The available Resource Manager PowerShell values for `-ConnectionType` are:

* IPsec
* Vnet2Vnet
* ExpressRoute
* VPNClient

In the following PowerShell example, we create a S2S connection that requires the connection type *IPsec*.

    New-AzureRmVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg `
    -Location 'West US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local `
    -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'


## <a name="vpntype"></a>VPN types
When you create the virtual network gateway for a VPN gateway configuration, you must specify a VPN type. The VPN type that you choose depends on the connection topology that you want to create. For example, a P2S connection requires a RouteBased VPN type. A VPN type can also depend on the hardware that you will be using. S2S configurations require a VPN device. Some VPN devices only support a certain VPN type.

The VPN type you select must satisfy all the connection requirements for the solution you want to create. For example, if you want to create a S2S VPN gateway connection and a P2S VPN gateway connection for the same virtual network, you would use VPN type *RouteBased* because P2S requires a RouteBased VPN type. You would also need to verify that your VPN device supported a RouteBased VPN connection. 

Once a virtual network gateway has been created, you can't change the VPN type. You have to delete the virtual network gateway and create a new one. 
There are two VPN types:

[!INCLUDE [vpn-gateway-vpntype](../../includes/vpn-gateway-vpntype-include.md)]

The following PowerShell example specifies the `-VpnType` as *RouteBased*. When you are creating a gateway, you must make sure that the -VpnType is correct for your configuration. 

    New-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg `
    -Location 'West US' -IpConfigurations $gwipconfig `
    -GatewayType Vpn -VpnType RouteBased

## <a name="requirements"></a>Gateway requirements
[!INCLUDE [vpn-gateway-table-requirements](../../includes/vpn-gateway-table-requirements-include.md)]

## <a name="gwsub"></a>Gateway subnet
In order to configure a virtual network gateway for your VNet, you'll need to create a gateway subnet. The gateway subnet contains the IP addresses that the virtual network gateway services use. The gateway subnet must be named *GatewaySubnet* to work properly. This name lets Azure know that this subnet should be used for the gateway.

When you create the gateway subnet, you specify the number of IP addresses that the subnet contains. The IP addresses in the gateway subnet are allocated to the gateway service. Some configurations require more IP addresses to be allocated to the gateway service than do others. You want to make sure your gateway subnet contains enough IP addresses to accommodate future growth and possible additional new connection configurations. So, while you can create a gateway subnet as small as /29, we recommend that you create a gateway subnet of /28 or larger (/28, /27, /26 etc.). Look at the requirements for the configuration that you want to create and verify that the gateway subnet that you have will meet those requirements.

The following Resource Manager PowerShell example shows a gateway subnet named GatewaySubnet. You can see the CIDR notation specifies a /27, which allows for enough IP addresses for most configurations that currently exist.

    Add-AzureRmVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.3.0/27

[!INCLUDE [vpn-gateway-no-nsg](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name="lng"></a>Local network gateways
When creating a VPN gateway configuration, the local network gateway often represents your on-premises location. In the classic deployment model, the local network gateway was referred to as a Local Site. 

You give the local network gateway a name, the public IP address of the on-premises VPN device, and specify the address prefixes that are located on the on-premises location. Azure looks at the destination address prefixes for network traffic, consults the configuration that you have specified for your local network gateway, and routes packets accordingly. You also specify local network gateways for VNet-to-VNet configurations that use a VPN gateway connection.

The following PowerShell example creates a new local network gateway:

    New-AzureRmLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg `
    -Location 'West US' -GatewayIpAddress '23.99.221.164' -AddressPrefix '10.5.51.0/24'

Sometimes you need to modify the local network gateway settings. For example, when you add or modify the address range, or if the IP address of the VPN device changes. For a classic VNet, you can change these settings in the classic portal on the Local Networks page. For Resource Manager, see [Modify local network gateway settings using PowerShell](vpn-gateway-modify-local-network-gateway.md).

## <a name="resources"></a>REST APIs and PowerShell cmdlets
For additional technical resources and specific syntax requirements when using REST APIs, PowerShell cmdlets, or Azure CLI for VPN Gateway configurations, see the following pages:

| **Classic** | **Resource Manager** |
| --- | --- |
| [PowerShell](/powershell/module/azure#networking) |[PowerShell](/powershell/module/azurerm.network#vpn) |
| [REST API](https://msdn.microsoft.com/library/jj154113) |[REST API](/rest/api/network/virtualnetworkgateways) |
| | [Azure CLI](/cli/azure/network/vnet-gateway)|

## Next steps
See [About VPN Gateway](vpn-gateway-about-vpngateways.md) for more information about available connection configurations. 

