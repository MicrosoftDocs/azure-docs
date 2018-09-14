---
title: How to use Azure Search from a .NET Application | Microsoft Docs
description: How to use Azure Search from a .NET Application
author: brjohnstmsft
manager: jlembicz
services: search
ms.service: search
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 04/20/2018
ms.author: brjohnst

---
# How to use Azure Search from a .NET Application
This article is a walkthrough to get you up and running with the [Azure Search .NET SDK](https://aka.ms/search-sdk). You can use the .NET SDK to implement a rich search experience in your application using Azure Search.

## What's in the Azure Search SDK
The SDK consists of a few client libraries that enable you to manage your indexes, data sources, indexers, and synonym maps, as well as upload and manage documents, and execute queries, all without having to deal with the details of HTTP and JSON. These client libraries are all distributed as NuGet packages.

The main NuGet package is `Microsoft.Azure.Search`, which is a meta-package that includes all the other packages as dependencies. Use this package if you're just getting started or if you know your application will need all the features of Azure Search.

The other NuGet packages in the SDK are:
 
  - `Microsoft.Azure.Search.Data`: Use this package if you're developing a .NET application using Azure Search, and you only need to query or update documents in your indexes. If you also need to create or update indexes, synonym maps, or other service-level resources, use the `Microsoft.Azure.Search` package instead.
  - `Microsoft.Azure.Search.Service`: Use this package if you're developing automation in .NET to manage Azure Search indexes, synonym maps, indexers, data sources, or other service-level resources. If you only need to query or update documents in your indexes, use the `Microsoft.Azure.Search.Data` package instead. If you need all the functionality of Azure Search, use the `Microsoft.Azure.Search` package instead.
  - `Microsoft.Azure.Search.Common`: Common types needed by the Azure Search .NET libraries. You should not need to use this package directly in your application; It is only meant to be used as a dependency.

The various client libraries define classes like `Index`, `Field`, and `Document`, as well as operations like `Indexes.Create` and `Documents.Search` on the `SearchServiceClient` and `SearchIndexClient` classes. These classes are organized into the following namespaces:

* [Microsoft.Azure.Search](https://docs.microsoft.com/dotnet/api/microsoft.azure.search)
* [Microsoft.Azure.Search.Models](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models)

The current version of the Azure Search .NET SDK is now generally available. If you would like to provide feedback for us to incorporate in the next version, please visit our [feedback page](https://feedback.azure.com/forums/263029-azure-search/).

The .NET SDK supports version `2017-11-11` of the [Azure Search REST API](https://docs.microsoft.com/rest/api/searchservice/). This version now includes support for synonyms, as well as incremental improvements to indexers. Preview features that are *not* part of this version, such as support for indexing JSON arrays and CSV files, are in [preview](search-api-2016-09-01-preview.md) and available via [4.0-preview version of the .NET SDK](https://aka.ms/search-sdk-preview).

This SDK does not support [Management Operations](https://docs.microsoft.com/rest/api/searchmanagement/) such as creating and scaling Search services and managing API keys. If you need to manage your Search resources from a .NET application, you can use the [Azure Search .NET Management SDK](https://aka.ms/search-mgmt-sdk).

## Upgrading to the latest version of the SDK
If you're already using an older version of the Azure Search .NET SDK and you'd like to upgrade to the new generally available version, [this article](search-dotnet-sdk-migration-version-5.md) explains how.

## Requirements for the SDK
1. Visual Studio 2017.
2. Your own Azure Search service. In order to use the SDK, you will need the name of your service and one or more API keys. [Create a service in the portal](search-create-service-portal.md) will help you through these steps.
3. Download the Azure Search .NET SDK [NuGet package](http://www.nuget.org/packages/Microsoft.Azure.Search) by using "Manage NuGet Packages" in Visual Studio. Just search for the package name `Microsoft.Azure.Search` on NuGet.org (or one of the other package names above if you only need a subset of the functionality).

The Azure Search .NET SDK supports applications targeting the .NET Framework 4.5.2 and higher, as well as .NET Core.

## Core scenarios
There are several things you'll need to do in your search application. In this tutorial, we'll cover these core scenarios:

* Creating an index
* Populating the index with documents
* Searching for documents using full-text search and filters

The sample code that follows illustrates each of these. Feel free to use the code snippets in your own application.

### Overview
The sample application we'll be exploring creates a new index named "hotels", populates it with a few documents, then executes some search queries. Here is the main program, showing the overall flow:

```csharp
// This sample shows how to delete, create, upload documents and query an index
static void Main(string[] args)
{
    IConfigurationBuilder builder = new ConfigurationBuilder().AddJsonFile("appsettings.json");
    IConfigurationRoot configuration = builder.Build();

    SearchServiceClient serviceClient = CreateSearchServiceClient(configuration);

    Console.WriteLine("{0}", "Deleting index...\n");
    DeleteHotelsIndexIfExists(serviceClient);

    Console.WriteLine("{0}", "Creating index...\n");
    CreateHotelsIndex(serviceClient);

    ISearchIndexClient indexClient = serviceClient.Indexes.GetClient("hotels");

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

We'll walk through this step by step. First we need to create a new `SearchServiceClient`. This object allows you to manage indexes. In order to construct one, you need to provide your Azure Search service name as well as an admin API key. You can enter this information in the `appsettings.json` file of the [sample application](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo).

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
DeleteHotelsIndexIfExists(serviceClient);

Console.WriteLine("{0}", "Creating index...\n");
CreateHotelsIndex(serviceClient);
```

Next, the index needs to be populated. To do this, we will need a `SearchIndexClient`. There are two ways to obtain one: by constructing it, or by calling `Indexes.GetClient` on the `SearchServiceClient`. We use the latter for convenience.

```csharp
ISearchIndexClient indexClient = serviceClient.Indexes.GetClient("hotels");
```

> [!NOTE]
> In a typical search application, index management and population is handled by a separate component from search queries. `Indexes.GetClient` is convenient for populating an index because it saves you the trouble of providing another `SearchCredentials`. It does this by passing the admin key that you used to create the `SearchServiceClient` to the new `SearchIndexClient`. However, in the part of your application that executes queries, it is better to create the `SearchIndexClient` directly so that you can pass in a query key instead of an admin key. This is consistent with the principle of least privilege and will help to make your application more secure. You can find out more about admin keys and query keys [here](https://docs.microsoft.com/rest/api/searchservice/#authentication-and-authorization).
> 
> 

Now that we have a `SearchIndexClient`, we can populate the index. This is done by another method that we will walk through later.

```csharp
Console.WriteLine("{0}", "Uploading documents...\n");
UploadDocuments(indexClient);
```

Finally, we execute a few search queries and display the results. This time we use a different `SearchIndexClient`:

```csharp
ISearchIndexClient indexClientForQueries = CreateSearchIndexClient(configuration);

RunQueries(indexClientForQueries);
```

We will take a closer look at the `RunQueries` method later. Here is the code to create the new `SearchIndexClient`:

```csharp
private static SearchIndexClient CreateSearchIndexClient(IConfigurationRoot configuration)
{
    string searchServiceName = configuration["SearchServiceName"];
    string queryApiKey = configuration["SearchServiceQueryApiKey"];

    SearchIndexClient indexClient = new SearchIndexClient(searchServiceName, "hotels", new SearchCredentials(queryApiKey));
    return indexClient;
}
```

This time we use a query key since we do not need write access to the index. You can enter this information in the `appsettings.json` file of the [sample application](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo).

If you run this application with a valid service name and API keys, the output should look like this:

	Deleting index...
	
	Creating index...
	
	Uploading documents...
	
	Waiting for documents to be indexed...
	
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
	
	Complete.  Press any key to end application...

The full source code of the application is provided at the end of this article.

Next, we will take a closer look at each of the methods called by `Main`.

### Creating an index
After creating a `SearchServiceClient`, the next thing `Main` does is delete the "hotels" index if it already exists. That is done by the following method:

```csharp
private static void DeleteHotelsIndexIfExists(SearchServiceClient serviceClient)
{
    if (serviceClient.Indexes.Exists("hotels"))
    {
        serviceClient.Indexes.Delete("hotels");
    }
}
```

This method uses the given `SearchServiceClient` to check if the index exists, and if so, delete it.

> [!NOTE]
> The example code in this article uses the synchronous methods of the Azure Search .NET SDK for simplicity. We recommend that you use the asynchronous methods in your own applications to keep them scalable and responsive. For example, in the method above you could use `ExistsAsync` and `DeleteAsync` instead of `Exists` and `Delete`.
> 
> 

Next, `Main` creates a new "hotels" index by calling this method:

```csharp
private static void CreateHotelsIndex(SearchServiceClient serviceClient)
{
    var definition = new Index()
    {
        Name = "hotels",
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

In addition to fields, you can also add scoring profiles, suggesters, or CORS options to the Index (these are omitted from the sample for brevity). You can find more information about the Index object and its constituent parts in the [SDK reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.index#microsoft_azure_search_models_index), as well as in the [Azure Search REST API reference](https://docs.microsoft.com/rest/api/searchservice/).

### Populating the index
The next step in `Main` is to populate the newly-created index. This is done in the following method:

```csharp
private static void UploadDocuments(ISearchIndexClient indexClient)
{
    var hotels = new Hotel[]
    {
        new Hotel()
        { 
            HotelId = "1", 
            BaseRate = 199.0, 
            Description = "Best hotel in town",
            DescriptionFr = "Meilleur hôtel en ville",
            HotelName = "Fancy Stay",
            Category = "Luxury", 
            Tags = new[] { "pool", "view", "wifi", "concierge" },
            ParkingIncluded = false, 
            SmokingAllowed = false,
            LastRenovationDate = new DateTimeOffset(2010, 6, 27, 0, 0, 0, TimeSpan.Zero), 
            Rating = 5, 
            Location = GeographyPoint.Create(47.678581, -122.131577)
        },
        new Hotel()
        { 
            HotelId = "2", 
            BaseRate = 79.99,
            Description = "Cheapest hotel in town",
            DescriptionFr = "Hôtel le moins cher en ville",
            HotelName = "Roach Motel",
            Category = "Budget",
            Tags = new[] { "motel", "budget" },
            ParkingIncluded = true,
            SmokingAllowed = true,
            LastRenovationDate = new DateTimeOffset(1982, 4, 28, 0, 0, 0, TimeSpan.Zero),
            Rating = 1,
            Location = GeographyPoint.Create(49.678581, -122.131577)
        },
        new Hotel() 
        { 
            HotelId = "3", 
            BaseRate = 129.99,
            Description = "Close to town hall and the river"
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

This method has four parts. The first creates an array of `Hotel` objects that will serve as our input data to upload to the index. This data is hard-coded for simplicity. In your own application, your data will likely come from an external data source such as a SQL database.

The second part creates an `IndexBatch` containing the documents. You specify the operation you want to apply to the batch at the time you create it, in this case by calling `IndexBatch.Upload`. The batch is then uploaded to the Azure Search index by the `Documents.Index` method.

> [!NOTE]
> In this example, we are just uploading documents. If you wanted to merge changes into existing documents or delete documents, you could create batches by calling `IndexBatch.Merge`, `IndexBatch.MergeOrUpload`, or `IndexBatch.Delete` instead. You can also mix different operations in a single batch by calling `IndexBatch.New`, which takes a collection of `IndexAction` objects, each of which tells Azure Search to perform a particular operation on a document. You can create each `IndexAction` with its own operation by calling the corresponding method such as `IndexAction.Merge`, `IndexAction.Upload`, and so on.
> 
> 

The third part of this method is a catch block that handles an important error case for indexing. If your Azure Search service fails to index some of the documents in the batch, an `IndexBatchException` is thrown by `Documents.Index`. This can happen if you are indexing documents while your service is under heavy load. **We strongly recommend explicitly handling this case in your code.** You can delay and then retry indexing the documents that failed, or you can log and continue like the sample does, or you can do something else depending on your application's data consistency requirements.

> [!NOTE]
> You can use the `FindFailedActionsToRetry` method to construct a new batch containing only the actions that failed in a previous call to `Index`. The method is documented [here](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.indexbatchexception#Microsoft_Azure_Search_IndexBatchException_FindFailedActionsToRetry_Microsoft_Azure_Search_Models_IndexBatch_System_String_) and there is a discussion of how to properly use it [on StackOverflow](http://stackoverflow.com/questions/40012885/azure-search-net-sdk-how-to-use-findfailedactionstoretry).
>
>

Finally, the `UploadDocuments` method delays for two seconds. Indexing happens asynchronously in your Azure Search service, so the sample application needs to wait a short time to ensure that the documents are available for searching. Delays like this are typically only necessary in demos, tests, and sample applications.

#### How the .NET SDK handles documents
You may be wondering how the Azure Search .NET SDK is able to upload instances of a user-defined class like `Hotel` to the index. To help answer that question, let's look at the `Hotel` class:

```csharp
using System;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;
using Microsoft.Spatial;
using Newtonsoft.Json;

// The SerializePropertyNamesAsCamelCase attribute is defined in the Azure Search .NET SDK.
// It ensures that Pascal-case property names in the model class are mapped to camel-case
// field names in the index.
[SerializePropertyNamesAsCamelCase]
public partial class Hotel
{
    [System.ComponentModel.DataAnnotations.Key]
    [IsFilterable]
    public string HotelId { get; set; }

    [IsFilterable, IsSortable, IsFacetable]
    public double? BaseRate { get; set; }

    [IsSearchable]
    public string Description { get; set; }

    [IsSearchable]
    [Analyzer(AnalyzerName.AsString.FrLucene)]
    [JsonProperty("description_fr")]
    public string DescriptionFr { get; set; }

    [IsSearchable, IsFilterable, IsSortable]
    public string HotelName { get; set; }

    [IsSearchable, IsFilterable, IsSortable, IsFacetable]
    public string Category { get; set; }

    [IsSearchable, IsFilterable, IsFacetable]
    public string[] Tags { get; set; }

    [IsFilterable, IsFacetable]
    public bool? ParkingIncluded { get; set; }

    [IsFilterable, IsFacetable]
    public bool? SmokingAllowed { get; set; }

    [IsFilterable, IsSortable, IsFacetable]
    public DateTimeOffset? LastRenovationDate { get; set; }

    [IsFilterable, IsSortable, IsFacetable]
    public int? Rating { get; set; }

    [IsFilterable, IsSortable]
    public GeographyPoint Location { get; set; }
}
```

The first thing to notice is that each public property of `Hotel` corresponds to a field in the index definition, but with one crucial difference: The name of each field starts with a lower-case letter ("camel case"), while the name of each public property of `Hotel` starts with an upper-case letter ("Pascal case"). This is a common scenario in .NET applications that perform data-binding where the target schema is outside the control of the application developer. Rather than having to violate the .NET naming guidelines by making property names camel-case, you can tell the SDK to map the property names to camel-case automatically with the `[SerializePropertyNamesAsCamelCase]` attribute.

> [!NOTE]
> The Azure Search .NET SDK uses the [NewtonSoft JSON.NET](http://www.newtonsoft.com/json/help/html/Introduction.htm) library to serialize and deserialize your custom model objects to and from JSON. You can customize this serialization if needed. For more details, see [Custom Serialization with JSON.NET](#JsonDotNet).
> 
> 

The second thing to notice are the attributes such as `IsFilterable`, `IsSearchable`, `Key`, and `Analyzer` that decorate each public property. These attributes map directly to the [corresponding attributes of the Azure Search index](https://docs.microsoft.com/rest/api/searchservice/create-index#request). The `FieldBuilder` class uses these to construct field definitions for the index.

The third important thing about the `Hotel` class are the data types of the public properties. The .NET types of  these properties map to their equivalent field types in the index definition. For example, the `Category` string property maps to the `category` field, which is of type `Edm.String`. There are similar type mappings between `bool?` and `Edm.Boolean`, `DateTimeOffset?` and `Edm.DateTimeOffset`, etc. The specific rules for the type mapping are documented with the `Documents.Get` method in the [Azure Search .NET SDK reference](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.idocumentsoperations#Microsoft_Azure_Search_IDocumentsOperations_GetWithHttpMessagesAsync__1_System_String_System_Collections_Generic_IEnumerable_System_String__Microsoft_Azure_Search_Models_SearchRequestOptions_System_Collections_Generic_Dictionary_System_String_System_Collections_Generic_List_System_String___System_Threading_CancellationToken_). The `FieldBuilder` class takes care of this mapping for you, but it can still be helpful to understand in case you need to troubleshoot any serialization issues.

This ability to use your own classes as documents works in both directions; You can also retrieve search results and have the SDK automatically deserialize them to a type of your choice, as we will see in the next section.

> [!NOTE]
> The Azure Search .NET SDK also supports dynamically-typed documents using the `Document` class, which is a key/value mapping of field names to field values. This is useful in scenarios where you don't know the index schema at design-time, or where it would be inconvenient to bind to specific model classes. All the methods in the SDK that deal with documents have overloads that work with the `Document` class, as well as strongly-typed overloads that take a generic type parameter. Only the latter are used in the sample code in this tutorial. The `Document` class inherits from `Dictionary<string, object>`. You can find other details [here](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.document#microsoft_azure_search_models_document).
> 
> 

**Why you should use nullable data types**

When designing your own model classes to map to an Azure Search index, we recommend declaring properties of value types such as `bool` and `int` to be nullable (for example, `bool?` instead of `bool`). If you use a non-nullable property, you have to **guarantee** that no documents in your index contain a null value for the corresponding field. Neither the SDK nor the Azure Search service will help you to enforce this.

This is not just a hypothetical concern: Imagine a scenario where you add a new field to an existing index that is of type `Edm.Int32`. After updating the index definition, all documents will have a null value for that new field (since all types are nullable in Azure Search). If you then use a model class with a non-nullable `int` property for that field, you will get a `JsonSerializationException` like this when trying to retrieve documents:

    Error converting value {null} to type 'System.Int32'. Path 'IntValue'.

For this reason, we recommend that you use nullable types in your model classes as a best practice.

<a name="JsonDotNet"></a>

#### Custom Serialization with JSON.NET
The SDK uses JSON.NET for serializing and deserializing documents. You can customize serialization and deserialization if needed by defining your own `JsonConverter` or `IContractResolver` (see the [JSON.NET documentation](http://www.newtonsoft.com/json/help/html/Introduction.htm) for more details). This can be useful when you want to adapt an existing model class from your application for use with Azure Search, and other more advanced scenarios. For example, with custom serialization you can:

* Include or exclude certain properties of your model class from being stored as document fields.
* Map between property names in your code and field names in your index.
* Create custom attributes that can be used for mapping properties to document fields.

You can find examples of implementing custom serialization in the unit tests for the Azure Search .NET SDK on GitHub. A good starting point is [this folder](https://github.com/Azure/azure-sdk-for-net/tree/AutoRest/src/Search/Search.Tests/Tests/Models). It contains classes that are used by the custom serialization tests.

### Searching for documents in the index
The last step in the sample application is to search for some documents in the index. The following method does this:

```csharp
private static void RunQueries(ISearchIndexClient indexClient)
{
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
}
```

Each time it executes a query, this method first creates a new `SearchParameters` object. This is used to specify additional options for the query such as sorting, filtering, paging, and faceting. In this method, we're setting the `Filter`, `Select`, `OrderBy`, and `Top` property for different queries. All the `SearchParameters` properties are documented [here](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.searchparameters).

The next step is to actually execute the search query. This is done using the `Documents.Search` method. For each query, we pass the search text to use as a string (or `"*"` if there is no search text), plus the search parameters created earlier. We also specify `Hotel` as the type parameter for `Documents.Search`, which tells the SDK to deserialize documents in the search results into objects of type `Hotel`.

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
        Select = new[] { "hotelName" }
    };

results = indexClient.Documents.Search<Hotel>("budget", parameters);

WriteDocuments(results);
```

In this case, we're searching for hotels that match the word "budget", and we want to get back only the hotel names, as specified by the `Select` parameter. Here are the results:

	Name: Roach Motel

Next, we want to find the hotels with a nightly rate of less than $150, and return only the hotel ID and description:

```csharp
parameters =
    new SearchParameters()
    {
        Filter = "baseRate lt 150",
        Select = new[] { "hotelId", "description" }
    };

results = indexClient.Documents.Search<Hotel>("*", parameters);

WriteDocuments(results);
```

This query uses an OData `$filter` expression, `baseRate lt 150`, to filter the documents in the index. You can find out more about the OData syntax that Azure Search supports [here](https://docs.microsoft.com/rest/api/searchservice/OData-Expression-Syntax-for-Azure-Search).

Here are the results of the query:

	ID: 2   Description: Cheapest hotel in town
	ID: 3   Description: Close to town hall and the river

Next, we want to find the top two hotels that have been most recently renovated, and show the hotel name and last renovation date. Here is the code: 

```csharp
parameters =
    new SearchParameters()
    {
        OrderBy = new[] { "lastRenovationDate desc" },
        Select = new[] { "hotelName", "lastRenovationDate" },
        Top = 2
    };

results = indexClient.Documents.Search<Hotel>("*", parameters);

WriteDocuments(results);
```

In this case, we again use OData syntax to specify the `OrderBy` parameter as `lastRenovationDate desc`. We also set `Top` to 2 to ensure we only get the top two documents. As before, we set `Select` to specify which fields should be returned.

Here are the results:

	Name: Fancy Stay        Last renovated on: 6/27/2010 12:00:00 AM +00:00
	Name: Roach Motel       Last renovated on: 4/28/1982 12:00:00 AM +00:00

Finally, we want to find all hotels that match the word "motel":

```csharp
parameters = new SearchParameters();
results = indexClient.Documents.Search<Hotel>("motel", parameters);

WriteDocuments(results);
```

And here are the results, which include all fields since we did not specify the `Select` property:

	ID: 2   Base rate: 79.99        Description: Cheapest hotel in town     Description (French): Hôtel le moins cher en ville      Name: Roach Motel       Category: Budget        Tags: [motel, budget]   Parking included: yes   Smoking allowed: yes    Last renovated on: 4/28/1982 12:00:00 AM +00:00 Rating: 1/5     Location: Latitude 49.678581, longitude -122.131577

This step completes the tutorial, but don't stop here. **Next steps** provides additional resources for learning more about Azure Search.

## Next steps
* Browse the references for the [.NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.search) and [REST API](https://docs.microsoft.com/rest/api/searchservice/).
* Review [naming conventions](https://docs.microsoft.com/rest/api/searchservice/Naming-rules) to learn the rules for naming various objects.
* Review [supported data types](https://docs.microsoft.com/rest/api/searchservice/Supported-data-types) in Azure Search.
