---
title: Move from classic to Azure portal FAQ| Microsoft Docs
description: Provides answers to frequently asked questions about moving StorSimple devices from classic to Azure portal.
services: storsimple
documentationcenter: NA
author: alkohli 
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/21/2017 
ms.author: alkohli

---
# Move StorSimple Device Manager service from classic to Azure portal: frequently asked questions (FAQ)

## Overview

The following are questions and answers that you may have when you move your StorSimple Device Manager service running in classic portal to Azure portal.

Questions and answers are arranged in the following categories:

* Moving StorSimple Device Manager service
* Using Azure Resource Manager based cmdlets
* Moving storage accounts
* Miscellaneous


## Moving StorSimple Device Manager service

### Can I create a StorSimple Manager in the old classic portal?

No. Once you have migrated your StorSimple Manager service to the new Azure portal, you cannot create a new service in the classic portal. Also, you cannot manage your device via the Azure classic portal. For more information, go to [Move your service to Azure portal](storsimple-8000-manage-service.md#move-a-service-to-azure-portal).

### I have multiple StorSimple Managers running in the Azure classic portal. Can I choose which ones to move to the Azure portal?

No. You cannot choose which StorSimple Managers to move to the Azure portal. All the StorSimple Managers tied to your subscription are moved.

### Can I migrate StorSimple Device Manager from one subscription to another subscription in the new Azure portal?

No. Moving StorSimple Device Manager service from one subscription to another is not supported. You can perform a manual process consisting of the following steps:

* Migrate data off the StorSimple device.
* Perform a factory reset of the device, this deletes any local data on the device.
* Register the device with the new subscription to a StorSimple Device Manager service.
* Migrate the data back to the device.

### I initiated the migration of my service to the new Azure portal. I then deleted the StorSimple Manager from the Azure classic portal. I now see this error. What should I do?

From the error message, it seems that you deleted the service while the migration was in progress. At this point, you should contact Microsoft Support and file a service request. For more information, go to [Log a support ticket with Microsoft Support](storsimple-8000-contact-microsoft-support.md).

### I tried to rename my StorSimple Device Manager service. I got an error. Can I not rename the service?

No. The service name cannot be changed after the service is created. The same behavior is also true for other entities such as devices, volumes, volume containers, and backup policies.

### I am using StorSimple Data Manager service. How should I proceed with this move?

If you are using StorSimple Data Manager service, you must move your StorSimple Device Managers first to the new Azure portal. Once the move is complete, create new StorSimple Data Managers in the Azure portal. StorSimple Data Managers created prior to the move do not work.

For more information on StorSimple Device Manager service migration, go to [Move your service to Azure portal](storsimple-8000-manage-service.md#move-a-service-to-azure-portal). For more information on StorSimple Data Manager creation, go to [Create a StorSimple Data Manager service](storsimple-data-manager-ui.md).


### Can I create the 8010/8020 VMs with Azure Resource Manager deployment model?




### Can I manage the existing classic 8010/8020 devices from the new Azure portal?

Yes. If you have created StorSimple Cloud appliances mode 8010/8020 running Update 4.0 and above, you are not impacted by your service moving to the new Azure portal. You should be able to manage your cloud appliances without any issues. If you have cloud appliances running versions prior to Update 3.0 in the classic portal, then you need to create new 8010/8020 devices in the Azure portal.

### My StorSimple 8000 series device is running Update 2.0. I migrated my service to new Azure portal. My device connected successfully but I see errors in the portal. How do I resolve these errors?

The new Azure portal is supported only for StorSimple devices running Update 3.0 and higher. If your device was running Update 2.0, you only have limited functionality available for this device. For more information, go to the [list of unsupported operations for devices running versions prior to Update 3](storsimple-8000-manage-service.md#move-a-service-to-azure-portal).

To get full control over your device, install the latest update on your device. For more information, go to [Install Update 5](storsimple-8000-install-update-5.md).

### I am using a StorSimple 5000/7000 series device. Are these also supported in the Azure portal?

No. The StorSimple 5000/7000 series devices are not supported in the Azure portal.

### I am planning to migrate data from StorSimple 5000/7000 series device to a StorSimple 8000 series device. How does moving a service to Azure portal impact my data migration? 

You can migrate data from your StorSimple 5000/7000 series device to a StorSimple 8000 series device running in Azure portal. To enable you for data migration from 5000/7000 series to 8000 series, you must [Log a Support ticket with Microsoft Support](storsimple-8000-contact-microsoft-support.md).


## Moving storage accounts, resource groups

### Do I have to migrate the storage account to Azure Resource Manager deployment model?

No. When you move your service to the Azure portal, your storage account is automatically transitioned as a classic storage account. Do not migrate the storage account to Resource Manager and continue to operate on the storage account through classic operations.

### What happens to the storage account after the service is migrated to the Azure portal?

When you move your service to the Azure portal, your storage account is automatically transitioned as well. Do note that the storage account is moved as a classic storage account. Your device should continue to run with this storage account and there should be no impact to your data.

### When we migrate subscriptions to the new portal all the SCAs go with underneath the SSM, right? I assume so, but had a question on it and wanted to confirm.

### Can I migrate from one resource group to another?


## Using Azure Resource Manager based cmdlets

### Could you explain how to use the new Azure Resource Manager based SDK?


### I moved to the new Azure portal. Now my scripts based on Azure PowerShell cmdlets are not working? What do I need to do?

The existing Azure Service Management (ASM) PowerShell cmdlets are not supported in the Azure portal. Update the scripts to manage your devices through the Azure Resource Manager.

### If I am using Windows PowerShell for StorSimple cmdlets on the StorSimple device to extract a Support package, is that affected when I move to the new Azure portal?

No. With your service moving to new Azure portal, there should be no impact on the Windows PowerShell for StorSimple cmdlets associated with the on-premises StorSimple device. You can continue to use these cmdlets to create a Support package without any issues even in the new Azure portal. Only the Azure PowerShell cmdlets are impacted by this move.



## Miscellaneous

### I am running StorSimple Snapshot Manager for my 8000 series device. Is there any impact on StorSimple Snapshot Manager when I move to Azure portal?

No. There is no impact to StorSimple Snapshot Manager when you move your service to Azure portal. Your device and StorSimple Snapshot Manager will continue to operate as before.

### Can I rename my StorSimple device, volume containers, or volumes?

No. Entities such as devices, volumes, volume containers, and backup policies that cannot be renamed in the Azure portal.

## Next steps

Learn step-by-step how to [move your StorSimple Device Manager service to Azure portal](storsimple-8000-manage-service.md#move-a-service-to-azure-portal).



