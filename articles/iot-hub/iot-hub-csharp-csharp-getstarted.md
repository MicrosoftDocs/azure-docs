<properties
	pageTitle="Get Started with IoT Hub | Microsoft Azure"
	description="Follow this tutorial to get started using Azure IoT Hub with C#."
	services="iot-hub"
	documentationCenter=".net"
	authors="fsautomata"
	manager="kevinmil"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="csharp"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="tbd"
     ms.date="09/29/2015"
     ms.author="elioda"/>

# Get started with IoT Hub

## Introduction

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back end. One of the biggest challenges facing IoT projects is how to reliably and securely connect devices to the application back end. To simplify this scenario, Azure IoT Hub offers reliable device-to-cloud and cloud-to-device hyper-scale messaging, enables secure communications using per-device security credentials and access control, and includes device libraries for the most popular languages and platforms.

This tutorial shows how to use the Azure portal to create an IoT hub. It also shows you how to create a device identity in your IoT hub, create a simulated device that sends device-to-cloud messages, and receives these messages from your cloud back-end.

At the end of this tutorial you will have created three Windows console applications:

* **CreateDeviceIdentity**, which creates a device identity and associated security key to connect your simulated device,
* **ReadDeviceToCloudMessages**, which reads device-to-cloud messages and displays their content, and
* **SimulatedDevice**, which connects to your IoT hub with the device identity created earlier, and sends a device-to-cloud message every second.

> [AZURE.NOTE] IoT Hub has SDK support for many device platforms and languages (including C, Java, and Javascript) though Azure IoT device SDKs. Refer to the [Azure IoT Developer Center] for step by step instructions on how to connect your device to this tutorial's code, and generally to Azure IoT Hub. Azure IoT service SDKs for Java and Node are coming soon.

In order to complete this tutorial you'll need the following:

+ Microsoft Visual Studio 2015,

+ An active Azure account. <br/>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fiot%2Ftutorials%2Fgetstarted%2F target="_blank").

## Create an IoT hub

1. Log on to the [Azure Preview Portal].

2. In the jumpbar, click **New**, then click **Internet of Things**, and then click **IoT Hub**.

   	![][1]

3. In the **New IoT Hub** blade, specify the desired configuration for the IoT Hub.

   	![][2]

    * In the **Name** box, enter a name to identify your IoT hub. When the **Name** is validated, a green check mark appears in the **Name** box.
    * Change the **Pricing and scale tier** as desired. This tutorial does not require a specific tier.
    * In the **Resource group** box, create a new resource group, or select and existing one. For more information, see [Using resource groups to manage your Azure resources](resource-group-portal.md).
    * Use **Location** to specify the geographic location in which to host your IoT hub.  


4. Once the new IoT hub options are configured, click **Create**.  It can take a few minutes for the IoT hub to be created.  To check the status, you can monitor the progress on the Startboard. Or, you can monitor your progress from the Notifications section.

    ![][3]


5. After the IoT hub has been created successfully, open the blade of the new IoT hub, take note of the URI, and select the **Key** icon on the top.

   	![][4]

6. Select the Shared access policy called **iothubowner**, then copy and take note of the connection string on the right blade.

   	![][5]

Your IoT hub is now created, and you have the URI and connection string you need to complete this tutorial.

[AZURE.INCLUDE [iot-hub-get-started-cloud-csharp](../../includes/iot-hub-get-started-cloud-csharp.md)]


[AZURE.INCLUDE [iot-hub-get-started-device-csharp](../../includes/iot-hub-get-started-device-csharp.md)]

## Run the applications

Now you are ready to run the applications.

1.	From within Visual Studio, right click your solution and select **Set StartUp projects...**. Select **Multiple startup projects**, then select the **Start** action for both **ProcessDeviceToCloudMessages** and **SimulatedDevice** apps.

   	![][41]

2.	Press **F5**, and you should see both application start, and the messages being sent by the simulated app, and received by the processor app.

   	![][42]

## Next steps

In this tutorial, you set up a new IoT hub, created a device identity in the hub's identity registry, and used this identity to program a simulated device that sends device-to-cloud messages. You can continue to explore IoT hub features and scenario with the following tutorials:

- [Send Cloud-to-Device messages with IoT Hub], shows how to send messages to devices, and process the delivery feedback produced by IoT Hub.
- [Process Device-to-Cloud messages], shows how to reliably process telemetry and interactive messages coming from devices.
- [Uploading files from devices], describes a pattern that makes use of cloud-to-device messages to facilitate file uploads from devices.

Additional information on IoT Hub:

* [IoT Hub Overview]
* [IoT Hub Developer Guide]
* [IoT Hub Guidance]
* [Supported device platforms and languages][Supported devices]
* [Azure IoT Developer Center]

<!-- Images. -->
[1]: ./media/iot-hub-csharp-csharp-getstarted/create-iot-hub1.png
[2]: ./media/iot-hub-csharp-csharp-getstarted/create-iot-hub2.png
[3]: ./media/iot-hub-csharp-csharp-getstarted/create-iot-hub3.png
[4]: ./media/iot-hub-csharp-csharp-getstarted/create-iot-hub4.png
[5]: ./media/iot-hub-csharp-csharp-getstarted/create-iot-hub5.png

[41]: ./media/iot-hub-csharp-csharp-getstarted/run-apps1.png
[42]: ./media/iot-hub-csharp-csharp-getstarted/run-apps2.png

<!-- Links -->
[Azure Preview Portal]: https://portal.azure.com/

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
