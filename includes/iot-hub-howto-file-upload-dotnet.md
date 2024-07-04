---
title: Upload files from devices to Azure IoT Hub (.NET)
titleSuffix: Azure IoT Hub
description: How to upload files from a device to the cloud using Azure IoT device SDK for .NET. Uploaded files are stored in an Azure storage blob container.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: how-to
ms.date: 06/20/2024
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

## Upload a file from a device application

Follow this procedure for uploading a file from a device to IoT Hub:

* Connect to IoT Hub
* Get a SAS URI from IoT Hub
* Upload the file to Azure storage
* Notify IoT Hub that it has completed the upload

There are two SDK classes that are used to upload files to IoT Hub.

* The [DeviceClient](/dotnet/api/microsoft.azure.devices.client.deviceclient) class contains methods that a device can use to upload files to IoT Hub.
* The [ServiceClient](/dotnet/api/microsoft.azure.devices.serviceclient) class contains methods that services can use to receive file upload notification.

### Connect to IoT Hub

Supply the IoT Hub primary connection string to `DeviceClient` using the [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.client.deviceclient.createfromconnectionstring?view=azure-dotnet#microsoft-azure-devices-client-deviceclient-createfromconnectionstring(system-string)) method. `AMQP` is the default transport protocol.

``` csharp
static string connectionString = "{IoT Hub connection string}";
deviceClient = DeviceClient.CreateFromConnectionString(connectionString);
```

### Get a SAS URI from IoT Hub

Call [GetFileUploadSasUriAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.getfileuploadsasuriasync) to get a file upload SAS URI which the Azure Storage SDK can use to upload a file to blob for this device.

For example:

```csharp
const string filePath = "TestPayload.txt";
using var fileStreamSource = new FileStream(filePath, FileMode.Open);
var fileName = Path.GetFileName(fileStreamSource.Name);
var fileUploadSasUriRequest = new FileUploadSasUriRequest
{
    BlobName = fileName
};

FileUploadSasUriResponse sasUri = await _deviceClient.GetFileUploadSasUriAsync(fileUploadSasUriRequest);
Uri uploadUri = sasUri.GetBlobUri();
```

### Upload the file to Azure storage

Create a [blockBlobClient](/dotnet/api/azure.storage.blobs.specialized.blockblobclient) object, passing a file upload URI.

Use the [UploadAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.uploadasync?#azure-storage-blobs-specialized-blockblobclient-uploadasync(system-io-stream-azure-storage-blobs-models-blobuploadoptions-system-threading-cancellationtoken)) method to upload a file to Azure storage, passing the the SAS URI.

The Azure blob client always uses HTTPS as the protocol to upload the file Azure storage.

In this example, `BlockBlobClient` is passed the SAS URI to create an Azure storage block blob client and uploads the file:

```csharp
var blockBlobClient = new BlockBlobClient(uploadUri);
await blockBlobClient.UploadAsync(fileStreamSource, new BlobUploadOptions());
```

### Notify IoT hub that it has completed the upload

Use [CompleteFileUploadAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.completefileuploadasync?view=azure-dotnet) to notify IoT Hub that the device client has completed the upload. After being notified, IoT Hub will release resources associated with the upload (the SAS URI).

If file upload notifications are enabled, IoT Hub sends a notification message to backend services.

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

## Receive a file upload notification in a backend application

This section describes how to receive file upload notification messages from IoT Hub.

### Instantiate the service client

```csharp
using Microsoft.Azure.Devices;
static ServiceClient serviceClient;
```

### Add the connection string

Replace the `{IoT Hub connection string}` placeholder value with the IoT Hub connection string.

```csharp
static string connectionString = "{IoT Hub connection string}";
serviceClient = ServiceClient.CreateFromConnectionString(connectionString);
```

### Receive the file upload notification

Call [GetFileNotificationReceiver](/dotnet/api/microsoft.azure.devices.serviceclient.getfilenotificationreceiver?#microsoft-azure-devices-serviceclient-getfilenotificationreceiver) to create a notification receiver. Then use a loop with [ReceiveAsync](/dotnet/api/microsoft.azure.devices.receiver-1.receiveasync?#microsoft-azure-devices-receiver-1-receiveasync(system-threading-cancellationtoken)) to wait for the file upload notification.

```csharp
// Define the cancellation token.
CancellationTokenSource source = new CancellationTokenSource();
CancellationToken token = source.Token;

var notificationReceiver = serviceClient.GetFileNotificationReceiver();
Console.WriteLine("\nReceiving file upload notification from service");
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

For more information, see:

* [Overview of file uploads with IoT Hub](../articles/iot-hub/iot-hub-devguide-file-upload.md)

* [Configure IoT Hub file uploads](../articles/iot-hub/iot-hub-configure-file-upload.md)

* [Azure blob storage documentation](../articles/storage/blobs/storage-blobs-introduction.md)

* [Azure blob storage API reference](../articles/storage/blobs/reference.md)

* [Azure IoT SDKs](../articles/iot-hub/-hub-devguide-sdks.md)
