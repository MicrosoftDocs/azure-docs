<properties
	pageTitle="Service limits in Azure Search"
	description="Azure Search limits used in capacity planning and maximum limits on requests and reponses."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""
    tags="azure-portal"/>

<tags
	ms.service="search"
	ms.devlang="NA"
	ms.workload="search"
	ms.topic="article" 
	ms.tgt_pltfrm="na"
	ms.date="08/18/2015"
	ms.author="heidist"/>

#Service limits in Azure Search

Maximum limits on storage, workloads, and quantities of indexes, documents, and other objects depend on how you subscribe to Azure Search. The free service is intended for evaluation and proof-of-concept testing, with lower limits on all objects and workloads so that resources can be shared more equitably. 

Standard runs on dedicated machines that are used only by your service. Sole use of a dedicated service gives you the ability to scale up or down, with more storage and processing capacity at every level, including the minimum configuration.

##Maximum limits for a free (shared) Search service

Azure subscribers can use the shared (multi-tenant) Search service for development or very small search applications. The shared service comes with your Azure subscription. It's a no-cost option that allows you to experiment with the service before signing up. It provides:

Object|Limit
------|-----
Maximum number of indexes|3
Maximum number of fields per index|1000
Maximum document count|10,000
Maximum storage size|50 MB
Maximum partitions|N/A
Maximum replicas|N/A
Maximum search units|N/A
Maximum number of indexers|3
Maximum number of Indexer data sources|3
Maximum number of indexed documents per indexer invocation|10,000

Notice that there are no quotas or maximum limits associated with queries. Queries-per-second (QPS) are variable, depending on available bandwidth and competition for system resources. The Azure compute and storage resources backing your shared service are shared by multiple subscribers, so QPS for your solution will vary depending on how many other workloads are running at the same time.

##Maximum limits for a standard (dedicated) Search service

Under the Standard pricing tier, a dedicated Search service stores only your data, and runs only your workloads. Unlike the shared service, the resource allocation for a dedicated Search service is adjustable, scaling to whatever level you need. You can independently set the resource levels for partitions (to scale up storage) and replicas (to provide high availability and scale up QPS and indexing performance). See [Manage your search solution](search-manage.md) for insights into different resource configurations.

The following table is a list of upper limits, but you should review the matrix chart further on to understand capacity in terms of allowable [combinations of partitions and replicas](#chart).

Object|Limit
------|----
Maximum number of indexes|50 per Search service
Maximum number of fields per index|1000
Maximum document count|15 million per partition
Maximum storage size|25 GB per partition
Maximum partitions|12 per Search service
Maximum replicas|6 per Search service
Maximum search units|36 per Search service
Maximum number of indexers|50 per Search service
Maximum number of Indexer data sources|50 per Search service
Maximum number of indexed documents per indexer invocation|Unlimited

Capacity in Azure Search can be purchased in increments called search units. The Standard pricing tier allows for up to 36 search units per Search service. This limit overrides the individual limits on partitions and replicas. For example, you can't scale your service up to 12 partitions and 6 replicas, because doing so would require 72 search units (12 x 6), exceeding the limit of 36 search units per service.

##About partitions and replicas

**Partitions** provide storage and IO. A single Search service can have a maximum of 12 partitions. Each partition comes with a hard limit of 15 million documents or 25 GB of storage, whichever comes first. If you add partitions, your Search service can load more documents. For example, a service with a single partition that initially stores up to 25 GB of data can store 50 GB when you add a second partition to the service.

**Replicas** are copies of the search engine. A single Search service can have a maximum of 6 replicas. You need at least 2 replicas for read (query) availability, and at least 3 replicas for read-write (query, indexing) availability.

A copy of each index runs on each replica. As you add replicas, additional copies of the index are brought online to support greater query workloads and to load balance the requests over the multiple replicas. If you have multiple indexes, say 6, and 3 replicas, each replica will have a copy of all 6 indexes.

Note that we provide no hard estimates on queries per second (QPS), as query execution can vary a lot depending on the complexity of the query and competing workloads. On average, a replica can service about 15 QPS, but your throughput will be somewhat higher or lower depending on query complexity (faceted queries are more complex) and network latency. Also, it's important to recognize that while adding replicas will definitely add scale and performance, the end result is not strictly linear: adding 3 replicas does not guarantee triple throughput. Query latency is an indicator that additional replicas might be needed.

<a id="chart"></a>
##Supported combinations of partitions and replicas

As noted earlier, the effective limit on partitions and replicas is based on the combination of resources you select, while staying within the boundary of 36 search units per service. Resources are allocated in terms of search units (SU). A dedicated Search service starts with one replica and one partition, as one search unit.

Additional capacity is calculated as partitions multiplied by replicas, yielding a total number of search units required to support a given configuration.

The following table is a chart that lists replicas on the vertical axis, and partitions on the horizontal axis. The intersection shows the number of search units required to support each combination, subject to the 36 search unit (SU) limit per service. For example, if you want 6 replicas and 2 partitions, this configuration would require 12 search units. To use 4 replicas and 2 partitions, you would need 8 search units. As a general rule, most search applications tend to need more replicas than partitions.

<table cellspacing="0" border="1">
<tr><td><b>6 replicas</b></td><td>6 SU</td><td>12 SU</td><td>18 SU</td><td>24 SU</td><td>36 SU</td><td>N/A</td></tr>
<tr><td><b>5 replicas</b></td><td>5 SU</td><td>10 SU</td><td>15 SU</td><td>20 SU</td><td>30 SU</td><td>N/A</td></tr>
<tr><td><b>4 replicas</b></td><td>4 SU</td><td>8 SU</td><td>12 SU</td><td>16 SU</td><td>24 SU</td><td>N/A </td></tr>
<tr><td><b>3 replicas</b></td><td>3 SU</td><td>6 SU</td><td>9 SU</td><td>12 SU</td><td>18 SU</td><td>36 SU</td></tr>
<tr><td><b>2 replicas</b></td><td>2 SU</td><td>4 SU</td><td>6 SU</td><td>8 SU</td><td>12 SU</td><td>24 SU</td></tr>
<tr><td><b>1 replica</b></td><td>1 SU</td><td>2 SU</td><td>3 SU</td><td>4 SU</td><td>6 SU</td><td>12 SU</td></tr>
<tr><td>N/A</td><td><b>1 Partition</b></td><td><b>2 Partitions</b></td><td><b>3 Partitions</b></td><td><b>4 Partitions</b></td><td><b>6 Partitions</b></td><td><b>12 Partitions</b></td></tr> 
</table>

Search units, pricing, and capacity are explained in detail on the Azure web site. See [Pricing Details](http://azure.microsoft.com/pricing/details/search/) for more information.

> [AZURE.NOTE] The number of partitions you choose must evenly divide into 12 (specifically, 1, 2, 3, 4, 6, 12). This is because Azure Search pre-divides each index into 12 shards so that it can be spread across partitions. For example, if your service has three partitions and you create a new index, each partition will contain 4 shards of the index. How Azure Search shards an index is an implementation detail, subject to change in future release. Although the number is 12 today, you shouldn't expect that number to always be 12 in the future.

##Choose a combination of partitions and replicas for high availability

Because it's easy and relatively fast to scale up, we generally recommend that you start with one partition and one or two replicas, and then scale up as query volumes build. For many deployments,  one partition provides sufficient storage and IO (at 15 million documents per partition). 

Query workloads, however, rely on replicas. You could require additional replicas if you need more throughput or high availability. 

General recommendations for high availability are:

- 2 replicas for high availability of read-only workloads (queries)
- 3 or more replicas for high availability of read-write workloads (queries and indexing)

Currently, there is no built-in mechanism for disaster recovery. Adding partitions or replicas would be the wrong strategy for meeting disaster recovery objectives. Instead, you might consider adding redundancy at the service level. For a deeper discussion of the workarounds, see [this forum post](https://social.msdn.microsoft.com/Forums/ee108a26-00c5-49f6-b1ff-64c66c8b828a/dr-and-high-availability-for-azure-search?forum=azuresearch).

> [AZURE.NOTE] Recall that service level agreements and scalability are features of the standard service. The free service is offered at a fixed resource level, with replicas and partitions shared by multiple subscribers. If you started with the free service and now want to upgrade, you will need to create a new Azure Search service at the standard level and then reload indexes and data to the new service. See [Create an Azure Search service in the portal](search-create-portal.md) for instructions on service provisioning.

##API-key limits

Api-keys are used for service authentication. There are two types. Admin keys are specified in the request header. Query keys are specified on the URL. See [Manage your search service on Microsoft Azure](search-manage.md) for details about key management.

- Maximum of 2 admin keys per service
- Maximum of 50 query keys per service

##Request limits

- Maximum of 16 MB per request
- Maximum 8 KB URL length 
- Maximum 1000 documents per batch of index uploads, merges, or deletes
- Maximum 32 fields in $orderby clause
- Maximum search term size is 32766 bytes (32 KB minus 2 bytes) of UTF-8 encoded text

##Response limits

- Maximum 1000 documents returned per page of search results
- Maximum 100 suggestions returned per Suggest API request


