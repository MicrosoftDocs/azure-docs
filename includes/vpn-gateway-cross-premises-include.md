---
 services: vpn-gateway
 author: cherylmc
 ms.topic: include
 ms.date: 02/29/2024
 ms.author: cherylmc
---
|  | **Point-to-Site** | **Site-to-Site** |
| --- | --- | --- |
| **Azure Supported Services** |Cloud Services and Virtual Machines |Cloud Services and Virtual Machines |
| **Typical Bandwidths** |Based on the gateway SKU |Typically < 10 Gbps aggregate |
| **Protocols Supported** |Secure Sockets Tunneling Protocol (SSTP), OpenVPN, and IPsec |IPsec |
| **Routing** |RouteBased (dynamic) |We support PolicyBased (static routing) and RouteBased (dynamic routing VPN) |
| **Connection resiliency** |active-passive |active-passive or active-active |
| **Typical use case** |Secure access to Azure virtual networks for remote users |Dev, test, and lab scenarios and small to medium scale production workloads for cloud services and virtual machines |
| **SLA** |[SLA](https://azure.microsoft.com/support/legal/sla/) |[SLA](https://azure.microsoft.com/support/legal/sla/) |
| **Pricing** |[Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/) |[Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway/) |
| **Technical Documentation** |[VPN Gateway](../articles/vpn-gateway/index.yml) |[VPN Gateway](../articles/vpn-gateway/index.yml) |
| **FAQ** |[VPN Gateway FAQ](../articles/vpn-gateway/vpn-gateway-vpn-faq.md) |[VPN Gateway FAQ](../articles/vpn-gateway/vpn-gateway-vpn-faq.md) |