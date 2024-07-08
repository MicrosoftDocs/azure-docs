---
title: Upload files from devices to Azure IoT Hub (Java)
titleSuffix: Azure IoT Hub
description: How to upload files from a device to the cloud using Azure IoT device SDK for Java. Uploaded files are stored in an Azure storage blob container.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: java
ms.topic: how-to
ms.date: 07/01/2024
ms.custom: amqp, mqtt, devx-track-java, devx-track-extended-java
---

## Upload a file from a device

There are two SDK classes that are used to upload files to IoT Hub.

* The [DeviceClient](/dotnet/api/microsoft.azure.devices.client.deviceclient) class contains methods that a device can use to upload files to IoT Hub.
* The [ServiceClient](/dotnet/api/microsoft.azure.devices.serviceclient) class contains methods that services can use to receive file upload notification.

### Connection protocol

File upload operations always uses HTTPS. `DeviceClient` can define the `IotHubClientProtocol` for other services like telemetry, device Method and device twin.

For example:

```java
IotHubClientProtocol protocol = IotHubClientProtocol.MQTT;
```

### Connect to IoT Hub

```java
String connString = "Your device connection string here";
DeviceClient client = new DeviceClient(connString, protocol);
```

### Retrieve the SAS URI from Iot Hub

Call [getFileUploadSasUri](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient?view=azure-java-stable#com-microsoft-azure-sdk-iot-device-deviceclient-getfileuploadsasuri(com-microsoft-azure-sdk-iot-deps-serializer-fileuploadsasurirequest)) to obtain a [FileUploadSasUriResponse](/java/api/com.microsoft.azure.sdk.iot.deps.serializer.fileuploadsasuriresponse) object.

FileUploadSasUriResponse includes these methods which are passed to file upload methods. The Blob URI (SAS URI) is used to upload a file to blob storage.

* Correlation Id - `getCorrelationId())`
* Container name - `getContainerName())`
* Blob name - `getBlobName())`
* Blob Uri - `getBlobUri())`

For example:

```java
FileUploadSasUriResponse sasUriResponse = client.getFileUploadSasUri(new FileUploadSasUriRequest(file.getName()));

System.out.println("Successfully got SAS URI from IoT Hub");
System.out.println("Correlation Id: " + sasUriResponse.getCorrelationId());
System.out.println("Container name: " + sasUriResponse.getContainerName());
System.out.println("Blob name: " + sasUriResponse.getBlobName());
System.out.println("Blob Uri: " + sasUriResponse.getBlobUri());
```

### Upload the file

Pass the blob URI endpoint to [BlobClientBuilder](/java/api/com.azure.storage.blob.blobclientbuilder?#com-azure-storage-blob-blobclientbuilder-buildclient()) to create the [BlobClient](/java/api/com.azure.storage.blob.blobclient) object.

```java
BlobClient blobClient =
    new BlobClientBuilder()
        .endpoint(sasUriResponse.getBlobUri().toString())
        .buildClient();
```

Call [uploadFromFile](https://learn.microsoft.com/en-us/java/api/com.azure.storage.blob.blobclient?#com-azure-storage-blob-blobclient-uploadfromfile(java-lang-string)) to upload the file to blob storage.

```java
String fullFileName = "Path of the file to upload";
blobClient.uploadFromFile(fullFileName);
```

## Send file upload status notification to IoT Hub

Create a [FileUploadCompletionNotification](https://learn.microsoft.com/en-us/java/api/com.microsoft.azure.sdk.iot.deps.serializer.fileuploadcompletionnotification?#com-microsoft-azure-sdk-iot-deps-serializer-fileuploadcompletionnotification-fileuploadcompletionnotification(java-lang-string-java-lang-boolean)) object. Pass the `correlationId` and `isSuccess` file upload success status. Pass an `isSuccess` `true` value when file upload was successful, `false` when not.

`FileUploadCompletionNotification` must be called even when the file upload fails. IoT Hub has a fixed number of SAS URIs allowed to be active at any given time. Once you are done with the file upload, you should free your SAS URI so that other SAS URIs can be generated. If a SAS URI is not freed through this API, then it will free itself eventually based on how long SAS URIs are configured to live on an IoT Hub.

This example passes a successful status.

```java
FileUploadCompletionNotification completionNotification = new FileUploadCompletionNotification(sasUriResponse.getCorrelationId(), true);
client.completeFileUpload(completionNotification);
```

### Close the client

Free the `client` resources.

```java
client.closeNow();
```

### Samples

There are two Java file upload [samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples/file-upload-sample/src/main/java/samples/com/microsoft/azure/sdk/iot).
