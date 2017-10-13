---
title: Overview of Azure Event Hubs Dedicated capacity | Microsoft Docs
description: Overview of Microsoft Azure Event Hubs Dedicated capacity.
services: event-hubs
documentationcenter: na
author: sethmanheim
manager: timlt
editor: ''

ms.assetid:
ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/01/2017
ms.author: sethm;babanisa

---

# Overview of Event Hubs Dedicated

*Event Hubs Dedicated* capacity offers single-tenant deployments for customers with the most demanding requirements. At full scale, Azure Event Hubs can ingress over 2 million events per second or up to 2 GB per second of telemetry with fully durable storage and sub-second latency. This also enables integrated solutions by processing real-time and batch on the same system. With Event Hubs Archive included in the offering, you can reduce the complexity of your solution by having a single stream support both real-time and batch-based pipelines.

The following table compares the available service tiers of Event Hubs. The Event Hubs Dedicated offering is a fixed monthly price, compared to usage pricing for most features of Standard and Basic. The Dedicated tier offers the features of the Standard plan, but with enterprise scale capacity for customers with demanding workloads. 

| Feature | Basic | Standard | Dedicated |
| --- |:---:|:---:|:---:|
| Ingress events | Pay per million events | Pay per million events | Included |
| Throughput unit (1 MB/sec ingress, 2 MB/sec egress) | Pay per hour | Pay per hour | Included |
| Message Size | 256 KB | 256 KB | 1 MB |
| Publisher policies | N/A | Yes | Yes |	 
| Consumer groups | 1 - default | 20 | 20 |
| Message replay | Yes | Yes | Yes |
| Maximum throughput units | 20 | 20 (flexible to 100)	| 1 CU≈200 |
| Brokered connections | 100 included | 1,000 included | 100 K included |
| Additional Brokered connections | N/A | Yes | Yes |
| Message Retention | 1 day included | 1 day included | Up to 7 days included |
| Archive (Preview) | N/A	| Pay per hour | Included |

## Benefits of Event Hubs Dedicated capacity

The following benefits are available when using Event Hubs Dedicated:

* Single tenant hosting with no noise from other tenants.
* Message size increases to 1 MB as compared to 256 KB for Standard and Basic.
* Repeatable performance every time.
* Guaranteed capacity to meet your burst needs.
* Scalable between 1 and 8 capacity units (CU) – providing up to 2 million ingress events per second.
  * CUs manage the scale for Event Hubs Dedicated, where each CU can provide approximately the equivalent of 200 throughput units (TU).
* Zero maintenance: we manage load balancing, OS updates, security patches, and partitioning.
* Fixed monthly pricing.

Event Hubs Dedicated also removes some of the throughput limitations of the Standard offering. Throughput units in Basic and Standard tiers entitle you to 1000 events per second or 1 MB per second of ingress per TU and double that amount of egress. The Dedicated scale offering has no restrictions on ingress and egress event counts. These limits are governed only by the processing capacity of the purchased event hubs.

This service is targeted at the largest telemetry users and is available to customers with an enterprise agreement.

## How to onboard

The Event Hubs Dedicated platform is offered through an enterprise agreement with varying sizes of CUs. Each CU provides approximately the equivalent of 200 throughput units. You can scale your capacity up or down throughout the month to meet your needs by adding or removing CUs. The Dedicated plan is unique in that you will experience a more hands-on onboarding from the Event Hubs product team to get the flexible deployment that is right for you. 

## Next steps
Contact your Microsoft sales representative or Microsoft Support to get additional details about Event Hubs Dedicated Capacity. You can also learn more about Event Hubs by visiting the following links:

For detailed information about pricing, visit the following links:

- [Event Hubs Dedicated pricing](https://azure.microsoft.com/pricing/details/event-hubs/). You can also contact your Microsoft sales representative or Microsoft Support to get additional details about Event Hubs Dedicated capacity.
- The [Event Hubs FAQ](event-hubs-faq.md) contains pricing information and answers some frequently asked questions about Event Hubs. 
