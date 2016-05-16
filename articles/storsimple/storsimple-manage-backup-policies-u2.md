<properties 
   pageTitle="Manage your StorSimple backup policies | Microsoft Azure"
   description="Explains how you can use the StorSimple Manager service to create and manage manual backups, backup schedules, and backup retention."
   services="storsimple"
   documentationCenter="NA"
   authors="SharS"
   manager="carmonm"
   editor=""/>
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="05/10/2016"
   ms.author="v-sharos"/>

# Use the StorSimple Manager service to manage backup policies (Update 2)

[AZURE.INCLUDE [storsimple-version-selector-manage-backup-policies](../../includes/storsimple-version-selector-manage-backup-policies.md)]

## Overview

This tutorial explains how to use the StorSimple Manager service **Backup Policies** page to control backup processes and backup retention for your StorSimple volumes. It also describes how to complete a manual backup.

When you back up a volume, you can choose to create a local snapshot or a cloud snapshot. If you are backing up a locally pinned volume, we recommend that you specify a cloud snapshot. Taking a large number of local snapshots of a locally pinned volume coupled with a data set that has a lot of churn will result in a situation in which you could rapidly run out of local space. If you choose to take local snapshots, we recommend that you take fewer daily snapshots to back up the most recent state, retain them for a day, and then delete them.

When you take a cloud snapshot of a locally pinned volume, you copy only the changed data to the cloud, where it is deduplicated and compressed. 

## The Backup Policies page

The **Backup Policies** page allows you to manage backup policies and schedule local and cloud snapshots. (Backup policies are used to configure backup schedules and backup retention for a collection of volumes.) Backup policies enable you to take a snapshot of multiple volumes simultaneously. This means that the backups created by a backup policy will be crash-consistent copies. The **Backup Policies** page lists the backup policies, their types, the associated volumes, the number of backups retained, and the option to enable these policies.

The **Backup Policies** page also allows you to filter the existing backup policies by one or more of the following fields:

- **Policy name** – The name associated with the policy. The different types of policies include:

   - Scheduled policies, which are explicitly created by the user.
   - Automatic policies, which are created when the default backup for this volume option was enabled at the time of volume creation. These policies are named as *VolumeName*_Default where *VolumeName* refers to the name of the StorSimple volume configured by the user in the Azure classic portal. The automatic policies result in daily cloud snapshots beginning at 22:30 device time.
   - Imported policies, which were originally created in the StorSimple Snapshot Manager. These have a tag that describes the StorSimple Snapshot Manager host that the policies were imported from.

- **Volumes** – The volumes associated with the policy. All the volumes associated with a backup policy are grouped together when backups are created.

- **Last successful backup** – The date and time of the last successful backup that was taken with this policy.

- **Next backup** – The date and time of the next scheduled backup that will be initiated by this policy.

- **Schedules** – The number of schedules associated with the backup policy.

The frequently used operations that you can perform from this page are:

- Add a backup policy 
- Add or modify a schedule 
- Delete a backup policy 
- Take a manual backup 
- Create a custom backup policy with multiple volumes and schedules 

## Add a backup policy

Add a backup policy to automatically schedule your backups. Perform the following steps in the Azure classic portal to add a backup policy for your StorSimple device. After you add the policy, you can define a schedule (see [Add or modify a schedule](#add-or-modify-a-schedule)).

[AZURE.INCLUDE [storsimple-add-backup-policy-u2](../../includes/storsimple-add-backup-policy-u2.md)]

![Video available](./media/storsimple-manage-backup-policies-u2/Video_icon.png) **Video available**

To watch a video that demonstrates how to create a local or cloud backup policy, click [here](https://azure.microsoft.com/documentation/videos/create-storsimple-backup-policies/).


## Add or modify a schedule

You can add or modify a schedule that is attached to an existing backup policy on your StorSimple device. Perform the following steps in the Azure classic portal to add or modify a schedule.

[AZURE.INCLUDE [storsimple-add-modify-backup-schedule](../../includes/storsimple-add-modify-backup-schedule-u2.md)]

## Delete a backup policy

Perform the following steps in the Azure classic portal to delete a backup policy on your StorSimple device.

[AZURE.INCLUDE [storsimple-delete-backup-policy](../../includes/storsimple-delete-backup-policy.md)]


## Take a manual backup

Perform the following steps in the Azure classic portal to create an on-demand (manual) backup for a single volume.

[AZURE.INCLUDE [storsimple-create-manual-backup](../../includes/storsimple-create-manual-backup.md)]

## Create a custom backup policy with multiple volumes and schedules

Perform the following steps in the Azure classic portal to create a custom backup policy that has multiple volumes and schedules.

[AZURE.INCLUDE [storsimple-create-custom-backup-policy](../../includes/storsimple-create-custom-backup-policy-u2.md)]


## Next steps

Learn more about [using the StorSimple Manager service to administer your StorSimple device](storsimple-manager-service-administration.md).
