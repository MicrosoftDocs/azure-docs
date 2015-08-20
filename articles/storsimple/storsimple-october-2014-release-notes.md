<properties 
    pageTitle="StorSimple 8000 Series Update 0.1 release notes – October 2014 | Microsoft Azure"
    description="Describes the new features, issues, and workarounds for the October 2014 StorSimple release."
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

# StorSimple 8000 Series Update 0.1 release notes – October 2014  

## Overview

The following release notes identify the critical open issues for StorSimple 8000 Series Update 0.1 released in October 2014. They also contain a list of the StorSimple software and firmware updates included in this release. This is the first release after the StorSimple 8000 Series Release version was made generally available in July 2014 and corresponds to software version 6.3.9600.17312.  

We recommend that you scan for and apply any available updates immediately after you install the device. You can also turn on automatic updates to download and install high-priority updates from Microsoft as soon as they are released. For more information, see how to [Update your StorSimple device](storsimple-update-device.md).  

Please review the information contained in the release notes before you deploy the updates in your StorSimple solution.  

>[AZURE.IMPORTANT]
> 
-	Use the StorSimple Manager service and not Windows PowerShell for StorSimple to install the October updates.  
-	The updates typically take about 3 hours to complete.  
-	The October release of StorSimple does not contain any updates to the StorSimple virtual device. You can still apply any available Windows updates, including recent security fixes, but you will not see a change in version for the virtual device.  

Make sure the following prerequisites are met prior to updating your StorSimple device.  

- Ensure that both device controllers are running before you scan for updates. If either controller is not running, the scan will fail. To verify that the controllers are in a healthy state, navigate to **Hardware Status** under the **Maintenance** page. If there are components that **Need attention**, contact Microsoft Support before proceeding any further.  
- Ensure that fixed IPs for both Controller 0 and Controller 1 are routable and can connect to the Internet as these are used for servicing the updates to the device. You can use the [Test-Connection cmdlet](https://technet.microsoft.com/library/hh849808.aspx) to ping a known address outside of the network such as outlook.com, to verify that the controller has connectivity to the outside network.  
- Ensure that ports 80 and 443 are available on your StorSimple device for outbound communication. For more information, see the [Networking requirements for your StorSimple device](storsimple-system-requirements.md#networking-requirements-for-your-storsimple-device).  
- If the device software version is older than 6.3.9600.17312 (October 2014 update), disable the Data 2 and Data 3 ports, if enabled, before starting the update. If you leave the Data 2 or Data 3 ports enabled when applying the update, it may cause your device controller to go into recovery mode. Please note that when you disable the network interfaces, all the associated volumes will be taken offline and the I/Os will be disrupted for the duration of the update.  

## What's new in the October release

This update includes the following improvements:

- You can now use the StorSimple Manager service UI to manage your device controllers. The management actions include restart, shutdown, or turn on a controller. For more information, go to [Manage StorSimple device controllers](storsimple-manage-device-controller.md).  
- You can schedule WAN bandwidth allocation according to day-of-the-week and time-of-day combinations. This allows you to make better use of WAN bandwidth during off-peak hours. Different bandwidth templates are permitted for different volume containers. For more information, go to [Manage your StorSimple bandwidth templates](storsimple-manage-bandwidth-templates.md).  
- You can configure email notifications to proactively notify the administrator(s) and others of existing or possibly upcoming issues. For more information, go to [Configure alert settings](storsimple-manage-alerts.md#configure-alert-settings).  

## Issues fixed in the October release


The following table provides a summary of issues that were fixed in this update.  

| No. | Feature | Issue | Applies to physical device | Applies to virtual device |
|-----|---------|-------|---------------------------------|--------------------------------|
| 1 | Network interfaces | In the previous release, the network interfaces DATA 2 and DATA 3 were swapped in the software. This has been fixed in this update. Please clear the settings and disable these network interfaces before you install the update. After installing the update, you will have to reconfigure these interfaces. | Yes | No |
| 2 | Support package | In the previous release, if you ran the Windows PowerShell **Export-HcsSupportPackage** cmdlet to retrieve the Baseboard Management Controller (BMC) logs, the operation failed with the following warning: "The operation succeeded on this controller, but failed on the peer controller due to the following error(s). Please check whether the peer is healthy and whether the current node can connect to the peer." This issue is now fixed. | Yes | No |
| 3 | Device failover | In the previous release, there was a chance of data inconsistency if a **discover backup** job failed during a device failover. This issue is now fixed. | Yes | No |
| 4 | Device failover | In the previous release, after a device failover, backups were visible but the associated volume container was not present on the target device. This issue is now fixed. | Yes | No |
| 5 | Device failover | In the previous release, there was a bug in the enumeration of cloud backups during the registry-restore operation that could potentially lead to data inconsistency if there were cloud connectivity issues. | Yes | No |
| 6 | Firmware update | In the previous release, the device firmware update job failed and displayed an error which stated that the cmdlets were not recognizable, and that the update failed as a result. The controller then went into recovery mode. This issue is now fixed. | Yes | No |
| 7 | Installation | Errors caused by the device not being imaged correctly during installation have now been fixed. | Yes | No |
| 8 | Factory reset | You can now optionally skip the firmware check for factory reset. This is a change from the previous release. | Yes | No |
| 9 | Factory reset | In the previous release, when a factory reset cmdlet was run, firmware version checks were made only for some hardware components. Additional firmware checks were made after the first reboot in the process, which could cause the reset to fail. This fix ensures that all the firmware checks are made when the factory reset cmdlet is run and before the first system reboot. | Yes | No |
| 10 | Storage account key rotation | The **Invoke-HcsmServiceDataEncryptionKeyChange** cmdlet used to rotate the storage account keys now prompts the user to enter the service data encryption key. This is a change from the previous release in which the service data encryption key was passed as an inline parameter. | Yes | No |
| 11 | Failback within 24 hours | During disaster recovery, the cleanup on the source device did not happen cleanly, causing failback to fail. This has been fixed in this release. | Yes | No |

## Known issues in the October release

The following table provides a summary of known issues in this release.

| No. | Feature | Issue | Comments/workaround | Applies to physical device | Applies to virtual device |
|-----|---------|-------|----------------------------|----------------------------|---------------------------|
| 1 | Factory reset | In some instances, when you perform a factory reset, the StorSimple device may be stuck and display this message: **Reset to factory is in progress (phase 8)**. This happens if you press CTRL+C while the cmdlet is in progress. | Do not press CTRL+C after initiating a factory reset. If you are already in this state, please contact Microsoft Support for next steps. | Yes | No |
| 2 | Factory reset | Do not factory reset a StorSimple device that is updated from GA to October 2014 release. | This operation will only work if a patch is installed. Contact Microsoft Support to get this required patch. | Yes | |	
| 3 | Disk quorum | In rare instances, if the majority of disks in the EBOD enclosure of an 8600device are disconnected resulting in no disk quorum, then the storage pool will be offline. It will stay offline even if the disks are reconnected. | You will need to reboot the device. If the issue persists, please contact Microsoft Support for next steps. | Yes | No |
| 4 | Cloud snapshot failures | In rare instances, a cloud snapshot may fail with the error **Maximum backup limit reached**. This occurs if you exceed 255 online clones on the same device, from the same original volume which has been deleted. | | Yes | Yes |
| 5 | Incorrect controller ID | When a controller replacement is performed, controller 0 may show up as controller 1. During controller replacement, when the image is loaded from the peer node, the controller ID can show up initially as the peer controller’s ID. In rare instances, this behavior may also be seen after a system reboot.	No user action is required. This situation will resolve itself after the controller replacement is complete. | Yes | No |
| 6 | Device monitoring charts | In the StorSimple Manager service, the device monitoring charts do not work when Basic or NTLM authentication is enabled in the proxy server configuration for the device. | Modify the web proxy configuration for the device registered with your StorSimple Manager service so that authentication is set to NONE. To do this, run the the Windows PowerShell for StorSimple Set-HcsWebProxy cmdlet. | Yes | Yes |
| 7 | Storage accounts | Using the Storage service to delete the storage account is an unsupported scenario. This will lead to a situation in which user data cannot be retrieved. | Yes | Yes |
| 8 | Device failover | Multiple failovers of a volume container from the same source device to different target devices is not supported. | Failover from a single dead device to multiple devices will make the volume containers on the first failed over device lose data ownership. After such a failover, these volume containers will appear or behave differently when you view them in the Management Portal. | Yes | No |
| 9 | Installation | During StorSimple Adapter for SharePoint installation, you need to provide a device IP in order for the install to finish successfully.	| | Yes | No |
| 10 | Web proxy | If your web proxy configuration has HTTPS as the specified protocol, then your device-to-service communication will be affected and the device will go offline. Support packages will also be generated in the process, consuming significant resources on your device. | Make sure that the web proxy URL has HTTP as the specified protocol. More information on how to [Configure web proxy for your device](storsimple-configure-web-proxy.md). | Yes | No |
| 11 | Web proxy | If you configure and enable web proxy on a registered device, then you will need to restart the active controller on your device. | | Yes | No |
| 12 | High cloud latency and high I/O workload | When your StorSimple device encounters a combination of very high cloud latencies (order of seconds) and high I/O workload, the device volumes go into a degraded state and the I/Os may fail with a "device not ready" error. | You will need to manually reboot the device controllers or perform a device failover to recover from this situation. | Yes | No |

## Physical device updates in the October release

When these updates are applied to a physical device, the software version will change to 6.3.9600.17312. Unless otherwise specified, these release notes apply to all models of the StorSimple device. For more information about these updates, see [October 2014 physical appliance software update for Microsoft Azure StorSimple Appliance](http://support.microsoft.com/kb/2986997).  

## Serial-attached SCSI (SAS) controller and firmware updates in the October release

This release updates the driver and the firmware on the SAS controller of your physical device. For more information about the SAS controller update, see [October 2014 update for LSI SAS controllers in Microsoft Azure StorSimple Appliance](http://support.microsoft.com/kb/2987020).   

This release also applies a cumulative firmware update that addresses reliability issues with the device hardware components. For more information about the firmware update, see [October 2014 firmware update for Microsoft Azure StorSimple Appliance](http://support.microsoft.com/kb/2987015).  

## Virtual device updates in the October release

This release does not contain any updates for the virtual device. Applying this update will not change the software version of a virtual device.
 