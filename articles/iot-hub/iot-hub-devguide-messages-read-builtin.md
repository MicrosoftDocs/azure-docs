---
title: Understand the Azure IoT Hub built-in endpoint | Microsoft Docs
description: Developer guide - describes how to use the built-in, Event Hub-compatible endpoint to read device-to-cloud messages.
author: dominicbetts
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/18/2018
ms.author: dobett
---

# Read device-to-cloud messages from the built-in endpoint

By default, messages are routed to the built-in service-facing endpoint (**messages/events**) that is compatible with [Event Hubs](http://azure.microsoft.com/documentation/services/event-hubs/
). This endpoint is currently only exposed using the [AMQP](https://www.amqp.org/) protocol on port 5671. An IoT hub exposes the following properties to enable you to control the built-in Event Hub-compatible messaging endpoint **messages/events**.

| Property            | Description |
| ------------------- | ----------- |
| **Partition count** | Set this property at creation to define the number of [partitions](../event-hubs/event-hubs-features.md#partitions) for device-to-cloud event ingestion. |
| **Retention time**  | This property specifies how long in days messages are retained by IoT Hub. The default is one day, but it can be increased to seven days. |

IoT Hub also enables you to manage consumer groups on the built-in device-to-cloud receive endpoint.

If you are using [message routing](iot-hub-devguide-messages-d2c.md) and the [fallback route](iot-hub-devguide-messages-d2c.md#fallback-route) is enabled, all messages that do not match a query on any route are written to the built-in endpoint. If you disable this fallback route, messages that do not match any query are dropped.

You can modify the retention time, either programmatically using the [IoT Hub resource provider REST APIs](/rest/api/iothub/iothubresource), or with the [Azure portal](https://portal.azure.com).

IoT Hub exposes the **messages/events** built-in endpoint for your back-end services to read the device-to-cloud messages received by your hub. This endpoint is Event Hub-compatible, which enables you to use any of the mechanisms the Event Hubs service supports for reading messages.

## Read from the built-in endpoint

When you use the [Azure Service Bus SDK for .NET](https://www.nuget.org/packages/WindowsAzure.ServiceBus) or the [Event Hubs - Event Processor Host](..//event-hubs/event-hubs-dotnet-standard-getstarted-receive-eph.md), you can use any IoT Hub connection strings with the correct permissions. Then use **messages/events** as the Event Hub name.

When you use SDKs (or product integrations) that are unaware of IoT Hub, you must retrieve an Event Hub-compatible endpoint and Event Hub-compatible name:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.

2. Click **Built-in endpoints**.

3. The **Events** section contains the following values: **Event Hub-compatible endpoint**, **Event Hub-compatible name**, **Partitions**, **Retention time**, and **Consumer groups**.

    ![Device-to-cloud settings](./media/iot-hub-devguide-messages-read-builtin/eventhubcompatible.png)

The IoT Hub SDK requires the IoT Hub endpoint name, which is **messages/events** as shown under **Endpoints**.

If the SDK you are using requires a **Hostname** or **Namespace** value, remove the scheme from the **Event Hub-compatible endpoint**. For example, if your Event Hub-compatible endpoint is **sb://iothub-ns-myiothub-1234.servicebus.windows.net/**, the **Hostname** would be **iothub-ns-myiothub-1234.servicebus.windows.net**. The **Namespace** would be **iothub-ns-myiothub-1234**.

You can then use any shared access policy that has the **ServiceConnect** permissions to connect to the specified Event Hub.

If you need to build an Event Hub connection string by using the previous information, use the following pattern:

`Endpoint={Event Hub-compatible endpoint};SharedAccessKeyName={iot hub policy name};SharedAccessKey={iot hub policy key}`

The SDKs and integrations that you can use with Event Hub-compatible endpoints that IoT Hub exposes includes the items in the following list:

* [Java Event Hubs client](https://github.com/Azure/azure-event-hubs-java).
* [Apache Storm spout](../hdinsight/storm/apache-storm-develop-csharp-event-hub-topology.md). You can view the [spout source](https://github.com/apache/storm/tree/master/external/storm-eventhubs) on GitHub.
* [Apache Spark integration](../hdinsight/spark/apache-spark-eventhub-streaming.md).

## Next steps

* For more information about IoT Hub endpoints, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).

* The [Quickstarts](quickstart-send-telemetry-node.md) show you how to send device-to-cloud messages from simulated devices and read the messages from the built-in endpoint. 

For more detail, see the [Process IoT Hub device-to-cloud messages using routes](tutorial-routing.md) tutorial.

* If you want to route your device-to-cloud messages to custom endpoints, see [Use message routes and custom endpoints for device-to-cloud messages](iot-hub-devguide-messages-read-custom.md).