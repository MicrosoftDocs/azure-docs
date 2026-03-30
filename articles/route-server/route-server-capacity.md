---
title: Azure Route Server Capacity
titleSuffix: Azure Route Server
description: Learn how to configure capacity for your Azure Route Server based on the number of virtual machines deployed
author: siddomala
ms.author: siddomala
ms.service: azure-route-server
ms.topic: concept-article
ms.date: 10/31/2025

#CustomerIntent: As an Azure administrator, I want to understand how to configure Route Server's capacity based on the number of VMs I have deployed. 
---

# <a name="capacity"></a>Azure Route Server capacity

By default, an Azure Route Server is deployed with a capacity of two routing infrastructure units. This default deployment supports 4,000 connected VMs deployed in Route Server's virtual network and all peered virtual networks. 

You can specify more routing infrastructure units to increase Route Server's capacity in increments of 1,000 VMs. This feature gives you the ability to secure upfront capacity without having to wait for the Route Server to scale out when more VMs are needed. The scale unit on which the Route Server is created becomes the minimum capacity. 


When you increase Route Server's capacity, Route Server continues to support the number of VMs at its current capacity until the scale-out is complete. It may take up to 25 minutes for Route Server to scale out to more routing infrastructure units. 

> [!NOTE]
> Regardless of Route Server's capacity, Route Server can only accept a maximum of 10,000 routes from its connected resources (virtual networks, branches).
>

## Edit Route Server capacity

Adjust Route Server's capacity when you need to support more virtual machines.

To add more Route Server capacity, go to the **Configuration** blade under Azure portal, and adjust the number of Routing infrastructure units using the dropdown, then **Save**.


## Autoscaling
Azure Route Server supports autoscaling based on spoke VM utilization. See [Azure Route Server Monitoring](monitor-route-server.md) for how to monitor your Route Server's routing infrastructure units and spoke VM utilization. 

As the spoke VM utilization changes over time, the autoscaling algorithm dynamically adjusts the number of routing infrastructure units. However, autoscaling is not instantaneous. For improved infrastructure availability and performance, ensure that your minimum provisioned routing infrastructure units (RIUs) match the requirements of your workloads. Autoscaling does not reduce the provisioned RIUs below this minimum.

### Routing infrastructure unit table
 
| Routing infrastructure unit | Number of VMs |
|----------------------------|---------------|
| 2                          |  4,000         |
| 3                          |  5,000         |
| 4                          |  6,000         |
| 5                          |  7,000         |
| 6                          |  8,000         |
| 7                          |  9,000         |
| 8                          |  10,000        |
| 9                          |  11,000        |
| 10                         |  12,000        |
| 11                         |  13,000        |
| 12                         |  14,000        |
| 13                         |  15,000        |
| 14                         |  16,000        |
| 15                         |  17,000        |
| 16                         |  18,000        |
| 17                         |  19,000        |
| 18                         |  20,000        |
| 19                         |  21,000        |
| 20                         |  22,000        |
| 21                         |  23,000        |
| 22                         |  24,000        |
| 23                         |  25,000        |
| 24                         |  26,000        |
| 25                         |  27,000        |
| 26                         |  28,000        |
| 27                         |  29,000        |
| 28                         |  30,000        |
| 29                         |  31,000        |
| 30                         |  32,000        |
| 31                         |  33,000        |
| 32                         |  34,000        |
| 33                         |  35,000        |
| 34                         |  36,000        |
| 35                         |  37,000        |
| 36                         |  38,000        |
| 37                         |  39,000        |
| 38                         |  40,000        |
| 39                         |  41,000        |
| 40                         |  42,000        |
| 41                         |  43,000        |
| 42                         |  44,000        |
| 43                         |  45,000        |
| 44                         |  46,000        |
| 45                         |  47,000        |
| 46                         |  48,000        |
| 47                         |  49,000        |
| 48                         |  50,000        |


## Next steps

- [Configure routing preference in Azure Route Server](configure-route-server.md#configure-routing-preference)
- [Learn about Azure Route Server support for ExpressRoute and VPN](expressroute-vpn-support.md)
- [Monitor Azure Route Server](monitor-route-server.md)
