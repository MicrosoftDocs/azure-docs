---
title: StorSimple 8000 Series Update 5 release notes
description: Describes the new features, issues, and workarounds for StorSimple 8000 Series Update 5.
author: alkohli
ms.assetid: 
ms.service: storsimple
ms.topic: conceptual
ms.date: 11/13/2017
ms.author: alkohli

---
# StorSimple 8000 Series Update 5 release notes

## Overview

The following release notes describe the new features and identify the critical open issues for StorSimple 8000 Series Update 5. They also contain a list of the StorSimple software updates included in this release.

Update 5 can be applied to any StorSimple device running Update 0.1 through Update 4. The device version associated with Update 5 is 6.3.9600.17845.

Review the information contained in the release notes before you deploy the update in your StorSimple solution.

> [!IMPORTANT]
> * Update 5 is a mandatory update and must be installed immediately. For more information, see how to [Apply Update 5](storsimple-8000-install-update-5.md).
> * Update 5 has device software, disk firmware, OS security, and other OS updates. It takes approximately 4 hours to install this update. Disk firmware update is a disruptive update and results in a downtime for your device. We recommend that you apply Update 5 to keep your device up-to-date.
> * For new releases, you may not see updates immediately because we do a phased rollout of the updates. Wait a few days, and then scan for updates again as these updates will become available soon.

## What's new in Update 5

The following key improvements and bug fixes have been made in Update 5.

* **Use of Azure Active Directory (AAD) to authenticate with StorSimple Device Manager service** – From Update 5 onwards, Azure Active Directory is used to authenticate with the StorSimple Device Manager service. The old authentication mechanism will be deprecated by December 2017. All the users must include the new authentication URLs in their firewall rules. For more information, go to [authentication URLs listed in the networking requirements for your StorSimple device](storsimple-8000-system-requirements.md#url-patterns-for-azure-portal).

    If the authentication URL is not included in the firewall rules, the users will see a critical alert that their StorSimple device could not authenticate with the service. If the users see this alert, they need to include the new authentication URL. For more information, go to [StorSimple networking alerts](storsimple-8000-manage-alerts.md#networking-alerts).

* **New version of StorSimple Snapshot Manager** - A new version of StorSimple Snapshot Manager is released with Update 5 and is compatible with all the StorSimple devices that are running Update 4 or later. We recommend that you update to this version. The previous version of StorSimple Snapshot Manager is used for StorSimple devices that are running Update 3 or earlier. [Download the appropriate version of StorSimple Snapshot Manager](https://www.microsoft.com/en-us/download/details.aspx?id=44220) and refer to [deploy StorSimple Snapshot Manager](storsimple-snapshot-manager-deployment.md).


## Issues fixed in Update 5

The following table provides a summary of issues that were fixed in Update 5.

| No | Feature | Issue | Applies to physical device | Applies to virtual device |
| --- | --- | --- | --- | --- |
| 1 |Windows PowerShell remoting |In the previous release, a user would receive an error while trying to establish a remote connection to the StorSimple Cloud Appliance via Windows PowerShell. This issue was root-caused and fixed in this release. |No |Yes |
| 2 |Bandwidth templates |In earlier release, there was an issue with bandwidth templates that resulted in lower bandwidth than what the device was configured for. This issue is resolved in this release. |Yes |Yes |
| 3 |Failover |In previous release, when a device with a large number of volumes was failed over to another device running Update 4, the process would fail when trying to apply the access control records. This issue is fixed in this release. |Yes |Yes |



## Known issues in Update 5 from previous releases

There are no new known issues in Update 5. For a list of issues carried over to Update 5 from previous releases, go to [Update 3 release notes](storsimple-update3-release-notes.md#known-issues-in-update-3).

## Serial-attached SCSI (SAS) controller and firmware updates in Update 5

This release has SAS controller and LSI driver and firmware updates. For more information on how to install these updates, see [install Update 5](storsimple-8000-install-update-5.md) on your StorSimple device.

## StorSimple Cloud Appliance updates in Update 5

This update cannot be applied to the StorSimple Cloud Appliance (also known as the virtual device). New cloud appliances need to be created using the Update 5 image. For information on how to create a StorSimple Cloud Appliance, go to [Deploy and manage a StorSimple Cloud Appliance](storsimple-8000-cloud-appliance-u2.md).

## Next step

Learn how to [install Update 5](storsimple-8000-install-update-5.md) on your StorSimple device.

