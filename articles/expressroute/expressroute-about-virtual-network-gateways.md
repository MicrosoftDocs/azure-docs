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
   ms.date="09/20/2016"
   ms.author="cherylmc" />

# About virtual network gateways for ExpressRoute


A virtual network gateway is used to send network traffic between Azure virtual networks and on-premises locations. When you configure an ExpressRoute connection, you must create and configure a virtual network gateway and a virtual network gateway connection.

When you create a virtual network gateway, you specify several settings. One of the required settings specifies whether the gateway will be used for ExpressRoute or VPN Gateway traffic. In the Resource Manager deployment model, the setting is '-GatewayType'.

When network traffic is sent on a dedicated private connection, you use the gateway type 'ExpressRoute'. This is also referred to as an ExpressRoute gateway. When network traffic is sent encrypted across a public connection, you use the gateway type 'Vpn'. This is referred to as a VPN gateway. Site-to-Site, Point-to-Site, and VNet-to-VNet connections all use a VPN gateway. 

Each virtual network can have only one virtual network gateway per gateway type. For example, you can have one virtual network gateway that uses -GatewayType Vpn, and one that uses -GatewayType ExpressRoute. This article focuses on the ExpressRoute virtual network gateway.

## <a name="gwsku"></a>Gateway SKUs

[AZURE.INCLUDE [expressroute-gwsku-include](../../includes/expressroute-gwsku-include.md)]
>[AZURE.NOTE] The 'Basic' SKU cannot be used with ExpressRoute. 

If you use the Azure portal to create a Resource Manager virtual network gateway, the virtual network gateway is configured using the Standard SKU by default. Currently, you cannot specify other SKUs for the Resource Manager deployment model in the Azure portal. However, after creating your gateway, you can upgrade to a more powerful gateway SKU (for example, from Basic/Standard to HighPerformance) using the 'Resize-AzureRmVirtualNetworkGateway' PowerShell cmdlet.

<br>
###  <a name="aggthroughput"></a>Estimated aggregate throughput by SKU and gateway type


The following table shows the gateway types and the estimated aggregate throughput. This table applies to both the Resource Manager and classic deployment models.

[AZURE.INCLUDE [vpn-gateway-table-gwtype-aggthroughput](../../includes/vpn-gateway-table-gwtype-aggtput-include.md)] 


## <a name="resources"></a>REST APIs and PowerShell cmdlets

For additional technical resources and specific syntax requirements when using REST APIs and PowerShell cmdlets for virtual network gateway configurations, see the following pages:

|**Classic** | **Resource Manager**|
|-----|----|
|[PowerShell](https://msdn.microsoft.com/library/mt270335.aspx)|[PowerShell](https://msdn.microsoft.com/library/mt163510.aspx)|
|[REST API](https://msdn.microsoft.com/library/jj154113.aspx)|[REST API](https://msdn.microsoft.com/library/mt163859.aspx)|


## Next steps

See [ExpressRoute Overview](expressroute-introduction.md) for more information about available connection configurations. 







 
