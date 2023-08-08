---
title: Upload files from devices to Azure IoT Hub (Python)
titleSuffix: Azure IoT Hub
description: How to upload files from a device to the cloud using Azure IoT device SDK for Python. Uploaded files are stored in an Azure storage blob container.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: python
ms.topic: how-to
ms.date: 12/28/2022
ms.custom: mqtt, devx-track-python, py-fresh-zinc
---

# Upload files from your device to the cloud with Azure IoT Hub (Python)

[!INCLUDE [iot-hub-file-upload-language-selector](../../includes/iot-hub-file-upload-language-selector.md)]

This article demonstrates how to [file upload capabilities of IoT Hub](iot-hub-devguide-file-upload.md) upload a file to [Azure blob storage](../storage/index.yml), using Python.

The [Send telemetry from a device to an IoT hub](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-python) quickstart and [Send cloud-to-device messages with IoT Hub](c2d-messaging-python.md) articles show the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub. The [Configure Message Routing with IoT Hub](tutorial-routing.md) tutorial shows a way to reliably store device-to-cloud messages in Microsoft Azure blob storage. However, in some scenarios, you can't easily map the data your devices send into the relatively small device-to-cloud messages that IoT Hub accepts. For example:

* Videos
* Large files that contain images
* Vibration data sampled at high frequency
* Some form of pre-processed data.

These files are typically batch processed in the cloud, using tools such as [Azure Data Factory](../data-factory/introduction.md) or the [Hadoop](../hdinsight/index.yml) stack. When you need to upload files from a device, you can still use the security and reliability of IoT Hub. This article shows you how.

At the end of this article, you run the Python console app **FileUpload.py**, which uploads a file to storage using the Python Device SDK.

> [!NOTE]
> IoT Hub supports many device platforms and languages (including C, Java, Python, and JavaScript) through Azure IoT device SDKs. Refer to the [Azure IoT Developer Center](https://azure.microsoft.com/develop/iot) to learn how to connect your device to Azure IoT Hub.

[!INCLUDE [iot-hub-include-x509-ca-signed-file-upload-support-note](../../includes/iot-hub-include-x509-ca-signed-file-upload-support-note.md)]

## Prerequisites

* An active Azure account. (If you don't have an account, you can create a [free account](https://azure.microsoft.com/pricing/free-trial/) in just a couple of minutes.)

* An IoT hub. Create one with the [CLI](iot-hub-create-using-cli.md) or the [Azure portal](iot-hub-create-through-portal.md).

* A registered device. Register one in the [Azure portal](iot-hub-create-through-portal.md#register-a-new-device-in-the-iot-hub).

* [Python version 3.7 or later](https://www.python.org/downloads/) is recommended. Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable.

* Port 8883 should be open in your firewall. The device sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

[!INCLUDE [iot-hub-associate-storage](../../includes/iot-hub-include-associate-storage.md)]

## Upload a file from a device app

In this section, you create the device app to upload a file to IoT hub.

1. At your command prompt, run the following command to install the **azure-iot-device** package. You use this package to coordinate the file upload with your IoT hub.

    ```cmd/sh
    pip install azure-iot-device
    ```

1. At your command prompt, run the following command to install the [**azure.storage.blob**](https://pypi.org/project/azure-storage-blob/) package. You use this package to perform the file upload.

    ```cmd/sh
    pip install azure.storage.blob
    ```

1. Create a test file that you'll upload to blob storage.

1. Using a text editor, create a **FileUpload.py** file in your working folder.

1. Add the following `import` statements and variables at the start of the **FileUpload.py** file.

    ```python
    import os
    from azure.iot.device import IoTHubDeviceClient
    from azure.core.exceptions import AzureError
    from azure.storage.blob import BlobClient

    CONNECTION_STRING = "[Device Connection String]"
    PATH_TO_FILE = r"[Full path to local file]"
    ```

1. In your file, replace `[Device Connection String]` with the connection string of your IoT hub device. Replace `[Full path to local file]` with the path to the test file that you created or any file on your device that you want to upload.

1. Create a function to upload the file to blob storage:

    ```python
    def store_blob(blob_info, file_name):
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
            # catch file not found and add an HTTP status code to return in notification to IoT Hub
            ex.status_code = 404
            return (False, ex)

        except AzureError as ex:
            # catch Azure errors that might result from the upload operation
            return (False, ex)
    ```

    This function parses the *blob_info* structure passed into it to create a URL that it uses to initialize an [azure.storage.blob.BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient). Then it uploads your file to Azure blob storage using this client.

1. Add the following code to connect the client and upload the file:

    ```python
    def run_sample(device_client):
        # Connect the client
        device_client.connect()

        # Get the storage info for the blob
        blob_name = os.path.basename(PATH_TO_FILE)
        storage_info = device_client.get_storage_info_for_blob(blob_name)

        # Upload to blob
        success, result = store_blob(storage_info, PATH_TO_FILE)

        if success == True:
            print("Upload succeeded. Result is: \n") 
            print(result)
            print()

            device_client.notify_blob_upload_status(
                storage_info["correlationId"], True, 200, "OK: {}".format(PATH_TO_FILE)
            )

        else :
            # If the upload was not successful, the result is the exception object
            print("Upload failed. Exception is: \n") 
            print(result)
            print()

            device_client.notify_blob_upload_status(
                storage_info["correlationId"], False, result.status_code, str(result)
            )

    def main():
        device_client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)

        try:
            print ("IoT Hub file upload sample, press Ctrl-C to exit")
            run_sample(device_client)
        except KeyboardInterrupt:
            print ("IoTHubDeviceClient sample stopped")
        finally:
            # Graceful exit
            device_client.shutdown()


    if __name__ == "__main__":
        main()
    ```

    This code creates an **IoTHubDeviceClient** and uses the following APIs to manage the file upload with your IoT hub:

    * **get_storage_info_for_blob** gets information from your IoT hub about the linked Storage Account you created previously. This information includes the hostname, container name, blob name, and a SAS token. The storage info is passed to the **store_blob** function (created in the previous step), so the **BlobClient** in that function can authenticate with Azure storage. The **get_storage_info_for_blob** method also returns a correlation_id, which is used in the **notify_blob_upload_status** method. The correlation_id is IoT Hub's way of marking which blob you're working on.

    * **notify_blob_upload_status** notifies IoT Hub of the status of your blob storage operation. You pass it the correlation_id obtained by the **get_storage_info_for_blob** method. It's used by IoT Hub to notify any service that might be listening for a notification on the status of the file upload task.

1. Save and close the **FileUpload.py** file.

## Run the application

Now you're ready to run the application.

1. At a command prompt in your working folder, run the following command:

    ```cmd/sh
    python FileUpload.py
    ```

2. The following screenshot shows the output from the **FileUpload** app:

    :::image type="content" source="./media/iot-hub-python-python-file-upload/run-device-app.png" alt-text="Screenshot showing output from running the FileUpload app." border="true" lightbox="./media/iot-hub-python-python-file-upload/run-device-app.png":::

3. You can use the portal to view the uploaded file in the storage container you configured:

    :::image type="content" source="./media/iot-hub-python-python-file-upload/view-blob.png" alt-text="Screenshot of the container in the Azure portal that shows the uploaded file." border="true" lightbox="./media/iot-hub-python-python-file-upload/view-blob.png":::

## Next steps

In this article, you learned how to use the file upload feature of IoT Hub to simplify file uploads from devices. You can continue to explore this feature with the following articles:

* [Create an IoT hub programmatically](iot-hub-rm-template-powershell.md)

* [Azure IoT SDKs](iot-hub-devguide-sdks.md)

Learn more about Azure Blob Storage with the following links:

* [Azure Blob Storage documentation](../storage/blobs/index.yml)

* [Azure Blob Storage for Python API documentation](/python/api/overview/azure/storage-blob-readme)