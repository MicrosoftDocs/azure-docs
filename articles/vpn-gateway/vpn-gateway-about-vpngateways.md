<properties 
   pageTitle="About VPN Gateway| Microsoft Azure"
   description="Learn about VPN Gateway for Azure Virtual Network."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager,azure-service-management"/>
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/18/2016"
   ms.author="cherylmc" />

# About VPN Gateway

VPN Gateway is used to send network traffic between virtual networks and on-premises locations. It is also used to send traffic between multiple virtual networks within Azure (VNet-to-VNet). For connection diagrams, see [VPN Gateway connection topologies](vpn-gateway-topology.md). The sections below discuss the items that relate to VPN Gateway.

The instructions that you use to create your VPN gateway will depend on the deployment model that you used to create your virtual network. For example, if you created your VNet using the classic deployment model, you'll use the guidelines and instructions for the classic deployment model to create and configure your VPN gateway. You can't create a Resource Manager VPN gateway for a classic deployment model virtual network. 

See [Understanding Resource Manager and classic deployment models](../resource-manager-deployment-model.md) for more information about deployment models.


## <a name="gwsub"></a>Gateway subnet

To configure a VPN gateway, you first need to create a gateway subnet for your VNet. The gateway subnet must be named *GatewaySubnet* to work properly. This name allows Azure to know that this subnet should be used for the gateway.<BR>If you are using the classic portal, the gateway subnet is automatically named *Gateway* in the portal interface. This is specific to viewing the gateway subnet in the classic portal only. In this case, the subnet is actually created in Azure as *GatewaySubnet* and can be viewed this way in the Azure portal and in PowerShell.

The gateway subnet minimum size depends entirely on the configuration that you want to create. Although it is possible to create a gateway subnet as small as /29 for some configurations, we recommend that you create a gateway subnet of /28 or larger (/28, /27, /26, etc.). 

Creating a larger gateway size prevents you from running up against gateway size limitations. For example, if you created a gateway with a gateway subnet size /29 and you want to configure a Site-to-Site/ExpressRoute coexist configuration, you would have to delete the gateway, delete the gateway subnet, create the gateway subnet as a /28 or larger, and then recreate your gateway. 

By creating a gateway subnet of a larger size from the start, you can save time later when adding new configuration features to your network environment. 

The example below shows a gateway subnet named GatewaySubnet. You can see the CIDR notation specifies a /27, which allows for enough IP addresses for most configurations that exist at this time.

	Add-AzureRmVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.3.0/27

>[AZURE.IMPORTANT] Ensure that the GatewaySubnet does not have a Network Security Group (NSG) applied to it, as this may cause connections to fail.

## <a name="gwtype"></a>Gateway types

The gateway type specifies how the gateway itself connects and is a required configuration setting for the Resource Manager deployment model. Don't confuse gateway type with VPN type, which specifies the type of routing for your VPN. The available values for `-GatewayType` are: 

- Vpn
- ExpressRoute


This example for the Resource Manager deployment model specifies the -GatewayType as *Vpn*. When you are creating a gateway, you must make sure that the gateway type is correct for your configuration. 

	New-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg -Location 'West US' -IpConfigurations $gwipconfig -GatewayType Vpn -VpnType RouteBased

## <a name="gwsku"></a>Gateway SKUs

When you create a VPN gateway, you'll need to specify the gateway SKU that you want to use. There are 3 VPN Gateway SKUs:

- Basic
- Standard
- HighPerformance

The example below specifies the `-GatewaySku` as *Standard*.

	New-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg -Location 'West US' -IpConfigurations $gwipconfig -GatewaySku Standard -GatewayType Vpn -VpnType RouteBased

###  <a name="aggthroughput"></a>Estimated aggregate throughput by SKU and gateway type


The table below shows the gateway types and the estimated aggregate throughput. 
Pricing does differ between gateway SKUs. For information about pricing, see [VPN Gateway Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/). This table applies to both the Resource Manager and classic deployment models.

[AZURE.INCLUDE [vpn-gateway-table-gwtype-aggthroughput](../../includes/vpn-gateway-table-gwtype-aggtput-include.md)] 

## <a name="vpntype"></a>VPN types

Each configuration requires a specific VPN type in order to work. If you are combining two configurations, such as creating a Site-to-Site connection and a Point-to-Site connection to the same VNet, you must use a VPN type that satisfies both connection requirements. 

In the case of Point-to-Site and Site-to-Site coexisting connections, you must use a route-based VPN type when working with the Azure Resource Manager deployment model, or a dynamic gateway if you are working with the classic deployment mode.

When you create your configuration, you'll select the VPN type that is required for your connection. 

There are two VPN types:

[AZURE.INCLUDE [vpn-gateway-vpntype](../../includes/vpn-gateway-vpntype-include.md)]

This example for the Resource Manager deployment model specifies the `-VpnType` as *RouteBased*. When you are creating a gateway, you must make sure that the -VpnType is correct for your configuration. 

	New-AzureRmVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg -Location 'West US' -IpConfigurations $gwipconfig -GatewayType Vpn -VpnType RouteBased

## <a name="connectiontype"></a>Connection types

Each configuration requires a specific connection type. The available Resource Manager PowerShell values for `-ConnectionType` are:

- IPsec
- Vnet2Vnet
- ExpressRoute
- VPNClient

In the example below, we are creating a Site-to-Site connection, which requires the connection type "IPsec".

	New-AzureRmVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg -Location 'West US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'


## <a name="lng"></a>Local network gateways

The local network gateway typically refers to your on-premises location. In the classic deployment model, the local network gateway was referred to as a Local Site. You'll give the local network gateway a name, the public IP address of the on-premises VPN device, and specify the address prefixes that are located on the on-premises location. Azure will look at the destination address prefixes for network traffic, consult the configuration that you have specified for your local network gateway, and route packets accordingly. You can modify these address prefixes as needed.



### Modify address prefixes - Resource Manager

When modifying address prefixes, the procedure differs depending on whether you have already created your VPN gateway. See the article section [Modify address prefixes for a local network gateway](vpn-gateway-create-site-to-site-rm-powershell.md#modify).

In the example below, you can see a local network gateway named MyOnPremiseWest is being specified and will contain two IP address prefixes.

	New-AzureRmLocalNetworkGateway -Name MyOnPremisesWest -ResourceGroupName testrg -Location 'West US' -GatewayIpAddress '23.99.221.164' -AddressPrefix @('10.0.0.0/24','20.0.0.0/24')	

### Modify address prefixes - classic deployment

If you need to modify your local sites when using the classic deployment model, you can use the Local Networks configuration page in the classic portal, or modify the Network Configuration file, NETCFG.XML, directly.


##  <a name="devices"></a> VPN devices

You must make sure that the VPN device that you plan to use supports the VPN type required for your configuration. See [About VPN devices](vpn-gateway-about-vpn-devices.md) for more information about compatible VPN devices.

##  <a name="requirements"></a>Gateway requirements


[AZURE.INCLUDE [vpn-gateway-table-requirements](../../includes/vpn-gateway-table-requirements-include.md)] 


## Next steps

See  the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md) article for more information before moving forward with planning and designing your configuration.





 
