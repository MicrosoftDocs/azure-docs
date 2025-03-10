---
title: Requirements and considerations for Azure NetApp Files backup | Microsoft Docs
description: Describes the requirements and considerations you need to be aware of before using Azure NetApp Files backup.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 01/27/2025
ms.author: anfdocs
---
# Requirements and considerations for Azure NetApp Files backup 

This article describes the requirements and considerations you need to be aware of before using Azure NetApp Files backup.

## Requirements and considerations

You need to be aware of several requirements and considerations before using Azure NetApp Files backup: 

>[!IMPORTANT]
>All backups require a backup vault. If you have existing backups, you must migrate backups to a backup vault before you can perform any operation with a backup. For more information, see [Manage backup vaults](backup-vault-manage.md).

* Azure NetApp Files backup is available in the regions associated with your Azure NetApp Files subscription. 
Azure NetApp Files backup in a region can only protect an Azure NetApp Files volume located in that same region. For example, backups created by the service in West US 2 for a volume located in West US 2 are sent to Azure storage also located in West US 2. Azure NetApp Files doesn't support backups or backup replication to a different region.  

* There can be a delay of up to 5 minutes in displaying a backup after the backup is actually completed.

* For volumes larger than 10 TiB, it can take multiple hours to transfer all the data from the backup media.

* The Azure NetApp Files backup feature supports backing up the daily, weekly, and monthly local snapshots to the Azure storage. Hourly backups aren't currently supported.

* Azure NetApp Files backup uses the [Zone-Redundant storage](../storage/common/storage-redundancy.md#redundancy-in-the-primary-region) (ZRS) account that replicates the data synchronously across three Azure availability zones in the region, except for the regions listed where only [Locally Redundant Storage (LRS)](../storage/common/storage-redundancy.md#redundancy-in-the-primary-region) storage is supported:   

    * West US   

    LRS can recover from server-rack and drive failures. However, if a disaster such as a fire or flooding occurs within the data center, all replicas of a storage account using LRS might be lost or unrecoverable. 

* Policy-based (scheduled) Azure NetApp Files backup is independent from [snapshot policy configuration](azure-netapp-files-manage-snapshots.md).

* You can't apply a backup policy to a volume while a manual backup is in progress. Wait for the manual backup to complete before applying the policy. 

* In a [cross-region replication](cross-region-replication-introduction.md) (CRR) or [cross-zone replication](cross-zone-replication-introduction.md) (CZR) setting, Azure NetApp Files backup can be configured on a source volume. 

    Backups on a destination volume are only supported for manually created snapshots. To take backups of a destination volume, create a snapshot on the source volume then wait for the snapshot to be replicated to the destination volume. From the destination volume, you select the snapshot for backup. Scheduled backups on a destination volume aren't supported.

* See [Restore a backup to a new volume](backup-restore-new-volume.md) for additional considerations related to restoring backups.

* If you delete a volume, the backups remain. If you no longer need the backups, you should [manually delete the backups](backup-delete.md).

* If you need to delete a parent resource group or subscription that contains backups, you should delete any backups first. Deleting the resource group or subscription doesn't delete the backups.

## Next steps

* [Understand Azure NetApp Files backup](backup-introduction.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Configure policy-based backups](backup-configure-policy-based.md)
* [Configure manual backups](backup-configure-manual.md)
* [Manage backup policies](backup-manage-policies.md)
* [Search backups](backup-search.md)
* [Restore a backup to a new volume](backup-restore-new-volume.md)
* [Delete backups of a volume](backup-delete.md)
* [Volume backup metrics](azure-netapp-files-metrics.md#volume-backup-metrics)
* [Azure NetApp Files backup FAQs](faq-backup.md)
* [How Azure NetApp Files snapshots work](snapshots-introduction.md)
