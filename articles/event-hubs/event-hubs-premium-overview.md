---
title: Overview of premium event hubs - Azure Event Hubs | Microsoft Docs
description: This article provides an overview of premium Azure Event Hubs, which offers multi-tenant deployments of event hubs for high-end streaming needs that require superior performance, better isolation.   
ms.topic: article
ms.date: 5/11/2021
---

# Overview of Event Hubs Premium (Preview)



Event Hubs premium caters to high-end streaming needs that require superior performance, better isolation with predictable latency and minimal interference in a managed multitenant PaaS environment. 
On top of all the features of the Standard offering, Premium offers several extra features such as dynamic partition scale up, extended retention, customer-managed-keys, and log compaction.
 
The Premium offering is billed by Processing Units (PUs) that offers more generous quotas compared to the standard offering. In comparison to Dedicated offering, since Event Hubs Premium is multi-tenant, it can dynamically scale more flexibly and quickly while providing better isolation from other tenants. Therefore, Event Hubs Premium is cost effective option for mid-range(<120MB/sec) throughput requirements that requires better isolation and flexibility in a multi-tenant PassS environment. 

You can purchase 1, 2, 4, 8, 12, 16 or 20 Processing Units for each cluster. How much you can ingest and stream per PU depends on various factors, such as the following ones:

* Number of producers and consumers
* Payload shape
* Egress rate

Refer the [comparison between Event Hubs SKUs](event-hubs-quotas.md) for more details.


> [!NOTE]
> All Event Hubs clusters are Kafka-enabled by default and support Kafka endpoints that can be used by your existing Kafka based applications. Having Kafka enabled on your cluster does not affect your non-Kafka use cases; there is no option or need to disable Kafka on a cluster.

## Why Premium?

Premium Event Hubs offers three compelling benefits for customers who require better isolation in a multitenant environment with low latency and high throughput data ingestion needs.

#### Superior performance with the new two-tier storage engine

Event Hubs premium uses a new two-tier log storage engine that drastically improves the data ingress performance with substantially reduced overall latency and latency jitter without compromising the durability guarantees.

#### Better isolation and predictability

Event Hubs premium offer an isolated compute and memory capacity to achieve more predictable latency and far reduced *noisy neighbor* impact risk in a multi-tenant deployment.

Event Hubs premium implements a *Cluster in Cluster* model in its multitenant clusters to provide predictability and performance while retaining all the benefits of a managed multitenant PaaS environment. 


### Cost Savings and Scalability
As Event Hubs Premium is a multitenant offering, it can dynamically scale more flexibly and very quickly. Capacity is allocated in Processing Units that allocate isolated pods of CPU/Memory inside the cluster. The number of those pods can be scaled up/down per namespace. Therefore, Event Hubs Premium is a low-cost option for messaging scenarios with the overall throughput range that is less than 120 MB/s but higher than what you can achieve with the standard SKU.  

## Event Hubs Premium quotas and limits
The premium tier offers all the features of the standard plan, but with better performance, isolation and more generous quotas. 
For more quotas and limits, see [Event Hubs quotas and limits](event-hubs-quotas.md)


## FAQs

[!INCLUDE [event-hubs-dedicated-clusters-faq](../../includes/event-hubs-premium-faq.md)]

## Next steps

You can start using Event Hubs Premium (Preview) via [Azure portal](https://aka.ms/eventhubsclusterquickstart). Please refer [Event Hubs Premium pricing](https://azure.microsoft.com/pricing/details/event-hubs/) for more details on pricing and  [Event Hubs FAQ](event-hubs-faq.yml) to find answers to some frequently asked questions about Event Hubs. 

