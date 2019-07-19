---
title: Choose a pricing tier or SKU for Azure Search service - Azure Search
description: 'Azure Search can be provisioned in these SKUs: Free, Basic, and Standard, and Standard is available in various resource configurations and capacity levels.'
services: search
author: HeidiSteen
manager: cgronlun
tags: azure-portal
ms.service: search
ms.topic: conceptual
ms.date: 07/01/2019
ms.author: heidist
ms.custom: seodec2018
---

# Choose a pricing tier for Azure Search

When you create an Azure Search service, a [resource is created](search-create-service-portal.md) at a pricing tier (or SKU) that's fixed for the lifetime of the service. Tiers include Free, Basic, Standard, and Storage Optimized. Standard and Storage Optimized are available with several configurations and capacities.

Most customers start with the Free tier so they can evaluate the service. Post-evaluation, it's common to create a second service at one of the higher tiers for development and production deployments. You can complete all quickstarts and tutorials by using the Free tier, including the ones for resource-intensive cognitive search.

> [!NOTE]
> As of July 1, all tiers are generally available, including the Storage Optimized tier. All pricing can be found on the [Pricing Details](https://azure.microsoft.com/pricing/details/search/) page.

Tiers reflect the characteristics of the hardware hosting the service (rather than features) and are differentiated by:

+ The number of indexes you can create.
+ The size and speed of partitions (physical storage).

Although all tiers, including the Free tier, generally offer feature parity, larger workloads can dictate a need for higher tiers. For example, [AI enrichment with Cognitive Services](cognitive-search-concept-intro.md) has long-running skills that time out on a free service unless the dataset is small.

> [!NOTE] 
> The exception to feature parity is [indexers](search-indexer-overview.md), which are not available on S3 HD.
>

Within a tier, you can [adjust replica and partition resources](search-capacity-planning.md) to increase or decrease scale. You could start with one or two of each and then temporarily raise your computational power for a heavy indexing workload. The ability to tune resource levels within a tier adds flexibility, but also slightly complicates your analysis. You might have to experiment to see whether a lower tier with more resources/replicas offers better value and performance than a higher tier with fewer resources. To learn more about when and why you would adjust capacity, see [Performance and optimization considerations](search-performance-optimization.md).

## Tiers for Azure Search

The following table lists the available tiers. You can find out more about the various tiers on the [pricing page](https://azure.microsoft.com/pricing/details/search/), in the [Service limits in Azure Search](search-limits-quotas-capacity.md) article, and on the portal page when you're provisioning a service.

|Tier | Capacity |
|-----|-------------|
|Free | Shared with other subscribers. Not scalable. Limited to three indexes and 50 MB of storage. |
|Basic | Dedicated computing resources for production workloads at a smaller scale. One 2-GB partition and up to three replicas. |
|Standard 1 (S1) | For S1 and higher, dedicated machines with more storage and processing capacity at every level. For S1, partition size is 25 GB/partition (with a maximum of 300 GB per service). |
|Standard 2 (S2) | Similar to S1, but with 100-GB partitions (and a maximum of 1.2 TB per service). |
|Standard 3 (S3) | 200-GB partitions (with a maximum of 2.4 TB per service). |
|Standard 3 High Density (S3 HD) | High density is a *hosting mode* for S3. The underlying hardware is optimized for a large number of smaller indexes and is intended for multitenancy scenarios. S3 HD has the same per-unit charge as S3, but the hardware is optimized for fast file reads on a large number of smaller indexes.|
|Storage Optimized 1 (L1) | 1-TB partitions (with a maximum of 12 TB per service). |
|Storage Optimized 2 (L2) | 2-TB partitions (with a maximum of 24 TB per service). |

> [!NOTE] 
> The Storage Optimized tiers offer larger storage capacity at a lower price per TB than the Standard tiers. The primary tradeoff is higher query latency, which you should validate for your specific application requirements.  To learn more about the performance considerations of this tier, see [Performance and optimization considerations](search-performance-optimization.md).
>

## How billing works

There are three ways to incur costs in Azure Search. This section describes the three billing components: 

+ core service cost
+ data egress (or bandwidth) charges
+ AI enrichments

### Core service costs (fixed and variable)

For the service itself, the minimum charge is the first search unit (1 replica x 1 partition). This minimum is fixed for the lifetime of the service because the service can't run on anything less than this configuration.

Beyond the minimum, you can add replicas and partitions independently. For example, you can add only replicas or only partitions. Incremental increases in capacity through replicas and partitions make up the variable cost component.

Billing is based on a [formula (replicas x partitions x rate)](#search-units). The rate you're charged depends on the pricing tier you select.

In the following screenshot, per-unit pricing is indicated for Free, Basic, and S1. (S2, S3, L1, and L2 aren't shown.) If you create a Basic service, your monthly cost will average the value that appears for *price-1*. For a Standard service, your monthly cost will average the value that appears for *price-2*. Unit costs increase for each tier because the computational power and storage capacity is greater at each consecutive tier. The rates for Azure Search are available on the [Azure Search pricing page](https://azure.microsoft.com/pricing/details/search/).

![Per-unit pricing](./media/search-sku-tier/per-unit-pricing.png "Per-unit pricing")

When you're estimating the cost of a search solution, keep in mind that pricing and capacity aren't linear. (Doubling capacity more than doubles the cost.) For an example of how of the formula works, see [How to allocate replicas and partitions](search-capacity-planning.md#how-to-allocate-replicas-and-partitions).

#### Billing based on search units

The most important billing concept to understand for Azure Search operations is the *search unit* (SU). Because Azure Search depends on both replicas and partitions for indexing and queries, it doesn't make sense to bill by just one or the other. Instead, billing is based on a composite of both.

SU is the product of the *replicas* and *partitions* used by a service: **(R x P = SU)**.

Every service starts with one SU (one replica multiplied by one partition) as the minimum. The maximum for any service is 36 SUs. This maximum can be reached in multiple ways: 6 partitions x 6 replicas, or 3 partitions x 12 replicas, for example. It's common to use less than total capacity (for example, a 3-replica, 3-partition service billed as 9 SUs). See the [Partition and replica combinations](search-capacity-planning.md#chart) chart for valid combinations.

The billing rate is hourly per SU. Each tier has a progressively higher rate. Higher tiers come with larger and speedier partitions, and this contributes to an overall higher hourly rate for that tier. You can view the rates for each tier on the [pricing details](https://azure.microsoft.com/pricing/details/search/) page.

Most customers bring just a portion of total capacity online, holding the rest in reserve. For billing, the number of partitions and replicas that you bring online, calculated by the SU formula, determines what you pay on an hourly basis.

### Data egress charges during indexing

Using [Azure Search indexers](search-indexer-overview.md) might affect billing, depending on the location of your services. You can eliminate data egress charges entirely if you create the Azure Search service in the same region as your data. Here's some information from the [bandwidth pricing page](https://azure.microsoft.com/pricing/details/bandwidth/):

+ Microsoft doesn't charge for any inbound data to any service on Azure, or for any outbound data from Azure Search.

+ In multiservice solutions, there's no charge for data crossing the wire when all services are in the same region.

Charges do apply for outbound data if services are in different regions. These charges aren't actually part of your Azure Search bill. They're mentioned here because if you're using data or AI-enriched indexers to pull data from different regions, you'll see costs reflected in your overall bill.

### AI enrichments with Cognitive Services

For [AI enrichment with Cognitive Services](cognitive-search-concept-intro.md), you should plan to attach a billable Azure Cognitive Services resource, in the same region as Azure Search, at the S0 pricing tier for pay-as-you-go processing. There's no fixed cost associated with attaching Cognitive Services. You pay only for the processing you need.

Image extraction during document cracking is an Azure Search charge. It's billed according to the number of images extracted from your documents. Text extraction is currently free.

Other enrichments, like natural language processing, are based on [built-in cognitive skills](cognitive-search-predefined-skills.md) and billed against a Cognitive Services resource. They're billed at the same rate as if you had performed the task by using Cognitive Services directly. For more information, see [Attach a Cognitive Services resource with a skillset](cognitive-search-attach-cognitive-services.md).

<a name="search-units"></a>

#### Billing for image extraction in cognitive search

If you extract images from files in a cognitive search indexing pipeline, you'll be charged for that operation in your Azure Search bill. In an [indexer configuration](https://docs.microsoft.com/rest/api/searchservice/create-indexer#indexer-parameters), **imageAction** is the parameter that triggers image extraction. If **imageAction** is set to "none" (the default), you won't be charged for image extraction.

Pricing is subject to change. It's documented on the [pricing details](https://azure.microsoft.com/pricing/details/search/) page for Azure Search.

#### Billing for built-in skills in cognitive search

When you set up an enrichment pipeline, any [built-in skills](cognitive-search-predefined-skills.md) used in the pipeline are based on machine learning models. These models are provided by Cognitive Services. If you use these models during indexing, you'll be billed at the same rate as you would be if you requested the resource directly.

For example, say you have a pipeline that uses optical character recognition (OCR) against scanned JPEG files and the resulting text is pushed into an Azure Search index for free-form search queries. Your indexing pipeline would include an indexer with the [OCR skill](cognitive-search-skill-ocr.md), and that skill would be [attached to a Cognitive Services resource](cognitive-search-attach-cognitive-services.md). When you run the indexer, charges for OCR execution will appear on your Cognitive Resources bill.

## Tips for reducing costs

You can't shut down the service to reduce your bill. Dedicated resources are always operational, allocated for your exclusive use for the lifetime of your service. The only way to lower your bill is to reduce replicas and partitions to a level that still provides acceptable performance and [SLA compliance](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

One way to reduce costs is to choose a tier with a lower hourly rate. S1 hourly rates are lower than S2 or S3 rates. Assuming you provision your service at the lower end of your load projections, if you outgrow the service, you can create a second larger-tiered service, rebuild your indexes on the second service, and then delete the first one.

If you've done capacity planning for on-premises servers, you know it's common to "buy up" so you can handle projected growth. With a cloud service, you can pursue cost savings more aggressively because you're not locked in to a specific purchase. You can always switch to a higher-tiered service if the current one isn't sufficient.

### Capacity

In Azure Search, capacity is structured as *replicas* and *partitions*.

+ Replicas are instances of the search service. Each replica hosts one load-balanced copy of an index. For example, a service with six replicas has six copies of every index loaded in the service.

+ Partitions store indexes and automatically split searchable data. Two partitions split your index in half, three partitions split it into thirds, and so on. In terms of capacity, *partition size* is the primary differentiating feature among tiers.

> [!NOTE]
> All Standard and Storage Optimized tiers support [flexible combinations of replicas and partitions](search-capacity-planning.md#chart) so you can [optimize your system for speed or storage](search-performance-optimization.md) by changing the balance. The Basic tier offers up to three replicas for high availability but has only one partition. Free tiers don't provide dedicated resources: computing resources are shared by multiple subscribers.

### More about service limits

Services host resources like indexes and indexers. Each tier imposes [service limits](search-limits-quotas-capacity.md) on the number of resources you can create. So the maximum number of indexes (and other objects) is the second differentiating feature among tiers. As you review each option in the portal, note the limits on the number of indexes. Other resources, like indexers, data sources, and skillsets, are affixed to index limits.

## Consumption patterns

Most customers start with the Free service, which they keep indefinitely, and then choose one of the Standard or Storage Optimized tiers for serious development or production workloads.

![Azure Search pricing tiers](./media/search-sku-tier/tiers.png "Azure Search pricing tiers")

On the low and high ends, Basic and S3 HD are for important but atypical consumption patterns. Basic is for small production workloads. It offers SLAs, dedicated resources, and high availability, but it provides modest storage, topping out at 2 GB total. This tier was engineered for customers that consistently underutilize available capacity. At the high end, S3 HD is for workloads typical of ISVs, partners, [multitenant solutions](search-modeling-multitenant-saas-applications.md), or any configuration that calls for a large number of small indexes. It's often clear when Basic or S3 HD is the right tier. If you want confirmation, you can post to [StackOverflow](https://stackoverflow.com/questions/tagged/azure-search) or [contact Azure support](https://azure.microsoft.com/support/options/) for guidance.

The more commonly used standard tiers, S1 through S3, make up a progression of increasing levels of capacity. There are inflection points on partition size and limits on numbers of indexes, indexers, and corollary resources:

|  | S1 | S2 | S3 |  |  |  |  |
|--|----|----|----|--|--|--|--|
| Partition size|  25 GB | 100 GB | 200 GB |  |  |  |  |
| Index and indexer limits| 50 | 200 | 200 |  |  |  |  |

S1 is a common choice for customers that need dedicated resources and multiple partitions. S1 offers partitions of 25 GB and up to 12 partitions, providing a per-service limit of 300 GB if you maximize partitions over replicas. (See [Allocate partitions and replicas](search-capacity-planning.md#chart) for more balanced allocations.)

The portal and pricing pages put the focus on partition size and storage, but, for each tier, all compute capabilities (disk capacity, speed, CPUs) generally increase linearly with price. An S2 replica is faster than S1, and S3 is faster than S2. S3 tiers break from the linear compute-pricing pattern with disproportionately faster I/O. If you expect I/O to be the bottleneck, keep in mind that you can get much more IOPS with S3 than you can get with lower tiers.

S3 and S3 HD are backed by identical high-capacity infrastructure, but they reach their maximum limits in different ways. S3 targets a smaller number of very large indexes, so its maximum limit is resource-bound (2.4 TB for each service). S3 HD targets a large number of very small indexes. At 1,000 indexes, S3 HD reaches its limits in the form of index constraints. If you're an S3 HD customer and you need more than 1,000 indexes, contact Microsoft Support for information about how to proceed.

> [!NOTE]
> Document limits were a consideration at one time, but they're no longer applicable for new services. For information about conditions in which document limits still apply, see [Document limits](search-limits-quotas-capacity.md#document-limits).
>

Storage Optimized tiers, L1 and L2, are ideal for applications with large data requirements but a relatively low number of end users, when minimizing query latency isn't the top priority.  

|  | L1 | L2 |  |  |  |  |  |
|--|----|----|--|--|--|--|--|
| Partition size|  1 TB | 2 TB |  |  |  |  |  |
| Index and indexer limits| 10 | 10 |  |  |  |  |  |

L2 offers twice the overall storage capacity of L1.  Choose your tier based on the maximum amount of data that you think your index needs. The L1 tier partitions scale up in 1-TB increments to a maximum of 12 TB. The L2 partitions increase by 2 TBs per partition up to a maximum of 24 TB.

## Evaluating capacity

Capacity and the costs of running the service are directly related. Tiers impose limits on two levels: storage and resources. You should think about both because whichever limit you reach first is the effective limit.

Business requirements typically dictate the number of indexes you'll need. For example, you might need a global index for a large repository of documents. Or you might need  multiple indexes based on region, application, or business niche.

To determine the size of an index, you have to [build one](search-create-index-portal.md). The data structure in Azure Search is primarily an [inverted index](https://en.wikipedia.org/wiki/Inverted_index) structure, which has different characteristics than source data. For an inverted index, size and complexity are determined by content, not necessarily by the amount of data that you feed into it. A large data source with high redundancy could result in a smaller index than a smaller dataset that contains highly variable content. So it's rarely possible to infer index size based on the size of the original dataset.

> [!NOTE] 
> Even though estimating future needs for indexes and storage can feel like guesswork, it's worth doing. If a tier's capacity turns out to be too low, you'll need to provision a new service at a higher tier and then [reload your indexes](search-howto-reindex.md). There's no in-place upgrade of a service from one SKU to another.
>

### Step 1: Develop rough estimates by using the Free tier

One approach for estimating capacity is to start with the Free tier. Remember that the Free service offers up to three indexes, 50 MB of storage, and 2 minutes of indexing time. It can be challenging to estimate a projected index size with these constraints. Here's an approach that you can take:

+ [Create a free service](search-create-service-portal.md).
+ Prepare a small, representative dataset (for example, 5,000 documents and 10 percent sample size).
+ [Build an initial index](search-create-index-portal.md) and note its size in the portal (for example, 30 MB).

If the sample is representative and 10 percent of the entire data source, a 30-MB index becomes approximately 300 MB if all documents are indexed. Armed with this preliminary number, you might double that amount to budget for two indexes (development and production). This gives you a total of 600 MB in storage requirements. This requirement is easily satisfied by the Basic tier, so you would start there.

### Step 2: Develop refined estimates by using a billable tier

Some customers prefer to start with dedicated resources that can accommodate larger sampling and processing times and then develop realistic estimates of index quantity, size, and query volumes during development. Initially, a service is provisioned based on a best-guess estimate. Then, as the development project matures, teams usually know whether the existing service is over or under capacity for projected production workloads.

1. [Review service limits at each tier](https://docs.microsoft.com/azure/search/search-limits-quotas-capacity#index-limits) to determine whether lower tiers can support the number of indexes you need. Across the Basic, S1, and S2 tiers, index limits are 15, 50, and 200, respectively. The Storage Optimized tier has a limit of 10 indexes because it's designed to support a low number of very large indexes.

1. [Create a service at a billable tier](search-create-service-portal.md):

    + Start low, at Basic or S1, if you're at the beginning of your learning curve.
    + Start high, at S2 or even S3, if you know you're going to have large-scale indexing and query loads.
    + Start with Storage Optimized, at L1 or L2, if you're indexing a large amount of data and query load is relatively low, as with an internal business application.

1. [Build an initial index](search-create-index-portal.md) to determine how source data translates to an index. This is the only way to estimate index size.

1. [Monitor storage, service limits, query volume, and latency](search-monitor-usage.md) in the portal. The portal shows you queries per second, throttled queries, and search latency. All of these values can help you decide if you selected the right tier. You also can configure deep monitoring of values like clickthrough analysis by enabling [search traffic analytics](search-traffic-analytics.md).

Index number and size are equally important to your analysis. This is because maximum limits are reached through full utilization of storage (partitions) or by maximum limits on resources (indexes, indexers, and so forth), whichever comes first. The portal helps you keep track of both, showing current usage and maximum limits side by side on the Overview page.

> [!NOTE]
> Storage requirements can be inflated if documents contain extraneous data. Ideally, documents contain only the data that you need for the search experience. Binary data isn't searchable and should be stored separately (maybe in an Azure table or blob storage). A field should then be added in the index to hold a URL reference to the external data. The maximum size of an individual document is 16 MB (or less if you're bulk uploading multiple documents in one request). For more information, see [Service limits in Azure Search](search-limits-quotas-capacity.md).
>

**Query volume considerations**

Queries per second (QPS) is an important metric during performance tuning, but it's generally only a tier consideration if you expect high query volume at the outset.

The Standard tiers can provide a balance of replicas and partitions. You can increase query turnaround by adding replicas for load balancing or add partitions for parallel processing. You can then tune for performance after the service is provisioned.

If you expect high sustained query volumes from the outset, you should consider higher Standard tiers, backed by more powerful hardware. You can then take partitions and replicas offline, or even switch to a lower-tier service, if those query volumes don't occur. For more information on how to calculate query throughput, see [Azure Search performance and optimization](search-performance-optimization.md).

The Storage Optimized tiers are useful for large data workloads, supporting more overall available index storage for when query latency requirements are less important. You should still use additional replicas for load balancing and additional partitions for parallel processing. You can then tune for performance after the service is provisioned.

**Service-level agreements**

The Free tier and preview features don't provide [service-level agreements (SLAs)](https://azure.microsoft.com/support/legal/sla/search/v1_0/). For all billable tiers, SLAs take effect when you provision sufficient redundancy for your service. You need to have two or more replicas for query (read) SLAs. You need to have three or more replicas for query and indexing (read-write) SLAs. The number of partitions doesn't affect SLAs.

## Tips for tier evaluation

+ Learn how to build efficient indexes, and learn which refresh methods have the least impact. Use [search traffic analytics](search-traffic-analytics.md) to gain insights on query activity.

+ Allow metrics to build around queries, and collect data around usage patterns (queries during business hours, indexing during off-peak hours). Use this data to inform service provisioning decisions. Though it's not practical at an hourly or daily cadence, you can dynamically adjust partitions and resources to accommodate planned changes in query volumes. You can also accommodate unplanned but sustained changes if levels hold long enough to warrant taking action.

+ Remember that the only downside of underprovisioning is that you might have to tear down a service if actual requirements are greater than your predictions. To avoid service disruption, you would create a new service in the same subscription at a higher tier and run it side by side until all apps and requests target the new endpoint.

## Next steps

Start with a Free tier and build an initial index by using a subset of your data to understand its characteristics. The data structure in Azure Search is an inverted index structure. The size and complexity of an inverted index is determined by content. Remember that highly redundant content tends to result in a smaller index than highly irregular content. So content characteristics rather than the size of the dataset determine index storage requirements.

After you have an initial estimate of your index size, [provision a billable service](search-create-service-portal.md) on one of the tiers discussed in this article: Basic, Standard, or Storage Optimized. Relax any artificial constraints on data sizing and [rebuild your index](search-howto-reindex.md) to include all the data that you want to be searchable.

[Allocate partitions and replicas](search-capacity-planning.md) as needed to get the performance and scale you require.

If performance and capacity are fine, you're done. Otherwise, re-create a search service at a different tier that more closely aligns with your needs.

> [!NOTE]
> If you have questions, post to [StackOverflow](https://stackoverflow.com/questions/tagged/azure-search) or [contact Azure support](https://azure.microsoft.com/support/options/).
