---
title: Azure Disk Backup support matrix
description: Provides a summary of support settings and limitations Azure Disk Backup.
ms.topic: conceptual
ms.date: 01/07/2021
---



**Support Matrix**

You can use [Azure Backup](https://docs.microsoft.com/azure/backup/backup-overview) to protect Azure Disk. This article summarizes region availability, supported scenarios and limitations.

 

## Supported regions

Azure Disk Backup is available in preview in following regions - <TBD>

 

## Limitations

 

- Azure Disk     backup is supported for Azure Managed Disk including Shared disk (Shared premium SSDs) and unmanaged disk is     not supported. Currently this solution does not support Ultra-disk including     Shared ultra-disk, due to lack of snapshot capability.

·     Azure Disk backup supports backup of Write Accelerator disk. However, during restore the disk would be restored as a normal disk. Write Accelerated cache can be enabled on the disk after mounting it to a VM.

- Azure Backup     provides Operational (snapshot) tier backup of Azure managed disk with     support for multiple backups per day. The backups are not copied to backup     vault.

·     **Currently, Original-Location Recovery (OLR) option to restore by replacing existing source disk from** where the backups were taken **is not supported. You can restore from recovery point** to create a new disk either in the same resource group as that of the source disk from where the backups were taken or in any other resource group. This is known as Alternate-Location Recovery (ALR).

·     Azure Backup for Managed Disk uses incremental snapshot which are limited to 200 snapshots per disk. To allow customer to take on-demand backup apart from scheduled backups, Backup policy limits the total backups to 180. Learn more about [incremental snapshot](https://docs.microsoft.com/azure/virtual-machines/windows/disks-incremental-snapshots-portal#restrictions) for managed disk. 

- Azure [subscription and service limits](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#virtual-machine-disk-limits) shall apply to total number of     disk snapshots per region per subscription.
- Point in time     snapshot of multiple disks attached to a virtual machine is not supported.
- Backup vault     and Disk to be backed up can be in same or different subscription.     However, both the backup vault and disk to be backed up must be in same     region. 
- Disk to be     backed up and the Snapshot resource group where the snapshots are stored     locally must be in same subscription. 
- Restoring a     disk from backup to same or different subscription is supported. However,     the restored disk will be created in the same region as that of the     snapshot.
- ADE encrypted     disk cannot be protected. 
- Disk encrypted     with Platform managed key or customer managed key are supported. However,     restore will fail for the restore points of a disk that is encrypted using     customer managed key (CMK) if Disk Encryption Set KeyVault key is disabled     or deleted.
- Currently, the Backup     policy cannot be modified, and the Snapshot Resource group assigned to a     backup instance when configuring backup of a disk cannot be changed.
- Currently, the     Azure portal experience to configure backup of disk is limited to maximum     of 20 disks from the same subscription. Support to configure disks at     scale and across subscription will be enabled through PowerShell, CLI or     SDK during GA.
- When     configuring backup, the disk selected to be backed up and the Snapshot     resource group where the snapshots are to be stored must be part of the     same subscription. You     cannot create an incremental snapshot for a particular disk outside of     that disk's subscription. Learn more about [incremental snapshot](https://docs.microsoft.com/azure/virtual-machines/windows/disks-incremental-snapshots-portal#restrictions) for managed disk. For more     details on how to choose Snapshot resource group refer to [Configure backup](https://aka.ms/diskbackupdoc-backup)
- For successful     backup and restore operation, role assignments are required by the Backup     vault’s managed identity. Use only the role definitions provided in the     documentation. Use of other roles like owner, contributor etc. is not     supported. You may face permission issue, if you start configuring backup     or restore operation soon after assigning roles. This is because, the role     assignments takes a few minutes to take effect.

·     Managed disk allows changing performance tier at deployment or afterwards without changing size of the disk. Azure Disk Backup solution supports the performance tier changes to the source disk that is being backed up. During restore, performance tier of the restored disk will be same as that of the source disk at the time of backup. Please follow the documentation [here](https://docs.microsoft.com/azure/virtual-machines/disks-performance-tiers-portal) to change your disk’s performance tier after restore operation.

·     [Private Links](https://docs.microsoft.com/azure/virtual-machines/disks-enable-private-links-for-import-export-portal) support for managed disks allows you to restrict the export and import of managed disks so that it only occurs within your Azure virtual network. Azure Disk Backup supports backup of disk that has private endpoint enabled. This does not include the backup data or snapshots to be accessible through private endpoint. 

 

 

## Next steps

