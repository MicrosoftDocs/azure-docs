---
title: Manage backup policies for Azure NetApp Files | Microsoft Docs
description: Describes how to modify or suspend a backup policy for Azure NetApp Files volumes.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 08/13/2024
ms.author: anfdocs
---
# Manage backup policies for Azure NetApp Files 

After you've configured Azure NetApp Files backups using [a backup policy](backup-configure-policy-based.md), you can modify or suspend a backup policy as needed.  

Manual backups aren't affected by changes in the backup policy.

>[!IMPORTANT]
>All backups require a backup vault. If you have existing backups, you must migrate backups to a backup vault before you can perform any operation with a backup. For more information about this procedure, see [Manage backup vaults](backup-vault-manage.md).

## Modify a backup policy   

You can modify an existing Azure NetApp Files backup policy as needed to ensure that you have proper backup coverage for Azure NetApp Files volumes.  For example, if you need to change the number of retained backups that are protected by the service, you can modify the Azure NetApp Files backup policy for the volume to revise the number of backups to keep. 

To modify the backup policy settings:   

1. Navigate to **Backups**.

2. Select **Backup Policies** then select the three dots (`…`) to the right of a backup policy. Select **Edit**.

    :::image type="content" source="./media/backup-manage-policies/backup-policies-edit.png" alt-text="Screenshot that shows context sensitive menu of Backup Policies." lightbox="./media/backup-manage-policies/backup-policies-edit.png":::

3. In the Modify Backup Policy window, update the number of backups you want to keep for daily, weekly, and monthly backups. Enter the backup policy name to confirm the action. Select **Save**.  

    :::image type="content" source="./media/backup-manage-policies/backup-modify-policy.png" alt-text="Screenshot showing the Modify Backup Policy window." lightbox="./media/backup-manage-policies/backup-modify-policy.png":::
    
    > [!NOTE] 
    > After backups are configured and have taken effect for the scheduled frequency, you can't change the backup retention count to `0`. The backup retention count requires a minimum number of `1` for the backup policy. See [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md) for details.  

    >[!NOTE]
    > Scheduled backups aren't supported on destination volumes in [cross-region](cross-region-replication-introduction.md) or [cross-zone](cross-zone-replication-introduction.md) replication relationships. Backups on destination volumes can only be taken from manual snapshots replicated from the source volume. For more information, see [Requirements and considerations for Azure NetApp Files backup](backup-requirements-considerations.md#requirements-and-considerations).

## Suspend a backup policy  

A backup policy can be suspended so that it does not perform any new backup operations against the associated volumes. This action enables you to temporarily suspend backups if existing backups need to be maintained but not retired because of versioning.   

### Suspend a backup policy for all volumes associated with the policy

1. Navigate to **Backups**.

1. Select **Backup Policies**.

1. Select the three dots (`…`) to the right of the backup policy you want to modify, then select **Edit**. 

1. Toggle **Policy State** to **Disabled**, enter the policy name to confirm, then select **Save**. 

### Suspend a backup policy for a specific volume 

1. Go to **Volumes**. 
2. Select the specific volume whose backups you want to suspend.
3. From the selected volume, select **Backup** then **Configure**.
4. In the Configure Backups page, toggle **Policy State** to **Suspend**, enter the volume name to confirm, then select **OK**.   

    :::image type="content" source="./media/backup-manage-policies/backup-modify-policy-suspend.png" alt-text="Screenshot of a backup with a suspended policy.":::
    
## Next steps  

* [Understand Azure NetApp Files backup](backup-introduction.md)
* [Requirements and considerations for Azure NetApp Files backup](backup-requirements-considerations.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Configure policy-based backups](backup-configure-policy-based.md)
* [Configure manual backups](backup-configure-manual.md)
* [Search backups](backup-search.md)
* [Restore a backup to a new volume](backup-restore-new-volume.md)
* [Delete backups of a volume](backup-delete.md)
* [Volume backup metrics](azure-netapp-files-metrics.md#volume-backup-metrics)
* [Azure NetApp Files backup FAQs](faq-backup.md)
