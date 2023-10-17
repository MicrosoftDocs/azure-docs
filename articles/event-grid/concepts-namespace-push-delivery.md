---
title: Azure Event Grid concepts (push delivery) for namespaces
description: Describes Azure Event Grid and its concepts in the push delivery model. Defines several key components of Event Grid.
ms.topic: conceptual
ms.date: 10/12/2023
---

# Azure Event Grid push delivery for namespaces (Preview) - Concepts

This article describes the main concepts related to the new resource model that uses namespaces.

> [!NOTE]
> For Event Grid concepts related to push delivery exclusively used in custom, system, partner, and domain topics, see this [concepts](concepts.md) article.

## Events

An event is the smallest amount of information that fully describes something that happened in a system. Every event has common information like `source` of the event, `time` the event took place, and a unique identifier. Every event also has specific information that is only relevant to the specific type of event. For example, an event about a new file being created in Azure Storage has details about the file, such as the `lastTimeModified` value. An Event Hubs event has the `URL` of the Capture file. An event about a new order in your Orders microservice may have an `orderId` attribute and a `URL` attribute to the order’s state representation.

## CloudEvents

Event Grid uses CNCF’s open standard [CloudEvents 1.0](https://github.com/cloudevents/spec) specification using the [HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md) with the [JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md). The CloudEvents is an [extensible](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/primer.md#cloudevent-attribute-extensions) event specification with [documented extensions](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/documented-extensions.md) for specific requirements. When using Event Grid, CloudEvents is the preferred event format because of its well-documented use cases ([modes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#13-content-modes) for transferring events, [event formats](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#14-event-formats), etc.), extensibility, and improved interoperability. CloudEvents improves interoperability by providing a common event format for publishing and consuming events. It allows for uniform tooling and standard ways of routing & handling events.

The following table shows the current support for CloudEvents specification:

| CloudEvents content mode   | Supported?             |
|--------------|-----------|
| [Structured JSON](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#32-structured-content-mode) | Yes      |
| [Structured JSON batched](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#33-batched-content-mode)      | Yes  |
|[Binary](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#31-binary-content-mode) | Yes|

The maximum allowed size for an event is 1 MB. Events over 64 KB are charged in 64-KB increments. For the properties that are sent in an event, see [CloudEvents schema](cloud-event-schema.md).

## Publishers

A publisher is the application that sends events to Event Grid. It may be the same application where the events originated, the event source. You can publish events from your own application when using Namespace topics.

## Event sources

An event source is where the event happens. Each event source is related to one or more event types. For example, your application is the event source for custom events that you define. When using namespace topics, the event sources supported is your own applications.

## Namespaces

An Event Grid Namespace is a management container for the following resources:

| Resource   | Protocol supported |
| :--- | :---: |
| Namespace topics | HTTP |
| Topic Spaces | MQTT |
| Clients | MQTT |
| Client Groups | MQTT |
| CA Certificates | MQTT |
| Permission bindings | MQTT |

With an Azure Event Grid namespace, you can group now together related resources and manage them as a single unit in your Azure subscription.

A Namespace exposes two endpoints:

- An HTTP endpoint to support general messaging requirements using Namespace Topics.
- An MQTT endpoint for IoT messaging or solutions that use MQTT.
  
A Namespace also provides DNS-integrated network endpoints and a range of access control and network integration management features such as IP ingress filtering and private links. It's also the container of managed identities used for all contained resources that use them.

## Throughput units

The capacity of Azure Event Grid namespace is controlled by throughput units (TUs) and allows user to control capacity of their namespace resource for message ingress and egress. For more information, see [Azure Event Grid quotas and limits](quotas-limits.md).

## Topics

A topic holds events that have been published to Event Grid. You typically use a topic resource for a collection of related events. The only type of topic that's supported by the pull model is: **Namespace topic**.

## Namespace topics

Namespace topics are topics that are created within an Event Grid [namespace](#namespaces). The event source supported by namespace topic is your own application. When designing your application, you have to decide how many topics to create. For relatively large solutions, create a namespace topic for each category of related events. For example, consider an application that manages user accounts and another application about customer orders. It's unlikely that all event subscribers want events from both applications. To segregate concerns, create two namespace topics: one for each application. Let event handlers subscribe to the topic according to their requirements. For small solutions, you might prefer to send all events to a single topic. Event subscribers can filter for the event types they want.

Namespace topics support [pull delivery](pull-delivery-overview.md). See [when to use pull or push delivery](pull-delivery-overview.md#when-to-use-push-delivery-vs-pull-delivery) to help you decide if pull delivery is the right approach given your requirements.

## Event subscriptions

A subscription tells Event Grid which events on a namespace topic you're interested in receiving. You can filter the events consumers receive. You can filter by event type or event subject, for example. For more information on resource properties, look for control plane operations in the Event Grid [REST API](/rest/api/eventgrid).

> [!NOTE]
> The event subscriptions under a namespace topic feature a simplified resource model when compared to that used for custom, domain, partner, and system topics. For more information, see [create, view, and managed event subscriptions](create-view-manage-event-subscriptions.md#simplified-resource-model).

For an example of creating subscriptions for namespace topics, refer to:

- [Publish and consume messages using namespace topics using CLI](publish-events-using-namespace-topics.md)

## Batching

When using Namespace topics, you can publish a single event without using an array.

For both custom or namespace topics, your application should  batch several events together in an array to attain greater efficiency and higher throughput with a single publishing request. Batches can be up to 1 MB and the maximum size of an event is 1 MB.

## Next steps

- For an introduction to Event Grid, see [About Event Grid](overview.md).
- To get started using namespace topics, refer to [publish events using namespace topics](publish-events-using-namespace-topics.md).
