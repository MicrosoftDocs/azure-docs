---
title: Overview of dedicated event hubs - Azure Event Hubs | Microsoft Docs
description: This article provides an overview of dedciated Azure Event Hubs, which offers single-tenant deployments of event hubs.  
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

*Event Hubs clusters* offer single-tenant deployments for customers with the most demanding streaming needs. This single-tenant offering has a guaranteed 99.99% SLA and is available only on our Dedicated pricing tier. An Event Hubs cluster can ingress million of events per second with guaranteed capacity and sub-second latency. Namespaces and event hubs created within the Dedicated cluster include all features of the Standard offering and more, but without any ingress limits. It also includes the popular [Event Hubs Capture](event-hubs-capture-overview.md) feature at no additional cost, allowing you to automatically batch and log data streams to Azure Storage or Azure Data Lake. 

Dedicated clusters are provisioned and billed by **Capacity Units (CUs)**, a pre-allocated amount of CPU and memory resources. You can purchase 1, 2, 4, 8, 12, 16 or 20 CUs for each cluster. How much you can ingest and stream per CU depends on a variety of factors, such as the number of producers and consumers, payload shape, egress rate etc (see benchmark results below for more details). 

## Why Dedicated?

Dedicated Event Hubs offers three compelling benefits for customers who need enterprise-level capacity:

#### Single-tenancy guarantees capacity for better performance

A Dedicated cluster guarantees capacity at full scale, and can ingress up to gigabytes of streaming data with fully durable storage and sub-second latency to accommodate any burst in traffic. 

#### Inclusive and exclusive access to features 
The Dedicated offering includes features like Capture at no additional cost, as well as exclusive access to upcoming features like BYOK. The service also manages load balancing, OS updates, security patches and partitioning for the customer, so that you can spend less time on infrastructure maintenance and more time on building client-side features.  

#### Cost Savings
At 100 TUs, customers are billed $13.08/hour with a Standard Event Hub + $0.10 per TU per hour for Capture. A 1 CU Dedicated cluster will only cost $6.85/hour, and Capture is included at no additional cost. 


## Event Hubs Standard vs. Dedicated

The following table compares the available service tiers of Event Hubs. The Event Hubs Dedicated offering is a fixed monthly price, compared to usage pricing for most features of Standard. The Dedicated tier offers all the features of the Standard plan, but with enterprise scale capacity for customers with demanding workloads. 

| Feature | Standard | Dedicated |
| --- |:---:|:---:|
| Ingress events | Pay per million events | Included |
| Throughput unit (1 MB/sec ingress, 2 MB/sec egress) | Pay per hour | Included |
| Message Size | 1 MB | 1 MB |
| Partitions | 40 per namespace | 2000 per CU |
| Consumer groups | 20 per Event Hub | 1000 per Event Hub |
| Max. Bandwidth | 20 TUs (up to 40 TUs)	| 20 CUs |
| Brokered connections | 1,000 included | 100 K included |
| Message Retention | 1 day included | Up to 7 days included |
| Capture | Pay per hour | Included |

## How much does a single Capacity Unit (CU) let me achieve?

For a dedicated cluster, how much you can ingest and stream depends on various factors such as your producers, consumers, the rate at which you are ingesting and processing, and much more. 

Following table shows the benchmark results that we achieved during our testing:

| Payload shape | Receivers | Ingress bandwidth| Ingress messages | Egress bandwidth | Egress messages | Total TUs | TUs per CU |
| ------------- | --------- | ---------------- | ------------------ | ----------------- | ------------------- | --------- | ---------- |
| Batches of 100x1KB | 2 | 400 MB/sec | 400k msgs/sec | 800 MB/sec | 800k msgs/sec | 400 TUs | 100 TUs | 
| Batches of 10x10KB | 2 | 666 MB/sec | 66.6k msgs/sec | 1.33 GB/sec | 133k msgs/sec | 666 TUs | 166 TUs |
| Batches of 6x32KB | 1 | 1.05 GB/sec | 34k msgs / sec | 1.05 GB/sec | 34k msgs/sec | 1000 TUs | 250 TUs |

In the testing, the following criteria was used:

- A dedicated Event Hubs cluster with four capacity units (CUs) was used. 
- The event hub used for ingestion had 200 partitions. 
- The data that was ingested was received by two receiver applications receiving from all partitions.

## How to onboard

To onboard to this SKU, [contact billing support](https://ms.portal.azure.com/#create/Microsoft.Support) or your Microsoft representative. You can scale your capacity up or down throughout the month to meet your needs by adding or removing CUs. The Dedicated plan is unique in that you will experience a more hands-on onboarding from the Event Hubs product team to get the flexible deployment that is right for you. 

## Next steps

Contact your Microsoft sales representative or Microsoft Support to get additional details about Event Hubs Dedicated Capacity. You can also learn more about Event Hubs pricing tiers by visiting the following links:

- [Event Hubs Dedicated pricing](https://azure.microsoft.com/pricing/details/event-hubs/). You can also contact your Microsoft sales representative or Microsoft Support to get additional details about Event Hubs Dedicated capacity.
- The [Event Hubs FAQ](event-hubs-faq.md) contains pricing information and answers some frequently asked questions about Event Hubs.
