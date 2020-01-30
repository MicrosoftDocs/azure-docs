---
title: Physical server disaster recovery architecture in Azure Site Recovery 
description: This article provides an overview of components and architecture used during disaster recovery of on-premises physical servers to Azure with the Azure Site Recovery service.
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 11/14/2019
ms.author: raynew
---

# Physical server to Azure disaster recovery architecture

This article describes the architecture and processes used when you replicate, fail over, and recover physical Windows and Linux servers between an on-premises site and Azure, using the [Azure Site Recovery](site-recovery-overview.md) service.


## Architectural components

The following table and graphic provide a high-level view of the components used for physical server replication to Azure.  

**Component** | **Requirement** | **Details**
--- | --- | ---
**Azure** | An Azure subscription, and an Azure network. | Replicated data from on-premises physical machines is stored in Azure managed disks. Azure VMs are created with the replicated data when you run a fail over from on-premises to Azure. The Azure VMs connect to the Azure virtual network when they're created.
**Configuration server** | A single on-premises physical machine or VMware VM is deployed to run all of the on-premises Site Recovery components. The VM runs the configuration server, process server, and master target server. | The configuration server coordinates communications between on-premises and Azure, and manages data replication.
 **Process server**:  | Installed by default together with the configuration server. | Acts as a replication gateway. Receives replication data, optimizes it with caching, compression, and encryption, and sends it to Azure storage.<br/><br/> The process server also installs the Mobility service on servers you want to replicate.<br/><br/> As your deployment grows, you can add additional, separate process servers to handle larger volumes of replication traffic.
 **Master target server** | Installed by default together with the configuration server. | Handles replication data during failback from Azure.<br/><br/> For large deployments, you can add an additional, separate master target server for failback.
**Replicated servers** | The Mobility service is installed on each server you replicate. | We recommend you allow automatic installation from the process server. Alternatively you can install the service manually, or use an automated deployment method such as Configuration Manager.

**Physical to Azure architecture**

![Components](./media/physical-azure-architecture/arch-enhanced.png)

## Replication process

1. You set up the deployment, including on-premises and Azure components. In the Recovery Services vault, you specify the replication source and target, set up the configuration server, create a replication policy, and enable replication.
2. Machines replicate in accordance with the replication policy, and an initial copy of the server data is replicated to Azure storage.
3. After initial replication finishes, replication of delta changes to Azure begins. Tracked changes for a machine are held in a .hrl file.
    - Machines communicate with the configuration server on port HTTPS 443 inbound, for replication management.
    - Machines send replication data to the process server on port HTTPS 9443 inbound (can be modified).
    - The configuration server orchestrates replication management with Azure over port HTTPS 443 outbound.
    - The process server receives data from source machines, optimizes and encrypts it, and sends it to Azure storage over port 443 outbound.
    - If you enable multi-VM consistency, machines in the replication group communicate with each other over port 20004. Multi-VM is used if you group multiple machines into replication groups that share crash-consistent and app-consistent recovery points when they fail over. This is useful if machines are running the same workload and need to be consistent.
4. Traffic is replicated to Azure storage public endpoints, over the internet. Alternately, you can use Azure ExpressRoute [public peering](../expressroute/about-public-peering.md). Replicating traffic over a site-to-site VPN from an on-premises site to Azure isn't supported.


**Physical to Azure replication process**

![Replication process](./media/physical-azure-architecture/v2a-architecture-henry.png)

## Failover and failback process

After replication is set up and you've run a disaster recovery drill (test failover) to check everything's working as expected, you can run failover and failback as you need to. Note that:

- Planned failover isn't supported.
- You must fail back to an on-premises VMware VM. This means you need an on-premises VMware infrastructure, even when you replicate on-premises physical servers to Azure.
- You fail over a single machine, or create recovery plans, to fail over multiple machines together.
- When you run a failover, Azure VMs are created from replicated data in Azure storage.
- After triggering the initial failover, you commit it to start accessing the workload from the Azure VM.
- When your primary on-premises site is available again, you can fail back.
- You need to set up a failback infrastructure, including:
    - **Temporary process server in Azure**: To fail back from Azure, you set up an Azure VM to act as a process server, to handle replication from Azure. You can delete this VM after failback finishes.
    - **VPN connection**: To fail back, you need a VPN connection (or Azure ExpressRoute) from the Azure network to the on-premises site.
    - **Separate master target server**: By default, the master target server that was installed with the configuration server, on the on-premises VMware VM, handles failback. However, if you need to fail back large volumes of traffic, you should set up a separate on-premises master target server for this purpose.
    - **Failback policy**: To replicate back to your on-premises site, you need a failback policy. This was automatically created when you created your replication policy from on-premises to Azure.
    - **VMware infrastructure**: You need a VMware infrastructure for failback. You can't fail back to a physical server.
- After the components are in place, failback occurs in three stages:
    - Stage 1: Reprotect the Azure VMs so that they replicate from Azure back to the on-premises VMware VMs.
    - Stage 2: Run a failover to the on-premises site.
    - Stage 3: After workloads have failed back, you reenable replication.

**VMware failback from Azure**

![Failback](./media/physical-azure-architecture/enhanced-failback.png)


## Next steps

Follow [this tutorial](physical-azure-disaster-recovery.md) to enable physical server to Azure replication.
