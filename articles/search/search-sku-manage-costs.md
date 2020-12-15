---
title: Estimate capacity and costs
titleSuffix: Azure Cognitive Search
description: 'Review guidance for estimating capacity and managing search service costs, including infrastructure and tools in Azure, as well as best practices for using resources more effectively.'

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 12/01/2020

---

# How to estimate capacity and costs of an Azure Cognitive Search service

As part of capacity planning for Azure Cognitive Search, the following guidance can help you lower costs or manage costs more effectively:

+ Create all resources in the same region, or in as few regions as possible, to minimize or eliminate bandwidth charges.

+ Consolidate all services into one resource group, such as Azure Cognitive Search, Cognitive Services, and any other Azure services used in your solution. In the Azure portal, find the resource group and use the **Cost Management** commands for insight into actual and projected spending.

+ Consider Azure Web App for your front-end application so that requests and responses stay within the data center boundary.

+ Scale up for resource-intensive operations like indexing, and then readjust downwards for regular query workloads. Start with the minimum configuration for Azure Cognitive Search (one SU composed of one partition and one replica), and then monitor user activity to identify usage patterns that would indicate a need for more capacity. If there is a predictable pattern, you might be able to synchronize scale with activity (you would need to write code to automate this).

Additionally, visit [Billing and cost management](../cost-management-billing/cost-management-billing-overview.md) for built-in tools and features related to spending.

Shutting down a search service on a temporary basis is not possible. Dedicated resources are always operational, allocated for your exclusive use for the lifetime of your service. Deleting a service is permanent and also deletes its associated data.

In terms of the service itself, the only way to lower your bill is to reduce replicas and partitions to a level that still provides acceptable performance and [SLA compliance](https://azure.microsoft.com/support/legal/sla/search/v1_0/), or create a service at a lower tier (S1 hourly rates are lower than S2 or S3 rates). Assuming you provision your service at the lower end of your load projections, if you outgrow the service, you can create a second larger-tiered service, rebuild your indexes on the second service, and then delete the first one.

## How to evaluate capacity requirements

In Azure Cognitive Search, capacity is structured as *replicas* and *partitions*.

+ Replicas are instances of the search service. Each replica hosts one load-balanced copy of an index. For example, a service with six replicas has six copies of every index loaded in the service.

+ Partitions store indexes and automatically split searchable data. Two partitions split your index in half, three partitions split it into thirds, and so on. In terms of capacity, *partition size* is the primary differentiating feature among tiers.

> [!NOTE]
> All Standard and Storage Optimized tiers support [flexible combinations of replicas and partitions](search-capacity-planning.md#chart) so you can [optimize your system for speed or storage](search-performance-optimization.md) by changing the balance. The Basic tier offers up to three replicas for high availability but has only one partition. Free tiers don't provide dedicated resources: computing resources are shared by multiple subscribers.

### Evaluating capacity

Capacity and the costs of running the service go hand in hand. Tiers impose limits on two levels: storage and content (number of indexes, for example). You should think about both because whichever limit you reach first is the effective limit.

Business requirements typically dictate the number of indexes you'll need. For example, you might need a global index for a large repository of documents. Or you might need  multiple indexes based on region, application, or business niche.

To determine the size of an index, you have to [build one](search-what-is-an-index.md). Its size will be based on imported data and index configuration such as whether you enable suggesters, filtering, and sorting.

For full text search, the primary data structure is an [inverted index](https://en.wikipedia.org/wiki/Inverted_index) structure, which has different characteristics than source data. For an inverted index, size and complexity are determined by content, not necessarily by the amount of data that you feed into it. A large data source with high redundancy could result in a smaller index than a smaller dataset that contains highly variable content. So it's rarely possible to infer index size based on the size of the original dataset.

> [!NOTE] 
> Even though estimating future needs for indexes and storage can feel like guesswork, it's worth doing. If a tier's capacity turns out to be too low, you'll need to provision a new service at a higher tier and then [reload your indexes](search-howto-reindex.md). There's no in-place upgrade of a service from one tier to another.
>

## Estimate with the Free tier

One approach for estimating capacity is to start with the Free tier. Remember that the Free service offers up to three indexes, 50 MB of storage, and 2 minutes of indexing time. It can be challenging to estimate a projected index size with these constraints, but these are the steps:

+ [Create a free service](search-create-service-portal.md).
+ Prepare a small, representative dataset.
+ [Build an initial index in the portal](search-get-started-portal.md) and note its size. Features and attributes have an impact on storage. For example, adding suggesters (search-as-you-type queries) will increase storage requirements. Using the same data set, you might try creating multiple versions of an index, with different attributes on each field, to see how storage requirements vary. For more information, see ["Storage implications" in Create a basic index](search-what-is-an-index.md#index-size).

With a rough estimate in hand, you might double that amount to budget for two indexes (development and production) and then choose your tier accordingly.

## Estimate with a billable tier

Dedicated resources can accommodate larger sampling and processing times for more realistic estimates of index quantity, size, and query volumes during development. Some customers jump right in with a billable tier and then re-evaluate as the development project matures.

1. [Review service limits at each tier](./search-limits-quotas-capacity.md#index-limits) to determine whether lower tiers can support the number of indexes you need. Across the Basic, S1, and S2 tiers, index limits are 15, 50, and 200, respectively. The Storage Optimized tier has a limit of 10 indexes because it's designed to support a low number of very large indexes.

1. [Create a service at a billable tier](search-create-service-portal.md):

    + Start low, at Basic or S1, if you're not sure about the projected load.
    + Start high, at S2 or even S3, if you know you're going to have large-scale indexing and query loads.
    + Start with Storage Optimized, at L1 or L2, if you're indexing a large amount of data and query load is relatively low, as with an internal business application.

1. [Build an initial index](search-what-is-an-index.md) to determine how source data translates to an index. This is the only way to estimate index size.

1. [Monitor storage, service limits, query volume, and latency](search-monitor-usage.md) in the portal. The portal shows you queries per second, throttled queries, and search latency. All of these values can help you decide if you selected the right tier. 

Index number and size are equally important to your analysis. This is because maximum limits are reached through full utilization of storage (partitions) or by maximum limits on resources (indexes, indexers, and so forth), whichever comes first. The portal helps you keep track of both, showing current usage and maximum limits side by side on the Overview page.

> [!NOTE]
> Storage requirements can be inflated if documents contain extraneous data. Ideally, documents contain only the data that you need for the search experience. Binary data isn't searchable and should be stored separately (maybe in an Azure table or blob storage). A field should then be added in the index to hold a URL reference to the external data. The maximum size of an individual document is 16 MB (or less if you're bulk uploading multiple documents in one request). For more information, see [Service limits in Azure Cognitive Search](search-limits-quotas-capacity.md).
>

**Query volume considerations**

Queries per second (QPS) is an important metric during performance tuning, but it's generally only a tier consideration if you expect high query volume at the outset.

The Standard tiers can provide a balance of replicas and partitions. You can increase query turnaround by adding replicas for load balancing or add partitions for parallel processing. You can then tune for performance after the service is provisioned.

If you expect high sustained query volumes from the outset, you should consider higher Standard tiers, backed by more powerful hardware. You can then take partitions and replicas offline, or even switch to a lower-tier service, if those query volumes don't occur. For more information on how to calculate query throughput, see [Azure Cognitive Search performance and optimization](search-performance-optimization.md).

The Storage Optimized tiers are useful for large data workloads, supporting more overall available index storage for when query latency requirements are less important. You should still use additional replicas for load balancing and additional partitions for parallel processing. You can then tune for performance after the service is provisioned.

**Service-level agreements**

The Free tier and preview features don't provide [service-level agreements (SLAs)](https://azure.microsoft.com/support/legal/sla/search/v1_0/). For all billable tiers, SLAs take effect when you provision sufficient redundancy for your service. You need to have two or more replicas for query (read) SLAs. You need to have three or more replicas for query and indexing (read-write) SLAs. The number of partitions doesn't affect SLAs.

## Tips for tier evaluation

+ Allow metrics to build around queries, and collect data around usage patterns (queries during business hours, indexing during off-peak hours). Use this data to inform service provisioning decisions. Though it's not practical at an hourly or daily cadence, you can dynamically adjust partitions and resources to accommodate planned changes in query volumes. You can also accommodate unplanned but sustained changes if levels hold long enough to warrant taking action.

+ Remember that the only downside of under provisioning is that you might have to tear down a service if actual requirements are greater than your predictions. To avoid service disruption, you would create a new service at a higher tier and run it side by side until all apps and requests target the new endpoint.

## Next steps

Start with a Free tier and build an initial index by using a subset of your data to understand its characteristics. The data structure in Azure Cognitive Search is an inverted index structure. The size and complexity of an inverted index is determined by content. Remember that highly redundant content tends to result in a smaller index than highly irregular content. So content characteristics rather than the size of the dataset determine index storage requirements.

After you have an initial estimate of your index size, [provision a billable service](search-create-service-portal.md) on one of the tiers discussed in this article: Basic, Standard, or Storage Optimized. Relax any artificial constraints on data sizing and [rebuild your index](search-howto-reindex.md) to include all the data that you want to be searchable.

[Allocate partitions and replicas](search-capacity-planning.md) as needed to get the performance and scale you require.

If performance and capacity are fine, you're done. Otherwise, re-create a search service at a different tier that more closely aligns with your needs.

> [!NOTE]
> If you have questions, post to [StackOverflow](https://stackoverflow.com/questions/tagged/azure-search) or [contact Azure support](https://azure.microsoft.com/support/options/).