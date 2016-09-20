<properties
	pageTitle="Hyper-V replication with Azure Site Recovery | Microsoft Azure"
	description="Use this article to understand the technical concepts that help you successfully install, configure, and manage Azure Site Recovery."
	services="site-recovery"
	documentationCenter=""
	authors="anbacker"
	manager="mkjain"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="storage-backup-recovery"
	ms.date="09/12/2016"
	ms.author="anbacker"/>  


# Hyper-V replication with Azure Site Recovery

This article describes the technical concepts that help you successfully configure and manage a Hyper-V site or a System Center Virtual Machine Manager (VMM) site to Azure protection by using Azure Site Recovery.

## Hyper-V site or VMM site deployment for replication between on-premises and Azure

As part of setting up disaster recovery between on-premises and Azure, Azure Site Recovery Provider needs to be downloaded and installed on the VMM server. Azure Recovery Services Agent needs to be installed on each Hyper-V host.

![VMM site deployment for replication between on-premises and Azure](media/site-recovery-understanding-site-to-azure-protection/image00.png)

Hyper-V Site deployment is the same as the VMM site deployment. The only difference is that the provider and agent are installed on the Hyper-V host itself.

## Workflows

### Enable protection
After you protect a virtual machine from the Azure portal or on-premises, a Site Recovery job named *Enable Protection* will start and can be monitored under the **JOBS** tab.

![Troubleshoot on-premises Hyper-V issues](media/site-recovery-understanding-site-to-azure-protection/image001.PNG)

The Enable Protection job checks for the prerequisites before invoking the [CreateReplicationRelationship](https://msdn.microsoft.com/library/hh850036.aspx)method. This method creates replication to Azure by using inputs that are configured during protection. The Enable Protection job starts the initial replication from on-premises by invoking the [StartReplication](https://msdn.microsoft.com/library/hh850303.aspx) method. This method sends the virtual machine's virtual disks to Azure.

![Troubleshoot on-premises Hyper-V issues](media/site-recovery-understanding-site-to-azure-protection/IMAGE002.PNG)

### Finalize protection
A [Hyper-V VM snapshot](https://technet.microsoft.com/library/dd560637.aspx) is taken when initial replication is triggered. Virtual hard disks are processed one by one till all the disks are uploaded to Azure. This normally takes a while to finish, based on the disk size and the bandwidth. To optimize your network usage, see [How to manage on-premises to Azure protection network bandwidth usage](https://support.microsoft.com/kb/3056159).

After the initial replication finishes, the *Finalize protection on the virtual machine* job configures the network and post-replication settings. While initial replication is in progress, all the changes to the disks are tracked. Additional disk storage will be consumed for the snapshot and Hyper-V Replica Log (HRL) files while initial replication is in progress.

On completion of an initial replication, the Hyper-V VM snapshot is deleted. This deletion results in merging data changes after initial replication to the parent disk.

![Troubleshoot on-premises Hyper-V issues](media/site-recovery-understanding-site-to-azure-protection/image03.png)

### Delta replication
Hyper-V Replica Replication Tracker, which is part of the Hyper-V Replica Replication Engine, tracks the changes to a virtual hard disk as Hyper-V Replica Log (*.hrl) files. HRL files will be located in the same directory as the associated disks. Each disk that's configured for replication has an associated HRL file. This log is sent to the customer's storage account after initial replication is complete. When a log is in transit to Azure, the changes in the primary are tracked in another log file in the same directory.

VM replication health during initial replication or delta replication can be monitored in the VM view, as mentioned in [Monitor replication health for virtual machine](./site-recovery-monitoring-and-troubleshooting.md#monitor-replication-health-for-virtual-machine).  

### Re-synchronization
A virtual machine is marked for re-synchronization when both delta replication fails and full initial replication is costly in terms of network bandwidth or time. For example, when HRL file size piles up to 50 percent of the total disk size, the virtual machine is marked for re-synchronization. Re-synchronization minimizes the amount of data sent over the network by computing checksums of the source and target virtual machine disks and sending only the differential.

After re-synchronization finishes, normal delta replication should resume. Re-synchronization can be resumed in the event of an outage (e.g. network outage, VMMS crash, etc.).

By default *Automatically scheduled re-synchronization* is configured during the non-office work hours. If the virtual machine needs to be re-synchronized manually, select the virtual machine from the portal and click RESYNCHRONIZE.

![Troubleshoot on-premises Hyper-V issues](media/site-recovery-understanding-site-to-azure-protection/image04.png)

Re-synchronization uses a fixed-block chunking algorithm where Source and Target files are divided into fixed chunks; check-sum for each chunk are generated and then compared to determine which block(s) from the Source need to be applied to the Target.

### Retry logic
There is built-in retry logic when replication errors occur. This can be classified into two categories as below.

| Category              	| Scenarios                                    |
|---------------------------|----------------------------------------------|
| Non-Recoverable Error 	| No retry will be attempted. Virtual machine replication status will be shown as Critical and an administrator intervention is required. Examples would include <ul><li>A broken VHD chain</li><li>Replica virtual machine is in an invalid state</li><li>Network authentication error</li><li>Authorization Error</li><li>If a virtual machine isn't found in the case of a standalone Hyper-V server</li></ul>|
| Recoverable Error     	| Retries occur every replication interval using exponentially backoff which increases the retry interval from the start of first attempt (1, 2, 4, 8, 10 minutes). If an error persists, retry every 30 minutes. Examples would include <ul><li>Network Error</li><li>Low disk space</li><li>Low memory condition</li></ul>|

## Understanding Hyper-V virtual machine protection and recovery life cycle

![Understanding the Hyper-V virtual machine protection & recovery life cycle](media/site-recovery-understanding-site-to-azure-protection/image05.png)

## Other references

- [Monitor and troubleshoot protection for VMware, VMM, Hyper-V and Physical sites](./site-recovery-monitoring-and-troubleshooting.md)
- [Reaching out for Microsoft Support](./site-recovery-monitoring-and-troubleshooting.md#reaching-out-for-microsoft-support)
- [Common Azure Site Recovery errors and their resolutions](./site-recovery-monitoring-and-troubleshooting.md#common-asr-errors-and-their-resolutions)
