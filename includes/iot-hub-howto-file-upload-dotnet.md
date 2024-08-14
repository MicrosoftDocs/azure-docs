---
title: Upload files from devices to Azure IoT Hub (.NET)
titleSuffix: Azure IoT Hub
description: How to upload files from a device to the cloud using Azure IoT device SDK for .NET. Uploaded files are stored in an Azure storage blob container.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 07/01/2024
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

## Overview

This how-to contains two sections:

* Upload a file from a device application
* Receive file upload notification in a backend application

## Upload a file from a device application

This section describes how to upload a file from a device to an IoT hub using the [DeviceClient](/dotnet/api/microsoft.azure.devices.client.deviceclient) class in the Azure IoT SDK for .NET.

Follow this procedure to upload a file from a device to IoT hub:

1. Connect to IoT hub
1. Get a SAS URI from IoT hub
1. Upload the file to Azure storage
1. Notify IoT hub of the file upload status

### Connect to the device

Call [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.client.deviceclient.createfromconnectionstring?#microsoft-azure-devices-client-deviceclient-createfromconnectionstring(system-string)) to connect to the device. Pass the device primary connection string.

`AMQP` is the default transport protocol.

``` csharp
static string connectionString = "{device primary connection string}";
deviceClient = DeviceClient.CreateFromConnectionString(connectionString);
```

### Get a SAS URI from IoT hub

Call [GetFileUploadSasUriAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.getfileuploadsasuriasync) to get file upload details. The SAS URI is used in the next step to upload a file from a device to Blob Storage.

```csharp
const string filePath = "TestPayload.txt";
using var fileStreamSource = new FileStream(filePath, FileMode.Open);
var fileName = Path.GetFileName(fileStreamSource.Name);
var fileUploadSasUriRequest = new FileUploadSasUriRequest
{
    BlobName = fileName
};

FileUploadSasUriResponse sasUri = await _deviceClient.GetFileUploadSasUriAsync(fileUploadSasUriRequest, System.Threading.CancellationToken cancellationToken = default);
Uri uploadUri = sasUri.GetBlobUri();
```

### Upload a file to Azure storage

To upload a file to Azure storage:

1. Create a [blockBlobClient](/dotnet/api/azure.storage.blobs.specialized.blockblobclient) object, passing a file upload URI.

1. Use the [UploadAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.uploadasync?#azure-storage-blobs-specialized-blockblobclient-uploadasync(system-io-stream-azure-storage-blobs-models-blobuploadoptions-system-threading-cancellationtoken)) method to upload a file to Blob Storage, passing the SAS URI. You can optionally add Blob upload options and cancellation token parameters.

The Azure Blob client always uses HTTPS as the protocol to upload the file to Azure Storage.

In this example, `BlockBlobClient` is passed the SAS URI to create an Azure Storage block Blob client and uploads the file:

```csharp
var blockBlobClient = new BlockBlobClient(uploadUri);
await blockBlobClient.UploadAsync(fileStreamSource, null, null);
```

### Notify IoT hub of the file upload status

Use [CompleteFileUploadAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.completefileuploadasync) to notify IoT hub that the device client completed the upload, passing a [FileUploadCompletionNotification](/dotnet/api/microsoft.azure.devices.client.transport.fileuploadcompletionnotification) object. The `IsSuccess` flag indicates whether or not the upload was successful. After being notified, IoT hub will release resources associated with the upload (the SAS URI).

If file upload notifications are enabled, IoT hub sends a file upload notification message to backend services that are configured for file upload notification.

```csharp
var successfulFileUploadCompletionNotification = new FileUploadCompletionNotification
{
    // Mandatory. Must be the same value as the correlation id returned in the sas uri response
    CorrelationId = sasUri.CorrelationId,

    // Mandatory. Will be present when service client receives this file upload notification
    IsSuccess = true,

    // Optional, user defined status code. Will be present when service client receives this file upload notification
    StatusCode = 200,

    // Optional, user-defined status description. Will be present when service client receives this file upload notification
    StatusDescription = "Success"
};

await _deviceClient.CompleteFileUploadAsync(successfulFileUploadCompletionNotification);
```

### SDK file upload sample

The SDK includes this [file upload sample](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/device/samples/getting%20started/FileUploadSample/FileUploadSample.cs).

## Receive a file upload notification in a backend application

You can create a backend service to receive file upload notification messages from IoT hub.

The [ServiceClient](/dotnet/api/microsoft.azure.devices.serviceclient) class contains methods that services can use to receive file upload notifications.

To receive file upload notification:

1. Call [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.serviceclient.createfromconnectionstring) to connect to IoT hub. Pass the IoT hub primary connection string.
1. Create a [CancellationToken](/dotnet/api/azure.core.httpmessage.cancellationtoken?#azure-core-httpmessage-cancellationtoken).
1. Call [GetFileNotificationReceiver](/dotnet/api/microsoft.azure.devices.serviceclient.getfilenotificationreceiver?#microsoft-azure-devices-serviceclient-getfilenotificationreceiver) to create a notification receiver.
1. Use a loop with [ReceiveAsync](/dotnet/api/microsoft.azure.devices.receiver-1.receiveasync?#microsoft-azure-devices-receiver-1-receiveasync(system-threading-cancellationtoken)) to wait for the file upload notification.

For example:

```csharp
using Microsoft.Azure.Devices;
static ServiceClient serviceClient;
static string connectionString = "{IoT hub connection string}";
serviceClient = ServiceClient.CreateFromConnectionString(connectionString);

// Define the cancellation token
CancellationTokenSource source = new CancellationTokenSource();
CancellationToken token = source.Token;

// Create a notification receiver
var notificationReceiver = serviceClient.GetFileNotificationReceiver();
Console.WriteLine("\nReceiving file upload notification from service");

// Check for file upload notifications
while (true)
{
    var fileUploadNotification = await notificationReceiver.ReceiveAsync(token);
    if (fileUploadNotification == null) continue;
    Console.ForegroundColor = ConsoleColor.Yellow;
    Console.WriteLine("Received file upload notification: {0}", 
        string.Join(", ", fileUploadNotification.BlobName));
    Console.ResetColor();
    await notificationReceiver.CompleteAsync(fileUploadNotification);
}
```
