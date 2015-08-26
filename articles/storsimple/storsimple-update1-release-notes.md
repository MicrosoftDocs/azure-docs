<properties 
    pageTitle="StorSimple 8000 Series Update 1 release notes | Microsoft Azure"
    description="Describes the new features, issues, and workarounds for StorSimple 8000 Series Update 1."
    services="storsimple"
    documentationCenter="NA"
    authors="alkohli"
    manager="carolz"
    editor="" />
 <tags 
    ms.service="storsimple"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="NA"
    ms.workload="TBD"
    ms.date="08/21/2015"
    ms.author="alkohli" />

# StorSimple 8000 Series Update 1 release notes  

## Overview

The following release notes describe the new features and identify the critical open issues for StorSimple 8000 Series Update 1. They also contain a list of the StorSimple software and firmware updates included in this release. This is the first major release after the StorSimple 8000 Series Release version was made generally available in July 2014.

This update changes the device software to be StorSimple 8000 Series Update 1. Please review the information contained in the release notes before you deploy the update in your StorSimple solution. For more information, see how to [install Update 1 on your StorSimple device](storsimple-install-update-1.md). 

Please review the information contained in the release notes before you deploy the updates in your StorSimple solution.  

>[AZURE.IMPORTANT]
> 
- A critical patch, Update 1.1, was released on June 23. This patch addresses an issue in the backup engine. If you applied Update 1 before June 23rd and are currently using software version **6.3.9600.17491**, make sure that you apply this critical update to avoid any issues with backups. After you install the update, the software version will change to **6.3.9600.17521**.
- If you created a virtual device between May 27th and July 10th that is in  software version **6.3.9600.17481**, create a new virtual device and fail over any volumes from the old virtual device to the new one. (This is because the older virtual device cannot be updated.) If you do not create a new virtual device, you might see that backups start failing. For failover and disaster recovery procedures, go to [Failover and disaster recovery for your StorSimple device](storsimple-device-failover-disaster-recovery.md).
- Use the StorSimple Manager service and not Windows PowerShell for StorSimple to install Update 1.
- This release also contains disk firmware updates that can only be applied when the device is in Maintenance mode. These are disruptive updates that will result in down time for your device. You can apply these updates during planned maintenance.
- It takes approximately 5-10 hours to install this update (including the Windows Updates). 
- For new releases, you may not see updates immediately because we do a phased rollout of the updates. Scan for updates in a few days again as these will become available soon.

## What's new in Update 1

This update contains the following new features and improvements:

- **Migration from 5000-7000 series to 8000 series devices** – This release introduces a new migration feature that allows the StorSimple 5000-7000 series appliance users to migrate their data to a StorSimple 8000 series physical appliance or an 1100 virtual appliance. The migration feature has two key value propositions:                                                                  

    - **Business continuity**, by enabling migration of existing data on 5000-7000 series appliances to 8000 series appliances.
    - **Improved feature offerings of the 8000 series appliances**, such as efficient centralized management of multiple appliances through StorSimple Manager service, better class of hardware and updated firmware, virtual appliances, data mobility, and features in the future roadmap.

    Refer to the [migration guide](http://www.microsoft.com/download/details.aspx?id=47322) for details on how to migrate a StorSimple 5000-7000 series to an 8000 series device. 

- **Availability in the Azure Government Portal** – StorSimple is now available in the Azure Government portal. See how to [deploy a StorSimple device in the Azure Government Portal](storsimple-deployment-walkthrough-gov.md).

- **Support for other cloud service providers** – The other cloud service providers supported are Amazon S3, Amazon S3 with RRS, HP, and OpenStack (beta).

- **Update to latest Storage APIs** – With this release, StorSimple has been updated to the latest Azure Storage service APIs. StorSimple 8000 series devices that are running  GA are using versions of the Azure Storage Service APIs older than February 12, 2012. As stated in the [announcement about removal of Storage service versions](http://azure.microsoft.com/blog/2014/08/04/microsoft-azure-storage-service-version-removal/), by December 10, 2015, these APIs will be deprecated. It is imperative that you apply the StorSimple 8000 Series Update 1 prior to December 9, 2015. If you fail to do so, StorSimple devices will stop functioning correctly.

- **Support for Zone Redundant Storage (ZRS)** – With the upgrade to the latest version of the Storage APIs, the StorSimple 8000 series will support Zone Redundant Storage (ZRS) in addition to Locally Redundant Storage (LRS) and Geo-redundant Storage (GRS). Refer to this [article on Azure Storage redundancy options](../storage/storage-redundancy.md) for ZRS details.

- **Enhanced initial deployment and update experience** – In this release, the installation and update processes have been enhanced. The installation through the setup wizard is improved to provide feedback to the user if the network configuration and firewall settings are incorrect. Additional diagnostic cmdlets have been provided to help you with troubleshooting networking of the device. See  the [troubleshooting deployment article](storsimple-troubleshoot-deployment.md) for more information about the new diagnostic cmdlets used for troubleshooting.

## Issues fixed in Update 1

The following table provides a summary of issues that were fixed in this update.  

| No. | Feature | Issue | Applies to physical device | Applies to virtual device |
|-----|---------|-------|---------------------------------|--------------------------------|
| 1 | Windows PowerShell for StorSimple | When a user remotely accessed the StorSimple device by using Windows PowerShell for StorSimple and then started the setup wizard, a crash occurred as soon as Data 0 IP was input. This bug is now fixed in Update 1. | Yes | Yes |
| 2 | Factory reset | In some instances, when you performed a factory reset, the StorSimple device became stuck and displayed this message: **Reset to factory is in progress (phase 8)**. This happened if you pressed CTRL+C while the cmdlet was in progress. This bug is now fixed.| Yes | No |
| 3 | Factory reset | After a failed dual controller factory reset, you were allowed to proceed with device registration. This resulted in an unsupported system configuration. In Update 1, an error message is shown and registration is blocked on a device that has a failed factory reset. | Yes | No |
| 4 | Factory reset | In some instances, false positive mismatch alerts were raised. Incorrect mismatch alerts will no longer be generated on devices running Update 1. | Yes | No |
| 5 | Factory reset | If a factory reset was interrupted prior to completion, the device entered recovery mode and did not allow you to access Windows PowerShell for StorSimple. This bug is now fixed. | Yes | No |
| 6 | Disaster recovery | A disaster recovery (DR) bug was fixed wherein DR would fail during the discovery of backups on the target device. | Yes | Yes |
| 7 | Monitoring LEDs | In certain instances, monitoring LEDs at the back of appliance did not indicate correct status. The blue LED was turned off. DATA 0 and DATA 1 LEDs were flashing even when these interfaces were not configured. The issue has been fixed and monitoring LEDs now indicate the correct status.  | Yes | No |
| 8 | Network interfaces | In previous versions, a StorSimple device configured with a non-routable gateway could go offline. In this release, the routing metric for Data 0 has been made the lowest; therefore, even if other network interfaces are cloud-enabled, all the cloud traffic from the device will be routed via Data 0. | Yes | Yes | 
| 9 | Backups | A bug in Update 1 (software version 6.3.9600.17491) which caused backups to fail after 24 days has been fixed in the patch release Update 1.1 (software version 6.3.9600.17521). | Yes | Yes |

## Known issues in Update 1

The following table provides a summary of known issues in this release.

| No. | Feature | Issue | Comments/workaround | Applies to physical device | Applies to virtual device |
|-----|---------|-------|----------------------------|----------------------------|---------------------------|
| 1 | Disk quorum | In rare instances, if the majority of disks in the EBOD enclosure of an 8600 device are disconnected resulting in no disk quorum, then the storage pool will be offline. It will stay offline even if the disks are reconnected. | You will need to reboot the device. If the issue persists, please contact Microsoft Support for next steps. | Yes | No |
| 2 | Incorrect controller ID | When a controller replacement is performed, controller 0 may show up as controller 1. During controller replacement, when the image is loaded from the peer node, the controller ID can show up initially as the peer controller’s ID. In rare instances, this behavior may also be seen after a system reboot. | No user action is required. This situation will resolve itself after the controller replacement is complete. | Yes | No |
| 3 | Storage accounts | Using the Storage service to delete the storage account is an unsupported scenario. This will lead to a situation in which user data cannot be retrieved. | Yes | Yes |
| 4 | Device failover | Multiple failovers of a volume container from the same source device to different target devices is not supported. Failover from a single dead device to multiple devices will make the volume containers on the first failed over device lose data ownership. After such a failover, these volume containers will appear or behave differently when you view them in the Management Portal. | | Yes | No |
| 5 | Installation | During StorSimple Adapter for SharePoint installation, you need to provide a device IP in order for the install to finish successfully.	| | Yes | No |
| 6 | Web proxy | If your web proxy configuration has HTTPS as the specified protocol, then your device-to-service communication will be affected and the device will go offline. Support packages will also be generated in the process, consuming significant resources on your device. | Make sure that the web proxy URL has HTTP as the specified protocol. For more information, go to [Configure web proxy for your device](storsimple-configure-web-proxy.md). | Yes | No |
| 7 | Web proxy | If you configure and enable web proxy on a registered device, then you will need to restart the active controller on your device. | | Yes | No |
| 8 | High cloud latency and high I/O workload | When your StorSimple device encounters a combination of very high cloud latencies (order of seconds) and high I/O workload, the device volumes go into a degraded state and the I/Os may fail with a "device not ready" error. | You will need to manually reboot the device controllers or perform a device failover to recover from this situation. | Yes | No |
| 9 | Azure PowerShell | When you use the StorSimple cmdlet **Get-AzureStorSimpleStorageAccountCredential &#124; Select-Object -First 1 -Wait** to select the first object so that you can create a new **VolumeContainer** object, the cmdlet returns all the objects. | Wrap the cmdlet in parentheses as follows: **(Get-Azure-StorSimpleStorageAccountCredential) &#124; Select-Object -First 1 -Wait** | Yes | Yes |
| 10| Migration | When multiple volume containers are passed for migration, the ETA for latest backup is accurate only for the first volume container. Additionally, parallel migration will start after the first 4 backups in the first volume container are migrated. | We recommend that you migrate one volume container at a time. | Yes | No |
| 11| Migration | After the restore, volumes are not added to the backup policy or the virtual disk group. | You will need to add these volumes to a backup policy in order to create backups. | Yes | Yes |
| 12| Migration | After the migration is complete, the 5000/7000 series device must not access the migrated data containers. | We recommend that you delete the migrated data containers after the migration is complete and committed. | Yes | No |
| 13| Clone and DR | A StorSimple device running Update 1 cannot clone or perform Disaster Recovery to a device running pre-update 1 software. | You will need to update the target device to Update 1 to allow these operations | Yes | Yes |
| 14 | Migration | Configuration backup for migration may fail on a 5000-7000 series device when there are volume groups with no associated volumes. | Delete all the empty volume groups with no associated volumes and then retry the configuration backup.| Yes | No |

## Physical device updates in Update 1

If patch update 1.2 is applied to a physical device (running versions prior to Update 1), the software version will change to 6.3.9600.17521.

## Controller and firmware updates in Update 1

This release updates the driver and the firmware on the SAS controller of your physical device. It also updates the disk firmware on your device.
 
- For more information about the SAS controller update, see [Update 1 for LSI SAS controllers in Microsoft Azure StorSimple Appliance](https://support.microsoft.com/kb/3043005). 

- For more information about the firmware update, see [Firmware Update 1 for Microsoft Azure StorSimple Appliance](https://support.microsoft.com/kb/3063414).

- For more information about the disk firmware update, see [Disk firmware Update 1 for Microsoft Azure StorSimple Appliance](https://support.microsoft.com/kb/3063416).
 
## Virtual device updates in Update 1

This update cannot be applied to the virtual device. However, any virtual devices created after 10th July will automatically be in this version. 

## Next steps

- [Install Update 1 on your device](storsimple-install-update-1.md).
 
