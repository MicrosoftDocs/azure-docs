---
title: Rebuild a search index
titleSuffix: Azure Cognitive Search
description: Add new elements, update existing elements or documents, or delete obsolete documents in a full rebuild or partial indexing to refresh an Azure Cognitive Search index.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 02/14/2020
---

# How to rebuild an index in Azure Cognitive Search

This article explains how to rebuild an Azure Cognitive Search index, the circumstances under which rebuilds are required, and recommendations for mitigating the impact of rebuilds on ongoing query requests.

A *rebuild* refers to dropping and recreating the physical data structures associated with an index, including all field-based inverted indexes. In Azure Cognitive Search, you cannot drop and recreate individual fields. To rebuild an index, all field storage must be deleted, recreated based on an existing or revised index schema, and then repopulated with data pushed to the index or pulled from external sources. 

It's common to rebuild indexes during development, but you might also need to rebuild a production-level index to accommodate structural changes, such as adding complex types or adding fields to suggesters.

## Rebuild conditions

Drop and recreate an index if any of the following conditions are true. 

| Condition | Description |
|-----------|-------------|
| Change a field definition | Revising a field name, data type, or specific [index attributes](https://docs.microsoft.com/rest/api/searchservice/create-index) (searchable, filterable, sortable, facetable) requires a full rebuild. |
| Assign an analyzer to a field | [Analyzers](search-analyzers.md) are defined in an index and then assigned to fields. You can add a new analyzer definition to an index at any time, but you can only *assign* an analyzer when the field is created. This is true for both the **analyzer** and **indexAnalyzer** properties. The **searchAnalyzer** property is an exception (you can assign this property to an existing field). |
| Update or delete an analyzer definition in an index | You cannot delete or change an existing analyzer configuration (analyzer, tokenizer, token filter, or char filter) in the index unless you rebuild the entire index. |
| Add a field to a suggester | If a field already exists and you want to add it to a [Suggesters](index-add-suggesters.md) construct, you must rebuild the index. |
| Delete a field | To physically remove all traces of a field, you have to rebuild the index. When an immediate rebuild is not practical, you can modify application code to disable access to the "deleted" field or use the [$select query parameter](search-query-odata-select.md) to choose which fields are represented in the result set. Physically, the field definition and contents remain in the index until the next rebuild, when you apply a schema that omits the field in question. |
| Switch tiers | If you require more capacity, there is no in-place upgrade in the Azure portal. A new service must be created, and indexes must be built from scratch on the new service. To help automate this process, you can use the **index-backup-restore** sample code in this [Azure Cognitive Search .NET sample repo](https://github.com/Azure-Samples/azure-search-dotnet-samples). This app will back up your index to a series of JSON files, and then recreate the index in a search service you specify.|

## Update conditions

Many other modifications can be made without impacting existing physical structures. Specifically, the following changes do *not* require an index rebuild. For these changes, you can [update an index definition](https://docs.microsoft.com/rest/api/searchservice/update-index) with your changes.

+ Add a new field
+ Set the **retrievable** attribute on an existing field
+ Set a **searchAnalyzer** on an existing field
+ Add a new analyzer definition in an index
+ Add, update, or delete scoring profiles
+ Add, update, or delete CORS settings
+ Add, update, or delete synonymMaps

When you add a new field, existing indexed documents are given a null value for the new field. On a future data refresh, values from external source data replace the nulls added by Azure Cognitive Search. For more information on updating index content, see [Add, Update or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents).

## How to rebuild an index

During development, the index schema changes frequently. You can plan for it by creating indexes that can be deleted, recreated, and reloaded quickly with a small representative data set.

For applications already in production, we recommend creating a new index that runs side by side an existing index to avoid query downtime. Your application code provides redirection to the new index.

Indexing does not run in the background and the service will balance the additional indexing against ongoing queries. During indexing, you can [monitor query requests](search-monitor-queries.md) in the portal to ensure queries are completing in a timely manner.

1. Determine whether a rebuild is required. If you are just adding fields, or changing some part of the index that is unrelated to fields, you might be able to simply [update the definition](https://docs.microsoft.com/rest/api/searchservice/update-index) without deleting, recreating, and fully reloading it.

1. [Get an index definition](https://docs.microsoft.com/rest/api/searchservice/get-index) in case you need it for future reference.

1. [Drop the existing index](https://docs.microsoft.com/rest/api/searchservice/delete-index), assuming you are not running new and old indexes side by side. 

   Any queries targeting that index are immediately dropped. Remember that deleting an index is irreversible, destroying physical storage for the fields collection and other constructs. Pause to think about the implications before dropping it. 

1. [Create a revised index](https://docs.microsoft.com/rest/api/searchservice/create-index), where the body of the request includes changed or modified field definitions.

1. [Load the index with documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) from an external source.

When you create the index, physical storage is allocated for each field in the index schema, with an inverted index created for each searchable field. Fields that are not searchable can be used in filters or expressions, but do not have inverted indexes and are not full-text or fuzzy searchable. On an index rebuild, these inverted indexes are deleted and recreated based on the index schema you provide.

When you load the index, each field's inverted index is populated with all of the unique, tokenized words from each document, with a map to corresponding document IDs. For example, when indexing a hotels data set, an inverted index created for a City field might contain terms for Seattle, Portland, and so forth. Documents that include Seattle or Portland in the City field would have their document ID listed alongside the term. On any [Add, Update or Delete](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents) operation, the terms and document ID list are updated accordingly.

> [!NOTE]
> If you have stringent SLA requirements, you might consider provisioning a new service specifically for this work, with development and indexing occurring in full isolation from a production index. A separate service runs on its own hardware, eliminating any possibility of resource contention. When development is complete, you would either leave the new index in place, redirecting queries to the new endpoint and index, or you would run finished code to publish a revised index on your original Azure Cognitive Search service. There is currently no mechanism for moving a ready-to-use index to another service.

## Check for updates

You can begin querying an index as soon as the first document is loaded. If you know a document's ID, the [Lookup Document REST API](https://docs.microsoft.com/rest/api/searchservice/lookup-document) returns the specific document. For broader testing, you should wait until the index is fully loaded, and then use queries to verify the context you expect to see.

You can use [Search Explorer](search-explorer.md) or a Web testing tool like [Postman](search-get-started-postman.md) to check for updated content.

If you added or renamed a field, use [$select](search-query-odata-select.md) to return that field: `search=*&$select=document-id,my-new-field,some-old-field&$count=true`

## See also

+ [Indexer overview](search-indexer-overview.md)
+ [Index large data sets at scale](search-howto-large-index.md)
+ [Indexing in the portal](search-import-data-portal.md)
+ [Azure SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [Azure Cosmos DB indexer](search-howto-index-cosmosdb.md)
+ [Azure Blob Storage indexer](search-howto-indexing-azure-blob-storage.md)
+ [Azure Table Storage indexer](search-howto-indexing-azure-tables.md)
+ [Security in Azure Cognitive Search](search-security-overview.md)