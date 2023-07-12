---
title: Reacting to Azure App Configuration key-value events
description: Use Azure Event Grid to subscribe to App Configuration events, which allow applications to react to changes in key-values without the need for complicated code.
services: azure-app-configuration,event-grid 
author: jimmyca
ms.custom: devdivchpfy22
ms.author: jimmyca
ms.date: 08/30/2022
ms.topic: article
ms.service: azure-app-configuration

---

# Reacting to Azure App Configuration events

Azure App Configuration events enable applications to react to changes in key-values. This is done without the need for complicated code or expensive and inefficient polling services. Instead, events are pushed through [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) to subscribers, such as [Azure Functions](https://azure.microsoft.com/services/functions/), [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/), or even to your own custom HTTP listener. Critically, you only pay for what you use.

Azure App Configuration events are sent to the Azure Event Grid, which provides reliable delivery services to your applications through rich retry policies and dead-letter delivery. For more information, see [Event Grid message delivery and retry](../event-grid/delivery-and-retry.md).

Common App Configuration event scenarios include refreshing application configuration, triggering deployments, or any configuration-oriented workflow. When changes are infrequent, but your scenario requires immediate responsiveness, event-based architecture can be especially efficient.

Take a look at [Use Event Grid for data change notifications](./howto-app-configuration-event.md) for a quick example.

:::image type="content" source="./media/event-grid-functional-model.png" alt-text="Diagram that shows Event Grid Model.":::

[!INCLUDE [event-schema-app-configuration](../event-grid/includes/schema-app-configuration.md)]

For more information, see [Azure App Configuration events schema](../event-grid/event-schema-app-configuration.md).

## Practices for consuming events

Applications that handle App Configuration events should follow these recommended practices:
> [!div class="checklist"]
> * Multiple subscriptions can be configured to route events to the same event handler, so don't assume events are from a particular source. Instead, check the topic of the message to ensure that the App Configuration instance is sending the event.
> * Check the `eventType`, and don't assume that all events you receive will be the types you expect.
> * Use the `etag` fields to understand if your information about objects is still up-to-date.  
> * Use the sequencer fields to understand the order of events on any particular object.
> * Use the subject field to access the key-value that was modified.

## Next steps

To learn more about Event Grid and to give Azure App Configuration events a try, see:

> [!div class="nextstepaction"]
> [About Event Grid](../event-grid/overview.md)

> [!div class="nextstepaction"]
> [How to use Event Grid for data change notifications](./howto-app-configuration-event.md)