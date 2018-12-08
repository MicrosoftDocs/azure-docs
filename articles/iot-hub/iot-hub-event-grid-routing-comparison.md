---
title: Compare Event Grid, routing for IoT Hub | Microsoft Docs
description: IoT Hub offers its own message routing service, but also integrates with Event Grid for event publishing. Compare the two features. 
author: kgremban
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 01/30/2018
ms.author: kgremban
---

# Compare message routing and Event Grid for IoT Hub

Azure IoT Hub provides the capability to stream data from your connected devices, and integrate that data into your business applications. IoT Hub offers two methods for integrating IoT events into other Azure services or business applications. This article discusses the two features that provide this capability, so that you can choose which option is best for your scenario.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

* **[IoT Hub message routing](iot-hub-devguide-messages-d2c.md)**: This IoT Hub feature enables users to route device-to-cloud messages to service endpoints like Azure Storage containers, Event Hubs, Service Bus queues, and Service Bus topics. Routing also provides a querying capability to filter the data before routing it to the endpoints. In addition to device telemetry data, you can also send [non-telemetry events](iot-hub-devguide-messages-d2c.md#non-telemetry-events) that can be used to trigger actions. 

* **IoT Hub integration with Event Grid**: Azure Event Grid is a fully managed event routing service that uses a publish-subscribe model. IoT Hub and Event Grid work together to [integrate IoT Hub events into Azure and non-Azure services](iot-hub-event-grid.md), in near-real time. 

## Similarities and differences

While both message routing and Event Grid enable alert configuration, there are some key differences between the two. Refer to the following table for details:

| Feature | IoT Hub message routing | IoT Hub integration with Event Grid |
| ------- | --------------- | ---------- |
| **Device messages** | Yes, message routing can be used for telemetry data. | No, Event Grid can only be used for non-telemetry IoT Hub events. |
| **Event type** | Yes, message routing can report twin changes and device lifecycle events. | Yes, Event Grid can report when devices are created, deleted, connected, and disconnected from IoT Hub |
| **Ordering** | Yes, ordering of events is maintained.  | No, order of events is not guaranteed. | 
| **Maximum message size** | 256 KB, device-to-cloud | 64 KB |
| **Filtering** | Rich filtering on message application properties, message system properties, message body, device twin tags, and device twin properties. For examples, see [Message Routing Query Syntax](iot-hub-devguide-routing-query-syntax.md). | Filtering based on suffix/prefix of device IDs, which works well for hierarchical services like storage. |
| **Endpoints** | <ul><li>Event Hubs</li> <li>Azure Blob Storage</li> <li>Service Bus queue</li> <li>Service Bus topics</li></ul><br>Paid IoT Hub SKUs (S1, S2, and S3) are limited to 10 custom endpoints. 100 routes can be created per IoT Hub. | <ul><li>Azure Functions</li> <li>Azure Automation</li> <li>Event Hubs</li> <li>Logic Apps</li> <li>Storage Blob</li> <li>Custom Topics</li> <li>Third-party services through WebHooks</li></ul><br>For the most up-to-date list of endpoints, see [Event Grid event handlers](../event-grid/overview.md#event-handlers). |
| **Cost** | There is no separate charge for message routing. Only ingress of telemetry into IoT Hub is charged. For example, if you have a message routed to three different endpoints, you are billed for only one message. | There is no charge from IoT Hub. Event Grid offers the first 100,000 operations per month for free, and then $0.60 per million operations after that. |

IoT Hub message routing and Event Grid have similarities too, some of which are detailed in the following table:

| Feature | IoT Hub message routing | IoT Hub integration with Event Grid |
| ------- | --------------- | ---------- |
| **Reliability** | High: Delivers each message to the endpoint at least once for each route. Expires all messages that are not delivered within one hour. | High: Delivers each message to the webhook at least once for each subscription. Expires all events that are not delivered within 24 hours. | 
| **Scalability** | High: Optimized to support millions of simultaneously connected devices sending billions of messages. | High: Capable of routing 10,000,000 events per second per region. |
| **Latency** | Low: Near-real time. | Low: Near-real time. |
| **Send to multiple endpoints** | Yes, send a single message to multiple endpoints. | Yes, send a single message to multiple endpoints.  | 
| **Security** | Iot Hub provides per-device identity and revocable access control. For more information, see the [IoT Hub access control](iot-hub-devguide-security.md). | Event Grid provides validation at three points: event subscriptions, event publishing, and webhook event delivery. For more information, see [Event Grid security and authentication](../event-grid/security-authentication.md). |

## How to choose

IoT Hub message routing and the IoT Hub integration with Event Grid perform different actions to achieve similar results. They both take information from your IoT Hub solution and pass it on so that other services can react. So how do you decide which one to use? In addition to the data from the previous section, use the following questions to help guide your decision: 

* **What kind of data are you sending to the endpoints?**

   Use IoT Hub message routing when you have to send telemetry data to other services. Message routing also enables querying message application and system properties, message body, device twin tags, and device twin properties.

   The IoT Hub integration with Event Grid works with events that occur in the IoT Hub service. These IoT Hub events include device created, deleted, connected, and disconnected. 

* **What endpoints need to receive this information?**

   IoT Hub message routing supports limited endpoints, but you can build connectors to reroute the data and events to additional endpoints. For a complete list of supported endpoints, see the table in the previous section. 

   The IoT Hub integration with Event Grid supports more endpoints. It also works with webhooks to extend routing outside of the Azure service ecosystem and into third-party business applications. 

* **Does it matter if your data arrives in order?**

   IoT Hub message routing maintains the order in which messages are sent, so that they arrive in the same way.

   Event Grid does not guarantee that endpoints will receive events in the same order that they occurred. However, the event schema does include a timestamp that can be used to identify the order after the events arrive at the endpoint. 

## Next steps

* Learn more about [IoT Hub Message Routing](iot-hub-devguide-messages-d2c.md) and the [IoT Hub endpoints](iot-hub-devguide-endpoints.md).
* Learn more about [Azure Event Grid](../event-grid/overview.md)
* To learn how to create Message Routes, see the [Process IoT Hub device-to-cloud messages using routes](../iot-hub/tutorial-routing.md) tutorial.
* Try out the Event Grid integration by [Sending email notifications about Azure IoT Hub events using Logic Apps](../event-grid/publish-iot-hub-events-to-logic-apps.md)