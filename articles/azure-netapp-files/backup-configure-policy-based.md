---
title: Configure policy-based backups for Azure NetApp Files | Microsoft Docs
description: Describes how to configure policy-based (scheduled) backups for Azure NetApp Files volumes. 
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
ms.date: 10/25/2023
ms.author: anfdocs
---
# Configure policy-based backups for Azure NetApp Files 

Azure NetApp Files backup supports *policy-based* (scheduled) backups and *manual* (on-demand) backups at the volume level. You can use both types of backups in the same volume. During the configuration process, you'll enable the backup feature for an Azure NetApp Files volume before policy-based backups or manual backups can be taken. 

This article shows you how to configure policy-based backups. For manual backup configuration, see [Configure manual backups](backup-configure-manual.md).  

> [!IMPORTANT]
> The Azure NetApp Files backup feature is currently in preview. You need to submit a waitlist request for accessing the feature through the **[Azure NetApp Files Backup Public Preview](https://aka.ms/anfbackuppreviewsignup)** page. Wait for an official confirmation email from the Azure NetApp Files team before using the Azure NetApp Files backup feature.

## About policy-based backups    

Backups are long-running operations. The system schedules backups based on the primary workload (which is given a higher priority) and runs backups in the background. Depending on the size of the volume being backed up, a backup can run in background for hours. There's no option to select the start time for backups. The service performs the backups based on the internal scheduling and optimization logic. 

Assigning a policy creates a baseline snapshot that is the current state of the volume and transfers the snapshot to Azure storage. This baseline snapshot is deleted automatically when the first scheduled backup is complete (based on the policy). If the backup policy is attached to a volume, the backup list will be empty until the baseline snapshot is transferred. When the backup is complete, the baseline backup entry appears in the list of backups for the volume. After the baseline transfer, the list will be updated daily based on the policy. An empty list of backups indicates that the baseline backup is in progress. If a volume already has existing manual backups before you assign a backup policy, the baseline snapshot isn't created. A baseline snapshot is created only when the volume has no prior backups.

[!INCLUDE [consideration regarding deleting backups after deleting resource or subscription](includes/disable-delete-backup.md)]

## Configure a backup policy

A backup policy enables a volume to be protected on a regularly scheduled interval. It does not require snapshot policies to be configured. Backup policies will continue the daily cadence based on the time of day when the backup policy is linked to the volume, using the time zone of the Azure region where the volume exists. Weekly schedules are preset to occur each Monday after the daily cadence.  Monthly schedules are preset to occur on the first day of each calendar month after the daily cadence. If backups are needed at a specific time/day, consider using [manual backups](backup-configure-manual.md). 

You need to create a backup policy and associate the backup policy to the volume that you want to back up. A single backup policy can be attached to multiple volumes. Backups can be temporarily suspended either by disabling the policy or by disabling backups at the volume level. Backups can also be completely disabled at the volume level, resulting in the clean-up of all the associated data in the Azure storage. A backup policy can't be deleted if it's attached to any volumes.

To enable a policy-based (scheduled) backup: 

1. Sign in to the Azure portal and navigate to **Azure NetApp Files**. 
2. Select your Azure NetApp Files account.
3. Select **Backups**. 

    <!-- :::image type="content" source="../media/azure-netapp-files/backup-navigate.png" alt-text="Screenshot that shows how to navigate to Backups option." lightbox="../media/azure-netapp-files/backup-navigate.png"::: -->

4. Select **Backup Policies**.
5. Select **Add**. 
6. In the **Backup Policy** page, specify the backup policy name.  Enter the number of backups that you want to keep for daily, weekly, and monthly backups. Select **Save**.      

    The minimum value for **Daily Backups to Keep** is 2. 

    :::image type="content" source="../media/azure-netapp-files/backup-policy-window-daily.png" alt-text="Screenshot that shows the Backup Policy window." lightbox="../media/azure-netapp-files/backup-policy-window-daily.png":::
 
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

## Enable backup functionality for a volume and assign a backup policy

Every Azure NetApp Files volume must have the backup functionality enabled before any backups (policy-based or manual) can be taken. 

After you enable the backup functionality, you need to assign a backup policy to a volume for policy-based backups to take effects. (For manual backups, a backup policy is optional.)

>[!NOTE]
>The active and most current snapshot is required for transferring the backup. As a result, you may see 1 extra snapshot beyond the number of snapshots to keep per the backup policy configuration. If your number of daily backups to keep is set to 2, you may see 3 snapshots related to the backup in the volumes the policy is applied to.

To enable the backup functionality for a volume:  

1. Go to **Volumes** and select the volume for which you want to enable backup.
2. Select **Configure**.
3. In the Configure Backups page, toggle the **Enabled** setting to **On**.
4. In the **Backup Policy** drop-down menu, assign the backup policy to use for the volume. Click **OK**.

    The Vault information is prepopulated.  

  :::image type="content" source="../media/azure-netapp-files/backup-configure-enabled.png" alt-text="Screenshot showing Configure Backups window." lightbox="../media/azure-netapp-files/backup-configure-enabled.png":::

## Next steps  

* [Understand Azure NetApp Files backup](backup-introduction.md)
* [Requirements and considerations for Azure NetApp Files backup](backup-requirements-considerations.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Configure manual backups](backup-configure-manual.md)
* [Manage backup policies](backup-manage-policies.md)
* [Search backups](backup-search.md)
* [Restore a backup to a new volume](backup-restore-new-volume.md)
* [Disable backup functionality for a volume](backup-disable.md)
* [Delete backups of a volume](backup-delete.md)
* [Volume backup metrics](azure-netapp-files-metrics.md#volume-backup-metrics)
* [Azure NetApp Files backup FAQs](faq-backup.md)
