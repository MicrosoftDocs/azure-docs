---
title: Upload files from devices to Azure IoT Hub (Node)
titleSuffix: Azure IoT Hub
description: How to upload files from a device to the cloud using Azure IoT device SDK for Node.js. Uploaded files are stored in an Azure storage blob container.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: nodejs
ms.topic: how-to
ms.date: 07/27/2021
ms.custom: mqtt, devx-track-js
---

# Upload files from your device to the cloud with Azure IoT Hub (Node.js)

This article demonstrates how to [file upload capabilities of IoT Hub](iot-hub-devguide-file-upload.md) upload a file to [Azure blob storage](../storage/index.yml), using Node.js.

The [Send telemetry from a device to an IoT hub](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-nodejs) quickstart and [Send cloud-to-device messages with IoT Hub](c2d-messaging-node.md) articles show the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub. The [Configure Message Routing with IoT Hub](tutorial-routing.md) tutorial shows a way to reliably store device-to-cloud messages in Microsoft Azure blob storage. However, in some scenarios, you can't easily map the data your devices send into the relatively small device-to-cloud messages that IoT Hub accepts. For example:

* Videos
* Large files that contain images
* Vibration data sampled at high frequency
* Some form of pre-processed data.

These files are typically batch processed in the cloud, using tools such as [Azure Data Factory](../data-factory/introduction.md) or the [Hadoop](../hdinsight/index.yml) stack. When you need to upland files from a device, you can still use the security and reliability of IoT Hub. This article shows you how.

At the end of this article, you run two Node.js console apps:

* **FileUpload.js**, which uploads a file to storage using a SAS URI provided by your IoT hub.

* **FileUploadNotification.js**, which receives file upload notifications from your IoT hub.

> [!NOTE]
> IoT Hub supports many device platforms and languages (including C, Java, Python, and JavaScript) through Azure IoT device SDKs. Refer to the [Azure IoT Developer Center](https://azure.microsoft.com/develop/iot) to learn how to connect your device to Azure IoT Hub.

[!INCLUDE [iot-hub-include-x509-ca-signed-file-upload-support-note](../../includes/iot-hub-include-x509-ca-signed-file-upload-support-note.md)]

## Prerequisites

* An IoT hub. Create one with the [CLI](iot-hub-create-using-cli.md) or the [Azure portal](iot-hub-create-through-portal.md).

* A registered device. Register one in the [Azure portal](iot-hub-create-through-portal.md#register-a-new-device-in-the-iot-hub).

* Node.js version 10.0.x or later. The LTS version is recommended. You can download Node.js from [nodejs.org](https://nodejs.org).

* Port 8883 should be open in your firewall. The device sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

[!INCLUDE [iot-hub-associate-storage](../../includes/iot-hub-include-associate-storage.md)]

## Upload a file from a device app

In this section, you create a device app to upload a file to IoT hub. The code is based on code available in the [upload_to_blob_advanced.js](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/upload_to_blob_advanced.js) sample in the [Azure IoT Node.js SDK](https://github.com/Azure/azure-iot-sdk-node) device samples.

1. Create an empty folder called `fileupload`.  In the `fileupload` folder, create a package.json file using the following command at your command prompt.  Accept all the defaults:

    ```cmd/sh
    npm init
    ```

1. At your command prompt in the `fileupload` folder, run the following command to install the **azure-iot-device** Device SDK, the **azure-iot-device-mqtt**, and the **@azure/storage-blob** packages:

    ```cmd/sh
    npm install azure-iot-device azure-iot-device-mqtt @azure/storage-blob --save
    ```

1. Using a text editor, create a **FileUpload.js** file in the `fileupload` folder, and copy the following code into it.

    ```javascript
    'use strict';

    const Client = require('azure-iot-device').Client;
    const Protocol = require('azure-iot-device-mqtt').Mqtt;
    const errors = require('azure-iot-common').errors;
    const path = require('path');

    const {
      AnonymousCredential,
      BlockBlobClient,
      newPipeline
    } = require('@azure/storage-blob');

    // make sure you set these environment variables prior to running the sample.
    const deviceConnectionString = process.env.DEVICE_CONNECTION_STRING;
    const localFilePath = process.env.PATH_TO_FILE;
    const storageBlobName = path.basename(localFilePath);

    async function uploadToBlob(localFilePath, client) {
      const blobInfo = await client.getBlobSharedAccessSignature(storageBlobName);
      if (!blobInfo) {
        throw new errors.ArgumentError('Invalid upload parameters');
      }

      const pipeline = newPipeline(new AnonymousCredential(), {
        retryOptions: { maxTries: 4 },
        telemetry: { value: 'HighLevelSample V1.0.0' }, // Customized telemetry string
        keepAliveOptions: { enable: false }
      });

      // Construct the blob URL to construct the blob client for file uploads
      const { hostName, containerName, blobName, sasToken } = blobInfo;
      const blobUrl = `https://${hostName}/${containerName}/${blobName}${sasToken}`;

      // Create the BlockBlobClient for file upload to the Blob Storage Blob
      const blobClient = new BlockBlobClient(blobUrl, pipeline);

      // Setup blank status notification arguments to be filled in on success/failure
      let isSuccess;
      let statusCode;
      let statusDescription;

      try {
        const uploadStatus = await blobClient.uploadFile(localFilePath);
        console.log('uploadStreamToBlockBlob success');

        // Save successful status notification arguments
        isSuccess = true;
        statusCode = uploadStatus._response.status;
        statusDescription = uploadStatus._response.bodyAsText;

        // Notify IoT Hub of upload to blob status (success)
        console.log('notifyBlobUploadStatus success');
      }
      catch (err) {
        isSuccess = false;
        statusCode = err.code;
        statusDescription = err.message;

        console.log('notifyBlobUploadStatus failed');
        console.log(err);
      }

      await client.notifyBlobUploadStatus(blobInfo.correlationId, isSuccess, statusCode, statusDescription);
    }

    // Create a client device from the connection string and upload the local file to blob storage.
    const deviceClient = Client.fromConnectionString(deviceConnectionString, Protocol);
    uploadToBlob(localFilePath, deviceClient)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        process.exit();
      });
    ```

1. Save and close the **FileUpload.js** file.

1. Copy an image file to the `fileupload` folder and give it a name such as `myimage.png`.

1. Add environment variables for your device connection string and the path to the file that you want to upload. You got the device connection string when you registered a device in the IoT hub.
    
    - For Windows:

        ```cmd
        set DEVICE_CONNECTION_STRING={your device connection string}
        set PATH_TO_FILE={your image filepath}
        ```

    - For Linux/Bash:

        ```bash
        export DEVICE_CONNECTION_STRING="{your device connection string}"
        export PATH_TO_FILE="{your image filepath}"
        ```

## Get the IoT hub connection string

In this article, you create a backend service to receive file upload notification messages from the IoT hub you created. To receive file upload notification messages, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

[!INCLUDE [iot-hub-include-find-service-connection-string](../../includes/iot-hub-include-find-service-connection-string.md)]

## Receive a file upload notification

In this section, you create a Node.js console app that receives file upload notification messages from IoT Hub.

1. Create an empty folder called `fileuploadnotification`.  In the `fileuploadnotification` folder, create a package.json file using the following command at your command prompt.  Accept all the defaults:

    ```cmd/sh
    npm init
    ```

1. At your command prompt in the `fileuploadnotification` folder, run the following command to install the **azure-iothub** SDK package:

    ```cmd/sh
    npm install azure-iothub --save
    ```

1. Using a text editor, create a **FileUploadNotification.js** file in the `fileuploadnotification` folder.

1. Add the following `require` statements at the start of the **FileUploadNotification.js** file:

    ```javascript
    'use strict';

    const Client = require('azure-iothub').Client;
    ```

1. Read the connection string for your IoT hub from the environment:

    ```javascript
    const connectionString = process.env.IOT_HUB_CONNECTION_STRING;
    ```

1. Add the following code to create a service client from the connection string:

    ```javascript
    const serviceClient = Client.fromConnectionString(connectionString);
    ```

1. Open the client and use the **getFileNotificationReceiver** function to receive status updates.

    ```javascript
    serviceClient.open(function (err) {
      if (err) {
        console.error('Could not connect: ' + err.message);
      } else {
        console.log('Service client connected');
        serviceClient.getFileNotificationReceiver(function receiveFileUploadNotification(err, receiver){
          if (err) {
            console.error('error getting the file notification receiver: ' + err.toString());
          } else {
            receiver.on('message', function (msg) {
              console.log('File upload from device:')
              console.log(msg.getData().toString('utf-8'));
              receiver.complete(msg, function (err) {
                if (err) {
                  console.error('Could not finish the upload: ' + err.message);
                } else {
                  console.log('Upload complete');
                }
              });
            });
          }
        });
      }
    });
    ```
    > [!NOTE]
    > If you want to receive disconnect notifications while you are listening to file upload notifications, you need to register `'error'` by using `receiver.on`. To continue to receive file upload notifications, you need to reconect to IoT Hub by using the `serviceClient.open` method.

1. Save and close the **FileUploadNotification.js** file.

1. Add an environment variable for your IoT Hub connection string. You copied this string previously in [Get the IoT hub connection string](#get-the-iot-hub-connection-string).
    
    - For Windows:

        ```cmd
        set IOT_HUB_CONNECTION_STRING={your iot hub connection string}
        ```

    - For Linux/Bash:

        ```bash
        export IOT_HUB_CONNECTION_STRING="{your iot hub connection string}"
        ```

## Run the applications

Now you're ready to run the applications.

At a command prompt in the `fileuploadnotification` folder, run the following command:

```cmd/sh
node FileUploadNotification.js
```

At a command prompt in the `fileupload` folder, run the following command:

```cmd/sh
node FileUpload.js
```

The following output is from the **FileUpload** app after the upload has completed:

```output
uploadStreamToBlockBlob success
notifyBlobUploadStatus success
```

The following sample output is from the **FileUploadNotification** app after the upload has completed:

```output
Service client connected
File upload from device:
{"deviceId":"myDeviceId","blobUri":"https://{your storage account name}.blob.core.windows.net/device-upload-container/myDeviceId/image.png","blobName":"myDeviceId/image.png","lastUpdatedTime":"2021-07-23T23:27:06+00:00","blobSizeInBytes":26214,"enqueuedTimeUtc":"2021-07-23T23:27:07.2580791Z"}
```

## Verify the file upload

You can use the portal to view the uploaded file in the storage container you configured:

1. Navigate to your storage account in Azure portal.
1. On the left pane of your storage account, select **Containers**.
1. Select the container you uploaded the file to.
1. Select the folder named after your device.
1. Select the blob that you uploaded your file to. In this article, it's the blob with the same name as your file.  

    :::image type="content" source="./media/iot-hub-node-node-file-upload/view-uploaded-file.png" alt-text="Screenshot of viewing the uploaded file in the Azure portal." lightbox="./media/iot-hub-node-node-file-upload/view-uploaded-file.png":::

1. View the blob properties on the page that opens. You can select **Download** to download the file and view its contents locally.

## Next steps

In this article, you learned how to use the file upload feature of IoT Hub to simplify file uploads from devices. You can continue to explore this feature with the following articles:

* [Create an IoT hub programmatically](iot-hub-rm-template-powershell.md)

* [Azure IoT SDKs](iot-hub-devguide-sdks.md)
