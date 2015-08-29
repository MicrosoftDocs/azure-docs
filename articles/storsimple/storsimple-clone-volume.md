<properties
   pageTitle="Clone your StorSimple volume | Microsoft Azure"
   description="Describes the different clone types and when to use them, and explains how you can use a backup set to clone an individual volume."
   services="storsimple"
   documentationCenter="NA"
   authors="alkohli"
   manager="carolz"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="08/27/2015"
   ms.author="alkohli" />

# Use the StorSimple Manager service to clone a volume

## Overview

The StorSimple Manager service **Backup Catalog** page displays all the backup sets that are created when manual or automated backups are taken. You can use this page to list all the backups for a backup policy or a volume, select or delete backups, or use a backup to restore or clone a volume.

  ![Backup catalog page](./media/storsimple-clone-volume/HCS_BackupCatalog.png)  

This tutorial describes how you can use a backup set to clone an individual volume. It also explains the difference between *transient* and *permanent* clones. 

## Create a clone of a volume

You can create a clone on the same device, another device, or even a virtual machine by using a local or a cloud snapshot.

## To clone a volume

1. On the StorSimple Manager service page, click the **Backup catalog** tab and select a backup set.

2. Expand the backup set to view the associated volumes. Click and select a volume from the backup set.

     ![Clone a volume](./media/storsimple-clone-volume/HCS_Clone.png) 

3. Click **Clone** to begin cloning the selected volume.

4. In the Clone Volume wizard, under **Specify name and location**:

  1. Identify a target device. This is the location where the clone will be created. You can choose the same device or specify another device. If you choose a volume associated with other cloud service providers (not Azure), the dropdown list for the target device will only show physical devices. You cannot clone a volume associated with other cloud service providers on to a virtual device.

        >  [AZURE.NOTE] Make sure that the capacity required for the clone is lower than the capacity available on the target device.
  2. Specify a unique volume name for your clone. The name must contain between 3 and 127 characters.
  3. Click the arrow icon ![arrow-icon](./media/storsimple-clone-volume/HCS_ArrowIcon.png)to proceed to the next page.

5. Under **Specify hosts that can use this volume**:

  1. Specify an access control record (ACR) for the clone. You can add a new ACR or choose from the existing list.
  2. Click the check icon ![check-icon](./media/storsimple-clone-volume/HCS_CheckIcon.png)to complete the operation.

6. A clone job will be initiated and you will be notified when the clone is successfully created. Click **View Job** to monitor the clone job on the **Jobs** page.

7. After the clone job is completed:

  1. Go to the **Devices** page, and select the **Volume Containers** tab. 
  2. Select the volume container that is associated with the source volume that you cloned. In the list of volumes, you should see the clone that was just created.

>[AZURE.NOTE] Monitoring and default backup are automatically disabled on a cloned volume.

A clone that is created this way is a transient clone. For more information about clone types, see [Transient vs. permanent clones](#transient-vs.-permanent-clones).

This clone is now a regular volume, and any operation that is possible on a volume will be available for the clone. You will need to configure this volume for any backups.

## Transient vs. permanent clones

You can clone a specific volume from a backup set. A clone created in this way is a *transient* clone. The transient clone will have references to the original volume and will use that volume to read while writing locally. This could result in slow performance, especially if the cloned volume is large.

After you take a cloud snapshot of a transient clone, the resulting clone will be a *permanent* clone. The permanent clone is independent and doesn’t have any references to the original volume that it was cloned from. For faster performance, we recommend that you create permanent clones. 

## Scenarios for transient and permanent clones

The following sections describe example situations in which transient and permanent clones can be used.

### Item-level recovery with a transient clone

You need to recover a one-year-old Microsoft PowerPoint presentation file. Your IT administrator identifies the specific backup from that time frame, and then filters the volume. The administrator then clones the volume, locates the file that you are looking for, and provides it to you. In this scenario, a transient clone is used. 
 
### Testing in the production environment with a permanent clone

You need to verify a testing bug in the production environment. You create a clone of the volume in the production environment. For increased performance, you need to take a cloud snapshot of this clone. The cloned volume is now independent, which results in faster performance. In this scenario, a permanent clone is used.

## Next steps
Learn how to [restore a StorSimple volume from a backup set](storsimple-restore-from-backup-set.md).


 