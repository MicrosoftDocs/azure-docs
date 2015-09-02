<properties 
   pageTitle="Change the StorSimple data encryption key"
   description="Describes how to authorize a StorSimple device so that it can change the data encryption key, and then explains the key change process."
   services="storsimple"
   documentationCenter=""
   authors="SharS"
   manager="carolz"
   editor="tysonn" />
<tags 
   ms.service="storsimple"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/17/2015"
   ms.author="v-sharos" />

### Step 1: Authorize a device to change the service data encryption key in the Management Portal

Typically, the device administrator will request that the service administrator authorize a device to change service data encryption keys. The service administrator will then authorize the device to change the key.

This step is performed in the Management Portal. The service administrator can select a device from a displayed list of the devices that are eligible to be authorized. The device is then authorized to start the service data encryption key change process.

#### Which devices can be authorized to change service data encryption keys?

A device must meet the following criteria before it can be authorized to initiate service data encryption key changes:

- The device must be online to be eligible for service data encryption key change authorization.

- You can authorize the same device again after 30 minutes if the key change has not been initiated.

- You can authorize a different device, provided that the key change has not been initiated by the previously authorized device. After the new device has been authorized, the old device cannot initiate the change.

- You cannot authorize a device while the rollover of the service data encryption key is in progress.

- You can authorize a device when some of the devices registered with the service have rolled over the encryption while others have not. In such cases, the eligible devices are the ones that have completed the service data encryption key change.

> [AZURE.NOTE]
> In the Management Portal, StorSimple virtual devices are not shown in the list of devices that can be authorized to start the key change.

Perform the following steps to select and authorize a device to initiate the service data encryption key change.

#### To authorize a device to change the key

1. On the service dashboard page, click **Change service data encryption key**.

    ![Change service encryption key](./media/storsimple-change-data-encryption-key/HCS_ChangeServiceDataEncryptionKey-include.png)

2. In the **Change service data encryption key** dialog box, select and authorize a device to initiate the service data encryption key change. The drop-down list has all the eligible devices that can be authorized.

3. Click the check icon ![check icon](./media/storsimple-change-data-encryption-key/HCS_CheckIcon-include.png).

### Step 2: Use Windows PowerShell for StorSimple to initiate the service data encryption key change

This step is performed in the Windows PowerShell for StorSimple interface on the authorized StorSimple device.

> [AZURE.NOTE] No operations can be performed in the Management Portal of your StorSimple Manager service until the key rollover is completed.

If you are using the device serial console to connect to the Windows PowerShell interface, perform the following steps.

#### To initiate the service data encryption key change

1. Select option 1 to log on with full access.

2. At the command prompt, type:

     `Invoke-HcsmServiceDataEncryptionKeyChange`

3. After the cmdlet has successfully completed, you will get a new service data encryption key. Copy and save this key for use in step 3 of this process. This key will be used to update all the remaining devices registered with the StorSimple Manager service.

    > [AZURE.NOTE] This process must be initiated within four hours of authorizing a StorSimple device.

   This new key is then sent to the service to be pushed to all the devices that are registered with the service. An alert will then appear on the service dashboard. The service will disable all the operations on the registered devices, and the device administrator will then need to update the service data encryption key on the other devices. However, the I/Os (hosts sending data to the cloud) will not be disrupted.

   If you have a single device registered to your service, the rollover process is now complete and you can skip the next step. If you have multiple devices registered to your service, proceed to step 3.

### Step 3: Update the service data encryption key on other StorSimple devices

These steps must be performed in the Windows PowerShell interface of your StorSimple device if you have multiple devices registered to your StorSimple Manager service. The key that you obtained in Step 2: Use Windows PowerShell for StorSimple to initiate the service data encryption key change must be used to update all the remaining StorSimple device registered with the StorSimple Manager service.

Perform the following steps to update the service data encryption on your device.

#### To update the service data encryption key

1. Use Windows PowerShell for StorSimple to connect to the console. Select option 1 to log on with full access.

2. At the command prompt, type:

    `Invoke-HcsmServiceDataEncryptionKeyChange – ServiceDataEncryptionKey`

3. Provide the service data encryption key that you obtained in [Step 2: Use Windows PowerShell for StorSimple to initiate the service data encryption key change](#to-initiate-the-service-data-encryption-key-change).



