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
# How to re-index an Azure Search index

Re-indexing an index synchronizes content between external data sources and an Azure Search index. You can make REST or .NET API calls to refresh an index. For indexes populated using data source-specific indexers, you can refresh an index on schedule running at least every 15 minutes, up to whatever interval and pattern you require. Faster refresh schedules require pushing index updates manually, perhaps using an external scheduler or doing a double-write on transactions for concurrent updates on both the external data source and the Azure Search index.

## When to rebuild

+ Plan on frequent rebuilds during active development, when index schemas are in a state of flux.

  Most updates to an existing schema require an index rebuild, with the exception of these [index attributes](https://docs.microsoft.com/rest/api/searchservice/create-index): Retrievable, SearchAnalyzer, SynonymMaps. You can add the Retrievable, SearchAnalyzer, and SynonymMaps attributes to an existing field without having to rebuild its index.

+ In production to synchronize changes in transactional, external data stores with searchable content in an index.

## Full rebuilds

A full rebuild refers to deletion of an index, both data and metadata, followed by repopulating the index from external data sources. Programmaticaly, use the [Delete Index](https://docs.microsoft.com/rest/api/searchservice/delete-index) and [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index) operations or .NET equivalent APIs to rebuild the index. 

If source content has changed since the first index build, the new index and subsequent query results also vary. Similarly, if the data source schema also changed, corresponding edits to your index schema are also required.

## Partial or incremental rebuilds

Partial or incremental indexing preserves existing content while adding new documents, replacing changed documents, or deleting specific fields or documents. In code, call the [Add, Update or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) operation or the .NET equivalent.

## Rebuild an indexer-built index

When using indexers, additional methodologies for re-indexing are possible due to the added capabilities of underlying data platforms. Both Azure SQL Database and Azure Cosmos DB support change tracking, giving an indexer ability to leverage that feature for refresh on a record-by-record basis, based on a refresh date.

## Rebuild an indexer-built index handling cognitive search workloads

For indexers that include a cognitive search enrichment pipeline, the extensive processing time required for operations like image analysis or natural language processing over a large document store necessitates a partitioned data source strategy so that you can index in parallel. 

+ Place source data into multiple containers or multiple virtual folders inside the same container. 
+ Create multiple data source and indexer pairs in Azure Search. 
+ Reference the same skillset in each indexer definition, and write into the same target search index.

With this approach, your custom search app consumes a single index. For more details on this approach, see [Indexing Large Datasets](search-howto-indexing-azure-blob-storage.md#indexing-large-datasets).

Multiple concurrent indexing is possible for Azure Search services provisioned at the Basic tier or greater.

## See also

+ [Indexer overview](search-indexer-overview.md)
+ [Indexing in the portal](search-import-data-portal.md)
+ [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md)
+ [Azure Blob Storage indexer](search-howto-indexing-azure-blob-storage.md)
+ [Azure Table Storage indexer](search-howto-indexing-azure-tables.md)




