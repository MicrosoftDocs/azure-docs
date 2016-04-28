<properties
	pageTitle="Find your devices with Azure IoT Hub device management | Microsoft Azure"
	description="Follow this tutorial to learn how to find your devices using Azure IoT Hub device management with C#."
	services="iot-hub"
	documentationCenter=".net"
	authors="ellenfosborne"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="dotnet"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="04/06/2016"
     ms.author="elfarber"/>

# Tutorial: How to find your devices with IoT Hub device management

## Introduction

One feature that Azure IoT Hub device management introduces is querying. Device queries provide a means for finding devices in your Azure IoT hub's device registry.  Azure IoT Hub provides APIs to query for devices using device tags or through query expressions (in the form of JSON queries).  IoT solutions can use queries to find devices as a function of tags, device service properties, or device system properties. For more information about device properties, see **TODO: LINK TO JUAN'S DOC**

The [Get started with IoT Hub device management] tutorial shows how to create an IoT hub, provision device identities in it. The [Simulate a managed device] tutorial shows how to create a simulated managed device.

This tutorial builds on [Get started with IoT Hub device management] and [Simulate a managed device] tutorials and shows how to query by tags, device service properties, and device system properties.

You can find more information on device management and querying in **TODO: LINK TO JUAN'S DOC**

**DIFFERENT**

At the end of this tutorial you will run two console applications:

* **Query** which queries for devices based on tags, device service properties, and device system properties.
* **iotdm_simple_sample** which simulates the managed device. Instructions for running this app are in the [Simulate a managed device] tutorial.

In order to complete this tutorial you'll need the following:

+ Microsoft Visual Studio 2015

+ An active Azure account. <br/>If you don't have an account, you can create a free account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fiot%2Ftutorials%2Fc2d%2F target="_blank").

+ Simulated managed device from [Simulate a managed device] tutorial

If you would like to just clone the solution, you can:

1. **TODO**

If you would like to create the solution step-by-step, follow the instructions below:

## Query for devices
In this section, you will create a new project in the same solution you created in [Get started with IoT Hub device management].

1. Using a text editor, create a new **Query.js** file in the **dmsamples** folder.

4. Add the following '''require''' statements at the start of **Query.js**:

5. Add the following to **Query.js** to create the **Registry Manager**.

6. Add the following to **GenerateDevices.js** build the sample queries.

7. Add the following to **GenerateDevices.js** to query the device registry for devices with specified tags. If more than one tag is passed, the AND of the tags is returned. The second parameter is **maxCount**, the maximum number of devices to be returned.

8. Add the following to **GenerateDevices.js** to query by properties.

## Run the applications

**END DIFFERENT**

## Next steps

In this tutorial, you learned how to find devices using the query functionality of IoT Hub device management.  You can continue to explore IoT hub features and scenarios with the following tutorials:

- **TODO: Links**

Additional information on IoT Hub:

* [IoT Hub Overview]
* [IoT Hub Developer Guide]
* [IoT Hub Guidance]
* [Supported device platforms and languages][Supported devices]
* [Azure IoT Developer Center]
* **TODO: link to Juan's Document**

<!-- Images. -->
[1]: ./media/iot-hub-csharp-csharp-dm-query/query1.png
[2]: ./media/iot-hub-csharp-csharp-dm-query/query2.png

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
[Get started with IoT Hub device management]: TODO
[Simulate a managed device]: TODO
[Supported devices]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/tested_configurations.md
[Azure IoT Developer Center]: http://www.azure.com/develop/iot
