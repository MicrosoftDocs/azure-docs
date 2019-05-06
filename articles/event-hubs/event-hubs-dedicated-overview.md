---
title: Overview of dedicated event hubs - Azure Event Hubs | Microsoft Docs
description: This article provides an overview of dedicated Azure Event Hubs, which offers single-tenant deployments of event hubs.
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid:
ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.custom: seodec18
ms.date: 12/06/2018
ms.author: shvija

---
# Overview of Event Hubs Dedicated

Azure Event Hubs clusters offer single-tenant deployments for customers with the most demanding streaming needs. This single-tenant offering has a guaranteed 99.99% SLA. It's available only on the Dedicated pricing tier.

An Event Hubs cluster can ingress millions of events per second with guaranteed capacity and subsecond latency. Namespaces and event hubs created within the dedicated cluster include all the features of the Standard offering and more, but without any ingress limits. It also includes the [Event Hubs Capture](event-hubs-capture-overview.md) feature at no additional cost. You can use it to automatically batch and log data streams to Azure Storage or Azure Data Lake.

Dedicated clusters are provisioned and billed by capacity units (CUs). CUs are a preallocated amount of CPU and memory resources. You can purchase 1, 2, 4, 8, 12, 16, or 20 CUs for each cluster. How much you can ingest and stream per CU depends on factors such as the number of producers and consumers, the payload shape, and the egress rate.

For more information, see the table with the benchmark results.

## Why use Event Hubs Dedicated?

Event Hubs Dedicated offers three benefits for customers who need enterprise-level capacity.

#### Single-tenancy guarantees capacity for better performance

A dedicated cluster guarantees capacity at full scale. It can ingress up to gigabytes of streaming data with fully durable storage and subsecond latency to accommodate bursts in traffic.

#### Inclusive and exclusive access to features 
The Dedicated offering includes features like Capture at no additional cost. It also offers exclusive access to upcoming features like BYOK. The service also manages load balancing, OS updates, security patches, and partitioning. With these capabilities, you can spend less time on infrastructure maintenance and more time on building client-side features.

#### Cost savings
At high ingress volumes, a cluster costs significantly less per hour than if you purchase a comparable quantity of throughput units (TUs) in the Standard offering. A high volume is >100 TUs.


## Event Hubs Standard vs. Dedicated

The following table compares the available service tiers of Event Hubs. The Event Hubs Dedicated offering is billed by a fixed monthly price compared to usage pricing for most features of Standard. The Dedicated tier offers all the features of the Standard plan, but with enterprise-scale capacity for customers with demanding workloads.

| Feature | Standard | Dedicated |
| --- |:---:|:---:|
| Ingress events | Pay per million events | Included |
| Throughput unit (1 MB/sec ingress, 2 MB/sec egress) | Pay per hour | Included |
| Message size | 1 MB | 1 MB |
| Partitions | 40 per namespace | 2,000 per CU |
| Consumer groups | 20 per event hub | 1,000 per event hub |
| Maximum bandwidth | 20 TUs (up to 40 TUs)	| 20 CUs |
| Brokered connections | 1,000 included | 100,000 included |
| Message retention | One day included | Up to seven days included |
| Capture | Pay per hour | Included |

## What can I achieve with a cluster?

For an Event Hubs cluster, how much you can ingest and stream depends on your producers, your consumers, the rate at which you ingest and process, and much more.

The following table shows the benchmark results that were achieved during testing.

| Payload shape | Receivers | Ingress bandwidth| Ingress messages | Egress bandwidth | Egress messages | Total TUs | TUs per CU |
| ------------- | --------- | ---------------- | ------------------ | ----------------- | ------------------- | --------- | ---------- |
| Batches of 100x1KB | 2 | 400 MB/sec | 400,000 messages/sec | 800 MB/sec | 800,000 messages/sec | 400 TUs | 100 TUs | 
| Batches of 10x10KB | 2 | 666 MB/sec | 66,600 messages/sec | 1.33 GB/sec | 133,000 messages/sec | 666 TUs | 166 TUs |
| Batches of 6x32KB | 1 | 1.05 GB/sec | 34,000 messages/sec | 1.05 GB/sec | 34,000 messages/sec | 1,000 TUs | 250 TUs |

In the testing, the following criteria were used:

- A Dedicated-tier Event Hubs cluster with four capacity units was used.
- The event hub used for ingestion had 200 partitions.
- The data that was ingested was received by two receiver applications. They received data from all partitions.

## Use Event Hubs Dedicated

To use Event Hubs Dedicated, [contact billing support](https://ms.portal.azure.com/#create/Microsoft.Support) or your Microsoft representative. You can scale your capacity up or down throughout the month to meet your needs by adding or removing CUs. The Event Hubs product team helps you to get the flexible deployment that's right for you.

## Next steps

Contact your Microsoft sales representative or Microsoft Support to get additional information about Event Hubs Dedicated capacity. To learn more about Event Hubs pricing tiers, use the following links:

- [Event Hubs Dedicated pricing](https://azure.microsoft.com/pricing/details/event-hubs/). You can also contact your Microsoft sales representative or Microsoft Support to get additional information about Event Hubs Dedicated capacity.
- The [Event Hubs FAQ](event-hubs-faq.md) contains pricing information and answers some frequently asked questions about Event Hubs.
