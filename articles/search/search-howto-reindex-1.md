---
title: Rebuild an Azure Search index or refresh searchable content - Azure Search
description: Add new elements, update existing elements or documents, or delete obsolete documents in a full rebuild or partial incremental indexing to refresh an Azure Search index.
services: search
author: HeidiSteen
manager: cgronlun

ms.service: search
ms.topic: conceptual
ms.date: 04/19/2018
ms.author: heidist
ms.custom: seodec2018
---
# How to rebuild an Azure Search index - 2

This article explains how to rebuild an Azure Search index, the circumstances under which rebuilds are required, and suggestions for mitigating the impact of rebuilds for ongoing query requests.

A rebuild refers to dropping and recreating the physical data structures associated with an index. This includes all per-field inverted indexes. In Azure Search, you cannot drop and recreate specific fields. To rebuild an index, all field storage must be deleted, recreated based on an existing or revised index schema, and repopulated with data pushed to the index or pulled from external sources. It's common to rebuild indexes during development, but you might also need to rebuild a production-level index to accommodate structual changes, such as adding complex types.

In contrast with rebuilds which take an index offline, *data refresh* runs as a background task. You can add, remove, and replace documents with no disruption to query workloads. For more information on updating index content, see [Add, Update or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents).

## Rebuild conditions

| Condition | Description |
|-----------|-------------|
| Change a field definition | Name, data type, specific [index attributes](https://docs.microsoft.com/rest/api/searchservice/create-index): searchable, filterable, sortable, facetable require a full rebuild. |
| Delete a field | To physically remove all traces of a field, you have to rebuild the index. Most developers modify application code that disables access to the "deleted" field. Physically, the field definition and contents remain in the index until the next time you rebuild your index using a schema that omits the field in question. |
| Switch tiers | If you require more capacity, there is no in-place upgrade. A new service is created at the new capacity point, and indexes must be built from scratch on the new service. |

For clarity, the following changes do *not* require an index rebuild:

+ Add a new field
+ Add the **Retrievable** attribute to an existing field
+ Add, update, or delete scoring profiles
+ Add, update, or delete CORS settings
+ Add, update, or delete suggesters

When you add a new field, existing indexed documents are given a null value for the new field. On a future data refresh, values from external source data replace the nulls added by Azure Search.

## Partial or incremental indexing

In Azure Search, you cannot control indexing on a per-field basis, choosing to delete or recreate specific fields.

Similarly, there is no built-in mechanisms for indexing documents based on criteria. Any requirements you have for criteria-driven indexing has to be met through custom code.

What you can do easily, however, is refresh documents in an index. For many search solutions, external source data is volatile, and synchronization between source data and a search index is a common practice. In code, call the [Add, Update or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) operation or the .NET equivalent.

> [!Note]
>  [Indexers](search-indexer-overview.md) simplify data refresh tasks. When using indexers that crawl external data sources, you can leverage change-tracking mechanisms in source systems to provide only modified data to Azure Search. For [Azure Blob storage](search-howto-indexing-azure-blob-storage.md#incremental-indexing-and-deletion-detection), a `lastModified` field is used. On [Azure Table storage](search-howto-indexing-azure-tables.md#incremental-indexing-and-deletion-detection), `timestamp` serves the same purpose. Similarly, both [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md#capture-new-changed-and-deleted-rows) and  [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md#indexing-changed-documents) have fields for flagging row updates. For more information about indexers, see [Indexer overview](search-indexer-overview.md).

## How to rebuild an index

Plan on frequent, full rebuilds during active development, when index schemas are in a state of flux.

Read-write permissions at the service-level are required for index updates. Programmatically, you can call REST or .NET APIs for a full rebuild or incremental indexing of content, with parameters specifying update options. 

1. If you are reusing the index name, [drop the existing index]https://docs.microsoft.com/rest/api/searchservice/delete-index). Deleting an index is irreversible, destroying physical storage for the fields collection and other constructs. Make sure you are clear on the implications of deleting an index before you drop it. 
2. Provide an index schema with the changed or modified field definitions. Schema requirements are documented in [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index).
3. Provide an [admin key](https://docs.microsoft.com/en-us/azure/search/search-security-api-keys) on the request.
4. Send a [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index) command to build the physical expression of the index on Azure Search. The request body contains the index schema, as well as constructs for scoring profiles, analyzers, suggesters, and CORS options.
5. [Load the index with documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) from an external source.

Physical storage is allocated for each field in the index schema, with an inverted index created for each searchable field. Fields are that not searchable can be used in filters or expressions, but do not have inverted indexes and are not full-text searchable. 

Within each field's inverted index contains all of the tokenized words from each document, along with a list of document IDs. For example, on a search for hotels in Seattle, any document containing the term "Seattle" would be listed for that term, and returned in query results.


## See also

+ [Indexer overview](search-indexer-overview.md)
+ [Index large data sets at scale](search-howto-large-index.md)
+ [Indexing in the portal](search-import-data-portal.md)
+ [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md)
+ [Azure Blob Storage indexer](search-howto-indexing-azure-blob-storage.md)
+ [Azure Table Storage indexer](search-howto-indexing-azure-tables.md)
+ [Security in Azure Search](search-security-overview.md)