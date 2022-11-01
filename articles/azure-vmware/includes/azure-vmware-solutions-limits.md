---
title: Azure VMware Solution limits
description: Azure VMware Solution limitations.
ms.topic: include
ms.service: azure-vmware
ms.date: 07/18/2022
author: suzizuber
ms.author: v-szuber
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
| Public IPs down to NSX-T | 2000 |
| vSAN capacity limits | 75% of total usable (keep 25% available for SLA)  |
| VMware Site Recovery Manager - Number of protected Virtual Machines  | 3,000  |
| VMware Site Recovery Manager - Number of Virtual Machines per recovery plan  | 2,000  |
| VMware Site Recovery Manager - Number of protection groups per recovery plan  | 250  |
| VMware Site Recovery Manager - RPO Values  | 5 min or higher *  |
| VMware Site Recovery Manager - Total number of virtual machines per protection group  | 500  |
| VMware Site Recovery Manager - Total number of recovery plans  | 250  |

\* For information about Recovery Point Objective (RPO) lower than 15 minutes, see [How the 5 Minute Recovery Point Objective Works](https://docs.vmware.com/en/vSphere-Replication/8.3/com.vmware.vsphere.replication-admin.doc/GUID-9E17D567-A947-49CD-8A84-8EA2D676B55A.html) in the _vSphere Replication Administration guide_.

For other VMware-specific limits, use the [VMware configuration maximum tool](https://configmax.vmware.com/).
