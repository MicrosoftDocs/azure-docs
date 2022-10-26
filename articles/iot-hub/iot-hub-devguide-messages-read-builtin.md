---
title: Understand the Azure IoT Hub built-in endpoint | Microsoft Docs
description: Developer guide - describes how to use the built-in, Event Hub-compatible endpoint to read device-to-cloud messages.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 07/16/2021
ms.custom: [amqp, 'Role: Cloud Development']
---

# Read device-to-cloud messages from the built-in endpoint

By default, messages are routed to the built-in service-facing endpoint (**messages/events**) that is compatible with [Event Hubs](../event-hubs/index.yml). This endpoint is currently only exposed using the [AMQP](https://www.amqp.org/) protocol on port 5671 and [AMQP over WebSockets](http://docs.oasis-open.org/amqp-bindmap/amqp-wsb/v1.0/cs01/amqp-wsb-v1.0-cs01.html) on port 443. An IoT hub exposes the following properties to enable you to control the built-in Event Hub-compatible messaging endpoint **messages/events**.

| Property            | Description |
| ------------------- | ----------- |
| **Partition count** | Set this property at creation to define the number of [partitions](../event-hubs/event-hubs-features.md#partitions) for device-to-cloud event ingestion. |
| **Retention time**  | This property specifies how long in days messages are retained by IoT Hub. The default is one day, but it can be increased to seven days. |

IoT Hub allows data retention in the built-in Event Hubs for a maximum of 7 days. You can set the retention time during creation of your IoT Hub. Data retention time in IoT Hub depends on your IoT hub tier and unit type. In terms of size, the built-in Event Hubs can retain messages of the maximum message size up to at least 24 hours of quota. For example, for 1 S1 unit IoT Hub provides enough storage to retain at least 400K messages of 4k size each. If your devices are sending smaller messages, they may be retained for longer (up to 7 days) depending on how much storage is consumed. We guarantee retaining the data for the specified retention time as a minimum. Messages will expire and will not be accessible after the retention time has passed. 

IoT Hub also enables you to manage consumer groups on the built-in device-to-cloud receive endpoint. You can have up to 20 consumer groups for each IoT Hub.

If you're using [message routing](iot-hub-devguide-messages-d2c.md) and the [fallback route](iot-hub-devguide-messages-d2c.md#fallback-route) is enabled, all messages that don't match a query on any route go to the built-in endpoint. If you disable this fallback route, messages that don't match any query are dropped.

You can modify the retention time, either programmatically using the [IoT Hub resource provider REST APIs](/rest/api/iothub/iothubresource), or with the [Azure portal](https://portal.azure.com).

IoT Hub exposes the **messages/events** built-in endpoint for your back-end services to read the device-to-cloud messages received by your hub. This endpoint is Event Hub-compatible, which enables you to use any of the mechanisms the Event Hubs service supports for reading messages.

## Read from the built-in endpoint

Some product integrations and Event Hubs SDKs are aware of IoT Hub and let you use your IoT hub service connection string to connect to the built-in endpoint.

When you use Event Hubs SDKs or product integrations that are unaware of IoT Hub, you need an Event Hub-compatible endpoint and Event Hub-compatible name. You can retrieve these values from the portal as follows:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.

2. Click **Built-in endpoints**.

3. The **Events** section contains the following values: **Partitions**, **Event Hub-compatible name**, **Event Hub-compatible endpoint**, **Retention time**, and **Consumer groups**.

    ![Device-to-cloud settings](./media/iot-hub-devguide-messages-read-builtin/eventhubcompatible.png)

In the portal, the Event Hub-compatible endpoint field contains a complete Event Hubs connection string that looks like: **Endpoint=sb://abcd1234namespace.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=keykeykeykeykeykey=;EntityPath=iothub-ehub-abcd-1234-123456**. If the SDK you're using requires other values, then they would be:

| Name | Value |
| ---- | ----- |
| Endpoint | sb://abcd1234namespace.servicebus.windows.net/ |
| Hostname | abcd1234namespace.servicebus.windows.net |
| Namespace | abcd1234namespace |

You can then choose any shared access policy from the drop-down as shown in the screenshot above. It only shows policies that have the **ServiceConnect** permissions to connect to the specified Event Hub.

The SDKs you can use to connect to the built-in Event Hub-compatible endpoint that IoT Hub exposes include:

| Language | SDK | Example |
| -------- | --- | ------ |
| .NET | https://www.nuget.org/packages/Azure.Messaging.EventHubs | [Quickstart](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-csharp) |
| Java | https://mvnrepository.com/artifact/com.azure/azure-messaging-eventhubs | [Quickstart](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-java) |
| Node.js | https://www.npmjs.com/package/@azure/event-hubs | [Quickstart](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-nodejs) |
| Python | https://pypi.org/project/azure-eventhub/ | [Quickstart](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-python) |

The product integrations you can use with the built-in Event Hub-compatible endpoint that IoT Hub exposes include:

* [Azure Functions](../azure-functions/index.yml). See [Azure IoT Hub bindings for Azure Functions](../azure-functions/functions-bindings-event-iot.md).
* [Azure Stream Analytics](../stream-analytics/index.yml). See [Stream data as input into Stream Analytics](../stream-analytics/stream-analytics-define-inputs.md#stream-data-from-iot-hub).
* [Time Series Insights](../time-series-insights/index.yml). See [Add an IoT hub event source to your Time Series Insights environment](../time-series-insights/how-to-ingest-data-iot-hub.md).
* [Apache Spark integration](../hdinsight/spark/apache-spark-ipython-notebook-machine-learning.md).
* [Apache Kafka](https://kafka.apache.org/). For more information, see the [Apache Kafka developer guide for Event Hubs](../event-hubs/apache-kafka-developer-guide.md).
* [Azure Databricks](/azure/azure-databricks/).

## Use AMQP-WS or a proxy with Event Hubs SDKs

You can use the Event Hubs SDKs to read from the built-in endpoint in environments where AMQP over WebSockets or reading through a proxy is required. For more information, see the following samples.

| Language | Sample |
| -------- | ------ |
| .NET | [ReadD2cMessages .NET](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/getting%20started/ReadD2cMessages) |
| Java | [read-d2c-messages Java](https://github.com/Azure-Samples/azure-iot-samples-java/tree/master/iot-hub/Quickstarts/read-d2c-messages) |
| Node.js | [read-d2c-messages Node.js](https://github.com/Azure-Samples/azure-iot-samples-node/tree/master/iot-hub/Quickstarts/read-d2c-messages) |
| Python | [read-dec-messages Python](https://github.com/Azure-Samples/azure-iot-samples-python/tree/master/iot-hub/Quickstarts/read-d2c-messages) |

## Next steps

* For more information about IoT Hub endpoints, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).

* The [Quickstarts](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-nodejs) show you how to send device-to-cloud messages from simulated devices and read the messages from the built-in endpoint. 

For more detail, see the [Process IoT Hub device-to-cloud messages using routes](tutorial-routing.md) tutorial.

* If you want to route your device-to-cloud messages to custom endpoints, see [Use message routes and custom endpoints for device-to-cloud messages](iot-hub-devguide-messages-read-custom.md).
