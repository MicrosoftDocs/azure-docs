---
title: Create a short-term clone from an Azure NetApp Files snapshot
description: Short-term clones are cloned volumes created from Azure NetApp Files snapshots intended for temporary use. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 06/10/2025
ms.author: anfdocs
---
# Create a short-term clone volume in Azure NetApp Files (preview)

A short-term clone volume is a writable and space-efficient copy of a volume that is created for temporary use, such as development, testing, data analytics, or digital forensics of large data sets. A short-term clone mitigates the need to create a regular clone, which consumes more of the capacity pool's quota. 

Short-term clone volumes are created from snapshots of existing Azure NetApp Files volumes and inherit the data in that base snapshot. Because the short-term clone is created from a snapshot, it consumes less quota. Only additional write operations count toward the clone's quota. 

With a short-term clone volume, you can create a clone of your original volume on a different capacity pool to utilize a different QoS level without being restrained by space restrictions in the source capacity pool. Additionally, short-term clones enable you to test a snapshot restore on a different capacity pool before [reverting to the original volume](snapshots-revert-volume.md). 

Short-term clones can be converted to regular volumes. By default, short-term clones convert to regular volumes after 32 days. 

## Considerations 

* If the capacity pool hosting the clone doesn't have enough space, the capacity pool automatically resizes to accommodate the clone. Resizing can incur additional charges. 
* If the capacity pool hosting the short-term clone is set to auto QoS, throughput is calculated based on the quota value you assign when creating the short-term clone. 
* When you convert a short-term clone to a regular volume, the size of the regular volume is calculated based on inherited size (the shared space between the short-term clone and its parent volume) plus short-term clone quota in bytes. This conversion has an impact on throughput. 
* There is no change in behavior for short-term clones in capacity pools with manual QoS.  
* Short term clones don't support the same operations as regular volumes. You can't create a snapshot, snapshot policy, backup, default user quota, or export policy with a short-term clone. 
    * If the parent volume has a snapshot policy, the policy isn't applied to the short-term clone.
* Short-term clones aren't supported on large volumes or volumes enabled for cool access.
* Short-term clones are supported for volumes in cross-zone and cross-region replication. To create a short-term clone of a DR volume, create a snapshot from the source then create the short-term clone from the destination volume. 
* A short-term clone is automatically converted to a regular volume in its designated capacity pool 32 days after the clone operation completes. To prevent this conversion, manually delete the short-term clone before 32 days have elapsed. 
    * Details about automatic conversion, including necessary capacity pool resizing, are sent to the volume's **Activity Log**. The Activity Log notifies you twice of impending automatic clone operations. The first notification is seven days before the conversion; the second notification occurs one day before the conversion. 
* You can't delete the parent volume of a short-term clone. You must first delete the clone or convert it to a regular volume, then you can delete the parent volume. 
* During the clone operation, the parent volume is accessible and you can capture new snapshots of the parent volume. 
* There's a limit of two clones per volume. You can increase this limit with a [support request](azure-netapp-files-resource-limits.md#request-limit-increase).
<!-- AVG qualifications? -->

## Register the feature

Short-term clones are currently in preview. To take advantage of the feature, you must first register it. 

1. Register the feature:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFShortTermClone
    ```
1. Registration for short term clones isn't automatic and may take up to a week. You can check on the registration status with the command: 

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFShortTermClone
    ```

    When the `RegistrationState` field output displays "Registered", you can proceed to create a short-term clone. 

<!-- waitlist? given that it is not automatic -->

## Create a short-term clone

>[!NOTE]
>To create a short-term clone on a data replication volume, you must first create a snapshot from the source volume. Once the snapshot has transferred to the destination, you can create the short-term clone _from_ the DR volume. 

1. Select **Snapshots**.
1. Right-click the snapshot you want to clone. Select **Create short-term clone from snapshot**.
1. Confirm you understand that the short-term clone automatically converts to a regular volume 32 days after the clone completes, which may incur costs due to a capacity pool automatically resizing. 
1. Complete the required fields in the **Create short term clone volume** menu:

	Provide a **Volume name**.
	Select a **Capacity pool**.
	Choose if you want to **Delete base snapshot** once the short-term clone is created. 
	Provide a **Quota** value.
    
    >[!NOTE]
    >The quota value is the space for anticipated writes to the clone. For example, some database workloads may require a 10 percent change to the existing data files. The minimum quota value is 100 GiB.

    Confirm if the short-term clone is a **Large volume** (greater than 100 TiB).

1. Select **Review and create**. <!-- time expectation -->
1. Confirm the short-term clone is created in the **Volume** menu. In the overview menu for the individual clone, you can confirm the volume type under the **Short-term clone volume** field and track the **Split clone volume progress.** You can also monitor activity on a short-term clone in the **Activity Log** for the volume. 
<!-- change in inheritzed size-->

## Convert a short-term clone to a volume

1. In the **Volume** menu, locate the short-term clone you want to convert.
1. Right-click the short-term clone. Select **Convert short-term clone to volume**.
1. Confirm the conversion is successful by checking the **Volume overview** page. When the **Short-term clone volume** field displays **No**, the conversion has succeeded. 

    >[!NOTE]
    >Short-term clones can fail to convert even when triggered automatically at the end of the 32 day period. The conversion can fail due to a capacity pool resize issue or a volume issue. Consult the Activity Log for more information. 

## Next steps

* [How Azure NetApp Files snapshots work](snapshots-introduction.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
