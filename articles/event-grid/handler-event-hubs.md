---
title: Event hub as an event handler for Azure Event Grid events
description: Describes how you can use event hubs as event handlers for Azure Event Grid events.
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 01/21/2020
ms.author: spelluru
---

# Event hub as an event handler for Event Grid events

An event handler is the place where the event is sent. The handler takes some further action to process the event. Several Azure services are automatically configured to handle events. You can also use any WebHook for handling events. The WebHook doesn't need to be hosted in Azure to handle events. Event Grid only supports HTTPS WebHook endpoints.

Use Event Hubs when your solution gets events faster than it can process the events. Your application processes the events from Event Hubs at it own schedule. You can scale your event processing to handle the incoming events.

Event Hubs can act as either an event source or event handler. The following article shows how to use Event Hubs as a handler.

## Schema


## Examples

|Title  |Description  |
|---------|---------|
| [Quickstart: route custom events to Azure Event Hubs with Azure CLI and Event Grid](custom-event-to-eventhub.md) | Sends a custom event to an event hub for processing by an application. |
| [Resource Manager template: custom topic and Event Hubs endpoint](https://github.com/Azure/azure-quickstart-templates/tree/master/101-event-grid-event-hubs-handler)| A Resource Manager template that creates a subscription for a custom topic. It sends events to an Azure Event Hubs. |

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
