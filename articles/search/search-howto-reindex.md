---
title: Incremental indexing to refresh Azure Search content | Microsoft Docs
description: Add new and modified or updated documents, delete obsolete documents, in a partial indexing operation that preserves unchanged documents in an Azure Search index.
author: HeidiSteen
manager: cgronlun

ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.date: 12/28/2017
ms.author: heidist

---
# How to re-index an Azure Search index


## Full rebuilds

Full rebuilds of an index are commonplace when a search solution is under active development. Certain changes to the index schema require a full rebuild, such as when changing an index attribute on existing fields. Also, its often easier to drop and recreate an index from scratch than work through the steps necessary for a refresh.

A full rebuild refers to deletion of an index, both data and metadata, followed by repopulating the index from external data sources. Programmaticaly, use the [Delete Index](https://docs.microsoft.com/rest/api/searchservice/delete-index) and [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index) operations or .NET equivalent APIs to rebuild the index. If source content has changed since the first build, the new index and subsequent query results will vary from the previous index. If the data source schema also changed, corresponding edits to your index schema are also required.

## Partial or incremental rebuilds

Partial or incremental indexing preserves existing content while adding new documents, replacing changed documents, or deleting specific fields or documents. In code, call the [Add, Update or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) operation or the .NET equivalent.

## Rebuild an indexer-built index

When using indexers, additional methodologies are possible due to the added capabilities of underlying data platforms and an indexer's ability to leverage those features.

## Rebuild an indexer-built index handling cognitive search workloads

For indexers that include a cognitive search enrichment pipeline, the extensive processing time required for operations like image analysis or natural language processing over a large document store necessitates a multi-step rebuild strategy so that you can preserve the existing investment in enriched content. This section covers the steps for designing a re-indexing strategy.

## See also

+ [Indexer overview](search-indexer-overview.md)
+ [Indexing in the portal](search-import-data-portal.md)
+ [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md)
+ [Azure Blob Storage indexer](search-howto-indexing-azure-blob-storage.md)
+ [Azure Table Storage indexer](search-howto-indexing-azure-tables.md)




