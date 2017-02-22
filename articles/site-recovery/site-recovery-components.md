---
title: How does Site Recovery work? | Microsoft Docs
description: This article provides an overview of Site Recovery architecture
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid: c413efcd-d750-4b22-b34b-15bcaa03934a
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 02/21/2017
ms.author: raynew

---
# How does Azure Site Recovery work?

Read this article to understand the underlying architecture of the Azure Site Recovery service, and the components that make it work.

Site Recovery is an Azure service that contributes to your BCDR strategy by orchestrating replication of on-premises physical servers and virtual machines to the cloud (Azure), or to a secondary datacenter. When outages occur in your primary location, you fail over to the secondary location to keep apps and workloads available. You fail back to your primary location when it returns to normal operations. Learn more in [What is Site Recovery?](site-recovery-overview.md)

This article describes deployment in the [Azure portal](https://portal.azure.com). The [Azure classic portal](https://manage.windowsazure.com/) can be used to maintain existing Site Recovery vaults, but you can't create new vaults.

Post any comments at the bottom of this article, or in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Deployment scenarios

Site Recovery can be deployed to orchestrate replication in a number of scenarios:

- **Replicate VMware virtual machines**: You can replicate on-premises VMware virtual machines to Azure, or to a secondary datacenter.
- **Replicate physical machines**: You can replicate physical machines (Windows or Linux) to Azure, or to a secondary datacenter. The process for replicating physical machines is almost the same as that for replicating VMware VMs.
- **Replicate Hyper-V VMs**: You can replicate Hyper-V VMs to Azure, or to a secondary VMM site. If you want to replicate them to a secondary site, they must be managed in System Center Virtual Machine Manager (VMM) clouds.
- **Migrate VMs**: In addition to replicating (replicate, failover and failback) on-premises VMs and physical servers to Azure, you can also migrate them to Azure VMs (replicate, failover, no failback). Here's what you can migrate:
    - Migrate workloads running on on-premises Hyper-V VMs, VMware VMs, and physical servers, to run on Azure VMs.
    - Migrate [Azure IaaS VMs](site-recovery-migrate-azure-to-azure.md) between Azure regions. Currently only migration is supported in this scenario, which means failback isn't supported.
    - Migrate [AWS Windows instances](site-recovery-migrate-aws-to-azure.md) to Azure IaaS VMs. Currently only migration is supported in this scenario, which means failback isn't supported.

Site Recovery replicates apps running on supported VMs and physical servers. You can get a full summary of the supported apps in [What workloads can Azure Site Recovery protect?](site-recovery-workload.md)

## Replicate VMware VMs/physical servers to Azure

### Components

**Component** | **Details**
--- | ---
**Azure** | In Azure you need a Microsoft Azure account, an Azure storage account, and an Azure network.<br/><br/> Storage and network can be Resource Manager accounts, or classic accounts.<br/><br/>  Replicated data is stored in the storage account, and Azure VMs are created with the replicated data when failover from your on-premises site occurs. The Azure VMs connect to the Azure virtual network when they're created.
**Configuration server** | You set up a configuration server on-premises, to coordinate communications between the on-premises site and Azure, and to manage data replication.
**Process server** | Installed by default on the on-premises configuration server.<br/><br/> Acts as a replication gateway. It receives replication data from protected source machines, optimizes it with caching, compression, and encryption, and sends the data to Azure storage.<br/><br/> Handles push installation of the Mobility service to protected machines, and performs automatic discovery of VMware VMs.<br/><br/> As your deployment grows you can add additional separate dedicated process servers to handle increasing volumes of replication traffic.
**Master target server** | Installed by default on the on-premises configuration server.<br/><br/> Handles replication data during failback from Azure. If volumes of failback traffic are high, you can deploy a separate master target server for failback.
**VMware servers** | You add vCenter and vSphere servers to your Recovery Services vault, to replicate VMware VMs.<br/><br/> If you replicate physical servers, you will need an on-premises VMware infrastructure for failback. You can't fail back to a physical machine.
**Replicated machines** | The Mobility service must be installed on each machine you want to replicate. It can be installed manually on each machine, or with a push installation from the process server.

**Figure 1: VMware to Azure components**

![Components](./media/site-recovery-components/arch-enhanced.png)

### Replication process

1. You set up the deploying, including the Azure components, and a Recovery Services vault. In the vault you specify the replication source and target, set up the configuration server, add VMware servers, create a replication policy, deploy the Mobility service, enable replication, and run a test failover.
2.  Machines start replicating in accordance with the replication policy, and an initial copy of the data is replicated to Azure storage.
4. Replication of delta changes to Azure begins after the initial replication finishes. Tracked changes for a machine are held in a .hrl file.
    - Replicating machines communicate with the configuration server on port HTTPS 443 inbound, for replication management.
    - Replicating machines send replication data to the process server on port HTTPS 9443 inbound (can be configured).
    - The configuration server orchestrates replication management with Azure over port HTTPS 443 outbound.
    - The process server receives data from source machines, optimizes and encrypts it, and sends it to Azure storage over port 443 outbound.
    - If you enable multi-VM consistency, then machines in the replication group communicate with each other over port 20004. Multi-VM is used if you group multiple machines into replication groups that share crash-consistent and app-consistent recovery points when they fail over. This is useful if machines are running the same workload and need to be consistent.
5. Traffic is replicated to Azure storage public endpoints, over the internet. Alternately, you can use Azure ExpressRoute [public peering](https://docs.microsoft.com/en-us/azure/expressroute/expressroute-circuit-peerings#public-peering). Replicating traffic over a site-to-site VPN from an on-premises site to Azure isn't supported.

**Figure 2: VMware to Azure replication**

![Enhanced](./media/site-recovery-components/v2a-architecture-henry.png)

### Failover and failback process

1. You run unplanned failovers from on-premises VMware VMs and physical servers to Azure. Planned failover isn't supported.
2. You can fail over a single machine, or create [recovery plans](site-recovery-create-recovery-plans.md), to orchestrate failover of multiple machines.
3. When you run a failover, replica VMs are created in Azure. You commit a failover to start accessing the workload from the replica Azure VM.
4. When your primary on-premises site is available again, you can fail back. You set up a failback infrastructure, start replicating the machine from the secondary site to the primary, and run an unplanned failover from the secondary site. After you commit this failover, data will be back on-premises, and you need to enable replication to Azure again. [Learn more](site-recovery-failback-azure-to-vmware.md)

There are a few failback requirements:

- **Physical-to-physical failback isn't supported**: This means that if you fail over physical servers to Azure and then want to fail back, you must fail back to a VMware VM. You can't fail back to a physical server. You'll need an Azure VM to fail back to, and if you didn't deploy the configuration server as a VMware VM you'll need to set up a separate master target server as a VMware VM. This is needed because the master target server interacts and attaches to VMware storage to restore the disks to a VMware VM.
- **Temporary process server in Azure**: If you want to fail back from Azure after failover you'll need to set up an Azure VM configured as a process server, to handle replication from Azure. You can delete this VM after failback finishes.
- **VPN connection**: For failback you'll need a VPN connection (or Azure ExpressRoute) set up from the Azure network to the on-premises site.
- **Separate on-premises master target server**: The on-premises master target server handles failback. The master target server is installed by default on the management server, but if you're failing back larger volumes of traffic you should set up a separate on-premises master target server for this purpose.
- **Failback policy**: To replicate back to your on-premises site, you need a failback policy. This is automatically created when you created your replication policy.

**Figure 3: VMware/physical failback**

![Failback](./media/site-recovery-components/enhanced-failback.png)


## Replicate VMware VMs/physical servers to a secondary site

### Components

**Component** | **Details**
--- | ---
**Azure** | You deploy this scenario using InMage Scout. To obtain it you'll need an Azure subscription.<br/><br/> After you create a Recovery Services vault, you download InMage Scout and install the latest updates to set up the deployment.
**Process server** | You deploy the process server component in your primary site to handle caching, compression, and data optimization.<br/><br/> It also handles push installation of the Unified Agent to machines you want to protect.
**VMware ESX/ESXi and vCenter server** |  You need a VMware infrastructure to replicate VMware VMs.
**VMs/physical servers** |  You install the Unified Agent on VMware VMs or Windows/Linux physical servers you want to replicate.<br/><br/> The agent acts as a communication provider between all of the components.
**Configuration server** | The configuration server is installed in the secondary site to manage, configure, and monitor your deployment, either using the management website or the vContinuum console.
**vContinuum server** | Installed in the same location as the configuration server.<br/><br/> It provides a console for managing and monitoring your protected environment.
**Master target server (secondary site)** | The master target server holds replicated data. It receives data from the process server, creates a replica machine in the secondary site, and holds the data retention points.<br/><br/> The number of master target servers you need depends on the number of machines you're protecting.<br/><br/> If you want to fail back to the primary site, you need a master target server there too. The Unified Agent is installed on this server.

### Replication process

1. You set up the component servers in each site (configuration, process, master target), and install the Unified Agent on machines that you want to replicate.
2. After initial replication, the agent on each machine sends delta replication changes to the process server.
3. The process server optimizes the data, and transfers it to the master target server on the secondary site. The configuration server manages the replication process.

**Figure 4: VMware to VMware replication**

![VMware to VMware](./media/site-recovery-components/vmware-to-vmware.png)



## Replicate Hyper-V VMs to Azure


### Components

**Component** | **Details**
--- | ---

**Azure** | In Azure you need a Microsoft Azure account, an Azure storage account, and a Azure network.<br/><br/> Storage and network can be Resource Manager-based, or classic accounts.<br/><br/> Replicated data is stored in the storage account, and Azure VMs are created with the replicated data when failover from your on-premises site occurs.<br/><br/> The Azure VMs connect to the Azure virtual network when they're created.
**VMM server** | If your Hyper-V hosts are located in VMM clouds, you need logical and VM networks set up to configure network mapping. A VM network should be linked to a logical network that's associated with the cloud.
**Hyper-V host** | You need one or more Hyper-V host servers.
**Hyper-V VMs** | You need one or more VMs on the Hyper-V host server. The Provider running on the Hyper-V host coordinates and orchestrates replication with the Site Recovery service over the internet. The agent handles data replication data over HTTPS 443. Communications from both the Provider and the agent are secure and encrypted. Replicated data in Azure storage is also encrypted.


## Replication process

1. You set up the Azure components. We recommend you set up storage and network accounts before you begin Site Recovery deployment.
2. You create a Replication Services vault for Site Recovery, and configure vault settings, including:
    - If you're not managing Hyper-V hosts in a VMM cloud, you create a Hyper-V site container, and add Hyper-V hosts to it.
    - The replication source and target. If your Hyper-V hosts are managed in VMM, the source is the VMM cloud. If they're not, the source is the Hyper-V site.
    - Installation of the Azure Site Recovery Provider and the Microsoft Azure Recovery Services agent. If you have VMM the Provider will be installed on it, and the agent on each Hyper-V host. If you don't have VMM, both the Provider and agent are installed on each host.
    - You create a replication policy for the Hyper-V site or VMM cloud. The policy is applied to all VMs located on hosts in the site or cloud.
    - You enable replication for Hyper-V VMs. Initial replication occurs in accordance with the replication policy settings.
4. Data changes are tracked, and replication of delta changes to Azure begins after the initial replication finishes. Tracked changes for an item are held in a .hrl file.
5. You run a test failover to make sure everything's working.

### Failover and failback process

1. You can run a planned or unplanned [failover](site-recovery-failover.md) from on-premises Hyper-V VMs to Azure. If you run a planned failover, then source VMs are shut down to ensure no data loss.
2. You can fail over a single machine, or create [recovery plans](site-recovery-create-recovery-plans.md) to orchestrate failover of multiple machines.
4. After you run the failover, you should be able to see the created replica VMs in Azure. You can assign a public IP address to the VM if required.
5. You then commit the failover to start accessing the workload from the replica Azure VM.
6. When your primary on-premises site is available again, you can fail back. You kick off a planned failover from Azure to the primary site. For a planned failover you can select to failback to the same VM or to an alternate location, and synchronize changes between Azure and on-premises, to ensure no data loss. When VMs are created on-premises, you commit the failover.

**Figure 5: Hyper-V site to Azure replication**

![Components](./media/site-recovery-components/arch-onprem-azure-hypervsite.png)

**Figure 6: Hyper-V in VMM clouds to Azure replication**

![Components](./media/site-recovery-components/arch-onprem-onprem-azure-vmm.png)



## Replicate Hyper-V VMs to a secondary site

### Components

**Component** | **Details**
--- | ---
**Azure account** | You need a Microsoft Azure account.
**VMM server** | We recommend a VMM server in the primary site, and one in the secondary site, connected to the internet.<br/><br/> Each server should have at least one VMM private cloud, with the Hyper-V capability profile set.<br/><br/> You install the Azure Site Recovery Provider on the VMM server. The Provider coordinates and orchestrates replication with the Site Recovery service over the internet. Communications between the Provider and Azure are secure and encrypted.
**Hyper-V server** |  You need one or more Hyper-V host servers in the primary and secondary VMM clouds. Servers should be connected to the internet.<br/><br/> Data is replicated between the primary and secondary Hyper-V host servers over the LAN or VPN, using Kerberos or certificate authentication.  
**Source machines** | The source Hyper-V host server should have at least one VM that you want to replicate.

## Replication process

1. You set up the Azure account.
2. You create a Replication Services vault for Site Recovery, and configure vault settings, including:

    - The replication source and target (primary and secondary sites).
    - Installation of the Azure Site Recovery Provider and the Microsoft Azure Recovery Services agent. The Provider is installed on VMM servers, and the agent on each Hyper-V host.
    - You create a replication policy for source VMM cloud. The policy is applied to all VMs located on hosts in the cloud.
    - You enable replication for Hyper-V VMs. Initial replication occurs in accordance with the replication policy settings.
4. Data changes are tracked, and replication of delta changes to begins after the initial replication finishes. Tracked changes for an item are held in a .hrl file.
5. You run a test failover to make sure everything's working.

**Figure 7: VMM to VMM replication**

![On-premises to on-premises](./media/site-recovery-components/arch-onprem-onprem.png)

### Failover and failback process

1. You can run a planned or unplanned [failover](site-recovery-failover.md) between on-premises sites. If you run a planned failover, then source VMs are shut down to ensure no data loss.
2. You can fail over a single machine, or create [recovery plans](site-recovery-create-recovery-plans.md) to orchestrate failover of multiple machines.
4. If you perform an unplanned failover to a secondary site, after the failover machines in the secondary location aren't enabled for protection or replication. If you ran a planned failover, after the failover, machines in the secondary location are protected.
5. Then, you commit the failover to start accessing the workload from the replica VM.
6. When your primary site is available again, you initiate reverse replication to replicate from the secondary site to the primary. Reverse replication brings the virtual machines into a protected state, but the secondary datacenter is still the active location.
7. To make the primary site into the active location again, you initiate a planned failover from secondary to primary, followed by another reverse replication.


### Hyper-V replication workflow

**Workflow stage** | **Action**
--- | ---
1. **Enable protection** | After you enable protection for a Hyper-V VM the **Enable Protection** job is initiated, to check that the machine complies with prerequisites. The job invokes two methods:<br/><br/> [CreateReplicationRelationship](https://msdn.microsoft.com/library/hh850036.aspx) to set up replication with the settings you've configured.<br/><br/> [StartReplication](https://msdn.microsoft.com/library/hh850303.aspx), to initialize a full VM replication.
2. **Initial replication** |  A virtual machine snapshot is taken, and virtual hard disks are replicated one by one until they're all copied to the secondary location.<br/><br/> The time needed to complete this depends on the VM size, network bandwidth, and the initial replication method.<br/><br/> If disk changes occur while initial replication is in progress, the Hyper-V Replica Replication Tracker tracks those changes as Hyper-V Replication Logs (.hrl) that are located in the same folder as the disks.<br/><br/> Each disk has an associated .hrl file that will be sent to secondary storage.<br/><br/> The snapshot and log files consume disk resources while initial replication is in progress. When the initial replication finishes, the VM snapshot is deleted, and the delta disk changes in the log are synchronized and merged.
3. **Finalize protection** | After initial replication finishes, the **Finalize protection** job configures network and other post-replication settings, so that the virtual machine is protected.<br/><br/> If you're replicating to Azure, you might need to tweak the settings for the virtual machine so that it's ready for failover.<br/><br/> At this point you can run a test failover to check everything is working as expected.
4. **Replication** | After the initial replication, delta synchronization begins, in accordance with replication settings.<br/><br/> **Replication failure**: If delta replication fails, and a full replication would be costly in terms of bandwidth or time, then resynchronization occurs. For example, if the .hrl files reach 50% of the disk size, then the VM will be marked for resynchronization. Resynchronization minimizes the amount of data sent by computing checksums of the source and target virtual machines, and sending only the delta. After resynchronization finishes, delta replication will resume. By default resynchronization is scheduled to run automatically outside office hours, but you can resynchronize a virtual machine manually.<br/><br/> **Replication error**: If a replication error occurs, there's a built-in retry. If it's a non-recoverable error such as an authentication or authorization error, or a replica machine is in an invalid state, then no retry will be attempted. If it's a recoverable error such as a network error, or low disk space/memory, then a retry occurs with increasing intervals between retries (1, 2, 4, 8, 10, and then every 30 minutes).
5. **Planned/unplanned failover** | You can run planned or unplanned failovers as needed.<br/><br/> If you run a planned failover, then source VMs are shut down to ensure no data loss.<br/><br/> After replica VMs are created, they're placed in a commit pending state. You need to commit them to complete the failover.<br/><br/> After the primary site is up and running, you can fail back to the primary site, when it's available.


**Figure 8: Hyper-V workflow**

![workflow](./media/site-recovery-components/arch-hyperv-azure-workflow.png)

## Next steps

[Check prerequisites](site-recovery-prereq.md)
