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

Azure Event Grid allows you to easily build applications with event-based architectures. You select the Azure resource you would like to subscribe to, and give the event handler or WebHook endpoint to send the event to. Native Azure events begin flowing immediately.

You can use filters to route specific events to different endpoints, multicast to multiple endpoints, and make sure your events are reliably delivered. Event Grid also has built in support for custom and third-party events.

This topic provides an overview of Azure Event Grid. If you want to get started with Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md). If you are looking for more technical information about Event Grid, see the [developer reference]().

![Event Grid functional model](./media/overview/event-grid-functional-model.png)

## Concepts

There are five concepts in Azure Event Grid that let you get going:

* **Events** - what happened.
* **Event sources/publishers** - where the event took place.
* **Topics** - the endpoint where publishers send events.
* **Event subscriptions** - the Event Grid mechanism that intelligently routes and filters events.
* **Event Handlers** - the app or service reacting to the event.

## Capabilities

Here are some of the key features of Azure Event Grid:

* **Simplicity** - Point and click to aim events from your Azure resource to any event handler or endpoint.
* **Advanced filtering** - Filter on event type or event publish path to ensure event handlers only receive relevant events.
* **Fan-out** - Subscribe multiple endpoints to the same event to send copies of the event to as many places as needed.
* **Reliability** - Utilize 24-hour retry with exponential backoff to endure events are delivered.
* **Pay-per-event** - Pay only for the amount you use Event Grid.
* **High throughput** - Build high-volume workloads on Event Grid with support for millions of events per second.
* **Native Events** - Get up and running quickly with resource-defined native events.
* **Custom Events** - use Event Grid route, filter, and reliably deliver custom events in your app.

## Integrations

More and more Azure services are being added continuously. The following services are natively available today:

### Publishers

* Resource Groups (management operations)
* Azure Subscriptions (management operations)
* Event Hubs
* Custom Topics

Coming soon: Blob Storage, Azure Automation, Azure Active Directory, API Management, Logic Apps, IoT Hub, Service Bus, Azure Data Lake Store, Cosmos DB

### Subscribers

* Azure Functions
* Logic Apps
* Azure Automation
* WebHooks

Coming soon: Service Bus, Event Hubs, Azure Data Factory, Storage Queues

## What can I do with Event Grid?

Azure Event Grid provides several capabilities not previously available that vastly improve serverless, ops automation, and integration work: 

1. [Custom Events](quickstart.md) – get started publishing custom events to Azure Event Grid to route, filter, and reliably deliver your application's events. 
2. [Tutorial 1]() – TBD. 
3. [Tutorial 2]() – TBD.

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