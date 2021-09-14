---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 05/25/2021
ms.author: spelluru
ms.custom: "include file","fasttrack-edit","iot","event-hubs"

---

The following table shows limits that may be different for basic, standard, and dedicated tiers. In the table CU is [capacity unit](../event-hubs-dedicated-overview.md), PU is [processing unit](../event-hubs-scalability.md#processing-units), TU is [throughput unit](../event-hubs-scalability.md#throughput-units). 

| Limit | Basic | Standard | Premium |  Dedicated |
| ----- | ----- | -------- | -------- | --------- | 
| Maximum size of Event Hubs publication | 256 KB | 1 MB | 1 MB |  1 MB |
| Number of consumer groups per event hub | 1 | 20 | 100 | 1000<br/>No limit per CU  |
| Number of brokered connections per namespace | 100 | 5,000 | 10000 per processing unit per PU | 100, 000 per CU |
| Maximum retention period of event data | 1 day | 7 days | 90 days<br/>1 TB per PU | 90 days<br/>10 TB per CU |
| Maximum TUs or PUs or CUs |20 TUs | 40 TUs | 16 PUs | 20 CUs |
| Number of partitions per event hub | 32 | 32 | 100 (fixed) | 1024 per event hub<br/> 2000 per CU |
| Number of namespaces per subscription | 1000 | 1000 | 1000 | 1000 (50 per CU) |
| Number of event hubs per namespace | 10 | 10 | 100 per PU | 1000 |
| Capture | N/A | Pay per hour | Included | Included |
| Size of the schema registry (namespace) in mega bytes | N/A | 25 | 100 | 1024 |
| Number of schema groups in a schema registry or namespace | N/A | 1 - excluding the default group | 100 <br/>1 MB per schema | 1000<br/>1 MB per schema |
| Number of schema versions across all schema groups | N/A | 25 | 1000 | 10000 |
| Throughput per unit | Ingress - 1 MB/s or 1000 events per second<br/>Egress – 2 Mb/s or 4096 events per second | Ingress - 1 MB/s or 1000 events per second<br/>Egress – 2 Mb/s or 4096 events per second | No limits per PU * | No limits per CU * |

\* Depends on various factors such as resource allocation, number of partitions, storage, and so on. 
 

> [!NOTE]
> You can publish events individually or batched. 
> The publication limit (according to SKU) applies regardless of whether it is a single event or a batch. Publishing events larger than the maximum threshold will be rejected.

