---
title: Azure Event Grid event handlers for namespace topics
description: Describes supported event handlers for Azure Event Grid namespace topics. 
ms.topic: conceptual
ms.date: 06/16/2023
---

# Event handlers in Azure Event Grid
An event handler is the place where the event is sent. The handler takes some further action to process the event.

Several Azure services are automatically configured to handle events. You can also use any webhook for handling events. The webhook doesn't need to be hosted in Azure to handle events. Event Grid only supports HTTPS webhook endpoints.

## Supported event handlers
Here are the supported event handlers: 

[!INCLUDE [namespace-topics-event-handlers.md](includes/namespace-topics-event-handlers.md)]

## Next steps
- For an introduction to Event Grid, see [About Event Grid](overview.md).
