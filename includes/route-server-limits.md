---
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: include
ms.date: 01/09/2023
---
| Resource | Limit |
|----------|-------|
| Number of BGP peers supported | 8 |
| Number of routes each BGP peer can advertise to Azure Route Server <sup>1</sup> | 1,000 |
| Number of routes that Azure Route Server can advertise to ExpressRoute or VPN gateway <sup>2</sup>  | 200 |
| Number of VMs in the virtual network (including peered virtual networks) that Azure Route Server can support <sup>3</sup> | 4,000 |

<sup>1</sup> If your NVA advertises more routes than the limit, the BGP session will get dropped.

<sup>2</sup> Azure private peering has a [limit](../articles/azure-resource-manager/management/azure-subscription-service-limits.md#expressroute-limits) of 1,000 routes per connection from Virtual Network Gateway towards ExpressRoute circuit. For instance, the total number of routes from VNet address space and Route Server, when **Branch-to-branch** enabled, must not exceed 1,000.

<sup>3</sup> The number of VMs that Azure Route Server can support isn't a hard limit, and it depends on how the Route Server infrastructure is deployed within an Azure Region.
