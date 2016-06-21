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
     ms.date="06/21/2016"
     ms.author="elioda"/>

# Tutorial: How to upload files from devices to the cloud with IoT Hub

## Introduction

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back end. Previous tutorials ([Get started with IoT Hub] and [Send Cloud-to-Device messages with IoT Hub]) illustrate the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub, and the [Process Device-to-Cloud messages] tutorial describes a way to reliably store device-to-cloud messages in Azure blob storage. However, in some scenarios you cannot easily map the data your devices send into the relatively small device-to-cloud messages that IoT Hub accepts. Examples include large files that contain images, videos, vibration data sampled at high frequency, or that contain some form of preprocessed data. These files are typically batch processed in the cloud using tools such as [Azure Data Factory] or the [Hadoop] stack. When file uploads from a device are preferred to sending events, you can still use IoT Hub security and reliability functionality.

This tutorial builds on the code in the [Send Cloud-to-Device messages with IoT Hub] tutorial to show you how to use the file upload capabilities of IoT Hub. It shows you how to securely provide a device with an Azure blob URI for uploading a file, and how to use the IoT Hub file upload notifications to trigger processing the file in your app back end.

At the end of this tutorial you run two Windows console applications:

* **SimulatedDevice**, a modified version of the app created in the [Send Cloud-to-Device messages with IoT Hub] tutorial, which uploads a file to storage using a SAS URI provided by your IoT hub.
* **ReadFileUploadNotification**, which receives file upload notifications from your IoT hub.

> [AZURE.NOTE] IoT Hub supports many device platforms and languages (including C, Java, and Javascript) through Azure IoT device SDKs. Refer to the [Azure IoT Developer Center] for step by step instructions on how to connect your device to the code shown in this tutorial, and generally to Azure IoT Hub.

In order to complete this tutorial you need the following:

+ Microsoft Visual Studio 2015,

+ An active Azure account. <br/>If you don't have an account, you can create a free account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fiot%2Ftutorials%2Ffile-upload%2F target="_blank").

[AZURE.INCLUDE [iot-hub-file-upload-device-csharp](../../includes/iot-hub-file-upload-device-csharp.md)]


[AZURE.INCLUDE [iot-hub-file-upload-cloud-csharp](../../includes/iot-hub-file-upload-cloud-csharp.md)]

## Run the applications

Now you are ready to run the applications.

1. In Visual Studio, right-click your solution, and select **Set StartUp projects**. Select **Multiple startup projects**, then select the **Start** action for **ReadFileUploadNotification** and **SimulatedDevice**.

2. Press **F5**. Both applications should start. You should see the upload completed in one console app and the upload notification message being received by the other console app. You can use the [Azure portal] or Visual Studio Server Explorer to check for the presence of the uploaded file in your storage account.

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
