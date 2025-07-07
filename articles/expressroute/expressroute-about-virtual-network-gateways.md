---
title: About ExpressRoute Virtual Network Gateways
description: Learn about virtual network gateways for ExpressRoute, including their SKUs, types, and other specifications and features.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 08/19/2024
ms.author: duau
ms.custom: references_regions
---

# About ExpressRoute virtual network gateways

To connect your Azure virtual network (virtual network) and your on-premises network by using Azure ExpressRoute, you must first create a virtual network gateway. A virtual network gateway serves two purposes: to exchange IP routes between networks, and to route network traffic.

This article explains different gateway types, gateway SKUs, and estimated performance by SKU. This article also explains ExpressRoute [FastPath](#fastpath), a feature that enables the network traffic from your on-premises network to bypass the virtual network gateway to improve performance.

## Gateway types

When you create a virtual network gateway, you need to specify several settings. One of the required settings, `-GatewayType`, specifies whether the gateway is used for ExpressRoute or VPN traffic. The two gateway types are:

* `Vpn`: To send encrypted traffic across the public internet, use `Vpn` for `-GatewayType` (also called a VPN gateway). Site-to-site, point-to-site, and VNet-to-VNet connections all use a VPN gateway.

* `ExpressRoute`: To send network traffic on a private connection, use `ExpressRoute` for `-GatewayType` (also called an ExpressRoute gateway). This type of gateway is used when you're configuring ExpressRoute.

Each virtual network can have only one virtual network gateway per gateway type. For example, you can have one virtual network gateway that uses `Vpn` for `-GatewayType`, and one that uses `ExpressRoute` for `-GatewayType`.

## <a name="gwsku"></a>Gateway SKUs

[!INCLUDE [expressroute-gwsku-include](../../includes/expressroute-gwsku-include.md)]

You can upgrade your gateway to a higher-capacity SKU within the same SKU family that is Non-Az-enabled or Az-enabled gateway. 

For example, you can upgrade:
* From one Non-Az-enabled SKU to another Non-Az-enabled SKU
* From one Az-enabled SKU to another Az-enabled SKU

For all other downgrade scenarios, you need to delete and re-create the gateway, which incurs downtime.

## <a name="gwsub"></a>Gateway subnet creation

Before you create an ExpressRoute gateway, you must create a gateway subnet. The virtual network gateway virtual machines (VMs) and services use IP addresses that are contained in the gateway subnet.

When you create your virtual network gateway, gateway VMs are deployed to the gateway subnet and configured with the required ExpressRoute gateway settings. Never deploy anything else into the gateway subnet. The gateway subnet must be named "GatewaySubnet" to work properly, because doing so lets Azure know to deploy the virtual network gateway VMs and services into this subnet.

> [!NOTE]
> [!INCLUDE [vpn-gateway-gwudr-warning.md](../../includes/vpn-gateway-gwudr-warning.md)]
>
> * We don't recommend deploying Azure DNS Private Resolver into a virtual network that has an ExpressRoute virtual network gateway and setting wildcard rules to direct all name resolution to a specific DNS server. Such a configuration can cause management connectivity problems.

When you create the gateway subnet, you specify the number of IP addresses that the subnet contains. The IP addresses in the gateway subnet are allocated to the gateway VMs and gateway services. Some configurations require more IP addresses than others.

When you're planning your gateway subnet size, refer to the documentation for the configuration that you're planning to create. For example, the ExpressRoute/VPN gateway coexistence configuration requires a larger gateway subnet than most other configurations. Furthermore, you might want to make sure your gateway subnet contains enough IP addresses to accommodate possible future configurations.

We recommend that you create a gateway subnet of /27 or larger. If you plan to connect 16 ExpressRoute circuits to your gateway, you *must* create a gateway subnet of /26 or larger. If you're creating a dual stack gateway subnet, we recommend that you also use an IPv6 range of /64 or larger. This setup accommodates most configurations.

The following Azure Resource Manager PowerShell example shows a gateway subnet named GatewaySubnet. You can see that the Classless Interdomain Routing (CIDR) notation specifies a /27, which allows for enough IP addresses for most configurations that currently exist.

```azurepowershell-interactive
Add-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.3.0/27
```

[!INCLUDE [vpn-gateway-no-nsg](../../includes/vpn-gateway-no-nsg-include.md)]

## Virtual network gateway limitations and performance

### <a name="gatewayfeaturesupport"></a>Feature support by gateway SKU

The following table shows the features that each gateway type supports and the maximum number of ExpressRoute circuit connections that each gateway SKU supports.

| Gateway SKU | VPN gateway and ExpressRoute coexistence | FastPath | Maximum number of circuit connections |
|--|--|--|--|
| **Standard SKU/ERGw1Az** | Yes | No | 4 |
| **High Perf SKU/ERGw2Az** | Yes | No | 8 |
| **Ultra Performance SKU/ErGw3Az** | Yes | Yes | 16 |
| **ErGwScale (Preview)** | Yes | Yes - minimum 10 of scale units | 4 - minimum 1 of scale unit<br>8 - minimum of 2 scale units<br>16 - minimum of 10 scale units |

>[!NOTE]
> The maximum number of ExpressRoute circuits from the same peering location that can connect to the same virtual network is 4 for all gateways.

### <a name="aggthroughput"></a>Estimated performances by gateway SKU

[!INCLUDE [expressroute-gateway-performance-include](../../includes/expressroute-gateway-performance-include.md)]


## Hosted-On-Behalf-Of (HOBO) Public IP

The Hosted-On-Behalf-Of (HOBO) Public IP feature simplifies ExpressRoute gateway deployment by allowing Microsoft to manage the required public IP address on your behalf. With HOBO, you no longer need to create or maintain a separate public IP resource for your gateway.

**Key benefits:**

- **Improved security:** The public IP is managed internally by Microsoft and isn't exposed to you, reducing risks associated with open management ports.
- **Reduced complexity:** You aren't required to provision or manage a public IP resource.
- **Streamlined deployment:** The Azure portal and CLI no longer prompt for a public IP during gateway creation.

**How it works:**  
When you create an ExpressRoute gateway, Microsoft automatically provisions and manages the public IP address in a secure, backend subscription. This IP is encapsulated within the gateway resource, enabling Microsoft to enforce policies such as data rate limits and enhance auditability.

**Availability:**  
HOBO Public IP is currently in preview for ExpressRoute Virtual Network Gateways. It isn't available for Virtual WAN (vWAN) or Extended Zone deployments.


## Connectivity from VNet to VNet and from VNet to virtual WAN

By default, VNet-to-VNet and VNet-to-virtual-WAN connectivity is disabled through an ExpressRoute circuit for all gateway SKUs. To enable this connectivity, you must configure the ExpressRoute virtual network gateway to allow this traffic. For more information, see guidance about [virtual network connectivity over ExpressRoute](virtual-network-connectivity-guidance.md). To enable this traffic, see [Enable VNet-to-VNet or VNet-to-virtual-WAN connectivity through ExpressRoute](expressroute-howto-add-gateway-portal-resource-manager.md#enable-or-disable-vnet-to-vnet-or-vnet-to-virtual-wan-traffic-through-expressroute).

## <a name="fastpath"></a>FastPath

The ExpressRoute virtual network gateway is designed to exchange network routes and route network traffic. FastPath is designed to improve the data path performance between your on-premises network and your virtual network. When FastPath is enabled, it sends network traffic directly to virtual machines in the virtual network, bypassing the gateway.

For more information about FastPath, including limitations and requirements, see [About FastPath](about-fastpath.md).

## Connectivity to private endpoints

The ExpressRoute virtual network gateway facilitates connectivity to private endpoints deployed in the same virtual network as the virtual network gateway and across virtual network peers.

> [!IMPORTANT]
> * The throughput and control plane capacity for connectivity to private endpoint resources might be reduced by half compared to connectivity to non-private endpoint resources.
> * During a maintenance period, you might experience intermittent connectivity problems to private endpoint resources.
> * You need to ensure that on-premises configuration, including router and firewall settings, are correctly set up to ensure that packets for the IP 5-tuple transits use a single next hop (Microsoft Enterprise Edge router) unless there's a maintenance event. If your on-premises firewall or router configuration is causing the same IP 5-tuple to frequently switch next hops, you'll experience connectivity problems.

### Private endpoint connectivity and planned maintenance events

Private endpoint connectivity is stateful. When a connection to a private endpoint is established over ExpressRoute private peering, inbound and outbound connections are routed through one of the back-end instances of the gateway infrastructure. During a maintenance event, back-end instances of the virtual network gateway infrastructure are rebooted one at a time, which could lead to intermittent connectivity problems.

To avoid or minimize connectivity problems with private endpoints during maintenance activities, we recommend setting the TCP time-out value to fall between 15 and 30 seconds on your on-premises applications. Test and configure the optimal value based on your application requirements.

## <a name="resources"></a>REST APIs and PowerShell cmdlets

See the following pages for more technical resources and specific syntax requirements when you're using REST APIs and PowerShell cmdlets for virtual network gateway configurations:

| **Classic** | **Resource Manager** |
| --- | --- |
| [PowerShell](/powershell/module/servicemanagement/azure) |[PowerShell](/powershell/module/az.network#networking) |
| [REST API](/previous-versions/azure/reference/jj154113(v=azure.100)) |[REST API](/rest/api/virtual-network/) |

## VNet-to-VNet connectivity

By default, connectivity between virtual networks is enabled when you link multiple virtual networks to the same ExpressRoute circuit. We don't recommend using your ExpressRoute circuit for communication between virtual networks. Instead, we recommend that you use [virtual network peering](../virtual-network/virtual-network-peering-overview.md). For more information about why VNet-to-VNet connectivity isn't recommended over ExpressRoute, see [Connectivity between virtual networks over ExpressRoute](virtual-network-connectivity-guidance.md).

### Virtual network peering

A virtual network with an ExpressRoute gateway can have virtual network peering with up to 500 other virtual networks. Virtual network peering without an ExpressRoute gateway might have a higher peering limitation.

## Related content

* For more information about available connection configurations, see [ExpressRoute Overview](expressroute-introduction.md).

* For more information about creating ExpressRoute gateways, see [Create a virtual network gateway for ExpressRoute](expressroute-howto-add-gateway-resource-manager.md).

* For more information about how to deploy ErGwScale, see [Configure a virtual network gateway for ExpressRoute using the Azure portal](expressroute-howto-add-gateway-portal-resource-manager.md).

* For more information about configuring zone-redundant gateways, see [Create a zone-redundant virtual network gateway](../../articles/vpn-gateway/create-zone-redundant-vnet-gateway.md).

* For more information about FastPath, see [About FastPath](about-fastpath.md).
