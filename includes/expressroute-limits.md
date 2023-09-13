---
 title: include file
 description: include file
 services: expressroute
 author: duongau
 ms.service: expressroute
 ms.topic: include
 ms.date: 08/11/2023
 ms.author: duau
 ms.custom: include file
---

| Resource | Limit |
| --- | --- |
| ExpressRoute circuits per subscription | 50 (Submit a support request to increase limit) |
| ExpressRoute circuits per region per subscription, with Azure Resource Manager | 10 |
| Maximum number of circuits in the same peering location linked to the same virtual network | 4 |
| Maximum number of circuits in different peering locations linked to the same virtual network |Standard / ERGw1Az - 4 </br> High Perf / ERGw2Az - 8 </br> Ultra Performance / ErGw3Az - 16 |
| Maximum number of IPs for ExpressRoute provider circuit with Fastpath | 25,000 |
| Maximum number of IPs for ExpressRoute Direct 10 Gbps with Fastpath | 100,000 |
| Maximum number of IPs for ExpressRoute Direct 100 Gbps with Fastpath | 200,000 |
| Maximum number of flows for ExpressRoute Traffic Collector | 30,000 |

#### Route advertisement limits

| Resource | Local / Standard SKU | Premium SKU |
|--|--|--|
| Maximum number of IPv4 routes advertised to Azure private peering | 4,000 | 10,000 |
| Maximum number of IPv6 routes advertised to Azure private peering | 100 | 100 |
| Maximum number of IPv4 routes advertised from Azure private peering from the VNet address space | 1,000 | 1,000 |
| Maximum number of IPv6 routes advertised from Azure private peering from the VNet address space | 100 | 100 |
| Maximum number of IPv4 routes advertised to Microsoft peering | 200 | 200 |
| Maximum number of IPv6 routes advertised to Microsoft peering | 200 | 200 |


#### Virtual networks links allowed for each ExpressRoute circuit limit

| Circuit size | Local / Standard SKU | Premium SKU |
| --- | --- |--|
| 50 Mbps |  10 | 20 |
| 100 Mbps | 10 | 25 |
| 200 Mbps | 10 | 25 |
| 500 Mbps | 10| 40 |
| 1 Gbps | 10 | 50 |
| 2 Gbps | 10 | 60 |
| 5 Gbps | 10| 75 |
| 10 Gbps | 10| 100 |
| 40 Gbps* | 10 | 100 |
| 100 Gbps* | 10| 100 |

**100-Gbps ExpressRoute Direct Only*

> [!NOTE]
> Global Reach connections count against the limit of virtual network connections per ExpressRoute Circuit. For example, a 10 Gbps Premium Circuit would allow for 5 Global Reach connections and 95 connections to the ExpressRoute Gateways or 95 Global Reach connections and 5 connections to the ExpressRoute Gateways or any other combination up to the limit of 100 connections for the circuit.

#### ExpressRoute gateway performance limits

[!INCLUDE [expressroute-gateway-preformance-include](expressroute-gateway-performance-include.md)]
