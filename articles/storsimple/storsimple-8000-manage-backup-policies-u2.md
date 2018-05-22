---
title: Manage StorSimple 8000 series backup policies | Microsoft Docs
description: Explains how you can use the StorSimple Device Manager service to create and manage manual backups, backup schedules, and backup retention on a StorSimple 8000 series device.
services: storsimple
documentationcenter: NA
author: alkohli
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 07/05/2017
ms.author: alkohli

---
# Use the StorSimple Device Manager service in Azure portal to manage backup policies


## Overview

This tutorial explains how to use the StorSimple Device Manager service **Backup policy** blade to control backup processes and backup retention for your StorSimple volumes. It also describes how to complete a manual backup.

When you back up a volume, you can choose to create a local snapshot or a cloud snapshot. If you are backing up a locally pinned volume, we recommend that you specify a cloud snapshot. Taking a large number of local snapshots of a locally pinned volume coupled with a data set that has a lot of churn will result in a situation in which you could rapidly run out of local space. If you choose to take local snapshots, we recommend that you take fewer daily snapshots to back up the most recent state, retain them for a day, and then delete them.

When you take a cloud snapshot of a locally pinned volume, you copy only the changed data to the cloud, where it is deduplicated and compressed.

## The Backup policy blade

The **Backup policy** blade for your StorSimple device allows you to manage backup policies and schedule local and cloud snapshots. Backup policies are used to configure backup schedules and backup retention for a collection of volumes. Backup policies enable you to take a snapshot of multiple volumes simultaneously. This means that the backups created by a backup policy will be crash-consistent copies.

The backup policies tabular listing also allows you to filter the existing backup policies by one or more of the following fields:

* **Policy name** – The name associated with the policy. The different types of policies include:

  * Scheduled policies, which are explicitly created by the user.
  * Imported policies, which were originally created in the StorSimple Snapshot Manager. These have a tag that describes the StorSimple Snapshot Manager host that the policies were imported from.

  > [!NOTE]
  > Automatic or default backup policies are no longer enabled at the time of volume creation.

* **Last successful backup** – The date and time of the last successful backup that was taken with this policy.

* **Next backup** – The date and time of the next scheduled backup that will be initiated by this policy.

* **Volumes** – The volumes associated with the policy. All the volumes associated with a backup policy are grouped together when backups are created.

* **Schedules** – The number of schedules associated with the backup policy.

The frequently used operations that you can perform for backup policies are:

* Add a backup policy
* Add or modify a schedule
* Add or remove a volume
* Delete a backup policy
* Take a manual backup

## Add a backup policy

Add a backup policy to automatically schedule your backups. When you first create a volume, there is no default backup policy associated with your volume. You need to add and assign a backup policy to protect volume data.

Perform the following steps in the Azure portal to add a backup policy for your StorSimple device. After you add the policy, you can define a schedule (see [Add or modify a schedule](#add-or-modify-a-schedule)).

[!INCLUDE [storsimple-8000-add-backup-policy-u2](../../includes/storsimple-8000-add-backup-policy-u2.md)]

## Add or modify a schedule

You can add or modify a schedule that is attached to an existing backup policy on your StorSimple device. Perform the following steps in the Azure portal to add or modify a schedule.

[!INCLUDE [storsimple-8000-add-modify-backup-schedule](../../includes/storsimple-8000-add-modify-backup-schedule-u2.md)]


## Add or remove a volume

You can add or remove a volume assigned to a backup policy on your StorSimple device. Perform the following steps in the Azure portal to add or remove a volume.

[!INCLUDE [storsimple-8000-add-volume-backup-policy-u2](../../includes/storsimple-8000-add-remove-volume-backup-policy-u2.md)]


## Delete a backup policy

Perform the following steps in the Azure portal to delete a backup policy on your StorSimple device.

[!INCLUDE [storsimple-8000-delete-backup-policy](../../includes/storsimple-8000-delete-backup-policy.md)]

## Take a manual backup

Perform the following steps in the Azure portal to create an on-demand (manual) backup for a single volume.

[!INCLUDE [storsimple-8000-create-manual-backup](../../includes/storsimple-8000-create-manual-backup.md)]

## Next steps

Learn more about [using the StorSimple Device Manager service to administer your StorSimple device](storsimple-8000-manager-service-administration.md).

