---
title: Create a short-term clone from an Azure NetApp File snapshot| Microsoft Learn
description: Short-term clones are cloned volumes created from Azure NetApp Files snapshots intended for temporary use. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 05/20/2023
ms.author: anfdocs
---
# Create a short-term clone from an Azure NetApp File snapshot (preview)

Short-term clones are cloned volumes created from Azure NetApp Files snapshots intended for temporary use. Short-term clones are writable and space efficient, sharing data blocks with the parent volume for common data thus limiting the amount of storage consumption. 

With a short-term clone, you can create a clone of your original volume on a different capacity pool to utilize a different QoS level without being restrained by space restrictions in the source capacity pool. Additionally, short-term clones enable you to test a snapshot restore on a different capacity pool before [reverting to the original volume](snapshots-revert-volume.md). 

Short-term clones can be converted to regular volumes. 

## Considerations 

* If the capacity pool hosting the clone does not have enough space, the capacity pool automatically resizes to accommodate the clone. 
* Short term clones do not support the same operations as regular volumes. You cannot create a snapshot, snapshot policy, backup, default user quota, or export policy on a short-term clone. 
    * If the parent volume has a snapshot policy, the policy is not applied to the short-term clone.
* A short-term clone is automatically converted to a regular volume in its designated capacity pool 28 days after the clone operation completes. To prevent this conversion, manually delete the short-term clone before 28 days have elapsed. 
* You cannot delete the parent volume of a short-term clone. You must first delete the clone or convert it to a regular volume, then you can delete the parent volume. 
* You cannot migrate an SVM that contains a short-term clone, nor can you initiate a short-term clone operation during an active SVM migration. 
* There is a limit of two clones per volume. You can increase this limit with a [support request](azure-netapp-files-resource-limits.md#request-limit-increase).

<!-- activity logs? -->
<!-- alerting of cloning -->

## Register the feature

Short-term clones are currently in preview. To take advantage of the feature, you must first register it. 

1. Register the feature:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFShortTermClone
    ```
1. Registration for short term clones is not automatic and may take up to a week. You can check on the registration status with the command: 

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFShortTermClone
    ```

    When the `RegistrationState` field output displays "Registered", you can proceed to create a short-term clone. 

<!-- waitlist? given that it is not automatic -->

## Create a short-term clone

1. Select **Snapshots**.
1. Right-click the snapshot you want to clone. Select **Create short-term clone from snapshot**.
1. Confirm you understand that the short-term clone will automatically convert to a regular volume 28 days after the clone completes, which may incur costs due to a capacity pool automatically resizing. 
1. Complete the required fields in the **Create short term clone volume** menu:

	Provide a **Volume name**.
	Select a **Capacity pool**.
	Choose if you want to **Delete base snapshot** once the short-term clone is created. 
	Provide a **Quota** value.
    Confirm if the short-term clone is a **Large volume** (greater than 100 GiB).

1. Select **Review and create**.
<!-- time expectation -->
1. Confirm the short-term clone is created in the **Volume** menu. In the overview menu for the individual clone, you can confirm the volume type under the **Short-term clone volume** field, view the **Inherited size**, and track the **Split clone volume progress.**

## Convert a short-term clone to a volume

1. In the **Volume** menu, locate the short-term clone you want to convert.
1. Right-click the short-term clone. Select **Convert short-term clone to volume**.
1. Confirm the conversion is successful by checking the **Volume overview** page. You will know the conversion has succeeded when the **Short-term clone volume** field displays **No**.

    >[!NOTE]
    >Short-term clones may fail to convert even when triggered automatically at the end of the 28 day period. The conversion may fail due to a capacity pool resize issue or a volume issue. Consult activity logs for further information. 

## Next steps

* [How Azure NetApp Files snapshots work](snapshots-introduction.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
