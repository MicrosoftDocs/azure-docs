---
title: Event hub as an event handler for Azure Event Grid events
description: Describes how you can use event hubs as event handlers for Azure Event Grid events.
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 05/11/2020
ms.author: spelluru
---

# Event hub as an event handler for Event Grid events
An event handler is the place where the event is sent. The handler takes an action to process the event. Several Azure services are automatically configured to handle events and **Azure Event Hubs** is one of them. 

Use **Event Hubs** when your solution gets events faster than it can process the events. Then, your application can process events from Event Hubs at its own schedule. You can scale your event processing to handle the incoming events.

## Examples

|Title  |Description  |
|---------|---------|
| [Quickstart: route custom events to Azure Event Hubs with Azure CLI and Event Grid](custom-event-to-eventhub.md) | Sends a custom event to an event hub for processing by an application. |
| [Resource Manager template: custom topic and Event Hubs endpoint](https://github.com/Azure/azure-quickstart-templates/tree/master/101-event-grid-event-hubs-handler)| A Resource Manager template that creates a subscription for a custom topic. It sends events to an Azure Event Hubs. |

## Message properties
Set the following message headers when sending events as messages to an **event hub**.

| Property name | Description |
| ------------- | ----------- | 
| aeg-subscription-name | Name of event subscription. |
| aeg-delivery-count | Number of attempts made for the event. Example: "1" |
| aeg-event-type | Event type. Example: "Microsoft.Storage.blobCreated" | 
| aeg-metadata-version | Metadata version of the event. Example: "1". For **Event Grid event schema**, this property represents the metadata version and for **cloud event schema**, it represents the **spec version**. |
| aeg-data-version | Data version of the event. Example: "1". Default value: "". For **Event Grid event schema**, this property represents the data version and for **cloud event schema**, it doesn't apply. |
| aeg-output-event-id | ID of the Event Grid event. |


## Next steps
For an introduction to Event Grid, see [About Event Grid](overview.md).
