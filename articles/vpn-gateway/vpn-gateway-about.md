<properties 
   pageTitle="About secure cross-premises connectivity for virtual networks | Microsoft Azure"
   description="Learn about the types of secure cross-premises connections for virtual networks, including site-to-site, point-to-site, and ExpressRoute connections."
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
   ms.date="08/07/2015"
   ms.author="cherylmc" />

# About secure cross-premises connectivity for virtual networks

If you want to connect your on-premises sites securely to a virtual network, there are three options available: [Site-to-site](#site-to-site-connections), [Point-to-site](#point-to-site-connections), and [ExpressRoute](#expressroute-connections). 

The option you choose can depend on a variety of considerations, such as:


- What kind of throughput does your solution require?
- Do you want to communicate over the public Internet via secure VPN, or over a private connection?
- Do you have a public IP address available to use?
- Are you planning to use a VPN device? If so, is it compatible?
- Are you connecting just a few computers, or do you want a persistent connection for your site?
- What type of VPN gateway is required for the solution you want to create?

The table below can help you decide the best connectivity option for your solution.

| -                            | **Point-to-site**                                                                   | **Site-to-Site**                                                                                              | **ExpressRoute - EXP**                                                                                                                      | **ExpressRoute - NSP**                                                                                                                      |
|------------------------------|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| **Azure Supported Services** | Cloud ServicesVirtual Machines                                                  | Cloud Services Virtual Machines                                                                           | [Services list](../expressroute/expressroute-faqs.md#supported-azure-services)                                                                                                                | [Services list](../expressroute/expressroute-faqs.md#supported-azure-services)                                                                                                                |
| **Typical Bandwidths**       | Typically < 100 Mbps aggregate                                                  | Typically < 100 Mbps aggregate                                                                            | 200 Mbps, 500 Mbps, 1 Gbps and 10 Gbps                                                                                                  | 10 Mbps, 50 Mbps, 100 Mbps, 500 Mbps, 1 Gbps                                                                                            |
| **Protocols Supported**      | Secure Sockets Tunneling Protocol (SSTP)                                        | [IPsec](http://go.microsoft.com/fwlink/p/?LinkId=618592)                                                                       | Direct connection over VLANs                                                                                                            | NSP’s VPN technologies (MPLS, VPLS, …)                                                                                                  |
| **Routing**                  | Static                                                                          | Static – We support policy—based (static routing) and route-based (dynamic routing VPN)                   | BGP                                                                                                                                     | BGP                                                                                                                                     |
| **Connection resiliency**    | active-passive                                                                  | active-passive                                                                                            | active-active                                                                                                                           | active-active                                                                                                                           |
| **Typical use case**         | Prototyping, dev / test / lab scenarios for cloud services and virtual machines | Dev / test / lab scenarios and small scale production workloads for cloud services and virtual machines | Access to all Azure services (validated list), Enterprise-class and mission critical workloads, Backup, Big Data, Azure as a DR site | Access to all Azure services (validated list), Enterprise-class and mission critical workloads, Backup, Big Data, Azure as a DR site |
| **SLA**                      | [SLA](https://azure.microsoft.com/support/legal/sla/)                           | [SLA](https://azure.microsoft.com/support/legal/sla/)                                                     | [SLA](https://azure.microsoft.com/support/legal/sla/)                                                                                   | [SLA](https://azure.Microsoft.com/support/legal/sla/)                                                                                   |
| **Pricing**                  | [Pricing](http://azure.microsoft.com/pricing/details/vpn-gateway/)              | [Pricing](http://azure.microsoft.com/pricing/details/vpn-gateway/)                                             | [Pricing](http://azure.microsoft.com/pricing/details/expressroute/)                                                                           | [Pricing](http://azure.microsoft.com/pricing/details/expressroute/)                                                                           |
| **Technical Documentation**  | [VPN Gateway Documentation](https://azure.microsoft.com/documentation/services/vpn-gateway/)                                               | [VPN Gateway Documentation](https://azure.microsoft.com/documentation/services/vpn-gateway/)                                                                         | [ExpressRoute Documentation](https://azure.microsoft.com/documentation/services/expressroute/)                                                                                                      | [ExpressRoute Documentation](https://azure.microsoft.com/documentation/services/expressroute/)                                                                                                      |
| **FAQ**                      | [VPN Gateway FAQ](vpn-gateway-vpn-faq.md)                                                         | [VPN Gateway FAQ](vpn-gateway-vpn-faq.md)                                                                                   | [ExpressRoute FAQ](../expressroute/expressroute-faqs.md)                                                                                                                | [ExpressRoute FAQ](../expressroute/expressroute-faqs.md)                                                                                                                |
                                                                                 



## Site-to-site connections

A site-to-site VPN allows you to create a secure connection between your on-premises site and your virtual network. To create a site-to-site connection, a VPN device that is located on your on-premises network is configured to create a secure connection with the Azure VPN Gateway. Once the connection is created, resources on your local network and resources located in your virtual network can communicate directly and securely. Site-to-site connections do not require you to establish a separate connection for each client computer on your local network to access resources in the virtual network.

**Use a site-to-site connection when:**

- You want to create a hybrid solution.
- You want a connection between your on-premises location and your virtual network without requiring client-side configurations.
- You want a connection that is persistent. 

**Requirements**

- The on-premises VPN device must have an Internet-facing IPv4 IP address. This cannot be behind a NAT.
- You must have VPN device that is compatible. See [About VPN Devices](http://go.microsoft.com/fwlink/p/?LinkID=615099). 
- The VPN device you use must be compatible with the gateway type that is required for your solution. See [About VPN Gateways](vpn-gateway-about-vpngateways.md).
- The Gateway SKU will also impact aggregate throughput. See [Gateway SKUs](vpn-gateway-about-vpngateways.md#gateway-skus) for more information. 

For information about configuring a site-to-site VPN gateway connection, see [Configure a virtual network with a site-to-site VPN connection](vpn-gateway-site-to-site-create.md). 

If you want to create a site-to-site VPN gateway connection using RRAS, see [Configure a site-to-site VPN using Windows Server 2012 Routing and Remote Access Service (RRAS)](https://msdn.microsoft.com/library/dn636917.aspx).


## Point-to-site connections

A point-to-site VPN also allows you to create a secure connection to your virtual network. In a point-to-site configuration, the connection is configured individually on each client computer that you want to connect to the virtual network. Point-to-site connections do not require a VPN device. This type of connection uses a VPN client that you install on each client computer. The VPN is established by manually starting the connection from the on-premises client computer.

Point-to-site and site-to-site configurations can exist concurrently, but unlike site-to-site connections, point-to-site connections cannot be configured concurrently with an ExpressRoute connection to the same virtual network.

**Use a point-to-site connection when:**

- You only want to configure a few clients to connect to a virtual network.

- You want to connect to your virtual network from a remote location. For example, connecting from a coffee shop or a conference venue.

- You have a site-to-site connection, but have some clients that need to connect from a remote location.

- You do not have access to a VPN device that meets the minimum requirements for a site-to-site connection.

- You do not have an Internet facing IPv4 IP address for your VPN device.

For more information about configuring a point-to-site connection, see [Configure a point-to-site VPN connection to a virtual network](vpn-gateway-point-to-site-create.md).

## ExpressRoute connections

Azure ExpressRoute lets you create private connections between Azure datacenters and infrastructure that’s on your premises or in a co-location environment. ExpressRoute connections do not go over the public Internet and offer more reliability, faster speeds, lower latencies and higher security than typical connections over the Internet.

In some cases, using ExpressRoute connections to transfer data between on-premises and Azure can also yield significant cost benefits. With ExpressRoute, you can establish connections to Azure at an ExpressRoute location (Exchange Provider facility) or directly connect to Azure from your existing WAN network (such as a MPLS VPN) provided by a network service provider.

For more information about ExpressRoute, see the [ExpressRoute technical overview](../expressroute/expressroute-introduction.md).


## Next Steps

See the [ExpressRoute FAQ](../expressroute/expressroute-faqs.md) and the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md) for more information.



