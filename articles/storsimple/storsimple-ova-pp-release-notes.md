<properties 
   pageTitle="StorSimple Virtual Array release notes| Microsoft Azure"
   description="Describes critical open issues and resolutions for the StorSimple Virtual Array."
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
   ms.date="05/13/2016"
   ms.author="alkohli" />

# StorSimple Virtual Array release notes

## Overview

The following release notes identify the critical open issues for the March 2016 general availability (GA) release of the Microsoft Azure StorSimple Virtual Array (also known as the StorSimple on-premises virtual device or the StorSimple virtual device). This release corresponds to software version 10.0.10271.0.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they are added. Before you deploy your StorSimple virtual device, carefully review the information contained in the release notes. 

The following table provides a summary of known issues in this release.


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
