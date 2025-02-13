---
title: Upload files from devices to Azure IoT Hub (Java)
titleSuffix: Azure IoT Hub
description: How to upload files from a device to the cloud using Azure IoT device SDK for Java. Uploaded files are stored in an Azure storage blob container.
author: kgremban
ms.author: kgremban
ms.service: azure-iot-hub
ms.devlang: java
ms.topic: include
ms.date: 12/12/2024
ms.custom: amqp, mqtt, devx-track-java, devx-track-extended-java
---

## Overview

This how-to contains two sections:

* Upload a file from a device application
* Receive file upload notification in a backend application

## Upload a file from a device application

This section describes how to upload a file from a device to an IoT hub using the [DeviceClient](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient) class from the Azure IoT SDK for Java.

Follow this procedure to upload a file from a device to IoT hub:

1. Connect the device to IoT Hub
1. Get a SAS URI from IoT hub
1. Upload the file to Azure Storage
1. Send file upload status notification to IoT hub

### Connect a device to IoT Hub

A device app can authenticate with IoT Hub using the following methods:

* X.509 certificate
* Shared access key

#### Authenticate using an X.509 certificate

[!INCLUDE [iot-hub-howto-auth-device-cert-java](iot-hub-howto-auth-device-cert-java.md)]

#### Authenticate using a shared access key

File upload operations always use HTTPS, but [DeviceClient](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient) can define the [IotHubClientProtocol](/java/api/com.microsoft.azure.sdk.iot.device.iothubclientprotocol) for other services like telemetry, device method, and device twin.

```java
IotHubClientProtocol protocol = IotHubClientProtocol.MQTT;
```

Instantiate the `DeviceClient` to connect to the device using the device primary connection string.

```java
String connString = "{IoT hub connection string}";
DeviceClient client = new DeviceClient(connString, protocol);
```

### Get a SAS URI from IoT hub

Call [getFileUploadSasUri](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient?#com-microsoft-azure-sdk-iot-device-deviceclient-getfileuploadsasuri(com-microsoft-azure-sdk-iot-deps-serializer-fileuploadsasurirequest)) to obtain a [FileUploadSasUriResponse](/java/api/com.microsoft.azure.sdk.iot.deps.serializer.fileuploadsasuriresponse) object.

`FileUploadSasUriResponse` includes these methods and return values. The return values can be passed to file upload methods.

| Method                | Return value   |
| --------------------- | -------------- |
| `getCorrelationId()`  | Correlation ID |
| `getContainerName()`  | Container name |
| `getBlobName()`       | Blob name      |
| `getBlobUri()`        | Blob URI       |

For example:

```java
FileUploadSasUriResponse sasUriResponse = client.getFileUploadSasUri(new FileUploadSasUriRequest(file.getName()));

System.out.println("Successfully got SAS URI from IoT hub");
System.out.println("Correlation Id: " + sasUriResponse.getCorrelationId());
System.out.println("Container name: " + sasUriResponse.getContainerName());
System.out.println("Blob name: " + sasUriResponse.getBlobName());
System.out.println("Blob Uri: " + sasUriResponse.getBlobUri());
```

### Upload the file to Azure Storage

Pass the blob URI endpoint to [BlobClientBuilder.buildclient](/java/api/com.azure.storage.blob.blobclientbuilder?#com-azure-storage-blob-blobclientbuilder-buildclient()) to create the [BlobClient](/java/api/com.azure.storage.blob.blobclient) object.

```java
BlobClient blobClient =
    new BlobClientBuilder()
        .endpoint(sasUriResponse.getBlobUri().toString())
        .buildClient();
```

Call [uploadFromFile](/java/api/com.azure.storage.blob.blobclient?#com-azure-storage-blob-blobclient-uploadfromfile(java-lang-string)) to upload the file to Blob Storage.

```java
String fullFileName = "Path of the file to upload";
blobClient.uploadFromFile(fullFileName);
```

### Send file upload status notification to IoT hub

Send an upload status notification to IoT hub after a file upload attempt.

Create a [FileUploadCompletionNotification](/java/api/com.microsoft.azure.sdk.iot.deps.serializer.fileuploadcompletionnotification?#com-microsoft-azure-sdk-iot-deps-serializer-fileuploadcompletionnotification-fileuploadcompletionnotification(java-lang-string-java-lang-boolean)) object. Pass the `correlationId` and `isSuccess` file upload success status. Pass an `isSuccess` `true` value when file upload was successful, `false` when not.

`FileUploadCompletionNotification` must be called even when the file upload fails. IoT hub has a fixed number of SAS URI allowed to be active at any given time. Once you're done with the file upload, you should free your SAS URI so that other SAS URI can be generated. If a SAS URI isn't freed through this API, then it frees itself eventually based on how long SAS URIs are configured to live on an IoT hub.

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

## Create a backend application

This section describes how to receive a file upload notification in a backend application.

The [ServiceClient](/java/api/com.azure.core.annotation.serviceclient) class contains methods that services can use to receive file upload notifications.

### Add import statements

Add these **import** statements to use the Azure IoT Java SDK and exception handler.

```java
import com.microsoft.azure.sdk.iot.service.*;
import java.io.IOException;
import java.net.URISyntaxException;
```

### Connect to the IoT Hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

##### Define the connection protocol

Use [IotHubServiceClientProtocol](/java/api/com.microsoft.azure.sdk.iot.service.iothubserviceclientprotocol) to define the application-layer protocol used by the service client to communicate with an IoT Hub.

`IotHubServiceClientProtocol` only accepts the `AMQPS` or `AMQPS_WS` enum.

```java
private static final IotHubServiceClientProtocol protocol =    
    IotHubServiceClientProtocol.AMQPS;
```

##### Create the ServiceClient object

Create the [ServiceClient](/java/api/com.azure.core.annotation.serviceclient) object, supplying the Iot Hub connection string and protocol.

To upload a file on a device to IoT Hub, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

As a parameter to the `ServiceClient` constructor, supply the **service** shared access policy. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

```java
String iotHubConnectionString = "HostName=xxxxx.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=xxxxxxxxxxxxxxxxxxxxxxxx";
private static final ServiceClient serviceClient (iotHubConnectionString, protocol);
```

##### Open the connection between application and IoT Hub

[Open](/java/api/com.microsoft.azure.sdk.iot.service.serviceclient?#com-microsoft-azure-sdk-iot-service-serviceclient-open()) the AMQP sender connection. This method creates the connection between the application and IoT Hub.

```java
serviceClient.open();
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-java](iot-hub-howto-connect-service-iothub-entra-java.md)]

### Check for file upload status

To check for file upload status:

1. Create a [getFileUploadNotificationReceiver](/java/api/com.microsoft.azure.sdk.iot.service.fileuploadnotificationreceiver) object.
1. Use [open](/java/api/com.microsoft.azure.sdk.iot.service.fileuploadnotificationreceiver?#com-microsoft-azure-sdk-iot-service-fileuploadnotificationreceiver-open()) to connect to IoT hub.
1. Call [receive](/java/api/com.microsoft.azure.sdk.iot.service.fileuploadnotificationreceiver?#com-microsoft-azure-sdk-iot-service-fileuploadnotificationreceiver-receive()) to check for the file upload status. This method returns a [fileUploadNotification](/java/api/com.microsoft.azure.sdk.iot.service.fileuploadnotification) object. If an upload notice is received, you can view upload status fields using [fileUploadNotification](/java/api/com.microsoft.azure.sdk.iot.service.fileuploadnotification) methods.

For example:

```java
FileUploadNotificationReceiver receiver = serviceClient.getFileUploadNotificationReceiver();
receiver.open();
FileUploadNotification fileUploadNotification = receiver.receive(2000);

if (fileUploadNotification != null)
{
    System.out.println("File Upload notification received");
    System.out.println("Device Id : " + fileUploadNotification.getDeviceId());
    System.out.println("Blob Uri: " + fileUploadNotification.getBlobUri());
    System.out.println("Blob Name: " + fileUploadNotification.getBlobName());
    System.out.println("Last Updated : " + fileUploadNotification.getLastUpdatedTimeDate());
    System.out.println("Blob Size (Bytes): " + fileUploadNotification.getBlobSizeInBytes());
    System.out.println("Enqueued Time: " + fileUploadNotification.getEnqueuedTimeUtcDate());
}
else
{
    System.out.println("No file upload notification");
}

// Close the receiver object
receiver.close();
```

### SDK file upload samples

There are two Java file upload [samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples/file-upload-sample/src/main/java/samples/com/microsoft/azure/sdk/iot).
