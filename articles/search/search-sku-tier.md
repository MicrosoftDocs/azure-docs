---
title: Choose a pricing tier or SKU for Azure Search service - Azure Search
description: 'Azure Search can be provisioned at these SKUs: Free, Basic, and Standard, where Standard is available in various resource configurations and capacity levels.'
services: search
author: HeidiSteen
manager: cgronlun
tags: azure-portal
ms.service: search
ms.topic: conceptual
ms.date: 04/15/2019
ms.author: heidist
ms.custom: seodec2018
---

# Choose a pricing tier for Azure Search

In Azure Search, a [resource is created](search-create-service-portal.md) at a pricing tier or SKU that is fixed for the lifetime of the service. Tiers include **Free**, **Basic**, **Standard**, or **Storage Optimized**.  **Standard** and **Storage Optimized** are available in several configurations and capacities. 

Most customers start with the **Free** tier for evaluation and then graduate to one of the higher paid tiers for development and production deployments. You can complete all quickstarts and tutorials on the **Free** tier, including those for resource-intensive cognitive search.

> [!NOTE]
> The Storage Optimized service tiers are currently available as a preview at discounted pricing for testing and experimentation purposes with the goal of gathering feedback. Final pricing will be announced later when these tiers are generally available. We advise against using these tiers for production applications.

Tiers reflect the characteristics of the hardware hosting the service (rather than features) and are differentiated by:

+ Number of indexes you can create
+ Size and speed of partitions (physical storage)

Although all tiers, including the **Free** tier, generally offer feature parity, larger workloads can dictate requirements for higher tiers. For example, [AI-indexing with Cognitive Services](cognitive-search-concept-intro.md) has long-running skills that time out on a free service unless the data set happens to be small.

> [!NOTE] 
> The exception to feature parity is [indexers](search-indexer-overview.md), which are not available on S3HD.
>

Within a tier, you can [adjust replica and partition resources](search-capacity-planning.md) to increase or decrease scale. You could start with one or two of each, and then temporarily raise your computational power for a heavy indexing workload. The ability to tune resource levels within a tier adds flexibility, but also slightly complicates your analysis. You might have to experiment to see whether a lower tier with higher resources/replicas offers better value and performance than a higher tier with lower resourcing. To learn more about when and why you would adjust capacity, see [Performance and optimization considerations](search-performance-optimization.md).

## Tiers for Azure Search

The following table lists the available tiers. Other sources of tier information include the [pricing page](https://azure.microsoft.com/pricing/details/search/), [service and data limits](search-limits-quotas-capacity.md), and the portal page when provisioning a service.

|Tier | Capacity |
|-----|-------------|
|Free | Shared with other subscribers. Non-scalable, limited to 3 indexes and 50 MB storage. |
|Basic | Dedicated computing resources for production workloads at a smaller scale. One 2 GB partition and up to three replicas. |
|Standard 1 (S1) | From S1 on up, dedicated machines with more storage and processing capacity at every level. Partition size is 25 GB/partition (max 300 GB per service) for S1. |
|Standard 2 (S2) | Similar to S1 but with 100 GB/partitions (max 1.2 TB per service) |
|Standard 3 (S3) | 200 GB/partition (max 2.4 TB per service) |
|Standard 3 High-density (S3-HD) | High density is a *hosting mode* for S3. The underlying hardware is optimized for a large number of smaller indexes, intended for multitenancy scenarios. S3-HD has the same per-unit charge as S3 but the hardware is optimized for fast file reads on a large number of smaller indexes.|
|Storage Optimized 1 (L1) | 1 TB/partition (max 12 TB per service) |
|Storage Optimized 2 (L2) | 2 TB/partition (max 24 TB per service) |

> [!NOTE] 
> The Storage Optimized tiers offer larger storage capacity at a lower price per TB than the Standard tiers. The primary tradeoff is higher query latency, which you should validate for your specific application requirements.  To learn more about performance considerations of this tier, see [Performance and optimization considerations](search-performance-optimization.md).
>

## How billing works

In Azure Search, there are three ways to incur costs in Aure Search, and there are fixed and variable components. This section looks at each billing component in turn.

### 1. Core service costs (fixed and variable)

For the service itself, the minimum charge is the first search unit (1 replica x 1 partition), and this amount is fixed for the lifetime of the service because the service cannot run on anything less than this configuration. 

Beyond the minimum, you can add replicas and partitions independently. For example, you can add only replicas or only partitions. Incremental increases in capacity through replicas and partitions constitute the variable cost component. 

Billing is based on a [formula (replicas x partitions x rate)](#search-units). The rate you are charged depends on the pricing tier you select.

In the following screenshot, per unit pricing is indicated for Free, Basic, and S1 (S2, S3, L1, and L2 are not shown). If you created a **Basic**, **Standard**, or **Storage Optimized** service, your monthly cost would average the value that appears for *price-1* and *price-2* respectively. Unit costs go up for each tier because the computational power and storage capacity is greater at each consecutive tier. The rates for Azure Search are published on the [Azure Search pricing page](https://azure.microsoft.com/pricing/details/search/).

![Per unit pricing](./media/search-sku-tier/per-unit-pricing.png "Per unit pricing")

When costing out a search solution, notice that pricing and capacity are not linear (doubling capacity more than doubles the cost). For an example of how of the formula works, see ["How to allocate replicas and partitions"](search-capacity-planning.md#how-to-allocate-replicas-and-partitions).


### 2. Data egress charges during indexing

Use of [Azure Search indexers](search-indexer-overview.md) can result in billing impact depending on where the services are located. You can eliminate data egress charges entirely if you create the Azure Search service in the same region as your data. The following points are from the [bandwidth pricing page](https://azure.microsoft.com/pricing/details/bandwidth/).

+ Microsoft does not charge for any inbound data to any service on Azure, or for any outbound data from Azure Search.

+ In multi-service solutions, there are no charges for data crossing the wire when all services are in the same region.

Charges do apply for outbound data if services are in different regions. Such charges are not part of your Azure Search bill per se, but they are mentioned here because if you are using data or AI-enriched indexers to pull data from different regions, you'll see those costs reflected in your overall bill. 

### 3. AI-enriched indexing using Cognitive Services

For [AI-indexing with Cognitive Services](cognitive-search-concept-intro.md), you should plan on attaching a billable Cognitive Services resource at the S0 pricing tier for pay-as-you-go processing. There is no "fixed cost" associated with attaching Cognitive Services. You pay only for the processing you need.

Image extraction during document cracking is an Azure Search charge, billed based on the number of images extracted from your documents. Text extraction is currently free. 

Other enrichments, such as natural language processing, are based on [built-in cognitive skills](cognitive-search-predefined-skills.md) are billed against a Cognitive Services resource, at the same rate as if you had performed the task using Cognitive Services directly. For more information, see [Attach a Cognitive Services resource with a skillset](cognitive-search-attach-cognitive-services.md).

<a name="search-units"></a>

### Billing based on search units

For Azure Search operations, the most important billing concept to understand is a *search unit* (SU). Because Azure Search depends on both replicas and partitions for indexing and queries, it doesn't make sense to bill by just one or the other. Instead, billing is based on a composite of both. 

SU is the product of *replica* and *partitions* used by a service: **`(R X P = SU)`**

Every service starts with one SU (one replica multiplied by one partition) as the minimum. The maximum for any service is 36 SUs, which can be achieved in multiple ways: 6 partitions x 6 replicas, or 3 partitions x 12 replicas, to name a few. It's common to use less than total capacity. For example, a 3-replica, 3-partition service, billed as 9 SUs. You can review [this chart](search-capacity-planning.md#chart) to see valid combinations at a glance.

The billing rate is **hourly per SU**, with each tier having a progressively higher rate. Higher tiers come with larger and speedier partitions, contributing to an overall higher hourly rate for that tier. Rates for each tier can be found on [Pricing Details](https://azure.microsoft.com/pricing/details/search/). 

Most customers bring just a portion of total capacity online, holding the rest in reserve. In terms of billing, it's the number of partitions and replicas that you bring online, calculated using the SU formula, that determines what you actually pay on an hourly basis.

### Billing for image extraction in cognitive search

If you are extracting images from files in a cognitive search indexing pipeline, you are charged for that operation in your Azure Search bill. The parameter that triggers image extraction is **imageAction** in an [indexer configuration](https://docs.microsoft.com/rest/api/searchservice/create-indexer#indexer-parameters). If **imageAction** is set to none (default), there are no charges for image extraction.

Pricing is subject to change, but is always documented on the [Pricing Details](https://azure.microsoft.com/pricing/details/search/) page for Azure Search. 

### Billing for built-in skills in cognitive search

When you set up an enrichment pipeline, any [built-in skills](cognitive-search-predefined-skills.md) used in the pipeline are based on machine learning models. Those models are provided by Cognitive Services. Usage of those models during indexing is billed at the same rate as if you had requested the resource directly.

For example, assume a pipeline consisting of optical character recognition (OCR) against scanned image JPEG files, where the resulting text is pushed into an Azure Search index for free-form search queries. Your indexing pipeline would include an indexer with the [OCR skill](cognitive-search-skill-ocr.md), and that skill would be [attached to a Cognitive Services resource](cognitive-search-attach-cognitive-services.md). When you run the indexer, charges appear on your Cognitive Resources bill for OCR execution.

## Tips for reducing costs

You cannot shut down the service to lower the bill. Dedicated resources are operational 24-7, allocated for your exclusive use, for the lifetime of your service. The only way to lower a bill is by reducing replicas and partitions to a low level that still provides acceptable performance and [SLA compliance](https://azure.microsoft.com/support/legal/sla/search/v1_0/). 

One lever for reducing costs is choosing a tier with a lower hourly rate. S1 hourly rates are lower than S2 or S3 rates. Assuming that you provision a service aimed at the lower end of your load projections, if you outgrow the service, you could create a second larger-tiered service, rebuild your indexes on that second service, and then delete the first one. 

If you have done capacity planning for on premises servers, you know that it's common to "buy up" so that you can handle projected growth. But with a cloud service, you can pursue cost savings more aggressively because you are not locked in to a specific purchase. You can always switch to a higher-tiered service if the current one is insufficient.

### Capacity drill-down

In Azure Search, capacity is structured as *replicas* and *partitions*. 

+ Replicas are instances of the search service, where each replica hosts one load-balanced copy of an index. For example, a service with 6 replicas has 6 copies of every index loaded in the service. 

+ Partitions store indexes and automatically split searchable data: two partitions split your index in half, three partitions into thirds, and so forth. In terms of capacity, *partition size* is the primary differentiating feature across tiers.

> [!NOTE]
> All **Standard** and **Storage Optimized** tiers support [flexible combinations replica and partitions](search-capacity-planning.md#chart) so that you can [weight your system for speed or storage](search-performance-optimization.md) by changing the balance. **Basic** offers up three replicas for high availability but has only one partition. **Free** tiers do not provide dedicated resources: computing resources are shared by multiple subscribers.

### More about service limits

Services host resources, such as indexes, indexers, and so forth. Each tier imposes [service limits](search-limits-quotas-capacity.md) on the quantity of resources you can create. As such, a cap on the number of indexes (and other objects) is the second differentiating feature across tiers. As you review each option in the portal, note the limits on number of indexes. Other resources, such as indexers, data sources, and skillsets, are pegged to index limits.

## Consumption patterns

Most customers start with the **Free** service, which they keep indefinitely, and then choose one of the **Standard** or **Storage Optimized** tiers for serious development or production workloads. 

![Azure search tiers](./media/search-sku-tier/tiers.png "Azure search pricing tiers")

On either end, **Basic** and **S3 HD** exist for important but atypical consumption patterns. **Basic** is for small production workloads: it offers SLA, dedicated resources, high availability, but modest storage, topping out at 2 GB total. This tier was engineered for customers who consistently under utilized available capacity. At the far end, **S3 HD** is for workloads typical of ISVs, partners, [multitenant solutions](search-modeling-multitenant-saas-applications.md), or any configuration calling for a large number of small indexes. It's often self-evident when **Basic** or **S3 HD** tier is the right fit, but if you want confirmation you can post to [StackOverflow](https://stackoverflow.com/questions/tagged/azure-search) or [contact Azure Support](https://azure.microsoft.com/support/options/) for further guidance.

Shifting focus to the more commonly used standard tiers, **S1-S3** are a progression of increasing levels of capacity, with inflection points on partition size and maximums on numbers of indexes, indexers, and corollary resources:

|  | S1 | S2 | S3 |  |  |  |  |
|--|----|----|----|--|--|--|--|
| partition size|  25 GB | 100 GB | 200 GB |  |  |  |  |
| index and indexer limits| 50 | 200 | 200 |  |  |  |  |

**S1** is a common choice when dedicated resources and multiple partitions become a necessity. With partitions of 25 GB for up to 12 partitions, the per-service limit on **S1** is 300 GB total if you maximize partitions over replicas (see [Allocate partitions and replicas](search-capacity-planning.md#chart) for more balanced compositions.)

Portal and pricing pages put the focus on partition size and storage, but for each tier, all compute capabilities (disk capacity, speed, CPUs) grow linearly with price. An **S2** replica is faster than **S1**, and **S3** is faster than **S2**. **S3** tiers break the generally linear compute-pricing pattern with disproportionately faster I/O. If you anticipate I/O as the bottleneck, an **S3** gives you much more IOPS than lower tiers.

**S3** and **S3 HD** are backed by identical high capacity infrastructure but each one reaches its maximum limit in different ways. **S3** targets a smaller number of very large indexes. As such, its maximum limit is resource-bound (2.4 TB for each service). **S3 HD** targets a large number of very small indexes. At 1,000 indexes, **S3 HD** reaches its limits in the form of index constraints. If you are an **S3 HD** customer who requires more than 1,000 indexes, contact Microsoft Support for information on how to proceed.

> [!NOTE]
> Previously, document limits were a consideration but are no longer applicable for new services. For more information about conditions under which document limits still apply, see [Service limits: document limits](search-limits-quotas-capacity.md#document-limits).
>

Storage Optimized tiers, **L1-L2**, are ideal for applications with large data requirements, but a relatively low number of end users where minimizing query latency is not the top priority.  

|  | L1 | L2 |  |  |  |  |  |
|--|----|----|--|--|--|--|--|
| partition size|  1 TB | 2 TB |  |  |  |  |  |
| index and indexer limits| 10 | 10 |  |  |  |  |  |

*L2* offers twice the overall storage capacity to an *L1*.  Choose your tier based on the maximum amount of data you think your index needs.  The *L1* tier partitions scale up in 1 TB increments to a maximum of 12 TB, while the *L2* increase by 2 TBs per partition up to a maximum of 24 TB.

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

1. [Review service limits at each tier](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity#index-limits) to determine whether lower tiers can support the quantity of indexes you need. Across the **Basic**-**S1**-**S2** tiers, index limits are 15-50-200, respectively.  The **Storage Optimized** tier has a limit of 10 indexes since it is designer to support a low number of very large indexes.

1. [Create a service at a billable tier](search-create-service-portal.md):

    + Start low, on **Basic** or **S1** if you are at the beginning of your learning curve.
    + Start high, at **S2** or even **S3**, if large-scale indexing and query loads are self-evident.
    + Storage optimized, at **L1** or **L2**, if you are indexing a large amount of data and query load is relatively low, such as an internal business application.

1. [Build an initial index](search-create-index-portal.md) to determine how source data translates to an index. This is the only way to estimate index size.

1. [Monitor storage, service limits, query volume, and latency](search-monitor-usage.md) in the portal. The portal shows you queries per second, throttled queries, and search latency; all of which can help you decide if you selected the right tier. Aside from portal metrics, you can configure deep monitoring, such as clickthrough analysis, by enabling [search traffic analytics](search-traffic-analytics.md). 

Index number and size are equally relevant to your analysis because maximum limits are reached through full utilization of storage (partitions) or by maximum limits on resources (indexes, indexers, and so forth), whichever comes first. The portal helps you keep track of both, showing current usage and maximum limits side by side on the Overview page.

> [!NOTE]
> Storage requirements can be over-inflated if documents contain extraneous data. Ideally, documents contain only the data you need for the search experience. Binary data is non-searchable and should be stored separately (perhaps in an Azure table or blob storage) with a field in the index to hold a URL reference to the external data. The maximum size of an individual document is 16 MB (or less if you are bulk uploading multiple documents in one request). [Service limits in Azure Search](search-limits-quotas-capacity.md) has more information.
>

**Query volume considerations**

Queries-per-second (QPS) is a metric that gains prominence during performance tuning, but is generally not a tier consideration unless you expect high query volume at the outset.

The standard tiers can deliver a balance of replicas to partitions, supporting faster query turnaround through additional replicas for loading balancing and additional partitions for parallel processing. You can tune for performance after the service is provisioned.

Customers who expect strong sustained query volumes from the outset should consider higher **Standard** tiers, backed by more powerful hardware. You can then take partitions and replicas offline, or even switch to a lower tier service, if those query volumes fail to materialize. For more information on how to calculate query throughput, see [Azure Search performance and optimization](search-performance-optimization.md).

The storage optimized tiers lean toward large data workloads, supporting more overall index storage available, where query latency requirements are somewhat relaxed.  Additional replicas should still be leveraged for loading balancing and additional partitions for parallel processing. You can tune for performance after the service is provisioned.

**Service level agreements**

The **Free** tier and preview features do not come with [service level agreements (SLAs)](https://azure.microsoft.com/support/legal/sla/search/v1_0/). For all billable tiers, SLAs take effect when you provision sufficient redundancy for your service. Two or more replicas are required for query (read) SLA. Three or more replicas are required for query and indexing (read-write) SLA. The number of partitions is not an SLA consideration. 

## Tips for tier evaluation

+ Learn how to build efficient indexes, and which refresh methodologies are the least impactful. We recommend [search traffic analytics](search-traffic-analytics.md) for the insights gained on query activity.

+ Allow metrics to build around queries and collect data around usage patterns (queries during business hours, indexing during off-peak hours), and use this data to inform future service provisioning decisions. While not practical at an hourly or daily cadence, you can dynamically adjust partitions and resources to accommodate planned changes in query volumes, or unplanned but sustained changes if levels hold long enough to warrant taking action.

+ Remember that the only downside of under-provisioning is that you might have to tear down a service if actual requirements are greater than you estimated. To avoid service disruption, you would create a new service in the same subscription at a higher tier and run it side by side until all apps and requests target the new endpoint.

## Next steps

Start with a **Free** tier and build an initial index using a subset of your data to understand its characteristics. The data structure in Azure Search is an inverted index, where size and complexity of an inverted index is determined by content. Remember that highly redundant content tends to result in a smaller index than highly irregular content. As such, it is content characteristics rather than the size of the data set that determines index storage requirements.

Once you have an initial idea of index size, [provision a billable service](search-create-service-portal.md) at one of the tiers discussed in this article, either **Basic**, **Standard**, or **Storage Optimized** tier. Relax any artificial constraints on data sizing and [rebuild your index](search-howto-reindex.md) to include all of the data you actually want to be searchable.

[Allocate partitions and replicas](search-capacity-planning.md) as needed to get the performance and scale you require.

If performance and capacity are fine, you are done. Otherwise, re-create a search service at a different tier that more closely aligns with your needs.

> [!NOTE]
> For more help with your questions, post to [StackOverflow](https://stackoverflow.com/questions/tagged/azure-search) or [contact Azure Support](https://azure.microsoft.com/support/options/).
