<properties 
   pageTitle="About ExpressRoute virtual network gateways| Microsoft Azure"
   description="Learn about virtual network gateways for ExpressRoute."
   services="expressroute"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager, azure-service-management"/>
<tags 
   ms.service="expressroute"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="10/03/2016"
   ms.author="cherylmc" />

# About virtual network gateways for ExpressRoute


A virtual network gateway is used to send network traffic between Azure virtual networks and on-premises locations. When you configure an ExpressRoute connection, you must create and configure a virtual network gateway and a virtual network gateway connection.

When you create a virtual network gateway, you specify several settings. One of the required settings specifies whether the gateway will be used for ExpressRoute or Site-to-Site VPN traffic. In the Resource Manager deployment model, the setting is '-GatewayType'.

When network traffic is sent on a dedicated private connection, you use the gateway type 'ExpressRoute'. This is also referred to as an ExpressRoute gateway. When network traffic is sent encrypted across the public Internet, you use the gateway type 'Vpn'. This is referred to as a VPN gateway. Site-to-Site, Point-to-Site, and VNet-to-VNet connections all use a VPN gateway. 

Each virtual network can have only one virtual network gateway per gateway type. For example, you can have one virtual network gateway that uses -GatewayType Vpn, and one that uses -GatewayType ExpressRoute. This article focuses on the ExpressRoute virtual network gateway.

## <a name="gwsku"></a>Gateway SKUs

[AZURE.INCLUDE [expressroute-gwsku-include](../../includes/expressroute-gwsku-include.md)]

If you want to upgrade your gateway to a more powerful gateway SKU, in most cases you can use the 'Resize-AzureRmVirtualNetworkGateway' PowerShell cmdlet. This will work for upgrades to Standard and HighPerformance SKUs. However, to upgrade to the UltraPerformance SKU, you will need to recreate the gateway.

###  <a name="aggthroughput"></a>Estimated aggregate throughput by gateway SKU


The following table shows the gateway types and the estimated aggregate throughput. This table applies to both the Resource Manager and classic deployment models.

[AZURE.INCLUDE [expressroute-table-aggthroughput](../../includes/expressroute-table-aggtput-include.md)] 


## <a name="resources"></a>REST APIs and PowerShell cmdlets

For additional technical resources and specific syntax requirements when using REST APIs and PowerShell cmdlets for virtual network gateway configurations, see the following pages:

|**Classic** | **Resource Manager**|
|-----|----|
|[PowerShell](https://msdn.microsoft.com/library/mt270335.aspx)|[PowerShell](https://msdn.microsoft.com/library/mt163510.aspx)|
|[REST API](https://msdn.microsoft.com/library/jj154113.aspx)|[REST API](https://msdn.microsoft.com/library/mt163859.aspx)|


## Next steps

See [ExpressRoute Overview](expressroute-introduction.md) for more information about available connection configurations. 







 
