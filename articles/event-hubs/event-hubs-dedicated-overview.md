---
title: Overview of Azure Event Hubs Dedicated tier
description: This article provides an overview of Dedicated Azure Event Hubs, which offers single-tenant deployments of event hubs.  
ms.topic: article
ms.date: 02/07/2023
---

# Overview of Azure Event Hubs Dedicated tier

Event Hubs Dedicated clusters are designed to meet the needs of most demanding mission-critical event streaming workloads. These clusters provide a high-performance, low-latency, scalable, and reliable event streaming service for your event streaming applications that are based on AMQP(Event Hubs SDK) or Apache Kafka APIs. 

> [!NOTE]
> The Dedicated tier isn't available in all regions. Try to create a Dedicated cluster in the Azure portal and see supported regions in the **Location** drop-down list on the **Create Event Hubs Cluster** page.

## Why Dedicated cluster? 
The Dedicated tier of Event Hubs offers several benefits to customers who need run mission-critical workloads at enterprise-level capacity. 

### Low latency event streaming
These clusters are optimized for low end-to-end latency and high performance. Therefore these clusters enable businesses to handle high-velocity and high-volume data streaming. 

### Streaming large volumes of data
Dedicated clusters can stream events at the gigabytes per second or millions of events per second scale for Most of the use cases. Also, these clusters can be easily scaled to accommodate changes in event streaming volume.


### Guaranteed consistent performance
Event Hubs Dedicated clusters minimize the latency jitter and ensure consistent performance with guaranteed capacity. 

### Zero interference
Event Hubs Dedicated Clusters operate on a single-tenant architecture. Therefore it ensures that the allocated resources being not shared with any other tenants. Therefore, unlike other tiers, you wouldn't see any cross tenant interference in Dedicated cluster. 

###  Self-serve scaling 
The Dedicated cluster offers self-serve scaling capabilities that allow you to adjust the capacity of the cluster according to dynamic loads and to facilitate business operations. You can scale out during spikes in usage and scale in when the usage is low. 

### High-end features and generous quotas
Dedicated clusters include all features of the Premium tier and more. The service also manages load balancing, operating system updates, security patches, and partitioning. So, you can spend less time on infrastructure maintenance and more time on building your event streaming applications.  

## Capacity Units(CU)
Dedicated clusters are provisioned and billed by capacity units (CUs), a pre-allocated amount of CPU and memory resources. 

How much you can ingest and stream per CU depends on various factors, such as the following ones:
- Number of producers and consumers
- Number of partitions.
- Producer and consumer configuration.
- Payload size
- Egress rate

Therefore, to determine the necessary number of CUs, you should carry out your anticipated event streaming workload on an Event Hubs Dedicated cluster while observing the cluster's resource utilization. For more information, see [When to scale my Dedicated cluster](#when-to-scale-my-dedicated-cluster). 

## Cluster Types
Event Hubs Dedicated Clusters come in two distinct types: Self-serve scalable clusters and Legacy clusters. These two types differ in their support for the number of CUs, the amount of throughput each CU provides, and the regional and zone availability. 

As a Dedicated cluster user, you can determine the type of cluster by examining the availability of the capacity scaling feature in the portal. If this capability is present, you're using a self-serve scalable cluster. Conversely, if it isn't available, you're utilizing a legacy Dedicated cluster. Alternatively you can look for the [Azure Resource Manager properties](/azure/templates/microsoft.eventhub/clusters?pivots=deployment-language-arm-template) related to Dedicated clusters. 

### Self-serve scalable clusters
Event Hubs Self-serve scalable clusters are based on new infrastructure and allow users to easily scale the number of capacity units allocated to each cluster. By creating a Dedicated cluster through the Event Hubs portal or ARM templates, you gain access to a self-service scalable cluster. To learn how to scale your Dedicated cluster, see [Scale Event Hubs Dedicated clusters](event-hubs-dedicated-cluster-create-portal.md). 


Approximately, one capacity unit (CU) in a self-serve scalable cluster provides *ingress capacity ranging from 100 MB/s to 200 MB/s*, although actual throughput may fluctuate depending on various factors.

With self-serve scalable clusters, you can purchase up to 10 CUs for a cluster in the Azure portal. In contrast to traditional clusters, these clusters can be scaled incrementally with CUs ranging from 1 to 10.
If you need a cluster larger than 10 CU, you can [submit a support request](event-hubs-dedicated-cluster-create-portal.md#submit-a-support-request) to scale up your cluster after its creation.

> [!IMPORTANT] 
> Self-serve scalable Dedicated can be deployed with [availability zones](../availability-zones/az-overview.md#azure-regions-with-availability-zones) enabled with 3 CUs but you won't be able to use the self-serve scaling capability to scale the cluster. To create or scale an AZ enabled self-serve cluster you must [submit a support request](event-hubs-dedicated-cluster-create-portal.md#submit-a-support-request). 

### Legacy clusters 
Event Hubs Dedicated clusters created prior to the availability of self-serve scalable clusters are referred to as legacy clusters. 

To use these legacy clusters, direct creation through the Azure portal or ARM templates isn't possible and you must instead [submit a support request](event-hubs-Dedicated-cluster-create-portal.md#submit-a-support-request) to create one. 

Approximately, one capacity unit (CU) in a legacy cluster provides *ingress capacity ranging from 50 MB/s to 100 MB/s*, although actual throughput may fluctuate depending on various factors. 

With Legacy cluster, you can purchase up to 20 CUs. 

> [!Note] 
> Legacy Event Hubs Dedicated clusters require at least 8 Capacity Units(CUs) to enable availability zones. Availability zone support is only available in [Azure regions with availability zones](../availability-zones/az-overview.md#azure-regions-with-availability-zones). 

> [!IMPORTANT] 
> Migrating an existing Legacy cluster to a Self-Serve Cluster isn't currently support. For more information, see [migrating a Legacy cluster to Self-Serve Scalable cluster.](#can-i-migrate-my-standard-or-premium-namespaces-to-a-dedicated-tier-cluster). 

## Determining cluster type 

You can determine the cluster type that you're using the following methods. 

| Method | Action | Self-serve scalable clusters | Legacy clusters | Notes |
| -------------| ------------- | --------- | --------- | --------- | 
| Using Portal | Check for presence of ‘Scale’ tab under the cluster | ‘Scale’ page available in the cluster UI.| No scale page available in the cluster UI. |  | 
| Using Azure Resource Manager| Check for `supportsScaling` Azure Resource Manager property on cluster.  | Check for presence of ‘Scale’ page under the cluster.   | No scale page available in the cluster UI. | Check this property on Portal, CLI or PowerShell. Needs API version *2022-01-01-preview* or newer. | 
| Using nslookup| Run nslookup command on a namespace in cluster.   | CNAME maps to `*.cloudapp.azure.com`.   | CNAME maps to `*.cloudapp.net`. | Example: `nslookup ns.servicebus.windows.net`. | 

## Quotas and limits
The Event Hubs Dedicated offering is billed at a fixed monthly price, with a **minimum of 4 hours of usage**. The Dedicated tier offers all the features of the premium plan, but with enterprise-scale capacity and limits for customers with demanding workloads. 

For more information about quotas and limits, see [Event Hubs quotas and limits](event-hubs-quotas.md)

## FAQs

[!INCLUDE [event-hubs-dedicated-clusters-faq](./includes/event-hubs-dedicated-clusters-faq.md)]

## Next steps

Contact your Microsoft sales representative or Microsoft Support to get more details about Event Hubs Dedicated. You can also create a cluster or learn more about Event Hubs pricing tiers by visiting the following links:

- [Create an Event Hubs cluster through the Azure portal](https://aka.ms/eventhubsclusterquickstart) 
- [Event Hubs Dedicated pricing](https://azure.microsoft.com/pricing/details/event-hubs/). You can also contact your Microsoft sales representative or Microsoft Support to get more details about Event Hubs Dedicated capacity.
- The [Event Hubs FAQ](event-hubs-faq.yml) contains pricing information and answers some frequently asked questions about Event Hubs.
