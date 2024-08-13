---
title: Upload files from devices to Azure IoT Hub (Python)
titleSuffix: Azure IoT Hub
description: How to upload files from a device to the cloud using Azure IoT device SDK for Python. Uploaded files are stored in an Azure storage blob container.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: python
ms.topic: how-to
ms.date: 07/01/2024
ms.custom: mqtt, devx-track-python, py-fresh-zinc
---

## Install packages

The azure-iot-device library must be installed before calling any related code.

```cmd/sh
pip install azure-iot-device
```

The [azure.storage.blob](https://pypi.org/project/azure-storage-blob/) package is used to perform the file upload.

```cmd/sh
pip install azure.storage.blob
```

## Upload file from a device application

This section describes how to upload a file from a device to an IoT hub using the [IoTHubDeviceClient](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient) class from the Azure IoT SDK for Python.

Follow this procedure to upload a file from a device to IoT hub:

1. Connect to the device
1. Get Blob Storage information
1. Upload the file to Blob Storage
1. Notify IoT hub of upload status

### Import libraries

```python
import os
from azure.iot.device import IoTHubDeviceClient
from azure.core.exceptions import AzureError
from azure.storage.blob import BlobClient
```

### Connect to the device

To connect to the device:

1. Call [create_from_connection_string](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-create-from-connection-string) to add the device primary connection string.

1. Call [connect](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-connect) to connect the device client.

For example:

```python
# Add your IoT hub primary connection string
CONNECTION_STRING = "{Device primary connection string}"
device_client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)

# Connect the client
device_client.connect()
```

### Get Blob Storage information

Call [get_storage_info_for_blob](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-get-storage-info-for-blob) to get information from an IoT hub about a linked Azure Storage account. This information includes the hostname, container name, blob name, and a SAS token. The `get_storage_info_for_blob` method also returns a `correlation_id`, which is used in the `notify_blob_upload_status` method. The `correlation_id` is IoT Hub's way of marking which Blob you're working on.

```python
# Get the storage info for the blob
PATH_TO_FILE = "{Full path to local file}"
blob_name = os.path.basename(PATH_TO_FILE)
blob_info = device_client.get_storage_info_for_blob(blob_name)
```

### Upload a file into Blob Storage

To upload a file into Blob Storage:

1. Use [from_blob_url](/python/api/azure-storage-blob/azure.storage.blob.blobclient?#azure-storage-blob-blobclient-from-blob-url) to create a [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient?#azure-storage-blob-blobclient-from-blob-url) object from a blob URL.
1. Call [upload_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient?#azure-storage-blob-blobclient-upload-blob) to upload the file into the Blob Storage.

This example parses the `blob_info` structure to create a URL that it uses to initialize an [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient). Then it calls `upload_blob` to upload the file into Blob Storage.

```python
try:
    sas_url = "https://{}/{}/{}{}".format(
        blob_info["hostName"],
        blob_info["containerName"],
        blob_info["blobName"],
        blob_info["sasToken"]
    )

    print("\nUploading file: {} to Azure Storage as blob: {} in container {}\n".format(file_name, blob_info["blobName"], blob_info["containerName"]))

    # Upload the specified file
    with BlobClient.from_blob_url(sas_url) as blob_client:
        with open(file_name, "rb") as f:
            result = blob_client.upload_blob(f, overwrite=True)
            return (True, result)

except FileNotFoundError as ex:
    # catch file not found and add an HTTP status code to return in notification to IoT hub
    ex.status_code = 404
    return (False, ex)

except AzureError as ex:
    # catch Azure errors that might result from the upload operation
    return (False, ex)
```

### Notify IoT hub of upload status

Use [notify_blob_upload_status](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-notify-blob-upload-status) to notify IoT hub of the status of the Blob Storage operation. Pass the `correlation_id` obtained by the `get_storage_info_for_blob` method. The `correlation_id` is used by IoT hub to notify any service that might be listening for a notification regarding the status of the file upload task.

This example notifies IoT hub of a successful file upload:

```python
device_client.notify_blob_upload_status(storage_info["correlationId"], True, 200, "OK: {}".format(PATH_TO_FILE)
```

### Shut down the device client

Shut down the client. Once this method is called, any attempt at further client calls result in a [ClientError](/python/api/azure-iot-device/azure.iot.device.exceptions.clienterror) being raised.

```python
device_client.shutdown()
```

### SDK file upload samples

The SDK includes two file upload samples:

* [Upload to blob](https://github.com/Azure/azure-iot-sdk-python/blob/main/samples/async-hub-scenarios/upload_to_blob.py)
* [Upload to blob using an X.509 certificate](https://github.com/Azure/azure-iot-sdk-python/blob/main/samples/async-hub-scenarios/upload_to_blob_x509.py)
