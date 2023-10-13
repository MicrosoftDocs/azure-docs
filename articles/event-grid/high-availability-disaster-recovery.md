---
title: High availability and disaster recovery for Azure Event Grid namespaces
description: Describes how Azure Event Grid's namespaces support building highly available solutions with disaster recovery capabilities.
ms.topic: conceptual
ms.date: 10/13/2023
author: veyaddan
ms.author: veyaddan
---

# Azure Event Grid - high availability and disaster recovery for namespaces
As a first step towards implementing a resilient solution, architects, developers, and business owners must define the uptime goals for the solutions they're building. These goals can be defined primarily based on specific business objectives for each scenario. In this context, the article [Azure Business Continuity Technical Guidance](/azure/architecture/framework/resiliency/app-design) describes a general framework to help you think about business continuity and disaster recovery. The [Disaster recovery and high availability for Azure applications](/azure/architecture/reliability/disaster-recovery) paper provides architecture guidance on strategies for Azure applications to achieve High Availability (HA) and Disaster Recovery (DR).

This article discusses the HA and DR features offered specifically by Azure Event Grid namespaces. The broad areas discussed in this article are:

* Intra-region HA
* Cross region DR
* Achieving cross region HA

Depending on the uptime goals you define for your Event Grid solutions, you should determine which of the options outlined in this article best suit your business objectives. Incorporating any of these HA/DR alternatives into your solution requires a careful evaluation of the trade-offs between the:

* Level of resiliency you require
* Implementation and maintenance complexity
* COGS impact

## Intra-region HA
Azure Event Grid namespace achieves intra-region high availability using availability zones. Azure Event Grid supports availability zones in all the regions where Azure support availability zones. This configuration provides replication and redundancy within the region and increases application and data resiliency during data center failures. For more information about availability zones, see [Azure availability zones](../availability-zones/az-overview.md).

## Cross region DR
There could be some rare situations when a datacenter experiences extended outages due to power failures or other failures involving physical assets. Such events are rare during which the intra region HA capability described previously might not always help. Currently, Event Grid namespace doesn't support cross-region DR. For a workaround, see the next section.

## Achieve cross region HA
You can achieve cross region high-availability through [client-side failover implementation](custom-disaster-recovery-client-side.md) by creating primary and secondary namespaces.

Implement a custom (manual or automated) process to replicate namespace, client identities, and other configuration including CA certificates, client groups, topic spaces, permission bindings, routing, between primary and secondary regions.

Implement a concierge service that provides clients with primary and secondary endpoints by performing a health check on endpoints. The concierge service can be a web application that is replicated and kept reachable using DNS-redirection techniques, for example, using Azure Traffic Manager.

An Active-Active DR solution can be achieved by replicating the metadata and balancing load across the namespaces. An Active-Passive DR solution can be achieved by replicating the metadata to keep the secondary namespace ready so that when the primary namespace is unavailable, the traffic can be directed to secondary namespace.


## Next steps

See the following article: [What's Azure Event Grid](overview.md)
 
