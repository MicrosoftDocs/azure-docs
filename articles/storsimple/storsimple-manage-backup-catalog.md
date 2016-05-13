<properties 
   pageTitle="Manage your StorSimple backup catalog | Microsoft Azure"
   description="Explains how to use the StorSimple Manager service Backup Catalog page to list, select, and delete backup sets for a volume."
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
   ms.date="04/28/2016"
   ms.author="v-sharos" />

# Use the StorSimple Manager service to manage your backup catalog

## Overview

The StorSimple Manager service **Backup Catalog** page displays all the backup sets that are created when manual or scheduled backups are taken. You can use this page to list all the backups for a backup policy or a volume, select or delete backups, or use a backup to restore or clone a volume.

This tutorial explains how to list, select, and delete a backup set. To learn how to restore your device from backup, go to [Restore your device from a backup set](storsimple-restore-from-backup-set.md). To learn how to clone a volume, go to [Clone a StorSimple volume](storsimple-clone-volume.md).

![Backup catalog](./media/storsimple-manage-backup-catalog/backupcatalog.png) 

The **Backup Catalog** page provides a query to narrow your backup set selection. You can filter the backup sets that are retrieved, based on the following parameters:

- **Device** – The device on which the backup set was created.

- **Backup Policy or Volume** – The backup policy or volume associated with this backup set.

- **From and To** – The date and time range when the backup set was created.

The filtered backup sets are then tabulated based on the following attributes:

- **Name** – The name of the backup policy or volume associated with the backup set.

- **Size** – The actual size of the backup set.

- **Created On** – The date and time when the backups were created. 

- **Type** – Backup sets can be local snapshots or cloud snapshots. A local snapshot is a backup of all your volume data stored locally on the device, whereas a cloud snapshot refers to the backup of volume data residing in the cloud. Local snapshots provide faster access, whereas cloud snapshots are chosen for data resiliency.

- **Initiated By** – The backups can be initiated automatically by a schedule or manually by a user. You can use a backup policy to schedule backups. Alternatively, you can use the **Take backup** option to take a manual backup.

## List backup sets for a volume
 
Complete the following steps to list all the backups for a volume.

#### To list backup sets

1. On the StorSimple Manager service page, click the **Backup catalog** tab.

2. Filter the selections as follows:

    1. Select the appropriate device.

    2. In the drop-down list, choose a volume to view the corresponding the backups.

    3. Specify the time range.

    4. Click the check icon ![Check icon](./media/storsimple-manage-backup-catalog/HCS_CheckIcon.png) to execute this query.
 
    The backups associated with the selected volume should appear in the list of backup sets.

## Select a backup set

Complete the following steps to select a backup set for a volume or backup policy.

#### To select a backup set

1. On the StorSimple Manager service page, click the **Backup catalog** tab.

2. Filter the selections as follows:

    1. Select the appropriate device.

    2. In the drop-down list, choose the volume or backup policy for the backup that you wish to select.

    3. Specify the time range.

    4. Click the check icon ![Check icon](./media/storsimple-manage-backup-catalog/HCS_CheckIcon.png) to execute this query.

    The backups associated with the selected volume or backup policy should appear in the list of backup sets.

3. Select and expand a backup set. The **Restore** and **Delete** options are displayed at the bottom of the page. You can perform either of these actions on the backup set that you selected.

## Delete a backup set

Delete a backup when you no longer wish to retain the data associated with it. Perform the following steps to delete a backup set.

#### To delete a backup set

1. On the StorSimple Manager service page, click the **Backup Catalog tab**.

2. Filter the selections as follows:

    1. Select the appropriate device.

    2. In the drop-down list, choose the volume or backup policy for the backup that you wish to select.

    3. Specify the time range.

    4. Click the check icon ![Check icon](./media/storsimple-manage-backup-catalog/HCS_CheckIcon.png) to execute this query.

    The backups associated with the selected volume or backup policy should appear in the list of backup sets.

3. Select and expand a backup set. The **Restore** and **Delete** options are displayed at the bottom of the page. Click **Delete**.

4. You will be notified when the deletion is in progress and when it has successfully finished. After the deletion is done, refresh the query on this page. The deleted backup set will no longer appear in the list of backup sets.

## Next steps

- Learn how to [use the backup catalog to restore your device from a backup set](storsimple-restore-from-backup-set.md).

- Learn how to [use the StorSimple Manager service to administer your StorSimple device](storsimple-manager-service-administration.md).
