<properties 
    pageTitle="StorSimple 8000 Series Update 0.2 release notes - January 2015 | Microsoft Azure"
    description="Describes the new features, issues, and workarounds for the January 2015 Microsoft Azure StorSimple release."
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


# StorSimple 8000 Series Update 0.2 release notes - January 2015

## Overview

The following release notes identify the critical open issues for the January 2015 release of Microsoft Azure StorSimple. They also contain a list of the StorSimple software and firmware updates included in this release. This is the second release after the StorSimple 8000 Series Release version was made generally available in July 2014.
  
This update does not change the physical device software version from the October update. It continues to be version 6.3.9600.17312. The image used by the virtual device image has changed in this release. Therefore, all the new virtual devices created after 1/20/2015 will show the version as 6.3.9600.17361.  

Please review the following information contained in the release notes for the January 2015 update.

> [AZURE.IMPORTANT]  
>
>- This update is not available through Windows Update and cannot be installed like other updates. Your device will not receive this update even if you have applied the updates using the Management Portal. This update will only apply to virtual devices created after January 20, 2015. 
> 
>- The January release of StorSimple does not contain any updates to the StorSimple physical device. You can still apply any available Windows updates to the virtual device, including recent security fixes, but you will not see a change in version for the StorSimple physical device.

## What's new in the January release

This update contains a fix related to the volumes going offline on the virtual device. (See [Issues fixed in this release](#issues-fixed-in-the-january-release).)  

The update does not contain new features or functionality.  

## Issues fixed in the January release

The following table describes the issue that was fixed in this update.

|No.|Feature|Issue|Applies to physical device|Applies to virtual device 
|---|-------|-----|--------------------------|-------------------------
|1|Volumes going offline|When high cloud latencies persist for several minutes, the StorSimple virtual device volumes go offline on the hosts. This fix increases the threshold for cloud latencies, thereby minimizing the situations that would cause the volumes to go offline on hosts.|No|Yes  

## Known issues in the January release

The following table provides a summary of known issues in this release.
 
|No.|Feature|Issue|Comments/workaround|Applies to physical device|Applies to virtual device 
|---|-------|-----|-------------------|--------------------------|-------------------------
|1|	Factory reset|	In some instances, when you perform a factory reset, the StorSimple device may be stuck and display this message: **Reset to factory is in progress (phase 8).** This happens if you press CTRL+C while the cmdlet is in progress.|	Do not press CTRL+C after initiating a factory reset. If you are already in this state, please contact Microsoft Support for next steps.|Yes|No|
|2|Disk quorum|	In rare instances, if the majority of disks in the EBOD enclosure of an 8600device are disconnected resulting in no disk quorum, then the storage pool will be offline. It will stay offline even if the disks are reconnected.|You will need to reboot the device. If the issue persists, please contact Microsoft Support for next steps.|Yes |No
|3|Cloud snapshot failures|In rare instances, a cloud snapshot may fail with the error **Maximum backup limit reached**. This occurs if you exceed 255 online clones on the same device, from the same original volume which has been deleted.||Yes|Yes
|4|Incorrect controller ID|When a controller replacement is performed, controller 0 may show up as controller 1. During controller replacement, when the image is loaded from the peer node, the controller ID can show up initially as the peer controller’s ID.  In rare instances, this behavior may also be seen after a system reboot.|No user action is required. This situation will resolve itself after the controller replacement is complete.|Yes|No 
|5|	Device monitoring charts|In the StorSimple Manager service, the device monitoring charts do not work when Basic or NTLM authentication is enabled in the proxy server configuration for the device.|Modify the web proxy configuration for the device registered with your StorSimple Manager service so that authentication is set to NONE. To do this, run the the Windows PowerShell for StorSimple Set-HcsWebProxy cmdlet.|Yes|Yes
|6|	Storage accounts|Using the Storage service to delete the storage account is an unsupported scenario. This will lead to a situation in which user data cannot be retrieved.|| Yes |	Yes
|7|Device failover|	Multiple failovers of a volume container from the same source device to different target devices is not supported.|	Failover from a single dead device to multiple devices will make the volume containers on the first failed over device lose data ownership. After such a failover, these volume containers will appear or behave differently when you view them in the Management Portal.|Yes|No
|8|	Installation|During StorSimple Adapter for SharePoint installation, you need to provide a device IP in order for the install to finish successfully.||Yes|No
|9|	Web proxy|If your web proxy configuration has HTTPS as the specified protocol, then your device-to-service communication will be affected and the device will go offline. Support packages will also be generated in the process, consuming significant resources on your device.|Make sure that the web proxy URL has HTTP as the specified protocol. More information on how to [Configure web proxy for your device](storsimple-configure-web-proxy.md).|Yes	|No
|10|Web proxy|	If you configure and enable web proxy on a registered device, then you will need to restart the active controller on your device.||	Yes |No
|11|High cloud latency and high I/O workload|When your StorSimple device encounters a combination of very high cloud latencies (order of seconds) and high I/O workload, the device volumes go into a degraded state and the I/Os may fail with a "device not ready" error.|You will need to manually reboot the device controllers or perform a device failover to recover from this situation.|Yes|No

## Physical device updates in the January release

This update does not contain any other changes to the StorSimple device.

## Serial-attached SCSI (SAS) controller and firmware updates in the January release

This release does not contain any updates to the serial-attached SCSI (SAS) controller or the firmware. The driver update was in the October, 2014 release. 

## Virtual device updates in the January release

This release contains an updated image for the virtual device. All the virtual devices created after January 20, 2015 will show the software version as 6.3.9600.17361.

 