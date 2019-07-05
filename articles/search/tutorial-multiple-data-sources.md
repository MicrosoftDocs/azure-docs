---
title: 'Tutorial: Index multiple data sources - Azure Search'
description: Learn how to import data from multiple data sources into a single Azure Search index.
author: RobDixon22
manager: HeidiSteen
services: search
ms.service: search
ms.topic: tutorial
ms.date: 06/21/2019
ms.author: v-rodixo
ms.custom: seodec2018
---

# C# Tutorial: Combine data from multiple data sources in one Azure Search index

Azure Search can import, analyze, and index data from multiple data sources into a single combined search index. This supports situations where structured data is aggregated with less-structured or even plain text data from other sources, like text, HTML, or JSON documents.

This tutorial describes how to index hotel data from an Azure Cosmos DB data source and merge that with hotel room details drawn from Azure Blob Storage documents. The result will be a combined hotel search index containing complex data types.

This tutorial uses C#, the .NET SDK for Azure Search, and the Azure portal to do the following tasks:

> [!div class="checklist"]
> * Upload sample data and create data sources
> * Identify the document key
> * Define and create the index
> * Index hotel data from Azure Cosmos DB
> * Merge hotel room data from blob storage

## Prerequisites

The following services, tools, and data are used in this quickstart. 

- [Create an Azure Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this tutorial.

- [Create an Azure Cosmos DB account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account) for storing the sample hotel data.

- [Create an Azure storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account) for storing the sample JSON blob data.

- [Install Visual Studio](https://visualstudio.microsoft.com/) to use as the IDE.

### Install the project from GitHub

1. Locate the sample repository on GitHub: [azure-search-dotnet-samples](https://github.com/Azure-Samples/azure-search-dotnet-samples).
1. Select **Clone or download** and make your private local copy of the repository.
1. Open Visual Studio and install the Microsoft Azure Search NuGet package, if not already installed. In the **Tools** menu, select **NuGet Package Manager** and then **Manage NuGet Packages for Solution...**. Select the **Browse** tab then type "Azure Search" into the search box. Install **Microsoft.Azure.Search** when it appears in the list (version 9.0.1, or later). You will have to click through additional dialogs to complete the installation.

    ![Using NuGet to add Azure libraries](./media/tutorial-csharp-create-first-app/azure-search-nuget-azure.png)

1. Using Visual Studio, navigate to your local repository, and open the solution file **AzureSearchMultipleDataSources.sln**.

## Get a key and URL

To interact with your Azure Search service, you need the service URL and an access key. A search service is created with both, so if you added Azure Search to your subscription, follow these steps to get the necessary information:

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

1. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

![Get an HTTP endpoint and access key](media/search-get-started-postman/get-url-key.png "Get an HTTP endpoint and access key")

All requests require an api-key on every request sent to your service. A valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

## Prepare sample Azure Cosmos DB data

This sample uses two small sets of data that describe seven fictional hotels. One set describes the hotels themselves, and will be loaded into an Azure Cosmos DB database. The other set contains hotel room details, and is provided as seven separate JSON files to be uploaded into Azure Blob Storage.

1. [Sign in to the Azure portal](https://portal.azure.com), and then navigate your Azure Cosmos DB account Overview page.

1. From the menu bar, click Add Container. Specify "Create new database" and use the name **hotel-rooms-db**. Enter **hotel-rooms** for the collection name, and **/HotelId** for the Partition key. Click **OK** to create the database and container.

   ![Add Azure Cosmos DB container](media/tutorial-multiple-data-sources/cosmos-add-container.png "Add an Azure Cosmos DB container")

1. Go to the Cosmos DB Data Explorer and select the **items** element under the **hotels** container within the **hotel-rooms-db** database. Then click **Upload Item** on the command bar.

   ![Upload to Azure Cosmos DB collection](media/tutorial-multiple-data-sources/cosmos-upload.png "Upload to Cosmos DB collection")

1. In the upload panel, click the folder button and then navigate to the file **cosmosdb/HotelsDataSubset_CosmosDb.json** in the project folder. Click **OK** to start the upload.

   ![Select file to upload](media/tutorial-multiple-data-sources/cosmos-upload2.png "Select file to upload")

1. Use the Refresh button to refresh your view of the items in the hotels collection. You should see seven new database documents listed.

## Prepare sample blob data

1. [Sign in to the Azure portal](https://portal.azure.com), navigate to your Azure storage account, click **Blobs**, and then click **+ Container**.

1. [Create a blob container](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal) named **hotel-rooms** to store the sample hotel room JSON files. You can set the Public Access Level to any of its valid values.

   ![Create a blob container](media/tutorial-multiple-data-sources/blob-add-container.png "Create a blob container")

1. After the container is created, open it and select **Upload** on the command bar.

   ![Upload on command bar](media/search-semi-structured-data/upload-command-bar.png "Upload on command bar")

1. Navigate to the folder containing the sample files. Select all of them and then click **Upload**.

   ![Upload files](media/tutorial-multiple-data-sources/blob-upload.png "Upload files")

After the upload completes, the files should appear in the list for the data container.

## Set up connections

Connection information for the search service and the data sources is specified in the **appsettings.json** file in the solution. 

1. In Visual Studio, open the **AzureSearchMultipleDataSources.sln** file.

1. In Solution Explorer, edit the **appsettings.json** file.  

```json
{
  "SearchServiceName": "Put your search service name here",
  "SearchServiceAdminApiKey": "Put your primary or secondary API key here",
  "BlobStorageAccountName": "Put your Azure Storage account name here",
  "BlobStorageConnectionString": "Put your Azure Blob Storage connection string here",
  "CosmosDBConnectionString": "Put your Cosmos DB connection string here",
  "CosmosDBDatabaseName": "hotel-rooms-db"
}
```

The first two entries use the URL and admin keys for your Azure Search service. Given an endpoint of `https://mydemo.search.windows.net`, for example, the service name to provide is `mydemo`.

The next entries specify account names and connection string information for the Azure Blob Storage and Azure Cosmos DB data sources.

### Identify the document key

In Azure Search, the key field uniquely identifies each document in the index. Every search index must have exactly one key field of type `Edm.String`. That key field must be present for each document in a data source that is added to the index. (In fact, it's the only required field.)

When indexing data from multiple data sources, each data source key value must map to the same key field in the combined index. It often requires some up-front planning to identify a meaningful document key for your index, and make sure it exists in every data source.

Azure Search indexers can use field mappings to rename and even reformat data fields during the indexing process, so that source data can be directed to the correct index field.

For example, in our sample Azure Cosmos DB data, the hotel identifier is called **HotelId**. But in the JSON blob files for the hotel rooms, the hotel identifier is  named **Id**. The program handles this by mapping the **Id** field from the blobs to the **HotelId** key field in the index.

> [!NOTE]
> In most cases auto-generated document keys, such as those created by default by some indexers, do not make good document keys for combined indexes. In general you will want to use a meaningful, unique key value that already exists in, or can be easily added to, your data sources.

## Understand the code

Once the data and configuration settings are in place, the sample program in **AzureSearchMultipleDataSources.sln** should be ready to build and run.

This simple C#/.NET console app performs the following tasks:
* Creates a new Azure Search index based on the data structure of the C# Hotel class (which also references the Address and Room classes).
* Creates an Azure Cosmos DB data source and an indexer that maps Azure Cosmos DB data to index fields.
* Runs the Azure Cosmos DB indexer to load Hotel data.
* Creates an Azure Blob Storage data source and an indexer that maps JSON blob data to index fields.
* Runs the Azure blob storage indexer to load Rooms data.

 Before running the program, take a minute to study the code and the index and indexer definitions for this sample. The relevant code is in two files:

  + **Hotel.cs** contains the schema that defines the index
  + **Program.cs** contains functions that create the Azure Search index, data sources, and indexers, and load the combined results into the index.

### Define the index

This sample program uses the .NET SDK to define and create an Azure Search index. It takes advantage of the [FieldBuilder](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.fieldbuilder) class to generate an index structure from a C# data model class.

The data model is defined by the Hotel class, which also contains references to the Address and Room classes. The FieldBuilder drills down through multiple class definitions to generate a complex data structure for the index. Metadata tags are used to define the attributes of each field, such as whether it is searchable or sortable.

The following snippets from the **Hotel.cs** file show how a single field, and a reference to another data model class, can be specified.

```csharp
. . . 
[IsSearchable, IsFilterable, IsSortable]
public string HotelName { get; set; }
. . .
public Room[] Rooms { get; set; }
. . .
```

In the **Program.cs** file, the index is defined with a name and a field collection generated by the `FieldBuilder.BuildForType<Hotel>()` method, and then created as follows:

```csharp
private static async Task CreateIndex(string indexName, SearchServiceClient searchService)
{
    // Create a new search index structure that matches the properties of the Hotel class.
    // The Address and Room classes are referenced from the Hotel class. The FieldBuilder
    // will enumerate these to create a complex data structure for the index.
    var definition = new Index()
    {
        Name = indexName,
        Fields = FieldBuilder.BuildForType<Hotel>()
    };
    await searchService.Indexes.CreateAsync(definition);
}
```

### Create Azure Cosmos DB data source and indexer

Next the main program includes logic to create the Azure Cosmos DB data source for the hotels data.

First it concatenates the Azure Cosmos DB database name to the connection string. Then it defines the data source object, including settings specific to Azure Cosmos DB sources, such as the [useChangeDetection] property.

  ```csharp
private static async Task CreateAndRunCosmosDbIndexer(string indexName, SearchServiceClient searchService)
{
    // Append the database name to the connection string
    string cosmosConnectString = 
        configuration["CosmosDBConnectionString"]
        + ";Database=" 
        + configuration["CosmosDBDatabaseName"];

    DataSource cosmosDbDataSource = DataSource.CosmosDb(
        name: configuration["CosmosDBDatabaseName"], 
        cosmosDbConnectionString: cosmosConnectString,
        collectionName: "hotels",
        useChangeDetection: true);

    // The Azure Cosmos DB data source does not need to be deleted if it already exists,
    // but the connection string might need to be updated if it has changed.
    await searchService.DataSources.CreateOrUpdateAsync(cosmosDbDataSource);
  ```

After the data source is created, the program sets up an Azure Cosmos DB indexer named **hotel-rooms-cosmos-indexer**.

```csharp
    Indexer cosmosDbIndexer = new Indexer(
        name: "hotel-rooms-cosmos-indexer",
        dataSourceName: cosmosDbDataSource.Name,
        targetIndexName: indexName,
        schedule: new IndexingSchedule(TimeSpan.FromDays(1)));
    
    // Indexers keep metadata about how much they have already indexed.
    // If we already ran this sample, the indexer will remember that it already
    // indexed the sample data and not run again.
    // To avoid this, reset the indexer if it exists.
    bool exists = await searchService.Indexers.ExistsAsync(cosmosDbIndexer.Name);
    if (exists)
    {
        await searchService.Indexers.ResetAsync(cosmosDbIndexer.Name);
    }
    await searchService.Indexers.CreateOrUpdateAsync(cosmosDbIndexer);
```
The program will delete any existing indexers with the same name before creating the new one, in case you want to run this example more than once.

This example defines a schedule for the indexer, so that it will run once per day. You can remove the schedule property from this call if you don't want the indexer to automatically run again in the future.

### Index Azure Cosmos DB data

Once the data source and the indexer have been created, the code that runs the indexer is brief:

```csharp
    try
    {
        await searchService.Indexers.RunAsync(cosmosDbIndexer.Name);
    }
    catch (CloudException e) when (e.Response.StatusCode == (HttpStatusCode)429)
    {
        Console.WriteLine("Failed to run indexer: {0}", e.Response.Content);
    }
```

This example includes a simple try-catch block to report any errors that might occur during execution.

After the Azure Cosmos DB indexer has run, the search index will contain a full set of sample hotel documents. However the rooms field for each hotel will be an empty array, since the Azure Cosmos DB data source contained no room details. Next, the program will pull from Blob storage to load and merge the room data.

### Create Blob storage data source and indexer

To get the room details the program first sets up a Blob storage data source to reference a set of individual JSON blob files.

```csharp
private static async Task CreateAndRunBlobIndexer(string indexName, SearchServiceClient searchService)
{
    DataSource blobDataSource = DataSource.AzureBlobStorage(
        name: configuration["BlobStorageAccountName"],
        storageConnectionString: configuration["BlobStorageConnectionString"],
        containerName: "hotel-rooms");

    // The blob data source does not need to be deleted if it already exists,
    // but the connection string might need to be updated if it has changed.
    await searchService.DataSources.CreateOrUpdateAsync(blobDataSource);
```

After the data source is created, the program sets up a blob indexer named **hotel-rooms-blob-indexer**.

```csharp
    // Add a field mapping to match the Id field in the documents to 
    // the HotelId key field in the index
    List<FieldMapping> map = new List<FieldMapping> {
        new FieldMapping("Id", "HotelId")
    };

    Indexer blobIndexer = new Indexer(
        name: "hotel-rooms-blob-indexer",
        dataSourceName: blobDataSource.Name,
        targetIndexName: indexName,
        fieldMappings: map,
        parameters: new IndexingParameters().ParseJson(),
        schedule: new IndexingSchedule(TimeSpan.FromDays(1)));

    // Reset the indexer if it already exists
    bool exists = await searchService.Indexers.ExistsAsync(blobIndexer.Name);
    if (exists)
    {
        await searchService.Indexers.ResetAsync(blobIndexer.Name);
    }
    await searchService.Indexers.CreateOrUpdateAsync(blobIndexer);
```

The JSON blobs contain a key field named **Id** instead of **HotelId**. The code uses the `FieldMapping` class to tell the indexer to direct the **Id** field value to the **HotelId** document key in the index.

Blob storage indexers can use parameters that identify the parsing mode to be used. The parsing mode differs for blobs that represent a single document, or multiple documents within the same blob. In this example, each blob represents a single index document, so the code uses the `IndexingParameters.ParseJson()` parameter.

For more information about indexer parsing parameters for JSON blobs, see [Index JSON blobs](search-howto-index-json-blobs.md). For more information about specifying these parameters using the .NET SDK, see the [IndexerParametersExtension](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexingparametersextensions) class.

The program will delete any existing indexers with the same name before creating the new one, in case you want to run this example more than once.

This example defines a schedule for the indexer, so that it will run once per day. You can remove the schedule property from this call if you don't want the indexer to automatically run again in the future.

### Index blob data

Once the Blob storage data source and indexer have been created, the code that runs the indexer is simple:

```csharp
    try
    {
        await searchService.Indexers.RunAsync(cosmosDbIndexer.Name);
    }
    catch (CloudException e) when (e.Response.StatusCode == (HttpStatusCode)429)
    {
        Console.WriteLine("Failed to run indexer: {0}", e.Response.Content);
    }
```

Because the index has already been populated with hotel data from the Azure Cosmos DB database, 
the blob indexer updates the existing documents in the index and adds the room details.

> [!NOTE]
> If you have the same non-key fields in both of your data sources, and the data within those fields does not match, then the index will contain the values from whichever indexer ran most recently. In our example, both data sources contain a **HotelName** field. If for some reason the data in this field is different, for documents with the same key value, then the **HotelName** data from the data source that was indexed most recently will be the value stored in the index.

## Search your JSON files

You can explore the populated search index after the program has run, using the [**Search explorer**](search-explorer.md) in the portal.

In Azure portal, open the search service **Overview** page, and find the **hotel-rooms-sample** index in the **Indexes** list.

  ![List of Azure Search indexes](media/tutorial-multiple-data-sources/index-list.png "List of Azure Search indexes")

Click on the hotel-rooms-sample index in the list. You will see a Search Explorer interface for the index. Enter a query for a term like "Luxury". You should see at least one document in the results, and this document should show a list of room objects in its rooms array.

## Clean up resources

The fastest way to clean up after a tutorial is by deleting the resource group containing the Azure Search service. You can delete the resource group now to permanently delete everything in it. In the portal, the resource group name is on the Overview page of the Azure Search service.

## Next steps

There are several approaches and multiple options for indexing JSON blobs. If your source data includes JSON content, you can review these options to see what works best for your scenario.

> [!div class="nextstepaction"]
> [How to index JSON blobs using Azure Search Blob indexer](search-howto-index-json-blobs.md)

You might want to augment structured index data from one data source with cognitively enriched data from unstructured blobs or full-text content. The following tutorial shows how to use Cognitive Services together with Azure Search, using the .NET SDK.

> [!div class="nextstepaction"]
> [Call Cognitive Services APIs in an Azure Search indexing pipeline](cognitive-search-tutorial-blob-dotnet.md)
