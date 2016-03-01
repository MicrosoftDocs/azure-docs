<properties 
   pageTitle="About VPN Gateways for Virtual Network cross-premises connectivity | Microsoft Azure"
   description="Learn about VPN gateways, which can be used for cross-premises connections for hybrid configurations. This article covers Gateway SKUs (Basic, Standard, and High Performance), VPN Gateway and ExpressRoute coexist configurations, gateway routing types (Static, Dynamic, Policy-based, Route-based), and gateway requirements for virtual network connectivity for both the classic and Resource Manager deployment models."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor="tysonn" />
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="02/19/2016"
   ms.author="cherylmc" />

# About VPN gateways

VPN Gateways are used to send network traffic between virtual networks and on-premises locations. They are also used to send traffic between multiple virtual networks within Azure (VNet-to-VNet). When creating a gateway, there are some factors to take into consideration. 

- The gateway SKU that you want to use
- The VPN type for your connection
- The VPN device, if required for your connection

**About deployment models**

[AZURE.INCLUDE [vpn-gateway-classic-rm](../../includes/vpn-gateway-classic-rm-include.md)] 
 

## Gateway SKUs

[AZURE.INCLUDE [vpn-gateway-table-sku](../../includes/vpn-gateway-table-sku-include.md)] 

## VPN gateway types

There are two VPN types:

- **Policy-based:** Policy-based gateways are called *Static Gateways* in the classic deployment model. The functionality of a static gateway has not changed, even though the name has changed. This type of gateway supports policy-based VPNs. Policy-based VPNs direct packets through IPsec tunnels with traffic selectors based on the combinations of address prefixes between your on-premises network and your Azure VNet. The traffic selectors or policies are usually defined as an access list in your VPN configurations.
 
- **Route-based:** Route-based gateways are called *Dynamic Gateways* in the classic deployment model. The functionality of a dynamic gateway has not changed, even though the name has changed. Route-based gateways implement route-based VPNs. Route-based VPNs use "routes" in the IP forwarding or routing table to direct packets into their corresponding VPN tunnel interfaces. The tunnel interfaces then encrypt or decrypt the packets in and out of the tunnels. The policy or traffic selector for route-based VPNs are configured as any-to-any (or wild cards).

Some connections, such as Point-to-Site and VNet-to-VNet, will only work with a specific VPN type. You'll see the gateway requirements listed in the article that corresponds to the connection scenario you want to create. 

VPN devices also have configuration limitations. When you create a VPN gateway, you'll select the VPN type that is required for your connection, making sure to verify that the VPN device you plan to use also supports that routing type. See [About VPN devices](vpn-gateway-about-vpn-devices.md) for more information.

For example, if you plan to use a Site-to-Site connection concurrently with a Point-to-Site connection, you’ll need to configure a route-based VPN gateway. While it's true that Site-to-Site connections will work with policy-based gateways, Point-to-Site connections require a route-based gateway type. Because both connections will go over the same gateway, you'll have to select the gateway type that supports both. Additionally, the VPN device you use must also support route-based configurations.


## Gateway requirements


[AZURE.INCLUDE [vpn-gateway-table-requirements](../../includes/vpn-gateway-table-requirements-include.md)] 

## Next steps

Select the VPN device for your configuration. See [About VPN devices](vpn-gateway-about-vpn-devices.md).





 
