---
title: Guidelines for Azure NetApp Files network planning | Microsoft Docs
description: Describes guidelines that can help you design an effective network architecture by using Azure NetApp Files.
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
ms.date: 09/12/2022
---
# Configure Backup Vault for Azure NetApp Files (Preview)

Azure NetApp Files supports backup vaults. Backup vaults store the backups for your Azure NetApp Files subscription in addition to containing the backup policies you use to protect your resources. 

If you 

## Create a backup vault

1. In your Azure NetApp Files subscription, navigate to the **Backup Vaults** menu.
1. Select **+ Add Backup Vault**. Assign a name to your backup vault and then select **Create**.
  :::image type="content" source="../media/azure-netapp-files/backup-vault-create.png" alt-text="Screenshot of backup vault creation." lightbox="../media/azure-netapp-files/backup-vault-create.png":::

## Migrate backups to a backup vault

If you have existing backups not in a backup vault, you will have to migrate them to your backup vault. 

You will see both existing backups and backups of volumes that have been deleted. 


## Delete a backup vault

Deleting a backup vault...

### Steps

1. Navigate to the **Backup Vault** menu.
1. Find the backup vault you want to delete and select the three dots `...` next to its name. Select **Delete**. 

# Next steps

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
