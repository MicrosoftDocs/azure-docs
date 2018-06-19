---
title: Understand Azure IoT Hub custom endpoints | Microsoft Docs
description: Developer guide - using routing rules to route device-to-cloud messages to custom endpoints.
author: dominicbetts
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/09/2018
ms.author: dobett
---

# Use message routes and custom endpoints for device-to-cloud messages

IoT Hub enables you to route [device-to-cloud messages][lnk-device-to-cloud] to IoT Hub service-facing endpoints based on message properties. Routing rules give you the flexibility to send messages where they need to go without the need for additional services or custom code. Each routing rule you configure has the following properties:

| Property      | Description |
| ------------- | ----------- |
| **Name**      | The unique name that identifies the rule. |
| **Source**    | The origin of the data stream to be acted upon. For example, device telemetry. |
| **Condition** | The query expression for the routing rule that is run against the message's headers and body and determines if it is a match for the endpoint. For more information about constructing a route condition, see the [Reference - query language for device twins and jobs][lnk-devguide-query-language]. |
| **Endpoint**  | The name of the endpoint where IoT Hub sends messages that match the condition. Endpoints should be in the same region as the IoT hub, otherwise you may be charged for cross-region writes. |

A single message may match the condition on multiple routing rules, in which case IoT Hub delivers the message to the endpoint associated with each matched rule. IoT Hub also automatically deduplicates message delivery, so if a message matches multiple rules that have the same destination, it is only written once to that destination.

## Endpoints and routing

An IoT hub has a default [built-in endpoint][lnk-built-in]. You can create custom endpoints to route messages to by linking other services in your subscription to the hub. IoT Hub currently supports Azure Storage containers, Event Hubs, Service Bus queues, and Service Bus topics as custom endpoints.

When you use routing and custom endpoints, messages are only delivered to the built-in endpoint if they don't match any rules. To deliver messages to the built-in endpoint as well as to a custom endpoint, add a route that sends messages to the **events** endpoint.

> [!NOTE]
> IoT Hub only supports writing data to Azure Storage containers as blobs.

> [!WARNING]
> Service Bus queues and topics with **Sessions** or **Duplicate Detection** enabled are not supported as custom endpoints.

For more information about creating custom endpoints in IoT Hub, see [IoT Hub endpoints][lnk-devguide-endpoints].

For more information about reading from custom endpoints, see:

* Reading from [Azure Storage containers][lnk-getstarted-storage].
* Reading from [Event Hubs][lnk-getstarted-eh].
* Reading from [Service Bus queues][lnk-getstarted-queue].
* Reading from [Service Bus topics][lnk-getstarted-topic].

## Latency

When you route device-to-cloud telemetry messages using built-in endpoints, there is a slight increase in the end-to-end latency after the creation of the first route.

In most cases, the average increase in latency is less than one second. You can monitor the latency using **d2c.endpoints.latency.builtIn.events** [IoT Hub metric](https://docs.microsoft.com/azure/iot-hub/iot-hub-metrics). Creating or deleting any route after the first one does not impact the end-to-end latency.

### Next steps

For more information about IoT Hub endpoints, see [IoT Hub endpoints][lnk-devguide-endpoints].

For more information about the query language you use to define routing rules, see [IoT Hub query language for device twins, jobs, and message routing][lnk-devguide-query-language].

The [Process IoT Hub device-to-cloud messages using routes][lnk-d2c-tutorial] tutorial shows you how to use routing rules and custom endpoints.

[lnk-built-in]: iot-hub-devguide-messages-read-builtin.md
[lnk-device-to-cloud]: iot-hub-devguide-messages-d2c.md
[lnk-devguide-query-language]: iot-hub-devguide-query-language.md
[lnk-devguide-endpoints]: iot-hub-devguide-endpoints.md
[lnk-d2c-tutorial]: tutorial-routing.md
[lnk-getstarted-eh]: ../event-hubs/event-hubs-csharp-ephcs-getstarted.md
[lnk-getstarted-queue]: ../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md
[lnk-getstarted-topic]: ../service-bus-messaging/service-bus-dotnet-how-to-use-topics-subscriptions.md
[lnk-getstarted-storage]: ../storage/blobs/storage-blobs-introduction.md
