<properties 
    pageTitle="StorSimple 8000 Series Release Version release notes - July 2014 | Microsoft Azure"
    description="Describes the new features, issues, and workarounds for the July 2014 Microsoft Azure StorSimple release."
    services="storsimple"
    documentationCenter="NA"
    authors="SharS"
    manager="carolz"
    editor="" />
 <tags 
    ms.service="storsimple"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="NA"
    ms.workload="TBD"
    ms.date="08/19/2015"
    ms.author="v-sharos" />

# StorSimple 8000 Series Release Version release notes - July 2014 

## Overview

The follow release notes identify the critical open issues for the StorSimple 8000 Series July 2014 general availability (GA) release of Microsoft Azure StorSimple. This release corresponds to software version 6.3.9600.17215.  

Unless otherwise specified, these release notes apply to all models of the StorSimple device. The release notes are continuously updated; as critical issues requiring a workaround are discovered, they are added. Before you deploy your Microsoft Azure StorSimple solution, consider the following information.  

## Known issues in this release
The following table provides a summary of known issues in this release.  
 
| No. | Feature | Issue | Comments/workaround | Applies to physical device | Applies to virtual device |
|-----|---------|-------|----------------------------|----------------------------|---------------------------|
| 1 | Factory reset | In some instances, when you perform a factory reset, the StorSimple device may be stuck and display this message: **Reset to factory is in progress (phase 8)**. This happens if you press CTRL+C while the cmdlet is in progress. | Do not press CTRL+C after initiating a factory reset. If you are already in this state, please contact Microsoft Support for next steps. | Yes | No |
| 2 | Disk quorum | In rare instances, if the majority of disks in the EBOD enclosure of an 8600 device are disconnected resulting in no disk quorum, then the storage pool will be offline. It will stay offline even if the disks are reconnected. | You will need to reboot the device. If the issue persists, please contact Microsoft Support for next steps. | Yes | No |
| 3 | Cloud snapshot failures | In rare instances, a cloud snapshot may fail with the error **Maximum backup limit reached**. This occurs if you exceed 255 online clones on the same device, from the same original volume which has been deleted. | | Yes | Yes |
| 4 | Incorrect controller ID | When a controller replacement is performed, controller 0 may show up as controller 1. During controller replacement, when the image is loaded from the peer node, the controller ID can show up initially as the peer controller’s ID. In rare instances, this behavior may also be seen after a system reboot. | No user action is required. This situation will resolve itself after the controller replacement is complete. | Yes | No |
| 5 | Device monitoring charts | In the StorSimple Manager service, the device monitoring charts do not work when Basic or NTLM authentication is enabled in the proxy server configuration for the device. | Modify the web proxy configuration for the device registered with your StorSimple Manager service so that authentication is set to NONE. To do this, run the the Windows PowerShell for StorSimple Set-HcsWebProxy cmdlet. | Yes | Yes |
| 6 | Storage accounts | Using the Storage service to delete the storage account is an unsupported scenario. This will lead to a situation in which user data cannot be retrieved. | | Yes | Yes |
| 7 | Failback | A failback within 24 hours of disaster recovery (DR) is not supported. | | Yes | No |
| 8 | Device failover | Multiple failovers of a volume container from the same source device to different target devices is not supported. Failover from a single dead device to multiple devices will make the volume containers on the first failed over device lose data ownership. After such a failover, these volume containers will appear or behave differently when you view them in the Management Portal. | | Yes | No |
| 9 | Installation | During StorSimple Adapter for SharePoint installation, you need to provide a device IP for the install to finish successfully. | | Yes | No |
| 10 | Network interfaces | Network interfaces DATA 2 and DATA 3 were swapped in the software. | Please contact Microsoft Support if you need to configure these interfaces. | Yes | No |


 