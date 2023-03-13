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

1. Delete the Azure Stack Edge resource (name of the service) associated with the Azure Stack Edge device. This step also removes the managed identity associated with the Azure Stack Edge resource. For more information, see [Delete an Edge resource group](../articles/databox-online/azure-stack-edge-gpu-manage-edge-resource-groups-portal.md#delete-an-edge-resource-group).

2. Delete the key vault. The key vault name starts with the service name and is appended with a GUID. For more information, see [Delete key vault](../articles/databox-online/azure-stack-edge-gpu-activation-key-vault.md#delete-key-vault).

3. Delete the storage account used by the key vault. For more information, see [Delete an Edge storage account](../articles/databox-online/azure-stack-edge-gpu-manage-storage-accounts.md?tabs=az#delete-an-edge-storage-account).
