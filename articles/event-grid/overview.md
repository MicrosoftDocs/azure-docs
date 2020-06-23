---
title: What is Azure Event Grid? 
description: Send event data from a source to handlers with Azure Event Grid. Build event-based applications, and integrate with Azure services.
services: event-grid
author: femila
manager: timlt

ms.service: event-grid
ms.topic: overview
ms.date: 02/20/2020
ms.author: femila
ms.custom: seodec18
---

# What is Azure Event Grid?

Azure Event Grid allows you to easily build applications with event-based architectures. First, select the Azure resource you would like to subscribe to, and then give the event handler or WebHook endpoint to send the event to. Event Grid has built-in support for events coming from Azure services, like storage blobs and resource groups. Event Grid also has support for your own events, using custom topics. 

You can use filters to route specific events to different endpoints, multicast to multiple endpoints, and make sure your events are reliably delivered.

Azure Event Grid is deployed to maximize availability by natively spreading across multiple fault domains in every region, and across availability zones (in regions that support them). For a list of regions that are supported by Event Grid, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-grid&regions=all).

This article provides an overview of Azure Event Grid. If you want to get started with Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md). 

![Event Grid model of sources and handlers](./media/overview/functional-model.png)

This image shows how Event Grid connects sources and handlers, and isn't a comprehensive list of supported integrations.

## Event sources

Currently, the following Azure services support sending events to Event Grid:

- [Azure App Configuration](event-schema-app-configuration.md)
- [Azure Blob Storage](event-schema-blob-storage.md)
- [Azure Container Registry](event-schema-container-registry.md)
- [Azure Event Hubs](event-schema-event-hubs.md)
- [Azure IoT Hub](event-schema-iot-hub.md)
- [Azure Key Vault](event-schema-key-vault.md)
- [Azure Machine Learning](event-schema-machine-learning.md)
- [Azure Maps](event-schema-azure-maps.md)
- [Azure Media Services](event-schema-media-services.md)
- [Azure resource groups](event-schema-resource-groups.md)
- [Azure Service Bus](event-schema-service-bus.md)
- [Azure SignalR](event-schema-azure-signalr.md)
- [Azure subscriptions](event-schema-subscriptions.md)

## Event handlers

For full details on the capabilities of each handler as well as related articles, see [event handlers](event-handlers.md). Currently, the following Azure services support handling events from Event Grid: 

* [Azure Automation](handler-webhooks.md#azure-automation)
* [Azure Functions](handler-functions.md)
* [Event Hubs](handler-event-hubs.md)
* [Relay Hybrid Connections](handler-relay-hybrid-connections.md)
* [Logic Apps](handler-webhooks.md#logic-apps)
* [Power Automate (Formerly known as Microsoft Flow)](https://preview.flow.microsoft.com/connectors/shared_azureeventgrid/azure-event-grid/)
* [Service Bus](handler-service-bus.md)
* [Queue Storage](handler-storage-queues.md)
* [WebHooks](handler-webhooks.md)

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
* **Custom Events** - Use Event Grid to route, filter, and reliably deliver custom events in your app.

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