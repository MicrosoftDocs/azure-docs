---
title: How does on-premises machine replication to a secondary on-premises site work in Azure Site Recovery? | Microsoft Docs
description: This article provides an overview of components and architecture used when replicating on-premises VMs and physical servers to a secondary site with the Azure Site Recovery service.
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
ms.topic: get-started-article
ms.date: 05/29/2017
ms.author: raynew

---
# How does on-premises machine replication to a secondary site work in Site Recovery?

This article describes the components and processes involved when replicating on-premises virtual machines and physical servers to Azure, using the [Azure Site Recovery](site-recovery-overview.md) service.

You can replicate the following to a secondary on-premises site:
- On-premises Hyper-V VMs Hyper-V VMs on Hyper-V clusters and standalone hosts that are managed in System Center Virtual Machine Manager (VMM) clouds.
- On-premises VMware VMs and Windows/Linux physical servers. In this scenario replication is managed by Scout.

Post any comments at the bottom of this article, or in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Replicate Hyper-V VMs to a secondary on-premises site


### Architectural components

Here's what you need for replicating Hyper-V VMs to a secondary site.

**Component** | **Location** | **Details**
--- | --- | ---
**Azure** | You need an account in Microsoft. |
**VMM server** | We recommend a VMM server in the primary site, and one in the secondary site | Each VMM server should be connected to the internet.<br/><br/> Each server should have at least one VMM private cloud, with the Hyper-V capability profile set.<br/><br/> You install the Azure Site Recovery Provider on the VMM server. The Provider coordinates and orchestrates replication with the Site Recovery service over the internet. Communications between the Provider and Azure are secure and encrypted.
**Hyper-V server** |  One or more Hyper-V host servers in the primary and secondary VMM clouds.<br/><br/> Servers should be connected to the internet.<br/><br/> Data is replicated between the primary and secondary Hyper-V host servers over the LAN or VPN, using Kerberos or certificate authentication.  
**Hyper-V VMs** | Located on the source Hyper-V host server. | The source host server should have at least one VM that you want to replicate.

### Replication process

1. You set up the Azure account.
2. You create a Replication Services vault for Site Recovery, and configure vault settings, including:

    - The replication source and target (primary and secondary sites).
    - Installation of the Azure Site Recovery Provider and the Microsoft Azure Recovery Services agent. The Provider is installed on VMM servers, and the agent on each Hyper-V host.
    - You create a replication policy for source VMM cloud. The policy is applied to all VMs located on hosts in the cloud.
    - You enable replication for Hyper-V VMs. Initial replication occurs in accordance with the replication policy settings.
4. Data changes are tracked, and replication of delta changes to begins after the initial replication finishes. Tracked changes for an item are held in a .hrl file.
5. You run a test failover to make sure everything's working.

**Figure 1: VMM to VMM replication**

![On-premises to on-premises](./media/site-recovery-components/arch-onprem-onprem.png)

### Failover and failback process

1. You can run a planned or unplanned [failover](site-recovery-failover.md) between on-premises sites. If you run a planned failover, then source VMs are shut down to ensure no data loss.
2. You can fail over a single machine, or create [recovery plans](site-recovery-create-recovery-plans.md) to orchestrate failover of multiple machines.
4. If you perform an unplanned failover to a secondary site, after the failover machines in the secondary location aren't enabled for protection or replication. If you ran a planned failover, after the failover, machines in the secondary location are protected.
5. Then, you commit the failover to start accessing the workload from the replica VM.
6. When your primary site is available again, you initiate reverse replication to replicate from the secondary site to the primary. Reverse replication brings the virtual machines into a protected state, but the secondary datacenter is still the active location.
7. To make the primary site into the active location again, you initiate a planned failover from secondary to primary, followed by another reverse replication.




## Replicate VMware VMs/physical servers to a secondary site

You replicate VMware VMs or physical servers to a secondary site using InMage Scout, using these architectural components:


### Architectural components

**Component** | **Location** | **Details**
--- | --- | ---
**Azure** | InMage Scout. | To obtain InMage Scout you need an Azure subscription.<br/><br/> After you create a Recovery Services vault, you download InMage Scout and install the latest updates to set up the deployment.
**Process server** | Located in primary site | You deploy the process server to handle caching, compression, and data optimization.<br/><br/> It also handles push installation of the Unified Agent to machines you want to protect.
**Configuration server** | Located in secondary site | The configuration server manages, configure, and monitor your deployment, either using the management website or the vContinuum console.
**vContinuum server** | Optional. Installed in the same location as the configuration server. | It provides a console for managing and monitoring your protected environment.
**Master target server** | Located in the secondary site | The master target server holds replicated data. It receives data from the process server, creates a replica machine in the secondary site, and holds the data retention points.<br/><br/> The number of master target servers you need depends on the number of machines you're protecting.<br/><br/> If you want to fail back to the primary site, you need a master target server there too. The Unified Agent is installed on this server.
**VMware ESX/ESXi and vCenter server** |  VMs are hosted on ESX/ESXi hosts. Hosts are managed with a vCenter server | You need a VMware infrastructure to replicate VMware VMs.
**VMs/physical servers** |  Unified Agent installed on VMware VMs and physical servers you want to replicate. | The agent acts as a communication provider between all of the components.


### Replication process

1. You set up the component servers in each site (configuration, process, master target), and install the Unified Agent on machines that you want to replicate.
2. After initial replication, the agent on each machine sends delta replication changes to the process server.
3. The process server optimizes the data, and transfers it to the master target server on the secondary site. The configuration server manages the replication process.

**Figure 2: VMware to VMware replication**

![VMware to VMware](./media/site-recovery-components/vmware-to-vmware.png)


## Next steps

Review the [support matrix](site-recovery-support-matrix-to-sec-site.md)
