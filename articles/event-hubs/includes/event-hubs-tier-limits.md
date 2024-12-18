---
title: include file
description: include file
author: spelluru
ms.service: azure-event-hubs
ms.topic: include
ms.date: 02/15/2024
ms.author: spelluru
ms.custom: "include file","fasttrack-edit","iot","event-hubs"

---

The following table shows limits that are different for Basic, Standard, Premium, and Dedicated tiers.

> [!NOTE]
> - In the table, CU is [capacity unit](../event-hubs-dedicated-overview.md), PU is [processing unit](../event-hubs-scalability.md#processing-units), and TU is [throughput unit](../event-hubs-scalability.md#throughput-units).
> - You can configure [TUs](../event-hubs-auto-inflate.md#use-azure-portal) for a Basic or Standard tier namespace or [PUs](../configure-processing-units-premium-namespace.md) for a Premium tier namespace.
> - When you [create a dedicated cluster](../event-hubs-dedicated-cluster-create-portal.md#create-an-event-hubs-dedicated-cluster), one CU is assigned to the cluster. If you enable the **Support scaling** option while you create the cluster, you can scale out by increasing CUs or scale in by decreasing CUs for the cluster yourself. For step-by-step instructions, see [Scale dedicated cluster](../event-hubs-dedicated-cluster-create-portal.md#scale-a-dedicated-cluster). For clusters that don't support the **Support scaling** feature, [submit a ticket](../event-hubs-dedicated-cluster-create-portal.md#submit-a-support-request) to adjust CUs for the cluster.

| Limit | Basic | Standard | Premium | Dedicated |
| ----- | ----- | -------- | -------- | --------- | 
| Maximum size of Event Hubs publication | 256 KB | 1 MB | 1 MB | 1 MB |
| Number of consumer groups per event hub | 1 | 20 | 100 | 1,000<br/>No limit per CU |
| Number of Kafka consumer groups per namespace | NA | 1,000 | 1,000 | 1,000 |
| Number of brokered connections per namespace | 100 | 5,000 | 10,000 per PU<br/><br/>For example, if the namespace is assigned 3 PUs, the limit is 30,000. | 100,000 per CU |
| Maximum retention period of event data | 1 day | 7 days | 90 days | 90 days |
| Event storage for retention | 84 GB per TU | 84 GB per TU | 1 TB per PU | 10 TB per CU | 
| Maximum TUs or PUs or CUs | 40 TUs | 40 TUs | 16 PUs | 20 CUs |
| Number of partitions per event hub | 32 | 32 | 100 per event hub, but there's a limit of 200 per PU at the namespace level.<br/><br/> For example, if a namespace is assigned 2 PUs, the limit for total number of partitions in all event hubs in the namespace is 2 * 200 = 400. | 1,024 per event hub<br/> 2,000 per CU |
| Number of namespaces per subscription | 1,000 | 1,000 | 1,000 | 1,000 (50 per CU) |
| Number of event hubs per namespace | 10 | 10 | 100 per PU | 1,000 |
| Capture | N/A | Pay per hour | Included | Included |
| Size of compacted event hub | N/A | 1 GB per partition | 250 GB per partition | 250 GB per partition |
| Size of the schema registry (namespace) in megabytes | N/A | 25 | 100 | 1,024 |
| Number of schema groups in a schema registry or namespace | N/A | 1: excluding the default group | 100 <br/>1 MB per schema | 1,000<br/>1 MB per schema |
| Number of schema versions across all schema groups | N/A | 25 | 1,000 | 10,000 |
| Throughput per unit | Ingress: 1 MB/sec or 1000 events per second<br/>Egress: 2 MB/sec or 4,096 events per second | Ingress: 1 MB/sec or 1,000 events per second<br/>Egress: 2 MB/sec or 4,096 events per second | No limits per PU * | No limits per CU * |

\* Depends on factors such as resource allocation, number of partitions, and storage.

> [!NOTE]
> You can publish events individually or batched. The publication limit (according to SKU) applies regardless of whether it's a single event or a batch. Publishing events larger than the maximum threshold will be rejected.
