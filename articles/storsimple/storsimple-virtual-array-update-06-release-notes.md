---
title: StorSimple Virtual Array Update 0.6 release notes| Microsoft Docs
description: Describes critical open issues and resolutions for the StorSimple Virtual Array running Update 0.6.
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
ms.date: 05/24/2017
ms.author: alkohli

---
# StorSimple Virtual Array Update 0.6 release notes

## Overview

The following release notes identify the critical open issues and the resolved issues for Microsoft Azure StorSimple Virtual Array updates.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your StorSimple Virtual Array, carefully review the information contained in the release notes.

Update 0.6 corresponds to the software version **10.0.10293.0**.

> [!IMPORTANT]
> - Updates are disruptive and restart your device. If I/O are in progress, the device incurs downtime. For detailed instructions on how to apply the update, go to [Install Update 0.6](storsimple-virtual-array-install-update-06.md).
>
> - We strongly recommend that you install Update 0.6 immediately as it contains critical security fixes.


## What's new in the Update 0.6
Update 0.6 is a critical update and should be deployed immediately. This update contains the following fixes: 

- **Windows Security fixes** - This release has **Windows critical security fixes**. Review the following security updates for more information about the security issues and the associated fixes:
    - [December 2016 Security Only Quality Update for Windows 8.1 and Windows Server 2012 R2](https://support.microsoft.com/help/3205400/december-2016-security-only-quality-update-for-windows-8.1-and-windows-server-2012-r2)
    - [March 2017 Security Only Quality Update for Windows 8.1 and Windows Server 2012 R2](https://support.microsoft.com/help/4012213/march-2017-security-only-quality-update-for-windows-8-1-and-windows-server-2012-r23)
    - [May 9, 2017—KB4019213 (Security-only update)](https://support.microsoft.com/help/4019213/windows-8-update-kb4019213)

- **Restore fix** - In earlier releases, there was a bug that would prevent the restore from completing. This bug has been fixed in this release.


## Issues fixed in the Update 0.6

The following table provides a summary of issues fixed in this release.

| No. | Feature | Issue |
| --- | --- | --- |
| 1 |Security| This release contains critical Windows Security updates. We suggest that you install this update immediately.|
| 2 |Restore| During a restore, there was a race condition that would prevent the restore job from completing. The bug fix addresses this race condition.|


## Known issues in the Update 0.6

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
| **8.** |Used capacity for shares |You may see share consumption when there is no data on the share. This consumption is because the used capacity for shares includes metadata. | |
| **9.** |Disaster recovery |You can only perform the disaster recovery of a file server to the same domain as that of the source device. Disaster recovery to a target device in another domain is not supported in this release. |This is implemented in a later release. For more information, go to [Failover and disaster recovery for your StorSimple Virtual Array](storsimple-virtual-array-failover-dr.md) |
| **10.** |Azure PowerShell |The StorSimple virtual devices cannot be managed through the Azure PowerShell in this release. |All the management of the virtual devices should be done through the Azure portal and the local web UI. |
| **11.** |Password change |The virtual array device console only accepts input in en-us keyboard format. | |
| **12.** |CHAP |CHAP credentials once created cannot be removed. Additionally, if you modify the CHAP credentials, you need to take the volumes offline and then bring them online for the change to take effect. |This issue is addressed in a later release. |
| **13.** |iSCSI server |The 'Used storage' displayed for an iSCSI volume may be different in the StorSimple Device Manager service and the iSCSI host. |The iSCSI host has the filesystem view.<br></br>The device sees the blocks allocated when the volume was at the maximum size. |
| **14.** |File server |If a file in a folder has an Alternate Data Stream (ADS) associated with it, the ADS is not backed up or restored via disaster recovery, clone, and Item Level Recovery. | |
| **15.** |File server |Symbolic links are not supported. | |
| **16.** |File server |Files protected by Windows Encrypting File System (EFS) when copied over or stored on the StorSimple Virtual Array file server result in an unsupported configuration.  | |
| **17.** |Updates |If you see Error code: 2359302 (hex 0x240006) when trying to install a hotfix through the local UI, then this implies that the hotfix is already installed on your device.   | |

## Next step
[Install Update 0.6](storsimple-virtual-array-install-update-06.md) on your StorSimple Virtual Array.

## References
Looking for an older release note? Go to:

* [StorSimple Virtual Array Update 0.5 Release Notes](storsimple-virtual-array-update-05-release-notes.md)
* [StorSimple Virtual Array Update 0.4 Release Notes](storsimple-virtual-array-update-04-release-notes.md)
* [StorSimple Virtual Array Update 0.3 Release Notes](storsimple-ova-update-03-release-notes.md)
* [StorSimple Virtual Array Update 0.1 and 0.2 Release Notes](storsimple-ova-update-01-release-notes.md)
* [StorSimple Virtual Array General Availability Release Notes]()