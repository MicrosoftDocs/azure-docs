---
title: Understand Azure IoT Hub file upload | Microsoft Docs
description: Developer guide - use the file upload feature of IoT Hub to manage uploading files from a device to an Azure storage blob container.
author: robinsh
manager: philmea
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

## File upload overview

IoT Hub exposes device-facing endpoints through which a device can initiate file uploads and send file upload complete notifications to IoT Hub. It exposes a service-facing endpoint through which it notifies backend services of completed file uploads. To learn more, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).

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

## Device: Initialize a file upload

IoT Hub exposes the following REST API that a device calls to initiate a file upload. Each device SDK exposes a method on the device client for this API. When it receives the request, IoT Hub responds with a correlation ID and the elements of a SAS URI that the device can use to authenticate with Azure storage. This response is subject to the throttling limits and per-device upload limits of the target IoT hub. 

**Supported protocols**: AMQP, AMQP-WS, MQTT, MQTT-WS, and HTTPS
**Endpoint**: `{iot hub}.azure-devices.net/devices/{deviceId}/files`
**Method**: POST 

```json
{
    "blobName": "{name of the file for which a SAS URI will be generated}"
}
```

IoT Hub returns the following data, subject to its throttling and per-device upload limits:

```json
{
    "correlationId": "somecorrelationid",
    "hostName": "yourstorageaccount.blob.core.windows.net",
    "containerName": "testcontainer",
    "blobName": "test-device1/image.jpg",
    "sasToken": "1234asdfSAStoken"
}
```

The device:

* Saves the correlation ID to include in the file upload notification when the upload completes. 

* Uses the other properties to construct a SAS URI to authenticate with Azure Storage. The SAS URI is of the following form:

## Device: Notify IoT Hub of a completed file upload (REST)

IoT Hub exposes the following REST API that a device calls when it completes the file upload. Each device SDK exposes a method on the device client for this API. The device should notify IoT Hub regardless of whether the upload succeeds or fails.

**Supported protocols**: AMQP, AMQP-WS, MQTT, MQTT-WS, and HTTPS
**Endpoint**: `{iot hub}.azure-devices.net/devices/{deviceId}/files/notifications`
**Method**: POST 

```json
{
    "correlationId": "{correlation ID received from the initial request}",
    "isSuccess": bool,
    "statusCode": XXX,
    "statusDescription": "Description of status"
}
```

The value of `isSuccess` is a Boolean that indicates whether the file was uploaded successfully. The status code for `statusCode` is the status for the upload of the file to storage, and the `statusDescription` corresponds to the `statusCode`.  

When it receives a file upload complete notification from the device, IoT Hub:

* Triggers a file upload notification to backend services if file upload notifications are configured.

* Releases resources associated with the file upload. Without receiving a notification, IoT Hub will maintain the resources until the SAS URI time-to-live (TTL) expires.

## Service: File upload notifications

If file upload notifications are enabled on your IoT hub, IoT Hub generates a notification message for backend services when a device notifies it that a file upload is complete. This message contains the name and storage location of the file. Your service can use this message to manage uploads. For example, it can trigger its own processing of the blob data, trigger processing of the blob data using other Azure services, or log the file upload notification for later review.

IoT Hub delivers file upload notifications through a service-facing endpoint. The receive semantics for file upload notifications are the same as for cloud-to-device messages and have the same [message life cycle](iot-hub-devguide-messages-c2d.md#the-cloud-to-device-message-life-cycle). The service SDKs expose APIs to handle file upload notifications. 

**Supported protocols** AMQP, AMQP-WS
**Endpoint**: `/messages/servicebound/fileuploadnotifications`

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

## Additional reference material

Other reference topics in the IoT Hub developer guide include:

* [Azure IoT device and service SDKs](iot-hub-devguide-sdks.md) lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.

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
