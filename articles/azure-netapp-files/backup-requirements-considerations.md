---
title: Requirements and considerations for Azure NetApp Files backup | Microsoft Docs
description: Describes the requirements and considerations you need to be aware of before using Azure NetApp Files backup.  
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 08/15/2022
ms.author: anfdocs
---
# Requirements and considerations for Azure NetApp Files backup 

This article describes the requirements and considerations you need to be aware of before using Azure NetApp Files backup.

## Requirements and considerations

You need to be aware of several requirements and considerations before using Azure NetApp Files backup: 

* Azure NetApp Files backup is available in the regions associated with your Azure NetApp Files subscription. 
Azure NetApp Files backup in a region can only protect an Azure NetApp Files volume that is located in that same region. For example, backups created by the service in West US 2 for a volume located in West US 2 are sent to Azure storage that is located also in West US 2. Azure NetApp Files does not support backups or backup replication to a different region.  

* There can be a delay of up to 5 minutes in displaying a backup after the backup is actually completed.

* For large volumes (greater than 10 TB), it can take multiple hours to transfer all the data from the backup media.

* Currently, the Azure NetApp Files backup feature supports backing up the daily, weekly, and monthly local snapshots created by the associated snapshot policy to the Azure storage. Hourly backups are not currently supported.

* Azure NetApp Files backup uses the [Zone-Redundant storage](../storage/common/storage-redundancy.md#redundancy-in-the-primary-region) (ZRS) account that replicates the data synchronously across three Azure availability zones in the region, except for the regions listed below where only [Locally Redundant Storage](../storage/common/storage-redundancy.md#redundancy-in-the-primary-region) (LRS) storage is supported:   

    * West US   

    LRS can recover from server-rack and drive failures. However, if a disaster such as a fire or flooding occurs within the data center, all replicas of a storage account using LRS might be lost or unrecoverable. 

* Using policy-based (scheduled) Azure NetApp Files backup requires that snapshot policy is configured and enabled. See [Manage snapshots by using Azure NetApp Files](azure-netapp-files-manage-snapshots.md).   
    The volume that needs to be backed up requires a configured snapshot policy for creating snapshots. The configured number of backups are stored in the Azure storage. 

* If an issue occurs (for example, no sufficient space left on the volume) and causes the snapshot policy to stop creating new snapshots, the backup feature will not have any new snapshots to back up. 

* In a cross-region replication setting, Azure NetApp Files backup can be configured on a source volume only. It is not supported on a cross-region replication *destination* volume.

* [Reverting a volume using snapshot revert](snapshots-revert-volume.md) is not supported on Azure NetApp Files volumes that have backups. 

* See [Restore a backup to a new volume](backup-restore-new-volume.md) for additional considerations related to restoring backups.

## Next steps

* [Understand Azure NetApp Files backup](backup-introduction.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Configure policy-based backups](backup-configure-policy-based.md)
* [Configure manual backups](backup-configure-manual.md)
* [Manage backup policies](backup-manage-policies.md)
* [Search backups](backup-search.md)
* [Restore a backup to a new volume](backup-restore-new-volume.md)
* [Disable backup functionality for a volume](backup-disable.md)
* [Delete backups of a volume](backup-delete.md)
* [Volume backup metrics](azure-netapp-files-metrics.md#volume-backup-metrics)
* [Azure NetApp Files backup FAQs](faq-backup.md)
* [How Azure NetApp Files snapshots work](snapshots-introduction.md)
