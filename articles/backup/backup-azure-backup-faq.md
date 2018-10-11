---
title: Azure Backup FAQ
description: 'Answers to common questions about: Azure Backup features including Recovery Services vaults, what it can back up, how it works, encryption, and limits. '
services: backup
author: markgalioto
manager: carmonm
keywords: backup and disaster recovery; backup service
ms.service: backup
ms.topic: conceptual
ms.date: 8/2/2018
ms.author: markgal
---
# Questions about the Azure Backup service
This article answers common questions about the Azure Backup components. In some of the answers, there are links to the articles that have comprehensive information. You can ask questions about Azure Backup by clicking **Comments** (to the right). Comments appear at the bottom of this article. You can also post questions about the Azure Backup service in the [discussion forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazureonlinebackup).

To quickly scan the sections in this article, use the links to the right, under **In this article**.


## Recovery services vault

### Is there any limit on the number of vaults that can be created in each Azure subscription? <br/>
Yes. You can create as many as 500 Recovery Services vaults, per supported region of Azure Backup, per subscription. If you need additional vaults, create an additional subscription.

### Are there limits on the number of servers/machines that can be registered against each vault? <br/>
You can register upto 1000 Azure Virtual machines per vault. If you are using MAB Agent, you can register upto 50 MAB agents per vault. And you can register 50 MAB servers/DPM servers to a vault.

### Can I use a REST API to query the size of protected items in a vault? <br/>
Yes, the article, [Usages - List by Vaults](https://t.co/2lgIrIaF0J), lists the information that can be obtained from the Recovery Services vault.

### If my organization has one vault, how can I isolate one server's data from another server when restoring data?<br/>
All servers that are registered to the same vault can recover the data backed up by other servers *that use the same passphrase*. If you have servers whose backup data you want to isolate from other servers in your organization, use a designated passphrase for those servers. For example, human resources servers could use one encryption passphrase, accounting servers another, and storage servers a third.

### Can I migrate my vault between subscriptions? <br/>
No. The vault is created at a subscription level, and can't be reassigned to another subscription.

### Can I migrate backup data to another vault? <br/>
No. Backup data stored in a vault can't be moved to a different vault.

### Can I change from GRS to LRS after a backup? <br/>
No. A Recovery Services vault can only change storage options before any backups have been stored.

### Recovery Services vaults are Resource Manager based. Are Backup vaults still supported? <br/>
Backup vaults have been converted to Recovery Services vaults. If you did not convert the Backup vault to a Recovery Services vault, then the Backup vault was converted to a Recovery Services vault for you.

### Can I migrate a Backup vault to a Recovery Services vault? <br/>
All Backup vaults have been converted to Recovery Services vaults. If you did not convert the Backup vault to a Recovery Services vault, then the Backup vault was converted to a Recovery Services vault for you.

## Azure Backup agent
Detailed list of questions are present in [FAQ on Azure file-folder backup](backup-azure-file-folder-backup-faq.md)

## Azure VM backup
Detailed list of questions are present in [FAQ on Azure VM backup](backup-azure-vm-backup-faq.md)

## Back up VMware servers

### Can I back up VMware vCenter servers to Azure?
Yes. You can use Azure Backup Server to back up VMware vCenter and ESXi to Azure. For information on the supported VMware version, see the article, [Azure Backup Server protection matrix](backup-mabs-protection-matrix.md). For step-by-step instructions, see [Use Azure Backup Server to back up a VMware server](backup-azure-backup-server-vmware.md).

### Do I need a separate license to recover a full on-premises VMware/Hyper-V cluster from DPM or Azure Backup Server?<br/>
You don't need separate licensing for VMware/Hyper-V protection. If you're a System Center customer, use DPM to protect VMware VMs. If you aren't a System Center customer, you can use Azure Backup Server (pay-as-you-go) to protect VMware VMs.

## Azure Backup Server and System Center Data Protection Manager
### Can I use Azure Backup Server to create a Bare Metal Recovery (BMR) backup for a physical server? <br/>
Yes.

### Can I Register my DPM Server to multiple vaults? <br/>
No. A DPM or MABS server can be registered to only one vault.

### Which version of System Center Data Protection Manager is supported?
We recommend that you install the [latest](http://aka.ms/azurebackup_agent) Azure Backup agent on the latest update rollup (UR) for System Center Data Protection Manager (DPM).
- For System Center DPM 2012 R2, [Update Rollup 14](https://support.microsoft.com/help/4043315/update-rollup-14-for-system-center-2012-r2-data-protection-manager) is the latest update.
- For System Center DPM 2016, [Update Rollup 2](https://support.microsoft.com/en-us/help/3209593) is the latest update.

### I have installed Azure Backup agent to protect my files and folders. Can I install System Center DPM to protect on-premises application/VM workloads to Azure?
Yes. However, to use Azure Backup with System Center Data Protection Manager (DPM), install DPM first and then install Azure Backup agent. Installing the Azure Backup components in this order ensures the Azure Backup agent works with DPM. Installing the Azure Backup agent before installing DPM is not advised or supported.

### Can I use DPM to back up apps in Azure Stack?
No. Though you can use Azure Backup to protect Azure Stack, Azure Backup does not currently support using DPM to back up apps in Azure Stack.

## How Azure Backup works
### If I cancel a backup job once it has started, is the transferred backup data deleted? <br/>
No. All data transferred into the vault, before the backup job was canceled, stays in the vault. Azure Backup uses a checkpoint mechanism to occasionally add checkpoints to the backup data during the backup. Because there are checkpoints in the backup data, the next backup process can validate the integrity of the files. The next backup job will be incremental to the data previously backed up. Incremental backups only transfer new or changed data, which equates to better utilization of bandwidth.

If you cancel a backup job for an Azure VM, any transferred data is ignored. The next backup job transfers incremental data from the last successful backup job.

### Are there limits on when or how many times a backup job can be scheduled?<br/>
Yes. You can run backup jobs on Windows Server or Windows workstations up to three times/day. You can run backup jobs on System Center DPM up to two times a day. You can run a backup job for IaaS VMs once a day. Use the scheduling policy for Windows Server or Windows workstation to specify daily or weekly schedules. With System Center DPM, you can specify daily, weekly, monthly, and yearly schedules.

### Why is the size of the data transferred to the Recovery Services vault smaller than the data I backed up?<br/>
 All the data that is backed up from Azure Backup Agent or SCDPM or Azure Backup Server, is compressed and encrypted before being transferred. Once the compression and encryption is applied, the data in the Recovery Services vault is 30-40% smaller.

### Can I delete individual files from a recovery point in the vault?<br/>
No, Azure Backup doesn't support deleting or purging individual items from stored backups.

## What can I back up
### Which operating systems does Azure Backup support? <br/>
Azure Backup supports the following list of operating systems for backing up: files and folders, and workload applications protected using Azure Backup Server and System Center Data Protection Manager (DPM).

| Operating System | Platform | SKU |
|:--- | --- |:--- |
| Windows 8 and latest SPs |64 bit |Enterprise, Pro |
| Windows 7 and latest SPs |64 bit |Ultimate, Enterprise, Professional, Home Premium, Home Basic, Starter |
| Windows 8.1 and latest SPs |64 bit |Enterprise, Pro |
| Windows 10 |64 bit |Enterprise, Pro, Home |
| Windows Server 2016 |64 bit |Standard, Datacenter, Essentials |
| Windows Server 2012 R2 and latest SPs |64 bit |Standard, Datacenter, Foundation |
| Windows Server 2012 and latest SPs |64 bit |Datacenter, Foundation, Standard |
| Windows Storage Server 2016 and latest SPs |64 bit |Standard, Workgroup |
| Windows Storage Server 2012 R2 and latest SPs |64 bit |Standard, Workgroup |
| Windows Storage Server 2012 and latest SPs |64 bit |Standard, Workgroup |
| Windows Server 2012 R2 and latest SPs |64 bit |Essential |
| Windows Server 2008 R2 SP1 |64 bit |Standard, Enterprise, Datacenter, Foundation |

**For Azure VM backup:**

* **Linux**: Azure Backup supports [a list of distributions that are endorsed by Azure](../virtual-machines/linux/endorsed-distros.md) except Core OS Linux.  Other Bring-Your-Own-Linux distributions also might work as long as the VM agent is available on the virtual machine and support for Python exists.
* **Windows Server**:  Versions older than Windows Server 2008 R2 are not supported.


### Is there a limit on the size of each data source being backed up? <br/>
Azure Backup enforces a maximum size for a data source, however, the limits for the source are large. As of August 2015, the maximum size for a data source for the supported operating systems is:

| S.No | Operating system | Maximum size of data source |
|:---:|:--- |:--- |
| 1 |Windows Server 2012 or later |54,400 GB |
| 2 |Windows 8 or later |54,400 GB |
| 3 |Windows Server 2008, Windows Server 2008 R2 |1700 GB |
| 4 |Windows 7 |1700 GB |

The following table explains how each data source size is determined.

| Datasource | Details |
|:---:|:--- |
| Volume |The amount of data being backed up from single volume of a server or client machine |
| Hyper-V virtual machine |Sum of data of all the VHDs of the virtual machine being backed up |
| Microsoft SQL Server database |Size of single SQL database size being backed up |
| Microsoft SharePoint |Sum of the content and configuration databases within a SharePoint farm being backed up |
| Microsoft Exchange |Sum of all Exchange databases in an Exchange server being backed up |
| BMR/System State |Each individual copy of BMR or system state of the machine being backed up |

For Azure IaaS VM backup, each VM can have up to 32 data disks, and each data disk can be up to 4095 GB.

### Is there a limit on the amount of data held in a Recovery Services vault?
There is no limit on the amount of data you can back up to a Recovery Services vault.

## Retention policy and recovery points
### Is there a difference between the retention policy for DPM and Windows Server/client (that is, on Windows Server without DPM)?<br/>
No, both DPM and Windows Server/client have daily, weekly, monthly, and yearly retention policies.

### Can I configure my retention policies selectively – that is, configure weekly and daily but not yearly and monthly?<br/>
Yes, the Azure Backup retention structure allows you to have full flexibility in defining the retention policy as per your requirements.

### Can I “schedule a backup” at 6pm and specify retention policies at a different time?<br/>
No. Retention policies can only be applied on backup points. In the following image, the retention policy is specified for backups taken at 12am and 6pm. <br/>

![Schedule Backup and Retention](./media/backup-azure-backup-faq/Schedule.png)
<br/>

### If a backup is retained for a long duration, does it take more time to recover an older data point? <br/>
No – the time to recover the oldest or the newest point is the same. Each recovery point behaves like a full point.

### If each recovery point is like a full point, does it impact the total billable backup storage?<br/>
Typical long-term retention point products store backup data as full points. The full points are storage *inefficient* but are easier and faster to restore. Incremental copies are storage *efficient* but require you to restore a chain of data, which impacts your recovery time. Azure Backup storage architecture gives you the best of both worlds by optimally storing data for fast restores and incurring low storage costs. This data storage approach ensures that your ingress and egress bandwidth is used efficiently. Both the amount of data storage and the time needed to recover the data, is kept to a minimum. Learn more on how [incremental backups](https://azure.microsoft.com/blog/microsoft-azure-backup-save-on-long-term-storage/) are efficient.

### Is there a limit on the number of recovery points that can be created?<br/>
You can create up to 9999 recovery points per protected instance. A protected instance is a computer, server (physical or virtual), or workload configured to back up data to Azure. For more information, see the explanations of [Backup and retention](./backup-introduction-to-azure-backup.md#backup-and-retention), and [What is a protected instance](./backup-introduction-to-azure-backup.md#what-is-a-protected-instance)?

### How many recoveries can I perform on the data that is backed up to Azure?<br/>
There is no limit on the number of recoveries from Azure Backup.

### When restoring data, do I pay for the egress traffic from Azure? <br/>
No. Your recoveries are free and you are not charged for the egress traffic.

### What happens when I change my backup policy?
When a new policy is applied, schedule and retention of the new policy is followed. If retention is extended, existing recovery points are marked to keep them as per new policy. If retention is reduced, they are marked for pruning in the next cleanup job and subsequently deleted.

## Azure Backup encryption
### Is the data sent to Azure encrypted? <br/>
Yes. Data is encrypted on the on-premises server/client/SCDPM machine using AES256 and the data is sent over a secure HTTPS link.

### Is the backup data on Azure encrypted as well?<br/>
Yes. The data sent to Azure remains encrypted (at rest). Microsoft does not decrypt the backup data at any point. When backing up an Azure VM, Azure Backup relies on encryption of the virtual machine. For example, if your VM is encrypted using Azure Disk Encryption, or some other encryption technology, Azure Backup uses that encryption to secure your data.

### What is the minimum length of encryption key used to encrypt backup data? <br/>
The encryption key should be at least 16 characters when you are using Azure backup agent. For Azure VMs, there is no limit to length of keys used by Azure KeyVault.

### What happens if I misplace the encryption key? Can I recover the data (or) can Microsoft recover the data? <br/>
The key used to encrypt the backup data is present only on the customer premises. Microsoft does not maintain a copy in Azure and does not have any access to the key. If the customer misplaces the key, Microsoft cannot recover the backup data.
