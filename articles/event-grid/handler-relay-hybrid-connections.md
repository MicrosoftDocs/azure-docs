---
title: Relay Hybrid connection as an event handler for Azure Event Grid events
description: Describes how you can use Azure Relay hybrid connections as event handlers for Azure Event Grid events.
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 01/21/2020
ms.author: spelluru
---

# Relay Hybrid connection as an event handler for Azure Event Grid events

An event handler is the place where the event is sent. The handler takes some further action to process the event. Several Azure services are automatically configured to handle events. You can also use any WebHook for handling events. The WebHook doesn't need to be hosted in Azure to handle events. Event Grid only supports HTTPS WebHook endpoints.

Use Azure Relay Hybrid Connections to send events to applications that are within an enterprise network and don't have a publicly accessible endpoint.

## Tutorials

|Title  |Description  |
|---------|---------|
| [Tutorial: send events to hybrid connection](custom-event-to-hybrid-connection.md) | Sends a custom event to an existing hybrid connection for processing by a listener application. |

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
