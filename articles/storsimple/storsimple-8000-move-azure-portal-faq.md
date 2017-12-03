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
ms.date: 09/28/2017 
ms.author: alkohli

---
# Move StorSimple Device Manager service from classic to Azure portal: frequently asked questions (FAQ)

## Overview

The following are questions and answers that you may have when you move your StorSimple Device Manager service running in Azure classic portal to Azure portal.

Questions and answers are arranged in the following categories:

* Moving StorSimple Device Manager service
* Moving storage accounts
* Using Azure Resource Manager based cmdlets
* Using StorSimple Data Manager service
* Miscellaneous

## Moving StorSimple Device Manager service

### Once I have moved to Azure portal, can I still create a StorSimple Manager service in the classic portal?

No. Once you have migrated your StorSimple Manager service to the Azure portal, you cannot create a new service in the classic portal. Also, you cannot manage your device via the classic portal. For more information, go to [Move your service to Azure portal](storsimple-8000-manage-service.md#move-a-service-to-azure-portal).

### I have multiple StorSimple Managers running in the classic portal. Can I choose which ones to move to the Azure portal?

No. You cannot choose which StorSimple Managers to move to the Azure portal. All the StorSimple Managers under your subscription are moved.


### I initiated the migration of my service to the new Azure portal. Should I delete the StorSimple Manager from the classic portal? 

No. Do not attempt to delete any service that you have moved from the classic portal. Wait for the migration to complete, once all the StorSimple Managers have moved to the new portal, you would not have to delete any services from the classic portal. Eventually the classic portal is deprecated.

### Can I rename my StorSimple Device Manager service in the Azure portal?

No. The service name cannot be changed after the service is created in the Azure portal. The same behavior is also true for other entities such as devices, volumes, volume containers, and backup policies.

### Can I create the 8010/8020 StorSimple Cloud Appliances with Azure Resource Manager deployment model?

Yes. You can create new 8010/8020 StorSimple Cloud Appliances in the Azure Resource Manager deployment model. The underlying VMs for these cloud appliances are also in the Resource Manager deployment model.

### When we migrate subscriptions to the Azure portal, will the underlying VMs for the StorSimple Cloud Appliances also migrate to Azure Resource Management deployment model?

The StorSimple service move is independent of the management of the VMs for the StorSimple Cloud Appliances. You can fully manage the VMs for StorSimple Cloud Appliances in both the classic and the Azure portal even today.

### Can I manage existing classic 8010/8020 StorSimple Cloud Appliance from the Azure portal?

Yes. The VMs associated with existing 8010/8020 cloud appliances can be managed from the Azure portal.

If you have created StorSimple Cloud appliances model 8010/8020 running Update 3.0 and above, you are not impacted by your service moving to the new Azure portal. You should be able to fully manage your cloud appliances without any issues. 

If you have cloud appliances running versions prior to Update 3.0 in the classic portal, then you only have limited functionality available. For more information, go to the [list of unsupported operations for devices running versions prior to Update 3](storsimple-8000-manage-service.md#move-a-service-to-azure-portal).

You cannot update a cloud appliance. Use the latest version of software to create a new cloud appliance and then fail over the existing volume containers to the new cloud appliance created. For more information, go to [Fail over to the cloud appliance](storsimple-8000-cloud-appliance-u2.md#fail-over-to-the-cloud-appliance)


### My StorSimple 8000 series device is running Update 2.0. I migrated my service to new Azure portal. My device connected successfully but it seems that I am not able to fully manage my device. How do I resolve this behavior?

The new Azure portal is supported only for StorSimple devices running Update 3.0 and higher. If your device was running Update 2.0, you only have limited functionality available for this device. For more information, go to the [list of unsupported operations for devices running versions prior to Update 3](storsimple-8000-manage-service.md#move-a-service-to-azure-portal).

To fully manage your device, install the latest update on your device. For more information, go to [Install Update 5](storsimple-8000-install-update-5.md).

### I just moved my StorSimple Manager service to the Azure portal. I am seeing some alerts related to my device. Is this behavior related to the move?

No. The move itself should not result in errors or alerts. Follow the alert recommendations to resolve the alerts.

### I am using a StorSimple 5000/7000 series device. Are these also supported in the Azure portal?

No. The StorSimple 5000/7000 series devices are not supported in the Azure portal.

### I am planning to migrate data from StorSimple 5000/7000 series device to a StorSimple 8000 series device. How does moving a service to Azure portal impact my data migration? 

You can migrate data from your StorSimple 5000/7000 series device to a StorSimple 8000 series device running in Azure portal. To enable you for data migration from 5000/7000 series to 8000 series, you must [Log a Support ticket with Microsoft Support](storsimple-8000-contact-microsoft-support.md).


## Moving subscriptions, storage accounts, resource groups

### Can I move StorSimple Device Manager from one subscription to another subscription in the Azure portal?

No. Moving StorSimple Device Manager service from one subscription to another is not supported. You can perform a manual process consisting of the following steps:

* Migrate data off the StorSimple device.
* Perform a factory reset of the device, this deletes any local data on the device.
* Register the device with the new subscription to a StorSimple Device Manager service.
* Migrate the data back to the device.

### Do I have to migrate the storage account to Azure Resource Manager deployment model?

No. Your classic storage accounts can be fully managed from the Azure portal. When you move your StorSimple service to the Azure portal, your storage account continues to operate as before.

### What happens to the storage account after the service is migrated to the Azure portal?

The move of the service is not related to the management of storage account. Both classic and Azure Resource Manager storage accounts can be fully managed within the Azure portal. Once you move your service to the Azure portal, your device should continue to run with this storage account and there should be no impact to your data.

### Can I migrate StorSimple Device Manager from one resource group to another?

No. You cannot move a StorSimple Device Manager created with one resource group to another resource group.

## Using Azure Resource Manager based cmdlets

### I moved to the new Azure portal. Now my scripts based on Azure classic deployment model PowerShell cmdlets are not working? What do I need to do?

The existing Azure classic deployment model PowerShell cmdlets are not supported in the Azure portal. Update the scripts to manage your devices through the Azure Resource Manager. For more information on updating your scripts, go to [Samples for the new Azure portal](https://github.com/anoobbacker/storsimpledevicemgmttools).

### I just moved to the Azure portal and needed to roll over the service data encryption key. Where is this option in the Azure portal?

The option to roll over the service data encryption key is not in the Azure portal. For more information on how to do this rollover in Azure portal, go to [Change the service data encryption key](storsimple-8000-manage-service.md#change-the-service-data-encryption-key).

### I am using Windows PowerShell for StorSimple cmdlets on the StorSimple device to perform operations such extract a Support package. Are these cmdlets affected when I move to the new Azure portal?

No. With your service moving to new Azure portal, there should be no impact on the Windows PowerShell for StorSimple cmdlets associated with the on-premises StorSimple device (which itself is not affected by the move). You can continue to use these cmdlets to create a Support package without any issues even in the Azure portal. Only the Azure classic deployment model PowerShell cmdlets are impacted by this move.

## Moving StorSimple Data Manager service

### I am using StorSimple Data Manager service. How should I proceed with this move?

If you are using StorSimple Data Manager service, you must move your StorSimple Device Managers first to the Azure portal. Once the move is complete, create new StorSimple Data Managers in the Azure portal. StorSimple Data Managers created prior to the move do not work.

For more information on StorSimple Device Manager service migration, go to [Move your service to Azure portal](storsimple-8000-manage-service.md#move-a-service-to-azure-portal). For more information on StorSimple Data Manager creation, go to [Create a StorSimple Data Manager service](storsimple-data-manager-ui.md).

## Miscellaneous

### I am running StorSimple Snapshot Manager for my 8000 series device. Is there any impact on StorSimple Snapshot Manager when I move to Azure portal?

No. There is no impact to StorSimple Snapshot Manager when you move your service to Azure portal. Your device and StorSimple Snapshot Manager continue to operate as before.

### Can I rename my StorSimple device, volume containers, or volumes?

No. You cannot rename devices, volumes, volume containers, or backup policies in the Azure portal.

## Next steps

Learn step-by-step how to [move your StorSimple Device Manager service to Azure portal](storsimple-8000-manage-service.md#move-a-service-to-azure-portal).



