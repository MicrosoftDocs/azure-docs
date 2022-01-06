---
title: Azure Cache for Redis Event Grid Overview 
description: Use Azure Event Grid to publish Azure Cache for Redis events.
author: flang-msft
ms.author: franlanglois
ms.date: 12/21/2020
ms.topic: conceptual
ms.service: cache
---

# Azure Cache for Redis Event Grid Overview 

Azure Cache for Redis events, such as patching, scaling, import/export (RDB) events are pushed using [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) to subscribers such as Azure Functions, Azure Logic Apps, or even to your own http listener. Event Grid provides reliable event delivery to your applications through rich retry policies and dead-lettering.

See the [Azure Cache for Redis events schema](../event-grid/event-schema-azure-cache.md) article to view the full list of the events that Azure Cache for Redis supports.

If you want to try Azure Cache for Redis events, see any of these quickstarts:

|If you want to use this tool:    |See this quickstart: |
|--|-|
|Azure portal    |[Quickstart: Route Azure Cache for Redis events to web endpoint with the Azure portal](cache-event-grid-quickstart-portal.md)|
|PowerShell    |[Quickstart: Route Azure Cache for Redis events to web endpoint with PowerShell](cache-event-grid-quickstart-powershell.md)|
|Azure CLI    |[Quickstart: Route Azure Cache for Redis events to web endpoint with Azure CLI](cache-event-grid-quickstart-cli.md)|

## The event model

Event Grid uses [event subscriptions](../event-grid/concepts.md#event-subscriptions) to route event messages to subscribers. This image illustrates the relationship between event publishers, event subscriptions, and event handlers.

:::image type="content" source="media/cache-event-grid/event-grid-model.png" alt-text="Event grid model.":::

First, subscribe an endpoint to an event. Then, when an event is triggered, the Event Grid service will send data about that event to the endpoint.

See the [Azure Cache for Redis events schema](../event-grid/event-schema-azure-cache.md) article to view:

> [!div class="checklist"]
> * A complete list of Azure Cache for Redis events and how each event is triggered.
> * An example of the data the Event Grid would send for each of these events.
> * The purpose of each key value pair that appears in the data.


## Best practices for consuming events

Applications that handle Azure Cache for Redis events should follow a few recommended practices:
> [!div class="checklist"]
> * As multiple subscriptions can be configured to route events to the same event handler, it is important not to assume events are from a particular source, but to check the topic of the message to ensure that it comes from the Azure Cache for Redis instance you are expecting.
> * Similarly, check that the eventType is one you are prepared to process, and do not assume that all events you receive will be the types you expect.
> * Azure Cache for Redis events guarantees at-least-once delivery to subscribers, which ensures that all messages are outputted. However, due to retries or availability of subscriptions, duplicate messages may occasionally occur. To learn more about message delivery and retry, see [Event Grid message delivery and retry](../event-grid/delivery-and-retry.md).


## Next steps

Learn more about Event Grid and give Azure Cache for Redis events a try:

- [About Event Grid](../event-grid/overview.md)
- [Azure Cache for Redis events schema](../event-grid/event-schema-azure-cache.md)
- [Route Azure Cache for Redis events to web endpoint with Azure CLI](cache-event-grid-quickstart-cli.md)
- [Route Azure Cache for Redis events to web endpoint with the Azure portal](cache-event-grid-quickstart-portal.md)
- [Route Azure Cache for Redis events to web endpoint with PowerShell](cache-event-grid-quickstart-powershell.md)
