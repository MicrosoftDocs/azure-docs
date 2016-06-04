<properties
	pageTitle="Scale resource levels for query and indexing workloads in Azure Search | Microsoft Azure"
	description="Capacity planning in Azure Search is based on combinations of partition and replica computer resources, where each resource is priced in billable search units."
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
	ms.date="06/03/2016"
	ms.author="heidist"/>

# Scale resource levels for query and indexing workloads in Azure Search

In Azure Search, you can incrementally adjust computational resources by increasing partitions if you need more storage and IO, or replicas for higher query loads or better performance.

Scalability becomes available when you provision a service at either the [Basic tier](http://aka.ms/azuresearchbasic) or one of the [Standard tiers](search-limits-quotas-capacity.md).  

For all billable tiers, capacity is purchased in increments of *search units* (SU) where each partition and replica counts as one SU apiece. Staying below the maximum limits uses fewer SUs, with a proportionally lower bill. Billing is in effect for as long as the service is provisioned. If you are temporarily not using a service, the only way to avoid billing is by deleting the service, and then recreating it later when you need it.

- Basic provides up to 3 replicas per service.
- Standard (S1 through S3) provides up to 36 SU per service that can be leveraged in multiple combinations of replicas and partitions.
- S3 High Density (S3 HD) provides up to 12 replicas and 1 very large partition.

We recommend using the portal to adjust the mix of replicas and partitions. The portal will enforce limits on allowable combinations that stay below maximum limits.

A single service must handle all workloads (indexing and queries). You can't provision multiple services for dedicated workloads. An index that's created on a service can only be queried via that service.

Once a service is provisioned, it can't be upgraded in place to a higher SKU. You will need to create a new Azure Search service at the new tier and reload your indexes. See [Create an Azure Search service in the portal](search-create-service-portal.md) for instructions on service provisioning.

As a general rule, search applications need more replicas than partitions. The next section, [high availability](#HA), explains why.

<a id="HA"></a>
## High availability

Because it's easy and relatively fast to scale up, we generally recommend that you start with one partition and one or two replicas, and then scale up as query volumes build, up to the maximum replicas and partitions supported by the SKU. For many services at the Basic or S1 tiers, one partition provides sufficient storage and IO (at 15 million documents per partition).

Query workloads execute primarily on replicas. You most likely require additional replicas if you need more throughput or high availability.

General recommendations for high availability are:

- 2 replicas for high availability of read-only workloads (queries)
- 3 or more replicas for high availability of read-write workloads (queries plus indexing as individual documents are added, updated, or deleted)

Service Level Agreements (SLA) for Azure Search are for queries and updates to an index that do not include reindexing. Changing a data type, renaming a field, or adding or deleting a field are all actions that would require a rebuild, which consists of deleting the index, recreating the index, and reloading the data.

To maintain index availability during a rebuild, you must have a second version of the index already in production on the same service or on a different service, and then provide redirection or fail over logic in your code.

## Disaster recovery

Currently, there is no built-in mechanism for disaster recovery. Adding partitions or replicas would be the wrong strategy for meeting disaster recovery objectives. The most common approach is to add redundancy at the service level by provisioning a second search service in another region. As with availability during an index rebuild, the redirection or fail over logic must come from your code.

## Terminology: partitions and replicas

**Partitions** provide index storage and IO for index updates.

**Replicas** are instances of the search service, and each replica always runs one copy of an index. There is no way to directly manipulate or manage indexes on a replica. Having a copy of each index on every replica is how the service is designed.

## Increase query performance with replicas

Query latency is an indicator that additional replicas might be needed. Generally, a first step towards improving query performance is to add more replicas.

A copy of each index runs on each replica. As you add replicas, additional copies of the index are brought online to support greater query workloads and to load balance the requests over the multiple replicas. 

Note that we provide no hard estimates on queries per second (QPS): query performance depends on the complexity of the query and competing workloads. On average, a replica can service about 15 QPS, but your throughput will be somewhat higher or lower depending on query complexity (faceted queries are more complex) and network latency. Also, it's important to recognize that while adding replicas will definitely add scale and performance, the end result is not strictly linear: adding 3 replicas does not guarantee triple throughput. 

To learn about QPS, including approaches for estimating QPS for your workloads, see [Manage your Search service](search-manage.md).

## Increase indexing performance with partitions

Search applications that require near real-time data refresh will need proportionally more partitions than replicas. Adding partitions spreads read-write operations across a larger number of compute resources. It also gives you more disk space for storing additional indexes and documents.

Larger indexes take longer to query. As such, you might find that every incremental increase in partitions requires a smaller but proportional increase in replicas. As noted earlier, the complexity of your queries and query volume will factor into how quickly query execution is turned around.

## Basic tier: Partition and replica combinations

A Basic service can have 1 partition and up to 3 replicas, for a maximum limit of 3 SUs.

<a id="chart"></a>
## Standard tier: Partition and replica combinations

This table shows the search units required to support combinations of replicas and partitions, subject to the 36 search unit (SU) limit (excludes Basic and S3 HD tiers). 

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

## S3 High Density: Partition and replica combinations

S3 HD has 1 very large partition and up to 12 replicas, for a maximum limit of 12 SUs.

## Calculate Search Units for Specific Resourcing Combinations: R X P = SU

The formula for calculating how many SUs you need is replicas multiplied by partitions. For example, 3 replicas multiplied by 3 partitions is billed as 9 search units.

Both tiers start with one replica and one partition, counted as one search unit (SU). This is the only instance where both a replica and a partition count as one search unit. Each additional  resource, whether it is a replica or a partition, is counted as its own SU.

Cost per SU is determined by the tier. Cost per SU is lower for the Basic tier than it is for Standard. Rates for each tier can be found on [Pricing Details](https://azure.microsoft.com/pricing/details/search/).

