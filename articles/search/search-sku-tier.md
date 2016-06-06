<properties
	pageTitle="Choose a SKU or tier for Azure Search | Microsoft Azure"
	description="Azure Search can be provisioned at these SKUs: Free, Basic, and Standard, where Standard is available in various resource configurations and capacity levels."
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
	ms.date="06/05/2016"
	ms.author="heidist"/>

# Choose a SKU or tier for Azure Search

When creating a search service in Azure Search, one of the requirements is to choose the tier or SKU: Free, Basic, or Standard, where Standard is available in multiple resource configurations and capacities. Capacity and costs of running the service go hand-in-hand. Charts in this article can help you decide which SKU delivers the right balance.

Review the SKU descriptions below to become familiar with each one, and then answer a series of questions to narrow down your choice. Finally, validate the decision by reviewing hard limits on storage and pricing. 

## SKU descriptions

Tier|Key characteristics|Designed for
----|-----------|-----------
Free|Shared with other existing Azure subscribers, including trial subscriptions, at no extra charge|Limited but Evaluation, investigation, or small workloads. It’s quite limited in terms of number of indexes (3) and documents (10,000) that it can handle. Because it's shared with other subscribers,  query throughput and indexing will vary based on who else is using the service.
Basic|3 replicas and 1 partition|Small production workloads on dedicated hardware. High availability for queries, but not indexing. <br/><br/>At 3 replicas and 1 partition, all indexing operations are restricted to the single partition. You would need to take the service offline whenever you update an index.
Standard 1 (S1)|Flexible combinations of partitions and replicas| Medium production workloads on dedicated hardware. Allocate partitions and replicas in combinations supported by a maximum number of 36 billable search units. <br/><br/>Partitions are 25 GB each. Query throughput on replicas is about 15 queries per second on average.
Standard 2 (S2)|Same configurations, at more capacity|Larger production workloads. <br/><br/>Partitions are 100 GB each. Query throughput on replicas is about 60 queries per second on average.
Standard 3 (S3) Preview|Same configurations, at more capacity|Larger production workloads. <br/><br/>Partitions are 200 GB each. Query throughput on replicas is more than 60 queries per second on average.
Standard 3 High Density (S3 HD) Preview|12 replicas and 1 partition|Designed for customers who have a large number of smaller indexes. This is our high density offering. <br/><br/>Partition size and query throughput are the same as S3, but with higher maximum limits for indexes and documents.

## Decision path for choosing a SKU

This chart is a subset of the limits from [Service limits in Azure Search](search-limits-quotas-capacity.md), highlighting the criteria most likely to narrow or redirect your choice on SKU.

Resource|Free|Basic|S1|S2|S3 <sup>1</sup> (Preview) |S3 HD <sup>1</sup> (Preview) 
---|---|---|---|----|---|----
Service Level Agreement (SLA)|No |Yes |Yes  |Yes |No|No
Indexes allowed per SKU|3|5|50|200|200|1000
Maximum replicas|NA |3 |12 |12 |12|12
Queries per second|N/A|~3 per replica|~15 per replica|~60 per replica|>60 per replica|>60 per replica
Maximum partitions|NA |1 |12  |12 |12|1
Documents limits|10,000 total|1 million per service|15 million per partition |60 million per partition|120 million per partition |1 million per index
Partition size|50 MB total|2 GB per service|25 GB per partition |100 GB per partition (up to a maximum of 1.2 TB per service)|200 GB per partition (up to a maximum of 2.4 TB per service)|200 GB (for the 1 partition)

Replica and partition maximums are subject a combined maximum billing configuration of 36 units. To get a maximum of 12 replicas, you could have a most 3 partitions (12 * 3 =36). To use maximum partitions, reduce replicas to 3. See [Scale resource levels for query and indexing workloads in Azure Search](search-capacity-planning.md) for a chart on allowable combinations.

**Service Level Agreement (SLA)** requirements narrow the SKU decision to Basic or non-preview Standard.

**Resources used by you service** is adjustable depending on the number of partitions and replicas you sign up for. Minimum resource requirements are one partition and one replica. If you require high availability, you'll need more. If you expect query or indexing volumes to increase over time, choose a SKU with enough buffer to support additional volume.

**High availability** is built into every billable SKU beginning with Basic (at 3 replicas for highly available query workloads). To get high availability on read-write operations to an index, you'll need a Standard SKU.

**Index count and size** requirements are often the next criteria to consider. Compare the maximum number of indexes across SKUs and maximum index size.

You can rule specific SKUs in or out based on this criteria alone. In particular, S3 HD offers a configuration for solutions requiring a large number of smaller indexes.

## Decision validation: does the SKU offer sufficient storage and QPS

As a last step, revisit the storage limits across the service itself, which will vary depending on whether you provisioned that service at Basic or a Standard SKU. 

Finally, validate the decision by reviewing hard limits on storage and pricing. 

If either one is out of range, you might want to refactor the workloads among multiple smaller services (for example). At more granular level, you could redesign indexes to be smaller, or use filters to make queries more efficient.

