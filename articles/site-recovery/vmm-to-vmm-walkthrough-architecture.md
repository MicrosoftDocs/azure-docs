---
title: Review the architecture for Hyper-V replication to a secondary site with Azure Site Recovery | Microsoft Docs
description: This article provides an overview of the architecture for replicating on-premises Hyper-V VMs to a secondary System Center VMM site with Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 07099161-4cc7-4f32-8eb9-2a71bbf0750b
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 07/30/2017
ms.author: raynew

---
# Step 1: Review the architecture for Hyper-V replication to a secondary site

This article describes the components and processes involved when replicating on-premises Hyper-V virtual machines (VMs) in System Center Virtual Machine Manager (VMM) clouds, to a secondary VMM site using the [Azure Site Recovery](site-recovery-overview.md) service in the Azure portal.

Post any comments at the bottom of this article, or in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).



## Architectural components

Here's what you need for replicating Hyper-V VMs to a secondary VMM site.

**Component** | **Location** | **Details**
--- | --- | ---
**Azure** | Subscription in Azure. | You create a Recovery Services vault in the Azure subscription, to orchestrate and manage replication between VMM locations.
**VMM server** | You need a VMM primary and secondary location. | We recommend a VMM server in the primary site, and one in the secondary site 
**Hyper-V server** |  One or more Hyper-V host servers in the primary and secondary VMM clouds. | Data is replicated between the primary and secondary Hyper-V host servers over the LAN or VPN, using Kerberos or certificate authentication.  
**Hyper-V VMs** | On Hyper-V host server. | The source host server should have at least one VM that you want to replicate.

## Replication process

1. You set up the Azure account, create a Recovery Services vault, and specify what you want to replicate.
2. You configure the source and target replication settings, which includes installing the Azure Site Recovery Provider on VMM servers, and the Microsoft Azure Recovery Services agent on each Hyper-V host.
3. You create a replication policy for the source VMM cloud. The policy is applied to all VMs located on hosts in the cloud.
4. You enable replication for each VMM, and initial replication of a VM occurs in accordance with the settings you choose.
5. After initial replication, replication of delta changes begins. Tracked changes for an item are held in a .hrl file.


![On-premises to on-premises](./media/vmm-to-vmm-walkthrough-architecture/arch-onprem-onprem.png)

## Failover and failback process

1. You can run a planned or unplanned [failover](site-recovery-failover.md) between on-premises sites. If you run a planned failover, then source VMs are shut down to ensure no data loss.
2. You can fail over a single machine, or create [recovery plans](site-recovery-create-recovery-plans.md) to orchestrate failover of multiple machines.
4. If you perform an unplanned failover to a secondary site, after the failover machines in the secondary location aren't enabled for protection or replication. If you ran a planned failover, after the failover, machines in the secondary location are protected.
5. Then, you commit the failover to start accessing the workload from the replica VM.
6. When your primary site is available again, you initiate reverse replication to replicate from the secondary site to the primary. Reverse replication brings the virtual machines into a protected state, but the secondary datacenter is still the active location.
7. To make the primary site into the active location again, you initiate a planned failover from secondary to primary, followed by another reverse replication.



## Next steps

Go to [Step 2: Review the prerequisites and limitations](vmm-to-vmm-walkthrough-prerequisites.md).
