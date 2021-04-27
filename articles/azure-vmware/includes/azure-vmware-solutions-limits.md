---
title: Azure VMware Solution limits
description: Azure VMware Solution limitations.
ms.topic: include
ms.date: 03/24/2021
---

<!-- Used in /azure/azure-resource-manager/management/azure-subscription-service-limits.md and concepts-networking.md -->

The following table describes the maximum limits for Azure VMware Solution.

| **Resource** | **Limit** |
| :-- | :-- |
| Clusters per private cloud | 12 |
| Minimum number of nodes per cluster | 3 |
| Maximum number of nodes per cluster | 16 |
| Nodes per private cloud | 96 |
| vCenter per private cloud | 1  |
| HCX site pairings | 3 with Advanced edition, 10 with Enterprise edition |
| AVS ExpressRoute max linked SDDCs | 4 |
| AVS ExpressRoute portspeed | 10 Gbps<br />The virtual network gateway used determines the actual bandwidth. For more details, see [About ExpressRoute virtual network gateways](../../expressroute/expressroute-about-virtual-network-gateways.md) | 
| Public IPs exposed via vWAN | 100 |
| vSAN capacity limits | 75% of total usable (keep 25% available for SLA)  |

For other VMware specific limits please use the [VMware configuration maximum tool!](https://configmax.vmware.com/).
