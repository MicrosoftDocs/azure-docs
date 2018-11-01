---
title: Understand Azure IoT Hub file upload | Microsoft Docs
description: Developer guide - use the file upload feature of IoT Hub to manage uploading files from a device to an Azure storage blob container.
author: dominicbetts
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 08/08/2017
ms.author: dobett
---

# Upload files with IoT Hub

As detailed in the [IoT Hub endpoints](iot-hub-devguide-endpoints.md) article, a device can initiate a file upload by sending a notification through a device-facing endpoint (**/devices/{deviceId}/files**). When a device notifies IoT Hub that an upload is complete, IoT Hub sends a file upload notification message through the **/messages/servicebound/filenotifications** service-facing endpoint.

Instead of brokering messages through IoT Hub itself, IoT Hub instead acts as a dispatcher to an associated Azure Storage account. A device requests a storage token from IoT Hub that is specific to the file the device wishes to upload. The device uses the SAS URI to upload the file to storage, and when the upload is complete the device sends a notification of completion to IoT Hub. IoT Hub checks the file upload is complete and then adds a file upload notification message to the service-facing file notification endpoint.

Before you upload a file to IoT Hub from a device, you must configure your hub by [associating an Azure Storage](iot-hub-devguide-file-upload.md#associate-an-azure-storage-account-with-iot-hub) account to it.

Your device can then [initialize an upload](iot-hub-devguide-file-upload.md#initialize-a-file-upload) and then [notify IoT hub](iot-hub-devguide-file-upload.md#notify-iot-hub-of-a-completed-file-upload) when the upload completes. Optionally, when a device notifies IoT Hub that the upload is complete, the service can generate a [notification message](iot-hub-devguide-file-upload.md#file-upload-notifications).

### When to use

Use file upload to send media files and large telemetry batches uploaded by intermittently connected devices or compressed to save bandwidth.

Refer to [Device-to-cloud communication guidance](iot-hub-devguide-d2c-guidance.md) if in doubt between using reported properties, device-to-cloud messages, or file upload.

## Associate an Azure Storage account with IoT Hub

To use the file upload functionality, you must first link an Azure Storage account to the IoT Hub. You can complete this task either through the [Azure portal](https://portal.azure.com), or programmatically through the [IoT Hub resource provider REST APIs](/rest/api/iothub/iothubresource). Once you have associated an Azure Storage account with your IoT Hub, the service returns a SAS URI to a device when the device initiates a file upload request.

> [!NOTE]
> The [Azure IoT SDKs](iot-hub-devguide-sdks.md) automatically handle retrieving the SAS URI, uploading the file, and notifying IoT Hub of a completed upload.


## Initialize a file upload
IoT Hub has an endpoint specifically for devices to request a SAS URI for storage to upload a file. To initiate the file upload process, the device sends a POST request to `{iot hub}.azure-devices.net/devices/{deviceId}/files` with the following JSON body:

```json
{
    "blobName": "{name of the file for which a SAS URI will be generated}"
}
```

IoT Hub returns the following data, which the device uses to upload the file:

```json
{
    "correlationId": "somecorrelationid",
    "hostName": "contoso.azure-devices.net",
    "containerName": "testcontainer",
    "blobName": "test-device1/image.jpg",
    "sasToken": "1234asdfSAStoken"
}
```

### Deprecated: initialize a file upload with a GET

> [!NOTE]
> This section describes deprecated functionality for how to receive a SAS URI from IoT Hub. Use the POST method described previously.

IoT Hub has two REST endpoints to support file upload, one to get the SAS URI for storage and the other to notify the IoT hub of a completed upload. The device initiates the file upload process by sending a GET to the IoT hub at `{iot hub}.azure-devices.net/devices/{deviceId}/files/{filename}`. The IoT hub returns:

* A SAS URI specific to the file to be uploaded.

* A correlation ID to be used once the upload is completed.

## Notify IoT Hub of a completed file upload

The device is responsible for uploading the file to storage using the Azure Storage SDKs. When the upload is complete, the device sends a POST request to `{iot hub}.azure-devices.net/devices/{deviceId}/files/notifications` with the following JSON body:

```json
{
    "correlationId": "{correlation ID received from the initial request}",
    "isSuccess": bool,
    "statusCode": XXX,
    "statusDescription": "Description of status"
}
```

The value of `isSuccess` is a Boolean representing whether the file was uploaded successfully. The status code for `statusCode` is the status for the upload of the file to storage, and the `statusDescription` corresponds to the `statusCode`.

## Reference topics:

The following reference topics provide you with more information about uploading files from a device.

## File upload notifications

Optionally, when a device notifies IoT Hub that an upload is complete, IoT Hub generates a notification message that contains the name and storage location of the file.

As explained in [Endpoints](iot-hub-devguide-endpoints.md), IoT Hub delivers file upload notifications through a service-facing endpoint (**/messages/servicebound/fileuploadnotifications**) as messages. The receive semantics for file upload notifications are the same as for cloud-to-device messages and have the same [message lifecycle](iot-hub-devguide-messages-c2d.md#the-cloud-to-device-message-lifecycle). Each message retrieved from the file upload notification endpoint is a JSON record with the following properties:

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

## File upload notification configuration options

Each IoT hub exposes the following configuration options for file upload notifications:

| Property | Description | Range and default |
| --- | --- | --- |
| **enableFileUploadNotifications** |Controls whether file upload notifications are written to the file notifications endpoint. |Bool. Default: True. |
| **fileNotifications.ttlAsIso8601** |Default TTL for file upload notifications. |ISO_8601 interval up to 48H (minimum 1 minute). Default: 1 hour. |
| **fileNotifications.lockDuration** |Lock duration for the file upload notifications queue. |5 to 300 seconds (minimum 5 seconds). Default: 60 seconds. |
| **fileNotifications.maxDeliveryCount** |Maximum delivery count for the file upload notification queue. |1 to 100. Default: 100. |

## Additional reference material

Other reference topics in the IoT Hub developer guide include:

* [IoT Hub endpoints](iot-hub-devguide-endpoints.md) describes the various endpoints that each IoT hub exposes for run-time and management operations.

* [Throttling and quotas](iot-hub-devguide-quotas-throttling.md) describes the quotas and throttling behaviors that apply to the IoT Hub service.

* [Azure IoT device and service SDKs](iot-hub-devguide-sdks.md) lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.

* [IoT Hub query language](iot-hub-devguide-query-language.md) describes the query language you can use to retrieve information from IoT Hub about your device twins and jobs.

* [IoT Hub MQTT support](iot-hub-mqtt-support.md) provides more information about IoT Hub support for the MQTT protocol.

## Next steps

Now you have learned how to upload files from devices using IoT Hub, you may be interested in the following IoT Hub developer guide topics:

* [Manage device identities in IoT Hub](iot-hub-devguide-identity-registry.md)

* [Control access to IoT Hub](iot-hub-devguide-security.md)

* [Use device twins to synchronize state and configurations](iot-hub-devguide-device-twins.md)

* [Invoke a direct method on a device](iot-hub-devguide-direct-methods.md)

* [Schedule jobs on multiple devices](iot-hub-devguide-jobs.md)

To try out some of the concepts described in this article, see the following IoT Hub tutorial:

* [How to upload files from devices to the cloud with IoT Hub](iot-hub-csharp-csharp-file-upload.md)