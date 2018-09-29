---
title: Understand Azure IoT Hub custom endpoints | Microsoft Docs
description: Developer guide - using routing queries to route device-to-cloud messages to custom endpoints.
author: dominicbetts
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/09/2018
ms.author: dobett
---

# Use message routes and custom endpoints for device-to-cloud messages

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

IoT Hub [Message Routing](iot-hub-devguide-routing-query-syntax.md) enables users to route device-to-cloud messages to service-facing endpoints. Routing also provides a querying capability to filter the data before routing it to the endpoints. Each routing query you configure has the following properties:

| Property      | Description |
| ------------- | ----------- |
| **Name**      | The unique name that identifies the query. |
| **Source**    | The origin of the data stream to be acted upon. For example, device telemetry. |
| **Condition** | The query expression for the routing query that is run against the message application properties, system properties, message body, device twin tags, and device twin properties to determine if it is a match for the endpoint. For more information about constructing a query, see the see [message routing query syntax](iot-hub-devguide-routing-query-syntax.md) |
| **Endpoint**  | The name of the endpoint where IoT Hub sends messages that match the query. We recommend that you choose an endpoint in the same region as your IoT hub. |

A single message may match the condition on multiple routing queries, in which case IoT Hub delivers the message to the endpoint associated with each matched query. IoT Hub also automatically deduplicates message delivery, so if a message matches multiple queries that have the same destination, it is only written once to that destination.

## Endpoints and routing

An IoT hub has a default [built-in endpoint](iot-hub-devguide-messages-read-builtin.md). You can create custom endpoints to route messages to by linking other services in your subscription to the hub. IoT Hub currently supports Azure Storage containers, Event Hubs, Service Bus queues, and Service Bus topics as custom endpoints.

When you use routing and custom endpoints, messages are only delivered to the built-in endpoint if they don't match any query. To deliver messages to the built-in endpoint as well as to a custom endpoint, add a route that sends messages to the **events** endpoint.

> [!NOTE]
> * IoT Hub only supports writing data to Azure Storage containers as blobs.
> * Service Bus queues and topics with **Sessions** or **Duplicate Detection** enabled are not supported as custom endpoints.

For more information about creating custom endpoints in IoT Hub, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).

For more information about reading from custom endpoints, see:

* Reading from [Azure Storage containers](../storage/blobs/storage-blobs-introduction.md).

* Reading from [Event Hubs](../event-hubs/event-hubs-csharp-ephcs-getstarted.md).

* Reading from [Service Bus queues](../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md).

* Reading from [Service Bus topics](../service-bus-messaging/service-bus-dotnet-how-to-use-topics-subscriptions.md).

## Next steps

* For more information about IoT Hub endpoints, see [IoT Hub endpoints](iot-hub-devguide-endpoints.md).

* For more information about the query language you use to define routing queries, see [Message Routing query syntax](iot-hub-devguide-routing-query-syntax.md).

* The [Process IoT Hub device-to-cloud messages using routes](tutorial-routing.md) tutorial shows you how to use routing queries and custom endpoints.