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
ms.date: 04/06/2018
ms.author: heidist
---

# Choose a SKU or pricing tier for Azure Search
In Azure Search, a [service is created](search-create-service-portal.md) at a specific pricing tier or SKU. Options include **Free**, **Basic**, or **Standard**, where **Standard** is available in multiple configurations and capacities.

High-level points:

+ Resources are dedicated when a service is created. If resources are insufficient, you will have to create a new service later at a higher tier and reload your indexes. There is no in-place upgrade for extending maximum limits of a given tier.
+ Tiers are based on capacity not features. Generally, features are available at every tier, including preview features. The one exception is no [indexer](search-indexers-overview.md) support in S3 HD.
+ Capacity and costs of running the service go hand-in-hand. Knowing [billing fundamentals](#how-billing-works) can help you plan more effectively. 

The following chart reprises the tiers. 

| Free | Basic | S1     | S2     | S3     | S3 HD     |
| ---- | ----- | ------ | ------ | ------ | --------- |
| Lightweight | Small production workloads | Medium workloads | Large workloads | Larger workloads | High-density workloads|
| 50 MB storage<br/>3 indexes<br/>10,000 documents | 3 replicas<br/>1 partition<br/>2 GB partition | 12 replicas<br/>12 partitions<br/>25 GB partitions| 12 replicas<br/>12 partitions<br/>100 GB partitions| 12 replicas<br/>12 partitions<br/>200 GB partitions | 12 replicas<br/>3 partitions<br/>200 GB partitions | 

**S** represents **Standard**. **HD** represents **High Density**.

Partition storage, [index upper limits](https://docs.microsoft.com/en-us/azure/search/search-limits-quotas-capacity#index-limits), and costs are the most important factors driving capacity planning.

For most customers, the real challenge is choosing among the middle tiers as you estimate whether a workload is small, medium, or large. At either end, choosing **Free** and **Standard 3 High Density (S3 HD)** is almost self-evident.

We recommend that you always provision a **Free** service (one per subscription, with no expiration) for light-weight projects, testing, and evaluation. Most tutorials and quickstarts are designed to run on free services. Because free services are shared with other subscribers, query throughput and indexing varies based on who else is using the service. Capacity is small (50 MB or 3 indexes with up 10,000 documents each).

On the far end, **S3 HD** is calibrated for workloads consistent with a [multitenancy design pattern](search-modeling-multitenant-saas-applications.md): a very large number of small indexes. This pattern is atypical, but if you need this capability, you will recognize this SKU as the right choice, with no deep analysis required.

<a name="how-billing-works"></a>

## How billing works

Cost is based on usage (the partitions and replicas you activate), but the unit price is less at the higher SKUs. A service maximum might offer 12 replicas, but you might only activate half that number, holding the remainder in reserve.

Replica and partition maximums are billed out as search units (36 unit maximum per service), which imposes a lower effective limit than what the maximum implies at face value. The formula is the product of replicas multiplied by partition (replica X partitions).

For example, to use the maximum of 12 replicas, you could have at most 3 partitions (12 * 3 = 36 units). Similarly, to use maximum partitions, reduce replicas to 3. See [Scale resource levels for query and indexing workloads in Azure Search](search-capacity-planning.md) for a chart on allowable combinations.

## Supporting small and medium workloads


## Supporting large workloads


## Estimation guidelines

Capacity and costs of running the service go hand-in-hand. Information in this article can help you decide which SKU delivers the right balance, but for any of it to be useful, you need at least rough estimates on the following:

* Number and size of indexes you plan to create
* Number and size of documents to upload
* Some idea of query volume, in terms of Queries Per Second (QPS). For guidance, see [Azure Search performance and optimization](search-performance-optimization.md).

Number and size are important because maximum limits are reached through a hard limit on the count of indexes per service, or on resources (storage or replicas) used by the service. The actual limit for your service is whichever gets used up first: resources or objects.

Number of indexes ... (an index is the search corpus -- you can't join indexes so each index must contain all searchable content for a given line-of-business application, content repository, inventory catalog, and so forth.)

Number of documents ...

Index size. Index size is primarily document quantity * size. 




## Review limits per tier
The following chart is a subset of the limits from [Service Limits in Azure Search](search-limits-quotas-capacity.md). It lists the factors most likely to impact a SKU decision. You can refer to this chart when reviewing the questions below.

| Resource | Free | Basic | S1 | S2 | S3 | S3 HD |
| -------- | ---- | ----- | -- | -- | ---| ----- |
| Service Level Agreement (SLA) |No <sup>1</sup> |Yes |Yes |Yes |Yes |Yes |
| Index limits |3 |5 |50 |200 |200 |1000 <sup>2</sup> |
| Maximum replicas |N/A |3 |12 |12 |12 |12 |
| Maximum partitions |N/A |1 |12 |12 |12 |3 <sup>2</sup> |
| Partition size |50 MB total |2 GB per service |25 GB per partition |100 GB per partition (up to a maximum of 1.2 TB per service) |200 GB per partition (up to a maximum of 2.4 TB per service) |200 GB (up to a maximum of 600 GB per service) |

<sup>1</sup> Free tier and preview features do not come with service level agreements (SLAs). For all billable tiers, SLAs take effect when you provision sufficient redundancy for your service. Two or more replicas are required for query (read) SLA. Three or more replicas are required for query and indexing (read-write) SLA. The number of partitions is not an SLA consideration. 

<sup>2</sup> S3 and S3 HD are backed by identical high capacity infrastructure but each one reaches its maximum limit in different ways. S3 targets a smaller number of very large indexes. As such, its maximum limit is resource-bound (2.4 TB for each service). S3 HD targets a large number of very small indexes. At 1,000 indexes, S3 HD reaches its limits in the form of index constraints. If you are an S3 HD customer who requires more than 1,000 indexes, contact Microsoft Support for information on how to proceed.

## Eliminate SKUs that don't meet requirements
The following questions can help you arrive at the right SKU decision for your workload.

1. **Service Level Agreement (SLA) requirements?** You can use any billable tier (Basic on up), but you must configure your service for redundancy. Two or more replicas are required for query (read) SLA. Three or more replicas are required for query and indexing (read-write) SLA. The number of partitions is not an SLA consideration.
2. **How many indexes are required?** One of the biggest variables factoring into a SKU decision is the number of indexes supported by each SKU. Index support is at markedly different levels in the lower pricing tiers. Requirements on number of indexes could be a primary determinant of a SKU decision.
3. **What is the estimated size of each index?** Indexes are primarily composed of documents populated from external sources. While indexesDocument  is where physical storage limits become a factor. For most regions, document counts are unlimited, but the size of documents, collectively, The number and size of documents will determine the eventual size of the index. Assuming you can estimate the projected size of the index, you can compare that number against the partition size per SKU, extended by the number of partitions required to store an index of that size.
4. If you are considering the S2 or S3 tier, determine whether you require [indexers](search-indexer-overview.md). Indexers are not yet available for the S3 HD tier. Alternative approach is to use a push model for index updates, where you write application code to push a data set to an index.

Most customers can rule a specific SKU in or out based on their answers to the above questions. If you still aren't sure which SKU to go with, you can post questions to MSDN or StackOverflow forums, or contact Azure Support for further guidance.

## Decision validation: does the SKU offer sufficient storage and QPS?
As a last step, revisit the [pricing page](https://azure.microsoft.com/pricing/details/search/) and the [per-service and per-index sections in Service Limits](search-limits-quotas-capacity.md) to double-check your estimates against subscription and service limits.

If either the price or storage requirements are out of bounds, you might want to refactor the workloads among multiple smaller services (for example). On more granular level, you could redesign indexes to be smaller.

> [!NOTE]
> Storage requirements can be over-inflated if documents contain extraneous data. Ideally, documents contain only searchable data or metadata. Binary data is non-searchable and should be stored separately (perhaps in an Azure table or blob storage) with a field in the index to hold a URL reference to the external data. The maximum size of an individual document is 16 MB (or less if you are bulk uploading multiple documents in one request). See [Service limits in Azure Search](search-limits-quotas-capacity.md) for more information.
>
>

## Next step

After you know which tier is the right fit, continue on with these steps:

* [Create a search service in the portal](search-create-service-portal.md)
* [Change the allocation of partitions and replicas to scale your service](search-capacity-planning.md)
