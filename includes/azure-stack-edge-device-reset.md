---
author: v-dalc
ms.service: databox  
ms.topic: include
ms.date: 02/19/2021
ms.author: alkohli
---

To wipe the data off the data disks of your device, you need to reset your device. You can reset your device using the local web UI or the PowerShell interface.

Before you reset, create a copy of the local data on the device if needed. You can copy the data from the device to an Azure Storage container.

You can initiate the device return even before the device is reset.

To reset your device using the local web UI, take the following steps.

1. In the local web UI, go to **Maintenance > Device reset**.
2. Select **Reset device**.

    ![Reset device](media/azure-stack-edge-device-reset/device-reset-1.png)

3. When prompted for confirmation, review the warning and select **Yes** to continue.

    ![Confirm reset](media/azure-stack-edge-device-reset/device-reset-2.png)  

The reset erases the data off the device data disks. Depending on the amount of data on your device, this process takes about 30-40 minutes.

You can instead connect to the PowerShell interface of the device and use the `Reset-HcsAppliance` cmdlet to erase the data from the data disks. For more information, see [Reset your device](../articles/databox-online/azure-stack-edge-connect-powershell-interface.md#reset-your-device).
