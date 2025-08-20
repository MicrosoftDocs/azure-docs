---
title: Reliability in Azure AI Search
titleSuffix: Azure AI Search
description: Learn how to improve reliability in Azure AI Search by using availability zones, replicas, and multi-region deployments for more resilient performance.
author: haileytap
ms.author: haileytapia
ms.service: azure-ai-search
ms.topic: reliability-article
ms.date: 08/08/2025
ms.custom: subject-reliability
---

# Reliability in Azure AI Search

This article describes reliability support in Azure AI Search, covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

In Azure AI Search, you can achieve reliability by:

+ **Scaling a single search service**. Add multiple [replicas](/azure/search/search-capacity-planning#concepts-search-units-replicas-partitions) to increase availability and handle higher indexing and query workloads. If your region supports availability zones, replicas are distributed across different physical data centers on a best-effort basis for extra resiliency.

+ **Deploying multiple search services across different regions**. Each service operates independently within its region. However, in a multi-service scenario, you have options for synchronizing content across all services. You can also use a load-balancing solution to redistribute requests or fail over if there's a service outage.

## Production deployment recommendations for reliability

For production workloads, we recommend using a [billable tier](/azure/search/search-sku-tier) with at least [two replicas](/azure/search/search-capacity-planning#add-or-remove-partitions-and-replicas). This configuration makes your search service more resilient to transient faults and maintenance operations. It also meets the [service-level agreement](#service-level-agreement) for Azure AI Search, which requires two replicas for read-only workloads and three or more replicas for read-write workloads.

Azure AI Search doesn't provide a service-level agreement for the Free tier, which is limited to one replica and is strongly discouraged for production use.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Search services might experience transient faults during standard, unscheduled maintenance operations. Azure AI Search doesn't provide advance notification or allow scheduling of maintenance at specific times. Although every effort is made to minimize downtime, even for single-replica services, brief interruptions can still occur. To improve resiliency against these transient faults, we recommend that you use two or more replicas.

## Availability zone support

[!INCLUDE [Availability zone support description](includes/reliability-availability-zone-description-include.md)]

Azure AI Search is zone redundant, which means that your replicas are distributed across multiple availability zones within the service region.

When you add two or more replicas to your service, Azure AI Search attempts to place each replica in a different availability zone. For services with more replicas than available zones, replicas are distributed across zones as evenly as possible.

> [!IMPORTANT]
> Azure AI Search doesn't guarantee the exact placement of replicas, which is subject to capacity constraints, scaling operations, and other factors.

### Region support

Support for availability zones depends on infrastructure and storage. For a list of supported regions, see [Choose a region for Azure AI Search](/azure/search/search-region-support).

### Requirements

Zone redundancy is automatically enabled when your search service:

+ Is in a [region that has availability zones](/azure/search/search-region-support).
+ Is on the [Basic tier or higher](/azure/search/search-sku-tier). Zone redundancy isn't available for the Free tier.
+ Has [multiple replicas](/azure/search/search-capacity-planning#add-or-remove-partitions-and-replicas).

### Cost

Each search service starts with one replica. Zone redundancy requires two or more replicas, which increases the cost of running the service. To understand the billing implications of replicas, use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/).

### Configure availability zone support

If your search service meets the [requirements for zone redundancy](#requirements), no extra configuration is necessary. Whenever possible, Azure AI Search attempts to place your replicas in different availability zones.

### Zone-down experience

When an availability zone experiences an outage, your search service continues to operate using replicas in the surviving zones. The following points summarize the expected behavior:

+ **Detection and response**: Azure AI Search is responsible for detecting a failure in an availability zone. You don't need to do anything to initiate a zone failover.

+ **Notification**: Azure AI Search doesn't notify you when a zone is down.

+ **Active requests**: Any active requests are dropped and should be retried by the client.

+ **Expected data loss**: A zone failure isn't expected to cause data loss.

+ **Expected downtime**: A zone failure isn't expected to cause downtime to your search service, but it can temporarily reduce your service's overall capacity. To maintain optimal performance, consider provisioning more replicas than you typically need. Adding replicas during an outage is challenging, so overprovisioning helps ensure that your service can handle normal request volumes, even with reduced capacity.

+ **Traffic rerouting**: When a zone fails, Azure AI Search detects the failure and routes requests to active replicas in the surviving zones.

### Failback

When the availability zone recovers, Azure AI Search automatically restores normal operations and begins routing traffic to available replicas across all zones, including the recovered zone.

### Testing for zone failures

Azure AI Search manages traffic routing for zone-redundant services. You don't need to initiate or validate any zone failure processes.

## Multi-region support

Azure AI Search is a single-region service. If the region becomes unavailable, your search service also becomes unavailable.

### Alternative multi-region approaches

To use Azure AI Search in multiple regions, you must deploy separate services in each region. If you create an identical deployment in a secondary Azure region using a multi-region geography architecture, your application becomes less susceptible to a single-region disaster.

When you follow this approach, you must synchronize indexes across regions to recover the last application state. You must also configure load balancing and failover policies. For more information, see [Multi-region deployments in Azure AI Search](/azure/search/search-multi-region).

## Backups

Because AI Search isn't a primary data storage solution, it doesn't offer self-service backup and restore options. However, you can use the `index-backup-restore` sample for [.NET](https://github.com/Azure-Samples/azure-search-dotnet-utilities/tree/main/index-backup-restore) or [Python](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-python/code/utilities/index-backup-restore) to back up your index definition and its documents to a series of JSON files, which are then used to restore the index.

However, if you accidentally delete the index and don't have a backup, you can [rebuild the index](/azure/search/search-howto-reindex). Rebuilding involves recreating the index on your search service and then reloading it by retrieving data from your primary data store.

## Service-level agreement

The service-level agreement (SLA) for Azure AI Search describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. For more information, see the [SLA for Azure AI Search](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

SLA coverage applies to search services on billable tiers with at least two replicas. In Azure AI Search, a replica is a copy of your index. Each service can have between 1 and 12 replicas. When you [add replicas](/azure/search/search-capacity-planning#add-or-remove-partitions-and-replicas), Azure AI Search can then perform maintenance on one replica while queries continue to execute on other replicas.

Microsoft guarantees at least 99.9% availability of:

+ Read-only workloads (queries) for search services with two replicas.
+ Read-write workloads (queries and indexing) for search services with three or more replicas.

## Related content

+ [Reliability in Azure](overview.md)
+ [Service limits in Azure AI Search](/azure/search/search-limits-quotas-capacity)
+ [Choose a region for Azure AI Search](/azure/search/search-region-support)
+ [Choose a pricing tier for Azure AI Search](/azure/search/search-sku-tier)
+ [Plan or add capacity in Azure AI Search](/azure/search/search-capacity-planning)
