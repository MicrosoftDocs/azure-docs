---
title: Use Azure.Search.Documents (v11) in .NET
titleSuffix: Azure Cognitive Search
description: Learn how to create and manage search objects in a .NET application using C# and the Azure.Search.Documents (v11) client library. Code snippets demonstrate connecting to the service, creating indexes, and queries.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.devlang: dotnet
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/27/2020
ms.custom: devx-track-csharp
---
# How to use Azure.Search.Documents in a C# .NET Application

This article explains how to create and manage search objects using C# and the [Azure.Search.Documents (v11)](/dotnet/api/overview/azure/search) client library. 

## About version 11

Azure SDK for .NET adds a new client library from the Azure SDK team that is functionally equivalent to [Microsoft.Azure.Search](/dotnet/api/overview/azure/search/client10) client libraries, but with common SDK-wide approaches where applicable. For example, service connections and authentication are handled the same as other client libraries in the SDK.

As with previous versions, you can use this library to:

+ Create and manage search indexes, data sources, indexers, skillsets, and synonym maps.
+ Upload and manage documents
+ Execute queries, all without having to deal with the details of HTTP and JSON. 

The library is distributed as a single NuGet package: `Azure.Search.Documents`, which includes all APIs used for programmatic access to a search service.

<!-- Within the package, you will find the following client libraries: -->

<!-- * [Microsoft.Azure.Search](/dotnet/api/microsoft.azure.search)
* [Microsoft.Azure.Search.Models](/dotnet/api/microsoft.azure.search.models)

The various client libraries define classes like `Index`, `Field`, and `Document`, as well as operations like `Indexes.Create` and `Documents.Search` on the `SearchServiceClient` and `SearchIndexClient` classes. These classes are organized into the following namespaces: -->

Azure.Search.Documents (version 11) targets version [`2020-06-30` of the Azure Cognitive Search REST API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/search/data-plane/Azure.Search/preview/2020-06-30). 

This SDK does not support [service management operations](/rest/api/searchmanagement/), such as creating and scaling search services and managing API keys. If you need to manage your search resources from a .NET application, use the [Microsoft.Azure.Management.Search](/dotnet/api/overview/azure/search/management) library in the Azure SDK for .NET.

## Upgrade from previous versoins

If you have been using the previous version of the .NET SDK and you'd like to upgrade to the current generally available version, see [Upgrade to Azure Cognitive Search .NET SDK version 11](search-dotnet-sdk-migration-version-11.md)

## SDK requirements

1. Visual Studio 2019 or later.

1. Your own Azure Cognitive Search service. In order to use the SDK, you will need the name of your service and one or more API keys. [Create a service in the portal](search-create-service-portal.md) if you don't have one.

1. Download the [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents) by using **Tools** > **NuGet Package Manager** > **Manage NuGet Packages for Solution** in Visual Studio. Search for the package name `Azure.Search.Documents`.

The Azure SDK for .NET supports applications targeting the .NET Framework 4.5.2 and higher, as well as .NET Core 2.0 and higher.

## Example application

This article "teaches by example", relying on the [DotNetHowTo](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo/v11) code example on GitHub to illustrate fundamental operations in Azure Cognitive Search: create, load, and query an index.

For the rest of this article, assume a new index named "hotels", populated with a few documents, with several queries that match on results.

Below is the main program, showing the overall flow:

```csharp
// This sample shows how to delete, create, upload documents and query an index
static void Main(string[] args)
{
    IConfigurationBuilder builder = new ConfigurationBuilder().AddJsonFile("appsettings.json");
    IConfigurationRoot configuration = builder.Build();

    SearchIndexClient indexClient = CreateSearchIndexClient(configuration);

    string indexName = configuration["SearchIndexName"];

    Console.WriteLine("{0}", "Deleting index...\n");
    DeleteIndexIfExists(indexName, indexClient);

    Console.WriteLine("{0}", "Creating index...\n");
    CreateIndex(indexName, indexClient);

    SearchClient searchClient = indexClient.GetSearchClient(indexName);

    Console.WriteLine("{0}", "Uploading documents...\n");
    UploadDocuments(searchClient);

    SearchClient indexClientForQueries = CreateSearchClientForQueries(indexName, configuration);

    RunQueries(indexClientForQueries);

    Console.WriteLine("{0}", "Complete.  Press any key to end application...\n");
    Console.ReadKey();
}
```

If you run this application with a valid service name and API keys, the output should look like this example:
(Some console output has been replaced with "..." for illustration purposes.)

```console
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
```

### Client types

The client library uses three client types for various operations: [`SearchIndexClient`](/dotnet/api/azure.search.documents.indexes.searchindexclient) to create, update, or delete indexes, [`SearchClient`](/dotnet/api/azure.search.documents.searchclient) to load or query an index, and [`SearchIndexerClient`](/dotnet/api/azure.search.documents.indexes.searchindexerclient) to work with indexers and skillsets. This article focuses on the first two. 

At a minimum, all of the clients require the service name or endpoint, and an API key. `SearchClient`, which supports on an existing index, also requires the name of the index. All operations that add or delete content on the service require an admin API key. For query-only requests against a specific index, you can use a query API key.

It's common to provide service connection information in a configuration file, similar to what you find in the `appsettings.json` file of the [DotNetHowTo sample application](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo). To read from the configuration file, add `using Microsoft.Extensions.Configuration;` to your program.

The following statement creates the index client used to create, update, or delete indexes. It takes a search endpoint and admin API key.

```csharp
private static SearchIndexClient CreateSearchIndexClient(IConfigurationRoot configuration)
{
    string searchServiceEndPoint = configuration["SearchServiceEndPoint"];
    string adminApiKey = configuration["SearchServiceAdminApiKey"];

    SearchIndexClient indexClient = new SearchIndexClient(new Uri(searchServiceEndPoint), new AzureKeyCredential(adminApiKey));
    return indexClient;
}
```

The next statement creates the search client used to load documents or run queries. It requires an index. You will need an admin API key to load documents, but you can use a query API key to run queries.

```csharp
string indexName = configuration["SearchIndexName"];

private static SearchClient CreateSearchClientForQueries(string indexName, IConfigurationRoot configuration)
{
    string searchServiceEndPoint = configuration["SearchServiceEndPoint"];
    string queryApiKey = configuration["SearchServiceQueryApiKey"];

    SearchClient searchClient = new SearchClient(new Uri(searchServiceEndPoint), indexName, new AzureKeyCredential(queryApiKey));
    return searchClient;
}
```

> [!NOTE]
> If you provide an invalid key for the import operation (for example, a query key where an admin key was required), the `SearchClient` will throw a `CloudException` with the error message "Forbidden" the first time you call an operation method on it. If this happens to you, double-check the API key.
>

### Deleting the index

In the early stages of development, you might want to include a [`DeleteIndex`](/dotnet/api/azure.search.documents.indexes.searchindexclient.deleteindex) statement to delete a work-in-progress index so that you can recreate it with an updated definition. Sample code for Azure Cognitive Search often includes a deletion step so that you can re-run the sample.

This line calls `DeleteIndexIfExists`:

```csharp
Console.WriteLine("{0}", "Deleting index...\n");
DeleteIndexIfExists(indexName, indexClient);
```

This method uses the given `SearchIndexClient` to check if the index exists, and if so, deletes it:

```csharp
private static void DeleteIndexIfExists(string indexName, SearchIndexClient indexClient)
{
    try
    {
        if (indexClient.GetIndex(indexName) != null)
        {
            indexClient.DeleteIndex(indexName);
        }
    }
    catch (RequestFailedException e) when (e.Status == 404)
    {
        // Throw an exception if the index name isn't found
        Console.WriteLine("The index doesn't exist. No deletion occurred.");
```

> [!NOTE]
> The example code in this article uses the synchronous methods for simplicity, but you should use the asynchronous methods in your own applications to keep them scalable and responsive. For example, in the method above you could use [`DeleteIndexAsync`](/dotnet/api/azure.search.documents.indexes.searchindexclient.deleteindexasync) instead of [`DeleteIndex`](/dotnet/api/azure.search.documents.indexes.searchindexclient.deleteindex).
> 

## Create an index

You can use [`SearchIndexClient`](/dotnet/api/azure.search.documents.indexes.searchindexclient) to create an index. 

The method below creates a new [`SearchIndex`](/dotnet/api/azure.search.documents.indexes.models.searchindex) object with a list of [`SearchField`](/dotnet/api/azure.search.documents.indexes.models.searchfield) objects that define the schema of the new index. Each field has a name, data type, and several attributes that define its search behavior. 

Fields can be defined from a model class using [`FieldBuilder`](/dotnet/api/azure.search.documents.indexes.fieldbuilder). The `FieldBuilder` class uses reflection to create a list of `SearchField` objects for the index by examining the public properties and attributes of the given `Hotel` model class. We'll take a closer look at the `Hotel` class later on.

```csharp
private static void CreateIndex(string indexName, SearchIndexClient indexClient)
{
    FieldBuilder fieldBuilder = new FieldBuilder();
    var searchFields = fieldBuilder.Build(typeof(Hotel));

    var definition = new SearchIndex(indexName, searchFields);

    indexClient.CreateOrUpdateIndex(definition);
}
```

Besides fields, you could also add scoring profiles, suggesters, or CORS options to the index (these parameters are omitted from the sample for brevity). You can find more information about the SearchIndex object and its constituent parts in the [`SearchIndex`](/dotnet/api/azure.search.documents.indexes.models.searchindex) properties list, as well as in the [REST API reference](/rest/api/searchservice/).

`Main` creates a new "hotels" index by calling the above method:

```csharp
Console.WriteLine("{0}", "Creating index...\n");
CreateIndex(indexName, indexClient);
```

> [!NOTE]
> You can always create the list of `Field` objects directly instead of using `FieldBuilder` if needed. For example, you may not want to use a model class or you may need to use an existing model class that you don't want to modify by adding attributes.
> 

### Using a model class for data representation

The DotNetHowTo sample uses model classes for the [hotel](https://github.com/Azure-Samples/search-dotnet-getting-started/blob/master/DotNetHowTo/DotNetHowTo/Hotel.cs), [address](https://github.com/Azure-Samples/search-dotnet-getting-started/blob/master/DotNetHowTo/DotNetHowTo/Address.cs), and [room](https://github.com/Azure-Samples/search-dotnet-getting-started/blob/master/DotNetHowTo/DotNetHowTo/Room.cs) data structures. Hotel references Address, a single level complex type (a multi-part field), and Room (a collection of multi-part fields). 

You can use these types to create and load the index, and to structure the response from a query:

```csharp
private static void WriteDocuments(SearchResults<Hotel> searchResults)
{
    foreach (SearchResult<Hotel> result in searchResults.GetResults())
    {
        Console.WriteLine(result.Document);
    }

    Console.WriteLine();
}
```

Within each class, a field is defined with a data type and attributes that determine how it's used.

Take a look at the following snippet that pulls several field definitions from the Hotel class. Notice that Address and Rooms are C# types with their own class definitions (refer to the sample code if you want to view them). These are complex types. For more information, see [How to model complex types](search-howto-complex-data-types.md).

```csharp
public partial class Hotel
{
    [SimpleField(IsKey = true, IsFilterable = true)]
    public string HotelId { get; set; }

    [SearchableField(IsSortable = true)]
    public string HotelName { get; set; }

    [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnLucene)]
    public string Description { get; set; }

    [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
    public string Category { get; set; }

    [SearchableField]
    public Address Address { get; set; }

    public Room[] Rooms { get; set; }
```

When defining fields, you can use the base [`SearchField`](/dotnet/api/azure.search.documents.indexes.models.searchfield) class, or you can use derivative helper models that serve as "templates", with pre-configured properties.

Exactly one field in your index must serve as the document key (`IsKey = true`). It must be a string, and it must uniquely identify each document. It's also required to have `IsHidden = true`, which means it cannot be visible in search results.

| Field type | Description and usage |
|------------|-----------------------|
| [`SearchField`](/dotnet/api/azure.search.documents.indexes.models.searchfield) | Base class, with most properties set to null, excepting `Name` which is required, and `AnalyzerName` which defaults to standard Lucene. |
| [`SimpleField`](/dotnet/api/azure.search.documents.indexes.models.simplefield) | Helper model. Can be any data type, is always non-searchable (it's ignored for full text search queries), and is retrievable (it's not hidden). Other attributes are off by default, but can be enabled. You might use a `SimpleField` for document IDs or fields used only in filters, facets, or scoring profiles. If so, be sure to apply any attributes that are necessary for the scenario, such as `IsKey = true` for a document ID. For more information, see [SimpleFieldAttribute.cs](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/src/Indexes/SimpleFieldAttribute.cs) in source code. |
| [`SearchableField`](/dotnet/api/azure.search.documents.indexes.models.searchablefield) | Helper model. Must be a string, and is always searchable and retrievable. Other attributes are off by default, but can be enabled. Because this field type is searchable, it supports synonyms and the full complement of analyzer properties. For more information, see the [SearchableFieldAttribute.cs](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/src/Indexes/SearchableFieldAttribute.cs) in source code. |

Whether you use the basic `SearchField` API or either one of the helper models, you must explicitly enable filter, facet, and sort attributes. For example, [IsFilterable](/dotnet/api/azure.search.documents.indexes.models.searchfield.isfilterable), [IsSortable](/dotnet/api/azure.search.documents.indexes.models.searchfield.issortable), and [IsFacetable](/dotnet/api/azure.search.documents.indexes.models.searchfield.isfacetable) must be explicitly attributed, as shown in the sample above. 

## Load an index

The next step in `Main` populates the newly-created "hotels" index. This index population is done in the following method:
(Some code replaced with "..." for illustration purposes. See the full sample solution for the full data population code.)

```csharp
private static void UploadDocuments(SearchClient searchClient)
{
    IndexDocumentsBatch<Hotel> batch = IndexDocumentsBatch.Create(
        IndexDocumentsAction.Upload(
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
            }),
        IndexDocumentsAction.Upload(
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
            }),
        IndexDocumentsAction.Upload(
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

    try
    {
        IndexDocumentsResult result = searchClient.IndexDocuments(batch);
    }
    catch (Exception)
    {
        // Sometimes when your Search service is under load, indexing will fail for some of the documents in
        // the batch. Depending on your application, you can take compensating actions like delaying and
        // retrying. For this simple demo, we just log the failed document keys and continue.
        Console.WriteLine("Failed to index some of the documents: {0}");
    }

    Console.WriteLine("Waiting for documents to be indexed...\n");
    Thread.Sleep(2000);
```

This method has four parts. The first creates an array of 3 `Hotel` objects each with 3 `Room` objects that will serve as our input data to upload to the index. This data is hard-coded for simplicity. In an actual application, data will likely come from an external data source such as a SQL database.

The second part creates an [`IndexDocumentsBatch`](/dotnet/api/azure.search.documents.models.indexdocumentsbatch) containing the documents. You specify the operation you want to apply to the batch at the time you create it, in this case by calling [`IndexDocumentsAction.Upload`](/dotnet/api/azure.search.documents.models.indexdocumentsaction.upload). The batch is then uploaded to the Azure Cognitive Search index by the [`IndexDocuments`](/dotnet/api/azure.search.documents.searchclient.indexdocuments) method.

> [!NOTE]
> In this example, we are just uploading documents. If you wanted to merge changes into existing documents or delete documents, you could create batches by calling `IndexDocumentsAction.Merge`, `IndexDocumentsAction.MergeOrUpload`, or `IndexDocumentsAction.Delete` instead. You can also mix different operations in a single batch by calling `IndexBatch.New`, which takes a collection of `IndexDocumentsAction` objects, each of which tells Azure Cognitive Search to perform a particular operation on a document. You can create each `IndexDocumentsAction` with its own operation by calling the corresponding method such as `IndexDocumentsAction.Merge`, `IndexAction.Upload`, and so on.
> 

The third part of this method is a catch block that handles an important error case for indexing. If your search service fails to index some of the documents in the batch, an `IndexBatchException` is thrown by `IndexDocuments`. This exception can happen if you are indexing documents while your service is under heavy load. **We strongly recommend explicitly handling this case in your code.** You can delay and then retry indexing the documents that failed, or you can log and continue like the sample does, or you can do something else depending on your application's data consistency requirements.

Finally, the `UploadDocuments` method delays for two seconds. Indexing happens asynchronously in your search service, so the sample application needs to wait a short time to ensure that the documents are available for searching. Delays like this are typically only necessary in demos, tests, and sample applications.

<!-- REMAINDER OF THE OVERVIEW


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




## Load an index

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

The third important thing about the `Hotel` class is the data types of the public properties. The .NET types of these properties map to their equivalent field types in the index definition. For example, the `Category` string property maps to the `category` field, which is of type `Edm.String`. There are similar type mappings between `bool?`, `Edm.Boolean`, `DateTimeOffset?`, and `Edm.DateTimeOffset` and so on. The specific rules for the type mapping are documented with the `Documents.Get` method in the [Azure Cognitive Search .NET SDK reference](/dotnet/api/microsoft.azure.search.documentsoperationsextensions.get). The `FieldBuilder` class takes care of this mapping for you, but it can still be helpful to understand in case you need to troubleshoot any serialization issues.

Did you happen to notice the `SmokingAllowed` property?

```csharp
[JsonIgnore]
public bool? SmokingAllowed => (Rooms != null) ? Array.Exists(Rooms, element => element.SmokingAllowed == true) : (bool?)null;
```

The `JsonIgnore` attribute on this property tells the `FieldBuilder` to not serialize it to the index as a field.  This is a great way to create client-side calculated properties you can use as helpers in your application.  In this case, the `SmokingAllowed` property reflects whether any `Room` in the `Rooms` collection allows smoking.  If all are false, it indicates that the entire hotel does not allow smoking.

Some properties such as `Address` and `Rooms` are instances of .NET classes.  These properties represent more complex data structures and, as a result, require fields with a [complex data type](./search-howto-complex-data-types.md) in the index.

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
> The Azure Cognitive Search .NET SDK also supports dynamically-typed documents using the `Document` class, which is a key/value mapping of field names to field values. This is useful in scenarios where you don't know the index schema at design-time, or where it would be inconvenient to bind to specific model classes. All the methods in the SDK that deal with documents have overloads that work with the `Document` class, as well as strongly-typed overloads that take a generic type parameter. Only the latter are used in the sample code in this tutorial. The [`Document` class](/dotnet/api/microsoft.azure.search.models.document) inherits from `Dictionary<string, object>`.
> 
>

**Why you should use nullable data types**

When designing your own model classes to map to an Azure Cognitive Search index, we recommend declaring properties of value types such as `bool` and `int` to be nullable (for example, `bool?` instead of `bool`). If you use a non-nullable property, you have to **guarantee** that no documents in your index contain a null value for the corresponding field. Neither the SDK nor the Azure Cognitive Search service will help you to enforce this.

This is not just a hypothetical concern: Imagine a scenario where you add a new field to an existing index that is of type `Edm.Int32`. After updating the index definition, all documents will have a null value for that new field (since all types are nullable in Azure Cognitive Search). If you then use a model class with a non-nullable `int` property for that field, you will get a `JsonSerializationException` like this when trying to retrieve documents:

```output
Error converting value {null} to type 'System.Int32'. Path 'IntValue'.
```

For this reason, we recommend that you use nullable types in your model classes as a best practice.

<a name="JsonDotNet"></a>

#### Custom Serialization with JSON.NET

The SDK uses JSON.NET for serializing and deserializing documents. You can customize serialization and deserialization if needed by defining your own `JsonConverter` or `IContractResolver`. For more information, see the [JSON.NET documentation](https://www.newtonsoft.com/json/help/html/Introduction.htm). This can be useful when you want to adapt an existing model class from your application for use with Azure Cognitive Search, and other more advanced scenarios. For example, with custom serialization you can:

* Include or exclude certain properties of your model class from being stored as document fields.
* Map between property names in your code and field names in your index.
* Create custom attributes that can be used for mapping properties to document fields.

You can find examples of implementing custom serialization in the unit tests for the Azure Cognitive Search .NET SDK on GitHub. A good starting point is [this folder](https://github.com/Azure/azure-sdk-for-net/tree/4f6f4e4c90200c1b0621c4cead302a91e89f2aba/sdk/search/Microsoft.Azure.Search/tests/Tests/Models). It contains classes that are used by the custom serialization tests.

## Searching for documents in the index

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

Each time it executes a query, this method first creates a new `SearchParameters` object. This object is used to specify additional options for the query such as sorting, filtering, paging, and faceting. In this method, we're setting the `Filter`, `Select`, `OrderBy`, and `Top` property for different queries. All the `SearchParameters` properties are documented [here](/dotnet/api/microsoft.azure.search.models.searchparameters).

The next step is to actually execute the search query. Running the search is done using the `Documents.Search` method. For each query, we pass the search text to use as a string (or `"*"` if there is no search text), plus the search parameters created earlier. We also specify `Hotel` as the type parameter for `Documents.Search`, which tells the SDK to deserialize documents in the search results into objects of type `Hotel`.

> [!NOTE]
> You can find more information about the search query expression syntax [here](/rest/api/searchservice/Simple-query-syntax-in-Azure-Search).
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

```output
Name: Secret Point Motel

Name: Twin Dome Motel
```

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

This query uses an OData `$filter` expression, `Rooms/any(r: r/BaseRate lt 100)`, to filter the documents in the index. This uses the [any operator](./search-query-odata-collection-operators.md) to apply the 'BaseRate lt 100' to every item in the Rooms collection. You can find out more about the OData syntax that Azure Cognitive Search supports [here](./query-odata-filter-orderby-syntax.md).

Here are the results of the query:

```output
HotelId: 1
Description: The hotel is ideally located on the main commercial artery of the city in the heart of New York...

HotelId: 2
Description: The hotel is situated in a nineteenth century plaza, which has been expanded and renovated to...
```

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

```output
Name: Fancy Stay        Last renovated on: 6/27/2010 12:00:00 AM +00:00
Name: Roach Motel       Last renovated on: 4/28/1982 12:00:00 AM +00:00
```

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

```output
	HotelId: 3
	Name: Triple Landscape Hotel
	...
```

This step concludes this introduction to the .NET SDK, but don't stop here. The next section suggests additional resources for learning more about programming with Azure Cognitive Search.

## Next steps

+ Browse the API reference documentation for [Azure.Search.Documents](/dotnet/api/azure.search.documents) and [REST API](/rest/api/searchservice/)

+ Browse other code samples based on Azure.Search.Documents in [azure-search-dotnet-samples](https://github.com/Azure-Samples/azure-search-dotnet-samples) and [search-getting-started-dotnet](https://github.com/Azure-Samples/search-dotnet-getting-started)

+ Review [naming conventions](/rest/api/searchservice/Naming-rules) to learn the rules for naming various objects

+ Review [supported data types](/rest/api/searchservice/Supported-data-types)