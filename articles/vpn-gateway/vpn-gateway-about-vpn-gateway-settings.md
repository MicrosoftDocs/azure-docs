---
title: 'Azure VPN Gateway configuration settings'
description: Learn about VPN Gateway resources and configuration settings.
author: cherylmc
ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 10/05/2023
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli

---
# About VPN Gateway configuration settings

A VPN gateway is a type of virtual network gateway that sends encrypted traffic between your virtual network and your on-premises location across a public connection. You can also use a VPN gateway to send traffic between virtual networks across the Azure backbone.

VPN gateway connections rely on the configuration of multiple resources, each of which contains configurable settings. The sections in this article discuss the resources and settings that relate to a VPN gateway for a virtual network created in [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md). You can find descriptions and topology diagrams for each connection solution in the [VPN Gateway design](design.md) article.

The values in this article apply VPN gateways (virtual network gateways that use the -GatewayType Vpn). Additionally, this article covers many, but not all, gateway types and SKUs. See the following articles for information regarding gateways that use these specified settings:

* For values that apply to -GatewayType 'ExpressRoute', see [Virtual Network Gateways for ExpressRoute](../expressroute/expressroute-about-virtual-network-gateways.md).

* For zone-redundant gateways, see [About zone-redundant gateways](about-zone-redundant-vnet-gateways.md).

* For active-active gateways, see [About highly available connectivity](vpn-gateway-highlyavailable.md).

* For Virtual WAN, see [About Virtual WAN](../virtual-wan/virtual-wan-about.md).

## <a name="vpntype"></a>VPN types: Route-based and policy-based

Currently, Azure supports two gateway VPN types: route-based VPN gateways and policy-based VPN gateways. They're built on different internal platforms, which result in different specifications.

As of Oct 1, 2023, you can't create a policy-based VPN gateway through Azure portal. All new VPN gateways will automatically be created as route-based. If you already have a policy-based gateway, you don't need to upgrade your gateway to route-based. You can use Powershell/CLI to create the policy-based gateways.

Previously, the older gateway SKUs didn't support IKEv1 for route-based gateways. Now, most of the current gateway SKUs support both IKEv1 and IKEv2.

[!INCLUDE [Route-based and policy-based table](../../includes/vpn-gateway-vpn-type-table.md)]

## <a name="gwtype"></a>Gateway types

Each virtual network can only have one virtual network gateway of each type. When you're creating a virtual network gateway, you must make sure that the gateway type is correct for your configuration.

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

[!INCLUDE [gateway SKUs](../../includes/vpn-gateway-gwsku-include.md)]

### Configure a gateway SKU

**Azure portal**

If you use the Azure portal to create a Resource Manager virtual network gateway, you can select the gateway SKU by using the dropdown. The options you're presented with correspond to the Gateway type that you select. For steps, see [Create and manage a VPN gateway](tutorial-create-gateway-portal.md).

**PowerShell**

The following PowerShell example specifies the `-GatewaySku` as VpnGw1. When using PowerShell to create a gateway, you must first create the IP configuration, then use a variable to refer to it. In this example, the configuration variable is $gwipconfig.

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name VNet1GW -ResourceGroupName TestRG1 `
-Location 'US East' -IpConfigurations $gwipconfig -GatewaySku VpnGw1 `
-GatewayType Vpn -VpnType RouteBased
```

**Azure CLI**

```azurecli
az network vnet-gateway create --name VNet1GW --public-ip-address VNet1GWPIP --resource-group TestRG1 --vnet VNet1 --gateway-type Vpn --vpn-type RouteBased --sku VpnGw1 --no-wait
```

###  <a name="resizechange"></a>Resizing or changing a SKU

If you have a VPN gateway and you want to use a different gateway SKU, your options are to either resize your gateway SKU, or to change to another SKU. When you change to another gateway SKU, you delete the existing gateway entirely and build a new one. Creating a gateway can often take 45 minutes or more, depending on the selected gateway SKU. In comparison, when you resize a gateway SKU, there isn't much downtime because you don't have to delete and rebuild the gateway. While it's faster to resize your gateway SKU, there are rules regarding resizing:

1. Except for the Basic SKU, you can resize a VPN gateway SKU to another VPN gateway SKU within the same generation (Generation1 or Generation2) and SKU family (VpnGwx or VpnGwxAZ).
   * Example: VpnGw1 of Generation1 can be resized to VpnGw2 of Generation1, but can't be resized to VpnGw2 of Generation2. The gateway must instead be changed (deleted and rebuilt).
   * Example: VpnGw2 of Generation2 can't be resized to VpnGw2AZ of either Generation1 or Generation2 because the "AZ" gateways are [zone redundant](about-zone-redundant-vnet-gateways.md). To change to an AZ SKU, delete the gateway and rebuild it using the desired AZ SKU.
1. When working with older legacy SKUs:
   * You can resize between Standard and HighPerformance SKUs.
   * You **cannot** resize from Basic/Standard/HighPerformance SKUs to VpnGw SKUs. You must instead, [change](#change) to the new SKUs.

#### <a name="resizegwsku"></a>To resize a gateway

**Azure portal**

[!INCLUDE [Resize a SKU - portal](../../includes/vpn-gateway-resize-gw-portal-include.md)]

**PowerShell**

[!INCLUDE [Resize a SKU](../../includes/vpn-gateway-gwsku-resize-include.md)]

####  <a name="change"></a>To change from an old (legacy) SKU to a new SKU

[!INCLUDE [Change a SKU](../../includes/vpn-gateway-gwsku-change-legacy-sku-include.md)]

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

Before you create a VPN gateway, you must create a gateway subnet. The gateway subnet contains the IP addresses that the virtual network gateway VMs and services use. When you create your virtual network gateway, gateway VMs are deployed to the gateway subnet and configured with the required VPN gateway settings. Never deploy anything else (for example, additional VMs) to the gateway subnet. The gateway subnet must be named 'GatewaySubnet' to work properly. Naming the gateway subnet 'GatewaySubnet' lets Azure know that this is the subnet to which it should deploy the virtual network gateway VMs and services.

When you create the gateway subnet, you specify the number of IP addresses that the subnet contains. The IP addresses in the gateway subnet are allocated to the gateway VMs and gateway services. Some configurations require more IP addresses than others.

When you're planning your gateway subnet size, refer to the documentation for the configuration that you're planning to create. For example, the ExpressRoute/VPN Gateway coexist configuration requires a larger gateway subnet than most other configurations. While it's possible to create a gateway subnet as small as /29 (applicable to the Basic SKU only), all other SKUs require a gateway subnet of size /27 or larger (/27, /26, /25 etc.). You might want to create a gateway subnet larger than /27 so that the subnet has enough IP addresses to accommodate possible future configurations.

The following Resource Manager PowerShell example shows a gateway subnet named GatewaySubnet. You can see the CIDR notation specifies a /27, which allows for enough IP addresses for most configurations that currently exist.

```azurepowershell-interactive
Add-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.3.0/27
```

Considerations:

[!INCLUDE [vpn-gateway-gwudr-warning.md](../../includes/vpn-gateway-gwudr-warning.md)]

* When working with gateway subnets, avoid associating a network security group (NSG) to the gateway subnet. Associating a network security group to this subnet might cause your virtual network gateway (VPN and Express Route gateways) to stop functioning as expected. For more information about network security groups, see [What is a network security group?](../virtual-network/network-security-groups-overview.md).

## <a name="lng"></a>Local network gateways

A local network gateway is different than a virtual network gateway. When creating a VPN gateway configuration, the local network gateway usually represents your on-premises network and the corresponding VPN device. In the classic deployment model, the local network gateway was referred to as a Local Site.

When you configure a local network gateway, you specify the name, the public IP address or the fully qualified domain name (FQDN) of the on-premises VPN device, and the address prefixes that are located on the on-premises location. Azure looks at the destination address prefixes for network traffic, consults the configuration that you've specified for your local network gateway, and routes packets accordingly. If you use Border Gateway Protocol (BGP) on your VPN device, you provide the BGP peer IP address of your VPN device and the autonomous system number (ASN) of your on-premises network. You also specify local network gateways for VNet-to-VNet configurations that use a VPN gateway connection.

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
| [REST API](/previous-versions/azure/reference/jj154113(v=azure.100)) |[REST API](/rest/api/network/virtualnetworkgateways) |
| Not supported | [Azure CLI](/cli/azure/network/vnet-gateway)|

## Next steps

For more information about available connection configurations, see [About VPN Gateway](vpn-gateway-about-vpngateways.md).
