---
title: Data import in Azure Search | Microsoft Docs
description: Learn how to upload data to an index in Azure Search.
author: HeidiSteen
manager: cgronlun
services: search
ms.service: search
ms.topic: conceptual
ms.date: 01/05/2018
ms.author: heidist

---
# Indexing in Azure Search
> [!div class="op_single_selector"]
> * [Overview](search-what-is-data-import.md)
> * [.NET](search-import-data-dotnet.md)
> * [REST](search-import-data-rest-api.md)
> 
> 

In Azure Search, queries execute over your content loaded into a [search index](search-what-is-an-index.md). This article examines the two basic approaches for loading content into an index: *push* your data into the index programmatically, or point an [Azure Search indexer](search-indexer-overview.md) at a supported data source to *pull* in the data.

## Pushing data to an index
The push model, used to programmatically send your data to Azure Search, is the most flexible approach. First, it has no restrictions on data source type. Any dataset composed of JSON documents can be pushed to an Azure Search index, assuming each document in the dataset has fields mapping to fields defined in your index schema. Second, it has no restrictions on frequency of execution. You can push changes to an index as often as you like. For applications having very low latency requirements (for example, if you need search operations to be in sync with dynamic inventory databases), the push model is your only option.

This approach is more flexible than the pull model because you can upload documents individually or in batches (up to 1000 per batch or 16 MB, whichever limit comes first). The push model also allows you to upload documents to Azure Search regardless of where your data is.

### How to push data to an Azure Search index

You can use the following APIs to load single or multiple documents into an index:

+ [Add, Update, or Delete Documents (REST API)](https://docs.microsoft.com/rest/api/searchservice/AddUpdate-or-Delete-Documents)
+ [indexAction class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexaction?view=azure-dotnet) or [indexBatch class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexbatch?view=azure-dotnet) 

There is currently no tool support for pushing data via the portal.

For an introduction to each methodology, see [Import data using REST](search-import-data-rest-api.md) or [Import data using .NET](search-import-data-dotnet.md).


## Pulling data into an index
The pull model crawls a supported data source and automatically uploads the data into your index. In Azure Search, this capability is implemented through *indexers*, currently available for these platforms:

+ [Blob storage](search-howto-indexing-azure-blob-storage.md)
+ [Table storage](search-howto-indexing-azure-tables.md)
+ [Azure Cosmos DB](http://aka.ms/documentdb-search-indexer)
+ [Azure SQL database, and SQL Server on Azure VMs](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)

Indexers connect an index to a data source (usually a table, view, or equivalent structure), and map source fields to equivalent fields in the index. During execution, the rowset is automatically transformed to JSON and loaded into the specified index. All indexers support scheduling so that you can specify how frequently the data is to be refreshed. Most indexers provide change tracking if the data source supports it. By tracking changes and deletes to existing documents in addition to recognizing new documents, indexers remove the need to actively manage the data in your index. 


### How to pull data into an Azure Search index

Indexer functionality is exposed in the [Azure portal](search-import-data-portal.md), the [REST API](/rest/api/searchservice/Indexer-operations), and the [.NET SDK](/dotnet/api/microsoft.azure.search.indexersoperationsextensions). 

An advantage to using the portal is that Azure Search can usually generate a default index schema for you by reading the metadata of the source dataset. You can modify the generated index until the index is processed, after which the only schema edits allowed are those that do not require reindexing. If the changes you want to make impact the schema directly, you would need to rebuild the index. 

## Verify data import with Search explorer

A quick way to perform a preliminary check on the document upload is to use **Search explorer** in the portal. The explorer lets you query an index without having to write any code. The search experience is based on default settings, such as the [simple syntax](/rest/api/searchservice/simple-query-syntax-in-azure-search) and default [searchMode query parameter](/rest/api/searchservice/search-documents). Results are returned in JSON so that you can inspect the entire document.

> [!TIP]
> Numerous [Azure Search code samples](https://github.com/Azure-Samples/?utf8=%E2%9C%93&query=search) include embedded or readily available datasets, offering an easy way to get started. The portal also provides a sample indexer and data source consisting of a small real estate dataset (named "realestate-us-sample"). When you run the preconfigured indexer on the sample data source, an index is created and loaded with documents that can then be queried in Search explorer or by code that you write.

## See also

+ [Indexer overview](search-indexer-overview.md)
+ [Portal walkthrough: create, load, query an index](search-get-started-portal.md)
