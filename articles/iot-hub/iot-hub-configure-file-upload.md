---
title: Use the Azure portal to configure file upload
description: How to use the Azure portal to configure your IoT hub to enable file uploads from connected devices. Includes information about configuring the destination Azure storage account.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: how-to
ms.date: 07/20/2021
---

# Configure IoT Hub file uploads using the Azure portal

[!INCLUDE [iot-hub-file-upload-selector](../../includes/iot-hub-file-upload-selector.md)]

This article shows you how to configure file uploads on your IoT hub using the Azure portal. 

To use the [file upload functionality in IoT Hub](iot-hub-devguide-file-upload.md), you must first associate an Azure storage account and blob container with your IoT hub. IoT Hub automatically generates SAS URIs with write permissions to this blob container for devices to use when they upload files. In addition to the storage account and blob container, you can set the time-to-live for the SAS URI and the type of authentication that IoT Hub uses with Azure storage. You can also configure settings for the optional file upload notifications that IoT Hub can deliver to backend services.

## Prerequisites

* An active Azure account. If you don't have an account, you can create a [free account](https://azure.microsoft.com/pricing/free-trial/) in just a couple of minutes.

* An Azure IoT hub. If you don't have an IoT hub, see [Create an IoT hub using the portal](iot-hub-create-through-portal.md).

## Configure your IoT hub

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub and select **File upload** to display the file upload properties. Then select **Azure Storage Container** under **Storage container settings**.

    :::image type="content" source="./media/iot-hub-configure-file-upload/file-upload-settings.png" alt-text="Screenshot that shows how to configure file upload settings in the portal.":::

1. Select an Azure Storage account and blob container in your current subscription to associate with your IoT hub. If necessary, you can create an Azure Storage account on the **Storage accounts** pane and create a blob container on the **Containers** pane.

   :::image type="content" source="./media/iot-hub-configure-file-upload/file-upload-container-selection.png" alt-text="Screenshot showing how to view storage containers for file upload.":::

1. After you've selected an Azure Storage account and blob container, configure the rest of the file upload properties.

    * **Receive notifications for uploaded files**: Enable or disable file upload notifications via the toggle.

    * **SAS TTL**: This setting is the time-to-live of the SAS URIs returned to the device by IoT Hub. Set to one hour by default but can be customized to other values using the slider.

    * **File notification settings default TTL**: The time-to-live of a file upload notification before it's expired. Set to one day by default but can be customized to other values using the slider.

    * **File notification maximum delivery count**: The number of times the IoT Hub attempts to deliver a file upload notification. Set to 10 by default but can be customized to other values using the slider.

    * **Authentication type**: By default, Azure IoT Hub uses key-based authentication to connect and authorize with Azure Storage. You can also configure user-assigned or system-assigned managed identities to authenticate Azure IoT Hub with Azure Storage. Managed identities provide Azure services with an automatically managed identity in Microsoft Entra ID in a secure manner. To learn how to configure managed identities, see [IoT Hub support for managed identities](./iot-hub-managed-identity.md). After you've configured one or more managed identities on your Azure Storage account and IoT hub, you can select one for authentication with Azure storage with the **System-assigned** or **User-assigned** buttons.

        > [!NOTE]
        > The authentication type setting configures how your IoT hub authenticates with your Azure Storage account. Devices always authenticate with Azure Storage using the SAS URI that they get from the IoT hub. 

1. Select **Save** to save your settings. Be sure to check the confirmation for successful completion. Some selections, like **Authentication type**, are validated only after you save your settings. 

## Next steps

* [Upload files from a device overview](iot-hub-devguide-file-upload.md)
* [IoT Hub support for managed identities](./iot-hub-managed-identity.md)
* [File upload how-to guides](./file-upload-dotnet.md)
