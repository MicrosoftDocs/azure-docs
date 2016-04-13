<properties
	pageTitle="Send cloud-to-device messages with IoT Hub | Microsoft Azure"
	description="Follow this tutorial to learn how to send cloud-to-device messages using Azure IoT Hub with C#."
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
     ms.date="02/03/2016"
     ms.author="elioda"/>

# Tutorial: How to send cloud-to-device messages with IoT Hub

## Introduction

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back end. The [Get started with IoT Hub] tutorial shows how to create an IoT hub, provision a device identity in it, and code a simulated device that sends device-to-cloud messages.

This tutorial builds on [Get started with IoT Hub] and shows how to send cloud-to-device messages to a single device, how to request delivery acknowledgement (*feedback*) from IoT Hub, and receive it from your application cloud back end.

You can find more information on cloud-to-device messages in the [IoT Hub Developer Guide][IoT Hub Developer Guide - C2D].

At the end of this tutorial you will run two Windows console applications:

* **SimulatedDevice**, a modified version of the app created in [Get started with IoT Hub], which connects to your IoT hub and receives cloud-to-device messages.
* **SendCloudToDevice**, which sends a cloud-to-device message to the simulated device through IoT Hub, and then receives its delivery aknowledgment.

> [AZURE.NOTE] IoT Hub has SDK support for many device platforms and languages (including C, Java, and Javascript) though Azure IoT device SDKs. Refer to the [Azure IoT Developer Center] for step by step instructions on how to connect your device to this tutorial's code, and generally to Azure IoT Hub. Azure IoT service SDKs for Java and Node are coming soon.

In order to complete this tutorial you'll need the following:

+ Microsoft Visual Studio 2015,

+ An active Azure account. <br/>If you don't have an account, you can create a free account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fiot%2Ftutorials%2Fc2d%2F target="_blank").

[AZURE.INCLUDE [iot-hub-c2d-device-csharp](../../includes/iot-hub-c2d-device-csharp.md)]


[AZURE.INCLUDE [iot-hub-c2d-cloud-csharp](../../includes/iot-hub-c2d-cloud-csharp.md)]

## Next steps

In this tutorial, you learned how to send and receive cloud-to-device messages. You can continue to explore IoT hub features and scenarios with the following tutorials:

- [Process Device-to-Cloud messages], shows how to reliably process telemetry and interactive messages coming from devices.
- [Uploading files from devices], describes a pattern that makes use of cloud-to-device messages to facilitate file uploads from devices.

Additional information on IoT Hub:

* [IoT Hub Overview]
* [IoT Hub Developer Guide]
* [IoT Hub Guidance]
* [Supported device platforms and languages][Supported devices]
* [Azure IoT Developer Center]

<!-- Images. -->

<!-- Links -->

[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md

[IoT Hub Developer Guide - C2D]: iot-hub-devguide.md#c2d

[Azure portal]: https://portal.azure.com/

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
