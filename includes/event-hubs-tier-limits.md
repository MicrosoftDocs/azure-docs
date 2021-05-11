---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 05/10/2021
ms.author: spelluru
ms.custom: "include file","fasttrack-edit","iot","event-hubs"

---

The following table shows limits that may be different for basic, standard, and dedicated tiers. In the table CU is [capacity unit](../articles/event-hubs/event-hubs-dedicated-overview.md) and TU is [throughput unit](../articles/event-hubs/event-hubs-faq.yml#what-are-event-hubs-throughput-units-). 

| Limit | Basic | Standard | Premium |  Dedicated |
| ----- | ----- | -------- | -------- | --------- | 
| Maximum size of Event Hubs publication | 256 KB | 1 MB | 1 MB |  1 MB |
| Number of consumer groups per event hub | 1 | 20 | 100 | No limit per CU, 1000 per event hub |
| Number of AMQP connections per namespace | 100 | 5,000 | 10000 per processing unit (PU) | 100 K included and max |
| Maximum retention period of event data | 1 day | 1-7 days | 90 days | 90 days, 10 TB included per CU |
| Maximum TUs or CUs |20 TUs | 20 TUs | 16 PUs | 20 CUs |
| Number of partitions per event hub | 32 | 32 | 100 per event hub <br/>200 per PU | 1024 per event hub<br/> 2000 per CU |
| Number of namespaces per subscription | 1000 | 1000 | 1000 | 1000 (50 per CU) |
| Number of event hubs per namespace | 10 | 10 | 100 | 1000 |
| Ingress events | | Pay per million events | | Included|
| Capture | N/A | Pay per hour | Included | Included |
| Size of the schema registry (namespace) in mega bytes | N/A | 25 | | 1024 |
| Number of schema groups in a schema registry or namespace | N/A | 1 - excluding the default group | | 1000 |
| Number of schema versions across all schema groups | N/A | 25 | | 10000 |

> [!NOTE]
> You can publish events individually or batched. 
> The publication limit (according to SKU) applies regardless of whether it is a single event or a batch. Publishing events larger than the maximum threshold will be rejected.

