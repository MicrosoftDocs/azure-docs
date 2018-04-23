---
title: Event Hubs overview | Microsoft Docs
description: Overview and what is Azure Event Hubs
services: event-hubs
documentationcenter: .net
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid:
ms.service: event-hubs
ms.devlang: na
ms.topic: overview
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/23/2018
ms.author: shvija

---
# What is Azure Event Hubs?

Azure Event Hubs is a Big Data streaming service that ingests millions of events per second, and provides low latency and high throughput for real-time analytics and visualization.

Event Hubs is used in the following scenarios:

- Anomaly detection (fraud/outliers)
- Application logging
- Analytics pipelines, such as clickstreams
- Live dashboarding
- Archiving data
- Transaction processing
- User telemetry processing
- Device telemetry streaming 

## Why use Event Hubs?

If your organization needs data-driven strategies to increase competitive advantage, or you want to stream or analyze data to get valuable insights, Event Hubs provides a streaming platform with low latency and seamless integration with Azure services to build a complete Big Data pipeline.

The common role that Event Hubs plays in solution architectures is the "front door" for an event pipeline, often called an *event ingestor*. An event ingestor is a component or service that sits between event publishers and event consumers to decouple the production of an event stream from the consumption of those events. 

Event Hubs provides message stream handling capability but has characteristics that are different from traditional enterprise messaging. Event Hubs capabilities are built around high throughput and event processing scenarios. The following figure shows the Event Hubs stream processing architecture:

![Event Hubs](./media/event-hubs-about/event_hubs_architecture.png)

## Fully managed PaaS 

Event Hubs is a managed service with no configuration or management overhead, so you focus on your business solutions. 

## Scalable 

You can start low with megabytes, and grow to gigabytes or terabytes of data streams. Event Hubs covers all streaming platform needs.

## Batching

Event Hubs supports real time and microbatch streaming. Microbatching is enabled by using [Event Hubs Capture](event-hubs-capture-overview.md), which enables a single stream to support batch-based pipelines, and reduces the complexity of your solution.

[Capture](event-hubs-capture-overview.md) enables you to automatically deliver the streaming data in Event Hubs to an [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) or [Azure Data Lake Store](https://azure.microsoft.com/services/data-lake-store/) account of your choice, with the added flexibility of specifying a time or size interval. Setting up Capture is fast, there are no administrative costs to run it, and it scales automatically with Event Hubs throughput units. Event Hubs Capture enables you to focus on data processing rather than on data capture. 

## Rich ecosystem

With a broad ecosystem available in various [languages (.NET, Java)](https://github.com/Azure/azure-event-hubs), you can easily send and receive data from Event Hubs. All supported client languages provide low-level integration.

## Next steps

To get started using Event Hubs, see the following articles:

* [Ingest into Event Hubs](event-hubs-quickstart-powershell.md)
* [Event Hubs features overview](event-hubs-features.md)


