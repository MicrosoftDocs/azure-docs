---
title: StorSimple 8000 Series Update 1.2 release notes | Microsoft Docs
description: Describes the new features, issues, and workarounds for StorSimple 8000 Series Update 1.2.
services: storsimple
documentationcenter: NA
author: alkohli
manager: timlt
editor: ''

ms.assetid: 6c9aae87-6f77-44b8-b7fa-ebbdc9d8517c
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 11/03/2017
ms.author: alkohli
ms.custom: H1Hack27Feb2017

---
# Update 1.2 release notes for your StorSimple 8000 series device

## Overview
The following release notes describe the new features and identify the critical open issues for StorSimple 8000 Series Update 1.2. They also contain a list of the StorSimple software, driver and disk firmware updates included in this release. 

Update 1.2 can be applied to any StorSimple device running Release (GA), Update 0.1, Update 0.2, or Update 0.3 software. Update 1.2 is not available if your device is running Update 1 or Update 1.1. If your device is running Release (GA), please [contact Microsoft Support](storsimple-contact-microsoft-support.md) to assist you with installing this update.

The following table lists the device software versions corresponding to Updates 1, 1.1, and 1.2.

| If running update … | this is your device software version. |
| --- | --- |
| Update 1.2 |6.3.9600.17584 |
| Update 1.1 |6.3.9600.17521 |
| Update 1.0 |6.3.9600.17491 |

Please review the information contained in the release notes before you deploy the update in your StorSimple solution. For more information, see how to [install Update 1.2 on your StorSimple device](storsimple-install-update-1.md). 

> [!IMPORTANT]
> * It takes approximately 5-10 hours to install this update (including the Windows Updates). 
> * Update 1.2 has software, LSI driver and disk firmware updates. To install, follow the instructions in [install Update 1.2 on your StorSimple device](storsimple-install-update-1.md).
> * For new releases, you may not see updates immediately because we do a phased rollout of the updates. Scan for updates in a few days again as these will become available soon.
> 
> 

## What's new in Update 1.2
These features were first released with Update 1 that was made available to a limited set of users. With the Update 1.2 release, most of the StorSimple users would see the following new features and improvements:

* **Migration from 5000-7000 series to 8000 series devices** – This release introduces a new migration feature that allows the StorSimple 5000-7000 series appliance users to migrate their data to a StorSimple 8000 series physical appliance or a virtual appliance. The migration feature has two key value propositions:                                                                  
  
  * **Business continuity**, by enabling migration of existing data on 5000-7000 series appliances to 8000 series appliances.
  * **Improved feature offerings of the 8000 series appliances**, such as efficient centralized management of multiple appliances through StorSimple Manager service, better class of hardware and updated firmware, virtual appliances, data mobility, and features in the future roadmap.
    
    Refer to the [migration guide](https://gallery.technet.microsoft.com/Azure-StorSimple-50007000-c1a0460b) for details on how to migrate a StorSimple 5000-7000 series to an 8000 series device. 
* **Availability in the Azure Government Portal** – StorSimple is now available in the Azure Government portal. See how to [deploy a StorSimple device in the Azure Government Portal](storsimple-deployment-walkthrough-gov.md).
* **Support for other cloud service providers** – The other cloud service providers supported are Amazon S3, Amazon S3 with RRS, HP, and OpenStack (beta).
* **Update to latest Storage APIs** – With this release, StorSimple has been updated to the latest Azure Storage service APIs. StorSimple 8000 series devices that are running pre-Update 1 software versions (Release, 0.1, 0.2, and 0.3) are using versions of the Azure Storage Service APIs older than July 17, 2009. As stated in the updated [announcement about removal of Storage service versions](https://blogs.msdn.com/b/windowsazurestorage/archive/2015/10/19/microsoft-azure-storage-service-version-removal-update-extension-to-2016.aspx), by August 1, 2016, these APIs will be deprecated. It is imperative that you apply the StorSimple 8000 Series Update 1 prior to August 1, 2016. If you fail to do so, StorSimple devices will stop functioning correctly.
* **Support for Zone Redundant Storage (ZRS)** – With the upgrade to the latest version of the Storage APIs, the StorSimple 8000 series will support Zone Redundant Storage (ZRS) in addition to Locally Redundant Storage (LRS) and Geo-redundant Storage (GRS). Refer to this [article on Azure Storage redundancy options](../storage/common/storage-redundancy.md) for ZRS details.
* **Enhanced initial deployment and update experience** – In this release, the installation and update processes have been enhanced. The installation through the setup wizard is improved to provide feedback to the user if the network configuration and firewall settings are incorrect. Additional diagnostic cmdlets have been provided to help you with troubleshooting networking of the device. See the [troubleshooting deployment article](storsimple-troubleshoot-deployment.md) for more information about the new diagnostic cmdlets used for troubleshooting.

## Issues fixed in Update 1.2
The following table provides a summary of issues that were fixed in Updates 1.2, 1.1, and 1.    

| No. | Feature | Issue | Fixed in Update | Applies to physical device | Applies to virtual device |
| --- | --- | --- | --- | --- | --- |
| 1 |Windows PowerShell for StorSimple |When a user remotely accessed the StorSimple device by using Windows PowerShell for StorSimple and then started the setup wizard, a crash occurred as soon as Data 0 IP was input. This bug is now fixed in Update 1. |Update 1 |Yes |Yes |
| 2 |Factory reset |In some instances, when you performed a factory reset, the StorSimple device became stuck and displayed this message: **Reset to factory is in progress (phase 8)**. This happened if you pressed CTRL+C while the cmdlet was in progress. This bug is now fixed. |Update 1 |Yes |No |
| 3 |Factory reset |After a failed dual controller factory reset, you were allowed to proceed with device registration. This resulted in an unsupported system configuration. In Update 1, an error message is shown and registration is blocked on a device that has a failed factory reset. |Update 1 |Yes |No |
| 4 |Factory reset |In some instances, false positive mismatch alerts were raised. Incorrect mismatch alerts will no longer be generated on devices running Update 1. |Update 1 |Yes |No |
| 5 |Factory reset |If a factory reset was interrupted prior to completion, the device entered recovery mode and did not allow you to access Windows PowerShell for StorSimple. This bug is now fixed. |Update 1 |Yes |No |
| 6 |Disaster recovery |A disaster recovery (DR) bug was fixed wherein DR would fail during the discovery of backups on the target device. |Update 1 |Yes |Yes |
| 7 |Monitoring LEDs |In certain instances, monitoring LEDs at the back of appliance did not indicate correct status. The blue LED was turned off. DATA 0 and DATA 1 LEDs were flashing even when these interfaces were not configured. The issue has been fixed and monitoring LEDs now indicate the correct status. |Update 1 |Yes |No |
| 8 |Monitoring LEDs |In certain instances, after applying Update 1, the blue light on the active controller turned off thereby making it hard to identify the active controller. This issue has been fixed in this patch release. |Update 1.2 |Yes |No |
| 9 |Network interfaces |In previous versions, a StorSimple device configured with a non-routable gateway could go offline. In this release, the routing metric for Data 0 has been made the lowest; therefore, even if other network interfaces are cloud-enabled, all the cloud traffic from the device will be routed via Data 0. |Update 1 |Yes |Yes |
| 10 |Backups |A bug in Update 1 which caused backups to fail after 24 days has been fixed in the patch release Update 1.1. |Update 1.1 |Yes |Yes |
| 11 |Backups |A bug in previous versions resulted in poor performance for cloud snapshots with low change rates. This bug has been fixed in this patch release. |Update 1.2 |Yes |Yes |
| 12 |Updates |A bug in Update 1 that reported a failed upgrade and caused the controllers to go into Recovery mode, has been fixed in this patch release. |Update 1.2 |Yes |Yes |

## Known issues in Update 1.2
The following table provides a summary of known issues in this release.

| No. | Feature | Issue | Comments/workaround | Applies to physical device | Applies to virtual device |
| --- | --- | --- | --- | --- | --- |
| 1 |Disk quorum |In rare instances, if the majority of disks in the EBOD enclosure of an 8600 device are disconnected resulting in no disk quorum, then the storage pool will be offline. It will stay offline even if the disks are reconnected. |You will need to reboot the device. If the issue persists, please contact Microsoft Support for next steps. |Yes |No |
| 2 |Incorrect controller ID |When a controller replacement is performed, controller 0 may show up as controller 1. During controller replacement, when the image is loaded from the peer node, the controller ID can show up initially as the peer controller’s ID. In rare instances, this behavior may also be seen after a system reboot. |No user action is required. This situation will resolve itself after the controller replacement is complete. |Yes |No |
| 3 |Storage accounts |Using the Storage service to delete the storage account is an unsupported scenario. This will lead to a situation in which user data cannot be retrieved. |Yes |Yes | |
| 4 |Device failover |Multiple failovers of a volume container from the same source device to different target devices is not supported. Device failover from a single dead device to multiple devices will make the volume containers on the first failed over device lose data ownership. After such a failover, these volume containers will appear or behave differently when you view them in the Azure classic portal. | |Yes |No |
| 5 |Installation |During StorSimple Adapter for SharePoint installation, you need to provide a device IP in order for the install to finish successfully. | |Yes |No |
| 6 |Web proxy |If your web proxy configuration has HTTPS as the specified protocol, then your device-to-service communication will be affected and the device will go offline. Support packages will also be generated in the process, consuming significant resources on your device. |Make sure that the web proxy URL has HTTP as the specified protocol. For more information, go to [Configure web proxy for your device](storsimple-configure-web-proxy.md). |Yes |No |
| 7 |Web proxy |If you configure and enable web proxy on a registered device, then you will need to restart the active controller on your device. | |Yes |No |
| 8 |High cloud latency and high I/O workload |When your StorSimple device encounters a combination of very high cloud latencies (order of seconds) and high I/O workload, the device volumes go into a degraded state and the I/Os may fail with a "device not ready" error. |You will need to manually reboot the device controllers or perform a device failover to recover from this situation. |Yes |No |
| 9 |Azure PowerShell |When you use the StorSimple cmdlet **Get-AzureStorSimpleStorageAccountCredential &#124; Select-Object -First 1 -Wait** to select the first object so that you can create a new **VolumeContainer** object, the cmdlet returns all the objects. |Wrap the cmdlet in parentheses as follows: **(Get-Azure-StorSimpleStorageAccountCredential) &#124; Select-Object -First 1 -Wait** |Yes |Yes |
| 10 |Migration |When multiple volume containers are passed for migration, the ETA for latest backup is accurate only for the first volume container. Additionally, parallel migration will start after the first 4 backups in the first volume container are migrated. |We recommend that you migrate one volume container at a time. |Yes |No |
| 11 |Migration |After the restore, volumes are not added to the backup policy or the virtual disk group. |You will need to add these volumes to a backup policy in order to create backups. |Yes |Yes |
| 12 |Migration |After the migration is complete, the 5000/7000 series device must not access the migrated data containers. |We recommend that you delete the migrated data containers after the migration is complete and committed. |Yes |No |
| 13 |Clone and DR |A StorSimple device running Update 1 cannot clone or perform Disaster Recovery to a device running pre-update 1 software. |You will need to update the target device to Update 1 to allow these operations |Yes |Yes |
| 14 |Migration |Configuration backup for migration may fail on a 5000-7000 series device when there are volume groups with no associated volumes. |Delete all the empty volume groups with no associated volumes and then retry the configuration backup. |Yes |No |

## Physical device updates in Update 1.2
If patch update 1.2 is applied to a physical device (running versions prior to Update 1), the software version will change to 6.3.9600.17584.

## Controller and firmware updates in Update 1.2
This release updates the driver and the disk firmware on your device.

* For more information about the SAS controller update, see [Update 1 for LSI SAS controllers in Microsoft Azure StorSimple Appliance](https://support.microsoft.com/kb/3043005). 
* For more information about the disk firmware update, see [Disk firmware Update 1 for Microsoft Azure StorSimple Appliance](https://support.microsoft.com/kb/3063416).

## Virtual device updates in Update 1.2
This update cannot be applied to the virtual device. New virtual devices will need to be created. 

## Next steps
* [Install Update 1.2 on your device](storsimple-install-update-1.md).

