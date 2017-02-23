---
title: Planning your VM backup infrastructure in Azure | Microsoft Docs
description: Important considerations when planning to back up virtual machines in Azure
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
editor: ''
keywords: backup vms, backup virtual machines

ms.assetid: 19d2cf82-1f60-43e1-b089-9238042887a9
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/08/2016
ms.author: markgal;trinadhk

---
# Plan your VM backup infrastructure in Azure
This article provides performance and resource suggestions to help you plan your VM backup infrastructure. It also defines key aspects of the Backup service; these aspects can be critical in determining your architecture, capacity planning and scheduling. If you've [prepared your environment](backup-azure-vms-prepare.md), this is the next step before you begin [to back up VMs](backup-azure-vms.md). If you need more information about Azure virtual machines, see the [Virtual Machines documentation](https://azure.microsoft.com/documentation/services/virtual-machines/).

## How does Azure back up virtual machines?
When the Azure Backup service initiates a backup job at the scheduled time, it triggers the backup extension to take a point-in-time snapshot. This snapshot is taken in coordination with the Volume Shadow Copy Service (VSS) to get a consistent snapshot of the disks in the virtual machine without having to shut it down.

After the snapshot is taken, the data is transferred by the Azure Backup service to the backup vault. To make the backup process more efficient, the service identifies and transfers only the blocks of data that have changed since the last backup.

![Azure virtual machine backup architecture](./media/backup-azure-vms-introduction/vmbackup-architecture.png)

When the data transfer is complete, the snapshot is removed and a recovery point is created.

> [!NOTE]
> Azure Backup doesn't include temporary disk attached to virtual machine when taking backup. Learn more on [temporary disk](https://blogs.msdn.microsoft.com/mast/2013/12/06/understanding-the-temporary-drive-on-windows-azure-virtual-machines/)
>
>

### Data consistency
Backing up and restoring business critical data is complicated by the fact that business critical data must be backed up while the applications that produce the data are running. To address this, Azure Backup provides application-consistent backups for Microsoft workloads by using VSS to ensure that data is written correctly to storage.

> [!NOTE]
> For Linux virtual machines, only file-consistent backups are possible, since Linux does not have an equivalent platform to VSS.
>
>

Azure Backup takes VSS full backups on Windows VMs (read more about [VSS full backup](http://blogs.technet.com/b/filecab/archive/2008/05/21/what-is-the-difference-between-vss-full-backup-and-vss-copy-backup-in-windows-server-2008.aspx)). To enable VSS copy backups, the below registry key needs to be set on the VM.

```
[HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\BCDRAGENT]
"USEVSSCOPYBACKUP"="TRUE"
```


This table explains the types of consistency and the conditions that they occur under during Azure VM backup and restore procedures.

| Consistency | VSS-based | Explanation and details |
| --- | --- | --- |
| Application consistency |Yes |This is the ideal consistency type for Microsoft workloads as it ensures that:<ol><li> The VM *boots up*. <li>There is *no corruption*. <li>There is *no data loss*.<li> The data is consistent to the application that uses the data, by involving the application at the time of backup--using VSS.</ol> Most Microsoft workloads have VSS writers that do workload-specific actions that are related to data consistency. For example, Microsoft SQL Server has a VSS writer that ensures that the writes to the transaction log file and the database are done correctly.<br><br> For Azure VM backups, getting an application-consistent recovery point means that the backup extension was able to invoke the VSS workflow and complete it *correctly* before the VM snapshot was taken. Naturally, this means that the VSS writers of all the applications in the Azure VM have been invoked as well.<br><br>(Learn the [basics of VSS](http://blogs.technet.com/b/josebda/archive/2007/10/10/the-basics-of-the-volume-shadow-copy-service-vss.aspx) and dive deep into the details of [how it works](https://technet.microsoft.com/library/cc785914%28v=ws.10%29.aspx)). |
| File-system consistency |Yes - for Windows-based computers |There are two scenarios where the recovery point can be *file-system consistent*:<ul><li>Backups of Linux VMs in Azure, since Linux does not have an equivalent platform to VSS.<li>VSS failure during backup for Windows VMs in Azure.</li></ul> In both these cases, the best that can be done is to ensure that: <ol><li> The VM *boots up*. <li>There is *no corruption*.<li>There is *no data loss*.</ol> Applications need to implement their own "fix-up" mechanism on the restored data. |
| Crash consistency |No |This situation is equivalent to a virtual machine experiencing a "crash" (through either a soft or hard reset). This typically happens when the Azure virtual machine is shut down at the time of backup. For Azure virtual machine backups, getting a crash-consistent recovery point means that Azure Backup gives no guarantees around the consistency of the data on the storage medium--either from the perspective of the operating system or from the perspective of the application. Only data that already exists on the disk at the time of backup is what gets captured and backed up. <br/> <br/> While there are no guarantees, in most cases, the operating system will boot. This is typically followed by a disk-checking procedure, like chkdsk, to fix any corruption errors. Any in-memory data or writes that have not been completely flushed to the disk will be lost. The application typically follows with its own verification mechanism in case data rollback needs to be done. <br><br>As an example, if the transaction log has entries that are not present in the database, then the database software does a rollback until the data is consistent. When data is spread across multiple virtual disks (like spanned volumes), a crash-consistent recovery point provides no guarantees for the correctness of the data. |

## Performance and resource utilization
Like backup software that is deployed on-premises, you should plan for capacity and resource utilization needs when backing up VMs in Azure. The [Azure Storage limits](../azure-subscription-service-limits.md#storage-limits) define how to structure VM deployments to get maximum performance with minimum impact to running workloads.

Pay attention to the following Azure Storage limits when planning backup performance:

* Max egress per storage account
* Total request rate per storage account

### Storage account limits
Whenever backup data is copied from a storage account, it counts towards the input/output operations per second (IOPS) and egress (or throughput) metrics of the storage account. At the same time, the virtual machines are running and consuming IOPS and throughput. The goal is to ensure the total traffic - backup and virtual machine - does not exceed the storage account limits.

### Number of disks
The backup process tries to complete a backup job as quickly as possible. In doing so, it consumes as many resources as it can. However, all I/O operations are limited by the *Target Throughput for Single Blob*, which has a limit of 60 MB per second. In an attempt to maximize its speed, the backup process tries to back up each of the VM's disks *in parallel*. So, if a VM has four disks, then Azure Backup attempts to back up all four disks in parallel. Because of this, the most important factor determining backup traffic exiting a customer storage account is the **number of disks** being backed up from the storage account.

### Backup schedule
An additional factor that impacts performance is the **backup schedule**. If you configure the policies so all VMs are backed up at the same time, you have scheduled a traffic jam. The backup process will attempt to back up all disks in parallel. One way to reduce the backup traffic from a storage account is - ensure different VMs are backed up at different times of the day, with no overlap.

## Capacity planning
Putting all these factors together means that storage account usage needs to be planned properly. Download the [VM backup capacity planning Excel spreadsheet](https://gallery.technet.microsoft.com/Azure-Backup-Storage-a46d7e33) to see the impact of your disk and backup schedule choices.

### Backup throughput
For each disk being backed up, Azure Backup reads the blocks on the disk and stores only the changed data (incremental backup). This table shows the average throughput values that you can expect from Azure Backup. Using this, you can estimate the amount of time that it will take to back up a disk of a given size.

| Backup operation | Best-case throughput |
| --- | --- |
| Initial backup |160 Mbps |
| Incremental backup (DR) |640 Mbps <br><br> This throughput can drop significantly if there is a lot of dispersed churn on the disk that needs to be backed up. |

## Total VM backup time
While a majority of the backup time is spent in reading and copying data, there are other operations that contribute to the total time needed to back up a VM:

* Time needed to [install or update the backup extension](backup-azure-vms.md).
* Snapshot time, which is the time taken to trigger a snapshot. Snapshots are triggered close to the scheduled backup time.
* Queue wait time. Since the Backup service is processing backups from multiple customers, copying backup data from snapshot to the backup or Recovery Services vault might not start immediately. In times of peak load, the wait can stretch up to 8 hours due to the number of backups being processed. However, the total VM backup time will be less than 24 hours for daily backup policies.
* Data transfer time, time needed for backup service to compute the incremental changes from previous backup and transfer those changes to vault storage.

### Why am I observing longer(>15 hours) backup time?
Backup consists of two phases: taking snapshot and transferring snapshot to vault. In the second phase, transferring data to vault, to optimize on the storage used for backup, we only transfer incremental changes from previous snapshot. To achieve this, we compute checksum of the blocks and if a block is changed, we will identify it to send this block to vault. Again, here we drill down further into the block to see if we can minimize the amount of data transfer and will coalesce all changed blocks and send to vault. In case of some legacy applications, we observed that writes by applications are not optimal with respect to storage because of small and fragmented writes. and hence we need to spend additional time processing data written by these applications. Recommended application write block from Azure for applications running inside VM is minimum 8KB. If your application is using a block of less than 8KB, then backup performance will be effected as this goes beyond what is recommended by Azure. We request you to take a look at [tuning applications for optimal performance with Azure storage](../storage/storage-premium-storage-performance.md) and see if you can tune your application to write in an optimal manner to improve backup performance. While the article talks with Premium storage in point, it is applicable even for disks running on Standard storage.

## Total restore time
A restore operation consists of two main sub tasks: Copying data back from vault to chosen customer storage account and creating the virtual machine. Copying data back from vault depends upon where backups are stored internally in Azure and where customer storage account is stored. Time taken to copy data depends upon:
* Queue wait time - Since service is processing restores from multiple customers at the same time, restore requests are put in queue.
* Data copy time - Data is copied similar to a first backup process from vault to customer storage account. If the customer storage account to which backup service needs to write data from vault is loaded, copying time can increase. So, make sure to select a storage account which is not loaded with other application writes and reads during restore to optimize on the copy time.

## Best practices
We suggest following these practices while configuring backups for virtual machines:

* Don't schedule more than 10 classic VMs from the same cloud service to back up at the same time. We suggest staggering backup start times by an hour if you want to back up multiple VMs from same cloud service.
* Do not schedule more than 40 VMs to back up at the same time.
* Schedule VM backups during non-peak hours so the backup service uses IOPS for transferring data from the customer storage account to the backup or Recovery Services vault.
* Make sure that a policy is applied on VMs spread across different storage accounts. We suggest no more than 20 total disks from a single storage account be protected by the same backup schedule. If you have greater than 20 disks in a storage account, spread those VMs across multiple policies to get the required IOPS during the transfer phase of the backup process.
* Do not restore a VM running on Premium storage to same storage account. If the restore operation process coincides with the backup operation, it reduces the available IOPS for backup.
* We recommend running each Premium VM on a distinct premium storage account to ensure optimal backup performance.

## Data encryption
Azure Backup does not encrypt data as a part of the backup process. However, you can encrypt data within the VM and back up the protected data seamlessly (read more about [backup of encrypted data](backup-azure-vms-encryption.md)).

## How are protected instances calculated?
Azure virtual machines that are backed up through Azure Backup are subject to [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). The Protected Instances calculation is based on the *actual* size of the virtual machine, which is the sum of all the data in the virtual machine--excluding the “resource disk”.

You are *not* billed based on the maximum size that is supported for each data disk attached to the virtual machine, but on the actual data stored in the data disk. Similarly, the backup storage bill is based on the amount of data that is stored with Azure Backup, which is the sum of the actual data in each recovery point.

For example, take an A2 Standard-sized virtual machine that has two additional data disks with a maximum size of 1 TB each. The table below gives the actual data stored on each of these disks:

| Disk type | Max size | Actual data present |
| --- | --- | --- |
| Operating system disk |1023 GB |17 GB |
| Local disk / Resource disk |135 GB |5 GB (not included for backup) |
| Data disk 1 |1023 GB |30 GB |
| Data disk 2 |1023 GB |0 GB |

The *actual* size of the virtual machine in this case is 17 GB + 30 GB + 0 GB = 47 GB. This becomes the Protected Instance size that the monthly bill is based on. As the amount of data in the virtual machine grows, the Protected Instance size used for billing also will change accordingly.

Billing does not start until the first successful backup is completed. At this point, the billing for both Storage and Protected Instances will begin. Billing continues as long as there is *any backup data stored with Azure Backup* for the virtual machine. Performing the Stop Protection operation does not stop the billing if the backup data is retained.

The billing for a specified virtual machine will be discontinued only if the protection is stopped *and* any backup data is deleted. When there are no active backup jobs (when protection has been stopped), the size of the virtual machine at the time of the last successful backup becomes the Protected Instance size that the monthly bill is based on.

## Questions?
If you have questions, or if there is any feature that you would like to see included, [send us feedback](http://aka.ms/azurebackup_feedback).

## Next steps
* [Back up virtual machines](backup-azure-vms.md)
* [Manage virtual machine backup](backup-azure-manage-vms.md)
* [Restore virtual machines](backup-azure-restore-vms.md)
* [Troubleshoot VM backup issues](backup-azure-vms-troubleshoot.md)
