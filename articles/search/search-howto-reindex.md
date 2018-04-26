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

Reindexing an index synchronizes content between external data sources and an Azure Search index. You can make REST or .NET API calls to refresh an index. For indexes populated using data source-specific indexers, you can refresh an index on schedule running at least every 15 minutes, up to whatever interval and pattern you require. Faster refresh schedules require pushing index updates manually, perhaps using an external scheduler or doing a double-write on transactions for concurrent updates on both the external data source and the Azure Search index.

## When to rebuild

+ Plan on frequent rebuilds during active development, when index schemas are in a state of flux.

  Most updates to an existing schema require an index rebuild, with the exception of these [index attributes](https://docs.microsoft.com/rest/api/searchservice/create-index): Retrievable, SearchAnalyzer, SynonymMaps. You can add the Retrievable, SearchAnalyzer, and SynonymMaps attributes to an existing field without having to rebuild its index.

+ In production to synchronize changes in transactional, external data stores with searchable content in an index.

## Full rebuilds

A full rebuild refers to deletion of an index, both data and metadata, followed by repopulating the index from external data sources. Programmatically, use the [Delete Index](https://docs.microsoft.com/rest/api/searchservice/delete-index) and [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index) operations or .NET equivalent APIs to rebuild the index. 

If source content has changed since the first index build, the new index and subsequent query results also vary. Similarly, if the data source schema also changed, corresponding edits to your index schema are also required.

## Partial or incremental rebuilds

Partial or incremental indexing preserves existing content while adding new documents, replacing changed documents, or deleting specific fields or documents. In code, call the [Add, Update or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) operation or .NET equivalent.

> [!Note]
> When using indexers that crawl external data sources, change tracking mechanisms in source systems are leveraged for incremental indexing. For [Azure Blob storage](search-howto-indexing-azure-blob-storage.md#incremental-indexing-and-deletion-detection), a lastModified field is used. On [Azure Table storage](search-howto-indexing-azure-tables.md#incremental-indexing-and-deletion-detection), timestamp serves the same purpose. Similarly both [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md#capture-new-changed-and-deleted-rows) and  [Azure Cosmos DB indexer](search/search-howto-index-cosmosdb.md#indexing-changed-documents) have fields for flagging row updates. For more information about indexers, see [Indexer overview](search-indexer-overview.md).

## Parallel indexing

Indexer-based indexing can run on schedule, which means you can specify multiple indexers running at the same time in parallel.

This strategy is especially useful for indexers driving a cognitive search enrichment pipeline. Image analysis and natural language processing are much longer-running than regular indexing. To complete processing in a reasonable time, you might want to design a partitioned data source strategy so that you can index in parallel. 

A strategy for parallel processing has these elements:

+ Divide source data among multiple containers or multiple virtual folders inside the same container. 
+ Map each mini data set to a [date source](https://docs.microsoft.com/rest/api/searchservice/create-data-source), paired to its own [indexer](https://docs.microsoft.com/rest/api/searchservice/create-indexer).
+ For cognitive search, reference the same [skillset](ref-create-skillset.md) in each indexer definition, and write into the same target search index. 
+ Schedule indexers to run at the same time.

For more information on this approach, see [Indexing Large Datasets](search-howto-indexing-azure-blob-storage.md#indexing-large-datasets).

### Scheduled indexing for large data sets

Indexer processing has a 24-hour window to complete. If processing cannot finish, due to large data set or highly complex analyses in a cognitive search pipeline, the behaviors of indexer scheduling can work to your advantage. 

By design, scheduled indexing automatically picks up where processing left off, with the system keeping track of where that occurs. For indexing that spans several days, you can put the indexer on a 23-hour schedule. When indexing kicks back in, I the indexer picks up at the last known good document. In this way, an indexer can work its way through the image backlog over a series of hours or days until all unprocessed images are processed. 

### Steps for parallel indexing configuration

For indexers, processing capacity is based on one indexer subsystem for each service unit (SU) used by your search service. Multiple concurrent indexers are possible on Azure Search services provisioned on Basic or Standard tiers, with at least two replicas. 

1. In the [Azure portal](https://portal.azure.com), on your search service dashboard **Overview** page, check the **Pricing tier** to confirm it can accommodate parallel indexing. Both Basic and Standard offer multiple replicas.

2. In **Settings** > **Scale**, [increase replicas](search-capacity-planning.md) for parallel processing: one additional replica for each indexer workload. Leave a sufficient number for existing query volume. Sacrificing query workloads for indexing is not a good tradeoff.

3. Create and schedule multiple indexers to run in parallel:

   + Assume a service with six replicas. Configure six indexers, each one mapped to a data source containing one-sixth of the data set.
    
   + For cognitive search, have each indexer reference the same skillset.

   + For each indexer, schedule the same run time pattern. For example, `"schedule" : { "interval" : "PT8H", "startTime" : "2018-05-15T00:00:00Z" }` creates a schedule on 2018-05-15 on all indexers, running at eight-hour intervals.

At the scheduled time, all indexers begin execution, loading data, applying enrichments (if you configured a cognitive search pipeline), and writing to the index. Azure Search does not lock the entire index for updates. Concurrent writes are managed, with retry if a particular write does not succeed on first attempt.

> [!Note]
> When increasing replicas, consider increasing the partition count if index size is projected to increase significantly. Partitions store slices of indexed content; the more partitions you have, the smaller the slice each one has to store.

## See also

+ [Indexer overview](search-indexer-overview.md)
+ [Indexing in the portal](search-import-data-portal.md)
+ [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md)
+ [Azure Blob Storage indexer](search-howto-indexing-azure-blob-storage.md)
+ [Azure Table Storage indexer](search-howto-indexing-azure-tables.md)




