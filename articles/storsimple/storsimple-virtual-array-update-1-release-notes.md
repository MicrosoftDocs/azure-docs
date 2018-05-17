---
title: StorSimple Virtual Array Update 1.0 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the StorSimple Virtual Array running Update 1.0.
services: storsimple
documentationcenter: ''
author: alkohli
manager: jeconnoc
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/02/2017
ms.author: alkohli

---
# StorSimple Virtual Array Update 1.0 release notes

## Overview

The following release notes identify the critical open issues and the resolved issues for Microsoft Azure StorSimple Virtual Array updates.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your StorSimple Virtual Array, carefully review the information contained in the release notes.

Update 1.0 corresponds to the software version **10.0.10296.0**.

> [!IMPORTANT]
> - Updates are disruptive and restart your device. If I/O are in progress, the device incurs downtime. For detailed instructions on how to apply the update, go to [Install Update 1.0](storsimple-virtual-array-install-update-1.md).
>
> - Update 1 is only available to you via the Azure portal if your device is running Update 0.6.

## What's new in Update 1.0

**Update 1.0 contains changes related to authentication of StorSimple Device Manager service and should be deployed at your earliest.** This update contains the following enhancements and bug fixes:

 - **Use of Azure Active Directory (AAD) to authenticate with StorSimple Device Manager service** – From Update 1.0 onwards, Azure Active Directory is used to authenticate with the StorSimple Device Manager service. The old authentication mechanism will be deprecated by December 2017. All the users must include the new authentication URLs in their firewall rules. For more information, go to authentication URLs listed in the [Networking requirements for your StorSimple Virtual Array](storsimple-ova-system-requirements.md).
 
    If the authentication URL is not included in the firewall rules, the users will see a critical alert that their StorSimple device could not authenticate with the service. If the users see this alert, they need to include the new authentication URL. For more information, go to [StorSimple networking alerts](storsimple-virtual-array-manage-alerts.md).

 - **Performance improvement** - Several bug fixes were done to improve the speeds of cloud reads, tier-ins and tier-outs. As a result, both the backup and restore performance has improved for iSCSI and file server devices.

 - **Garbage collection improvement** - This release has bug fixes that improve the performance of garbage collection cycle when the device and storage account are in two distant regions.

 - **Logging improvement** - This release contains improvements to logging related to garbage collection and I/O path.


## Issues fixed in Update 1.0

The following table provides a summary of issues fixed in this release.

| No. | Feature | Issue |
| --- | --- | --- |
| 1 |AAD-based authentication| This release contains changes that allows AAD to authenticate with the StorSimple Device Manager.|
| 2 |Garbage collection| This issue was reported at a customer site where the device and storage accounts are in different regions and the  customer reported intermittent network errors thereby impacting the billing. In this release, this issue was fixed. |
| 3 |Performance| This release contains changes that result in restore/cloud reads/tier in/tier out performance improvement.|
| 4 |Update| There was an issue with update in the earlier release that resulted in backup failures at a customer site. This issue is fixed in this release.|

## Known issues in Update 1.0

The following table provides a summary of known issues for the StorSimple Virtual Array and includes the issues release-noted from the previous releases.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
| **1.** |Updates |The virtual arrays created in the preview release cannot be updated to a supported General Availability version. |These virtual arrays must be failed over for the General Availability release using a disaster recovery (DR) workflow. |
| **2.** |Provisioned data disk |Once you have provisioned a data disk of a certain specified size and created the corresponding StorSimple Virtual Array, you must not expand or shrink the data disk. Attempting to do results in a loss of all the data in the local tiers of the device. | |
| **3.** |Group policy |When a device is domain-joined, applying a group policy can adversely affect the device operation. |Ensure that your virtual array is in its own organizational unit (OU) for Active Directory and no group policy objects (GPO) are applied to it. |
| **4.** |Local web UI |If enhanced security features are enabled in Internet Explorer (IE ESC), some local web UI pages such as Troubleshooting or Maintenance may not work properly. Buttons on these pages may also not work. |Turn off enhanced security features in Internet Explorer. |
| **5.** |Local web UI |In a Hyper-V virtual machine, the network interfaces in the web UI are displayed as 10 Gbps interfaces. |This behavior is a reflection of Hyper-V. Hyper-V always shows 10 Gbps for virtual network adapters. |
| **6.** |Tiered volumes or shares |Byte range locking for applications that work with the StorSimple tiered volumes is not supported. If byte range locking is enabled, StorSimple tiering does not work. |Recommended measures include: <br></br>Turn off byte range locking in your application logic.<br></br>Choose to put data for this application in locally pinned volumes as opposed to tiered volumes.<br></br>*Caveat*: When using locally pinned volumes and byte range locking is enabled, the locally pinned volume can be online even before the restore is complete. In such instances, if a restore is in progress, then you must wait for the restore to complete. |
| **7.** |Tiered shares |Working with large files could result in slow tier out. |When working with large files, we recommend that the largest file is smaller than 3% of the share size. |
| **8.** |Used capacity for shares |You may see share consumption when there is no data on the share. This consumption is because the used capacity for shares includes metadata. | |
| **9.** |Disaster recovery |You can only perform the disaster recovery of a file server to the same domain as that of the source device. Disaster recovery to a target device in another domain is not supported in this release. |This is implemented in a later release. For more information, go to [Failover and disaster recovery for your StorSimple Virtual Array](storsimple-virtual-array-failover-dr.md) |
| **10.** |Azure PowerShell |The StorSimple Virtual Arrays cannot be managed through the Azure PowerShell in this release. |All the management of the virtual devices should be done through the Azure portal and the local web UI. |
| **11.** |Password change |The virtual array device console only accepts input in en-us keyboard format. | |
| **12.** |CHAP |CHAP credentials once created cannot be removed. Additionally, if you modify the CHAP credentials, you need to take the volumes offline and then bring them online for the change to take effect. |This issue is addressed in a later release. |
| **13.** |iSCSI server |The 'Used storage' displayed for an iSCSI volume may be different in the StorSimple Device Manager service and the iSCSI host. |The iSCSI host has the filesystem view.<br></br>The device sees the blocks allocated when the volume was at the maximum size. |
| **14.** |File server |If a file in a folder has an Alternate Data Stream (ADS) associated with it, the ADS is not backed up or restored via disaster recovery, clone, and Item Level Recovery. | |
| **15.** |File server |Symbolic links are not supported. | |
| **16.** |File server |Files protected by Windows Encrypting File System (EFS) when copied over or stored on the StorSimple Virtual Array file server result in an unsupported configuration.  | |
| **17.** |Updates |If you see Error code: 2359302 (hex 0x240006) when trying to install a hotfix through the local UI, then this implies that the hotfix is already installed on your device.   | |
| **18.** |Updates |If you use the local web UI to install Update 1 on your virtual array, you must ensure that you are running Update 0.6. If you are running a version lower than Update 0.6, you must install Update 0.6 first and then apply Update 1. If you directly install Update 1.0 from a pre-Update 0.6 version, then you will miss some updates and the monitoring charts will not work.   | |


## Next steps
[Install Update 1.0](storsimple-virtual-array-install-update-1.md) on your StorSimple Virtual Array.

## References
Looking for an older release note? Go to:
*  [StorSimple Virtual Array Update 0.6 Release Notes](storsimple-virtual-array-update-06-release-notes.md)
* [StorSimple Virtual Array Update 0.5 Release Notes](storsimple-virtual-array-update-05-release-notes.md)
* [StorSimple Virtual Array Update 0.4 Release Notes](storsimple-virtual-array-update-04-release-notes.md)
* [StorSimple Virtual Array Update 0.3 Release Notes](storsimple-ova-update-03-release-notes.md)
* [StorSimple Virtual Array Update 0.1 and 0.2 Release Notes](storsimple-ova-update-01-release-notes.md)
* [StorSimple Virtual Array General Availability Release Notes](storsimple-ova-pp-release-notes.md)
