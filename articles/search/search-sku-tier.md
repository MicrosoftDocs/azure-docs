---
title: Choose a pricing tier or SKU for Azure Search service | Microsoft Docs
description: 'Azure Search can be provisioned at these SKUs: Free, Basic, and Standard, where Standard is available in various resource configurations and capacity levels.'
services: search
author: HeidiSteen
manager: cgronlun
tags: azure-portal
ms.service: search
ms.topic: conceptual
ms.date: 09/25/2018
ms.author: heidist
---

# Choose a pricing tier for Azure Search

In Azure Search, a [service is provisioned](search-create-service-portal.md) at a pricing tier or SKU that is fixed for the lifetime of the service. Tiers include **Free**, **Basic**, or **Standard**, where **Standard** is available in multiple configurations and capacities. Most customers start with the **Free** tier for evaluation and then graduate to **Standard** for development and production deployments. You can complete all quickstarts and tutorials on the **Free** tier, including those for resource-intensive cognitive search. 

Tiers determine capacity, not features, and are differentiated by:

+ Number of indexes you can create
+ Size and speed of partitions (physical storage)

Although all tiers, including the **Free** tier, generally offer feature parity, larger workloads can dictate requirements for higher tiers. For example, [cognitive search](cognitive-search-concept-intro.md) indexing has long-running skills that time out on a free service unless the data set happens to be very small.

> [!NOTE] 
> The exception to feature parity is [indexers](search-indexer-overview.md), which are not available on S3HD.
>

Within a tier, you can [adjust replica and partition resources](search-capacity-planning.md) for performance tuning. Whereas you might start with two or three of each, you could temporarily raise your computational power for a heavy indexing workload. The ability to tune resource levels within a tier adds flexibility, but also slightly complicates your analysis. You might have to experiment to see whether a lower tier with higher resources/replicas offers better value and performance than a higher tier with lower resourcing. To learn more about when and why you would adjust capacity, see [Performance and optimization considerations](search-performance-optimization.md).

<!---
The purpose of this article is to help you choose a tier. It supplements the [pricing page](https://azure.microsoft.com/pricing/details/search/) and [Service Limits](search-limits-quotas-capacity.md) page with a digest of billing concepts and consumption patterns associated with various tiers. It also recommends an iterative approach for understanding which tier best meets your needs. 
--->

## How billing works

In Azure Search, the most important billing concept to understand is a *search unit* (SU). Because Azure Search depends on both replicas and partitions to function, it doesn't make sense to bill by just one or the other. Instead, billing is based on a composite of both. 

SU is the product of *replica* and *partitions* used by a service: **`(R X P = SU)`**

Every service starts with 1 SU (one replica multiplied by one partition) as the minimum. The maximum for any service is 36 SUs, which can be achieved in multiple ways: 6 partitions x 6 replicas, or 3 partitions x 12 replicas, to name a few. 

It's common to use less than total capacity. For example, a 3-replica, 3-partition service, billed as 9 SUs. 

The billing rate is **hourly per SU**, with each tier having a progressively higher rate. Higher tiers come with larger and speedier partitions, contributing to an overall higher hourly rate for that tier. Rates for each tier can be found on [Pricing Details](https://azure.microsoft.com/pricing/details/search/). 

Most customers bring just a portion of total capacity online, holding the rest in reserve. In terms of billing, it's the number of partitions and replicas that you bring online, calculated using the SU formula, that determines what you actually pay on an hourly basis.

### Tips for reducing costs

You cannot shut down the service to lower the bill. Dedicated resources are operational 24-7, allocated for your exclusive use, for the lifetime of your service. The only way to lower a bill is by reducing replicas and partitions to a low level that still provides acceptable performance and [SLA compliance](https://azure.microsoft.com/support/legal/sla/search/v1_0/). 

One lever for reducing costs is choosing a tier with a lower hourly rate. S1 hourly rates are lower than S2 or S3 rates. You could provision a service aimed at the lower end of your load projections. If you outgrow the service, create a second larger-tiered service, rebuild your indexes on that second service, and then delete the first one. If you have done capacity planning for on premises servers, you know that it's common to "buy up" so that you can handle projected growth. But with a cloud service, you can pursue cost savings more aggressively because you are not locked in to a specific purchase. You can always switch to a higher-tiered service if the current one is insufficient.

### Capacity drill-down

In Azure Search, capacity is structured as *replicas* and *partitions*. 

+ Replicas are instances of the search service, where each replica hosts one load-balanced copy of an index. For example, a service with 6 replicas has 6 copies of every index loaded in the service. 

+ Partitions store indexes and automatically split searchable data: two partitions split your index in half, three partitions into thirds, and so forth. In terms of capacity, *partition size* is the primary differentiating feature across tiers.

> [!NOTE]
> All **Standard** tiers support [flexible combinations replica and partitions](search-capacity-planning.md#chart) so that you can [weight your system for speed or storage](search-performance-optimization.md) by changing the balance. **Basic** offers up three replicas for high availability but has only one partition. **Free** tiers do not provide dedicated resources: computing resources are shared by multiple subscribers.

### More about service limits

Services host resources, such as indexes, indexers, and so forth. Each tier imposes [service limits](search-limits-quotas-capacity.md) on the quantity of resources you can create. As such, a cap on the number of indexes (and other objects) is the second differentiating feature across tiers. As you review each option in the portal, note the limits on number of indexes. Other resources, such as indexers, data sources, and skillsets, are pegged to index limits.

## Consumption patterns

Most customers start with the **Free** service, which they keep indefinitely, and then choose one of the **Standard** tiers for serious development or production workloads. 

![Azure search tiers](./media/search-sku-tier/tiers.png "Azure search pricing tiers")

On either end, **Basic** and **S3 HD** exist for important but atypical consumption patterns. **Basic** is for small production workloads: it offers SLA, dedicated resources, high availability, but modest storage, topping out at 2 GB total. This tier was engineered for customers who consistently under utilized available capacity. At the far end, **S3 HD** is for workloads typical of ISVs, partners, [multitenant solutions](search-modeling-multitenant-saas-applications.md), or any configuration calling for a large number of small indexes. It's often self-evident when **Basic** or **S3 HD** tier is the right fit, but if you want confirmation you can post to [StackOverflow](https://stackoverflow.com/questions/tagged/azure-search) or [contact Azure Support](https://azure.microsoft.com/support/options/) for further guidance.

Shifting focus to the more commonly used standard tiers, **S1-S3** are a progression of increasing levels of capacity, with inflection points on partition size and maximums on numbers of indexes, indexers, and corollary resources:

|  | S1 | S2 | S3 |  |  |  |  |
|--|----|----|----|--|--|--|--|
| partition size|  25 GB | 100 GB | 250 GB |  |  |  |  |
| index and indexer limits| 50 | 200 | 200 |  |  |  |  |

**S1** is a common choice when dedicated resources and multiple partitions become a necessity. With partitions of 25 GB for up to 12 partitions, the per-service limit on **S1** is 300 GB total if you maximize partitions over replicas (see [Allocate partitions and replicas](search-capacity-planning.md#chart) for more balanced compositions.)

Portal and pricing pages put the focus on partition size and storage, but for each tier, all compute capabilities (disk capacity, speed, CPUs) grow linearly with price. An **S2** replica is faster than **S1**, and **S3** is faster than **S2**. **S3** tiers break the generally linear compute-pricing pattern with disproportionately faster I/O. If you anticipate I/O as the bottleneck, an **S3** gives you much more IOPS than lower tiers.

**S3** and **S3 HD** are backed by identical high capacity infrastructure but each one reaches its maximum limit in different ways. **S3** targets a smaller number of very large indexes. As such, its maximum limit is resource-bound (2.4 TB for each service). **S3 HD** targets a large number of very small indexes. At 1,000 indexes, **S3 HD** reaches its limits in the form of index constraints. If you are an **S3 HD** customer who requires more than 1,000 indexes, contact Microsoft Support for information on how to proceed.

> [!NOTE]
> Previously, document limits were a consideration but are no longer applicable for new services. For more information about conditions under which document limits still apply, see [Service limits: document limits](search-limits-quotas-capacity.md#document-limits).
>

## Evaluate capacity

Capacity and costs of running the service go hand-in-hand. Tiers impose limits on two levels (storage and resources), so you should think about both because whichever one you reach first is the effective limit. 

Business requirements typically dictate the number of indexes you will need. For example, a global index for a large repository of documents, or perhaps multiple indexes based on region, application, or business niche.

To determine the size of an index, you have to [build one](search-create-index-portal.md). The data structure in Azure Search is primarily an [inverted index](https://en.wikipedia.org/wiki/Inverted_index), which has different characteristics than source data. For an inverted index, size and complexity are determined by content, not necessarily the amount of data you feed into it. A large data source with massive redundancy could result in a smaller index than a smaller dataset containing highly variable content. As such, it's rarely possible to infer index size based on the size of the original data set.

> [!NOTE] 
> Although estimating future needs for indexes and storage can feel like guesswork, it's worth doing. If a tier's capacity turns out to be too low, you will need to provision a new service at the higher tier and then [reload your indexes](search-howto-reindex.md). There is no in-place upgrade of the same service from one SKU to another.
>

### Step 1: Develop rough estimates using the Free tier

One approach for estimating capacity is to start with the **Free** tier. Recall that the **Free** service offers up to 3 indexes, 50 MB of storage, and 2 minutes of indexing time. It can be challenging to estimate a projected index size with these constraints, but the following example illustrates an approach:

+ [Create a free service](search-create-service-portal.md)
+ Prepare a small, representative data set (assume five thousand documents and ten percent sample size)
+ [Build an initial index](search-create-index-portal.md) and note its size in the portal (assume 30 MB)

Assuming the sample was both representative and ten percent of the entire data source, a 30 MB index becomes approximately 300 MB if all documents are indexed. Armed with this preliminary number, you might double that amount to budget for two indexes (development and production), for a total of 600 MB in storage requirements. This is easily satisfied by the **Basic** tier, so you would start there.

### Step 2: Develop refined estimates using a billable tier

Some customers prefer to start with dedicated resources that can accommodate larger sampling and processing times, and then develop realistic estimates of index quantity, size, and query volumes during development. Initially, a service is provisioned based on a best-guess estimate, and then as the development project matures, teams usually know whether the existing service is over or under capacity for projected production workloads. 

1. [Review service limits at each tier](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity#index-limits) to determine whether lower tiers can support the quantity of indexes you need. Across the **Basic**-**S1**- **S2** tiers, index limits are 15-50-200, respectively.

1. [Create a service at a billable tier](search-create-service-portal.md):

    + Start low, on **Basic** or **S1** if you are at the beginning of your learning curve.
    + Start high, at **S2** or even **S3**, if large-scale indexing and query loads are self-evident.

1. [Build an initial index](search-create-index-portal.md) to determine how source data translates to an index. This is the only way to estimate index size.

1. [Monitor storage, service limits, query volume, and latency](search-monitor-usage.md) in the portal. The portal shows you queries per second, throttled queries, and search latency; all of which can help you decide if you are at the right tier. Aside from portal metrics, you can configure deep monitoring, such as clickthrough analysis, by enabling [search traffic analytics](search-traffic-analytics.md). 

Index number and size are equally relevant to your analysis because maximum limits are reached through full utilization of storage (partitions) or by maximum limits on resources (indexes, indexers, and so forth), whichever comes first. The portal helps you keep track of both, showing current usage and maximum limits side by side on the Overview page.

> [!NOTE]
> Storage requirements can be over-inflated if documents contain extraneous data. Ideally, documents contain only the data you need for the search experience. Binary data is non-searchable and should be stored separately (perhaps in an Azure table or blob storage) with a field in the index to hold a URL reference to the external data. The maximum size of an individual document is 16 MB (or less if you are bulk uploading multiple documents in one request). [Service limits in Azure Search](search-limits-quotas-capacity.md) has more information.
>

**Query volume considerations**

Queries-per-second (QPS) is a metric that gains prominence during performance tuning, but is generally not a tier consideration unless you expect very high query volume at the outset.

All of the standard tiers can deliver a balance of replicas to partitions, supporting faster query turnaround through additional replicas for loading balancing and additional partitions for parallel processing. You can tune for performance after the service is provisioned.

Customer who expect strong sustained query volumes from the outset should consider higher tiers, backed by more powerful hardware. You can then take partitions and replicas offline, or even switch to a lower tier service, if those query volumes fail to materialize. For more information on how to calculate query throughput, see [Azure Search performance and optimization](search-performance-optimization.md).


**Service level agreements**

The **Free** tier and preview features do not come with [service level agreements (SLAs)](https://azure.microsoft.com/support/legal/sla/search/v1_0/). For all billable tiers, SLAs take effect when you provision sufficient redundancy for your service. Two or more replicas are required for query (read) SLA. Three or more replicas are required for query and indexing (read-write) SLA. The number of partitions is not an SLA consideration. 

## Tips for tier evaluation

+ Learn how to build efficient indexes, and which refresh methodologies are the least impactful. We recommend [search traffic analytics](search-traffic-analytics.md) for the insights gained on query activity.

+ Allow metrics to build around queries and collect data around usage patterns (queries during business hours, indexing during off-peak hours), and use this data to inform future service provisioning decisions. While not practical at an hourly or daily level, you can dynamically adjust partitions and resources to accommodate planned changes in query volumes, or unplanned but sustained changes if levels hold long enough to warrant taking action.

+ Remember that the only downside of under-provisioning is that you might have to tear down a service if actual requirements are greater than you estimated. To avoid service disruption, you would create a new service in the same subscription at a higher tier and run it side by side until all apps and requests target the new endpoint.

## Next steps

Start with a **Free** tier and build an initial index using a subset of your data to understand its characteristics. The data structure in Azure Search is an inverted index, where size and complexity of an inverted index is determined by content. Remember that highly redundant content tends to result in a smaller index than highly irregular content. As such, it's content characteristics rather than the size of the data set that determines index storage requirements.

Once you have an initial idea of index size, [provision a billable service](search-create-service-portal.md) at one of the tiers discussed in this article, either **Basic** or a **Standard** tier. Relax any artificial constraints on data subsets and [rebuild your index](search-howto-reindex.md) to include all of the data you actually want to be searchable.

[Allocate partitions and replicas](search-capacity-planning.md) as needed to get the performance and scale you require.

If performance and capacity are fine, you are done. Otherwise, re-create a search service at a different tier that more closely aligns with your needs.

> [!NOTE]
> For more help with your questions, post to [StackOverflow](https://stackoverflow.com/questions/tagged/azure-search) or [contact Azure Support](https://azure.microsoft.com/support/options/).