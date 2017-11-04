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

Indexers are a component of Azure Search that crawl external data sources, populating an index with searchable content. Currently, Azure Search provides indexers for these data sources: Azure Blob storage, Azure Table storage, Azure Cosmos DB, and SQL Server data in Azure (as a service or a vitual machine). 

Indexers simplify coding requirements. Instead of preparing and pushing a schema-compliant JSON dataset, you can attach a predefined index to an indexer, and have the indexer extract data and pull it into the index.

This tutorial demonstrates the fundamental workflow of working with indexers. In this tutorial, you accomplish the following tasks, using the [Azure Search .NET client libraries](https://aka.ms/search-sdk) and a .NET Core console application:

> [!div class="checklist"]
> * Download and configure the solution
> * Add search service information to application settings
> * Prepare an external dataset
> * Review index and indexer definitions
> * Run the indexer
> * Search the index

## Prerequisites

* An active Azure account. If you don't have one, you can sign up for a [free trial](https://azure.microsoft.com/free/). 

* An Azure Search service. For help on setting it up, see [Create a search service](search-create-service-portal.md).

* An Azure service providing the external data source used by an indexer. We have sample datasets for these services: Azure SQL Database, Azure Table Storage, and Azure Cosmos DB. You only need one to complete this tutorial.

* Visual Studio 2017. You can use the **free** [Visual Studio 2017 Community Edition](https://www.visualstudio.com/downloads/). Make sure that you enable **Azure development** during the Visual Studio setup.

> [!Note]
> If you are using the free Azure Search service, you are limited to three indexes, three indexers, and three data sources. This tutorial creates one of each. Make sure you have room on your service to accept the new resources.

## Download and configure the solution

The indexer solution is part of a collection of Azure Search samples in the same download. The sample is called *DotNetHowToIndexers*.

1. Go to [Azure-Samples/search-dotnet-getting-started](https://github.com/Azure-Samples/search-dotnet-getting-started) in the Azure samples GitHub repository.

2. Click **Clone or Download** and then choose **Download ZIP**. By default, it goes to the Documents folder.

3. In File Explorer, right-click the file and choose **Extract all**.

4. On the parent folder, right-click the folder name > **Properties** > **General**, and then clear the **Read-only** attribute for the current folder, subfolders, and files.

5. In Visual Studio, open the solution *DotNetHowToIndexers.sln*.

6. In Solution Explorer, right-click the parent Solution > **Restore Nuget Packages**.

## Set up connections
Connection information to services and datasets are specified in the *appsettings.json* file in the solution. 

In Solution Explorer, open *appsettings.json* so that you can populate each setting, using the instructions in the following sections.

The file consists of the following items. Connecting to the search service is required, but you only need one external data source for indexing purposes.  

```json
{
  "SearchServiceName": "(Required) Put your search service name here",
  "SearchServiceAdminApiKey": "(Required) Put your primary or secondary API key here",
  "AzureSqlConnectionString": "(If SQL) Put your Azure SQL database connection string here",
  "AzureStorageConnectionString": "(If Table storage) Put your Azure Storage connection string here",
  "AzureStorageTableName": "(If Table storage) Put your Azure Table Storage table name here",
  "AzureCosmosDbConnectionString": "(If Cosmos DB) Put your Azure Cosmos DB connection string here. Be sure to include the database name in the connection string",
  "AzureCosmosDbCollectionName": "(If Cosmos DB) Put your Azure Cosmos DB collection name here."
}
```

### Search service connection

In this step, get the service URL for your search service and an admin key providing write-access to the service. Admin rights are necessary to create objects, such as indexes and indexers, in the service.

1. Sign in to the [Azure portal](https://portal.azure.com/) and find your search service. If it's not pinned to your dashboard, search for "search". You should get a list of search services that exist for your subscription.

2. In service page > **Essentials**, copy the URL and paste it into the "SearchServiceName" item in appsettings.json. The URL should look like this: `https://<your-service-name>.search.windows.net`

3. On the left, in **Settings** > **Keys**, copy either key and paste it into the "SearchServiceAdminApiKey" item in the apsettings.json file. 

## Prepare an external data source

In this step, create an external data source that an indexer can crawl. If you aren't familiar with any of the services, choose Azure SQL Database for more detailed instructions.

Data files are provided in the solution, in the **\DotNetHowToIndexers\data** folder.

  ![File list][./media/search-indexer-tutorial/data-files.png]

### Azure SQL Database

The sample includes a T-SQL script for populating an empty database. You can use the Azure portal and the hotels.sql file from the sample to create the dataset.

These instructions assume no existing server or database, creating both in steps 2, respectivley. If you have an existing resource, you can add the hotels table starting at step 4.

1. Sign in to the [Azure portal](https://portal.azure.com/). 

2. Click **New** > **SQL Database** to create a database, server, and resource group. You can use defaults and the lowest level tier. One advantage to creating a server is that you can specify an administrator user name and password, which you need to have for query validation in a later step.

   ![New database page][./media/search-indexer-tutorial/indexer-new-sqldb.png]

3. Click **Create** to deploy the new server and database.

4. Open the SQL Database page for your database, if it's not already open. The resource name should say *SQL Database* and not *SQL Server*

  ![SQL database page][./media/search-indexer-tutorial/hotels-db.png]

4. On the command bar, click **Tools** > **Query Editor**.

5. Click **Login** and enter the user name and password of server admin.

6. Click **Open Query** and navigate to the data folder containing *hotels.sql*. Choose that file to open. By default, the location is in \Downloads\search-dotnet-getting-started-master\search-dotnet-getting-started-master\DotNetHowToIndexers\DotNetHowToIndexers\data.

  ![SQL script][./media/search-indexer-tutorial/sql-script.png]

7. Click **Run** to execute the query. In the Results pane, you should see 

8. To return a rowset, you can execute the following query:

   ```sql
   SELECT HotelId, Category, HotelName, Tags from Hotels
   ```

   Note that `SELECT * FROm Hotels` doesn't work in the Query editor. The database includes geographic coordinates in the Location field, which is not handled in the editor at this time. For a list of other columns to query, you can execute this statement: `SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Hotels') `

9. Now that you have an external dataset, copy the ADO.NET connection string for the database. so that you can paste it i
 
  The connection string should look similar to the following example, corrected to use a valid database name, user name, and password.

  ```sql
  Server=tcp:hotels-db.database.windows.net,1433;Initial Catalog=hotels-db;Persist Security Info=False;User ID={your_username};Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
  ```
10. Paste the connection string into "AzureSqlConnectionString" in applicationSettings.json file in Visual Studio.

    ```json
    {
      "SearchServiceName": "<your-service-name>",
      "SearchServiceAdminApiKey": "<your-admin-key>",
      "AzureSqlConnectionString": "Server=tcp:hotels-db.database.windows.net,1433;Initial Catalog=hotels-db;Persist Security  Info=False;User ID={your_username};Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;",
      "AzureStorageConnectionString": " ",
      "AzureStorageTableName": " ",
      "AzureCosmosDbConnectionString": " ",
      "AzureCosmosDbCollectionName": " "
    }
    ```

### Azure Table Storage

TBD - If you are choosing to use Azure Table Storage run `powershell data\hotels-table-storage.ps1 -StorageAccountName <Your storage account name> -StorageAccountKey <Your storage account key>.

### Azure Cosmos DB 

TBD -- If you are choosing to use Azure Cosmos DB, upload `data\hotels.json` to a Cosmos DB collection of your choice. Follow the instructions at https://docs.microsoft.com/en-us/azure/cosmos-db/import-data#JSON.


## Review index and indexer definitions

Your code is now ready to build and run, but before you do that, take a minute to study the index and indexer definitions for this sample. The relevant code is in two files:

  + **hotel.cs**, containing the index schema
  + **Program.cs**, containing the functions for creating and managing structures in your service

In this tutorial, the *hotel* index accepts data from one data source at a time. In practice, you can attach multiple indexers to the same index, creating a consolidated searchable index from multiple data sources and indexers. You can use the same index-indexer pair, varying just the data sources, or one index with various indexers and data sources, depending on where you need the flexibility.

The main program includes functions for all three representative data sources. Focusing on just Azure SQL Database, the following objects stand out:

        private const string IndexName = "hotels";
        private const string AzureSqlHighWaterMarkColumnName = "RowVersion";
        private const string AzureSqlDataSourceName = "azure-sql";
        private const string AzureSqlIndexerName = "azure-sql-indexer";

In Azure Search, objects that you can view, configure, or delete independently include indexes, indexers, and data sources. The `AzureSqlHighWaterMarkColumnName` column provides change detection information, used by the indexer to determine whether a row contains updated values during data refresh.

The following code shows the methods used for creating a data source and indexer.

  ```csharp
        private static string SetupAzureSqlIndexer(SearchServiceClient serviceClient, IConfigurationRoot configuration)
        {
            Console.WriteLine("Deleting Azure SQL data source if it exists...");
            DeleteDataSourceIfExists(serviceClient, AzureSqlDataSourceName);

            Console.WriteLine("Creating Azure SQL data source...");
            DataSource azureSqlDataSource = CreateAzureSqlDataSource(serviceClient, configuration);

            Console.WriteLine("Deleting Azure SQL indexer if it exists...");
            DeleteIndexerIfExists(serviceClient, AzureSqlIndexerName);

            Console.WriteLine("Creating Azure SQL indexer...");
            Indexer azureSqlIndexer = CreateIndexer(serviceClient, AzureSqlDataSourceName, AzureSqlIndexerName);

            return azureSqlIndexer.Name;
        }
  ```

The API calls for indexer workloads are platform-agnostic except for [datasourcetype](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.datasourcetype?view=azure-dotnet), which specifies the type of crawler to invoke.

## Run the indexer

In this step, compile and run the program. You code runs locally in Visual Studio, connecting to your search service on Azure, which in turn uses the connection string to connect to Azure SQL Database and retrieve the dataset. Potentially, there are several points of failure, but if you get an error, check the following:

+ Database connection string in appSettings.json.  It should be the ADO.NET connection string obtained from the portal. Verify the username and password are valid for the database.

+ Resource limits. The shared (free) service has limits on the number of resources you can create. Although the sample code deletes existing objects of the same name, a service already at maximum limits won't accept new objects.

## Search the index 

1. In the Azure portal, in the search service page, click **Search explorer** to submit a few queries on the new index

## View indexer configuration settings

All indexers, including the one you just created programmatically, are listed in the portal. You can open an indexer definition and view its data source, or configure a refresh schedule to pick up new and changed rows in the external source.

For practice, add the following rows to your existing database using Query Editor, and then rebuild the program to run the indexer. Use **Search explorer** as verification your index is updated.

## Next steps

For additional information and tasks specific to each data source type, see the following articles:

* [Azure SQL Database or SQL Server on an Azure virtual machine](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
* [Azure Cosmos DB](search-howto-index-documentdb.md)
* [Azure Blob Storage](search-howto-indexing-azure-blob-storage.md)
* [Azure Table Storage](search-howto-indexing-azure-tables.md)
* [Indexing CSV blobs using the Azure Search Blob indexer](search-howto-index-csv-blobs.md)
* [Indexing JSON blobs with Azure Search Blob indexer](search-howto-index-json-blobs.md)

