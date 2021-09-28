---
title: Overview of dedicated event hubs - Azure Event Hubs | Microsoft Docs
description: This article provides an overview of dedicated Azure Event Hubs, which offers single-tenant deployments of event hubs.  
ms.topic: article
ms.date: 10/23/2020
---

# Overview of Event Hubs Dedicated

*Event Hubs clusters* offer single-tenant deployments for customers with the most demanding streaming needs. This single-tenant offering has a guaranteed 99.99% SLA and is available only on our Dedicated pricing tier. An Event Hubs cluster can ingress millions of events per second with guaranteed capacity and subsecond latency. Namespaces and event hubs created within the Dedicated cluster include all features of the premium offering and more, but without any ingress limits. It also includes the popular [Event Hubs Capture](event-hubs-capture-overview.md) feature at no additional cost. This feature allows you to automatically batch and log data streams to Azure Storage or Azure Data Lake. 

Clusters are provisioned and billed by **Capacity Units (CUs)**, a pre-allocated amount of CPU and memory resources. You can purchase 1, 2, 4, 8, 12, 16 or 20 CUs for each cluster. How much you can ingest and stream per CU depends on a variety of factors, such as the following ones: 

- Number of producers and consumers
- Payload shape
- Egress rate

> [!NOTE]
> All Event Hubs clusters are Kafka-enabled by default and support Kafka endpoints that can be used by your existing Kafka based applications. Having Kafka enabled on your cluster does not affect your non-Kafka use cases; there is no option or need to disable Kafka on a cluster.

## Why Dedicated?

Dedicated Event Hubs offers three compelling benefits for customers who need enterprise-level capacity:

#### Single-tenancy guarantees capacity for better performance

A dedicated cluster guarantees capacity at full scale. It can ingress up to gigabytes of streaming data with fully durable storage and subsecond latency to accommodate any burst in traffic. 

#### Inclusive and exclusive access to features

The Dedicated offering includes features like Capture at no additional cost and exclusive access to features like Bring Your Own Key (BYOK). The service also manages load balancing, OS updates, security patches, and partitioning. So, you can spend less time on infrastructure maintenance and more time on building client-side features.  

## Event Hubs Dedicated quotas and limits
The Event Hubs Dedicated offering is billed at a fixed monthly price, with a minimum of 4 hours of usage. The dedicated tier offers all the features of the premium plan, but with enterprise-scale capacity and limits for customers with demanding workloads. 

For more quotas and limits, see [Event Hubs quotas and limits](event-hubs-quotas.md)

## How to onboard

The self-serve experience to [create an Event Hubs cluster](event-hubs-dedicated-cluster-create-portal.md) through the [Azure portal](https://aka.ms/eventhubsclusterquickstart) is now in Preview. If you have any questions or need help with onboarding to Event Hubs Dedicated, contact the [Event Hubs team](mailto:askeventhubs@microsoft.com).

## FAQs

[!INCLUDE [event-hubs-dedicated-clusters-faq](./includes/event-hubs-dedicated-clusters-faq.md)]

## Next steps

Contact your Microsoft sales representative or Microsoft Support to get additional details about Event Hubs Dedicated. You can also create a cluster or learn more about Event Hubs pricing tiers by visiting the following links:

- [Create an Event Hubs cluster through the Azure portal](https://aka.ms/eventhubsclusterquickstart) 
- [Event Hubs Dedicated pricing](https://azure.microsoft.com/pricing/details/event-hubs/). You can also contact your Microsoft sales representative or Microsoft Support to get additional details about Event Hubs Dedicated capacity.
- The [Event Hubs FAQ](event-hubs-faq.yml) contains pricing information and answers some frequently asked questions about Event Hubs.
