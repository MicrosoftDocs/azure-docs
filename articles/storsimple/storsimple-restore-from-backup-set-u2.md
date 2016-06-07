<properties 
   pageTitle="Restore a StorSimple volume from backup | Microsoft Azure"
   description="Explains how to use the StorSimple Manager service Backup Catalog page to restore a StorSimple volume from a backup set."
   services="storsimple"
   documentationCenter="NA"
   authors="SharS"
   manager="carmonm"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="04/26/2016"
   ms.author="v-sharos" />

# Restore a StorSimple volume from a backup set (Update 2)

[AZURE.INCLUDE [storsimple-version-selector-restore-from-backup](../../includes/storsimple-version-selector-restore-from-backup.md)]

## Overview

The **Backup Catalog** page displays all the backup sets that are created when manual or automated backups are taken. You can use this page to list all the backups for a backup policy or a volume, select or delete backups, or use a backup to restore or clone a volume.

 ![Backup Catalog page](./media/storsimple-restore-from-backup-set-u2/restore.png)

This tutorial explains how to use the **Backup Catalog** page to restore your device from a backup set.

You can restore a volume from a local or cloud backup. In either case, the restore operation brings the volume online immediately while data is downloaded in the background. 

Before you initiate a restore operation, you should be aware of the following:

- **You must take the volume offline** – Take the volume offline on both the host and the device before you initiate the restore operation. Although the restore operation automatically brings the volume online on the device, you must manually bring the device online on the host. You can bring the volume online on the host as soon as the volume is online on the device. (You do not need to wait until the restore operation is finished.) For procedures, go to [Take a volume offline](storsimple-manage-volumes-u2.md#take-a-volume-offline).

- **Volume type after restore** – Deleted volumes are restored based on the type in the snapshot; that is, volumes that were locally pinned are restored as locally pinned volumes and volumes that were tiered are restored as tiered volumes.

    For existing volumes, the current usage type of the volume overrides the type that is stored in the snapshot. For example, if you restore a volume from a snapshot that was taken when the volume type was tiered and that volume type is now locally pinned (due to a conversion operation that was performed), then the volume will be restored as a locally pinned volume. Similarly, if an existing locally pinned volume was expanded and subsequently restored from an older snapshot taken when the volume was smaller, the restored volume will retain the current expanded size.

    You cannot convert a volume from a tiered volume to a locally pinned volume or from a locally pinned volume to a tiered volume while the volume is being restored. Wait until the restore operation is finished, and then you can convert the volume to another type. For information about converting a volume, go to [Change the volume type](storsimple-manage-volumes-u2.md#change-the-volume-type). 

- **The volume size will be reflected in the restored volume** – This is an important consideration if you are restoring a locally pinned volume that has been deleted (because locally pinned volumes are fully provisioned). Make sure that you have sufficient space before you attempt to restore a locally pinned volume that was previously deleted. 

- **You cannot expand a volume while it is being restored** – Wait until the restore operation is finished before you attempt to expand the volume. For information about expanding a volume, go to [Modify a volume](storsimple-manage-volumes-u2.md#modify-a-volume).

- **You can perform a backup while you are restoring a local volume** – For procedures go to [Use the StorSimple Manager service to manage backup policies](storsimple-manage-backup-policies.md).

- **You can cancel a restore operation** – If you cancel the restore job, then the volume will be rolled back to the state that it was in before you initiated the restore operation. For procedures, go to [Cancel a job](storsimple-manage-jobs-u2.md#cancel-a-job).

## How to use the backup catalog

The **Backup Catalog** page provides a query that helps you to narrow your backup set selection. You can filter the backup sets that are retrieved based on the following parameters:

- **Device** – The device on which the backup set was created.
- **Backup policy** or **volume** – The backup policy or volume associated with this backup set.
- **From** and **To** – The date and time range when the backup set was created.

The filtered backup sets are then tabulated based on the following attributes:

- **Name** – The name of the backup policy or volume associated with the backup set.
- **Size** – The actual size of the backup set.
- **Created on** – The date and time when the backups were created. 
- **Type** – Backup sets can be local snapshots or cloud snapshots. A local snapshot is a backup of all your volume data stored locally on the device, whereas a cloud snapshot refers to the backup of volume data residing in the cloud. Local snapshots provide faster access, whereas cloud snapshots are chosen for data resiliency.
- **Initiated by** – The backups can be initiated automatically according to a schedule or manually by a user. (You can use a backup policy to schedule backups. Alternatively, you can use the **Take backup** option to take an interactive backup.)

## How to restore your StorSimple volume from a backup

You can use the **Backup Catalog** page to restore your StorSimple volume from a specific backup. Keep in mind, however, that restoring a volume will revert the volume to the state it was in when the backup was taken. Any data that was added after the backup operation will be lost.

> [AZURE.WARNING] Restoring from a backup will replace the existing volumes from the backup. This may cause the loss of any data that was written after the backup was taken.

### To restore your volume

1. On the StorSimple Manager service page, click the **Backup catalog** tab.

    ![Backup catalog](./media/storsimple-restore-from-backup-set-u2/restore.png)

2. Select a backup set as follows:
  1. Select the appropriate device.
  2. In the drop-down list, choose the volume or backup policy for the backup that you wish to select.
  3. Specify the time range.
  4. Click the check icon ![check icon](./media/storsimple-restore-from-backup-set-u2/HCS_CheckIcon.png) to execute this query.
 
    The backups associated with the selected volume or backup policy should appear in the list of backup sets.

3. Expand the backup set to view the associated volumes. These volumes must be taken offline on the host and device before you can restore them. Access the volumes on the **Volume Containers** page, and then follow the steps in [Take a volume offline](storsimple-manage-volumes-u2.md#take-a-volume-offline) to take them offline.

    > [AZURE.IMPORTANT] Make sure that you have taken the volumes offline on the host first, before you take the volumes offline on the device. If you do not take the volumes offline on the host, it could potentially lead to data corruption.

4. Navigate back to the **Backup Catalog** tab and select a backup set.

5. Click **Restore** at the bottom of the page.

6. You will be prompted for confirmation. Review the restore information, and then select the confirmation check box.

    ![Confirmation page](./media/storsimple-restore-from-backup-set-u2/ConfirmRestore.png)

7. Click the check icon ![check icon](./media/storsimple-restore-from-backup-set-u2/HCS_CheckIcon.png). This will initiate a restore job that you can view by accessing the **Jobs** page. 

8. After the restore is complete, you can verify that the contents of your volumes are replaced by volumes from the backup.

![Video available](./media/storsimple-restore-from-backup-set-u2/Video_icon.png) **Video available**

To watch a video that demonstrates how you can use the clone and restore features in StorSimple to recover deleted files, click [here](https://azure.microsoft.com/documentation/videos/storsimple-recover-deleted-files-with-storsimple/).

## If the restore fails

You will receive an alert if the restore operation fails for any reason. If this occurs, refresh the backup list to verify that the backup is still valid. If the backup is valid and you are restoring from the cloud, then connectivity issues might be causing the problem. 

To complete the restore operation, take the volume offline on the host and retry the restore operation. Note that any modifications to the volume data that were performed during the restore process will be lost.

## Next steps

- Learn how to [Manage StorSimple volumes](storsimple-manage-volumes-u2.md).

- Learn how to [use the StorSimple Manager service to administer your StorSimple device](storsimple-manager-service-administration.md).
