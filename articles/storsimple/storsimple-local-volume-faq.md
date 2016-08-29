<properties 
   pageTitle="StorSimple locally pinned volumes FAQ|Microsoft Azure"
   description="Provides answers to frequently asked questions about StorSimple locally pinned volumes."
   services="storsimple"
   documentationCenter="NA"
   authors="manuaery"
   manager="syadav"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/26/2016"
   ms.author="manuaery" />

# StorSimple locally pinned volumes: frequently asked questions (FAQ)

## Overview

The following are questions and answers that you might have when you create a StorSimple locally pinned volume, convert a tiered volume to a locally pinned volume (and vice versa), or back up and restore a locally pinned volume.

Questions and answers are arranged into the following categories

- Creating a locally pinned volume
- Backing up a locally pinned
- Converting a tiered volume to a locally pinned volume
- Restoring a locally pinned volume
- Failing over a locally pinned volume

## Questions about creating a locally pinned volume

**Q.** What is the maximum size of a locally pinned volume that I can create on the 8000 series devices?

**A** You can provision locally pinned volumes up to 8 TB or tiered volumes up to 200 TB on the 8100 device. On the larger 8600 device, you can provision locally pinned volumes up to 20 TB or tiered volumes up to 500 TB.

**Q.** I recently upgraded my 8100 device to Update 2 and when I try to create a locally pinned volume, the maximum available size is only 6 TB and not 8 TB. Why can’t I create a 8 TB volume?

**A** You can provision locally pinned volumes up to 8 TB OR tiered volumes up to 200 TB on the 8100 device. If your device already has tiered volumes, then the space available for creating a locally pinned volume will be proportionally lower than this maximum limit. For example, if 100 TB of tiered volumes have already been provisioned on your 8100 device (which is half of the tiered capacity), then the maximum size of a local volume that you can create on the 8100 device will  be correspondingly reduced to 4 TB (half of the maximum locally pinned volume capacity).

Because some local space on the device is used to host the working set of tiered volumes, the available space for creating a locally pinned volume will be reduced if the device has tiered volumes. Conversely, creating a locally pinned volume will proportionally reduce the available space for tiered volumes. The following table summarizes the available tiered capacity on the 8100 and 8600 devices when locally pinned volumes are created.

|Locally pinned volumes provisioned capacity|Available capacity to be provisioned for tiered volumes - 8100|Available capacity to be provisioned for tiered volumes - 8600|
|-----|------|------|
|0 | 200 TB | 500 TB |
|1 TB | 175 TB | 475 TB|
|4 TB | 100 TB | 400 TB |
|8 TB | 0 TB | 300 TB|
|10 TB | NA | 250 TB |
|15 TB | NA	| 125 TB |
|20 TB | NA | 0 TB |


**Q.** Why is locally pinned volume creation a long running operation? 

**A.** Locally pinned volumes are thickly provisioned. To create space on the local tiers of the device, some data from existing tiered volumes might be pushed to the cloud during the provisioning process. And since this depends upon the size of the volume being provisioned, the existing data on your device and the available bandwidth to the cloud, the time taken to create a local volume may be several hours.

**Q.** How long does it take to create a locally pinned volume?

**A.** Because locally pinned volumes are thickly provisioned, some existing data from tiered volumes might be pushed to the cloud during the provisioning process. Therefore, the time taken to create a locally pinned volume depends upon multiple factors, including the size of the volume, the data on your device and the available bandwidth. On a freshly installed device that has no volumes, the time to create a locally pinned volume is about 10 minutes per terabyte of data. However, creation of local volumes may take several hours based on the factors explained above on a device that is in use.

**Q.** I want to create a locally pinned volume. Are there any best practices I need to be aware of?

**A.** Locally pinned volumes are suitable for workloads that require local guarantees of data at all times and are sensitive to cloud latencies. While considering usage of local volumes for any of your workloads, please be aware of the following:

- Locally pinned volumes are thickly provisioned, and creating local volumes will impact the available space for tiered volumes. Therefore, we suggest you start with smaller-sized volumes and scale up as your storage requirement increases.

- Provisioning of local volumes is a long running operation that might involve pushing existing data from tiered volumes to the cloud. As a result, you may experience reduced performance on these volumes.

- Provisioning of local volumes is a time consuming operation. The actual time involved depends on multiple factors: the size of the volume being provisioned, data on your device, and available bandwidth. If you have not backed up your existing volumes to the cloud, then volume creation will be slower. We suggest you take cloud snapshots of your existing volumes before you provision a local volume.
 
- You can convert existing tiered volumes to locally pinned volumes, and this conversion involves provisioning of space on the device for the resulting locally  pinned volume (in addition to bringing down tiered data [if any] from the cloud). Again, this is a long running operation that depends on factors we’ve discussed above. We suggest that you back up your existing volumes prior to conversion as the process will be even slower if existing volumes are not backed up. Your device might also experience reduced performance during this process.
	
More information on how to [create a locally pinned volume](storsimple-manage-volumes-u2.md#add-a-volume)

**Q.** Can I create multiple locally pinned volumes at the same time?

**A.** Yes, but any locally pinned volume creation and expansion jobs will be processed sequentially.

Locally pinned volumes are thickly provisioned and this requires creation of local space on the device (which might result in existing data from tiered volumes to be pushed to the cloud during the provisioning process). Therefore, if a provisioning job is in progress, other local volume creation jobs will be queued until that job is finished.

Similarly, if an existing local volume is being expanded or a tiered volume is being converted to a locally pinned volume, then the creation of a new locally pinned volume will be queued until the previous job is completed. Expanding the size of a locally pinned volume involves the expansion of the existing local space for that volume. Conversion from a tiered to locally pinned volume also involves the creation of local space for the resulting locally pinned volume. In both of these operations, creation or expansion of local space is a long running job.

You can view these jobs in the **Jobs** page of the Azure StorSimple Manager service. The job that is actively being processed will be continually updated to reflect the progress of space provisioning. The remaining locally pinned volume jobs will be marked as running, but their progress will be stalled and they will be picked in the order they were queued.

**Q.** I deleted a locally pinned volume. Why don't I see the reclaimed space reflected in the available space when I try to create a new volume? 

**A.** If you delete a locally pinned volume, the space available for new volumes may not be updated immediately. The StorSimple Manager Service updates the local space available approximately every hour. We suggest you wait for an hour before you try to create the new volume.

**Q.** Are locally pinned volumes supported on the cloud appliance?

**A.** Locally pinned volumes are not supported on the cloud appliance (8010 and 8020 devices formerly referred to as the StorSimple virtual device).

**Q.** Can I use the Azure PowerShell cmdlets to create and manage locally pinned volumes? 

**A.** No, you cannot create locally pinned volumes via Azure PowerShell cmdlets (any volume you create via Azure PowerShell will be tiered). We also suggest that you do not use the Azure PowerShell cmdlets to modify any properties of a locally pinned volume, as it will have the undesired effect of modifying the volume type to tiered.

## Questions about backing up a locally pinned volume

**Q.** Are local snapshots of locally pinned volumes supported?

**A.** Yes, you can take local snapshots of your locally pinned volumes. However, we strongly suggest that you regularly back up your locally pinned volumes with cloud snapshots to ensure that your data is protected in the eventuality of a disaster.

**Q.** Are there any guidelines for managing local snapshots for locally pinned volumes?

**A.** Frequent local snapshots alongside a high rate of data churn in the locally pinned volume might cause local space on the device to be consumed quickly and result in data from tiered volumes being pushed to the cloud. We therefore suggest you minimize the number of local snapshots.

**Q.** I received an alert stating that my local snapshots of locally pinned volumes might be invalidated. When can this happen?

**A.** Frequent local snapshots alongside a high rate of data churn in the locally pinned volume might cause local space on the device to be consumed quickly. If the local tiers of the device are heavily used, an extended cloud outage might result in the device becoming full, and incoming writes to the volume might result in invalidation of the snapshots (as no space exists to update the snapshots to refer to the older blocks of data that have been overwritten). In such a situation the writes to the volume will continue to be served, but the local snapshots might be invalid. There is no impact to your existing cloud snapshots.

The alert warning is to notify you that such a situation can arise and ensure you address the same in a timely manner by either reviewing your local snapshots schedules to take less frequent local snapshots or deleting older local snapshots that are no longer required.

If the local snapshots are invalidated, you will receive an information alert notifying you that the local snapshots for the specific backup policy have been invalidated alongside the list of timestamps of the local snapshots that were invalidated. These snapshots will be auto-deleted and you will no longer be able to view them in the **Backup Catalogs** page in the Azure classic portal.

## Questions about converting a tiered volume to a locally pinned volume

**Q.** I’m observing some slowness on the device while converting a tiered volume to a locally pinned volume. Why is this happening? 

**A.** The conversion process involves two steps: 

  1. Provisioning of space on the device for the soon-to-be-converted locally pinned volume.
  2. Downloading any tiered data from the cloud to ensure local guarantees. 

Both of these steps are long running operations that are dependent on the size of the volume being converted, data on the device, and available bandwidth. As some data from existing tiered volumes might spill to the cloud as part of the provisioning process, your device might experience reduced performance during this time. In addition, the conversion process can be slower if:

- Existing volumes have not been backed up to the cloud; so we suggest you backup your volumes prior to initiating a conversion.

- Bandwidth throttling policies have been applied, which might constrain the available bandwidth to the cloud; we therefore recommend you have a dedicated 40 Mbps or more connection to the cloud.

- The conversion process can take several hours due to the multiple factors explained above; therefore, we suggest that you perform this operation during non-peaks times or on a weekend to avoid the impact on end consumers.

More information on how to [convert a tiered volume to a locally pinned volume](storsimple-manage-volumes-u2.md#change-the-volume-type)

**Q.** Can I cancel the volume conversion operation? 

**A.** No, you cannot the cancel the conversion operation once initiated. As discussed in the previous question, please be aware of the potential performance issues that you might encounter during the process, and follow the best practices listed above when you plan your conversion.

**Q.** What happens to my volume if the conversion operation fails?

**A.** Volume conversion can fail due to cloud connectivity issues. The device may eventually stop the conversion process after a series of unsuccessful attempts to bring down tiered data from the cloud. In such a scenario, the volume type will continue to be the source volume type prior to conversion, and:

- A critical alert will be raised to notify you of the volume conversion failure. More information on [alerts related to locally pinned volumes](storsimple-manage-alerts.md#locally-pinned-volume-alerts)

- If you are converting a tiered to a locally pinned volume, the volume will continue to exhibit properties of a tiered volume as data might still reside on the cloud. We suggest that you resolve the connectivity issues and then retry the conversion operation.
 
- Similarly, when conversion from a locally pinned to a tiered volume fails, although the volume will be marked as a locally pinned volume, it will function as a tiered volume (because data could have spilled to the cloud). However, it will continue to occupy space on the local tiers of the device. This space will not be available for other locally pinned volumes. We suggest that you retry this operation to ensure that the volume conversion is complete and the local space on the device can be reclaimed.

## Questions about restoring a locally pinned volume

**Q.** Are locally pinned volumes restored instantly?

**A.** Yes, locally pinned volumes are restored instantly. As soon as the metadata information for the volume is pulled from the cloud as part of the restore operation, the volume is brought online and can be accessed by the host. However, local guarantees for the volume data will not be present until all the data has been downloaded from the cloud, and you may experience reduced performance on these volumes for the duration of the restore.

**Q.** How long does it take to restore a locally pinned volume?

**A.** Locally pinned volumes are restored instantly and brought online as soon as the volume metadata information is retrieved from the cloud, while the volume data continues to be downloaded in the background. This latter part of the restore operation--getting back the local guarantees for the volume data--is a long running operation and might take several hours for all the data to be made local again. The time taken to complete the same depends on on multiple factors, such as the size of the volume being restored and the available bandwidth. If the original volume that is being restored has been deleted, additional time will be taken to create the local space on the device as part of the restore operation.

**Q.** I need to restore my existing locally pinned volume to an older snapshot (taken when the volume was tiered). Will the volume be restored as tiered in this case?

**A.** No, the volume will be restored as a locally pinned volume. Although the snapshot dates to the time when the volume was tiered, while restoring existing volumes, StorSimple always uses the type of volume on the disk as it exists currently.

**Q.** I extended my locally pinned volume recently, but I now need to restore the data to a time when the volume was smaller in size. Will restore resize the current volume and will I need to extend the size of the volume once the restore is completed?

**A.** Yes, the restore will resize the volume, and you will need to extend the size of the volume after the restore is completed.

**Q.** Can I change the type of a volume during restore?

**A.**No, you cannot change the volume type during restore.

- Volumes that have been deleted are restored as the type stored in the snapshot.

- Existing volumes are restored based on their current type, irrespective of the type stored in the snapshot (refer to the previous two questions).
 
**Q.** I need to restore my locally pinned volume, but I picked an incorrect point in time snapshot. Can I cancel the current restore operation?

**A.** Yes, you can cancel an on-going restore operation. The state of the volume will be rolled back to the state at the start of the restore. However, any writes that were made to the volume while the restore was in progress will be lost.

**Q.** I started a restore operation on one of my locally pinned volumes, and now I see a snapshot in my backlog catalog that I don't recollect creating. What is this used for?

**A.** This is the temporary snapshot that is created prior to the restore operation and is used for rollback in case the restore is canceled or fails. Do not delete this snapshot; it will be automatically deleted when the restore is complete. This behavior can occur if your restore job has only locally pinned volumes or a mix of locally pinned and tiered volumes. If the restore job includes only tiered volumes, then this behavior will not occur.

**Q.** Can I clone a locally pinned volume?

**A.** Yes, you can. However, the locally pinned volume will be cloned as a tiered volume by default. More information on how to [clone a  locally pinned volume](storsimple-clone-volume-u2.md)

## Questions about failing over a locally pinned volume

**Q.** I need to fail over my device to another physical device. Will my locally pinned volumes be failed over as locally pinned or tiered?

**A.** Depending on the software version of the target device, locally pinned volumes will be failed over as:

- Locally pinned if the target device is running StorSimple 8000 series update 2
- Tiered if the target device is running StorSimple 8000 series update 1.x
- Tiered if the target device is the cloud appliance (software version update 2 or update 1.x)

More information on [failover and DR of locally pinned volumes across versions](storsimple-device-failover-disaster-recovery.md#device-failover-across-software-versions)

**Q.** Are locally pinned volumes instantly restored during disaster recovery (DR)?

**A.** Yes, locally pinned volumes are restored instantly during failover. As soon as the metadata information for the volume is pulled from the cloud as part of the failover operation, the volume is brought online on the target device and can be accessed by the host. Meanwhile, the volume data will continue to download in the background, and you may experience reduced performance on these volumes for the duration of the failover.

**Q.** I see the failover job completed, how can I track the progress of locally pinned volume that is being restored on the target device?

**A.** During a failover operation, the failover job is marked as complete once all the volumes in the failover set have been instantly restored and brought online on the target device. This includes any locally pinned volumes that might have been failed over; however, local guarantees of the data will only be available when all the data for the volume has been downloaded. You can track this progress for each locally pinned volume that was failed over by monitoring the corresponding restore jobs that are created as part of the failover. These individual restore jobs will only be created for locally pinned volumes.

**Q.** Can I change the type of a volume during failover?

**A.** No, you cannot change the volume type during a failover. If you are failing over to another physical device that is running StorSimple 8000 series update 2, the volumes will be failed over based on the volume type stored in the snapshot. When failing over to any other device version, refer to the question above on the volume type after a failover.

**Q.** Can I fail over a volume container with locally pinned volumes to the cloud appliance?

**A.** Yes, you can. The locally pinned volumes will be failed over as tiered volumes. More information on [failover and DR of locally pinned volumes across versions](storsimple-device-failover-disaster-recovery.md#considerations-for-device-failover)


