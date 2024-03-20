---
title: Concepts – Migration considerations with VMware HCX
description: Learn about VMware HCX migration considerations for Azure VMware Solution.
author: rvandenbedem
ms.author: rvandenbedem
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 3/20/2024
ms.custom: engagement-fy24
---

# VMware HCX migration considerations

VMware HCX offers five options with the HCX Enterprise Edition license when migrating VMware vSphere virtual machines to the Azure VMware Solution:

- Cold Migration
- HCX vMotion
- Bulk Migration
- Replication Assisted vMotion
- OS Assisted Migration

The cost of the VMware HCX Enterprise Edition license is included in the cost of the Azure VMware Solution service.

## VMware HCX migration options

Each of these options has different advantages and disadvantages when used. You need to select the best options for your migration plan.

| **Migration Method** | **Migration Downtime** | **Scale** |
| :-- | :-- | :-- |
| Cold Migration | Long downtime | VM copy with NFC protocol, small scale |
| HCX vMotion | None | Serial migrations, small scale |
| Bulk Migration | Minimal downtime | VM shutdown (source site)/VM power-on (destination site), Parallel migrations, largest scale |
| Replication Assisted vMotion (RAV) | None | Parallel migrations, larger scale |
| OS Assisted Migration (OSAM) | Conversion downtime | Hyper-V and KVM workload migrations |

## VMware HCX architecture

The Azure VMware Solution deploys VMware HCX as an Add-On. A VMware HCX Service Mesh is used to connect two sites together, including a Layer 2 network extension. This allows VMware vSphere virtual machines to be migrated from the on-premises site to the Azure VMware Solution private cloud.

:::image type="content" source="media/concepts/vmware-hcx-migration-concepts.png" alt-text="Diagram showing the architecture of VMware HCX with the Azure VMware Solution." border="false" lightbox="media/concepts/vmware-hcx-migration-concepts.png":::

## Next Steps

After learning about the VMware HCX migration considerations of the Azure VMware Solution, consider exploring the following articles:

- [Create an HCX network extension](configure-hcx-network-extension.md)
- [HCX Network extension high availability (HA)](configure-hcx-network-extension-high-availability.md)
- [Enable HCX access over the internet](enable-hcx-access-over-internet.md)
- [Upgrade HCX on Azure VMware Solution](upgrade-hcx-azure-vmware-solutions.md)
- [Use VMware HCX Run Commands](use-hcx-run-commands.md)
- [Enable SQL Azure hybrid benefit for Azure VMware Solution](enable-sql-azure-hybrid-benefit.md) 
- [Migrate a SQL Server standalone instance to Azure VMware Solution](migrate-sql-server-standalone-cluster.md)
- [Migrate a SQL Server Always On Failover Cluster Instance to Azure VMware Solution](migrate-sql-server-failover-cluster.md)
- [Migrate a SQL Server Always On Availability Group to Azure VMware Solution](migrate-sql-server-always-on-availability-group.md)
