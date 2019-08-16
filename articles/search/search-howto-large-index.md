---
title: Index large data set using built-in indexers - Azure Search
description: Learn strategies for large data indexing or computationally intensive indexing through batch mode, resourcing, and techniques for scheduled, parallel, and distributed indexing.
services: search
author: HeidiSteen
manager: cgronlun

ms.service: search
ms.topic: conceptual
ms.date: 12/19/2018
ms.author: heidist
ms.custom: seodec2018

---
# How to index large data sets in Azure Search

As data volumes grow or processing needs change, you might find that default indexing strategies are no longer practical. For Azure Search, there are several approaches for accommodating larger data sets, ranging from how you structure a data upload request, to using a source-specific indexer for scheduled and distributed workloads.

The same techniques for large data also apply to long-running processes. In particular, the steps outlined in [parallel indexing](#parallel-indexing) are helpful for computationally intensive indexing, such as image analysis or natural language processing in [cognitive search pipelines](cognitive-search-concept-intro.md).

## Batch indexing

One of the simplest mechanisms for indexing a larger data set is to submit multiple documents or records in a single request. As long as the entire payload is under 16 MB, a request can handle up to 1000 documents in a bulk upload operation. Assuming the [Add or Update Documents REST API](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents), you would package 1000 documents in the body of the request.

Batch indexing is implemented for individual requests using REST or .NET, or through indexers. A few indexers operate under different limits. Specifically, Azure Blob indexing sets batch size at 10 documents in recognition of the larger average document size. For indexers based on the [Create Indexer REST API](https://docs.microsoft.com/rest/api/searchservice/Create-Indexer ), you can set the `BatchSize` argument to customize this setting to better match the characteristics of your data. 

> [!NOTE]
> To keep document size down, remember to exclude non-queryable data from the request. Images and other binary data are not directly searchable and shouldn't be stored in the index. To integrate non-queryable data into search results, you should define a non-searchable field that stores a URL reference to the resource.

## Add resources

Services that are provisioned at one of the [Standard pricing tiers](search-sku-tier.md) often have underutilized capacity for both storage and workloads (queries or indexing), which makes [increasing the partition and replica counts](search-capacity-planning.md) an obvious solution for accommodating larger data sets. For best results, you need both resources: partitions for storage, and replicas for the data ingestion work.

Increasing replicas and partitions are billable events that increase your cost, but unless you are continuously indexing under maximum load, you can add scale for the duration of the indexing process, and then adjust resource levels downward after indexing is finished.

## Use indexers

[Indexers](search-indexer-overview.md) are used to crawl external data sources for searchable content. While not specifically intended for large-scale indexing, several indexer capabilities are particularly useful for accommodating larger data sets:

+ Schedulers allow you to parcel out indexing at regular intervals so that you can spread it out over time.
+ Scheduled indexing can resume at the last known stopping point. If a data source is not fully crawled within a 24-hour window, the indexer will resume indexing on day two at wherever it left off.
+ Partitioning data into smaller individual data sources enables parallel processing. You can break a large data set into smaller data sets, and then create multiple data source definitions that can be indexed in parallel.

> [!NOTE]
> Indexers are data-source-specific, so using an indexer approach is only viable for selected data sources on Azure: [SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md), [Blob storage](search-howto-indexing-azure-blob-storage.md), [Table storage](search-howto-indexing-azure-tables.md), [Cosmos DB](search-howto-index-cosmosdb.md).

## Scheduled indexing

Indexer scheduling is an important mechanism for processing large data sets, as well as slow-running processes like image analysis in a cognitive search pipeline. Indexer processing operates within a 24-hour window. If processing fails to finish within 24 hours, the behaviors of indexer scheduling can work to your advantage. 

By design, scheduled indexing starts at specific intervals, with a job typically completing before resuming at the next scheduled interval. However, if processing does not complete within the interval, the indexer stops (because it ran out of time). At the next interval, processing resumes where it last left off, with the system keeping track of where that occurs. 

In practical terms, for index loads spanning several days, you can put the indexer on a 24-hour schedule. When indexing resumes for the next 24-hour cycle, it restarts at the last known good document. In this way, an indexer can work its way through a document backlog over a series of days until all unprocessed documents are processed. For more information about this approach, see [Indexing large datasets in Azure Blob storage](search-howto-indexing-azure-blob-storage.md#indexing-large-datasets). For more information about setting schedules in general, see [Create Indexer REST API](https://docs.microsoft.com/rest/api/searchservice/Create-Indexer#request-syntax) or see [How to schedule indexers for Azure Search](search-howto-schedule-indexers.md).

<a name="parallel-indexing"></a>

## Parallel indexing

A parallel indexing strategy is based on indexing multiple data sources in unison, where each data source definition specifies a subset of the data. 

For non-routine, computationally intensive indexing requirements - such as OCR on scanned documents in a cognitive search pipeline, image analysis, or natural language processing - a parallel indexing strategy is often the right approach for completing a long-running process in the shortest time. If you can eliminate or reduce query requests, parallel indexing on a service that is not simultaneously handling queries is your best strategy option for working through a large body of slow-processing content. 

Parallel processing has these elements:

+ Subdivide source data among multiple containers or multiple virtual folders inside the same container. 
+ Map each mini data set to its own [data source](https://docs.microsoft.com/rest/api/searchservice/create-data-source), paired to its own [indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer).
+ For cognitive search, reference the same [skillset](https://docs.microsoft.com/rest/api/searchservice/create-skillset) in each indexer definition.
+ Write into the same target search index. 
+ Schedule all indexers to run at the same time.

> [!NOTE]
> Azure Search does not support dedicating replicas or partitions to specific workloads. The risk of heavy concurrent indexing is overburdening your system to the detriment of query performance. If you have a test environment, implement parallel indexing there first to understand the tradeoffs.

### How to configure parallel indexing

For indexers, processing capacity is loosely based on one indexer subsystem for each service unit (SU) used by your search service. Multiple concurrent indexers are possible on Azure Search services provisioned on Basic or Standard tiers having at least two replicas. 

1. In the [Azure portal](https://portal.azure.com), on your search service dashboard **Overview** page, check the **Pricing tier** to confirm it can accommodate parallel indexing. Both Basic and Standard tiers offer multiple replicas.

2. In **Settings** > **Scale**, [increase replicas](search-capacity-planning.md) for parallel processing: one additional replica for each indexer workload. Leave a sufficient number for existing query volume. Sacrificing query workloads for indexing is not a good tradeoff.

3. Distribute data into multiple containers at a level that Azure Search indexers can reach. This could be multiple tables in Azure SQL Database, multiple containers in Azure Blob storage, or multiple collections. Define one data source object for each table or container.

4. Create and schedule multiple indexers to run in parallel:

   + Assume a service with six replicas. Configure six indexers, each one mapped to a data source containing one-sixth of the data set for a 6-way split of the entire data set. 

   + Point each indexer to the same index. For cognitive search workloads, point each indexer to the same skillset.

   + Within each indexer definition, schedule the same run-time execution pattern. For example, `"schedule" : { "interval" : "PT8H", "startTime" : "2018-05-15T00:00:00Z" }` creates a schedule on 2018-05-15 on all indexers, running at eight-hour intervals.

At the scheduled time, all indexers begin execution, loading data, applying enrichments (if you configured a cognitive search pipeline), and writing to the index. Azure Search does not lock the index for updates. Concurrent writes are managed, with retry if a particular write does not succeed on first attempt.

> [!Note]
> When increasing replicas, consider increasing the partition count if index size is projected to increase significantly. Partitions store slices of indexed content; the more partitions you have, the smaller the slice each one has to store.

## See also

+ [Indexer overview](search-indexer-overview.md)
+ [Indexing in the portal](search-import-data-portal.md)
+ [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md)
+ [Azure Blob Storage indexer](search-howto-indexing-azure-blob-storage.md)
+ [Azure Table Storage indexer](search-howto-indexing-azure-tables.md)
+ [Security in Azure Search](search-security-overview.md)
