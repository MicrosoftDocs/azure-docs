---
title: Azure Event Grid concepts
description: Describes Azure Event Grid and its concepts. Defines several key components of Event Grid.
services: event-grid
author: banisadr
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 08/10/2017
ms.author: babanisa
---

# Concepts in Azure Event Grid

The main concepts in Azure Event Grid are:

## Events

An event is the smallest amount of information that fully describes something that happened in the system.  Every event has common information like: source of the event, time the event took place, and unique identifier.  Every event also has specific information that is only relevant to the specific event. For example, an event about a new file being created in Azure Storage contains details about the file, such as the lastTimeModified value. Or, an event about a virtual machine rebooting contains the name of the virtual machine, and the reason for reboot.

## Event sources/publishers

An event source is where the event happens. For example, Azure Storage is the event source for blob created events. Azure VM Fabric is the event source for virtual machine events. Event sources are responsible for publishing events to Event Grid.

## Topics

Publishers categorize events into topics. The topic includes an endpoint where the publisher sends events. To respond to certain types of events, subscribers decide which topics to subscribe to. Topics also provide an event schema so that subscribers can discover how to consume the events appropriately.

System topics are built-in topics provided by Azure services. Custom topics are application and third-party topics.

## Event subscriptions

A subscription instructs Event Grid on which events on a topic a subscriber is interested in receiving.  A subscription also holds information on how events should be delivered to the subscriber.

## Event handlers

From an Event Grid perspective, an event handler is the place where the event is sent. The handler takes some further action to process the event.  Event Grid supports multiple subscriber types. Depending on the type of subscriber, Event Grid follows different mechanisms to guarantee the delivery of the event.  For HTTP webhook event handlers, the event is retried until the handler returns a status code of `200 – OK`. For Azure Storage Queue, the events are retried until the Queue service is able to successfully process the message push into the queue.

## Filters

When subscribing to a topic, you can filter the events that are sent to the endpoint. You can filter by event type, or subject pattern. For more information, see [Event Grid subscription schema](subscription-creation-schema.md).

## Security

Event provides security for subscribing to topics, and publishing topics. When subscribing, you must have adequate permissions on the resource or topic. When publishing, you must have a SAS token or key authentication for the topic. For more information, see [Event Grid security and authentication](security-authentication.md).

## Failed delivery

When Event Grid cannot confirm that an event has been received by the subscriber's endpoint, it redelivers the event. For more information, see [Event Grid message delivery and retry](delivery-and-retry.md).

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).