---
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: include
ms.date: 07/26/2022
---
| Resource | Limit |
|----------|-------|
| Number of BGP peers supported | 8 |
| Number of routes each BGP peer can advertise to Azure Route Server <sup>1</sup> | 1000 |
| Number of routes that Azure Route Server can advertise to ExpressRoute or VPN gateway <sup>2</sup>  | 200 |
| Number of VMs in the virtual network (including peered virtual networks) that Azure Route Server can support <sup>3</sup> | 2000 |

<sup>1</sup> If your NVA advertises more routes than the limit, the BGP session will get dropped. In the event BGP session is dropped between the gateway and Azure Route Server, you'll lose connectivity from your on-premises network to Azure.

<sup>2</sup> Please be aware of the ExpressRoute Private Peering [limit](../articles/azure-resource-manager/management/azure-subscription-service-limits.md) of 1000 routes per connection from Virtual Network Gateway towards ExpressRoute circuit. For instance, the total number of routes from all Virtual Network Address Spaces + ARS Branch-to-branch, must not exceed 1000.

<sup>3</sup> The number of VMs that Azure Route Server can support isn't a hard limit, and it depends on how the Route Server infrastructure is deployed within an Azure Region.
