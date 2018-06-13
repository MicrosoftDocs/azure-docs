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
ms.date: 05/22/2018
ms.author: shvija
#Customer intent: As a developer, how do I build data telemetry pipelines for real-time business scenarios?

---
# What is Azure Event Hubs?

Azure Event Hubs is a Big Data streaming service that ingests millions of events per second, and provides low latency and high throughput for real-time analytics, batch ingestion, and visualization. 

Following are common scenarios that we see Event Hubs used in,

- Anomaly detection (fraud/outliers)
- Application logging
- Analytics pipelines, such as clickstreams
- Live Dashboarding
- Archiving data
- Transaction processing
- User telemetry processing
- Device telemetry streaming 

## Why use Event Hubs?

Organizations need data-driven strategies to increase competitive advantage, or to analyze data to get valuable insights, Event Hubs provides a distributed stream processing platform with low latency and seamless integration with data and analytics services in and outside Azure to build a complete Big Data pipeline.

The common role that Event Hubs plays in solution architectures is the "front door" for an event pipeline, often called an *event ingestor*. It provides a synchronized time retention buffer decoupling the event producers from event consumers. 

Event Hubs provides message stream handling capability but has characteristics that are different from traditional enterprise messaging. Event Hubs capabilities are built around high throughput and event processing scenarios. The following figure shows the Event Hubs stream processing architecture:

![Event Hubs](./media/event-hubs-about/event_hubs_architecture.png)

## Fully managed PaaS 

Event Hubs is a managed service with no configuration or management overhead, so you focus on your business solutions. Event Hubs for Kafka Ecosystems give you the PaaS Kafka experience without having to manage, configure, or run your clusters.

## Scalable 

You can start with megabytes, and grow to gigabytes or terabytes of data streams. Event Hubs covers all streaming platform needs.

## Real-time and batching

Ingest, buffer, store, and process your stream in real time to get actionable insights. Event Hubs uses a partition consumer model allowing multiple applications to process the stream concurrently and letting you control the velocity of processing.

[Capture](event-hubs-capture-overview.md) your data in near-real time to your [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) or your [Azure Data Lake Store](https://azure.microsoft.com/services/data-lake-store/) for long-term retention or micro-batch processing. You can achieve this on the same stream you use for deriving real-time analytics. Setting up Capture is fast, there are no administrative costs to run it, and it scales automatically with Event Hubs throughput units. Event Hubs Capture enables you to focus on data processing rather than on data capture.


## Rich Ecosystem

Event Hubs for Kafka Ecosystems enable Apache Kafka (1.0 and above) clients and applications to talk to Event Hubs without having to manage any cluster. 
With a broad ecosystem available in various [languages (.NET, Java, Python, Go, Node.js)](https://github.com/Azure/azure-event-hubs), you can easily start processing your streams from Event Hubs. All supported client languages provide low-level integration.


## Next steps

To get started using Event Hubs, see the following articles:

* [Ingest into Event Hubs](event-hubs-quickstart-powershell.md)
* [Event Hubs features overview](event-hubs-features.md)


