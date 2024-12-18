---
title: Upload files from devices to Azure IoT Hub (Node)
titleSuffix: Azure IoT Hub
description: How to upload files from a device to the cloud using Azure IoT device SDK for Node.js. Uploaded files are stored in an Azure storage blob container.
author: kgremban
ms.author: kgremban
ms.service: azure-iot-hub
ms.devlang: nodejs
ms.topic: include
ms.date: 07/01/2024
ms.custom: mqtt, devx-track-js
---

## Overview

This article describes how to use the [Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) to create a device app to upload a file and backend service application receive file upload notification.

## Create a device application

This section describes how to upload a file from a device to an IoT hub using the [azure-iot-device](/javascript/api/azure-iot-device) package in the Azure IoT SDK for Node.js.

### Install SDK packages

Run this command to install the **azure-iot-device** device SDK, the **azure-iot-device-mqtt**, and the **@azure/storage-blob** packages on your development machine:

```cmd/sh
npm install azure-iot-device azure-iot-device-mqtt @azure/storage-blob --save
```

The [azure-iot-device](/javascript/api/azure-iot-device) package contains objects that interface with IoT devices.

Follow this procedure to upload a file from a device to IoT hub:

1. Connect the device to IoT Hub
1. Get a Blob shared access signature (SAS) token from IoT Hub
1. Upload the file to Azure Storage
1. Send file upload status notification to IoT hub

### Create modules

Create Client, Protocol, errors, and path modules using the installed packages.

```javascript
const Protocol = require('azure-iot-device-mqtt').Mqtt;
const errors = require('azure-iot-common').errors;
const path = require('path');
```

### Connect a device to IoT Hub

A device app can authenticate with IoT Hub using the following methods:

* X.509 certificate
* Shared access key

#### Authenticate using an X.509 certificate

[!INCLUDE [iot-hub-howto-auth-device-cert-node](iot-hub-howto-auth-device-cert-node.md)]

#### Authenticate using a shared access key

##### Choose a transport protocol

The `Client` object supports these protocols:

* `Amqp`
* `Http` - When using `Http`, the `Client` instance checks for messages from IoT Hub infrequently (a minimum of every 25 minutes).
* `Mqtt`
* `MqttWs`
* `AmqpWs`

Install needed transport protocols on your development machine.

For example, this command installs the `Amqp` protocol:

```cmd/sh
npm install azure-iot-device-amqp --save
```

For more information about the differences between MQTT, AMQP, and HTTPS support, see [Cloud-to-device communications guidance](../articles/iot-hub/iot-hub-devguide-c2d-guidance.md) and [Choose a communication protocol](../articles/iot-hub/iot-hub-devguide-protocols.md).

##### Create a client object

Create a `Client` object using the installed package.

For example:

```javascript
const Client = require('azure-iot-device').Client;
```

##### Create a protocol object

Create a `Protocol` object using an installed transport package.

This example assigns the AMQP protocol:

```javascript
const Protocol = require('azure-iot-device-amqp').Amqp;
```

##### Add the device connection string and transport protocol

Call [fromConnectionString](/javascript/api/azure-iot-device/client?#azure-iot-device-client-fromconnectionstring) to supply device connection parameters:

* **connStr** - The device connection string.
* **transportCtor** - The transport protocol.

This example uses the `Amqp` transport protocol:

```javascript
const deviceConnectionString = "{IoT hub device connection string}"
const Protocol = require('azure-iot-device-mqtt').Amqp;
let client = Client.fromConnectionString(deviceConnectionString, Protocol);
```

##### Open the connection to IoT Hub

Use the [open](/javascript/api/azure-iot-device/client?#azure-iot-device-client-open) method to open connection between an IoT device and IoT Hub.

For example:

```javascript
client.open(function(err) {
  if (err) {
    console.error('error connecting to hub: ' + err);
    process.exit(1);
  }
})
```

#### Get a SAS token from IoT hub

Use [getBlobSharedAccessSignature](/javascript/api/azure-iot-device/client?#azure-iot-device-client-getblobsharedaccesssignature) to get the linked storage account SAS token from IoT hub.

For example:

```javascript
// make sure you set these environment variables prior to running the sample.
const localFilePath = process.env.PATH_TO_FILE;
const storageBlobName = path.basename(localFilePath);
const blobInfo = await client.getBlobSharedAccessSignature(storageBlobName);
if (!blobInfo) {
throw new errors.ArgumentError('Invalid upload parameters');
}
```

#### Upload the file to IoT hub

To upload a file from a device to IoT hub:

1. Create a stream pipeline
2. Construct the blob URL
3. Create a [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) for file upload to Blob Storage
4. Call [uploadFile](/javascript/api/@azure/storage-blob/blockblobclient?#@azure-storage-blob-blockblobclient-uploadfile) to upload the file to Blob Storage
5. Call [notifyBlobUploadStatus](/javascript/api/azure-iot-device/client?#azure-iot-device-client-notifyblobuploadstatus) to notify IoT hub that the upload succeeded or failed

For example:

```javascript
// Open the pipeline
const pipeline = newPipeline(new AnonymousCredential(), {
retryOptions: { maxTries: 4 },
telemetry: { value: 'HighLevelSample V1.0.0' }, // Customized telemetry string
keepAliveOptions: { enable: false }
});

// Construct the blob URL
const { hostName, containerName, blobName, sasToken } = blobInfo;
const blobUrl = `https://${hostName}/${containerName}/${blobName}${sasToken}`;

// Create the BlockBlobClient for file upload to Blob Storage
const blobClient = new BlockBlobClient(blobUrl, pipeline);

// Setup blank status notification arguments to be filled in on success/failure
let isSuccess;
let statusCode;
let statusDescription;

const uploadStatus = await blobClient.uploadFile(localFilePath);
console.log('uploadStreamToBlockBlob success');

  try {
    const uploadStatus = await blobClient.uploadFile(localFilePath);
    console.log('uploadStreamToBlockBlob success');

    // Save successful status notification arguments
    isSuccess = true;
    statusCode = uploadStatus._response.status;
    statusDescription = uploadStatus._response.bodyAsText;

    // Notify IoT hub of upload to blob status (success)
    console.log('notifyBlobUploadStatus success');
  }
  catch (err) {
    isSuccess = false;
    statusCode = err.code;
    statusDescription = err.message;

    console.log('notifyBlobUploadStatus failed');
    console.log(err);
  }

// Send file upload status notification to IoT hub
await client.notifyBlobUploadStatus(blobInfo.correlationId, isSuccess, statusCode, statusDescription);
```

### Upload the local file to blob storage

You can upload a local file to blob storage from a computer

```javascript
const deviceClient = Client.fromConnectionString(deviceConnectionString, Protocol);
uploadToBlob(localFilePath, deviceClient)
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    process.exit();
  });

```

#### SDK file upload sample

The SDK includes an [upload to blob advanced](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/upload_to_blob_advanced.js) sample.

## Create a backend application

This section describes how to receive file upload notifications in a backend application.

The [ServiceClient](/javascript/api/azure-iothub/client) class contains methods that services can use to receive file upload notifications.

### Install service SDK package

Run this command to install **azure-iothub** on your development machine:

```cmd/sh
npm install azure-iothub --save
```

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Use [fromConnectionString](/javascript/api/azure-iothub/client?#azure-iothub-client-fromconnectionstring) to connect to IoT hub.

To upload a file from a device, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

As a parameter to `CreateFromConnectionString`, supply the **service** shared access policy connection string. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

```javascript
var Client = require('azure-iothub').Client;
var connectionString = '{IoT hub shared access policy connection string}';
var client = Client.fromConnectionString(connectionString);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-node](iot-hub-howto-connect-service-iothub-entra-node.md)]

### Create a file upload notification callback receiver

To create a file upload notification callback receiver:

1. Call [getFileNotificationReceiver](/javascript/api/azure-iothub/client?#azure-iothub-client-getfilenotificationreceiver). Supply the name of a file upload callback method that is called when notification messages are received.
1. Process file upload notifications in the callback method.

This example sets up a `receiveFileUploadNotification` notification  callback receiver. The receiver interprets the file upload status information and prints a status message to the console.

```javascript
//Set up the receiveFileUploadNotification notification message callback receiver
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
```

#### SDK file upload notification sample

The SDK includes a [file upload](https://github.com/Azure/azure-iot-sdk-node/blob/main/e2etests/test/file_upload.js) sample.
