---
title: 'Azure VPN Gateway: configuration settings'
description: Learn about VPN Gateway settings for Azure virtual network gateways.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 01/10/2020
ms.author: cherylmc

---
# About VPN Gateway configuration settings

A VPN gateway is a type of virtual network gateway that sends encrypted traffic between your virtual network and your on-premises location across a public connection. You can also use a VPN gateway to send traffic between virtual networks across the Azure backbone.

A VPN gateway connection relies on the configuration of multiple resources, each of which contains configurable settings. The sections in this article discuss the resources and settings that relate to a VPN gateway for a virtual network created in Resource Manager deployment model. You can find descriptions and topology diagrams for each connection solution in the [About VPN Gateway](vpn-gateway-about-vpngateways.md) article.

The values in this article apply VPN gateways (virtual network gateways that use the -GatewayType Vpn). This article does not cover all gateway types or zone-redundant gateways.

* For values that apply to -GatewayType 'ExpressRoute', see [Virtual Network Gateways for ExpressRoute](../expressroute/expressroute-about-virtual-network-gateways.md).

* For zone-redundant gateways, see [About zone-redundant gateways](about-zone-redundant-vnet-gateways.md).

* For Virtual WAN, see [About Virtual WAN](../virtual-wan/virtual-wan-about.md).



## <a name="gwtype"></a>Gateway types

Each virtual network can only have one virtual network gateway of each type. When you are creating a virtual network gateway, you must make sure that the gateway type is correct for your configuration.

The available values for -GatewayType are:

* Vpn
* ExpressRoute

A VPN gateway requires the `-GatewayType` *Vpn*.

Example:

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg `
-Location 'West US' -IpConfigurations $gwipconfig -GatewayType Vpn `
-VpnType RouteBased
```

## <a name="gwsku"></a>Gateway SKUs

[!INCLUDE [vpn-gateway-gwsku-include](../../includes/vpn-gateway-gwsku-include.md)]

### Configure a gateway SKU

#### Azure portal

If you use the Azure portal to create a Resource Manager virtual network gateway, you can select the gateway SKU by using the dropdown. The options you are presented with correspond to the Gateway type and VPN type that you select.

#### PowerShell

The following PowerShell example specifies the `-GatewaySku` as VpnGw1. When using PowerShell to create a gateway, you have to first create the IP configuration, then use a variable to refer to it. In this example, the configuration variable is $gwipconfig.

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name VNet1GW -ResourceGroupName TestRG1 `
-Location 'US East' -IpConfigurations $gwipconfig -GatewaySku VpnGw1 `
-GatewayType Vpn -VpnType RouteBased
```

#### Azure CLI

```azurecli
az network vnet-gateway create --name VNet1GW --public-ip-address VNet1GWPIP --resource-group TestRG1 --vnet VNet1 --gateway-type Vpn --vpn-type RouteBased --sku VpnGw1 --no-wait
```

###  <a name="resizechange"></a>Resizing or changing a SKU

If you have a VPN gateway and you want to use a different gateway SKU, your options are to either resize your gateway SKU, or to change to another SKU. When you change to another gateway SKU, you delete the existing gateway entirely and build a new one. A gateway can take up to 45 minutes to build. In comparison, when you resize a gateway SKU, there is not much downtime because you do not have to delete and rebuild the gateway. If you have the option to resize your gateway SKU, rather than change it, you will want to do that. However, there are rules regarding resizing:

1. With the exception of the Basic SKU, you can resize a VPN gateway SKU to another VPN gateway SKU within the same generation (Generation1 or Generation2). For example, VpnGw1 of Generation1 can be resized to VpnGw2 of Generation1 but not to VpnGw2 of Generation2.
2. When working with the old gateway SKUs, you can resize between Basic, Standard, and HighPerformance SKUs.
3. You **cannot** resize from Basic/Standard/HighPerformance SKUs to VpnGw SKUs. You must instead, [change](#change) to the new SKUs.

#### <a name="resizegwsku"></a>To resize a gateway

[!INCLUDE [Resize a SKU](../../includes/vpn-gateway-gwsku-resize-include.md)]

####  <a name="change"></a>To change from an old (legacy) SKU to a new SKU

[!INCLUDE [Change a SKU](../../includes/vpn-gateway-gwsku-change-legacy-sku-include.md)]

## <a name="connectiontype"></a>Connection types

In the Resource Manager deployment model, each configuration requires a specific virtual network gateway connection type. The available Resource Manager PowerShell values for `-ConnectionType` are:

* IPsec
* Vnet2Vnet
* ExpressRoute
* VPNClient

In the following PowerShell example, we create a S2S connection that requires the connection type *IPsec*.

```azurepowershell-interactive
New-AzVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg `
-Location 'West US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local `
-ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'
```

## <a name="vpntype"></a>VPN types

When you create the virtual network gateway for a VPN gateway configuration, you must specify a VPN type. The VPN type that you choose depends on the connection topology that you want to create. For example, a P2S connection requires a RouteBased VPN type. A VPN type can also depend on the hardware that you are using. S2S configurations require a VPN device. Some VPN devices only support a certain VPN type.

The VPN type you select must satisfy all the connection requirements for the solution you want to create. For example, if you want to create a S2S VPN gateway connection and a P2S VPN gateway connection for the same virtual network, you would use VPN type *RouteBased* because P2S requires a RouteBased VPN type. You would also need to verify that your VPN device supported a RouteBased VPN connection. 

Once a virtual network gateway has been created, you can't change the VPN type. You have to delete the virtual network gateway and create a new one. 
There are two VPN types:

[!INCLUDE [vpn-gateway-vpntype](../../includes/vpn-gateway-vpntype-include.md)]

The following PowerShell example specifies the `-VpnType` as *RouteBased*. When you are creating a gateway, you must make sure that the -VpnType is correct for your configuration.

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg `
-Location 'West US' -IpConfigurations $gwipconfig `
-GatewayType Vpn -VpnType RouteBased
```

## <a name="requirements"></a>Gateway requirements

[!INCLUDE [vpn-gateway-table-requirements](../../includes/vpn-gateway-table-requirements-include.md)]

## <a name="gwsub"></a>Gateway subnet

Before you create a VPN gateway, you must create a gateway subnet. The gateway subnet contains the IP addresses that the virtual network gateway VMs and services use. When you create your virtual network gateway, gateway VMs are deployed to the gateway subnet and configured with the required VPN gateway settings. Never deploy anything else (for example, additional VMs) to the gateway subnet. The gateway subnet must be named 'GatewaySubnet' to work properly. Naming the gateway subnet 'GatewaySubnet' lets Azure know that this is the subnet to deploy the virtual network gateway VMs and services to.

>[!NOTE]
>[!INCLUDE [vpn-gateway-gwudr-warning.md](../../includes/vpn-gateway-gwudr-warning.md)]
>

When you create the gateway subnet, you specify the number of IP addresses that the subnet contains. The IP addresses in the gateway subnet are allocated to the gateway VMs and gateway services. Some configurations require more IP addresses than others. 

When you are planning your gateway subnet size, refer to the documentation for the configuration that you are planning to create. For example, the ExpressRoute/VPN Gateway coexist configuration requires a larger gateway subnet than most other configurations. Additionally, you may want to make sure your gateway subnet contains enough IP addresses to accommodate possible future additional configurations. While you can create a gateway subnet as small as /29, we recommend that you create a gateway subnet of /27 or larger (/27, /26 etc.) if you have the available address space to do so. This will accommodate most configurations.

The following Resource Manager PowerShell example shows a gateway subnet named GatewaySubnet. You can see the CIDR notation specifies a /27, which allows for enough IP addresses for most configurations that currently exist.

```azurepowershell-interactive
Add-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.3.0/27
```

[!INCLUDE [vpn-gateway-no-nsg](../../includes/vpn-gateway-no-nsg-include.md)]

## <a name="lng"></a>Local network gateways

 A local network gateway is different than a virtual network gateway. When creating a VPN gateway configuration, the local network gateway usually represents your on-premises location. In the classic deployment model, the local network gateway was referred to as a Local Site.

You give the local network gateway a name, the public IP address of the on-premises VPN device, and specify the address prefixes that are located on the on-premises location. Azure looks at the destination address prefixes for network traffic, consults the configuration that you have specified for your local network gateway, and routes packets accordingly. You also specify local network gateways for VNet-to-VNet configurations that use a VPN gateway connection.

The following PowerShell example creates a new local network gateway:

```azurepowershell-interactive
New-AzLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg `
-Location 'West US' -GatewayIpAddress '23.99.221.164' -AddressPrefix '10.5.51.0/24'
```

Sometimes you need to modify the local network gateway settings. For example, when you add or modify the address range, or if the IP address of the VPN device changes. See [Modify local network gateway settings using PowerShell](vpn-gateway-modify-local-network-gateway.md).

## <a name="resources"></a>REST APIs, PowerShell cmdlets, and CLI

For additional technical resources and specific syntax requirements when using REST APIs, PowerShell cmdlets, or Azure CLI for VPN Gateway configurations, see the following pages:

| **Classic** | **Resource Manager** |
| --- | --- |
| [PowerShell](/powershell/module/az.network/#networking) |[PowerShell](/powershell/module/az.network#vpn) |
| [REST API](https://msdn.microsoft.com/library/jj154113) |[REST API](/rest/api/network/virtualnetworkgateways) |
| Not supported | [Azure CLI](/cli/azure/network/vnet-gateway)|

## Next steps

For more information about available connection configurations, see [About VPN Gateway](vpn-gateway-about-vpngateways.md).
