---
title:  Estimate capacity for query and index workloads
titleSuffix: Azure AI Search
description: Adjust partition and replica computer resources in Azure AI Search, where each resource is priced in billable search units.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/15/2023
---

# Estimate and manage capacity of a search service

Before you [create a search service](search-create-service-portal.md) and lock in a specific [pricing tier](search-sku-tier.md), take a few minutes to understand how capacity works and how you might adjust replicas and partitions to accommodate workload fluctuation.

In Azure AI Search, capacity is based on *replicas* and *partitions* that can be scaled to your workload. Replicas are copies of the search engine.
Partitions are units of storage. Each new search service starts with one each, but you can adjust each unit independently to accommodate fluctuating workloads. Adding either unit is [billable](search-sku-manage-costs.md#billable-events).

The physical characteristics of replicas and partitions, such as processing speed and disk IO, vary by [service tier](search-sku-tier.md). If you provisioned on Standard, replicas and partitions will be faster and larger than those of Basic.

Changing capacity isn't instantaneous. It can take up to an hour to commission or decommission partitions, especially on services with large amounts of data.

When scaling a search service, you can choose from the following tools and approaches:

+ [Azure portal](#adjust-capacity)
+ [Azure PowerShell](search-manage-powershell.md)
+ [Azure CLI](/cli/azure/search)
+ [Management REST API](/rest/api/searchmanagement)

## Concepts: search units, replicas, partitions, shards

Capacity is expressed in *search units* that can be allocated in combinations of *partitions* and *replicas*, using an underlying *sharding* mechanism to support flexible configurations:

| Concept  | Definition|
|----------|-----------|
|*Search unit* | A single increment of total available capacity (36 units). It's also the billing unit for an Azure AI Search service. A minimum of one unit is required to run the service.|
|*Replica* | Instances of the search service, used primarily to load balance query operations. Each replica hosts one copy of an index. If you allocate three replicas, you'll have three copies of an index available for servicing query requests.|
|*Partition* | Physical storage and I/O for read/write operations (for example, when rebuilding or refreshing an index). Each partition has a slice of the total index. If you allocate three partitions, your index is divided into thirds. |
|*Shard* | A chunk of an index. Azure AI Search divides each index into shards to make the process of adding partitions faster (by moving shards to new search units).|

The following diagram shows the relationship between replicas, partitions, shards, and search units. It shows an example of how a single index is spanned across four search units in a service with two replicas and two partitions. Each of the four search units stores only half of the shards of the index. The search units in the left column store the first half of the shards, comprising the first partition, while those in the right column store the second half of the shards, comprising the second partition. Since there are two replicas, there are two copies of each index shard. The search units in the top row store one copy, comprising the first replica, while those in the bottom row store another copy, comprising the second replica.

:::image type="content" source="media/search-capacity-planning/shards.png" alt-text="Search indexes are sharded across partitions.":::

The diagram above is only one example. Many combinations of partitions and replicas are possible, up to a maximum of 36 total search units.

In Azure AI Search, shard management is an implementation detail and nonconfigurable, but knowing that an index is sharded helps to understand the occasional anomalies in ranking and autocomplete behaviors:

+ Ranking anomalies: Search scores are computed at the shard level first, and then aggregated up into a single result set. Depending on the characteristics of shard content, matches from one shard might be ranked higher than matches in another one. If you notice counter intuitive rankings in search results, it's most likely due to the effects of sharding, especially if indexes are small. You can avoid these ranking anomalies by choosing to [compute scores globally across the entire index](index-similarity-and-scoring.md#scoring-statistics-and-sticky-sessions), but doing so will incur a performance penalty.

+ Autocomplete anomalies: Autocomplete queries, where matches are made on the first several characters of a partially entered term, accept a fuzzy parameter that forgives small deviations in spelling. For autocomplete, fuzzy matching is constrained to terms within the current shard. For example, if a shard contains "Microsoft" and a partial term of "micor" is entered, the search engine will match on "Microsoft" in that shard, but not in other shards that hold the remaining parts of the index.

## Approaching estimation

Capacity and the costs of running the service go hand in hand. Tiers impose limits on two levels: content (a count of indexes on a service, for example) and storage. It's important to consider both because whichever limit you reach first is the effective limit.

Counts of indexes and other objects are typically dictated by business and engineering requirements. For example, you might have multiple versions of the same index for active development, testing, and production.

Storage needs are determined by the size of the indexes you expect to build. There are no solid heuristics or generalities that help with estimates. The only way to determine the size of an index is [build one](search-what-is-an-index.md). Its size will be based on imported data, text analysis, and index configuration such as whether you enable suggesters, filtering, and sorting.

For full text search, the primary data structure is an [inverted index](https://en.wikipedia.org/wiki/Inverted_index) structure, which has different characteristics than source data. For an inverted index, size and complexity are determined by content, not necessarily by the amount of data that you feed into it. A large data source with high redundancy could result in a smaller index than a smaller dataset that contains highly variable content. So it's rarely possible to infer index size based on the size of the original dataset.

Attributes on the index, such as enabling filters and sorting, will impact storage requirements. The use of suggesters also has storage implications. For more information, see [Attributes and index size](search-what-is-an-index.md#index-size).

> [!NOTE]
> Even though estimating future needs for indexes and storage can feel like guesswork, it's worth doing. If a tier's capacity turns out to be too low, you'll need to provision a new service at a higher tier and then [reload your indexes](search-howto-reindex.md). There's no in-place upgrade of a service from one tier to another.
>

### Estimate with the Free tier

One approach for estimating capacity is to start with the Free tier. Remember that the Free service offers up to three indexes, 50 MB of storage, and 2 minutes of indexing time. It can be challenging to estimate a projected index size with these constraints, but these are the steps:

+ [Create a free service](search-create-service-portal.md).
+ Prepare a small, representative dataset.
+ Create an index and load your data. If the dataset can be hosted in an Azure data source supported by indexers, you can use the [Import data wizard in the portal](search-get-started-portal.md) to both create and load the index. Otherwise, you could use [REST and Postman](search-get-started-rest.md) to create the index and push the data. The push model requires data to be in the form of JSON documents, where fields in the document correspond to fields in the index.
+ Collect information about the index, such as size. Features and attributes have an impact on storage. For example, adding suggesters (search-as-you-type queries) will increase storage requirements. 

  Using the same data set, you might try creating multiple versions of an index, with different attributes on each field, to see how storage requirements vary. For more information, see ["Storage implications" in Create a basic index](search-what-is-an-index.md#index-size).

With a rough estimate in hand, you might double that amount to budget for two indexes (development and production) and then choose your tier accordingly.

### Estimate with a billable tier

Dedicated resources can accommodate larger sampling and processing times for more realistic estimates of index quantity, size, and query volumes during development. Some customers jump right in with a billable tier and then re-evaluate as the development project matures.

1. [Review service limits at each tier](./search-limits-quotas-capacity.md#index-limits) to determine whether lower tiers can support the number of indexes you need. Across the Basic, S1, and S2 tiers, index limits are 15, 50, and 200, respectively. The Storage Optimized tier has a limit of 10 indexes because it's designed to support a low number of very large indexes.

1. [Create a service at a billable tier](search-create-service-portal.md):

    + Start low, at Basic or S1, if you're not sure about the projected load.
    + Start high, at S2 or even S3, if testing includes large-scale indexing and query loads.
    + Start with Storage Optimized, at L1 or L2, if you're indexing a large amount of data and query load is relatively low, as with an internal business application.

1. [Build an initial index](search-what-is-an-index.md) to determine how source data translates to an index. This is the only way to estimate index size. 

1. [Monitor storage, service limits, query volume, and latency](monitor-azure-cognitive-search.md) in the portal. The portal shows you queries per second, throttled queries, and search latency. All of these values can help you decide if you selected the right tier.

1. Add replicas if you need high availability or if you experience slow query performance.

   There are no guidelines on how many replicas are needed to accommodate query loads. Query performance depends on the complexity of the query and competing workloads. Although adding replicas clearly results in better performance, the result isn't strictly linear: adding three replicas doesn't guarantee triple throughput. For guidance in estimating QPS for your solution, see [Analyze performance](search-performance-analysis.md)and [Monitor queries](search-monitor-queries.md).

> [!NOTE]
> Storage requirements can be inflated if you include data that will never be searched. Ideally, documents contain only the data that you need for the search experience. Binary data isn't searchable and should be stored separately (maybe in an Azure table or blob storage). A field should then be added in the index to hold a URL reference to the external data. The maximum size of an individual search document is 16 MB (or less if you're bulk uploading multiple documents in one request). For more information, see [Service limits in Azure AI Search](search-limits-quotas-capacity.md).
>

**Query volume considerations**

Queries per second (QPS) is an important metric during performance tuning, but it's generally only a tier consideration if you expect high query volume at the outset.

The Standard tiers can provide a balance of replicas and partitions. You can increase query turnaround by adding replicas for load balancing or add partitions for parallel processing. You can then tune for performance after the service is provisioned.

If you expect high sustained query volumes from the outset, you should consider higher Standard tiers, backed by more powerful hardware. You can then take partitions and replicas offline, or even switch to a lower-tier service, if those query volumes don't occur. For more information on how to calculate query throughput, see [Monitor queries](search-monitor-queries.md).

The Storage Optimized tiers are useful for large data workloads, supporting more overall available index storage for when query latency requirements are less important. You should still use additional replicas for load balancing and additional partitions for parallel processing. You can then tune for performance after the service is provisioned.

**Service-level agreements**

The Free tier and preview features aren't covered by [service-level agreements (SLAs)](https://azure.microsoft.com/support/legal/sla/search/v1_0/). For all billable tiers, SLAs take effect when you provision sufficient redundancy for your service. You need to have two or more replicas for query (read) SLAs. You need to have three or more replicas for query and indexing (read-write) SLAs. The number of partitions doesn't affect SLAs.

## Tips for capacity planning

+ Allow metrics to build around queries, and collect data around usage patterns (queries during business hours, indexing during off-peak hours). Use this data to inform service provisioning decisions. Though it's not practical at an hourly or daily cadence, you can dynamically adjust partitions and resources to accommodate planned changes in query volumes. You can also accommodate unplanned but sustained changes if levels hold long enough to warrant taking action.

+ Remember that the only downside of under provisioning is that you might have to tear down a service if actual requirements are greater than your predictions. To avoid service disruption, you would create a new service at a higher tier and run it side by side until all apps and requests target the new endpoint.

## When to add capacity

Initially, a service is allocated a minimal level of resources consisting of one partition and one replica. The [tier you choose](search-sku-tier.md) determines partition size and speed, and each tier is optimized around a set of characteristics that fit various scenarios. If you choose a higher-end tier, you might [need fewer partitions](search-performance-tips.md#service-capacity) than if you go with S1. One of the questions you'll need to answer through self-directed testing is whether a larger and more expensive partition yields better performance than two cheaper partitions on a service provisioned at a lower tier.

A single service must have sufficient resources to handle all workloads (indexing and queries). Neither workload runs in the background. You can schedule indexing for times when query requests are naturally less frequent, but the service won't otherwise prioritize one task over another. Additionally, a certain amount of redundancy smooths out query performance when services or nodes are updated internally.

Some guidelines for determining whether to add capacity include:

+ Meeting the high availability criteria for service level agreement
+ The frequency of HTTP 503 errors is increasing
+ Large query volumes are expected

As a general rule, search applications tend to need more replicas than partitions, particularly when the service operations are biased toward query workloads. Each replica is a copy of your index, allowing the service to load balance requests against multiple copies. All load balancing and replication of an index is managed by Azure AI Search and you can alter the number of replicas allocated for your service at any time. You can allocate up to 12 replicas in a Standard search service and 3 replicas in a Basic search service. Replica allocation can be made either from the [Azure portal](search-create-service-portal.md) or one of the programmatic options.

Search applications that require near real-time data refresh will need proportionally more partitions than replicas. Adding partitions spreads read/write operations across a larger number of compute resources. It also gives you more disk space for storing additional indexes and documents.

Finally, larger indexes take longer to query. As such, you might find that every incremental increase in partitions requires a smaller but proportional increase in replicas. The complexity of your queries and query volume will factor into how quickly query execution is turned around.

> [!NOTE]
> Adding more replicas or partitions increases the cost of running the service, and can introduce slight variations in how results are ordered. Be sure to check the [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to understand the billing implications of adding more nodes. The [chart below](#chart) can help you cross-reference the number of search units required for a specific configuration. For more information on how additional replicas impact query processing, see [Ordering results](search-pagination-page-layout.md#ordering-results).

<a name="adjust-capacity"></a>

## Add or reduce replicas and partitions

1. Sign in to the [Azure portal](https://portal.azure.com/) and select the search service.

1. Under **Settings**, open the **Scale** page to modify replicas and partitions. 

   The following screenshot shows a Basic Standard provisioned with one replica and partition. The formula at the bottom indicates how many search units are being used (1). If the unit price was $100 (not a real price), the monthly cost of running this service would be $100 on average.

   :::image type="content" source="media/search-capacity-planning/1-initial-values.png" alt-text="Scale page showing current values" border="true":::

1. Use the slider to increase or decrease the number of partitions. Select **Save**.

   This example adds a second replica and partition. Notice the search unit count; it's now four because the billing formula is replicas multiplied by partitions (2 x 2). Doubling capacity more than doubles the cost of running the service. If the search unit cost was $100, the new monthly bill would now be $400.

   For the current per unit costs of each tier, visit the [Pricing page](https://azure.microsoft.com/pricing/details/search/).

   :::image type="content" source="media/search-capacity-planning/2-add-2-each.png" alt-text="Add replicas and partitions" border="true":::

1. After saving, you can check notifications to confirm the action succeeded.

   :::image type="content" source="media/search-capacity-planning/3-save-confirm.png" alt-text="Save changes" border="true":::

   Changes in capacity can take anywhere from 15 minutes up to several hours to complete. You can't cancel once the process has started and there's no real-time monitoring for replica and partition adjustments. However, the following message remains visible while changes are underway.

   :::image type="content" source="media/search-capacity-planning/4-updating.png" alt-text="Status message in the portal" border="true":::

> [!NOTE]
> After a service is provisioned, it cannot be upgraded to a higher tier. You must create a search service at the new tier and reload your indexes. See [Create an Azure AI Search service in the portal](search-create-service-portal.md) for help with service provisioning.

## How scale requests are handled

Upon receipt of a scale request, the search service:

1. Checks whether the request is valid.
1. Starts backing up data and system information.
1. Checks whether the service is already in a provisioning state (currently adding or eliminating either replicas or partitions).
1. Starts provisioning.

Scaling a service can take as little as 15 minutes or well over an hour, depending on the size of the service and the scope of the request. Backup can take several minutes, depending on the amount of data and number of partitions and replicas.

The above steps aren't entirely consecutive. For example, the system starts provisioning when it can safely do so, which could be while backup is winding down.

## Errors during scaling

The error message "Service update operations aren't allowed at this time because we're processing a previous request" is caused by repeating a request to scale down or up when the service is already processing a previous request.

Resolve this error by checking service status to verify provisioning status:

1. Use the [Management REST API](/rest/api/searchmanagement), [Azure PowerShell](search-manage-powershell.md), or [Azure CLI](/cli/azure/search) to get service status.
1. Call [Get Service (REST)](/rest/api/searchmanagement/services/get?view=rest-searchmanagement-2023-11-01&tabs=HTTP&preserve-version=true) or equivalent for PowerShell or the CLI.
1. Check the response for ["provisioningState": "provisioning"](/api/searchmanagement/services/get?view=rest-searchmanagement-2023-11-01&tabs=HTTP#provisioningstate&preserve-version=true)

If status is "Provisioning", wait for the request to complete. Status should be either "Succeeded" or "Failed" before another request is attempted. There's no status for backup. Backup is an internal operation and it's unlikely to be a factor in any disruption of a scale exercise.

If your search service appears to be stalled in a provisioning state, check for orphaned indexes that are unusable, with zero query volumes and no index updates. An unusable index can block changes to service capacity. In particular, look for indexes that are [CMK-encrypted](search-security-manage-encryption-keys.md), whose keys are no longer valid. You should either delete the index or restore the keys to bring the index back online and unblock your scale operation.

<a id="chart"></a>

## Partition and replica combinations

A Basic service can have exactly one partition and up to three replicas, for a maximum limit of three SUs. The only adjustable resource is replicas. You need a minimum of two replicas for high availability on queries.

All Standard and Storage Optimized search services can assume the following combinations of replicas and partitions, subject to the 36-SU limit allowed for these tiers. 

|   | **1 partition** | **2 partitions** | **3 partitions** | **4 partitions** | **6 partitions** | **12 partitions** |
| --- | --- | --- | --- | --- | --- | --- |
| **1 replica** |1 SU |2 SU |3 SU |4 SU |6 SU |12 SU |
| **2 replicas** |2 SU |4 SU |6 SU |8 SU |12 SU |24 SU |
| **3 replicas** |3 SU |6 SU |9 SU |12 SU |18 SU |36 SU |
| **4 replicas** |4 SU |8 SU |12 SU |16 SU |24 SU |N/A |
| **5 replicas** |5 SU |10 SU |15 SU |20 SU |30 SU |N/A |
| **6 replicas** |6 SU |12 SU |18 SU |24 SU |36 SU |N/A |
| **12 replicas** |12 SU |24 SU |36 SU |N/A |N/A |N/A |

SUs, pricing, and capacity are explained in detail on the Azure website. For more information, see [Pricing Details](https://azure.microsoft.com/pricing/details/search/).

> [!NOTE]
> The number of replicas and partitions divides evenly into 12 (specifically, 1, 2, 3, 4, 6, 12). Azure AI Search pre-divides each index into 12 shards so that it can be spread in equal portions across all partitions. For example, if your service has three partitions and you create an index, each partition will contain four shards of the index. How Azure AI Search shards an index is an implementation detail, subject to change in future releases. Although the number is 12 today, you shouldn't expect that number to always be 12 in the future.
>

## Next steps

> [!div class="nextstepaction"]
> [Manage costs](search-sku-manage-costs.md)
