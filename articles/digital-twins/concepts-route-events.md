---
# Mandatory fields.
title: Endpoints and event routes
titleSuffix: Azure Digital Twins
description: Learn how to route Azure Digital Twins events, both within the service and externally to other Azure services.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 02/08/2023
ms.topic: conceptual
ms.service: digital-twins
ms.custom: contperf-fy23q1

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Route Azure Digital Twins events

This article describes the process that Azure Digital Twins uses to send event data, both for routing events internally within Azure Digital Twins, and for sending event data externally to downstream services or connected compute resources outside the service.

Routing [event notifications](concepts-event-notifications.md) from Azure Digital Twins is a two-step process: create *endpoints*, then create *event routes* to send data to those endpoints. This article goes into more detail on each of these concepts. It also explains what happens when an endpoint fails to deliver an event in time (a process known as *dead lettering*).

## Event routing overview

There are two main scenarios for sending Azure Digital Twins data, and event routes are used to accomplish both:
* Sending event data from one twin in the Azure Digital Twins graph to another. For instance, when a property on one digital twin changes, you may want to notify and update another digital twin based on the updated data.
* Sending data outside Azure Digital Twins to downstream data services for more storage or processing. For instance, if you're already using [Azure Maps](../azure-maps/about-azure-maps.md), you might want to contribute Azure Digital Twins data to enhance your solution with integrated modeling or queries.

For any event destination, an event route works by sending event data from Azure Digital Twins to custom-defined *endpoints* in your subscriptions. Three Azure services are currently supported for endpoints: [Event Hubs](../event-hubs/event-hubs-about.md), [Event Grid](../event-grid/overview.md), and [Service Bus](../service-bus-messaging/service-bus-messaging-overview.md). Each of these Azure services can be connected to other services and acts as the middleman, sending data along to final destinations such as Azure Maps, or back into Azure Digital Twins for dependent graph updates.

The following diagram illustrates the flow of event data through a larger IoT solution, which includes sending Azure Digital Twins data through endpoints to other Azure Services, as well as back into Azure Digital Twins:

:::image type="content" source="media/concepts-route-events/routing-workflow.png" alt-text="Diagram of Azure Digital Twins routing data through endpoints to several downstream services." border="false":::

For egress of data outside Azure Digital Twins, typical downstream targets for event routes are Time Series Insights, Azure Maps, storage, and analytics solutions. Azure Digital Twins implements *at least once* delivery for data emitted to egress services. 

For routing of internal digital twin events within the same Azure Digital Twins solution, continue to the next section.

### Route internal digital twin events

Event routes are the mechanism that's used for handling events within the twin graph, sending data from digital twin to digital twin. This sort of event handling is done by connecting event routes through Event Grid to compute resources, such as [Azure Functions](../azure-functions/functions-overview.md). These functions then define how twins should receive and respond to events. 

When a compute resource wants to modify the twin graph based on an event that it received via event route, it's helpful for it to know ahead of time which twin it should modify. The event message also contains the ID of the source twin that sent the message, so the compute resource can use queries or traverse relationships to find a target twin for the desired operation. 

The compute resource also needs to establish security and access permissions independently.

To walk through the process of setting up an Azure function to process digital twin events, see [Set up twin-to-twin event handling](how-to-send-twin-to-twin-events.md).

## Creating endpoints

To define an event route, developers first must define endpoints. An *endpoint* is a destination outside of Azure Digital Twins that supports a route connection. Supported destinations include:
* Event Grid custom topics
* Event Hubs
* Service Bus

To create an endpoint, you can use the Azure Digital Twins REST APIs, CLI commands, or the Azure portal.

When defining an endpoint, you'll need to provide:
* The endpoint's name
* The endpoint type (Event Grid, Event Hubs, or Service Bus)
* The primary connection string and secondary connection string to authenticate 
* The topic path of the endpoint, such as `your-topic.westus2.eventgrid.azure.net`

Optionally, you can choose to create your endpoint with identity-based authentication, to use the endpoint with a [system-assigned or user-assigned managed identity](concepts-security.md#managed-identity-for-accessing-other-resources). This option is only available for Event Hubs and Service Bus-type endpoints (it's not supported for Event Grid).

The endpoint APIs that are available in control plane are:
* Create endpoint
* Get list of endpoints
* Get endpoint by name
* Delete endpoint by name

For detailed instructions on creating an endpoint, see [Create endpoints](how-to-create-endpoints.md).

## Creating event routes
 
To create an *event route*, you can use the Azure Digital Twins REST APIs, CLI commands, or the Azure portal.

Here's an example of creating an event route within a client application, using the `CreateOrReplaceEventRouteAsync` [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins.core-readme) call: 

:::code language="csharp" source="~/digital-twins-docs-samples/sdks/csharp/eventRoute_operations.cs" id="CreateEventRoute":::

1. First, a `DigitalTwinsEventRoute` object is created, and the constructor takes the name of an endpoint. This `endpointName` field identifies an endpoint such as an Event Hubs, Event Grid, or Service Bus. These endpoints must be created in your subscription and attached to Azure Digital Twins using control plane APIs before making this registration call.

2. The event route object also has a [Filter](how-to-create-routes.md#filter-events) field, which can be used to restrict the types of events that follow this route. A filter of `true` enables the route with no extra filtering (a filter of `false` disables the route). 

3. This event route object is then passed to `CreateOrReplaceEventRouteAsync`, along with a name for the route.

> [!TIP]
> All SDK functions come in synchronous and asynchronous versions.

For detailed instructions on creating event routes, see [Create routes and filters](how-to-create-routes.md).

## Dead-letter events

When an endpoint can't deliver an event within a certain time period or after trying to deliver the event several times, it can send the undelivered event to a storage account. This process is known as *dead-lettering*. Azure Digital Twins will dead-letter an event when one of the following conditions is met:

* Event isn't delivered within the time-to-live period
* The number of tries to deliver the event has exceeded the limit

If either of the conditions is met, the event is dropped or dead-lettered. By default, each endpoint doesn't turn on dead-lettering. To enable it, you must specify a storage account to hold undelivered events when creating the endpoint. You can then pull events from this storage account to resolve deliveries.

Before setting the dead-letter location, you must have a storage account with a container. You provide the URL for this container when creating the endpoint. The dead-letter is provided as a container URL with a SAS token. That token needs only `write` permission for the destination container within the storage account. The fully formed URL will be in the format of:
`https://<storage-account-name>.blob.core.windows.net/<container-name>?<SAS-token>`

To learn more about SAS tokens, see: [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../storage/common/storage-sas-overview.md)

To learn how to set up an endpoint with dead-lettering, see [Endpoint options: Dead-lettering](how-to-create-endpoints.md#endpoint-options-dead-lettering).

### Types of event messages

Different types of events in IoT Hub and Azure Digital Twins produce different types of notification messages, as described below.

[!INCLUDE [digital-twins-notifications.md](../../includes/digital-twins-notifications.md)]

## Next steps

Continue to the step-by-step instructions for setting up endpoints and event routes:
* [Create endpoints](how-to-create-endpoints.md) and [Create routes and filters](how-to-create-routes.md)

Or, follow this walkthrough to set up an Azure Function for twin-to-twin event handling within Azure Digital Twins:
* [Set up twin-to-twin event handling](how-to-send-twin-to-twin-events.md).