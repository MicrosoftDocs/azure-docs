---
 title: include file
 description: include file
 services: expressroute
 author: cherylmc
 ms.service: expressroute
 ms.topic: include
 ms.date: 06/12/2018
 ms.author: cherylmc
 ms.custom: include file
---
The following limits apply to Azure ExpressRoute resources per subscription.

| Resource | Default/maximum limit |
| --- | --- |
| ExpressRoute circuits per subscription |10 |
| ExpressRoute circuits per region per subscription, with Azure Resource Manager |10 |
| Maximum number of routes for Azure private peering with ExpressRoute Standard |4,000 |
| Maximum number of routes for Azure private peering with ExpressRoute Premium add-on |10,000 |
| Maximum number of routes for Azure private peering from the VNet address space for an ExpressRoute connection |200 | 
| Maximum number of routes for Microsoft Azure peering with ExpressRoute Standard |200 |
| Maximum number of routes for Microsoft Azure peering with ExpressRoute Premium add-on |200 |
| Maximum number of ExpressRoute circuits linked to the same virtual network in the same peering location |4 |
| Maximum number of ExpressRoute circuits linked to the same virtual network in different peering locations |>4, depends on GatewaySubnet size|
| Number of virtual network links allowed per ExpressRoute circuit |See the following table. |

#### Number of virtual networks per ExpressRoute circuit
| **Circuit size** | **Number of virtual network links for Standard** | **Number of virtual network links with Premium add-on** |
| --- | --- | --- |
| 50 Mbps |10 |20 |
| 100 Mbps |10 |25 |
| 200 Mbps |10 |25 |
| 500 Mbps |10 |40 |
| 1 Gbps |10 |50 |
| 2 Gbps |10 |60 |
| 5 Gbps |10 |75 |
| 10 Gbps |10 |100 |

