<properties
	pageTitle="Planning your VM backup infrastructure in Azure | Microsoft Azure"
	description="Important considerations for planning your VM backup infrastructure in Azure"
	services="backup"
	documentationCenter=""
	authors="Jim-Parker"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/22/2015"
	ms.author="trinadhk; aashishr; jimpark; markgal"/>

# Planning your VM backup infrastructure in Azure
This article covers the key considerations you need to keep in mind when planning your VM backup infrastructure. If you've [prepared your environment](backup-azure-vms-prepare.md) this is the next step before you begin [backing up your VMs](backup-azure-vms.md). If you need more information about Azure virtual machines, see the [Virtual Machine documentation](https://azure.microsoft.com/documentation/services/virtual-machines/).

## How does Azure back up virtual machines?
When the Azure Backup service initiates a backup job at the scheduled time, it triggers the backup extension to take a point-in-time snapshot. This snapshot is taken in coordination with the Volume Shadowing Service (VSS) to get a consistent snapshot of the disks in the virtual machine without having to shut it down.

After the snapshot is taken, the data is transferred by the Azure Backup service to the backup vault. To make the backup process more efficient, the service identifies and transfers only the blocks of data that have changed since the last backup.

![Azure virtual machine backup architecture](./media/backup-azure-vms-introduction/vmbackup-architecture.png)

When the data transfer is complete, the snapshot is removed and a recovery point is created.

### How does Azure Backup ensure data consistency?
Backing up and restoring business critical data is complicated by the fact that it needs to be backed up while the applications that produce the data are running. To address this, Azure Backup provides application-consistent backup for Microsoft workloads by using the Volume Snapshot Service (VSS) to ensure that data is written correctly to storage.

>[AZURE.NOTE] For Linux virtual machines, only file-consistent back up is possible, since Linux does not have an equivalent platform to VSS.

This table explains the types of consistency and the conditions they occur under during Azure VM backup and restore procedures.

| Consistency | VSS-based | Explanation and details |
|-------------|-----------|---------|
| Application consistency | Yes | This is the ideal consistency type for Microsoft workloads as it ensures:<ol><li> That the VM *boots up*. <li>There is *no corruption*. <li>There is *no data loss*.<li> The data is consistent to the application that uses the data, by involving the application at the time of back up -  using VSS.</ol> Most Microsoft workloads have VSS writers that do workload-specific actions related to data consistency. For example, Microsoft SQL Server has a VSS writer that ensures the writes to the transaction log file and the database are done correctly.<br><br> For Azure VM backup, getting an application consistent recovery point means that the backup extension was able to invoke the VSS workflow and complete *correctly* before the VM snapshot was taken. Naturally, this means that the VSS writers of all the applications in the Azure VM have been invoked as well.<br><br>Learn the [basics of VSS](http://blogs.technet.com/b/josebda/archive/2007/10/10/the-basics-of-the-volume-shadow-copy-service-vss.aspx) dive deep into the details of [how it works](https://technet.microsoft.com/library/cc785914%28v=ws.10%29.aspx). |
| File system consistency | Yes - for Windows machines | There are two scenarios where the recovery point can be *file-system consistent*:<ul><li>Back up of Linux VMs in Azure, since Linux does not have an equivalent platform to VSS.<li>VSS failure during back up for Windows VMs in Azure.</li></ul> In both these cases, the best that can be done is to ensure that: <ol><li> The VM *boots up*. <li>There is *no corruption*.<li>There is *no data loss*.</ol> Applications need to implement their own "fix-up" mechanism on the restored data.|
| Crash consistency | No | This situation is equivalent to a machine experiencing a "crash" (through either a soft or hard reset). This typically happens when the Azure virtual machine is shut down at the time of back up. For Azure virtual machine back up, getting a crash-consistent recovery point means that Azure Backup gives no guarantees around the consistency of the data on the storage medium - either from the perspective of the operating system or from the perspective of the application. Only data that already exists on the disk at the time of back up is what gets captured and backed up. <br/> <br/> While there are no guarantees, in most cases the OS will boot. This is typically followed by a disk checking procedure like chkdsk to fix any corruption errors. Any in-memory data or writes that have not been completely flushed to the disk will be lost. The application typically follows with its own verification mechanism in case data rollback needs to be done. For Azure VM back up, getting a crash consistent recovery point means that Azure Backup gives no guarantees around the consistency of the data on the storage - either from the OS perspective or the application's perspective. This typically happens when the Azure VM is shut down at the time of back up.<br><br>As an example, if the transaction log has entries that are not present in the database, then the database software does a rollback till the data is consistent. When dealing with data spread across multiple virtual disks (like spanned volumes), a crash-consistent recovery point provides no guarantees for the correctness of the data.|


## What you need to know about performance and resource utilization
Like backup software that is deployed on-premises, back up of VMs in Azure also needs to be planned for capacity and resource utilization. The [Azure Storage limits](azure-subscription-service-limits.md#storage-limits) will define how to structure VM deployments to get maximum performance with minimum impact to running workloads.

There are two main Azure Storage limits that impact backup performance:

- Max egress per storage account
- Total request rate per storage account

### Storage account limits
When the backup data is copied out of the customer storage account, it counts towards the IOPS and Egress (storage throughput) metrics of the storage account. At the same time, the virtual machines are running and consuming IOPS and throughput. The goal is to ensure that the total traffic - backup and virtual machine - does not exceed the storage account limits.

### Number of disks
The backup process is greedy and tries to consume as many resources as it can, with the aim of completing back up as quickly as possible. However, all IO operations are limited by the *Target Throughput for Single Blob* which has a limit of *60MB per second*. In order to speed up the backup process, the back up of each disk of the VM is attempted *in parallel*. So, if a VM has 4 disks, then Azure Backup will attempt to back up all 4 disks in parallel. Because of this, the single most important factor that determines the backup traffic exiting from a customer storage account is the **number of disks** being backed up from the storage account.

### Backup schedule
An additional factor that impacts performance is the **backup schedule**. If you configure all the VMs to back up at the same time, then the number of disks being backed up *in parallel* will increase - as Azure Backup will attempt to back up as many disks as possible. So one way to reduce the backup traffic from a storage account is to ensure that different VMs are backed up at different times of the day, with no overlap.

## Capacity planning
Putting all these factors together means that storage account usage needs to be planned properly. Download the [VM backup capacity planning excel sheet](https://gallery.technet.microsoft.com/Azure-Backup-Storage-a46d7e33) to see the impact of your disk and backup schedule choices.

### Backup throughput
For each disk being backed up, Azure Backup reads the blocks on the disk and stores only the changed data (incremental backup). This table shows the average throughput values you can expect from Azure Backup:

| Backup operation | Best-case Throughput |
| ---------------- | ---------- |
| Initial back up | 160 Mbps |
| Incremental back up (DR) | 640 Mbps <br><br> This throughput can drop significantly if there is a lot of dispersed churn on the disk that needs to be backed up |

Using this, you can estimate the amount of time that it will take to back up a disk of a given size.

### Total VM back up time
While a majority of the time is spent in reading and copying data, there are other operations that contribute to the total time taken to back up a VM:

- Time taken to [install or update the backup extension](backup-azure-vms.md#offline-vms)
- Queue wait time: Since the backup service is processing backups from multiple customers, your backup operation might not start immediately. In times of peak load, the wait times can stretch up to 8 hours due to the number of backups being processed. However, the total VM back up time will be less than 24 hours for daily backup policies.

## How are protected instances calculated?
Azure virtual machines that are backed up using Azure Backup will be subject to [Azure Backup pricing](http://azure.microsoft.com/pricing/details/backup/). The Protected Instances calculation is based on the *actual* size of the virtual machine, which is the sum of all the data in the virtual machine – excluding the “resource disk”. You are *not* billed based on the maximum size supported for each data disk attached to the virtual machine, but on the actual data stored in the data disk. Similarly, the backup storage bill is based on the amount of data stored with Azure Backup, which is the sum of the actual data in each recovery point.

For example, take an A2-Standard sized virtual machine that has two additional data disks with a maximum size of 1TB each. The table below gives the actual data stored on each of these disks:

|Disk type|Max size|Actual data present|
|---------|--------|------|
| OS disk | 1023GB | 17GB |
| Local disk / Resource disk | 135GB | 5GB (not included for backup) |
| Data disk 1 |	1023GB | 30GB |
| Data disk 2 | 1023GB | 0GB |

The *actual* size of the virtual machine in this case is 17GB + 30GB + 0GB = 47GB. This becomes the Protected Instance size that the monthly bill is based on. As the amount of data in the virtual machine grows, the Protected Instance size used for billing also will change accordingly.

Billing does not start until the first successful backup is completed. At this point the billing for both Storage and Protected Instances will begin. Billing continues as long as there is *any backup data stored with Azure Backup* for the virtual machine. Performing the Stop Protection operation does not stop the billing if the backup data is retained. The billing for a specified virtual machine will be discontinued only if the protection is stopped *and* any backup data is deleted. When there are no active backup jobs (when protection has been stopped), the size of the virtual machine at the time of the last successful backup becomes the Protected Instance size that the monthly bill is based on.

## Questions?
If you have questions, or if there is any feature that you would like to see included, [send us feedback](http://aka.ms/azurebackup_feedback).

## Next steps

- [Backup virtual machines](backup-azure-vms.md)
- [Manage virtual machine backup](backup-azure-manage-vms.md)
- [Restore virtual machines](backup-azure-restore-vms.md)
- [Troubleshoot VM backup issues](backup-azure-vms-troubleshoot.md)
