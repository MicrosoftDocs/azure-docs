---
title: StorSimple Virtual Array Update 0.4 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the StorSimple Virtual Array running Update 0.4.
services: storsimple
documentationcenter: ''
author: alkohli
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/05/2017
ms.author: alkohli

---
# StorSimple Virtual Array Update 0.4 release notes

## Overview

The following release notes identify the critical open issues and the resolved issues for Microsoft Azure StorSimple Virtual Array updates.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your StorSimple Virtual Array, carefully review the information contained in the release notes.

Update 0.4 corresponds to the software version **10.0.10289.0**.

> [!NOTE]
> Updates are disruptive and restart your device. If I/O are in progress, the device incurs downtime.


## What's new in the Update 0.4
Update 0.4 is primarily a bug-fix build coupled with a few enhancements. In this version, several bugs resulting in backup failures in the previous version have been addressed. The main enhancements and bug-fixes are as follows:

- **Backup performance enhancements** - This release has made several key enhancements to improve the backup performance. As a result, the backups that involve a large number of files see a significant reduction in the time to complete, for full and incremental backups.

- **Enhanced restore performance** - This release contains enhancements that significantly improve the restore performance when using large number of files. If using 2 - 4 million files, we recommend that you provision a virtual array with 16 GB RAM to see the improvements. When using less than 2 million files, the minimum requirement for the virtual machine continues to be 8 GB RAM.

- **Improvements to Support package** - The improvements include logging in the statistics for disk, CPU, memory, network, and cloud into the Support package thereby improving the process of diagnosing/debugging device issues.

- **Limit locally pinned iSCSI volumes to 200 GB** - For locally pinned volumes, we recommend that you limit to a 200 GB iSCSI volume on your StorSimple Virtual Array. The local reservation for tiered volumes continues to be 10 % of the provisioned volume size but is capped at 200 GB. 

- **Backup-related bug fixes** - In previous versions of software, there were issues related to backups that would cause backup failures. These bugs have been addressed in this release.


## Issues fixed in the Update 0.4

The following table provides a summary of issues fixed in this release.

| No. | Feature | Issue |
| --- | --- | --- |
| 1 |Backup performance|In the earlier releases, the backups involving large number of files would take a long time to complete (in the order of days). In this release, both the full and incremental backups see a significant reduction in the time to completion. |
| 2 |Support package|Disk, CPU, memory, network, and cloud statistics are now logged in to the Support logs making the Support packages very effective in troubleshooting any device issues.|
| 3 |Backup |In earlier releases, long running backups could result in a space crunch on the device resulting in backup failures. This bug is addressed in this release by allowing no more than 5 backups to queue at one time.|
| 4 |iSCSI | In earlier releases, the local reservation for tiered or locally pinned volumes was 10% of the provisioned volume size. In this release, the local reservation for all iSCSI volumes (locally pinned or tiered) is limited to 10 % with a maximum of up to 200 GB (for tiered volumes larger than 2 TB) thereby freeing up more space on the local disk. We recommend that the locally pinned volumes in this release be limited to 200 GB.|


## Known issues in the Update 0.4

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
| **15.** |File server |Symbolic links are not supported. | |
| **16.** |File server |Files protected by Windows Encrypting File System (EFS) when copied over or stored on the StorSimple Virtual Array file server result in an unsupported configuration.  | |

## Next step
[Install Update 0.4](storsimple-virtual-array-install-update-04.md) on your StorSimple Virtual Array.

## References
Looking for an older release note? Go to: 

* [StorSimple Virtual Array Update 0.3 Release Notes](storsimple-ova-update-03-release-notes.md)
* [StorSimple Virtual Array Update 0.1 and 0.2 Release Notes](storsimple-ova-update-01-release-notes.md)
* [StorSimple Virtual Array General Availability Release Notes](storsimple-ova-pp-release-notes.md)

