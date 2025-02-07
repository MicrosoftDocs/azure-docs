---
author: halkazwini
ms.author: halkazwini
ms.service: azure-route-server
ms.topic: include
ms.date: 09/18/2023
---
| Resource | Limit |
|----------|-------|
| Number of BGP peers | 8 |
| Number of routes each BGP peer can advertise to Azure Route Server <sup>1</sup> | 1,000 |
| Number of VMs in the virtual network (including peered virtual networks) that Azure Route Server can support | 4,000 |
| Number of virtual networks that Azure Route Server can support | 500 |
| Number of total on-premises and Azure Virtual Network prefixes that Azure Route Server can support | 10,000 |

<sup>1</sup> If your NVA advertises more routes than the limit, the BGP session gets dropped.

> [!NOTE]
> The total number of routes advertised from VNet address space and Route Server towards ExpressRoute circuit, when [Branch-to-branch](/azure/route-server/quickstart-configure-route-server-portal#configure-route-exchange) enabled, must not exceed 1,000. For more information, see [Route advertisement limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#expressroute-limits) of ExpressRoute.
