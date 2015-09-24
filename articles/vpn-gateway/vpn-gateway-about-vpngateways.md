<properties 
   pageTitle="About VPN Gateways for Virtual Network | Microsoft Azure"
   description="Learn about Basic, Standard, and High Performance VPN Gateway SKUs, VPN Gateway and ExpressRoute coexist, Static and Dynamic gateway routing types, and gateway requirements for virtual network connectivity."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/13/2015"
   ms.author="cherylmc" />

# About VPN gateways

VPN Gateways are used to send network traffic between virtual networks and on-premises locations, or between multiple virtual networks (VNet-to-VNet). When creating a gateway, there are a number of factors to take into consideration. You'll need to know which Gateway SKU that you want to use, the routing type that is needed for your configuration (dynamic or static) and the VPN device that you plan to use if a VPN device is needed for your configuration. 

## Gateway SKUs
There are 3 VPN Gateway SKUs; Basic, Standard, and High Performance. The table below shows the gateway types and the estimated aggregate throughput. 
Pricing does differ between gateway SKUs. For information about pricing, see [VPN Gateway Pricing](http://azure.microsoft.com/pricing/details/vpn-gateway/).

| SKU         | VPN Gateway and ExpressRoute coexist | ExpressRoute Gateway throughput | VPN Gateway throughput | VPN Gateway max IPsec tunnels |
|-------------|-----------------------------------|---------------------------------|------------------------|-------------------------------|
| Basic       | No                                | 500 Mbps                        | 100 Mbps               | 10                            |
| Standard    | Yes                               | 1000 Mbps                       | 100 Mbps               | 10                            |
| High Performance | Yes                               | 2000 Mbps                       | 200 Mbps               | 30                            |

**Note:** The VPN throughput is a rough estimate based on the measurements between VNets in the same Azure region. It is not a guarantee of what you can get for cross-premises connections across the Internet, but should be used as a maximum possible measure.

## Gateway types

There are two gateway types, *static routing* (also known as a policy-based VPN), and *dynamic routing* (also known as a route-based VPN). Some configurations will only work with a specific routing type, while some VPN devices only work with a certain routing type. When you create a VPN gateway, you'll select the gateway type that is required for your configuration, making sure that the VPN device you select also supports that routing type. 

For example, if you plan to use a site-to-site configuration concurrently with a point-to-site configuration, you’ll need to configure a dynamic routing VPN gateway. While it's true that site-to-site configurations will work with static routing gateways, point-to-site configurations require a dynamic routing gateway. Because both connections will go over the same gateway, you'll have to select the gateway type that supports both configurations.

Additionally, you'll want to verify that your VPN device supports the type of gateway and the IPsec/IKE parameters and configuration that you require. For example, if you want to create a dynamic gateway and your VPN device doesn't support route-based VPNs, you will have to reconsider your plans. You can decide to either acquire a different VPN device that supports dynamic gateways, or create a VPN gateway connection that supports a static routing gateway. If you later acquire a VPN device that is capable of supporting a dynamic routing gateway, you can always recreate the gateway as dynamic to use the device. In that case, you'll need to only recreate the gateway. You won't need to recreate the virtual network.

Below are the two types of gateways:

- **Static routing –** Static routing gateways support **policy-based VPNs**. Policy-based VPNs direct packets through IPsec tunnels with traffic selectors based on the combinations of address prefixes between your on premises network and your Azure VNet. The traffic selectors or policies are usually defined as an access list in your VPN configurations.

	>[AZURE.NOTE] Not all configurations are compatible with static routing VPN gateways. For example, multi-site configurations, VNet-to-VNet configurations, and point-to-site connections all require dynamic routing gateways. You'll see the gateway requirements in the articles for each configuration. 

- **Dynamic routing –** Dynamic routing gateways implement **route-based VPNs**. Route-based VPNs use "routes" in the IP forwarding or routing table to direct packets into their corresponding VPN tunnel interfaces. The tunnel interfaces then encrypt or decrypt the packets in and out of the tunnels. The policy or traffic selector for route-based VPNs are configured as any-to-any (or wild cards).

## Gateway requirements

The table below lists the requirements for both static and dynamic VPN gateways.


| **Property**                            | **Static Routing VPN Gateway** | **Dynamic Routing VPN Gateway**                                       | **Standard VPN Gateway**          | **High Performance VPN Gateway** |
|-----------------------------------------|--------------------------------|-----------------------------------------------------------------------|-----------------------------------|----------------------------------|
|    Site-to-Site connectivity   (S2S)    | Policy-based VPN configuration | Route-based VPN configuration                                         | Route-based VPN configuration     | Route-based VPN configuration    |
| Point-to-Site connectivity (P2S)        | Not supported                  | Supported (Can coexist with S2S)                                      | Supported (Can coexist with S2S)  | Supported (Can coexist with S2S) |
| Authentication method                   |    Pre-shared key              | -Pre-shared key for S2S connectivity -Certificates for P2S connectivity | -Pre-shared key for S2S connectivity -Certificates for P2S connectivity | -Pre-shared key for S2S connectivity -Certificates for P2S connectivity |
| Maximum number of S2S connections       | 1                              | 10                                                                    | 10                                | 30                               |
| Maximum number of P2S connections       | Not supported                  | 128                                                                   | 128                               | 128                              |
| Active routing support (BGP)            | Not supported                  | Not supported                                                         | Not supported                     | Not supported                    |


## Next Steps

Select the VPN device for your configuration. See [About VPN devices](http://go.microsoft.com/fwlink/p/?LinkID=615934).

Configure your virtual network. For cross-premises connections, see the following articles: 

- [Configure a cross-premises site-to-site connection to an Azure Virtual Network](vpn-gateway-site-to-site-create.md)
- [Configure a point-to-site VPN connection to an Azure Virtual Network](vpn-gateway-point-to-site-create.md)
- [Configure a site-to-site VPN using Windows Server 2012 Routing and Remote Access Service (RRAS)](https://msdn.microsoft.com/library/dn636917.aspx)

If you want to configure a VPN gateway, see [Configure a VPN gateway](vpn-gateway-configure-vpn-gateway-mp.md).

If you want to change your VPN gateway type, see [Change a virtual network VPN gateway routing type](vpn-gateway-configure-vpn-gateway-mp.md).

If you want to connect multiple sites to a virtual network, see [Connect multiple on-premises sites to a virtual network](http://go.microsoft.com/fwlink/p/?LinkID=615106).

 
