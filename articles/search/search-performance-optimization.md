---
title: Scale for performance
titleSuffix: Azure Cognitive Search
description: Learn techniques and best practices for tuning Azure Cognitive Search performance and configuring optimum scale.

manager: nitinme
author: LiamCavanagh
ms.author: liamca
ms.devlang: rest-api
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/14/2020
---

# Scale for performance on Azure Cognitive Search

This article describes best practices for advanced scenarios with sophisticated requirements for scalability and availability.

## Start with baseline numbers

Before undertaking a larger deployment effort, make sure you know what a typical query load looks like. The following guidelines can help you arrive at baseline query numbers.

1. Pick a target latency (or maximum amount of time) that a typical search request should take to complete.

1. Create and test a real workload against your search service with a realistic data set to measure these latency rates.

1. Start with a low number of queries per second (QPS) and then gradually increase the number executed in the test until the query latency drops below the predefined target. This is an important benchmark to help you plan for scale as your application grows in usage.

1. Wherever possible, reuse HTTP connections. If you are using the Azure Cognitive Search .NET SDK, this means you should reuse an instance or [SearchIndexClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchindexclient) instance, and if you are using the REST API, you should reuse a single HttpClient.

1. Vary the substance of query requests so that search occurs over different parts of your index. Variation is important because if you continually execute the same search requests, caching of data will start to make performance look better than it might with a more disparate query set.

1. Vary the structure of query requests so that you get different types of queries. Not every search query performs at the same level. For example, a document lookup or search suggestion is typically faster than a query with a significant number of facets and filters. Test composition should include various queries, in roughly the same ratios as you would expect in production.  

While creating these test workloads, there are some characteristics of Azure Cognitive Search to keep in mind:

+ It is possible overload your service by pushing too many search queries at one time. When this happens, you will see HTTP 503 response codes. To avoid a 503 during testing, start with various ranges of search requests to see the differences in latency rates as you add more search requests.

+ Azure Cognitive Search does not run indexing tasks in the background. If your service handles query and indexing workloads concurrently, take this into account by either introducing indexing jobs into your query tests, or by exploring options for running indexing jobs during off peak hours.

> [!Tip]
> You can simulate a realistic query load using load testing tools. Try [load testing with Azure DevOps](https://docs.microsoft.com/azure/devops/test/load-test/get-started-simple-cloud-load-test?view=azure-devops) or use one of these [alternatives](https://docs.microsoft.com/azure/devops/test/load-test/overview?view=azure-devops#alternatives).

## Scale for high query volume

A service is overburdened when queries take too long or when the service starts dropping requests. If this happens, you can address the problem in one of two ways:

+ **Add replicas**  

  Each replica is a copy of your data, allowing the service to load balance requests against multiple copies.  All load balancing and replication of data is managed by Azure Cognitive Search and you can alter the number of replicas allocated for your service at any time. You can allocate up to 12 replicas in a Standard search service and 3 replicas in a Basic search service. Replicas can be adjusted either from the [Azure portal](search-create-service-portal.md) or [PowerShell](search-manage-powershell.md).

+ **Create a new service at a higher tier**  

  Azure Cognitive Search comes in a [number of tiers](https://azure.microsoft.com/pricing/details/search/) and each one offers different levels of performance. In some cases, you may have so many queries that the tier you are on cannot provide sufficient turnaround, even when replicas are maxed out. In this case, consider moving to a higher performing tier, such as the Standard S3 tier, designed for scenarios having large numbers of documents and extremely high query workloads.

## Scale for slow individual queries

Another reason for high latency rates is a single query taking too long to complete. In this case, adding replicas will not help. Two possible options that might help include the following:

+ **Increase Partitions**

  A partition splits data across extra computing resources. Two partitions split data in half, a third partition splits it into thirds, and so forth. One positive side-effect is that slower queries sometimes perform faster due to parallel computing. We have noted parallelization on low selectivity queries, such as queries that match many documents, or facets providing counts over a large number of documents. Since significant computation is required to score the relevancy of the documents, or to count the numbers of documents, adding extra partitions helps queries complete faster.  
   
  There can be a maximum of 12 partitions in Standard search service and 1 partition in the Basic search service. Partitions can be adjusted either from the [Azure portal](search-create-service-portal.md) or [PowerShell](search-manage-powershell.md).

+ **Limit High Cardinality Fields**

  A high cardinality field consists of a facetable or filterable field that has a significant number of unique values, and as a result, consumes significant resources when computing results. For example, setting a Product ID or Description field as facetable/filterable would count as high cardinality because most of the values from document to document are unique. Wherever possible, limit the number of high cardinality fields.

+ **Increase Search Tier**  

  Moving up to a higher Azure Cognitive Search tier can be another way to improve performance of slow queries. Each higher tier provides faster CPUs and more memory, both of which have a positive impact on query performance.

## Scale for availability

Replicas not only help reduce query latency, but can also allow for high availability. With a single replica, you should expect periodic downtime due to server reboots after software updates or for other maintenance events that will occur. As a result, it is important to consider if your application requires high availability of searches (queries) as well as writes (indexing events). Azure Cognitive Search offers SLA options on all the paid search offerings with the following attributes:

+ Two replicas for high availability of read-only workloads (queries)

+ Three or more replicas for high availability of read-write workloads (queries and indexing)

For more details on this, please visit the [Azure Cognitive Search Service Level Agreement](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

Since replicas are copies of your data, having multiple replicas allows Azure Cognitive Search to do machine reboots and maintenance against one replica, while query execution continues on other replicas. Conversely, if you take replicas away, you'll incur query performance degradation, assuming those replicas were an under-utilized resource.

## Scale for geo-distributed workloads and geo-redundancy

For geo-distributed workloads, users who are located far from the host data center will have higher latency rates. One mitigation is to provision multiple search services in regions with closer proximity to these users.

Azure Cognitive Search does not currently provide an automated method of geo-replicating Azure Cognitive Search indexes across regions, but there are some techniques that can be used that can make this process simple to implement and manage. These are outlined in the next few sections.

The goal of a geo-distributed set of search services is to have two or more indexes available in two or more regions, where a user is routed to the Azure Cognitive Search service that provides the lowest latency as seen in this example:

   ![Cross-tab of services by region][1]

### Keep data synchronized across multiple services

There are two options for keeping your distributed search services in sync, which consist of either using the [Azure Cognitive Search Indexer](search-indexer-overview.md) or the Push API (also referred to as the [Azure Cognitive Search REST API](https://docs.microsoft.com/rest/api/searchservice/)).  

### Use indexers for updating content on multiple services

If you are already using indexer on one service, you can configure a second indexer on a second service to use the same data source object, pulling data from the same location. Each service in each region has its own indexer and a target index (your search index is not shared, which means data is duplicated), but each indexer references the same data source.

Here is a high-level visual of what that architecture would look like.

   ![Single data source with distributed indexer and service combinations][2]

### Use REST APIs for pushing content updates on multiple services

If you are using the Azure Cognitive Search REST API to [push content in your Azure Cognitive Search index](https://docs.microsoft.com/rest/api/searchservice/update-index), you can keep your various search services in sync by pushing changes to all search services whenever an update is required. In your code, make sure to handle cases where an update to one search service fails but succeeds for other search services.

## Leverage Azure Traffic Manager

[Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) allows you to route requests to multiple geo-located websites that are then backed by multiple search services. One advantage of the Traffic Manager is that it can probe Azure Cognitive Search to ensure that it is available and route users to alternate search services in the event of downtime. In addition, if you are routing search requests through Azure Web Sites, Azure Traffic Manager allows you to load balance cases where the Website is up but not Azure Cognitive Search. Here is an example of what the architecture that leverages Traffic Manager.

   ![Cross-tab of services by region, with central Traffic Manager][3]

## Next steps

To learn more about the pricing tiers and services limits for each one, see [Service limits](search-limits-quotas-capacity.md). See [Plan for capacity](search-capacity-planning.md) to learn more about partition and replica combinations.

For a discussion about performance and demonstrations of the techniques discussed in this article, watch the following video:

> [!VIDEO https://channel9.msdn.com/Events/Microsoft-Azure/AzureCon-2015/ACON319/player]
> 

<!--Image references-->
[1]: ./media/search-performance-optimization/geo-redundancy.png
[2]: ./media/search-performance-optimization/scale-indexers.png
[3]: ./media/search-performance-optimization/geo-search-traffic-mgr.png
