---
title: Compare Event Grid, routing for IoT Hub
titleSuffix: Azure IoT Hub
description: IoT Hub offers its own message routing service, but also integrates with Event Grid for event publishing. Compare the two features. 
author: kgremban

ms.service: iot-hub
ms.topic: product-comparison
ms.date: 02/22/2023
ms.author: kgremban
ms.custom: fasttrack-edit
---

# Compare message routing and Event Grid for IoT Hub

Azure IoT Hub provides the capability to stream data from your connected devices and integrate that data into your business applications. IoT Hub offers two methods for integrating IoT events into other Azure services or business applications. This article discusses the two features that provide this capability, so that you can choose which option is best for your scenario.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

**[IoT Hub message routing](iot-hub-devguide-messages-d2c.md)**: This IoT Hub feature enables users to route device-to-cloud messages to service endpoints like Azure Storage containers, Event Hubs, Service Bus queues, and Service Bus topics. Routing also provides a querying capability to filter the data before routing it to the endpoints. In addition to device telemetry data, you can also [route non-telemetry events](iot-hub-devguide-messages-d2c.md#non-telemetry-events) and use them to trigger actions.

**IoT Hub integration with Event Grid**: Azure Event Grid is a fully managed event routing service that uses a publish-subscribe model. IoT Hub and Event Grid work together to [integrate IoT Hub events into Azure and non-Azure services](iot-hub-event-grid.md), in near-real time. IoT Hub publishes both [device events](iot-hub-event-grid.md#event-types) and telemetry events.

## Differences

While both message routing and Event Grid enable alert configuration, there are some key differences between the two. Refer to the following table for details:

| Feature | IoT Hub message routing | IoT Hub integration with Event Grid |
| ------- | --------------- | ---------- |
| **Device messages and events** | Yes, message routing supports telemetry data, device twin changes, device lifecycle events, digital twin change events, and device connection state events. | Yes, Event Grid supports telemetry data and device events like device created/deleted/connected/disconnected. But Event Grid doesn't support device twin change events and digital twin change events. |
| **Ordering** | Yes, message routing maintains the order of events.  | No, Event Grid doesn't guarantee the order of events. |
| **Filtering** | Rich filtering on message application properties, message system properties, message body, device twin tags, and device twin properties. Filtering isn't applied to digital twin change events. For examples, see [Message Routing Query Syntax](iot-hub-devguide-routing-query-syntax.md). | Filtering based on event type, subject type and attributes in each event. For examples, see [Understand filtering events in Event Grid Subscriptions](../event-grid/event-filtering.md). When subscribing to telemetry events, you can apply filters on the data to filter on message properties, message body and device twin in your IoT Hub, before publishing to Event Grid. See [how to filter events](../iot-hub/iot-hub-event-grid.md#filter-events). |
| **Endpoints** | <ul><li>Event Hubs</li> <li>Azure Blob Storage</li> <li>Service Bus queue</li> <li>Service Bus topics</li><li>Cosmos DB (preview)</li></ul><br>Paid IoT Hub SKUs (S1, S2, and S3) can have 10 custom endpoints and 100 routes per IoT Hub. | <ul><li>Azure Functions</li> <li>Azure Automation</li> <li>Event Hubs</li> <li>Logic Apps</li> <li>Storage Blob</li> <li>Custom Topics</li> <li>Queue Storage</li> <li>Power Automate</li> <li>Third-party services through WebHooks</li></ul><br>Event Grid supports 500 endpoints per IoT Hub. For the most up-to-date list of endpoints, see [Event Grid event handlers](../event-grid/overview.md#event-handlers). |
| **Cost** | There is no separate charge for message routing. Only ingress of telemetry into IoT Hub is charged. For example, if you have a message routed to three different endpoints, you're billed for only one message. | There is no charge from IoT Hub. Event Grid offers the first 100,000 operations per month for free, and then $0.60 per million operations afterwards. |

## Similarities

IoT Hub message routing and Event Grid have similarities too, some of which are detailed in the following table:

| Feature | IoT Hub message routing | IoT Hub integration with Event Grid |
| ------- | --------------- | ---------- |
| **Maximum message size** | 256 KB, device-to-cloud | 256 KB, device-to-cloud |
| **Reliability** | High: Delivers each message to the endpoint at least once for each route. Expires all messages that aren't delivered within one hour. | High: Delivers each message to the webhook at least once for each subscription. Expires all events that aren't delivered within 24 hours. |
| **Scalability** | High: Optimized to support millions of simultaneously connected devices sending billions of messages. | High: Capable of routing 10,000,000 events per second per region. |
| **Latency** | Low: Near-real time. | Low: Near-real time. |
| **Send to multiple endpoints** | Yes, send a single message to multiple endpoints. | Yes, send a single message to multiple endpoints. |
| **Security** | Iot Hub provides per-device identity and revocable access control. For more information, see the [IoT Hub access control](iot-hub-devguide-security.md). | Event Grid provides validation at three points: event subscriptions, event publishing, and webhook event delivery. For more information, see [Event Grid security and authentication](../event-grid/security-authentication.md). |

## How to choose

IoT Hub message routing and the IoT Hub integration with Event Grid perform different actions to achieve similar results. They both take information from your IoT Hub solution and pass it on so that other services can react. So how do you decide which one to use? Consider the following questions to help guide your decision: 

* **What kind of data are you sending to the endpoints?**

   Use IoT Hub message routing when you have to send telemetry data to other services. Message routing also enables querying message application and system properties, message body, device twin tags, and device twin properties.

   The IoT Hub integration with Event Grid works with events that occur in the IoT Hub service. These IoT Hub events include telemetry data, device created, deleted, connected, and disconnected. When subscribing to telemetry events, you can apply additional filters on the data to filter on message properties, message body and device twin in your IoT Hub, before publishing to Event Grid. See [how to filter events](../iot-hub/iot-hub-event-grid.md#filter-events).

* **What endpoints need to receive this information?**

   IoT Hub message routing supports limited number of unique endpoints and endpoint types, but you can build connectors to reroute the data and events to additional endpoints. For a complete list of supported endpoints, see the table in the previous section. 

   The IoT Hub integration with Event Grid supports 500 endpoints per IoT Hub and a larger variety of endpoint types. It natively integrates with Azure Functions, Logic Apps, Storage and Service Bus queues, and also works with webhooks to extend sending data outside of the Azure service ecosystem and into third-party business applications.

* **Does it matter if your data arrives in order?**

   IoT Hub message routing maintains the order in which messages are sent, so that they arrive in the same way.

   Event Grid does not guarantee that endpoints receive events in the same order that they occurred. For those cases in which absolute order of messages is significant and/or in which a consumer needs a trustworthy unique identifier for messages, we recommend using message routing.

## Next steps

* Learn more about [IoT Hub message routing](../iot-hub/iot-hub-devguide-messages-d2c.md) and the [IoT Hub endpoints](../iot-hub/iot-hub-devguide-endpoints.md).
* Try out the Event Grid integration by [Sending email notifications about Azure IoT Hub events using Logic Apps](../event-grid/publish-iot-hub-events-to-logic-apps.md).
