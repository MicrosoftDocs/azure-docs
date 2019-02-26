---
title: About Azure VM backup
description: Learn about Azure VM backup, and note some best practices.
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 02/17/2019
ms.author: raynew
---

# About Azure VM backup

This article describes how the [Azure Backup service](backup-introduction-to-azure-backup.md) backs up Azure VMs.

## Backup process

Here's how Azure Backup completes a  backup for Azure VMs.

1. For Azure VMs that are selected for backup, the Azure Backup service initiates a backup job in accordance with the backup schedule you specify.
2. During the first backup, a backup extension is installed on VM if it's running.
    - For Windows VMs the  _VMSnapshot_ extension is installed.
    - For Linux VMs the _VMSnapshotLinux_ extension is installed.
3. For Windows VMs that are running, Backup coordinates with VSS to take an app-consistent snapshot of the VM.
    - By default Backup takes full VSS backups.
    - If Backup is unable to take an app-consistent snapshot, then it takes a file-consistent snapshot of the underlying storage (since no application writes occur while the VM is stopped).
4. For Linux VMs Backup takes a file-consistent backup. For app-consistent snapshots you need to manually customize pre/post scripts.
5. After the snapshot is taken the data is transferred to the vault. 
    - Backup is optimized by backing up each VM disk in parallel.
    - For each disk being backed up, Azure Backup reads the blocks on disk, and identifies and transfers only data blocks that have changed since the previous backup (the delta).
    - After the snapshot is taken, the data is transferred to the vault.
    - Snapshot data might not be immediately copied to the vault. It might take some hours at peak times. Total backup time for a VM will be less that 24 hours for daily backup policies.

6. When the data transfer is complete, the snapshot is removed and a recovery point is created.

![Azure virtual machine backup architecture](./media/backup-azure-vms-introduction/vmbackup-architecture.png)

## Encrypting Azure VM backups

When you back up Azure VMs with Azure Backup, VMs are encrypted at rest with Storage Service Encryption (SSE). In addition, Azure Backup can back up Azure VMs that are encrypted using Azure Disk Encryption (ADE).


**Encryption** | **Details** | **Support**
--- | --- | ---
**ADE** | ADE encrypts both OS and data disks for Azure VMs.<br/><br/> ADE integrates with BitLocker encryption keys (BEK), safeguarded in a key vault as secrets, or with Azure Key Vault key encryption keys (KEK). | Azure Backup supports backup of managed and unmanaged Azure VMs encrypted with BEK only, or with BEK together with KEK.<br/><br/> Both BEK and backed up and encrypted.<br/><br/> Since KEK and BEK are backed up, if needed users with permissions can restore keys and secrets back to the key vault, and recover the encrypted VM.<br/><br/> Encrypted keys and secrets can't be read by unauthorized users, or by Azure.
**SSE** | With SSE, Azure storage provides encryption at rest by automatically encrypting data before storing it, and decrypts it before retrieval. | Azure Backup uses SSE for at rest encryption of Azure VMs.

- Backup of VMs encrypted with BitLocker Encryption Key (BEK) only, and BEK together with Key Encryption Key(KEK) is supported, for managed and unmanaged Azure VMs.
- The backed up BEK (secrets) and KEK (keys) are encrypted. They can be read and used only when restored back to key vault by authorized users. Neither unauthorized users nor Azure can read or use backed up keys or secrets.
- Since the BEK is also backed up, if the BEK is lost, authorized users can restore the BEK to the KeyVault, and recover the encrypted VM. 
- Only users with the right level of permissions can back up and restore encrypted VMs, as well as keys and secrets.



## Taking snapshots

Azure Backup snapshots in accordance with the backup schedule. 

- **Windows VMs**: For Windows VMs, the Backup service coordinates with the Volume Shadow Copy Service (VSS) to take an app-consistent snapshot of the VM disks.
    - By default, Azure Backup takes full VSS backups. [Learn more](http://blogs.technet.com/b/filecab/archive/2008/05/21/what-is-the-difference-between-vss-full-backup-and-vss-copy-backup-in-windows-server-2008.aspx).
    - If you want to change the setting so that Azure Backups takes VSS copy backups, set the following registry key from a command prompt: **REG ADD "HKLM\SOFTWARE\Microsoft\BcdrAgent" /v USEVSSCOPYBACKUP /t REG_SZ /d TRUE /f**.
- **Linux VMs**: If you want to take app-consistent snapshots of Linux VM, use the Linux pre-script and post-script framework to write your own custom scripts to ensure consistency.
    -  Azure Backup only invokes the pre/post scripts written by you.
    - If the pre-script and post-scripts execute successfully, Azure Backup marks the recovery point as application-consistent. However, you're ultimately responsible for the application consistency when using custom scripts.
    - [Learn more](backup-azure-linux-app-consistent.md) about configuring scripts.


### Snapshot consistency

The following table explains different types of consistency.

**Snapshot** | **Details** | **Recovery** | **Consideration**
--- | --- | --- | ---
**Application-consistent** | App-consistent backups capture memory content and pending I/O operations. App-consistent snapshots use VSS writer (or pre/post script for Linux) that ensure the consistency of app data before a backup occurs. | When recovering with an app-consistent snapshot, the VM boots up. There's no data corruption or loss. The apps start in a consistent state. | Windows: All VSS writers succeeded<br/><br/> Linux: Pre/post scripts are configured and succeeded
**File system consistent** | File consistent backups provide consistent backups of disk files by taking a snapshot of all files at the same time.<br/><br/> | When recovering with a file-consistent snapshot, the VM boots up. There's no data corruption or loss. Apps need to implement their own "fix-up" mechanism to make sure that restored data is consistent. | Windows: Some VSS writers failed <br/><br/> Linux: Default (if pre/post scripts are not configured or failed)
**Crash-consistent** | Crash consistency often happens when an Azure VM shuts down at the time of backup.  Only the data that already exists on the disk at the time of backup is captured and backed up.<br/><br/> A crash-consistent recovery point doesn't guarantee data consistency for the operating system or the app. | There are no guarantees, but usually the VM boots, and follows with a disk check to fix corruption errors. Any in-memory data or write that weren't transferred to disk are lost. Apps implement their own data verification. For example, for a database app, if a transaction log has entries that aren't in the database, the database software rolls until data is consistent. | VM is in shutdown state


## Restore considerations 



**Consideration** | **Details**
--- | ---
**Disk** | Backup of VM disk is parallel. For example, if a VM has four disks, the service attempts to back up all four disks in parallel. Backup is incremental (only changed data).
**Scheduling** |  To reduce backup traffic, back up different VMs at different times of the day, with no overlaps. Backing up VMs at the same time causes traffic jams.
**Preparing backups** | Consider the backup preparation time, which includes installing or updating the backup extension, and triggering a snapshot in accordance with the backup schedule.
**Data transfer** | Time needed for backup service to compute the incremental changes from the previous backup.<br/><br/> In an incremental backup,  determine the changes the service computers the checksum of the block. If a block is changed its identified for sending to the vault. The service drills into identified blocks to attempt to further minimize the data to transfer. After evaluating all changed blocked the changes are transferred to the vault.<br/><br/> There might be a lag between taking the snapshot and copying it to vault.<br/><br/> At peak times it can take up to eight hours for backups to be process. The backup time for a VM will be less than 24 hours for the daily backup.
**Initial backup** | Although the total backup time of less than 24 hours is valid for incremental backups, it might not be for the first backup. Time needed will depend on size of the data and when the backup is taken.
**Restore queue** | Azure Backup processes restore jobs from multiple storage accounts at the same time, and restore requests are put in a queue.
**Restore copy** | During the restore process, data is copied from the vault to the storage account.<br/><br/> Restore time depends on IOPS and throughput of the storage account.<br/><br/> To reduce the copy time, select a storage account that isn't loaded with other application writes and reads.


### Backup performance

These common scenarios can affect backup time:

- Add a new disk to a protected Azure VM: If a VM is undergoing incremental backup and a new disk is added, backup might last more than 24 hours due to initial replication of the new disk, along with delta replication of existing disks.
- Fragmented disks: Backup operations are faster when disk changes are collocated. If changes are spread out and fragmented across a disk, backup will be slower. 
- Disk churn: If protected disks undergoing incremental backup have a daily churn of more than 200 GB, backup can take a long time (more than eight hours) to complete. 
- Backup versions: If you're using the latest version of Backup (known as the Instant Restore version), it uses a more optimized process than checksum comparison for comparing changes. If you're using the latest version and have deleted a backup snapshot, the backup switches to use checksum comparison, and the backup operation will exceed 24 hours (or fail).

## Best practices 
We suggest following these practices while configuring VM backups:

- Consider modifying the default schedule time set in a policy. For example, if the default time is the policy is 12:00AM, consider incrementing it by minutes so that resources are optimally used.
- For Premium VM backup on non-Instant RP feature allocates ~50% of the total storage account space. Backup service requires this space to copy the snapshot to same storage account and for transferring it to the vault.
- For restoring VMs from a single vault, it is highly recommended to use different [v2 storage accounts](https://docs.microsoft.com/azure/storage/common/storage-account-upgrade) to ensure the target storage account doesn’t get throttled. For example, each VM must have different storage account (If 10 VMs are restored, then consider using 10 different storage accounts).
- The restores from Tier-1 storage layer (snapshot) will be completed in minutes (since it is the same storage account) against the Tier-2 storage layer (vault) which can take hours. We recommend you to use [Instant Restore](backup-instant-restore-capability.md) feature for faster restores for case where data is available in Tier-1 (if the data has to be restored from vault then it will take time).
- The limit on number of disks per storage account is relative to how heavy the disks are being accessed by applications running on IaaS VM. Verify if multiple disks are hosted on a single storage account. As a general practice, if 5 to 10 disks or more are present on single storage account, balance the load by moving some disks to separate storage accounts.

## Backup costs

Azure VMs backed up with Azure Backup are subject to [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/).

- Billing doesn't start until the first successful backup completes. At this point, the billing for both storage and protected VMs begins.
- Billing continues as long as there is any backup data stored in a vault for the VM. If you stop protection for a VM, but backup data for the VM exists in a vault, billing continues.
- Billing for a specified VM stops only if the protection is stopped, and all backup data is deleted.
- When protection stops and there are no active backup jobs, the size of the last successful VM backup becomes the protected instance size used for the monthly bill.
- The protected instances calculation is based on the *actual* size of the VM, which is the sum of all the data in the VM, excluding the temporary storage.
- Pricing is based on the actual data stored in the data disk.
- Pricing for backing up VMs is not based on the maximum supported size for each data disk attached to the VM.
- Similarly, the backup storage bill is based on the amount of data that is stored in Azure Backup, which is the sum of the actual data in each recovery point.

For example, take an A2 Standard-sized VM that has two additional data disks with a maximum size of 4 TB each. The following table gives the actual data stored on each of these disks:

**Disk** | **Max size** | **Actual data present**
--- | --- | ---
OS disk | 4095 GB | 17 GB 
Local/temporary disk | 135 GB | 5 GB (not included for backup) 
Data disk 1 | 4095 GB | 30 GB 
Data disk 2 | 4095 GB | 0 GB 

- The actual size of the VM in this case is 17 GB + 30 GB + 0 GB = 47 GB.
- This protected instance size (47 GB) becomes the basis for the monthly bill.
- As the amount of data in the VM grows, the protected instance size used for billing changes accordingly.


## Next steps

Now, [prepare](backup-azure-arm-vms-prepare.md) for Azure VM backup.
