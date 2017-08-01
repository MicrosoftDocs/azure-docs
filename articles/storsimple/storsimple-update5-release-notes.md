---
title: StorSimple 8000 Series Update 5 release notes | Microsoft Docs
description: Describes the new features, issues, and workarounds for StorSimple 8000 Series Update 5.
services: storsimple
documentationcenter: NA
author: alkohli
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 08/01/2017
ms.author: alkohli

---
# StorSimple 8000 Series Update 5 release notes

## Overview

The following release notes describe the new features and identify the critical open issues for StorSimple 8000 Series Update 5. They also contain a list of the StorSimple software updates included in this release.

Update 5 can be applied to any StorSimple device running Update 0.1 through Update 4. The device version associated with Update 5 is 6.3.9600.17838.

Review the information contained in the release notes before you deploy the update in your StorSimple solution.

> [!IMPORTANT]
> * Update 5 has device software, disk firmware, OS security, and other OS updates. It takes approximately 4 hours to install this update. Disk firmware update is a disruptive update and results in a downtime for your device. We recommend that you apply Update 5 to keep your device up-to-date.
> * For new releases, you may not see updates immediately because we do a phased rollout of the updates. Wait a few days, and then scan for updates again as these updates will become available soon.

## What's new in Update 5

The following key improvements and bug fixes have been made in Update 5.

* **Azure Active Directory (AAD) integration with StorSimple Device Manager service** – From Update 5 onwards, Azure Active Directory is used to authenticate with the StorSimple Device Manager service. The old authentication mechanism will be deprecated by December 2017. All the users must include the new authentication URLs in their firewall rules. For more information, go to [authentication URLs listed in the networking requirements for your StorSimple device]().

* **Performance enhancements for Support package gathering** – In the earlier release, when gathering Support package using Jarvis would take a long time. The time to gather a Support package has improved in Update 5.

* **Changes to StorSimple Diagnostics tool** – In Update 5, verbose logging is allowed for the performance test using the StorSimple Diagnostics tool. For more information, go to [troubleshoot using StorSimple Diagnostics tool](storsimple-8000-diagnostics.md).

* **StorSimple Snapshot Manager changes** - A new version of StorSimple Snapshot Manager is released with Update 5. This version is compatible if you are running Update 3 or later on your StorSimple device. For more information, go to [Install StorSimple Snapshot Manager](storsimple-snapshot-manager-deployment.md). 



## Issues fixed in Update 5

The following table provides a summary of issues that were fixed in Update 5.

| No | Feature | Issue | Applies to physical device | Applies to virtual device |
| --- | --- | --- | --- | --- |
| 1 |Diagnostics  |In this release, Performance test for the StorSimple Diagnostics tool allows for the verbose logging. |Yes |Yes |
| 2 |Windows PowerShell remoting |In the previous release, a user would receive an error while trying to establish a remote connection to the StorSimple Cloud Appliance via Windows PowerShell. This issue was root-caused and fixed in this release. |Yes |No |
| 3 |Support package |In previous release, there was an issue that resulted in longer times to gather a Support package using Jarvis. This issue is fixed in this release. |Yes |Yes |



## Known issues in Update 5 from previous releases

There are no new known issues in Update 5. For a list of issues carried over to Update 5 from previous releases, go to [Update 3 release notes](storsimple-update3-release-notes.md#known-issues-in-update-3).

## Serial-attached SCSI (SAS) controller and firmware updates in Update 5

This release has SAS controller and LSI driver and firmware updates. For more information on how to install these updates, see [install Update 5](storsimple-8000-install-update-5.md) on your StorSimple device.

## StorSimple Cloud Appliance updates in Update 5

This update cannot be applied to the StorSimple Cloud Appliance (also known as the virtual device). New cloud appliances need to be created using the Update 5 image. For information on how to create a StorSimple Cloud Appliance, go to [Deploy and manage a StorSimple Cloud Appliance](storsimple-8000-cloud-appliance-u2.md).

## Next step

Learn how to [install Update 5](storsimple-8000-install-update-5.md) on your StorSimple device.

