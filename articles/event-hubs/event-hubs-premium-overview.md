---
title: Overview of Event Hubs Premium
description: This article provides an overview of Azure Event Hubs Premium, which offers multi-tenant deployments of Event Hubs for high-end streaming needs.
ms.topic: article
ms.date: 09/20/2022
ms.custom: ignite-fall-2021
---

# Overview of Event Hubs Premium
The Event Hubs Premium (premium tier) is designed for high-end streaming scenarios that require elastic, superior performance with predictable latency. The performance is achieved by providing reserved compute, memory, and storage resources, which minimize cross-tenant interference in a managed multi-tenant PaaS environment. 

It replicates events to three replicas, distributed across Azure availability zones where available. All replicas are synchronously flushed to the underlying fast storage before the send operation is reported as completed. Events that aren't read immediately or that need to be re-read later can be retained up to 90 days, transparently held in an availability-zone redundant storage tier. 

In addition to these storage-related features and all capabilities and protocol support of the standard tier, the isolation model of the premium tier enables features like [dynamic partition scale-up](dynamically-add-partitions.md). You also get far more generous [quota allocations](event-hubs-quotas.md). Event Hubs Capture is included at no extra cost.

> [!NOTE]
> - Event Hubs Premium supports TLS 1.2 or greater. 
> - The premium tier isn't available in all regions. Try to create a namespace in the Azure portal and see supported regions in the **Location** drop-down list on the **Create Namespace** page.


You can purchase 1, 2, 4, 8 and 16 processing units for each namespace. As the premium tier is a capacity-based offering, the achievable throughput isn't set by a throttle as it is in the standard tier, but depends on the work you ask Event Hubs to do, similar to the dedicated tier. The effective ingest and stream throughput per PU will depend on various factors, including:

* Number of producers and consumers
* Payload size 
* Partition count
* Egress request rate 
* Usage of Event Hubs Capture, Schema Registry, and other advanced features

For more information, see [comparison between Event Hubs SKUs](event-hubs-quotas.md).

## Why premium?
The premium tier offers three compelling benefits for customers who require better isolation in a multitenant environment with low latency and high throughput data ingestion needs.

### Superior performance with the new two-tier storage engine
The premium tier uses a new two-tier log storage engine that drastically improves the data ingress performance with substantially reduced overall latency without compromising the durability guarantees. 

### Better isolation and predictability
The premium tier offers an isolated compute and memory capacity to achieve more predictable latency and far reduced *noisy neighbor* impact risk in a multi-tenant deployment.

It implements a *cluster in cluster* model in its multitenant clusters to provide predictability and performance while retaining all the benefits of a managed multitenant PaaS environment. 

### Cost savings and scalability
As the premium tier is a multitenant offering, it can dynamically scale more flexibly and very quickly. Capacity is allocated in processing units (PUs) that allocate isolated pods of CPU/memory inside the cluster. The number of those pods can be scaled up/down per namespace. Therefore, the premium tier is a low-cost option for messaging scenarios with the overall throughput range that is less than 120 MB/s but higher than what you can achieve with the standard SKU.  

## Encryption of events
Azure Event Hubs provides encryption of data at rest with Azure Storage Service Encryption (Azure SSE). The Event Hubs service uses Azure Storage to store the data. All the data that's stored with Azure Storage is encrypted using Microsoft-managed keys. If you use your own key (also referred to as Bring Your Own Key (BYOK) or customer-managed key), the data is still encrypted using the Microsoft-managed key, but in addition the Microsoft-managed key will be encrypted using the customer-managed key. This feature enables you to create, rotate, disable, and revoke access to customer-managed keys that are used for encrypting Microsoft-managed keys. Enabling the BYOK feature is a one time setup process on your namespace. For more information, see [Configure customer-managed keys for encrypting Azure Event Hubs data at rest](configure-customer-managed-key.md).

> [!NOTE]
> All Event Hubs namespaces are enabled for the Apache Kafka RPC protocol by default can be used by your existing Kafka based applications. Having Kafka enabled on your cluster does not affect your non-Kafka use cases; there is no option or need to disable Kafka on a cluster.


## Quotas and limits
The premium tier offers all the features of the standard plan, but with better performance, isolation and more generous quotas. 
For more quotas and limits, see [Event Hubs quotas and limits](event-hubs-quotas.md)

## High availability with availability zones 
Event Hubs standard, premium, and dedicated tiers offer [availability zones](../availability-zones/az-overview.md#availability-zones) support with no extra cost. Using availability zones, you can run event streaming workloads in physically separate locations within each Azure region that are tolerant to local failures. 

> [!IMPORTANT] 
> - Availability zone support is only available in [Azure regions with availability zones](../availability-zones/az-overview.md#azure-regions-with-availability-zones). 
> - In certain regions, premium-tier's support for availability zones is limited even though the region supports availability zones. 


## Premium vs. dedicated tiers
In comparison to the dedicated offering, the premium tier provides the following benefits:

- Isolation inside a large multi-tenant environment that can shift resources quickly
- Scale far more elastically and quicker
- PUs can be dynamically adjusted

Therefore, the premium tier is often a more cost effective option for event streaming workloads up to 160 MB/sec (per namespace), especially with changing loads throughout the day or week, when compared to the dedicated tier. 

> [!NOTE]
> For the extra robustness gained by **availability-zone** support, the minimal deployment scale for the dedicated tier is **8 capacity units (CU)**, but you'll have availability zone support in the premium tier from the first PU in all availability zone regions. 

## Pricing

The Premium offering is billed by [Processing Units (PUs)](event-hubs-scalability.md#processing-units) which correspond to a share of isolated resources (CPU, Memory, and Storage) in the underlying infrastructure. 

## FAQs

[!INCLUDE [event-hubs-dedicated-clusters-faq](./includes/event-hubs-premium-faq.md)]

## Next steps

See the following articles:

- [Create an event hub](event-hubs-create.md). Select **Premium** for **Pricing tier**. 
- [Event Hubs Premium pricing](https://azure.microsoft.com/pricing/details/event-hubs/) for more details on pricing
- [Event Hubs FAQ](event-hubs-faq.yml) to find answers to some frequently asked questions about Event Hubs. 
