---
title: About Azure VM backup
description: Learn about Azure VM backup, and note some best practices.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 12/11/2018
ms.author: raynew
---

# About Azure VM backup

This article describes how the [Azure Backup service](backup-introduction-to-azure-backup.md) backs up Azure VMs.

## Backup process

Here's how Azure Backup completes a  backup for Azure VMs.

1. For Azure VMs that are selected for backup, the Azure Backup service initiates a backup job in accordance with the backup schedule you specify.
2. The service triggers the backup extension.
    - Windows VMs use the  _VMSnapshot_ extension.
    - Linux VMs use the _VMSnapshotLinux_ extension.
    - The extension is installed during the first VM backup.
    - To install the extension, the VM must be running.
    - If the VM is not running, the Backup service takes a snapshot of the underlying storage (since no application writes occur while the VM is stopped).
4. The backup extension takes a storage-level, app-consistent snapshot.
5. After the snapshot is taken the data is transferred to the vault. To maximize efficiency, the service identifies and transfers only the blocks of data that have changed since the previous backup (the delta).
5. When the data transfer is complete, the snapshot is removed and a recovery point is created.

![Azure virtual machine backup architecture](./media/backup-azure-vms-introduction/vmbackup-architecture.png)

## Data encryption

Azure Backup doesn't encrypt data as a part of the backup process. Azure Backup does support backup of Azure VMs that are encrypted using Azure Disk Encryption.

- Backup of VMs encrypted with Bitlocker Encryption Key(BEK) only, and BEK together with Key Encryption Key(KEK) is supported, for managed and unmanaged Azure VMs.
- The BEK(secrets) and KEK(keys) backed up are encrypted so they can be read and used only when restored back to key vault by the authorized users.
- Since the BEK is also backed up, in scenarios where BEK is lost, authorized users can restore the BEK to the KeyVault and recover the encrypted VM. Keys and secrets of encrypted VMs are backed up in encrypted form, so neither unauthorized users nor Azure can read or use backed up keys and secrets. Only users with the right level of permissions can backup and restore encrypted VMs, as well as keys and secrets.

## Snapshot consistency

To take snapshots while apps are running, Azure Backup takes app-consistent snapshots.

- **Windows VMs**: For Windows VMs, the Backup service coordinates with the Volume Shadow Copy Service (VSS) to get a consistent snapshot of the VM disks.
    - By default, Azure Backup takes full VSS backups. [Learn more](http://blogs.technet.com/b/filecab/archive/2008/05/21/what-is-the-difference-between-vss-full-backup-and-vss-copy-backup-in-windows-server-2008.aspx).
    - If you want to change the setting so that Azure Backups takes VSS copy backups, set the following registry key:
        ```
        [HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\BCDRAGENT]
        ""USEVSSCOPYBACKUP"="TRUE"
        ```
- **Linux VMs**: To ensure that your Linux VMs are app-consistent when Azure Backup takes a snapshot, you can use the Linux pre-script and post-script framework. You can write your own custom scripts to ensure consistency when taking a VM snapshot.
    -  Azure Backup only invokes the pre- and post-scripts written by you.
    - If the pre-script and post-scripts execute successfully, Azure Backup marks the recovery point as application-consistent. However, you're ultimately responsible for the application consistency when using custom scripts.
    - [Learn more](backup-azure-linux-app-consistent.md) about configuring scripts.


#### Consistency types

The following table explains different types of consistency.

**Snapshot** | **VSS-based** | **Details** | **Recovery**
--- | --- | --- | ---
**Application-consistent** | Yes (Windows only) | App-consistent backups capture memory content and pending I/O operations. App-consistent snapshots use VSS writer (or pre/post script for Linux) that ensure the consistency of app data before a backup occurs. | When recovering with an app-consistent snapshot, the VM boots up. There's no data corruption or loss. The apps start in a consistent state.
**File system consistent** | Yes (Windows only) |  File consistent backups provide consistent backups of disk files by taking a snapshot of all files at the same time.<br/><br/> Azure Backup recovery points are file consistent for:<br/><br/> -Linux VMs backups that don't have pre/post scripts, or that have script that failed.<br/><br/> - Windows VM backups where VSS failed. | When recovering with a file-consistent snapshot, the VM boots up. There's no data corruption or loss. Apps needs to implement their own "fix-up" mechanism to make sure that restored data is consistent.
**Crash-consistent** | No | Crash consistency often happens when an Azure VM shuts down at the time of backup.  Only the data that already exists on the disk at the time of backup is captured and backed up.<br/><br/> A crash-consistent recovery point doesn't guarantee data consistency for the operating system or the app. | There are no guarantees, but usually the VM boots, and follows with a disk check to fix corruption errors. Any in-memory data or write that weren't transferred to disk are lost. Apps implement their own data verification. For example, for a database app, if a transaction log has entries that aren't in the database, the database software rolls until data is consistent.


## Service and subscription limits

Azure Backup has a number of limits around subscriptions and vaults.

[!INCLUDE [azure-backup-limits](../../includes/azure-backup-limits.md)]


## Backup performance

### Disk considerations

Backup tries to complete as quickly as possible, consuming as many resources as it can.

- In an attempt to maximize its speed, the backup process tries to back up each of the VM's disks in parallel.
- For example,  if a VM has four disks, the service attempts to back up all four disks in parallel.
- The number of disks being backed up is the most important factor in determining storage account backup traffic.
- All I/O operations are limited by the *Target Throughput for Single Blob*, which has a limit of 60 MB per second.
- For each disk being backed up, Azure Backup reads the blocks on the disk and stores only the changed data (incremental backup). You can use the average throughput values below to estimate the amount of time needed to back up a disk of a given size.

    **Operation** | **Best-case throughput**
    --- | ---
    Initial backup | 160 Mbps |
    Incremental backup | 640 Mbps <br><br> Throughput drops significantly if the delta data is dispersed across the disk.|



### Scheduling considerations

Backup scheduling impacts performance.

- If you configure policies so all VMs are backed up at the same time, you have scheduled a traffic jam, as the the backup process attempts to back up all disks in parallel.
- To reduce the backup traffic, back up different VMs at different time of the day, with no overlap.


### Time considerations

While most backup time is spent reading and copying data, other operations add to the total time needed to back up a VM:

- **Install backup extension**: Time needed to install or update the backup extension.
- **Trigger snapshot**: Time taken to trigger a snapshot. Snapshots are triggered close to the scheduled backup time.
- **Queue wait time**: Since the Backup service processes jobs from multiple customer storage accounts at the same time, snapshot data may not immediately be copied to the Recovery Services vault. At peak load times, it can take up to eight hours before the backups are processed. However, the total VM backup time is less than 24 hours for daily backup policies.
- **Initial backup**: Although the total backup time of less than 24 hours is valid for incremental backups, it might not be for the first backup. Time needed will depend on size of the data and when the backup is taken.
- **Data transfer time**: Time needed for backup service to compute the incremental changes from previous backup and transfer those changes to vault storage.

### Factors affecting backup time

Backup consists of two phases, taking snapshots and transferring the snapshots to the vault. The Backup service optimizes for storage.

- When transferring the snapshot data to a vault, the service only transfers incremental changes from the previous snapshot.
- To determine the incremental changes, the service computes the checksum of the blocks.
    - If a block is changed, the block is identified as a block to be sent to the vault.
    - The service drills further into each of the identified blocks, looking for opportunities to minimize the data to transfer.
    - After evaluating all changed blocks, the service coalesces the changes and sends them to the vault.

Situations that can affect backup time include the following:


- **Initial backup for a newly added disk to an already protected VM**: If a VM is undergoing incremental backup, when a new disk is added then the backup might miss the one day SLA, depending on the size of the new disk.
- **Fragmented app**: If an app is poorly configured it might not be optimal for storage:
    - If the snapshot contains many small, fragmented writes, the service spends additional time processing the data written by the applications.
    - For applications running inside the VM, the recommended application-writes block minimum is 8 KB. If your application uses a block of less than 8 KB, backup performance is effected.
- **Storage account overloaded**: A backup could be scheduled when the app is running in production, or if more than five to ten disks are hosted from the same storage account.
- **Consistency check (CC) mode**: For disks greater than 1TB disks the backup could be in CC mode for a couple of reasons:
    - The managed disk moves as part of VM reboot.
    - Promotes snapshot to base blob.


## Restore considerations

A restore operation consists of two main tasks: copying data back from the vault to the chosen storage account, and creating the virtual machine. The time needed to copy data from the vault depends on where the backups are stored in Azure, and the storage account location. Time taken to copy data depends upon:

- **Queue wait time**: Since the service processes restore jobs from multiple storage accounts at the same time, restore requests are put in a queue.
- **Data copy time**: Data is copied from the vault to the storage account. Restore time depends on IOPS and throughput of the selected storage account which the Azure Backup service uses. To reduce the copying time during the restore process, select a storage account not loaded with other application writes and reads.

## Best practices

We suggest following these practices while configuring VM backups:

- Don't schedule backups for more than 100 VMs from one vault, at the same time.
- Schedule VM backups during non-peak hours. This way the Backup service uses IOPS for transferring data from the storage account to the vault.
- If you're backing up managed disks, the Azure Backup service handles storage management. If you're backing up unmanaged disks:
    - Make sure to apply a backup policy to VMs spread across multiple storage accounts.
    - No more than 20 disks from a single storage account should be protected by the same backup schedule.
    - If you have greater than 20 disks in a storage account, spread those VMs across multiple policies to get the required IOPS during the transfer phase of the backup process.
    - Don't restore a VM running on premium storage to the same storage account. If the restore operation process coincides with the backup operation, it reduces the available IOPS for backup.
    - For Premium VM backup on VM backup stack V1, you should allocate only 50% of the total storage account space so the Backup service can copy the snapshot to storage account, and transfer data from the storage account to the vault.
- It is recommended to use different storage accounts instead of using the same storage accounts in order to restore VMs from a single vault. This will avoid throttling and result in 100% restore success with good performance.
- The restores from tier 1 storage layer will be completed in minutes against the tier 2 storage restores which takes few hours. We recommend you to use [Instant RP feature](backup-upgrade-to-vm-backup-stack-v2.md) for faster restores. This is only applicable managed Azure VMs.


## Backup costs

Azure VMs backed up with Azure Backup are subject to [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/).

- Billing does not start until the first successful backup completes. At this point, the billing for both Storage and Protected Instances begins.
- Billing continues as long as there is any backup data stored in a vault for the virtual machine. If you stop protection on the virtual machine, but virtual machine backup data exists in a vault, billing continues.
- Billing for a specified VM stops only if the protection is stopped and all backup data is deleted.
- When protection stops and there are no active backup jobs, the size of the last successful VM backup becomes the Protected Instance size used for the monthly bill.
- The Protected Instances calculation is based on the *actual* size of the virtual machine, which is the sum of all the data in the virtual machine, excluding the temporary storage.
- Pricing is based on the actual data stored in the data disk.
- Pricing for backing up VMs is not based on the maximum supported size for each data disk attached to the virtual machine.
- Similarly, the backup storage bill is based on the amount of data that is stored in Azure Backup, which is the sum of the actual data in each recovery point.

For example, take an A2 Standard-sized virtual machine that has two additional data disks with a maximum size of 4 TB each. The following table gives the actual data stored on each of these disks:

| Disk type | Max size | Actual data present |
| --------- | -------- | ----------- |
| Operating system disk |4095 GB |17 GB |
| Local disk / Temporary disk |135 GB |5 GB (not included for backup) |
| Data disk 1 |4095 GB |30 GB |
| Data disk 2 |4095 GB |0 GB |

- The actual size of the VM virtual machine in this case is 17 GB + 30 GB + 0 GB = 47 GB.
- This Protected Instance size (47 GB) becomes the basis for the monthly bill.
- As the amount of data in the virtual machine grows, the Protected Instance size used for billing changes accordingly.


## Next steps

After reviewing the backup process and performance considerations, do the following:

- Download the [capacity planning Excel spreadsheet](https://gallery.technet.microsoft.com/Azure-Backup-Storage-a46d7e33) to try out disk and backup scheduling numbers.
- [Learn about](../virtual-machines/windows/premium-storage-performance.md) tuning apps for optimal performance with Azure storage. The article focus on premium storage, but is also applicable for standard storage disks.
- [Get started](backup-azure-arm-vms-prepare.md) with backup by reviewing VM support and limitations, creating a vault, and getting VMs ready for backup.
