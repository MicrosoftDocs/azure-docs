---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 11/12/2018
 ms.author: cherylmc
 ms.custom: include file
---

|**SKU**   | **S2S/VNet-to-VNet<br>Tunnels** | **P2S<br> SSTP Connections** | **P2S<br> IKEv2 Connections** | **Aggregate<br>Throughput Benchmark** | **BGP** |
|---       | ---        | ---       | ---            | ---       | --- |
|**Basic** | Max. 10    | Max. 128  | Not Supported  | 100 Mbps  | Not Supported|
|**VpnGw1**| Max. 30*   | Max. 128  | Max. 250       | 650 Mbps  | Supported |
|**VpnGw2**| Max. 30*   | Max. 128  | Max. 500       | 1 Gbps    | Supported |
|**VpnGw3**| Max. 30*   | Max. 128  | Max. 1000      | 1.25 Gbps | Supported |


(*) Use [Virtual WAN](../articles/virtual-wan/virtual-wan-about.md) if you need more than 30 S2S VPN tunnels.

* The Aggregate Throughput Benchmark for a VPN Gateway is S2S + P2S combined. **If you have a lot of P2S connections, it can negatively impact a S2S connection due to throughput limitations.** Aggregate Throughput Benchmark is based on measurements of multiple tunnels aggregated through a single gateway. It is not a guaranteed throughput due to Internet traffic conditions and your application behaviors.

* These connection limits are separate. For example, you can have 128 SSTP connections and also 250 IKEv2 connections on a VpnGw1 SKU.

* Pricing information can be found on the [Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway) page.

* SLA (Service Level Agreement) information can be found on the [SLA](https://azure.microsoft.com/support/legal/sla/vpn-gateway/) page.

* VpnGw1, VpnGw2, and VpnGw3 are supported for VPN gateways using the Resource Manager deployment model only.
