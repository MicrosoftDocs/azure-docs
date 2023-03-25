---
title: Azure Event Grid concepts
description: Describes Azure Event Grid and its concepts. Defines several key components of Event Grid.
ms.topic: conceptual
ms.date: 03/24/2023
---

# Concepts in Azure Event Grid

This article describes the main concepts in Azure Event Grid.

## Events

An event is the smallest amount of information that fully describes something that happened in the system. Every event has common information like: source of the event, time the event took place, and unique identifier. Every event also has specific information that is only relevant to the specific type of event. For example, an event about a new file being created in Azure Storage has details about the file, such as the `lastTimeModified` value. Or, an Event Hubs event has the URL of the Capture file. 

The maximum allowed size for an event is 1 MB. Events over 64 KB are charged in 64-KB increments. For the properties that are sent in an event, see [CloudEvents schema](cloud-event-schema.md).

## Publishers

A publisher is the user or organization that sends events to Event Grid. Microsoft publishes events for several Azure services. You can publish events from your own application. Organizations that host services outside of Azure can publish events through Event Grid.

## Partners

A partner is a kind of publisher that sends events from its system to make them available to Azure customers. A partner is typically a SaaS or [ERP](https://en.wikipedia.org/wiki/Enterprise_resource_planning?) provider that integrates with Azure Event Grid to help customers realize event-driven use cases across platforms. Partners not only can publish events to Azure Event Grid, but they can also receive events from it. These capabilities are enabled through the [Partner Events](partner-events-overview.md) feature.

## Event sources

An event source is where the event happens. Each event source is related to one or more event types. For example, Azure Storage is the event source for blob created events. IoT Hub is the event source for device created events. Your application is the event source for custom events that you define. Event sources are responsible for sending events to Event Grid.

For information about implementing any of the supported Event Grid sources, see [Event sources in Azure Event Grid](overview.md#event-sources).

## Topics

Event Grid topic provides an endpoint where the source sends events. The publisher creates the Event Grid topic, and decides whether an event source needs one topic or more than one topic. A topic is used for a collection of related events. To respond to certain types of events, subscribers decide which topics to subscribe to.

### System topics
System topics are built-in topics provided by Azure services such as Azure Storage, Azure Event Hubs, and Azure Service Bus. You can  create system topics in your Azure subscription and subscribe to them. For more information, see [Overview of system topics](system-topics.md). 

### Custom topics
Custom topics are application and third-party topics. When you create or are assigned access to a custom topic, you see that custom topic in your subscription. For more information, see [Custom topics](custom-topics.md). When designing your application, you have flexibility when deciding how many topics to create. For large solutions, create a custom topic for each category of related events. For example, consider an application that sends events related to modifying user accounts and processing orders. It's unlikely any event handler wants both categories of events. Create two custom topics and let event handlers subscribe to the one that interests them. For small solutions, you might prefer to send all events to a single topic. Event subscribers can filter for the event types they want.

### Partner topics
Partner topics are a kind of topic used to subscribe to events published by a [partner](#partners).  The feature that enables this type of integration is called [Partner Events](partner-events-overview.md). Through that integration, you get a partner topic where events from a partner system are made available. Once you have a partner topic, you create an [event subscription](#event-subscriptions) as you would do for any other kind of topic.

## Event subscriptions

A subscription tells Event Grid which events on a topic you're interested in receiving. When creating the subscription, you provide an endpoint for handling the event. You can filter the events that are sent to the endpoint. You can filter by event type or event subject, for example. For more information, see [Event Subscriptions](subscribe-through-portal.md) and [CloudEvents schema](cloud-event-schema.md).

For examples of creating subscriptions, see:

* [Azure CLI samples for Event Grid](scripts/cli-subscribe-custom-topic.md)
* [Azure PowerShell samples for Event Grid](powershell-samples.md)
* [Azure Resource Manager templates for Event Grid](template-samples.md)

For information about getting your current Event Grid subscriptions, see [Query Event Grid subscriptions](query-event-subscriptions.md).

## Event subscription expiration
The event subscription is automatically expired after that date. Set an expiration for event subscriptions that are only needed for a limited time and you don't want to worry about cleaning up those subscriptions. For example, when creating an event subscription to test a scenario, you might want to set an expiration. 

For an example of setting an expiration, see [Subscribe with advanced filters](how-to-filter-events.md#subscribe-with-advanced-filters).

## Event handlers

From an Event Grid perspective, an event handler is the place where the event is sent. The handler takes some further action to process the event. Event Grid supports several handler types. You can use a supported Azure service, or your own webhook as the handler. Depending on the type of handler, Event Grid follows different mechanisms to guarantee the delivery of the event. For HTTP webhook event handlers, the event is retried until the handler returns a status code of `200 – OK`. For Azure Storage Queue, the events are retried until the Queue service successfully processes the message push into the queue.

For information about delivering events to any of the supported Event Grid handlers, see [Event handlers in Azure Event Grid](event-handlers.md).

## Security

Event Grid provides security for subscribing to topics, and publishing topics. When subscribing, you must have adequate permissions on the resource or Event Grid topic. When publishing, you must have a SAS token or key authentication for the topic. For more information, see [Event Grid security and authentication](security-authentication.md).

## Event delivery

If Event Grid can't confirm that an event has been received by the subscriber's endpoint, it redelivers the event. For more information, see [Event Grid message delivery and retry](delivery-and-retry.md).

## Batching

When you use a custom topic, events must always be published in an array. This can be a batch of one for low-throughput scenarios, however, for high volume use cases, it's recommended that you batch several events together per publish to achieve higher efficiency. Batches can be up to 1 MB and the maximum size of an event is 1 MB. 

## Inline event type definitions
Event Grid lets you define the types of events that will be published to a channel. With inline event type definitions, subscribers will be able to easily filter by event type when creating an event subscription. 

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
