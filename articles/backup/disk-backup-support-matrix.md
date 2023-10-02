---
title: Azure Disk Backup support matrix
description: Provides a summary of support settings and limitations Azure Disk Backup.
ms.topic: conceptual
ms.date: 03/03/2023
ms.custom: references_regions
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Azure Disk Backup support matrix

You can use [Azure Backup](./backup-overview.md) to protect Azure Disks. This article summarizes region availability, supported scenarios, and limitations.

## Supported regions

Azure Disk Backup is available in all public cloud and Sovereign cloud regions.

## Limitations

- Azure Disk Backup is supported for Azure Managed Disks, including shared disks (Shared premium SSDs). Unmanaged disks aren't supported. Currently, this solution doesn't support Premium SSD v2 disks and Ultra-disks, including shared disk, because of lack of snapshot capability.

- Azure Disk Backup supports backup of Write Accelerator disk. However, during restore the disk would be restored as a normal disk. Write Accelerated cache can be enabled on the disk after mounting it to a VM.

- Azure Backup provides operational (snapshot) tier backup of Azure managed disks with support for multiple backups per day. The backups aren't copied to the backup vault.

- Currently, the Original-Location Recovery (OLR) option to restore by replacing existing source disks from where the backups were taken isn't supported. You can restore from recovery point to create a new disk either in the same resource group as that of the source disk from where the backups were taken or in any other resource group. This is known as Alternate-Location Recovery (ALR).

- Azure Backup for Managed Disks uses incremental snapshots, which are limited to 500 snapshots per disk. To allow you to take on-demand backup aside from scheduled backups, Backup policy limits the total backups to 480. Learn more about [incremental snapshot](../virtual-machines/disks-incremental-snapshots.md#restrictions) for managed disks.

- Azure [subscription and service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#virtual-machine-disk-limits) apply to the total number of disk snapshots per region per subscription.

- Point-in-time snapshots of multiple disks attached to a virtual machine isn't supported.

- The Backup vault and the disks to be backed up can be in the same or different subscriptions. However, both the backup vault and disk to be backed up must be in same region.

- Disks to be backed up and the snapshot resource group where the snapshots are stored locally must be in same subscription.

- Restoring a disk from backup to the same or a different subscription is supported. However, the restored disk will be created in the same region as that of the snapshot.

- ADE encrypted disks can't be protected.

- Disks encrypted with platform-managed keys or customer-managed keys are supported. However, the restore will fail for the restore points of a disk that is encrypted using customer-managed keys (CMK) if the Disk Encryption Set KeyVault key is disabled or deleted.

- Currently, the Backup policy can't be modified, and the Snapshot Resource group that is assigned to a backup instance when you  configure the backup of a disk can't be changed.

- When configuring backup, the disk selected to be backed up and the snapshot resource group where the snapshots are to be stored must be part of the same subscription. You can't create an incremental snapshot for a particular disk outside of that disk's subscription. Learn more about [incremental snapshots](../virtual-machines/disks-incremental-snapshots.md#restrictions) for managed disk. For more information on how to choose a snapshot resource group, see  [Configure backup](backup-managed-disks.md#configure-backup).

- For successful backup and restore operations, role assignments are required by the Backup vault’s managed identity. Use only the role definitions provided in the documentation. Use of other roles like owner, contributor, and so on, isn't supported. You may face permission issues, if you start configuring backup or restore operations soon after assigning roles. This is because the role     assignments take a few minutes to take effect.

- Managed disks allow changing the performance tier at deployment or afterwards without changing size of the disk. The Azure Disk Backup solution supports the performance tier changes to the source disk that is being backed up. During restore, the performance tier of the restored disk will be the same as that of the source disk at the time of backup. Follow the documentation [here](../virtual-machines/disks-performance-tiers-portal.md) to change your disk’s performance tier after restore operation.

- [Private Links](../virtual-machines/disks-enable-private-links-for-import-export-portal.md) support for managed disks allows you to restrict the export and import of managed disks so that it only occurs within your Azure virtual network. Azure Disk Backup supports backup of disks that have private endpoints enabled. This doesn't include the backup data or snapshots to be accessible through the private endpoint.

- You can delete a backup instance, which will stop the backup, and also deletes all the backup data. Currently, you can’t disable a backup, as the option **stop backup and retain backup data** isn’t supported.

- Azure Disk Backup limits are:
    
    | Setting | Maximum limit |
    | --- | --- |
    | Number of Backup Policies per Backup Vault | 5000 |
    | Number of Backup Instances per Backup Vault | 5000 |
    | Number of on-demand backups allowed in a day per backup instance | 10 |
    | Number of restores allowed in a day per backup instance | 10 |

## Next steps

- [Back up Azure Managed Disks](backup-managed-disks.md)