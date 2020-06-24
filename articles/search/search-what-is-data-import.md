---
title: Import and data ingestion in search indexes
titleSuffix: Azure Cognitive Search
description: Populate and upload data to an index in Azure Cognitive Search from external data sources.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/18/2020
---
# Data import overview - Azure Cognitive Search

In Azure Cognitive Search, queries execute over your content loaded into and saved in a [search index](search-what-is-an-index.md). This article examines the two basic approaches for populating an index: *push* your data into the index programmatically, or point an [Azure Cognitive Search indexer](search-indexer-overview.md) at a supported data source to *pull* in the data.

With either approach, the objective is to load data from an external data source into an Azure Cognitive Search index. Azure Cognitive Search will let you create an empty index, but until you push or pull data into it, it's not queryable.

> [!NOTE]
> If [AI enrichment](cognitive-search-concept-intro.md) is a solution requirement, you must use the pull model (indexers) to load an index. External processing is supported only through skillsets attached to an indexer.

## Pushing data to an index

The push model, used to programmatically send your data to Azure Cognitive Search, is the most flexible approach. First, it has no restrictions on data source type. Any dataset composed of JSON documents can be pushed to an Azure Cognitive Search index, assuming each document in the dataset has fields mapping to fields defined in your index schema. Second, it has no restrictions on frequency of execution. You can push changes to an index as often as you like. For applications having very low latency requirements (for example, if you need search operations to be in sync with dynamic inventory databases), the push model is your only option.

This approach is more flexible than the pull model because you can upload documents individually or in batches (up to 1000 per batch or 16 MB, whichever limit comes first). The push model also allows you to upload documents to Azure Cognitive Search regardless of where your data is.

### How to push data to an Azure Cognitive Search index

You can use the following APIs to load single or multiple documents into an index:

+ [Add, Update, or Delete Documents (REST API)](https://docs.microsoft.com/rest/api/searchservice/AddUpdate-or-Delete-Documents)
+ [indexAction class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexaction?view=azure-dotnet) or [indexBatch class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexbatch?view=azure-dotnet) 

There is currently no tool support for pushing data via the portal.

For an introduction to each methodology, see [Quickstart: Create an Azure Cognitive Search index using PowerShell](search-create-index-rest-api.md) or [C# Quickstart: Create an Azure Cognitive Search index using .NET SDK](search-get-started-dotnet.md).

<a name="indexing-actions"></a>

### Indexing actions: upload, merge, mergeOrUpload, delete

You can control the type of indexing action on a per-document basis, specifying whether the document should be uploaded in full, merged with existing document content, or deleted.

In the REST API, issue HTTP POST requests with JSON request bodies to your Azure Cognitive Search index's endpoint URL. Each JSON object in the "value" array contains the document's key and specifies whether an indexing action adds, updates, or deletes document content. For a code example, see [Load documents](search-get-started-dotnet.md#load-documents).

In the .NET SDK, package up your data into an `IndexBatch` object. An `IndexBatch` encapsulates a collection of `IndexAction` objects, each of which contains a document and a property that tells Azure Cognitive Search what action to perform on that document. For a code example, see the [C# Quickstart](search-get-started-dotnet.md).


| @search.action | Description | Necessary fields for each document | Notes |
| -------------- | ----------- | ---------------------------------- | ----- |
| `upload` |An `upload` action is similar to an "upsert" where the document will be inserted if it is new and updated/replaced if it exists. |key, plus any other fields you wish to define |When updating/replacing an existing document, any field that is not specified in the request will have its field set to `null`. This occurs even when the field was previously set to a non-null value. |
| `merge` |Updates an existing document with the specified fields. If the document does not exist in the index, the merge will fail. |key, plus any other fields you wish to define |Any field you specify in a merge will replace the existing field in the document. In the .NET SDK, this includes fields of type `DataType.Collection(DataType.String)`. In the REST API, this includes fields of type `Collection(Edm.String)`. For example, if the document contains a field `tags` with value `["budget"]` and you execute a merge with value `["economy", "pool"]` for `tags`, the final value of the `tags` field will be `["economy", "pool"]`. It will not be `["budget", "economy", "pool"]`. |
| `mergeOrUpload` |This action behaves like `merge` if a document with the given key already exists in the index. If the document does not exist, it behaves like `upload` with a new document. |key, plus any other fields you wish to define |- |
| `delete` |Removes the specified document from the index. |key only |Any fields you specify other than the key field will be ignored. If you want to remove an individual field from a document, use `merge` instead and simply set the field explicitly to null. |

### Formulate your query

There are two ways to [search your index using the REST API](https://docs.microsoft.com/rest/api/searchservice/Search-Documents). One way is to issue an HTTP POST request where your query parameters are defined in a JSON object in the request body. The other way is to issue an HTTP GET request where your query parameters are defined within the request URL. POST has more [relaxed limits](https://docs.microsoft.com/rest/api/searchservice/Search-Documents) on the size of query parameters than GET. For this reason, we recommend using POST unless you have special circumstances where using GET would be more convenient.

For both POST and GET, you need to provide your *service name*, *index name*, and the proper *API version* (the current API version is `2019-05-06` at the time of publishing this document) in the request URL. For GET, the *query string* at the end of the URL is where you provide the query parameters. See below for the URL format:

    https://[service name].search.windows.net/indexes/[index name]/docs?[query string]&api-version=2019-05-06

The format for POST is the same, but with only api-version in the query string parameters.

## Pulling data into an index

The pull model crawls a supported data source and automatically uploads the data into your index. In Azure Cognitive Search, this capability is implemented through *indexers*, currently available for these platforms:

+ [Blob storage](search-howto-indexing-azure-blob-storage.md)
+ [Table storage](search-howto-indexing-azure-tables.md)
+ [Azure Cosmos DB](search-howto-index-cosmosdb.md)
+ [Azure SQL Database, SQL Managed Instance, and SQL Server on Azure VMs](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)

Indexers connect an index to a data source (usually a table, view, or equivalent structure), and map source fields to equivalent fields in the index. During execution, the rowset is automatically transformed to JSON and loaded into the specified index. All indexers support scheduling so that you can specify how frequently the data is to be refreshed. Most indexers provide change tracking if the data source supports it. By tracking changes and deletes to existing documents in addition to recognizing new documents, indexers remove the need to actively manage the data in your index. 


### How to pull data into an Azure Cognitive Search index

Indexer functionality is exposed in the [Azure portal](search-import-data-portal.md), the [REST API](/rest/api/searchservice/Indexer-operations), and the [.NET SDK](/dotnet/api/microsoft.azure.search.indexersoperationsextensions). 

An advantage to using the portal is that Azure Cognitive Search can usually generate a default index schema for you by reading the metadata of the source dataset. You can modify the generated index until the index is processed, after which the only schema edits allowed are those that do not require reindexing. If the changes you want to make impact the schema directly, you would need to rebuild the index. 

## Verify data import with Search explorer

A quick way to perform a preliminary check on the document upload is to use **Search explorer** in the portal. The explorer lets you query an index without having to write any code. The search experience is based on default settings, such as the [simple syntax](/rest/api/searchservice/simple-query-syntax-in-azure-search) and default [searchMode query parameter](/rest/api/searchservice/search-documents). Results are returned in JSON so that you can inspect the entire document.

> [!TIP]
> Numerous [Azure Cognitive Search code samples](https://github.com/Azure-Samples/?utf8=%E2%9C%93&query=search) include embedded or readily available datasets, offering an easy way to get started. The portal also provides a sample indexer and data source consisting of a small real estate dataset (named "realestate-us-sample"). When you run the preconfigured indexer on the sample data source, an index is created and loaded with documents that can then be queried in Search explorer or by code that you write.

## See also

+ [Indexer overview](search-indexer-overview.md)
+ [Portal walkthrough: create, load, query an index](search-get-started-portal.md)
