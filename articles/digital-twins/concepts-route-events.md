---
# Mandatory fields.
title: Event routes
titleSuffix: Azure Digital Twins
description: Understand how to route events within Azure Digital Twins and to other Azure Services.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 6/1/2021
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Route events within and outside of Azure Digital Twins

Azure Digital twins uses **event routes** to send data to consumers outside the service. 

There are two major cases for sending Azure Digital Twins data:
* Sending data from one twin in the Azure Digital Twins graph to another. For instance, when a property on one digital twin changes, you may want to notify and update another digital twin accordingly.
* Sending data to downstream data services for additional storage or processing (also known as *data egress*). For instance,
  - A hospital may want to send Azure Digital Twins event data to [Time Series Insights (TSI)](../time-series-insights/overview-what-is-tsi.md), to record time series data of handwashing-related events for bulk analytics.
  - A business that is already using [Azure Maps](../azure-maps/about-azure-maps.md) may want to use Azure Digital Twins to enhance their solution. They can quickly enable an Azure Map after setting up Azure Digital Twins, bring Azure Map entities into Azure Digital Twins as [digital twins](concepts-twins-graph.md) in the twin graph, or run powerful queries leveraging their Azure Maps and Azure Digital Twins data together.

Event routes are used for both of these scenarios.

## About event routes

An event route lets you send event data from digital twins in Azure Digital Twins to custom-defined endpoints in your subscriptions. Three Azure services are currently supported for endpoints: [Event Hub](../event-hubs/event-hubs-about.md), [Event Grid](../event-grid/overview.md), and [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md). Each of these Azure services can be connected to other services and acts as the middleman, sending data along to final destinations such as TSI or Azure Maps for whatever processing you need.

The following diagram illustrates the flow of event data through a larger IoT solution with an Azure Digital Twins aspect:

:::image type="content" source="media/concepts-route-events/routing-workflow.png" alt-text="Diagram of Azure Digital Twins routing data through endpoints to several downstream services." border="false":::

Typical downstream targets for event routes are resources like TSI, Azure Maps, storage, and analytics solutions.

### Event routes for internal digital twin events

Event routes are also used to handle events within the twin graph and send data from digital twin to digital twin. This is done by connecting event routes through Event Grid to compute resources, such as [Azure Functions](../azure-functions/functions-overview.md). These functions then define how twins should receive and respond to events. 

When a compute resource wants to modify the twin graph based on an event that it received via event route, it is helpful for it to know which twin it wants to modify ahead of time. 

Alternatively, the event message also contains the ID of the source twin that sent the message, so the compute resource can use queries or traverse relationships to find a target twin for the desired operation. 

The compute resource also needs to establish security and access permissions independently.

To walk through the process of setting up an Azure function to process digital twin events, see [Set up twin-to-twin event handling](how-to-send-twin-to-twin-events.md).

## Create an endpoint

To define an event route, developers first must define endpoints. An **endpoint** is a destination outside of Azure Digital Twins that supports a route connection. Supported destinations include:
* Event Grid custom topics
* Event Hub
* Service Bus

To [create an endpoint](how-to-manage-routes.md#create-an-endpoint-for-azure-digital-twins), you can use the Azure Digital Twins REST APIs, CLI commands, or the Azure portal.

When defining an endpoint, you'll need to provide:
* The endpoint's name
* The endpoint type (Event Grid, Event Hub, or Service Bus)
* The primary connection string and secondary connection string to authenticate 
* The topic path of the endpoint, such as *your-topic.westus2.eventgrid.azure.net*

The endpoint APIs that are available in control plane are:
* Create endpoint
* Get list of endpoints
* Get endpoint by name
* Delete endpoint by name

## Create an event route
 
To [create an event route](how-to-manage-routes.md#create-an-event-route), you can use the Azure Digital Twins REST APIs, CLI commands, or the Azure portal.

Here is an example of creating an event route within a client application, using the `CreateOrReplaceEventRouteAsync` [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins/client?view=azure-dotnet&preserve-view=true) call: 

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/eventRoute_operations.cs" id="CreateEventRoute":::

1. First, a `DigitalTwinsEventRoute` object is created, and the constructor takes the name of an endpoint. This `endpointName` field identifies an endpoint such as an Event Hub, Event Grid, or Service Bus. These endpoints must be created in your subscription and attached to Azure Digital Twins using control plane APIs before making this registration call.

2. The event route object also has a [Filter](how-to-manage-routes.md#filter-events) field, which can be used to restrict the types of events that follow this route. A filter of `true` enables the route with no additional filtering (a filter of `false` disables the route). 

3. This event route object is then passed to `CreateOrReplaceEventRouteAsync`, along with a name for the route.

> [!TIP]
> All SDK functions come in synchronous and asynchronous versions.

## Dead-letter events

When an endpoint can't deliver an event within a certain time period or after trying to deliver the event a certain number of times, it can send the undelivered event to a storage account. This process is known as **dead-lettering**. Azure Digital Twins will dead-letter an event when **one of the following** conditions is met. 

* Event isn't delivered within the time-to-live period
* The number of tries to deliver the event has exceeded the limit

If either of the conditions is met, the event is dropped or dead-lettered. By default, each endpoint **does not** turn on dead-lettering. To enable it, you must specify a storage account to hold undelivered events when creating the endpoint. You can then pull events from this storage account to resolve deliveries.

Before setting the dead-letter location, you must have a storage account with a container. You provide the URL for this container when creating the endpoint. The dead-letter is provided as a container URL with a SAS token. That token needs only `write` permission for the destination container within the storage account. The fully formed URL will be in the format of:
`https://<storage-account-name>.blob.core.windows.net/<container-name>?<SAS-token>`

To learn more about SAS tokens, see: [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../storage/common/storage-sas-overview.md)

To learn how to set up an endpoint with dead-lettering, see [Manage endpoints and routes in Azure Digital Twins](how-to-manage-routes.md#create-an-endpoint-with-dead-lettering).

### Types of event messages

Different types of events in IoT Hub and Azure Digital Twins produce different types of notification messages, as described below.

[!INCLUDE [digital-twins-notifications.md](../../includes/digital-twins-notifications.md)]

## Next steps

See how to set up and manage an event route:
* [Manage endpoints and routes](how-to-manage-routes.md)

Or, see how to use Azure Functions to route events within Azure Digital Twins:
* [Set up twin-to-twin event handling](how-to-send-twin-to-twin-events.md).