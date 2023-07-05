---
title: Understand the Azure IoT Hub built-in endpoint
description: This article describes how to use the built-in, Event Hub-compatible endpoint to read device-to-cloud messages.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 12/19/2022
ms.custom: [amqp, 'Role: Cloud Development']
---

# Read device-to-cloud messages from the built-in endpoint

By default, messages are routed to the built-in service-facing endpoint (**messages/events**) that is compatible with [Event Hubs](../event-hubs/index.yml). This endpoint is currently only exposed using the [AMQP](https://www.amqp.org/) protocol on port 5671 and [AMQP over WebSockets](http://docs.oasis-open.org/amqp-bindmap/amqp-wsb/v1.0/cs01/amqp-wsb-v1.0-cs01.html) on port 443. An IoT hub exposes the following properties to enable you to control the built-in Event Hub-compatible messaging endpoint **messages/events**.

| Property            | Description |
| ------------------- | ----------- |
| **Partition count** | Set this property at creation to define the number of [partitions](../event-hubs/event-hubs-features.md#partitions) for device-to-cloud event ingestion. |
| **Retention time**  | This property specifies how long in days messages are retained by IoT Hub. The default is one day, but it can be increased to seven days. |

IoT Hub allows data retention in the built-in Event Hubs for a maximum of seven days. You can set the retention time during creation of your IoT hub. Data retention time in IoT Hub depends on your IoT hub tier and unit type. In terms of size, the built-in Event Hubs can retain messages of the maximum message size up to at least 24 hours of quota. For example, one S1 unit IoT hub provides enough storage to retain at least 400,000 messages, at 4 KB per message. If your devices are sending smaller messages, they may be retained for longer (up to seven days) depending on how much storage is consumed. We guarantee to retain the data for the specified retention time as a minimum. After the retention time has passed, messages expire and become inaccessible. 

IoT Hub also enables you to manage consumer groups on the built-in device-to-cloud receive endpoint. You can have up to 20 consumer groups for each IoT hub.

If you're using [message routing](iot-hub-devguide-messages-d2c.md) and the [fallback route](iot-hub-devguide-messages-d2c.md#fallback-route) is enabled, a message that doesn't match a query on any route goes to the built-in endpoint. If you disable this fallback route, a message that doesn't match any query is dropped.

You can modify the retention time, either programmatically using the [IoT Hub resource provider REST APIs](/rest/api/iothub/iothubresource), or with the [Azure portal](https://portal.azure.com).

IoT Hub exposes the **messages/events** built-in endpoint for your back-end services to read the device-to-cloud messages received by your hub. This endpoint is Event Hub-compatible, which enables you to use any of the mechanisms the Event Hubs service supports for reading messages.

## Read from the built-in endpoint

Some product integrations and Event Hubs SDKs are aware of IoT Hub and let you use your IoT hub service connection string to connect to the built-in endpoint.

When you use Event Hubs SDKs or product integrations that are unaware of IoT Hub, you need an Event Hub-compatible endpoint and Event Hub-compatible name. You can retrieve these values from the portal as follows:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your IoT hub.

1. Select **Built-in endpoints** from the resource menu, under **Hub settings**.

1. The **Built-in endpoints** working pane contains three sections:
    
    - The **Event Hub Details** section contains the following values: **Partitions**, **Event Hub-compatible name**, **Retain for**, and **Consumer Groups**.
    - The **Event Hub compatible endpoint** section contains the following values: **Shared access policy** and **Event Hub-compatible endpoint**.
    - The **Cloud to device messaging** section contains the following values: **Default TTL**, **Feedback retention time**, and **Maximum delivery count**.

    :::image type="content" source="./media/iot-hub-devguide-messages-read-builtin/eventhubcompatible.png" alt-text="Screen capture showing device-to-cloud settings." lightbox="./media/iot-hub-devguide-messages-read-builtin/eventhubcompatible.png":::

In the working pane, the **Event Hub-compatible endpoint** field contains a complete Event Hubs connection string that looks like the following example:

*Endpoint=sb://abcd1234namespace.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=keykeykeykeykeykey=;EntityPath=iothub-ehub-abcd-1234-123456*

If the SDK you're using requires other values, then they would be:

| Name | Value |
| ---- | ----- |
| Endpoint | sb://abcd1234namespace.servicebus.windows.net/ |
| Hostname | abcd1234namespace.servicebus.windows.net |
| Namespace | abcd1234namespace |

You can then choose any shared access policy from the **Shared access policy** drop-down, as shown in the previous screenshot. It only shows policies that have the **ServiceConnect** permissions to connect to the specified event hub.

The SDKs you can use to connect to the built-in Event Hub-compatible endpoint that IoT Hub exposes include:

| Language | SDK | Example |
| -------- | --- | ------ |
| .NET | https://www.nuget.org/packages/Azure.Messaging.EventHubs | [Quickstart](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-csharp) |
| Java | https://mvnrepository.com/artifact/com.azure/azure-messaging-eventhubs | [Quickstart](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-java) |
| Node.js | https://www.npmjs.com/package/@azure/event-hubs | [Quickstart](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-nodejs) |
| Python | https://pypi.org/project/azure-eventhub/ | [Quickstart](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-python) |

The product integrations you can use with the built-in Event Hub-compatible endpoint that IoT Hub exposes include:

* [Azure Functions](../azure-functions/index.yml)

    For more information, see [Azure IoT Hub bindings for Azure Functions](../azure-functions/functions-bindings-event-iot.md).
* [Azure Stream Analytics](../stream-analytics/index.yml)

    For more information, see [Stream data as input into Stream Analytics](../stream-analytics/stream-analytics-define-inputs.md#stream-data-from-iot-hub).
* [Azure Time Series Insights](../time-series-insights/index.yml)

    For more information, see [Add an IoT hub event source to your Azure Time Series Insight environment](../time-series-insights/how-to-ingest-data-iot-hub.md).
* [Apache Spark integration](../hdinsight/spark/apache-spark-ipython-notebook-machine-learning.md)
* [Apache Kafka](https://kafka.apache.org/)

    For more information, see the [Apache Kafka developer guide for Azure Event Hubs](../event-hubs/apache-kafka-developer-guide.md).
* [Azure Databricks](/azure/databricks/)

## Use AMQP-WS or a proxy with Event Hubs SDKs

You can use the Event Hubs SDKs to read from the built-in endpoint in environments where AMQP over WebSockets or reading through a proxy is required. For more information, see the following samples.

| Language | Sample |
| -------- | ------ |
| .NET | [ReadD2cMessages .NET](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/service/samples/getting%20started/ReadD2cMessages) |
| Node.js | [read-d2c-messages Node.js](https://github.com/Azure-Samples/azure-iot-samples-node/tree/master/iot-hub/Quickstarts/read-d2c-messages) |
| Python | [read-dec-messages Python](https://github.com/Azure-Samples/azure-iot-samples-python/tree/master/iot-hub/Quickstarts/read-d2c-messages) |

## Next steps

* For more information about IoT Hub endpoints, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).

* The [Quickstarts](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-nodejs) show you how to send device-to-cloud messages from simulated devices and read the messages from the built-in endpoint. 

For more information, see the [Process IoT Hub device-to-cloud messages using routes](tutorial-routing.md) tutorial.

* If you want to route your device-to-cloud messages to custom endpoints, see [Use message routes and custom endpoints for device-to-cloud messages](iot-hub-devguide-messages-d2c.md).
