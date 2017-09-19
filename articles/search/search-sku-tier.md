---
title: Choose a SKU or pricing tier for Azure Search | Microsoft Docs
description: 'Azure Search can be provisioned at these SKUs: Free, Basic, and Standard, where Standard is available in various resource configurations and capacity levels.'
services: search
documentationcenter: ''
author: HeidiSteen
manager: jhubbard
editor: ''
tags: azure-portal

ms.assetid: 8d4b7bca-02a5-43ee-b3f8-03551dfb32fd
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 10/24/2016
ms.author: heidist
---

# Choose a SKU or pricing tier for Azure Search
In Azure Search, a [service is provisioned](search-create-service-portal.md) at a specific pricing tier or SKU. Options include **Free**, **Basic**, or **Standard**, where **Standard** is available in multiple configurations and capacities.

The purpose of this article is to help you choose a tier. If a tier's capacity turns out to be too low, you will need to provision a new service at the higher tier and then reload your indexes. There is no in-place upgrade of the same service from one SKU to another.

> [!NOTE]
> After you choose a tier and [provision a search service](search-create-service-portal.md), you can increase replica and partition counts within the service. For guidance, see [Scale resource levels for query and indexing workloads](search-capacity-planning.md).
>
>

## How to approach a pricing tier decision
In Azure Search, the tier determines capacity, not feature availability. Generally, features are available at every tier, including preview features. The one exception is no support for indexers in S3 HD.

> [!TIP]
> We recommend that you always provision a **Free** service (one per subscription, with no expiration) so that its readily available for light-weight projects. Use the **Free** service for testing and evaluation; create a second billable service at the **Basic** or **Standard** tier for production or larger test workloads.
>
>

Capacity and costs of running the service go hand-in-hand. Information in this article can help you decide which SKU delivers the right balance, but for any of it to be useful, you need at least rough estimates on the following:

* Number and size of indexes you plan to create
* Number and size of documents to upload
* Some idea of query volume, in terms of Queries Per Second (QPS)

Number and size are important because maximum limits are reached through a hard limit on the count of indexes or documents in a service, or on resources (storage or replicas) used by the service. The actual limit for your service is whichever gets used up first: resources or objects.

With estimates in hand, the following steps should simplify the process:

* **Step 1** Review the SKU descriptions below to learn about available options.
* **Step 2** Answer the questions below to arrive at a preliminary decision.
* **Step 3** Finalize your decision by reviewing hard limits on storage and pricing.

## SKU descriptions
The following table provides descriptions of each tier.

| Tier | Primary scenarios |
| --- | --- |
| **Free** |A shared service, at no charge, used for evaluation, investigation, or small workloads. Because it's shared with other subscribers, query throughput and indexing varies based on who else is using the service. Capacity is small (50 MB or 3 indexes with up 10,000 documents each). |
| **Basic** |Small production workloads on dedicated hardware. Highly available. Capacity is up to 3 replicas and 1 partition (2 GB). |
| **S1** |Standard 1 supports flexible combinations of partitions (12) and replicas (12), used for medium production workloads on dedicated hardware. You can allocate partitions and replicas in combinations supported by a maximum number of 36 billable search units. At this level, partitions are 25 GB each and QPS is approximately 15 queries per second. |
| **S2** |Standard 2 runs larger production workloads using the same 36 search units as S1 but with larger sized partitions and replicas. At this level, partitions are 100 GB each and QPS is about 60 queries per second. |
| **S3** |Standard 3 runs proportionally larger production workloads on higher end systems, in configurations of up to 12 partitions or 12 replicas under 36 search units. At this level, partitions are 200 GB each and QPS is more than 60 queries per second. |
| **S3 HD** |Standard 3 High Density is designed for a large number of smaller indexes. You can have up to 3 partitions, at 200 GB each. QPS is more than 60 queries per second. |

> [!NOTE]
> Replica and partition maximums are billed out as search units (36 unit maximum per service), which imposes a lower effective limit than what the maximum implies at face value. For example, to use the maximum of 12 replicas, you could have at most 3 partitions (12 * 3 = 36 units). Similarly, to use maximum partitions, reduce replicas to 3. See [Scale resource levels for query and indexing workloads in Azure Search](search-capacity-planning.md) for a chart on allowable combinations.
>
>

## Review limits per tier
The following chart is a subset of the limits from [Service Limits in Azure Search](search-limits-quotas-capacity.md). It lists the factors most likely to impact a SKU decision. You can refer to this chart when reviewing the questions below.

| Resource | Free | Basic | S1 | S2 | S3 | S3 HD |
| --- | --- | --- | --- | --- | --- | --- |
| Service Level Agreement (SLA) |No <sup>1</sup> |Yes |Yes |Yes |Yes |Yes |
| Index limits |3 |5 |50 |200 |200 |1000 <sup>2</sup> |
| Document limits |10,000 total |1 million per service |15 million per partition |60 million per partition |120 million per partition |1 million per index |
| Maximum partitions |N/A |1 |12 |12 |12 |3 <sup>2</sup> |
| Partition size |50 MB total |2 GB per service |25 GB per partition |100 GB per partition (up to a maximum of 1.2 TB per service) |200 GB per partition (up to a maximum of 2.4 TB per service) |200 GB (up to a maximum of 600 GB per service) |
| Maximum replicas |N/A |3 |12 |12 |12 |12 |
| Queries per second |N/A |~3 per replica |~15 per replica |~60 per replica |>60 per replica |>60 per replica |

<sup>1</sup> Free tier and preview features do not come with service level agreements (SLAs). For all billable tiers, SLAs take effect when you provision sufficient redundancy for your service. Two or more replicas are required for query (read) SLA. Three or more replicas are required for query and indexing (read-write) SLA. The number of partitions is not an SLA consideration. 

<sup>2</sup> S3 and S3 HD are backed by identical high capacity infrastructure but each one reaches its maximum limit in different ways. S3 targets a smaller number of very large indexes. As such, its maximum limit is resource-bound (2.4 TB for each service). S3 HD targets a large number of very small indexes. At 1,000 indexes, S3 HD reaches its limits in the form of index constraints. If you are an S3 HD customer who requires more than 1,000 indexes, contact Microsoft Support for information on how to proceed.

## Eliminate SKUs that don't meet requirements
The following questions can help you arrive at the right SKU decision for your workload.

1. Do you have **Service Level Agreement (SLA)** requirements? You can use any billable tier (Basic on up), but you must configure your service for redundancy. Two or more replicas are required for query (read) SLA. Three or more replicas are required for query and indexing (read-write) SLA. The number of partitions is not an SLA consideration.
2. **How many indexes** do you require? One of the biggest variables factoring into a SKU decision is the number of indexes supported by each SKU. Index support is at markedly different levels in the lower pricing tiers. Requirements on number of indexes could be a primary determinant of a SKU decision.
3. **How many documents** will be loaded into each index? The number and size of documents will determine the eventual size of the index. Assuming you can estimate the projected size of the index, you can compare that number against the partition size per SKU, extended by the number of partitions required to store an index of that size.
4. **What is the expected query load**? Once storage requirements are understood, consider query workloads. S2 and both S3 SKUs offer near-equivalent throughput, but SLA requirements will rule out any preview SKUs.
5. If you are considering the S2 or S3 tier, determine whether you require [indexers](search-indexer-overview.md). Indexers are not yet available for the S3 HD tier. Alternative approach is to use a push model for index updates, where you write application code to push a data set to an index.

Most customers can rule a specific SKU in or out based on their answers to the above questions. If you still aren't sure which SKU to go with, you can post questions to MSDN or StackOverflow forums, or contact Azure Support for further guidance.

## Decision validation: does the SKU offer sufficient storage and QPS?
As a last step, revisit the [pricing page](https://azure.microsoft.com/pricing/details/search/) and the [per-service and per-index sections in Service Limits](search-limits-quotas-capacity.md) to double-check your estimates against subscription and service limits.

If either the price or storage requirements are out of bounds, you might want to refactor the workloads among multiple smaller services (for example). On more granular level, you could redesign indexes to be smaller, or use filters to make queries more efficient.

> [!NOTE]
> Storage requirements can be over-inflated if documents contain extraneous data. Ideally, documents contain only searchable data or metadata. Binary data is non-searchable and should be stored separately (perhaps in an Azure table or blob storage) with a field in the index to hold a URL reference to the external data. The maximum size of an individual document is 16 MB (or less if you are bulk uploading multiple documents in one request). See [Service limits in Azure Search](search-limits-quotas-capacity.md) for more information.
>
>

## Next step
Once you know which SKU is the right fit, continue on with these steps:

* [Create a search service in the portal](search-create-service-portal.md)
* [Change the allocation of partitions and replicas to scale your service](search-capacity-planning.md)
