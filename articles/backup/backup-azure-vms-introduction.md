---
title: About Azure VM backup
description: Learn about Azure VM backup, and note some best practices.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 01/08/2019
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
4. The backup extension takes a storage-level, crash consistent/file-consistent snapshot.
5. After the snapshot is taken the data is transferred to the vault. To maximize efficiency, the service identifies and transfers only the blocks of data that have changed since the previous backup (the delta).
5. When the data transfer is complete, the snapshot is removed and a recovery point is created.

![Azure virtual machine backup architecture](./media/backup-azure-vms-introduction/vmbackup-architecture.png)

## Data encryption

Azure Backup doesn't encrypt data as a part of the backup process. Azure Backup does support backup of Azure VMs that are encrypted using Azure Disk Encryption.

- Backup of VMs encrypted with Bitlocker Encryption Key(BEK) only, and BEK together with Key Encryption Key(KEK) is supported, for managed and unmanaged Azure VMs.
- The BEK(secrets) and KEK(keys) backed up are encrypted so they can be read and used only when restored back to key vault by the authorized users.
- Since the BEK is also backed up, in scenarios where BEK is lost, authorized users can restore the BEK to the KeyVault and recover the encrypted VM. Keys and secrets of encrypted VMs are backed up in encrypted form, so neither unauthorized users nor Azure can read or use backed up keys and secrets. Only users with the right level of permissions can back up and restore encrypted VMs, as well as keys and secrets.

## Snapshot consistency

To take snapshots while apps are running, Azure Backup takes app-consistent snapshots.

- **Windows VMs**: For Windows VMs, the Backup service coordinates with the Volume Shadow Copy Service (VSS) to get a consistent snapshot of the VM disks.
    - By default, Azure Backup takes full VSS backups. [Learn more](http://blogs.technet.com/b/filecab/archive/2008/05/21/what-is-the-difference-between-vss-full-backup-and-vss-copy-backup-in-windows-server-2008.aspx).
    - If you want to change the setting so that Azure Backups takes VSS copy backups, set the following registry key:
        ```
        [HKEY_LOCAL_MACHINE\SOFTWARE\MICROSOFT\BCDRAGENT]
        ""USEVSSCOPYBACKUP"="TRUE"
        ```
        - Run the below command from elevated (as administrator) command prompt, to set the above registry key:
          ```
          REG ADD "HKLM\SOFTWARE\Microsoft\BcdrAgent" /v USEVSSCOPYBACKUP /t REG_SZ /d TRUE /f
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
**File system consistent** | Yes (Windows only) |  File consistent backups provide consistent backups of disk files by taking a snapshot of all files at the same time.<br/><br/> Azure Backup recovery points are file consistent for:<br/><br/> -Linux VMs backups that don't have pre/post scripts, or that have script that failed.<br/><br/> - Windows VM backups where VSS failed. | When recovering with a file-consistent snapshot, the VM boots up. There's no data corruption or loss. Apps need to implement their own "fix-up" mechanism to make sure that restored data is consistent.
**Crash-consistent** | No | Crash consistency often happens when an Azure VM shuts down at the time of backup.  Only the data that already exists on the disk at the time of backup is captured and backed up.<br/><br/> A crash-consistent recovery point doesn't guarantee data consistency for the operating system or the app. | There are no guarantees, but usually the VM boots, and follows with a disk check to fix corruption errors. Any in-memory data or write that weren't transferred to disk are lost. Apps implement their own data verification. For example, for a database app, if a transaction log has entries that aren't in the database, the database software rolls until data is consistent.


## Service and subscription limits

Azure Backup has a number of limits around subscriptions and vaults.

[!INCLUDE [azure-backup-limits](../../includes/azure-backup-limits.md)]


## Backup performance

### Disk considerations

Backup operation optimizes by backing up each of the VM’s disk in parallel. For example, if a VM has four disks, the service attempts to back up all four disks in parallel. For each disk being backed up, Azure Backup reads the blocks on the disk and stores only the changed data (incremental backup).


### Scheduling considerations

Backup scheduling impacts performance.

- If you configure policies so all VMs are backed up at the same time, you have scheduled a traffic jam, as the backup process attempts to back up all disks in parallel.
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

- **Initial backup for a newly added disk to an already protected VM**: If a VM is undergoing incremental backup and a new disk gets added to this VM, then the backup duration can go beyond 24 hours since the newly added disk has to undergo initial replication along with delta replication of existing disks.
- **Fragmentation**: Backup product scans for incremental changes between two backups operations. Backup operations are faster when the changes on the disk are collocated when compared to changes are spread across then the disk. 
- **Churn**: Daily churn (for incremental replication) per disk greater than 200 GB can take greater than ~8 hours to complete the operation. If VM has more than one disk and if one of those disks is taking longer time to backup, then it can impact the overall backup operation (or can result in failure). 
- **Checksum Comparison (CC) mode**: CC mode is comparatively slower than optimized mode used by Instant RP. If you are already using Instant RP and have deleted the Tier-1 snapshots, then backup switches to CC mode causing the Backup operation to exceed 24 hours (or fail).

## Restore considerations

A restore operation consists of two main tasks: copying data back from the vault to the chosen storage account, and creating the virtual machine. The time needed to copy data from the vault depends on where the backups are stored in Azure, and the storage account location. Time taken to copy data depends upon:

- **Queue wait time**: Since the service processes restore jobs from multiple storage accounts at the same time, restore requests are put in a queue.
- **Data copy time**: Data is copied from the vault to the storage account. Restore time depends on IOPS and throughput of the selected storage account, which the Azure Backup service uses. To reduce the copying time during the restore process, select a storage account not loaded with other application writes and reads.

## Best practices

We suggest following these practices while configuring VM backups:

- Consider modifying the default provided policy time (for ex. If your default policy time is 12:00AM consider incrementing it by minutes) when the data snapshots are taken to ensure resources are optimally used.
- For Premium VM backup on non-Instant RP feature allocates ~50% of the total storage account space. Backup service requires this space to copy the snapshot to same storage account and for transferring it to the vault.
- For restoring VMs from a single vault, it is highly recommended to use different [v2 storage accounts](https://docs.microsoft.com/azure/storage/common/storage-account-upgrade) to ensure the target storage account doesn’t get throttled. For example, each VM must have different storage account (If 10 VMs are restored, then consider using 10 different storage accounts).
- The restores from Tier-1 storage layer (snapshot) will be completed in minutes (since it is the same storage account) against the Tier-2 storage layer (vault) which can take hours. We recommend you to use [Instant Restore](backup-instant-restore-capability.md) feature for faster restores for case where data is available in Tier-1 (if the data has to be restored from vault then it will take time).
- The limit on number of disks per storage account is relative to how heavy the disks are being accessed by applications running on IaaS VM. Verify if multiple disks are hosted on a single storage account. As a general practice, if 5 to 10 disks or more are present on single storage account, balance the load by moving some disks to separate storage accounts.

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

- [Learn about](../virtual-machines/windows/premium-storage-performance.md) tuning apps for optimal performance with Azure storage. The article focus on premium storage, but is also applicable for standard storage disks.
- [Get started](backup-azure-arm-vms-prepare.md) with backup by reviewing VM support and limitations, creating a vault, and getting VMs ready for backup.
