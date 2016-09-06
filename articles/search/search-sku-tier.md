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

Before you can [create a search service](search-create-service-portal.md) in Azure Search, you will need to know which tier or SKU to provision the service at. SKUs include: Free, Basic, or Standard, where Standard is available in multiple resource configurations and capacities. 

Capacity and costs of running the service go hand-in-hand. Information in this article can help you decide which SKU delivers the right balance, but for any of it to be useful, you will need at least rough estimates on the number and size of indexes you plan to create, and some idea of query volume. With estimates in hand, the following steps should simplify the process:

- **Step 1** Review the SKU descriptions below to learn what your option are.
- **Step 2** Answer a series of questions to narrow down your choice.
- **Step 3** Validate your decision by reviewing hard limits on storage and pricing. 

## SKU descriptions

The following table is a description and simple comparison of each SKU in terms of partitions and replicas, as well as Queries Per Second (QPS), when applicable. For an introduction to replicas and partitions, see [Service Limits in Azure Search](search-limits-quotas-capacity.md).

Tier|Capacity|Designed for
----|-----------|-----------
Free|50 MB or 3 indexes and 10,000 documents|A shared service, at no charge, used for evaluation, investigation, or small workloads. Because it's shared with other subscribers,  query throughput and indexing will vary based on who else is using the service.
Basic|3 replicas and 1 partition|Small production workloads on dedicated hardware. Highly available.
Standard 1 (S1)|Partitions are 25 GB each. <br/><br/>QPS on replicas is approximately 15 queries per second.|Supports flexible combinations of partitions (12) and replicas (12), used for medium production workloads on dedicated hardware. You can allocate partitions and replicas in combinations supported by a maximum number of 36 billable search units.
Standard 2 (S2)|Partitions are 100 GB each. <br/><br/>QPS on replicas is about 60 queries per second.|Runs larger production workloads using the same configurations as S1 but with larger partitions and replicas.
Standard 3 (S3) Preview|Partitions are 200 GB each. <br/><br/>QPS on replicas is more than 60 queries per second.|Runs proportionally larger production workloads on higher end systems, in configurations of up to 12 partitions or 12 replicas. 
Standard 3 High Density (S3 HD) Preview|A single partition at 200 GB. <br/><br/>QPS on replicas is more than 60 queries per second.|Intended for customers who have a large number of smaller indexes.

## Decision path for choosing a SKU

The following chart is a subset of the limits from [Service Limits in Azure Search](search-limits-quotas-capacity.md). It lists the factors most likely to impact a SKU decision, including SKU capacity limits from the previous table, with additional limits related to content types (namely indexes and documents). You can refer to this chart 

Resource|Free|Basic|S1|S2|S3 <br/>(Preview) |S3 HD <br/>(Preview) 
---|---|---|---|----|---|----
Service Level Agreement (SLA)|No <sup>1</sup> |Yes |Yes  |Yes |No <sup>1</sup> |No <sup>1</sup> 
Maximum partitions|N/A |1 |12  |12 |12|1
Indexes allowed per SKU|3|5|50|200|200|1000
Documents limits|10,000 total|1 million per service|15 million per partition |60 million per partition|120 million per partition |1 million per index
Partition size|50 MB total|2 GB per service|25 GB per partition |100 GB per partition (up to a maximum of 1.2 TB per service)|200 GB per partition (up to a maximum of 2.4 TB per service)|200 GB (for the 1 partition)
Maximum replicas|N/A |3 |12 |12 |12|12
Queries per second|N/A|~3 per replica|~15 per replica|~60 per replica|>60 per replica|>60 per replica

<sup>1</sup> Free and Preview SKUs do not come with SLAs. SLAs are enforced once a SKU becomes generally available.

> [AZURE.NOTE] Replica and partition maximums are subject a combined maximum billing configuration of 36 units, which imposes a lower effective limit than what the maximum implies at face value. For example, to use the maximum of 12 replicas, you could have at most 3 partitions (12 * 3 = 36 units). Similarly, to use maximum partitions, reduce replicas to 3. See [Scale resource levels for query and indexing workloads in Azure Search](search-capacity-planning.md) for a chart on allowable combinations.

### Common questions when choosing a SKU

The following questions can help you arrive at the right SKU decision for your workload.

1. Do you have **Service Level Agreement (SLA)** requirements? Narrow the SKU decision to Basic or non-preview Standard.
2. **How many indexes** do you require? One of the biggest variables that will factor into a SKU decision is the number of indexes supported by each SKU. Index support is at markedly different levels in the lower pricing tiers. Requirements on number of indexes could be a primary determinant of which SKU to choose.
3. **How many documents** will be loaded into each index? The number and size of documents will determine the eventual size of the index. Assuming you can estimate the projected size of the index, you can compare that number against the partition size per SKU, extended by the number of partitions required to store an index of that size. 
4. **What is the expected query load**? Once storage requirements are understood, consider query workloads. S2 and both S3 SKUs offer near-equivalent throughput, but SLA requirements will rule out any preview SKUs. 

Most customers can rule a specific SKU in or out based on their answers to these four questions. If you still aren't sure which SKU to go with, contact Azure Support for further guidance.

## Decision validation: does the SKU offer sufficient storage and QPS?

As a last step, revisit the [pricing page](https://azure.microsoft.com/pricing/details/search/) and the [per-service and per-index sections in Service Limits](search-limits-quotas-capacity.md) to double-check your estimates against subscription and service limits. 

If either the price or storage requirements are out of bounds, you might want to refactor the workloads among multiple smaller services (for example). On more granular level, you could redesign indexes to be smaller, or use filters to make queries more efficient.

> [AZURE.NOTE] Storage requirements can be over-inflated if documents contain extraneous data. Ideally, documents consist only of searchable data or metadata. Binary data that can bloat a document should be stored separately (perhaps in an Azure table or blob storage) with a field in the index to hold a URL reference to the external data. The maximum size of an individual document is 16 MB (or less if you are bulk uploading multiple documents in one request). See [Service limits in Azure Search](search-limits-quotas-capacity.md) for more information.

## Next step

Once you know which SKU is the right fit, continue on with these steps:
- [Create a search service in the portal](search-create-service-portal.md)
- [Change the allocation of partitions and replicas to scale your service](search-capacity-planning.md)

