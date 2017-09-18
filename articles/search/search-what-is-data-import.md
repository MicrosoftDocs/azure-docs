---
title: Data upload in Azure Search | Microsoft Docs
description: Learn how to upload data to an index in Azure Search.
services: search
documentationcenter: ''
author: ashmaka
manager: jhubbard
editor: ''
tags: ''

ms.assetid: aa8d47c1-4ae6-4209-a8ce-48d5a9474707
ms.service: search
ms.devlang: NA
ms.workload: search
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.date: 05/01/2017
ms.author: ashmaka

---
# Upload data to Azure Search
> [!div class="op_single_selector"]
> * [Overview](search-what-is-data-import.md)
> * [.NET](search-import-data-dotnet.md)
> * [REST](search-import-data-rest-api.md)
> 
> 

There are two ways to populate an index with your data. The first option is manually pushing your data into the index using the Azure Search [REST API](search-import-data-rest-api.md) or [.NET SDK](search-import-data-dotnet.md). The second option is to [point a supported data source](search-indexer-overview.md) to your index and let Azure Search automatically pull in the data.

## Push data to an index
This approach refers to programmatically sending your data to Azure Search to make it available for searching. For applications having very low latency requirements (for example, if you need search operations to be in sync with dynamic inventory databases), the push model is your only option.

You can use the [REST API](https://docs.microsoft.com/rest/api/searchservice/AddUpdate-or-Delete-Documents) or [.NET SDK](search-import-data-dotnet.md) to push data to an index. There is currently no tool support for pushing data via the portal.

This approach is more flexible than the pull model because you can upload documents individually or in batches (up to 1000 per batch or 16 MB, whichever limit comes first). The push model also allows you to upload documents to Azure Search regardless of where your data is.

The data format understood by Azure Search is JSON, and all documents in the dataset must have fields that map to fields defined in your index schema. 

## Pull data into an index
The pull model crawls a supported data source and automatically uploads the data into your index. In Azure Search, this capability is implemented through *indexers*, currently available for [Blob storage](search-howto-indexing-azure-blob-storage.md), [Table storage](search-howto-indexing-azure-tables.md), [Azure Cosmos DB](http://aka.ms/documentdb-search-indexer), [Azure SQL database, and SQL Server on Azure VMs](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md). 

Indexers connect an index to a data source (usually a table, view, or equivalent structure), and map source fields to equivalent fields in the index. During execution, the rowset is automatically transformed to JSON and loaded into the specified index. All indexers support scheduling so that you can specify how frequently the data is to be refreshed. Most indexers provide change tracking if the data source supports it. By tracking changes and deletes to existing documents in addition to recognizing new documents, indexers remove the need to actively manage the data in your index. 

Indexer functionality is exposed in the [Azure portal](search-import-data-portal.md), the [REST API](/rest/api/searchservice/Indexer-operations), and the [.NET SDK](/dotnet/api/microsoft.azure.search.indexersoperations). 

An advantage to using the portal is that Azure Search can usually generate a default index schema for you by reading the metadata of the source dataset. You can modify the generated index until the index is processed, after which the only schema edits allowed are those that do not require reindexing. If the changes you want to make impact the schema directly, you would need to rebuild the index. 

After the index is populated, you can use **Search Explorer** in the portal command bar as a verification step.

## Query an index using Search Explorer

A quick way to perform a preliminary check on the document upload is to use **Search Explorer** in the portal. The explorer lets you query an index without having to write any code. The search experience is based on default settings, such as the [simple syntax](/rest/api/searchservice/simple-query-syntax-in-azure-search) and default [searchMode query parameter](/rest/api/searchservice/search-documents). Results are returned in JSON so that you can inspect the entire document.

> [!TIP]
> Numerous [Azure Search code samples](https://github.com/Azure-Samples/?utf8=%E2%9C%93&query=search) include embedded or readily available datasets, offering an easy way to get started. The portal also provides a sample indexer and data source consisting of a small real estate dataset (named "realestate-us-sample"). When you run the preconfigured indexer on the sample data source, an index is created and loaded with documents that can then be queried in Search Explorer or by code that you write.