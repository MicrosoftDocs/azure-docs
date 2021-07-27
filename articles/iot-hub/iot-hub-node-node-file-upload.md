---
title: Upload files from devices to Azure IoT Hub with Node | Microsoft Docs
description: How to upload files from a device to the cloud using Azure IoT device SDK for Node.js. Uploaded files are stored in an Azure storage blob container.
author: wesmc7777
manager: philmea
ms.author: wesmc
ms.service: iot-hub
services: iot-hub
ms.devlang: nodejs
ms.topic: conceptual
ms.date: 07/18/2021
ms.custom: mqtt, devx-track-js
---

# Upload files from your device to the cloud with IoT Hub (Node.js)

[!INCLUDE [iot-hub-file-upload-language-selector](../../includes/iot-hub-file-upload-language-selector.md)]

The tutorial shows you how to:

* Securely provide a device with an Azure blob URI for uploading a file.

* Use the IoT Hub file upload notifications to trigger processing the file in your app back end.

The [Send telemetry from a device to an IoT hub](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-nodejs) quickstart demonstrates the basic device-to-cloud messaging functionality of IoT Hub. However, in some scenarios you cannot easily map the data your devices send into the relatively small device-to-cloud messages that IoT Hub accepts. For example:

* Large files that contain images
* Videos
* Vibration data sampled at high frequency
* Some form of pre-processed data.

These files are typically batch processed in the cloud using tools such as [Azure Data Factory](../data-factory/introduction.md) or the [Hadoop](../hdinsight/index.yml) stack. When you need to upland files from a device, you can still use the security and reliability of IoT Hub.

At the end of this tutorial you run two Node.js console apps:

* **FileUpload.js**, which uploads a file to storage using a SAS URI provided by your IoT hub.

* **ReadFileUploadNotification.js**, which receives file upload notifications from your IoT hub.

> [!NOTE]
> IoT Hub supports many device platforms and languages (including C, .NET, Javascript, Python, and Java) through Azure IoT device SDKs. Refer to the [Azure IoT Developer Center] for step-by-step instructions on how to connect your device to Azure IoT Hub.

[!INCLUDE [iot-hub-include-x509-ca-signed-file-upload-support-note](../../includes/iot-hub-include-x509-ca-signed-file-upload-support-note.md)]

## Prerequisites

* Node.js version 10.0.x or later. [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-node/tree/master/doc/node-devbox-setup.md) describes how to install Node.js for this tutorial on either Windows or Linux.

* An active Azure account. (If you don't have an account, you can create a [free account](https://azure.microsoft.com/pricing/free-trial/) in just a couple of minutes.)

* Make sure that port 8883 is open in your firewall. The device sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](iot-hub-mqtt-support.md#connecting-to-iot-hub).

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Register a new device in the IoT hub

[!INCLUDE [iot-hub-include-create-device](../../includes/iot-hub-include-create-device.md)]

[!INCLUDE [iot-hub-associate-storage](../../includes/iot-hub-include-associate-storage.md)]

## Upload a file from a device app

In this section, you copy the device app from GitHub to upload a file to IoT hub.

1. There are two file upload samples available on GitHub for Node.js, a basic sample and one that is more advanced. Copy the basic sample from the repository [here](https://github.com/Azure/azure-iot-sdk-node/blob/master/device/samples/upload_to_blob.js). The advanced sample is located [here](https://github.com/Azure/azure-iot-sdk-node/blob/master/device/samples/upload_to_blob_advanced.js).   

2. Create an empty folder called ```fileupload```.  In the ```fileupload``` folder, create a package.json file using the following command at your command prompt.  Accept all the defaults:

    ```cmd/sh
    npm init
    ```

3. At your command prompt in the ```fileupload``` folder, run the following command to install the **azure-iot-device** Device SDK package and **azure-iot-device-mqtt** package:

    ```cmd/sh
    npm install azure-iot-device azure-iot-device-mqtt --save
    ```

4. Using a text editor, create a **FileUpload.js** file in the ```fileupload``` folder, and copy the basic sample into it.

    ```javascript
    // Copyright (c) Microsoft. All rights reserved.
    // Licensed under the MIT license. See LICENSE file in the project root for full license information.

    'use strict';

    var Protocol = require('azure-iot-device-mqtt').Mqtt;
    var Client = require('azure-iot-device').Client;
    var fs = require('fs');

    var deviceConnectionString = process.env.ConnectionString;
    var filePath = process.env.FilePath;

    var client = Client.fromConnectionString(deviceConnectionString, Protocol);
    fs.stat(filePath, function (err, fileStats) {
      var fileStream = fs.createReadStream(filePath);

      client.uploadToBlob('testblob.txt', fileStream, fileStats.size, function (err, result) {
        if (err) {
          console.error('error uploading file: ' + err.constructor.name + ': ' + err.message);
        } else {
          console.log('Upload successful - ' + result);
        }
        fileStream.destroy();
      });
    });
    ```

5. Add environment variables for your device connection string and the path to the file that you want to upload.

6. Save and close the **FileUpload.js** file.

7. Copy an image file to the `fileupload` folder and give it a name such as `myimage.png`. Place the path to the file in the `FilePath` environment variable.

## Get the IoT hub connection string

In this article you create a backend service to receive file upload notification messages from the IoT hub you created. To receive file upload notification messages, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

[!INCLUDE [iot-hub-include-find-service-connection-string](../../includes/iot-hub-include-find-service-connection-string.md)]

## Receive a file upload notification

In this section, you create a Node.js console app that receives file upload notification messages from IoT Hub.

You can use the **iothubowner** connection string from your IoT Hub to complete this section. You will find the connection string in the [Azure portal](https://portal.azure.com/) on the **Shared access policy** blade.

1. Create an empty folder called ```fileuploadnotification```.  In the ```fileuploadnotification``` folder, create a package.json file using the following command at your command prompt.  Accept all the defaults:

    ```cmd/sh
    npm init
    ```

2. At your command prompt in the ```fileuploadnotification``` folder, run the following command to install the **azure-iothub** SDK package:

    ```cmd/sh
    npm install azure-iothub --save
    ```

3. Using a text editor, create a **FileUploadNotification.js** file in the `fileuploadnotification` folder.

4. Add the following `require` statements at the start of the **FileUploadNotification.js** file:

    ```javascript
    'use strict';

    var Client = require('azure-iothub').Client;
    ```

5. Add a `iothubconnectionstring` variable and use it to create a **Client** instance.  Replace the `{iothubconnectionstring}` placeholder value with the IoT hub connection string that you copied previously in [Get the IoT hub connection string](#get-the-iot-hub-connection-string):

    ```javascript
    var connectionString = '{iothubconnectionstring}';
    ```

    > [!NOTE]
    > For the sake of simplicity the connection string is included in the code: this is not a recommended practice, and depending on your use-case and architecture you may want to consider more secure ways of storing this secret.

6. Add the following code to connect the client:

    ```javascript
    var serviceClient = Client.fromConnectionString(connectionString);
    ```

7. Open the client and use the **getFileNotificationReceiver** function to receive status updates.

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
            });
          }
        });
      }
    });
    ```

8. Save and close the **FileUploadNotification.js** file.

## Run the applications

Now you are ready to run the applications.

At a command prompt in the `fileuploadnotification` folder, run the following command:

```cmd/sh
node FileUploadNotification.js
```

At a command prompt in the `fileupload` folder, run the following command:

```cmd/sh
node FileUpload.js
```

The following screenshot shows the output from the **FileUpload** app:

![Output from simulated-device app](./media/iot-hub-node-node-file-upload/simulated-device.png)

The following screenshot shows the output from the **FileUploadNotification** app:

![Output from read-file-upload-notification app](./media/iot-hub-node-node-file-upload/read-file-upload-notification.png)

You can use the portal to view the uploaded file in the storage container you configured:

![Uploaded file](./media/iot-hub-node-node-file-upload/uploaded-file.png)

## Next steps

In this tutorial, you learned how to use the file upload capabilities of IoT Hub to simplify file uploads from devices. You can continue to explore IoT hub features and scenarios with the following articles:

* [Create an IoT hub programmatically](iot-hub-rm-template-powershell.md)

* [Introduction to C SDK](iot-hub-device-sdk-c-intro.md)

* [Azure IoT SDKs](iot-hub-devguide-sdks.md)