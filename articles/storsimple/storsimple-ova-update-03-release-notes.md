---
title: StorSimple Virtual Array Updates release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the StorSimple Virtual Array running Update 0.3.
services: storsimple
documentationcenter: ''
author: alkohli
manager: carmonm
editor: ''

ms.assetid: b197651a-3c40-4185-b23d-4c8f22cfa8f4
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/15/2016
ms.author: alkohli

---
# StorSimple Virtual Array Update 0.3 release notes
## Overview
The following release notes identify the critical open issues and the resolved issues for Microsoft Azure StorSimple Virtual Array updates.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your StorSimple Virtual Array, carefully review the information contained in the release notes.

Update 0.3 corresponds to the software version **10.0.10288.0**.

> [!NOTE]
> Updates are disruptive and restart your device. If I/O are in progress, the device incurs downtime.
> 
> 

## What's new in the Update 0.3
Update 0.3 is primarily a bug-fix build. In this version, several bugs resulting in backup failures in the previous version have been addressed.

## Issues fixed in the Update 0.3
The following table provides a summary of issues fixed in this release.

| No. | Feature | Issue |
| --- | --- | --- |
| 1 |Backups |A problem was seen in the earlier release where the backups would fail to complete for a file share. If this issue occurred, the backup job would fail and a critical alert was raised on the StorSimple Manager service to notify the user. This issue did not affect the data on the shares or access to the data. The root cause was identified and fixed in this release. <br></br> The fix does not apply retroactively to shares that are already seeing this issue. Customers who are seeing this issue should first apply Update 0.3, then contact Microsoft Support to perform a full system backup to fix the issue. Instead of contacting Microsoft Support, customers can also restore to a new share from a healthy backup for the affected shares. |
| 2 |iSCSI |An issue was seen in the earlier release where the volumes would disappear when copying data to a volume on the StorSimple Virtual Array. This issue was fixed in this release. <br></br> The fixes take effect only on newly created volumes. The fixes do not apply retroactively to volumes that are already seeing this issue. Customers are advised to bring the affected volumes online via the Azure classic portal, perform a backup for these volumes, and then restore these volumes to new volumes. |

## Known issues in the Update 0.3
The following table provides a summary of known issues for the StorSimple Virtual Array and includes the issues release-noted from the previous releases. 

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
| **1.** |Updates |The virtual devices created in the preview release cannot be updated to a supported General Availability version. |These virtual devices must be failed over for the General Availability release using a disaster recovery (DR) workflow. |
| **2.** |Provisioned data disk |Once you have provisioned a data disk of a certain specified size and created the corresponding StorSimple virtual device, you must not expand or shrink the data disk. Attempting to do results in a loss of all the data in the local tiers of the device. | |
| **3.** |Group policy |When a device is domain-joined, applying a group policy can adversely affect the device operation. |Ensure that your virtual array is in its own organizational unit (OU) for Active Directory and no group policy objects (GPO) are applied to it. |
| **4.** |Local web UI |If enhanced security features are enabled in Internet Explorer (IE ESC), some local web UI pages such as Troubleshooting or Maintenance may not work properly. Buttons on these pages may also not work. |Turn off enhanced security features in Internet Explorer. |
| **5.** |Local web UI |In a Hyper-V virtual machine, the network interfaces in the web UI are displayed as 10 Gbps interfaces. |This behavior is a reflection of Hyper-V. Hyper-V always shows 10 Gbps for virtual network adapters. |
| **6.** |Tiered volumes or shares |Byte range locking for applications that work with the StorSimple tiered volumes is not supported. If byte range locking is enabled, StorSimple tiering does not work. |Recommended measures include: <br></br>Turn off byte range locking in your application logic.<br></br>Choose to put data for this application in locally pinned volumes as opposed to tiered volumes.<br></br>*Caveat*: When using locally pinned volumes and byte range locking is enabled, the locally pinned volume can be online even before the restore is complete. In such instances, if a restore is in progress, then you must wait for the restore to complete. |
| **7.** |Tiered shares |Working with large files could result in slow tier out. |When working with large files, we recommend that the largest file is smaller than 3% of the share size. |
| **8.** |Used capacity for shares |You may see share consumption when there is no data on the share. This is because the used capacity for shares includes metadata. | |
| **9.** |Disaster recovery |You can only perform the disaster recovery of a file server to the same domain as that of the source device. Disaster recovery to a target device in another domain is not supported in this release. |This is implemented in a later release. |
| **10.** |Azure PowerShell |The StorSimple virtual devices cannot be managed through the Azure PowerShell in this release. |All the management of the virtual devices should be done through the Azure classic portal and the local web UI. |
| **11.** |Password change |The virtual array device console only accepts input in en-US keyboard format. | |
| **12.** |CHAP |CHAP credentials once created cannot be removed. Additionally, if you modify the CHAP credentials, you need to take the volumes offline and then bring them online for the change to take effect. |This issue is addressed in a later release. |
| **13.** |iSCSI server |The 'Used storage' displayed for an iSCSI volume may be different in the StorSimple Manager service and the iSCSI host. |The iSCSI host has the filesystem view.<br></br>The device sees the blocks allocated when the volume was at the maximum size. |
| **14.** |File server |If a file in a folder has an Alternate Data Stream (ADS) associated with it, the ADS is not backed up or restored via disaster recovery, clone, and Item Level Recovery. | |

## Next step
[Install Update 0.3](storsimple-ova-install-update-01.md) on your StorSimple Virtual Array.

## References
Looking for an older release note? Go to: 

* [StorSimple Virtual Array Update 0.1 and 0.2 Release Notes](storsimple-ova-update-01-release-notes.md)
* [StorSimple Virtual Array General Availability Release Notes](storsimple-ova-pp-release-notes.md)

