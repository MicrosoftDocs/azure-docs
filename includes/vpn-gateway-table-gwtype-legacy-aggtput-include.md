---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 03/21/2018
 ms.author: cherylmc
 ms.custom: include file
---
The following table shows the gateway types and the estimated aggregate throughput by gateway SKU. This table applies to the Resource Manager and classic deployment models. 

Pricing differs between gateway SKUs. For more information, see [VPN Gateway Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway).

Note that the UltraPerformance gateway SKU is not represented in this table. For information about the UltraPerformance SKU, see the [ExpressRoute](../articles/expressroute/expressroute-about-virtual-network-gateways.md) documentation.

|  | **VPN Gateway throughput (1)** | **VPN Gateway max IPsec tunnels (2)** | **ExpressRoute Gateway throughput** | **VPN Gateway and ExpressRoute coexist** |
| --- | --- | --- | --- | --- |
| **Basic SKU (3)(5)(6)** |100 Mbps |10 |500 Mbps (6) |No |
| **Standard SKU (4)(5)** |100 Mbps |10 |1000 Mbps |Yes |
| **High Performance SKU (4)** |200 Mbps |30 |2000 Mbps |Yes |


(1) The VPN throughput is a rough estimate based on the measurements between VNets in the same Azure region. It is not a guaranteed throughput for cross-premises connections across the Internet. It is the maximum possible throughput measurement.

(2) The number of tunnels refer to RouteBased VPNs. A PolicyBased VPN can only support one Site-to-Site VPN tunnel.

(3) BGP is not supported for the Basic SKU.

(4) PolicyBased VPNs are not supported for this SKU. They are supported for the Basic SKU only.

(5) Active-active S2S VPN Gateway connections are not supported for this SKU. Active-active is supported on the HighPerformance SKU only.

(6) Basic SKU is deprecated for use with ExpressRoute.
