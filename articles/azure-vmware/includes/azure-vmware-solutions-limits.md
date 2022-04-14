---
title: Azure VMware Solution limits
description: Azure VMware Solution limitations.
ms.topic: include
ms.date: 09/02/2021
author: suzizuber
ms.author: v-szuber
ms.service: azure-vmware
---

<!-- Used in /azure/azure-resource-manager/management/azure-subscription-service-limits.md and concepts-networking.md -->

The following table describes the maximum limits for Azure VMware Solution.

| **Resource** | **Limit** |
| :-- | :-- |
| vSphere clusters per private cloud | 12 |
| Minimum number of ESXi hosts per cluster | 3 |
| Maximum number of ESXi hosts per cluster | 16 |
| ESXi hosts per private cloud | 96 |
| vCenter Servers per private cloud | 1  |
| HCX site pairings | 25 (any edition) |
| Azure VMware Solution ExpressRoute max linked private clouds | 4<br />The virtual network gateway used determines the actual max linked private clouds.  For more details, see [About ExpressRoute virtual network gateways](../../expressroute/expressroute-about-virtual-network-gateways.md) | 
| Azure VMware Solution ExpressRoute port speed | 10 Gbps<br />The virtual network gateway used determines the actual bandwidth. For more details, see [About ExpressRoute virtual network gateways](../../expressroute/expressroute-about-virtual-network-gateways.md) | 
| Public IPs exposed via vWAN | 100 |
| vSAN capacity limits | 75% of total usable (keep 25% available for SLA)  |

For other VMware-specific limits, use the [VMware configuration maximum tool!](https://configmax.vmware.com/).
