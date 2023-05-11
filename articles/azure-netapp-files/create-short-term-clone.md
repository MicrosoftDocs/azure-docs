---
title: Create a short-term clone from an Azure NetApp File snapshot| Microsoft Docs
description: Create a short-term clone from an Azure NetApp File snapshot.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 05/20/2023
ms.author: anfdocs
---
# Create a short-term clone from an Azure NetApp File snapshot (preview)

Short-term clones are cloned volumes created from Azure NetApp Files snapshots intended for temporary use. Short-term clones share datablocks with the original file, but ____. With a short-term clone, you can create a clone of your original volume on a different capacity pool, allowing you to utilize a different QoS level and not be restrained by space restrictions in the source capacity pool. Additionally, short-term clones enable you to test a Snapshot restore on a different capacity pool before reverting to the original volume. 

If you decide to keep the short-term clone, you can convert it to a regular volume. 

## Considerations 

* When a clone operation is in progress, you can restore to the original source volume.
    <!-- you cannot restore to the volume or you cannot restore based on snapshot?>
* You can create a maximum number of three clones per volume. This limit is modifiable with a support request. 
<!-- modifiable by Geneva request. what does this limit mean? -->
* If the capacity pool hosting the clone does not have enough space for the clone, the capacity pool will automatically be resized to accommodate the clone. 
* When you clone a volume, it will automatically be converted to a volume in its designated capacity pool four weeks after the clone operation completes. 
* <!-- is the short term clone deleted after a period? -->

## Register the feature

Short-term clones are current in preview. To take advantage of the feature, you must first register it. 

1. Register the feature:
    `Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFShortTermClone`
1. Registration for short term clones is not automatic and may take up to a week. You can check on the registration status with the command: 
    `Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFShortTermClone`

    Wait until the `RegistrationState` in the output is "Registered" before continuing. 

## Create a short-term clone

1. Select **Snapshots**.
1. Right-click on the Snapshot you want to clone. Select **Create short-term clone from snapshot**. <!-- Restore to short term clone volume ? --> 
1. Complete the required fields in the **Create short term clone volume** menu:

	Provide a **Volume name**.
	Select a **Capacity pool**.
	Choose if you want to **Delete base snapshot** once the short-term clone is created. 
	Provide a **Quota** value.

1. Select **Review and create**
1. Confirm the short-term clone is created in the **Volume** menu. In the overview menu for the individual clone, you can confirm the volume type under the **Short-term clone volume** field as well as view the **Inherited size** and track the **Split clone volume progress.**

## Convert a short-term clone to a volume
1. In the **Volume** menu, locate the short-term clone you want to convert.
1. Right-click the short-term clone. Select **Convert short-term clone to volume**.

## Next steps
