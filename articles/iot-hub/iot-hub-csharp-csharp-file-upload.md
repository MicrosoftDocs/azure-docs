---
title: Upload files from devices using Azure IoT Hub | Microsoft Docs
description: How to upload files from a device to the cloud using Azure IoT device SDK for .NET. Uploaded files are stored in an Azure storage blob container.
services: iot-hub
documentationcenter: .net
author: fsautomata
manager: timlt
editor: ''

ms.assetid: 4759d229-f856-4526-abda-414f8b00a56d
ms.service: iot-hub
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/08/2017
ms.author: elioda

---
# Upload files from your simulated device to the cloud with IoT Hub
## Introduction
Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of devices and a solution back end. The ([Get started with IoT Hub] and [Send Cloud-to-Device messages with IoT Hub]) tutorials show the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub. The [Process Device-to-Cloud messages] tutorial describes a way to reliably store device-to-cloud messages in Azure blob storage. However, in some scenarios you cannot easily map the data your devices send into the relatively small device-to-cloud messages that IoT Hub accepts. For example, large files that contain images, videos, vibration data sampled at high frequency, or some form of preprocessed data. These files are typically batch processed in the cloud using tools such as [Azure Data Factory] or the [Hadoop] stack. When file uploads from a device are preferred to sending events, you can still use IoT Hub security and reliability functionality.

This tutorial builds on the code in the [Send Cloud-to-Device messages with IoT Hub] tutorial to show you how to use the file upload capabilities of IoT Hub. It shows you how to:

- Securely provide a device with an Azure blob URI for uploading a file.
- Use the IoT Hub file upload notifications to trigger processing the file in your app back end.

At the end of this tutorial you run two .NET console apps:

* **SimulatedDevice**, a modified version of the app created in the [Send Cloud-to-Device messages with IoT Hub] tutorial. This app uploads a file to storage using a SAS URI provided by your IoT hub.
* **ReadFileUploadNotification**, which receives file upload notifications from your IoT hub.

> [!NOTE]
> IoT Hub supports many device platforms and languages (including C, Java, and Javascript) through Azure IoT device SDKs. Refer to the [Azure IoT Developer Center] for step-by-step instructions on how to connect your device to Azure IoT Hub.
> 
> 

To complete this tutorial, you need the following:

* Visual Studio 2015 or Visual Studio 2017
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

## Associate an Azure Storage account to IoT Hub
Because the simulated device app uploads a file to a blob, you must have an [Azure Storage] account associated to IoT Hub. When you associate an Azure Storage account with an IoT hub, the IoT hub generates a SAS URI. A device can use this SAS URI to securely upload a file to a blob container. The IoT Hub service and the device SDKs coordinate the process that generates the SAS URI and makes it available to a device to use to upload a file.

Follow the instructions in [Configure file uploads using the Azure portal][lnk-configure-upload] to associate an Azure Storage account to your IoT hub. Make sure that a blob container is associated with your IoT hub and the file notifications are enabled. 
   
![Enable File Notifications in portal][3]


## Upload a file from a simulated device app
In this section, you modify the simulated device app you created in [Send Cloud-to-Device messages with IoT Hub] to receive cloud-to-device messages from the IoT hub.

1. In Visual Studio, right-click the **SimulatedDevice** project, click **Add**, and then click **Existing Item**. Navigate to an image file and include it in your project. This tutorial assumes the image is named `image.jpg`.
2. Right-click on the image, and then click **Properties**. Make sure that **Copy to Output Directory** is set to **Copy always**.
   
    ![][1]
3. In the **Program.cs** file, add the following statements at the top of the file:
   
        using System.IO;
4. Add the following method to the **Program** class:
   
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
   
    The `UploadToBlobAsync` method takes in the file name and stream source of the file to be uploaded and handles the upload to storage. The console app displays the time it takes to upload the file.
5. Add the following method in the **Main** method, right before the `Console.ReadLine()` line:
   
        SendToBlobAsync();

> [!NOTE]
> For simplicity's sake, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as exponential backoff), as suggested in the MSDN article [Transient Fault Handling].
> 
> 

## Receive a file upload notification
In this section, you write a .NET console app that receives file upload notification messages from IoT Hub.

1. In the current Visual Studio solution, create a Visual C# Windows project by using the **Console Application** project template. Name the project **ReadFileUploadNotification**.
   
    ![New project in Visual Studio][2]
2. In Solution Explorer, right-click the **ReadFileUploadNotification** project, and then click **Manage NuGet Packages...**.
       
3. In the **NuGet Package Manager** window, search for **Microsoft.Azure.Devices**, click **Install**, and accept the terms of use. 
   
    This action downloads, installs, and adds a reference to the [Azure IoT service SDK NuGet package] in the **ReadFileUploadNotification** project.

4. In the **Program.cs** file, add the following statements at the top of the file:
   
        using Microsoft.Azure.Devices;
5. Add the following fields to the **Program** class. Substitute the placeholder value with the IoT hub connection string from [Get started with IoT Hub]:
   
        static ServiceClient serviceClient;
        static string connectionString = "{iot hub connection string}";
6. Add the following method to the **Program** class:
   
        private async static Task ReceiveFileUploadNotificationAsync()
        {
            var notificationReceiver = serviceClient.GetFileNotificationReceiver();
   
            Console.WriteLine("\nReceiving file upload notification from service");
            while (true)
            {
                var fileUploadNotification = await notificationReceiver.ReceiveAsync();
                if (fileUploadNotification == null) continue;
   
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("Received file upload noticiation: {0}", string.Join(", ", fileUploadNotification.BlobName));
                Console.ResetColor();
   
                await notificationReceiver.CompleteAsync(fileUploadNotification);
            }
        }
   
    Note this receive pattern is the same one used to receive cloud-to-device messages from the device app.
7. Finally, add the following lines to the **Main** method:
   
        Console.WriteLine("Receive file upload notifications\n");
        serviceClient = ServiceClient.CreateFromConnectionString(connectionString);
        ReceiveFileUploadNotificationAsync().Wait();
        Console.ReadLine();

## Run the applications
Now you are ready to run the applications.

1. In Visual Studio, right-click your solution, and select **Set StartUp projects**. Select **Multiple startup projects**, then select the **Start** action for **ReadFileUploadNotification** and **SimulatedDevice**.
2. Press **F5**. Both applications should start. You should see the upload completed in one console app and the upload notification message received by the other console app. You can use the [Azure portal] or Visual Studio Server Explorer to check for the presence of the uploaded file in your Azure Storage account.
   
   ![][50]

## Next steps
In this tutorial, you learned how to use the file upload capabilities of IoT Hub to simplify file uploads from devices. You can continue to explore IoT hub features and scenarios with the following articles:

* [Create an IoT hub programmatically][lnk-create-hub]
* [Introduction to C SDK][lnk-c-sdk]
* [Azure IoT SDKs][lnk-sdks]

To further explore the capabilities of IoT Hub, see:

* [Simulating a device with IoT Edge][lnk-iotedge]

<!-- Images. -->

[50]: ./media/iot-hub-csharp-csharp-file-upload/run-apps1.png
[1]: ./media/iot-hub-csharp-csharp-file-upload/image-properties.png
[2]: ./media/iot-hub-csharp-csharp-file-upload/file-upload-project-csharp1.png
[3]: ./media/iot-hub-csharp-csharp-file-upload/enable-file-notifications.png

<!-- Links -->

[Azure portal]: https://portal.azure.com/

[Azure Data Factory]: https://azure.microsoft.com/documentation/services/data-factory/
[Hadoop]: https://azure.microsoft.com/documentation/services/hdinsight/

[Send Cloud-to-Device messages with IoT Hub]: iot-hub-csharp-csharp-c2d.md
[Process Device-to-Cloud messages]: iot-hub-csharp-csharp-process-d2c.md
[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md
[Azure IoT Developer Center]: http://www.azure.com/develop/iot

[Transient Fault Handling]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[Azure Storage]: ../storage/storage-create-storage-account.md#create-a-storage-account
[lnk-configure-upload]: iot-hub-configure-file-upload.md
[Azure IoT service SDK NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.Devices/
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[lnk-create-hub]: iot-hub-rm-template-powershell.md
[lnk-c-sdk]: iot-hub-device-sdk-c-intro.md
[lnk-sdks]: iot-hub-devguide-sdks.md

[lnk-iotedge]: iot-hub-windows-iot-edge-simulated-device.md


