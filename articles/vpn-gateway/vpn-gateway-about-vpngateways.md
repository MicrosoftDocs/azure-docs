<properties 
   pageTitle="About VPN Gateways for Virtual Network cross-premises connectivity | Microsoft Azure"
   description="Learn about VPN gateways, which can be used for cross-premises connections for hybrid configurations. This article covers Gateway SKUs (Basic, Standard, and High Performance), VPN Gateway and ExpressRoute coexist configurations, gateway routing types (Static, Dynamic, Policy-based, Route-based), and gateway requirements for virtual network connectivity."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carolz"
   editor="tysonn" />
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="12/15/2015"
   ms.author="cherylmc" />

# About VPN gateways

VPN Gateways are used to send network traffic between virtual networks and on-premises locations (Site-to-Site, Point-to-Site, and ExpressRoute). They are also used to send traffic between multiple virtual networks within Azure (VNet-to-VNet). When creating a gateway, there are a number of factors to take into consideration. You'll need to know: 

- The Gateway SKU that you want to use
- The gateway routing type that is needed for your configuration
- The VPN device that you plan to use, if a VPN device is needed for your configuration

## Gateway SKUs

There are 3 VPN Gateway SKUs:

- Basic
- Standard
- High Performance

The table below shows the gateway types and the estimated aggregate throughput. 
Pricing does differ between gateway SKUs. For information about pricing, see [VPN Gateway Pricing](http://azure.microsoft.com/pricing/details/vpn-gateway/).

| SKU         | VPN Gateway and ExpressRoute coexist | ExpressRoute Gateway throughput | VPN Gateway throughput | VPN Gateway max IPsec tunnels |
|-------------|-----------------------------------|---------------------------------|------------------------|-------------------------------|
| Basic       | No                                | 500 Mbps                        | 100 Mbps               | 10                            |
| Standard    | Yes                               | 1000 Mbps                       | 100 Mbps               | 10                            |
| High Performance | Yes                               | 2000 Mbps                       | 200 Mbps               | 30                            |

**Note:** The VPN throughput is a rough estimate based on the measurements between VNets in the same Azure region. It is not a guarantee of what you can get for cross-premises connections across the Internet, but should be used as a maximum possible measure.

## Gateway routing types

There are two gateway types:

- Policy-based (also known as Static Gateways)
- Route-based (also known as Dynamic Gateways)

Some configurations (such as Point-to-Site and VNet-to-VNet) will only work with a specific gateway routing type, while some VPN devices are limited to certain routing type configurations. When you create a VPN gateway, you'll select the gateway routing type that is required for your configuration, making sure that the VPN device you select also supports that routing type. 

For example, if you plan to use a Site-to-Site configuration concurrently with a Point-to-Site configuration, you’ll need to configure a route-based VPN gateway. While it's true that Site-to-Site configurations will work with policy-based gateways, Point-to-Site configurations require a route-based gateway type. Because both connections will go over the same gateway, you'll have to select the gateway type that supports both configurations. The VPN device you use must also support route-based configurations.

Additionally, you'll want to verify that your VPN device supports the type of gateway and the IPsec/IKE parameters and configuration that you require. For example, if you want to create a route-based gateway and your VPN device doesn't support route-based VPNs, you will have to reconsider your plans. You can decide to either acquire a different VPN device that supports route-based gateways, or you can instead decide to create a VPN gateway connection that supports a policy-based gateways. If you later acquire a VPN device that is capable of supporting a route-based gateway, you can always recreate the gateway as route-based and configure the connection with the new VPN device. In that case, you'll need to only recreate the gateway. You won't need to recreate the entire virtual network.

Below are the two types of gateways:

- **Policy-based:** Policy-based gateways were previously called *Static Gateways*. The functionality of a static gateway has not changed with the name change. This type of gateway supports policy-based VPNs. Policy-based VPNs direct packets through IPsec tunnels with traffic selectors based on the combinations of address prefixes between your on premises network and your Azure VNet. The traffic selectors or policies are usually defined as an access list in your VPN configurations.

	>[AZURE.NOTE] Not all configurations are compatible with policy-based VPN gateways. For example, multi-site configurations, VNet-to-VNet configurations, and Point-to-Site connections all require route-based gateways. You'll see the gateway requirements in the articles for each configuration. 

- **Route-based:** Route-based gateways were previously called *Dynamic Gateways*. The functionality of a dynamic gateway has not changed with the name change. Route-based gateways implement route-based VPNs. Route-based VPNs use "routes" in the IP forwarding or routing table to direct packets into their corresponding VPN tunnel interfaces. The tunnel interfaces then encrypt or decrypt the packets in and out of the tunnels. The policy or traffic selector for route-based VPNs are configured as any-to-any (or wild cards).

## Gateway requirements

The table below lists the requirements for both static and dynamic VPN gateways.


| **Property**                            | **Policy-based VPN Gateway** | **Route-based VPN Gateway**                                       | **Standard VPN Gateway**          | **High Performance VPN Gateway** |
|-----------------------------------------|--------------------------------|-----------------------------------------------------------------------|-----------------------------------|----------------------------------|
|    Site-to-Site connectivity   (S2S)    | Policy-based VPN configuration | Route-based VPN configuration                                         | Route-based VPN configuration     | Route-based VPN configuration    |
| Point-to-Site connectivity (P2S)        | Not supported                  | Supported (Can coexist with S2S)                                      | Supported (Can coexist with S2S)  | Supported (Can coexist with S2S) |
| Authentication method                   |    Pre-shared key              | -Pre-shared key for S2S connectivity -Certificates for P2S connectivity | -Pre-shared key for S2S connectivity -Certificates for P2S connectivity | -Pre-shared key for S2S connectivity -Certificates for P2S connectivity |
| Maximum number of S2S connections       | 1                              | 10                                                                    | 10                                | 30                               |
| Maximum number of P2S connections       | Not supported                  | 128                                                                   | 128                               | 128                              |
| Active routing support (BGP)            | Not supported                  | Not supported                                                         | Not supported                     | Not supported                    |


## Next steps

Select the VPN device for your configuration. See [About VPN devices](vpn-gateway-about-vpn-devices.md).





 
