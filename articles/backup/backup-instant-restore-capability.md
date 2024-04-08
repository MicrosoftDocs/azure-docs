---
title: Azure Instant Restore Capability
description: Azure Instant Restore Capability and FAQs for VM backup stack, Resource Manager deployment model
ms.topic: conceptual
ms.date: 04/03/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Get improved backup and restore performance with Azure Backup Instant Restore capability

This article describes the improved backup and restore performance of  Instant Restore capability in Azure Backup.

## Key capabilities

The Instant Restore feature provides the following capabilities:

* Ability to use snapshots taken as part of a backup job that's available for recovery without waiting for data transfer to the vault to finish. It reduces the wait time for snapshots to copy to the vault before triggering restore.
* Reduces backup and restore times by retaining snapshots locally, for *two days* using Standard policy and for *seven days* using Enhanced policy by default. This default snapshot retention value is configurable to any value between 1 to 5 days for Standard policy and 1 to 30 days for Enhanced policy.
* Supports disk sizes up to 32 TB. Resizing of disks isn't recommended by Azure Backup.
* Standard policy supports Standard SSD disks along with Standard HDD disks and Premium SSD disks. Enhanced policy supports backup and instant restore of Premium SSD v2 and Ultra Disks, in addition to standard HDD, standard SSD, and Premium SSD v1 disks.
* Ability to use an unmanaged VMs original storage accounts (per disk), when restoring. This ability exists even when the VM has disks that are distributed across storage accounts. It speeds up restore operations for a wide variety of VM configurations.
* For backup of VMs that are using unmanaged premium disks in storage accounts, with Instant Restore, we recommend allocating *50%* free space of the total allocated storage space, which is required **only** for the first backup. The 50% free space isn't a requirement for backups after the first backup is complete.

## How Instant Restore works?

A backup job consists of two phases:

1. Taking a VM snapshot.
2. Transferring a VM snapshot to the Azure Recovery Services vault.

A recovery point is created as soon as the snapshot is finished and this recovery point of snapshot type can be used to perform a restore using the same restore flow. You can identify this recovery point in the Azure portal by using *snapshot* as the recovery point type, and after the snapshot is transferred to the vault, the recovery point type changes to *snapshot and vault*.

:::image type="content" source="./media/backup-azure-vms/instant-rp-flow.png" alt-text="Diagram shows the backup job in VM backup stack Resource Manager deployment model for storage and vault." lightbox="./media/backup-azure-vms/instant-rp-flow.png":::

## Feature considerations

* The snapshots are stored along with the disks to boost recovery point creation and to speed up restore operations. As a result, you'll see storage costs that correspond to snapshots taken during this period.
* For standard policy, all snapshots are incremental in nature and are stored as page blobs. All the users using unmanaged disks are charged for the snapshots stored in their local storage account. Since the restore point collections used by Managed VM backups use blob snapshots at the underlying storage level, for managed disks you'll see costs corresponding to blob snapshot pricing and they're incremental.
* For premium storage accounts, the snapshots taken for instant recovery points count towards the 10-TB limit of allocated space. For Enhanced policy, only Managed VM backups are supported. The initial snapshot is a full copy of the disk(s). The subsequent snapshots are incremental in nature and occupy only delta changes to disks since the last snapshot.
 When you use an Instant Restore recovery point, you must restore the VM or disks to a subscription and resource group that don't require CMK-encrypted disks via Azure Policy. 

## Cost impact

Instant Restore feature for snapshots (stored along with the disks) boosts recovery point creation and speed up restore operations. This incurs additional storage costs for the corresponding snapshots taken during this period. The snapshot storage cost varies depending on the type of backup policy.

### Cost impact of standard policy 

Standard policy uses blob snapshots for Instant Restore functionality. All snapshots are incremental in nature and stored in the VM's storage account, which is used for instant recovery. Incremental snapshot means the space occupied by a snapshot is equal to the space occupied by pages that are written after the snapshot was created. Billing is still for the per GB used space occupied by the snapshot as explained in [this section](../storage/blobs/snapshots-overview.md#pricing-and-billing). As an illustration, consider a VM with 100GB in size, change rate of 2% and retention of 5 days for Instant Restore. In this case, the snapshot storage billed will be 10GB (100* 0.02* 5).

For VMs that use unmanaged disks, the snapshots can be seen in the menu for the VHD file of each disk. For managed disks, snapshots are stored in a restore point collection resource in a designated resource group, and the snapshots themselves aren't directly visible.

### Cost impact of enhanced policy 

Enhanced policy uses Managed disk snapshots for Instant Restore functionality. The initial snapshot is a full copy of the disk(s). The subsequent snapshots are incremental in nature and occupy only delta changes to disks since the last snapshot. Pricing for managed disk snapshots is explained in [this pricing page](https://azure.microsoft.com/pricing/details/managed-disks/). 

For example, a VM with 100GB in size has a change rate of 2% and retention of 5 days for Instant Restore. In this case, the snapshot storage billed will be 108GB (100 + 100 X 0.02 X 4).

>[!NOTE]
> Snapshot retention is fixed to 5 days for weekly policies for Standard policy and can vary between 5 to 20 days for enhanced policy.

## Configure snapshot retention

### Using Azure portal

[!INCLUDE [backup-center.md](../../includes/backup-center.md)]

In the Azure portal, you can see a field added in the **VM Backup Policy** pane under the **Instant Restore** section. You can change the snapshot retention duration from the **VM Backup Policy** pane for all the VMs associated with the specific backup policy.

![Instant Restore Capability](./media/backup-azure-vms/instant-restore-capability.png)

### Using PowerShell

>[!NOTE]
> From Az PowerShell version 1.6.0 onwards, you can update the instant restore snapshot retention period in policy using PowerShell

```powershell
$bkpPol = Get-AzRecoveryServicesBackupProtectionPolicy -WorkloadType "AzureVM"
$bkpPol.SnapshotRetentionInDays=5
Set-AzRecoveryServicesBackupProtectionPolicy -policy $bkpPol
```

The default snapshot retention for each policy is set to two days. You can change the value to a minimum of 1 and a maximum of five days. For weekly policies, the snapshot retention is fixed to five days.

## Frequently asked questions

### What are the cost implications of Instant restore?

Snapshots are stored along with the disks to speed up recovery point creation and restore operations. As a result, you'll see storage costs that correspond to the snapshot retention selected as a part of VM backup policy.

### In Premium Storage accounts, do the snapshots taken for instant recovery point occupy the 10-TB snapshot limit?

Yes, for premium storage accounts the snapshots taken for instant recovery point occupy 10 TB of allocated snapshot space.

### How does the snapshot retention work during the five-day period?

For Standard policy, each day a new snapshot is taken, then there are five individual incremental snapshots. The size of the snapshot depends on the data churn, which are in most cases around 2%-7%. For Enhanced policy, the initial snapshot is a full snapshot and subsequent snapshots are incremental in nature.

### Is an instant restore snapshot an incremental snapshot or full snapshot?

For Standard policy, snapshots taken as a part of instant restore capability are incremental snapshots. For Enhanced policy, the initial snapshot is a full snapshot and subsequent snapshots are incremental in nature.

### How can I calculate the approximate cost increase due to instant restore feature?

It depends on the churn of the VM.

- **Standard policy**: In a steady state, you can assume the increase in cost is = Snapshot retention period daily churn per VM snapshot storage cost per GB.
- **Enhanced policy**: In a steady state, you can assume the increase in cost is = ((Size of VM) + (Snapshot retention period-1)*daily churn per VM) * snapshot storage cost per GB.

### If the recovery type for a restore point is “Snapshot and vault” and I perform a restore operation, which recovery type will be used?

If the recovery type is “snapshot and vault”, restore will be automatically done from the local snapshot, which will be much faster compared to the restore done from the vault.

### What happens if I select retention period of restore point (Tier 2) less than the snapshot (Tier 1) retention period?

The new model doesn't allow deleting the restore point (Tier 2) unless the snapshot (Tier 1) is deleted. We recommend scheduling restore point (Tier 2) retention period greater than the snapshot retention period.

### Why does my snapshot still exist, even after the set retention period in backup policy?

If the recovery point has a snapshot and it's the latest recovery point available, it's retained until the next successful backup. This is according to the designated "garbage collection" (GC) policy. It mandates that at least one latest recovery point always be present, in case all subsequent backups fail due to an issue in the VM. In normal scenarios, recovery points are cleaned up at most 24 hours after they expire. In rare scenarios, there might be one or two additional snapshots based on the heavier load on the garbage collector (GC).

### Why do I see more snapshots than my retention policy?

In a scenario where a retention policy is set as “1”, you can find two snapshots. This mandates that at least one latest recovery point always be present, in case all subsequent backups fail due to an issue in the VM. This can cause the presence of two snapshots.<br></br>So, if the policy is for "n" snapshots, you can find “n+1” snapshots at times. Further, you can even find “n+1+2” snapshots if there's a delay in garbage collection. This can happen at rare times when:
- You clean up snapshots, which are past retention.
- The garbage collector (GC) in the backend is under heavy load.

> [!NOTE]
> Azure Backup manages backups in automatic way. Azure Backup retains old snapshop as these are needed to mantain this backup for consistency purpose. If you delete snapshot manually, you might encounter problem in backup consistency.
> If there are errors in your backup history, you need to stop backup with retain data option and resume the backup.
> Consider creating a **backup strategy** if you've a particular scenario (for example, a virtual machine with multiple disks and requires oversize space). You need to separately create a backup for **VM with OS Disk** and create a different backup for **the other disks**.

### I don’t need Instant Restore functionality. Can it be disabled?

Instant restore feature is enabled for everyone and can't be disabled. You can reduce the snapshot retention to a minimum of one day.

### Is it safe to restart the VM during the transfer process (which can take many hours)? Will restarting the VM interrupt or slow down the transfer?

Yes it's safe, and there's absolutely no impact in data transfer speed.

