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
     ms.date="09/29/2015"
     ms.author="elioda"/>

# Tutorial: How to upload files from devices to the cloud with IoT Hub

## Introduction

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back end. Previous tutorials ([Get started with IoT Hub] and [Send Cloud-to-Device messages with IoT Hub]) illustrate the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub, and how to access them from devices and cloud components. [Process Device-to-Cloud messages] described a way to reliably store device-to-cloud messages in Azure blob storage. There are cases, however, where the data coming from devices does not map easily to relatively small device-to-cloud messages. Some exmaples are large files containing images, videos, vibration data sample at high frequency, or containing some form of preprocessed data. These files are usually processed in a batch fashion using tools such as [Azure Data Factory] or the [Hadoop] stack. When uploading a file from a device is preferred to sending events, it is still possible to use IoT Hub security and reliability functionality.

This tutorial builds on the code presented in [Send Cloud-to-Device messages with IoT Hub] to show how to use cloud-to-device messages to securely provide to the device an Azure blob URI to be used to upload the file, and how to use IoT Hub delivery acknowledgments to trigger the processing of the file from your app back-end. The advantages of this approach is the reuse of IoT Hub device identity, and of the delivery acknowledgment of cloud-to-device messages to inform the app back-end that the file has been uploaded successfully.

> [AZURE.NOTE] The same approach used here can be used to securely have devices download files from the cloud.

You can find more information on cloud-to-device messages and IoT Hub security in the [IoT Hub Developer Guide].

At the end of this tutorial you will run two Windows console applications:

* **SimulatedDevice**, a modified version of the app created in [Send Cloud-to-Device messages with IoT Hub], which connects to your IoT hub, receives cloud-to-device messages containing Azure blob URIs. For each cloud-to-device message received, it triggers a file upload to the specified blob URI.
* **SendCloudToDevice**, which builds an Azure blob URI (as explained in [Create and Use a SAS with the Blob Service](../storage/storage-dotnet-shared-access-signature-part-2.md), sends it in a cloud-to-device message to the simulated device through IoT Hub, and then receives its delivery aknowledgment.

> [AZURE.NOTE] IoT Hub has SDK support for many device platforms and languages (including C, Java, and Javascript) though Azure IoT device SDKs. Refer to the [Azure IoT Developer Center] for step by step instructions on how to connect your device to this tutorial's code, and generally to Azure IoT Hub. Azure IoT service SDKs for Java and Node are coming soon.

In order to complete this tutorial you'll need the following:

+ Microsoft Visual Studio 2015,

+ An active Azure account. <br/>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fiot%2Ftutorials%2Ffile-upload%2F target="_blank").


[AZURE.INCLUDE [iot-hub-file-upload-cloud-csharp](../../includes/iot-hub-file-upload-cloud-csharp.md)]


[AZURE.INCLUDE [iot-hub-file-upload-device-csharp](../../includes/iot-hub-file-upload-device-csharp.md)]

## Run the applications

Now you are ready to run the applications.

1.  From within Visual Studio, right click your solution and select **Set StartUp projects...**. Select **Multiple startup projects**, then select the **Start** action for both **SimulatedDevice**, and **SendCloudToDevice** apps.

2.  Press **F5**, and you should see all applications start. Select the **SendCloudToDevice** window and press a key. You will see the simulated device output a message when it has uploaded the file, and the **SendCloudToDevice** app show the successful feedback receipt. You can use the [Azure Preview Portal] or Visual Studio Server Explorer to check the presence of the file in your storage account.

  ![][50]


## Next steps

In this tutorial, you learned how to leverage cloud-to-device messages to simplify file uploads from devices. You can continue explore IoT hub features and scenarios with the following tutorial:

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

[Azure Preview Portal]: https://portal.azure.com/

[Azure Data Factory]: https://azure.microsoft.com/en-us/documentation/services/data-factory/
[Hadoop]: https://azure.microsoft.com/en-us/documentation/services/hdinsight/

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
