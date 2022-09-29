---
title: What is Azure Event Grid? 
description: Send event data from a source to handlers with Azure Event Grid. Build event-based applications, and integrate with Azure services.
ms.topic: overview
ms.date: 06/09/2022
---

# What is Azure Event Grid?

Event Grid is a highly scalable, serverless event broker that you can use to integrate applications using events. Events are delivered by Event Grid to subscriber destinations such as applications, Azure services, or any endpoint to which Event Grid has network access. The source of those events can be other applications, SaaS services and Azure services.

With Event Grid you connect solutions using event-driven architectures. An [event-driven architecture](/azure/architecture/guide/architecture-styles/event-driven) uses events to communicate occurrences in system state changes, for example, to other applications or services. You can use filters to route specific events to different endpoints, multicast to multiple endpoints, and make sure your events are reliably delivered.

Azure Event Grid is deployed to maximize availability by natively spreading across multiple fault domains in every region, and across availability zones (in regions that support them). For a list of regions that are supported by Event Grid, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=event-grid&regions=all).

The event sources and event handlers or destinations are summarized in the following diagram.

:::image type="content" source="./media/overview/functional-model.png" alt-text="Event Grid model of sources and handlers" lightbox="./media/overview/functional-model-big.png":::

> [!NOTE]
> This image shows how Event Grid connects sources and handlers, and isn't a comprehensive list of supported integrations. For a list of all supported event sources, see the following section. 

## Event sources

Event Grid supports the following event sources:

1. **Your own service or solution** that publishes events to Event Grid so that your customers can subscribe to them. Event Grid provides two type of resources you can use depending on your requirements.
   - [Custom Topics](custom-topics.md) or "Topics" for short. Use custom topics if your requirements resemble the following user story:
   
        "As an owner of a system, I want to communicate my system's state changes by publishing events and routing those events to event handlers, under my control or otherwise, that can process my system's events in a way they see fit."

   - [Domains](event-domains.md). Use domains if you want to deliver events to multiple teams at scale. Your requirements probably are similar to the following one:
   
        "As an owner of a system, I want to announce my system’s state changes to multiple teams in a single tenant so that they can process my system’s events in a way they see fit."

2. A **SaaS provider or platform** can publish their events to Event Grid through a feature called [Partner Events](partner-events-overview.md). You can [subscribe to those events](subscribe-to-partner-events.md) and automate tasks, for example. Events from the following partners are currently available:
   - [Auth0](auth0-overview.md) 
   - [Microsoft Graph API](subscribe-to-graph-api-events.md). Through Microsoft Graph API you can get events from [Microsoft Outlook](outlook-events.md), [Teams](teams-events.md), [Azure AD](azure-active-directory-events.md), SharePoint, Conversations, security alerts, and Universal Print.
  
3. **An Azure service**. The following Azure services support sending events to Event Grid. For more information about a source in the list, select the link.

[!INCLUDE [event-sources-system-topics.md](includes/event-sources-system-topics.md)]

## Event handlers

For full details on the capabilities of each handler and related articles, see [event handlers](event-handlers.md). Currently, the following Azure services support handling events from Event Grid: 

[!INCLUDE [event-handlers.md](includes/event-handlers.md)]

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
* **High throughput** - Build high-volume workloads on Event Grid.
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

Event Grid allows you to speed automation and simplify policy enforcement. For example, use Event Grid to notify Azure Automation when a virtual machine or database in Azure SQL is created. Use the events to automatically check that service configurations are compliant, put metadata into operations tools, tag virtual machines, or file work items.

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
  A tutorial that uses Azure Functions to stream data from Event Hubs to Azure Synapse Analytics.
* [Event Grid REST API reference](/rest/api/eventgrid)  
  Provides reference content for managing Event Subscriptions, routing, and filtering.
* [Partner Events overview](partner-events-overview.md).
* [subscribe to partner events](subscribe-to-partner-events.md).