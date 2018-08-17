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


## See also

+ [Indexer overview](search-indexer-overview.md)
+ [Index large data sets at scale](search-howto-large-index.md)
+ [Indexing in the portal](search-import-data-portal.md)
+ [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md)
+ [Azure Blob Storage indexer](search-howto-indexing-azure-blob-storage.md)
+ [Azure Table Storage indexer](search-howto-indexing-azure-tables.md)
+ [Security in Azure Search](search-security-overview.md)