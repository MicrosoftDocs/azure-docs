---
title: Compare Azure messaging services
description: Describes the three Azure messaging services - Azure Event Grid, Event Hubs, and Service Bus. Recommends which service to use for different scenarios.
ms.topic: concept-article
ms.date: 03/19/2024
#customer intent: As an architect or a developer, I want to know when to use Azure Event Grid, Azure Event Hubs, and Azure Service Bus.
---

# Choose between Azure messaging services - Event Grid, Event Hubs, and Service Bus
Azure offers three services that assist with delivering events or messages throughout a solution. These services are: Azure Event Grid, Azure Event Hubs, Azure Service Bus.

Although they have some similarities, each service is designed for particular scenarios. This article describes the differences between these services, and helps you understand which one to choose for your application. In many cases, the messaging services are complementary and can be used together.

## Events vs. messages
There's an important distinction between services that deliver an event and services that deliver a message.

### Event
An event is a lightweight notification of a condition or a state change. The publisher of the event has no expectation about how the event is handled. The consumer of the event decides what to do with the notification. Events can be discrete units or part of a series.

Discrete events report change in a state and are actionable. To take the next step, the consumer only needs to know that something happened. The event data has information about what happened but doesn't have the data that triggered the event. For example, an event notifies consumers that a file was created. It might have general information about the file, but it doesn't have the file itself. Discrete events are ideal for serverless solutions that need to scale.

A series of events reports a condition and are analyzable. The events are time-ordered and interrelated. The consumer needs the sequenced series of events to analyze what happened.

### Message
A message is raw data produced by a service to be consumed or stored elsewhere. The message contains the data that triggered the message pipeline. The publisher of the message has an expectation about how the consumer handles the message. A contract exists between the two sides. For example, the publisher sends a message with the raw data, and expects the consumer to create a file from that data and send a response when the work is done.

Now, let's quickly review what Azure Event Grid, Azure Event Hubs, and Azure Service Bus are. 

## Azure Event Grid
Azure Event Grid is a highly scalable, fully managed Pub Sub message distribution service that offers flexible message consumption patterns using the Message Queueing Telemetry Transport (MQTT) and HTTP protocols. With Azure Event Grid, you can build data pipelines with device data, integrate applications, and build event-driven serverless architectures.

The service provides an eventing backbone that enables event-driven and reactive programming. It uses the publish-subscribe model. Publishers emit events, but have no expectation about how the events are handled. Subscribers decide on which events they want to handle.

Event Grid is deeply integrated with other Azure services and can be integrated with third-party services. It simplifies event consumption and lowers costs by eliminating the need for constant polling. Event Grid efficiently and reliably routes events from Azure and non-Azure resources. It distributes the events to registered subscriber endpoints. The event message has the information you need to react to changes in services and applications. Event Grid isn't a data pipeline, and doesn't deliver the actual object that was updated.

It has the following characteristics: 

- Dynamically scalable
- Low cost
- Serverless
- At least once delivery of an event

Event Grid is offered in two editions: **Azure Event Grid**, a fully managed PaaS service on Azure, and **Event Grid on Kubernetes with Azure Arc**, which lets you use Event Grid on your Kubernetes cluster wherever that is deployed, on-premises or on the cloud. For more information, see [Azure Event Grid overview](../event-grid/overview.md) and [Event Grid on Kubernetes with Azure Arc overview](../event-grid/kubernetes/overview.md).

## Azure Event Hubs
Azure Event Hubs is a big data streaming platform and event ingestion service. It can receive and process millions of events per second. It facilitates the capture, retention, and replay of telemetry and event stream data. The data can come from many concurrent sources. Event Hubs allows telemetry and event data to be made available to various stream-processing infrastructures and analytics services. It's available either as data streams or bundled event batches. This service provides a single solution that enables rapid data retrieval for real-time processing, and repeated replay of stored raw data. It can capture the streaming data into a file for processing and analysis.

It has the following characteristics:

- Low latency
- Can receive and process millions of events per second
- At least once delivery of an event

For more information, see [Event Hubs overview](../event-hubs/event-hubs-about.md).

## Azure Service Bus
Service Bus is a fully managed enterprise message broker with message queues and publish-subscribe topics. The service is intended for enterprise applications that require transactions, ordering, duplicate detection, and instantaneous consistency. Service Bus enables cloud-native applications to provide reliable state transition management for business processes. When handling high-value messages that can't be lost or duplicated, use Azure Service Bus. This service also facilitates highly secure communication across hybrid cloud solutions and can connect existing on-premises systems to cloud solutions.

Service Bus is a brokered messaging system. It stores messages in a "broker" (for example, a queue) until the consuming party is ready to receive the messages. It has the following characteristics:

- Reliable asynchronous message delivery (enterprise messaging as a service) that requires polling. If you're using Service Bus and you need to receive messages without having to poll the queue, you can achieve it by using a **long polling** receive operation using the TCP-based protocols that Service Bus supports. 
- Advanced messaging features like first-in and first-out (FIFO), batching/sessions, transactions, dead-lettering, temporal control, routing and filtering, and duplicate detection
- At least once delivery of a message
- Optional ordered delivery of messages

For more information, see [Service Bus overview](../service-bus-messaging/service-bus-messaging-overview.md).

## Comparison of services
The following table compares the three services: Event Grid, Event Hubs, and Service Bus. 

| Service | Purpose | Type | When to use |
| ------- | ------- | ---- | ----------- |
| Event Grid | Reactive programming | Event distribution (discrete events) | React to status changes |
| Event Hubs | Big data pipeline | Event streaming (series) | Telemetry and distributed data streaming |
| Service Bus | High-value enterprise messaging | Message | Order processing and financial transactions |

## Use the services together
In some cases, you use the services side by side to fulfill distinct roles. For example, an e-commerce site can use Service Bus to process the order, Event Hubs to capture site telemetry, and Event Grid to respond to events like an item was shipped.

In other cases, you link them together to form an event and data pipeline. You use Event Grid to respond to events in the other services. For an example of using Event Grid with Event Hubs to migrate data to Azure Synapse Analytics, see [Stream big data into Azure Synapse Analytics](../event-grid/event-hubs-integration.md). The following image shows the workflow for streaming the data.

:::image type="content" source="./media/compare-messaging-services/overview.svg" alt-text="Diagram showing how Event Hubs, Service Bus, and Event Grid can be connected together.":::

## Related content
See the following articles: 
- [Asynchronous messaging options in Azure](/azure/architecture/guide/technology-choices/messaging)
- [Events, Data Points, and Messages - Choosing the right Azure messaging service for your data](https://azure.microsoft.com/blog/events-data-points-and-messages-choosing-the-right-azure-messaging-service-for-your-data/).

