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

There are the five main concepts in Azure Event Grid:

## Events

This is the smallest amount of information that fully describes something that happened in the system.  Every event typically has common information like: source of the event, time the event took place, and unique identifier.  Every event also has specific information that is only relevant to the specific event. For example, an event about a new file being created in Azure Storage contains details about the file, such as the lastTimeModified value. Or, an event about a virtual machine rebooting contains the name of the virtual machine, and the reason for reboot.

## Event Sources

An event source is typically the system where events take place, where events happen. For example, Azure Storage is the event source for blob created events. Azure VM Fabric is the event source for virtual machine events.  Event sources are responsibile for publishing events to Event Grid.

## Topics

Events are categorized into topics, so that subscribers can decide appropriately which topics to subscribe depending on the type of events they are interested in.  Topics also provide an event schema so that subscribers can discover how to consume the events appropriately.

## Subscriptions

A subscription instructs Azure Event Grid on which events on a Topic a subscriber is interested in receiving.  A subscription is also the artifact that holds configuration on how events should be delivered to the subscriber.

## Event Handlers / Subscribers

Event Handler and Subscriber will be used interchangeably in this document.  From Event Grid perspective, a subscriber is the final place where the events are going and some further action is being taken to successfully process events.  Event Grid support multiple subscriber types and depending on the subscriber, Event Grid will follow different mechanisms to guarantee the delivery of the event.  For example, in the case of Http WebHook event handlers, the event is retried until the handler returns a status code of 200 – OK; in the case of the events going to an Azure Storage Queue, the events are retried until the Queue service is able to successfully process the message push into the queue.