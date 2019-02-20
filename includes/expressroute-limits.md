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
#### ExpressRoute Limits
The following limits apply to ExpressRoute resources per subscription.

| Resource | Default/Max Limit |
| --- | --- |
| ExpressRoute circuits per subscription |10 |
| ExpressRoute circuits per region per subscription (Azure Resource Manager) |10 |
| Maximum number of routes for Azure private peering with ExpressRoute standard |4,000 |
| Maximum number of routes for Azure private peering with ExpressRoute premium add-on |10,000 |
| Maximum number of routes for Azure Microsoft peering with ExpressRoute standard |200 |
| Maximum number of routes for Azure Microsoft peering with ExpressRoute premium add-on |200 |
| Maximum number of ExpressRoute circuits linked to the same virtual network in different peering locations |4 |
| Number of virtual network links allowed per ExpressRoute circuit |see table below |

#### Number of Virtual Networks per ExpressRoute circuit
| **Circuit Size** | **Number of VNet links for standard** | **Number of VNet Links with Premium add-on** |
| --- | --- | --- |
| 50 Mbps |10 |20 |
| 100 Mbps |10 |25 |
| 200 Mbps |10 |25 |
| 500 Mbps |10 |40 |
| 1 Gbps |10 |50 |
| 2 Gbps |10 |60 |
| 5 Gbps |10 |75 |
| 10 Gbps |10 |100 |

