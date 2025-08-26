---
title: Reliability in Azure AI Search
titleSuffix: Azure AI Search
description: Find out about reliability in Azure AI Search, including availability zones, multi-region deployments, transient faults, and backup options.
author: haileytap
ms.author: haileytapia
ms.service: azure-ai-search
ms.topic: reliability-article
ms.date: 08/25/2025
ms.custom: subject-reliability
---

# Reliability in Azure AI Search

Azure AI Search is a scalable search infrastructure that indexes heterogeneous content and enables retrieval through APIs, applications, and AI agents. It's suitable for enterprise search scenarios and AI-powered customer experiences that require dynamic content generation through chat completion models.

This article describes reliability support in [Azure AI Search](/azure/search/search-what-is-azure-search), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

For production workloads, we recommend that you use a [billable tier](/azure/search/search-sku-tier) that has at least [two replicas](/azure/search/search-capacity-planning#add-or-remove-partitions-and-replicas). This configuration makes your search service more resilient to transient faults and maintenance operations. It also meets the [service-level agreement (SLA)](#sla) for AI Search. The SLA requires two replicas for read-only workloads and three or more replicas for read-write workloads.

AI Search doesn't provide an SLA for the Free tier, which is limited to one replica and is discouraged for production use.

## Reliability architecture overview

When you use AI Search, you create a *search service*. Each search service supports many *search indexes* that store your searchable content.

AI Search isn't designed as a primary data store. Instead, you use *indexers* to connect your search service to external data sources. An indexer crawls the source data, invokes *skills* that perform processing and enrichment, and populates your index with the skill outputs.

You also configure the number of *replicas* for your service. In AI Search, a replica is a copy of your service's search engine. You can think of a replica as representing a single virtual machine (VM). Each search service can have between 1 and 12 replicas.

The addition of multiple replicas allows AI Search to:

- Increase the availability of your search service.

- Perform maintenance on one replica while queries continue to run on other replicas.

- Handle higher indexing and query workloads.

- Improve resiliency by attempting to provision replicas in different availability zones, if your region supports them.

AI Search automatically assigns one replica to be the *primary replica*. All write operations are performed against that replica. The other replicas are used for read operations.

You can also configure the number of *partitions*, which represent the storage that the search indexes use.

It's important to understand the impact of adding replicas and partitions because they each affect read and write performance in different ways. For more information about replicas and partitions, see [Estimate and manage capacity of a search service](/azure/search/search-capacity-planning).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

AI Search indexers have built-in transient fault handling. If a data source is briefly unavailable, the indexer is designed to recover and retry. It uses change tracking to resume indexing from the last successfully indexed document.

Search services might experience transient faults during standard, unscheduled maintenance operations. Azure AI Search doesn't provide advance notification or allow scheduling of maintenance at specific times. Although every effort is made to minimize downtime, even for single-replica services, brief interruptions can still occur. To improve resiliency against these transient faults, we recommend that you use two or more replicas.

If you build any applications that interact with AI Search, they should handle transient faults. Use a retry strategy with exponential backoffs for both read and write operations.

## Availability zone support

[!INCLUDE [Availability zone support description](includes/reliability-availability-zone-description-include.md)]

Azure AI Search is zone redundant, which means that your replicas are distributed across multiple availability zones within the search service region.

When you add two or more replicas to your service, AI Search attempts to place each replica in a different availability zone. For services that have more replicas than available zones, replicas are distributed across zones as evenly as possible.

> [!IMPORTANT]
> AI Search doesn't guarantee the exact placement of replicas. Placement is subject to capacity constraints, scaling operations, and other factors.

### Region support

Support for availability zones depends on infrastructure and storage. For a list of supported regions, see [Choose a region for AI Search](/azure/search/search-region-support).

### Requirements

Zone redundancy is automatically enabled when your search service meets all of the following criteria:

- Is in a [region that has availability zones](/azure/search/search-region-support).
- Is on the [Basic tier or higher](/azure/search/search-sku-tier).
- Has [at least two replicas](/azure/search/search-capacity-planning#add-or-remove-partitions-and-replicas).
  
> [!NOTE]
> AI Search attempts to distribute replicas across multiple zones when you have two or more replicas. However, for read-write workloads, you should use three or more replicas so that you receive the highest possible availability SLA.

### Instance distribution across zones

AI Search attempts to place replicas across different availability zones. However, there are occasionally situations where all of the replicas of a search service might be placed into the same availability zone. This situation can happen when replicas are removed from your service, such as when you *scale in* by configuring your service to use fewer replicas. The reason is that replica removal doesn't cause the remaining replicas to be rebalanced across the availability zones.

To reduce the likelihood of all of your replicas being placed into a single availability zone, you can manually trigger a scale-out operation immediately after a scale-in operation. For example, suppose that your search service has 10 replicas and you want to scale in to 7 replicas. Instead of performing a single scale operation, you can temporarily scale to 6 instances and then immediately scale to 7 instances to trigger zone rebalancing.

### Cost

Each search service starts with one replica. Zone redundancy requires two or more replicas, which increases the cost to run the service. To understand the billing implications of replicas, use the [pricing calculator](https://azure.microsoft.com/pricing/calculator/).

### Configure availability zone support

If your search service meets the [requirements for zone redundancy](#requirements), no extra configuration is necessary. Whenever possible, AI Search attempts to place your replicas in different availability zones.

### Capacity planning and management

To prepare for availability zone failure, consider *overprovisioning* the number of replicas. Overprovisioning allows the search service to tolerate some capacity loss and continue to function without degraded performance. Adding replicas during an outage is challenging, so overprovisioning helps ensure that your search service can handle normal request volumes, even with reduced capacity. For more information, see [Manage capacity by overprovisioning](/azure/reliability/concept-redundancy-replication-backup#manage-capacity-with-over-provisioning).

### Normal operations

This section describes what to expect when search services are configured for zone redundancy and all availability zones are operational.

- **Traffic routing between zones:** AI Search performs automatic load balancing of all queries and writes across all of the available replicas. Read operations can be sent to any replica in any availability zone. Write operations are sent to a single primary replica that the AI Search service selects.

- **Data replication between zones:** Changes in data are automatically replicated between replicas across availability zones. Replication occurs asynchronously, which means that writes are committed to one primary replica before they're replicated to other replicas.

### Zone-down experience

This section describes what to expect when search services are configured for zone redundancy and an availability zone outage occurs.

- **Detection and response:** AI Search is responsible for detecting a failure in an availability zone. You don't need to do anything to initiate a zone failover.

- **Notification:** AI Search doesn't notify you when a zone is down. However, you can use [Azure Resource Health](/azure/service-health/resource-health-overview) to monitor for the health of replicas. If a zone is down, the replicas in that zone show as unavailable. You can also use [Azure Service Health](/azure/service-health/overview) to understand the overall health of the AI Search service, including any zone failures.

  Set up alerts on these services to receive notifications about zone-level problems. For more information, see [Create Service Health alerts in the Azure portal](/azure/service-health/alerts-activity-log-service-notifications-portal) and [Create and configure Resource Health alerts](/azure/service-health/resource-health-alert-arm-template-guide).

- **Active requests:** Requests that replicas process in the failed zone are terminated. Clients should retry the requests by following the guidance for [handling transient faults](#transient-faults).

- **Expected data loss:** If the affected availability zone only contains read replicas, no data loss is expected.
  
  If the primary replica is lost because it was in the affected zone, then any write operations that haven't yet been replicated might be lost.

- **Expected downtime:** In most situations, a zone failure isn't expected to cause downtime to your search service for read operations because read replicas in other availability zones continue to serve requests.

    If the primary replica is lost because it was in the affected zone, AI Search automatically promotes another replica to become the new primary so that write operations can resume. It typically takes a few seconds for the replica promotion to occur. During this time, write operations might not succeed. Ensure that your applications are prepared by following [transient fault handling guidance](#transient-faults).

    However, there are some unlikely situations where all of your search service's replicas might be in a single availability zone. In this scenario, you might experience downtime until the zone recovers. For more information, and to understand a workaround, see [Instance distribution](#instance-distribution-across-zones).

- **Traffic rerouting:** When a zone fails, AI Search detects the failure and routes requests to active replicas in the surviving zones. If the primary replica is lost, another replica is promoted to be the new primary.

### Zone recovery

When the availability zone recovers, AI Search automatically restores normal operations and begins routing traffic to available replicas across all zones, including the recovered zone.

### Testing for zone failures

AI Search manages traffic routing for zone-redundant services. You don't need to initiate or validate any zone failure processes.

## Multi-region support

AI Search is a single-region service. If the region becomes unavailable, your search service also becomes unavailable.

### Alternative multi-region approaches

You can optionally deploy multiple AI Search services in different regions. You're responsible for deploying and configuring separate services in each region. If you create an identical deployment in a secondary Azure region using a multi-region architecture, your application becomes less susceptible to a single-region disaster.

When you follow this approach, you must synchronize indexes across regions to recover the last application state. You must also configure load balancing and failover policies. For more information, see [Multi-region deployments in AI Search](/azure/search/search-multi-region).

## Backups

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [Redundancy, replication, and backup](concept-redundancy-replication-backup.md).

Because AI Search isn't a primary data storage solution, it doesn't provide self-service backup and restore options. However, you can use the `index-backup-restore` sample for [.NET](https://github.com/Azure-Samples/azure-search-dotnet-utilities/tree/main/index-backup-restore) or [Python](https://github.com/Azure/azure-search-vector-samples/tree/main/demo-python/code/utilities/index-backup-restore) to back up your index definition and its documents to a series of JSON files, which are then used to restore the index.

However, if you accidentally delete the index and don't have a backup, you can [rebuild the index](/azure/search/search-howto-reindex). Rebuilding involves recreating the index on your search service and then reloading it by retrieving data from your primary data store.

## SLA

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

In AI Search, the availability SLA applies to search services that:

- Are configured to use [a billable tier](/azure/search/search-sku-tier).
- Have at least two [replicas](/azure/search/search-capacity-planning#add-or-remove-partitions-and-replicas) for read-only workloads (queries).
- Have at least three replicas for read-write workloads (queries and indexing).

## Related content

- [Reliability in Azure](overview.md)
- [Service limits in AI Search](/azure/search/search-limits-quotas-capacity)
- [Choose a region for AI Search](/azure/search/search-region-support)
- [Choose a pricing tier for AI Search](/azure/search/search-sku-tier)
- [Plan or add capacity in AI Search](/azure/search/search-capacity-planning)
