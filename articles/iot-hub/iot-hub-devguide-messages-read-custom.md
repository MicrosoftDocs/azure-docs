---
title: Understand Azure IoT Hub custom endpoints | Microsoft Docs
description: Developer guide - using routing rules to route device-to-cloud messages to custom endpoints.
services: iot-hub
documentationcenter: .net
author: dominicbetts
manager: timlt
editor: ''

ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/25/2017
ms.author: dobett

---
# Use message routes and custom endpoints for device-to-cloud messages

IoT Hub enables you to route [device-to-cloud messages][lnk-device-to-cloud] to IoT Hub service-facing endpoints based on message properties. Routing rules give you the flexibility to send messages where they need to go without the need for additional services to process messages or to write additional code. Each routing rule you configure has the following properties:

| Property      | Description |
| ------------- | ----------- |
| **Name**      | The unique name that identifies the rule. |
| **Source**    | The origin of the data stream to be acted upon. For example, device telemetry. |
| **Condition** | The query expression for the routing rule that is run against the message's headers and body and used to determine whether it is a match for the endpoint. For more information about constructing a route condition, see the [Reference - query language for device twins and jobs][lnk-devguide-query-language]. |
| **Endpoint**  | The name of the endpoint where IoT Hub sends messages that match the condition. Endpoints should be in the same region as the IoT hub, otherwise you may be charged for cross-region writes. |

A single message may match the condition on multiple routing rules, in which case IoT Hub delivers the message to the endpoint associated with each matched rule. IoT Hub also automatically deduplicates message delivery, so if a message matches multiple rules that all have the same destination, it is only written to that destination once.

An IoT hub has a default [built-in endpoint][lnk-built-in]. You can create custom endpoints to route messages to by linking other services in your subscription to the hub. IoT Hub currently supports Event Hubs, Service Bus queues, and Service Bus topics as custom endpoints.

> [!WARNING]
> Service Bus queues and topics with **Sessions** or **Duplicate Detection** enabled are not supported as custom endpoints.

For more information about creating custom endpoints in IoT Hub, see [IoT Hub endpoints][lnk-devguide-endpoints].

For more information about reading from custom endpoints, see:

* Reading from [Event Hubs][lnk-getstarted-eh].
* Reading from [Service Bus queues][lnk-getstarted-queue].
* Reading from [Service Bus topics][lnk-getstarted-topic].

### Next steps

For more information about IoT Hub endpoints, see [IoT Hub endpoints][lnk-devguide-endpoints].

For more information about the query language you use to define routing rules, see [IoT Hub query language for device twins, jobs, and message routing][lnk-devguide-query-language].

The [Process IoT Hub device-to-cloud messages using routes][lnk-d2c-tutorial] tutorial shows you how to use routing rules and custom endpoints.

[lnk-built-in]: iot-hub-devguide-messages-read-builtin.md
[lnk-device-to-cloud]: iot-hub-devguide-messages-d2c.md
[lnk-devguide-query-language]: iot-hub-devguide-query-language.md
[lnk-devguide-endpoints]: iot-hub-devguide-endpoints.md
[lnk-d2c-tutorial]: iot-hub-csharp-csharp-process-d2c.md
[lnk-getstarted-eh]: ../event-hubs/event-hubs-csharp-ephcs-getstarted.md
[lnk-getstarted-queue]: ../service-bus-messaging/service-bus-dotnet-get-started-with-queues.md
[lnk-getstarted-topic]: ../service-bus-messaging/service-bus-dotnet-how-to-use-topics-subscriptions.md
