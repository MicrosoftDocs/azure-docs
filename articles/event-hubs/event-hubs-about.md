---
title: What is Azure Event Hubs? | Microsoft Docs
description: Learn about Azure Event Hubs, a Big Data streaming service that ingests millions of events per second.
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt

ms.service: event-hubs
ms.topic: overview
ms.custom: mvc
ms.date: 08/01/2018
ms.author: shvija
#Customer intent: As a developer, I want to understand how Event Hubs can help me load and stream large volumes of data into Azure for real-time and batch business scenarios.

---

# What is Azure Event Hubs?

Azure Event Hubs is a Big Data streaming platform and event ingestion service, capable of receiving and processing millions of events per second. Event Hubs can process and store events, data, or telemetry produced by distributed software and devices. Data sent to an event hub can be transformed and stored using any real-time analytics provider or batching/storage adapters. 

Event Hubs is used in some of the following common scenarios:

- Anomaly detection (fraud/outliers)
- Application logging
- Analytics pipelines, such as clickstreams
- Live dashboarding
- Archiving data
- Transaction processing
- User telemetry processing
- Device telemetry streaming 

## Why use Event Hubs?

Data is valuable only when there is an easy way to process and get timely insights from data sources. Event Hubs provides a distributed stream processing platform with low latency and seamless integration, with data and analytics services inside and outside Azure to build a complete Big Data pipeline.

Event Hubs represents the "front door" for an event pipeline, often called an *event ingestor* in solution architectures. An event ingestor is a component or service that sits between event publishers and event consumers to decouple the production of an event stream from the consumption of those events. Event Hubs provides a unified streaming platform with time retention buffer, decoupling the event producers from event consumers. 

The following sections describe key features of the Azure Event Hubs service: 

## Fully managed PaaS 

Event Hubs is a managed service with little configuration or management overhead, so you focus on your business solutions. [Event Hubs for Apache Kafka ecosystems](event-hubs-for-kafka-ecosystem-overview.md) gives you the PaaS Kafka experience without having to manage, configure, or run your clusters.

## Support for real-time and batch processing

Ingest, buffer, store, and process your stream in real time to get actionable insights. Event Hubs uses a [partitioned consumer model](event-hubs-features.md#partitions), enabling multiple applications to process the stream concurrently and letting you control the velocity of processing.

[Capture](event-hubs-capture-overview.md) your data in near-real time in an [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) or [Azure Data Lake Store](https://azure.microsoft.com/services/data-lake-store/) for long-term retention or micro-batch processing. You can achieve this on the same stream you use for deriving real-time analytics. Setting up Capture is fast, there are no administrative costs to run it, and it scales automatically with Event Hubs [throughput units](event-hubs-features.md#throughput-units). Event Hubs Capture enables you to focus on data processing rather than on data capture.

Azure Event Hubs also integrates with [Azure Functions](/azure/azure-functions/) for a serverless architecture.

## Scalable 

With Event Hubs, you can start with data streams in megabytes, and grow to gigabytes or terabytes. The [Auto-inflate](event-hubs-auto-inflate.md) feature is one of the many options available to scale the number of throughput units to meet your usage needs. 

## Rich ecosystem

[Event Hubs for Apache Kafka ecosystems](event-hubs-for-kafka-ecosystem-overview.md) enables [Apache Kafka (1.0 and above)](https://kafka.apache.org/) clients and applications to talk to Event Hubs without having to manage any clusters.
 
With a broad ecosystem available in various [languages (.NET, Java, Python, Go, Node.js)](https://github.com/Azure/azure-event-hubs), you can easily start processing your streams from Event Hubs. All supported client languages provide low-level integration.

## Key architecture components

Event Hubs provides message stream handling capability but has characteristics that are different from traditional enterprise messaging. Event Hubs capabilities are built around high throughput and event processing scenarios. Event Hubs contains the following [key components](event-hubs-features.md):

- **Event producers**: Any entity that sends data to an event hub. Event publishers can publish events using HTTPS or AMQP 1.0 or Apache Kafka (1.0 and above)
- **Partitions**: Each consumer only reads a specific subset, or partition, of the message stream.
- **Consumer groups**: A view (state, position, or offset) of an entire event hub. Consumer groups enable multiple consuming applications to each have a separate view of the event stream, and to read the stream independently at their own pace and with their own offsets.
- **Throughput units**: Pre-purchased units of capacity that control the throughput capacity of Event Hubs.
- **Event receivers**: Any entity that reads event data from an event hub. All Event Hubs consumers connect via the AMQP 1.0 session, and events are delivered through the session as they become available. All Kafka consumers connect via the Kafka protocol 1.0 and later.

The following figure shows the Event Hubs stream processing architecture:

![Event Hubs](./media/event-hubs-about/event_hubs_architecture.png)


## Next steps

To get started using Event Hubs, see the following articles:

* [Ingest into Event Hubs](event-hubs-quickstart-portal.md)
* [Event Hubs features overview](event-hubs-features.md)
* [Frequently asked questions](event-hubs-faq.md)


