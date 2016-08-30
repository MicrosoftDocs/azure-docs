<properties 
   pageTitle="About VPN Gateway| Microsoft Azure"
   description="Learn about VPN Gateway connections for Azure Virtual Networks."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager,azure-service-management"/>
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/22/2016"
   ms.author="cherylmc" />

# About VPN Gateway


VPN Gateway is a collection of resources that are used to send network traffic between virtual networks and on-premises locations. Gateways are used for Site-to-Site, Point-to-Site, and ExpressRoute connections. VPN Gateway is also used to send traffic between multiple virtual networks within Azure (VNet-to-VNet). 

Each virtual network can have only one gateway per gateway type. For example, you can have only one virtual network gateway that uses `-GatewayType Vpn`, and one that uses `-GatewayType ExpressRoute`. To create a connection, you add virtual network gateway to a VNet and configure additional VPN Gateway resources and their settings. In some cases, the connection you create is a VPN connection. In other cases, your configuration does not require a VPN. The collection of resources is called "VPN Gateway" regardless of whether a VPN is required for your connection. 

For information regarding gateway requirements, see [Gateway Requirements](vpn-gateway-about-vpn-gateway-settings.md#requirements). For estimated aggregate throughput, see [About VPN Gateway Settings](vpn-gateway-about-vpn-gateway-settings.md#aggthroughput). For pricing, see [VPN Gateway Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway). For subscriptions and service limits, see [Networking Limits](../articles/azure-subscription-service-limits.md#networking-limits).

When you configure VPN Gateway, the instructions you use depend on the deployment model that you used to create your virtual network. For example, if you created your VNet using the classic deployment model, you use the guidelines and instructions for the classic deployment model to create and configure your VPN gateway settings. See [Understanding Resource Manager and classic deployment models](../resource-manager-deployment-model.md) for more information.

The sections below contain tables that list the following information for the configuration:

- available deployment model
- available configuration tools
- links that take you directly to an article, if available


Use the diagrams and descriptions to help select the configuration topology to match your requirements. The diagrams show the main baseline topologies, but it's possible to build more complex configurations using the diagrams as a guideline. Each configuration relies on the VPN Gateway settings you select.

### Configuring VPN Gateway settings

Because VPN Gateway is a collection of resources, you can configure some of the resources using one tool, and then switch to another to configure different resource settings. Currently, you can't configure every VPN gateway resource setting in the Azure portal. The instructions in the articles for each configuration specify if a specific tool is needed. If you are working with the classic deployment model, you might want to work in the classic portal or use PowerShell at this time. For information about the individual settings available, see [About VPN Gateway settings](vpn-gateway-about-vpn-gateway-settings.md).



## Site-to-Site and Multi-Site

### Site-to-Site

A Site-to-Site (S2S) connection is a connection over IPsec/IKE (IKEv1 or IKEv2) VPN tunnel. This type of connection requires a VPN device located on-premises that has a public IP address assigned to it and is not located behind a NAT. S2S connections can be used for cross-premises and hybrid configurations.   

![S2S connection](./media/vpn-gateway-about-vpngateways/demos2s.png "site-to-site")


### Multi-Site

You can create and configure a VPN connection between your VNet and multiple on-premises networks. When working with multiple connections, you must use a route-based VPN type (dynamic gateway for classic VNets). Because a VNet can only have one virtual network gateway, all connections through the gateway share the available bandwidth. This type of configuration is often called a "multi-site" connection.
 

![Multi-Site connection](./media/vpn-gateway-about-vpngateways/demomulti.png "multi-site")

### Deployment models and methods

[AZURE.INCLUDE [vpn-gateway-table-site-to-site](../../includes/vpn-gateway-table-site-to-site-include.md)] 

## VNet-to-VNet

Connecting a virtual network to another virtual network (VNet-to-VNet) is similar to connecting a VNet to an on-premises site location. Both connectivity types use an Azure VPN gateway to provide a secure tunnel using IPsec/IKE. You can even combine VNet-to-VNet communication with multi-site configurations. This lets you establish network topologies that combine cross-premises connectivity with inter-virtual network connectivity.

The VNets you connect can be:

- in the same or different regions
- in the same or different subscriptions 
- in the same different deployment models



![VNet to VNet connection](./media/vpn-gateway-about-vpngateways/demov2v.png "vnet-to-vnet")



### Connections between deployment models

Azure currently has two deployment models: classic and Resource Manager. If you have been using Azure for some time, you probably have Azure VMs and instance roles running in a classic VNet. Your newer VMs and role instances may be running in a VNet created in Resource Manager. You can create a connection between the VNets to allow the resources in one VNet to communicate directly with resources in another.


### Deployment models and methods

[AZURE.INCLUDE [vpn-gateway-table-vnet-to-vnet](../../includes/vpn-gateway-table-vnet-to-vnet-include.md)] 

### VNet peering

You may be able to use VNet peering to create your connection, as long as your virtual network configuration meets certain requirements. VNet peering does not use a virtual network gateway. [VNet peering](../virtual-network/virtual-network-peering-overview.md) is currently in Preview.



## Point-to-Site

A Point-to-Site (P2S) configuration allows you to create a secure connection to your virtual network from an individual client computer. P2S is a VPN connection over SSTP (Secure Socket Tunneling Protocol). P2S connections do not require a VPN device or a public-facing IP address to work. You establish the VPN connection by starting it from the client computer. This is a useful solution when you want to connect to your VNet from a remote location, such as from home or a conference, or when you only have a few clients that need to connect to a VNet. 


![Point-to-site connection](./media/vpn-gateway-about-vpngateways/demop2s.png "point-to-site")

### Deployment models and methods

[AZURE.INCLUDE [vpn-gateway-table-point-to-site](../../includes/vpn-gateway-table-point-to-site-include.md)] 


## ExpressRoute

[AZURE.INCLUDE [expressroute-intro](../../includes/expressroute-intro-include.md)]

For more information about ExpressRoute, see the [ExpressRoute technical overview](../expressroute/expressroute-introduction.md).


## Site-to-Site and ExpressRoute coexisting connections

ExpressRoute is a direct, dedicated connection from your WAN (not over the public Internet) to Microsoft Services, including Azure. Site-to-Site VPN traffic travels encrypted over the public Internet. Being able to configure Site-to-Site VPN and ExpressRoute connections for the same virtual network has several advantages. You can configure a Site-to-Site VPN as a secure failover path for ExpressRoute, or use Site-to-Site VPNs to connect to sites that are not part of your network, but that are connected through ExpressRoute. This configuration requires two gateways for the same virtual network, one using -GatewayType Vpn, and the other using -GatewayType ExpressRoute.


![Coexist connection](./media/vpn-gateway-about-vpngateways/demoer.png "expressroute-site2site")


### Deployment models and methods

[AZURE.INCLUDE [vpn-gateway-table-coexist](../../includes/vpn-gateway-table-coexist-include.md)] 


## Next steps

See the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md) for more information about VPN Gateways

Connect your on-premises location to a VNet. See [Create a Site-to-Site Connection](vpn-gateway-howto-site-to-site-resource-manager-portal.md).





 
