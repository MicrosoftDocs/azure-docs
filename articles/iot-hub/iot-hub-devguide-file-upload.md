---
title: Understand Azure IoT Hub file upload | Microsoft Docs
description: Developer guide - use the file upload feature of IoT Hub to manage uploading files from a device to an Azure storage blob container.
author: robinsh

ms.author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 11/07/2018
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

The following how-to guides provide complete walkthroughs of the file upload process in a variety of SDK languages. These guides show you how to use the Azure portal to associate a storage account with an IoT hub. They also contain code snippets or refer to samples that guide you through the upload process.

* [.NET](iot-hub-csharp-csharp-file-upload.md)
* [Java](iot-hub-java-java-file-upload.md)
* [Node.js](iot-hub-node-node-file-upload.md)
* [Python](iot-hub-python-python-file-upload.md)

> [!NOTE]
> The [Azure IoT SDKs](iot-hub-devguide-sdks.md) automatically handle retrieving the shared access signature URI, uploading the file, and notifying IoT Hub of a completed upload. If a firewall blocks access to the Blob Storage endpoint but allows access to the IoT Hub endpoint, the file upload process fails and shows the following error for the IoT C# device SDK:
>
> `---> System.Net.Http.HttpRequestException: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond`
>
> For the file upload feature to work, access to both the IoT Hub endpoint and the Blob Storage endpoint must be available to the device.
> 


## Initialize a file upload (REST)

You can use REST APIs rather than one of the SDKs to upload a file. IoT Hub has an endpoint specifically for devices to request a SAS URI for storage to upload a file. To start the file upload process, the device sends a POST request to `{iot hub}.azure-devices.net/devices/{deviceId}/files` with the following JSON body:

```json
{
    "blobName": "{name of the file for which a SAS URI will be generated}"
}
```

IoT Hub returns the following data, which the device uses to upload the file:

```json
{
    "correlationId": "somecorrelationid",
    "hostName": "yourstorageaccount.blob.core.windows.net",
    "containerName": "testcontainer",
    "blobName": "test-device1/image.jpg",
    "sasToken": "1234asdfSAStoken"
}
```

### Deprecated: initialize a file upload with a GET

> [!NOTE]
> This section describes deprecated functionality for how to receive a SAS URI from IoT Hub. Use the POST method described previously.

IoT Hub has two REST endpoints to support file upload, one to get the SAS URI for storage and the other to notify the IoT hub of a completed upload. The device starts the file upload process by sending a GET to the IoT hub at `{iot hub}.azure-devices.net/devices/{deviceId}/files/{filename}`. The IoT hub returns:

* A SAS URI specific to the file to be uploaded.

* A correlation ID to be used once the upload is completed.

## Notify IoT Hub of a completed file upload (REST)

The device uploads the file to storage using the Azure Storage SDKs. When the upload is complete, the device sends a POST request to `{iot hub}.azure-devices.net/devices/{deviceId}/files/notifications` with the following JSON body:

```json
{
    "correlationId": "{correlation ID received from the initial request}",
    "isSuccess": bool,
    "statusCode": XXX,
    "statusDescription": "Description of status"
}
```

The value of `isSuccess` is a Boolean that indicates whether the file was uploaded successfully. The status code for `statusCode` is the status for the upload of the file to storage, and the `statusDescription` corresponds to the `statusCode`.

## Reference topics:

The following reference topics provide you with more information about uploading files from a device.

### File upload notifications

Optionally, when a device notifies IoT Hub that an upload is complete, IoT Hub generates a notification message. This message contains the name and storage location of the file.

As explained in [Endpoints](iot-hub-devguide-endpoints.md), IoT Hub delivers file upload notifications through a service-facing endpoint (**/messages/servicebound/fileuploadnotifications**) as messages. The receive semantics for file upload notifications are the same as for cloud-to-device messages and have the same [message life cycle](iot-hub-devguide-messages-c2d.md#the-cloud-to-device-message-life-cycle). Each message retrieved from the file upload notification endpoint is a JSON record with the following properties:

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

### File upload notification configuration options

Each IoT hub has the following configuration options for file upload notifications:

| Property | Description | Range and default |
| --- | --- | --- |
| **enableFileUploadNotifications** |Controls whether file upload notifications are written to the file notifications endpoint. |Bool. Default: True. |
| **fileNotifications.ttlAsIso8601** |Default TTL for file upload notifications. |ISO_8601 interval up to 48H (minimum 1 minute). Default: 1 hour. |
| **fileNotifications.lockDuration** |Lock duration for the file upload notifications queue. |5 to 300 seconds (minimum 5 seconds). Default: 60 seconds. |
| **fileNotifications.maxDeliveryCount** |Maximum delivery count for the file upload notification queue. |1 to 100. Default: 100. |

You can set these properties on your IoT hub using the Azure portal, Azure CLI, or PowerShell. To learn how, see the topics under [Configure file upload](iot-hub-configure-file-upload.md).

## Additional reference material

Other reference topics in the IoT Hub developer guide include:

* [IoT Hub endpoints](iot-hub-devguide-endpoints.md) describes the various IoT hub endpoints for run-time and management operations.

* [Throttling and quotas](iot-hub-devguide-quotas-throttling.md) describes the quotas and throttling behaviors that apply to the IoT Hub service.

* [Azure IoT device and service SDKs](iot-hub-devguide-sdks.md) lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.

* [IoT Hub query language](iot-hub-devguide-query-language.md) describes the query language you can use to retrieve information from IoT Hub about your device twins and jobs.

* [IoT Hub MQTT support](iot-hub-mqtt-support.md) provides more information about IoT Hub support for the MQTT protocol.

## Next steps

Now you've learned how to upload files from devices using IoT Hub, you may be interested in the following IoT Hub developer guide topics:

* [Manage device identities in IoT Hub](iot-hub-devguide-identity-registry.md)

* [Control access to IoT Hub](iot-hub-devguide-security.md)

* [Use device twins to synchronize state and configurations](iot-hub-devguide-device-twins.md)

* [Invoke a direct method on a device](iot-hub-devguide-direct-methods.md)

* [Schedule jobs on multiple devices](iot-hub-devguide-jobs.md)

To try out some of the concepts described in this article, see the following IoT Hub tutorial:

* [How to upload files from devices to the cloud with IoT Hub](iot-hub-csharp-csharp-file-upload.md)
