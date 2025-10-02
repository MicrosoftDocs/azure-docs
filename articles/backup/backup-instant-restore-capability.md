---
title: Azure Instant Restore Capability
description: Learn about Azure Instant Restore availability and FAQs for a VM backup stack in an Azure Resource Manager deployment model.
ms.topic: overview
ms.date: 06/16/2025
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a system administrator, I want to use Instant Restore for VM backups so that I can significantly reduce restore times and improve recovery performance during data restoration processes.
---

# Get improved backup and restore performance with the Azure Backup Instant Restore capability

This article describes the improved backup and restore performance of the Instant Restore capability in Azure Backup.

## Key capabilities

Instant Restore provides the following capabilities:

* Uses snapshots taken as part of a backup job that's available for recovery without waiting for data transfer to the vault to finish. It reduces the wait time for snapshots to copy to the vault before triggering restore.
* Reduces backup and restore times by retaining snapshots locally for 2 days with the Standard policy and 7 days with the Enhanced policy, by default. You can configure this default snapshot retention value from 1 to 5 days for the Standard policy and from 1 to 30 days for the Enhanced policy.
* Supports disk sizes up to 32 TB. Don't use Azure Backup to resize disks.
* Supports Standard solid-state drive (SSD) disks along with Standard hard-disk drive (HDD) disks and Premium SSD disks with the Standard policy. Supports backup and instant restore of Premium SSD v2 and Ultra Disks, in addition to Standard HDD, Standard SSD, and Premium SSD v1 disks, with the Enhanced policy.
* Uses an unmanaged virtual machine's (VM) original storage accounts (per disk) when restoring. This ability exists even when the VM has disks that are distributed across storage accounts. It speeds up restore operations for various VM configurations.
* Uses unmanaged Premium disks in storage accounts for backup of VMs. We recommend that you allocate *50%* of free space of the total allocated storage space with Instant Restore. The 50% free space isn't a requirement for backups after the first backup is finished.

## How does Instant Restore work?

A backup job consists of two phases:

1. Take a VM snapshot.
1. Transfer the VM snapshot to the Recovery Services vault.

A recovery point is created as soon as the snapshot is finished. You can use this recovery point of snapshot type to perform a restore by using the same restore flow. You can identify this recovery point in the Azure portal by using *snapshot* as the recovery point type. After the snapshot is transferred to the vault, the recovery point type changes to *snapshot and vault*.

:::image type="content" source="./media/backup-azure-vms/instant-rp-flow.png" alt-text="Diagram that shows the backup job in a VM backup stack Azure Resource Manager deployment model for storage and vault." lightbox="./media/backup-azure-vms/instant-rp-flow.png":::

## Feature considerations

* The snapshots are stored along with the disks to boost recovery point creation and to speed up restore operations. As a result, you see storage costs that correspond to snapshots taken during this period.
* For the Standard policy, all snapshots are incremental in nature and are stored as page blobs. All the users who use unmanaged disks are charged for the snapshots that are stored in their local storage account. Because the restore point collections used by managed VM backups use blob snapshots at the underlying storage level, for managed disks you see costs that correspond to blob snapshot pricing and they're incremental.
* For Premium storage accounts, the snapshots taken for instant recovery points count toward the 10-TB limit of allocated space. For the Enhanced policy, only managed VM backups are supported. The initial snapshot is a full copy of the disks. The subsequent snapshots are incremental in nature and occupy only delta changes to disks since the last snapshot. When you use an Instant Restore recovery point, you must restore the VM or disks to a subscription and resource group that don't require disks encrypted by customer-managed keys via Azure Policy.
* When you perform instant restores for unmanaged disks, ensure that the storage account that hosts the snapshot/VHD files has public network access or similar enabled. If the necessary network access from the storage account isn't available, then a standard recovery point restore is triggered, which causes a slower restore time.
* The [Standard policy](backup-instant-restore-capability.md) starts with an incremental backup, which lacks a full recovery point if the original disk is lost. In contrast, the [Enhanced policy](backup-azure-vms-enhanced-policy.md) makes the first backup a full recovery point, which ensures complete recovery and improved data integrity.

## Cost impact

Instant Restore for snapshots (stored along with the disks) boosts recovery point creation and speeds up restore operations. This process incurs extra storage costs for the corresponding snapshots that are taken during this period. The snapshot storage cost varies depending on the type of backup policy.

### Cost impact of the Standard policy

The Standard policy uses blob snapshots for Instant Restore functionality. All snapshots are incremental in nature and stored in the VM's storage account, which is used for instant recovery. Incremental snapshot means that the space occupied by a snapshot is equal to the space occupied by pages that are written after the snapshot was created. Billing is still for the per GB used space occupied by the snapshot, as explained in [Pricing and billing](../storage/blobs/snapshots-overview.md#pricing-and-billing). As an illustration, consider a VM with 100 GB in size, a change rate of 2%, and a retention of five days for Instant Restore. In this case, the snapshot storage is billed as 10 GB (100 * 0.02 * 5).

For VMs that use unmanaged disks, you can see the snapshots on the menu for the virtual hard-disk (VHD) file for each disk. For managed disks, snapshots are stored in a restore point collection resource in a designated resource group. The snapshots themselves aren't directly visible.

### Cost impact of the Enhanced policy

The Enhanced policy uses managed disk snapshots for Instant Restore functionality. The initial snapshot is a full copy of the disks. The subsequent snapshots are incremental in nature and occupy only delta changes to disks since the last snapshot. Pricing for managed disk snapshots is explained in [Managed disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/).

For example, a VM with 100 GB in size has a change rate of 2% and a retention of 5 days for Instant Restore. In this case, the snapshot storage is billed as 108 GB (100 + 100 X 0.02 X 4).

Snapshot retention is fixed to 5 days for weekly policies for the Standard policy. Snapshot retention can vary from 5 to 20 days for the Enhanced policy.

Trusted Launch VMs with the Standard policy use managed disk snapshots for Instant Restore. In this scenario, you incur snapshot storage costs that are the same as the costs for the Enhanced policy.

## Configure snapshot retention

### Use the Azure portal

[!INCLUDE [backup-center.md](../../includes/backup-center.md)]

In the Azure portal, in the **Instant Restore** section, you can see a field that was added on the **VM Backup Policy** pane. You can change the snapshot retention duration on the **VM Backup Policy** pane for all the VMs that are associated with the specific backup policy.

![Screenshot that shows the Instant Restore capability.](./media/backup-azure-vms/instant-restore-capability.png)

### Use PowerShell

From the Az PowerShell version 1.6.0 and later, you can use PowerShell to update the instant restore snapshot retention period in the policy.

```powershell
$bkpPol = Get-AzRecoveryServicesBackupProtectionPolicy -WorkloadType "AzureVM"
$bkpPol.SnapshotRetentionInDays=5
Set-AzRecoveryServicesBackupProtectionPolicy -policy $bkpPol
```

The default snapshot retention for each policy is set to two days. You can change the value to a minimum of one day and a maximum of five days. For weekly policies, the snapshot retention is fixed to five days.

## Frequently asked questions

### What are the cost implications of Instant Restore?

Snapshots are stored along with the disks to speed up recovery point creation and restore operations. As a result, you see storage costs that correspond to the snapshot retention selected as a part of VM backup policy.

### In Premium storage accounts, do the snapshots taken for instant recovery point occupy the 10-TB snapshot limit?

Yes, for Premium storage accounts, the snapshots taken for instant recovery point occupy 10 TB of allocated snapshot space.

### How does the snapshot retention work during the five-day period?

For the Standard policy, each day that a new snapshot is taken there are five individual incremental snapshots. The size of the snapshot depends on the data churn, which in most cases is 2% to 7%. For the Enhanced policy, the initial snapshot is a full snapshot. Subsequent snapshots are incremental in nature.

### Is an Instant Restore snapshot an incremental snapshot or a full snapshot?

For the Standard policy, snapshots taken as a part of the Instant Restore capability are incremental snapshots. For the Enhanced policy, the initial snapshot is a full snapshot. Subsequent snapshots are incremental in nature.

### How can I calculate the approximate cost increase based on using Instant Restore?

It depends on the churn of the VM.

- **Standard policy**: In a steady state, you can assume that the increase in cost is = snapshot retention period daily churn per VM snapshot storage cost per GB.
- **Enhanced policy**: In a steady state, you can assume that the increase in cost is = ((size of VM) + (snapshot retention period-1) * daily churn per VM) * snapshot storage cost per GB.

### If the recovery type for a restore point is "snapshot and vault" and I perform a restore operation, which recovery type is used?

If the recovery type is "snapshot and vault," restore is automatically done from the local snapshot. This restore is faster compared to the restore done from the vault.

### What happens if I select the retention period of the restore point (Tier 2) less than the snapshot (Tier 1) retention period?

The new model doesn't allow deleting the restore point (Tier 2) unless the snapshot (Tier 1) is deleted. We recommend that you schedule a restore point (Tier 2) retention period greater than the snapshot retention period.

### Why does my snapshot still exist even after the set retention period in the backup policy?

If the recovery point has a snapshot and it's the latest recovery point available, the snapshot is retained until the next successful backup. This behavior occurs according to the designated garbage collection policy. The policy mandates that at least one latest recovery point should always be present in case all subsequent backups fail because of an issue in the VM. In normal scenarios, recovery points are cleaned up at most 24 hours after they expire. In rare scenarios, there might be one or two other snapshots based on the heavier load on the garbage collector.

### Why do I see more snapshots than my retention policy?

In a scenario where a retention policy is set as `1`, you can find two snapshots. The policy mandates that at least one latest recovery point should always be present in case all subsequent backups fail because of an issue in the VM. This requirement can cause the presence of two snapshots.

So, if the policy is set for `n` snapshots, you can find `n+1` snapshots at times. Further, you can even find `n+1+2` snapshots if there's a delay in garbage collection. This rare behavior occurs when:

- You clean up snapshots that are past retention.
- The garbage collector in the back end is under heavy load.

> [!NOTE]
> Azure Backup manages backups in an automatic way. Azure Backup retains old snapshots because they're needed to maintain this backup for consistency purposes. If you delete snapshots manually, you might encounter problems in backup consistency.
>
> If there are errors in your backup history, use the **Retain data** option to stop the backup and then resume the backup.
>
> Consider creating a *backup strategy* if you have a particular scenario (for example, a VM with multiple disks that requires oversize space). You need to create a backup for **VM with OS Disk** separately, and then create a different backup for the other disks.

### I don't need Instant Restore functionality. Can it be disabled?

Instant Restore is enabled for everyone and can't be disabled. You can reduce the snapshot retention to a minimum of one day.

### Is it safe to restart the VM during the transfer process (which can take many hours)? Will restarting the VM interrupt or slow down the transfer?

Yes, it's safe. The data transfer speed isn't affected.

### Why does a 12-month backup retention policy retain data for 372 days instead of 365?

The retention period for monthly backups is calculated by using *31 days* for each month. When you multiply 31 days by 12 months, the total retention duration becomes *372 days*. This approach ensures consistent retention across all months, regardless of their actual number of days.

### Is there a charge for retaining extra restore points beyond expiry for the garbage collection cycle?

Yes, this retention incurs extra charges. Pricing depends on policy duration and unpruned recovery points. Consider these factors when you estimate backup costs.
