---
title: Events Routing with Azure Digital Twins | Microsoft Docs
description: Overview of events and messages routing to service endpoints with Azure Digital Twins
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 09/18/2018
ms.author: alinast
---

# Events Routing

Azure Digital Twins provides the capability to stream data from your connected devices and integrate that data into your business applications. Digital Twins offers two methods for integrating IoT events into other Azure services or business applications. 

* **Digital Twins events routing**: This feature enables users to send a variety of events to the following services: Event Hubs, Service Bus topics, and Event Grids for further processing. Events could be triggered when an object in the graph changes, or sensor telemetry reading changes as it received. User-defined functions can also create new events based incoming telemetry and graph's nodes, for instance once a certain threshold has been reached for specific type of spaces.

* **Device telemetry message routing to Event Hub**: This feature enables users to route raw telemetry messages to Event Hubs for further insights and analytics. Digital Twins message routing to EventHubs maintains the order in which messages are sent, so that they arrive in the same way. These types of messages are not processed by Digital Twins, they are only forwarded to Event Hub.

Users should specify one or more egress endpoints to send out these events or to forward the messages. Events and messages will be sent to the endpoints according to the pre-defined routing preferences. In other words, user can specify which endpoint should receive graph operation, user-defined function, sensor change, space change, or device telemetry events.

Event Grid and Service Bus don't guarantee that endpoints will receive events in the same order that they occurred. However, the event schema does include a timestamp that can be used to identify the order after the events arrive at the endpoint. 

The system currently supports the following `EndpointTypes`:

* `EventHub` is defined as the Event Hub connection string endpoint.
* `ServiceBus` is defined as the Service Bus connection string endpoint.
* `EventGrid` is defined as the Event Grid connection string endpoint.

The system currently supports the following `EventTypes` that will be sent to the chosen endpoint:

* `DeviceMessages` is defined as telemetry messages sent from the users' devices and forwarded by the system.
* `TopologyOperation` is defined as operations, which change the graph or metadata of the graph. For example, adding or deleting an entity, such as space.
* `SpaceChange` is defined as a change in a space computed value as a result of a device telemetry message.
* `SensorChange` is defined as a change in a sensor computed value as a result of a device telemetry message.
* `UdfCustom` is defined as a custom notification from a user-defined function.

Furthermore, not all `EndpointTypes` support all `EventTypes`. The `EventTypes` allowed for each `EndpointType` are as follows:

* EventHub: `DeviceMessages`, `TopologyOperation`, `SpaceChange`, `SensorChange`, `UdfCustom`
* ServiceBus: `TopologyOperation`, `SpaceChange`, `SensorChange`, `UdfCustom`
* EventGrid: `TopologyOperation`, `SpaceChange`, `SensorChange`, `UdfCustom`

<!-- >[!NOTE]
>For more details on how to create endpoints and examples of events' schema, please see [Endpoints and Egress]](how-to-create-event-endpoints.md). -->
