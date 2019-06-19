---
title: 'Quickstart: C# console application - Azure Search'
description: Learn how to create a full text searchable index in C# using the Azure Search .NET SDK.
author: heidisteen
manager: cgronlun
ms.author: heidist
tags: azure-portal
services: search
ms.service: search
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 06/20/2019

---
# Quickstart: Create an Azure Search index in C#
> [!div class="op_single_selector"]
> * [C#](search-get-started-dotnet.md)
> * [Portal](search-get-started-portal.md)
> * [PowerShell](search-create-index-rest-api.md)
> * [Python](search-get-started-python.md)
> * [Postman](search-fiddler.md)
>*

Create a C# console application that creates, loads, and queries an Azure Search index using Visual Studio and the [Azure Search .NET SDK](https://aka.ms/search-sdk). This article explains how to create the application step by step. 

Alternatively, you could run a completed application. To download a copy, go to [azure-search-dotnet-samples](https://github.com/Azure-Samples/azure-search-dotnet-samples) repository on GitHub.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

> [!NOTE]
> The code in this article uses the synchronous methods of the Azure Search .NET SDK for simplicity. We recommend using the asynchronous methods in your own applications to keep them scalable and responsive. For example, you could use `CreateAsync` and `DeleteAsync` instead of `Create` and `Delete`.

## Prerequisites

The following services, tools, and data are used in this quickstart. 

+ [Visual Studio](https://visualstudio.microsoft.com/downloads/), any edition. Sample code and instructions were tested on the free Community edition.

+ Sample documents that you'll index in this quickstart are provided in this article.

+ [Create an Azure Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart.

<a name="get-service-info"></a>

## Get a key and URL

Calls to the service require a URL endpoint and an access key on every request. A search service is created with both, so if you added Azure Search to your subscription, follow these steps to get the necessary information:

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

2. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

   Get the query key as well. It's a best practice to issue query requests with read-only access.

![Get an HTTP endpoint and access key](media/search-fiddler/get-url-key.png "Get an HTTP endpoint and access key")

All requests require an api-key on every request sent to your service. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

## Set up your environment

Begin by opening Visual Studio and creating a new Console App project that can run on .NET Core.

### Install NuGet packages

The [Azure Search .NET SDK](https://aka.ms/search-sdk) consists of a few client libraries that are distributed as NuGet packages.

For this project, use version 9 of the `Microsoft.Azure.Search` NuGet package and the latest `Microsoft.Extensions.Configuration.Json` NuGet package.

1. Install `Microsoft.Azure.Search` using the Package Manager console in Visual Studio. In **Tools** > **NuGet Package Manager**, click **Package Manager Console**. 

1. Copy and run the following command: `Install-Package Microsoft.Azure.Search -Version 9.0.1`

   You can get command syntax for other installation methodologies on the [Microsoft.Azure.Search](https://www.nuget.org/packages/Microsoft.Azure.Search) NuGet package page

1. Install `Microsoft.Extensions.Configuration.Json`. In **Tools** > **NuGet Package Manager**, select **Manage NuGet Packages for Solution...**. 

1. Click **Browse** and then search for `Microsoft.Extensions.Configuration.Json`. 

1. Once you've found it, select the package, select your project, confirm the version is the latest stable version, then click **Install**.

### Add Azure Search service information

1. In Solution Explorer, right click on the project and select **Add** > **New Item...** . 

1. In Add New Item, search for "JSON" to return a JSON-related list of item types.

1. Choose **JSON File**, name the file "appsettings.json", and click **Add**. 

1. Add the file to your output directory. Right-click appsettings.json and select **Properties**. In **Copy to Output Directory**, select **Copy if newer**.

1. Copy the following JSON into your new JSON file. Replace the search service name (YOUR-SEARCH-SERVICE-NAME), query API key (YOUR-QUERY-API-KEY), and admin API key (YOUR-ADMIN-API-KEY) with valid values. If your service endpoint is `https://mydemo.search.windows.net`, the service name would be "mydemo".

```json
{
  "SearchServiceName": "<YOUR-SEARCH-SERVICE-NAME>",
  "SearchServiceAdminApiKey": "<YOUR-ADMIN-API-KEY>",
  "SearchIndexName": "hotels-quickstart"
}
```

## 1 - Create index

The hotels index consists of simple and complex fields, where a simple field is "HotelName" or "Description", and complex fields are an address with subfields, or a collection of rooms. When an index includes complex types, isolate the complex field definitions in separate classes.

1. Add two empty class definitions to your project: address.cs, hotel.cs

1. In address.cs, overwrite the default contents with the following code:

    ```csharp
    using System;
    using Microsoft.Azure.Search;
    using Microsoft.Azure.Search.Models;
    using Newtonsoft.Json;

    namespace azure_search_getstarted_dotnet
    {
        public partial class Address
        {
            [IsSearchable]
            public string StreetAddress { get; set; }

            [IsSearchable, IsFilterable, IsSortable, IsFacetable]
            public string City { get; set; }

            [IsSearchable, IsFilterable, IsSortable, IsFacetable]
            public string StateProvince { get; set; }

            [IsSearchable, IsFilterable, IsSortable, IsFacetable]
            public string PostalCode { get; set; }

            [IsSearchable, IsFilterable, IsSortable, IsFacetable]
            public string Country { get; set; }
        }
    }
    ```

1. In hotel.cs, the class defines the overall structure of the index, including references to the address class.

    ```csharp
        namespace azure_search_getstarted_dotnet
        {
            using System;
            using Microsoft.Azure.Search;
            using Microsoft.Azure.Search.Models;
            using Newtonsoft.Json;

            public partial class Hotel
            {
                [System.ComponentModel.DataAnnotations.Key]
                [IsFilterable]
                public string HotelId { get; set; }

                [IsSearchable, IsSortable]
                public string HotelName { get; set; }

                [IsSearchable]
                [Analyzer(AnalyzerName.AsString.EnMicrosoft)]
                public string Description { get; set; }

                [IsSearchable]
                [Analyzer(AnalyzerName.AsString.FrLucene)]
                [JsonProperty("Description_fr")]
                public string DescriptionFr { get; set; }

                [IsSearchable, IsFilterable, IsSortable, IsFacetable]
                public string Category { get; set; }

                [IsSearchable, IsFilterable, IsFacetable]
                public string[] Tags { get; set; }

                [IsFilterable, IsSortable, IsFacetable]
                public bool? ParkingIncluded { get; set; }

                [IsFilterable, IsSortable, IsFacetable]
                public DateTimeOffset? LastRenovationDate { get; set; }

                [IsFilterable, IsSortable, IsFacetable]
                public double? Rating { get; set; }

                public Address Address { get; set; }
            }
        }
    ```

    Attributes on the field determine how it is used in an application. For example, the `IsSearchable` attribute is assigned to every field that should be included in a full text search. In the .NET SDK, the default is to disable field behaviors that are not explicitly enabled.

    Exactly one field in your index of type `string` must be the *key* field, uniquely identifing each document. In this schema, the key is `HotelId`.

    In this index, the description fields use the optional analyzer property, specified when you want to override the default standard Lucene analyzer. The `description_fr` field is using the French Lucene analyzer ([FrLucene](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.analyzername.frlucene?view=azure-dotnet))because it stores French text. The `description` is using the optional Microsoft language analyzer ([EnMicrosoft](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.analyzername.enmicrosoft?view=azure-dotnet)).

1. In Program.cs, create an instance of the [`SearchServiceClient`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchserviceclient?view=azure-dotnet) class to connect to the service, using values that are stored in the application's config file (appsettings.json). 

   `SearchServiceClient` has an [`Indexes`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchserviceclient.indexes?view=azure-dotnet) property, providing all the methods you need to create, list, update, or delete Azure Search indexes. 

    ```csharp
    namespace azure_search_getstarted_dotnet

    {
        using System;
        using Microsoft.Azure.Search;
        using Microsoft.Azure.Search.Models;
        using Microsoft.Extensions.Configuration;

        class Program { 

        // Demonstrates index delete, create, load, and query
        // Commented-out code is uncommented in later steps
        static void Main(string[] args)
        {
            IConfigurationBuilder builder = new ConfigurationBuilder().AddJsonFile("appsettings.json");
            IConfigurationRoot configuration = builder.Build();

            SearchServiceClient serviceClient = CreateSearchServiceClient(configuration);

            string indexName = configuration["SearchIndexName"];

            Console.WriteLine("{0}", "Deleting index...\n");
            DeleteIndexIfExists(indexName, serviceClient);

            Console.WriteLine("{0}", "Creating index...\n");
            CreateIndex(indexName, serviceClient);

            SearchIndexClient indexClient = serviceClient.Indexes.GetClient(indexName);

            // Uncomment next 2 lines in "2 - Load documents"
            // Console.WriteLine("{0}", "Uploading documents...\n");
            // UploadDocuments(indexClient);

            // Uncomment next 2 lines in "3 - Run queries"
            // Console.WriteLine("{0}", "Searching index...\n");
            // UploadDocuments(indexClient);

            Console.WriteLine("{0}", "Complete.  Press any key to end application...\n");
            Console.ReadKey();
            }

        // Create the search service client
        private static SearchServiceClient CreateSearchServiceClient(IConfigurationRoot configuration)
        {
            string searchServiceName = configuration["SearchServiceName"];
            string adminApiKey = configuration["SearchServiceAdminApiKey"];

            SearchServiceClient serviceClient = new SearchServiceClient(searchServiceName, new SearchCredentials(adminApiKey));
            return serviceClient;
        }

        // Delete an existing index to reuse its name
        private static void DeleteIndexIfExists(string indexName, SearchServiceClient serviceClient)
        {
            if (serviceClient.Indexes.Exists(indexName))
            {
                serviceClient.Indexes.Delete(indexName);
            }
        }

        // Create an index with a single call to "Indexes.Create"
        // This method takes as a parameter an Index object that defines an Azure Search index
        // 
        // Set the Fields property of the Index object to an array of Field objects.
        // The field array is defined in the Hotels class, which subsumes the Address class.
        private static void CreateIndex(string indexName, SearchServiceClient serviceClient)
        {
            var definition = new Index()
            {
                Name = indexName,
                Fields = FieldBuilder.BuildForType<Hotel>()
            };

            serviceClient.Indexes.Create(definition);
        }
    }
    }    
    ```

    If possible, share a single instance of `SearchServiceClient` in your application to avoid opening too many connections. Class methods are thread-safe to enable such sharing.

   The class has several constructors. The one you want takes your search service name and a `SearchCredentials` object as parameters. `SearchCredentials` wraps your api-key.

    In the index definition, the easiest way to create the `Field` objects is by calling the `FieldBuilder.BuildForType` method, passing a model class for the type parameter. A model class has properties that map to the fields of your index. This mapping allows you to bind documents from your search index to instances of your model class.

    > [!NOTE]
    > If you don't plan to use a model class, you can still define your index by creating `Field` objects directly. You can provide the name of the field to the constructor, along with the data type (or analyzer for string fields). You can also set other properties like `IsSearchable`, `IsFilterable`, to name a few.
    >

1. Optionally, as a verfication step, you can build the app at this point to create the index. 

    If the project builds successfully, a console window opens, writing status messages to the screen for deleting and creating the index. In the Azure portal, in the search service **Overview** page, you should see an empty hotels-quickstart index.

## 2 - Load documents

Documents are the unit of data ingestion in Azure Search. As obtained from an external data source, documents might be rows in a database, blobs in Blob storage, or JSON documents on disk. In this example, we're taking a shortcut and embedding four hotel JSON documents in the code itself. 

When uploading documents, it's common to submit documents in batch mode using an [`IndexBatch`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexbatch?view=azure-dotnet) object. An `IndexBatch` encapsulates a collection of [`IndexAction`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.indexaction?view=azure-dotnet) objects, each of which contains a document and a property telling Azure Search what action to perform ([upload, merge, delete, and mergeOrUpload](search-what-is-data-import.md#indexing-actions)).

1. In Program.cs, upload an array of documents and index actions, and then pass the array to `IndexBatch`. The documents below conform to the hotel-quickstart index, as defined by the hotel and address classes.

    ```csharp
    // Upload documents as a batch
    private static void UploadDocuments(ISearchIndexClient indexClient)
    {
        var actions = new IndexAction<Hotel>[]
        {
            IndexAction.Upload(
                new Hotel()
                {
                    HotelId = "1",
                    HotelName = "Secret Point Motel",
                    Description = "The hotel is ideally located on the main commercial artery of the city in the heart of New York. A few minutes away is Time's Square and the historic centre of the city, as well as other places of interest that make New York one of America's most attractive and cosmopolitan cities.",
                    DescriptionFr = "L'hôtel est idéalement situé sur la principale artère commerciale de la ville en plein cœur de New York. A quelques minutes se trouve la place du temps et le centre historique de la ville, ainsi que d'autres lieux d'intérêt qui font de New York l'une des villes les plus attractives et cosmopolites de l'Amérique.",
                    Category = "Boutique",
                    Tags = new[] { "pool", "air conditioning", "concierge" },
                    ParkingIncluded = false,
                    LastRenovationDate = new DateTimeOffset(1970, 1, 18, 0, 0, 0, TimeSpan.Zero),
                    Rating = 3.6,
                    Address = new Address()
                    {
                        StreetAddress = "677 5th Ave",
                        City = "New York",
                        StateProvince = "NY",
                        PostalCode = "10022",
                        Country = "USA"
                    }
                }
            ),
            IndexAction.Upload(
                new Hotel()
                {
                    HotelId = "2",
                    HotelName = "Twin Dome Motel",
                    Description = "The hotel is situated in a  nineteenth century plaza, which has been expanded and renovated to the highest architectural standards to create a modern, functional and first-class hotel in which art and unique historical elements coexist with the most modern comforts.",
                    DescriptionFr = "L'hôtel est situé dans une place du XIXe siècle, qui a été agrandie et rénovée aux plus hautes normes architecturales pour créer un hôtel moderne, fonctionnel et de première classe dans lequel l'art et les éléments historiques uniques coexistent avec le confort le plus moderne.",
                    Category = "Boutique",
                    Tags = new[] { "pool", "free wifi", "concierge" },
                    ParkingIncluded = false,
                    LastRenovationDate =  new DateTimeOffset(1979, 2, 18, 0, 0, 0, TimeSpan.Zero),
                    Rating = 3.60,
                    Address = new Address()
                    {
                        StreetAddress = "140 University Town Center Dr",
                        City = "Sarasota",
                        StateProvince = "FL",
                        PostalCode = "34243",
                        Country = "USA"
                    }
                }
            ),
            IndexAction.Upload(
                new Hotel()
                {
                    HotelId = "3",
                    HotelName = "Triple Landscape Hotel",
                    Description = "The Hotel stands out for its gastronomic excellence under the management of William Dough, who advises on and oversees all of the Hotel’s restaurant services.",
                    DescriptionFr = "L'hôtel est situé dans une place du XIXe siècle, qui a été agrandie et rénovée aux plus hautes normes architecturales pour créer un hôtel moderne, fonctionnel et de première classe dans lequel l'art et les éléments historiques uniques coexistent avec le confort le plus moderne.",
                    Category = "Resort and Spa",
                    Tags = new[] { "air conditioning", "bar", "continental breakfast" },
                    ParkingIncluded = true,
                    LastRenovationDate = new DateTimeOffset(2015, 9, 20, 0, 0, 0, TimeSpan.Zero),
                    Rating = 4.80,
                    Address = new Address()
                    {
                        StreetAddress = "3393 Peachtree Rd",
                        City = "Atlanta",
                        StateProvince = "GA",
                        PostalCode = "30326",
                        Country = "USA"
                    }
                }
            ),
            IndexAction.Upload(
                new Hotel()
                {
                    HotelId = "4",
                    HotelName = "Sublime Cliff Hotel",
                    Description = "Sublime Cliff Hotel is located in the heart of the historic center of Sublime in an extremely vibrant and lively area within short walking distance to the sites and landmarks of the city and is surrounded by the extraordinary beauty of churches, buildings, shops and monuments. Sublime Cliff is part of a lovingly restored 1800 palace.",
                    DescriptionFr = "Le sublime Cliff Hotel est situé au coeur du centre historique de sublime dans un quartier extrêmement animé et vivant, à courte distance de marche des sites et monuments de la ville et est entouré par l'extraordinaire beauté des églises, des bâtiments, des commerces et Monuments. Sublime Cliff fait partie d'un Palace 1800 restauré avec amour.",
                    Category = "Boutique",
                    Tags = new[] { "concierge", "view", "24-hour front desk service" },
                    ParkingIncluded = true,
                    LastRenovationDate = new DateTimeOffset(1960, 2, 06, 0, 0, 0, TimeSpan.Zero),
                    Rating = 4.6,
                    Address = new Address()
                    {
                        StreetAddress = "7400 San Pedro Ave",
                        City = "San Antonio",
                        StateProvince = "TX",
                        PostalCode = "78216",
                        Country = "USA"
                    }
                }
            ),
        };

        var batch = IndexBatch.New(actions);

        try
        {
            indexClient.Documents.Index(batch);
        }
        catch (IndexBatchException e)
        {
            // When a service is under load, indexing might fail for some documents in the batch. 
            // Depending on your application, you can compensate by delaying and retrying. 
            // For this simple demo, we just log the failed document keys and continue.
            Console.WriteLine(
                "Failed to index some of the documents: {0}",
                String.Join(", ", e.IndexingResults.Where(r => !r.Succeeded).Select(r => r.Key)));
        }

        \\ Wait 2 seconds before starting queries 
        Console.WriteLine("Waiting for indexing...\n");
        Thread.Sleep(2000);
    }
    ```

    Once you initialize the`IndexBatch` object, you can send it to the index by calling [`Documents.Index`](https://docs.microsoft.com/eotnet/api/microsoft.azure.search.documentsoperationsextensions.index?view=azure-dotnet) on your `SearchIndexClient` object. `Documents` is a property of `SearchIndexClient` that provides methods for adding, modifying, deleting, or querying documents in your index.

   [`SearchIndexClient`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchindexclient?view=azure-dotnet) load documents into an index. There are other approaches that are better suited for production scenarios, but in this example, indexClient is initialized by calling the `Indexes.GetClient` method on the `SearchServiceClient` instance that is already created, passing in the indexName to use.

    The `try`/`catch` surrounding the call to the `Index` method catches indexing failures, which might happen if your service is under heavy load. In production code, you could delay and then retry indexing the documents that failed, or log and continue like the sample does, or handle it in some other way that meets your application's data consistency requirements.

    The 2-second delay compensates for indexing, which is asynchronous, so that all documents can be indexed before the queries are executed. Coding in a delay is typically only necessary in demos, tests, and sample applications.

1. In Program.cs, in main, uncomment the lines for "2 - Load documents". 

    ```csharp
    // Uncomment next 2 lines in "2 - Load documents"
    Console.WriteLine("{0}", "Uploading documents...\n");
    UploadDocuments(indexClient);
    ```

For more information about document processing, see ["How the .NET SDK handles documents"](search-howto-dotnet-sdk.md#how-dotnet-handles-documents).

## 3 - Search an index

Create an instance of the `SearchIndexClient` class so that you can give it a query key for read-only access (as opposed to the write-access rights conferred upon the `SearchServiceClient` used in the previous lesson).

This class has several constructors. The one you want takes your search service name, index name, and a [`SearchCredentials`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchcredentials?view=azure-dotnet) object as parameters. `SearchCredentials` wraps your api-key.

The code below creates a new `SearchIndexClient` for the "hotels" index using values for the search service name and api-key that are stored in the application's config file (`appsettings.json` in the case of the [sample application](https://aka.ms/search-dotnet-howto)):

```csharp
private static SearchIndexClient CreateSearchIndexClient(IConfigurationRoot configuration)
{
    string searchServiceName = configuration["SearchServiceName"];
    string queryApiKey = configuration["SearchServiceQueryApiKey"];

    SearchIndexClient indexClient = new SearchIndexClient(searchServiceName, "hotels", new SearchCredentials(queryApiKey));
    return indexClient;
}
```

`SearchIndexClient` has a [`Documents`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchindexclient.documents?view=azure-dotnet) property. This property provides all the methods you need to query Azure Search indexes.

### Construct SearchParameters
Searching with the .NET SDK is as simple as calling the `Documents.Search` method on your `SearchIndexClient`. This method takes a few parameters, including the search text, along with a `SearchParameters` object that can be used to further refine the query.

#### Types of Queries
The two main [query types](search-query-overview.md#types-of-queries) you will use are `search` and `filter`. A `search` query searches for one or more terms in all *searchable* fields in your index. A `filter` query evaluates a boolean expression over all *filterable* fields in an index. You can use searches and filters together or separately.

Both searches and filters are performed using the `Documents.Search` method. A search query can be passed in the `searchText` parameter, while a filter expression can be passed in the `Filter` property of the `SearchParameters` class. To filter without searching, just pass `"*"` for the `searchText` parameter. To search without filtering, just leave the `Filter` property unset, or do not pass in a `SearchParameters` instance at all.

#### Example Queries
The following sample code shows a few different ways to query the "hotels" index defined in [Create an Azure Search index in C#](search-create-index-dotnet.md#DefineIndex). The documents returned with the search results are instances of the `Hotel` class, which was defined in [Import data to an Azure Search index in C#](search-import-data-dotnet.md#construct-indexbatch). The sample code makes use of a `WriteDocuments` method to output the search results to the console. This method is described in the next section.

```csharp
SearchParameters parameters;
DocumentSearchResult<Hotel> results;

Console.WriteLine("Search the entire index for the term 'budget' and return only the hotelName field:\n");

parameters =
    new SearchParameters()
    {
        Select = new[] { "hotelName" }
    };

results = indexClient.Documents.Search<Hotel>("budget", parameters);

WriteDocuments(results);

Console.Write("Apply a filter to the index to find hotels cheaper than $150 per night, ");
Console.WriteLine("and return the hotelId and description:\n");

parameters =
    new SearchParameters()
    {
        Filter = "baseRate lt 150",
        Select = new[] { "hotelId", "description" }
    };

results = indexClient.Documents.Search<Hotel>("*", parameters);

WriteDocuments(results);

Console.Write("Search the entire index, order by a specific field (lastRenovationDate) ");
Console.Write("in descending order, take the top two results, and show only hotelName and ");
Console.WriteLine("lastRenovationDate:\n");

parameters =
    new SearchParameters()
    {
        OrderBy = new[] { "lastRenovationDate desc" },
        Select = new[] { "hotelName", "lastRenovationDate" },
        Top = 2
    };

results = indexClient.Documents.Search<Hotel>("*", parameters);

WriteDocuments(results);

Console.WriteLine("Search the entire index for the term 'motel':\n");

parameters = new SearchParameters();
results = indexClient.Documents.Search<Hotel>("motel", parameters);

WriteDocuments(results);
```

### Handle search results
The `Documents.Search` method returns a `DocumentSearchResult` object that contains the results of the query. The example in the previous section used a method called `WriteDocuments` to output the search results to the console:

```csharp
private static void WriteDocuments(DocumentSearchResult<Hotel> searchResults)
{
    foreach (SearchResult<Hotel> result in searchResults.Results)
    {
        Console.WriteLine(result.Document);
    }

    Console.WriteLine();
}
```

Here is what the results look like for the queries in the previous section, assuming the "hotels" index is populated with the sample data:

```
Search the entire index for the term 'budget' and return only the hotelName field:

Name: Roach Motel

Apply a filter to the index to find hotels cheaper than $150 per night, and return the hotelId and description:

ID: 2   Description: Cheapest hotel in town
ID: 3   Description: Close to town hall and the river

Search the entire index, order by a specific field (lastRenovationDate) in descending order, take the top two results, and show only hotelName and lastRenovationDate:

Name: Fancy Stay        Last renovated on: 6/27/2010 12:00:00 AM +00:00
Name: Roach Motel       Last renovated on: 4/28/1982 12:00:00 AM +00:00

Search the entire index for the term 'motel':

ID: 2   Base rate: 79.99        Description: Cheapest hotel in town     Description (French): Hôtel le moins cher en ville      Name: Roach Motel       Category: Budget        Tags: [motel, budget]   Parking included: yes   Smoking allowed: yes    Last renovated on: 4/28/1982 12:00:00 AM +00:00 Rating: 1/5     Location: Latitude 49.678581, longitude -122.131577
```

The sample code above uses the console to output search results. You will likewise need to display search results in your own application. For an example of how to render search results in an ASP.NET MVC-based web application, see the [DotNetSample project](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetSample) on GitHub.


## Build the app

Press F5 to build the solution and run the console app. Output is reported on the screen, starting with creating objects, and concluding with running serveral queries and showing the results.


## Clean up

When you're done with an index and want to delete it, call the `Indexes.Delete` method on your `SearchServiceClient`.

```csharp
serviceClient.Indexes.Delete("hotels");
```

If you are also finished with the search service, you can delete resources from Azure portal.

## Next steps

In this C# quickstart, you worked through multiple tasks to create an index, load it with documents, and run queries.

As a next step, take a closer look at the main tasks.

> [!div class="nextstepaction"]
> [Develop in .NET](search-howto-dotnet-sdk.md)




## HEIDI

Loading an index requires SearchIndexClient. There are several ways to instantiate this class.  Call it directly, or call SearchServiceClient + Indexes.GetClient, using the Indexes property off the client.  The following example gets the hotels-quickstart index, which you would do if you were loading documents.

Use the `SearchServiceClient` instance and call its `Indexes.GetClient` method. This snippet obtains a `SearchIndexClient` for the index named "hotels-quickstart" from a `SearchServiceClient` named `serviceClient`.

```csharp
SearchIndexClient indexClient = serviceClient.Indexes.GetClient("hotels-quickstart");
```

Another approach, which is documented in howto-dotnet-sdk, is to create a class for the index (a SearchIndexClient class). This approach is useful if you need different instances of the class -- such as one for admin operations (create, edit, delete) and one for query operations (one takes an admin key, the second takes a query key). Look in that article for the principle of least privilege NOTE to see why the index class approach is more typical.

    > [!NOTE]
    > In a typical search application, querying and indexing are handled separately. While `Indexes.GetClient` is convenient because you can reuse objects like `SearchCredentials`, a more robust approach involves creating the `SearchIndexClient` directly so that you can pass in a query key instead of an admin key. This practice is consistent with the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) and helps to make your application more secure. You'll construct a `SearchIndexClient` in the next exercise. For more information about keys, see [Create and manage api-keys for an Azure Search service](search-security-api-keys.md).
    > 
    > 