---
title: Availability and continuity
titleSuffix: Azure Cognitive Search
description: learn how to make a search service highly available and resilient against period disruptions or even catastrophic failures.

author: LiamCavanagh
ms.author: liamca
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/11/2022
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

## Data residency

Azure Cognitive Search won't store data outside of your specified region without your authorization. Specifically, the following features write to an Azure Storage resource: [enrichment cache](cognitive-search-incremental-indexing-conceptual.md), [debug session](cognitive-search-debug-session.md), [knowledge store](knowledge-store-concept-intro.md). The storage account is one that you provide, and it could be in any region. 

If both the storage account and the search service are in the same region, network traffic between search and storage uses a private IP address and occurs over the Microsoft backbone network. Because private IP addresses are used, you can't configure IP firewalls or a private endpoint for network security. Instead, use the [trusted service exception](search-indexer-howto-access-trusted-service-exception.md) as an alternative when both services are in the same region. 

<a name="availability-zones"></a>

## Availability Zones

[Availability Zones](../availability-zones/az-overview.md) are an Azure platform capability that divides a region's data centers into distinct physical location groups to provide high-availability, within the same region. If you use Availability Zones for Cognitive Search, individual replicas are the units for zone assignment. A search service runs within one region; its replicas run in different zones.

You can utilize Availability Zones with Azure Cognitive Search by adding two or more replicas to your search service. Each replica will be placed in a different Availability Zone within the region. If you have more replicas than Availability Zones, the replicas will be distributed across Availability Zones as evenly as possible. There is no specific action on your part, except to [create a search service](search-create-service-portal.md) in a region that provides Availability Zones, and then to configure the service to [use multiple replicas](search-capacity-planning.md#adjust-capacity).

Azure Cognitive Search currently supports Availability Zones for Standard tier or higher search services that were created in one of the following regions:

| Region | Roll out |
|--------|-----------|
| Australia East | January 30, 2021 or later |
| Brazil South |  May 2, 2021 or later |
| Canada Central | January 30, 2021 or later |
| Central India | January 20, 2022 or later |
| Central US | December 4, 2020 or later |
| East Asia | January 13, 2022 or later |
| East US | January 27, 2021 or later |
| East US 2 | January 30, 2021 or later |
| France Central| October 23, 2020 or later |
| Germany West Central |  May 3, 2021, or later |
| Japan East | January 30, 2021 or later |
| Korea Central | January 20, 2022 or later |
| North Europe | January 28, 2021 or later |
| Norway East | January 20, 2022 or later |
| South Central US | April 30, 2021 or later |
| South East Asia | January 31, 2021 or later |
| Sweden Central | January 21, 2022 or later |
| UK South | January 30, 2021 or later |
| US Gov Virginia | April 30, 2021 or later |
| West Europe | January 29, 2021 or later |
| West US 2 | January 30, 2021 or later |
| West US 3 | June 02, 2021 or later |

Availability Zones don't impact the [Azure Cognitive Search Service Level Agreement](https://azure.microsoft.com/support/legal/sla/search/v1_0/). You still need three or more replicas for query high availability.

## Multiple services in separate geographic regions

Although most customers use just one service, service redundancy might be necessary if operational requirements include the following:

+ [Business continuity and disaster recovery (BCDR)](../availability-zones/cross-region-replication-azure.md) (Cognitive Search doesn't provide instant failover in the event of an outage).
+ Globally deployed applications. If query and indexing requests come from all over the world, users who are closest to the host data center will have faster performance. Creating additional services in regions with close proximity to these users can equalize performance for all users.
+ [Multi-tenant architectures](search-modeling-multitenant-saas-applications.md) sometimes call for two or more services.

If you need two more search services, creating them in different regions can meet application requirements for continuity and recovery, as well as faster response times for a global user base.

Azure Cognitive Search doesn't provide an automated method of replicating search indexes across geographic regions, but there are some techniques that can make this process simple to implement and manage. These techniques are outlined in the next few sections.

The goal of a geo-distributed set of search services is to have two or more indexes available in two or more regions, where a user is routed to the Azure Cognitive Search service that provides the lowest latency:

   ![Cross-tab of services by region][1]

You can implement this architecture by creating multiple services and designing a strategy for data synchronization. Optionally, you can include a resource like Azure Traffic Manager for routing requests. For more information, see [Create a search service](search-create-service-portal.md).

<a name="data-sync"></a>

### Keep data synchronized across multiple services

There are two options for keeping two or more distributed search services in sync, which consist of either using the [Azure Cognitive Search Indexer](search-indexer-overview.md) or the Push API (also referred to as the [Azure Cognitive Search REST API](/rest/api/searchservice/)). 

#### Option 1: Use indexers for updating content on multiple services

If you're already using indexer on one service, you can configure a second indexer on a second service to use the same data source object, pulling data from the same location. Each service in each region has its own indexer and a target index (your search index isn't shared, which means data is duplicated), but each indexer references the same data source.

Here is a high-level visual of what that architecture would look like.

   ![Single data source with distributed indexer and service combinations][2]

#### Option 2: Use REST APIs for pushing content updates on multiple services

If you're using the Azure Cognitive Search REST API to [push content to your search index](tutorial-optimize-indexing-push-api.md), you can keep your various search services in sync by pushing changes to all search services whenever an update is required. In your code, make sure to handle cases where an update to one search service fails but succeeds for other search services.

### Use Azure Traffic Manager to coordinate requests

[Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) allows you to route requests to multiple geo-located websites that are then backed by multiple search services. One advantage of the Traffic Manager is that it can probe Azure Cognitive Search to confirm availability and route users to alternate search services if a service is down. In addition, if you're routing search requests through Azure Web Sites, Azure Traffic Manager can help you load balance cases where the web site is up, but search isn't. Here's an example of an architecture that leverages Traffic Manager.

   ![Cross-tab of services by region, with central Traffic Manager][3]

## Disaster recovery and service outages

As stated in the [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/search/v1_0/) we guarantee a high level of availability for index query requests when an Azure Cognitive Search service instance is configured with two or more replicas, and index update requests when an Azure Cognitive Search service instance is configured with three or more replicas. However, there is no built-in mechanism for disaster recovery. If continuous service is required in the event of a catastrophic failure outside of Microsoft’s control, we recommend provisioning a second service in a different region and implementing a geo-replication strategy to ensure indexes are fully redundant across all services.

Customers who use [indexers](search-indexer-overview.md) to populate and refresh indexes can handle disaster recovery through geo-specific indexers leveraging the same data source. Two services in different regions, each running an indexer, could index the same data source to achieve geo-redundancy. If you are indexing from data sources that are also geo-redundant, be aware that Azure Cognitive Search indexers can only perform incremental indexing (merging updates from new, modified, or deleted documents) from primary replicas. In a failover event, be sure to re-point the indexer to the new primary replica. 

If you don't use indexers, you would use your application code to push objects and data to different search services in parallel. For more information, see [Keep data synchronized across multiple services](#data-sync).

## Back up and restore alternatives

Because Azure Cognitive Search isn't a primary data storage solution, Microsoft doesn't provide a formal mechanism for self-service backup and restore. However, you can use the **index-backup-restore** sample code in this [Azure Cognitive Search .NET sample repo](https://github.com/Azure-Samples/azure-search-dotnet-samples) to back up your index definition and snapshot to a series of JSON files, and then use these files to restore the index, if needed. This tool can also move indexes between service tiers.

Otherwise, your application code used for creating and populating an index is the de facto restore option if you delete an index by mistake. To rebuild an index, you would delete it (assuming it exists), recreate the index in the service, and reload by retrieving data from your primary data store.

## Next steps

To learn more about the pricing tiers and services limits for each one, see [Service limits](search-limits-quotas-capacity.md). Review [Plan for capacity](search-capacity-planning.md) to learn more about partition and replica combinations, or checkout [Case Study: Use Cognitive Search to Support Complex AI Scenarios](https://techcommunity.microsoft.com/t5/azure-ai/case-study-effectively-using-cognitive-search-to-support-complex/ba-p/2804078) for real-world tips.

<!--Image references-->
[1]: ./media/search-performance-optimization/geo-redundancy.png
[2]: ./media/search-performance-optimization/scale-indexers.png
[3]: ./media/search-performance-optimization/geo-search-traffic-mgr.png
