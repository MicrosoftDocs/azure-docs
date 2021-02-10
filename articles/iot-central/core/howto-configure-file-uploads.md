---
title: Upload files from devices to Azure storage | Microsoft Docs
description: How to configure file uploads from your devices to the cloud. After you've configured file uploads, implement file uploads on your devices.
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 12/23/2020
ms.topic: how-to
ms.service: iot-central
---
# Upload files from your devices to the cloud

*This topic applies to administrators and device developers.*

IoT Central lets you upload media and other files from connected devices to cloud storage. You configure the file upload capability in your IoT Central application, and then implement file uploads in your device code.

## Prerequisites

You must be an administrator in your IoT Central application to configure file uploads.

You need an Azure storage account and container to store the uploaded files. If you don't have an existing storage account and container to use, create a [new storage account in the Azure portal](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM).

## Configure device file uploads

To configure device file uploads:

1. Navigate to the **Administration** section in your application.

1. Select **Device file upload**.

1. Select the storage account and container to use. If the storage account is in a different Azure subscription from your application, enter a storage account  connection string.

1. If necessary, adjust the upload timeout that sets how long an upload request remains valid for. Valid values are from 1 to 24 hours.

1. Select **Save**. When the status shows **Configured**, you're ready to upload files from devices.

:::image type="content" source="media/howto-configure-file-uploads/file-upload-configuration.png" alt-text="Configure file upload in application":::

## Disable device file uploads

If you want to disable device file uploads to your IoT Central application:

1. Navigate to the **Administration** section in your application.

1. Select **Device file upload**.

1. Select **Delete**.

## Upload a file from a device

IoT Central uses IoT Hub's file upload capability to enable devices to upload files. For sample code that shows you how to upload files from a device, see the [IoT Central file upload device sample](/samples/iot-for-all/iotc-file-upload-device/iotc-file-upload-device/).

## Next steps

Now that you know how to configure and implement device file uploads in IoT Central, a suggested next step is to learn more device file uploads:

- [Upload files from your device to the cloud with IoT Hub (.NET)](../../iot-hub/iot-hub-csharp-csharp-file-upload.md)
- [Upload files from your device to the cloud with IoT Hub (Java)](../../iot-hub/iot-hub-java-java-file-upload.md)
- [Upload files from your device to the cloud with IoT Hub (Node.js)](../../iot-hub/iot-hub-node-node-file-upload.md)
- [Upload files from your device to the cloud with IoT Hub (Python)](../../iot-hub/iot-hub-python-python-file-upload.md)