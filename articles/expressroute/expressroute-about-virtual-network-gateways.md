---
title: About Azure ExpressRoute virtual network gateways| Microsoft Docs
description: Learn about virtual network gateways for ExpressRoute.
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: conceptual
ms.date: 09/10/2018
ms.author: cherylmc

---
# About virtual network gateways for ExpressRoute
A virtual network gateway is used to send network traffic between Azure virtual networks and on-premises locations. You can use a virtual network gateway can be used for either ExpressRoute traffic, or VPN traffic. This article focuses on ExpressRoute virtual network gateways.

## Gateway types

When you create a virtual network gateway, you specify several settings. One of the required settings, '-GatewayType', specifies whether the gateway is used for ExpressRoute, or VPN traffic. The two gateway types are: 

* **Vpn** - To send encrypted traffic across the public Internet, you use the gateway type 'Vpn'. This is also referred to as a VPN gateway. Site-to-Site, Point-to-Site, and VNet-to-VNet connections all use a VPN gateway.

* **ExpressRoute** - To send network traffic on a private connection, you use the gateway type 'ExpressRoute'. This is also referred to as an ExpressRoute gateway and is the type of gateway that you use when configuring ExpressRoute.


Each virtual network can have only one virtual network gateway per gateway type. For example, you can have one virtual network gateway that uses -GatewayType Vpn, and one that uses -GatewayType ExpressRoute.

## <a name="gwsku"></a>Gateway SKUs
[!INCLUDE [expressroute-gwsku-include](../../includes/expressroute-gwsku-include.md)]

If you want to upgrade your gateway to a more powerful gateway SKU, in most cases you can use the 'Resize-AzureRmVirtualNetworkGateway' PowerShell cmdlet. This will work for upgrades to Standard and HighPerformance SKUs. However, to upgrade to the UltraPerformance SKU, you will need to recreate the gateway. Recreating a gateway incurs downtime.

### <a name="aggthroughput"></a>Estimated performances by gateway SKU
The following table shows the gateway types and the estimated performances. This table applies to both the Resource Manager and classic deployment models.

[!INCLUDE [expressroute-table-aggthroughput](../../includes/expressroute-table-aggtput-include.md)]

> [!IMPORTANT]
> Application performance depends on multiple factors, such as the end-to-end latency, and the number of traffic flows the application opens. The numbers in the table represent the upper limit that the application can theoretically achieve in an ideal environment. 
> 
>

### <a name="zrgw"></a>Zone-redundant gateway SKUs (Preview)

You can also deploy ExpressRoute gateways in Azure Availability Zones. This physically and logically separates them into different Availability Zones, protecting your on-premises network connectivity to Azure from zone-level failures.

![Zone-redundant ExpressRoute gateway](./media/expressroute-about-virtual-network-gateways/zone-redundant.png)

Zone-redundant gateways use specific new gateway SKUs for ExpressRoute gateway. The new SKUs are currently available in **Public Preview**.

* ErGw1AZ
* ErGw2AZ
* ErGw3AZ

The new gateway SKUs also support other deployment options to best match your needs. When creating a virtual network gateway using the new gateway SKUs, you also have the option to deploy the gateway in a specific zone. This is referred to as a zonal gateway. When you deploy a zonal gateway, all the instances of the gateway are deployed in the same Availability Zone. To enroll in the Preview, see [Create a zone-redundant virtual network gateway](../../articles/vpn-gateway/create-zone-redundant-vnet-gateway.md).

## <a name="resources"></a>REST APIs and PowerShell cmdlets
For additional technical resources and specific syntax requirements when using REST APIs and PowerShell cmdlets for virtual network gateway configurations, see the following pages:

| **Classic** | **Resource Manager** |
| --- | --- |
| [PowerShell](https://msdn.microsoft.com/library/mt270335.aspx) |[PowerShell](https://docs.microsoft.com/powershell/module/azurerm.network#networking) |
| [REST API](https://msdn.microsoft.com/library/jj154113.aspx) |[REST API](https://msdn.microsoft.com/library/mt163859.aspx) |

## Next steps
See [ExpressRoute Overview](expressroute-introduction.md) for more information about available connection configurations.

See [Create a virtual network gateway for ExpressRoute](expressroute-howto-add-gateway-resource-manager.md) for more information about creating ExpressRoute gateways.
