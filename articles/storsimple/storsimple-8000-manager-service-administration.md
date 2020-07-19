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
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/12/2017
ms.author: alkohli

---
# Use the StorSimple Device Manager service to administer your StorSimple device

## Overview

This article describes the StorSimple Device Manager service interface, including how to connect to it, the various options available, and links out to the specific workflows that can be performed via this UI. This guidance is applicable to both; the StorSimple physical device and the cloud appliance.

After reading this article, you will learn to:

* Connect to StorSimple Device Manager service
* Administer your StorSimple device via the StorSimple Device Manager service

## Connect to StorSimple Device Manager service

The StorSimple Device Manager service runs in Microsoft Azure and connects to multiple StorSimple devices. You use a central Microsoft Azure portal running in a browser to manage these devices. To connect to the StorSimple Device Manager service, do the following.

#### To connect to the service
1. Navigate to [https://portal.azure.com/](https://portal.azure.com/).
2. Using your Microsoft account credentials, log on to the Microsoft Azure portal (located at the top-right of the pane).
3. Scroll down the left navigation pane to access the StorSimple Device Manager service.


## Administer StorSimple device using StorSimple Device Manager service

The following table shows a summary of all the common management tasks and complex workflows that can be performed within the StorSimple Device Manager service UI. These tasks are organized based on the UI blades on which they are initiated.

For more information about each workflow, click the appropriate procedure in the table.

#### StorSimple Device Manager workflows

| If you want to do this ... | Use this procedure. |
| --- | --- |
| Create a service</br>Delete a service</br>Get service registration key</br>Regenerate service registration key |[Deploy a StorSimple Device Manager service](storsimple-8000-manage-service.md) |
| View the activity logs |[Use the StorSimple Device Manager service summary](storsimple-8000-service-dashboard.md) |
| Change the service data encryption key</br>View the operation logs |[Use the StorSimple Device Manager service dashboard](storsimple-8000-service-dashboard.md) |
| Deactivate a device</br>Delete a device |[Deactivate or delete a device](storsimple-8000-deactivate-and-delete-device.md) |
| Learn about disaster recovery and device failover</br>Failover to a physical device</br>Failover to a virtual device</br>Business continuity disaster recovery (BCDR) |[Failover and disaster recovery for your StorSimple device](storsimple-8000-device-failover-disaster-recovery.md) |
| List backups for a volume</br>Select a backup set</br>Delete a backup set |[Manage backups](storsimple-8000-manage-backup-catalog.md) |
| Clone a volume |[Clone a volume](storsimple-8000-clone-volume-u2.md) |
| Restore a backup set |[Restore a backup set](storsimple-8000-restore-from-backup-set-u2.md) |
| About  storage accounts</br>Add a storage account</br>Edit a storage account</br>Delete a storage account</br>Key rotation of storage accounts |[Manage storage accounts](storsimple-8000-manage-storage-accounts.md) |
| About bandwidth templates</br>Add a bandwidth template</br>Edit a bandwidth template</br>Delete a bandwidth template</br>Use a default bandwidth template</br>Create an all-day bandwidth template that starts at a specified time |[Manage bandwidth templates](storsimple-8000-manage-bandwidth-templates.md) |
| About access control records</br>Create an access control record</br>Edit an access control record</br>Delete an access control record |[Manage access control records](storsimple-8000-manage-acrs.md) |
| View job details</br>Cancel a job |[Manage jobs](storsimple-8000-manage-jobs-u2.md) |
| Receive alert notifications</br>Manage alerts</br>Review alerts |[View and manage StorSimple alerts](storsimple-8000-manage-alerts.md) |
| Create monitoring charts |[Monitor your StorSimple device](storsimple-monitor-device.md) |
| Add a volume container</br>Modify a volume container</br>Delete a volume container |[Manage volume containers](storsimple-8000-manage-volume-containers.md) |
| Add a volume</br>Modify a volume</br>Take a volume offline</br>Delete a volume</br>Monitor a volume |[Manage volumes](storsimple-8000-manage-volumes-u2.md) |
| Modify device settings</br>Modify time settings</br>Modify DNS.md settings</br>Configure network interfaces |[Modify device configuration for your StorSimple device](storsimple-8000-modify-device-config.md) |
| View web proxy settings |[Configure web proxy for your device](storsimple-8000-configure-web-proxy.md) |
| Modify device administrator password</br>Modify StorSimple Snapshot Manager password |[Change StorSimple passwords](storsimple-8000-change-passwords.md) |
| Configure remote management |[Connect remotely to your StorSimple device](storsimple-8000-remote-connect.md) |
| Configure alert settings |[View and manage StorSimple alerts](storsimple-8000-manage-alerts.md) |
| Configure CHAP for your StorSimple device |[Configure CHAP for your StorSimple device](storsimple-configure-chap.md) |
| Add a backup policy</br>Add or modify a schedule</br>Delete a backup policy</br>Take a manual backup</br>Create a custom backup policy with multiple volumes and schedules |[Manage backup policies](storsimple-8000-manage-backup-policies-u2.md) |
| Stop device controllers</br>Restart device controllers</br>Shut down device controllers</br>Reset your device to factory defaults</br>(Above are for on-premises device only) |[Manage StorSimple device controller](storsimple-8000-manage-device-controller.md) |
| Learn about StorSimple hardware components</br>Monitor hardware status</br>(Above are for on-premises device only) |[Monitor hardware components](storsimple-8000-monitor-hardware-status.md) |
| Create a support package |[Create and manage a Support package](storsimple-8000-contact-microsoft-support.md#start-a-support-session-in-windows-powershell-for-storsimple) |
| Install software updates |[Update your device](storsimple-update-device.md) |

## Next steps

If you experience any issues with the day-to-day operation of your StorSimple device or with any of its hardware components, refer to:

* [Troubleshoot using the Diagnostics tool](storsimple-8000-diagnostics.md)
* [Use StorSimple monitoring indicator LEDs](storsimple-monitoring-indicators.md)

If you cannot resolve the issues and you need to create a service request, refer to [Contact Microsoft Support](storsimple-8000-contact-microsoft-support.md).

