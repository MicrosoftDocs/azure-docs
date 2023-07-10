---
title: Create a short-term clone from an Azure NetApp File snapshot| Microsoft Learn
description: Create a short-term clone from an Azure NetApp File snapshot.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 05/20/2023
ms.author: anfdocs
---
# Create a short-term clone from an Azure NetApp File snapshot (preview)

Short-term clones are cloned volumes created from Azure NetApp Files snapshots intended for temporary use. Short-term clones are writable and space efficient, sharing data blocks with the parent volume for common data. 

With a short-term clone, you can create a clone of your original volume on a different capacity pool to utilize a different QoS level without being restrained by space restrictions in the source capacity pool. Additionally, short-term clones enable you to test a snapshot restore on a different capacity pool before [reverting to the original volume](snapshots-revert-volume.md). 

Short-term clones can be converted regular volumes. 

## Considerations 

* If the capacity pool hosting the clone does not have enough space, the capacity pool automatically resizes to accommodate the clone. 
* Short term clones do not support the same operations as regular volumes. You cannot create a snapshot, snapshot policy, backup, default user quota, or export policy on a short-term clone. 
    * If the parent volume has a snapshot policy, the policy is not applied to the short-term clone.
    <!-- can you disable on the clone if errors are there? -->
* A short-term clone is automatically converted to a regular volume in its designated capacity pool 28 days after the clone operation completes. To prevent this conversion, manually delete the short-term clone before four weeks elapse. 
* You cannot delete the parent volume of a short-term clone. You must first delete the clone or convert it to a regular volume, then you can delete the parent volume. 
* You cannot migrate an SVM that contains a short-term clone, nor can you initiate a short-term clone operation during an active SVM migration. 

<!-- operations prevented during clone or split? -->
<!-- is there a limit to the number of clones you can make? Beyond space of course -->

## Register the feature

Short-term clones are current in preview. To take advantage of the feature, you must first register it. 

1. Register the feature:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFShortTermClone
    ```
1. Registration for short term clones is not automatic and may take up to a week. You can check on the registration status with the command: 

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFShortTermClone
    ```

    Wait until the `RegistrationState` in the output is "Registered" before continuing. 

<!-- waitlist? given that it is not automatic -->

## Create a short-term clone

1. Select **Snapshots**.
1. Right-click on the Snapshot you want to clone. Select **Create short-term clone from snapshot**.
1. Complete the required fields in the **Create short term clone volume** menu:

	Provide a **Volume name**.
	Select a **Capacity pool**.
	Choose if you want to **Delete base snapshot** once the short-term clone is created. 
	Provide a **Quota** value.

1. Select **Review and create**
1. Confirm the short-term clone is created in the **Volume** menu. In the overview menu for the individual clone, you can confirm the volume type under the **Short-term clone volume** field, view the **Inherited size**, and track the **Split clone volume progress.**

## Convert a short-term clone to a volume

1. In the **Volume** menu, locate the short-term clone you want to convert.
1. Right-click the short-term clone. Select **Convert short-term clone to volume**.

## Next steps

* [How Azure NetApp Files snapshots work](snapshots-introduction.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
