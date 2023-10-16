---
ms.date: 05/24/2023
author: jfggdl
ms.author: jafernan
title: Introduction to pull delivery
description: Learn about Event Grid's http pull delivery and the resources that support them.
ms.topic: conceptual
---

# Pull delivery with HTTP (Preview)

This article builds on [What is Azure Event Grid?](overview.md) to provide essential information before you start using Event Grid’s pull delivery over HTTP. It covers fundamental concepts, resource models, and message delivery modes supported. At the end of this document, you find useful links to articles that guide you on how to use Event Grid and to articles that offer in-depth conceptual information.

>[!NOTE]
> This document helps you get started with Event Grid capabilities that use the HTTP protocol. This article is suitable for users who need to integrate applications on the cloud. If you require to communicate IoT device data, see [Overview of the MQTT Support in Azure Event Grid](mqtt-overview.md).

[!INCLUDE [pull-preview-note](./includes/pull-preview-note.md)]

## Core concepts

### CloudEvents

Event Grid conforms to CNCF’s open standard [CloudEvents 1.0](https://github.com/cloudevents/spec) specification using the [HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md) with [JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md). This means that your solutions publish and consume event messages using a format like the following example:

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

An **event** is the smallest amount of information that fully describes something that happened in a system. We often refer to an event as shown above as a discrete event because it represents a distinct, self-standing fact about a system that provides an insight that can be actionable. Examples include: *com.yourcompany.Orders.OrderCreated*, *org.yourorg.GeneralLedger.AccountChanged*, *io.solutionname.Auth.MaximumNumberOfUserLoginAttemptsReached*.

>[!Note]
> We interchangeably use the terms **discrete events**, **cloudevents**, or just **events** to refer to those messages that inform about a change of a system state.

For more information on events, see Event Grid [Terminology](concepts.md#events).

#### Another kind of event

The user community also refers to events to those type of messages that carry a data point, such as a single reading from a device or a single click on a web application page. That kind of event is usually analyzed over a time window or event stream size to derive insights and take an action. In Event Grid’s documentation, we refer to that kind of event as **data point**, **streaming data**, or **telemetry**. They're a kind of data that Event Grid’s MQTT support and Azure Event Hubs usually handle.

### Topics and event subscriptions

Events published to Event Grid land on a **topic**, which is a resource that logically contains all events. An **event subscription** is a configuration resource associated with a single topic. Among other things, you use an event subscription to set event selection criteria to define the event collection available to a subscriber out of the total set of events present in a topic.

:::image type="content" source="media/pull-and-push-delivery-overview/topic-event-subscriptions-namespace.png" alt-text="Diagram showing a topic and associated event subscriptions." lightbox="media/pull-and-push-delivery-overview/topic-event-subscriptions-namespace.png" border="false":::

## Pull delivery

Pull delivery is available through [namespace topics](concepts.md#topics), which are topics that you create inside a [namespace](concepts-pull-delivery.md#namespaces). Your application publishes CloudEvents to a single namespace HTTP endpoint specifying the target topic.

>[!Note]
> - Namespaces provide a simpler resource model featuring a single kind of topic. Currently, Event Grid supports publishing your own application events through namespace topics. You cannot consume events from Azure services or partner SaaS systems using namespace topics. You also cannot create system topics, domain topics or partner topics in a namespace.
>- Key-based (local) authentication is currently supported for namespace topics.
>- Namespace topics support CloudEvents JSON format.

You use an event subscription to define the filtering criteria for events and in doing so, you effectively define the set of events that are available for consumption. One or more subscriber (consumer) applications connect to the same namespace endpoint specifying the topic and event subscription from which to receive events.

:::image type="content" source="media/pull-and-push-delivery-overview/pull-delivery.png" alt-text="High-level diagram of a publisher and consumer using an event subscription. Consumer uses pull delivery." lightbox="media/pull-and-push-delivery-overview/pull-delivery-high-res.png" border="false":::

One or more consumers connects to Event Grid to receive events.

- A **receive** operation is used to read one or more events using a single request to Event Grid. The broker waits for up to 60 seconds for events to become available. For example new events available because they were just published. A successful receive request returns zero or more events. If events are available, it returns as many available events as possible up to the event count requested. Event Grid also returns a lock token for every event read.
- A **lock token** is a kind of handle that identifies an event for event state control purposes.
- Once a consumer application receives an event and processes it, it  **acknowledges** the event. This instructs Event Grid to delete the event so it isn't redelivered to another client. The consumer application acknowledges one or more tokens with a single request by specifying their lock tokens before they expire.

In some other occasions, your consumer application may want to release or reject events.

- Your consumer application **releases** a received event to signal Event Grid that it isn't ready to process the event and to make it available for redelivery.
- You may want to **reject** an event if there's a condition, possibly permanent, that prevents your consumer application to process the event. For example, a malformed message can be rejected as it can't be successfully parsed. Rejected events are dead-lettered, if a dead-letter destination is available. Otherwise, they're dropped.

[!INCLUDE [pull-preview-note](./includes/differences-between-consumption-modes.md)]

## Next steps

The following articles provide you with information on how to use Event Grid or provide you with additional information on concepts.

- Learn about [Namespaces](concepts-pull-delivery.md#namespaces)
- Learn about [Namespace Topics](concepts-pull-delivery.md#namespace-topics) and [Event Subscriptions](concepts.md#event-subscriptions)
- [Publish and subscribe to events using Namespace Topics](publish-events-using-namespace-topics.md)

### Other useful links

- [Control plane and data plane SDKs](sdk-overview.md)
- [Data plane SDKs announcement](https://devblogs.microsoft.com/azure-sdk/event-grid-ga/) with a plethora of information, samples, and links
- [Quotas and limits](quotas-limits.md)
