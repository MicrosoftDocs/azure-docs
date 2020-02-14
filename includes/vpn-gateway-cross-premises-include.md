---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 05/16/2018
 ms.author: cherylmc
 ms.custom: include file
---
|  | **Point-to-Site** | **Site-to-Site** | **ExpressRoute** |
| --- | --- | --- | --- |
| **Azure Supported Services** |Cloud Services and Virtual Machines |Cloud Services and Virtual Machines |[Services list](../articles/expressroute/expressroute-faqs.md#supported-services) |
| **Typical Bandwidths** |Based on the gateway SKU |Typically < 1 Gbps aggregate |50 Mbps, 100 Mbps, 200 Mbps, 500 Mbps, 1 Gbps, 2 Gbps, 5 Gbps, 10 Gbps |
| **Protocols Supported** |Secure Sockets Tunneling Protocol (SSTP), OpenVPN and IPsec |IPsec |Direct connection over VLANs, NSP's VPN technologies (MPLS, VPLS,...) |
| **Routing** |RouteBased (dynamic) |We support PolicyBased (static routing) and RouteBased (dynamic routing VPN) |BGP |
| **Connection resiliency** |active-passive |active-passive or active-active |active-active |
| **Typical use case** |Prototyping, dev / test / lab scenarios for cloud services and virtual machines |Dev / test / lab scenarios and small scale production workloads for cloud services and virtual machines |Access to all Azure services (validated list), Enterprise-class and mission critical workloads, Backup, Big Data, Azure as a DR site |
| **SLA** |[SLA](https://azure.microsoft.com/support/legal/sla/) |[SLA](https://azure.microsoft.com/support/legal/sla/) |[SLA](https://azure.microsoft.com/support/legal/sla/) |
| **Pricing** |[Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/) |[Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/) |[Pricing](https://azure.microsoft.com/pricing/details/expressroute/) |
| **Technical Documentation** |[VPN Gateway Documentation](https://azure.microsoft.com/documentation/services/vpn-gateway/) |[VPN Gateway Documentation](https://azure.microsoft.com/documentation/services/vpn-gateway/) |[ExpressRoute Documentation](https://azure.microsoft.com/documentation/services/expressroute/) |
| **FAQ** |[VPN Gateway FAQ](../articles/vpn-gateway/vpn-gateway-vpn-faq.md) |[VPN Gateway FAQ](../articles/vpn-gateway/vpn-gateway-vpn-faq.md) |[ExpressRoute FAQ](../articles/expressroute/expressroute-faqs.md) |
