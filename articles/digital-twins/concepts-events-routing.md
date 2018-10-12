---
title: Routing Events and Messages with Azure Digital Twins | Microsoft Docs
description: Overview of routing events and messages to service endpoints with Azure Digital Twins
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/08/2018
ms.author: alinast
---

# Routing events and messages

IoT solutions often unite several powerful services including storage, analytics, and more. This article describes how to connect Azure Digital Twins apps to Azure analytics, AI, and storage services to enrich them with deeper insights and functionalities.

## Route types

Digital Twins offers two ways to integrate IoT events into other Azure services or business applications:

* **Routing Digital Twins events**: Azure Digital Twins events can be triggered when an object in the spatial graph changes, when telemetry data is received, or when a User-Defined Function creates a notification based on predefined conditions. Users can send these events to [Event Hubs](https://azure.microsoft.com/services/event-hubs/), [Service Bus topics](https://azure.microsoft.com/services/service-bus/), or [Event Grids](https://azure.microsoft.com/services/event-grid/) for further processing.

* **Routing device telemetry**: In addition to routing events, Azure Digital Twins can also route raw device telemetry messages to Event Hubs for further insights and analytics. These types of messages aren't processed by Digital Twins, and they are only forwarded to the **Event Hub**.

Users can specify one or more egress endpoints to send out events or to forward messages. Events and messages will be sent to the endpoints according to these predefined routing preferences. In other words, users can specify certain one endpoint to receive graph operation events, another to receive device telemetry events, and so on.

![Digital Twins Events Routing][1]

Routing to **Event Hubs** will maintain the order in which telemetry messages are sent, so that they arrive at the endpoint in the same sequence as they were originally received. **Event Grid** and **Service Bus** don't guarantee that endpoints will receive events in the same order that they occurred. However, the event schema does include a timestamp that can be used to identify the order after the events arrive at the endpoint.

## Route implementation

The Azure Digital Twins service currently supports the following **EndpointTypes**:

* **EventHub**: is the Event Hub connection string endpoint.
* **ServiceBus**: is the Service Bus connection string endpoint.
* **EventGrid**: is the Event Grid connection string endpoint.

Azure Digital Twins currently supports the following **EventTypes** that will be sent to the chosen endpoint:

* **DeviceMessages**: are telemetry messages sent from the users' devices and forwarded by the system.
* **TopologyOperation**: are operations that change the graph or metadata of the graph. For example, adding or deleting an entity, such as a space.
* **SpaceChange**: are changes in a space's computed value as a result of a device telemetry message.
* **SensorChange**: are changes in a sensor's computed value as a result of a device telemetry message.
* **UdfCustom**: are custom notifications from a user-defined function.

> [!IMPORTANT]
> Not all **EndpointTypes** support all **EventTypes**.
> See the table below for the **EventTypes** that are allowed for each **EndpointType**.

|             | DeviceMessages | TopologyOperation | SpaceChange | SensorChange | UdfCustom |
| ----------- | -------------- | ----------------- | ----------- | ------------ | --------- |
| **EventHub**|     X          |         X         |     X       |      X       |   X       |
| **ServiceBus**|              |         X         |     X       |      X       |   X       |
| **EventGrid**|               |         X         |     X       |      X       |   X       |

>[!NOTE]
>For more details on how to create endpoints and examples of events' schema, please see [Endpoints and Egress](how-to-egress-endpoints.md).

## Next steps

To learn about public preview limits, read [Azure Digital Twins preview limits](concepts-service-limits.md).

To try out an Azure Digital Twins sample, read [Quickstart to find available rooms](quickstart-view-occupancy-dotnet.md).

<!-- Images -->
[1]: media/concepts/digital-twins-events-routing.png