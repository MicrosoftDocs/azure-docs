<properties
	pageTitle="Upload files from devices using IoT Hub | Microsoft Azure"
	description="Follow this tutorial to learn how to upload files from devices using Azure IoT Hub with C#."
	services="iot-hub"
	documentationCenter=".net"
	authors="fsautomata"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="dotnet"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="06/20/2016"
     ms.author="elioda"/>

# Tutorial: How to upload files from devices to the cloud with IoT Hub

## Introduction

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back end. Previous tutorials ([Get started with IoT Hub] and [Send Cloud-to-Device messages with IoT Hub]) illustrate the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub, and how to access them from devices and cloud components. [Process Device-to-Cloud messages] described a way to reliably store device-to-cloud messages in Azure blob storage. There are cases, however, where the data coming from devices does not map easily to relatively small device-to-cloud messages. Some examples are large files containing images, videos, vibration data sample at high frequency, or containing some form of preprocessed data. These files are usually processed in a batch fashion using tools such as [Azure Data Factory] or the [Hadoop] stack. When uploading a file from a device is preferred to sending events, it is possible to use IoT Hub security and reliability functionality.

This tutorial builds on the code presented in [Send Cloud-to-Device messages with IoT Hub] to show how to use the file upload capabilities of IoT Hub to securely provide to the device an Azure blob URI to be used to upload the file, and how to use the IoT Hub file upload notifications to trigger the processing of the file from your app back end.

At the end of this tutorial you will run two Windows console applications:

* **SimulatedDevice**, a modified version of the app created in [Send Cloud-to-Device messages with IoT Hub], which uploads a file to storage via a SAS URI provided by your IoT hub.
* **ReadFileUploadNotification**, which receives file upload notifications from your IoT hub.

> [AZURE.NOTE] IoT Hub has SDK support for many device platforms and languages (including C, Java, and Javascript) though Azure IoT device SDKs. Refer to the [Azure IoT Developer Center] for step by step instructions on how to connect your device to this tutorial's code, and generally to Azure IoT Hub. Azure IoT service SDKs for Java and Node are coming soon.

In order to complete this tutorial you'll need the following:

+ Microsoft Visual Studio 2015,

+ An active Azure account. <br/>If you don't have an account, you can create a free account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fiot%2Ftutorials%2Ffile-upload%2F target="_blank").

[AZURE.INCLUDE [iot-hub-file-upload-device-csharp](../../includes/iot-hub-file-upload-device-csharp.md)]


[AZURE.INCLUDE [iot-hub-file-upload-cloud-csharp](../../includes/iot-hub-file-upload-cloud-csharp.md)]

## Run the applications

Now you are ready to run the applications.

1. From within Visual Studio, right-click your solution, and select **Set StartUp projects...**. Select **Multiple startup projects**, then select the **Start** action for **ReadFileUploadNotification** and **SimulatedDevice**.

2. Press **F5**. Both applications should start. You should see the upload completed in one console app and the upload notification message being received by the other console app. You can use the [Azure portal] or Visual Studio Server Explorer to check the presence of the file in your storage account.

  ![][50]


## Next steps

In this tutorial, you learned how to leverage the file upload capabilities of IoT Hub to simplify file uploads from devices. You can continue explore IoT hub features and scenarios with the following tutorial:

- [Process Device-to-Cloud messages], shows how to reliably process telemetry and interactive messages coming from devices.

Additional information on IoT Hub:

* [IoT Hub Overview]
* [IoT Hub Developer Guide]
* [IoT Hub Guidance]
* [Supported device platforms and languages][Supported devices]
* [Azure IoT Developer Center]

<!-- Images. -->

[50]: ./media/iot-hub-csharp-csharp-file-upload/run-apps1.png

<!-- Links -->

[Send Cloud-to-Device messages with IoT Hub]: iot-hub-csharp-csharp-c2d.md

[Azure portal]: https://portal.azure.com/

[Azure Data Factory]: https://azure.microsoft.com/documentation/services/data-factory/
[Hadoop]: https://azure.microsoft.com/documentation/services/hdinsight/

[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md
[Send Cloud-to-Device messages with IoT Hub]: iot-hub-csharp-csharp-c2d.md
[Process Device-to-Cloud messages]: iot-hub-csharp-csharp-process-d2c.md
[Uploading files from devices]: iot-hub-csharp-csharp-file-upload.md

[IoT Hub Overview]: iot-hub-what-is-iot-hub.md
[IoT Hub Guidance]: iot-hub-guidance.md
[IoT Hub Developer Guide]: iot-hub-devguide.md
[IoT Hub Supported Devices]: iot-hub-supported-devices.md
[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md
[Supported devices]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/tested_configurations.md
[Azure IoT Developer Center]: http://www.azure.com/develop/iot
