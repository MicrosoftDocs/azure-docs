---
title: Azure messaging services comparison
description: Compares Azure Event Grid, Event Hubs, and Service Bus. Recommends which service to use for different scenarios.
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 11/15/2017
ms.author: tomfitz
---

# Choose between Azure services that deliver messages

Azure offers three services that assist with delivering event messages throughout a solution. These services are:

* [Event Grid](/azure/event-grid/)
* [Event Hubs](/azure/event-hubs/)
* [Service Bus](/azure/service-bus-messaging/)

Although they have some similarities, each service is designed for particular scenarios. This article describes the differences between these services, and helps you understand which one to choose for your application. In many cases, the messaging services are complementary and can be used together.

## Event vs. message services

There is an important distinction to note between services that deliver an event and services that deliver a message.

### Event

An event is a lightweight notification of an action or a state change. The event data contains information about what happened but does not have the data that triggered the event. For example, an event notifies subscribers that a file was created. It may contain general information about the file, but it does not contain the file itself. Generally, events trigger event handlers to act in real time.

### Message

A message is raw data produced by a service to be consumed or stored elsewhere. The message contains the data that triggered the message pipeline. This message can be anything from an e-commerce order to user telemetry. Unlike an event notification, the publisher of a message may expect a response. For example, a message contains the raw data but expects the next part of the system to create a file from that data.

## Comparison of services

| Service | Purpose | Type | When to use |
| ------- | ------- | ---- | ----------- |
| Event Grid | Reactive programming | Event distribution | React to status changes |
| Event Hubs | Big data pipeline | Event streaming | Telemetry and distributed data streaming |
| Service Bus | High-value enterprise messaging | Message | Order processing and financial transactions |

### Event Grid

Event Grid is an eventing backplane that enables event-driven, reactive programming. It uses a publish-subscribe model. Publishers emit events, but have no expectation about which events are handled. Subscribers decide which events they want to handle.

Event Grid is deeply integrated with Azure services and can be integrated with third-party services. It simplifies event consumption and lowers costs by eliminating the need for constant polling. Event Grid efficiently and reliably routes events from Azure and non-Azure resources. It distributes the events to registered subscriber endpoints. The event message contains the information you need to react to changes in services and applications. Event Grid is not a data pipeline, and does not deliver the actual object that was updated.

It has the following characteristics:

* dynamically scalable
* low cost
* serverless

### Event Hubs

Azure Event Hubs is a big data pipeline. It facilitates the capture, retention, and replay of telemetry and event stream data. The data can come from many concurrent sources. Event Hubs allows telemetry and event data to be made available to a variety of stream-processing infrastructures and analytics services. It is available either as data streams or bundled event batches. This service provides a single solution that enables rapid data retrieval for real-time processing as well as repeated replay of stored raw data. It can capture the streaming data into a file for processing and analysis.

It has the following characteristics:

* low latency
* capable of receiving and processing millions of events per second

### Service Bus

Service Bus is intended for traditional enterprise applications. These enterprise applications require transactions, ordering, duplicate detection, and instantaneous consistency. Service Bus enables cloud-native applications to provide reliable state transition management for business processes. When handling high-value messages that cannot be lost or duplicated, use Azure Service Bus. Service Bus also facilitates highly secure communication across hybrid cloud solutions and can connect existing on-premises systems to cloud solutions.

Service Bus is a brokered messaging system. It stores messages in a "broker" (for example, a queue) until the consuming party is ready to receive the messages.

It has the following characteristics:

* reliable asynchronous message delivery (enterprise messaging as a service) that requires polling
* advanced messaging features like FIFO, batching/sessions, transactions, dead-lettering, temporal control, routing and filtering, and duplicate detection

## Use the services together

In some cases, you use the services side by side to fulfill distinct roles. For example, an ecommerce site can use Service Bus to process the order, Event Hubs to capture site telemetry, and Event Grid to respond to events like an item was shipped.

In other cases, you link them together to form an event and data pipeline. You use Event Grid to respond to events in the other services. For an example of using Event Grid with Event Hubs to migrate data to a data warehouse, see [Stream big data into a data warehouse](event-grid-event-hubs-integration.md). The following image shows the workflow for streaming the data.

![Stream data overview](./media/compare-messaging-services/overview.png)

## Next steps

* For more information about the Azure messaging services, see the blog post [Events, Data Points, and Messages - Choosing the right Azure messaging service for your data](https://azure.microsoft.com/blog/events-data-points-and-messages-choosing-the-right-azure-messaging-service-for-your-data/).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To get started with Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
* To get started with Event Hubs, see [Create an Event Hubs namespace and an event hub using the Azure portal](../event-hubs/event-hubs-create.md).
* To get started with Service Bus, see [Create a Service Bus namespace using the Azure portal](../service-bus-messaging/service-bus-create-namespace-portal.md).