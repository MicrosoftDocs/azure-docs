---
title: Indexers in Azure Search | Microsoft Docs
description: Crawl Azure SQL database, Azure Cosmos DB, or Azure storage to extract searchable data and populate an Azure Search index.
author: HeidiSteen
manager: cgronlun
services: search
ms.service: search
ms.devlang: na
ms.topic: conceptual
ms.date: 10/17/2017
ms.author: heidist
---

# Indexers in Azure Search

An *indexer* in Azure Search is a crawler that extracts searchable data and metadata from an external Azure data source and populates an index based on field-to-field mappings between the index and your data source. This approach is sometimes referred to as a 'pull model' because the service pulls data in without you having to write any code that pushes data to an index.

Indexers are based on data source types or platforms, with individual indexers for SQL Server on Azure, Cosmos DB, Azure Table Storage and Blob Storage, and so forth.

You can use an indexer as the sole means for data ingestion, or use a combination of techniques that include the use of an indexer for loading just some of the fields in your index.

You can run indexers on demand or on a recurring data refresh schedule that runs as often as every fifteen minutes. More frequent updates require a push model that simultaneously updates data in both Azure Search and your external data source.

## Approaches for creating and managing indexers

You can create and manage indexers using these approaches:

* [Portal > Import Data Wizard ](search-import-data-portal.md)
* [Service REST API](https://docs.microsoft.com/rest/api/searchservice/Indexer-operations)
* [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.iindexersoperations)

Initially, a new indexer is announced as a preview feature. Preview features are introduced in APIs (REST and .NET) and then integrated into the portal after graduating to general availability. If you're evaluating a new indexer, you should plan on writing code.


<a name="supported-data-sources"></a>

## Supported data sources

Indexers crawl data stores on Azure.

* [Azure SQL](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
* [Azure Cosmos DB](search-howto-index-cosmosdb.md)
* [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md)
* [Azure Table Storage](search-howto-indexing-azure-tables.md)


## Basic configuration steps
Indexers can offer features that are unique to the data source. In this respect, some aspects of indexer or data source configuration will vary by indexer type. However, all indexers share the same basic composition and requirements. Steps that are common to all indexers are covered below.

### Step 1: Create a data source
An indexer pulls data from a *data source* which holds information such as a connection string and possibly credentials. Call the [Create Datasource](https://docs.microsoft.com/rest/api/searchservice/create-data-source) REST API or [DataSource class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.datasource) to create the resource.

Data sources are configured and managed independently of the indexers that use them, which means a data source can be used by multiple indexers to load more than one index at a time.

### Step 2: Create an index
An indexer will automate some tasks related to data ingestion, but creating an index is generally not one of them. As a prerequisite, you must have a predefined index with fields that match those in your external data source. For more information about structuring an index, see [Create an Index (Azure Search REST API)](https://docs.microsoft.com/rest/api/searchservice/Create-Index) or [Index class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.index). For help with field associations, see [Field mappings in Azure Search indexers](search-indexer-field-mappings.md).

> [!Tip]
> Although indexers cannot generate an index for you, the **Import data** wizard in the portal can help. In most cases, the wizard can infer an index schema from existing metadata in the source, presenting a preliminary index schema which you can edit in-line while the wizard is active. Once the index is created on the service, further edits in the portal are mostly limited to adding new fields. Consider the wizard for creating, but not revising, an index. For hands-on learning, step through the [portal walkthrough](search-get-started-portal.md).

### Step 3: Create and schedule the indexer
The indexer definition is a construct specifying the index, data source, and a schedule. An indexer can reference a data source from another service, as long as that data source is from the same subscription. For more information about structuring an indexer, see [Create Indexer (Azure Search REST API)](https://docs.microsoft.com/rest/api/searchservice/Create-Indexer).

## Next steps
Now that you have the basic idea, the next step is to review requirements and tasks specific to each data source type.

* [Azure SQL Database or SQL Server on an Azure virtual machine](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
* [Azure Cosmos DB](search-howto-index-cosmosdb.md)
* [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md)
* [Azure Table Storage](search-howto-indexing-azure-tables.md)
* [Indexing CSV blobs using the Azure Search Blob indexer](search-howto-index-csv-blobs.md)
* [Indexing JSON blobs with Azure Search Blob indexer](search-howto-index-json-blobs.md)
