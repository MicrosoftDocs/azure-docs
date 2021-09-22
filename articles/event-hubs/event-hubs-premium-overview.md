---
title: Overview of Event Hubs Premium (Preview)
description: This article provides an overview of Azure Event Hubs Premium, which offers multi-tenant deployments of Event Hubs for high-end streaming needs.   
ms.topic: article
ms.date: 5/25/2021
---

# Overview of Event Hubs Premium (Preview)

The Event Hubs Premium tier is designed for high-end streaming scenarios that require elastic, superior performance with predictable latency. The performance is achieved by providing reserved compute, memory, and storage resources, which minimize cross-tenant interference in a managed multi-tenant PaaS environment. 

Event Hubs Premium Preview introduces a new, two-tier, native-code log engine that provides far more predictable and much lower send and passthrough latencies than the prior generation, without any durability compromises. Event Hubs Premium replicates every event to three replicas, distributed across Azure availability zones where available, and all replicas are synchronously flushed to the underlying fast storage before the send operation is reported as completed. Events that are not read immediately or that need to be re-read later can be retained up to 90 days, transparently held in an availability-zone redundant storage tier. Events in both the fast storage and retention storage tiers are encrypted; in Event Hubs Premium, the encryption keys can be supplied by you. 

In addition to these storage-related features and all capabilities and protocol support of the Event Hubs Standard offering, the isolation model of Event Hubs Premium enables new features like dynamic partition scale-up and yet-to-be-added future capabilities. You also get far more generous quota allocations. Event Hubs Capture is included at no extra cost.

> [!IMPORTANT]
> Event Hubs Premium is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
 
The Premium offering is billed by [Processing Units (PUs)](event-hubs-scalability.md#processing-units) which correspond to a share of isolated resources (CPU, Memory, and Storage) in the underlying infrastructure. 

In comparison to Dedicated offering, since Event Hubs Premium provides isolation inside a very large multi-tenant environment that can shift resources quickly, it can scale far more elastically and quicker and PUs can be dynamically adjusted. Therefore, Event Hubs Premium will often be a more cost effective option for mid-range (<120MB/sec) throughput requirements, especially with changing loads throughout the day or week, when compared to Event Hubs Dedicated. 
> [!NOTE]
> Please note that Event Hubs Premium will only support TLS 1.2 or greater . 

For the extra robustness gained by availability-zone support, the minimal deployment scale for Event Hubs Dedicated is 8 Capacity Units (CU), but you will have availability zone support in Event Hubs Premium from the first PU in all AZ regions. 

You can purchase 1, 2, 4, 8 and 16 Processing Units for each namespace. Since Event Hubs Premium is a capacity-based offering, the achievable throughput is not set by a throttle as it is in Event Hubs Standard, but depends on the work you ask Event Hubs to do, similar to Event Hubs Dedicated. The effective ingest and stream throughput per PU will depend on various factors, including:

* Number of producers and consumers
* Payload size 
* Partition count
* Egress request rate 
* Usage of Event Hubs Capture, Schema Registry, and other advanced features

Refer the [comparison between Event Hubs SKUs](event-hubs-quotas.md) for more details.


> [!NOTE]
> All Event Hubs namespaces are enabled for the Apache Kafka RPC protocol by default can be used by your existing Kafka based applications. Having Kafka enabled on your cluster does not affect your non-Kafka use cases; there is no option or need to disable Kafka on a cluster.

## Why Premium?

Premium Event Hubs offers three compelling benefits for customers who require better isolation in a multitenant environment with low latency and high throughput data ingestion needs.

#### Superior performance with the new two-tier storage engine

Event Hubs premium uses a new two-tier log storage engine that drastically improves the data ingress performance with substantially reduced overall latency and latency jitter without compromising the durability guarantees. 

#### Better isolation and predictability

Event Hubs premium offers an isolated compute and memory capacity to achieve more predictable latency and far reduced *noisy neighbor* impact risk in a multi-tenant deployment.

Event Hubs premium implements a *Cluster in Cluster* model in its multitenant clusters to provide predictability and performance while retaining all the benefits of a managed multitenant PaaS environment. 


#### Cost savings and scalability
As Event Hubs Premium is a multitenant offering, it can dynamically scale more flexibly and very quickly. Capacity is allocated in Processing Units that allocate isolated pods of CPU/Memory inside the cluster. The number of those pods can be scaled up/down per namespace. Therefore, Event Hubs Premium is a low-cost option for messaging scenarios with the overall throughput range that is less than 120 MB/s but higher than what you can achieve with the standard SKU.  

## Quotas and limits
The premium tier offers all the features of the standard plan, but with better performance, isolation and more generous quotas. 
For more quotas and limits, see [Event Hubs quotas and limits](event-hubs-quotas.md)


## FAQs

[!INCLUDE [event-hubs-dedicated-clusters-faq](./includes/event-hubs-premium-faq.md)]

## Next steps

You can start using Event Hubs Premium (Preview) via [Azure portal](https://portal.azure.com/#create/Microsoft.EventHub). Refer [Event Hubs Premium pricing](https://azure.microsoft.com/pricing/details/event-hubs/) for more details on pricing and  [Event Hubs FAQ](event-hubs-faq.yml) to find answers to some frequently asked questions about Event Hubs. 

