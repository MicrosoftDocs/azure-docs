---
title: Use Azure Cognitive Search in .NET
titleSuffix: Azure Cognitive Search
description: Learn how to use Azure Cognitive Search in a .NET application using C# and the .NET SDK. Code-based tasks include connect to the service, index content, and query an index.

manager: nitinme
author: brjohnstmsft
ms.author: brjohnst
ms.devlang: dotnet
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---
# How to use Azure Cognitive Search from a .NET Application

This article is a walkthrough to get you up and running with the [Azure Cognitive Search .NET SDK](https://docs.microsoft.com/dotnet/api/overview/azure/search). You can use the .NET SDK to implement a rich search experience in your application using Azure Cognitive Search.

## What's in the Azure Cognitive Search SDK
The SDK consists of a few client libraries that enable you to manage your indexes, data sources, indexers, and synonym maps, as well as upload and manage documents, and execute queries, all without having to deal with the details of HTTP and JSON. These client libraries are all distributed as NuGet packages.

The main NuGet package is `Microsoft.Azure.Search`, which is a meta-package that includes all the other packages as dependencies. Use this package if you're just getting started or if you know your application will need all the features of Azure Cognitive Search.

The other NuGet packages in the SDK are:
 
  - `Microsoft.Azure.Search.Data`: Use this package if you're developing a .NET application using Azure Cognitive Search, and you only need to query or update documents in your indexes. If you also need to create or update indexes, synonym maps, or other service-level resources, use the `Microsoft.Azure.Search` package instead.
  - `Microsoft.Azure.Search.Service`: Use this package if you're developing automation in .NET to manage Azure Cognitive Search indexes, synonym maps, indexers, data sources, or other service-level resources. If you only need to query or update documents in your indexes, use the `Microsoft.Azure.Search.Data` package instead. If you need all the functionality of Azure Cognitive Search, use the `Microsoft.Azure.Search` package instead.
  - `Microsoft.Azure.Search.Common`: Common types needed by the Azure Cognitive Search .NET libraries. You do not need to use this package directly in your application. It is only meant to be used as a dependency.

The various client libraries define classes like `Index`, `Field`, and `Document`, as well as operations like `Indexes.Create` and `Documents.Search` on the `SearchServiceClient` and `SearchIndexClient` classes. These classes are organized into the following namespaces:

* [Microsoft.Azure.Search](https://docs.microsoft.com/dotnet/api/microsoft.azure.search)
* [Microsoft.Azure.Search.Models](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models)

If you would like to provide feedback for a future update of the SDK, see our [feedback page](https://feedback.azure.com/forums/263029-azure-search/) or create an issue on [GitHub](https://github.com/azure/azure-sdk-for-net/issues) and mention "Azure Cognitive Search" in the issue title.

The .NET SDK targets version `2019-05-06` of the [Azure Cognitive Search REST API](https://docs.microsoft.com/rest/api/searchservice/). This version includes support for [complex types](search-howto-complex-data-types.md), [AI enrichment](cognitive-search-concept-intro.md), [autocomplete](https://docs.microsoft.com/rest/api/searchservice/autocomplete), and [JsonLines parsing mode](search-howto-index-json-blobs.md) when indexing Azure Blobs. 

This SDK does not support [Management Operations](https://docs.microsoft.com/rest/api/searchmanagement/) such as creating and scaling Search services and managing API keys. If you need to manage your Search resources from a .NET application, you can use the [Azure Cognitive Search .NET Management SDK](https://aka.ms/search-mgmt-sdk).

## Upgrading to the latest version of the SDK
If you're already using an older version of the Azure Cognitive Search .NET SDK and you'd like to upgrade to the latest generally available version, [this article](search-dotnet-sdk-migration-version-9.md) explains how.

## Requirements for the SDK
1. Visual Studio 2017 or later.
2. Your own Azure Cognitive Search service. In order to use the SDK, you will need the name of your service and one or more API keys. [Create a service in the portal](search-create-service-portal.md) will help you through these steps.
3. Download the Azure Cognitive Search .NET SDK [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Search) by using "Manage NuGet Packages" in Visual Studio. Just search for the package name `Microsoft.Azure.Search` on NuGet.org (or one of the other package names above if you only need a subset of the functionality).

The Azure Cognitive Search .NET SDK supports applications targeting the .NET Framework 4.5.2 and higher, as well as .NET Core 2.0 and higher.

## Core scenarios
There are several things you'll need to do in your search application. In this tutorial, we'll cover these core scenarios:

* Creating an index
* Populating the index with documents
* Searching for documents using full-text search and filters

The following sample code illustrates each of these scenarios. Feel free to use the code snippets in your own application.

### Overview
The sample application we'll be exploring creates a new index named "hotels", populates it with a few documents, then executes some search queries. Here is the main program, showing the overall flow:

```csharp
// This sample shows how to delete, create, upload documents and query an index
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

    ISearchIndexClient indexClient = serviceClient.Indexes.GetClient(indexName);

    Console.WriteLine("{0}", "Uploading documents...\n");
    UploadDocuments(indexClient);

    ISearchIndexClient indexClientForQueries = CreateSearchIndexClient(configuration);

    RunQueries(indexClientForQueries);

    Console.WriteLine("{0}", "Complete.  Press any key to end application...\n");
    Console.ReadKey();
}
```

> [!NOTE]
> You can find the full source code of the sample application used in this walk through on [GitHub](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo).
> 
>

We'll walk through this step by step. First we need to create a new `SearchServiceClient`. This object allows you to manage indexes. In order to construct one, you need to provide your Azure Cognitive Search service name as well as an admin API key. You can enter this information in the `appsettings.json` file of the [sample application](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo).

```csharp
private static SearchServiceClient CreateSearchServiceClient(IConfigurationRoot configuration)
{
    string searchServiceName = configuration["SearchServiceName"];
    string adminApiKey = configuration["SearchServiceAdminApiKey"];

    SearchServiceClient serviceClient = new SearchServiceClient(searchServiceName, new SearchCredentials(adminApiKey));
    return serviceClient;
}
```

> [!NOTE]
> If you provide an incorrect key (for example, a query key where an admin key was required), the `SearchServiceClient` will throw a `CloudException` with the error message "Forbidden" the first time you call an operation method on it, such as `Indexes.Create`. If this happens to you, double-check our API key.
> 
> 

The next few lines call methods to create an index named "hotels", deleting it first if it already exists. We will walk through these methods a little later.

```csharp
Console.WriteLine("{0}", "Deleting index...\n");
DeleteIndexIfExists(indexName, serviceClient);

Console.WriteLine("{0}", "Creating index...\n");
CreateIndex(indexName, serviceClient);
```

Next, the index needs to be populated. To do populate the index, we will need a `SearchIndexClient`. There are two ways to obtain one: by constructing it, or by calling `Indexes.GetClient` on the `SearchServiceClient`. We use the latter for convenience.

```csharp
ISearchIndexClient indexClient = serviceClient.Indexes.GetClient(indexName);
```

> [!NOTE]
> In a typical search application, index management and population may be handled by a separate component from search queries. `Indexes.GetClient` is convenient for populating an index because it saves you the trouble of providing additional `SearchCredentials`. It does this by passing the admin key that you used to create the `SearchServiceClient` to the new `SearchIndexClient`. However, in the part of your application that executes queries, it is better to create the `SearchIndexClient` directly so that you can pass in a query key, which only allows you to read data, instead of an admin key. This is consistent with the principle of least privilege and will help to make your application more secure. You can find out more about admin keys and query keys [here](https://docs.microsoft.com/rest/api/searchservice/#authentication-and-authorization).
> 
> 

Now that we have a `SearchIndexClient`, we can populate the index. Index population is done by another method that we will walk through later.

```csharp
Console.WriteLine("{0}", "Uploading documents...\n");
UploadDocuments(indexClient);
```

Finally, we execute a few search queries and display the results. This time we use a different `SearchIndexClient`:

```csharp
ISearchIndexClient indexClientForQueries = CreateSearchIndexClient(indexName, configuration);

RunQueries(indexClientForQueries);
```

We will take a closer look at the `RunQueries` method later. Here is the code to create the new `SearchIndexClient`:

```csharp
private static SearchIndexClient CreateSearchIndexClient(string indexName, IConfigurationRoot configuration)
{
    string searchServiceName = configuration["SearchServiceName"];
    string queryApiKey = configuration["SearchServiceQueryApiKey"];

    SearchIndexClient indexClient = new SearchIndexClient(searchServiceName, indexName, new SearchCredentials(queryApiKey));
    return indexClient;
}
```

This time we use a query key since we do not need write access to the index. You can enter this information in the `appsettings.json` file of the [sample application](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo).

If you run this application with a valid service name and API keys, the output should look like this example:
(Some console output has been replaced with "..." for illustration purposes.)

	Deleting index...

	Creating index...

	Uploading documents...

	Waiting for documents to be indexed...

	Search the entire index for the term 'motel' and return only the HotelName field:

	Name: Secret Point Motel

	Name: Twin Dome Motel


	Apply a filter to the index to find hotels with a room cheaper than $100 per night, and return the hotelId and description:

	HotelId: 1
	Description: The hotel is ideally located on the main commercial artery of the city in the heart of New York. A few minutes away is Times Square and the historic centre of the city, as well as other places of interest that make New York one of America's most attractive and cosmopolitan cities.

	HotelId: 2
	Description: The hotel is situated in a  nineteenth century plaza, which has been expanded and renovated to the highest architectural standards to create a modern, functional and first-class hotel in which art and unique historical elements coexist with the most modern comforts.


	Search the entire index, order by a specific field (lastRenovationDate) in descending order, take the top two results, and show only hotelName and lastRenovationDate:

	Name: Triple Landscape Hotel
	Last renovated on: 9/20/2015 12:00:00 AM +00:00

	Name: Twin Dome Motel
	Last renovated on: 2/18/1979 12:00:00 AM +00:00


	Search the hotel names for the term 'hotel':

	HotelId: 3
	Name: Triple Landscape Hotel
	...

	Complete.  Press any key to end application... 

The full source code of the application is provided at the end of this article.

Next, we will take a closer look at each of the methods called by `Main`.

### Creating an index
After creating a `SearchServiceClient`, `Main` deletes the "hotels" index if it already exists. That deletion is done by the following method:

```csharp
private static void DeleteIndexIfExists(string indexName, SearchServiceClient serviceClient)
{
    if (serviceClient.Indexes.Exists(indexName))
    {
        serviceClient.Indexes.Delete(indexName);
    }
}
```

This method uses the given `SearchServiceClient` to check if the index exists, and if so, delete it.

> [!NOTE]
> The example code in this article uses the synchronous methods of the Azure Cognitive Search .NET SDK for simplicity. We recommend that you use the asynchronous methods in your own applications to keep them scalable and responsive. For example, in the method above you could use `ExistsAsync` and `DeleteAsync` instead of `Exists` and `Delete`.
> 
> 

Next, `Main` creates a new "hotels" index by calling this method:

```csharp
private static void CreateIndex(string indexName, SearchServiceClient serviceClient)
{
    var definition = new Index()
    {
        Name = indexName,
        Fields = FieldBuilder.BuildForType<Hotel>()
    };
    
    serviceClient.Indexes.Create(definition);
}
```

This method creates a new `Index` object with a list of `Field` objects that defines the schema of the new index. Each field has a name, data type, and several attributes that define its search behavior. The `FieldBuilder` class uses reflection to create a list of `Field` objects for the index by examining the public properties and attributes of the given `Hotel` model class. We'll take a closer look at the `Hotel` class later on.

> [!NOTE]
> You can always create the list of `Field` objects directly instead of using `FieldBuilder` if needed. For example, you may not want to use a model class or you may need to use an existing model class that you don't want to modify by adding attributes.
>
> 

In addition to fields, you can also add scoring profiles, suggesters, or CORS options to the Index (these parameters are omitted from the sample for brevity). You can find more information about the Index object and its constituent parts in the [SDK reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.index), as well as in the [Azure Cognitive Search REST API reference](https://docs.microsoft.com/rest/api/searchservice/).

### Populating the index
The next step in `Main` populates the newly-created index. This index population is done in the following method:
(Some code replaced with "..." for illustration purposes.  See the full sample solution for the full data population code.)

```csharp
private static void UploadDocuments(ISearchIndexClient indexClient)
{
    var hotels = new Hotel[]
    {
        new Hotel()
        {
            HotelId = "1",
            HotelName = "Secret Point Motel",
            ...
            Address = new Address()
            {
                StreetAddress = "677 5th Ave",
                ...
            },
            Rooms = new Room[]
            {
                new Room()
                {
                    Description = "Budget Room, 1 Queen Bed (Cityside)",
                    ...
                },
                new Room()
                {
                    Description = "Budget Room, 1 King Bed (Mountain View)",
                    ...
                },
                new Room()
                {
                    Description = "Deluxe Room, 2 Double Beds (City View)",
                    ...
                }
            }
        },
        new Hotel()
        {
            HotelId = "2",
            HotelName = "Twin Dome Motel",
            ...
            {
                StreetAddress = "140 University Town Center Dr",
                ...
            },
            Rooms = new Room[]
            {
                new Room()
                {
                    Description = "Suite, 2 Double Beds (Mountain View)",
                    ...
                },
                new Room()
                {
                    Description = "Standard Room, 1 Queen Bed (City View)",
                    ...
                },
                new Room()
                {
                    Description = "Budget Room, 1 King Bed (Waterfront View)",
                    ...
                }
            }
        },
        new Hotel()
        {
            HotelId = "3",
            HotelName = "Triple Landscape Hotel",
            ...
            Address = new Address()
            {
                StreetAddress = "3393 Peachtree Rd",
                ...
            },
            Rooms = new Room[]
            {
                new Room()
                {
                    Description = "Standard Room, 2 Queen Beds (Amenities)",
                    ...
                },
                new Room ()
                {
                    Description = "Standard Room, 2 Double Beds (Waterfront View)",
                    ...
                },
                new Room()
                {
                    Description = "Deluxe Room, 2 Double Beds (Cityside)",
                    ...
                }
            }
        }
    };

    var batch = IndexBatch.Upload(hotels);

    try
    {
        indexClient.Documents.Index(batch);
    }
    catch (IndexBatchException e)
    {
        // Sometimes when your Search service is under load, indexing will fail for some of the documents in
        // the batch. Depending on your application, you can take compensating actions like delaying and
        // retrying. For this simple demo, we just log the failed document keys and continue.
        Console.WriteLine(
            "Failed to index some of the documents: {0}",
            String.Join(", ", e.IndexingResults.Where(r => !r.Succeeded).Select(r => r.Key)));
    }

    Console.WriteLine("Waiting for documents to be indexed...\n");
    Thread.Sleep(2000);
}
```

This method has four parts. The first creates an array of 3 `Hotel` objects each with 3 `Room` objects that will serve as our input data to upload to the index. This data is hard-coded for simplicity. In your own application, your data will likely come from an external data source such as a SQL database.

The second part creates an `IndexBatch` containing the documents. You specify the operation you want to apply to the batch at the time you create it, in this case by calling `IndexBatch.Upload`. The batch is then uploaded to the Azure Cognitive Search index by the `Documents.Index` method.

> [!NOTE]
> In this example, we are just uploading documents. If you wanted to merge changes into existing documents or delete documents, you could create batches by calling `IndexBatch.Merge`, `IndexBatch.MergeOrUpload`, or `IndexBatch.Delete` instead. You can also mix different operations in a single batch by calling `IndexBatch.New`, which takes a collection of `IndexAction` objects, each of which tells Azure Cognitive Search to perform a particular operation on a document. You can create each `IndexAction` with its own operation by calling the corresponding method such as `IndexAction.Merge`, `IndexAction.Upload`, and so on.
> 
> 

The third part of this method is a catch block that handles an important error case for indexing. If your Azure Cognitive Search service fails to index some of the documents in the batch, an `IndexBatchException` is thrown by `Documents.Index`. This exception can happen if you are indexing documents while your service is under heavy load. **We strongly recommend explicitly handling this case in your code.** You can delay and then retry indexing the documents that failed, or you can log and continue like the sample does, or you can do something else depending on your application's data consistency requirements.

> [!NOTE]
> You can use the [`FindFailedActionsToRetry`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.indexbatchexception.findfailedactionstoretry) method to construct a new batch containing only the actions that failed in a previous call to `Index`. There is a discussion of how to properly use it [on StackOverflow](https://stackoverflow.com/questions/40012885/azure-search-net-sdk-how-to-use-findfailedactionstoretry).
>
>

Finally, the `UploadDocuments` method delays for two seconds. Indexing happens asynchronously in your Azure Cognitive Search service, so the sample application needs to wait a short time to ensure that the documents are available for searching. Delays like this are typically only necessary in demos, tests, and sample applications.

<a name="how-dotnet-handles-documents"></a>

#### How the .NET SDK handles documents
You may be wondering how the Azure Cognitive Search .NET SDK is able to upload instances of a user-defined class like `Hotel` to the index. To help answer that question, let's look at the `Hotel` class:

```csharp
using System;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using Microsoft.Spatial;
using Newtonsoft.Json;

public partial class Hotel
{
    [System.ComponentModel.DataAnnotations.Key]
    [IsFilterable]
    public string HotelId { get; set; }

    [IsSearchable, IsSortable]
    public string HotelName { get; set; }

    [IsSearchable]
    [Analyzer(AnalyzerName.AsString.EnLucene)]
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

    // SmokingAllowed reflects whether any room in the hotel allows smoking.
    // The JsonIgnore attribute indicates that a field should not be created 
    // in the index for this property and it will only be used by code in the client.
    [JsonIgnore]
    public bool? SmokingAllowed => (Rooms != null) ? Array.Exists(Rooms, element => element.SmokingAllowed == true) : (bool?)null;

    [IsFilterable, IsSortable, IsFacetable]
    public DateTimeOffset? LastRenovationDate { get; set; }

    [IsFilterable, IsSortable, IsFacetable]
    public double? Rating { get; set; }

    public Address Address { get; set; }

    [IsFilterable, IsSortable]
    public GeographyPoint Location { get; set; }

    public Room[] Rooms { get; set; }
}
```

The first thing to notice is that the name of each public property in the `Hotel` class will map to a field with the same name in the index definition. If you would like each field to start with a lower-case letter ("camel case"), you can tell the SDK to map the property names to camel-case automatically with the `[SerializePropertyNamesAsCamelCase]` attribute on the class. This scenario is common in .NET applications that perform data-binding where the target schema is outside the control of the application developer without having to violate the "Pascal case" naming guidelines in .NET.

> [!NOTE]
> The Azure Cognitive Search .NET SDK uses the [NewtonSoft JSON.NET](https://www.newtonsoft.com/json/help/html/Introduction.htm) library to serialize and deserialize your custom model objects to and from JSON. You can customize this serialization if needed. For more information, see [Custom Serialization with JSON.NET](#JsonDotNet).
> 
> 

The second thing to notice is each property is decorated with attributes such as `IsFilterable`, `IsSearchable`, `Key`, and `Analyzer`. These attributes map directly to the [corresponding field attributes in an Azure Cognitive Search index](/rest/api/searchservice/create-index). The `FieldBuilder` class uses these properties to construct field definitions for the index.

The third important thing about the `Hotel` class is the data types of the public properties. The .NET types of these properties map to their equivalent field types in the index definition. For example, the `Category` string property maps to the `category` field, which is of type `Edm.String`. There are similar type mappings between `bool?`, `Edm.Boolean`, `DateTimeOffset?`, and `Edm.DateTimeOffset` and so on. The specific rules for the type mapping are documented with the `Documents.Get` method in the [Azure Cognitive Search .NET SDK reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.documentsoperationsextensions.get). The `FieldBuilder` class takes care of this mapping for you, but it can still be helpful to understand in case you need to troubleshoot any serialization issues.

Did you happen to notice the `SmokingAllowed` property?

```csharp
[JsonIgnore]
public bool? SmokingAllowed => (Rooms != null) ? Array.Exists(Rooms, element => element.SmokingAllowed == true) : (bool?)null;
```

The `JsonIgnore` attribute on this property tells the `FieldBuilder` to not serialize it to the index as a field.  This is a great way to create client-side calculated properties you can use as helpers in your application.  In this case, the `SmokingAllowed` property reflects whether any `Room` in the `Rooms` collection allows smoking.  If all are false, it indicates that the entire hotel does not allow smoking.

Some properties such as `Address` and `Rooms` are instances of .NET classes.  These properties represent more complex data structures and, as a result, require fields with a [complex data type](https://docs.microsoft.com/azure/search/search-howto-complex-data-types) in the index.

The `Address` property represents a set of multiple values in the `Address` class, defined below:

```csharp
using System;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using Newtonsoft.Json;

namespace AzureSearch.SDKHowTo
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

This class contains the standard values used to describe addresses in the United States or Canada. You can use types like this to group logical fields together in the index.

The `Rooms` property represents an array of `Room` objects:

```csharp
using System;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using Newtonsoft.Json;

namespace AzureSearch.SDKHowTo
{
    public partial class Room
    {
        [IsSearchable]
        [Analyzer(AnalyzerName.AsString.EnMicrosoft)]
        public string Description { get; set; }

        [IsSearchable]
        [Analyzer(AnalyzerName.AsString.FrMicrosoft)]
        [JsonProperty("Description_fr")]
        public string DescriptionFr { get; set; }

        [IsSearchable, IsFilterable, IsFacetable]
        public string Type { get; set; }

        [IsFilterable, IsFacetable]
        public double? BaseRate { get; set; }

        [IsSearchable, IsFilterable, IsFacetable]
        public string BedOptions { get; set; }

        [IsFilterable, IsFacetable]
        public int SleepsCount { get; set; }

        [IsFilterable, IsFacetable]
        public bool? SmokingAllowed { get; set; }

        [IsSearchable, IsFilterable, IsFacetable]
        public string[] Tags { get; set; }
    }
}
```

Your data model in .NET and its corresponding index schema should be designed to support the search experience you'd like to give to your end user. Each top level object in .NET, ie document in the index, corresponds to a search result you would present in your user interface. For example, in a hotel search application your end users may want to search by hotel name, features of the hotel, or the characteristics of a particular room. We'll cover some query examples a little later.

This ability to use your own classes to interact with documents in the index works in both directions; You can also retrieve search results and have the SDK automatically deserialize them to a type of your choice, as we will see in the next section.

> [!NOTE]
> The Azure Cognitive Search .NET SDK also supports dynamically-typed documents using the `Document` class, which is a key/value mapping of field names to field values. This is useful in scenarios where you don't know the index schema at design-time, or where it would be inconvenient to bind to specific model classes. All the methods in the SDK that deal with documents have overloads that work with the `Document` class, as well as strongly-typed overloads that take a generic type parameter. Only the latter are used in the sample code in this tutorial. The [`Document` class](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.document) inherits from `Dictionary<string, object>`.
> 
>

**Why you should use nullable data types**

When designing your own model classes to map to an Azure Cognitive Search index, we recommend declaring properties of value types such as `bool` and `int` to be nullable (for example, `bool?` instead of `bool`). If you use a non-nullable property, you have to **guarantee** that no documents in your index contain a null value for the corresponding field. Neither the SDK nor the Azure Cognitive Search service will help you to enforce this.

This is not just a hypothetical concern: Imagine a scenario where you add a new field to an existing index that is of type `Edm.Int32`. After updating the index definition, all documents will have a null value for that new field (since all types are nullable in Azure Cognitive Search). If you then use a model class with a non-nullable `int` property for that field, you will get a `JsonSerializationException` like this when trying to retrieve documents:

    Error converting value {null} to type 'System.Int32'. Path 'IntValue'.

For this reason, we recommend that you use nullable types in your model classes as a best practice.

<a name="JsonDotNet"></a>

#### Custom Serialization with JSON.NET
The SDK uses JSON.NET for serializing and deserializing documents. You can customize serialization and deserialization if needed by defining your own `JsonConverter` or `IContractResolver`. For more information, see the [JSON.NET documentation](https://www.newtonsoft.com/json/help/html/Introduction.htm). This can be useful when you want to adapt an existing model class from your application for use with Azure Cognitive Search, and other more advanced scenarios. For example, with custom serialization you can:

* Include or exclude certain properties of your model class from being stored as document fields.
* Map between property names in your code and field names in your index.
* Create custom attributes that can be used for mapping properties to document fields.

You can find examples of implementing custom serialization in the unit tests for the Azure Cognitive Search .NET SDK on GitHub. A good starting point is [this folder](https://github.com/Azure/azure-sdk-for-net/tree/4f6f4e4c90200c1b0621c4cead302a91e89f2aba/sdk/search/Microsoft.Azure.Search/tests/Tests/Models). It contains classes that are used by the custom serialization tests.

### Searching for documents in the index
The last step in the sample application is to search for some documents in the index:

```csharp
private static void RunQueries(ISearchIndexClient indexClient)
{
    SearchParameters parameters;
    DocumentSearchResult<Hotel> results;

    Console.WriteLine("Search the entire index for the term 'motel' and return only the HotelName field:\n");

    parameters =
        new SearchParameters()
        {
            Select = new[] { "HotelName" }
        };

    results = indexClient.Documents.Search<Hotel>("motel", parameters);

    WriteDocuments(results);

    Console.Write("Apply a filter to the index to find hotels with a room cheaper than $100 per night, ");
    Console.WriteLine("and return the hotelId and description:\n");

    parameters =
        new SearchParameters()
        {
            Filter = "Rooms/any(r: r/BaseRate lt 100)",
            Select = new[] { "HotelId", "Description" }
        };

    results = indexClient.Documents.Search<Hotel>("*", parameters);

    WriteDocuments(results);

    Console.Write("Search the entire index, order by a specific field (lastRenovationDate) ");
    Console.Write("in descending order, take the top two results, and show only hotelName and ");
    Console.WriteLine("lastRenovationDate:\n");

    parameters =
        new SearchParameters()
        {
            OrderBy = new[] { "LastRenovationDate desc" },
            Select = new[] { "HotelName", "LastRenovationDate" },
            Top = 2
        };

    results = indexClient.Documents.Search<Hotel>("*", parameters);

    WriteDocuments(results);

    Console.WriteLine("Search the entire index for the term 'hotel':\n");

    parameters = new SearchParameters();
    results = indexClient.Documents.Search<Hotel>("hotel", parameters);

    WriteDocuments(results);
}
```

Each time it executes a query, this method first creates a new `SearchParameters` object. This object is used to specify additional options for the query such as sorting, filtering, paging, and faceting. In this method, we're setting the `Filter`, `Select`, `OrderBy`, and `Top` property for different queries. All the `SearchParameters` properties are documented [here](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.searchparameters).

The next step is to actually execute the search query. Running the search is done using the `Documents.Search` method. For each query, we pass the search text to use as a string (or `"*"` if there is no search text), plus the search parameters created earlier. We also specify `Hotel` as the type parameter for `Documents.Search`, which tells the SDK to deserialize documents in the search results into objects of type `Hotel`.

> [!NOTE]
> You can find more information about the search query expression syntax [here](https://docs.microsoft.com/rest/api/searchservice/Simple-query-syntax-in-Azure-Search).
> 
> 

Finally, after each query this method iterates through all the matches in the search results, printing each document to the console:

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

Let's take a closer look at each of the queries in turn. Here is the code to execute the first query:

```csharp
parameters =
    new SearchParameters()
    {
        Select = new[] { "HotelName" }
    };

results = indexClient.Documents.Search<Hotel>("motel", parameters);

WriteDocuments(results);
```

In this case, we're searching the entire index for the word "motel" in any searchable field and we only want to retrieve the hotel names, as specified by the `Select` parameter. Here are the results:

    Name: Secret Point Motel

    Name: Twin Dome Motel

The next query is a little more interesting.  We want to find any hotels that have a room with a nightly rate of less than $100 and return only the hotel ID and description:

```csharp
parameters =
    new SearchParameters()
    {
        Filter = "Rooms/any(r: r/BaseRate lt 100)",
        Select = new[] { "HotelId", "Description" }
    };

results = indexClient.Documents.Search<Hotel>("*", parameters);

WriteDocuments(results);
```

This query uses an OData `$filter` expression, `Rooms/any(r: r/BaseRate lt 100)`, to filter the documents in the index. This uses the [any operator](https://docs.microsoft.com/azure/search/search-query-odata-collection-operators) to apply the 'BaseRate lt 100' to every item in the Rooms collection. You can find out more about the OData syntax that Azure Cognitive Search supports [here](https://docs.microsoft.com/azure/search/query-odata-filter-orderby-syntax).

Here are the results of the query:

	HotelId: 1
	Description: The hotel is ideally located on the main commercial artery of the city in the heart of New York...

	HotelId: 2
	Description: The hotel is situated in a nineteenth century plaza, which has been expanded and renovated to...

Next, we want to find the top two hotels that have been most recently renovated, and show the hotel name and last renovation date. Here is the code: 

```csharp
parameters =
    new SearchParameters()
    {
        OrderBy = new[] { "LastRenovationDate desc" },
        Select = new[] { "HotelName", "LastRenovationDate" },
        Top = 2
    };

results = indexClient.Documents.Search<Hotel>("*", parameters);

WriteDocuments(results);
```

In this case, we again use OData syntax to specify the `OrderBy` parameter as `lastRenovationDate desc`. We also set `Top` to 2 to ensure we only get the top two documents. As before, we set `Select` to specify which fields should be returned.

Here are the results:

	Name: Fancy Stay        Last renovated on: 6/27/2010 12:00:00 AM +00:00
	Name: Roach Motel       Last renovated on: 4/28/1982 12:00:00 AM +00:00

Finally, we want to find all hotels names that match the word "hotel":

```csharp
parameters = new SearchParameters()
{
    SearchFields = new[] { "HotelName" }
};
results = indexClient.Documents.Search<Hotel>("hotel", parameters);

WriteDocuments(results);
```

And here are the results, which include all fields since we did not specify the `Select` property:

	HotelId: 3
	Name: Triple Landscape Hotel
	...

This step completes the tutorial, but don't stop here. **Next steps provide additional resources for learning more about Azure Cognitive Search.

## Next steps
* Browse the references for the [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.search) and [REST API](https://docs.microsoft.com/rest/api/searchservice/).
* Review [naming conventions](https://docs.microsoft.com/rest/api/searchservice/Naming-rules) to learn the rules for naming various objects.
* Review [supported data types](https://docs.microsoft.com/rest/api/searchservice/Supported-data-types) in Azure Cognitive Search.
