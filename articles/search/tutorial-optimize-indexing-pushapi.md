---
title: 'C# Tutorial: Optimize Indexing with the Push API'
titleSuffix: Azure Cognitive Search
description: Learn how to efficiently index data using Azure Cognitive Search's Push API and an exponential backoff retry strategy. This tutorial and sample code are in C#.

manager: liamca
author: dereklegenzoff
ms.author: delegenz
ms.service: cognitive-search
ms.topic: tutorial
ms.date: 04/20/2020
---

# Tutorial: Optimize Indexing with the Push API

Azure Cognitive Search supports [two basic approaches](https://docs.microsoft.com/en-us/azure/search/search-what-is-data-import) for importing data into a search index: *pushing* your data into the index programmatically, or pointing an [Azure Cognitive Search indexer](https://docs.microsoft.com/en-us/azure/search/search-indexer-overview) at a supported data source to *pull* in the data.

This tutorial describes how to test batch processing speeds and efficiently index data using the [push model](https://docs.microsoft.com/en-us/azure/search/search-what-is-data-import#pushing-data-to-an-index). A .NET Core C# console application has been created so you can [download and run the  application](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/optimize-data-indexing). This article explains the key aspects of the application as well as factors to consider when indexing data.

This tutorial uses C# and the [.NET SDK](https://aka.ms/search-sdk) to perform the following tasks:

> [!div class="checklist"]
> * Create an index
> * Test various batch sizes to determine the most efficient size
> * Index data asynchronously
> * Use multiple threads to increase indexing speeds
> * Use an exponential backoff retry strategy to retry failed items

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

The following services and tools are required for this quickstart.

+ [Visual Studio](https://visualstudio.microsoft.com/downloads/), any edition. Sample code and instructions were tested on the free Community edition.

+ [Create an Azure Cognitive Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart.

<a name="get-service-info"></a>

## Download files

Source code for this tutorial is in the [optimzize-data-indexing](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/optimize-data-indexing) folder in the [Azure-Samples/azure-search-dotnet-samples](https://github.com/Azure-Samples/azure-search-dotnet-samples) GitHub repository.

## 1 - Create Azure Cognitive Search service

To complete this tutorial, you'll need an Azure Cognitive Search service, which you can [create in the portal](search-create-service-portal.md). You can use the Free tier to complete this walkthrough, however, we recommend using the same tier you plan to use in production to accurately test and optimize data indexing speeds.

### Get an admin api-key and URL for Azure Cognitive Search

API calls require the service URL and an access key. A search service is created with both, so if you added Azure Cognitive Search to your subscription, follow these steps to get the necessary information:

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

1. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

   ![Get an HTTP endpoint and access key](media/search-get-started-postman/get-url-key.png "Get an HTTP endpoint and access key")

## 2 - Set up your environment

1. Start Visual Studio and open **OptimizeDataIndexing.sln**.
1. In Solution Explorer, open **appsettings.json** to provide connection information.
1. For `searchServiceName`, if the full URL is "https://my-demo-service.search.windows.net", the service name to provide is "my-demo-service".

```json
{
  "SearchServiceName": "<YOUR-SEARCH-SERVICE-NAME>",
  "SearchServiceAdminApiKey": "<YOUR-ADMIN-API-KEY>",
  "SearchIndexName": "optimize-indexing"
}
```

## 3 - Explore the code

Once you update appsettings.json, the sample program in **OptimizeDataIndexing.sln** should be ready to build and run.

This code is derived from the [C# Quickstart](https://docs.microsoft.com/en-us/azure/search/search-get-started-dotnet). You can find more detailed information on creating indexes and the basics of working with the .NET SDK in that article.

This simple C#/.NET console app performs the following tasks:

* Creates a new index based on the data structure of the C# Hotel class (which also references the Address class).
* Test various batch sizes to determine the most efficient size
* Index data asynchronously
* Use multiple threads to increase indexing speeds
* Use an exponential backoff retry strategy to retry failed items

 Before running the program, take a minute to study the code and the index definitions for this sample. The relevant code is in several files:

  + **Hotel.cs** and **Address.cs** contains the schema that defines the index
  + **DataGenerator.cs** contains a simple class to make it easy to upload large amounts of hotel data
  + **ExponentialBackoff.cs** contains code to optimize the indexing of data as described below
  + **Program.cs** contains functions that create and delete the Azure Cognitive Search index, index batches of data, and test different batch sizes

### Creating the index

This sample program uses the .NET SDK to define and create an Azure Cognitive Search index. It takes advantage of the [FieldBuilder](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.fieldbuilder) class to generate an index structure from a C# data model class.

The data model is defined by the Hotel class, which also contains references to the Address class. The FieldBuilder drills down through multiple class definitions to generate a complex data structure for the index. Metadata tags are used to define the attributes of each field, such as whether it is searchable or sortable.

The following snippets from the **Hotel.cs** file show how a single field, and a reference to another data model class, can be specified.

```csharp
. . .
[IsSearchable, IsSortable]
public string HotelName { get; set; }
. . .
public Address Address { get; set; }
. . .
```

In the **Program.cs** file, the index is defined with a name and a field collection generated by the `FieldBuilder.BuildForType<Hotel>()` method, and then created as follows:

```csharp
private static async Task CreateIndex(string indexName, SearchServiceClient searchService)
{
    // Create a new search index structure that matches the properties of the Hotel class.
    // The Address class is referenced from the Hotel class. The FieldBuilder
    // will enumerate these to create a complex data structure for the index.
    var definition = new Index()
    {
        Name = indexName,
        Fields = FieldBuilder.BuildForType<Hotel>()
    };
    await searchService.Indexes.CreateAsync(definition);
}
```

### Generating data

A simple class is implemented in the **DataGenerator.cs** file to generate data for testing. The sole purpose of this class is to make it easy to generate a large number of documents with a unique id for indexing.

To get a list of 100,000 hotels with unique ids

```csharp
DataGenerator dg = new DataGenerator();
List<Hotel> hotels = dg.GetHotels(100000, "large");
```

There are two sizes of hotels available for testing:
1. `small` - 100,000 small hotels takes up ~ 12MB in the search index
1. `large` - 100,000 large hotels takes up ~ 65MB in the search index

The schema of your index can have a significant impact on indexing speeds to after you run through this tutorial, it makes sense to convert this class to generate data matching your intended index schema.

## 4 - Test batch sizes

Indexing documents in batches will significantly improve indexing performance. Batches can be up to 1000 documents, or up to about 16 MB per batch.

Determining the optimal batch size for your data is a key component of optimizing indexing speeds. The following function demonstrates how to test different batch sizes.

```csharp
public static async Task TestBatchSizes(ISearchIndexClient indexClient, int min = 100, int max = 1000, int step = 100, int numTries = 3)
{
    DataGenerator dg = new DataGenerator();

    Console.WriteLine("Batch Size \t Size in MB \t MB / Doc \t Time (ms) \t MB / Second");
    for (int numDocs = min; numDocs <= max; numDocs += step)
    {
        List<TimeSpan> durations = new List<TimeSpan>();
        double sizeInMb = 0.0;
        for (int x = 0; x < numTries; x++)
        {
            List<Hotel> hotels = dg.GetHotels(numDocs, "large");

            DateTime startTime = DateTime.Now;
            await UploadDocuments(indexClient, hotels);
            DateTime endTime = DateTime.Now;
            durations.Add(endTime - startTime);

            sizeInMb = EstimateObjectSize(hotels);
        }

        var avgDuration = durations.Average(timeSpan => timeSpan.TotalMilliseconds);
        var avgDurationInSeconds = avgDuration / 1000;
        var mbPerSecond = sizeInMb / avgDurationInSeconds;

        Console.WriteLine("{0} \t\t {1} \t\t {2} \t\t {3} \t {4}", numDocs, Math.Round(sizeInMb, 3), Math.Round(sizeInMb / numDocs, 3), Math.Round(avgDuration, 3), Math.Round(mbPerSecond, 3));

        // Pausing 2 seconds to let the search service catch its breath
        Thread.Sleep(2000);
    }
```

Because not all documents are the same size (although they are in this sample), we estimate the size of the data we're sending to the search service using the function below. The function converts the object to json and then converts the json to an array of bytes to determine its size:

```csharp
public static double EstimateObjectSize(object data)
{
    // converting data to json for more accurate sizing
    var json = JsonConvert.SerializeObject(data);

    // converting object to byte[] to determine the size of the data
    BinaryFormatter bf = new BinaryFormatter();
    MemoryStream ms = new MemoryStream();
    byte[] Array;

    bf.Serialize(ms, json);
    Array = ms.ToArray();

    // converting from bytes to megabytes
    double sizeInMb = (double)Array.Length / 1000000;

    return sizeInMb;
}
```

This allows us to determine which batch size is most efficient by MB/s.

## 5 - Index data

### Use multiple threads/workers

To take full advantage of Azure Cognitive Search's indexing speeds, you'll likely need to use multiple threads to send batch indexing requests concurrently to the service.  

The optimal number of threads is determined by the tier of your search service, the size of your batches, and the schema of your index. You can modify this sample and test it with different thread counts to determine the optimal thread count for your scenario. In general, as long as you have at least a few threads running,

As you ramp up the requests hitting the search service, you may encounter [HTTP status codes](https://docs.microsoft.com/en-us/rest/api/searchservice/http-status-codes) indicating the request did not fully succeed. During indexing, two common HTTP status codes during indexing are:

* **503 Service Unavailable** - This error means that the system is under heavy load and your request can't be processed at this time.
* **207 Multi-Status** - This error means that some documents succeeded, but at least one failed.

### Implement an exponential backoff retry strategy

In the event of a failure, requests should be retried using an [exponential backoff retry strategy](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/implement-retries-exponential-backoff).

Azure Cognitive Search's .NET SDK automatically retries 503s and other failed requests but you'll need to implement your own logic to retry 207s. Open source tools such as [Polly](https://github.com/App-vNext/Polly) can also be used to implement a retry strategy. In this sample, 

## 6 - Explore index

You can explore the populated search index after the program has run, using the [**Search explorer**](search-explorer.md) in the portal.

In Azure portal, open the search service **Overview** page, and find the **optimize-indexing** index in the **Indexes** list.

  ![List of Azure Cognitive Search indexes](media/tutorial-multiple-data-sources/index-list.png "List of Azure Cognitive Search indexes")

## Reset and rerun

In the early experimental stages of development, the most practical approach for design iteration is to delete the objects from Azure Cognitive Search and allow your code to rebuild them. Resource names are unique. Deleting an object lets you recreate it using the same name.

The sample code for this tutorial checks for existing indexes and deletes them so that you can rerun your code.

You can also use the portal to delete indexes.

## Clean up resources

When you're working in your own subscription, at the end of a project, it's a good idea to remove the resources that you no longer need. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

## Next steps

Now that you're familiar with the concept of ingesting data from multiple sources, let's take a closer look at indexer configuration, starting with Cosmos DB.

> [!div class="nextstepaction"]
> [Configure an Azure Cosmos DB indexer](search-howto-index-cosmosdb.md)