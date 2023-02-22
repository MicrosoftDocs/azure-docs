---
title: Azure VMware Solution limits
description: Azure VMware Solution limits.
ms.topic: include
ms.service: azure-vmware
ms.date: 2/17/2023
author: suzizuber
ms.author: v-szuber
---

<!-- Used in /azure/azure-resource-manager/management/azure-subscription-service-limits.md and concepts-networking.md -->

The following table describes the maximum limits for Azure VMware Solution.

| **Resource** | **Limit** |
| :-- | :-- |
| vSphere clusters per private cloud | 12 |
| Minimum number of ESXi hosts per cluster | 3 (hard-limit) |
| Maximum number of ESXi hosts per cluster | 16 (hard-limit) |
| Maximum number of ESXi hosts per private cloud | 96 |
| Maximum number of vCenter Servers per private cloud | 1 (hard-limit)  |
| Maximum number of HCX site pairings | 25 (any edition) |
| Maximum number of HCX service meshes | 10 (any edition) |
| Maximum number of Azure VMware Solution ExpressRoute linked private clouds from a single location to a single Virtual Network Gateway | 4<br />The virtual network gateway used determines the actual max linked private clouds.  For more details, see [About ExpressRoute virtual network gateways](../../expressroute/expressroute-about-virtual-network-gateways.md)<br />If you exceed this threshold use [Azure VMware Solution Interconnect](../connect-multiple-private-clouds-same-region.md) to aggregate private cloud connectivity within the Azure region. | 
| Maximum Azure VMware Solution ExpressRoute port speed | 10 Gbps (use Ultra Performance Gateway SKU with FastPath enabled)<br />The virtual network gateway used determines the actual bandwidth. For more details, see [About ExpressRoute virtual network gateways](../../expressroute/expressroute-about-virtual-network-gateways.md) | 
| Maximum number of Azure Public IPv4 addresses assigned to NSX-T Data Center | 2,000 |
| Maximum number of Azure VMware Solution Interconnects per private cloud | 10 |
| vSAN capacity limits | 75% of total usable (keep 25% available for SLA)  |
| VMware Site Recovery Manager - Maximum number of protected Virtual Machines  | 3,000  |
| VMware Site Recovery Manager - Maximum number of Virtual Machines per recovery plan  | 2,000  |
| VMware Site Recovery Manager - Maximum number of protection groups per recovery plan  | 250  |
| VMware Site Recovery Manager - RPO Values  | 5 min or higher * (hard-limit)  |
| VMware Site Recovery Manager - Maximum number of virtual machines per protection group  | 500  |
| VMware Site Recovery Manager - Maximum number of recovery plans  | 250  |

\* For information about Recovery Point Objective (RPO) lower than 15 minutes, see [How the 5 Minute Recovery Point Objective Works](https://docs.vmware.com/en/vSphere-Replication/8.3/com.vmware.vsphere.replication-admin.doc/GUID-9E17D567-A947-49CD-8A84-8EA2D676B55A.html) in the _vSphere Replication Administration guide_.

For other VMware-specific limits, use the [VMware configuration maximum tool](https://configmax.vmware.com/).
