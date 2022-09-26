---
 title: include file
 description: include file
 services: iot-hub
 author: JimacoMS3
 ms.service: iot-hub
 ms.topic: include
 ms.date: 01/22/2019
 ms.author: v-jbrannian
 ms.custom: include file
---

## Associate an Azure Storage account to IoT Hub

To upload files from a device, you must have an Azure Storage account and Azure Blob Storage container associated with your IoT hub. Once you associate the storage account and container with your IoT hub, your IoT hub can provide the elements of a SAS URI when requested by a device. The device can then use these elements to construct the SAS URI that it uses to authenticate with Azure Storage and upload files to the blob container.

To associate an Azure Storage account with your IoT hub:

1. Under **Hub settings**, select **File upload** on the left-pane of your IoT hub.

    :::image type="content" source="./media/iot-hub-include-associate-storage/select-storage.png" alt-text="Screen capture showing select file upload settings from the portal." border="true" lightbox="./media/iot-hub-include-associate-storage/select-storage.png":::

1. On the **File upload** pane, select **Azure Storage Container**. For this article, it's recommended that your storage account and IoT Hub be located in the same region.

    * If you already have a storage account you want to use, select it from the list.

    * To create a new storage account, select **+Storage account**. Provide a name for the storage account and make sure the **Location** is set to the same region as your IoT hub, then select **OK**. The new account is created in the same resource group as your IoT hub. When the deployment completes, select the storage account from the list.

    After you select the storage account, the **Containers** pane opens.

1. On the **Containers** pane, select the blob container.
    * If you already have a blob container you want to use, select it from the list and click **Select**.

    * To create a new blob container, select **+ Container**. Provide a name for the new container. For the purposes of this article, you can leave all other fields at their default. Select **Create**. When the deployment completes, select the container from the list and click **Select**.

1. Back on the **File upload** pane, make sure that file notifications are set to **On**. You can leave all other settings at their defaults. Select **Save** and wait for the settings to complete before moving on to the next section.

    :::image type="content" source="./media/iot-hub-include-associate-storage/file-upload-settings-small.png" alt-text="Screen capture showing confirm file upload settings in the portal." border="true" lightbox="./media/iot-hub-include-associate-storage/file-upload-settings-small.png":::

For more detailed instructions on how to create an Azure Storage account, see [Create a storage account](../articles/storage/common/storage-account-create.md). For more detailed instructions on how to associate a storage account and blob container with an IoT hub, see [Configure file uploads using the Azure portal](../articles/iot-hub/iot-hub-configure-file-upload.md).
