---
title: Events and Message Routing | Microsoft Docs
description: Overview of message routing and notification egress with Digital Twins
author: alinamstanciu
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 09/18/2018
ms.author: alinast
---

# Events and Message Routing

With a spatial graph provisioned and data flowing into Digital Twins and being processed, an IoT solution will often need to send events or notifications to other components such as Event Hubs, Azure Functions, Logic Apps. 

Digital Twins can send a variety of notifications, such as when an object in the graph changes, or sensor telemetry reading changes as it received. User-defined functions can also create new custom events based incoming device data and based on graph metadata. For instance, once a certain threshold has been reached for specific type of spaces. Examples of events: device telemetry messages, graph changes or any space change.

Digital Twins can also route raw device messages for further insights and analytics. 

Both events and message routing
Users can specify one or more egress endpoints to send out these events as notifictions. 






<!-- Images -->
[1]: media/concepts/digital-twins-spatial-graph-building.png