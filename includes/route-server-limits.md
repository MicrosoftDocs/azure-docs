---
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: include
ms.date: 09/18/2023
---
| Resource | Limit |
|----------|-------|
| Number of BGP peers | 8 |
| Number of routes each BGP peer can advertise to Azure Route Server <sup>1</sup> | 1,000 |
| Number of VMs in the virtual network (including peered virtual networks) that Azure Route Server can support <sup>2</sup> | 4,000 |
| Number of virtual networks that Azure Route Server can support | 250 |
| Number of virtual network prefixes that Azure Route Server can support | 400 |

<sup>1</sup> If your NVA advertises more routes than the limit, the BGP session gets dropped.

<sup>2</sup> The number of VMs that Azure Route Server can support isn’t a hard limit and it depends on the availability and performance of the underlying infrastructure.

> [!NOTE]
> The total number of routes advertised from VNet address space and Route Server towards ExpressRoute circuit, when [Branch-to-branch](../articles/route-server/quickstart-configure-route-server-portal.md#configure-route-exchange) enabled, must not exceed 1,000. For more information, see [Route advertisement limits](../articles/azure-resource-manager/management/azure-subscription-service-limits.md#expressroute-limits) of ExpressRoute.
