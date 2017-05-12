---
title: StorSimple Device Manager service administration | Microsoft Docs
description: Learn how to manage your StorSimple device by using the StorSimple Device Manager service in the Azure portal.
services: storsimple
documentationcenter: ''
author: alkohli
manager: timlt
editor: ''

ms.assetid:
ms.service: storsimple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/27/2017
ms.author: alkohli

---
# Use the StorSimple Device Manager service to administer your StorSimple device

## Overview

This article describes the StorSimple Device Manager service interface, including how to connect to it, the various options available, and links out to the specific workflows that can be performed via this UI. This guidance is applicable to both; the StorSimple physical device and the cloud appliance.

After reading this article, you will learn to:

* Connect to StorSimple Device Manager service
* Navigate the StorSimple Device Manager UI
* Administer your StorSimple device via the StorSimple Device Manager service

## Connect to StorSimple Device Manager service

The StorSimple Device Manager service runs in Microsoft Azure and connects to multiple StorSimple devices. You use a central Microsoft Azure portal running in a browser to manage these devices. To connect to the StorSimple Device Manager service, do the following.

#### To connect to the service
1. Navigate to [https://portal.azure.com/](https://portal.azure.com/).
2. Using your Microsoft account credentials, log on to the Microsoft Azure portal (located at the top-right of the pane).
3. Scroll down the left navigation pane to access the StorSimple Device Manager service.

## Navigate StorSimple Device Manager service UI

The navigational hierarchy for the StorSimple Device Manager service UI is shown in the following table.

* **StorSimple Device Manager** landing page takes you to the UI service-level pages applicable to all devices within a service.
* **Devices** page takes you to the device–level UI pages applicable to a specific device.


#### StorSimple Device Manager service navigational hierarchy

| Landing page | Service-level pages | Device-level pages | Device-level pages |
| --- | --- | --- | --- |
| StorSimple Device Manager service |Service dashboard |Device dashboard | |
| Devices → |Monitor | | |
| Backup catalog |Volume containers→ |Volumes | |
| Configure (Service) |Backup policies | | |
| Jobs |Configure (Device) | | |
| Alerts |Maintenance | | |

## Administer StorSimple device using StorSimple Device Manager service

The following table shows a summary of all the common management tasks and complex workflows that can be performed within the StorSimple Device Manager service UI. These tasks are organized based on the UI pages on which they are initiated.

For more information about each workflow, click the appropriate procedure in the table.

#### StorSimple Device Manager workflows

| If you want to do this ... | Go to this UI page ... | Use this procedure. |
| --- | --- | --- |
| Create a service</br>Delete a service</br>Get service registration key</br>Regenerate service registration key |StorSimple Device Manager service |[Deploy a StorSimple Device Manager service](storsimple-8000-manage-service.md) |
| Change the service data encryption key</br>View the operation logs |StorSimple Device Manager service → Dashboard |[Use the StorSimple Device Manager service dashboard](storsimple-8000-service-dashboard.md) |
| Deactivate a device</br>Delete a device |StorSimple Device Manager service → Devices |[Deactivate or delete a device](storsimple-8000-deactivate-and-delete-device.md) |
| Learn about disaster recovery and device failover</br>Failover to a physical device</br>Failover to a virtual device</br>Business continuity disaster recovery (BCDR) |StorSimple Device Manager service → Devices |[Failover and disaster recovery for your StorSimple device](storsimple-8000-device-failover-disaster-recovery.md) |
| List backups for a volume</br>Select a backup set</br>Delete a backup set |StorSimple Device Manager service → Backup Catalog |[Manage backups](storsimple-8000-manage-backup-catalog.md) |
| Clone a volume |StorSimple Device Manager service → Backup Catalog |[Clone a volume](storsimple-8000-clone-volume-u2.md) |
| Restore a backup set |StorSimple Device Manager service → Backup Catalog |[Restore a backup set](storsimple-8000-restore-from-backup-set-u2.md) |
| About  storage accounts</br>Add a storage account</br>Edit a storage account</br>Delete a storage account</br>Key rotation of storage accounts |StorSimple Device Manager service → Configure |[Manage storage accounts](storsimple-8000-manage-storage-accounts.md) |
| About bandwidth templates</br>Add a bandwidth template</br>Edit a bandwidth template</br>Delete a bandwidth template</br>Use a default bandwidth template</br>Create an all-day bandwidth template that starts at a specified time |StorSimple Device Manager service → Configure |[Manage bandwidth templates](storsimple-8000-manage-bandwidth-templates.md) |
| About access control records</br>Create an access control record</br>Edit an access control record</br>Delete an access control record |StorSimple Device Manager service → Configure |[Manage access control records](storsimple-8000-manage-acrs.md) |
| View job details</br>Cancel a job |StorSimple Device Manager service → Jobs |[Manage jobs](storsimple-8000-manage-jobs-u2.md) |
| Receive alert notifications</br>Manage alerts</br>Review alerts |StorSimple Device Manager service → Alerts |[View and manage StorSimple alerts](storsimple-8000-manage-alerts.md) |
| View connected initiators</br>Find the device serial number</br>Find the target IQN |StorSimple Device Manager service → Devices → Dashboard |[Use the StorSimple device dashboard](storsimple-8000-device-dashboard.md) |
| Create monitoring charts |StorSimple Device Manager service → Devices → Monitor |[Monitor your StorSimple device](storsimple-monitor-device.md) |
| Add a volume container</br>Modify a volume container</br>Delete a volume container |StorSimple Device Manager service → Devices → Volume Containers |[Manage volume containers](storsimple-8000-manage-volume-containers.md) |
| Add a volume</br>Modify a volume</br>Take a volume offline</br>Delete a volume</br>Monitor a volume |StorSimple Device Manager service → Devices → Volume Containers → Volumes |[Manage volumes](storsimple-8000-manage-volumes-u2.md) |
| Modify device settings</br>Modify time settings</br>Modify DNS.md settings</br>Configure network interfaces |StorSimple Device Manager service → Devices → Configure |[Modify device configuration for your StorSimple device](storsimple-8000-modify-device-config.md) |
| View web proxy settings |StorSimple Device Manager service → Devices → Configure |[Configure web proxy for your device](storsimple-8000-configure-web-proxy.md) |
| Modify device administrator password</br>Modify StorSimple Snapshot Manager password |StorSimple Device Manager service → Devices → Configure |[Change StorSimple passwords](storsimple-8000-change-passwords.md) |
| Configure remote management |StorSimple Device Manager service → Devices → Configure |[Connect remotely to your StorSimple device](storsimple-remote-connect.md) |
| Configure alert settings |StorSimple Device Manager service → Devices → Configure |[View and manage StorSimple alerts](storsimple-8000-manage-alerts.md) |
| Configure CHAP for your StorSimple device |StorSimple Device Manager service → Devices → Configure |[Configure CHAP for your StorSimple device](storsimple-configure-chap.md) |
| Add a backup policy</br>Add or modify a schedule</br>Delete a backup policy</br>Take a manual backup</br>Create a custom backup policy with multiple volumes and schedules |StorSimple Device Manager service → Devices → Backup policies |[Manage backup policies](storsimple-8000-manage-backup-policies-u2.md) |
| Stop device controllers</br>Restart device controllers</br>Shut down device controllers</br>Reset your device to factory defaults</br>(Above are for on-premises device only) |StorSimple Device Manager service → Devices → Maintenance |[Manage StorSimple device controller](storsimple-8000-manage-device-controller.md) |
| Learn about StorSimple hardware components</br>Monitor hardware status</br>(Above are for on-premises device only) |StorSimple Device Manager service → Devices → Maintenance |[Monitor hardware components](storsimple-8000-monitor-hardware-status.md) |
| Create a support package |StorSimple Device Manager service → Devices → Maintenance |[Create and manage a Support package](storsimple-8000-contact-microsoft-support.md#start-a-support-session-in-windows-powershell-for-storsimple) |
| Install software updates |StorSimple Device Manager service → Devices → Maintenance |[Update your device](storsimple-update-device.md) |

## Next steps

If you experience any issues with the day-to-day operation of your StorSimple device or with any of its hardware components, refer to:

* [Troubleshoot an operational device](storsimple-troubleshoot-operational-device.md)
* [Use StorSimple monitoring indicator LEDs](storsimple-monitoring-indicators.md)

If you cannot resolve the issues and you need to create a service request, refer to [Contact Microsoft Support](storsimple-contact-microsoft-support.md).

