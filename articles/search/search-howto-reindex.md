---
title: Rebuild an Azure Search index or refresh searchable content | Microsoft Docs
description: Add new elements, update existing elements or documents, or delete obsolete documents in a full rebuild or partial incremental indexing to refresh an Azure Search index.
services: search
author: HeidiSteen
manager: cgronlun

ms.service: search
ms.topic: conceptual
ms.date: 05/01/2018
ms.author: heidist

---
# How to rebuild an Azure Search index

Rebuilding an index changes its structure, altering the physical expression of the index in your Azure Search service. Conversely, refreshing an index is a content-only update to pick up the latest changes from a contributing external data source. This article provides direction on how to update indexes both structurally and substantively.

Read-write permissions at the service-level are required for index updates. Programmatically, you can call REST or .NET APIs for a full rebuild or incremental indexing of content, with parameters specifying update options. 

Generally, updates to an index are on-demand. However, for indexes populated using source-specific [indexers](search-indexer-overview.md), you can use a built-in scheduler. The scheduler supports document refresh as often as every 15 minutes, up to whatever interval and pattern you require. A faster refresh rate requires pushing index updates manually, perhaps through a double-write on transactions, updating both the external data source and the Azure Search index simultaneously.

## Full rebuilds

For many types of updates, a full rebuild is required. A full rebuild refers to deletion of an index, both data and metadata, followed by repopulating the index from external data sources. Programmatically, [delete](https://docs.microsoft.com/rest/api/searchservice/delete-index), [create](https://docs.microsoft.com/rest/api/searchservice/create-index), and [reload](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) the index to rebuild it. 

Post-rebuild, remember that if you have been testing query patterns and scoring profiles, you can expect variation in query results if the underlying content has changed.

## When to rebuild

Plan on frequent, full rebuilds during active development, when index schemas are in a state of flux.

| Modification | Rebuild status|
|--------------|---------------|
| Change a field name, data type, or its [index attributes](https://docs.microsoft.com/rest/api/searchservice/create-index) | Changing a field definition typically incurs a rebuild penalty, with the exception of these [index attributes](https://docs.microsoft.com/rest/api/searchservice/create-index): Retrievable, SearchAnalyzer, SynonymMaps. You can add the Retrievable, SearchAnalyzer, and SynonymMaps attributes to an existing field without having to rebuild its index.|
| Add a field | No strict requirement on rebuild. Existing indexed documents are given a null value for the new field. On a future reindex, values from source data replace the nulls added by Azure Search. |
| Delete a field | You can't directly delete a field from an Azure Search index. Instead, you should have your application ignore the "deleted" field to avoid using it. Physically, the field definition and contents remain in the index until the next time you rebuild your index using a schema that omits the field in question.|

> [!Note]
> A rebuild is also required if you switch tiers. If at some point you decide on more capacity, there is no in-place upgrade. A new service must be created at the new capacity point, and indexes must be built from scratch on the new service. 

## Partial or incremental indexing

Once an index is in production, focus shifts to incremental indexing, usually with no discernable service disruptions. Partial or incremental indexing is a content-only workload that synchronizes the content of a search index to reflect the state of content in a contributing data source. A document added or deleted in the source is added or deleted to the index. In code, call the [Add, Update or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) operation or the .NET equivalent.

> [!Note]
> When using indexers that crawl external data sources, change-tracking mechanisms in source systems are leveraged for incremental indexing. For [Azure Blob storage](search-howto-indexing-azure-blob-storage.md#incremental-indexing-and-deletion-detection), a `lastModified` field is used. On [Azure Table storage](search-howto-indexing-azure-tables.md#incremental-indexing-and-deletion-detection), `timestamp` serves the same purpose. Similarly, both [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md#capture-new-changed-and-deleted-rows) and  [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md#indexing-changed-documents) have fields for flagging row updates. For more information about indexers, see [Indexer overview](search-indexer-overview.md).

## Scale-out indexing

As data volumes grow or processing needs change, you might find that simple rebuilds and reindexing jobs are not enough. As a first step towards meeting increased demands, we recommend that you increase the [scale and capacity](search-capacity-planning.md) within the limits of your existing service. 

If you can use [indexers](search-indexer-overview.md), additional scale-out mechanisms become available. Indexers come with a built-in scheduler that allows you to parcel out indexing at regular intervals or extend processing beyond the 24-hour window. Additionally, when paired with data source definitions, indexers help you achieve a form of parallelism by partitioning data and using schedules to execute in parallel.

### Scheduled indexing for large data sets

Scheduling is an important mechanism for processing large data sets and slow-running analyses like image analysis in a cognitive search pipeline. Indexer processing operates within a 24-hour window. If processing fails to finish within 24 hours, the behaviors of indexer scheduling can work to your advantage. 

By design, scheduled indexing starts at specific intervals, with a job typically completing before resuming at the next scheduled interval. However, if processing does not complete within the interval, the indexer stops (because it ran out of time). At the next interval, processing resumes where it last left off, with the system keeping track of where that occurs. 

In practical terms, for index loads spanning several days, you can put the indexer on a 24-hour schedule. When indexing resumes for the next 24-hour stint, it restarts at the last known good document. In this way, an indexer can work its way through a document backlog over a series of days until all unprocessed documents are processed. For more information about this approach, see [Indexing large datasets](search-howto-indexing-azure-blob-storage.md#indexing-large-datasets)

<a name="parallel-indexing"></a>

### Parallel indexing

A second choice is to set up a parallel indexing strategy. For non-routine, computationally intensive indexing requirements, such as OCR on scanned documents in a cognitive search pipeline, a parallel indexing strategy might be the right approach for that specific goal. In a cognitive search enrichment pipeline, image analysis and natural language processing are long running. Parallel indexing on a service that is not simultaneously handling query requests could be a viable option for working through a large body of slow-processing content. 

A strategy for parallel processing has these elements:

+ Divide source data among multiple containers or multiple virtual folders inside the same container. 
+ Map each mini data set to a [date source](https://docs.microsoft.com/rest/api/searchservice/create-data-source), paired to its own [indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer).
+ For cognitive search, reference the same [skillset](ref-create-skillset.md) in each indexer definition.
+ Write into the same target search index. 
+ Schedule all indexers to run at the same time.

> [!Note]
> Azure Search does not support dedicating replicas or partitions to specific workloads. The risk of heavy concurrent indexing is overburdening your system to the detriment of query performance. If you have a test environment, implement parallel indexing there first to understand the tradeoffs.

### Configure parallel indexing

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