---
title: include file
description: include file
services: storage
author: khdownie
ms.service: azure-file-storage
ms.topic: include
ms.date: 2/20/2020
ms.author: kendownie
ms.custom: include file
---
Service data encryption keys are used to encrypt confidential customer data, such as storage account credentials, that are sent from your StorSimple Manager service to the StorSimple device. You will need to change these keys periodically if your IT organization has a key rotation policy on the storage devices. The key change process can be slightly different depending on whether there is a single device or multiple devices managed by the StorSimple Manager service. For more information, go to [StorSimple security and data protection](../articles/storsimple/storsimple-8000-security.md).

Changing the service data encryption key is a 3-step process:

1. Using Windows PowerShell scripts for Azure Resource Manager, authorize a device to change the service data encryption key.
2. Using Windows PowerShell for StorSimple, initiate the service data encryption key change.
3. If you have more than one StorSimple device, update the service data encryption key on the other devices.

### Step 1: Use Windows PowerShell script to Authorize a device to change the service data encryption key
Typically, the device administrator will request that the service administrator authorize a device to change service data encryption keys. The service administrator will then authorize the device to change the key.

This step is performed using the Azure Resource Manager based script. The service administrator can select a device that is eligible to be authorized. The device is then authorized to start the service data encryption key change process. 

For more information about using the script, go to [Authorize-ServiceEncryptionRollover.ps1](https://github.com/anoobbacker/storsimpledevicemgmttools/blob/master/Authorize-ServiceEncryptionRollover.ps1)

#### Which devices can be authorized to change service data encryption keys?
A device must meet the following criteria before it can be authorized to initiate service data encryption key changes:

* The device must be online to be eligible for service data encryption key change authorization.
* You can authorize the same device again after 30 minutes if the key change has not been initiated.
* You can authorize a different device, provided that the key change has not been initiated by the previously authorized device. After the new device has been authorized, the old device cannot initiate the change.
* You cannot authorize a device while the rollover of the service data encryption key is in progress.
* You can authorize a device when some of the devices registered with the service have rolled over the encryption while others have not. 

### Step 2: Use Windows PowerShell for StorSimple to initiate the service data encryption key change
This step is performed in the Windows PowerShell for StorSimple interface on the authorized StorSimple device.

> [!NOTE]
> No operations can be performed in the Azure portal of your StorSimple Manager service until the key rollover is completed.


If you are using the device serial console to connect to the Windows PowerShell interface, perform the following steps.

#### To initiate the service data encryption key change
1. Select option 1 to log on with full access.
2. At the command prompt, type:
   
     `Invoke-HcsmServiceDataEncryptionKeyChange`
3. After the cmdlet has successfully completed, you will get a new service data encryption key. Copy and save this key for use in step 3 of this process. This key will be used to update all the remaining devices registered with the StorSimple Manager service.
   
   > [!NOTE]
   > This process must be initiated within four hours of authorizing a StorSimple device.
   > 
   > 
   
   This new key is then sent to the service to be pushed to all the devices that are registered with the service. An alert will then appear on the service dashboard. The service will disable all the operations on the registered devices, and the device administrator will then need to update the service data encryption key on the other devices. However, the I/Os (hosts sending data to the cloud) will not be disrupted.
   
   If you have a single device registered to your service, the rollover process is now complete and you can skip the next step. If you have multiple devices registered to your service, proceed to step 3.

### Step 3: Update the service data encryption key on other StorSimple devices
These steps must be performed in the Windows PowerShell interface of your StorSimple device if you have multiple devices registered to your StorSimple Manager service. The key that you obtained in Step 2 must be used to update all the remaining StorSimple device registered with the StorSimple Manager service.

Perform the following steps to update the service data encryption on your device.

#### To update the service data encryption key on physical devices
1. Use Windows PowerShell for StorSimple to connect to the console. Select option 1 to log on with full access.
2. At the command prompt, type:
    `Invoke-HcsmServiceDataEncryptionKeyChange – ServiceDataEncryptionKey`
3. Provide the service data encryption key that you obtained in [Step 2: Use Windows PowerShell for StorSimple to initiate the service data encryption key change](#to-initiate-the-service-data-encryption-key-change).

#### To update the service data encryption key on all the 8010/8020 cloud appliances
1. Download and setup [Update-CloudApplianceServiceEncryptionKey.ps1](https://github.com/anoobbacker/storsimpledevicemgmttools/blob/master/Update-CloudApplianceServiceEncryptionKey.ps1) PowerShell script. 
2. Open PowerShell and at the command prompt, type: 
    `Update-CloudApplianceServiceEncryptionKey.ps1 -SubscriptionId [subscription] -TenantId [tenantid] -ResourceGroupName [resource group] -ManagerName [device manager]`

This script will ensure that service data encryption key is set on all the 8010/8020 cloud appliances under the device manager.