---
title: Indexers for crawling data during import
titleSuffix: Azure Cognitive Search
description: Crawl Azure SQL Database, SQL Managed Instance, Azure Cosmos DB, or Azure storage to extract searchable data and populate an Azure Cognitive Search index.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
ms.custom: fasttrack-edit
---

# Indexers in Azure Cognitive Search

An *indexer* in Azure Cognitive Search is a crawler that extracts searchable data and metadata from an external Azure data source and populates an index based on field-to-field mappings between the index and your data source. This approach is sometimes referred to as a 'pull model' because the service pulls data in without you having to write any code that adds data to an index.

Indexers are based on data source types or platforms, with individual indexers for SQL Server on Azure, Cosmos DB, Azure Table Storage and Blob Storage. Blob storage indexers have additional properties specific to blob content types.

You can use an indexer as the sole means for data ingestion, or use a combination of techniques that include the use of an indexer for loading just some of the fields in your index.

You can run indexers on demand or on a recurring data refresh schedule that runs as often as every five minutes. More frequent updates require a push model that simultaneously updates data in both Azure Cognitive Search and your external data source.

## Approaches for creating and managing indexers

You can create and manage indexers using these approaches:

* [Portal > Import Data Wizard](search-import-data-portal.md)
* [Service REST API](https://docs.microsoft.com/rest/api/searchservice/Indexer-operations)
* [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.iindexersoperations)

Initially, a new indexer is announced as a preview feature. Preview features are introduced in APIs (REST and .NET) and then integrated into the portal after graduating to general availability. If you're evaluating a new indexer, you should plan on writing code.

## Permissions

All operations related to indexers, including GET requests for status or definitions, require an [admin api-key](search-security-api-keys.md). 

<a name="supported-data-sources"></a>

## Supported data sources

Indexers crawl data stores on Azure.

* [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md)
* [Azure Data Lake Storage Gen2](search-howto-index-azure-data-lake-storage.md) (in preview)
* [Azure Table Storage](search-howto-indexing-azure-tables.md)
* [Azure Cosmos DB](search-howto-index-cosmosdb.md)
* [Azure SQL Database and SQL Managed Instance](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
* [SQL Server on Azure Virtual Machines](search-howto-connecting-azure-sql-iaas-to-azure-search-using-indexers.md)
* [SQL Managed Instance](search-howto-connecting-azure-sql-mi-to-azure-search-using-indexers.md)

## Basic configuration steps
Indexers can offer features that are unique to the data source. In this respect, some aspects of indexer or data source configuration will vary by indexer type. However, all indexers share the same basic composition and requirements. Steps that are common to all indexers are covered below.

### Step 1: Create a data source
An indexer obtains data source connection from a *data source* object. The data source definition provides a connection string and possibly credentials. Call the [Create Datasource](https://docs.microsoft.com/rest/api/searchservice/create-data-source) REST API or [DataSource class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.datasource) to create the resource.

Data sources are configured and managed independently of the indexers that use them, which means a data source can be used by multiple indexers to load more than one index at a time.

### Step 2: Create an index
An indexer will automate some tasks related to data ingestion, but creating an index is generally not one of them. As a prerequisite, you must have a predefined index with fields that match those in your external data source. Fields need to match by name and data type. For more information about structuring an index, see [Create an Index (Azure Cognitive Search REST API)](https://docs.microsoft.com/rest/api/searchservice/Create-Index) or [Index class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.index). For help with field associations, see [Field mappings in Azure Cognitive Search indexers](search-indexer-field-mappings.md).

> [!Tip]
> Although indexers cannot generate an index for you, the **Import data** wizard in the portal can help. In most cases, the wizard can infer an index schema from existing metadata in the source, presenting a preliminary index schema which you can edit in-line while the wizard is active. Once the index is created on the service, further edits in the portal are mostly limited to adding new fields. Consider the wizard for creating, but not revising, an index. For hands-on learning, step through the [portal walkthrough](search-get-started-portal.md).

### Step 3: Create and schedule the indexer
The indexer definition is a construct that brings together all of the elements related to data ingestion. Required elements include a data source and index. Optional elements include a schedule and field mappings. Field mapping are only optional if source fields and index fields clearly correspond. For more information about structuring an indexer, see [Create Indexer (Azure Cognitive Search REST API)](https://docs.microsoft.com/rest/api/searchservice/Create-Indexer).

<a id="RunIndexer"></a>

## Run indexers on-demand

While it's common to schedule indexing, an indexer can also be invoked on demand using the [Run command](https://docs.microsoft.com/rest/api/searchservice/run-indexer):

    POST https://[service name].search.windows.net/indexers/[indexer name]/run?api-version=2020-06-30
    api-key: [Search service admin key]

> [!NOTE]
> When Run API returns successfully, the indexer invocation has been scheduled, but the actual processing happens asynchronously. 

You can monitor the indexer status in the portal or through Get Indexer Status API. 

<a name="GetIndexerStatus"></a>

## Get indexer status

You can retrieve the status and execution history of an indexer through the [Get Indexer Status command](https://docs.microsoft.com/rest/api/searchservice/get-indexer-status):


    GET https://[service name].search.windows.net/indexers/[indexer name]/status?api-version=2020-06-30
    api-key: [Search service admin key]

The response contains overall indexer status, the last (or in-progress) indexer invocation, and the history of recent indexer invocations.

    {
        "status":"running",
        "lastResult": {
            "status":"success",
            "errorMessage":null,
            "startTime":"2018-11-26T03:37:18.853Z",
            "endTime":"2018-11-26T03:37:19.012Z",
            "errors":[],
            "itemsProcessed":11,
            "itemsFailed":0,
            "initialTrackingState":null,
            "finalTrackingState":null
         },
        "executionHistory":[ {
            "status":"success",
             "errorMessage":null,
            "startTime":"2018-11-26T03:37:18.853Z",
            "endTime":"2018-11-26T03:37:19.012Z",
            "errors":[],
            "itemsProcessed":11,
            "itemsFailed":0,
            "initialTrackingState":null,
            "finalTrackingState":null
        }]
    }

Execution history contains up to the 50 most recent completed executions, which are sorted in reverse chronological order (so the latest execution comes first in the response).

## Next steps
Now that you have the basic idea, the next step is to review requirements and tasks specific to each data source type.

* [Azure SQL Database, SQL Managed Instance, or SQL Server on an Azure virtual machine](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
* [Azure Cosmos DB](search-howto-index-cosmosdb.md)
* [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md)
* [Azure Table Storage](search-howto-indexing-azure-tables.md)
* [Indexing CSV blobs using the Azure Cognitive Search Blob indexer](search-howto-index-csv-blobs.md)
* [Indexing JSON blobs with Azure Cognitive Search Blob indexer](search-howto-index-json-blobs.md)
