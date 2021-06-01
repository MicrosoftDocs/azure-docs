---
title: Availability and continuity
titleSuffix: Azure Cognitive Search
description: learn how to make a search service highly available and resilient against period disruptions or even catastrophic failures.

author: LiamCavanagh
ms.author: liamca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 04/06/2021
ms.custom: references_regions
---

# Availability and business continuity in Azure Cognitive Search

In Cognitive Search, availability is achieved through multiple replicas, whereas business continuity (and disaster recovery) is achieved through multiple search services. This article provides guidance that you can use as a starting point for developing a strategy that meets your business requirements for both availability and continuous operations.

<a name="scale-for-availability"></a>

## High availability

In Cognitive Search, replicas are copies of your index. Having multiple replicas allows Azure Cognitive Search to do machine reboots and maintenance against one replica, while query execution continues on other replicas. For more information about adding replicas, see [Add or reduce replicas and partitions](search-capacity-planning.md#adjust-capacity).

For each individual search service, Microsoft guarantees at least 99.9% availability for configurations that meet these criteria: 

+ Two replicas for high availability of read-only workloads (queries)

+ Three or more replicas for high availability of read-write workloads (queries and indexing) 

No SLA is provided for the Free tier. For more information, see [SLA for Azure Cognitive Search](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

<a name="availability-zones"></a>

## Availability Zones

[Availability Zones](../availability-zones/az-overview.md) are an Azure platform capability that divides a region's data centers into distinct physical location groups to provide high-availability, within the same region. If you use Availability Zones for Cognitive Search, individual replicas are the units for zone assignment. A search service runs within one region; its replicas run in different zones.

You can utilize Availability Zones with Azure Cognitive Search by adding two or more replicas to your search service. Each replica will be placed in a different Availability Zone within the region. If you have more replicas than Availability Zones, the replicas will be distributed across Availability Zones as evenly as possible. There is no specific action on your part, except to [create a search service](search-create-service-portal.md) in a region that provides Availability Zones, and then to configure the service to [use multiple replicas](search-capacity-planning.md#adjust-capacity).

Azure Cognitive Search currently supports Availability Zones for Standard tier or higher search services that were created in one of the following regions:

+ Australia East (created January 30, 2021 or later)
+ Brazil South (created May 2, 2021 or later)
+ Canada Central (created January 30, 2021 or later)
+ Central US (created December 4, 2020 or later)
+ East US (created January 27, 2021 or later)
+ East US 2 (created January 30, 2021 or later)
+ France Central (created October 23, 2020 or later)
+ Germany West Central (created May 3, 2021, or later)
+ Japan East (created January 30, 2021 or later)
+ North Europe (created January 28, 2021 or later)
+ South Central US (created April 30, 2021 or later)
+ South East Asia (created January 31, 2021 or later)
+ UK South (created January 30, 2021 or later)
+ US Gov Virginia (created April 30, 2021 or later)
+ West Europe (created January 29, 2021 or later)
+ West US 2 (created January 30, 2021 or later)

Availability Zones do not impact the [Azure Cognitive Search Service Level Agreement](https://azure.microsoft.com/support/legal/sla/search/v1_0/). You still need 3 or more replicas for query high availability.

## Multiple services in separate geographic regions

Although most customers use just one service, service redundancy might be necessary if operational requirements include the following:

+ [Business continuity and disaster recovery (BCDR)](../best-practices-availability-paired-regions.md) (Cognitive Search does not provide instant failover in the event of an outage).
+ Globally deployed applications. If query and indexing requests come from all over the world, users who are closest to the host data center will have faster performance. Creating additional services in regions with close proximity to these users can equalize performance for all users.
+ [Multi-tenant architectures](search-modeling-multitenant-saas-applications.md) sometimes call for two or more services.

If you need two more search services, creating them in different regions can meet application requirements for continuity and recovery, as well as faster response times for a global user base.

Azure Cognitive Search does not currently provide an automated method of geo-replicating search indexes across regions, but there are some techniques that can be used that can make this process simple to implement and manage. These are outlined in the next few sections.

The goal of a geo-distributed set of search services is to have two or more indexes available in two or more regions, where a user is routed to the Azure Cognitive Search service that provides the lowest latency:

   ![Cross-tab of services by region][1]

You can implement this architecture by creating multiple services and designing a strategy for data synchronization. Optionally, you can include a resource like Azure Traffic Manager for routing requests. For more information, see [Create a search service](search-create-service-portal.md).

<a name="data-sync"></a>

### Keep data synchronized across multiple services

There are two options for keeping two or more distributed search services in sync, which consist of either using the [Azure Cognitive Search Indexer](search-indexer-overview.md) or the Push API (also referred to as the [Azure Cognitive Search REST API](/rest/api/searchservice/)). 

#### Option 1: Use indexers for updating content on multiple services

If you are already using indexer on one service, you can configure a second indexer on a second service to use the same data source object, pulling data from the same location. Each service in each region has its own indexer and a target index (your search index is not shared, which means data is duplicated), but each indexer references the same data source.

Here is a high-level visual of what that architecture would look like.

   ![Single data source with distributed indexer and service combinations][2]

#### Option 2: Use REST APIs for pushing content updates on multiple services

If you are using the Azure Cognitive Search REST API to [push content to your search index](tutorial-optimize-indexing-push-api.md), you can keep your various search services in sync by pushing changes to all search services whenever an update is required. In your code, make sure to handle cases where an update to one search service fails but succeeds for other search services.

### Use Azure Traffic Manager to coordinate requests

[Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) allows you to route requests to multiple geo-located websites that are then backed by multiple search services. One advantage of the Traffic Manager is that it can probe Azure Cognitive Search to ensure that it is available and route users to alternate search services in the event of downtime. In addition, if you are routing search requests through Azure Web Sites, Azure Traffic Manager allows you to load balance cases where the Website is up but not Azure Cognitive Search. Here is an example of what the architecture that leverages Traffic Manager.

   ![Cross-tab of services by region, with central Traffic Manager][3]

## Disaster recovery and service outages

Although we can salvage your data, Azure Cognitive Search does not provide instant failover of the service if there is an outage at the cluster or data center level. If a cluster fails in the data center, the operations team will detect and work to restore service. You will experience downtime during service restoration, but you can request service credits to compensate for service unavailability per the [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/search/v1_0/). 

If continuous service is required in the event of catastrophic failures outside of Microsoft’s control, you could [provision an additional service](search-create-service-portal.md) in a different region and implement a geo-replication strategy to ensure indexes are fully redundant across all services.

Customers who use [indexers](search-indexer-overview.md) to populate and refresh indexes can handle disaster recovery through geo-specific indexers leveraging the same data source. Two services in different regions, each running an indexer, could index the same data source to achieve geo-redundancy. If you are indexing from data sources that are also geo-redundant, be aware that Azure Cognitive Search indexers can only perform incremental indexing (merging updates from new, modified, or deleted documents) from primary replicas. In a failover event, be sure to re-point the indexer to the new primary replica. 

If you do not use indexers, you would use your application code to push objects and data to different search services in parallel. For more information, see [Keep data synchronized across multiple services](#data-sync).

## Back up and restore alternatives

Because Azure Cognitive Search is not a primary data storage solution, Microsoft does not provide a formal mechanism for self-service back up and restore. However, you can use the **index-backup-restore** sample code in this [Azure Cognitive Search .NET sample repo](https://github.com/Azure-Samples/azure-search-dotnet-samples) to back up your index definition and snapshot to a series of JSON files, and then use these files to restore the index, if needed. This tool can also move indexes between service tiers.

Otherwise, your application code used for creating and populating an index is the de facto restore option if you delete an index by mistake. To rebuild an index, you would delete it (assuming it exists), recreate the index in the service, and reload by retrieving data from your primary data store.

## Next steps

To learn more about the pricing tiers and services limits for each one, see [Service limits](search-limits-quotas-capacity.md). See [Plan for capacity](search-capacity-planning.md) to learn more about partition and replica combinations.

For a discussion about performance and demonstrations of the techniques discussed in this article, watch the following video:

> [!VIDEO https://channel9.msdn.com/Events/Microsoft-Azure/AzureCon-2015/ACON319/player]
> 

<!--Image references-->
[1]: ./media/search-performance-optimization/geo-redundancy.png
[2]: ./media/search-performance-optimization/scale-indexers.png
[3]: ./media/search-performance-optimization/geo-search-traffic-mgr.png