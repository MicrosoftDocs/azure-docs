---
title: Publish and subscribe to application events - Azure Event Grid
description: Send event data from a source to handlers with Azure Event Grid. Build event-based applications, and integrate with Azure services.
services: event-grid
author: banisadr
manager: timlt

ms.service: event-grid
ms.topic: overview
ms.date: 05/25/2019
ms.author: babanisa
ms.custom: seodec18
---

# What is Azure Event Grid?

Azure Event Grid allows you to easily build applications with event-based architectures. First, select the Azure resource you would like to subscribe to, and then give the event handler or WebHook endpoint to send the event to. Event Grid has built-in support for events coming from Azure services, like storage blobs and resource groups. Event Grid also has support for your own events, using custom topics. 

You can use filters to route specific events to different endpoints, multicast to multiple endpoints, and make sure your events are reliably delivered.

Azure Event Grid is deployed to maximize availability by natively spreading across multiple fault domains in every region, and across availability zones (in regions that support them). Currently, Azure Event Grid is available in all public regions. It isn't yet available in the Azure Germany, Azure China 21Vianet, or Azure Government clouds.

This article provides an overview of Azure Event Grid. If you want to get started with Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md). 

![Event Grid model of sources and handlers](./media/overview/functional-model.png)

This image shows how Event Grid connects sources and handlers, and isn't a comprehensive list of supported integrations.

## Event sources

For full details on the capabilities of each source as well as related articles, see [event sources](event-sources.md). Currently, the following Azure services support sending events to Event Grid:

* [Azure Subscriptions (management operations)](event-sources.md#azure-subscriptions)
* [Container Registry](event-sources.md#container-registry)
* [Custom Topics](event-sources.md#custom-topics)
* [Event Hubs](event-sources.md#event-hubs)
* [IoT Hub](event-sources.md#iot-hub)
* [Media Services](event-sources.md#media-services)
* [Resource Groups (management operations)](event-sources.md#resource-groups)
* [Service Bus](event-sources.md#service-bus)
* [Storage Blob](event-sources.md#storage)
* [Azure Maps](event-sources.md#maps)

## Event handlers

For full details on the capabilities of each handler as well as related articles, see [event handlers](event-handlers.md). Currently, the following Azure services support handling events from Event Grid: 

* [Azure Automation](event-handlers.md#azure-automation)
* [Azure Functions](event-handlers.md#azure-functions)
* [Event Hubs](event-handlers.md#event-hubs)
* [Hybrid Connections](event-handlers.md#hybrid-connections)
* [Logic Apps](event-handlers.md#logic-apps)
* [Microsoft Flow](https://preview.flow.microsoft.com/connectors/shared_azureeventgrid/azure-event-grid/)
* [Queue Storage](event-handlers.md#queue-storage)
* [Service Bus](event-handlers.md#service-bus-queue-preview) (Preview)
* [WebHooks](event-handlers.md#webhooks)

## Concepts

There are five concepts in Azure Event Grid that let you get going:

* **Events** - What happened.
* **Event sources** - Where the event took place.
* **Topics** - The endpoint where publishers send events.
* **Event subscriptions** - The endpoint or built-in mechanism to route events, sometimes to more than one handler. Subscriptions are also used by handlers to intelligently filter incoming events.
* **Event handlers** - The app or service reacting to the event.

For more information about these concepts, see [Concepts in Azure Event Grid](concepts.md).

## Capabilities

Here are some of the key features of Azure Event Grid:

* **Simplicity** - Point and click to aim events from your Azure resource to any event handler or endpoint.
* **Advanced filtering** - Filter on event type or event publish path to make sure event handlers only receive relevant events.
* **Fan-out** - Subscribe several endpoints to the same event to send copies of the event to as many places as needed.
* **Reliability** - 24-hour retry with exponential backoff to make sure events are delivered.
* **Pay-per-event** - Pay only for the amount you use Event Grid.
* **High throughput** - Build high-volume workloads on Event Grid with support for millions of events per second.
* **Built-in Events** - Get up and running quickly with resource-defined built-in events.
* **Custom Events** - Use Event Grid route, filter, and reliably deliver custom events in your app.

For a comparison of Event Grid, Event Hubs, and Service Bus, see [Choose between Azure services that deliver messages](compare-messaging-services.md).

## What can I do with Event Grid?

Azure Event Grid provides several features that vastly improve serverless, ops automation, and [integration](https://azure.com/integration) work: 

### Serverless application architectures

![Serverless application architecture](./media/overview/serverless_web_app.png)

Event Grid connects data sources and event handlers. For example, use Event Grid to trigger a serverless function that analyzes images when added to a blob storage container. 

### Ops Automation

![Operations automation](./media/overview/Ops_automation.png)

Event Grid allows you to speed automation and simplify policy enforcement. For example, use Event Grid to notify Azure Automation when a virtual machine or SQL database is created. Use the events to automatically check that service configurations are compliant, put metadata into operations tools, tag virtual machines, or file work items.

### Application integration

![Application integration with Azure](./media/overview/app_integration.png)

Event Grid connects your app with other services. For example, create a custom topic to send your app's event data to Event Grid, and take advantage of its reliable delivery, advanced routing, and direct integration with Azure. Or, you can use Event Grid with Logic Apps to process data anywhere, without writing code. 

## How much does Event Grid cost?

Azure Event Grid uses a pay-per-event pricing model, so you only pay for what you use. The first 100,000 operations per month are free. Operations are defined as event ingress, subscription delivery attempts, management calls, and filtering by subject suffix. For details, see the [pricing page](https://azure.microsoft.com/pricing/details/event-grid/).

## Next steps

* [Route Storage Blob events](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json)  
  Respond to storage blob events by using Event Grid.
* [Create and subscribe to custom events](custom-event-quickstart.md)  
  Jump right in and start sending your own custom events to any endpoint using the Azure Event Grid quickstart.
* [Using Logic Apps as an Event Handler](monitor-virtual-machine-changes-event-grid-logic-app.md)  
  A tutorial on building an app using Logic Apps to react to events pushed by Event Grid.
* [Stream big data into a data warehouse](event-grid-event-hubs-integration.md)  
  A tutorial that uses Azure Functions to stream data from Event Hubs to SQL Data Warehouse.
* [Event Grid REST API reference](/rest/api/eventgrid)  
  Provides reference content for managing Event Subscriptions, routing, and filtering.
