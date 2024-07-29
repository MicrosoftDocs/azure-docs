---
title: Understand Azure IoT Hub message routing
titleSuffix: Azure IoT Hub
description: This article describes how to use message routing to send device-to-cloud messages. Includes information about sending both telemetry and non-telemetry data.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 02/23/2024
ms.custom: ['Role: Cloud Development', devx-track-csharp]
---

# Use IoT Hub message routing to send device-to-cloud messages to Azure services

Message routing enables you to send messages from your devices to cloud services in an automated, scalable, and reliable manner. Message routing can be used to:

* **Send device telemetry messages and events** to the built-in endpoint and custom endpoints. Events that can be routed include device lifecycle events, device twin change events, digital twin change events, and device connection state events.

* **Filter data before routing it** by applying rich queries. Message routing allows you to query on the message properties and message body as well as device twin tags and device twin properties. For more information, see [queries in message routing](iot-hub-devguide-routing-query-syntax.md).

The IoT Hub defines a common format for all device-to-cloud messaging for interoperability across protocols. For more information, see [Create and read IoT Hub messages](iot-hub-devguide-messages-construct.md).

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## Routing endpoints

Each IoT hub has a default routing endpoint called **messages/events** that is compatible with Event Hubs. You also can create custom endpoints that point to other services in your Azure subscription.

IoT Hub currently supports the following endpoints for message routing:

* Built-in endpoint
* Storage containers
* Service Bus queues
* Service Bus topics
* Event Hubs
* Cosmos DB

For more information about each of these endpoints, see [IoT Hub endpoints](./iot-hub-devguide-endpoints.md#custom-endpoints-for-message-routing).

Each message is routed to all endpoints whose routing queries it matches, which means that a message can be routed to multiple endpoints. However, if a message matches multiple routes that point to the same endpoint, IoT Hub delivers the message to that endpoint only once.

IoT Hub needs write access to these service endpoints for message routing to work. If you configure your endpoints through the Azure portal, the necessary permissions are added for you. If you configure your endpoints using PowerShell or the Azure CLI, you need to provide the write access permission.

To learn how to create endpoints, see the following articles:

* [Manage routes and endpoints using the Azure portal](how-to-routing-portal.md)
* [Manage routes and endpoints using the Azure CLI](how-to-routing-azure-cli.md)
* [Manage routes and endpoints using PowerShell](how-to-routing-powershell.md)
* [Manage routes and endpoints using Azure Resource Manager](how-to-routing-arm.md)

Make sure that you configure your services to support the expected throughput. For example, if you're using Event Hubs as a custom endpoint, you must configure the **throughput units** for that event hub so that it can handle the ingress of events you plan to send via IoT Hub message routing. Similarly, when using a Service Bus queue as an endpoint, you must configure the **maximum size** to ensure the queue can hold all the data ingressed, until it's egressed by consumers. When you first configure your IoT solution, you may need to monitor your other endpoints and make any necessary adjustments for the actual load.

If your custom endpoint has firewall configurations, consider using the [Microsoft trusted first party exception.](./virtual-network-support.md#egress-connectivity-from-iot-hub-to-other-azure-resources)

## Route to an endpoint in another subscription

If the endpoint resource is in a different subscription than your IoT hub, you need to configure your IoT hub as a trusted Microsoft service before creating a custom endpoint. When you do create the custom endpoint, set the **Authentication type** to user-assigned identity.

For more information, see [Egress connectivity from IoT Hub to other Azure resources](./iot-hub-managed-identity.md#egress-connectivity-from-iot-hub-to-other-azure-resources).

## Routing queries

IoT Hub message routing provides a querying capability to filter the data before routing it to the endpoints. Each routing query you configure has the following properties:

| Property      | Description |
| ------------- | ----------- |
| **Name**      | The unique name that identifies the query. |
| **Source**    | The origin of the data stream to be acted upon. For example, device telemetry. |
| **Condition** | The query expression for the routing query that is run against the message application properties, system properties, message body, device twin tags, and device twin properties to determine if it's a match for the endpoint. |
| **Endpoint**  | The name of the endpoint where IoT Hub sends messages that match the query. We recommend that you choose an endpoint in the same region as your IoT hub. |

A single message may match the condition on multiple routing queries, in which case IoT Hub delivers the message to the endpoint associated with each matched query. IoT Hub also automatically deduplicates message delivery, so if a message matches multiple queries that have the same destination, it's only written once to that destination.

For more information, see [IoT Hub message routing query syntax](./iot-hub-devguide-routing-query-syntax.md).

## Read data that has been routed

Use the following articles to learn how to read messages from an endpoint.

* Read from a [built-in endpoint](../iot/tutorial-send-telemetry-iot-hub.md?toc=/azure/iot-hub/toc.json&bc=/azure/iot-hub/breadcrumb/toc.json)

* Read from [Blob storage](../storage/blobs/storage-blob-event-quickstart.md)

* Read from [Event Hubs](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)

* Read from [Service Bus queues](../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md)

* Read from [Service Bus topics](../service-bus-messaging/service-bus-dotnet-how-to-use-topics-subscriptions.md)

## Fallback route

The fallback route sends all the messages that don't satisfy query conditions on any of the existing routes to the built-in endpoint (**messages/events**), which is compatible with [Event Hubs](../event-hubs/index.yml). If message routing is enabled, you can enable the fallback route capability. Once any route is created, data stops flowing to the built-in endpoint, unless a route is created to that endpoint. If there are no routes to the built-in endpoint and a fallback route is enabled, only messages that don't match any query conditions on routes will be sent to the built-in endpoint. Even if all existing routes are deleted, the fallback route capability must be enabled to receive all data at the built-in endpoint.

You can enable or disable the fallback route in the Azure portal on the **Message routing** blade. You can also use Azure Resource Manager for [FallbackRouteProperties](/rest/api/iothub/iothubresource/createorupdate#fallbackrouteproperties) to use a custom endpoint for the fallback route.

## Non-telemetry events

In addition to device telemetry, message routing also enables sending non-telemetry events, including:

* Device twin change events
* Device lifecycle events
* Device job lifecycle events
* Digital twin change events
* Device connection state events

For example, if a route is created with the data source set to **Device Twin Change Events**, IoT Hub sends messages to the endpoint that contain the change in the device twin. Similarly, if a route is created with the data source set to **Device Lifecycle Events**, IoT Hub sends a message indicating whether the device or module was deleted or created. For more information about device lifecycle events, see [Device and module lifecycle notifications](./iot-hub-devguide-identity-registry.md#device-and-module-lifecycle-notifications).

When using [Azure IoT Plug and Play](../iot/overview-iot-plug-and-play.md), a developer can create routes with the data source set to **Digital Twin Change Events** and IoT Hub sends messages whenever a digital twin property is set or changed, a digital twin is replaced, or when a change event happens for the underlying device twin. Finally, if a route is created with data source set to **Device Connection State Events**, IoT Hub sends a message indicating whether the device was connected or disconnected.

IoT Hub also integrates with Azure Event Grid to publish device events to support real-time integrations and automation of workflows based on these events. See key [differences between message routing and Event Grid](iot-hub-event-grid-routing-comparison.md) to learn which works best for your scenario.

### Limitations for device connection state events

Device connection state events are available for devices connecting using either the MQTT or AMQP protocol, or using either of these protocols over WebSockets. Requests made only with HTTPS won't trigger device connection state notifications. For IoT Hub to start sending device connection state events, after opening a connection a device must call either the *cloud-to-device receive message* operation or the *device-to-cloud send telemetry* operation. Outside of the Azure IoT SDKs, in MQTT these operations equate to SUBSCRIBE or PUBLISH operations on the appropriate messaging topics. Over AMQP these operations equate to attaching or transferring a message on the appropriate link paths. For more information, see the following articles:

* [Communicate with IoT Hub using MQTT](../iot/iot-mqtt-connect-to-iot-hub.md)
* [Communicate with IoT Hub using AMQP](iot-hub-amqp-support.md)

IoT Hub doesn't report each individual device connect and disconnect event, but rather publishes the current connection state taken at a periodic, 60-second snapshot. Receiving either the same connection state event with different sequence numbers or different connection state events both mean that there was a change in the device connection state during the 60-second window.

## Test routes

When you create a new route or edit an existing route, you should test the route query with a sample message. You can test individual routes or test all routes at once and no messages are routed to the endpoints during the test. Azure portal, Azure Resource Manager, Azure PowerShell, and Azure CLI can be used for testing. Outcomes help identify whether the sample message matched or didn't match the query, or if the test couldn't run because the sample message or query syntax are incorrect. To learn more, see [Test Route](/rest/api/iothub/iothubresource/testroute) and [Test All Routes](/rest/api/iothub/iothubresource/testallroutes).

## Latency

When you route device-to-cloud telemetry messages, there's a slight increase in the end-to-end latency after the creation of the first route.

In most cases, the average increase in latency is less than 500 milliseconds. However, the latency you experience can vary and can be higher depending on the tier of your IoT hub and your solution architecture. You can monitor the latency using the **Routing: message latency for messages/events** or **d2c.endpoints.latency.builtIn.events** IoT Hub metrics. Creating or deleting any route after the first one doesn't impact the end-to-end latency.

## Monitor and troubleshoot

IoT Hub provides several metrics related to routing and endpoints to give you an overview of the health of your hub and messages sent. You also can track errors that occur during evaluation of a routing query and endpoint health as perceived by IoT Hub with the **routes** category in IoT Hub resource logs. To learn more about using metrics and resource logs with IoT Hub, see [Monitoring Azure IoT Hub](monitor-iot-hub.md).

You can use the REST API [Get Endpoint Health](/rest/api/iothub/iothubresource/getendpointhealth#iothubresource_getendpointhealth) to get the health status of endpoints.

Use the [troubleshooting guide for routing](troubleshoot-message-routing.md) for more details and support for troubleshooting routing.


