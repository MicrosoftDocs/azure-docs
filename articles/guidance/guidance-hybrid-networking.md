<properties
   pageTitle="Creating hybrid networks with Azure | Microsoft Azure"
   description="Explains and compares the different methods available for establishing secure, robust network connections between the on-premises infrastructure and Azure.."
   services=""
   documentationCenter="na"
   authors="telmosampaio"
   manager="christb"
   editor=""
   tags=""/>
<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/28/2016"
   ms.author="telmosampaio"/>
   
# Creating Hybrid Networks with Azure

Many organizations have an existing on-premises infrastructure that they wish to integrate with Azure. This enables organizations to migrate existing applications to the cloud, and also to take advantage of the scalability, availability, security, and other enterprise features that Azure offers for new applications. The key part of this scenario is understanding how to establish a secure and robust network connection between your organization and Azure.

This article describes some common options for meeting the challenges posed by this scenario, and helps you determine which solution will best meet your needs based on your requirements.

## Using a virtual private network connection

You can use [Azure VPN Gateway][azure-vpn-gateway] to create a virtual private network (VPN) connection for sending network traffic between Azure virtual networks and on-premises locations. The network traffic flows between the on-premises network and an Azure Virtual Network (VNet) through an IPSec VPN tunnel.

[![0]][0]

This architecture is suitable for hybrid applications with the following characteristics:

- Parts of the application run on-premises while others run in Azure.

- The traffic between on-premises hardware and the cloud is likely to be light, or it is beneficial to trade slightly extended latency for the flexibility and processing power of the cloud.

- The extended network constitutes a closed system. There is no direct path from the Internet to the Azure VNet.

- Users connect to the on-premises network to use the services hosted in Azure. The bridge between the on-premises network and the services running in Azure is transparent to users.

Benefits of using a VPN connection:

- Simple to configure.

- Microsoft guarantee 99.9% availability for each VPN Gateway. Note that this SLA only covers the VPN gateway, and not your network connection to the gateway.

Points to consider when using a VPN connection:

- Requires an on-premises VPN device.

- A VPN connection over Azure VPN Gateway currently supports a maximum of 200 Mbps bandwidth. You may need to partition your Azure virtual network across multiple VPN connections if you expect to exceed this throughput.

For detailed information, read [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][hybrid-network-vpn].

## Using an Azure ExpressRoute connection

ExpressRoute connections are high bandwidth network connections that use a private dedicated link made through a third-party connectivity provider. The private connection extends your on-premises network into Azure providing access to your own IaaS infrastructure in Azure, public endpoints used in PaaS services, and Office365 SaaS services.

[![1]][1]

Typical use cases for this architecture include:

- Hybrid applications where workloads are distributed between an on-premises network and Azure.

- Applications running large-scale, mission-critical workloads that require a high degree of scalability.

- Large-scale backup and restore facilities for data that must be saved off-site.

- Handling Big Data workloads.

- Using Azure as a disaster-recovery site.

Benefits of using an ExpressRoute connections:

- Much higher bandwidth available; up to 10 Gbps depending on the connectivity provider.

- Supports dynamic scaling of bandwidth to help reduce costs during periods of lower demand. Note that not all connectivity providers have this option.

- May allow your organization direct access to national clouds, depending on the connectivity provider.

- 99.9% availability SLA.

Considerations for using an ExpressRoute connection:

- Can be complex to set up. Creating an ExpressRoute connection requires working with a third-party connectivity provider. The provider is responsible for provisioning the network connection.

- Requires high bandwidth routers on-premises.

For information on how to configure an ExpressRoute connection, see [Implementing a hybrid network architecture with Azure ExpressRoute][hybrid-network-expressroute].

## Using Azure VPN Gateway to provide a failover connection for Azure ExpressRoute

Any network can suffer outages. If you are running mission critical services in Azure, you will require a fallback position, possibly with reduced bandwidth. For example, you can provide a VPN connection alongside an ExpressRoute circuit. Under normal circumstances, the traffic flows between the on-premises network and an Azure virtual network through the ExpressRoute connection.  If there is a loss of connectivity in the ExpressRoute circuit, traffic will be routed through an IPSec VPN tunnel instead.

[![2]][2]

Benefits of using a failover VPN connection:

- High availability in the event of an ExpressRoute circuit failure, although the fallback connection is on a lower bandwidth network.

Considerations for using a failover VPN connection:

- Complex to configure. You need to set up a VPN connection and an ExpressRoute circuit.

- Requires redundant hardware (VPN appliances), and a redundant Azure VPN Gateway connection for which you pay charges.

The document [Implementing a highly available hybrid network architecture][hybrid-network-expressroute-failover] describes how to implement this approach in more detail.

## Next steps

The resources below explain how to implement the architectures described in this article.

- [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][hybrid-network-vpn]

- [Implementing a hybrid network architecture with Azure ExpressRoute][hybrid-network-expressroute]

- [Implementing a highly available hybrid network architecture][hybrid-network-expressroute-failover]

<!-- Links -->
[0]: ./media/guidance-hybrid-network/figure1.png "Hybrid network connection using Azure VPN Gateway"
[1]: ./media/guidance-hybrid-network/figure2.png "Hybrid network connection using Azure ExpressRoute"
[2]: ./media/guidance-hybrid-network/figure3.png "Highly avaiolable hybrid network connection using Azure ExpressRoute and Azure VPN Gateway"

[azure-vpn-gateway]: https://azure.microsoft.com/documentation/articles/vpn-gateway-about-vpngateways/
[hybrid-network-vpn]: ./guidance-hybrid-network-vpn.md
[hybrid-network-expressroute]: ./guidance-hybrid-network-expressroute.md
[hybrid-network-expressroute-failover]: ./guidance-hybrid-network-expressroute-vpn-failover.md