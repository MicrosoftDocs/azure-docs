<properties
	pageTitle="Process IoT Hub device-to-cloud messages | Microsoft Azure"
	description="Follow this tutorial to learn useful patterns to process IoT Hub device-to-cloud messages."
	services="iot-hub"
	documentationCenter=".net"
	authors="fsautomata"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="csharp"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="09/29/2015"
     ms.author="elioda"/>

# Tutorial: How to process IoT Hub device-to-cloud messages

## Introduction

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back end. Previous tutorials ([Get started with IoT Hub] and [Send Cloud-to-Device messages with IoT Hub]) illustrate the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub, and how to access them from devices and cloud components.

This tutorial builds on the code presented in [Get started with IoT Hub] to present two patterns for processing device-to-cloud messages.

The first pattern is reliable storage of device-to-cloud messages in [Azure Blobs]. This scenario is very common when implementing *cold path* analytics, where data stored in blobs is used as input to analytics driven by tools such as [Azure Data Factory] or the [Hadoop] stack.

The second pattern is reliable processing of *interactive* device-to-cloud messages. Device-to-cloud messages are called *interactive* when they are immediate triggers for a set of actions in the application back-end, as opposed to a *data point* message that is fed into an analytics engine. For instance, an alarm coming from a device that has to trigger the insertion of a ticket in a CRM system is an *interactive* device-to-cloud message, as opposed to a telemetry message containing temperature samples, which is a *data point* message.

Since IoT Hub exposes a Event Hubs-compatible endpoint to receive device-to-cloud messages, this tutorial uses [EventProcessorHost] to host an event processor class, which:

* Reliably store *data point* messages in Azure Blobs, and
* Forward *interactive* device-to-cloud messages to a [Service Bus Queue] for immediate processing.

[Service Bus][Service Bus Queue] is a great way to ensure reliable processing of interactive messages, as it provides per-message checkpoints, and time window-based deduplication.

At the end of this tutorial you will run three Windows console applications:

* **SimulatedDevice**, a modified version of the app created in [Get started with IoT Hub], which sends *data point* device-to-cloud messages every second, and *interactive* device-to-cloud messages every 10 seconds.
* **ProcessDeviceToCloudMessages**, which uses [EventProcessorHost] to reliably store *data point* messages in an Azure blob and forwards *interactive* messages to a Service Bus queue, and
* **ProcessD2cInteractiveMessages**, which dequeues messages from the queue.

> [AZURE.NOTE] IoT Hub has SDK support for many device platforms and languages (including C, Java, and Javascript) though Azure IoT device SDKs. Refer to the [Azure IoT Developer Center] for step by step instructions on how to connect your device to this tutorial's code, and generally to Azure IoT Hub.

> [AZURE.NOTE] The content of this tutorial is directly applicable to other ways to consume Event Hubs-compatible messages, e.g. [Hadoop] projects such as Storm. Refer to [IoT Hub Guidance - Event Hubs compatibility] for more information.

In order to complete this tutorial you'll need the following:

+ Microsoft Visual Studio 2015,

+ An active Azure account. <br/>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdevelop%2Fiot%2Ftutorials%2Fprocess-d2c%2F target="_blank").

Is is also assumed some knowledge of [Azure Storage] and [Azure Service Bus].


[AZURE.INCLUDE [iot-hub-process-d2c-device-csharp](../../includes/iot-hub-process-d2c-device-csharp.md)]


[AZURE.INCLUDE [iot-hub-process-d2c-cloud-csharp](../../includes/iot-hub-process-d2c-cloud-csharp.md)]

## Run the applications

Now you are ready to run the applications.

1.	From within Visual Studio, right click your solution and select **Set StartUp projects...**. Select **Multiple startup projects**, then select the **Start** action for **ProcessDeviceToCloudMessages**, **SimulatedDevice**, and **ProcessD2cInteractiveMessages** apps.

2.	Press **F5**, and you should see all applications start, and every interactive message sent by the simulated device should be processed by the interactive message processor.

  ![][50]

> [AZURE.NOTE] In order to see your blob file being updated, you might have to reduce the `MAX_BLOCK_SIZE` constant in `StoreEventProcessor` to something smaller (i.e. `1024`). This is because it will take some time to reach the block size limit with the data sent by the simulated device. With that edit, you should be able to see a blob being created and updated in your storage container.

## Next steps

In this tutorial, you learned how to reliably process *data point* and *interactive* device-to-cloud messages using [EventProcessorHost]. Analogous message processing logic can be implemented with:

- [Uploading files from devices], describes a pattern that makes use of cloud-to-device messages to facilitate file uploads from devices.

Additional information on IoT Hub:

* [IoT Hub Overview]
* [IoT Hub Developer Guide]
* [IoT Hub Guidance]
* [Supported device platforms and languages][Supported devices]
* [Azure IoT Developer Center]

<!-- Images. -->
[50]: ./media/iot-hub-csharp-csharp-process-d2c/run1.png


<!-- Links -->

[Azure Blobs]: https://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-blobs/
[Azure Data Factory]: https://azure.microsoft.com/en-us/documentation/services/data-factory/
[Hadoop]: https://azure.microsoft.com/en-us/documentation/services/hdinsight/
[Service Bus Queue]: https://azure.microsoft.com/en-us/documentation/articles/service-bus-dotnet-how-to-use-queues/
[EventProcessorHost]: http://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost(v=azure.95).aspx

[Transient Fault Handling]: https://msdn.microsoft.com/en-us/library/hh680901(v=pandp.50).aspx

[IoT Hub Guidance - Event Hubs compatibility]: iot-hub-guidance.md#eventhubcompatible

[Azure Storage]: https://azure.microsoft.com/en-us/documentation/services/storage/
[Azure Service Bus]: https://azure.microsoft.com/en-us/documentation/services/service-bus/

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
