---
title: Routing events and messages with Azure Digital Twins | Microsoft Docs
description: Overview of routing events and messages to service endpoints with Azure Digital Twins
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 12/14/2018
ms.author: alinast
---

# Routing events and messages

IoT solutions often unite several powerful services that include storage, analytics, and more. This article describes how to connect Azure Digital Twins apps to Azure analytics, AI, and storage services to give them deeper insights and functionalities.

## Route types  

Azure Digital Twins offers two ways to connect IoT events with other Azure services or business applications:

* **Routing Azure Digital Twins events**: An object in the spatial graph that changes, telemetry data that's received, or a user-defined function that creates a notification based on predefined conditions can trigger Azure Digital Twins events. Users can send these events to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/), [Azure Service Bus topics](https://azure.microsoft.com/services/service-bus/), or [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) for further processing.

* **Routing device telemetry**: In addition to routing events, Azure Digital Twins can also route raw device telemetry messages to Event Hubs for further insights and analytics. These types of messages aren't processed by Azure Digital Twins. And they're only forwarded to the event hub.

Users can specify one or more egress endpoints to send out events or to forward messages. Events and messages will be sent to the endpoints according to these predefined routing preferences. In other words, users can specify a certain endpoint to receive graph operation events, another to receive device telemetry events, and so on.

![Azure Digital Twins events routing][1]

Routing to Event Hubs maintains the order in which telemetry messages are sent. So they arrive at the endpoint in the same sequence as they were originally received. Event Grid and Service Bus don't guarantee that endpoints will receive events in the same order that they occurred. However, the event schema includes a timestamp that can be used to identify the order after the events arrive at the endpoint.

## Route implementation

The Azure Digital Twins service currently supports the following **EndpointTypes**:

* **EventHub** is the Event Hubs connection string endpoint.
* **ServiceBus** is the Service Bus connection string endpoint.
* **EventGrid** is the Event Grid connection string endpoint.

Azure Digital Twins currently supports the following **EventTypes** that will be sent to the chosen endpoint:

* **DeviceMessages** are telemetry messages sent from the users' devices and forwarded by the system.
* **TopologyOperation** is an operation that changes the graph or metadata of the graph. An example is adding or deleting an entity, such as a space.
* **SpaceChange** is a change in a space's computed value that results from a device telemetry message.
* **SensorChange** is a change in a sensor's computed value that results from a device telemetry message.
* **UdfCustom** is a custom notification from a user-defined function.

> [!IMPORTANT]  
> Not all **EndpointTypes** support all **EventTypes**.
> See the following table for the **EventTypes** that are allowed for each **EndpointType**.

|             | DeviceMessages | TopologyOperation | SpaceChange | SensorChange | UdfCustom |
| ----------- | -------------- | ----------------- | ----------- | ------------ | --------- |
| EventHub|     X          |         X         |     X       |      X       |   X       |
| ServiceBus|              |         X         |     X       |      X       |   X       |
| EventGrid|               |         X         |     X       |      X       |   X       |

>[!NOTE]  
>For more information on how to create endpoints and examples of events' schema, see [Egress and endpoints](how-to-egress-endpoints.md).

## Next steps

- To learn about Azure Digital Twins preview limits, see [Public preview service limits](concepts-service-limits.md).

- To try out an Azure Digital Twins sample, see the [quickstart to find available rooms](quickstart-view-occupancy-dotnet.md).

<!-- Images -->
[1]: media/concepts/digital-twins-events-routing.png
