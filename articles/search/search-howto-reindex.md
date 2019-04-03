---
title: Rebuild an Azure Search index or refresh searchable content - Azure Search
description: Add new elements, update existing elements or documents, or delete obsolete documents in a full rebuild or partial incremental indexing to refresh an Azure Search index.
services: search
author: HeidiSteen
manager: cgronlun

ms.service: search
ms.topic: conceptual
ms.date: 02/13/2019
ms.author: heidist
ms.custom: seodec2018
---
# How to rebuild an Azure Search index

This article explains how to rebuild an Azure Search index, the circumstances under which rebuilds are required, and recommendations for mitigating the impact of rebuilds on ongoing query requests.

A *rebuild* refers to dropping and recreating the physical data structures associated with an index, including all field-based inverted indexes. In Azure Search, you cannot drop and recreate individual fields. To rebuild an index, all field storage must be deleted, recreated based on an existing or revised index schema, and then repopulated with data pushed to the index or pulled from external sources. It's common to rebuild indexes during development, but you might also need to rebuild a production-level index to accommodate structural changes, such as adding complex types or adding fields to suggesters.

In contrast with rebuilds that take an index offline, *data refresh* runs as a background task. You can add, remove, and replace documents with minimal disruption to query workloads, although queries typically take longer to complete. For more information on updating index content, see [Add, Update or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents).

## Rebuild conditions

| Condition | Description |
|-----------|-------------|
| Change a field definition | Revising a field name, data type, or specific [index attributes](https://docs.microsoft.com/rest/api/searchservice/create-index) (searchable, filterable, sortable, facetable) requires a full rebuild. |
| Assign an analyzer to a field | [Analyzers](search-analyzers.md) are defined in an index and then assigned to fields. You can add a new analyzer definition to an index at any time, but you can only *assign* an analyzer when the field is created. This is true for both the **analyzer** and **indexAnalyzer** properties. The **searchAnalyzer** property is an exception (you can assign this property to an existing field). |
| Update or delete an analyzer definition in an index | You cannot delete or change an existing analyzer configuration (analyzer, tokenizer, token filter, or char filter) in the index unless you rebuild the entire index. |
| Add a field to a suggester | If a field already exists and you want to add it to a [Suggesters](index-add-suggesters.md) construct, you must rebuild the index. |
| Delete a field | To physically remove all traces of a field, you have to rebuild the index. When an immediate rebuild is not practical, you can modify application code to disable access to the "deleted" field. Physically, the field definition and contents remain in the index until the next rebuild, when you apply a schema that omits the field in question. |
| Switch tiers | If you require more capacity, there is no in-place upgrade. A new service is created at the new capacity point, and indexes must be built from scratch on the new service. |

Any other modification can be made without impacting existing physical structures. Specifically, the following changes do *not* require an index rebuild:

+ Add a new field
+ Set the **retrievable** attribute on an existing field
+ Set a **searchAnalyzer** on an existing field
+ Add a new analyzer definition in an index
+ Add, update, or delete scoring profiles
+ Add, update, or delete CORS settings
+ Add, update, or delete synonymMaps

When you add a new field, existing indexed documents are given a null value for the new field. On a future data refresh, values from external source data replace the nulls added by Azure Search. For more information on updating index content, see [Add, Update or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents).

## Partial or incremental indexing

In Azure Search, you cannot control indexing on a per-field basis, choosing to delete or recreate specific fields. Similarly, there is no built-in mechanism for [indexing documents based on criteria](https://stackoverflow.com/questions/40539019/azure-search-what-is-the-best-way-to-update-a-batch-of-documents). Any requirements you have for criteria-driven indexing have to be met through custom code.

What you can do easily, however, is *refresh documents* in an index. For many search solutions, external source data is volatile, and synchronization between source data and a search index is a common practice. In code, call the [Add, Update or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) operation or the [.NET equivalent](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.indexesoperationsextensions.createorupdate?view=azure-dotnet) to update index content, or to add values for a new field.

## Partial indexing with indexers

[Indexers](search-indexer-overview.md) simplify the data refresh task. An indexer can only index one table or view in the external data source. To index multiple tables, the simplest approach is to create a view that joins tables and projects the columns you want to index. 

When using indexers that crawl external data sources, check for a "high water mark" column in the source data. If one exists, you can use it for incremental change detection by picking up just those rows containing new or revised content. For [Azure Blob storage](search-howto-indexing-azure-blob-storage.md#incremental-indexing-and-deletion-detection), a `lastModified` field is used. On [Azure Table storage](search-howto-indexing-azure-tables.md#incremental-indexing-and-deletion-detection), `timestamp` serves the same purpose. Similarly, both [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md#capture-new-changed-and-deleted-rows) and  [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md#indexing-changed-documents) have fields for flagging row updates. 

For more information about indexers, see [Indexer overview](search-indexer-overview.md) and [Reset Indexer REST API](https://docs.microsoft.com/rest/api/searchservice/reset-indexer).

## How to rebuild an index

Plan on frequent, full rebuilds during active development, when index schemas are in a state of flux. For applications already in production, we recommend creating a new index that runs side by side an existing index to avoid query downtime.

Read-write permissions at the service-level are required for index updates. 

You cannot rebuild an index in the portal. Programmatically, you can call [Update Index REST API](https://docs.microsoft.com/rest/api/searchservice/update-index) or [equivalent .NET APIs](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.iindexesoperations.createorupdatewithhttpmessagesasync?view=azure-dotnet) for a full rebuild. An update index request is identical to [Create Index REST API](https://docs.microsoft.com/rest/api/searchservice/create-index), but has a different context.

The following workflow is biased towards the REST API, but applies equally to the .NET SDK.

1. When reusing an index name, [drop the existing index](https://docs.microsoft.com/rest/api/searchservice/delete-index). 

   Any queries targeting that index are immediately dropped. Deleting an index is irreversible, destroying physical storage for the fields collection and other constructs. Make sure you are clear on the implications of deleting an index before you drop it. 

2. Formulate an [Update Index](https://docs.microsoft.com/rest/api/searchservice/update-index) request with your service endpoint, API-key, and an [admin key](https://docs.microsoft.com/azure/search/search-security-api-keys). An admin key is required for write operations.

3. In the body of the request, provide an index schema with the changed or modified field definitions. The request body contains the index schema, as well as constructs for scoring profiles, analyzers, suggesters, and CORS options. Schema requirements are documented in [Create Index](https://docs.microsoft.com/rest/api/searchservice/create-index).

4. Send an [Update Index](https://docs.microsoft.com/rest/api/searchservice/update-index) request to rebuild the physical expression of the index on Azure Search. 

5. [Load the index with documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) from an external source.

When you create the index, physical storage is allocated for each field in the index schema, with an inverted index created for each searchable field. Fields that are not searchable can be used in filters or expressions, but do not have inverted indexes and are not full-text or fuzzy searchable. On an index rebuild, these inverted indexes are deleted and recreated based on the index schema you provide.

When you load the index, each field's inverted index is populated with all of the unique, tokenized words from each document, with a map to corresponding document IDs. For example, when indexing a hotels data set, an inverted index created for a City field might contain terms for Seattle, Portland, and so forth. Documents that include Seattle or Portland in the City field would have their document ID listed alongside the term. On any [Add, Update or Delete](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) operation, the terms and document ID list are updated accordingly.

> [!NOTE]
> If you have stringent SLA requirements, you might consider provisioning a new service specifically for this work, with development and indexing occurring in full isolation from a production index. A separate service runs on its own hardware, eliminating any possibility of resource contention. When development is complete, you would either leave the new index in place, redirecting queries to the new endpoint and index, or you would run finished code to publish a revised index on your original Azure Search service. There is currently no mechanism for moving a ready-to-use index to another service.

## View updates

You can begin querying an index as soon as the first document is loaded. If you know a document's ID, the [Lookup Document REST API](https://docs.microsoft.com/rest/api/searchservice/lookup-document) returns the specific document. For broader testing, you should wait until the index is fully loaded, and then use queries to verify the context you expect to see.

## See also

+ [Indexer overview](search-indexer-overview.md)
+ [Index large data sets at scale](search-howto-large-index.md)
+ [Indexing in the portal](search-import-data-portal.md)
+ [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md)
+ [Azure Blob Storage indexer](search-howto-indexing-azure-blob-storage.md)
+ [Azure Table Storage indexer](search-howto-indexing-azure-tables.md)
+ [Security in Azure Search](search-security-overview.md)