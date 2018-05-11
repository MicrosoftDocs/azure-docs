---
title: Choose a pricing tier or SKU for Azure Search service | Microsoft Docs
description: 'Azure Search can be provisioned at these SKUs: Free, Basic, and Standard, where Standard is available in various resource configurations and capacity levels.'
services: search
author: HeidiSteen
manager: cgronlun
tags: azure-portal
ms.service: search
ms.topic: conceptual
ms.date: 05/12/2018
ms.author: heidist
---

# Choose a pricing tier for Azure Search

In Azure Search, a [service is provisioned](search-create-service-portal.md) at a specific pricing tier or SKU. Options include **Free**, **Basic**, or **Standard**, where **Standard** is available in multiple configurations and capacities. 

The purpose of this article is to help you choose a tier. It supplements the [pricing page](https://azure.microsoft.com/pricing/details/search/) and [Service Limits](search-limits-quotas-capacity.md) page with a digest of billing concepts and consumption patterns equated to various tiers.

Tiers determine capacity, not features. If a tier's capacity turns out to be too low, you will need to provision a new service at the higher tier and then reload your indexes. There is no in-place upgrade of the same service from one SKU to another.

> [!NOTE]
> Most customers start with the **Free** tier and then graduate to **S1**. After you choose a tier and [provision a search service](search-create-service-portal.md), you can increase replica and partition counts within the service. For more information, see [Allocate partitions and replicas for query and indexing workloads](search-capacity-planning.md).
>

## Billing concepts

Capacity is a reflection of the type of infrastructure provisioned for your exclusive use in Microsoft data centers. Some tiers run on more expensive hardware, which is reflected in tier price. 

Capacity is structured as *replicas* and *partitions*. Replicas are instances of the search service. Each replica always hosts one copy of an index. If you have 12 replicas, you have 12 copies of every index loaded on the service. Partitions provide index storage and I/O for read/write operations (for example, when rebuilding or refreshing an index).

Limits vary by tiers and are imposed at two levels: storage and resources. Storage is measured by partition size. Resources are measured by the quantity of objects instantiated and processed in the service, such as indexes, indexers, data sources, and so forth. You should think about both because whichever one you reach first is the effective limit. You can monitor resource consumption in the portal. 

Feature availability is not a billing consideration. All tiers, including the **Free** tier, offer feature parity, but indexing and resource constraints effectively limit the extent of feature usage. For example, [cognitive search](cognitive-search-concept-intro.md) indexing has long-running skills that time out on a free service unless the data set happens to be very small.

### Service Units

Billing units are referred to as *service units* and this is the most important billing-related concept to understand. Capacity is billed by service unit (SU), which is formulated as the product of replica and partitions used by a service: (R X P = SU). At a minimum, every service starts with 1 SU (one replica multiplied by one partition), but a more realistic model might be a 3-replica, 3-partition service billed at 9 SUs. 

Billing rate is hourly, with each tier having a different rate. Rates for each tier can be found on [Pricing Details](https://azure.microsoft.com/pricing/details/search/).

The amount you pay is function of SU consumption at the rate set by the tier you choose to provision at.

## Consumption patterns

Most customers start with the **Free** service, which they keep indefinitely, and then choose one of the **Standard** tiers for production workloads. 

On each side of the tier spectrum, **Basic** and **S3 HD** exist for important but atypical consumption patterns. **Basic** is for small production workloads: it offers SLA, dedicated resources, high availability, but modest storage, topping out at 2 GB total. This tier was engineered for customers who consistently under utilized available capacity. At the other end, **S3 HD** is for workloads typical of ISVs, partners, [multitenant solutions](search-modeling-multitenant-saas-applications.md), or any configuration calling for a large number of small indexes. It's usually obvious to a customer when **Basic** or **S3 HD** tier is the right fit.

**S1-S3** are a progression of tiers with increasing levels of capacity, with inflection points on partition size and resource limits:

|  | S1 | S2 | S3 |
|--|----|----|----|
| partition size|  25 GB | 100 GB | 250 GB | 
| index and indexer limits| 50 | 200 | 200 | 

**S1** is where most customers start. With partitions of 25 GB for up to 12 partitions, the per-service limit on **S1** is 300 GB total if you maximize partitions over replicas (see [Allocate partitions and replicas](search-capacity-planning.md#chart) for more balanced combinations.)

Outside of storage, other aspects of service capacity are uniform across tiers. Replicas, which are instances of the search engine (handling both indexing and query operations), do not vary by tier: an **S1** replica is the same as an **S3** replica. Similarly, request and response payloads, queries-per-second throughput, and maximum execution time also do not vary by tier.

Document limits used to be a consideration but is no longer applicable for most Azure Search services provisioned after January 2018. For more information about conditions where document limits still apply, see [Service limits: document limits](search-limits-quotas-capacity.md#document-limits).

> [!NOTE]
> **S3** and **S3 HD** are backed by identical high capacity infrastructure but each one reaches its maximum limit in different ways. **S3** targets a smaller number of very large indexes. As such, its maximum limit is resource-bound (2.4 TB for each service). **S3 HD** targets a large number of very small indexes. At 1,000 indexes, **S3 HD** reaches its limits in the form of index constraints. If you are an **S3 HD** customer who requires more than 1,000 indexes, contact Microsoft Support for information on how to proceed.

## Evaluation considerations

Capacity and costs of running the service go hand-in-hand. You should develop rough estimates on the following:

* Number and size of indexes you plan to create.
* Some idea of query volume, in terms of Queries Per Second (QPS). For more information on how to calculate QPS, see [Azure Search performance and optimization](search-performance-optimization.md).

Number and size are equally relevant to your analysis because maximum limits are reached through full utilization of hardware (partitions) or by maximum limits on resources (indexes, indexers, and so forth), whichever comes first.

Most customers develop realistic estimates of index quantity, size, and query volumes during the development cycle. A service is provisioned based on a best-guess estimate, and as the development project matures, teams usually know whether the existing service is over or under capacity for production workloads. Azure Search [tracks query volume and latency](search-monitor-usage.md), which you can see in the portal. You can also configure deep monitoring by enabling [search traffic analytics](search-traffic-analytics.md).

The **Free** tier and preview features do not come with [service level agreements (SLAs)](https://azure.microsoft.com/support/legal/sla/search/v1_0/). For all billable tiers, SLAs take effect when you provision sufficient redundancy for your service. Two or more replicas are required for query (read) SLA. Three or more replicas are required for query and indexing (read-write) SLA. The number of partitions is not an SLA consideration. 

## Tips for maximizing value

+ Learn how to build efficient indexes, and which refresh methodologies are the least impactful.

+ Allow metrics to build around queries and collect data around usage patterns (queries during business hours, indexing during off-peak hours). Although replicas are not tier-specific, the speed of read-write operations goes up on tiers offering high-performance hardware.

+ Remember that the only downside of under-provisioning is that you might have to tear down a service if actual requirements are greater than you estimated. You could create a new service in the same subscription at a higher tier and run it side by side until all apps and requests target the new endpoint.

> [!NOTE]
> Storage requirements can be over-inflated if documents contain extraneous data. Ideally, documents contain only searchable data or metadata. Binary data is non-searchable and should be stored separately (perhaps in an Azure table or blob storage) with a field in the index to hold a URL reference to the external data. The maximum size of an individual document is 16 MB (or less if you are bulk uploading multiple documents in one request). See [Service limits in Azure Search](search-limits-quotas-capacity.md) for more information.
>
>

## Next steps
Once you know which tier is the right fit, continue on with these steps:

* [Create a search service in the portal](search-create-service-portal.md)
* [Allocate partitions and replicas to scale your service](search-capacity-planning.md)
