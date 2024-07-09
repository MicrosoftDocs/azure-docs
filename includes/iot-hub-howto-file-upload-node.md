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

## Upload a file from a device application

### Install the Node.js packages

Run these commands to install the **azure-iot-device** Device SDK, the **azure-iot-device-mqtt**, and the **@azure/storage-blob** packages: on your development machine:

```cmd/sh
npm install azure-iot-device azure-iot-device-mqtt @azure/storage-blob --save
```

The [azure-iot-device](/javascript/api/azure-iot-device) package contains objects that interface with IoT devices. This article describes `Client` class code.

## Receive messages in the device application

This section describes how to upload a file from a device using the [azure-iot-device](/javascript/api/azure-iot-device) package in the Azure IoT SDK for Node.js.

### Create modules

Create Client, Protocol, errors, and path modules using the packages installed in the previous step.

```javascript
const Client = require('azure-iot-device').Client;
const Protocol = require('azure-iot-device-mqtt').Mqtt;
const errors = require('azure-iot-common').errors;
const path = require('path');
```

### Get blob shared access signatures

Use [getBlobSharedAccessSignature](/javascript/api/azure-iot-device/client?#azure-iot-device-client-getblobsharedaccesssignature) to get the linked storage account SAS Token from IoT Hub.

```javascript
// make sure you set these environment variables prior to running the sample.
const deviceConnectionString = process.env.DEVICE_CONNECTION_STRING;
const localFilePath = process.env.PATH_TO_FILE;
const storageBlobName = path.basename(localFilePath);

const blobInfo = await client.getBlobSharedAccessSignature(storageBlobName);
if (!blobInfo) {
throw new errors.ArgumentError('Invalid upload parameters');
}
```

### Upload the file to IoT Hub

To upload a file to IoT Hub:

1. Creates a communication pipeline.
2. Constructs the blob URL.
3. Create a [BlockBlobClient](/javascript/api/@azure/storage-blob/blockblobclient) for file upload to Blob Storage.
4. Call [uploadFile](/javascript/api/@azure/storage-blob/blockblobclient?#@azure-storage-blob-blockblobclient-uploadfile) to upload the file to Blob Storage.
5. Call [notifyBlobUploadStatus](/javascript/api/azure-iot-device/client?#azure-iot-device-client-notifyblobuploadstatus) to notify IoT Hub that the upload succeeded or failed.

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

// Notify the blob upload status
await client.notifyBlobUploadStatus(blobInfo.correlationId, isSuccess, statusCode, statusDescription);

```

### Sample

The SDK include an [upload to blob advanced](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/upload_to_blob_advanced.js) sample.
