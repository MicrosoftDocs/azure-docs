---
title: About Azure VM backup
description: In this article, learn how the Azure Backup service backs up Azure Virtual machines, and how to follow best practices.
ms.topic: conceptual
ms.date: 02/27/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# An overview of Azure VM backup

This article describes how the [Azure Backup service](./backup-overview.md) backs up Azure virtual machines (VMs).

Azure Backup provides independent and isolated backups to guard against unintended destruction of the data on your VMs. Backups are stored in a Recovery Services vault with built-in management of recovery points. Configuration and scaling are simple, backups are optimized, and you can easily restore as needed.

As part of the backup process, a [snapshot is taken](#snapshot-creation), and the data is transferred to the Recovery Services vault with no impact on production workloads. The snapshot provides different levels of consistency, as described [here](#snapshot-consistency).

Azure Backup also has specialized offerings for database workloads like [SQL Server](backup-azure-sql-database.md) and [SAP HANA](sap-hana-db-about.md) that are workload-aware, offer 15 minute RPO (recovery point objective), and allow backup and restore of individual databases.

## Backup process

Here's how Azure Backup completes a backup for Azure VMs:

[!INCLUDE [azure-vm-backup-process.md](../../includes/azure-vm-backup-process.md)]

## Encryption of Azure VM backups

When you back up Azure VMs with Azure Backup, VMs are encrypted at rest with Storage Service Encryption (SSE). Azure Backup can also back up Azure VMs that are encrypted by using Azure Disk Encryption.

**Encryption** | **Details** | **Support**
--- | --- | ---
**SSE** | With SSE, Azure Storage provides encryption at rest by automatically encrypting data before storing it. Azure Storage also decrypts data before retrieving it. Azure Backup supports backups of VMs with two types of Storage Service Encryption:<li> **SSE with platform-managed keys**: This encryption is by default for all disks in your VMs. See more [here](../virtual-machines/disk-encryption.md#platform-managed-keys).<li> **SSE with customer-managed keys**. With CMK, you manage the keys used to encrypt the disks. See more [here](../virtual-machines/disk-encryption.md#customer-managed-keys). | Azure Backup uses SSE for at-rest encryption of Azure VMs.
**Azure Disk Encryption** | Azure Disk Encryption encrypts both OS and data disks for Azure VMs.<br/><br/> Azure Disk Encryption integrates with BitLocker encryption keys (BEKs), which are safeguarded in a key vault as secrets. Azure Disk Encryption also integrates with Azure Key Vault key encryption keys (KEKs). | Azure Backup supports backup of managed and unmanaged Azure VMs encrypted with BEKs only, or with BEKs together with KEKs.<br/><br/> Both BEKs and KEKs are backed up and encrypted.<br/><br/> Because KEKs and BEKs are backed up, users with the necessary permissions can restore keys and secrets back to the key vault if needed. These users can also recover the encrypted VM.<br/><br/> Encrypted keys and secrets can't be read by unauthorized users or by Azure.

For managed and unmanaged Azure VMs, Backup supports both VMs encrypted with BEKs only or VMs encrypted with BEKs together with KEKs.

The backed-up BEKs (secrets) and KEKs (keys) are encrypted. They can be read and used only when they're restored back to the key vault by authorized users. Neither unauthorized users, or Azure, can read or use backed-up keys or secrets.

BEKs are also backed up. So, if the BEKs are lost, authorized users can restore the BEKs to the key vault and recover the encrypted VMs. Only users with the necessary level of permissions can back up and restore encrypted VMs or keys and secrets.

## Snapshot creation

Azure Backup takes snapshots according to the backup schedule.

- **Windows VMs:** For Windows VMs, the Backup service coordinates with VSS to take an app-consistent snapshot of the VM disks.  By default, Azure Backup takes a full VSS backup (it truncates the logs of application such as SQL Server at the time of backup to get application level consistent backup).  If you're using a SQL Server database on Azure VM backup, then you can modify the setting to take a VSS Copy backup (to preserve logs). For more information, see [this article](./backup-azure-vms-troubleshoot.md#troubleshoot-vm-snapshot-issues).

- **Linux VMs:** To take app-consistent snapshots of Linux VMs, use the Linux pre-script and post-script framework to write your own custom scripts to ensure consistency.

  - Azure Backup invokes only the pre/post scripts written by you.
  - If the pre-scripts and post-scripts execute successfully, Azure Backup marks the recovery point as application-consistent. However, when you're using custom scripts, you're ultimately responsible for the application consistency.
  - [Learn more](backup-azure-linux-app-consistent.md) about how to configure scripts.

## Snapshot consistency

The following table explains the different types of snapshot consistency:

**Snapshot** | **Details** | **Recovery** | **Consideration**
--- | --- | --- | ---
**Application-consistent** | App-consistent backups capture memory content and pending I/O operations. App-consistent snapshots use a VSS writer (or pre/post scripts for Linux) to ensure the consistency of the app data before a backup occurs. | When you're recovering a VM with an app-consistent snapshot, the VM boots up. There's no data corruption or loss. The apps start in a consistent state. | Windows: All VSS writers succeeded<br/><br/> Linux: Pre/post scripts are configured and succeeded
**File-system consistent** | File-system consistent backups provide consistency by taking a snapshot of all files at the same time.<br/><br/> | When you're recovering a VM with a file-system consistent snapshot, the VM boots up. There's no data corruption or loss. Apps need to implement their own "fix-up" mechanism to make sure that restored data is consistent. | Windows: Some VSS writers failed <br/><br/> Linux: Default (if pre/post scripts aren't configured or failed)
**Crash-consistent** | Crash-consistent snapshots typically occur if an Azure VM shuts down at the time of backup. Only the data that already exists on the disk at the time of backup is captured and backed up. | Starts with the VM boot process followed by a disk check to fix corruption errors. Any in-memory data or write operations that weren't transferred to disk before the crash are lost. Apps implement their own data verification. For example, a database app can use its transaction log for verification. If the transaction log has entries that aren't in the database, the database software rolls transactions back until the data is consistent. | VM is in shutdown (stopped/ deallocated) state.

>[!NOTE]
> If the provisioning state is **succeeded**, Azure Backup takes file-system consistent backups. If the provisioning state is **unavailable** or **failed**, crash-consistent backups are taken. If the provisioning state is **creating** or **deleting**, that means Azure Backup is retrying the operations.

## Backup and restore considerations

**Consideration** | **Details**
--- | ---
**Disk** | Backup of VM disks is parallel. For example, if a VM has four disks, the Backup service attempts to back up all four disks in parallel. Backup is incremental (only changed data).
**Scheduling** |  To reduce backup traffic, back up different VMs at different times of the day and make sure the times don't overlap. Backing up VMs at the same time causes traffic jams.
**Preparing backups** | Keep in mind the time needed to prepare the backup. The preparation time includes installing or updating the backup extension and triggering a snapshot according to the backup schedule.
**Data transfer** | Consider the time needed for Azure Backup to identify the incremental changes from the previous backup.<br/><br/> In an incremental backup, Azure Backup determines the changes by calculating the checksum of the block. If a block is changed, it's marked for transfer to the vault. The service analyzes the identified blocks to attempt to further minimize the amount of data to transfer. After evaluating all the changed blocks, Azure Backup transfers the changes to the vault.<br/><br/> There might be a lag between taking the snapshot and copying it to vault. At peak times, it can take up to eight hours for the snapshots to be transferred to the vault. The backup time for a VM will be less than 24 hours for the daily backup.
**Initial backup** | Although the total backup time for incremental backups is less than 24 hours, that might not be the case for the first backup. The time needed for the initial backup will depend on the size of the data and when the backup is processed.
**Restore queue** | Azure Backup processes restore jobs from multiple storage accounts at the same time, and it puts restore requests in a queue.
**Restore copy** | During the restore process, data is copied from the vault to the storage account.<br/><br/> The total restore time depends on the I/O operations per second (IOPS) and the throughput of the storage account.<br/><br/> To reduce the copy time, select a storage account that isn't loaded with other application writes and reads.

> [!Note]
> Azure Backup now enables you to back up your Azure VMs multiple times a day using the Enhanced policy. With this capability, you can also define the duration in which your backup jobs would trigger and align your backup schedule with the working hours when there are frequent updates to Azure Virtual Machines. [Learn more](backup-azure-vms-enhanced-policy.md).

### Backup performance

These common scenarios can affect the total backup time:

- **Adding a new disk to a protected Azure VM:** If a VM is undergoing incremental backup and a new disk is added, the backup time will increase. The total backup time might last more than 24 hours because of initial replication of the new disk, along with delta replication of existing disks.
- **Fragmented disks:** Backup operations are faster when disk changes are contiguous. If changes are spread out and fragmented across a disk, backup will be slower.
- **Disk churn:** If protected disks that are undergoing incremental backup have a daily churn of more than 200 GB, backup can take a long time (more than eight hours) to complete.
- **Backup versions:** The latest version of Backup (known as the Instant Restore version) uses a more optimized process than checksum comparison for identifying changes. But if you're using Instant Restore and have deleted a backup snapshot, the backup switches to checksum comparison. In this case, the backup operation will exceed 24 hours (or fail).

### Restore performance

These common scenarios can affect the total restore time:

- The total restore time depends on the Input/output operations per second (IOPS) and the throughput of the storage account.
- The total restore time can be affected if the target storage account is loaded with other application read and write operations. To improve restore operation, select a storage account that isn't loaded with other application data.

## Best practices

When you're configuring VM backups, we suggest following these practices:

- Modify the default schedule times that are set in a policy. For example, if the default time in the policy is 12:00 AM, increment the timing by several minutes so that resources are optimally used.
- If you're restoring VMs from a single vault, we highly recommend that you use different [general-purpose v2 storage accounts](../storage/common/storage-account-upgrade.md) to ensure that the target storage account doesn't get throttled. For example, each VM must have a different storage account. For example, if 10 VMs are restored, use 10 different storage accounts.
- For backup of VMs that are using premium storage with Instant Restore, we recommend allocating *50%* free space of the total allocated storage space, which is required **only** for the first backup. The 50% free space isn't a requirement for backups after the first backup is complete
- The limit on the number of disks per storage account is relative to how heavily the disks are being accessed by applications that are running on an infrastructure as a service (IaaS) VM. As a general practice, if 5 to 10 disks or more are present on a single storage account, balance the load by moving some disks to separate storage accounts.
- To restore VMs with managed disks using PowerShell, provide the additional parameter ***TargetResourceGroupName*** to specify the resource group to which managed disks will be restored, [Learn more here](./backup-azure-vms-automation.md#restore-managed-disks).

## Backup costs

Azure VMs backed up with Azure Backup are subject to [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/).

Billing doesn't start until the first successful backup finishes. At this point, the billing for both storage and protected VMs begins. Billing continues as long as any backup data for the VM is stored in a vault. If you stop protection for a VM, but backup data for the VM exists in a vault, billing continues.

Billing for a specified VM stops only if the protection is stopped and all backup data is deleted. When protection stops and there are no active backup jobs, the size of the last successful VM backup becomes the protected instance size used for the monthly bill.

The protected-instance size calculation is based on the *actual* size of the VM. The VM's size is the sum of all the data in the VM, excluding the temporary storage. Pricing is based on the actual data that's stored on the data disks, not on the maximum supported size for each data disk that's attached to the VM.

Similarly, the backup storage bill is based on the amount of data that's stored in Azure Backup, which is the sum of the actual data in each recovery point.

For example, take an A2-Standard-sized VM that has two additional data disks with a maximum size of 32 TB each. The following table shows the actual data stored on each of these disks:

**Disk** | **Max size** | **Actual data present**
--- | --- | ---
OS disk | 32 TB | 17 GB
Local/temporary disk | 135 GB | 5 GB (not included for backup)
Data disk 1 | 32 TB| 30 GB
Data disk 2 | 32 TB | 0 GB

The actual size of the VM in this case is 17 GB + 30 GB + 0 GB = 47 GB. This protected-instance size (47 GB) becomes the basis for the monthly bill. As the amount of data in the VM grows, the protected-instance size used for billing changes to match.

## Next steps

- [Prepare for Azure VM backup](backup-azure-arm-vms-prepare.md).