---
title: About ExpressRoute virtual network gateways - Azure| Microsoft Docs
description: Learn about virtual network gateways for ExpressRoute. This article includes information about gateway SKUs and types.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: conceptual
ms.date: 10/14/2019
ms.author: duau

---
# About ExpressRoute virtual network gateways

To connect your Azure virtual network and your on-premises network via ExpressRoute, you must create a virtual network gateway first. A virtual network gateway serves two purposes: exchange IP routes between the networks and route network traffic. This article explains gateway types, gateway SKUs, and estimated performance by SKU. This article also explains ExpressRoute [FastPath](#fastpath), a feature that enables the network traffic from your on-premises network to bypass the virtual network gateway to improve performance.

## Gateway types

When you create a virtual network gateway, you need to specify several settings. One of the required settings, '-GatewayType', specifies whether the gateway is used for ExpressRoute, or VPN traffic. The two gateway types are:

* **Vpn** - To send encrypted traffic across the public Internet, you use the gateway type 'Vpn'. This is also referred to as a VPN gateway. Site-to-Site, Point-to-Site, and VNet-to-VNet connections all use a VPN gateway.

* **ExpressRoute** - To send network traffic on a private connection, you use the gateway type 'ExpressRoute'. This is also referred to as an ExpressRoute gateway and is the type of gateway used when configuring ExpressRoute.

Each virtual network can have only one virtual network gateway per gateway type. For example, you can have one virtual network gateway that uses -GatewayType Vpn, and one that uses -GatewayType ExpressRoute.

## <a name="gwsku"></a>Gateway SKUs
[!INCLUDE [expressroute-gwsku-include](../../includes/expressroute-gwsku-include.md)]

If you want to upgrade your gateway to a more powerful gateway SKU, in most cases you can use the 'Resize-AzVirtualNetworkGateway' PowerShell cmdlet. This will work for upgrades to Standard and HighPerformance SKUs. However, to upgrade to the UltraPerformance SKU, you will need to recreate the gateway. Recreating a gateway incurs downtime.

### <a name="aggthroughput"></a>Estimated performances by gateway SKU
The following table shows the gateway types and the estimated performances. This table applies to both the Resource Manager and classic deployment models.

[!INCLUDE [expressroute-table-aggthroughput](../../includes/expressroute-table-aggtput-include.md)]

> [!IMPORTANT]
> Application performance depends on multiple factors, such as the end-to-end latency, and the number of traffic flows the application opens. The numbers in the table represent the upper limit that the application can theoretically achieve in an ideal environment.
>
>

> [!NOTE]
> The maximum number of ExpressRoute circuits from the same peering location that can connect to the same virtual network remains at 4.
>
>

## <a name="gwsub"></a>Gateway subnet

Before you create an ExpressRoute gateway, you must create a gateway subnet. The gateway subnet contains the IP addresses that the virtual network gateway VMs and services use. When you create your virtual network gateway, gateway VMs are deployed to the gateway subnet and configured with the required ExpressRoute gateway settings. Never deploy anything else (for example, additional VMs) to the gateway subnet. The gateway subnet must be named 'GatewaySubnet' to work properly. Naming the gateway subnet 'GatewaySubnet' lets Azure know that this is the subnet to deploy the virtual network gateway VMs and services to.

>[!NOTE]
>[!INCLUDE [vpn-gateway-gwudr-warning.md](../../includes/vpn-gateway-gwudr-warning.md)]
>

When you create the gateway subnet, you specify the number of IP addresses that the subnet contains. The IP addresses in the gateway subnet are allocated to the gateway VMs and gateway services. Some configurations require more IP addresses than others. 

When you are planning your gateway subnet size, refer to the documentation for the configuration that you are planning to create. For example, the ExpressRoute/VPN Gateway coexist configuration requires a larger gateway subnet than most other configurations. Additionally, you may want to make sure your gateway subnet contains enough IP addresses to accommodate possible future additional configurations. While you can create a gateway subnet as small as /29, we recommend that you create a gateway subnet of /27 or larger (/27, /26 etc.) if you have the available address space to do so. If you plan on connecting 16 ExpressRoute circuits to your gateway, you **must** create a gateway subnet of /26 or larger. If you are creating a dual stack gateway subnet, we recommend that you also use an IPv6 range of /64 or larger. This will accommodate most configurations.

The following Resource Manager PowerShell example shows a gateway subnet named GatewaySubnet. You can see the CIDR notation specifies a /27, which allows for enough IP addresses for most configurations that currently exist.

```azurepowershell-interactive
Add-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.0.3.0/27
```

[!INCLUDE [vpn-gateway-no-nsg](../../includes/vpn-gateway-no-nsg-include.md)]

### <a name="zrgw"></a>Zone-redundant gateway SKUs

You can also deploy ExpressRoute gateways in Azure Availability Zones. This physically and logically separates them into different Availability Zones, protecting your on-premises network connectivity to Azure from zone-level failures.

![Zone-redundant ExpressRoute gateway](./media/expressroute-about-virtual-network-gateways/zone-redundant.png)

Zone-redundant gateways use specific new gateway SKUs for ExpressRoute gateway.

* ErGw1AZ
* ErGw2AZ
* ErGw3AZ

The new gateway SKUs also support other deployment options to best match your needs. When creating a virtual network gateway using the new gateway SKUs, you also have the option to deploy the gateway in a specific zone. This is referred to as a zonal gateway. When you deploy a zonal gateway, all the instances of the gateway are deployed in the same Availability Zone.

> [!IMPORTANT]
> If you plan to use IPv6-based private peering over ExpressRoute, make sure to select an AZ SKU for the gateway you deploy in a dual stack gateway subnet.
> 
>

## <a name="fastpath"></a>FastPath

ExpressRoute virtual network gateway is designed to exchange network routes and route network traffic. FastPath is designed to improve the data path performance between your on-premises network and your virtual network. When enabled, FastPath sends network traffic directly to virtual machines in the virtual network, bypassing the gateway.

For more information about FastPath, including limitations and requirements, see [About FastPath](about-fastpath.md).

## <a name="resources"></a>REST APIs and PowerShell cmdlets
For additional technical resources and specific syntax requirements when using REST APIs and PowerShell cmdlets for virtual network gateway configurations, see the following pages:

| **Classic** | **Resource Manager** |
| --- | --- |
| [PowerShell](/powershell/module/servicemanagement/azure.service/#azure) |[PowerShell](/powershell/module/az.network#networking) |
| [REST API](/previous-versions/azure/reference/jj154113(v=azure.100)) |[REST API](/rest/api/virtual-network/) |

## Next steps

For more information about available connection configurations, see [ExpressRoute Overview](expressroute-introduction.md).

For more information about creating ExpressRoute gateways, see [Create a virtual network gateway for ExpressRoute](expressroute-howto-add-gateway-resource-manager.md).

For more information about configuring zone-redundant gateways, see [Create a zone-redundant virtual network gateway](../../articles/vpn-gateway/create-zone-redundant-vnet-gateway.md).

For more information about FastPath, see [About FastPath](about-fastpath.md).
