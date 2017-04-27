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
ms.date: 4/5/2017
ms.author: markgal;trinadhk

---
# Plan your VM backup infrastructure in Azure
This article provides performance and resource suggestions to help you plan your VM backup infrastructure. It also defines key aspects of the Backup service; these aspects can be critical in determining your architecture, capacity planning, and scheduling. If you've [prepared your environment](backup-azure-vms-prepare.md), planning is the next step before you begin [to back up VMs](backup-azure-vms.md). If you need more information about Azure virtual machines, see the [Virtual Machines documentation](https://azure.microsoft.com/documentation/services/virtual-machines/).

## How does Azure back up virtual machines?
When the Azure Backup service initiates a backup job at the scheduled time, it triggers the backup extension to take a point-in-time snapshot. The Azure Backup service uses the _VMSnapshot_ extension in Windows, and the _VMSnapshotLinux_ extension in Linux. The extension is installed during the first VM backup. To install the extension, the VM must be running. If the VM is not running, the Backup service takes a snapshot of the underlying storage (since no application writes occur while the VM is stopped).

When taking a snapshot of Windows VMs, the Backup service coordinates with the Volume Shadow Copy Service (VSS) to get a consistent snapshot of the virtual machine's disks. If you're backing up Linux VMs, you can write your own custom scripts to ensure consistency when taking a VM snapshot. Details on invoking these scripts are provided later in this article.

Once the Azure Backup service takes the snapshot, the data is transferred to the vault. To maximize efficiency, the service identifies and transfers only the blocks of data that have changed since the previous backup.

![Azure virtual machine backup architecture](./media/backup-azure-vms-introduction/vmbackup-architecture.png)

When the data transfer is complete, the snapshot is removed and a recovery point is created.

> [!NOTE]
> 1. During the backup process, Azure Backup doesn't include the temporary disk attached to the virtual machine. For more information, see the blog on [temporary storage](https://blogs.msdn.microsoft.com/mast/2013/12/06/understanding-the-temporary-drive-on-windows-azure-virtual-machines/).
> 2. Since Azure Backup takes a storage-level snapshot and transfers that snapshot to vault, do not change the storage account keys until the backup job finishes.
>

### Data consistency
Backing up and restoring business critical data is complicated by the fact that business critical data must be backed up while the applications that produce the data are running. To address this, Azure Backup supports application-consistent backups for both Windows and Linux VMs
#### Windows VM
Azure Backup takes VSS full backups on Windows VMs (read more about [VSS full backup](http://blogs.technet.com/b/filecab/archive/2008/05/21/what-is-the-difference-between-vss-full-backup-and-vss-copy-backup-in-windows-server-2008.aspx)). To enable VSS copy backups, the following registry key needs to be set on the VM.

```
[HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\BCDRAGENT]
"USEVSSCOPYBACKUP"="TRUE"
```

#### Linux VMs
Azure Backup provides a scripting framework. To ensure application consistency when backing up Linux VMs, create custom pre-scripts and post-scripts that control the backup workflow and environment. Azure Backup invokes the pre-script before taking the VM snapshot and invokes the post-script once the VM snapshot job completes. For more details, see [application consistent
VM backups using pre-script and post-script](https://docs.microsoft.com/azure/backup/backup-azure-linux-app-consistent).
> [!NOTE]
> Azure Backup only invokes the customer-written pre- and post-scripts. If the pre-script and post-scripts execute successfully, Azure Backup marks the recovery point as application consistent. However, the customer is ultimately responsible for the application consistency when using custom scripts.
>


This table explains the types of consistency and the conditions that they occur under during Azure VM backup and restore procedures.

| Consistency | VSS-based | Explanation and details |
| --- | --- | --- |
| Application consistency |Yes for Windows|Application consistency is ideal for workloads as it ensures that:<ol><li> The VM *boots up*. <li>There is *no corruption*. <li>There is *no data loss*.<li> The data is consistent to the application that uses the data, by involving the application at the time of backup--using VSS or pre/post script.</ol> <li>*Windows VMs*- Most Microsoft workloads have VSS writers that do workload-specific actions related to data consistency. For example, Microsoft SQL Server has a VSS writer that ensures that the writes to the transaction log file and the database are done correctly. For Azure Windows VM backups, to create an application-consistent recovery point, the backup extension must invoke the VSS workflow and complete it before taking the VM snapshot. For the Azure VM snapshot to be accurate, the VSS writers of all Azure VM applications must complete as well. (Learn the [basics of VSS](http://blogs.technet.com/b/josebda/archive/2007/10/10/the-basics-of-the-volume-shadow-copy-service-vss.aspx) and dive deep into the details of [how it works](https://technet.microsoft.com/library/cc785914%28v=ws.10%29.aspx)). </li> <li> *Linux VMs*- Customers can execute [custom pre-script and post-script to ensure application consistency](https://docs.microsoft.com/azure/backup/backup-azure-linux-app-consistent). </li> |
| File-system consistency |Yes - for Windows-based computers |There are two scenarios where the recovery point can be *file-system consistent*:<ul><li>Backups of Linux VMs in Azure, without pre-script/post-script or if pre-script/post-script failed. <li>VSS failure during backup for Windows VMs in Azure.</li></ul> In both these cases, the best that can be done is to ensure that: <ol><li> The VM *boots up*. <li>There is *no corruption*.<li>There is *no data loss*.</ol> Applications need to implement their own "fix-up" mechanism on the restored data. |
| Crash consistency |No |This situation is equivalent to a virtual machine experiencing a "crash" (through either a soft or hard reset). Crash consistency typically happens when the Azure virtual machine is shut down at the time of backup. A crash-consistent recovery point provides no guarantees around the consistency of the data on the storage medium--either from the perspective of the operating system or the application. Only the data that already exists on the disk at the time of backup is captured and backed up. <br/> <br/> While there are no guarantees, usually, the operating system boots, followed by disk-checking procedure, like chkdsk, to fix any corruption errors. Any in-memory data or writes that have not been transferred to the disk are lost. The application typically follows with its own verification mechanism in case data rollback needs to be done. <br><br>As an example, if the transaction log has entries that are not present in the database, then the database software does a rollback until the data is consistent. When data is spread across multiple virtual disks (like spanned volumes), a crash-consistent recovery point provides no guarantees for the correctness of the data. |

## Performance and resource utilization
Like backup software that is deployed on-premises, you should plan for capacity and resource utilization needs when backing up VMs in Azure. The [Azure Storage limits](../azure-subscription-service-limits.md#storage-limits) define how to structure VM deployments to get maximum performance with minimum impact to running workloads.

Pay attention to the following Azure Storage limits when planning backup performance:

* Max egress per storage account
* Total request rate per storage account

### Storage account limits
Backup data copied from a storage account, adds to the input/output operations per second (IOPS) and egress (or throughput) metrics of the storage account. At the same time, virtual machines are also consuming IOPS and throughput. The goal is to ensure Backup and virtual machine traffic don't exceed your storage account limits.

### Number of disks
The backup process tries to complete a backup job as quickly as possible. In doing so, it consumes as many resources as it can. However, all I/O operations are limited by the *Target Throughput for Single Blob*, which has a limit of 60 MB per second. In an attempt to maximize its speed, the backup process tries to back up each of the VM's disks *in parallel*. If a VM has four disks, the service attempts to back up all four disks in parallel. The **number of disks** being backed up, is the most important factor in determining storage account backup traffic.

### Backup schedule
An additional factor that impacts performance is the **backup schedule**. If you configure the policies so all VMs are backed up at the same time, you have scheduled a traffic jam. The backup process attempts to back up all disks in parallel. To reduce the backup traffic from a storage account, back up different VMs at different time of the day, with no overlap.

## Capacity planning
Putting the previous factors together, you need to plan for the storage account usage needs. Download the [VM backup capacity planning Excel spreadsheet](https://gallery.technet.microsoft.com/Azure-Backup-Storage-a46d7e33) to see the impact of your disk and backup schedule choices.

### Backup throughput
For each disk being backed up, Azure Backup reads the blocks on the disk and stores only the changed data (incremental backup). The following table shows the average Backup service throughput values. Using the following data, you can estimate the amount of time needed to back up a disk of a given size.

| Backup operation | Best-case throughput |
| --- | --- |
| Initial backup |160 Mbps |
| Incremental backup (DR) |640 Mbps <br><br> Throughput drops significantly if the changed data (that needs to be backed up) is dispersed across the disk.|

## Total VM backup time
While most of the backup time is spent reading and copying data, other operations contribute to the total time needed to back up a VM:

* Time needed to [install or update the backup extension](backup-azure-vms.md).
* Snapshot time, which is the time taken to trigger a snapshot. Snapshots are triggered close to the scheduled backup time.
* Queue wait time. Since the Backup service is processing backups from multiple customers, copying backup data from snapshot to the backup or Recovery Services vault might not start immediately. In times of peak load, the wait can stretch up to eight hours due to the number of backups being processed. However, the total VM backup time is less than 24 hours for daily backup policies.
* Data transfer time, time needed for backup service to compute the incremental changes from previous backup and transfer those changes to vault storage.

### Why am I observing longer(>12 hours) backup time?
Backup consists of two phases: taking snapshots and transferring the snapshots to the vault. The Backup service optimizes for storage. When transferring the snapshot data to a vault, the service only transfers incremental changes from the previous snapshot.  To determine the incremental changes, the service computes the checksum of the blocks. If a block is changed, the block is identified as a block to be sent to the vault. Then the service drills further into each of the identified blocks, looking for opportunities to minimize the data to transfer. After evaluating all changed blocks, the service coalesces the changes and sends them to the vault. In some legacy applications, small, fragmented writes are not optimal for storage. If the snapshot contains many small, fragmented writes, the service spends additional time processing the data written by the applications. The recommended application write block from Azure, for applications running inside the VM, is a minimum of 8 KB. If your application uses a block of less than 8 KB, backup performance is effected. For help with tuning your application to improve backup performance, see [Tuning applications for optimal performance with Azure storage](../storage/storage-premium-storage-performance.md). Though the article on backup performance uses Premium storage examples, the guidance is applicable for Standard storage disks.

## Total restore time
A restore operation consists of two main sub tasks: Copying data back from the vault to the chosen customer storage account, and creating the virtual machine. Copying data back from the vault depends on where the backups are stored internally in Azure, and where the customer storage account is stored. Time taken to copy data depends upon:
* Queue wait time - Since the service processes restore jobs from multiple customers at the same time, restore requests are put in a queue.
* Data copy time - Data is copied from the vault to the customer storage account. Restore time depends on IOPS and throughput Azure Backup service gets on the selected customer storage account. To reduce the copying time during the restore process, select a storage account not loaded with other application writes and reads.

## Best practices
We suggest following these practices while configuring backups for virtual machines:

* Don't schedule more than 10 classic VMs from the same cloud service to back up at the same time. If you want to back up multiple VMs from same cloud service, stagger the backup start times by an hour.
* Do not schedule more than 40 VMs to back up at the same time.
* Schedule VM backups during non-peak hours. This way the Backup service uses IOPS for transferring data from the customer storage account to the vault.
* Make sure that a policy is applied on VMs spread across different storage accounts. We suggest no more than 20 total disks from a single storage account be protected by the same backup schedule. If you have greater than 20 disks in a storage account, spread those VMs across multiple policies to get the required IOPS during the transfer phase of the backup process.
* Do not restore a VM running on Premium storage to same storage account. If the restore operation process coincides with the backup operation, it reduces the available IOPS for backup.
* We recommend running each Premium VM on a distinct premium storage account to ensure optimal backup performance.

## Data encryption
Azure Backup does not encrypt data as a part of the backup process. However, you can encrypt data within the VM and back up the protected data seamlessly (read more about [backup of encrypted data](backup-azure-vms-encryption.md)).

## Calculating the cost of protected instances
Azure virtual machines that are backed up through Azure Backup are subject to [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). The Protected Instances calculation is based on the *actual* size of the virtual machine, which is the sum of all the data in the virtual machine--excluding the “resource disk.”

Pricing for backing up VMs is *not* based on the maximum supported size for each data disk attached to the virtual machine. Pricing is based on the actual data stored in the data disk. Similarly, the backup storage bill is based on the amount of data that is stored in Azure Backup, which is the sum of the actual data in each recovery point.

For example, take an A2 Standard-sized virtual machine that has two additional data disks with a maximum size of 1 TB each. The following table gives the actual data stored on each of these disks:

| Disk type | Max size | Actual data present |
| --- | --- | --- |
| Operating system disk |1023 GB |17 GB |
| Local disk / Resource disk |135 GB |5 GB (not included for backup) |
| Data disk 1 |1023 GB |30 GB |
| Data disk 2 |1023 GB |0 GB |

The *actual* size of the virtual machine in this case is 17 GB + 30 GB + 0 GB = 47 GB. This Protected Instance size (47 GB) becomes the basis for the monthly bill. As the amount of data in the virtual machine grows, the Protected Instance size used for billing changes accordingly.

Billing does not start until the first successful backup completes. At this point, the billing for both Storage and Protected Instances begins. Billing continues as long as there is *any backup data stored in a vault* for the virtual machine. If you stop protection on the virtual machine, but virtual machine backup data exists in a vault, billing continues.

Billing for a specified virtual machine stops only if the protection is stopped *and* all backup data is deleted. When protection stops and there are no active backup jobs, the size of the last successful VM backup becomes the Protected Instance size used for the monthly bill.

## Questions?
If you have questions, or if there is any feature that you would like to see included, [send us feedback](http://aka.ms/azurebackup_feedback).

## Next steps
* [Back up virtual machines](backup-azure-vms.md)
* [Manage virtual machine backup](backup-azure-manage-vms.md)
* [Restore virtual machines](backup-azure-restore-vms.md)
* [Troubleshoot VM backup issues](backup-azure-vms-troubleshoot.md)
