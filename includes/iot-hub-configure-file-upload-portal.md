---
title: Configure file upload in IoT Hub using Azure portal
description: How to use the Azure portal to configure your IoT hub to enable file uploads from connected devices. Includes information about configuring the destination Azure storage account.
author: SoniaLopezBravo
ms.author: sonialopez
ms.service: azure-iot-hub
ms.topic: include
ms.date: 12/01/2025
---

## Prerequisites

* An active Azure account. If you don't have an account, you can create a [free account](https://azure.microsoft.com/pricing/free-trial/) in just a couple of minutes.

* An IoT hub in your Azure subscription. If you don't have a hub yet, you can follow the steps in the **Create an IoT hub** section of [Create and manage Azure IoT hubs](../articles/iot-hub/create-hub.md).

## Configure your IoT hub in the Azure portal

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub and select **File upload** to display the file upload properties. Then select **Azure Storage Container** under **Storage container settings**.

    :::image type="content" source="../articles/iot-hub/media/iot-hub-configure-file-upload/file-upload-settings.png" alt-text="Screenshot that shows how to configure file upload settings in the portal.":::

1. Select an Azure Storage account and blob container in your current subscription to associate with your IoT hub. If necessary, you can create an Azure Storage account on the **Storage accounts** pane and create a blob container on the **Containers** pane.

   :::image type="content" source="../articles/iot-hub/media/iot-hub-configure-file-upload/file-upload-container-selection.png" alt-text="Screenshot showing how to view storage containers for file upload.":::

1. After you've selected an Azure Storage account and blob container, configure the rest of the file upload properties.

    * **Receive notifications for uploaded files**: Enable or disable file upload notifications via the toggle.

    * **SAS TTL**: This setting is the time-to-live of the SAS URIs returned to the device by IoT Hub. Set to one hour by default but can be customized to other values using the slider.

    * **Default TTL**: The time-to-live of a file upload notification before it's expired. Set to one day by default but can be customized to other values using the slider.

    * **Maximum delivery count**: The number of times the IoT hub attempts to deliver a file upload notification. Set to 10 by default but can be customized to other values using the slider.

    * **Authentication type**: By default, Azure IoT Hub uses key-based authentication to connect and authorize with Azure Storage. You can also configure user-assigned or system-assigned managed identities to authenticate Azure IoT Hub with Azure Storage. Managed identities provide Azure services with an automatically managed identity in Microsoft Entra ID in a secure manner. To learn how to configure managed identities, see [IoT Hub support for managed identities](../articles/iot-hub/iot-hub-managed-identity.md). After you've configured one or more managed identities on your Azure Storage account and IoT hub, you can select one for authentication with Azure storage with the **System-assigned** or **User-assigned** buttons.

        > [!NOTE]
        > The authentication type setting configures how your IoT hub authenticates with your Azure Storage account. Devices always authenticate with Azure Storage using the SAS URI that they get from the IoT hub. 

1. Select **Save** to save your settings. Be sure to check the confirmation for successful completion. Some selections, like **Authentication type**, are validated only after you save your settings. 