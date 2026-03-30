---
ms.date: 02/09/2026
author: robece
ms.author: robece
title: Push Delivery in Azure Event Grid
description: Discover how to use Azure Event Grid's HTTP push delivery for seamless event integration. Learn about topics, subscriptions, and supported resources.
#customer intent: As a developer, I want to understand how to use push delivery with Event Grid so that I can integrate it into my application workflows.
ms.topic: concept-article
---

# Push delivery with HTTP
This article builds on the [What is Azure Event Grid?](overview.md) article to provide essential information before you start using Event Grid’s pull and push delivery over HTTP. It covers fundamental concepts, resource models, and message delivery modes. At the end of this document, you find useful links to articles that guide you on how to use Event Grid and to articles that offer in-depth conceptual information.

>[!Important]
> This document helps you get started with Event Grid capabilities that use the HTTP protocol. This article is suitable for users who need to integrate applications on the cloud. If you need to communicate IoT device data, see [Overview of the MQTT Support in Azure Event Grid](mqtt-overview.md).

## Core concepts

### CloudEvents

Event Grid conforms to Cloud Native Computing Foundation (CNCF)’s open standard [CloudEvents 1.0](https://github.com/cloudevents/spec) specification by using the [HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md) with [JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md). This conformance means that your solutions publish and consume event messages by using a format like the following example:

```json
{
    "specversion" : "1.0",
    "type" : "com.yourcompany.order.created",
    "source" : "https://yourcompany.com/orders/",
    "subject" : "O-28964",
    "id" : "A234-1234-1234",
    "time" : "2018-04-05T17:31:00Z",
    "comexampleextension1" : "value",
    "comexampleothervalue" : 5,
    "datacontenttype" : "application/json",
    "data" : {
       "orderId" : "O-28964",
       "URL" : "https://com.yourcompany/orders/O-28964"
    }
}
```

#### What is an event?

An **event** is the smallest amount of information that fully describes something that happened in a system. An event is often referred to as a discrete event because it represents a distinct, self-standing fact about a system that provides an insight that can be actionable. Examples include: *com.yourcompany.Orders.OrderCreated*, *org.yourorg.GeneralLedger.AccountChanged*, *io.solutionname.Auth.MaximumNumberOfUserLoginAttemptsReached*.

>[!Note]
> We interchangeably use the terms **discrete events**, **cloudevents**, or just **events** to refer to those messages that inform about a change of a system state.

For more information on events, see the Event Grid [Terminology](concepts.md#events).

#### Another kind of event

The user community also refers to events as those types of messages that carry a data point, such as a single reading from a device or a single click on a web application page. That kind of event is usually analyzed over a time window or event stream size to derive insights and take an action. In Event Grid’s documentation, that kind of event is referred to as **data point**, **streaming data**, or **telemetry**. They're a kind of data that Event Grid’s Message Queuing Telemetry Transport (MQTT) support and Azure Event Hubs usually handle.

### Topics and event subscriptions

Events published to Event Grid land on a **topic**, which is a resource that logically contains all events. An **event subscription** is a configuration resource associated with a single topic. Among other things, use an event subscription to set event selection criteria to define the event collection available to a subscriber out of the total set of events present in a topic.

:::image type="content" source="media/pull-and-push-delivery-overview/topic-event-subscriptions.png" alt-text="Diagram showing a topic and associated event subscriptions." lightbox="media/pull-and-push-delivery-overview/topic-event-subscriptions-high-res.png" border="false":::

## Push delivery

The following resources support push delivery. Select the links to learn more about each resource.

- [System topics](system-topics.md). Use system topics to receive (system) events from Azure services.
- [Custom topics](custom-topics.md). Use custom topics when you want to publish your application’s events.
- [Domains](event-domains.md). Domains represent a group of domain topics typically associated with a single application that requires sending events to different groups of users, organizations, or applications. A common approach is to associate a domain topic with a group of target applications or users of an organization within the same tenant. An organization can be a team, a division in company, a company, and so on.
- [Partner topics](partner-events-overview.md). Use partner topics when you want to consume events from third-party [partners](partner-events-overview.md).

Configure an event subscription on a system, custom, or partner topic to specify a filtering criteria for events and to set a destination to one of the supported [event handlers](event-handlers.md).

The following diagram illustrates the resources that support push delivery with some of the supported event handlers.

:::image type="content" source="media/pull-and-push-delivery-overview/push-delivery.png" alt-text="High-level diagram showing all the topic types that support push delivery, namely System, Custom, Domain, and Partner topics." lightbox="media/pull-and-push-delivery-overview/push-delivery-high-res.png" border="false":::

>[!Note]
> For more information about push delivery on Event Grid namespaces, see [namespace-push-delivery-overview.md].

## Next steps

The following articles provide information on how to use Event Grid or provide additional information on concepts.

- [Learn about System Topics](system-topics.md)
- [Learn about Partner Topics](partner-events-overview.md)
- [Learn about Event Domains](event-domains.md)
- [Learn about event handlers](event-handlers.md)
- [Learn about event filtering](event-filtering.md)
- [Publish and subscribe using custom topics](custom-event-quickstart-portal.md).
- [Subscribe to storage events](blob-event-quickstart-portal.md)
- [Subscribe to partner events](subscribe-to-partner-events.md)

### Other useful links

- [Control plane and data plane SDKs](sdk-overview.md)
- [Data plane SDKs announcement](https://devblogs.microsoft.com/azure-sdk/event-grid-ga/) with a plethora of information, samples, and links
- [Quotas and limits](quotas-limits.md)
