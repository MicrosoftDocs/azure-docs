---
title: Microsoft Azure StorSimple Manager Virtual Array administration | Microsoft Docs
description: Learn how to manage your StorSimple on-premises Virtual Array by using the StorSimple Device Manager service in the Azure portal.
services: storsimple
documentationcenter: ''
author: alkohli
manager: carmonm
editor: ''

ms.assetid: 958244a5-f9f5-455e-b7ef-71a65558872e
ms.service: storsimple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/1/2016
ms.author: alkohli
---
# Use the StorSimple Device Manager service to administer your StorSimple Virtual Array
![setup process flow](./media/storsimple-virtual-array-manager-service-administration/manage4.png)

## Overview
This article describes the StorSimple Device Manager service interface, including how to connect to it and the various options available, and provides links to the specific workflows that can be performed via this UI.

After reading this article, you will know how to:

* Connect to the StorSimple Device Manager service
* Navigate the StorSimple Device Manager UI
* Administer your StorSimple Virtual Array via the StorSimple Device Manager service

> [!NOTE]
> To view the management options available for the StorSimple 8000 series device, go to [Use the StorSimple Manager service to administer your StorSimple device](storsimple-manager-service-administration.md).
> 
> 

## Connect to the StorSimple Device Manager service
The StorSimple Device Manager service runs in Microsoft Azure and connects to multiple StorSimple Virtual Arrays. You use a central Microsoft Azure portal running in a browser to manage these devices. To connect to the StorSimple Device Manager service, do the following.

#### To connect to the service
1. Go to [https://ms.portal.azure.com](https://ms.portal.azure.com).
2. Using your Microsoft account credentials, log on to the Microsoft Azure portal (located at the top-right of the pane).
3. Navigate to Browse --> 'Filter' on StorSimple Device Managers to view all your device managers in a given subscription.

## Use the StorSimple Device Manager service to perform management tasks
The following table shows a summary of all the common management tasks and complex workflows that can be performed within the StorSimple Device Manager service summary blade. These tasks are organized based on the blades on which they are initiated.

For more information about each workflow, click the appropriate procedure in the table.

#### StorSimple Device Manager workflows
| If you want to do this ... | Use this procedure |
| --- | --- |
| Create a service</br>Delete a service</br>Get the service registration key</br>Regenerate the service registration key |[Deploy the StorSimple Device Manager service](storsimple-virtual-array-manage-service.md) |
| View the activity logs |[Use the StorSimple service summary](storsimple-virtual-array-service-summary.md) |
| Deactivate a Virtual Array</br>Delete a Virtual Array |[Deactivate or delete a virtual array](storsimple-virtual-array-deactivate-and-delete-device.md) |
| Disaster recovery and device failover</br>Failover prerequisites</br>Business continuity disaster recovery (BCDR)</br>Errors during disaster recovery |[Disaster recovery and device failover for your StorSimple Virtual Array](storsimple-virtual-array-failover-dr.md) |
| Back up shares and volumes</br>Take a manual backup</br>Change the backup schedule</br>View existing backups |[Back up your StorSimple Virtual Array](storsimple-virtual-array-backup.md) |
| Clone shares from a backup set</br>Clone volumes from a backup set</br>Item-level recovery (file server only) |[Clone from a backup of your StorSimple Virtual Array](storsimple-virtual-array-clone.md) |
| About  storage accounts</br>Add a storage account</br>Edit a storage account</br>Delete a storage account |[Manage storage accounts for the StorSimple Virtual Array](storsimple-virtual-array-manage-storage-accounts.md) |
| About access control records</br>Add or modify an access control record </br>Delete an access control record |[Manage access control records for the StorSimple Virtual Array](storsimple-virtual-array-manage-acrs.md) |
| View job details |[Manage StorSimple Virtual Array jobs](storsimple-virtual-array-manage-jobs.md) |
| Configure alert settings</br>Receive alert notifications</br>Manage alerts</br>Review alerts |[View and manage alerts for the StorSimple Virtual Array](storsimple-virtual-array-manage-alerts.md) |
| Modify the device administrator password |[Change the StorSimple Virtual Array device administrator password](storsimple-virtual-array-change-device-admin-password.md) |
| Install software updates |[Update your Virtual Array](storsimple-virtual-array-install-update.md) |

> [!NOTE]
> You must use the [local web UI](storsimple-ova-web-ui-admin.md) for the following tasks:
> 
> * [Retrieve the service data encryption key](storsimple-ova-web-ui-admin.md#get-the-service-data-encryption-key)
> * [Create a support package](storsimple-ova-web-ui-admin.md#generate-a-log-package)
> * [Stop and restart a Virtual Array](storsimple-ova-web-ui-admin.md#shut-down-and-restart-your-device)
> 
> 

## Next steps
For information about the web UI and how to use it, go to [Use the StorSimple web UI to administer your StorSimple Virtual Array](storsimple-ova-web-ui-admin.md).

