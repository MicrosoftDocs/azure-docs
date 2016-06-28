<properties
    pageTitle="Data upload in Azure Search | Microsoft Azure | Hosted cloud search service"
    description="Learn how to upload data to an index in Azure Search."
    services="search"
    documentationCenter=""
    authors="ashmaka"
    manager=""
    editor=""
    tags=""/>

<tags
    ms.service="search"
    ms.devlang="NA"
    ms.workload="search"
    ms.topic="get-started-article"
    ms.tgt_pltfrm="na"
    ms.date="05/31/2016"
    ms.author="ashmaka"/>

# Upload data to Azure Search
> [AZURE.SELECTOR]
- [Overview](search-what-is-data-import.md)
- [.NET](search-import-data-dotnet.md)
- [REST](search-import-data-rest-api.md)


## Data upload models in Azure search
There are two ways to populate your Azure Search index with your data. The first option is manually pushing your data into the index using the Azure Search [REST API](search-import-data-rest-api.md) or [.NET SDK](search-import-data-dotnet.md). The second option is to [point a supported data source](search-indexer-overview.md) to your Azure Search index and let Azure Search automatically pull your data into the search service.

This guide will only cover instructions on using the push model of data upload (which is supported only in the [REST API](search-import-data-rest-api.md) and [.NET SDK](search-import-data-dotnet.md)), but you can still learn more about the pull model below.

### Push data to an index

This approach refers to programmatically sending your data to Azure Search to make it available for searching. For applications having very low latency requirements (e.g. if you need search operations to be in sync with dynamic inventory databases), the push model is your only option.

You can use the [REST API](https://msdn.microsoft.com/library/azure/dn798930.aspx) or [.NET SDK](search-import-data-dotnet.md) to push data to an index. There is currently no tool support for pushing data via the portal.

This approach is more flexible than the pull model because you can upload documents individually or in batches (up to 1000 per batch or 16 MB, whichever limit comes first). The push model also allows you to upload documents to Azure Search regardless of where your data is.

### Pull data into an index

The pull model crawls a supported data source and automatically uploads the data into you Azure Search index for you. By tracking changes and deletes to existing documents in addition to recognizing new documents, indexers remove the need to actively manage the data in your index.

In Azure Search, this capability is implemented through *indexers*, currently available for [Blob storage (preview)](search-howto-indexing-azure-blob-storage.md), [DocumentDB](http://aka.ms/documentdb-search-indexer), [Azure SQL database, and SQL Server on Azure VMs](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md).

The indexer functionality is exposed in the [Azure Portal](search-import-data-portal.md) as well as in the [REST API](https://msdn.microsoft.com/library/azure/dn946891.aspx).
