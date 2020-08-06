---
title: Upload files to Azure IoT Central | Microsoft Docs
description: How to configure file uploads from your devices to your Azure IoT Central application. After you've configured file uploads, implement file uploads on your devices.
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 08/06/2020
ms.topic: how-to
ms.service: iot-central
---

# Upload files from your devices to your IoT Central application

*This topic applies to administrators and device developers.*

IoT Central lets you media and other files from connected devices to cloud storage. You configure the file upload capability in your IoT Central application, and then implement file uploads in your device code.

## Prerequisites

You must be an administrator in your IoT Central application to configure file uploads.

You need an Azure storage account and container to store the uploaded files. If you don't have an existing storage account and container to use, create a [new storage account in the Azure portal](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM).

## Configure device file uploads

To configure device file uploads:

1. Navigate to the **Administration** section in your application.

1. Select **Device file upload**.

1. Select the storage account and container to use. If the storage account is in a different Azure subscription from your application, enter a storage account  connection string.

1. If necessary, adjust the upload timeout that sets how long an upload request remains valid for. Valid values are from 1 to 24 hours.

1. Select **Save**. When the status shows **Configured**, you're ready to upload files from devices.

:::image type="content" source="media/howto-configure-file-uploads/file-upload-configuration.png" alt-text="Configure file upload in application":::

## Disable device file uploads

If you want to disable device file uploads to your IoT Central application:

1. Navigate to the **Administration** section in your application.

1. Select **Device file upload**.

1. Select **Delete**.

## Upload a file from a device

IoT Central uses IoT Hub's file upload capability to enable devices to upload files. The following Python code snippets show you how to upload a file from a device.

Import the required packages:

```python
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
```

Add a function that uploads a file to blob storage:

```python
async def store_blob(blob_info, file_name):
  try:
    sas_url = "https://{}/{}/{}{}".format(
      blob_info["hostName"],
      blob_info["containerName"],
      blob_info["blobName"],
      blob_info["sasToken"]
    )
    print("\nUploading file: {} to Azure Storage as blob: {} in container {}\n".
          format(file_name, blob_info["blobName"], blob_info["containerName"]))

    # Upload the specified file
    with BlobClient.from_blob_url(sas_url) as blob_client:
      with open(file_name, "rb") as f:
        result = blob_client.upload_blob(f, overwrite=True)
        return (True, result)
    except FileNotFoundError as ex:
      # Catch file not found and add an HTTP status code
      # to return in notification to IoT Hub.
      ex.status_code = 404
      return (False, ex)
    except AzureError as ex:
      # catch Azure errors that might result from the upload operation
      return (False, ex)
```

Your device uses this function to upload a file. For example:

```python
async def main():
  try:
    print ("IoT Hub file upload sample, press Ctrl-C to exit")

    conn_str = CONNECTION_STRING
    file_name= PATH_TO_FILE
    blob_name = os.path.basename(file_name)
    device_client = IoTHubDeviceClient.create_from_connection_string(conn_str)

    # Connect the client
    await device_client.connect()

    # Get the storage info for the blob
    storage_info = await device_client.get_storage_info_for_blob(blob_name)

    # Upload to blob
    success, result = await store_blob(storage_info, file_name)
    if success == True:
      print("Upload succeeded. Result is: \n")
      print(result)
      print()

      await device_client.notify_blob_upload_status(
        storage_info["correlationId"], True, 200, "OK: {}".format(file_name)
      )

    else:
      # If the upload was not successful, the result is the exception object
      print("Upload failed. Exception is: \n")
      print(result)
      print()

      await device_client.notify_blob_upload_status(
        storage_info["correlationId"], False, result.status_code, str(result)
      )

  except Exception as ex:
    print("\nException:")
    print(ex)
  except KeyboardInterrupt:
    print("\nIoTHubDeviceClient sample stopped" )

  finally:
    # Finally, disconnect the client
    await device_client.disconnect()

if __name__ == "__main__":
  asyncio.run(main())
```

Uploaded files are stored in the storage account you configured for file upload using the following name format: `{container name}/{deviceId}/{filename.ext}`

> [!NOTE]
> Currently, there are no notification capabilities in IoT Central to let you know when a device has finished uploading a file.

## Next steps

Now that you know how to configure and implement device file uploads in IoT Central, a suggested next step is to learn more device file uploads:

- [Upload files from your device to the cloud with IoT Hub (.NET)](../../iot-hub/iot-hub-csharp-csharp-file-upload.md)
- [Upload files from your device to the cloud with IoT Hub (Java)](../../iot-hub/iot-hub-java-java-file-upload.md)
- [Upload files from your device to the cloud with IoT Hub (Node.js)](../../iot-hub/iot-hub-node-node-file-upload.md)
- [Upload files from your device to the cloud with IoT Hub (Python)](../../iot-hub/iot-hub-python-python-file-upload.md)
