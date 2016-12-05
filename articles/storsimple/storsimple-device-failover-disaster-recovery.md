---
title: StorSimple failover and disaster recovery | Microsoft Docs
description: Learn how to fail over your StorSimple device to itself, another physical device, or a virtual device.
services: storsimple
documentationcenter: ''
author: alkohli
manager: carmonm
editor: ''

ms.assetid: 5751598e-49c8-42b3-8121-fea5857a7d83
ms.service: storsimple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/16/2016
ms.author: alkohli

---
# Failover and disaster recovery for your StorSimple device
## Overview
This tutorial describes the steps required to fail over a StorSimple device in the event of a disaster. A failover will allow you to migrate your data from a source device in the datacenter to another physical or even a virtual device located in the same or a different geographical location. 

Disaster recovery (DR) is orchestrated via the device failover feature and is initiated from the **Devices** page. This page tabulates all the StorSimple devices connected to your StorSimple Manager service. For each device, the friendly name, status, provisioned and maximum capacity, type and model are displayed.

![Devices page](./media/storsimple-device-failover-disaster-recovery/IC740972.png)

The guidance in this tutorial applies to StorSimple physical and virtual devices across all software versions.

## Disaster recovery (DR) and device failover
In a disaster recovery (DR) scenario, the primary device stops functioning. In this situation, you can move the cloud data associated with the failed device to another device by using the primary device as the *source* and specifying another device as the *target*. You can select one or more volume containers to migrate to the target device. This process is referred to as the *failover*. 

During the failover, the volume containers from the source device change ownership and are transferred to the target device. Once the volume containers change ownership, these are deleted from the source device. After the deletion is complete, the target device can then be failed back.

Typically following a DR, the most recent backup is used to restore the data to the target device. However, if there are multiple backup policies for the same volume, then the backup policy with the largest number of volumes gets picked and the most recent backup from that policy is used to restore the data on the target device.

As an example, if there are two backup policies (one default and one custom) *defaultPol*, *customPol* with the following details:

* *defaultPol* : One volume, *vol1*, runs daily starting at 10:30 PM.
* *customPol* : Four volumes, *vol1*, *vol2*, *vol3*, *vol4*, runs daily starting at 10:00 PM.

In this case, *customPol* will be used as it has more volumes and we prioritize for crash-consistency. The most recent backup from this policy is used to restore data.

## Considerations for device failover
In the event of a disaster, you may choose to fail over your StorSimple device:

* To a physical device 
* To itself
* To a virtual device

For any device failover, keep in mind the following:

* The prerequisites for DR are that all the volumes within the volume containers are offline and the volume containers have an associated cloud snapshot. 
* The available target devices for DR are devices that have sufficient space to accommodate the selected volume containers. 
* The devices that are connected to your service but do not meet the criteria of sufficient space will not be available as target devices.
* Following a DR, for a limited duration, the data access performance can be affected significantly, as the device will need to access the data from the cloud and store it locally.

#### Device failover across software versions
A StorSimple Manager service in a deployment may have multiple devices, both physical and virtual, all running different software versions. Depending upon the software version, the volume types on the devices may also be different. For instance, a device running Update 2 or higher would have locally pinned and tiered volumes (with archival being a subset of tiered). A pre-Update 2 device on the other hand may have tiered and archival volumes. 

Use the following table to determine if you can fail over to another device running a different software version and the behavior of volume types during DR.

| Fail over from | Allowed for physical device | Allowed for virtual device |
| --- | --- | --- |
| Update 2 to pre-Update 1 (Release, 0.1, 0.2, 0.3) |No |No |
| Update 2 to Update 1 (1, 1.1, 1.2) |Yes <br></br>If using locally pinned or tiered volumes or a mix of two, the volumes are always failed over as tiered. |Yes<br></br>If using locally pinned volumes, these are failed over as tiered. |
| Update 2 to Update 2 (later version) |Yes<br></br>If using locally pinned or tiered volumes or a mix of two, the volumes are always failed over as the starting volume type; tiered as tiered and locally pinned as locally pinned. |Yes<br></br>If using locally pinned volumes, these are failed over as tiered. |

#### Partial failover across software versions
Follow this guidance if you intend to perform a partial failover using a StorSimple source device running pre-Update 1 to a target running Update 1 or later. 

| Partial failover from | Allowed for physical device | Allowed for virtual device |
| --- | --- | --- |
| Pre-Update 1 (Release, 0.1, 0.2, 0.3) to Update 1 or later |Yes, see below for the best practice tip. |Yes, see below for the best practice tip. |

> [!TIP]
> There was a cloud metadata and data format change in Update 1 and later versions. Hence, we do not recommend a partial failover from pre-Update 1 to Update 1 or later versions. If you need to perform a partial failover, we recommend that you first apply Update 1 or later on both the devices (source and target) and then proceed with the failover. 
> 
> 

## Fail over to another physical device
Perform the following steps to restore your device to a target physical device.

1. Verify that the volume container you want to fail over has associated cloud snapshots.
2. On the **Devices** page, click the **Volume Containers** tab.
3. Select a volume container that you would like to fail over to another device. Click the volume container to display the list of volumes within this container. Select a volume and click **Take Offline** to take the volume offline. Repeat this process for all the volumes in the volume container.
4. Repeat the previous step for all the volume containers you would like to fail over to another device.
5. On the **Devices** page, click **Failover**.
6. In the wizard that opens up, under **Choose volume container to fail over**:
   
   1. In the list of volume containers, select the volume containers you would like to fail over.
      **Only the volume containers with associated cloud snapshots and offline volumes are displayed.**
   2. Under **Choose a target device** for the volumes in the selected containers, select a target device from the drop-down list of available devices. Only the devices that have the available capacity are displayed in the drop-down list.
   3. Finally, review all the failover settings under **Confirm failover**. Click the check icon ![Check icon](./media/storsimple-device-failover-disaster-recovery/IC740895.png).
7. A failover job is created that can be monitored via the **Jobs** page. If the volume container that you failed over has local volumes, then you will see individual restore jobs for each local volume (not for tiered volumes) in the container. These restore jobs may take quite some time to complete. It is likely that the failover job may complete earlier. Note that these volumes will have local guarantees only after the restore jobs are complete. After the failover is completed, go to the **Devices** page.                                            
   
   1. Select the device that was used as the target device for the failover process.
   2. Go to the **Volume Containers** page. All the volume containers, along with the volumes from the old device, should be listed.

## Failover using a single device
Perform the following steps if you only have a single device and need to perform a failover.

1. Take cloud snapshots of all the volumes in your device.
2. Reset your device to factory defaults. Follow the detailed instructions in [how to reset a StorSimple device to factory default settings](storsimple-manage-device-controller.md#reset-the-device-to-factory-default-settings).
3. Configure your device and register it again with your StorSimple Manager service.
4. On the **Devices** page, the old device should show as **Offline**. The newly registered device should show as **Online**.
5. For the new device, complete the minimum configuration of the device first. 
   
   > [!IMPORTANT]
   > **If the minimum configuration is not completed first, your DR will fail as a result of a bug in the current implementation. This behavior will be fixed in a later release.**
   > 
   > 
6. Select the old device (status offline) and click **Failover**. In the wizard that is presented, fail over this device and specify the target device as the newly registered device. For detailed instructions, refer to [Fail over to another physical device](#fail-over-to-another-physical-device).
7. A device restore job will be created that you can monitor from the **Jobs** page.
8. After the job has successfully completed, access the new device and navigate to the **Volume Containers** page. All the volume containers from the old device should now be migrated to the new device.

## Fail over to a StorSimple virtual device
You must have a StorSimple virtual device created and configured prior to running this procedure. If running Update 2, consider using an 8020 virtual device for the DR that has 64 TB and uses Premium Storage. 

Perform the following steps to restore the device to a target StorSimple virtual device.

1. Verify that the volume container you want to fail over has associated cloud snapshots.
2. On the **Devices** page, click the **Volume Containers** tab.
3. Select a volume container that you would like to fail over to another device. Click the volume container to display the list of volumes within this container. Select a volume and click **Take Offline** to take the volume offline. Repeat this process for all the volumes in the volume container.
4. Repeat the previous step for all the volume containers you would like to fail over to another device.
5. On the **Devices** page, click **Failover**.
6. In the wizard that opens up, under **Choose volume container to failover**, complete the following:
   
    a. In the list of volume containers, select the volume containers you would like to fail over.
   
    **Only the volume containers with associated cloud snapshots and offline volumes are displayed.**
   
    b. Under **Choose a target device for the volumes in the selected containers**, select the StorSimple virtual device from the drop-down list of available devices. **Only the devices that have sufficient capacity are displayed in the drop-down list.**  
7. Finally, review all the failover settings under **Confirm failover**. Click the check icon ![Check icon](./media/storsimple-device-failover-disaster-recovery/IC740895.png).
8. After the failover is completed, go to the **Devices** page.
   
    a. Select the StorSimple virtual device that was used as the target device for the failover process.
   
    b. Go to the **Volume Containers** page. All the volume containers, along with the volumes from the old device should now be listed.

![Video available](./media/storsimple-device-failover-disaster-recovery/Video_icon.png) **Video available**

To watch a video that demonstrates how you can restore a failed over physical device to a virtual device in the cloud, click [here](https://azure.microsoft.com/documentation/videos/storsimple-and-disaster-recovery/).

## Failback
For Update 3 and later versions, StorSimple also supports failback. After the failover is complete, the following actions occur:

* The volume containers that are failed over are cleaned from the source device.
* A background job per volume container (failed over) is initiated on the source device. If you attempt to failback while the job is in progress, you will recieve a notification to that effect. You will need to wait until the job is complete to start the failback. 
  
    The time to complete the deletion of volume containers is dependent on various factors such as amount of data, age of the data, number of backups, and the network bandwidth available for the operation. If you are planning test failovers/failbacks, we recommend that you test volume containers with less data (Gbs). In most cases, you can start the failback 24 hours after the failover is complete. 

## Frequently asked questions
Q. **What happens if the DR fails or has partial success?**

A. If the DR fails, we recommend that you try agian. The second time around, DR knows what all was done and when the process stalled the first time. The DR process starts from that point onwards. 

Q. **Can I delete a device while the device failover is in progress?**

A. You cannot delete a device while a DR is in progress. You can only delete your device after the DR is complete.

Q.    **When does the garbage collection start on the source device so that the local data on source device is deleted?**

A. Garbage collection will be enabled on the source device only after the device is completely cleaned up. The cleanup includes cleaning up objects that have failed over from the source device such as volumes, backup objects (not data), volume containers, and policies.

Q. **What happens if the delete job associated with the volume containers in the source device fails?**

A.  If the delete job fails, then you will need to manually trigger the deletion of the volume containers. In the **Devices** page, select your source device and click **Volume containers**. Select the volume containers that you failed over and in the bottom of the page, click **Delete**. Once you have deleted all the failed over volume containers on the source device, you can start the failback.

## Business continuity disaster recovery (BCDR)
A business continuity disaster recovery (BCDR) scenario occurs when the entire Azure datacenter stops functioning. This can affect your StorSimple Manager service and the associated StorSimple devices.

If there are StorSimple devices that were registered just before a disaster occurred, then these StorSimple devices may need to undergo a factory reset. After the disaster, the StorSimple device will be shown as offline. The StorSimple device must be deleted from the portal, and a factory reset should be done, followed by a fresh registration.

## Next steps
* After you have performed a failover, you may need to [deactivate or delete your StorSimple device](storsimple-deactivate-and-delete-device.md).
* For information about how to use the StorSimple Manager service, go to [Use the StorSimple Manager service to administer your StorSimple device](storsimple-manager-service-administration.md).

