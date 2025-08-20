---
title: Upload files from devices to Azure storage
description: How to configure, implement, and manage file uploads from your devices to your IoT Central application.
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 05/23/2025
ms.topic: how-to
ms.service: azure-iot-central

# This topic applies to administrators and device developers.
---
# Upload files from your devices to the cloud

IoT Central lets you upload media and other files from connected devices to cloud storage. You configure the file upload capability in your IoT Central application, and then implement file uploads in your device code.

You can also manage and preview files uploaded by your devices inside your IoT Central application.

To learn how to configure file uploads by using the IoT Central REST API, see [Add a file upload storage account configuration](howto-manage-iot-central-with-rest-api.md#add-a-file-upload-storage-account-configuration).

## Prerequisites

You need to be an administrator in your IoT Central application to configure file uploads.

You need an Azure storage account and container to store the uploaded files. If you don't have a storage account and container, create a [storage account in the Azure portal](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM).

## Configure device file uploads

To configure device file uploads:

1. Go to the **Application** section in your application.

1. Select **Device file storage**.

1. Select the storage account and container to use. If the storage account is in a different Azure subscription than your application, enter a storage account connection string.

1. If needed, adjust the upload timeout that sets how long a request is valid for. You can set it from 1 to 24 hours.

1. To let users view and manage uploaded files in IoT Central, set **Enable access** to **On**.

1. Select **Save**. When the status shows **Configured**, devices can upload files.

:::image type="content" source="media/howto-configure-file-uploads/file-upload-configuration.png" alt-text="Screenshot that shows a properly configured file upload." lightbox="media/howto-configure-file-uploads/file-upload-configuration.png":::

## Disable device file uploads

To turn off device file uploads in your IoT Central application:

1. Navigate to the **Application** section in your application.

1. Select **Device file storage**.

1. Select **Delete**.

## Control access to uploaded files

Use roles and permissions to control who can view and delete uploaded files. To learn more, see [Manage users and roles in your IoT Central application > Managing devices](howto-manage-users-roles.md#managing-devices).

## Upload a file from a device

IoT Central uses IoT Hub's file upload feature to enable devices to upload files. For sample code that shows how to upload files from a device, see the [IoT Central file upload device sample](/samples/azure-samples/iot-central-file-upload-device/iotc-file-upload-device/).

## View and manage uploaded files

If you turn on access to files in the file upload configuration, users with the right permissions can view and delete uploaded files.

> [!IMPORTANT]
> All files in the blob container folder associated with a device show up in the **Files** view for that device including any files the device didn't upload.

To view and delete uploaded files, go to the **Files** view for a device. On this page, you can see thumbnails of the uploaded files and switch between a gallery and list view. Each file has options to download or delete it:

:::image type="content" source="media/howto-configure-file-uploads/file-upload-list-files.png" alt-text="Screenshot that shows the gallery view for uploaded files." lightbox="media/howto-configure-file-uploads/file-upload-list-files.png":::

> [!TIP]
> The mime type assigned to the file when it was uploaded to blob storage determines its file type. The default type is `binary/octet-stream`.

Customize the list view by filtering by file name and choosing the columns to display.

To preview the file content and get more information about it, select it. IoT Central supports previews of common file types such as text and images:

:::image type="content" source="media/howto-configure-file-uploads/file-upload-preview.png" alt-text="Screenshot that shows a preview of a text file." lightbox="media/howto-configure-file-uploads/file-upload-preview.png":::

## Test file upload

After you [configure file uploads](#configure-device-file-uploads) in your IoT Central application, test it with the sample code. Use the following commands to clone the sample repository to a suitable location on your local machine and install the dependencies:

```cmd/sh
git clone https://github.com/azure-Samples/iot-central-file-upload-device
cd iotc-file-upload-device
npm i
npm build
```

### Create the device template and import the model

To test file upload, run the sample device application. First, create a device template for the sample device:

1. Open your application in the IoT Central UI.

1. Go to **Device Templates** in the left pane, then select **+ New**.

1. Select **IoT device** for the template type.

1. On the **Customize** page, enter a name such as *File Upload Device Sample* for the device template.

1. On the **Review** page, select **Create**.

1. Select **Import a model** and upload the *FileUploadDeviceDcm.json* model file from the `iotc-file-upload-device\setup` folder in the repository you downloaded previously.

1. Select **Publish** to finish creating the device template.

### Add a device

To add a device to your Azure IoT Central application:

1. Go to **Devices** in the left pane.

1. Select the *File Upload Device Sample* device template you created earlier.

1. Select + **New**, then select **Create**.

1. Select the device you created, then select **Connect**.

Copy the values for `ID scope`, `Device ID`, and `Primary key`. You use these values in the device sample code.

### Run the sample code

Open the git repository you downloaded in VS Code. Create an ".env" file at the root of your project and add the values you copied previously. The file should look like this sample, with your values:

```cmd/sh
scopeId=<YOUR_SCOPE_ID>
deviceId=<YOUR_DEVICE_ID>
deviceKey=<YOUR_PRIMARY_KEY>
modelId=dtmi:IoTCentral:IotCentralFileUploadDevice;1
```

Open the git repository you downloaded in VS Code. To run or debug the sample, press <kbd>F5</kbd>. In your terminal window, you see the device register and connect to IoT Central:

```cmd/sh
Starting IoT Central device...
 > Machine: Windows_NT, 8 core, freemem=6674mb, totalmem=16157mb
Starting device registration...
DPS registration succeeded
Connecting the device...
IoT Central successfully connected device: 7z1xo26yd8
Sending telemetry: {
    "TELEMETRY_SYSTEM_HEARTBEAT": 1
}
Sending telemetry: {
    "TELEMETRY_SYSTEM_HEARTBEAT": 1
}
Sending telemetry: {
    "TELEMETRY_SYSTEM_HEARTBEAT": 1
}

```

The sample project includes a sample file named *datafile.json*. This file uploads when you use the **Upload File** command in your IoT Central application.

To test the upload, open your application and select the device you created. Select the **Command** tab and select the **Run** button. When you select **Run**, the IoT Central application calls a direct method on your device to upload the file. You can see this direct method in the sample code in the /device.ts file. The method is named *uploadFileCommand*.
To test the upload, open your application and select the device you created. Select the **Command** tab, then select the **Run** button. When you select **Run**, IoT Central calls a direct method on your device to upload the file. You can see this method in the sample code in the */device.ts* file. The method is named *uploadFileCommand*.

Select the **Raw data** tab to check the file upload status.

:::image type="content" source="media/howto-configure-file-uploads/raw-data.png" alt-text="Screenshot showing the U I of how to verify a file upload." border="false":::

You can also make a [REST API](/rest/api/storageservices/list-blobs) call to check the file upload status in the storage container.
