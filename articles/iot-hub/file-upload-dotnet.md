---
title: Upload files from devices to Azure IoT Hub (.NET)
titleSuffix: Azure IoT Hub
description: How to upload files from a device to the cloud using Azure IoT device SDK for .NET. Uploaded files are stored in an Azure storage blob container.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: how-to
ms.date: 08/24/2021
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

# Upload files from your device to the cloud with Azure IoT Hub (.NET)

[!INCLUDE [iot-hub-file-upload-language-selector](../../includes/iot-hub-file-upload-language-selector.md)]

This article demonstrates how to [file upload capabilities of IoT Hub](iot-hub-devguide-file-upload.md) upload a file to [Azure blob storage](../storage/index.yml), using an Azure IoT .NET device and service SDKs.

The [Send telemetry from a device to an IoT hub](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-csharp) quickstart and [Send cloud-to-device messages with IoT Hub](c2d-messaging-dotnet.md) article show the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub. The [Configure Message Routing with IoT Hub](tutorial-routing.md) article shows a way to reliably store device-to-cloud messages in Microsoft Azure blob storage. However, in some scenarios, you can't easily map the data your devices send into the relatively small device-to-cloud messages that IoT Hub accepts. For example:

* Videos
* Large files that contain images
* Vibration data sampled at high frequency
* Some form of preprocessed data

These files are typically batch processed in the cloud, using tools such as [Azure Data Factory](../data-factory/introduction.md) or the [Hadoop](../hdinsight/index.yml) stack. When you need to upload files from a device, you can still use the security and reliability of IoT Hub. This article shows you how.

At the end of this article, you run two .NET console apps:

* **FileUploadSample**. This device app uploads a file to storage using a SAS URI provided by your IoT hub. This sample is from the Azure IoT C# SDK repository that you download in the prerequisites.

* **ReadFileUploadNotification**. This service app receives file upload notifications from your IoT hub. You create this app.

> [!NOTE]
> IoT Hub supports many device platforms and languages (including C, Java, Python, and JavaScript) through Azure IoT device SDKs. Refer to the [Azure IoT Developer Center](https://azure.microsoft.com/develop/iot) to learn how to connect your device to Azure IoT Hub.

[!INCLUDE [iot-hub-include-x509-ca-signed-file-upload-support-note](../../includes/iot-hub-include-x509-ca-signed-file-upload-support-note.md)]

## Prerequisites

* An IoT hub. Create one with the [CLI](iot-hub-create-using-cli.md) or the [Azure portal](iot-hub-create-through-portal.md).

* A registered device. Register one in the [Azure portal](iot-hub-create-through-portal.md#register-a-new-device-in-the-iot-hub).

* The sample applications you run in this article are written using C# with .NET Core.

  Download the .NET Core SDK for multiple platforms from [.NET](https://dotnet.microsoft.com/download).

  Verify the current version of the .NET Core SDK on your development machine using the following command:

    ```cmd/sh
    dotnet --version
    ```

* Download the Azure IoT C# SDK from [Download sample](https://github.com/Azure/azure-iot-sdk-csharp/archive/main.zip) and extract the ZIP archive.

* Port 8883 should be open in your firewall. The sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

[!INCLUDE [iot-hub-associate-storage](../../includes/iot-hub-include-associate-storage.md)]

## Upload file from a device app

In this article, you use a sample from the Azure IoT C# SDK repository you downloaded earlier as the device app. You can open the files below using Visual Studio, Visual Studio Code, or a text editor of your choice.  

The sample is located at **azure-iot-sdk-csharp/iothub/device/samples/getting started/FileUploadSample** in the folder where you extracted the Azure IoT C# SDK.

Examine the code in **FileUpLoadSample.cs**. This file contains the main sample logic. After creating an IoT Hub device client, it follows the standard three-part procedure for uploading files from a device:

1. The code calls the **GetFileUploadSasUriAsync** method on the device client to get a SAS URI from the IoT hub:

    ```csharp
    var fileUploadSasUriRequest = new FileUploadSasUriRequest
    {
        BlobName = fileName
    };

    // Lines removed for clarity

    FileUploadSasUriResponse sasUri = await _deviceClient.GetFileUploadSasUriAsync(fileUploadSasUriRequest);
    Uri uploadUri = sasUri.GetBlobUri();
    ```

1. The code uses the SAS URI to upload the file to Azure storage. In this sample, it uses the SAS URI to create an Azure storage block blob client and uploads the file:

    ```csharp
    var blockBlobClient = new BlockBlobClient(uploadUri);
    await blockBlobClient.UploadAsync(fileStreamSource, new BlobUploadOptions());
    ```

1. The code notifies the IoT hub that it has completed the upload. This tells the IoT hub that it can release resources associated with the upload (the SAS URI). If file upload notifications are enabled, the IoT hub sends a notification message to backend services.

    ```csharp
    var successfulFileUploadCompletionNotification = new FileUploadCompletionNotification
    {
        // Mandatory. Must be the same value as the correlation id returned in the sas uri response
        CorrelationId = sasUri.CorrelationId,
    
        // Mandatory. Will be present when service client receives this file upload notification
        IsSuccess = true,
    
        // Optional, user defined status code. Will be present when service client receives this file upload notification
        StatusCode = 200,
    
        // Optional, user-defined status description. Will be present when service client receives this file upload notification
        StatusDescription = "Success"
    };
    
    await _deviceClient.CompleteFileUploadAsync(successfulFileUploadCompletionNotification);
    ```

If you examine the **parameter.cs** file, you see that:

- The sample requires you to pass a parameter, *p*, which takes a device connection string. 

- By default, the device sample uses the MQTT protocol to communicate with IoT Hub. You can use the parameter *t* to change this transport protocol. Regardless of this selection, the Azure blob client always uses HTTPS as the protocol to upload the file Azure storage.

## Get the IoT hub connection string

In this article, you create a backend service to receive file upload notification messages from your IoT hub. To receive file upload notification messages, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

[!INCLUDE [iot-hub-include-find-service-connection-string](../../includes/iot-hub-include-find-service-connection-string.md)]

## Receive a file upload notification

In this section, you create a C# console app that receives file upload notification messages from your IoT hub.

1. Open a command window and go to the folder where you want to create the project. Create a folder named **ReadFileUploadNotifications** and change directories to that folder.

    ```cmd/sh
    mkdir ReadFileUploadNotification
    cd ReadFileUploadNotification
    ```

1. Run the following command to create a C# console project. After running the command, the folder will contain a **Program.cs** file and a **ReadFileUploadNotification.csproj** file.

    ```cmd/sh
    dotnet new console --language c#
    ```

1. Run the following command to add the **Microsoft.Azure.Devices** package to the project file. This package is the Azure IoT .NET service SDK.

    ```cmd/sh
    dotnet add package Microsoft.Azure.Devices
    ```

1. Open the **Program.cs** file and add the following statement at the top of the file:

    ```csharp
    using Microsoft.Azure.Devices;
    ```
1. Add the following fields to the **Program** class. Replace the `{iot hub connection string}` placeholder value with the IoT hub connection string that you copied previously in [Get the IoT hub connection string](#get-the-iot-hub-connection-string):

    ```csharp
    static ServiceClient serviceClient;
    static string connectionString = "{iot hub connection string}";
    ```

1. Add the following method to the **Program** class:

    ```csharp
    private async static void ReceiveFileUploadNotificationAsync()
    {
        var notificationReceiver = serviceClient.GetFileNotificationReceiver();
        Console.WriteLine("\nReceiving file upload notification from service");
        while (true)
        {
            var fileUploadNotification = await notificationReceiver.ReceiveAsync();
            if (fileUploadNotification == null) continue;
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("Received file upload notification: {0}", 
              string.Join(", ", fileUploadNotification.BlobName));
            Console.ResetColor();
            await notificationReceiver.CompleteAsync(fileUploadNotification);
        }
    }
    ```

    Note this receive pattern is the same one used to receive cloud-to-device messages from the device app.

1. Finally, replace the lines in the **Main** method with the following:

    ```csharp
    Console.WriteLine("Receive file upload notifications\n");
    serviceClient = ServiceClient.CreateFromConnectionString(connectionString);
    ReceiveFileUploadNotificationAsync();
    Console.WriteLine("Press Enter to exit\n");
    Console.ReadLine();
    ```
    
## Run the applications

Now you're ready to run the applications.

1. First, run the service app to receive file upload notifications from the IoT hub. At your command prompt in the **ReadFileUploadNotification** folder, run the following commands: 

    ```cmd/sh
    dotnet restore
    dotnet run
    ```
    
    The app starts and waits for a file upload notification from your IoT hub:

    ```cmd/sh
    Receive file upload notifications


    Receiving file upload notification from service
    Press Enter to exit
    ```



1. Next, run the device app to upload the file to Azure storage. Open a new command prompt and change folders to the **azure-iot-sdk-csharp\iothub\device\samples\getting started\FileUploadSample** under the folder where you expanded the Azure IoT C# SDK. Run the following commands. Replace the `{Your device connection string}` placeholder value in the second command with the device connection string you saw when you registered a device in the IoT hub.

    ```cmd/sh
    dotnet restore
    dotnet run --p "{Your device connection string}"
    ```
    
    The following output is from the device app after the upload has completed:
    
    ```cmd/sh
      Uploading file TestPayload.txt
      Getting SAS URI from IoT Hub to use when uploading the file...
      Successfully got SAS URI (https://contosostorage.blob.core.windows.net/contosocontainer/MyDevice%2FTestPayload.txt?sv=2018-03-28&sr=b&sig=x0G1Baf%2BAjR%2BTg3nW34zDNKs07p6dLzkxvZ3ZSmjIhw%3D&se=2021-05-04T16%3A40%3A52Z&sp=rw) from IoT Hub
      Uploading file TestPayload.txt using the Azure Storage SDK and the retrieved SAS URI for authentication
      Successfully uploaded the file to Azure Storage
      Notified IoT Hub that the file upload succeeded and that the SAS URI can be freed.
      Time to upload file: 00:00:01.5077954.
      Done.
    ```
    
1. Notice that the service app shows that it has received the file upload notification:

    ```cmd/sh
    Receive file upload notifications
    
    
    Receiving file upload notification from service
    Press Enter to exit
    
    Received file upload notification: myDeviceId/TestPayload.txt
    ```

## Verify the file upload

You can use the portal to view the uploaded file in the storage container you configured:

1. Navigate to your storage account in Azure portal.
1. On the left pane of your storage account, select **Containers**.
1. Select the container you uploaded the file to.
1. Select the folder named after your device.
1. Select the blob that you uploaded your file to. In this article, it's the blob named **TestPayload.txt**.  

    :::image type="content" source="./media/iot-hub-csharp-csharp-file-upload/view-uploaded-file.png" alt-text="Screenshot of selecting the uploaded file in the Azure portal." lightbox="./media/iot-hub-csharp-csharp-file-upload/view-uploaded-file.png":::

1. View the blob properties on the page that opens. You can select **Download** to download the file and view its contents locally.

## Next steps

In this article, you learned how to use the file upload feature of IoT Hub to simplify file uploads from devices. You can continue to explore this feature with the following articles:

* [Overview of file uploads with IoT Hub](iot-hub-devguide-file-upload.md)

* [Configure IoT Hub file uploads](iot-hub-configure-file-upload.md)

* [Azure blob storage documentation](../storage/blobs/storage-blobs-introduction.md)

* [Azure blob storage API reference](../storage/blobs/reference.md)

* [Azure IoT SDKs](iot-hub-devguide-sdks.md)
