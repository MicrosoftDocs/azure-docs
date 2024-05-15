---
title: 'Azure VPN Gateway configuration settings'
description: Learn about VPN Gateway resources and configuration settings.
author: cherylmc
ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 02/29/2024
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell
ms.devlang: azurecli
---
# About VPN Gateway configuration settings

VPN gateway connection architecture relies on the configuration of multiple resources, each of which contains configurable settings. The sections in this article discuss the resources and settings that relate to a VPN gateway for a virtual network created in [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md). You can find descriptions and topology diagrams for each connection solution in the [VPN Gateway topology and design](design.md) article.

The values in this article specifically apply to VPN gateways (virtual network gateways that use the -GatewayType Vpn). If you're looking for information about the following types of gateways, see the following articles:

* For values that apply to -GatewayType 'ExpressRoute', see [Virtual network gateways for ExpressRoute](../expressroute/expressroute-about-virtual-network-gateways.md).
* For zone-redundant gateways, see [About zone-redundant gateways](about-zone-redundant-vnet-gateways.md).
* For active-active gateways, see [About highly available connectivity](vpn-gateway-highlyavailable.md).
* For Virtual WAN gateways, see [About Virtual WAN](../virtual-wan/virtual-wan-about.md).

## <a name="gwtype"></a>Gateways and gateway types

 A virtual network gateway is composed of two or more Azure-managed VMs that are automatically configured and deployed to a specific subnet that you create called the **gateway subnet**. The gateway VMs contain routing tables and run specific gateway services.

When you create a virtual network gateway, the gateway VMs are automatically deployed to the gateway subnet (always named *GatwaySubnet*), and configured with the settings that you specified. This process can take 45 minutes or more to complete, depending on the gateway SKU that you selected.

One of the settings that you specify when creating a virtual network gateway is the **gateway type**. The gateway type determines how the virtual network gateway is used and the actions that the gateway takes. A virtual network can have two virtual network gateways; one VPN gateway and one ExpressRoute gateway. The gateway type 'Vpn' specifies that the type of virtual network gateway created is a **VPN gateway**. This distinguishes it from an ExpressRoute gateway, which uses a different gateway type.

When you're creating a virtual network gateway, you must make sure that the gateway type is correct for your configuration. The available values for -GatewayType are:

* Vpn
* ExpressRoute

A VPN gateway requires the `-GatewayType` *Vpn*.

Example:

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name vnetgw1 -ResourceGroupName testrg `
-Location 'West US' -IpConfigurations $gwipconfig -GatewayType Vpn `
-VpnType RouteBased
```

## <a name="gwsku"></a>Gateway SKUs and performance

See [About Gateway SKUs](about-gateway-skus.md) article for the latest information about gateway SKUs, performance, and supported features.

## <a name="vpntype"></a>VPN types

Azure supports two different VPN types for VPN gateways: policy-based and route-based. Route-based VPN gateways are built on a different platform than policy-based VPN gateways. This results in different gateway specifications. In most cases, you'll create a route-based VPN gateway.

Previously, the older gateway SKUs didn't support IKEv1 for route-based gateways. Now, most of the current gateway SKUs support both IKEv1 and IKEv2. As of Oct 1, 2023, you can't create a policy-based VPN gateway through the Azure portal, only route-based gateways are available. If you want to create a policy-based gateway, use PowerShell or CLI.

If you already have a policy-based gateway, you aren't required to change your gateway to route-based unless you want to use a configuration that requires a route-based gateway, such as point-to-site. You can't convert a policy-based gateway to route-based. You must delete the existing gateway, and then create a new gateway as route-based.

[!INCLUDE [Route-based and policy-based table](../../includes/vpn-gateway-vpn-type-table.md)]

## <a name="connectiontype"></a>Connection types

In the [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md), each configuration requires a specific virtual network gateway connection type. The available Resource Manager PowerShell values for `-ConnectionType` are:

* IPsec
* Vnet2Vnet
* ExpressRoute
* VPNClient

In the following PowerShell example, we create a S2S connection that requires the connection type *IPsec*.

```azurepowershell-interactive
New-AzVirtualNetworkGatewayConnection -Name localtovon -ResourceGroupName testrg `
-Location 'West US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local `
-ConnectionType IPsec -SharedKey 'abc123'
```

## <a name="connectionmode"></a>Connection modes

[!INCLUDE [Connection modes](../../includes/vpn-gateway-connection-mode-include.md)]

## <a name="gwsub"></a>Gateway subnet

Before you create a VPN gateway, you must create a gateway subnet. The gateway subnet contains the IP addresses that the virtual network gateway VMs and services use. When you create your virtual network gateway, gateway VMs are deployed to the gateway subnet and configured with the required VPN gateway settings. Never deploy anything else (for example, more VMs) to the gateway subnet. The gateway subnet must be named 'GatewaySubnet' to work properly. Naming the gateway subnet 'GatewaySubnet' lets Azure know that this is the subnet to which it should deploy the virtual network gateway VMs and services.

When you create the gateway subnet, you specify the number of IP addresses that the subnet contains. The IP addresses in the gateway subnet are allocated to the gateway VMs and gateway services. Some configurations require more IP addresses than others.

When you're planning your gateway subnet size, refer to the documentation for the configuration that you're planning to create. For example, the ExpressRoute/VPN Gateway coexist configuration requires a larger gateway subnet than most other configurations. While it's possible to create a gateway subnet as small as /29 (applicable to the Basic SKU only), all other SKUs require a gateway subnet of size /27 or larger (/27, /26, /25 etc.). You might want to create a gateway subnet larger than /27 so that the subnet has enough IP addresses to accommodate possible future configurations.

The following Resource Manager PowerShell example shows a gateway subnet named GatewaySubnet. You can see the CIDR notation specifies a /27, which allows for enough IP addresses for most configurations that currently exist.

```azurepowershell-interactive
Add-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.3.0/27
```

Considerations:

[!INCLUDE [vpn-gateway-gwudr-warning.md](../../includes/vpn-gateway-gwudr-warning.md)]

## <a name="lng"></a>Local network gateways

A local network gateway is different than a virtual network gateway. When you're working with a VPN gateway site-to-site architecture, the local network gateway usually represents your on-premises network and the corresponding VPN device. In the classic deployment model, the local network gateway is referred to as a *Local Site*.

When you configure a local network gateway, you specify the name, the public IP address or the fully qualified domain name (FQDN) of the on-premises VPN device, and the address prefixes that are located on the on-premises location. Azure looks at the destination address prefixes for network traffic, consults the configuration that you specified for your local network gateway, and routes packets accordingly. If you use Border Gateway Protocol (BGP) on your VPN device, you provide the BGP peer IP address of your VPN device and the autonomous system number (ASN) of your on-premises network. You also specify local network gateways for VNet-to-VNet configurations that use a VPN gateway connection.

The following PowerShell example creates a new local network gateway:

```azurepowershell-interactive
New-AzLocalNetworkGateway -Name LocalSite -ResourceGroupName testrg `
-Location 'West US' -GatewayIpAddress '23.99.221.164' -AddressPrefix '10.5.51.0/24'
```

Sometimes you need to modify the local network gateway settings. For example, when you add or modify the address range, or if the IP address of the VPN device changes. For more information, see [Modify local network gateway settings](vpn-gateway-modify-local-network-gateway-portal.md).

## <a name="resources"></a>REST APIs, PowerShell cmdlets, and CLI

For technical resources and specific syntax requirements when using REST APIs, PowerShell cmdlets, or Azure CLI for VPN Gateway configurations, see the following pages:

| **Classic** | **Resource Manager** |
| --- | --- |
| [PowerShell](/powershell/module/az.network/#networking) |[PowerShell](/powershell/module/az.network#vpn) |
| [REST API](/previous-versions/azure/reference/jj154113(v=azure.100)) |[REST API](/rest/api/network/virtualnetworkgateways) |
| Not supported | [Azure CLI](/cli/azure/network/vnet-gateway)|

## Next steps

For more information about available connection configurations, see [About VPN Gateway](vpn-gateway-about-vpngateways.md).
