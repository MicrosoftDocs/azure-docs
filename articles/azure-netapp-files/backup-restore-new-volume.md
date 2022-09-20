---
title: Restore a backup to a new Azure NetApp Files volume | Microsoft Docs
description: Describes how to restore a backup to a new volume. 
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 08/23/2022
ms.author: anfdocs
---
# Restore a backup to a new volume

Restoring a backup creates a new volume with the same protocol type. This article explains the restore operation. 

## Considerations

* You can restore backups only within the same NetApp account. Restoring backups across NetApp accounts are not supported. 

* You can restore backups to a different capacity pool within the same NetApp account.

* You can restore a backup only to a new volume.  You cannot overwrite the existing volume with the backup. 

* The new volume created by the restore operation cannot be mounted until the restore completes. 

* You should trigger the restore operation when there are no baseline backups. Otherwise, the restore might increase the load on the Azure Blob account where your data is backed up. 

* For large volumes (greater than 10 TB), it can take multiple hours to transfer all the data from the backup media.

See [Requirements and considerations for Azure NetApp Files backup](backup-requirements-considerations.md) for additional considerations about using Azure NetApp Files backup.

## Steps

1. Select **Volumes**. Navigate to **Backups**.

    > [!NOTE]
    > If a volume is deleted but the backup policy wasn’t disabled before the volume deletion, all the backups related to the volume are retained in the Azure storage, and you can find them under the associated NetApp account.  See [Search backups at NetApp account level](backup-search.md#search-backups-at-netapp-account-level).


2. From the backup list, select the backup to restore. Select the three dots (`…`) to the right of the backup, then select **Restore to new volume** from the Action menu.   

    ![Screenshot that shows the option to restore backup to a new volume.](../media/azure-netapp-files/backup-restore-new-volume.png)

3. In the Create a Volume page that appears, provide information for the fields in the page as applicable, and select **Review + Create** to begin restoring the backup to a new volume.   

    * The **Protocol** field is pre-populated from the original volume and cannot be changed.    
        However, if you restore a volume from the backup list at the NetApp account level, you need to specify the Protocol field. The Protocol field must match the protocol of the original volume. Otherwise, the restore operation will fail with the following error:  
        `Protocol Type value mismatch between input and source volume of backupId <backup-id of the selected backup>. Supported protocol type : <Protocol Type of the source volume>`

    * The **Quota** value must be greater than or equal to the size of the backup from which the restore is triggered (minimum 100 GiB).

    * The **Capacity pool** that the backup is restored into must have sufficient unused capacity to host the new restored volume. Otherwise, the restore operation will fail.   

    ![Screenshot that shows the Create a Volume page.](../media/azure-netapp-files/backup-restore-create-volume.png)

## Next steps  

* [Understand Azure NetApp Files backup](backup-introduction.md)
* [Requirements and considerations for Azure NetApp Files backup](backup-requirements-considerations.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Configure policy-based backups](backup-configure-policy-based.md)
* [Configure manual backups](backup-configure-manual.md)
* [Manage backup policies](backup-manage-policies.md)
* [Search backups](backup-search.md)
* [Disable backup functionality for a volume](backup-disable.md)
* [Delete backups of a volume](backup-delete.md)
* [Volume backup metrics](azure-netapp-files-metrics.md#volume-backup-metrics)
* [Azure NetApp Files backup FAQs](faq-backup.md)
