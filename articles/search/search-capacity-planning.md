<properties
	pageTitle="Scale resource levels for query and indexing workloads in Azure Search | Microsoft Azure"
	description="Capacity planning in Azure Search is based on combinations of partition and replica computer resources, where each resource priced in billable search units."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="paulettm"
	editor=""
    tags="azure-portal"/>

<tags
	ms.service="search"
	ms.devlang="NA"
	ms.workload="search"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.date="05/25/2016"
	ms.author="heidist"/>

# Scale resource levels for query and indexing workloads in Azure Search

In Azure Search, you can incrementally adjust capacity of specific computational resources by increasing partitions if you need more storage and IO, or replicas for improved query and indexing performance.

Scalability becomes available when you provision a service at either the [Basic tier](http://aka.ms/azuresearchbasic) or one of the [Standard tiers](search-limits-quotas-capacity.md).  

For both tiers, capacity is purchased in increments of *search units* (SU) where each partition and replica counts as one SU apiece. 

- Basic provides up to 3 SU per service.
- Standard provides up to 36 SU per service.

Be sure to choose a combination of partitions and replicas that stays below the tier limit. If you use the portal to scale up, the portal will enforce limits on allowable combinations.

As a general rule, search applications need more replicas than partitions. The next section, [high availability](#HA), explains why.

<a id="HA"></a>
## Resourcing for high availability

Because it's easy and relatively fast to scale up, we generally recommend that you start with one partition and one or two replicas, and then scale up as query volumes build. For many deployments,  one partition provides sufficient storage and IO (at 15 million documents per partition).

Query workloads, however, rely on replicas. You could require additional replicas if you need more throughput or high availability.

General recommendations for high availability are:

- 2 replicas for high availability of read-only workloads (queries)
- 3 or more replicas for high availability of read-write workloads (queries and indexing)

## Disaster recovery

Currently, there is no built-in mechanism for disaster recovery. Adding partitions or replicas would be the wrong strategy for meeting disaster recovery objectives. Instead, you might consider adding redundancy at the service level. For a deeper discussion of the workarounds, see [this forum post](https://social.msdn.microsoft.com/Forums/ee108a26-00c5-49f6-b1ff-64c66c8b828a/dr-and-high-availability-for-azure-search?forum=azuresearch).

> [AZURE.NOTE] Recall that service level agreements and scalability are features of the standard service. The free service is offered at a fixed resource level, with replicas and partitions shared by multiple subscribers. If you started with the free service and now want to upgrade, you will need to create a new Azure Search service at the standard level and then reload indexes and data to the new service. See [Create an Azure Search service in the portal](search-create-service-portal.md) for instructions on service provisioning.

## Terminology: partitions and replicas

**Partitions** provide storage and IO. A single Search service can have a maximum of 12 partitions. Each partition comes with a hard limit of 15 million documents or 25 GB of storage, whichever comes first. If you add partitions, your Search service can load more documents. For example, a service with a single partition that initially stores up to 25 GB of data can store 50 GB when you add a second partition to the service.

**Replicas** are copies of the search engine. A single Search service can have a maximum of 12 replicas. You need at least 2 replicas for read (query) availability, and at least 3 replicas for read-write (query, indexing) availability.

## Increase query performance with replicas

Query latency is an indicator that additional replicas might be needed. Generally, a first step towards improving query performance is to add more replicas.

A copy of each index runs on each replica. As you add replicas, additional copies of the index are brought online to support greater query workloads and to load balance the requests over the multiple replicas. If you have multiple indexes, say 6, and 3 replicas, each replica will have a copy of all 6 indexes.

Note that we provide no hard estimates on queries per second (QPS): query performance depends on the complexity of the query and competing workloads. On average, a replica can service about 15 QPS, but your throughput will be somewhat higher or lower depending on query complexity (faceted queries are more complex) and network latency. Also, it's important to recognize that while adding replicas will definitely add scale and performance, the end result is not strictly linear: adding 3 replicas does not guarantee triple throughput. 

To learn about QPS, including approaches for estimating QPS for your workloads, see [Manage your Search service](search-manage.md).

## Increase indexing performance with partitions

Search applications that require near real-time data refresh will need proportionally more partitions than replicas. Adding partitions spreads read-write operations across a larger number of compute resources. It also gives you more disk space for storing additional indexes and documents.

Larger indexes take longer to query. As such, you might find that every incremental increase in partitions requires a smaller but proportional increase in replicas. As noted earlier, the complexity of your queries and query volume will factor into how quickly query execution is turned around.

## Basic tier: Partition and replica combinations

A Basic service can have 1 partition and up to 3 replicas, for a maximum limit of 3 SUs.

<a id="chart"></a>
## Standard tier: Partition and replica combinations

This table shows the search units required to support combinations of replicas and partitions, subject to the 36 search unit (SU) limit. 

- |- |- |- |- |- |- |
---|----|---|---|---|---|---|
**12 replicas**|12 SU|24 SU|36 SU|N/A|N/A|N/A|
**6 replicas**|6 SU|12 SU|18 SU|24 SU|36 SU|N/A|
**5 replicas**|5 SU|10 SU|15 SU|20 SU|30 SU|N/A|
**4 replicas**|4 SU|8 SU<|12 SU|16 SU|24 SU|N/|
**3 replicas**|3 SU|6 SU|9 SU|12 SU|18 SU|36 SU|
**2 replicas**|2 SU|4 SU|6 SU|8 SU|12 SU|24 SU|
**1 replica**|1 SU|2 SU|3 SU|4 SU|6 SU|12 SU|
N/A|**1 Partition**|**2 Partitions**|**3 Partitions**<|**4 Partitions**|**6 Partitions**|**12 Partitions**|


Search units, pricing, and capacity are explained in detail on the Azure web site. See [Pricing Details](https://azure.microsoft.com/pricing/details/search/) for more information.

> [AZURE.NOTE] The number of replicas and partitions must evenly divide into 12 (specifically, 1, 2, 3, 4, 6, 12). This is because Azure Search pre-divides each index into 12 shards so that it can be spread across partitions. For example, if your service has three partitions and you create a new index, each partition will contain 4 shards of the index. How Azure Search shards an index is an implementation detail, subject to change in future release. Although the number is 12 today, you shouldn't expect that number to always be 12 in the future.

## Calculate Search Units for Specific Resourcing Combinations: R X P = SU**

The formula for calculating how many SUs you need is replicas multiplied by partitions. For example, 3 replicas multiplied by 3 partitions is billed as 9 search units.

Both tiers start with one replica and one partition, counted as one search unit (SU). This is the only instance where both a replica and a partition count as one search unit. Each additional  resource, whether it is a replica or a partition, is counted as its own SU.

Cost per SU is determined by the tier. Cost per SU is lower for the Basic tier than it is for Standard. Rates for each tier can be found on [Pricing Details](https://azure.microsoft.com/pricing/details/search/).

