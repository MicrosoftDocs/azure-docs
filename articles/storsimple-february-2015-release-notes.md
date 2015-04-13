<properties 
    pageTitle="StorSimple release notes - February 2015"
    description="Describes the new features, issues, and workarounds for the February 2015 StorSimple release."
    services="storsimple"
    documentationCenter="NA"
    authors="SharS"
    manager="adinah"
    editor="tysonn" />
 <tags 
    ms.service="storsimple"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="NA"
    ms.workload="TBD"
    ms.date="04/13/2015"
    ms.author="v-sharos" />

# StorSimple release notes - February 2015

## Overview

The following release notes identify the critical open issues for the February 2015 release of Microsoft Azure StorSimple. They also contain a list of the StorSimple software and firmware updates included in this release. This is the third release after the General Availability (GA) release of Microsoft Azure StorSimple.
  
This update does not change the device software version from the January update. It continues to be version 6.3.9600.17312. You can confirm that the update has been installed by checking the **Last Updated** date. If the date is 2/10/2015 or later, then the update has been installed successfully.  

We recommend that you scan for and apply any available updates immediately after you install your StorSimple device. You can also turn on automatic updates to download and install high-priority updates from Microsoft as soon as they are released. For more information, see how to install [Updates](https://msdn.microsoft.com/library/azure/1a2cd7de-706b-4d3c-8efb-02e322d3ae73#BKMK_Updates).  

Please review the information contained in the release notes before you deploy the update in your StorSimple solution.  

>[AZURE.IMPORTANT]   
>
> - Use the StorSimple Manager service and not Windows PowerShell for StorSimple to install the February update.   
> - It takes approximately an hour to install this update. However, if you are installing cumulative updates, the process can take about 3 hours to complete.  
> -	The February release of StorSimple does not contain any updates to the StorSimple virtual device. You can still apply any available Windows updates to the virtual device, including recent security fixes, but you will not see a change in version for the virtual device.  

Make sure that the following prerequisites are met prior to updating your StorSimple device.  

- Ensure that both device controllers are running before you scan for updates. If either controller is not running, the scan will fail. To verify that the controllers are in a healthy state, navigate to **Hardware Status** under the **Maintenance** page. If there are components that **Need attention**, contact Microsoft Support before proceeding any further.
- Ensure that fixed IPs for both controller 0 and controller 1 are routable and can connect to the Internet as these are used for servicing the updates to the device. You can use the [Test-Connection cmdlet](https://technet.microsoft.com/library/hh849808.aspx) to ping a known address outside of the network, such as outlook.com, to verify that the controller has connectivity to the outside network.
- Ensure that ports 80 and 443 are available on your StorSimple device for outbound communication. For more information, see the [Networking requirements for StorSimple device](https://msdn.microsoft.com/library/azure/dn772371.aspx).
- If the device software version is older than 6.3.9600.17312 (October 2014 update), disable the Data 2 and Data 3 ports, if enabled, before starting the update. Leaving the Data 2 or Data 3 ports enabled when you apply the update might cause your device controller to go into recovery mode. Please note that when you disable the network interfaces, all the associated volumes will be taken offline and the I/Os will be disrupted for the duration of the update.  
  
## What's new in the February release

This update contains a fix for the factory reset issue that occurred on devices that had been upgraded from the GA release to the October 2014 release. For more information, see [Issues fixed in this release](#issues-fixed-in-the-february-release).   

This update does not contain new features or functionality.  

## Issues fixed in the February release

The following table describes the issue that was fixed in this update.  
 
| No. | Feature | Issue | Applies to physical device | Applies to virtual device |
|-----|---------|-------|---------------------------------|-------------------------------|
| 1 | Factory reset | You try to perform a factory reset on a device that originally had the GA release (version 6.3.9600.17215) installed but has been updated to the October release (version 6.3.9600.17312). The factory reset fails and the device becomes unstable. | Yes | No |


## Known issues in the February release

The following table provides a summary of known issues in this release.
 
| No. | Feature | Issue | Comments/workaround | Applies to physical device  | Applies to virtual device |
|-----|---------|-------|----------------------------|-----------------------------|--------------------------|
| 1 | Factory reset | In some instances, when you perform a factory reset, the StorSimple device may be stuck and display this message: **Reset to factory is in progress (phase 8)**. This happens if you press CTRL+C while the cmdlet is in progress. | Do not press CTRL+C after initiating a factory reset. If you are already in this state, please contact Microsoft Support for next steps. | Yes | No |
| 2 | Disk quorum | In rare instances, if the majority of disks in the EBOD enclosure of an 8600device are disconnected resulting in no disk quorum, then the storage pool will be offline. It will stay offline even if the disks are reconnected. | You will need to reboot the device. If the issue persists, please contact Microsoft Support for next steps. | Yes | No |
| 3 | Cloud snapshot failures | In rare instances, a cloud snapshot may fail with the error **Maximum backup limit reached**. This occurs if you exceed 255 online clones on the same device, from the same original volume which has been deleted.	|  | Yes | Yes |
| 4 | Incorrect controller ID | When a controller replacement is performed, controller 0 may show up as controller 1. During controller replacement, when the image is loaded from the peer node, the controller ID can show up initially as the peer controller’s ID. In rare instances, this behavior may also be seen after a system reboot. | No user action is required. This situation will resolve itself after the controller replacement is complete. | Yes | No |
| 5 | Device monitoring charts | In the StorSimple Manager service, the device monitoring charts do not work when Basic or NTLM authentication is enabled in the proxy server configuration for the device. | Modify the web proxy configuration for the device registered with your StorSimple Manager service so that authentication is set to NONE. To do this, run the the Windows PowerShell for StorSimple Set-HcsWebProxy cmdlet. | Yes | Yes |
| 6 | Storage accounts | Using the Storage service to delete the storage account is an unsupported scenario. This will lead to a situation in which user data cannot be retrieved. |  | Yes | Yes |
| 7 | Device failover | Multiple failovers of a volume container from the same source device to different target devices is not supported.	Failover from a single dead device to multiple devices will make the volume containers on the first failed over device lose data ownership. After such a failover, these volume containers will appear or behave differently when you view them in the Management Portal. | Yes | No |
| 8 | Installation | During StorSimple Adapter for SharePoint installation, you need to provide a device IP in order for the install to finish successfully. |  | Yes | No |
| 9 | Web proxy | If your web proxy configuration has HTTPS as the specified protocol, then your device-to-service communication will be affected and the device will go offline. Support packages will also be generated in the process, consuming significant resources on your device. | Make sure that the web proxy URL has HTTP as the specified protocol. More information on how to [Configure web proxy for your device](https://msdn.microsoft.com/library/azure/dn764937.aspx). | Yes | No |
| 10 | Web proxy | If you configure and enable web proxy on a registered device, then you will need to restart the active controller on your device. |  | Yes | No |
| 11 | High cloud latency and high I/O workload | When your StorSimple device encounters a combination of very high cloud latencies (order of seconds) and high I/O workload, the device volumes go into a degraded state and the I/Os may fail with a "device not ready" error. | You will need to manually reboot the device controllers or perform a device failover to recover from this situation. | Yes | No |

## Physical device updates in the February release

This update fixes the factory reset issue that occurred on devices that had been upgraded from the GA release to the October 2014 release. It does not contain any other updates to the StorSimple device.  

## Serial-attached SCSI (SAS) controller and firmware updates in the February release

This release does not contain any updates to the serial-attached SCSI (SAS) controller or the firmware. The driver update was in the October, 2014 release.  

## Virtual device updates in the February release

This release does not contain any updates for the virtual device. Applying this update will not change the software version of a virtual device.
