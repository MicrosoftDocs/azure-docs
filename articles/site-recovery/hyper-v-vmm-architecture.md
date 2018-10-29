---
title: Hyper-V replication to secondary site architecture in Azure Site Recovery | Microsoft Docs
description: This article provides an overview of the architecture for replicating on-premises Hyper-V VMs to a secondary System Center VMM site with Azure Site Recovery.
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: article
ms.date: 10/10/2018
ms.author: raynew
---

# Hyper-V replication to a secondary site

This article describes the components and processes involved when replicating on-premises Hyper-V virtual machines (VMs) in System Center Virtual Machine Manager (VMM) clouds, to a secondary VMM site using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.


## Architectural components

The following table and graphic provide a high-level view of the components used for Hyper-V replication to a secondary site.

**Component** | **Requirement** | **Details**
--- | --- | ---
**Azure** | Azure subscription | You create a Recovery Services vault in the Azure subscription, to orchestrate and manage replication between VMM locations.
**VMM server** | You need a VMM primary and secondary location. | We recommend a VMM server in the primary site, and one in the secondary site.
**Hyper-V server** |  One or more Hyper-V host servers in the primary and secondary VMM clouds. | Data is replicated between the primary and secondary Hyper-V host servers over the LAN or VPN, using Kerberos or certificate authentication.  
**Hyper-V VMs** | On Hyper-V host server. | The source host server should have at least one VM that you want to replicate.

**On-premises to on-premises architecture**

![On-premises to on-premises](./media/hyper-v-vmm-architecture/arch-onprem-onprem.png)

## Replication process

1. When initial replication is triggered, a [Hyper-V VM snapshot](https://technet.microsoft.com/library/dd560637.aspx) snapshot is taken.
2. Virtual hard disks on the VM are replicated one by one, to the secondary location.
3. If disk changes occur while initial replication is in progress, the Hyper-V Replica Replication Tracker tracks the changes as Hyper-V replication logs (.hrl). These log files are located in the same folder as the disks. Each disk has an associated .hrl file that's sent to the secondary location. The snapshot and log files consume disk resources while initial replication is in progress.
4. When the initial replication finishes, the VM snapshot is deleted, and delta replication begins.
5. Delta disk changes in the log are synchronized and merged to the parent disk.


## Failover and failback process

- You can fail over a single machine, or create recovery plans, to orchestrate failover of multiple machines.
- You can run a planned or unplanned failover between on-premises sites. If you run a planned failover, then source VMs are shut down to ensure no data loss.
    - If you perform an unplanned failover to a secondary site, after the failover machines in the secondary location aren't protected.
    - If you ran a planned failover, after the failover, machines in the secondary location are protected.
- After the initial failover runs, you commit it, to start accessing the workload from the replica VM.
- When the primary location is available again, you can fail back.
    - You initiate reverse replication, to start replicating from the secondary site to the primary. Reverse replication brings the virtual machines into a protected state, but the secondary datacenter is still the active location.
    - To make the primary site into the active location again, you initiate a planned failover from secondary to primary, followed by another reverse replication.



## Next steps


Follow [this tutorial](hyper-v-vmm-disaster-recovery.md) to enable Hyper-V replication between VMM clouds.
