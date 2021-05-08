---
title: Azure Event Grid on Kubernetes - Concepts
description: This article explains core concepts of Azure Event Grid on Kubernetes with Azure Arc (Preview)
author: spelluru
manager: JasonWHowell
ms.author: spelluru
ms.date: 05/04/2021
ms.topic: conceptual
---

# Event Grid on Kubernetes - Concepts
This article describes the main concepts in Azure Event Grid for Kubernetes with Azure Arc (Preview).

## Events
An event is a data record that announces a fact about the operation of a software system. Typically, an event announces a state change because of a signal raised by the system or a signal observed by the system. Events contain two types of information: 

- [Event data](https://github.com/cloudevents/spec/blob/master/spec.md#event-data) that represents the occurrence of a state change. 
- [Context attributes](https://github.com/cloudevents/spec/blob/master/spec.md#context-attributes) that provide contextual information about the occurrence of the event.     

    Both event data and context attributes can be used for filtering events. 

Event Grid on Kubernetes supports [CloudEvents](https://github.com/cloudevents/spec/tree/master) schema specification. Here's an example of an event that uses the CloudEvents schema. Event Grid supports an event of size up to 1 MB.

```json
[{
       "specVersion": "1.0",
       "type" : "orderCreated",
       "source": "myCompanyName/us/webCommerceChannel/myOnlineCommerceSiteBrandName",
       "id" : "eventId-n",
       "time" : "2020-12-25T20:54:07+00:00",
       "subject" : "account/acct-123224/order/o-123456",
       "dataSchema" : "1.0",
       "data" : {
          "orderId" : “123”,
          “orderType” : “PO”,
          “reference” : “https://www.myCompanyName.com/orders/123”
      }
}]
```

## Source
The source attribute describes the context in which the event occurred. The source may be the originator of events. However, in some cases, there are producers that create and publish events. And, these producers are distinct from the source. For simplicity, this article assumes that the source is the producer of the events. 

Each event source produces events of one or more event types. As the source of events, an application defines a set of related events to announce its state changes. Every event has common information such as the source of the event, time the event took place, and a unique identifier. Every event also has specific information that's only relevant to the specific type of event. The support for an event of size up to 1 MB is currently in preview.

For the properties that are included in an event, see [CloudEvents schema](event-schemas.md#cloudevent-schema).

## Publishers
Event publishers are applications or systems that send events to Event Grid to be delivered to event subscribers.

## Topics
A topic is a form of input channel that exposes an endpoint to which publishers send events to Event Grid.

A topic can be used for a collection of related events. You could create a topic for each category of related events. In some cases, the source can be used to organize events into categories because sources are usually associated with a set of closely related event types (“MyApp.OrderCreated”, “MyApp.OderDeleted”, “MyApp.OrderRejected”, and so on.). 

Consider an application that sends events related to managing user accounts and processing orders. It's unlikely that an event subscriber is interested in consuming both categories of events. Create two custom topics and let event handlers subscribe to the one that interests them. For small solutions, you might prefer to send all events to a single topic. 

## Event subscribers
Event subscribers are software systems such as microservices that expose endpoints to which Event Grid delivers events. 

## Event subscriptions
An event subscription tells Event Grid which events on a topic you are interested in receiving (event filtering) and where to send them (event routing). When creating an event subscription, you provide an endpoint for handling the event. You can select the events that you want to be delivered to your endpoint by configuring filter clauses on the event subscription. 

## Event handlers
An event handler is a software system that exposes an endpoint to which events are sent. The handler receives the event and takes actions to process the event. Event Grid supports several handler types. As the handler, you can use a supported Azure service hosted on Kubernetes or Azure, or your own solution that exposes a web hook (endpoint) wherever that's hosted. Depending on the type of handler, Event Grid follows different mechanisms to guarantee the delivery of the event. If the destination event handler is an HTTP web hook, the event is retried until the handler returns a status code of 200 – OK. 

## SAS authentication
Event Grid on Kubernetes provides SAS key-based authentication for publishing events to topics.

## Event delivery
Event Grid on Kubernetes provides a reliable delivery and retry mechanism. If Event Grid cannot confirm that an event has been received by the event handler endpoint, it redelivers the event. For more information, see Event Grid message delivery and retry.

## Batch event publishing
When using a topic, events must always be published in an array. For low throughput scenarios, the array will have only one event. For high volume use cases, we recommend that you batch several events together per publish to achieve higher efficiency. Batches can be up to 1 MB. Each event should still not be greater than 1 MB.

## Next steps
To get started, see [Create topics and subscriptions](create-topic-subscription.md).