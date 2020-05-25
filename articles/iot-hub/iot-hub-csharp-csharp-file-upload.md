---
title: Upload files from devices to Azure IoT Hub with .NET | Microsoft Docs
description: How to upload files from a device to the cloud using Azure IoT device SDK for .NET. Uploaded files are stored in an Azure storage blob container.
author: robinsh
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.devlang: csharp
ms.topic: conceptual
ms.date: 07/04/2017
ms.author: robinsh
ms.custom: mqtt
---

# Upload files from your device to the cloud with IoT Hub (.NET)

[!INCLUDE [iot-hub-file-upload-language-selector](../../includes/iot-hub-file-upload-language-selector.md)]

This tutorial builds on the code in the [Send cloud-to-device messages with IoT Hub](iot-hub-csharp-csharp-c2d.md) tutorial to show you how to use the file upload capabilities of IoT Hub. It shows you how to:

* Securely provide a device with an Azure blob URI for uploading a file.

* Use the IoT Hub file upload notifications to trigger processing the file in your app back end.

The [Send telemetry from a device to an IoT hub](quickstart-send-telemetry-dotnet.md) quickstart and [Send cloud-to-device messages with IoT Hub](iot-hub-csharp-csharp-c2d.md) tutorial show the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub. The [Configure Message Routing with IoT Hub](tutorial-routing.md) tutorial describes a way to reliably store device-to-cloud messages in Microsoft Azure Blob storage. However, in some scenarios you can't easily map the data your devices send into the relatively small device-to-cloud messages that IoT Hub accepts. For example:

* Large files that contain images

* Videos

* Vibration data sampled at high frequency

* Some form of preprocessed data

These files are typically batch processed in the cloud using tools such as [Azure Data Factory](../data-factory/introduction.md) or the [Hadoop](../hdinsight/index.yml) stack. When you need to upload files from a device, you can still use the security and reliability of IoT Hub.

At the end of this tutorial you run two .NET console apps:

* **SimulatedDevice**. This app uploads a file to storage using a SAS URI provided by your IoT hub. It is a modified version of the app created in the [Send cloud-to-device messages with IoT Hub](iot-hub-csharp-csharp-c2d.md) tutorial.

* **ReadFileUploadNotification**. This app receives file upload notifications from your IoT hub.

> [!NOTE]
> IoT Hub supports many device platforms and languages, including C, Java, Python, and Javascript, through Azure IoT device SDKs. Refer to the [Azure IoT Developer Center](https://azure.microsoft.com/develop/iot) for step-by-step instructions on how to connect your device to Azure IoT Hub.

## Prerequisites

* Visual Studio

* An active Azure account. If you don't have an account, you can create a [free account](https://azure.microsoft.com/pricing/free-trial/) in just a couple of minutes.

* Make sure that port 8883 is open in your firewall. The device sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](iot-hub-mqtt-support.md#connecting-to-iot-hub).

[!INCLUDE [iot-hub-associate-storage](../../includes/iot-hub-associate-storage.md)]

## Upload a file from a device app

In this section, you modify the device app you created in [Send cloud-to-device messages with IoT Hub](iot-hub-csharp-csharp-c2d.md) to receive cloud-to-device messages from the IoT hub.

1. In Visual Studio Solution Explorer, right-click the **SimulatedDevice** project, and select **Add** > **Existing Item**. Find an image file and include it in your project. This tutorial assumes the image is named `image.jpg`.

1. Right-click the image, and then select **Properties**. Make sure that **Copy to Output Directory** is set to **Copy always**.

    ![Show where to update the image property for Copy to Output Directory](./media/iot-hub-csharp-csharp-file-upload/image-properties.png)

1. In the **Program.cs** file, add the following statements at the top of the file:

    ```csharp
    using System.IO;
    ```

1. Add the following method to the **Program** class:

    ```csharp
    private static async void SendToBlobAsync()
    {
        string fileName = "image.jpg";
        Console.WriteLine("Uploading file: {0}", fileName);
        var watch = System.Diagnostics.Stopwatch.StartNew();

        using (var sourceData = new FileStream(@"image.jpg", FileMode.Open))
        {
            await deviceClient.UploadToBlobAsync(fileName, sourceData);
        }

        watch.Stop();
        Console.WriteLine("Time to upload file: {0}ms\n", watch.ElapsedMilliseconds);
    }
    ```

    The `UploadToBlobAsync` method takes in the file name and stream source of the file to be uploaded and handles the upload to storage. The console app displays the time it takes to upload the file.

1. Add the following line in the **Main** method, right before `Console.ReadLine()`:

    ```csharp
    SendToBlobAsync();
    ```

> [!NOTE]
> For simplicity's sake, this tutorial does not implement any retry policy. In production code, you should implement retry policies, such as exponential backoff, as suggested in [Transient fault handling](/azure/architecture/best-practices/transient-faults).

## Get the IoT hub connection string

In this article, you create a back-end service to receive file upload notification messages from the IoT hub you created in [Send telemetry from a device to an IoT hub](quickstart-send-telemetry-dotnet.md). To receive file upload notification messages, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

[!INCLUDE [iot-hub-include-find-service-connection-string](../../includes/iot-hub-include-find-service-connection-string.md)]

## Receive a file upload notification

In this section, you write a .NET console app that receives file upload notification messages from IoT Hub.

1. In the current Visual Studio solution, select **File** > **New** > **Project**. In **Create a new project**, select **Console App (.NET Framework)**, and then select **Next**.

1. Name the project *ReadFileUploadNotification*. Under **Solution**, select **Add to solution**. Select **Create** to create the project.

    ![Configure the ReadFileUploadNotification project in Visual Studio](./media/iot-hub-csharp-csharp-file-upload/read-file-upload-project-configure.png)

1. In Solution Explorer, right-click the **ReadFileUploadNotification** project, and select **Manage NuGet Packages**.

1. In **NuGet Package Manager**, select **Browse**. Search for and select **Microsoft.Azure.Devices**, and then select **Install**.

    This step downloads, installs, and adds a reference to the [Azure IoT service SDK NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Devices/) in the **ReadFileUploadNotification** project.

1. In the **Program.cs** file for this project, add the following statement at the top of the file:

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

1. Finally, add the following lines to the **Main** method:

    ```csharp
    Console.WriteLine("Receive file upload notifications\n");
    serviceClient = ServiceClient.CreateFromConnectionString(connectionString);
    ReceiveFileUploadNotificationAsync();
    Console.WriteLine("Press Enter to exit\n");
    Console.ReadLine();
    ```

## Run the applications

Now you are ready to run the applications.

1. In Solutions Explorer, right-click your solution, and select **Set StartUp Projects**.

1. In **Common Properties** > **Startup Project**, select **Multiple startup projects**, then select the **Start** action for **ReadFileUploadNotification** and **SimulatedDevice**. Select **OK** to save your changes.

1. Press **F5**. Both applications should start. You should see the upload completed in one console app and the upload notification message received by the other console app. You can use the [Azure portal](https://portal.azure.com/) or Visual Studio Server Explorer to check for the presence of the uploaded file in your Azure Storage account.

    ![Screenshot showing the output screen](./media/iot-hub-csharp-csharp-file-upload/run-apps1.png)

## Next steps

In this tutorial, you learned how to use the file upload capabilities of IoT Hub to simplify file uploads from devices. You can continue to explore IoT Hub features and scenarios with the following articles:

* [Create an IoT hub programmatically](iot-hub-rm-template-powershell.md)

* [Introduction to C SDK](iot-hub-device-sdk-c-intro.md)

* [Azure IoT SDKs](iot-hub-devguide-sdks.md)

To further explore the capabilities of IoT Hub, see:

* [Deploying AI to edge devices with Azure IoT Edge](../iot-edge/tutorial-simulate-device-linux.md)
