---
title: Azure Event Grid overview
description: Describes Azure Event Grid and its concepts.
services: event-grid
author: banisadr
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 08/14/2017
ms.author: babanisa
---

# An introduction to Azure Event Grid

Azure Event Grid allows you to easily build applications with event-based architectures. You select the Azure resource you would like to subscribe to, and give the event handler or WebHook endpoint to send the event to. Event Grid has built-in support for events coming from Azure services, like storage blobs and resource groups. Event Grid also has custom support for application and third-party events, using custom topics and custom webhooks. 

You can use filters to route specific events to different endpoints, multicast to multiple endpoints, and make sure your events are reliably delivered. Event Grid also has built in support for custom and third-party events.

This article provides an overview of Azure Event Grid. If you want to get started with Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md). If you are looking for more technical information about Event Grid, see the [developer reference]().

![Event Grid functional model](./media/overview/event-grid-functional-model.png)

## Concepts

There are five concepts in Azure Event Grid that let you get going:

* **Events** - What happened.
* **Event sources/publishers** - Where the event took place.
* **Topics** - The endpoint where publishers send events.
* **Event subscriptions** - The endpoint or built-in mechanism to route events, sometimes to multiple handlers. Subscriptions are also used by handlers to intelligently filter incoming events.
* **Event handlers** - The app or service reacting to the event.

For more information about these concepts, see [Concepts in Azure Event Grid](concepts.md).

## Capabilities

Here are some of the key features of Azure Event Grid:

* **Simplicity** - Point and click to aim events from your Azure resource to any event handler or endpoint.
* **Advanced filtering** - Filter on event type or event publish path to ensure event handlers only receive relevant events.
* **Fan-out** - Subscribe multiple endpoints to the same event to send copies of the event to as many places as needed.
* **Reliability** - Utilize 24-hour retry with exponential backoff to endure events are delivered.
* **Pay-per-event** - Pay only for the amount you use Event Grid.
* **High throughput** - Build high-volume workloads on Event Grid with support for millions of events per second.
* **Built-in Events** - Get up and running quickly with resource-defined built-in events.
* **Custom Events** - use Event Grid route, filter, and reliably deliver custom events in your app.

## Integrations

Azure offers built-in event support using numerous services, including both publishers and handlers. Many more will be added this year.

### Publishers

The following Azure services have built-in publisher support for event grid:

* Resource Groups (management operations)
* Azure Subscriptions (management operations)
* Event Hubs
* Custom Topics

Coming soon: Blob Storage, Azure Automation, Azure Active Directory, API Management, Logic Apps, IoT Hub, Service Bus, Azure Data Lake Store, Cosmos DB

### Handlers

The following Azure services have built-in handler support for Event Grid: 

* Azure Functions
* Logic Apps
* Azure Automation
* WebHooks

Coming soon: Service Bus, Event Hubs, Azure Data Factory, Storage Queues

## What can I do with Event Grid?

Azure Event Grid provides several capabilities that vastly improve serverless, ops automation, and integration work: 

1. [Create and route custom events with Azure Event Grid](custom-event-quickstart.md) – get started publishing custom events to Azure Event Grid to route, filter, and reliably deliver your application's events. 
2. [Tutorial 1]() – TBD. 

## How much does Event Grid cost?

Azure Event Grid uses a pay-per-event pricing model, so you only pay for what you use.

Event Grid costs $0.60 per million operations ($0.30 during preview) and the first 100,000 operation per month are free. Operations are defined as event ingress, advanced match, delivery attempt, and management calls.  More details can be found on the [pricing page]().

## Next Steps

* [Create and subscribe to custom events](custom-event-quickstart.md) 
  Jump right in and start sending your own custom events to any endpoint using the Azure Event Grid quickstart.
* [Azure Event Grid developer reference]()  
  Provides more technical information about the Azure Event Grid runtime and a reference for managing Event Subscriptions, routing, and filtering.
* [Using Azure Functions as an Event Handler]() 
  A tutorial on building an app using Azure Functions to react to events pushed via Azure Event Grid.
* [Using Logic Apps as an Event Handler]() 
  A tutorial on building an app using Logic Apps to react to events pushed via Azure Event Grid.