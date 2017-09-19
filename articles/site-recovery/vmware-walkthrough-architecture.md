---
title: Review the architecture for VMware replication to Azure | Microsoft Docs
description: This article provides an overview of components and architecture used when replicating on-premises VMware VMs to Azure with the Azure Site Recovery service
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: c413efcd-d750-4b22-b34b-15bcaa03934a
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/27.017
ms.author: raynew
---

# Step 1: Review the architecture for VMware replication to Azure

This article describes the components and processes used when replicating on-premises VMware virtual machines to Azure using the [Azure Site Recovery](site-recovery-overview.md) service.

Post any comments at the bottom of this article, or ask questions in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Architectural components

The table summarizes the components you need.

**Component** | **Requirement** | **Details**
--- | --- | ---
**Azure** | You need an Azure subscription, an Azure storage account, and an Azure network. | Replicated data is stored in the storage account. Azure VMs are created with the replicated data when failover from your on-premises site occurs. The Azure VMs connect to the Azure virtual network when they're created.
**Configuration server** | A single on-premises management server (VMware VM) that runs all the on-premises Site Recovery components for the deployment. These include a configuration server, process server, master target server. | The configuration server component coordinates communications between on-premises and Azure, and manages data replication.
 **Process server**:  | Installed by default on the configuration server. | Acts as a replication gateway. Receives replication data, optimizes it with caching, compression, and encryption, and sends it to Azure storage.<br/><br/> The process server also handles push installation of the Mobility service to protected machines, and performs automatic discovery of VMware VMs.<br/><br/> As your deployment grows you can add additional separate dedicated process servers to handle increasing volumes of replication traffic.
 **Master target server** | Installed by default on the on-premises configuration server. | Handles replication data during failback from Azure.<br/><br/> If volumes of failback traffic are high, you can deploy a separate master target server for failback.
**VMware servers** | VMware VMs are hosted on vSphere ESXi servers, and we recommend a vCenter server to manage the hosts. | You add VMware servers to your Recovery Services vault.
**Replicated machines** | The Mobility service will be installed on each VMware VM you replicate. It can be installed manually on each machine, or with a push installation from the process server.

**Figure 1: VMware to Azure components**

![Components](./media/vmware-walkthrough-architecture/arch-enhanced.png)

## Replication process

1. You set up the deployment, including on-premises and Azure components. In the Recovery Services vault, you specify the replication source and target, set up the configuration server, create a replication policy, deploy the Mobility service, enable replication, and run a test failover.
2. Machines replicate in accordance with the replication policy, and an initial copy of the data is replicated to Azure storage.
3. After initial replication finishes, replication of delta changes to Azure begins. Tracked changes for a machine are held in a .hrl file.
    - Replicating machines communicate with the configuration server on port HTTPS 443 inbound, for replication management.
    - Replicating machines send replication data to the process server on port HTTPS 9443 inbound (can be modified).
    - The configuration server orchestrates replication management with Azure over port HTTPS 443 outbound.
    - The process server receives data from source machines, optimizes and encrypts it, and sends it to Azure storage over port 443 outbound.
    - If you enable multi-VM consistency, then machines in the replication group communicate with each other over port 20004. Multi-VM is used if you group multiple machines into replication groups that share crash-consistent and app-consistent recovery points when they fail over. This is useful if machines are running the same workload and need to be consistent.
4. Traffic is replicated to Azure storage public endpoints, over the internet. Alternately, you can use Azure ExpressRoute [public peering](../expressroute/expressroute-circuit-peerings.md#public-peering). Replicating traffic over a site-to-site VPN from an on-premises site to Azure isn't supported.


**Figure 2: VMware to Azure replication**

![Enhanced](./media/vmware-walkthrough-architecture/v2a-architecture-henry.png)

## Failover and failback process

1. After you verify that test failover is working as expected, you can run unplanned failovers to Azure as required. Planned failover isn't supported.
2. You can fail over a single machine, or create [recovery plans](site-recovery-create-recovery-plans.md), to fail over multiple VMs.
3. When you run a failover, replica VMs are created in Azure. You commit a failover to start accessing the workload from the replica Azure VM.
4. When your primary on-premises site is available again, you can fail back. You set up a failback infrastructure, start replicating the machine from the secondary site to the primary, and run an unplanned failover from the secondary site. After you commit this failover, data will be back on-premises, and you need to enable replication to Azure again. [Learn more](site-recovery-failback-azure-to-vmware.md)

There are a few failback requirements:


- **Temporary process server in Azure**: If you want to fail back from Azure after failover you'll need to set up an Azure VM configured as a process server, to handle replication from Azure. You can delete this VM after failback finishes.
- **VPN connection**: For failback you'll need a VPN connection (or Azure ExpressRoute) set up from the Azure network to the on-premises site.
- **Separate on-premises master target server**: The on-premises master target server handles failback. The master target server is installed by default on the management server, but if you're failing back larger volumes of traffic you should set up a separate on-premises master target server for this purpose.
- **Failback policy**: To replicate back to your on-premises site, you need a failback policy. This is automatically created when you created your replication policy.
- **VMware infrastructure**: You must fail back to an on-premises VMware VM. This means you need an on-premises VMware infrastructure, even if you're replicating on-premises physical servers to Azure.

**Figure 3: VMware/physical failback**

![Failback](./media/vmware-walkthrough-architecture/enhanced-failback.png)


## Next steps

Go to [Step 2: Verify prerequisites and limitations](vmware-walkthrough-prerequisites.md)
