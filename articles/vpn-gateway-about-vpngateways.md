<properties 
   pageTitle="About VPN Gateways for Virtual Network | Microsoft Azure"
   description="Learn about basic, standard, and high performance gateway SKUs, VPN gateway/ExpressRoute coexist, static and dynamic gateway routing types, and gateway requirements for Virtual Network connectivity."
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
   ms.date="06/10/2015"
   ms.author="cherylmc" />

# About VPN gateways

VPN Gateways are used to send network traffic between virtual networks and on-premises locations, or between multiple VNets. When creating a gateway, there are a number of factors to take into consideration. You'll need to know which Gateway SKU your network plan requires, the routing type that is needed for your configuration - dynamic or static, and the VPN device that you plan to use. 

## Gateway SKUs
There are 3 VPN Gateway SKUs; Basic, Standard, and High Performance. The table below shows the gateway types and the estimated aggregate throughput. 
Pricing does differ between gateway SKUs. For information about pricing, see [VPN Gateway Pricing](http://azure.microsoft.com/pricing/details/vpn-gateway/).

| SKU         | VPN Gateway/ExpressRoute Co-exist | ExpressRoute Gateway Throughput | VPN Gateway Throughput | VPN Gateway Max IPsec Tunnels |
|-------------|-----------------------------------|---------------------------------|------------------------|-------------------------------|
| Basic       | No                                | 500 Mbps                        | 100 Mbps               | 10                            |
| Standard    | Yes                               | 1000 Mbps                       | 100 Mbps               | 10                            |
| High Performance | Yes                               | 2000 Mbps                       | 200 Mbps               | 30                            |

**Note:** The VPN throughput is a rough estimate based on the measurements between VNets in the same Azure region. It is not a guarantee of what you can get for cross premises connections across the Internet, but should be used as a maximum possible measure.

## Gateway types

When you create a site-to-site VPN, you’ll specify either a static, or dynamic routing gateway. Select the gateway type that is supported by your router and for the type of IPsec/IKE parameters and configuration that you require. The tables below show the supported configurations for both static and dynamic routing gateways. 

It's important to know what your networking plan is in advance. Some configurations require a specific gateway type. For example, if you plan to use a site-to-site configuration concurrently with a point-to-site configuration, you’ll need to configure a dynamic routing VPN gateway because point-to-site requires Azure dynamic routing gateway and they both will be using the same gateway. 

Additionally, you'll want to verify that your VPN device supports route-based VPNs (Azure dynamic routing gateway) configuration. If your device doesn't support route-based VPNs, you will have to reconsider your plan and use either a different VPN device, or move forward with a site-to-site configuration only. If you later acquire a VPN device that is capable of route-based VPNs, you can change the gateway type.

- **Static routing gateways –** Static routing gateways support policy-based VPNs. Policy-based VPNs direct packets through IPsec tunnels with traffic selectors based on the combinations of address prefixes between your on premises network and your Azure VNet. The traffic selectors or policies are usually defined as an access list in your VPN configurations.

>[AZURE.NOTE] Not all configurations are compatible with static routing VPN gateway. Multi-Site configurations, VNet-to-VNet configurations, and Point-to-Site connections all require Azure dynamic routing gateways. The gateway type is specified in their configuration instructions. 

- **Dynamic routing VPNs –** Dynamic routing gateways implement route-based VPNs. Route-based VPNs use "routes" in the IP forwarding or routing table to direct packets into their corresponding VPN tunnel interfaces. The tunnel interfaces then encrypt or decrypt the packets in and out of the tunnels. The policy or traffic selector for route-based VPNs are configured as any-to-any (or wild cards).

## <a id="bkmk_GatewayRequirements"></a> Gateway requirements

The table below lists the requirements for both static and dynamic VPN gateways.


| **Property**                            | **Static Routing VPN Gateway** | **Dynamic Routing VPN Gateway**                                       | **Standard VPN Gateway**          | **High Performance VPN Gateway** |
|-----------------------------------------|--------------------------------|-----------------------------------------------------------------------|-----------------------------------|----------------------------------|
|    Site-to-Site connectivity   (S2S)    | Policy-based VPN configuration | Route-based VPN configuration                                         | Route-based VPN configuration     | Route-based VPN configuration    |
| Point-to-Site connectivity (P2S)        | Not supported                  | Supported (Can coexist with S2S)                                      | Supported (Can coexist with S2S)  | Supported (Can coexist with S2S) |
| Authentication method                   |    Pre-shared key              | Pre-shared key for S2S connectivity Certificates for P2S connectivity | Pre-shared key for S2S connectivity Certificates for P2S connectivity | Pre-shared key for S2S connectivity Certificates for P2S connectivity |
| Maximum number of S2S connections       | 1                              | 10                                                                    | 10                                | 30                               |
| Maximum number of P2S connections       | Not supported                  | 128                                                                   | 128                               | 128                              |
| Active routing support (BGP)            | Not supported                  | Not supported                                                         | Not supported                     | Not supported                    |


## Next Steps

Select the VPN device for your configuration. See [About VPN Devices](http://go.microsoft.com/fwlink/p/?LinkID=615934).

Configure your virtual network. For cross-premises connections, see the following articles: 

- [Configure a Cross-Premises Site-to-Site connection to an Azure Virtual Network](vpn-gateway-site-to-site-create.md)
- [Configure a Point-to-Site VPN connection to an Azure Virtual Network](vpn-gateway-point-to-site-create.md)
- [Configure a Site-to-Site VPN using Windows Server 2012 Routing and Remote Access Service (RRAS)](https://msdn.microsoft.com/library/dn636917.aspx)

If you want to configure a VPN gateway, see [Configure a VPN gateway](http://go.microsoft.com/fwlink/p/?LinkId=615106).

If you want to change your VPN gateway type, see [Change a virtual network VPN gateway type](http://go.microsoft.com/fwlink/p/?LinkId=615109).

