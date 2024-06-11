---
title: Configure policy-based backups for Azure NetApp Files | Microsoft Docs
description: Describes how to configure policy-based (scheduled) backups for Azure NetApp Files volumes.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 05/27/2024
ms.author: anfdocs
---
# Configure policy-based backups for Azure NetApp Files 

Azure NetApp Files backup supports *policy-based* (scheduled) backups and *manual* (on-demand) backups at the volume level. You can use both types of backups in the same volume. During the configuration process, you'll enable the backup feature for an Azure NetApp Files volume before policy-based backups or manual backups can be taken. 

This article explains how to configure policy-based backups. For manual backup configuration, see [Configure manual backups](backup-configure-manual.md).  

## About policy-based backups    

Backups are long-running operations. The system schedules backups based on the primary workload (which is given a higher priority) and runs backups in the background. Depending on the size of the volume being backed up, a backup can run in background for hours. There's no option to select the start time for backups. The service performs the backups based on the internal scheduling and optimization logic. 

Assigning a policy creates a baseline snapshot that is the current state of the volume and transfers the snapshot to Azure storage. This baseline snapshot is deleted automatically when the first scheduled backup is complete (based on the policy). If the backup policy is attached to a volume, the backup list will be empty until the baseline snapshot is transferred. When the backup is complete, the baseline backup entry appears in the list of backups for the volume. After the baseline transfer, the list will be updated daily based on the policy. An empty list of backups indicates that the baseline backup is in progress. If a volume already has existing manual backups before you assign a backup policy, the baseline snapshot isn't created. A baseline snapshot is created only when the volume has no prior backups.

[!INCLUDE [consideration regarding deleting backups after deleting resource or subscription](includes/disable-delete-backup.md)]

[!INCLUDE [Backup registration heading](includes/backup-registration.md)]

## Configure a backup policy

A backup policy enables a volume to be protected on a regularly scheduled interval. It does not require snapshot policies to be configured. Backup policies will continue the daily cadence based on the time of day when the backup policy is linked to the volume, using the time zone of the Azure region where the volume exists. Weekly schedules are preset to occur each Monday after the daily cadence.  Monthly schedules are preset to occur on the first day of each calendar month after the daily cadence. If backups are needed at a specific time/day, consider using [manual backups](backup-configure-manual.md). 

You need to create a backup policy and associate the backup policy to the volume that you want to back up. A single backup policy can be attached to multiple volumes. Backups can be temporarily suspended by disabling the policy. A backup policy can't be deleted if it's attached to any volumes.

To enable a policy-based (scheduled) backup: 

1. Sign in to the Azure portal and navigate to **Azure NetApp Files**. 
2. Select your Azure NetApp Files account.
3. Select **Backups**. 

    <!-- :::image type="content" source="./media/backup-configure-policy-based/backup-navigate.png" alt-text="Screenshot that shows how to navigate to Backups option." lightbox="./media/backup-configure-policy-based/backup-navigate.png"::: -->

4. Select **Backup Policies**.
5. Select **Add**. 
6. In the **Backup Policy** page, specify the backup policy name.  Enter the number of backups that you want to keep for daily, weekly, and monthly backups. Select **Save**.      

    The minimum value for **Daily Backups to Keep** is 2. 

    :::image type="content" source="./media/backup-configure-policy-based/backup-policy-window-daily.png" alt-text="Screenshot that shows the Backup Policy window." lightbox="./media/backup-configure-policy-based/backup-policy-window-daily.png":::
 
### Example of a valid configuration

The following example configuration shows you how to configure a data protection policy on the volume. This configuration results in backing up 15 latest daily snapshots, 6 latest weekly snapshots, and 4 latest monthly snapshots.

* Backup policy:   
    Daily: `Daily Backups to Keep = 15`   
    Weekly: `Weekly Backups to Keep = 6`   
    Monthly: `Monthly Backups to Keep = 4`

### Example of an invalid configuration

The following example configuration has a backup policy configured for daily backups. The daily backup policy is below the minimum of two. This configuration would back up only weekly and monthly snapshots.

* Backup policy:   
    Daily: `Daily Backups to Keep = 1`   
    Weekly: `Weekly Backups to Keep = 6`   
    Monthly: `Monthly Backups to Keep = 4`   

## Assign backup vault and backup policy to a volume

Every Azure NetApp Files volume must have a [backup vault](backup-vault-manage.md) assigned before any backups (policy-based or manual) can be taken. 

After you assign a backup vault to the volume, you need to assign a backup policy to the volume for policy-based backups to take effects. (For manual backups, a backup policy is optional.)

>[!NOTE]
>The active and most current snapshot is required for transferring the backup. As a result, you may see 1 extra snapshot beyond the number of snapshots to keep per the backup policy configuration. If your number of daily backups to keep is set to 2, you may see 3 snapshots related to the backup in the volumes the policy is applied to.

To configure backups for a volume:  

1. Navigate to **Volumes** then select the volume for which you want to configure backups.
2. From the selected volume, select **Backup** then **Configure**.
3. In the Configure Backups page, select the backup vault from the **Backup vaults** drop-down. For information about creating a backup vault, see [Create a backup vault](backup-vault-manage.md).
4. In the **Backup Policy** drop-down menu, assign the backup policy to use for the volume. Select **OK**.

    The Vault information is prepopulated.  

  :::image type="content" source="./media/shared/backup-configure-enabled.png" alt-text="Screenshot showing Configure Backups window." lightbox="./media/shared/backup-configure-enabled.png":::

## Next steps  

* [Understand Azure NetApp Files backup](backup-introduction.md)
* [Requirements and considerations for Azure NetApp Files backup](backup-requirements-considerations.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Configure manual backups](backup-configure-manual.md)
* [Manage backup policies](backup-manage-policies.md)
* [Search backups](backup-search.md)
* [Restore a backup to a new volume](backup-restore-new-volume.md)
* [Delete backups of a volume](backup-delete.md)
* [Volume backup metrics](azure-netapp-files-metrics.md#volume-backup-metrics)
* [Azure NetApp Files backup FAQs](faq-backup.md)
