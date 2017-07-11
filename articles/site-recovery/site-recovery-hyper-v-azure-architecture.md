---
title: How does Hyper-V replication to Azure work in Site Recovery? | Microsoft Docs
description: This article provides an overview of how Hyper-V replication works in Azure Site Recovery
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid: c413efcd-d750-4b22-b34b-15bcaa03934a
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 06/14/2017
ms.author: raynew
ROBOTS: NOINDEX, NOFOLLOW
redirect_url: site-recovery-architecture-hyper-v-to-azure
---
# How does Hyper-V replication to Azure work?

Read this article to understand the architecture and workflows for Hyper-V replication to Azure using the [Azure Site Recovery](site-recovery-overview.md) service.

Post any comments at the bottom of this article, or in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

You can replicate the following to Azure:
- **Hyper-V with VMM**: VMs located on on-premises Hyper-V hosts managed in  System Center Virtual MAchine Manager (VMM) clouds. Hosts can be running any [supported operating system](site-recovery-support-matrix-to-azure.md#support-for-datacenter-management-servers). You can replicate Hyper-V VMs running any guest operating system [supported by Hyper-V and Azure](https://technet.microsoft.com/en-us/windows-server-docs/compute/hyper-v/supported-windows-guest-operating-systems-for-hyper-v-on-windows).
- **Hyper-V without VMM**: On-premises VMs located on Hyper-V hosts that aren't managed in VMM clouds. Hosts can run any of the [supported operating systems](site-recovery-support-matrix-to-azure.md#support-for-replicated-machine-os-versions). You can replicate Hyper-V VMs running any guest operating system [supported by Hyper-V and Azure](https://technet.microsoft.com/en-us/windows-server-docs/compute/hyper-v/supported-windows-guest-operating-systems-for-hyper-v-on-windows).


## Architectural components

**Area** | **Component** | **Details**
--- | --- | ---
**Azure** | In Azure you need a Microsoft Azure account, an Azure storage account, and a Azure network. | Storage and network can be Resource Manager-based, or classic accounts.<br/><br/> Replicated data is stored in the storage account, and Azure VMs are created with the replicated data when failover from your on-premises site occurs.<br/><br/> The Azure VMs connect to the Azure virtual network when they're created.
**VMM server** | Hyper-V hosts located in VMM clouds | If Hyper-V hosts are managed in VMM clouds, you register the VMM server in the Recovery Services vault.<br/><br/> On the VMM server you install the Site Recovery Provider to orchestrate replication with Azure.<br/><br/> You need logical and VM networks set up to configure network mapping. A VM network should be linked to a logical network that's associated with the cloud.
**Hyper-V host** | Hyper-V servers can be deployed with or without VMM server. | If there's no VMM server, the Site Recovery Provider is installed on the host to orchestrate replication with Site Recovery over the internet. If there's a VMM server, the Provider is installed on it, and not on the host.<br/><br/> The Recovery Services agent is installed on the host to handle data replication.<br/><br/> Communications from both the Provider and the agent are secure and encrypted. Replicated data in Azure storage is also encrypted.
**Hyper-V VMs** | You need one or more VMs on the Hyper-V host server. | Nothing needs to explicitly installed on VMs

## Deployment steps

1. **Azure**: You set up the Azure components. We recommend you set up storage and network accounts before you begin Site Recovery deployment.
2. **Vault**: You create a Recovery Services vault for Site Recovery, and configure vault settings, including configuring source and target settings, setting up a replication policy, and enabling replication.
3. **Source and target**:
    - **Hyper-V hosts in VMM clouds**: As part of specifying source settings, you download and install the Azure Site Recovery Provider on the VMM server, and the Azure Recovery Services agent on each Hyper-V host. The source will be the VMM server. The target is Azure.
    - Hyper-V hosts without VMM: When you specify source settings, you download and install the Provider and agent on each Hyper-V host. During deployment you gather the hosts into a Hyper-V site, and specify this site as the source. The target is Azure.

    ![Hyper-V/VMM replication to Azure](./media/site-recovery-components/arch-onprem-onprem-azure-vmm.png)
    ![Hyper-V site replication to Azure](./media/site-recovery-components/arch-onprem-azure-hypervsite.png)


4. **Replication policy**: You create a replication policy for the Hyper-V site or VMM cloud. The policy is applied to all VMs located on hosts in the site or cloud.
5. **Enable replication**: You enable replication for Hyper-V VMs. Initial replication occurs in accordance with the replication policy settings. Data changes are tracked, and replication of delta changes to Azure begins after the initial replication finishes. Tracked changes for an item are held in a .hrl file.
6. **Test failover**:  You run a test failover to make sure everything's working as expected.

Learn more about deployment:
- [Get started with Hyper-V VM replication to Azure - with VMM](site-recovery-vmm-to-azure.md)
- [Get started with Hyper-V VM replication to Azure - without VMM](site-recovery-hyper-v-site-to-azure.md)

## Hyper-V replication workflow

### Enable protection

1. After you enable protection for a Hyper-V VM, in the Azure portal or on-premises, the **Enable protection** starts.
2. The job checks that the machine complies with prerequisites, before invoking the [CreateReplicationRelationship](https://msdn.microsoft.com/library/hh850036.aspx), to set up replication with the settings you've configured.
3. The job starts initial replication by invoking the [StartReplication](https://msdn.microsoft.com/library/hh850303.aspx) method, to initialize a full VM replication, and send the VM's virtual disks to Azure.
4. You can monitor the job in the **Jobs** tab.
        ![Jobs list](media/site-recovery-hyper-v-azure-architecture/image1.png)
        ![Enable protection drill down](media/site-recovery-hyper-v-azure-architecture/image2.png)

### Initial replication

1. A [Hyper-V VM snapshot](https://technet.microsoft.com/library/dd560637.aspx) snapshot is taken when initial replication is triggered.
2. Virtual hard disks are replicated one by one until they're all copied to Azure. It could take a while, depending on the VM size, and network bandwidth. To optimize your network usage, see [How to manage on-premises to Azure protection network bandwidth usage](https://support.microsoft.com/kb/3056159).
3. If disk changes occur while initial replication is in progress, the Hyper-V Replica Replication Tracker tracks those changes as Hyper-V Replication Logs (.hrl). These files are located in the same folder as the disks. Each disk has an associated .hrl file that will be sent to secondary storage.
4. The snapshot and log files consume disk resources while initial replication is in progress.
5. When the initial replication finishes, the VM snapshot is deleted. Delta disk changes in the log are synchronized and merged to the parent disk.


### Finalize protection

1. After the initial replication finishes, the **Finalize protection on the virtual machine** job configures network and other post-replication settings, so that the virtual machine is protected.
    ![Finalize protection job](media/site-recovery-hyper-v-azure-architecture/image3.png)
2. If you're replicating to Azure, you might need to tweak the settings for the virtual machine so that it's ready for failover. At this point you can run a test failover to check everything is working as expected.

### Delta replication

1. After the initial replication, delta synchronization begins, in accordance with replication settings.
2. The Hyper-V Replica Replication Tracker tracks the changes to a virtual hard disk as .hrl files. Each disk that's configured for replication has an associated .hrl file. This log is sent to the customer's storage account after initial replication is complete. When a log is in transit to Azure, the changes in the primary disk are tracked in another log file, in the same directory.
3. During initial and delta replication, you can monitor the VM in the VM view. [Learn more](site-recovery-monitoring-and-troubleshooting.md#monitor-replication-health-for-virtual-machines).  

### Replication synchronization

1. If delta replication fails, and a full replication would be costly in terms of bandwidth or time, then a VM is marked for resynchronization. For example, if the .hrl files reach 50% of the disk size, then the VM will be marked for resynchronization.
2.  Resynchronization minimizes the amount of data sent by computing checksums of the source and target virtual machines, and sending only the delta data. Resynchronization uses a fixed-block chunking algorithm where source and target files are divided into fixed chunks. Checksums for each chunk are generated and then compared to determine which blocks from the source need to be applied to the target.
3. After resynchronization finishes, normal delta replication should resume. By default resynchronization is scheduled to run automatically outside office hours, but you can resynchronize a virtual machine manually. For example, you can resume resynchronization if a network outage or another outage occurs. To do this, select the VM in the portal > **Resynchronize**.

    ![Manual resynchronization](media/site-recovery-hyper-v-azure-architecture/image4.png)


### Retries

If a replication error occurs, there's a built-in retry. This logic can be classified into two categories:

**Category** | **Details**
--- | ---
**Non-recoverable errors** | No retry is attempted. VM status will be **Critical**, and administrator intervention is required. Examples of these errors include: broken VHD chain; Invalid state for the replica VM; Network authentication errors: authorization errors; VM not found errors (for standalone Hyper-V servers)
**Recoverable errors** | Retries occur every replication interval, using an exponential back-off that increases the retry interval from the start of the first attempt by 1, 2, 4, 8, and 10 minutes. If an error persists, retry every 30 minutes. Examples include: network errors; low disk  errors; low memory conditions |

## Protection and recovery lifecycle

![workflow](./media/site-recovery-components/arch-hyperv-azure-workflow.png)

## Next steps

- [Check deployment prerequisites](site-recovery-prereq.md)
- Troubleshoot with:
    - [Monitor and troubleshoot protection](site-recovery-monitoring-and-troubleshooting.md)
    - [Help from Microsoft support](site-recovery-monitoring-and-troubleshooting.md#reach-out-for-microsoft-support)
    - [Common errors and resolutions](site-recovery-monitoring-and-troubleshooting.md#common-azure-site-recovery-errors-and-their-resolutions)
