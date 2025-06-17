---
title: Azure VMware Solution limits
description: Learn about Azure VMware Solution limits.
ms.topic: include
ms.service: azure-vmware
ms.date: 4/2/2025
author: suzizuber
ms.author: v-szuber
ms.custom: engagement-fy23
---

<!-- Used in /azure/azure-resource-manager/management/azure-subscription-service-limits.md and concepts-networking.md -->

The following table describes the maximum limits for Azure VMware Solution.

| Resource | Limit |
| :-- | :-- |
| vSphere clusters per private cloud | 12 |
| Minimum number of ESXi hosts per cluster | 3 (hard limit) |
| Maximum number of ESXi hosts per cluster | 16 (hard limit) |
| Maximum number of ESXi hosts per private cloud | 96 |
| Maximum number of vCenter Servers per private cloud | 1 (hard limit)  |
| Maximum number of HCX site pairings | 25 (any edition) |
| Maximum number of HCX service meshes | 10 (any edition) |
| Maximum number of Azure VMware Solution private clouds linked Azure ExpressRoute from a single location to a single virtual network gateway | 4<br />The virtual network gateway used determines the actual maximum number of linked private clouds. For more information, see [About ExpressRoute virtual network gateways](../../expressroute/expressroute-about-virtual-network-gateways.md).<br />If you exceed this threshold, use [Azure VMware Solution interconnect](../connect-multiple-private-clouds-same-region.md) to aggregate private cloud connectivity within the Azure region. | 
| Maximum Azure VMware Solution ExpressRoute throughput | 10 Gbps (use Ultra Performance Gateway version with FastPath enabled)**<br />The virtual network gateway that's used determines the actual bandwidth. For more information, see [About ExpressRoute virtual network gateways](../../expressroute/expressroute-about-virtual-network-gateways.md).<br />An Azure VMware Solution ExpressRoute doesn't have any port speed limitations and performs above 10 Gbps. Rates over 10 Gbps aren't guaranteed because of quality of service.| 
| Maximum number of Azure Public IPv4 addresses assigned to NSX | 2,000 |
| Maximum number of Azure VMware Solution interconnects per private cloud | 10 |
| Maximum number of Azure ExpressRoute Global Reach connections per Azure VMware Solution private cloud | 8 |
| vSAN capacity limits | 75% of total usable (keep 25% available for service-level agreement)  |
| VMware Site Recovery Manager: Maximum number of protected virtual machines  | 3,000  |
| VMware Site Recovery Manager: Maximum number of virtual machines per recovery plan  | 2,000  |
| VMware Site Recovery Manager: Maximum number of protection groups per recovery plan  | 250  |
| VMware Site Recovery Manager: Recovery point objective (RPO) values  | Five minutes or higher* (hard limit)  |
| VMware Site Recovery Manager: Maximum number of virtual machines per protection group  | 500  |
| VMware Site Recovery Manager: Maximum number of recovery plans  | 250  |

\* For information about an RPO lower than 15 minutes, see [How the 5-minute RPO works](https://techdocs.broadcom.com/us/en/vmware-cis/live-recovery/vsphere-replication/8-8/vr-help-plug-in-8-8/replicating-virtual-machines/how-the-recovery-point-objective-affects-replication-scheduling.html#GUID-84FAF645-1C65-413D-A89B-70DBA0990631-en_TITLE_861C526B-20D8-401D-87CD-B3B454A94EC7) in the vSphere Replication Administration documentation.

\** This soft recommended limit can support higher throughput based on the scenario.

For other VMware-specific limits, use the [VMware by Broadcom configuration maximum tool](https://configmax.broadcom.com).
