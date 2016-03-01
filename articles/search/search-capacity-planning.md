<properties
	pageTitle="Capacity planning in Azure Search | Microsoft Azure | Hosted cloud search service"
	description="Capacity in Azure Search is built from partitions and replicas, where each is a billable search unit."
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
	ms.date="02/28/2016"
	ms.author="heidist"/>

# Capacity planning in Azure Search

In Azure Search, you can incrementally adjust capacity of specific computational resources. You can increase partitions if you need more storage and IO, or replicas for improved query and indexing performance.

Scalability becomes available when you provision a service at either the [Basic tier](http://aka.ms/azuresearchbasic) or one of the [Standard tiers](search-limits-quotas-capacity.md).  

For both tiers, capacity is purchased in increments of *search units* (SU) where each partition and replica counts as one SU apiece. 

- Basic provides up to 3 SU per service.
- Standard provides up to 36 SU per service.

You have to choose a combination of partitions and replicas that stays below the tier limit. For example, you couldn't scale your Standard service up to 12 partitions and 6 replicas, because doing so would require 72 search units (12 x 6), exceeding the limit of 36 search units per service.

Generally, search applications tend to need more replicas than partitions. See the section on [high availability](#HA) for details.

**Calculate Search Units for Specific Resourcing Combinations: R X P = SU**

The formula for calculating how many SUs you need is replicas multiplied by partitions. For example, 3 replicas multiplied by 3 partitions is billed as 9 search units.

Both tiers start with one replica and one partition, counted as one search unit (SU). This is the only instance where both a replica and a partition count as one search unit. Each additional  resource, whether it is a replica or a partition, is counted as its own SU.

Cost per SU is determined by the tier. Cost per SU is lower for the Basic tier than it is for Standard. Rates for each tier can be found on [Pricing Details](https://azure.microsoft.com/pricing/details/search/).

## Basic tier: Partition and replica combinations

A Basic service can have 1 partition and up to 3 replicas, for a maximum limit of 3 SUs.

<table cellspacing="0" border="1">
<tr><td><b>3 replicas</b></td><td>3 SU</td></tr>
<tr><td><b>2 replicas</b></td><td>2 SU</td></tr>
<tr><td><b>1 replica</b></td><td>1 SU</td></tr>
<tr><td></td><td><b>1 Partition</b></td></tr>
</table>

<a id="chart"></a>
## Standard tier: Partition and replica combinations

This table shows the search units required to support combinations of replicas and partitions, subject to the 36 search unit (SU) limit. 

<table cellspacing="0" border="1">
<tr><td><b>12 replicas</b></td><td>12 SU</td><td>24 SU</td><td>36 SU</td><td>N/A</td><td>N/A</td><td>N/A</td></tr>
<tr><td><b>6 replicas</b></td><td>6 SU</td><td>12 SU</td><td>18 SU</td><td>24 SU</td><td>36 SU</td><td>N/A</td></tr>
<tr><td><b>5 replicas</b></td><td>5 SU</td><td>10 SU</td><td>15 SU</td><td>20 SU</td><td>30 SU</td><td>N/A</td></tr>
<tr><td><b>4 replicas</b></td><td>4 SU</td><td>8 SU</td><td>12 SU</td><td>16 SU</td><td>24 SU</td><td>N/A </td></tr>
<tr><td><b>3 replicas</b></td><td>3 SU</td><td>6 SU</td><td>9 SU</td><td>12 SU</td><td>18 SU</td><td>36 SU</td></tr>
<tr><td><b>2 replicas</b></td><td>2 SU</td><td>4 SU</td><td>6 SU</td><td>8 SU</td><td>12 SU</td><td>24 SU</td></tr>
<tr><td><b>1 replica</b></td><td>1 SU</td><td>2 SU</td><td>3 SU</td><td>4 SU</td><td>6 SU</td><td>12 SU</td></tr>
<tr><td>N/A</td><td><b>1 Partition</b></td><td><b>2 Partitions</b></td><td><b>3 Partitions</b></td><td><b>4 Partitions</b></td><td><b>6 Partitions</b></td><td><b>12 Partitions</b></td></tr>
</table>

Search units, pricing, and capacity are explained in detail on the Azure web site. See [Pricing Details](https://azure.microsoft.com/pricing/details/search/) for more information.

> [AZURE.NOTE] The number of replicas and partitions must evenly divide into 12 (specifically, 1, 2, 3, 4, 6, 12). This is because Azure Search pre-divides each index into 12 shards so that it can be spread across partitions. For example, if your service has three partitions and you create a new index, each partition will contain 4 shards of the index. How Azure Search shards an index is an implementation detail, subject to change in future release. Although the number is 12 today, you shouldn't expect that number to always be 12 in the future.

<a id="HA"></a>
## Choose a combination of partitions and replicas for high availability

Because it's easy and relatively fast to scale up, we generally recommend that you start with one partition and one or two replicas, and then scale up as query volumes build. For many deployments,  one partition provides sufficient storage and IO (at 15 million documents per partition).

Query workloads, however, rely on replicas. You could require additional replicas if you need more throughput or high availability.

General recommendations for high availability are:

- 2 replicas for high availability of read-only workloads (queries)
- 3 or more replicas for high availability of read-write workloads (queries and indexing)

Currently, there is no built-in mechanism for disaster recovery. Adding partitions or replicas would be the wrong strategy for meeting disaster recovery objectives. Instead, you might consider adding redundancy at the service level. For a deeper discussion of the workarounds, see [this forum post](https://social.msdn.microsoft.com/Forums/ee108a26-00c5-49f6-b1ff-64c66c8b828a/dr-and-high-availability-for-azure-search?forum=azuresearch).

> [AZURE.NOTE] Recall that service level agreements and scalability are features of the standard service. The free service is offered at a fixed resource level, with replicas and partitions shared by multiple subscribers. If you started with the free service and now want to upgrade, you will need to create a new Azure Search service at the standard level and then reload indexes and data to the new service. See [Create an Azure Search service in the portal](search-create-service-portal.md) for instructions on service provisioning.

## About partitions and replicas

**Partitions** provide storage and IO. A single Search service can have a maximum of 12 partitions. Each partition comes with a hard limit of 15 million documents or 25 GB of storage, whichever comes first. If you add partitions, your Search service can load more documents. For example, a service with a single partition that initially stores up to 25 GB of data can store 50 GB when you add a second partition to the service.

**Replicas** are copies of the search engine. A single Search service can have a maximum of 6 replicas. You need at least 2 replicas for read (query) availability, and at least 3 replicas for read-write (query, indexing) availability.

A copy of each index runs on each replica. As you add replicas, additional copies of the index are brought online to support greater query workloads and to load balance the requests over the multiple replicas. If you have multiple indexes, say 6, and 3 replicas, each replica will have a copy of all 6 indexes.

Note that we provide no hard estimates on queries per second (QPS), as query execution can vary a lot depending on the complexity of the query and competing workloads. On average, a replica can service about 15 QPS, but your throughput will be somewhat higher or lower depending on query complexity (faceted queries are more complex) and network latency. Also, it's important to recognize that while adding replicas will definitely add scale and performance, the end result is not strictly linear: adding 3 replicas does not guarantee triple throughput. Query latency is an indicator that additional replicas might be needed. To learn about QPS, including approaches for estimating QPS for your workloads, see [Manage your Search service](search-manage.md).