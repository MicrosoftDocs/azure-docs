---
title: Overview of Azure Event Hubs Dedicated tier
description: This article provides an overview of the Dedicated tier of Azure Event Hubs, which offers single-tenant deployments of event hubs.  
ms.topic: article
ms.date: 02/07/2023
---

# Overview of the Azure Event Hubs Dedicated tier

Azure Event Hubs dedicated clusters are designed to meet the needs of the most demanding mission-critical event streaming workloads. These clusters provide a high-performance, low-latency, scalable, and reliable event streaming service for your event streaming applications that are based on the Advanced Message Queuing Protocol (Event Hubs SDK) or Apache Kafka APIs.

> [!NOTE]
> The Dedicated tier isn't available in all regions. Try to create a dedicated cluster in the Azure portal. See the supported regions in the **Location** dropdown list on the **Create Event Hubs Cluster** page.

## Why dedicated clusters?

The Dedicated tier of Event Hubs offers several benefits to customers who need to run mission-critical workloads at enterprise-level capacity.

### Low-latency event streaming

These clusters are optimized for low end-to-end latency and high performance. These clusters enable businesses to handle high-velocity and high-volume data streaming.

### Stream large volumes of data

Dedicated clusters can stream events at the scale of gigabytes per second or millions of events per second for most of the use cases. You can also scale these clusters to accommodate changes in event streaming volume.

### Guaranteed consistent performance

Event Hubs dedicated clusters minimize the latency jitter and ensure consistent performance with guaranteed capacity.

### Zero interference

Event Hubs dedicated clusters operate on a single-tenant architecture. This architecture ensures that the allocated resources aren't being shared with any other tenants. Unlike with other tiers, you won't see any cross-tenant interference in a dedicated cluster.

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

## Cluster types

Event Hubs dedicated clusters come in two distinct types: self-serve scalable clusters and legacy clusters. These two types differ in their support for the number of CUs, the amount of throughput each CU provides, and the regional and zone availability.

As a dedicated cluster user, you can determine the type of cluster by examining the availability of the capacity scaling feature in the portal. If this capability is present, you're using a self-serve scalable cluster. Conversely, if it isn't available, you're using a legacy dedicated cluster. Alternatively, you can look for the [Azure Resource Manager properties](/azure/templates/microsoft.eventhub/clusters?pivots=deployment-language-arm-template) related to dedicated clusters.

### Self-serve scalable clusters

Event Hubs self-serve scalable clusters are based on new infrastructure and allow users to scale the number of CUs allocated to each cluster. By creating a dedicated cluster through the Event Hubs portal or Azure Resource Manager templates (ARM templates), you gain access to a self-service scalable cluster. To learn how to scale your dedicated cluster, see [Scale Event Hubs dedicated clusters](event-hubs-dedicated-cluster-create-portal.md).

Approximately one CU in a self-serve scalable cluster provides *ingress capacity ranging from 100 MB/sec to 200 MB/sec*, although actual throughput might fluctuate depending on various factors.

With self-serve scalable clusters, you can purchase up to 10 CUs for a cluster in the Azure portal. In contrast to traditional clusters, these clusters can be scaled incrementally with CUs ranging from 1 to 10. If you need a cluster larger than 10 CUs, you can [submit a support request](event-hubs-dedicated-cluster-create-portal.md#submit-a-support-request) to scale up your cluster after its creation.

> [!IMPORTANT]
> You can deploy self-serve scalable dedicated clusters with [availability zones](../availability-zones/az-overview.md#azure-regions-with-availability-zones) that are enabled with three CUs. However, you can't use the self-serve scaling capability to scale the cluster. To create or scale an AZ-enabled self-serve cluster, you must [submit a support request](event-hubs-dedicated-cluster-create-portal.md#submit-a-support-request).

### Legacy clusters

Event Hubs dedicated clusters created before the availability of self-serve scalable clusters are referred to as legacy clusters.

To use these legacy clusters, direct creation through the Azure portal or ARM templates isn't possible. Instead, you must [submit a support request](event-hubs-Dedicated-cluster-create-portal.md#submit-a-support-request) to create one.

Approximately one CU in a legacy cluster provides *ingress capacity ranging from 50 MB/sec to 100 MB/sec*, although actual throughput might fluctuate depending on various factors.

With a legacy cluster, you can purchase up to 20 CUs.

Legacy Event Hubs dedicated clusters require at least eight CUs to enable availability zones. Availability zone support is only available in [Azure regions with availability zones](../availability-zones/az-overview.md#azure-regions-with-availability-zones).

> [!IMPORTANT]
> Migrating an existing legacy cluster to a self-serve cluster isn't currently supported. For more information, see [Migrating a legacy cluster to a self-serve scalable cluster](#can-i-migrate-my-standard-or-premium-namespaces-to-a-dedicated-tier-cluster).

## Determine the cluster type

You can determine the cluster type that you're using with the following methods.

| Method | Action | Self-serve scalable clusters | Legacy clusters | Notes |
| -------------| ------------- | --------- | --------- | --------- | 
| Use the portal | Check for the presence of the **Scale** tab under the cluster. | The **Scale** page is available in the cluster UI.| No **Scale** page is available in the cluster UI. |  | 
| Use Azure Resource Manager| Check for the `supportsScaling` Azure Resource Manager property on the cluster.  | Check for the presence of the **Scale** page under the cluster.   | No **Scale** page is available in the cluster UI. | Check this property in the portal, the Azure CLI, or PowerShell. Needs API version *2022-01-01-preview* or newer. | 
| Use `nslookup`| Run the `nslookup` command on a namespace in a cluster.   | CNAME maps to `*.cloudapp.azure.com`.   | CNAME maps to `*.cloudapp.net`. | Example: `nslookup ns.servicebus.windows.net`. | 

## Quotas and limits

The Event Hubs Dedicated offering is billed at a fixed monthly price with a *minimum of four hours of usage*. The Dedicated tier offers all the features of the Premium plan, but with enterprise-scale capacity and limits for customers with demanding workloads.

For more information about quotas and limits, see [Event Hubs quotas and limits](event-hubs-quotas.md).

## FAQs

[!INCLUDE [event-hubs-dedicated-clusters-faq](./includes/event-hubs-dedicated-clusters-faq.md)]

## Related content

Contact your Microsoft sales representative or Microsoft Support to get more details about Event Hubs Dedicated. You can also create a cluster or learn more about Event Hubs pricing tiers:

- [Create an Event Hubs cluster through the Azure portal](https://aka.ms/eventhubsclusterquickstart).
- Check out [Event Hubs Dedicated pricing](https://azure.microsoft.com/pricing/details/event-hubs/). You can also contact your Microsoft sales representative or Microsoft Support to get more details about Event Hubs Dedicated capacity.
- See the [Event Hubs FAQ](event-hubs-faq.yml) for pricing information and answers to frequently asked questions about Event Hubs.
