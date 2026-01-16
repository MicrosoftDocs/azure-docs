---
title: Create a short-term clone volume in Azure NetApp Files
description: Short-term clones are cloned volumes created from Azure NetApp Files snapshots intended for temporary use. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 01/08/2026
ms.author: anfdocs
---
# Create a short-term clone volume in Azure NetApp Files 

A short-term clone volume is a writable and space-efficient copy of a volume that is created for temporary use, such as development, testing, data analytics, or digital forensics of large data sets. A short-term clone can be an alternative to creating a full copy by [restoring a snapshot to a new volume](snapshots-restore-new-volume.md) which consumes more of the capacity pool's quota. 

Short-term clone volumes are created from snapshots of existing Azure NetApp Files volumes and inherit the data in that base snapshot. Because the short-term clone references an existing snapshot, the short-term clone volume's quota is used to accommodate write operations to the data set. It can be as small as the minimum Azure NetApp Files volume size but should be sized based on the changes to the data.

With a short-term clone volume, you can create a clone of your original volume on a different capacity pool to utilize a different QoS level without being restrained by space restrictions in the source capacity pool. Additionally, short-term clones enable you to test a snapshot restore on a different capacity pool before [reverting to the original volume](snapshots-revert-volume.md). 

By default, short-term clones convert to regular volumes after 32 days.

## Considerations 

* Short-term clone volumes are supported with the [Flexible, Standard, Premium, and Ultra service levels](azure-netapp-files-service-levels.md).
    * You can create a short-term clone in a capacity pool with a different service level than that of the source volume's snapshot. 
* Short-term clone volume size contributes to capacity pool quota like any other volume.
* If the capacity pool hosting the short-term clone is set to auto QoS, throughput is calculated based on the quota value (volume size) you assign when creating the short-term clone. For a short-term clone in capacity pools with manual QoS, throughput is assigned when creating the short-term clone.
* Snapshot policies, backup, replication, and default user quota are not available with short-term clone.
    * If the parent volume has a backup or snapshot policy, the policy isn't applied to the short-term clone.
* Short-term clones aren't supported on large volumes or on volumes enabled for cool access.
* Short-term clones are supported for volumes in cross-zone and cross-region replication. To create a short-term clone of a disaster recovery (DR) volume, create a snapshot from the source then create the short-term clone from the destination volume. 
* A short-term clone is automatically converted to a regular volume in its designated capacity pool 32 days after the clone operation completes. To prevent this conversion, manually delete the short-term clone before 32 days have elapsed. 
    * Details about automatic conversion, including necessary capacity pool resizing, are sent to the volume's **Activity Log**. The Activity Log notifies you twice of impending conversions. The first notification is seven days before the conversion; the second notification is one day before the conversion. 
* If the capacity pool hosting the clone doesn't have enough space, the capacity pool automatically resizes in 1-TiB increments to accommodate the volume. A resized capacity pool incurs higher charges. 
* When you convert a short-term clone to a regular volume, the size of the regular volume is calculated based on inherited size (the shared space between the short-term clone and its parent volume) and the short-term clone's quota in bytes. This conversion has an impact on throughput. For short-term clones in capacity pools with manual QoS, throughput doesn't change after conversion to regular volume.
* If a short-term clone exists on a volume, you can't delete the parent volume. You must first delete the clone or convert it to a regular volume, then you can delete the parent volume. 
* During the clone operation, the parent volume is accessible; you can capture new snapshots of the parent volume. 
* You can create five short-term clones per regular volume.

## Create a short-term clone

>[!NOTE]
>To create a short-term clone on a data replication (DR) volume, you must first create a snapshot from the source volume. Once the snapshot has transferred to the destination, you can create the short-term clone from the DR volume. 

1. Select **Snapshots**.
1. Right-click the snapshot you want to clone. Select **Create short-term clone from snapshot**.
1. Confirm you understand that the short-term clone automatically converts to a regular volume 32 days after the clone completes, which may incur costs due to a capacity pool automatically resizing. 
1. Complete the required fields in the **Create short-term clone volume** menu:

	Provide a **Volume name**.
	Select a **Capacity pool**.
	Provide a **Quota** value.

    >[!NOTE]
    >Deleting the base snapshot is not available for short-term clone volumes. The option is greyed out in the portal as the base snapshot is shared with the original source volume. The base snapshot can only be deleted if the short-term clone volume is converted to a regular volume.
    
    >[!NOTE]
    >The quota value is the space for anticipated writes to the short-term clone volume. For example, some database workloads may require a 10 percent change to the existing data files. The minimum quota value is 50 GiB.

1. Select **Review and create**.
1. Confirm the short-term clone is created in the **Volume** menu. In the overview menu for the individual clone, you can confirm the volume type under the **Short-term clone volume** field and track the **Split clone volume progress.** You can also monitor activity on a short-term clone in the **Activity Log** for the volume. 

## Convert a short-term clone to a volume

1. In the **Volume** menu, locate the short-term clone you want to convert.
1. Right-click the short-term clone. Select **Convert short-term clone to volume**.
1. Confirm the conversion is successful by checking the **Volume overview** page. When the **Short-term clone volume** field displays **No**, the conversion has succeeded. 

>[!NOTE]
>Short-term clones can fail to convert even when triggered automatically at the end of the 32 day period. The conversion can fail due to a capacity pool resize issue or a volume issue. Consult the Activity Log for more information. 

## Next steps

* [How Azure NetApp Files snapshots work](snapshots-introduction.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
