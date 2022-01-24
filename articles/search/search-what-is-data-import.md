---
title: Import and data ingestion in search indexes
titleSuffix: Azure Cognitive Search
description: Populate and upload data to an index in Azure Cognitive Search from external data sources.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 12/07/2021
---
# Data import overview - Azure Cognitive Search

In Azure Cognitive Search, queries execute over user-owned content that's loaded into a [search index](search-what-is-an-index.md). This article describes the two basic workflows for populating an index: *push* your data into the index programmatically, or point an [Azure Cognitive Search indexer](search-indexer-overview.md) at a supported data source to *pull* in the data.

With either approach, the objective is to load data from an external data source into an Azure Cognitive Search index. Azure Cognitive Search will let you create an empty index, but until you push or pull data into it, it's not queryable.

> [!NOTE]
> If [AI enrichment](cognitive-search-concept-intro.md) is a solution requirement, you must use the pull model (indexers) to load an index. External processing is supported only through skillsets attached to an indexer.

## Pushing data to an index

The push model, used to programmatically send your data to Azure Cognitive Search, is the most flexible approach. First, it has no restrictions on data source type. Any dataset composed of JSON documents can be pushed to an Azure Cognitive Search index, assuming each document in the dataset has fields mapping to fields defined in your index schema. Second, it has no restrictions on frequency of execution. You can push changes to an index as often as you like. For applications having very low latency requirements (for example, if you need search operations to be in sync with dynamic inventory databases), the push model is your only option.

This approach is more flexible than the pull model because you can upload documents individually or in batches (up to 1000 per batch or 16 MB, whichever limit comes first). The push model also allows you to upload documents to Azure Cognitive Search regardless of where your data is.

### How to push data to an Azure Cognitive Search index

You can use the following APIs to load single or multiple documents into an index:

+ [Add, Update, or Delete Documents (REST API)](/rest/api/searchservice/AddUpdate-or-Delete-Documents)
+ [IndexDocumentsAction class (Azure SDK for .NET)](/dotnet/api/azure.search.documents.models.indexdocumentsaction) or [IndexDocumentsBatch class](/dotnet/api/azure.search.documents.models.indexdocumentsbatch) 

There is currently no tool support for pushing data via the portal.

For an introduction to the push APIs, see:

+ [C# Tutorial: Optimize indexing with the push API](tutorial-optimize-indexing-push-api.md)
+ [C# Quickstart: Create an Azure Cognitive Search index using .NET SDK](search-get-started-dotnet.md)
+ [REST Quickstart: Create an Azure Cognitive Search index using PowerShell](./search-get-started-powershell.md)

<a name="indexing-actions"></a>

### Indexing actions: upload, merge, mergeOrUpload, delete

You can control the type of indexing action on a per-document basis, specifying whether the document should be uploaded in full, merged with existing document content, or deleted.

Whether you use the REST API or an SDK, the following document operations are supported for data import:

+ **Upload**, similar to an "upsert" where the document is inserted if it is new, and updated or replaced if it exists. If the document is missing values that the index requires, the document field's value is set to null.

+ **merge** updates a document that already exists and will fail if the document cannot be found. Any field you specify in a merge will replace the existing field value in the index. Be sure to check for collection fields that contain multiple values, such as fields of type `Collection(Edm.String)`. For example, if `tags` fields starts with a value of `["budget"]` and you execute a merge with value `["economy", "pool"]`, the final value of the `tags` field will be `["economy", "pool"]`. It will not be `["budget", "economy", "pool"]`.

+ **mergeOrUpload** behaves like **merge** if a document with the given key already exists in the index, and **upload** if the document is new.

+ **delete** removes the entire document from the index. If you want to remove an individual field from a document, use **merge** instead, setting the field in question to null.

## Pulling data into an index

The pull model crawls a supported data source and automatically uploads the data into your index. In Azure Cognitive Search, this capability is implemented through *indexers*, currently available for these platforms:

+ [Azure Blob storage](search-howto-indexing-azure-blob-storage.md)
+ [Azure Table storage](search-howto-indexing-azure-tables.md)
+ [Azure Data Lake Storage Gen2](search-howto-index-azure-data-lake-storage.md)
+ [Azure Files (preview)](search-file-storage-integration.md)
+ [Azure Cosmos DB](search-howto-index-cosmosdb.md)
+ [Azure SQL Database, SQL Managed Instance, and SQL Server on Azure VMs](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
+ [SharePoint in Microsoft 365 (preview)](search-howto-index-sharepoint-online.md)
+ [Power Query data connectors (preview)](search-how-to-index-power-query-data-sources.md)

Indexers connect an index to a data source (usually a table, view, or equivalent structure), and map source fields to equivalent fields in the index. During execution, the rowset is automatically transformed to JSON and loaded into the specified index. All indexers support scheduling so that you can specify how frequently the data is to be refreshed. Most indexers provide change tracking if the data source supports it. By tracking changes and deletes to existing documents in addition to recognizing new documents, indexers remove the need to actively manage the data in your index.

### How to pull data into an Azure Cognitive Search index

Indexer functionality is exposed in the [Azure portal](search-import-data-portal.md), the [REST API](/rest/api/searchservice/Indexer-operations), and the [.NET SDK](/dotnet/api/azure.search.documents.indexes.searchindexerclient).

An advantage to using the portal is that Azure Cognitive Search can usually generate a default index schema for you by reading the metadata of the source dataset. You can modify the generated index until the index is processed, after which the only schema edits allowed are those that do not require reindexing. If the changes you want to make impact the schema directly, you would need to rebuild the index. 

## Verify data import with Search explorer

A quick way to perform a preliminary check on the document upload is to use [**Search explorer**](search-explorer.md) in the portal.

:::image type="content" source="media/search-explorer/search-explorer-cmd2.png" alt-text="Screenshot of Search Explorer command in the Azure portal." border="true":::

The explorer lets you query an index without having to write any code. The search experience is based on default settings, such as the [simple syntax](/rest/api/searchservice/simple-query-syntax-in-azure-search) and default [searchMode query parameter](/rest/api/searchservice/search-documents). Results are returned in JSON so that you can inspect the entire document.

Here is an example query that you can run in Search Explorer. The "HotelId" is the document key of the hotels-sample-index. The filter provides the document ID of a specific document:

```http
$filter=HotelId eq '50'
```

If you're using REST, this [Look up query](search-query-simple-examples.md#example-2-look-up-by-id) achieves the same purpose.

## See also

+ [Indexer overview](search-indexer-overview.md)
+ [Portal quickstart: create, load, query an index](search-get-started-portal.md)
