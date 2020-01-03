---
title: Migrate storage accounts, subscriptions for your StorSimple Device Manager service | Microsoft Docs
description: Learn how to migrate subscriptions, storage accounts for your StorSimple Device Manager service8000.
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
ms.date: 03/14/2019
ms.author: alkohli

---
# Migrate subscriptions and storage accounts associated with StorSimple Device Manager service

You may need to move your StorSimple service to a new enrollment or to a new subscription. These migration scenarios are either account changes or datacenter changes. Use the following table to understand which of these scenarios are supported including the detailed steps to move.

## Account changes

| Can you move …| Supported| Downtime| Azure Support process| Approach|
|-----|-----|-----|-----|-----|
| An entire subscription (includes StorSimple service and storage accounts) to another enrollment? | Yes       | No       | **Enrollment Transfer**<br>Use :<li>When you  purchase a new Azure commitment under a new agreement.</li><li>You want to migrate all accounts and subscriptions from the old enrollment to the new. This includes all the Azure services under the old subscription.</li> | **Step 1: Open an Azure Enterprise Operation Support ticket.**<li>Go to [https://aka.ms/AzureEntSupport](https://aka.ms/AzureEntSupport).</li><li> Select **Enrollment Administration** and then select **Transfer from one enrollment to a new enrollment**.<br>**Step 2: Provide the requested information**<br>Include:<li>source enrollment number</li><li> destination enrollment number</li><li>transfer effective date|
| StorSimple service from an existing account to a new enrollment?    | Yes       | No       | **Account Transfer**<br>Use:<li>When you do not want a full enrollment transfer.</li><li>You only want to move specific accounts to a new enrollment.</li>| **Step 1: Open an Azure Enterprise Operation Support ticket.**<li>Go to [https://aka.ms/AzureEntSupport](https://aka.ms/AzureEntSupport).</li><li>Select **Enrollment Administration** and then select **Transfer an EA Account to a new enrollment**.<br>**Step 2: Provide the requested information**<br>Include:<li>source enrollment number</li><li> destination enrollment number</li><li>transfer effective date|
| StorSimple service from one subscription to another subscription?      | No        |    Yes         | None, manual process|<li>Migrate data off the StorSimple device.</li><li>Perform a factory reset of the device, this deletes any local data on the device.</li><li>Register the device with the new subscription to a StorSimple Device Manager service.</li><li>Migrate the data back to the device.|
|Can I transfer ownership of an Azure subscription to another directory? | Yes       | No       | Associate an existing subscription to your Azure AD directory | Refer [To associate an existing subscription to your Azure AD directory](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md). It might take up to 10 minutes for everything to show up properly.|
| StorSimple device from one StorSimple Device Manager service to another service in a different region?      | No        | Yes            | None, manual process |Same as above.|
| Storage account to a new subscription or resource group?     | Yes        | No             |Move storage account to different subscription or resource group |After the move, if the storage account access keys are updated, the user will need to configure the access keys manually for the migrated storage account through the StorSimple Device Manager service.|
| Classic storage account to an Azure Resource Manager storage account      | Yes        | No             |Migrate from classic to Azure Resource Manager |<li>For detailed instructions on how to migrate a storage account from classic to Azure Resource Manager, go to [Migrate a classic storage account](../virtual-machines/windows/migration-classic-resource-manager-ps.md#step-62-migrate-a-storage-account).</li><li> If the storage account access keys are updated after migration, the user will need to synchronize the access keys for the migrated storage account through the StorSimple Device Manager service. This is to ensure the StorSimple devices continue to function normally and are able to tier primary/backup data to Azure. For detailed instructions on synchronizing access keys, go to [Rotation workflow](storsimple-8000-manage-storage-accounts.md#key-rotation-of-storage-accounts).</li><li> In the case of a StorSimple Cloud Appliance, if the classic storage account is migrated but the underlying virtual machine still stays in classic, the appliance should function properly. If the underlying virtual machine for the cloud appliance is migrated, then the deactivate and delete functionality will not work.</li><li> You must create a new StorSimple Cloud Appliances in the Azure portal and then fail over from the older cloud appliances. You cannot create a StorSimple Cloud Appliance in the new Azure portal using a classic storage account, they need to have an Azure Resource Manager storage account. For more information, go to [Deploy and manage a StorSimple Cloud Appliance](storsimple-8000-cloud-appliance-u2.md).</li>|

## Datacenter changes

| Can you move …| Supported|Downtime| Azure Support process| Approach|
|-----|-----|-----|-----|-----|
| A StorSimple service from one Azure datacenter to another? | No | Yes |None, manual process  |<li>Migrate data off the StorSimple device.</li><li>Perform a factory reset of the device, this deletes any local data on the device.</li><li>Register the device with the new subscription to a new StorSimple Device Manager service.</li><li>Migrate the data back to the device.|
| A storage account from one Azure datacenter to another? | No |Yes  |None, manual process  | Same as above.|

## Next steps

* [Deploy StorSimple Device Manager service](storsimple-8000-manage-service.md)
* [Deploy StorSimple 8000 series device in Azure portal](storsimple-8000-deployment-walkthrough-u2.md)
