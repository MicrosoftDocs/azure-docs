---
title: C# tutorial indexing Azure SQL data
titleSuffix: Azure AI Search
description: In this C# tutorial, connect to Azure SQL Database, extract searchable data, and load it into an Azure AI Search index.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 01/18/2024
ms.custom:
  - devx-track-csharp
  - devx-track-dotnet
  - ignite-2023
---

# Tutorial: Index Azure SQL data using the .NET SDK

Configure an [indexer](search-indexer-overview.md) to extract searchable data from Azure SQL Database, sending it to a search index in Azure AI Search. 

This tutorial uses C# and the [Azure SDK for .NET](/dotnet/api/overview/azure/search) to perform the following tasks:

> [!div class="checklist"]
> * Create a data source that connects to Azure SQL Database
> * Create an indexer
> * Run an indexer to load data into an index
> * Query an index as a verification step

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

* [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) using SQL Server authentication
* [Visual Studio](https://visualstudio.microsoft.com/downloads/)
* [Azure AI Search](search-what-is-azure-search.md). [Create](search-create-service-portal.md) or [find an existing search service](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) 

> [!NOTE]
> You can use a free search service for this tutorial. The free tier limits you to three indexes, three indexers, and three data sources. This tutorial creates one of each. Before starting, make sure you have room on your service to accept the new resources.

## Download files

Source code for this tutorial is in the [DotNetHowToIndexer](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowToIndexers) folder in the [Azure-Samples/search-dotnet-getting-started](https://github.com/Azure-Samples/search-dotnet-getting-started) GitHub repository.

## 1 - Create services

This tutorial uses Azure AI Search for indexing and queries, and Azure SQL Database as an external data source. If possible, create both services in the same region and resource group for proximity and manageability. In practice, Azure SQL Database can be in any region.

### Start with Azure SQL Database

This tutorial provides *hotels.sql* file in the sample download to populate the database. Azure AI Search consumes flattened rowsets, such as one generated from a view or query. The SQL file in the sample solution creates and populates a single table.

If you have an existing Azure SQL Database resource, you can add the hotels table to it, starting at the **Open query** step.

1. Create an Azure SQL database, using the instructions in [Quickstart: Create a single database](/azure/azure-sql/database/single-database-create-quickstart).

   Server configuration for the database is important.

   * Choose the SQL Server authentication option that prompts you to specify a username and password. You need this for the ADO.NET connection string used by the indexer.

   * Choose a public connection. It makes this tutorial easier to complete. Public isn't recommended for production and we recommend [deleting this resource](#clean-up-resources) at the end of the tutorial.

   :::image type="content" source="media/search-indexer-tutorial/sql-server-config.png" alt-text="Screenshot of server configuration.":::

1. In the Azure portal, go to the new resource.

1. Add a firewall rule to allow access from your client, using the instructions in [Quickstart: Create a server-level firewall rule in Azure portal](/azure/azure-sql/database/firewall-create-server-level-portal-quickstart). You can run `ipconfig` from a command prompt to get your IP address. 

1. Use the Query editor to load the sample data. On the navigation pane, select **Query editor (preview)** and enter the user name and password of server admin. 

   If you get an access denied error, copy the client IP address from the error message, open the network security page for the server, and add an inbound rule that allows access from your client. 

1. In Query editor, select **Open query** and navigate to the location of *hotels.sql* file on your local computer. 

1. Select the file and select **Open**. The script should look similar to the following screenshot:

   :::image type="content" source="media/search-indexer-tutorial/sql-script.png" alt-text="Screenshot of SQL script in a Query Editor window." border="true":::

1. Select **Run** to execute the query. In the Results pane, you should see a query succeeded message, for three rows.

1. To return a rowset from this table, you can execute the following query as a verification step:

    ```sql
    SELECT * FROM Hotels
    ```

1. Copy the ADO.NET connection string for the database. Under **Settings** > **Connection Strings**, copy the ADO.NET connection string, similar to the example below.

    ```sql
    Server=tcp:{your_dbname}.database.windows.net,1433;Initial Catalog=hotels-db;Persist Security Info=False;User ID={your_username};Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
    ```

You'll need this connection string in the next exercise, setting up your environment.

### Azure AI Search

The next component is Azure AI Search, which you can [create in the portal](search-create-service-portal.md). You can use the Free tier to complete this walkthrough. 

### Get an admin api-key and URL for Azure AI Search

API calls require the service URL and an access key. A search service is created with both, so if you added Azure AI Search to your subscription, follow these steps to get the necessary information:

1. Sign in to the [Azure portal](https://portal.azure.com), and in your search service **Overview** page, get the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

1. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

   :::image type="content" source="media/search-get-started-rest/get-url-key.png" alt-text="Screenshot of Azure portal pages showing the HTTP endpoint and access key location for a search service." border="false":::

## 2 - Set up your environment

1. Start Visual Studio and open **DotNetHowToIndexers.sln**.

1. In Solution Explorer, open **appsettings.json** to provide connection information.

1. For `SearchServiceEndPoint`, if the full URL on the service overview page is "https://my-demo-service.search.windows.net", then the value to provide is the entire URL.

1. For `AzureSqlConnectionString`, the string format is similar to this: `"Server=tcp:{your_dbname}.database.windows.net,1433;Initial Catalog=hotels-db;Persist Security Info=False;User ID={your_username};Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"`

    ```json
    {
      "SearchServiceEndPoint": "<placeholder-search-full-url>",
      "SearchServiceAdminApiKey": "<placeholder-admin-key-for-search-service>",
      "AzureSqlConnectionString": "<placeholder-ADO.NET-connection-string",
    }
    ```

1. Replace the user password in the SQL connection string to a valid password. While the database and user names will copy over, the password must be entered manually.

## 3 - Create the pipeline

Indexers require a data source object and an index. Relevant code is in two files:

* **hotel.cs**, containing a schema that defines the index

* **Program.cs**, containing functions for creating and managing structures in your service

### In hotel.cs

The index schema defines the fields collection, including attributes specifying allowed operations, such as whether a field is full-text searchable, filterable, or sortable as shown in the following field definition for HotelName. A [SearchableField](/dotnet/api/azure.search.documents.indexes.models.searchablefield) is full-text searchable by definition. Other attributes are assigned explicitly.

```csharp
. . . 
[SearchableField(IsFilterable = true, IsSortable = true)]
[JsonPropertyName("hotelName")]
public string HotelName { get; set; }
. . .
```

A schema can also include other elements, including scoring profiles for boosting a search score, custom analyzers, and other constructs. However, for our purposes, the schema is sparsely defined, consisting only of fields found in the sample datasets.

### In Program.cs

The main program includes logic for creating [an indexer client](/dotnet/api/azure.search.documents.indexes.models.searchindexer), an index, a data source, and an indexer. The code checks for and deletes existing resources of the same name, under the assumption that you might run this program multiple times.

The data source object is configured with settings that are specific to Azure SQL Database resources, including [partial or incremental indexing](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md#CaptureChangedRows) for using the built-in [change detection features](/sql/relational-databases/track-changes/about-change-tracking-sql-server) of Azure SQL. The source demo hotels database in Azure SQL has a "soft delete" column named **IsDeleted**. When this column is set to true in the database, the indexer removes the corresponding document from the Azure AI Search index.

```csharp
Console.WriteLine("Creating data source...");

var dataSource =
      new SearchIndexerDataSourceConnection(
         "hotels-sql-ds",
         SearchIndexerDataSourceType.AzureSql,
         configuration["AzureSQLConnectionString"],
         new SearchIndexerDataContainer("hotels"));

indexerClient.CreateOrUpdateDataSourceConnection(dataSource);
```

An indexer object is platform-agnostic, where  configuration, scheduling, and invocation are the same regardless of the source. This example indexer includes a schedule, a reset option that clears indexer history, and calls a method to create and run the indexer immediately. To create or update an indexer, use [CreateOrUpdateIndexerAsync](/dotnet/api/azure.search.documents.indexes.searchindexerclient.createorupdateindexerasync).

```csharp
Console.WriteLine("Creating Azure SQL indexer...");

var schedule = new IndexingSchedule(TimeSpan.FromDays(1))
{
      StartTime = DateTimeOffset.Now
};

var parameters = new IndexingParameters()
{
      BatchSize = 100,
      MaxFailedItems = 0,
      MaxFailedItemsPerBatch = 0
};

// Indexer declarations require a data source and search index.
// Common optional properties include a schedule, parameters, and field mappings
// The field mappings below are redundant due to how the Hotel class is defined, but 
// we included them anyway to show the syntax 
var indexer = new SearchIndexer("hotels-sql-idxr", dataSource.Name, searchIndex.Name)
{
      Description = "Data indexer",
      Schedule = schedule,
      Parameters = parameters,
      FieldMappings =
      {
         new FieldMapping("_id") {TargetFieldName = "HotelId"},
         new FieldMapping("Amenities") {TargetFieldName = "Tags"}
      }
};

await indexerClient.CreateOrUpdateIndexerAsync(indexer);
```

Indexer runs are usually scheduled, but during development you might want to run the indexer immediately using [RunIndexerAsync](/dotnet/api/azure.search.documents.indexes.searchindexerclient.runindexerasync).

```csharp
Console.WriteLine("Running Azure SQL indexer...");

try
{
      await indexerClient.RunIndexerAsync(indexer.Name);
}
catch (RequestFailedException ex) when (ex.Status == 429)
{
      Console.WriteLine("Failed to run indexer: {0}", ex.Message);
}
```

## 4 - Build the solution

Press F5 to build and run the solution. The program executes in debug mode. A console window reports the status of each operation.

   :::image type="content" source="media/search-indexer-tutorial/console-output.png" alt-text="Screenshot showing the console output for the program." border="true":::

Your code runs locally in Visual Studio, connecting to your search service on Azure, which in turn connects to Azure SQL Database and retrieves the dataset. With this many operations, there are several potential points of failure. If you get an error, check the following conditions first:

* Search service connection information that you provide is the full URL. If you entered just the service name, operations stop at index creation, with a failure to connect error.

* Database connection information in **appsettings.json**. It should be the ADO.NET connection string obtained from the portal, modified to include a username and password that are valid for your database. The user account must have permission to retrieve data. Your local client IP address must be allowed inbound access through the firewall.

* Resource limits. Recall that the Free tier has limits of three indexes, indexers, and data sources. A service at the maximum limit can't create new objects.

## 5 - Search

Use Azure portal to verify object creation, and then use **Search explorer** to query the index.

1. Sign in to the [Azure portal](https://portal.azure.com), and in your search service left navigation pane, open each page in turn to verify the object is created. **Indexes**, **Indexers**, and **Data Sources** will have "hotels-sql-idx", "hotels-sql-indexer", and "hotels-sql-ds", respectively.

1. On the Indexes tab, select the hotels-sql-idx index. On the hotels page, **Search explorer** is the first tab.

1. Select **Search** to issue an empty query.

   The three entries in your index are returned as JSON documents. Search explorer returns documents in JSON so that you can view the entire structure.

   :::image type="content" source="media/search-indexer-tutorial/portal-search.png" alt-text="Screenshot of a Search Explorer query for the target index." border="true":::

1. Next, [switch to **JSON View**](search-explorer.md#start-search-explorer) so that you can enter query parameters:

   ```json
   {
        "search": "river",
        "count": true
   }
   ```

   This query invokes full text search on the term `river`, and the result includes a count of the matching documents. Returning the count of matching documents is helpful in testing scenarios when you have a large index with thousands or millions of documents. In this case, only one document matches the query.

1. Lastly, enter parameters that limit search results to fields of interest: 

   ```json
   {
        "search": "river",
        "select": "hotelId, hotelName, baseRate, description",
        "count": true
   }
   ```

   The query response is reduced to selected fields, resulting in more concise output.

## Reset and rerun

In the early experimental stages of development, the most practical approach for design iteration is to delete the objects from Azure AI Search and allow your code to rebuild them. Resource names are unique. Deleting an object lets you recreate it using the same name.

The sample code for this tutorial checks for existing objects and deletes them so that you can rerun your code.

You can also use the portal to delete indexes, indexers, and data sources.

## Clean up resources

When you're working in your own subscription, at the end of a project, it's a good idea to remove the resources that you no longer need. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the All resources or Resource groups link in the left-navigation pane.

## Next steps

Now that you're familiar with the basics of SQL Database indexing, let's take a closer look at indexer configuration.

> [!div class="nextstepaction"]
> [Configure a SQL Database indexer](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers.md)
