---
title: Azure Event Grid concepts (push delivery) in Event Grid basic
description: Describes Azure Event Grid concepts that pertain to push delivery. Defines several key components of Event Grid.
ms.topic: conceptual
ms.date: 05/24/2023
---

# Azure Event Grid's push delivery - concepts

This article describes the main Event Grid concepts related to push delivery.

> [!NOTE]
> For Event Grid concepts related to the new resource model that uses namespaces, see this [concepts](concepts-pull-delivery.md) article.

## Events

An event is the smallest amount of information that fully describes something that happened in a system. Every event has common information like `source` of the event, `time` the event took place, and a unique identifier. Every event also has specific information that is only relevant to the specific type of event. For example, an event about a new file being created in Azure Storage has details about the file, such as the `lastTimeModified` value. An Event Hubs event has the `URL` of the Capture file. An event about a new order in your Orders microservice may have an `orderId` attribute and a `URL` attribute to the order’s state representation. 

## CloudEvents

Event Grid uses CNCF’s open standard [CloudEvents 1.0](https://github.com/cloudevents/spec) specification using the [HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md) with the [JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md). The CloudEvents is an [extensible](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/primer.md#cloudevent-attribute-extensions) event specification with [documented extensions](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/documented-extensions.md) for specific requirements. When using Event Grid, CloudEvents is the preferred event format because of its well-documented use cases ([modes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#13-content-modes) for transferring events, [event formats](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#14-event-formats), etc.), extensibility, and improved interoperability. CloudEvents improves interoperability by providing a common event format for publishing and consuming events. It allows for uniform tooling and standard ways of routing & handling events.

The following table shows the current support for CloudEvents specification:

| CloudEvents content mode   | Supported?             | 
|--------------|-----------|
| [Structured JSON](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#32-structured-content-mode) | Yes      |        
|[Binary](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#31-binary-content-mode) | No|

The maximum allowed size for an event is 1 MB. Events over 64 KB are charged in 64-KB increments. For the properties that are sent in an event, see [CloudEvents schema](cloud-event-schema.md).

## Other formats

Event Grid also supports the proprietary [Event Grid schema](event-schema.md) format for [system events publishers](event-schema-api-management.md?tabs=cloud-event-schema). You can configure Event Grid to [deliver events using the CloudEvents](cloud-event-schema.md#event-grid-for-cloudevents) format.

## Publishers

A publisher is the application that sends events to Event Grid. It may be the same application where the events originated, the [event source](#event-sources). Azure services publish events to Event Grid to announce an occurrence in their service. You can publish events from your own application. Organizations that host services outside of Azure can publish events through Event Grid too.

## Event sources

An event source is where the event happens. Each event source is related to one or more event types. For example, Azure Storage is the event source for blob created events. IoT Hub is the event source for device created events. Your application is the event source for custom events that you define. Event sources are responsible for sending events to Event Grid.

## Partners

A partner is a kind of publisher that sends events from its system to make them available to Azure customers. A partner is typically a SaaS or [ERP](https://en.wikipedia.org/wiki/Enterprise_resource_planning?) provider that integrates with Azure Event Grid to help customers realize event-driven use cases across platforms. Partners not only can publish events to Azure Event Grid, but they can also receive events from it. These capabilities are enabled through the [Partner Events](partner-events-overview.md) feature.

## Topics

A topic holds events that have been published to Event Grid. You typically use a topic resource for a collection of related events. To respond to certain types of events, subscribers (an Azure service or other applications) decide which topics to subscribe to. There are several kinds of topics: custom topics, system topics, and partner topics.

## Custom topics

Custom topics are also topics that are used with your applications. They were the first kind of topic designed to build event-driven integrations for custom applications. As a self-standing resource, they expose their own endpoint to which events are published.

Custom topics support [push delivery](push-delivery-overview.md). Consult [when to use pull or push delivery](pull-delivery-overview.md#when-to-use-push-delivery-vs-pull-delivery) to help you decide if push delivery is the right approach given your requirements. You may also want to refer to article [Custom topics](custom-topics.md).

## System topics

System topics are built-in topics provided by Azure services such as Azure Storage, Azure Event Hubs, and Azure Service Bus. You can  create system topics in your Azure subscription and subscribe to them. For more information, see [Overview of system topics](system-topics.md).

## Partner topics

Partner topics are a kind of topic used to subscribe to events published by a [partner](#partners).  The feature that enables this type of integration is called [Partner Events](partner-events-overview.md). Through that integration, you get a partner topic where events from a partner system are made available. Once you have a partner topic, you create an [event subscription](#event-subscriptions) as you would do for any other kind of topic.

## Event subscriptions

> [!NOTE]
> For information on event subscriptions under a namespace topic see this [concepts](concepts-pull-delivery.md) artcle.

A subscription tells Event Grid which events on a topic you're interested in receiving. When creating a subscription, you provide an endpoint for handling the event. Endpoints can be a webhook or an Azure service resource. You can filter the events that are sent to an endpoint. You can filter by event type or event subject, for example. For more information, see [Event subscriptions](subscribe-through-portal.md) and [CloudEvents schema](cloud-event-schema.md). Event subscriptions for custom, system, and partner topics as well as Domains feature the same resource properties. 

For examples of creating subscriptions for custom, system, and partner topics as well as Domains, see:

- [Create custom topic and subscribe to events using Azure CLI](scripts/cli-subscribe-custom-topic.md)
- [Azure PowerShell samples for Event Grid](powershell-samples.md)
- [Azure Resource Manager templates for Event Grid](template-samples.md)

For information about getting your current Event Grid subscriptions, see [Query Event Grid subscriptions](query-event-subscriptions.md).

## Event subscription expiration

You can set an expiration time for event subscriptions associated to custom, system, partner, and domain topics as well as to Domain subscriptions. The event subscription is automatically expired after that date. Set an expiration for event subscriptions that are only needed for a limited time and you don't want to worry about cleaning up those subscriptions. For example, when creating an event subscription to test a scenario, you might want to set an expiration.

For an example of setting an expiration, see [Subscribe with advanced filters](how-to-filter-events.md#subscribe-with-advanced-filters).

## Event handlers

From an Event Grid perspective, an event handler is the place where the event is sent when using [push delivery](push-delivery-overview.md). The handler takes some further action to process the event. When using push delivery, Event Grid supports several handler types. You can use a supported Azure service, or your own webhook as the handler. Depending on the type of handler, Event Grid follows different mechanisms to guarantee the delivery of the event. For HTTP webhook event handlers, the event is retried until the handler returns a status code of `200 – OK`. For Azure Storage Queue, the events are retried until the Queue service successfully processes the message push into the queue.

For information about delivering events to any of the supported Event Grid handlers, see [Event handlers in Azure Event Grid](event-handlers.md).

## Security

Event Grid provides security for subscribing to topics and when  publishing events to topics. When subscribing, you must have adequate permissions on the Event Grid topic. If using push delivery, the event handler is an Azure service, and a managed identity is used to authenticate Event Grid, the managed identity should have an appropriate RBAC role. For example, if sending events to Event Hubs, the managed identity used in the event subscription should be a member of the Event Hubs Data Sender role. When publishing, you must have a SAS token or key authentication for the topic. For more information, see [Event Grid security and authentication](security-authentication.md).

## Event delivery

If Event Grid can't confirm that an event has been received by the subscriber's endpoint when using push delivery, it redelivers the event. For more information, see [Event Grid message delivery and retry](delivery-and-retry.md).

## Batching

When you use a custom topic, events must always be published in an array. This can be a batch of one for low-throughput scenarios.

## Inline event type definitions

If you're a [partner](partner-events-overview-for-partners.md), you can define the event types that you're making available to customers when you create a Channel. With inline event type definitions, subscribers can easily filter events given their event type when configuring an event subscription.

## Availability zones

Azure availability zones are physically separate locations within each Azure region that are tolerant to local failures. They're connected by a high-performance network with a round-trip latency of less than 2 milliseconds. Each availability zone is composed of one or more data centers equipped with independent power, cooling, and networking infrastructure. If one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones. For more information about availability zones, see [Regions and availability zones](../availability-zones/az-overview.md).

## Next steps

- For an introduction to Event Grid, see [About Event Grid](overview.md).
- To get started using custom topics, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).