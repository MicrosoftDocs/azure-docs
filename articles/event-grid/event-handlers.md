---
title: Azure Event Grid event handlers
description: Describes supported event handlers for Azure Event Grid. Azure Automation, Functions, Event Hubs, Hybrid Connections, Logic Apps, Service Bus, Queue Storage, Webhooks.
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 01/21/2020
ms.author: spelluru
---

# Event handlers in Azure Event Grid
An event handler is the place where the event is sent. The handler takes some further action to process the event. Several Azure services are automatically configured to handle events. You can also use any webhook for handling events. The webhook doesn't need to be hosted in Azure to handle events. Event Grid only supports HTTPS webhook endpoints.

## Supported event handlers
Here are the supported event handlers: 

- [Webhooks](handler-webhooks.md). Azure Automation runbooks and Logic Apps are supported via webhooks. 
- [Azure functions](handler-functions.md)
- [Event hubs](handler-event-hubs.md)
- [Relay hybrid connections](handler-relay-hybrid-connections.md)
- [Service Bus queues and topics](handler-service-bus.md)
- [Storage queues](handler-storage-queues.md)

## Next steps
- For an introduction to Event Grid, see [About Event Grid](overview.md).
