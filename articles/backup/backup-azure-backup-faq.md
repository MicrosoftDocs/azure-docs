---
title: Azure Backup FAQ
description: 'Answers to common questions about: Azure Backup features including Recovery Services vaults, what it can back up, how it works, encryption, and limits. '
services: backup
author: dcurwin
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 07/07/2019
ms.author: dacurwin
---

# Azure Backup - Frequently asked questions
This article answers common questions about the Azure Backup service.

## Recovery services vault

### Is there any limit on the number of vaults that can be created in each Azure subscription?
Yes. You can create up to 500 Recovery Services vaults, per supported region of Azure Backup, per subscription. If you need additional vaults, create an additional subscription.

### Are there limits on the number of servers/machines that can be registered against each vault?
You can register up to 1000 Azure Virtual machines per vault. If you are using the Microsoft Azure Backup Agent, you can register up to 50 MAB agents per vault. And you can register 50 MAB servers/DPM servers to a vault.

### If my organization has one vault, how can I isolate data from different servers in the vault when restoring data?
Server data that you want to recover together should use the same passphrase when you set up backup. If you want to isolate recovery to a specific server or servers, use a passphrase for that server or servers only. For example, human resources servers could use one encryption passphrase, accounting servers another, and storage servers a third.

### Can I move my vault between subscriptions?
Yes. To move a Recovery Services vault refer this [article](backup-azure-move-recovery-services-vault.md)

### Can I move backup data to another vault?
No. Backup data stored in a vault can't be moved to a different vault.

### Can I change from GRS to LRS after a backup?
No. A Recovery Services vault can only change storage options before any backups have been stored.

### Can I do an Item Level Restore (ILR) for VMs backed up to a Recovery Services vault?
- ILR is supported for Azure VMs backed up by Azure VM backup. For more information see, [article](backup-azure-restore-files-from-vm.md)
- ILR is not supported for online recovery points of on-premises VMs backed up by Azure backup Server or System Center DPM.


## Azure Backup agent

### Where can I find common questions about the Azure Backup agent for Azure VM backup?

- For the agent running on Azure VMs, read this [FAQ](backup-azure-vm-backup-faq.md).
- For the agent used to backup up Azure file folders, read this [FAQ](backup-azure-file-folder-backup-faq.md).


## General backup

### Are there limits on backup scheduling?
Yes.
- You can back up Windows Server or Windows machines up to three times a day. You can set the scheduling policy to daily or weekly schedules.
- You can back up DPM up to twice a day. You can set the scheduling policy to daily, weekly, monthly, and yearly.
- You back up Azure VMs once a day.

### What operating systems are supported for backup?
Azure Backup supports these operating systems for backing up files and folders, and apps protected by Azure Backup Server and DPM.

**OS** | **SKU** | **Details**
--- | --- | ---
Workstation | |
Windows 10 64 bit | Enterprise, Pro, Home | Machines should be running the latest services packs and updates.
Windows 8.1 64 bit | Enterprise, Pro | Machines should be running the latest services packs and updates.
Windows 8 64 bit | Enterprise, Pro | Machines should be running the latest services packs and updates.
Windows 7 64 bit | Ultimate, Enterprise, Professional, Home Premium, Home Basic, Starter | Machines should be running the latest services packs and updates.
Server | |
Windows Server 2019 64 bit | Standard, Datacenter, Essentials | With the latest service packs/updates.
Windows Server 2016 64 bit | Standard, Datacenter, Essentials | With the latest service packs/updates.
Windows Server 2012 R2 64 bit | Standard, Datacenter, Foundation | With the latest service packs/updates.
Windows Server 2012 64 bit | Datacenter, Foundation, Standard | With the latest service packs/updates.
Windows Storage Server 2016 64 bit | Standard, Workgroup | With the latest service packs/updates.
Windows Storage Server 2012 R2 64 bit | Standard, Workgroup, Essential | With the latest service packs/updates.
Windows Storage Server 2012 64 bit | Standard, Workgroup | With the latest service packs/updates.
Windows Server 2008 R2 SP1 64 bit | Standard, Enterprise, Datacenter, Foundation | With the latest updates.
Windows Server 2008 64 bit | Standard, Enterprise, Datacenter | With latest updates.

For Azure VM Linux backups, Azure Backup supports [the list of distributions endorsed by Azure](../virtual-machines/linux/endorsed-distros.md), except Core OS Linux and 32-bit operating system. Other bring-your-own Linux distributions might work as long as the VM agent is available on the VM, and support for Python exists.


### Are there size limits for data backup?
Sizes limits are as follows:

OS/machine | Size limit of data source
--- | ---
Windows 8 or later | 54,400 GB
Windows 7 |1700 GB
Windows Server 2012 or later | 54,400 GB
Windows Server 2008, Windows Server 2008 R2 | 1700 GB
Azure VM | 16 data disks<br/><br/> Data disk up to 4095 GB

### How is the data source size determined?
The following table explains how each data source size is determined.

**Data source** | **Details**
--- | ---
Volume |The amount of data being backed up from single volume VM being backed up.
SQL Server database |Size of single SQL database size being backed up.
SharePoint | Sum of the content and configuration databases within a SharePoint farm being backed up.
Exchange |Sum of all Exchange databases in an Exchange server being backed up.
BMR/System state |Each individual copy of BMR or system state of the machine being backed up.

### Is there a limit on the amount of data backed up using a Recovery Services vault?
There is no limit on the amount of data you can back up using a Recovery Services vault.

### Why is the size of the data transferred to the Recovery Services vault smaller than the data selected for backup?
Data backed up from Azure Backup Agent, DPM, and Azure Backup Server is compressed and encrypted before being transferred. With compression and encryption is applied, the data in the vault is 30-40% smaller.

### Can I delete individual files from a recovery point in the vault?
No, Azure Backup doesn't support deleting or purging individual items from stored backups.

### If I cancel a backup job after it starts, is the transferred backup data deleted?
No. All data that was transferred into the vault before the backup job was canceled remains in the vault.

- Azure Backup uses a checkpoint mechanism to occasionally add checkpoints to the backup data during the backup.
- Because there are checkpoints in the backup data, the next backup process can validate the integrity of the files.
- The next backup job will be incremental to the data previously backed up. Incremental backups only transfer new or changed data, which equates to better utilization of bandwidth.

If you cancel a backup job for an Azure VM, any transferred data is ignored. The next backup job transfers incremental data from the last successful backup job.

## Retention and recovery

### Are the retention policies for DPM and Windows machines without DPM the same?
Yes, they both have daily, weekly, monthly, and yearly retention policies.

### Can I customize retention policies?
Yes, you have customize policies. For example, you can configure weekly and daily retention requirements, but not yearly and monthly.

### Can I use different times for backup scheduling and retention policies?
No. Retention policies can only be applied on backup points. For example, this images shows a retention policy for backups taken at 12am and 6pm.

![Schedule Backup and Retention](./media/backup-azure-backup-faq/Schedule.png)


### If a backup is kept for a long time, does it take more time to recover an older data point? <br/>
No. The time to recover the oldest or the newest point is the same. Each recovery point behaves like a full point.

### If each recovery point is like a full point, does it impact the total billable backup storage?
Typical long-term retention point products store backup data as full points.

- The full points are storage *inefficient* but are easier and faster to restore.
- Incremental copies are storage *efficient* but require you to restore a chain of data, which impacts your recovery time

Azure Backup storage architecture gives you the best of both worlds by optimally storing data for fast restores and incurring low storage costs. This ensures that your ingress and egress bandwidth is used efficiently. The amount of data storage, and the time needed to recover the data, is kept to a minimum. Learn more about [incremental backups](https://azure.microsoft.com/blog/microsoft-azure-backup-save-on-long-term-storage/).

### Is there a limit on the number of recovery points that can be created?
You can create up to 9999 recovery points per protected instance. A protected instance is a computer, server (physical or virtual), or workload that backs up to Azure.

- Learn more about [backup and retention](./backup-overview.md#backup-and-retention).


### How many times can I recover data that's backed up to Azure?
There is no limit on the number of recoveries from Azure Backup.

### When restoring data, do I pay for the egress traffic from Azure?
No. Recovery is free and you aren't charged for the egress traffic.

### What happens when I change my backup policy?
When a new policy is applied, schedule and retention of the new policy is followed.

- If retention is extended, existing recovery points are marked to keep them as per new policy.
- If retention is reduced, they are marked for pruning in the next cleanup job and subsequently deleted.

## Encryption

### Is the data sent to Azure encrypted?
Yes. Data is encrypted on the on-premises machine using AES256. The data is sent over a secure HTTPS link. The data transmitted in cloud is protected by HTTPS link only between storage and recovery service. iSCSI protocol secures the data transmitted between recovery service and user machine. Secure tunneling is used to protect the iSCSI channel.

### Is the backup data on Azure encrypted as well?
Yes. The data in Azure is encrypted-at-rest.

- For on-premises backup, encryption-at-rest is provided using the passphrase you provide when backing up to Azure.
- For Azure VMs, data is encrypted-at-rest using Storage Service Encryption (SSE).

Microsoft does not decrypt the backup data at any point.

### What is the minimum length of encryption the key used to encrypt backup data?
The encryption key should be at least 16 characters when you are using Azure backup agent. For Azure VMs, there is no limit to length of keys used by Azure KeyVault.

### What happens if I misplace the encryption key? Can I recover the data? Can Microsoft recover the data?
The key used to encrypt the backup data is present only on your site. Microsoft does not maintain a copy in Azure and does not have any access to the key. If you misplace the key, Microsoft can't recover the backup data.

## Next steps

Read the other FAQs:

- [Common questions](backup-azure-vm-backup-faq.md) about Azure VM backups.
- [Common questions](backup-azure-file-folder-backup-faq.md) about the Azure Backup agent
