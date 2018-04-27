---
title: Reindex an Azure Search index to refresh searchable content | Microsoft Docs
description: Add new and modified or updated documents, delete obsolete documents, in a full rebuild or partial indexing operation that preserves unchanged documents in an Azure Search index.
services: search
author: HeidiSteen
manager: cgronlun

ms.service: search
ms.topic: conceptual
ms.date: 05/01/2018
ms.author: heidist

---
# How to reindex an Azure Search index

Reindexing updates an Azure Search index with the latest changes in a contributing external data source. You can make REST or .NET API calls to refresh an index. For indexes populated using source-specific indexers, you can schedule updates as often as every 15 minutes, up to whatever interval and pattern you require. Faster refresh rates require pushing index updates manually, perhaps through a double-write on transactions to get concurrent updates in both the external data source and the Azure Search index.

## When to rebuild

+ Plan on frequent, full rebuilds during active development, when index schemas are in a state of flux.

  Most updates to an existing schema require an index rebuild, with the exception of these [index attributes](https://docs.microsoft.com/rest/api/searchservice/create-index): Retrievable, SearchAnalyzer, SynonymMaps. You can add the Retrievable, SearchAnalyzer, and SynonymMaps attributes to an existing field without having to rebuild its index.

+ In production, you can switch to incremental indexing as a background task, with no discernable service disruption. 

If at some point you decide to switch tiers for more capacity, there is no in-place upgrade. A new service must be created at the new capacity point, and indexes must be built from scratch on the new service.

## Full rebuilds

A full rebuild refers to deletion of an index, both data and metadata, followed by repopulating the index from external data sources. Programmatically, use the [Delete Index](https://docs.microsoft.com/rest/api/searchservice/delete-index) and [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index) operations or .NET equivalent APIs to rebuild the index. 

You should expect variation in query results after full rebuilds, as of course the underlying content has changed. Similarly, if the data source schema also changed, corresponding edits to your index schema are also required.

## Partial or incremental rebuilds

Partial or incremental indexing preserves existing content while adding new documents, replacing changed documents, or deleting specific fields or documents. In code, call the [Add, Update or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) operation or .NET equivalent.

> [!Note]
> When using indexers that crawl external data sources, change tracking mechanisms in source systems are leveraged for incremental indexing. For [Azure Blob storage](search-howto-indexing-azure-blob-storage.md#incremental-indexing-and-deletion-detection), a lastModified field is used. On [Azure Table storage](search-howto-indexing-azure-tables.md#incremental-indexing-and-deletion-detection), timestamp serves the same purpose. Similarly both [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md#capture-new-changed-and-deleted-rows) and  [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md#indexing-changed-documents) have fields for flagging row updates. For more information about indexers, see [Indexer overview](search-indexer-overview.md).

## Parallel indexing

Indexer-based indexing can run on schedule, which means you can specify multiple indexers running at the same time in parallel.

This strategy is especially useful for indexers driving a cognitive search enrichment pipeline. Image analysis and natural language processing are much longer-running than regular indexing. To complete processing in a reasonable time, you can design a partitioned data source strategy for indexing in parallel. 

A strategy for parallel processing has these elements:

+ Divide source data among multiple containers or multiple virtual folders inside the same container. 
+ Map each mini data set to a [date source](https://docs.microsoft.com/rest/api/searchservice/create-data-source), paired to its own [indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer).
+ For cognitive search, reference the same [skillset](ref-create-skillset.md) in each indexer definition.
+ Write into the same target search index. 
+ Schedule all indexers to run at the same time.

For more information on this approach, see [Indexing Large Datasets](search-howto-indexing-azure-blob-storage.md#indexing-large-datasets).

### Scheduled indexing for large data sets

Indexer processing has a 24-hour window to complete. If processing fails to finish within 24 hours, the behaviors of indexer scheduling can work to your advantage. 

By design, scheduled indexing starts at specific intervals, and the job typically completes before the next interval occurs. However, if processing does not complete in time, the indexer stops and restarts at each interval boundary, automatically picking up where processing it last left off. The system keeps track of where that occurs. For indexing loads spanning several days, you can put the indexer on a 24-hour schedule. When indexing resumes for the next 24-hour stint, it restarts at the last known good document. In this way, an indexer can work its way through the image backlog over a series of hours or days until all unprocessed images are processed. 

### Configure parallel indexing

For indexers, processing capacity is based on one indexer subsystem for each service unit (SU) used by your search service. Multiple concurrent indexers are possible on Azure Search services provisioned on Basic or Standard tiers having at least two replicas. 

1. In the [Azure portal](https://portal.azure.com), on your search service dashboard **Overview** page, check the **Pricing tier** to confirm it can accommodate parallel indexing. Both Basic and Standard offer multiple replicas.

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




