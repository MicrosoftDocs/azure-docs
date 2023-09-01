---
title: Understand Azure IoT Hub file upload
description: This article shows how to use the file upload feature of IoT Hub to manage uploading files from a device to an Azure storage blob container.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 12/30/2022
ms.custom: [mqtt, 'Role: Cloud Development', 'Role: IoT Device']
---

# Upload files with IoT Hub

There are many scenarios where you can't easily map your device data into the relatively small device-to-cloud messages that IoT Hub accepts. For example, sending large media files like video; or, sending large telemetry batches, either uploaded by intermittently connected devices or aggregated and compressed to save bandwidth.

When you need to upload large files from a device, you can still use the security and reliability of IoT Hub. Instead of brokering messages through itself, however, IoT Hub acts as a dispatcher to an associated Azure storage account. IoT Hub can also provide notification to backend services when a device completes a file upload.

If you need help with deciding when to use reported properties, device-to-cloud messages, or file uploads, see [Device-to-cloud communications guidance](iot-hub-devguide-d2c-guidance.md).

[!INCLUDE [iot-hub-include-x509-ca-signed-file-upload-support-note](../../includes/iot-hub-include-x509-ca-signed-file-upload-support-note.md)]

## File upload overview

An IoT hub facilitates file uploads from connected devices by providing them with shared access signature (SAS) URIs on a per-upload basis for a blob container and Azure storage account that have been pre-configured with the hub. There are three parts to using file uploads with IoT Hub: pre-configuring an Azure storage account and blob container on your IoT hub, uploading files from devices, and, optionally, notifying backend services of completed file uploads.

Before you can use the file upload feature, you must associate an [Azure storage account](../storage/common/storage-account-overview.md) and [blob container](../storage/blobs/storage-blobs-introduction.md) with your IoT hub. You can also configure settings that control how IoT Hub authenticates with Azure storage, the time-to-live (TTL) of the SAS URIs that the IoT hub hands out to devices, and file upload notifications to your backend services. To learn more, see [Associate an Azure storage account with IoT Hub](#associate-an-azure-storage-account-with-iot-hub).

Devices follow a three-step process to upload a file to the associated blob container:

1. The device initiates the file upload with the IoT hub. It passes the name of a blob in the request and gets a SAS URI and a correlation ID in return. The SAS URI contains a SAS token for Azure storage that grants the device read-write permission on the requested blob in the blob container. For more information, see [Device: Initialize a file upload](#device-initialize-a-file-upload).

1. The device uses the SAS URI to securely call Azure blob storage APIs to upload the file to the blob container. For more information, see [Device: Upload file using Azure storage APIs](#device-upload-file-using-azure-storage-apis).

1. When the file upload is complete, the device notifies the IoT hub of the completion status using the correlation ID it received from IoT Hub when it initiated the upload. For more information, see [Device: Notify IoT Hub of a completed file upload](#device-notify-iot-hub-of-a-completed-file-upload).

Backend services can subscribe to file upload notifications on the IoT hub's service-facing file upload notification endpoint. If you've enabled these notifications on your IoT hub, it delivers them on this endpoint whenever a device notifies the hub that it has completed a file upload. Services can use these notifications to trigger further processing of the blob data. For more information, see [Service: File upload notifications](#service-file-upload-notifications).

File upload is fully supported by the Azure IoT device and service SDKs. For more information, see [File upload using an SDK](#file-upload-using-an-sdk).

### File upload quotas and limits

IoT Hub imposes throttling limits on the number of file uploads that it can initiate in a given period. The threshold is based on the SKU and number of units of your IoT hub. Additionally, each device is limited to 10 concurrent active file uploads at a time. For more information, see [IoT Hub quotas and throttling](iot-hub-devguide-quotas-throttling.md).

## Associate an Azure storage account with IoT Hub

You must associate an Azure storage account and  blob container with your IoT hub to use file upload features. All file uploads from devices registered with your IoT hub will go to this container. To configure a storage account and blob container on your IoT hub, see [Configure IoT Hub file uploads using the Azure portal](iot-hub-configure-file-upload.md), [Configure IoT Hub file uploads using Azure CLI](iot-hub-configure-file-upload-cli.md), or [Configure IoT Hub file uploads using PowerShell](iot-hub-configure-file-upload-powershell.md). You can also use the IoT Hub management APIs to configure file uploads programmatically.

If you use the portal, you can create a storage account and container during configuration. Otherwise, to create a storage account, see [Create a storage account](../storage/common/storage-account-create.md) in the Azure storage documentation. Once you have a storage account, you can see how to create a blob container in the [Azure Blob Storage quickstarts](../storage/blobs/storage-quickstart-blobs-portal.md). By default, Azure IoT Hub uses key-based authentication to connect and authorize with Azure Storage. You can also configure user-assigned or system-assigned managed identities to authenticate Azure IoT Hub with Azure Storage. Managed identities provide Azure services with an automatically managed identity in Azure AD in a secure manner. To learn how to configure managed identities, see the [Configure file upload with managed identities](iot-hub-managed-identity.md#configure-file-upload-with-managed-identities) section of [IoT Hub support for managed identities](iot-hub-managed-identity.md).

File upload is subject to [Azure Storage's firewall settings](../storage/common/storage-network-security.md). Based on your authentication configuration, you'll need to ensure your devices can communicate with Azure storage.

There are several other settings that control the behavior of file uploads and file upload notifications. The following sections list all of the settings available. Depending on whether you use the Azure portal, Azure CLI, PowerShell, or the management APIs to configure file uploads, some of these settings may not be available. Make sure to set the **enableFileUploadNotifications** setting if you want notifications sent to your backend services when a file upload completes.

### Iot Hub storage and authentication settings

The following settings associate a storage account and container with your IoT hub and control how your hub authenticates with Azure storage. These settings don't affect how devices authenticate with Azure storage. Devices always authenticate with the SAS token presented in the SAS URI retrieved from IoT Hub.

| Property | Description | Range and default |
| --- | --- | --- |
| **storageEndpoints.$default.authenticationType** | Controls how the IoT Hub authenticates with Azure storage. | Possible values are keyBased and identityBased. Default: keyBased. |
| **storageEndpoints.$default.connectionString** | The connection string to the Azure storage account to use for file uploads. | Default: Empty string. |
| **storageEndpoints.$default.containerName** | The name of the container to upload files to. | Default: Empty string. |
| **storageEndpoints.$default.identity** | The managed identity to use for identity-based authentication. | Possible values are `[system]` for the system-assigned managed identity or a resource ID for a user-assigned managed identity. The value isn't used for key-based authentication. Default: null. |

### File upload settings

The following settings control file uploads from the device.

| Property | Description | Range and default |
| --- | --- | --- |
| **storageEndpoints.$default.ttlAsIso8601** | Default TTL for SAS URIs generated by IoT Hub. | ISO_8601 interval up to 48 hours (minimum one minute). Default: one hour. |

### File upload notification settings

The following settings control file upload notifications to backend services.

| Property | Description | Range and default |
| --- | --- | --- |
| **enableFileUploadNotifications** |Controls whether file upload notifications are written to the file notifications endpoint. |Bool. Default: False. |
| **fileNotifications.ttlAsIso8601** |Default TTL for file upload notifications. |ISO_8601 interval up to 48 hours (minimum one minute). Default: one hour. |
| **fileNotifications.lockDuration** |Lock duration for the file upload notifications queue. |5 to 300 seconds. Default: 60 seconds. |
| **fileNotifications.maxDeliveryCount** |Maximum delivery count for the file upload notification queue. |1 to 100. Default: 10. |

## File upload using an SDK

The following how-to guides provide complete, step-by-step instructions to upload files using the Azure IoT device and service SDKs. The guides show you how to use the Azure portal to associate a storage account with an IoT hub. The guides also contain code snippets or refer to samples that guide you through an upload.

| How-to guide | Device SDK example | Service SDK example |
|---------|--------|---------|
| [.NET](./file-upload-dotnet.md) | Yes | Yes |
| [Java](./file-upload-java.md) | Yes | Yes |
| [Node.js](./file-upload-node.md) | Yes | Yes |
| [Python](./file-upload-python.md) | Yes | No (not supported) |

> [!NOTE]
> The C device SDK uses a single call on the device client to perform file uploads. For more information, see [IoTHubDeviceClient_UploadToBlobAsync()](https://github.com/Azure/azure-iot-sdk-c/blob/main/iothub_client/inc/iothub_device_client.h#L328) and [IoTHubDeviceClient_UploadMultipleBlocksToBlobAsync()](https://github.com/Azure/azure-iot-sdk-c/blob/main/iothub_client/inc/iothub_device_client.h#L350). These functions perform all aspects of the file upload in a single call: initiating the upload, uploading the file to Azure storage, and notifying IoT Hub when it completes. This interaction means that, in addition to whatever protocol the device is using to communicate with IoT Hub, the device also needs to be able to communicate over HTTPS with Azure storage as these functions make calls to the Azure storage APIs.

## Device: Initialize a file upload

The device calls the [Create File Upload SAS URI](/rest/api/iothub/device/create-file-upload-sas-uri) REST API or the equivalent API in one of the device SDKs to initiate a file upload.

**Supported protocols**: HTTPS <br/>
**Endpoint**: {iot hub}.azure-devices.net/devices/{deviceId}/files <br/>
**Method**: POST

```json
{
    "blobName":"myfile.txt"
}

```

| Property | Description |
|----------|-------------|
| blobName | The name of the blob to generate the SAS URI for. |

 IoT Hub responds with a correlation ID and the elements of a SAS URI that the device can use to authenticate with Azure storage. This response is subject to the throttling limits and per-device upload limits of the target IoT hub.

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
| blobName | The location where the blob will be stored in the container. The name is in the following format: `{device ID of the device making the request}/{blobName in the request}` |
| sasToken | A SAS token that grants read-write access on the blob with Azure storage. The token is generated and signed by IoT Hub. |

When it receives the response, the device:

* Saves the correlation ID to include in the file upload complete notification to IoT hub when it completes the upload.

* Uses the other properties to construct a SAS URI for the blob that it uses to authenticate with Azure storage. The SAS URI contains the resource URI for the requested blob and the SAS token. It takes following form: `https://{hostName}/{containerName}/{blobName}{sasToken}` (The `sasToken` property in the response contains a leading '?' character.) The braces aren't included.

    For example, for the values returned in the previous sample, the SAS URI is, `https://contosostorageaccount.blob.core.windows.net/device-upload-container/mydevice/myfile.txt?sv=2018-03-28&sr=b&sig=mBLiODhpKXBs0y9RVzwk1S...l1X9qAfDuyg%3D&se=2021-07-30T06%3A11%3A10Z&sp=rw`

    For more information about the SAS URI and SAS token, see [Create a service SAS](/rest/api/storageservices/create-service-sas) in the Azure storage documentation.

## Device: Upload file using Azure storage APIs

The device uses the [Azure Blob Storage REST APIs](/rest/api/storageservices/blob-service-rest-api) or equivalent Azure storage SDK APIs to upload the file to the blob in Azure storage.

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

Working with Azure storage APIs is beyond the scope of this article. In addition to the Azure Blob storage REST APIs linked previously in this section, you can explore the following documentation to help you get started:

* To learn more about working with blobs in Azure storage, see the [Azure Blob Storage documentation](../storage/blobs/index.yml).

* For information about using Azure storage client SDKs to upload blobs, see [Azure Blob Storage API reference](../storage/blobs/reference.md).  

## Device: Notify IoT Hub of a completed file upload

The device calls the [Update File Upload Status](/rest/api/iothub/device/update-file-upload-status) REST API or the equivalent API in one of the device SDKs when it completes the file upload. The device should update the file upload status with IoT Hub regardless of whether the upload succeeds or fails.

**Supported protocols**: HTTPS <br/>
**Endpoint**: {iot hub}.azure-devices.net/devices/{deviceId}/files/notifications <br/>
**Method**: POST 

```json
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
| statusCode | An integer that represents the status code of the file upload. Typically three digits; for example, 200 or 201. |
| statusDescription | A description of the file upload status. |

When it receives a file upload complete notification from the device, IoT Hub:

* Triggers a file upload notification to backend services if file upload notifications are configured.

* Releases resources associated with the file upload. If IoT Hub doesn't receive a notification, it will maintain the resources until the SAS URI time-to-live (TTL) associated with the upload expires.

## Service: File upload notifications

If file upload notifications are enabled on your IoT hub, your hub generates a notification message for backend services when it receives notification from a device that a file upload is complete. IoT Hub delivers these file upload notifications through a service-facing endpoint. The receive semantics for file upload notifications are the same as for cloud-to-device messages and have the same [message life cycle](iot-hub-devguide-messages-c2d.md#the-cloud-to-device-message-life-cycle). The service SDKs expose APIs to handle file upload notifications.

**Supported protocols** AMQP, AMQP-WS <br/>
**Endpoint**: {iot hub}.azure-devices.net/messages/servicebound/fileuploadnotifications <br/>
**Method** GET

Each message retrieved from the file upload notification endpoint is a JSON record:

```json
{
    "deviceId":"mydevice",
    "blobUri":"https://contosostorageaccount.blob.core.windows.net/device-upload-container/mydevice/myfile.txt",
    "blobName":"mydevice/myfile.txt",
    "lastUpdatedTime":"2021-07-31T00:26:50+00:00",
    "blobSizeInBytes":11,
    "enqueuedTimeUtc":"2021-07-31T00:26:51.5134008Z"
}
```

| Property | Description |
| --- | --- |
| enqueuedTimeUtc | Timestamp indicating when the notification was created. |
| deviceId | The Device ID of the device that uploaded the file. |
| blobUri | The URI of the uploaded file. |
| blobName | The name of the uploaded file. The name is in the following format: `{device ID of the device}/{name of the blob}`|
| lastUpdatedTime |Timestamp indicating when the file was last updated. |
| blobSizeInBytes | An integer that represents the size of the uploaded file in bytes. |

Services can use notifications to manage uploads. For example, they can trigger their own processing of the blob data, trigger processing of the blob data using other Azure services, or log the file upload notification for later review.

## Next steps

* [File upload how-to guides](./file-upload-dotnet.md)

* [How to configure file uploads on IoT Hub](iot-hub-configure-file-upload.md)

* [How to configure managed identities on IoT Hub](iot-hub-managed-identity.md)

* [Azure Blob Storage documentation](../storage/blobs/index.yml)

* [Azure IoT device and service SDKs](iot-hub-devguide-sdks.md) lists the various language SDKs you can use when you develop both device and service apps that interact with IoT Hub.
