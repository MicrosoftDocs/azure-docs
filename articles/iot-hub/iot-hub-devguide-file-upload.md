---
title: Understand Azure IoT Hub file upload | Microsoft Docs
description: Developer guide - use the file upload feature of IoT Hub to manage uploading files from a device to an Azure storage blob container.
author: robinsh
manager: philmea
ms.author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/30/2021
ms.custom: [mqtt, 'Role: Cloud Development', 'Role: IoT Device']
---

# Upload files with IoT Hub

There are many scenarios in which you can't easily map the data your devices send into the relatively small device-to-cloud messages that IoT Hub readily accepts. For example:
* Large image files
* Video Files
* Vibration data sampled at high frequency
* Some form of preprocessed data

When you need to upload such files from a device, you can still use the security and reliability of IoT Hub. Instead of brokering messages through IoT Hub itself, however, IoT Hub acts as a dispatcher to an associated Azure Storage account. A device requests a storage token from IoT Hub that is specific to the file the device wishes to upload. The device uses the SAS URI to upload the file to storage, and when the upload is complete the device sends a notification of completion to IoT Hub. IoT Hub checks that the file upload is complete.

[!INCLUDE [iot-hub-include-x509-ca-signed-file-upload-support-note](../../includes/iot-hub-include-x509-ca-signed-file-upload-support-note.md)]

### When to use

Use file upload to send media files and large telemetry batches uploaded by intermittently connected devices or compressed to save bandwidth. Refer to [Device-to-cloud communication guidance](iot-hub-devguide-d2c-guidance.md) if in doubt between using reported properties, device-to-cloud messages, or file upload.

## File upload overview

IoT Hub exposes device-facing endpoints through which a device can initiate file uploads and send file upload complete notifications to IoT Hub. It exposes a service-facing endpoint through which it notifies backend services of completed file uploads. To learn more, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).

File uploads are performed using Azure storage 

For devices:
1. Associate an Azure storage account and blob container with IoT Hub. Optionally, set SAS URI time-to-live (TTL).
1. Device initiate the file upload with IoT Hub and gets a SAS URI and correlation ID in return.
1. Device uses the SAS URI to call Azure blob storage APIs to upload the file to the blob container.
1. When the file upload is complete, device notifies IoT Hub of the completion status using the correlation ID from step 2.

For services:
1. Enable file upload notifications and configure file upload properties on IoT Hub.
1. Services subscribe to file upload notifications from the IoT Hub on the IoT hub's service-facing file notification endpoint.

IoT Hub has throttling limits on the number of file uploads that it can initiate in a given period. The threshold is based on the SKU and number of units of your IoT hub. Additionally, each device is limited to ten concurrent file uploads at a time. For more information, see [Throttling and quotas](iot-hub-devguide-quotas-throttling.md).

## Associate an Azure Storage account with IoT Hub

You must have an Azure Storage account associated with your IoT hub. 

To learn how to create one using the portal, see [Create a storage account](../storage/common/storage-account-create.md). 

You can also create one programmatically using the using the [IoT Hub resource provider REST APIs](/rest/api/iothub/iothubresource). 

When you associate an Azure Storage account with an IoT hub, the IoT hub generates a SAS URI. A device can use this SAS URI to securely upload a file to a blob container.

## Create a container

 To create a blob container through the portal:

1. In the left pane of your storage account, under **Data Storage**, select **Containers**.
1. In the Container blade, select **+ Container**.
1. In the **New container** pane that opens, give your container a name and select **Create**.

After creating a container, follow the instructions in [Configure file uploads using the Azure portal](iot-hub-configure-file-upload.md). Make sure that a blob container is associated with your IoT hub and that file notifications are enabled.

You can also use the [IoT Hub resource provider REST APIs](/rest/api/iothub/iothubresource) to create a container associated with the storage for your IoT Hub.

## File upload using an SDK

The following how-to guides provide complete step-by-step instructions to perform file uploads in a variety of SDK languages. They show you how to use the Azure portal to associate a storage account with an IoT hub. They also contain code snippets or refer to samples that guide you through the upload process.

| How-to guide | Device SDK example | Service SDK example |
|---------|--------|---------|
| [.NET](iot-hub-csharp-csharp-file-upload.md) | Yes | No |
| [Java](iot-hub-java-java-file-upload.md) | Yes | Yes |
| [Node.js](iot-hub-node-node-file-upload.md) | Yes | Yes |
| [Python](iot-hub-python-python-file-upload.md) | Yes | No service SDK available in Python |

> [!NOTE]
> The C device SDK uses a single call on the device client to perform file uploads. For more information, see [IoTHubDeviceClient_UploadToBlobAsync()](/azure/iot-hub/iot-c-sdk-ref/iothub-device-client-h/iothubdeviceclient-uploadtoblobasync) and [IoTHubDeviceClient_UploadMultipleBlocksToBlobAsync()](/azure/iot-hub/iot-c-sdk-ref/iothub-device-client-h/iothubdeviceclient-uploadmultipleblockstoblobasync). These functions perform all aspects of the file upload - initiating the upload, uploading the file to Azure storage, and notifying IoT Hub when it completes -- in a single call. Make sure that access to both the IoT Hub endpoint and the Azure storage endpoint (HTTPS) is available to the device as these functions will make calls to Azure storage APIs.

## Device: Initialize a file upload

The device calls the [Create File Upload SAS URI](/rest/api/iothub/device/create-file-upload-sas-uri) REST API or the equivalent API in one of the device SDKs to initiate a file upload. When IoT Hub receives the request, it responds with a correlation ID and the elements of a SAS URI that the device can use to authenticate with Azure storage. This response is subject to the throttling limits and per-device upload limits of the target IoT hub. 

**Supported protocols**: AMQP, AMQP-WS, MQTT, MQTT-WS, and HTTPS <br/>
**Endpoint**: `{iot hub}.azure-devices.net/devices/{deviceId}/files` <br/>
**Method**: POST

```json
{
    "blobName":"myfile.txt"
}

```
| Property | Description |
|----------|-------------|
| blobName | The name of the blob to generate the SAS URI for. |

IoT Hub returns the following data, subject to its throttling and per-device upload limits:

```json
{
    "correlationId":"MjAyMTA3MzAwNjIxXzBiNjgwOGVkLWZjNzQtN...MzYzLWRlZmI4OWQxMzdmNF9teWZpbGUudHh0X3ZlcjIuMA==",
    "hostName":"contosostorageaccount.blob.core.windows.net",
    "containerName":"device-upload-container",
    "blobName":"mydevice/myfile.txt",
    "sasToken":"?sv=2018-03-28&sr=b&sig=mBLiODhpKXBs0y9RVzwk1S...l1X9qAfDuyg%3D&se=2021-07-30T06%3A11%3A10Z&sp=rw"
}

```
| Property | Description |
|----------|-------------|
| correlationId | The identifier for the device to use when sending the file upload complete notification to IoT Hub. |
| hostName | The Azure storage account host name for the storage account configured on the IoT hub |
| containerName | The name of the blob container configured on the IoT hub. |
| blobName | The location where the blob will be stored in the container. The name is of the following format: `{device ID of the device making the request}/{blobName in the request}` | 
| sasToken | A SAS token that grants read/write access on the blob. The token is generated and signed by IoT Hub. |

When it receives the response, the device:

* Saves the correlation ID to include in the file upload complete notification to IoT hub when it completes the upload. 

* Uses the other properties to construct a SAS URI for the blob that it uses to authenticate with Azure storage. The SAS URI is of the following form: `https://{hostMane}/{containerName}/{blobName}{sasToken}` (The `sasToken` property in the response contains a leading '?' character.) The braces are not included. For more information about the SAS URI and SAS token, see [Create a service SAS](/rest/api/storageservices/create-service-sas) in the Azure storage documentation. 


## Device: Upload file using Azure Storage APIs

The device uses the [Azure Blob storage REST APIs](/rest/api/storageservices/blob-service-rest-api) or equivalent Azure storage SDK APIs to upload the file to the blob in Azure storage. 

**Supported protocols**: HTTPS

The following example shows a [Put Blob](/rest/api/storageservices/put-blob) request to create or update a small block blob. Notice that the URI used for this request is the SAS URI returned by IoT Hub in the previous section. The `x-ms-blob-type` header indicates that this request is for a block blob. If the request is successful, Azure storage returns a `201 Created`.

```http
PUT https://contosostorageaccount.blob.core.windows.net/device-upload-container/mydevice/myfile.txt?sv=2018-03-28&sr=b&sig=mBLiODhpKXBs0y9RVzwk1S...l1X9qAfDuyg%3D&se=2021-07-30T06%3A11%3A10Z&sp=rw HTTP/1.1
Content-Length: 11
Content-Type: text/plain; charset=UTF-8
Host: contosostorageaccount.blob.core.windows.net
x-ms-blob-type: BlockBlob

hello world
```

For more information about Azure storage, see 


## Device: Notify IoT Hub of a completed file upload

The device calls the [Update File Upload Status](/rest/api/iothub/device/update-file-upload-status) REST API or the equivalent API in one of the device SDKs when it completes the file upload. The device should update the file upload status with IoT Hub regardless of whether the upload succeeds or fails.

**Supported protocols**: AMQP, AMQP-WS, MQTT, MQTT-WS, and HTTPS <br/>
**Endpoint**: `{iot hub}.azure-devices.net/devices/{deviceId}/files/notifications` <br/>
**Method**: POST 

```json
POST https://myfileuploadhub.azure-devices.net/devices/mydevice/files/notifications?api-version=2020-03-13 HTTP/1.1
Content-Length: 227
Content-Type: application/json
Authorization: SharedAccessSignature sr=MyFileUploadHub.azure-devices.net%2Fdevices%2Fmydevice&sig=pD7ytXr0ZmaWiXfY2N2wutNW0rF1NIZ2yYmKGbsW0LM%3D&se=1627625040
Host: myfileuploadhub.azure-devices.net

{
    "correlationId": "MjAyMTA3MzAwNjIxXzBiNjgwOGVkLWZjNzQtN...MzYzLWRlZmI4OWQxMzdmNF9teWZpbGUudHh0X3ZlcjIuMA==",
    "isSuccess": true,
    "statusCode": 200,
    "statusDescription": "File uploaded successfully"
}

```
 Property | Description |
|----------|-------------|
| correlationId | The correlation ID received in the initial SAS URI request. |
| isSuccess | A boolean that indicates whether the file upload was successful. |
| statusCode | An integer that represents the status code of the file upload. Typically 3 digits; for example 200, 201, etc. |
| statusDescription | A human-readable description of the file upload status. |

When it receives a file upload complete notification from the device, IoT Hub:

* Triggers a file upload notification to backend services if file upload notifications are configured.

* Releases resources associated with the file upload. Without receiving a notification, IoT Hub will maintain the resources until the SAS URI time-to-live (TTL) expires.

## Service: File upload notifications

If file upload notifications are enabled on your IoT hub, IoT Hub generates a notification message for backend services when a device notifies it that a file upload is complete. This message contains the name and storage location of the file. Your service can use this message to manage uploads. For example, it can trigger its own processing of the blob data, trigger processing of the blob data using other Azure services, or log the file upload notification for later review.

IoT Hub delivers file upload notifications through a service-facing endpoint. The receive semantics for file upload notifications are the same as for cloud-to-device messages and have the same [message life cycle](iot-hub-devguide-messages-c2d.md#the-cloud-to-device-message-life-cycle). The service SDKs expose APIs to handle file upload notifications. 

**Supported protocols** AMQP, AMQP-WS <br/>
**Endpoint**: `{iot hub}.azure-devices.net/messages/servicebound/fileuploadnotifications` <br/>
**Method** GET

Each message retrieved from the file upload notification endpoint is a JSON record with the following properties:

| Property | Description |
| --- | --- |
| EnqueuedTimeUtc |Timestamp indicating when the notification was created. |
| DeviceId |**DeviceId** of the device which uploaded the file. |
| BlobUri |URI of the uploaded file. |
| BlobName |Name of the uploaded file. |
| LastUpdatedTime |Timestamp indicating when the file was last updated. |
| BlobSizeInBytes |Size of the uploaded file. |

**Example**. This example shows the body of a file upload notification message.

```json
{
    "deviceId":"mydevice",
    "blobUri":"https://{storage account}.blob.core.windows.net/{container name}/mydevice/myfile.jpg",
    "blobName":"mydevice/myfile.jpg",
    "lastUpdatedTime":"2016-06-01T21:22:41+00:00",
    "blobSizeInBytes":1234,
    "enqueuedTimeUtc":"2016-06-01T21:22:43.7996883Z"
}
```

## File upload notification configuration settings

Each IoT hub has the following configuration options for file upload notifications:

| Property | Description | Range and default |
| --- | --- | --- |
| **enableFileUploadNotifications** |Controls whether file upload notifications are written to the file notifications endpoint. |Bool. Default: True. |
| **fileNotifications.ttlAsIso8601** |Default TTL for file upload notifications. |ISO_8601 interval up to 48H (minimum 1 minute). Default: 1 hour. |
| **fileNotifications.lockDuration** |Lock duration for the file upload notifications queue. |5 to 300 seconds (minimum 5 seconds). Default: 60 seconds. |
| **fileNotifications.maxDeliveryCount** |Maximum delivery count for the file upload notification queue. |1 to 100. Default: 100. |

You can set these properties on your IoT hub using the Azure portal, Azure CLI, or PowerShell. To learn how, see the topics under [Configure file upload](iot-hub-configure-file-upload.md).

## Next steps

Now you've learned how to upload files from devices using IoT Hub, you may be interested in the following IoT Hub developer guide topics:

* [Azure IoT device and service SDKs](iot-hub-devguide-sdks.md) lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.

* [IoT Hub MQTT support](iot-hub-mqtt-support.md) provides more information about IoT Hub support for the MQTT protocol.

* [Manage device identities in IoT Hub](iot-hub-devguide-identity-registry.md)

* [Control access to IoT Hub](iot-hub-devguide-security.md)

* [Use device twins to synchronize state and configurations](iot-hub-devguide-device-twins.md)

* [Invoke a direct method on a device](iot-hub-devguide-direct-methods.md)

* [Schedule jobs on multiple devices](iot-hub-devguide-jobs.md)

To try out some of the concepts described in this article, see the following IoT Hub tutorial:

* [How to upload files from devices to the cloud with IoT Hub](iot-hub-csharp-csharp-file-upload.md)
