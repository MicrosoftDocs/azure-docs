---
title: Azure Event Grid - Partner Events 
description: Send events from third-party Event Grid SaaS and PaaS partners directly to Azure services with Azure Event Grid.
ms.topic: conceptual
ms.date: 10/29/2020
---

# Partner Events in Azure Event Grid (preview)
The **Partner Events** feature allows a third-party SaaS provider to publish events from its services to make them available to consumers who can subscribe to those events. It offers a first-party experience to third-party event sources by exposing a [topic](concepts.md#topics) type, a **partner topic**, that subscribers use to consume events. It also offers a clean pub-sub model by separating concerns and ownership of resources that are used by event publishers and subscribers.

> [!NOTE]
> If you're new at using Event Grid, see [overview](overview.md), [concepts](concepts.md), and [event handlers](event-handlers.md).

## What is Partner Events to a publisher?
To an event publisher, the Partner Events feature allows publishers to do the following tasks:

- Onboard their event sources to Event Grid
- Create a namespace (endpoint) to which they can publish events
- Create partner topics in Azure that subscribers own and use to consume events

## What is Partner Events to a subscriber?
To a subscriber, the Partner Events feature allows them to create partner topics in Azure to consume events from third-party event sources. Event consumption is realized by creating event subscriptions that send (push) events to a subscriber’s event handler.

## Why should I use Partner Events?
You may want to use the Partner Events if you've one or more of the following requirements.

### For publishers

- You want a mechanism to make your events available on Azure. Your users can filter and route those events by using partner topics and event subscriptions that they own and manage. You could use other integration approaches such as [topics](custom-topics.md) and [domains](event-domains.md). But, they wouldn't allow for a clean separation of resource (partner topics) ownership, management, and billing between publishers and subscribers. Also, this approach provides more intuitive user experience that makes it easy to discover and use partner topics.
- You want to publish events to a single endpoint, the namespace’s endpoint. And, you want the ability to filter those events so that only a subset of them is available. 
- You want to have visibility into metrics related to published events.
- You want to use [Cloud Events 1.0](https://cloudevents.io/) schema for your events.

### For subscribers

- You want to subscribe to events from [third-party publishers](#available-third-party-event-publishers) and handle the events using event handlers that are on Azure or elsewhere.
- You want to take advantage of the rich set of routing features and [destinations/event handlers](overview.md#event-handlers) to process events from third-party sources. 
- You want to implement loosely coupled architectures where your subscriber/event handler is unaware of the existence of the message broker used. 
- You need a resilient push delivery mechanism with send-retry support and at-least once semantics.
- You want to use [Cloud Events 1.0](https://cloudevents.io/) schema for your events. 


## Available third-party event publishers
A third-party event publisher must go through an [onboarding process](partner-onboarding-overview.md) before a subscriber can start consuming its events. 

If you're a subscriber and would like a third-party service to expose its events through Event Grid, 

### Auth0
**Auth0** is the first partner publisher available. You can create an [Auth0 partner topic](auth0-overview.md) to connect your Auth0 and Azure accounts. This integration allows you to react to, log, and monitor Auth0 events in real time. To try it out, see [Integrate Azure Event Grid with Auto0](auth0-how-to.md)

If you would like a third-party service to expose its events through Event Grid, submit the idea on the [User Voice portal](https://feedback.azure.com/forums/909934-azure-event-grid).
 
## Resources managed by event publishers
Event publishers create and manage the following resources:

### Partner registration
A registration holds general information related to a publisher. It defines a type of partner topic that shows in the Azure portal as an option when users try to create a partner topic. A publisher may expose more than one or more partner topic types to fit the needs of its subscribers. That is, a publisher may create separate registrations (partner topic types) for events from different services. For example, for the human resources (HR) service, publisher may define a partner topic for events such as employee joined, employee promoted, and employee left the company. 

Keep in mind the following points:

- Only Azure-approved partner registrations are visible. 
- Registrations are global. That is, they aren't associated to a particular Azure region.
- A registration is an optional resource. But, we recommend that you (as a publisher) create a registration. It allows users to discover your topics on the **Create Partner Topic** page in the [Azure portal](https://portal.azure.com/#create/Microsoft.EventGridPartnerTopic). Then, user can select event types (for example, employee joined, employee left, and so on.) while creating event subscriptions.

### Namespace
Like [custom topics](custom-topics.md) and [domains](event-domains.md), a partner namespace is a regional endpoint to publish events. It's through namespaces that publishers create and manage event channels. A namespace also functions as the container resource for event channels.

### Event Channels
An event channel is a mirrored resource to a partner topic. When a publisher creates an event channel in the publisher’s Azure subscription, it also creates a partner topic under a subscriber's Azure subscription. The operations done against an event channel (except GET) will be applied to the corresponding subscriber partner topic, even deletion. However, only partner topics are the kind of resources on which subscriptions and event delivery can be configured.

## Resources managed by subscribers 
Subscribers can use partner topics defined by a publisher and it's the only type of resource they see and manage. Once a partner topic is created, a subscriber user can create event subscriptions defining filter rules to [destinations/event handlers](overview.md#event-handlers). To subscribers, a partner topic and its associated event subscriptions provide the same rich capabilities as [custom topics](custom-topics.md) and its related subscription(s) do with one notable difference: partner topics support only the [Cloud Events 1.0 schema](cloudevents-schema.md), which provides a richer set of capabilities than other supported schemas.

## Pricing
Partner topics are charged by the number of operations done when using Event Grid. For more information on all types of operations that are used as the basis for billing and detailed price information, see [Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/).

## Limits
See [Event Grid Service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#event-grid-limits) for detailed information about the limits in place for partner topics.


## Next steps

- [Auth0 partner topic](auth0-overview.md)
- [How to use the Auth0 partner topic](auth0-how-to.md)
- [Become an Event Grid partner](partner-onboarding-overview.md)