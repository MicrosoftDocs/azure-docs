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

After you [choose a SKU](search-sku-tier.md) and [provision a search service](search-create-service-portal.md), the next step is to optionally configure service resources.

In Azure Search, a service is initially allocated a minimal level of resources consisting of one partition and one replica. For tiers that support it, you can incrementally adjust computational resources by increasing partitions if you need more storage and IO, or replicas for larger query volumes or better performance. A single service must have sufficient resources to handle all workloads (indexing and queries). You cannot subdivide workloads among multiple services.

Scale settings are available when you provision a billable service at either the [Basic tier](http://aka.ms/azuresearchbasic) or one of the [Standard tiers](search-limits-quotas-capacity.md). For billable SKUs, capacity is purchased in increments of *search units* (SU) where each partition and replica counts as one SU apiece. Staying below the maximum limits uses fewer SUs, with a proportionally lower bill. Billing is in effect for as long as the service is provisioned. If you are temporarily not using a service, the only way to avoid billing is by deleting the service, and then recreating it later when you need it.

To increase or change the allocation of replicas and partitions, we recommend using the portal. The portal will enforce limits on allowable combinations that stay below maximum limits:

1. Sign in to the [Azure Portal](https://portal.azure.com/) and select the search service.
2. In Settings, open the Scale blade and use the sliders to increase or decrease the number of partitions and replicas.

As a general rule, search applications need more replicas than partitions, particularly when the service operations are biased towards query workloads. The section on [high availability](#HA) explains why.

> [AZURE.NOTE] Once a service is provisioned, it cannot be upgraded in place to a higher SKU. You will need to create a new search service at the new tier and reload your indexes. See [Create an Azure Search service in the portal](search-create-service-portal.md) for help with service provisioning.

## Terminology: partitions and replicas

Partitions and replicas are the primary resources that back a search service.

**Partitions** provide index storage and IO for read-write operations (for example when rebuilding or refreshing an index).

**Replicas** are instances of the search service, used primarily to load balance query operations. Each replica always hosts one copy of an index. If you have 12 replicas, you will have 12 copies of every index loaded on the service. 

> [AZURE.NOTE] There is no way to directly manipulate or manage which indexes run on a replica. One copy of each index on every replica is part of the service architecture.

<a id="HA"></a>
## High availability

Because it's easy and relatively fast to scale up, we generally recommend that you start with one partition and one or two replicas, and then scale up as query volumes build, up to the maximum replicas and partitions supported by the SKU. For many services at the Basic or S1 tiers, one partition provides sufficient storage and IO (at 15 million documents per partition).

Query workloads execute primarily on replicas. You most likely require additional replicas if you need more throughput or high availability.

General recommendations for high availability are:

- 2 replicas for high availability of read-only workloads (queries)
- 3 or more replicas for high availability of read-write workloads (queries plus indexing as individual documents are added, updated, or deleted)

Service Level Agreements (SLA) for Azure Search are targeted at query operations and at index updates that consist of adding, updating, or deleting documents.

**Index availability during a rebuild**

High availability for Azure Search pertains to queries and index updates that don't involve rebuilding an index. If the index requires a rebuild, for example if you add or deleting a field, change a data type, or rename a field, you would need to rebuild the index by doing the following: delete the index, recreate the index, and reload the data. 

To maintain index availability during a rebuild, you must have a second copy of the index already in production on the same service (with a different name) or a same-named index on a different service, and then provide redirection or fail over logic in your code.

## Disaster recovery

Currently, there is no built-in mechanism for disaster recovery. Adding partitions or replicas would be the wrong strategy for meeting disaster recovery objectives. The most common approach is to add redundancy at the service level by provisioning a second search service in another region. As with availability during an index rebuild, the redirection or failover logic must come from your code.

## Increase query performance with replicas

Query latency is an indicator that additional replicas are needed. Generally, a first step towards improving query performance is to add more of this resource. As you add replicas, additional copies of the index are brought online to support bigger query workloads and to load balance the requests over the multiple replicas. 

Note that we cannot provide hard estimates on queries per second (QPS): query performance depends on the complexity of the query and competing workloads. On average, a replica at Basic or S1 SKUs can service about 15 QPS, but your throughput will be somewhat higher or lower depending on query complexity (faceted queries are more complex) and network latency. Also, it's important to recognize that while adding replicas will definitely add scale and performance, the end result is not strictly linear: adding 3 replicas does not guarantee triple throughput. 

To learn about QPS, including approaches for estimating QPS for your workloads, see [Manage your Search service](search-manage.md).

## Increase indexing performance with partitions

Search applications that require near real-time data refresh will need proportionally more partitions than replicas. Adding partitions spreads read-write operations across a larger number of compute resources. It also gives you more disk space for storing additional indexes and documents.

Larger indexes take longer to query. As such, you might find that every incremental increase in partitions requires a smaller but proportional increase in replicas. As noted earlier, the complexity of your queries and query volume will factor into how quickly query execution is turned around.

## Basic tier: Partition and replica combinations

A Basic service can have exactly 1 partition and up to 3 replicas, for a maximum limit of 3 SUs. The only adjustable resource is replicas. As noted earlier, you need a minimum of 2 replicas for high availability on queries.

<a id="chart"></a>
## Standard tiers: Partition and replica combinations

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

> [AZURE.NOTE] The number of replicas and partitions must evenly divide into 12 (specifically, 1, 2, 3, 4, 6, 12). This is because Azure Search pre-divides each index into 12 shards so that it can be spread in equal portions across all partitions. For example, if your service has three partitions and you create a new index, each partition will contain 4 shards of the index. How Azure Search shards an index is an implementation detail, subject to change in future release. Although the number is 12 today, you shouldn't expect that number to always be 12 in the future.

## S3 High Density: Partition and replica combinations

S3 HD has 1 partition and up to 12 replicas, for a maximum limit of 12 SUs. The only adjustable resource is replicas.

## Calculate Search Units for Specific Resourcing Combinations: R X P = SU

The formula for calculating how many SUs you need is replicas multiplied by partitions. For example, 3 replicas multiplied by 3 partitions is billed as 9 search units.

Both tiers start with one replica and one partition, counted as one search unit (SU). This is the only instance where both a replica and a partition count as one search unit. Each additional  resource, whether it is a replica or a partition, is counted as its own SU.

Cost per SU is determined by the tier. Cost per SU is lower for the Basic tier than it is for Standard. Rates for each tier can be found on [Pricing Details](https://azure.microsoft.com/pricing/details/search/).

