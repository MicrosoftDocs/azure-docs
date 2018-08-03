---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 08/02/2018
 ms.author: cherylmc
 ms.custom: include file
---

|**SKU**   | **S2S/VNet-to-VNet<br>Tunnels** | **P2S<br>Connections** | **Aggregate<br>Throughput Benchmark** |
|---       | ---                             | ---                    | ---                         |
|**VpnGw1**| Max. 30*                         | Max. 128**             | 650 Mbps                    |
|**VpnGw2**| Max. 30*                         | Max. 128**             | 1 Gbps                      |
|**VpnGw3**| Max. 30*                         | Max. 128**             | 1.25 Gbps                   |
|**Basic** | Max. 10                         | Max. 128               | 100 Mbps                    | 

* (*) Use [Virtual WAN](../articles/virtual-wan/virtual-wan-about.md) if you need more than 30 S2S VPN tunnels.

* (**) Contact support if additional connections are needed. This applies to IKEv2 only, number of connections for SSTP cannot be increased.

* Aggregate Throughput Benchmark is based on measurements of multiple tunnels aggregated through a single gateway. It is not a guaranteed throughput due to Internet traffic conditions and your application behaviors.

* Pricing information can be found on the [Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway) page.

* SLA (Service Level Agreement) information can be found on the [SLA](https://azure.microsoft.com/support/legal/sla/vpn-gateway/) page.

* VpnGw1, VpnGw2, and VpnGw3 are supported for VPN gateways using the Resource Manager deployment model only.