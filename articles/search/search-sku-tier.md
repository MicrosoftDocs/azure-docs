<properties
	pageTitle="Choose a SKU or pricing tier for Azure Search | Microsoft Azure"
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
	ms.date="07/25/2016"
	ms.author="heidist"/>

# Choose a SKU or pricing tier for Azure Search

During [service provisioning](search-create-service-portal.md), you'll need to specify ah SKU or pricing tier. Choices include **Free**, **Basic**, or **Standard**, where **Standard** is available in multiple configurations and capacities.

We recommend that you always provision a **Free** service (one per subscription, with no expiration) so that its readily available for demonstration or testing. You can use the **Free** service for testing and evaluation. You can then create a second billable service at the **Basic** or **Standard** tier for production or larger test workloads.

In Azure Search, the SKU determines capacity, not feature availability. All features are available at every pricing tier.

## How to approach a pricing tier decision

Capacity and costs of running the service go hand-in-hand. Information in this article can help you decide which SKU delivers the right balance, but for any of it to be useful, you will need at least rough estimates on the following:

- Number and size of indexes you plan to create
- Number and size of documents to upload
- Some idea of query volume, in terms of Queries Per Second (QPS)

Number and size are important because maximum limits are reached through a hard limit on the count of indexes or documents in a service, or on resources (storage or replicas) used by the service. The actual limit for your service will be whichever is used up first: resources or objects.

With estimates in hand, the following steps should simplify the process:

- **Step 1** Review the SKU descriptions below to learn about available options.
- **Step 2** Review the questions to narrow down your choice.
- **Step 3** Validate your decision by reviewing hard limits on storage and pricing.

> [AZURE.NOTE] If you underestimate capacity, you will need to provision a new service at the higher tier, and then reload your indexes. There is no in-place upgrade of the same service from one SKU to another.

## SKU descriptions

The following table provides descriptions of each tier. 

Tier|Primary scenarios
----|-----------------
**Free**|A shared service, at no charge, used for evaluation, investigation, or small workloads. Because it's shared with other subscribers, query throughput and indexing will vary based on who else is using the service. Capacity is small (50 MB or 3 indexes with up 10,000 documents each).
**Basic**|Small production workloads on dedicated hardware. Highly available. Capacity is up to 3 replicas and 1 partition (2 GB).
Standard 1 (**S1**)|Supports flexible combinations of partitions (12) and replicas (12), used for medium production workloads on dedicated hardware. You can allocate partitions and replicas in combinations supported by a maximum number of 36 billable search units. At this level, partitions are 25 GB each and QPS is approximately 15 queries per second.
Standard 2 (**S2**)|Runs larger production workloads using the same 36 search units as S1 but with larger sized partitions and replicas. At this level, partitions are 100 GB each and QPS is about 60 queries per second.
Standard 3 (**S3**) Preview|Runs proportionally larger production workloads on higher end systems, in configurations of up to 12 partitions or 12 replicas under 36 search units. At this level, partitions are 200 GB each and QPS is more than 60 queries per second. S3 is in preview and available at an introductory rate.
Standard 3 High Density (**S3 HD**) Preview|A large number of smaller indexes. There is one partition only, at 200 GB. QPS is more than 60 queries per second. S3 is in preview and available at  an introductory rate.

> [AZURE.NOTE] Replica and partition maximums are billed out as search units (36 unit maximum per service), which imposes a lower effective limit than what the maximum implies at face value. For example, to use the maximum of 12 replicas, you could have at most 3 partitions (12 * 3 = 36 units). Similarly, to use maximum partitions, reduce replicas to 3. See [Scale resource levels for query and indexing workloads in Azure Search](search-capacity-planning.md) for a chart on allowable combinations.

## Review limits per tier

The following chart is a subset of the limits from [Service Limits in Azure Search](search-limits-quotas-capacity.md). It lists the factors most likely to impact a SKU decision. You can refer to this chart when reviewing the questions below.

Resource|Free|Basic|S1|S2|S3 <br/>(Preview) |S3 HD <br/>(Preview) 
---|---|---|---|----|---|----
Service Level Agreement (SLA)|No <sup>1</sup> |Yes |Yes  |Yes |No <sup>1</sup> |No <sup>1</sup> 
Indexes allowed per SKU|3|5|50|200|200|1000
Documents limits|10,000 total|1 million per service|15 million per partition |60 million per partition|120 million per partition |1 million per index
Maximum partitions|N/A |1 |12  |12 |12|1
Partition size|50 MB total|2 GB per service|25 GB per partition |100 GB per partition (up to a maximum of 1.2 TB per service)|200 GB per partition (up to a maximum of 2.4 TB per service)|200 GB (for the 1 partition)
Maximum replicas|N/A |3 |12 |12 |12|12
Queries per second|N/A|~3 per replica|~15 per replica|~60 per replica|>60 per replica|>60 per replica

<sup>1</sup> Free and Preview SKUs do not come with SLAs. SLAs are enforced once a SKU becomes generally available.


## Eliminate SKUs that don't meet requirements 

The following questions can help you arrive at the right SKU decision for your workload.

1. Do you have **Service Level Agreement (SLA)** requirements? Narrow the SKU decision to Basic or non-preview Standard.
2. **How many indexes** do you require? One of the biggest variables that will factor into a SKU decision is the number of indexes supported by each SKU. Index support is at markedly different levels in the lower pricing tiers. Requirements on number of indexes could be a primary determinant of which SKU to choose.
3. **How many documents** will be loaded into each index? The number and size of documents will determine the eventual size of the index. Assuming you can estimate the projected size of the index, you can compare that number against the partition size per SKU, extended by the number of partitions required to store an index of that size. 
4. **What is the expected query load**? Once storage requirements are understood, consider query workloads. S2 and both S3 SKUs offer near-equivalent throughput, but SLA requirements will rule out any preview SKUs. 

Most customers can rule a specific SKU in or out based on their answers to these four questions. If you still aren't sure which SKU to go with, contact Azure Support for further guidance.

## Decision validation: does the SKU offer sufficient storage and QPS?

As a last step, revisit the [pricing page](https://azure.microsoft.com/pricing/details/search/) and the [per-service and per-index sections in Service Limits](search-limits-quotas-capacity.md) to double-check your estimates against subscription and service limits. 

If either the price or storage requirements are out of bounds, you might want to refactor the workloads among multiple smaller services (for example). On more granular level, you could redesign indexes to be smaller, or use filters to make queries more efficient.

> [AZURE.NOTE] Storage requirements can be over-inflated if documents contain extraneous data. Ideally, documents contain only searchable data or metadata. Binary data is non-searchable and should be stored separately (perhaps in an Azure table or blob storage) with a field in the index to hold a URL reference to the external data. The maximum size of an individual document is 16 MB (or less if you are bulk uploading multiple documents in one request). See [Service limits in Azure Search](search-limits-quotas-capacity.md) for more information.

## Next step

Once you know which SKU is the right fit, continue on with these steps:

- [Create a search service in the portal](search-create-service-portal.md)
- [Change the allocation of partitions and replicas to scale your service](search-capacity-planning.md)

