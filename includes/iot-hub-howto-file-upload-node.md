---
title: Upload files from devices to Azure IoT Hub (Node)
titleSuffix: Azure IoT Hub
description: How to upload files from a device to the cloud using Azure IoT device SDK for Node.js. Uploaded files are stored in an Azure storage blob container.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: nodejs
ms.topic: how-to
ms.date: 07/01/2024
ms.custom: mqtt, devx-track-js
---

## Overview

This how-to contains two sections:

* Upload a file from a device application
* Receive file upload notification in a backend application

## Upload a file from a device application

This section describes how to upload a file from a device to an IoT hub using the [azure-iot-device](/javascript/api/azure-iot-device) package in the Azure IoT SDK for Node.js.

### Install SDK packages

Run this command to install the **azure-iot-device** device SDK, the **azure-iot-device-mqtt**, and the **@azure/storage-blob** packages: on your development machine:

```cmd/sh
npm install azure-iot-device azure-iot-device-mqtt @azure/storage-blob --save
```

The [azure-iot-device](/javascript/api/azure-iot-device) package contains objects that interface with IoT devices.

Follow this procedure for uploading a file from a device to IoT hub:

1. Get Blob shared access signatures
1. Upload the file to Azure Storage
1. Send file upload status notification to IoT hub

### Create modules

Create Client, Protocol, errors, and path modules using the installed packages.

```javascript
const Client = require('azure-iot-device').Client;
const Protocol = require('azure-iot-device-mqtt').Mqtt;
const errors = require('azure-iot-common').errors;
const path = require('path');
```

### Get a SAS URI from IoT hub

Use [getBlobSharedAccessSignature](/javascript/api/azure-iot-device/client?#azure-iot-device-client-getblobsharedaccesssignature) to get the linked storage account SAS token from IoT hub. As described in prerequisites, the IoT hub is linked to the Blob Storage.

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

### Upload the file to IoT hub

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

## Receive file upload notification in a backend application

You can create a backend application to check the IoT hub service client for device file upload notifications.

To create a file upload notification application:

1. Connect to the IoT hub service client
1. Check for a file upload notification

### Connect to the IoT hub service client

The [ServiceClient](/javascript/api/azure-iothub/client) class contains methods that services can use to receive file upload notifications.

Connect to IoT hub using [fromConnectionString](/javascript/api/azure-iothub/client?#azure-iothub-client-fromconnectionstring). Pass the IoT hub primary connection string.

```javascript
const Client = require('azure-iothub').Client;
const connectionString = "{IoT hub primary connection string}";
const serviceClient = Client.fromConnectionString(connectionString);
```

[Open](/javascript/api/azure-iothub/client?#azure-iothub-client-open-1) the connection to IoT hub.

```javascript
//Open the connection to IoT hub
serviceClient.open(function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Service client connected');
```

### Check for a file upload notification

To check for file upload notifications:

1. Call [getFileNotificationReceiver](/javascript/api/azure-iothub/client?#azure-iothub-client-getfilenotificationreceiver). Supply the name of a file upload callback method that are called when notification messages are received.
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

### SDK file upload sample

The SDK includes an [upload to blob advanced](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/upload_to_blob_advanced.js) sample.
