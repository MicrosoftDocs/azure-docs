---
ms.date: 12/16/2024
author: robece
ms.author: robece
title: Concepts for Event Grid namespace topics
description: General concepts of Event Grid namespace topics and their main functionality such as pull and push delivery.
ms.topic: concept-article
# Customer intent: I want to know concepts of Azure Event Grid namespaces. 
---

# Azure Event Grid namespace concepts

This article introduces you to the main concepts and functionality associated to namespace topics.

## Events
An **event** is the smallest amount of information that fully describes something that happened in a system. We often refer to an event as a discrete event because it represents a distinct, self-standing fact about a system that provides an insight that can be actionable. Every event has common information like `source` of the event, `time` the event took place, and a unique identifier. Every event also has a `type`, which usually is a unique identifier that describes the kind of announcement the event is used for. 

For example, an event about a new file being created in Azure Storage has details about the file, such as the `lastTimeModified` value. An Event Hubs event has the URL of the captured file. An event about a new order in your Orders microservice might have an `orderId` attribute and a URL attribute to the order’s state representation. A few more examples of event types include: `com.yourcompany.Orders.OrderCreated`, `org.yourorg.GeneralLedger.AccountChanged`, `io.solutionname.Auth.MaximumNumberOfUserLoginAttemptsReached`. 

Here's a sample event:

```json
{
    "specversion" : "1.0",
    "type" : "com.yourcompany.order.created",
    "source" : "/orders/account/123",
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


### Another kind of event
The user community also refers as "events" to messages that carry a data point, such as a single device reading or a click on a web application page. That kind of event is usually analyzed over a time window to derive insights and take an action. In Event Grid’s documentation, we refer to that kind of event as a **data point**, **streaming data**, or simply as **telemetry**. Among other types of messages, this kind of events is used with Event Grid’s Message Queuing Telemetry Transport (MQTT) broker feature.

## Support for CloudEvents
Event Grid namespace topics accepts events that comply with the Cloud Native Computing Foundation (CNCF)’s open standard [CloudEvents 1.0](https://github.com/cloudevents/spec) specification using the [HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md) with [JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md). A CloudEvent is a kind of message that contains what is being communicated, referred to as event data, and metadata about it. The event data in event-driven architectures typically carries the information announcing a system state change. The CloudEvents metadata is composed of a set of attributes that provide contextual information about the message like where it originated (the source system), its type, etc. 

For more information, see [Support for CloudEvents schema](namespaces-cloud-events.md).

## Publishers

A publisher is the application that sends events to Event Grid. It could be the same application where the events originated, the event source. You can publish events from your own application when using namespace topics.

## Event sources

An event source is where the event happens. Each event source supports one or more event types. For example, your application is the event source for custom events that your system defines. When using namespace topics, the event sources supported are your own applications.

## Namespaces

An Event Grid namespace is a management container for the following resources:

| Resource   | Protocol supported |
| :--- | :---: |
| Namespace topics | HTTP |
| Topic Spaces | MQTT |
| Clients | MQTT |
| Client Groups | MQTT |
| CA Certificates | MQTT |
| Permission bindings | MQTT |

With an Azure Event Grid namespace, you can group related resources and manage them as a single unit in your Azure subscription. It gives you a unique fully qualified domain name (FQDN). 

A Namespace exposes two endpoints:

* An HTTP endpoint to support general messaging requirements using namespace topics.
* An MQTT endpoint for IoT messaging or solutions that use MQTT.
  
A namespace also provides DNS-integrated network endpoints. It also provides a range of access control and network integration management features such as public IP ingress filtering and private links. It's also the container of managed identities used for contained resources in the namespace.

Here are a few more points about namespaces:

- Namespace is a tracked resource with `tags` and `location` properties, and once created, it can be found on `resources.azure.com`.  
- The name of the namespace can be 3-50 characters long. It can include alphanumeric, and hyphen(-), and no spaces.  
- The name needs to be unique per region.


## Throughput units

Throughput units (TUs) define the ingress and egress event rate capacity in namespaces. For more information, see [Azure Event Grid quotas and limits](quotas-limits.md).

## Topics

A topic holds events that have been published to Event Grid. You typically use a topic resource for a collection of related events. We often referred to topics inside a namespace as **namespace topics**.

## Namespace topics
Namespace topics are topics that are created within an Event Grid namespace. Your application publishes events to an HTTP namespace endpoint specifying a namespace topic where published events are logically contained. When designing your application, you have to decide how many topics to create. For relatively large solutions, create a namespace topic for each category of related events. For example, consider an application that manages user accounts and another application about customer orders. It's unlikely that all event subscribers want events from both applications. To segregate concerns, create two namespace topics: one for each application. Let event consumers subscribe to the topic according to their requirements. For small solutions, you might prefer to send all events to a single topic.

Namespace topics support [pull delivery](pull-delivery-overview.md#pull-delivery) and [push delivery](namespace-push-delivery-overview.md). See [when to use pull or push delivery](pull-delivery-overview.md#push-and-pull-delivery) to help you decide if pull delivery is the right approach given your requirements.

## Event subscriptions

An event subscription is a configuration resource associated with a single topic. Among other things, you use an event subscription to set the event selection criteria to define the event collection available to a subscriber out of the total set of events available in a topic. You can filter events according to the subscriber's requirements. For example, you can filter events by their event type. You can also define filter criteria on event data properties if using a JSON object as the value for the *data* property. For more information on resource properties, look for control plane operations in the Event Grid [REST API](/rest/api/eventgrid).

:::image type="content" source="media/pull-and-push-delivery-overview/topic-event-subscriptions-namespace.png" alt-text="Diagram showing a topic and associated event subscriptions." lightbox="media/pull-and-push-delivery-overview/topic-event-subscriptions-namespace.png" border="false":::

For an example of creating subscriptions for namespace topics, see [Publish and consume messages using namespace topics using CLI](publish-events-using-namespace-topics.md).

> [!NOTE]
> The event subscriptions under a namespace topic feature a simplified resource model when compared to that used for custom, domain, partner, and system topics (Event Grid Basic). For more information, see Create, view, and manage [event subscriptions](create-view-manage-event-subscriptions.md#simplified-resource-model).


## Pull delivery

With pull delivery, your application connects to Event Grid to read messages using queue-like semantics. As applications connect to Event Grid to consume events, they are in control of the event consumption rate and its timing. Consumer applications can also use private endpoints when connecting to Event Grid to read events using private IP space.

Pull delivery supports the following operations for reading messages and controlling message state: *receive*, *acknowledge*, *release*, *reject*, and *renew lock*. For more information, see [pull delivery overview](pull-delivery-overview.md).

[!INCLUDE [data-shape-of-events-delivered-with-pull-delivery](./includes/data-shape-when-delivering-with-pull-delivery.md)]

## Push delivery

With push delivery, Event Grid sends events to a destination configured in a *push* (delivery mode in) event subscription. It provides a robust retry logic in case the destination isn't able to receive events.

>[!IMPORTANT]
>Event Grid namespaces' push delivery currently supports **Azure Event Hubs** as a destination. In the future, Event Grid namespaces will support more destinations, including all destinations supported by Event Grid Basic.

### Event Hubs event delivery

Event Grid uses Event Hubs SDK to send events to Event Hubs using [AMQP](https://www.amqp.org/about/what). Events are sent as a byte array with every element in the array containing a CloudEvent.

[!INCLUDE [differences-between-consumption-modes](./includes/differences-between-consumption-modes.md)]

## Related content

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To get started using namespace topics, refer to [publish events using namespace topics](publish-events-using-namespace-topics.md).
