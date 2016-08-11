<properties 
   pageTitle="StorSimple Virtual Array Updates release notes| Microsoft Azure"
   description="Describes critical open issues and resolutions for the StorSimple Virtual Array running Update 0.3."
   services="storsimple"
   documentationCenter=""
   authors="alkohli"
   manager="carmonm"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="08/11/2016"
   ms.author="alkohli" />

# StorSimple Virtual Array Update 0.3 release notes

## Overview

The following release notes identify the critical open issues and the resolved issues for Microsoft Azure StorSimple Virtual Array updates.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your StorSimple Virtual Array, carefully review the information contained in the release notes.

Update 0.3 corresponds to the software version **10.0.10280.0**.  

> [AZURE.NOTE] Updates are disruptive and will restart your device. If I/O are in progress, the device will incur downtime.


## What's new in the Update 0.3

Update 0.3 contains the following bug fixes and improvements.

- **Improved resiliency for cloud outages**: This release has several bug fixes around disaster recovery, backup, restore, and tiering in the event of a cloud connectivity disruption. 

- **Improved restore performance**: This release has bug fixes that have significantly cut down the completion time of the restore jobs.

- **Automated space reclamation optimization**: When data is deleted on thinly provisioned volumes, the unused storage blocks need to be reclaimed. This release has improved the space reclamation process from the cloud resulting in the unused space becoming available faster as compared to the previous versions.

- **New virtual disk images**: New VHD, VHDX, and VMDK are now available via the Azure classic portal. You can download these images to provision new Update 0.1 devices.

- **Improving the accuracy of jobs status in the portal**: In the earlier version of software, job status reporting in the portal was not granular. This issue is resolved in this release.

- **Domain join experience**: Bug fixes related to domain-joining and renaming of the device.


## Issues fixed in the Update 0.3

The following table provides a summary of issues fixed in this release.

| No.  | Feature                              | Issue                                                                                                                                                                                                                                                                                                                           |
|------|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1    | VMDK                                 | In some VMware versions, the OS disk was seen as sparse causing alerts and disrupting normal operations. This was fixed in this release.                                                                                                                                                                                    |
| 2    | iSCSI server                         | In the last release, the user was required to specify a gateway for each enabled network interface of your StorSimple virtual device. This behavior is changed in this release so that the user has to configure at least one gateway for all the enabled network interfaces.                                                                              |
| 3    | Support package                      | In the earlier version of software, Support package collection failed when the package sizes were larger than 1 GB. This issue is fixed in this release.                                                                                                                                                                               |
| 4    | Cloud access                         |  In the last release, if the StorSimple Virtual Array did not have network connectivity and was restarted, the local UI would have connectivity issues. This problem is fixed in this release.                                                                                                                            |
| 5    | Monitoring charts                    | In the previous release, following a device failover, the cloud capacity utilization charts displayed incorrect values in the Azure classic portal. This is fixed in the current release.                                                                                                                          |



## Known issues in the Update 0.3

The following table provides a summary of known issues for the StorSimple Virtual Array and includes the issues release-noted from the previous releases. **The issues release noted in this release are marked with an asterisk. Almost all the issues in this list have carried over from the GA release of StorSimple Virtual Array.**


| No. | Feature | Issue | Workaround/comments |
|-----|--------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **1.** | Updates | The virtual devices created in the preview release cannot be updated to a supported General Availability version. | These virtual devices must be failed over for the General Availability release using a disaster recovery (DR) workflow. |
| **2.** | Provisioned data disk | Once you have provisioned a data disk of a certain specified size and created the corresponding StorSimple virtual device, you must not expand or shrink the data disk. Attempting to do so will result in a  loss of all the data in the local tiers of the device. |   |
| **3.** | Group policy | When a device is domain-joined, applying a group policy can adversely affect the device operation. | Ensure that your virtual array is in its own organizational unit (OU) for Active Directory and no group policy objects (GPO) are applied to it.|
| **4.** | Local web UI | If enhanced security features are enabled in Internet Explorer (IE ESC), some local web UI pages such as Troubleshooting or Maintenance may not work properly. Buttons on these pages may also not work. | Turn off enhanced security features in Internet Explorer.|
| **5.** | Local web UI | In a Hyper-V virtual machine, the network interfaces in the web UI are displayed as 10 Gbps interfaces. | This behavior is a reflection of Hyper-V. Hyper-V always shows 10 Gbps for virtual network adapters. |
| **6.** | Tiered volumes or shares | Byte range locking for applications that work with the StorSimple tiered volumes is not supported. If byte range locking is enabled, StorSimple tiering will not work. | Recommended measures include: <br></br>Turn off byte range locking in your application logic.<br></br>Choose to put data for this application in locally pinned volumes as opposed to tiered volumes.<br></br>*Caveat*: If using locally pinned volumes and byte range locking is enabled, be aware that the locally pinned volume can be online even before the restore is complete. In such instances, if a restore is in progress, then you must wait for the restore to complete. |
| **7.** | Tiered shares | Working with large files could result in slow tier out. | When working with large files, we recommend that the largest file is smaller than 3% of the share size. |
| **8.** | Used capacity for shares | You may see share consumption in the absence of any data on the share. This is because the used capacity for shares includes metadata. |   |
| **9.** | Disaster recovery | You can only perform the disaster recovery of a file server to the same domain as that of the source device. Disaster recovery to a target device in another domain is not supported in this release. | This will be implemented in a later release. |
| **10.** | Azure PowerShell | The StorSimple virtual devices cannot be managed through the Azure PowerShell in this release. | All the management of the virtual devices should be done through the Azure classic portal and the local web UI. |
| **11.** | Password change | The virtual array device console only accepts input in en-US keyboard format. |   |
| **12.** | CHAP | CHAP credentials once created cannot be removed. Additionally, if you modify the CHAP credentials, you will need to take the volumes offline and then bring them online for the change to take effect. | These will be addressed in a later release. |
| **13.** | iSCSI server  | The 'Used storage' displayed for an iSCSI volume may be different in the StorSimple Manager service and the iSCSI host. | The iSCSI host has the filesystem  view.<br></br>The device sees the blocks allocated when the volume was at the maximum size.|
| **14.** | File server*  | If a file in a folder has an Alternate Data Stream (ADS) associated with it, the ADS is not backed up or restored via disaster recovery, clone, and Item Level Recovery.| |


## Next step

[Install Updates](storsimple-ova-install-update-01.md) on your StorSimple Virtual Array.
