---
title: Upload files from devices to Azure storage
description: How to configure, implement, and manage file uploads from your devices to your IoT Central application.
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 11/27/2023
ms.topic: how-to
ms.service: iot-central

# This topic applies to administrators and device developers.
---
# Upload files from your devices to the cloud

IoT Central lets you upload media and other files from connected devices to cloud storage. You configure the file upload capability in your IoT Central application, and then implement file uploads in your device code.

Optionally, you can manage and preview files uploaded by your devices inside your IoT Central application.

To learn how to upload files by using the IoT Central REST API, see [How to use the IoT Central REST API to upload a file.](../core/howto-upload-file-rest-api.md)

## Prerequisites

You must be an administrator in your IoT Central application to configure file uploads.

You need an Azure storage account and container to store the uploaded files. If you don't have an existing storage account and container to use, create a [new storage account in the Azure portal](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM).

## Configure device file uploads

To configure device file uploads:

1. Navigate to the **Application** section in your application.

1. Select **Device file storage**.

1. Select the storage account and container to use. If the storage account is in a different Azure subscription from your application, enter a storage account  connection string.

1. If necessary, adjust the upload timeout that sets how long an upload request remains valid for. Valid values are from 1 to 24 hours.

1. To enable users to view and manage uploaded files inside IoT Central, set **Enable access** to **On**.

1. Select **Save**. When the status shows **Configured**, you're ready to upload files from devices.

:::image type="content" source="media/howto-configure-file-uploads/file-upload-configuration.png" alt-text="Screenshot that shows a properly configured file upload." lightbox="media/howto-configure-file-uploads/file-upload-configuration.png":::

## Disable device file uploads

If you want to disable device file uploads to your IoT Central application:

1. Navigate to the **Application** section in your application.

1. Select **Device file storage**.

1. Select **Delete**.

## Control access to uploaded files

Use roles and permissions to control who can view and delete uploaded files. To learn more, see [Manage users and roles in your IoT Central application > Managing devices](howto-manage-users-roles.md#managing-devices).

## Upload a file from a device

IoT Central uses IoT Hub's file upload capability to enable devices to upload files. For sample code that shows you how to upload files from a device, see the [IoT Central file upload device sample](/samples/azure-samples/iot-central-file-upload-device/iotc-file-upload-device/).

## View and manage uploaded files

If you enabled access to files in the file upload configuration, users with the correct permissions can view and delete uploaded files.

> [!IMPORTANT]
> All the files in the blob container folder associated with a device are visible in the **Files** view for that device. This includes any files that weren't uploaded by the device.

To view and delete uploaded files, navigate to the **Files** view for a device. On this page, you can see thumbnails of the uploaded files and toggle between a gallery and list view. Each file has options to download or delete it:

:::image type="content" source="media/howto-configure-file-uploads/file-upload-list-files.png" alt-text="Screenshot that shows the gallery view for uploaded files." lightbox="media/howto-configure-file-uploads/file-upload-list-files.png":::

> [!TIP]
> The file type is determined by the mime type assigned to the file when it was uploaded to blob storage. The default type is `binary/octet-stream`.

You can customize the list view by filtering based on file name and choosing the columns to display.

To preview the content of the file and get more information about the file, select it. IoT Central supports previews of common file types such as text and images:

:::image type="content" source="media/howto-configure-file-uploads/file-upload-preview.png" alt-text="Screenshot that shows a preview of a text file." lightbox="media/howto-configure-file-uploads/file-upload-preview.png":::

## Next steps

Now that you know how to configure and implement device file uploads in IoT Central, a suggested next step is to learn more device file uploads:

- [Upload files from your device to the cloud with IoT Hub (.NET)](../../iot-hub/iot-hub-csharp-csharp-file-upload.md)
- [Upload files from your device to the cloud with IoT Hub (Java)](../../iot-hub/iot-hub-java-java-file-upload.md)
- [Upload files from your device to the cloud with IoT Hub (Node.js)](../../iot-hub/iot-hub-node-node-file-upload.md)
- [Upload files from your device to the cloud with IoT Hub (Python)](../../iot-hub/iot-hub-python-python-file-upload.md)
