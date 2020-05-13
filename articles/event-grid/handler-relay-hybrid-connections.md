---
title: Relay Hybrid connection as an event handler for Azure Event Grid events
description: Describes how you can use Azure Relay hybrid connections as event handlers for Azure Event Grid events.
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 05/11/2020
ms.author: spelluru
---

# Relay Hybrid connection as an event handler for Azure Event Grid events
An event handler is the place where the event is sent. The handler takes some further action to process the event. Several Azure services are automatically configured to handle events and **Azure Relay** is one of them. 

Use Azure **Relay Hybrid Connections** to send events to applications that are within an enterprise network and don't have a publicly accessible endpoint.

## Tutorials
See the following tutorial for an example of using an Azure Relay hybrid connection as an event handler. 

|Title  |Description  |
|---------|---------|
| [Tutorial: send events to hybrid connection](custom-event-to-hybrid-connection.md) | Sends a custom event to an existing hybrid connection for processing by a listener application. |

## Next steps
See the [Event handlers](event-handlers.md) article for a list of supported event handlers. 