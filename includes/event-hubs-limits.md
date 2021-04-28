---
title: include file
description: include file
services: event-hubs
author: spelluru
ms.service: event-hubs
ms.topic: include
ms.date: 03/31/2021
ms.author: spelluru
ms.custom: "include file","fasttrack-edit","iot","event-hubs"

---

The following tables provide quotas and limits specific to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/). For information about Event Hubs pricing, see [Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/).

### Common limits for all tiers
The following limits are common across all tiers. 

| Limit |  Notes | Value |
| --- |  --- | --- |
 Size of an event hub name |- | 256 characters |
| Size of a consumer group name | Kafka protocol doesn't require the creation of a consumer group. | <p>Kafka: 256 characters</p><p>AMQP: 50 characters |
| Number of non-epoch receivers per consumer group |- |5 |
| Number of authorization rules per namespace | Subsequent requests for authorization rule creation are rejected.|12 |
| Number of calls to the GetRuntimeInformation method |  - | 50 per second | 
| Number of virtual networks (VNet) | - | 128 | 
| Number of IP Config rules | - | 128 | 
| Maximum length of a schema group name | | 50 |  
| Maximum length of a schema name | | 100 |    
| Size in bytes per schema | | 1 MB |   
| Number of properties per schema group | | 1024 |
| Size in bytes per schema group property key | | 256 | 
| Size in bytes per schema group property value | | 1024 | 

### Basic vs. standard vs. dedicated tiers
The following table shows limits that may be different for basic, standard, and dedicated tiers. In the table CU is [capacity unit](../articles/event-hubs/event-hubs-dedicated-overview.md) and TU is [throughput unit](../articles/event-hubs/event-hubs-faq.yml#what-are-event-hubs-throughput-units-). 

| Limit | Basic | Standard | Dedicated |
| ----- | ----- | -------- | -------- | 
| Maximum size of Event Hubs publication | 256 KB | 1 MB | 1 MB |
| Number of consumer groups per event hub | 1 | 20 | No limit per CU, 1000 per event hub |
| Number of AMQP connections per namespace | 100 | 5,000 | 100 K included and max |
| Maximum retention period of event data | 1 day | 1-7 days | 90 days, 10 TB included per CU |
| Maximum TUs or CUs |20 TUs | 20 TUs | 20 CUs |
| Number of partitions per event hub | 32 | 32 | 1024 per event hub
2000 per CU |
| Number of namespaces per subscription | 100 | 100 | 100 (50 per CU) |
| Number of event hubs per namespace | 10 | 10 | 1000 |
| Ingress events | | Pay per million events | Included|
| Capture | N/A | Pay per hour | Included |
| Size of the schema registry (namespace) in mega bytes | N/A | 25 |  1024 |
| Number of schema groups in a schema registry or namespace | N/A | 1 - excluding the default group | 1000 |
| Number of schema versions across all schema groups | N/A | 25 | 10000 |

> [!NOTE]
> You can publish events individually or batched. 
> The publication limit (according to SKU) applies regardless of whether it is a single event or a batch. Publishing events larger than the maximum threshold will be rejected.

