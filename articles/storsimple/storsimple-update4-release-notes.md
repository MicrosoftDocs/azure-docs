---
title: StorSimple 8000 Series Update 4 release notes | Microsoft Docs
description: Describes the new features, issues, and workarounds for StorSimple 8000 Series Update 4.
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
ms.date: 01/23/2018
ms.author: alkohli

---
# StorSimple 8000 Series Update 4 release notes

## Overview

The following release notes describe the new features and identify the critical open issues for StorSimple 8000 Series Update 4. They also contain a list of the StorSimple software updates included in this release. 

Update 4 can be applied to any StorSimple device running Release (GA) or Update 0.1 through Update 3.1. The device version associated with Update 4 is 6.3.9600.17820.

Please review the information contained in the release notes before you deploy the update in your StorSimple solution.

> [!IMPORTANT]
> * Update 4 has device software, USM firmware, LSI driver and firmware, disk firmware, Storport and Spaceport, security, and other OS updates. It takes approximately 4 hours to install this update. Disk firmware update is a disruptive update and results in a downtime for your device. We recommend that you apply Update 4 to keep your device up-to-date. 
> * For new releases, you may not see updates immediately because we do a phased rollout of the updates. Wait a few days, and then scan for updates again as these will become available soon.

## What's new in Update 4

The following key improvements and bug fixes have been made in Update 4.

* **Smarter automated space reclamation algorithms** – In Update 4, the automated space reclamation algorithms are enhanced to adjust the space reclamation cycles based on the expected reclaimed space available in the cloud. 

* **Performance enhancements for locally pinned volumes** – Update 4 has improved the performance of locally pinned volumes in scenarios that have high data ingestion (data comparable to volume size).

* **Heatmap-based restore** - In the earlier releases, following a disaster recovery (DR), the data was restored from the cloud based on the access patterns resulting in a slow performance. 

    A new feature is implemented in Update 4 that tracks frequently accessed data to create a heatmap when the device is in use prior to DR (Most used data chunks have high heat whereas less used chunks have low heat). After DR, StorSimple uses the heatmap to automatically restore and rehydrate the data from the cloud. 

    All the restores are now heatmap based restores. For more information on how to query and cancel heatmap based restore and rehydration jobs, go to [Windows PowerShell for StorSimple cmdlet reference](https://technet.microsoft.com/library/dn688168.aspx).

* **StorSimple Diagnostics tool** – In Update 4, a StorSimple Diagnostics tool is being released to allow for easy diagnosing and troubleshooting of issues related to system, network, performance, and hardware component health. This tool is run via the Windows PowerShell for StorSimple. For more information, go to [troubleshoot using StorSimple Diagnostics tool](storsimple-8000-diagnostics.md).

* **UI-based StorSimple Migration tool** - Prior to this release, migration of data from 5000-7000 series required the users to execute a part of the migration workflow using the Azure PowerShell interface. In this release, an easy-to-use UI-based StorSimple Migration tool is made available for Support to facilitate the same migration workflow. This tool would also allow for the consolidation of recovery buckets. 

* **FIPS-related changes** - This release onwards, FIPS is enabled by default on all the StorSimple 8000 series devices for both the Microsoft Azure Government and Azure public cloud accounts.

* **Update changes** - In this release, bugs related to update failures have been fixed.

* **Alert for disk failures** - A new alert that warns the user of impending disk failures is added in this release. If you encounter this alert, contact Microsoft Support to ship a replacement disk. For more information, go to [hardware alerts on your StorSimple device](storsimple-8000-manage-alerts.md#hardware-alerts).

* **Controller replacement changes** - A cmdlet that allows the user to query the status of the controller replacement process is added in this release. For more information, go to the [cmdlet to query controller replacement status](https://technet.microsoft.com/library/dn688168.aspx).


## Issues fixed in Update 4

The following table provides a summary of issues that were fixed in Update 4.    

| No | Feature | Issue | Applies to physical device | Applies to virtual device |
| --- | --- | --- | --- | --- |
| 1 |Failover |In the earlier release, after the failover, there was an issue related to cleanup observed at the customer site. This issue is fixed in this release. |Yes |Yes |
| 2 |Locally pinned volumes |In the previous release, there was an issue to related volume creation for locally pinned volumes that would result in volume creation failures. This issue was root-caused and fixed in this release. |Yes |No |
| 3 |Support package |In previous release, there were issues related to Support package that would result in a System.OutOfMemory exception or other errors resulting in a Support package creation failure. These bugs are fixed in this release. |Yes |Yes |
| 4 |Monitoring |In previous release, there an issue related to monitoring charts for locally pinned volumes where consumption was shown in EB. This bug is resolved in this release. |Yes |Yes |
| 5 |Migration |In previous release, there were several issues related to the reliability of migration from 5000-7000 series to 8000 series devices. These issues have been addressed in this release. |Yes |Yes |
| 6 |Update |In previous releases, if there was an update failure, the controllers would go into recovery mode and hence the user could not proceed with the update and would need to contact Microsoft Support. <br> This behavior was changed in this release. If the user has an update failure after both the controllers are running the same version (Update 4), the controllers do not go into recovery mode. If the user encounters this failure, we recommend that they wait for a bit and then retry the update. The retry could succeed. If the retry fails, then they should contact Microsoft Support. |Yes |Yes |


## Known issues in Update 4 from previous releases

There are no new known issues in Update 4. For a list of issues carried over to Update 4 from previous releases, go to [Update 3 release notes](storsimple-update3-release-notes.md#known-issues-in-update-3).

## Serial-attached SCSI (SAS) controller and firmware updates in Update 4

This release has SAS controller and LSI driver and firmware updates. For more information on how to install these updates, see [install Update 4](storsimple-install-update-4.md) on your StorSimple device.

## Virtual device updates in Update 4

This update cannot be applied to the StorSimple Cloud Appliance (also known as the virtual device). New virtual devices will need to be created. 

## Next step

Learn how to [install Update 4](storsimple-install-update-4.md) on your StorSimple device.

