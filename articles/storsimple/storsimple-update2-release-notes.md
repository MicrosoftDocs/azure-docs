---
title: StorSimple 8000 Series Update 2 release notes | Microsoft Docs
description: Describes the new features, issues, and workarounds for StorSimple 8000 Series Update 2.
services: storsimple
documentationcenter: NA
author: SharS
manager: carmonm
editor: ''

ms.assetid: e2c8bffd-7fc5-4b77-b632-a4f59edacc3a
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 11/03/2017
ms.author: v-sharos

---
# StorSimple 8000 Series Update 2 release notes

## Overview
The following release notes describe the new features and identify the critical open issues for StorSimple 8000 Series Update 2. They also contain a list of the StorSimple software, driver, and disk firmware updates included in this release. 

Update 2 can be applied to any StorSimple device running Release (GA) or Update 0.1 through Update 1.2. The device version associated with Update 2 is 6.3.9600.17673.

Please review the information contained in the release notes before you deploy the update in your StorSimple solution.

> [!IMPORTANT]
> * It takes approximately 4-7 hours to install this update (including the Windows updates). 
> * Update 2 has software, LSI driver, and SSD firmware updates.
> * For new releases, you may not see updates immediately because we do a phased rollout of the updates. Wait a few days, and then scan for updates again as these will become available soon.
> 
> 

## What's new in Update 2
Update 2 introduces the following new features.

* **Locally pinned volumes** – In previous releases of the StorSimple 8000 series, blocks of data were tiered to the cloud based on usage. There was no way to guarantee that blocks would stay on local. In Update 2, when you create a volume, you can designate a volume as locally pinned, and primary data from that volume will not be tiered to the cloud. Snapshots of locally pinned volumes will still be copied to the cloud for backup so that the cloud can be used for data mobility and disaster recovery purposes. Additionally, you can change the volume type (that is, convert tiered volumes to locally pinned volumes and convert locally pinned volumes to tiered). 
* **StorSimple virtual device improvements** – Previously, the StorSimple 8000 series positioned the virtual device as a disaster recovery or development/test solution. There was only one model of virtual device (model 1100). Update 2 introduces two virtual device models: 
  
  * 8010 (formerly called the 1100) – No change; has a capacity of 30 TB and uses Azure standard storage.
  * 8020 – Has a capacity of 64 TB and uses Azure Premium storage for improved performance.
    
    There is a single VHD for both virtual device models (8010/8020). When you first start the virtual device, it detects the platform parameters and applies the correct model version.
* **Networking Improvements** – Update 2 contains the following networking improvements:
  
  * Multiple NICs can be enabled for the cloud so that failover can occur if a NIC fails.
  * Routing improvements, with fixed metrics for cloud enabled blocks.
  * Online retry of failed resources before a failover.
  * New alerts for service failures.
* **Updating Improvements** – In Update 1.2 and earlier, the StorSimple 8000 series was updated via two channels: Windows Update for clustering, iSCSI, and so on, and Microsoft Update for binaries and firmware.
    Update 2 uses Microsoft Update for all update packages. This should lead to less time patching or doing failovers. 
* **Firmware updates** – The following firmware updates are included:
  
  * LSI: lsi_sas2.sys Product Version 2.00.72.10
  * SSD only (no HDD updates): XMGG, XGEG, KZ50, F6C2, and VR08
* **Proactive Support** – Update 2 enables Microsoft to pull additional diagnostic information from the device. When our operations team identifies devices that are having problems, we are better equipped to collect information from the device and diagnose issues. **By accepting Update 2, you allow us to provide this proactive support**.    

## Issues fixed in Update 2
The following tables provides a summary of issues that were fixed in Updates 2.    

| No. | Feature | Issue | Applies to physical device | Applies to virtual device |
| --- | --- | --- | --- | --- |
| 1 |Network interfaces |After an upgrade to Update 1, the StorSimple Manager service reported that the Data2 and Data3 ports failed on one controller. This issue has been fixed. |Yes |No |
| 2 |Updates |After an upgrade to Update 1, audible alarm alerts occurred in the Azure classic portal on multiple devices. This issue has been fixed. |Yes |No |
| 3 |Openstack authentication |When using Openstack as your cloud service provider, you could receive an error that your cloud authentication string was too long. This has been fixed. |Yes |No |

## Known issues in Update 2
The following table provides a summary of known issues in this release.

| No. | Feature | Issue | Comments / workaround | Applies to physical device | Applies to virtual device |
| --- | --- | --- | --- | --- | --- |
| 1 |Disk quorum |In rare instances, if the majority of disks in the EBOD enclosure of an 8600 device are disconnected resulting in no disk quorum, then the storage pool will go offline. It will stay offline even if the disks are reconnected. |You will need to reboot the device. If the issue persists, please contact Microsoft Support for next steps. |Yes |No |
| 2 |Incorrect controller ID |When a controller replacement is performed, controller 0 may show up as controller 1. During controller replacement, when the image is loaded from the peer node, the controller ID can show up initially as the peer controller’s ID. In rare instances, this behavior may also be seen after a system reboot. |No user action is required. This situation will resolve itself after the controller replacement is complete. |Yes |No |
| 3 |Storage accounts |Using the Storage service to delete the storage account is an unsupported scenario. This will lead to a situation in which user data cannot be retrieved. | |Yes |Yes |
| 4 |Device failover |Multiple failovers of a volume container from the same source device to different target devices is not supported. Failover from a single dead device to multiple devices will make the volume containers on the first failed over device lose data ownership. After such a failover, these volume containers will appear or behave differently when you view them in the Azure classic portal. | |Yes |No |
| 5 |Installation |During StorSimple Adapter for SharePoint installation, you need to provide a device IP in order for the install to finish successfully. | |Yes |No |
| 6 |Web proxy |If your web proxy configuration has HTTPS as the specified protocol, then your device-to-service communication will be affected and the device will go offline. Support packages will also be generated in the process, consuming significant resources on your device. |Make sure that the web proxy URL has HTTP as the specified protocol. For more information, go to [Configure web proxy for your device](storsimple-configure-web-proxy.md). |Yes |No |
| 7 |Web proxy |If you configure and enable web proxy on a registered device, then you will need to restart the active controller on your device. | |Yes |No |
| 8 |High cloud latency and high I/O workload |When your StorSimple device encounters a combination of very high cloud latencies (order of seconds) and high I/O workload, the device volumes go into a degraded state and the I/Os may fail with a "device not ready" error. |You will need to manually reboot the device controllers or perform a device failover to recover from this situation. |Yes |No |
| 9 |Azure PowerShell |When you use the StorSimple cmdlet **Get-AzureStorSimpleStorageAccountCredential &#124; Select-Object -First 1 -Wait** to select the first object so that you can create a new **VolumeContainer** object, the cmdlet returns all the objects. |Wrap the cmdlet in parentheses as follows: **(Get-Azure-StorSimpleStorageAccountCredential) &#124; Select-Object -First 1 -Wait** |Yes |Yes |
| 10 |Migration |When multiple volume containers are passed for migration, the ETA for latest backup is accurate only for the first volume container. Additionally, parallel migration will start after the first 4 backups in the first volume container are migrated. |We recommend that you migrate one volume container at a time. |Yes |No |
| 11 |Migration |After the restore, volumes are not added to the backup policy or the virtual disk group. |You will need to add these volumes to a backup policy in order to create backups. |Yes |Yes |
| 12 |Migration |After the migration is complete, the 5000/7000 series device must not access the migrated data containers. |We recommend that you delete the migrated data containers after the migration is complete and committed. |Yes |No |
| 13 |Clone and DR |A StorSimple device running Update 1 cannot clone or perform disaster recovery to a device running pre-update 1 software. |You will need to update the target device to Update 1 to allow these operations |Yes |Yes |
| 14 |Migration |Configuration backup for migration may fail on a 5000-7000 series device when there are volume groups with no associated volumes. |Delete all the empty volume groups with no associated volumes and then retry the configuration backup. |Yes |No |
| 15 |Azure PowerShell cmdlets and locally pinned volumes |You cannot create a locally pinned volume via Azure PowerShell cmdlets. (Any volume you create via Azure PowerShell will be tiered.) |Always use the StorSimple Manager service to configure locally pinned volumes. |Yes |No |
| 16 |Space available for locally pinned volumes |If you delete a locally pinned volume, the space available for new volumes may not be updated immediately. The StorSimple Manager service updates the local space available approximately every hour. |Wait for an hour before you try to create the new volume. |Yes |No |
| 17 |Locally pinned volumes |Your restore job exposes the temporary snapshot backup in the Backup Catalog, but only for the duration of the restore job. Additionally, it exposes a virtual disk group with prefix **tmpCollection** on the **Backup Policies** page, but only for the duration of the restore job. |This behavior can occur if your restore job has only locally pinned volumes or a mix of locally pinned and tiered volumes. If the restore job includes only tiered volumes, then this behavior will not occur. No user intervention is required. |Yes |No |
| 18 |Locally pinned volumes |If you cancel a restore job and a controller failover occurs immediately afterwards, the restore job will show **Failed** instead of **Canceled**. If a restore job fails and a controller failover occurs immediately afterwards, the restore job will show **Canceled** instead of **Failed**. |This behavior can occur if your restore job has only locally pinned volumes or a mix of locally pinned and tiered volumes. If the restore job includes only tiered volumes, then this behavior will not occur. No user intervention is required. |Yes |No |
| 19 |Locally pinned volumes |If you cancel a restore job or if a restore fails and then a controller failover occurs, an additional restore job appears on the **Jobs** page. |This behavior can occur if your restore job has only locally pinned volumes or a mix of locally pinned and tiered volumes. If the restore job includes only tiered volumes, then this behavior will not occur. No user intervention is required. |Yes |No |
| 20 |Locally pinned volumes |If you try to convert a tiered volume (created and cloned with Update 1.2 or earlier) to a locally pinned volume and your device is running out of space or there is a cloud outage, then the clone(s) can be corrupted. |This problem occurs only with volumes that were created and cloned with pre-Update 2 software. This should be an infrequent scenario. | | |
| 21 |Volume conversion |Do not update the ACRs attached to a volume while a volume conversion is in progress (tiered to locally pinned or vice versa). Updating the ACRs could result in data corruption. |If needed, update the ACRs prior to the volume conversion and do not make any further ACR updates while the conversion is in progress. | | |

## Controller and firmware updates in Update 2
This release updates the driver and the disk firmware on your device.

* For more information about the LSI firmware update, see Microsoft Knowledge base article 3121900. 
* For more information about the disk firmware update, see Microsoft Knowledge base article 3121899.

## Virtual device updates in Update 2
This update cannot be applied to the virtual device. New virtual devices will need to be created. 

## Next step
Learn how to [install Update 2](storsimple-install-update-2.md) on your StorSimple device.

