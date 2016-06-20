<properties 
   pageTitle="StorSimple Manager service administration | Microsoft Azure"
   description="Learn how to manage your StorSimple device by using the StorSimple Manager service in the Azure classic portal."
   services="storsimple"
   documentationCenter=""
   authors="alkohli"
   manager="carmonm"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/24/2016"
   ms.author="alkohli" />

# Use the StorSimple Manager service to administer your StorSimple device

## Overview

This article describes the StorSimple Manager service interface, including how to connect to it, the various options available, and links out to the specific workflows that can be performed via this UI. This guidance is applicable to both; the StorSimple physical and the virtual device.

After reading this article, you will learn to:

- Connect to StorSimple Manager service
- Navigate the StorSimple Manager UI
- Administer your StorSimple device via the StorSimple Manager service


## Connect to StorSimple Manager service

The StorSimple Manager service runs in Microsoft Azure and connects to multiple StorSimple devices. You use a central Microsoft Azure classic portal running in a browser to manage these devices. To connect to the StorSimple Manager service, do the following.

#### To connect to the service

1. Navigate to [https://manage.windowsazure.com/](https://manage.windowsazure.com/).

1. Using your Microsoft account credentials, log on to the Microsoft Azure classic portal (located at the top-right of the pane).

1. Scroll down the left navigation pane to access the StorSimple Manager service.


## Navigate StorSimple Manager service UI

The navigational hierarchy for the StorSimple Manager service UI is shown in the following table.

- **StorSimple Manager** landing page takes you to the UI service-level pages applicable to all devices within a service.

- **Devices** page takes you to the device–level UI pages applicable to a specific device.

- **Volume Containers** page takes you to the volume page that shows all the volumes associated with a device.


#### StorSimple Manager service navigational hierarchy

|Landing page|Service-level pages|Device-level pages|Device-level pages|
|---|---|---|---|
|StorSimple Manager service|Service dashboard|Device dashboard||
||Devices →|Monitor|
||Backup catalog|Volume containers→|Volumes|
||Configure (Service)|Backup policies||
||Jobs|Configure (Device)|
||Alerts|Maintenance|

![Video available](./media/storsimple-manager-service-administration/Video_icon.png) **Video available**

To watch a video that walks you through the StorSimple Manager service user interface, click [here](https://azure.microsoft.com/documentation/videos/storsimple-manager-service-overview/).

## Administer StorSimple device using StorSimple Manager service

The following table shows a summary of all the common management tasks and complex workflows that can be performed within the StorSimple Manager service UI. These tasks are organized based on the UI pages on which they are initiated.

For more information about each workflow, click the appropriate procedure in the table.

#### StorSimple Manager workflows

|If you want to do this ...|Go to this UI page ...|Use this procedure.|
|---|---|---|
|Create a service</br>Delete a service</br>Get service registration key</br>Regenerate service registration key|StorSimple Manager service|[Deploy a StorSimple Manager service](storsimple-manage-service.md)
|Change the service data encryption key</br>View the operation logs|StorSimple Manager service → Dashboard|[Use the StorSimple Manager service dashboard](storsimple-service-dashboard.md)|
|Deactivate a device</br>Delete a device|StorSimple Manager service → Devices|[Deactivate or delete a device](storsimple-deactivate-and-delete-device.md)|
|Learn about disaster recovery and device failover</br>Failover to a physical device</br>Failover to a virtual device</br>Business continuity disaster recovery (BCDR)|StorSimple Manager service → Devices|[Failover and disaster recovery for your StorSimple device](storsimple-device-failover-disaster-recovery.md)|
|List backups for a volume</br>Select a backup set</br>Delete a backup set|StorSimple Manager service → Backup Catalog|[Manage backups](storsimple-manage-backup-catalog.md)|
|Clone a volume|StorSimple Manager service → Backup Catalog|[Clone a volume](storsimple-clone-volume.md)|
|Restore a backup set|StorSimple Manager service → Backup Catalog|[Restore a backup set](storsimple-restore-from-backup-set.md)|
|About  storage accounts</br>Add a storage account</br>Edit a storage account</br>Delete a storage account</br>Key rotation of storage accounts|StorSimple Manager service → Configure|[Manage storage accounts](storsimple-manage-storage-accounts.md)|
|About bandwidth templates</br>Add a bandwidth template</br>Edit a bandwidth template</br>Delete a bandwidth template</br>Use a default bandwidth template</br>Create an all-day bandwidth template that starts at a specified time|StorSimple Manager service → Configure|[Manage bandwidth templates](storsimple-manage-bandwidth-templates.md)|
|About access control records</br>Create an access control record</br>Edit an access control record</br>Delete an access control record|StorSimple Manager service → Configure|[Manage access control records](storsimple-manage-acrs.md)|
|View job details</br>Cancel a job|StorSimple Manager service → Jobs|[Manage jobs](storsimple-manage-jobs.md)
|Receive alert notifications</br>Manage alerts</br>Review alerts|StorSimple Manager service → Alerts|[View and manage StorSimple alerts](storsimple-manage-alerts.md)
|View connected initiators</br>Find the device serial number</br>Find the target IQN|StorSimple Manager service → Devices → Dashboard|[Use the StorSimple device dashboard](storsimple-device-dashboard.md)|
|Create monitoring charts|StorSimple Manager service → Devices → Monitor|[Monitor your StorSimple device](storsimple-monitor-device.md)|
|Add a volume container</br>Modify a volume container</br>Delete a volume container|StorSimple Manager service → Devices → Volume Containers|[Manage volume containers](storsimple-manage-volume-containers.md)|
|Add a volume</br>Modify a volume</br>Take a volume offline</br>Delete a volume</br>Monitor a volume|StorSimple Manager service → Devices → Volume Containers → Volumes|[Manage volumes](storsimple-manage-volumes.md)|
|Modify device settings</br>Modify time settings</br>Modify DNS.md settings</br>Configure network interfaces|StorSimple Manager service → Devices → Configure|[Modify device configuration for your StorSimple device](storsimple-modify-device-config.md)|
|View web proxy settings|StorSimple Manager service → Devices → Configure|[Configure web proxy for your device](storsimple-configure-web-proxy.md)|
|Modify device administrator password</br>Modify StorSimple Snapshot Manager password|StorSimple Manager service → Devices → Configure|[Change StorSimple passwords](storsimple-change-passwords.md)|
|Configure remote management|StorSimple Manager service → Devices → Configure|[Connect remotely to your StorSimple device](storsimple-remote-connect.md)|
|Configure alert settings|StorSimple Manager service → Devices → Configure|[View and manage StorSimple alerts](storsimple-manage-alerts.md)|
|Configure CHAP for your StorSimple device|StorSimple Manager service → Devices → Configure|[Configure CHAP for your StorSimple device](storsimple-configure-chap.md)|
|Add a backup policy</br>Add or modify a schedule</br>Delete a backup policy</br>Take a manual backup</br>Create a custom backup policy with multiple volumes and schedules|StorSimple Manager service → Devices → Backup policies|[Manage backup policies](storsimple-manage-backup-policies.md)|
|Stop device controllers</br>Restart device controllers</br>Shut down device controllers</br>Reset your device to factory defaults</br>(Above are for on-premises device only)|StorSimple Manager service → Devices → Maintenance|[Manage StorSimple device controller](storsimple-manage-device-controller.md)|
|Learn about StorSimple hardware components</br>Monitor hardware status</br>(Above are for on-premises device only)|StorSimple Manager service → Devices → Maintenance|[Monitor hardware components](storsimple-monitor-hardware-status.md)|
|Create a support package|StorSimple Manager service → Devices → Maintenance|[Create and manage a Support package](storsimple-create-manage-support-package.md)|
|Install software updates|StorSimple Manager service → Devices → Maintenance|[Update your device](storsimple-update-device.md)|


##Next steps
If you experience any issues with the day-to-day operation of your StorSimple device or with any of its hardware components, refer to:

- [Troubleshoot an operational device](storsimple-troubleshoot-operational-device.md)
- [Use StorSimple monitoring indicator LEDs](storsimple-monitoring-indicators.md)

If you cannot resolve the issues and you need to create a service request, refer to [Contact Microsoft Support](storsimple-contact-microsoft-support.md).
