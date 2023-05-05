---
author: v-dalc
ms.service: databox  
ms.topic: include
ms.date: 03/13/2023
ms.author: alkohli
---

To reset your device using the local web UI, take the following steps.

1. In the local web UI, go to **Maintenance > Device reset**.
2. Select **Reset device**.

    ![Reset device](media/azure-stack-edge-device-reset/device-reset-1.png)

3. When prompted for confirmation, review the warning. Type **Yes** and then select **Yes** to continue.

    ![Confirm reset](media/azure-stack-edge-device-reset/device-reset-2.png)  

The reset erases the data off the device data disks. Depending on the amount of data on your device, this process takes about 30-40 minutes.

In addition to resetting your device, complete the following steps to remove Azure resources associated with the device.

- Delete the Azure Stack Edge resource (name of the service) associated with the Azure Stack Edge device. This step also removes the managed identity associated with the Azure Stack Edge resource. For more information, see [Delete Azure Stack Edge resource](../articles/databox-online/azure-stack-edge-return-device.md?branch=main&tabs=azure-portal).
   - When deleting the Azure Stack Edge resource, you'll also be prompted to remove the associated key vault. The key vault name starts with the service name and is appended with a GUID. Proceed with the confirmation.

- Delete the storage account used by the key vault. You'll need to look for a Zone redundant storage account starting with the same name as that of the key vault and in the same scope as the Azure Stack Edge resource. You'll need to manually delete this storage account.

>[!Note]
>While performing the device reset, only the data that resides locally on the device will be deleted. The data that's in the cloud won't be deleted and, if not removed, will continue to collect [charges](https://azure.microsoft.com/pricing/details/storage/). This data must be deleted separately using a cloud storage management tool like [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).
