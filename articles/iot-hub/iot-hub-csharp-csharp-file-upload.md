---
title: Upload files from devices to Azure IoT Hub with .NET | Microsoft Docs
description: How to upload files from a device to the cloud using Azure IoT device SDK for .NET. Uploaded files are stored in an Azure storage blob container.
author: robinsh
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.devlang: csharp
ms.topic: conceptual
ms.date: 07/18/2021
ms.author: robinsh
ms.custom: "mqtt, devx-track-csharp"
---

# Upload files from your device to the cloud with IoT Hub (.NET)

[!INCLUDE [iot-hub-file-upload-language-selector](../../includes/iot-hub-file-upload-language-selector.md)]

This tutorial shows you how to use the file upload capabilities of IoT Hub by using the .NET file upload sample. 

The [Send telemetry from a device to an IoT hub](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-csharp) quickstart and [Send cloud-to-device messages with IoT Hub](iot-hub-csharp-csharp-c2d.md) tutorial show the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub. The [Configure Message Routing with IoT Hub](tutorial-routing.md) tutorial describes a way to reliably store device-to-cloud messages in Microsoft Azure Blob storage. However, in some scenarios you can't easily map the data your devices send into the relatively small device-to-cloud messages that IoT Hub accepts. For example:

* Large files that contain images

* Videos

* Vibration data sampled at high frequency

* Some form of preprocessed data

These files are typically batch processed in the cloud using tools such as [Azure Data Factory](../data-factory/introduction.md) or the [Hadoop](../hdinsight/index.yml) stack. When you need to upload files from a device, however, you can still use the security and reliability of IoT Hub. This tutorial shows you how.

> [!NOTE]
> IoT Hub supports many device platforms and languages, including C, Java, Python, and JavaScript, through Azure IoT device SDKs. Refer to the [Azure IoT Developer Center](https://azure.microsoft.com/develop/iot) for step-by-step instructions on how to connect your device to Azure IoT Hub.

[!INCLUDE [iot-hub-include-x509-ca-signed-file-upload-support-note](../../includes/iot-hub-include-x509-ca-signed-file-upload-support-note.md)]

## Prerequisites

* Visual Studio Code

* An active Azure account. If you don't have an account, you can create a [free account](https://azure.microsoft.com/pricing/free-trial/) in just a couple of minutes.

* The sample applications you run in this article are written using C#. For the Azure IoT C# samples, we recommend you have the .NET Core SDK 3.1 or greater on your development machine.

    You can download the .NET Core SDK for multiple platforms from [.NET](https://dotnet.microsoft.com/download).

    You can verify the current version of the .NET Core SDK on your development machine using the following command:

    ```cmd/sh
    dotnet --version
    ```

* Download the Azure IoT C# samples from [https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip](https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip) and extract the ZIP archive.

* Make sure that port 8883 is open in your firewall. The sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](iot-hub-mqtt-support.md#connecting-to-iot-hub).

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Register a new device in the IoT hub

[!INCLUDE [iot-hub-include-create-device](../../includes/iot-hub-include-create-device.md)]

[!INCLUDE [iot-hub-associate-storage](../../includes/iot-hub-include-associate-storage.md)]

## Examine the application

In Visual Studio Code, open the *azure-iot-samples-csharp-master\iot-hub\Samples\device\FileUploadSample* folder in your .NET samples download. The folder contains a file named *parameters.cs*. If you open that file, you'll see that the parameter *p* is required and contains the device connection string. You copied and saved this connection string when you registered the device. The parameter *t* can be specified if you want to change the transport protocol. The default protocol is mqtt. The file *program.cs* contains the *main* function. The *FileUploadSample.cs* file contains the primary sample logic. *TestPayload.txt* is the file to be uploaded to your blob container.

## Run the application

Now you are ready to run the application.

1. Open a terminal window in Visual Studio Code.
1. Type the following commands:
    ```cmd/sh
    dotnet restore
    dotnet run --p "{Your device connection string}"
    ```

The output should resemble the following:

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

## Verify the file upload

Perform the following steps to verify that *TestPayload.txt* was uploaded to your container:

1. In the left pane of your storage account, select **Containers** under **Data Storage**.
1. Select to container to which you uploaded *TestPayload.txt*.
1. Select the folder named after your device.
1. Select *TestPayload.txt*.
1. Download the file to view its contents locally.

## Next steps

In this tutorial, you learned how to use the file upload capabilities of IoT Hub to simplify file uploads from devices. You can continue to explore IoT Hub features and scenarios with the following articles:

* [Create an IoT hub programmatically](iot-hub-rm-template-powershell.md)

* [Introduction to C SDK](iot-hub-device-sdk-c-intro.md)

* [Azure IoT SDKs](iot-hub-devguide-sdks.md)

To further explore the capabilities of IoT Hub, see:

* [Deploying AI to edge devices with Azure IoT Edge](../iot-edge/quickstart-linux.md)