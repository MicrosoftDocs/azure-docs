---
title: Azure Event Grid concepts
description: Describes Azure Event Grid and its concepts. Defines several key components of Event Grid.
ms.topic: conceptual
ms.date: 05/08/2023
---

# Concepts in Azure Event Grid

This article describes the main concepts in Azure Event Grid.

## Events

An event is the smallest amount of information that fully describes something that happened in a system. Every event has common information like `source` of the event, `time` the event took place, and a unique identifier. Every event also has specific information that is only relevant to the specific type of event. For example, an event about a new file being created in Azure Storage has details about the file, such as the `lastTimeModified` value. An Event Hubs event has the `URL` of the Capture file. An event about a new order in your Orders microservice may have an `orderId` attribute and a `URL` attribute to the order’s state representation. 

### CloudEvents

Event Grid uses CNCF’s open standard [CloudEvents 1.0](https://github.com/cloudevents/spec) specification using the [HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md) with the [JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md). The CloudEvents is an [extensible](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/primer.md#cloudevent-attribute-extensions) event specification with [documented extensions](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/documented-extensions.md) for specific requirements. When using Event Grid, CloudEvents is the preferred event format because of its well-documented use cases ([modes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#13-content-modes) for transferring events, [event formats](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#14-event-formats), etc.), extensibility, and improved interoperability. CloudEvents improves interoperability by providing a common event format for publishing and consuming events. It allows for uniform tooling and standard ways of routing & handling events.

The following table shows the current support for CloudEvents specification:

| CloudEvents content mode   | Supported?             | 
|--------------|-----------|
| [Structured JSON](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#32-structured-content-mode) | Yes      |        
| [Structured JSON batched](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#33-batched-content-mode)      | Yes  |
|[Binary](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md#31-binary-content-mode) | No|

The maximum allowed size for an event is 1 MB. Events over 64 KB are charged in 64-KB increments. For the properties that are sent in an event, see [CloudEvents schema](cloud-event-schema.md).

#### Other formats

Event Grid also supports the proprietary [Event Grid schema](event-schema.md) format for [system events publishers](event-schema-api-management.md?tabs=cloud-event-schema). You can configure Event Grid to [deliver events using the CloudEvents](cloud-event-schema.md#event-grid-for-cloudevents) format.

## Publishers

A publisher is the application that sends events to Event Grid. It may be the same application where the events originated, the [event source](#event-sources). Azure services publish events to Event Grid to announce an occurrence in their service. You can publish events from your own application. Organizations that host services outside of Azure can publish events through Event Grid too.

## Event sources

An event source is where the event happens. Each event source is related to one or more event types. For example, Azure Storage is the event source for blob created events. IoT Hub is the event source for device created events. Your application is the event source for custom events that you define. Event sources are responsible for sending events to Event Grid.

## Partners

A partner is a kind of publisher that sends events from its system to make them available to Azure customers. A partner is typically a SaaS or [ERP](https://en.wikipedia.org/wiki/Enterprise_resource_planning?) provider that integrates with Azure Event Grid to help customers realize event-driven use cases across platforms. Partners not only can publish events to Azure Event Grid, but they can also receive events from it. These capabilities are enabled through the [Partner Events](partner-events-overview.md) feature.

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

With an Azure Event Grid namespace you can group now together related resources and manage them as a single unit in your Azure subscription.

A Namespace exposes two endpoints:

- An HTTP endpoint to support general messaging requirements using  Namespace Topics.
- An MQTT endpoint for IoT messaging or solutions that use MQTT.

A Namespace also provides DNS-integrated network endpoints and a range of access control and network integration management features such as IP ingress filtering and private links. It is also the container of managed identities used for all contained resources that use them.

### Throughput units

The throughput capacity of Azure Event Grid namespace is controlled by throughput units (TUs) and allows user to control capacity of their namespace resource. See [Azure Event Grid quotas and limits](quotas-limits.md) for more information.

## Topics

A topic holds events that have been published to Event Grid. You typically use a topic resource for a collection of related events. To respond to certain types of events, subscribers (an Azure service or other applications) decide which topics to subscribe to. There are several kinds of topics: Namespace topics, custom topics, system topics, and partner topics.

### Namespace topics

Namespace topics are topics used with your applications that are created within an Event Grid [namespace](#namespaces). When designing your application, you have to decide how many topics to create. For relatively large solutions, create a namespace topic for each category of related events. For example, consider an application that manages user accounts and another application about customer orders. It's unlikely that all event subscribers want events from both applications. To segregate concerns, create two namespace topics: one for each application. Let event handlers subscribe to the topic according to their requirements. For small solutions, you might prefer to send all events to a single topic. Event subscribers can filter for the event types they want.

Namespace topics support [pull delivery](pull-and-push-delivery-overview.md#pull-delivery-1). Consult [when to use pull or push delivery](pull-and-push-delivery-overview.md#when-to-use-push-delivery-vs-pull-delivery) to help you decide if pull delivery is the right approach given your requirements.

### Custom topics

Custom topics are also topics that are used with your applications. They are self-standing resources that are **not** part of a [namespace](#namespaces). They were the first kind of topic designed to build event-driven integrations for custom applications. As a self-standing resource, they expose their own endpoint to which events are published. The same guidance provided in [Namespace topics](#namespace-topics) with respect to the number of topics you can create applies to custom topics.

Custom topics support [push delivery](pull-and-push-delivery-overview.md#push-delivery-1). Consult [when to use pull or push delivery](pull-and-push-delivery-overview.md#when-to-use-push-delivery-vs-pull-delivery) to help you decide if push delivery is the right approach given your requirements. You may also want to refer to article [Custom topics](custom-topics.md).

### System topics

System topics are built-in topics provided by Azure services such as Azure Storage, Azure Event Hubs, and Azure Service Bus. You can  create system topics in your Azure subscription and subscribe to them. For more information, see [Overview of system topics](system-topics.md). 

### Partner topics

Partner topics are a kind of topic used to subscribe to events published by a [partner](#partners).  The feature that enables this type of integration is called [Partner Events](partner-events-overview.md). Through that integration, you get a partner topic where events from a partner system are made available. Once you have a partner topic, you create an [event subscription](#event-subscriptions) as you would do for any other kind of topic.

## Event subscriptions

A subscription tells Event Grid which events on a topic you're interested in receiving. When creating a subscription, you provide an endpoint for handling the event. Endpoints can be a webhook or an Azure service resource. You can filter the events that are sent to an endpoint. You can filter by event type or event subject, for example. For more information, see [Event Subscriptions](subscribe-through-portal.md) and [CloudEvents schema](cloud-event-schema.md).

Event subscriptions for custom, system, and partner topics as well as Domains feature the same resource properties. Event subscriptions for Namespace topic expose a slightly different set of configuration properties. For more information on resource properties, look for control plane operations in the Event Grid [REST API](/rest/api/eventgrid).

For examples of creating subscriptions for custom, system, and partner topics as well as Domains, see:

- [Create custom topic and subscribe to events using Azure CLI](scripts/cli-subscribe-custom-topic.md)
- [Azure PowerShell samples for Event Grid](powershell-samples.md)
- [Azure Resource Manager templates for Event Grid](template-samples.md)

For information about getting your current Event Grid subscriptions, see [Query Event Grid subscriptions](query-event-subscriptions.md).

For an example of creating subscriptions for namespace topics, refer to:

- [Publish and consume messages using namespace topics using CLI](publish-events-using-namespace-topics.md)

## Event subscription expiration

You can set an expiration time for event subscriptions associated to custom, system, partner, and domain topics as well as to Domain subscriptions. The event subscription is automatically expired after that date. Set an expiration for event subscriptions that are only needed for a limited time and you don't want to worry about cleaning up those subscriptions. For example, when creating an event subscription to test a scenario, you might want to set an expiration.

For an example of setting an expiration, see [Subscribe with advanced filters](how-to-filter-events.md#subscribe-with-advanced-filters).

## Event handlers

From an Event Grid perspective, an event handler is the place where the event is sent when using [push delivery](pull-and-push-delivery-overview.md#push-delivery-1). The handler takes some further action to process the event. When using push delivery, Event Grid supports several handler types. You can use a supported Azure service, or your own webhook as the handler. Depending on the type of handler, Event Grid follows different mechanisms to guarantee the delivery of the event. For HTTP webhook event handlers, the event is retried until the handler returns a status code of `200 – OK`. For Azure Storage Queue, the events are retried until the Queue service successfully processes the message push into the queue.

For information about delivering events to any of the supported Event Grid handlers, see [Event handlers in Azure Event Grid](event-handlers.md).

## Security

Event Grid provides security for subscribing to topics and when  publishing events to topics. When subscribing, you must have adequate permissions on the Event Grid topic. If using push delivery, the event handler is an Azure service, and a managed identity is used to authenticate Event Grid, the managed identity should have an appropriate RBAC role. For example, if sending events to Event Hubs, the managed identity used in the event subscription should be a member of the Event Hubs Data Sender role. When publishing, you must have a SAS token or key authentication for the topic. For more information, see [Event Grid security and authentication](security-authentication.md).

## Event delivery

If Event Grid can't confirm that an event has been received by the subscriber's endpoint when using push delivery, it redelivers the event. For more information, see [Event Grid message delivery and retry](delivery-and-retry.md).

## Batching

When you use a custom topic, events must always be published in an array. This can be a batch of one for low-throughput scenarios.

When using Namespace topics, you can publish a single event without using an array.

For both custom or namespace topics, your application should  batch several events together in an array to attain greater efficiency and higher throughput with a single publishing request. Batches can be up to 1 MB and the maximum size of an event is 1 MB.

## Inline event type definitions

If you are a [partner](partner-events-overview-for-partners.md), you can define the event types that you are making available to customers when you create a Channel. With inline event type definitions, subscribers can easily filter events given their event type when configuring an event subscription.

## Next steps

- For an introduction to Event Grid, see [About Event Grid](overview.md).
- To get started using custom topics, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
- To get started using namespace topics, refer to [publish events using namespace topics](publish-events-using-namespace-topics.md).
