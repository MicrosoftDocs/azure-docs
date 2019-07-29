---
title: About ExpressRoute virtual network gateways - Azure| Microsoft Docs
description: Learn about virtual network gateways for ExpressRoute. This article includes information about gateway SKUs and types.
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: conceptual
ms.date: 05/20/2019
ms.author: mialdrid
ms.custom: seodec18

---
# ExpressRoute virtual network gateway and FastPath
To connect your Azure virtual network and your on-premises network via ExpressRoute, you must create a virtual network gateway first. A virtual network gateway serves two purposes: exchange IP routes between the networks and route network traffic. This article explains gateway types, gateway SKUs and estimated performance by SKU. This article also explains ExpressRoute [FastPath](#fastpath), a feature that enables the network traffic from your on-premises network to bypass the virtual network gateway to improve performance.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

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

### <a name="zrgw"></a>Zone-redundant gateway SKUs

You can also deploy ExpressRoute gateways in Azure Availability Zones. This physically and logically separates them into different Availability Zones, protecting your on-premises network connectivity to Azure from zone-level failures.

![Zone-redundant ExpressRoute gateway](./media/expressroute-about-virtual-network-gateways/zone-redundant.png)

Zone-redundant gateways use specific new gateway SKUs for ExpressRoute gateway.

* ErGw1AZ
* ErGw2AZ
* ErGw3AZ

The new gateway SKUs also support other deployment options to best match your needs. When creating a virtual network gateway using the new gateway SKUs, you also have the option to deploy the gateway in a specific zone. This is referred to as a zonal gateway. When you deploy a zonal gateway, all the instances of the gateway are deployed in the same Availability Zone.

## <a name="fastpath"></a>FastPath
ExpressRoute virtual network gateway is designed to exchange network routes and route network traffic. FastPath is designed to improve the data path performance between your on-premises network and your virtual network. When enabled, FastPath sends network traffic directly to virtual machines in the virtual network, bypassing the gateway. 

FastPath is available on [ExpressRoute Direct](expressroute-erdirect-about.md) only. In other words, you can enable this feature only if you [connect your virtual network](expressroute-howto-linkvnet-arm.md) to an ExpressRoute circuit created on an ExpressRoute Direct port. FastPath still requires a virtual network gateway to be created to exchange routes between virtual network and on-premises network. The virtual network gateway must be either Ultra Performance or ErGw3AZ.

FastPath doesn't support the following features:
* UDR on Gateway subnet: if you apply a UDR to the Gateway subnet of your virtual network the network traffic from your on-premises network will continue to be sent to the virtual network gateway.
* VNet Peering: if you have other virtual networks peered with the one that is connected to ExpressRoute the network traffic from your on-premises network to the other virtual networks (i.e. the so-called "Spoke" VNets) will continue to be sent to the virtual network gateway. The workaround is to connect all the virtual networks to the ExpressRoute circuit directly.

## <a name="resources"></a>REST APIs and PowerShell cmdlets
For additional technical resources and specific syntax requirements when using REST APIs and PowerShell cmdlets for virtual network gateway configurations, see the following pages:

| **Classic** | **Resource Manager** |
| --- | --- |
| [PowerShell](https://docs.microsoft.com/powershell/module/servicemanagement/azure/?view=azuresmps-4.0.0#azure) |[PowerShell](https://docs.microsoft.com/powershell/module/az.network#networking) |
| [REST API](https://msdn.microsoft.com/library/jj154113.aspx) |[REST API](https://msdn.microsoft.com/library/mt163859.aspx) |

## Next steps
See [ExpressRoute Overview](expressroute-introduction.md) for more information about available connection configurations.

See [Create a virtual network gateway for ExpressRoute](expressroute-howto-add-gateway-resource-manager.md) for more information about creating ExpressRoute gateways.

See [Create a zone-redundant virtual network gateway](../../articles/vpn-gateway/create-zone-redundant-vnet-gateway.md) for more information about configuring zone-redundant gateways.

See [Link virtual network to ExpressRoute](expressroute-howto-linkvnet-arm.md) for more information about how to enable FastPath. 
