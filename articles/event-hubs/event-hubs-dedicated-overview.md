---
title: Azure Event Hubs Dedicated Tier Overview
description: Discover Azure Event Hubs Dedicated tier, a single-tenant solution for enterprise-scale, low-latency event streaming. Evaluate its benefits for mission-critical workloads.
#customer intent: As an enterprise architect, I want to understand the benefits of Azure Event Hubs Dedicated tier so that I can evaluate its suitability for mission-critical workloads.  
ms.topic: overview
ms.date: 07/28/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:07/28/2025
  - ai-gen-description
---

# Azure Event Hubs Dedicated tier overview
Azure Event Hubs Dedicated tier is a single-tenant solution designed to meet the needs of enterprise-scale, mission-critical event streaming workloads. This article provides an overview of the Dedicated tier, highlighting its key features, benefits, and use cases, showing how it supports high-performance, low-latency applications using Event Hubs SDK or Apache Kafka APIs.

## Benefits of dedicated clusters

The Dedicated tier of Event Hubs offers several benefits to customers who need to run mission-critical workloads at enterprise-level capacity.

### Low-latency event streaming

These clusters are optimized for low end-to-end latency and high performance. These clusters enable businesses to handle high-velocity and high-volume data streaming.

### Stream large volumes of data

Dedicated clusters can stream events at the scale of gigabytes per second or millions of events per second for most of the use cases. You can also scale these clusters to accommodate changes in event streaming volume.

### Guaranteed consistent performance

Event Hubs dedicated clusters minimize the latency jitter and ensure consistent performance with guaranteed capacity.

### Zero interference

Event Hubs dedicated clusters operate on a single-tenant architecture. This architecture ensures that the allocated resources aren't being shared with any other tenants. Unlike with other tiers, you don't see any cross-tenant interference in a dedicated cluster.

### Self-serve scaling

The dedicated cluster offers self-serve scaling capabilities that allow you to adjust the capacity of the cluster according to dynamic loads and to facilitate business operations. You can scale out during spikes in usage and scale in when the usage is low.

### High-end features and generous quotas

Dedicated clusters include all features of the Premium tier and more. The service also manages load balancing, operating system updates, security patches, and partitioning. You can spend less time on infrastructure maintenance and more time on building your event streaming applications.  

### Supports streaming large messages

In most streaming scenarios, data is lightweight, typically less than 1 MB, and requires high throughput. There are instances where messages can't be divided into smaller segments. Self-serve dedicated clusters can accommodate events up to 20 MB of size at no extra cost. This capability allows Event Hubs to handle a wide range of message sizes to ensure uninterrupted business operations. For more information, see [Send and receive large messages with Azure Event Hubs](event-hubs-quickstart-stream-large-messages.md).

## Capacity units

Dedicated clusters are provisioned and billed by capacity units (CUs), which is a preallocated amount of CPU and memory resources.

How much you can ingest and stream per CU depends on factors such as the:

- Number of producers and consumers.
- Number of partitions.
- Producer and consumer configuration.
- Payload size.
- Egress rate.

To determine the necessary number of CUs, you should carry out your anticipated event streaming workload on an Event Hubs dedicated cluster while you observe the cluster's resource utilization. For more information, see [When should I scale my dedicated cluster](#when-should-i-scale-my-dedicated-cluster).

## Cluster provisioning and scaling

When you create a dedicated cluster through the Azure portal or Azure Resource Manager templates (ARM templates), you get a self-serve scalable cluster that you can scale the number of CUs allocated to the cluster. To learn how to scale your dedicated cluster, see [Scale a dedicated cluster](event-hubs-dedicated-cluster-create-portal.md#scale-a-dedicated-cluster).

Approximately one CU provides *ingress capacity ranging from 100 MB/sec to 200 MB/sec*, although actual throughput might fluctuate depending on various factors.

You can purchase up to 10 CUs for a cluster in the Azure portal. You can scale clusters incrementally with CUs ranging from 1 to 10. If you need a cluster larger than 10 CUs, you can [submit a support request](event-hubs-dedicated-cluster-create-portal.md#submit-a-support-request) to scale up your cluster after its creation.

> [!IMPORTANT]
> To enable availability zones on an Event Hubs dedicated cluster, you must provision the cluster with three or more CUs. Availability zone support is only available in [Azure regions with availability zones](/azure/reliability/availability-zones-region-support). You can't currently create zone-redundant dedicated clusters through the Azure portal or ARM templates, so [submit a support request](event-hubs-dedicated-cluster-create-portal.md#submit-a-support-request) to create one.

## Quotas and limits

The Event Hubs Dedicated offering is billed at a fixed monthly price with a *minimum of four hours of usage*. The Dedicated tier offers all the features of the Premium plan, but with enterprise-scale capacity and limits for customers with demanding workloads.

For more information about quotas and limits, see [Event Hubs quotas and limits](event-hubs-quotas.md).

## FAQs

[!INCLUDE [event-hubs-dedicated-clusters-faq](./includes/event-hubs-dedicated-clusters-faq.md)]

## Related content
Explore more about Event Hubs Dedicated:  
- [Create an Event Hubs cluster through the Azure portal](https://portal.azure.com).  
- [Event Hubs Dedicated pricing](https://azure.microsoft.com/pricing/details/event-hubs/): Learn about pricing tiers and capacity options.  
- [Event Hubs FAQ](event-hubs-faq.yml): Find answers to frequently asked questions about Event Hubs.  
