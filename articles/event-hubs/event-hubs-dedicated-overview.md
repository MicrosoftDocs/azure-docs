---
title: Azure Event Hubs Dedicated Overview | Microsoft Docs
description: Microsoft Azure Event Hubs
services: event-hubs
author: banisadr

ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/23/2017
ms.author: babanisa

---


# Dedicated Event Hubs – An Overview

Event Hubs Dedicated capacity offers single-tenant deployments for customers with the most demanding requirements. At full scale Azure Event Hubs can ingress over two million events per second or up to 2 GB per second of telemetry with fully durable storage and sub-second latency. This also enables integrated solutions by processing real-time and batch on the same system. With Event Hubs Archive included in the offering, you can have a single stream support both real-time and batch based pipelines reducing the complexity of your solution.

The table below compares the available service tiers of Event Hubs. The Event Hubs Dedicated offering is a fixed monthly price as compared to usage pricing for most features of Standard and Basic. The Dedicated tier offers the features of the standard plan, but with enterprise scale capacity for customers with demanding workloads.

|  | Basic | Standard | Dedicated |
| --- |:---:|:---:|:---:|
| Ingress events | Pay per million events | Pay per million events | Included |
| Throughput unit (1 MB/s ingress, 2MB/s egress) | Pay per hour | Pay per hour | Included |
| Message Size | 256KB | 256KB | 1MB |
| Publisher policies | N/A | ✓ | ✓ |	 
| Consumer groups | 1 - Default | 20 | 20 |
| Message replay | ✓ | ✓ | ✓ |
| Maximum throughput units | 20 | 20 (flexible to 100)	| 1 CU≈200 |
| Brokered connections | 100 included | 1,000 included | 100K included |
| Additional Brokered connections | N/A | ✓ | ✓ |
| Message Retention | 1 day included | 1 day included | Up to 7 days included |
| Archive <sup>Preview</sup> | N/A	| Pay per hour | Included |

## Benefits of Event Hubs at Dedicated capacity include:

* Single tenant hosting with no noise from other tenants
* Message size increases to 1MB as compared to 256 KB for Standard and Basic
* Repeatable performance every time
* Guaranteed capacity to meet your burst needs
* Scalable between 1 and 8 Capacity Units (CU) – providing up to 2 million ingress event per second
  * Capacity Units (CU) manage the scale for Dedicated Event Hubs, where each CU can provide approximately the equivalent of 200 Throughput Units (TU)
* Zero maintenance – we manage load balancing, OS updates, security patches and partitioning
* Fixed monthly pricing

Dedicated Event Hubs also removes some of the throughput limitations of the Standard offering. Throughput Units (TU) in Basic and Standard tiers entitle the customer to 1000 events per second or 1MBps of ingress per TU and twice that amount of egress. The Dedicated scale offering has no restrictions on ingress and egress event counts. These limits are governed only by the processing capacity of the purchased Dedicated Event Hubs.

This service is targeted to the largest telemetry users and is available to customers with an Enterprise Agreement.

## How to Onboard?

The Dedicated Event Hubs platform is offered to the public through an Enterprise Agreement in varying size of Capacity Units (CU). Each CU provides approximately the equivalent of 200 Throughput Units and is billed at $31/hr. You can scale your capacity up or down throughout the month to meet your needs by adding or removing CU’s. The dedicated plan is unique in that you will experience a more hands on onboarding from the Event Hubs product team to get the flexible deployment that is right for you. 


## Next steps
Contact your Microsoft sales representative or Microsoft Support to get additional details about Event Hubs Dedicated Capacity. You can also learn more about Event Hubs by visiting the following links:

* [Dedicated Event Hubs pricing](https://azure.microsoft.com/en-us/pricing/details/event-hubs/)
* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Event Hubs FAQ](event-hubs-faq.md)