---
title: Manage backup vaults for Azure NetApp Files | Microsoft Docs
description: Describes how to use backup vaults to manage backups in Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 10/27/2022
ms.author: anfdocs
---
# Manage backup vaults for Azure NetApp Files (preview)

Backup vaults store the backups for your Azure NetApp Files subscription.

Although it's possible to create multiple backup vaults in your Azure NetApp Files account, it's recommended you have only one backup vault.

>[!IMPORTANT]
>If you have existing backups on Azure NetApp Files, you must migrate the backups to a backup vault before you can perform any operation with the backup.

## Create a backup vault

1. In your Azure NetApp Files subscription, navigate to the **Backup Vaults** menu.

1. Select **+ Add Backup Vault**. Assign a name to your backup vault then select **Create**.

  :::image type="content" source="../media/azure-netapp-files/backup-vault-create.png" alt-text="Screenshot of backup vault creation." lightbox="../media/azure-netapp-files/backup-vault-create.png":::

## Migrate backups to a backup vault

If you have existing backups, you must migrate them to a backup vault before you can restore from a backup. 

1. Navigate to **Backups**.
1. From the banner above the backups, select **Assign Backup Vault**.
1. To bulk migrate all the volumes, select **Assign to Backup Vault and Enable Backup**.

    If there are backups from volumes that have been deleted that you want to migrate, select **Include backups from Deleted Volumes**. This option will only be enabled if backups from deleted volumes are present. 

   :::image type="content" source="../media/azure-netapp-files/backup-vault-assign.png" alt-text="Screenshot of backup vault assignment." lightbox="../media/azure-netapp-files/backup-vault-assign.png":::

1. Navigate to the **Backup Vault** menu to view and manage your backups.

## Delete a backup vault

1. Navigate to the **Backup Vault** menu.
1. Identify the backup vault you want to delete and select the three dots `...` next to the backup's name. Select **Delete**. 

    :::image type="content" source="../media/azure-netapp-files/backup-vault-delete.png" alt-text="Screenshot of deleting a backup vault." lightbox="../media/azure-netapp-files/backup-vault-delete.png":::

## Next steps

* [Understand Azure NetApp Files backup](backup-introduction.md)
* [Requirements and considerations for Azure NetApp Files backup](backup-requirements-considerations.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Configure policy-based backups](backup-configure-policy-based.md)
* [Configure manual backups for Azure NetApp Files](backup-configure-manual.md)
* [Manage backup policies](backup-manage-policies.md)
* [Search backups](backup-search.md)
* [Restore a backup to a new volume](backup-restore-new-volume.md)
* [Disable backup functionality for a volume](backup-disable.md)
* [Delete backups of a volume](backup-delete.md)
* [Volume backup metrics](azure-netapp-files-metrics.md#volume-backup-metrics)
* [Azure NetApp Files backup FAQs](faq-backup.md)
