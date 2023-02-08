---
title: Overview of Azure Event Hubs dedicated tier
description: This article provides an overview of dedicated Azure Event Hubs, which offers single-tenant deployments of event hubs.  
ms.topic: article
ms.date: 02/07/2023
---

# Overview of Azure Event Hubs dedicated tier

Event Hubs clusters offer **single-tenant deployments** for customers with the most demanding streaming needs. This offering has a guaranteed **99.99%** SLA, which is available only in our dedicated pricing tier. An [Event Hubs cluster](event-hubs-dedicated-overview.md) can ingress millions of events per second with guaranteed capacity and subsecond latency. Namespaces and event hubs created within a cluster include all features of the premium offering and more, but without any ingress limits. The dedicated offering also includes the popular [Event Hubs Capture](event-hubs-capture-overview.md) feature at no additional cost, allowing you to automatically batch and log data streams to [Azure Blob Storage](../storage/blobs/storage-blobs-introduction.md) or [Azure Data Lake Storage Gen 1](../data-lake-store/data-lake-store-overview.md).

Dedicated clusters are provisioned and billed by **capacity units (CUs)**, a pre-allocated amount of CPU and memory resources. You can purchase up to 10 CUs for a cluster in the Azure portal. If you need a cluster larger than 10 CU, you can submit an Azure support request to scale up your cluster after its creation. 

How much you can ingest and stream per CU depends on various factors, such as the following ones: 

- Number of producers and consumers
- Payload shape
- Egress rate

> [!NOTE]
> All Event Hubs clusters are Kafka-enabled by default and support Kafka endpoints that can be used by your existing Kafka based applications. Having Kafka enabled on your cluster does not affect your non-Kafka use cases. There is no option or need to disable Kafka on a cluster.

## Why dedicated tier?
The dedicated tier of Event Hubs offers three compelling benefits to customers who need enterprise-level capacity:

### Single-tenancy guarantees capacity for better performance
A dedicated cluster guarantees capacity at full scale. It can ingress up to gigabytes of streaming data with fully durable storage and subsecond latency to accommodate any burst in traffic. 

### Inclusive and exclusive access to features
The dedicated offering includes features like [Event Hubs Capture](event-hubs-capture-overview.md) at no additional cost and exclusive access to features like [Bring Your Own Key (BYOK)](configure-customer-managed-key.md). The service also manages load balancing, operating system updates, security patches, and partitioning. So, you can spend less time on infrastructure maintenance and more time on building client-side features.  

### Self-Serve scaling capabilities  
The dedicated tier offers self-serve scaling capabilities that allow you to adjust the capacity of the cluster according to dynamic loads and to facilitate business operations. You can scale out during spikes in usage and scale in when the usage is low. To learn how to scale your dedicated cluster, see [Scale Event Hubs dedicated clusters](event-hubs-dedicated-cluster-create-portal.md). 

## Quotas and limits
The Event Hubs dedicated offering is billed at a fixed monthly price, with a **minimum of 4 hours of usage**. The dedicated tier offers all the features of the premium plan, but with enterprise-scale capacity and limits for customers with demanding workloads. 

For more information about quotas and limits, see [Event Hubs quotas and limits](event-hubs-quotas.md)

## High availability with availability zones 
Event Hubs standard, premium, and dedicated tiers offer [availability zones](../availability-zones/az-overview.md#availability-zones) support where you can run event streaming workloads in physically separate locations within each Azure region that are tolerant to local failures. 

> [!IMPORTANT] 
> Event Hubs dedicated clusters require at least 8 Capacity Units(CUs) to enable availability zones. Clusters with self-serve scaling does not support availability zones yet. Availability zone support is only available in [Azure regions with availability zones](../availability-zones/az-overview.md#azure-regions-with-availability-zones). 


## How to onboard
Event Hubs dedicated tier is generally available (GA). The self-serve experience to create an Event Hubs cluster through the [Azure portal](event-hubs-dedicated-cluster-create-portal.md) is currently in Preview. You can also request for the cluster to be created by contacting the [Event Hubs team](mailto:askeventhubs@microsoft.com). 

## FAQs

[!INCLUDE [event-hubs-dedicated-clusters-faq](./includes/event-hubs-dedicated-clusters-faq.md)]

## Next steps

Contact your Microsoft sales representative or Microsoft Support to get additional details about Event Hubs Dedicated. You can also create a cluster or learn more about Event Hubs pricing tiers by visiting the following links:

- [Create an Event Hubs cluster through the Azure portal](https://aka.ms/eventhubsclusterquickstart) 
- [Event Hubs Dedicated pricing](https://azure.microsoft.com/pricing/details/event-hubs/). You can also contact your Microsoft sales representative or Microsoft Support to get additional details about Event Hubs Dedicated capacity.
- The [Event Hubs FAQ](event-hubs-faq.yml) contains pricing information and answers some frequently asked questions about Event Hubs.
