---
title: Indexer tutorial for indexing Azure data sources in Azure Search | Microsoft Docs
description: Crawl Azure SQL database, Azure Cosmos DB, or Azure storage to extract searchable data and populate an Azure Search index.
services: search
documentationcenter: ''
author: HeidiSteen
manager: jhubbard
editor: ''
tags: 

ms.assetid: 
ms.service: search
ms.devlang: na
ms.workload: search
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.date: 11/10/2017
ms.author: heidist
---

# How to index Azure data sources in Azure Search

Indexers are a component of Azure Search that crawl external sources of a certain type, populating an index with searchable content. indexers are available for these data sources: Azure blob storage, Azure table storage, Azure Cosmos DB, and SQL Server data in Azure (service or vitual machine). 

Using an indexer is recommended because it simplifies coding requirements. Instead of preparing and pushing a schema-compliant JSON dataset, you can attach a predefined index to an indexer, and have the indexer extract data and pull it into the index.

This tutorial covers the following tasks, using the [Azure Search .NET SDK](https://aka.ms/search-sdk) and a .NET Core console application:

> [!div class="checklist"]
> * Load sample data
> * Create an Azure Search index
> * Create an Azure Search indexer 
> * Run the indexer
> * Search the index

## Prerequisites
Please make sure you have the following:

* An active Azure account with an Azure Search service. If you don't have an account, you can sign up for a [free account](https://azure.microsoft.com/free/). 

* An Azure Search service. For instructions on setting it up, see [Create a search service](search-create-service-portal.md).

* An Azure service providing the external data source used by an indexer. We have sample datasets for these services: Azure SQL Database, Azure Table Storage, and Azure Cosmos DB.

* Visual Studio 2017. You can use the **free** [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

## Download the solution

The indexer solution is part of a collection of Azure Search samples in the same download. The sample is called *DotNetHowToIndexers*.

1. Go to [Azure-Samples/search-dotnet-getting-started](https://github.com/Azure-Samples/search-dotnet-getting-started) in the Azure samples GitHub repository.

2. Click **Clone or Download** and then choose **Download ZIP**.

3. In File Explorer, right-click the file and choose **Extract all**.

## Open the solution

1. Open the solution *DotNetHowToIndexers.sln* in Visual Studio.

2. In Solution Explorer, open *appsettings.json* so that you can populate each setting, using the instructions in the following sections.

## Get the service endpoint and key

In this step, get the service URL for your search service and an admin key providing write-access to the service. Admin rights are necessary to create objects, such as indexes and indexers, in the service.

1. Sign in to the [Azure portal](https://portal.azure.com/) and find your search service. If it's not pinned to your dashboard, search for "search". You should get a list of search services that exist for your subscription.

2. In your search service page > **Essentials**, copy the URL and paste it into the "SearchServiceName" item in appsettings.json. The URL should look like this: `https://<your-service-name>.search.windows.net`

3. On the left, go to **Settings** > **Keys**, copy either key and paste it into the "SearchServiceAdminApiKey" item in apsettings.json. An admin key is an alpha-numeric string with no spaces.


## Create containers for datasets

The solution connects to services that 


## Set endpoints and connections in appsettings.json


{
  "SearchServiceName": "Put your search service name here",
  "SearchServiceAdminApiKey": "Put your primary or secondary API key here",
  "AzureSqlConnectionString": "Put your Azure SQL database connection string here",
  "AzureStorageConnectionString": "Put your Azure Storage connection string here",
  "AzureStorageTableName": "Put your Azure Table Storage table name here",
  "AzureCosmosDbConnectionString": "Put your Azure Cosmos DB connection string here. Be sure to include the database name in the connection string",
  "AzureCosmosDbCollectionName": "Put your Azure Cosmos DB collection name here."
}


## Load sample data




***********************************************************************
## Running the DotNetHowToIndexers sample

* Open the DotNetHowToIndexers.csproj project in Visual Studio.
* Update the appsettings.json with the service and api details of your Azure Search service,
  along with whatever data source you choose (Azure SQL, Azure Table Storage, or Azure Cosmos DB).
  * If you are choosing to use Azure SQL, run the `data\hotels.sql` script against your Azure SQL database
    to populate it with suitable sample data.
  * If you are choosing to use Azure Table Storage run `powershell data\hotels-table-storage.ps1 -StorageAccountName <Your storage account name> -StorageAccountKey <Your storage account key>.
    This will automatically create a `hotels` table under your storage account with the data set in `data\hotels.json`.
  * If you are choosing to use Azure Cosmos DB, upload `data\hotels.json` to a Cosmos DB collection of your choice.
    Follow the instructions at https://docs.microsoft.com/en-us/azure/cosmos-db/import-data#JSON.
* Compile and Run the project, specifying the correct command line parameter for which data source you are using:
  * AzureSQL for Azure SQL
  * AzureTableStorage for Azure Table Storage
  * AzureCosmosDB for Azure Cosmos DB
* Alternatively, download the .NET Core SDK at https://www.microsoft.com/net/core and
  issue a `dotnet run <DataSource>` command from the DotNetHowToIndexers directory.











***********************************************************************8


An *indexer* in Azure Search is a crawler that extracts searchable data and metadata from an external data source and populates an index based on field-to-field mappings between the index and your data source. This approach is sometimes referred to as a 'pull model' because the service pulls data in without you having to write any code that pushes data to an index.

Indexers are based on data source types or platforms, with individual indexers for SQL Server on Azure, Cosmos DB, Azure Table Storage and Blob Storage, and so forth.

You can use an indexer as the sole means for data ingestion, or use a combination of techniques that include the use of an indexer for loading just some of the fields in your index.

You can run indexers on demand or on a recurring data refresh schedule that runs as often as every fifteen minutes. More frequent updates require a push model that simultaneously updates data in both Azure Search and your external data source.

## Approaches for creating and managing indexers

You can create and manage indexers using these approaches:

* [Portal > Import Data Wizard ](search-get-started-portal.md)
* [Service REST API](https://msdn.microsoft.com/library/azure/dn946891.aspx)
* [.NET SDK](https://msdn.microsoft.com/library/azure/microsoft.azure.search.iindexersoperations.aspx)

Initially, a new indexer is announced as a preview feature. Preview features are introduced in APIs (REST and .NET) and then integrated into the portal after graduating to general availability. If you're evaluating a new indexer, you should plan on writing code.

## Basic configuration steps
Indexers can offer features that are unique to the data source. In this respect, some aspects of indexer or data source configuration will vary by indexer type. However, all indexers share the same basic composition and requirements. Steps that are common to all indexers are covered below.

### Step 1: Create a data source
An indexer pulls data from a *data source* which holds information such as a connection string and possibly credentials. Currently the following data sources are supported:

* [Azure SQL Database or SQL Server on an Azure virtual machine](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
* [Azure Cosmos DB](search-howto-index-documentdb.md)
* [Azure Blob storage](search-howto-indexing-azure-blob-storage.md) for selected content types
* [Azure Table Storage](search-howto-indexing-azure-tables.md)

Data sources are configured and managed independently of the indexers that use them, which means a data source can be used by multiple indexers to load more than one index at a time.

### Step 2: Create an index
An indexer will automate some tasks related to data ingestion, but creating an index is not one of them. As a prerequisite, you must have a predefined index with fields that match those in your external data source. For more information about structuring an index, see [Create an Index (Azure Search REST API)](https://docs.microsoft.com/rest/api/searchservice/Create-Index). For help with field associations, see [Field mappings in Azure Search indexers](search-indexer-field-mappings.md).

### Step 3: Create and schedule the indexer
The indexer definition is a construct specifying the index, data source, and a schedule. An indexer can reference a data source from another service, as long as that data source is from the same subscription. For more information about structuring an indexer, see [Create Indexer (Azure Search REST API)](https://docs.microsoft.com/rest/api/searchservice/Create-Indexer).

## Next steps
Now that you have the basic idea, the next step is to review requirements and tasks specific to each data source type.

* [Azure SQL Database or SQL Server on an Azure virtual machine](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
* [Azure Cosmos DB](search-howto-index-documentdb.md)
* [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md)
* [Azure Table Storage](search-howto-indexing-azure-tables.md)
* [Indexing CSV blobs using the Azure Search Blob indexer](search-howto-index-csv-blobs.md)
* [Indexing JSON blobs with Azure Search Blob indexer](search-howto-index-json-blobs.md)
