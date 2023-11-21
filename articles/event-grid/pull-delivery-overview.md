---
ms.date: 11/15/2023
author: jfggdl
ms.author: jafernan
title: Introduction to pull delivery
description: Learn about Event Grid's http pull delivery and the resources that support them.
ms.topic: conceptual
ms.custom:
  - ignite-2023
---

# Pull delivery with HTTP

This article builds on the [What is Azure Event Grid?](overview.md) and on the Event Grid [concepts](concepts-event-grid-namespaces.md) article to provide essential information before you start using Event Grid’s pull delivery over HTTP. It covers fundamental concepts, resource models, and message delivery modes supported. At the end of this document, you find useful links to articles that guide you on how to use Event Grid and to articles that offer in-depth conceptual information.

>[!NOTE]
> This document helps you get started with Event Grid capabilities that use the HTTP protocol. This article is suitable for users who need to integrate applications on the cloud. If you require to communicate IoT device data, see [Overview of the MQTT Broker feature in Azure Event Grid](mqtt-overview.md).

## CloudEvents

Event Grid namespace topics accepts events that comply with the Cloud Native Computing Foundation (CNCF)’s open standard [CloudEvents 1.0](https://github.com/cloudevents/spec) specification using the [HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md) with [JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md). 

Consult the [CloudEvents concepts](concepts-event-grid-namespaces.md#cloudevents) for more information.

### CloudEvents content modes

The CloudEvents specification defines three [content modes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#13-content-modes) you can use: [binary](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#31-binary-content-mode), [structured](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#32-structured-content-mode), and [batched](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#33-batched-content-mode).

>[!IMPORTANT]
> With any content mode you can exchange text (JSON, text/*, etc.) or binary encoded event data. The binary content mode is not exclusively used for sending binary data.

The content modes aren't about the encoding you use, binary or text, but about how the event data and its metadata are described and exchanged. The structured content mode uses a single structure, for example, a JSON object, where both the context attributes and event data are together in the HTTP payload. The binary content mode separates context attributes, which are mapped to HTTP headers, and event data, which is the HTTP payload encoded according to the media type value in ```Content-Type```.

Consult [CloudEvents content modes](concepts-event-grid-namespaces.md#cloudevents-content-modes) for more information.

### Messages and events

A CloudEvent typically carries event data announcing an occurrence in a system, that is, a system state change. However, you could convey any kind of data when using CloudEvents. For example, you might want to use the CloudEvents exchange format to send a command message to request an action to a downstream application. Another example is when you're routing messages from Event Grid's MQTT broker to a topic. Under this scenario, you're routing an MQTT message wrapped up in a CloudEvents envelope.

## Pull delivery

With pull delivery, your application connects to Event Grid to read CloudEvents using queue-like semantics.

Pull delivery offers these event consumption benefits:

* Consume events at your own pace, at scale or at an ingress rate your application supports.

* Consume events at a time of your own choosing. For example, given business requirements, messages are processed at night.

* Consume events over a private link so that your data uses private IP space.

>[!Note]
>
>* Namespaces provide a simpler resource model featuring a single kind of topic. Currently, Event Grid supports publishing your own application events through namespace topics. You cannot consume events from Azure services or partner SaaS systems using namespace topics. You also cannot create system topics, domain topics or partner topics in a namespace.
>* Namespace topics support CloudEvents JSON format.

### Queue event subscriptions

When receiving events or using operations that manage event state, an application specifies a namespace HTTP endpoint, a topic name, and the name of a *queue* event subscription. A queue event subscription has its *deliveryMode* set to "*queue*". Queue event subscriptions are used to consume events using the pull delivery API.  For more information about how to create these resources, see create [namespaces](create-view-manage-namespaces.md), [topics](create-view-manage-namespace-topics.md), and [event subscriptions](create-view-manage-event-subscriptions.md).

You use an event subscription to define the filtering criteria for events and in doing so, you effectively define the set of events that are available for consumption through that event subscription. One or more subscriber (consumer) applications can connect to the same namespace endpoint and use the same topic and event subscription.

:::image type="content" source="media/pull-and-push-delivery-overview/pull-delivery.png" alt-text="High-level diagram of a publisher and consumer using an event subscription. Consumer uses pull delivery." lightbox="media/pull-and-push-delivery-overview/pull-delivery-high-res.png" border="false":::

### Pull delivery operations

Your application uses the following operations when working with pull delivery.

* A **receive** operation is used to read one or more events using a single request to Event Grid. By default, the broker waits for up to 60 seconds for events to become available. For example, events become available for delivery when they're first published. A successful receive request returns zero or more events. If events are available, it returns as many available events as possible up to the event count requested. Event Grid also returns a lock token for every event read.
* A **lock token** is a kind of handle that identifies an event that you can use to control its state.
* Once a consumer application receives an event and processes it, it  **acknowledges** that event. This operation instructs Event Grid to delete the event so it isn't redelivered to another client. The consumer application acknowledges one or more tokens with a single request by specifying their lock tokens before they expire.

In some other occasions, your consumer application might want to release or reject events.

* Your consumer application **releases** a received event to signal Event Grid that it isn't ready to process that event and to make it available for redelivery. It does so by calling the *release* operation with the lock tokens identifying the events to be returned back to Event Grid. Your application can control if the event should be released immediately or if a delay should be used before the event is available for redelivery.

* You could opt to **reject** an event if there's a condition, possibly permanent, that prevents your consumer application to process the event. For example, a malformed message can be rejected as it can't be successfully parsed. Rejected events are dead-lettered, if a dead-letter destination is available. Otherwise, they're dropped.

#### Scope on which pull delivery operations run

When you invoke a *receive*, *acknowledge*, *release*, *reject*, or *renew lock* operation, those actions are performed in the context of the event subscription. For example, if you acknowledge an event, that event is no longer available through the event subscription used when calling the *acknowledge* action. Other event subscription could still have the "same" event available. That is because an event subscription gets a copy of the events published. Those event copies are effectively distinct from each other across event subscriptions. Each event has its own state independent of other events.

[!INCLUDE [data-shape-of-events-delivered-with-pull-delivery](./includes/data-shape-when-delivering-with-pull-delivery.md)]

[!INCLUDE [differences-between-consumption-modes](./includes/differences-between-consumption-modes.md)]

## Next steps

The following articles provide you with information on how to use Event Grid or provide you with additional information on concepts.

* [Publish and subscribe to events using Namespace Topics](publish-events-using-namespace-topics.md).

### Other useful links

* [Control plane and data plane SDKs](sdk-overview.md).
* [Data plane SDKs announcement](https://devblogs.microsoft.com/azure-sdk/event-grid-ga/) with a plethora of information, samples, and links.
* [Quotas and limits](quotas-limits.md).
