---
title: Load a search index
titleSuffix: Azure Cognitive Search
description: Import and refresh data in a search index using the portal, REST APIs, or an Azure SDK.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 01/10/2022
---

# Load data into a search index in Azure Cognitive Search

This article explains how to import and refresh content in a predefined search index. In Azure Cognitive Search, a [search index is created first](search-how-to-create-search-index.md), with data import following as a second step. The exception is Import Data wizard, which creates and loads an index in one workflow.

A search service imports and indexes text in JSON, used in full text search or knowledge mining scenarios. Text content is obtainable from verbatim content in fields in the external data source, metadata that's useful in search, or enriched content created by a skillset. Skills can extract or infer textual descriptions from images and unstructured content.

Once data is indexed, the physical data structures of the index are locked in. For guidance on what can and cannot be changed, see [Drop and rebuild an index](search-howto-reindex.md).

Indexing is not a background process. A search service will balance indexing and query workloads, but if [query latency is too high](search-performance-analysis.md#impact-of-indexing-on-queries), you can either [add capacity](search-capacity-planning.md#add-or-reduce-replicas-and-partitions) or identify periods of low query activity for loading an index.

## Push JSON documents

A search service accepts JSON documents that conform to the index schema.

You can prepare these documents yourself, but if content resides in a [supported data source](search-indexer-overview.md#supported-data-sources), an [indexer](earch-indexer-overview.md) can automate the process of document retrieval, JSON serialization, and indexing.

### [**Azure portal**](#tab/import-portal)

Using Azure portal, the sole means for loading an index is the [Import Data wizard](search-import-data-portal.md).

### [**REST**](#tab/import-rest)

[Add, Update or Delete Documents (REST)](/rest/api/searchservice/addupdate-or-delete-documents) is the means by which you can import data into a search index.

### [**.NET SDK (C#)**](#tab/importcsharp)

Azure Cognitive Search supports the following APIs to load single or multiple documents into an index:

+ [Add, Update, or Delete Documents (REST API)](/rest/api/searchservice/AddUpdate-or-Delete-Documents)
+ [IndexDocumentsAction class](/dotnet/api/azure.search.documents.models.indexdocumentsaction) or [IndexDocumentsBatch class](/dotnet/api/azure.search.documents.models.indexdocumentsbatch)

[**Tutorial: Index any data**](tutorial-optimize-indexing-push-api.md) explains the steps.

---

## Batch indexing

TBD

## Delete orphan documents

TBD

## See also

+ [Indexer overview](search-indexer-overview.md)
+ [Portal quickstart: create, load, query an index](search-get-started-portal.md)