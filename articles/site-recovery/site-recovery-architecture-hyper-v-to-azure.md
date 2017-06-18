---
title: How does Hyper-V replication to Azure work in Azure Site Recovery? | Microsoft Docs
description: This article provides an overview of components and architecture used when replicating on-premises Hyper-V VMs to Azure with the Azure Site Recovery service.
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


# How does Hyper-V replication to Azure work in Site Recovery?


This article describes the components and processes involved when replicating on-premises Hyper-V virtual machines, to Azure using the [Azure Site Recovery](site-recovery-overview.md) service.

Site Recovery can replicate Hyper-V VMs on Hyper-V clusters and standalone hosts that are managed with or without System Center Virtual Machine Manager (VMM).

Post any comments at the bottom of this article, or in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).



## Architectural components

There are a number of components involved when replicating Hyper-V VMs to Azure.

**Component** | **Location** | **Details**
--- | --- | ---
**Azure** | In Azure you need a Microsoft Azure account, an Azure storage account, and a Azure network. | Replicated data is stored in the storage account, and Azure VMs are created with the replicated data when failover from your on-premises site occurs.<br/><br/> The Azure VMs connect to the Azure virtual network when they're created.
**VMM server** | Hyper-V hosts are located in VMM clouds | If Hyper-V hosts are managed in VMM clouds, you register the VMM server in the Recovery Services vault.<br/><br/> On the VMM server you install the Site Recovery Provider to orchestrate replication with Azure.<br/><br/> You need logical and VM networks set up to configure network mapping. A VM network should be linked to a logical network that's associated with the cloud.
**Hyper-V host** | Hyper-V hosts and clusters can be deployed with or without VMM server. | If there's no VMM server, the Site Recovery Provider is installed on the host to orchestrate replication with Site Recovery over the internet. If there's a VMM server, the Provider is installed on it, and not on the host.<br/><br/> The Recovery Services agent is installed on the host to handle data replication.<br/><br/> Communications from both the Provider and the agent are secure and encrypted. Replicated data in Azure storage is also encrypted.
**Hyper-V VMs** | You need one or more VMs running on a Hyper-V host server. | Nothing needs to explicitly installed on VMs.

Learn about the deployment prerequisites and requirements for each of these components in the [support matrix](site-recovery-support-matrix-to-azure.md).

**Figure 1: Hyper-V site to Azure replication**

![Components](./media/site-recovery-components/arch-onprem-azure-hypervsite.png)

**Figure 2: Hyper-V in VMM clouds to Azure replication**

![Components](./media/site-recovery-components/arch-onprem-onprem-azure-vmm.png)


## Replication process

**Figure 3: Replication and recovery process for Hyper-V replication to Azure**

![workflow](./media/site-recovery-components/arch-hyperv-azure-workflow.png)

### Enable protection

1. After you enable protection for a Hyper-V VM, in the Azure portal or on-premises, the **Enable protection** starts.
2. The job checks that the machine complies with prerequisites, before invoking the [CreateReplicationRelationship](https://msdn.microsoft.com/library/hh850036.aspx), to set up replication with the settings you've configured.
3. The job starts initial replication by invoking the [StartReplication](https://msdn.microsoft.com/library/hh850303.aspx) method, to initialize a full VM replication, and send the VM's virtual disks to Azure.
4. You can monitor the job in the **Jobs** tab.
        ![Jobs list](media/site-recovery-hyper-v-azure-architecture/image1.png)
        ![Enable protection drill down](media/site-recovery-hyper-v-azure-architecture/image2.png)

### Replicate the initial data

1. A [Hyper-V VM snapshot](https://technet.microsoft.com/library/dd560637.aspx) snapshot is taken when initial replication is triggered.
2. Virtual hard disks are replicated one by one until they're all copied to Azure. It could take a while, depending on the VM size, and network bandwidth. To optimize your network usage, see [How to manage on-premises to Azure protection network bandwidth usage](https://support.microsoft.com/kb/3056159).
3. If disk changes occur while initial replication is in progress, the Hyper-V Replica Replication Tracker tracks those changes as Hyper-V Replication Logs (.hrl). These files are located in the same folder as the disks. Each disk has an associated .hrl file that will be sent to secondary storage.
4. The snapshot and log files consume disk resources while initial replication is in progress.
5. When the initial replication finishes, the VM snapshot is deleted. Delta disk changes in the log are synchronized and merged to the parent disk.


### Finalize protection

1. After the initial replication finishes, the **Finalize protection on the virtual machine** job configures network and other post-replication settings, so that the virtual machine is protected.
    ![Finalize protection job](media/site-recovery-hyper-v-azure-architecture/image3.png)
2. If you're replicating to Azure, you might need to tweak the settings for the virtual machine so that it's ready for failover. At this point you can run a test failover to check everything is working as expected.

### Replicate the delta

1. After the initial replication, delta synchronization begins, in accordance with replication settings.
2. The Hyper-V Replica Replication Tracker tracks the changes to a virtual hard disk as .hrl files. Each disk that's configured for replication has an associated .hrl file. This log is sent to the customer's storage account after initial replication is complete. When a log is in transit to Azure, the changes in the primary disk are tracked in another log file, in the same directory.
3. During initial and delta replication, you can monitor the VM in the VM view. [Learn more](site-recovery-monitoring-and-troubleshooting.md#monitor-replication-health-for-virtual-machines).  

### Synchronize replication

1. If delta replication fails, and a full replication would be costly in terms of bandwidth or time, then a VM is marked for resynchronization. For example, if the .hrl files reach 50% of the disk size, then the VM will be marked for resynchronization.
2.  Resynchronization minimizes the amount of data sent by computing checksums of the source and target virtual machines, and sending only the delta data. Resynchronization uses a fixed-block chunking algorithm where source and target files are divided into fixed chunks. Checksums for each chunk are generated and then compared to determine which blocks from the source need to be applied to the target.
3. After resynchronization finishes, normal delta replication should resume. By default resynchronization is scheduled to run automatically outside office hours, but you can resynchronize a virtual machine manually. For example, you can resume resynchronization if a network outage or another outage occurs. To do this, select the VM in the portal > **Resynchronize**.

    ![Manual resynchronization](media/site-recovery-hyper-v-azure-architecture/image4.png)


### Retry logic

If a replication error occurs, there's a built-in retry. This logic can be classified into two categories:

**Category** | **Details**
--- | ---
**Non-recoverable errors** | No retry is attempted. VM status will be **Critical**, and administrator intervention is required. Examples of these errors include: broken VHD chain; Invalid state for the replica VM; Network authentication errors: authorization errors; VM not found errors (for standalone Hyper-V servers)
**Recoverable errors** | Retries occur every replication interval, using an exponential back-off that increases the retry interval from the start of the first attempt by 1, 2, 4, 8, and 10 minutes. If an error persists, retry every 30 minutes. Examples include: network errors; low disk  errors; low memory conditions |



## Failover and failback process

1. You can run a planned or unplanned [failover](site-recovery-failover.md) from on-premises Hyper-V VMs to Azure. If you run a planned failover, then source VMs are shut down to ensure no data loss.
2. You can fail over a single machine, or create [recovery plans](site-recovery-create-recovery-plans.md) to orchestrate failover of multiple machines.
4. After you run the failover, you should be able to see the created replica VMs in Azure. You can assign a public IP address to the VM if required.
5. You then commit the failover to start accessing the workload from the replica Azure VM.
6. When your primary on-premises site is available again, you can [fail back](site-recovery-failback-from-azure-to-hyper-v.md). You kick off a planned failover from Azure to the primary site. For a planned failover you can select to failback to the same VM or to an alternate location, and synchronize changes between Azure and on-premises, to ensure no data loss. When VMs are created on-premises, you commit the failover.




## Next steps

Review the [support matrix](site-recovery-support-matrix-to-azure.md)
