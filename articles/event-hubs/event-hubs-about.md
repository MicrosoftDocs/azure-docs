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
ms.date: 02/23/2018
ms.author: shvija;sethm

---
# What is Azure Event Hubs?

Azure Event Hubs is a Big Data streaming Platform as a Service (PaaS) that ingests millions of events per second, and provides low latency and high throughput for real-time analytics and visualization.

## Why use Event Hubs?

Your organization needs data-driven strategies to increase competitive advantage. You want to stream data or analyze real-time data to get valuable insights. Event Hubs provides a streaming platform with low latency and seamless integration with Azure services to build a complete Big Data pipeline.

Event Hubs event and telemetry handling capabilities make it especially useful for:

* Application instrumentation
* User experience or workflow processing
* Internet of Things (IoT) scenarios

For example, Event Hubs enables behavior tracking in mobile apps, traffic information from web farms, in-game event capture in console games, or telemetry collected from industrial machines, connected vehicles, or other devices.

## Overview

The common role that Event Hubs plays in solution architectures is the "front door" for an event pipeline, often called an *event ingestor*. An event ingestor is a component or service that sits between event publishers and event consumers to decouple the production of an event stream from the consumption of those events. The following figure depicts this architecture:

![Event Hubs](./media/event-hubs-about/event_hubs_full_pipeline.png)

Event Hubs provides message stream handling capability but has characteristics that are different from traditional enterprise messaging. Event Hubs capabilities are built around high throughput and event processing scenarios. As such, Event Hubs is different from [Azure Service Bus](https://azure.microsoft.com/services/service-bus/) messaging, and does not implement some of the capabilities that are available for [Service Bus messaging](/azure/service-bus-messaging/) entities, such as topics.

## Fully managed PaaS 

Event Hubs is a completely managed service with no configuration or management overhead, so you focus on your business solutions. 

## Scalable 

You can start low with megabytes, and grow to gigabytes or terabytes of data. Use shared resources or completely dedicated resources. Event Hubs covers all streaming platform needs.

## Real time and batch

[Event Hubs Capture](event-hubs-capture-overview.md) enables a single stream to support real-time and batch-based pipelines, and reduces the complexity of your solution. 

## Cross language

With clients available in various [languages (.NET, Java)](https://github.com/Azure/azure-event-hubs), you can easily send and receive data from Event Hubs. 

## Event Hubs Capture

[Event Hubs Capture](event-hubs-capture-overview.md) enables you to automatically deliver the streaming data in Event Hubs to an [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) or [Azure Data Lake Store](https://azure.microsoft.com/services/data-lake-store/) account of your choice, with the added flexibility of specifying a time or size interval. Setting up Capture is fast, there are no administrative costs to run it, and it scales automatically with Event Hubs throughput units. Event Hubs Capture enables you to focus on data processing rather than on data capture. 

## Next Steps

To get started using Event Hubs, see the following articles:

* [Event Hubs features overview](event-hubs-features.md)
* [Ingest into Event Hubs](https://review.docs.microsoft.com/en-us/azure/event-hubs/event-hubs-quickstart-namespace-powershell?branch=release-mvc-event-hubs)
* [Process events from Event Hubs](https://review.docs.microsoft.com/en-us/azure/event-hubs/event-hubs-quickstart-namespace-powershell?branch=release-mvc-event-hubs)


