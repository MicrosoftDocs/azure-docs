---
title: Concepts - Azure Event Grid IoT Edge | Microsoft Docs 
description: Concepts in Event Grid on IoT Edge.  
author: VidyaKukke
manager: rajarv
ms.author: vkukke
ms.reviewer: spelluru
ms.date: 07/08/2020
ms.topic: article
---

# Event Grid concepts

This article describes the main concepts in Azure Event Grid.

## Events

An event is the smallest amount of information that fully describes something that happened in the system. Every event has common information like: source of the event, time the event took place, and unique identifier. Every event also has specific information that is only relevant to the specific type of event. The support for an event of size up to 1 MB is currently in preview.

For the properties that are included in an event, see [Azure Event Grid event schema](event-schemas.md).

## Publishers

A publisher is the user or organization that decides to send events to Event Grid. You can publish events from your own application.

## Event sources

An event source is where the event happens. Each event source is related to one or more event types. For example, Azure Storage is the event source for blob created events. Your application is the event source for custom events that you define. Event sources are responsible for sending events to Event Grid.

## Topics

The event grid topic provides an endpoint where the source sends events. The publisher creates the event grid topic, and decides whether an event source needs one topic or more than one topic. A topic is used for a collection of related events. To respond to certain types of events, subscribers decide which topics to subscribe to.

When designing your application, you have the flexibility to decide on how many topics to create. For large solutions, create a custom topic for each category of related events. For example, consider an application that sends events related to modifying user accounts and processing orders. It's unlikely any event handler wants both categories of events. Create two custom topics and let event handlers subscribe to the one that interests them. For small solutions, you might prefer to send all events to a single topic. Event subscribers can filter for the event types they want.

See [REST API documentation](api.md) on how to manage topics in Event Grid.

## Event subscriptions

A subscription tells Event Grid which events on a topic you're interested in receiving. When creating the subscription, you provide an endpoint for handling the event. You can filter the events that are sent to the endpoint. 

See [REST API documentation](api.md) on how to manage subscriptions in Event Grid.

## Event handlers

From an Event Grid perspective, an event handler is the place where the event is sent. The handler takes further action to process the event. Event Grid supports several handler types. You can use a supported Azure service or your own web hook as the handler. Depending on the type of handler, Event Grid follows different mechanisms to guarantee the delivery of the event. If the destination event handler is an HTTP web hook, the event is retried until the handler returns a status code of `200 – OK`. For edge Hub, if the event is delivered without any exception, it is considered successful.

## Security

Event Grid provides security for subscribing to topics, and publishing topics. For more information, see [Event Grid security and authentication](security-authentication.md).

## Event delivery

If Event Grid can't confirm that an event has been received by the subscriber's endpoint, it redelivers the event. For more information, see [Event Grid message delivery and retry](delivery-retry.md).

## Batching

When using a custom topic, events must always be published in an array. For low throughput scenarios, the array will have only one value. For high volume use cases, we recommend that you batch several events together per publish to achieve higher efficiency. Batches can be up to 1 MB. Each event should still not be greater than 1 MB (preview).