<properties
	pageTitle="Process IoT Hub device-to-cloud messages | Microsoft Azure"
	description="Follow this tutorial to learn useful patterns to process IoT Hub device-to-cloud messages."
	services="iot-hub"
	documentationCenter=".net"
	authors="dominicbetts"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="csharp"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="04/29/2016"
     ms.author="dobett"/>

# Tutorial: How to process IoT Hub device-to-cloud messages

## Introduction

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back end. Other tutorials - [Get started with IoT Hub] and [Send Cloud-to-Device messages with IoT Hub] - show you how to use the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub.

This tutorial builds on the code shown in the [Get started with IoT Hub] tutorial and shows two scalable patterns you can use to process device-to-cloud messages:

- The reliable storage of device-to-cloud messages in [Azure Blob storage]. A very common scenario is *cold path* analytics, where you store telemetry data in blobs to use as input into analytics processes driven by tools such as [Azure Data Factory] or the [HDInsight (Hadoop)] stack.

- The reliable processing of *interactive* device-to-cloud messages. Device-to-cloud messages are interactive when they are immediate triggers for a set of actions in the application back end, as compared to *data point* messages that feed into an analytics engine. For example, an alarm coming from a device that must trigger inserting a ticket into a CRM system is an interactive message, while temperature telemetry from a device that is to be stored for later analysis is a data point message.

Because IoT Hub exposes an [Event Hubs][lnk-event-hubs]-compatible endpoint to receive device-to-cloud messages, this tutorial uses an [EventProcessorHost] instance, which:

* Reliably stores *data point* messages in Azure blob storage.
* Forwards *interactive* device-to-cloud messages to a [Service Bus queue] for immediate processing.

Service Bus is a great way to ensure reliable processing of interactive messages, as it provides per-message checkpoints, and time window-based deduplication.

> [AZURE.NOTE] An **EventProcessorHost** instance is only one way to process interactive messages, other options include [Azure Service Fabric][lnk-service-fabric] and [Azure Stream Analytics][lnk-stream-analytics].

At the end of this tutorial you will run three Windows console apps:

* **SimulatedDevice**, a modified version of the app created in the [Get started with IoT Hub] tutorial, sends data point device-to-cloud messages every second and interactive device-to-cloud messages every 10 seconds. This app uses the AMQPS protocol to communicate with IoT Hub.
* **ProcessDeviceToCloudMessages** uses the [EventProcessorHost] class to retrieve messages from the Event Hub-compatible endpoint, it then reliably stores data point messages in  Azure blob storage and forwards interactive messages to a Service Bus queue.
* **ProcessD2CInteractiveMessages** dequeues the interactive messages from the Service Bus queue.

> [AZURE.NOTE] IoT Hub has SDK support for many device platforms and languages including C, Java, and JavaScript. Refer to the [Azure IoT Developer Center] for step by step instructions on how to replace the simulated device in this tutorial with a physical device, and generally how to connect devices to an IoT Hub.

This tutorial is directly applicable to other ways to consume Event Hubs-compatible messages such as [HDInsight (Hadoop)] projects. Refer to [Azure IoT Hub developer guide - Device to cloud] for more information.

In order to complete this tutorial you'll need the following:

+ Microsoft Visual Studio 2015.

+ An active Azure account. <br/>If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes.

You should have some basic knowledge of [Azure Storage] and [Azure Service Bus].


[AZURE.INCLUDE [iot-hub-process-d2c-device-csharp](../../includes/iot-hub-process-d2c-device-csharp.md)]


[AZURE.INCLUDE [iot-hub-process-d2c-cloud-csharp](../../includes/iot-hub-process-d2c-cloud-csharp.md)]

## Run the applications

Now you are ready to run the applications.

1.	In Visual Studio, in Solution Explorer, right-click your solution and select **Set StartUp Projects**. Select **Multiple startup projects**, then select **Start** as the action for the **ProcessDeviceToCloudMessages**, **SimulatedDevice**, and **ProcessD2CInteractiveMessages** projects.

2.	Press **F5** to start the three console applications. The **ProcessD2CInteractiveMessages** application should process every interactive message sent from the **SimulatedDevice** application.

  ![][50]

> [AZURE.NOTE] In order to see updates in your blob file, you may need to reduce the **MAX_BLOCK_SIZE** constant in the **StoreEventProcessor** class to a smaller value such as **1024**. This is because it takes some time to reach the block size limit with the data sent by the simulated device. With a smaller block size, you will not need to wait so long to see the blob being created and updated. However, using a larger block size makes the application more scalable.

## Next steps

In this tutorial, you learned how to reliably process data point and interactive device-to-cloud messages using the [EventProcessorHost] class. 

The [Uploading files from devices] tutorial builds on this tutorial using analagous message processing logic and describes a pattern that makes use of cloud-to-device messages to facilitate file uploads from devices

Additional information on IoT Hub:

* [IoT Hub Overview]
* [IoT Hub Developer Guide]
* [IoT Hub Guidance]
* [Supported device platforms and languages][Supported devices]
* [Azure IoT Developer Center]

<!-- Images. -->
[50]: ./media/iot-hub-csharp-csharp-process-d2c/run1.png


<!-- Links -->

[Azure Blob storage]: ../storage/storage-dotnet-how-to-use-blobs.md
[Azure Data Factory]: https://azure.microsoft.com/documentation/services/data-factory/
[HDInsight (Hadoop)]: https://azure.microsoft.com/documentation/services/hdinsight/
[Service Bus Queue]: ../service-bus/service-bus-dotnet-how-to-use-queues/
[EventProcessorHost]: http://msdn.microsoft.com/library/azure/microsoft.servicebus.messaging.eventprocessorhost(v=azure.95).aspx



[Azure IoT Hub developer guide - Device to cloud]: iot-hub-devguide.md#d2c

[Azure Storage]: https://azure.microsoft.com/documentation/services/storage/
[Azure Service Bus]: https://azure.microsoft.com/documentation/services/service-bus/



[Send Cloud-to-Device messages with IoT Hub]: iot-hub-csharp-csharp-c2d.md
[Uploading files from devices]: iot-hub-csharp-csharp-file-upload.md

[IoT Hub Overview]: iot-hub-what-is-iot-hub.md
[IoT Hub Guidance]: iot-hub-guidance.md
[IoT Hub Developer Guide]: iot-hub-devguide.md
[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md
[Supported devices]: iot-hub-tested-configurations.md
[Azure IoT Developer Center]: https://azure.microsoft.com/develop/iot
[lnk-service-fabric]: https://azure.microsoft.com/documentation/services/service-fabric/
[lnk-stream-analytics]: https://azure.microsoft.com/documentation/services/stream-analytics/
[lnk-event-hubs]: https://azure.microsoft.com/documentation/services/event-hubs/