<properties 
	pageTitle="Azure Search performance and optimization considerations | Microsoft Azure" 
	description="Tune Azure Search performance and configure optimum scale" 
	services="search" 
	documentationCenter="" 
	authors="LiamCavanagh" 
	manager="pablocas" 
	editor=""/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="06/27/2016" 
	ms.author="liamca"/>

# Azure Search performance and optimization considerations

A great search experience is a key to success for many mobile and web applications. From real estate, to used car marketplaces to online catalogs, fast search and relevant results will affect the customer experience. This document is intended to help you discover best practices for how to get the most out of Azure Search, especially for advanced scenarios with sophisticated requirements for scalability, multi-language support, or custom ranking.  In addition, this document outlines internals and covers approaches that work effectively in real-world customer apps.

## Performance and scale tuning for Search services

We are all used to search engines such as Bing and Google and the high performance they offer.  As a result, when customers use your search-enabled web or mobile application, they will expect similar performance characteristics.  When optimizing for search performance, one of the best approaches is to focus on latency, which is the time a query takes to complete and return results.  When optimizing for search latency it is important to:

1. Pick a target latency (or maximum amount of time) that a typical search request should take to complete.

2. Create and test a real workload against your search service with a realistic dataset to measure these latency rates.

3. Start with a low number of queries per second (QPS) and continue to increase the number executed in the test until the query latency drops below the defined target latency.  This is an important benchmark to help you plan for scale as your application grows in usage.

4. Wherever possible, reuse HTTP connections.  If you are using the Azure Search .NET SDK, this means you should reuse an instance or [SearchIndexClient](https://msdn.microsoft.com/library/azure/microsoft.azure.search.searchindexclient.aspx) instance, and if you are using the REST API, you should reuse a single HttpClient.
 
While creating these test workloads, there are some characteristics of Azure Search to keep in mind:

1. It is possible to push so many search queries at one time, that the resources available in your Azure Search service will be overwhelmed.  When this happens, you will see HTTP 503 response codes.  For this reason, it is best to start with various ranges of search requests to see the differences in latency rates as you add more search requests.

2. Uploading of content to Azure Search will impact the overall performance and latency of the Azure Search service.  If you expect to send data while users are performing searches, it is important to take this workload into account in your tests.

3. Not every search query will perform at the same performance levels.  For example, a document lookup or search suggestion will typically perform faster than a query with a significant number of facets and filters.  It is best to take the various queries you expect to see into account when building your tests.  

4. Variation of search requests is important because if you continually execute the same search requests, caching of data will start to make performance look better than it might with a more disparate query set.

> [AZURE.NOTE] [Visual Studio Load Testing](https://www.visualstudio.com/docs/test/performance-testing/run-performance-tests-app-before-release) is a really good way to perform your benchmark tests as it allows you to execute HTTP requests as you would need for executing queries against Azure Search and enables parallelization of requests.

## Scaling Azure Search for high query rates and throttled requests

When you are receiving too many throttled requests or exceed your target latency rates from an increased query load, you can look to decrease latency rates in one of two ways:

1. **Increase Replicas:**  A replica is like a copy of your data allowing Azure Search to load balance requests against the multiple copies.  All load balancing and replication of data across replicas is managed by Azure Search and you can alter the number of replicas allocated for your service at any time.  You can allocate up to 12 replicas in a Standard search service and 3 replicas in a Basic search service.  Replicas can be adjusted either from the [Azure Portal](search-create-service-portal.md) or using the [Azure Search management API](search-get-started-management-api.md).

2. **Increase Search Tier:**  Azure Search comes in a [number of tiers](https://azure.microsoft.com/pricing/details/search/) and each of these tiers offers different levels of performance.  In some cases, you may have so many queries that the tier you are on cannot provide sufficiently low latency rates, even when replicas are maxed out.  In this case, you may want to consider leveraging one of the higher search tiers such as the Azure Search S3 tier that is well suited for scenarios with large numbers of documents and extremely high query workloads.

## Scaling Azure Search for slow individual queries

Another reason why latency rates can be slow is from a single query taking too long to complete.  In this case, adding replicas will not improve latency rates.  For this case there are two options available:

1. **Increase Partitions** A partition is a mechanism for splitting your data across extra resources.  For this reason, when you add a second partition, your data gets split into two.  A third partition splits your index into three, etc.  This also has the effect that in some cases, slow queries will perform faster due to the parallelization of computation.  There are a few examples of where we have seen this parallelization work extremely well with queries that have low selectivity queries.  This consists of queries that match many documents or when faceting needs to provide counts over large numbers of documents.  Since there is a lot of computation needed to score the relevancy of the documents or to count the numbers of documents, adding extra partitions can help to provide additional computation.  

   There can be a maximum of 12 partitions in Standard search service and 1 partition in the basic search service.  Partitions can be adjusted either from the [Azure Portal](search-create-service-portal.md) or using the [Azure Search management API](search-get-started-management-api.md).

2. **Limit High Cardinality Fields:** A high cardinality field consists of a facetable or filterable field that has a significant number of unique values, and as a result, takes a lot of resources to compute results over.   For example, setting a Product ID or Description field as facetable/filterable would make for high cardinality because most of the values from document to document are unique. Wherever possible, limit the number of high cardinality fields.

3. **Increase Search Tier:**  Moving up to a higher Azure Search tier can be another way to improve performance of slow queries.  Each higher tier also provides faster CPU’s and more memory which can have a positive impact on query performance.

## Scaling for availability

Replicas not only help reduce query latency but can also allow for high availability.  With a single replica, you should expect periodic downtime due to server reboots after software updates or for other maintenance events that will occur.  As a result, it is important to consider if your application requires high availability of searches (queries) as well as writes (indexing events).  Azure Search offers SLA options on all the paid search offerings with the following attributes:

- 2 replicas for high availability of read-only workloads (queries)
- 3 or more replicas for high availability of read-write workloads (queries and indexing)

For more details on this, please visit the [Azure Search Service Level Agreement](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

Since replicas are copies of your data, having multiple replicas allows Azure Search to do machine reboots and maintenance against one replica at a time while allowing queries to continue to be executed against the other replicas.  For that reason, you will also need to consider how this downtime may impact the queries that now have to be executed against one less copy of the data.

## Scaling geo-distributed workloads and provide geo-redundancy

For geo-distributed workloads, you will find that users located far from the data center where your Azure Search service is hosted will have higher latency rates.  For this reason, it is often important to have multiple search services in regions that are in closer proximity to these users.  Azure Search does not currently provide an automated method of geo-replicating Azure Search indexes across regions, but there are some techniques that can be used that can make this process simple to implement and manage. These are outlined in the next few sections.

The goal of a geo-distributed set of search services is to have two or more indexes available in two or more regions where a user will be routed to the Azure Search service that provides the lowest latency as seen in this example:

   ![Cross-tab of services by region][1]

### Keeping data in sync across multiple Azure Search services

There are two options for keeping your distributed search services in sync which consist of either using the [Azure Search Indexer](search-indexer-overview.md) or the Push API (also referred to as the [Azure Search REST API](https://msdn.microsoft.com/library/dn798935.aspx)).  

### Azure Search Indexers

If you are using the Azure Search Indexer, you are already importing data changes from a central datastore such as Azure SQL DB or DocumentDB. When you create a new search Service, you simply also create a new Azure Search Indexer for that service that points to this same datastore. That way, whenever new changes come into the data store, they will then be indexed by the various Indexers.  

Here is an example of what that architecture would look like.

   ![Single data source with distributed indexer and service combinations][2]


### Push API 
If you are using the Azure Search Push API to [update content in your Azure Search index](https://msdn.microsoft.com/library/dn798930.aspx), you can keep your various search services in sync by pushing changes to all search services whenever an update is required.  When doing this it is important to make sure to handle cases where an update to one search service fails and one or more updates succeed.

## Leveraging Azure Traffic Manager

[Azure Traffic Manager](../traffic-manager/traffic-manager-overview.md) allows you to route requests to multiple geo-located websites that are then backed by multiple Azure Search Services.  One advantage of the Traffic Manager is that it can probe Azure Search to ensure that it is available and route users to alternate search services in the event of downtime.  In addition, if you are routing search requests through Azure Web Sites, Azure Traffic Manager allows you to load balance cases where the Website is up but not Azure Search.  Here is an example of what the architecture that leverages Traffic Manager.

   ![Cross-tab of services by region, with central Traffic Manager][3]

## Monitoring performance

Azure Search offers the ability to analyze and monitor the performance of your service through [Search Traffic Analytics (STA)](search-traffic-analytics.md). Through STA, you can optionally log the individual search operations as well as aggregated metrics to an Azure Storage account that can then be processed for analysis or visualized in Power BI.  Using STA metrics, you can review performance statistics such as average number of queries or query response times.  In addition, the operation logging allows you to drill into details of specific search operations.

STA is a valuable tool to understand latency rates from that Azure Search perspective.  Since the query performance metrics logged are based on the time a query takes to be fully processed in Azure Search (from the time it is requested to when it is sent out), you are able to use this to determine if latency issues are from the Azure Search service side or outside of the service, such as from network latency.  

## Next steps

To learn more about the pricing tiers and services limits for each one, see [Service limits in Azure Search](search-limits-quotas-capacity.md).

Visit [Capacity planning](search-capacity-planning.md) to learn more about partition and replica combinations.

For more drilldown on performance and to see some demonstrations of how to implement the optimizations discussed in this article, watch the following video:

> [AZURE.VIDEO azurecon-2015-azure-search-best-practices-for-web-and-mobile-applications]

<!--Image references-->
[1]: ./media/search-performance-optimization/geo-redundancy.png
[2]: ./media/search-performance-optimization/scale-indexers.png
[3]: ./media/search-performance-optimization/geo-search-traffic-mgr.png