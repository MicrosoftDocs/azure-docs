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
   ms.date="12/30/2015"
   ms.author="alkohli" />

# StorSimple Virtual Array release notes (preview) 

## Overview

The following release notes identify the critical open issues for the December 2015 Public Preview release of the Microsoft Azure StorSimple Virtual Array (also known as the StorSimple on-premises virtual device or the StorSimple virtual device). 

The release notes are continuously updated; as critical issues requiring a workaround are discovered, they are added. Before you deploy your StorSimple virtual device, carefully review the information contained in the release notes. 

>[AZURE.IMPORTANT] 
>
>- The StorSimple Virtual Array is in preview, and is intended for evaluation and deployment planning purposes. Installing this preview in a production environment is not supported. 
>
>- If you experience any issues with the StorSimple Virtual Array, please post the issues on the [StorSimple MSDN forum](https://social.msdn.microsoft.com/Forums/home?forum=StorSimple).

The following table provides a summary of known issues in this release.

| No.| Feature | Issue | Workaround/comments |
|----|---------|-------|---------------------|                                                                                                                                                                                                                                                      
| **1.**  | Updates  | The virtual devices created in the preview release cannot be updated to a supported General Availability version.| These virtual devices must be failed over for the General Availability release using a disaster recovery (DR) workflow.|
| **2.**  | Tiered volumes or shares | Byte range locking for applications that work with the StorSimple tiered volumes is not supported. If byte range locking is enabled, StorSimple tiering will not work. | Recommended measures include:<ul><li>Turn off byte range locking in your application logic.</li><li>                                                                                                                                                                                                                    Choose to put data for this application in locally pinned volumes as opposed to  tiered volumes.</li>*Caveat*: If using locally pinned volumes and byte range locking is enabled, be aware that the locally pinned volume can be online even before the restore is complete. In such instances, if a restore is in progress, then you must wait for the restore to complete.|
| **3.**  | Tiered shares | Working with large files could result in slow tier out. | When working with large files, ensure that the largest file is smaller than 3% of the share size.|
| **4.**   | Locally pinned volumes or shares | The usable capacity of a locally pinned volume or share is 85-90% of the provisioned capacity. The 10-15% range is reserved for the metadata. | You will need to provision a volume of larger size to get the desired usable capacity. For example, for a 1 TB usable capacity, you may need to provision a volume of 1.15 TB.|
| **5.**  | Local web UI | If enhanced security features are enabled in Internet Explorer (IE ESC), some local web UI pages such as **Troubleshooting** or **Maintenance** may not work properly. Buttons on these pages may also not work. | Turn off enhanced security features in Internet Explorer.|
| **6.** | Local web UI | Localization for local web UI is not supported for this release. | This will be implemented in a later release.|
| **7.** | Local web UI  | In a Hyper-V virtual machine, the network interfaces in the web UI are displayed as 10 Gbps interfaces. | This behavior is a reflection of Hyper-V. Hyper-V always shows 10 Gbps for virtual network adapters.|                                                                                                 
| **8.** | Disaster recovery | You can only perform the disaster recovery of a file server to the same domain as that of the source device. Disaster recovery to a target device in another domain is not supported in this release. | This will be implemented in a later release.|
| **9.**| Used capacity for shares| You may see share consumption in the absence of any data on the share. This is because the used capacity for shares includes metadata.  | |                                                                                                                                                                                                                                                         
| **10.** | Time zone settings| If the time zone is changed for a registered device, the change is not reflected in the diagnostic tests run through the local web UI. | This issue will be addressed in a later release.|
| **11.** | Network settings | When a static IP address is configured for a network interface via the web UI, the IP change occurs. However, the DNS server IP is also modified to an IPv6 site local address. | This issue will be addressed in a later release.|
| **12.** | Azure PowerShell | The StorSimple virtual devices cannot be managed through the Azure PowerShell in this release. | All the management of the virtual devices should be done through the Azure classic portal and the local web UI.|
| **13.** | Jobs | Job progress is not granular. The job progress may jump from 0 to 100% directly. | This will be addressed in a later release.|
| **14.**  | Provisioned data disk | Once you have provisioned a data disk of a certain specified size and created the corresponding StorSimple virtual device, you must not expand or shrink the data disk. Attempting to do so may result in a a loss of all the data in the local tiers of the device. |   |
| **15.** | Help drawer | Help drawer topics will not be available.| All the documentation is available through the Microsoft Download Center and the Azure documentation site. |   