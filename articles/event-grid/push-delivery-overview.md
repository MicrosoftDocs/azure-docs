---
ms.date: 04/21/2023
author: jfggdl
ms.author: jafernan
title: Introduction to push delivery
description: Learn about Event Grid's http push delivery and the resources that support them.
ms.topic: conceptual
---

# Push delivery with HTTP
This article builds on [What is Azure Event Grid?](overview.md) to provide essential information before you start using Event Grid’s pull and push delivery over HTTP. It covers fundamental concepts, resource models, and message delivery modes supported. At the end of this document, you find useful links to articles that guide you on how to use Event Grid and to articles that offer in-depth conceptual information.

>[!Important]
> This document helps you get started with Event Grid capabilities that use the HTTP protocol. This article is suitable for users who need to integrate applications on the cloud. If you require to communicate IoT device data, see [Overview of the MQTT Support in Azure Event Grid](mqtt-overview.md).

## Core concepts

### CloudEvents

Event Grid conforms to CNCF’s open standard [CloudEvents 1.0](https://github.com/cloudevents/spec) specification using the [HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/bindings/http-protocol-binding.md) with [JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md). It means that your solutions publish and consume event messages using a format like the following example:

```json
{
    "specversion" : "1.0",
    "type" : "com.yourcompany.order.created",
    "source" : "https://yourcompany.com/orders/",
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

#### What is an event?

An **event** is the smallest amount of information that fully describes something that happened in a system. We often refer to an event as shown above as a discrete event because it represents a distinct, self-standing fact about a system that provides an insight that can be actionable. Examples include: *com.yourcompany.Orders.OrderCreated*, *org.yourorg.GeneralLedger.AccountChanged*, *io.solutionname.Auth.MaximumNumberOfUserLoginAttemptsReached*.

>[!Note]
> We interchangeably use the terms **discrete events**, **cloudevents**, or just **events** to refer to those messages that inform about a change of a system state. 

For more information on events, see the Event Grid [Terminology](concepts.md#events).

#### Another kind of event

The user community also refers to events to those type of messages that carry a data point, such as a single reading from a device or a single click on a web application page. That kind of event is usually analyzed over a time window or event stream size to derive insights and take an action. In Event Grid’s documentation, we refer to that kind of event as **data point**, **streaming data**, or **telemetry**. They're a kind of data that Event Grid’s MQTT support and Azure Event Hubs usually handle.

### Topics and event subscriptions

Events published to Event Grid land on a **topic**, which is a resource that logically contains all events. An **event subscription** is a configuration resource associated with a single topic. Among other things, you use an event subscription to set event selection criteria to define the event collection available to a subscriber out of the total set of events present in a topic.

:::image type="content" source="media/pull-and-push-delivery-overview/topic-event-subscriptions.png" alt-text="Diagram showing a topic and associated event subscriptions." lightbox="media/pull-and-push-delivery-overview/topic-event-subscriptions-high-res.png" border="false":::

## Push and pull delivery

Using HTTP, Event Grid supports push and pull event delivery. With **push delivery**, you define a destination in an event subscription, a webhook or an Azure service, to which Event Grid sends events. Push delivery is supported in custom topics, system topics, domain topics and partner topics. With **pull delivery**, subscriber applications connect to Event Grid to consume events. Pull delivery is supported in topics within a namespace.

:::image type="content" source="media/pull-and-push-delivery-overview/push-pull-delivery.png" alt-text="High-level diagram showing push delivery and pull delivery with the kind of resources involved." lightbox="media/pull-and-push-delivery-overview/push-pull-delivery-high-res.png" border="false":::

### When to use push delivery vs. pull delivery 

The following are general guidelines to help you decide when to use pull or push delivery.

#### Pull delivery

- Your applications or services publish events. Event Grid doesn't yet support pull delivery when the source of the events is an [Azure service](event-schema-api-management.md?tabs=cloud-event-schema) or a [partner](partner-events-overview.md) (SaaS) system.
- You need full control as to when to receive events. For example, your application may not up all the time, not stable enough, or you process data at certain times.
- You need full control over event consumption. For example, a downstream service or layer in your consumer application has a problem that prevents you from processing events. In that case, the pull delivery API allows the consumer app to release an already read event back to the broker so that it can be delivered later.
- You want to use [private links](../private-link/private-endpoint-overview.md) when receiving events. This is possible with pull delivery.
- You don't have the ability to expose an endpoint and use push delivery, but you can connect to Event Grid to consume events.

#### Push delivery
- You need to receive events from Azure services, partner (SaaS) event sources or from your applications. Push delivery supports these types of event sources. 
- You want to avoid constant polling to determine that a system state change has occurred. You rather use Event Grid to send events to you at the time state changes happen.
- You have an application that can't make outbound calls. For example, your organization may be concerned about data exfiltration. However, your application can receive events through a public endpoint.

## Push delivery

Push delivery is supported for the following resources. Click on the links to learn more about each of them.

- [System topics](system-topics.md). Use system topics to receive (system) events from Azure services.
- [Custom topics](custom-topics.md). Use custom topics when you want to publish your application’s events.
- [Domains](event-domains.md). Domains represent a group of domain topics typically associated with a single application that requires sending events to different group of users, organizations, or applications. A common approach is to associate a domain topic with a group of target applications or users of an organization within the same tenant. An organization can be a team, a division in company, a company, etc.
- [Partner topics](partner-events-overview.md). Use partner topics when you want to consume events from third-party [partners](partner-events-overview.md).

Configure an event subscription on a system, custom, or partner topic to specify a filtering criteria for events and to set a destination to one of the supported [event handlers](event-handlers.md).
The following diagram illustrates the resources that support push delivery with some of the supported event handlers.

:::image type="content" source="media/pull-and-push-delivery-overview/push-delivery.png" alt-text="High-level diagram showing all the topic types that support push delivery, namely System, Custom, Domain, and Partner topics." lightbox="media/pull-and-push-delivery-overview/push-delivery-high-res.png" border="false":::

## Next steps

The following articles provide you with information on how to use Event Grid or provide you with additional information on concepts.

- [Learn about System Topics](system-topics.md)
- [Learn about Partner Topics](partner-events-overview.md)
- [Learn bout Event Domains](event-domains.md)
- [Learn about event handlers](event-handlers.md)
- [Learn about event filtering](event-filtering.md)
- [Publish and subscribe using custom topics](custom-event-quickstart-portal.md).
- [Subscribe to storage events](blob-event-quickstart-portal.md)
- [Subscribe to partner events](subscribe-to-partner-events.md)

### Other useful links
- [Control plane and data plane SDKs](sdk-overview.md)
- [Data plane SDKs announcement](https://devblogs.microsoft.com/azure-sdk/event-grid-ga/) with a plethora of information, samples, and links
- [Quotas and limits](quotas-limits.md)