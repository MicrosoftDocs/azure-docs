---
title: Use Azure.Search.Documents (v11) in .NET
titleSuffix: Azure Cognitive Search
description: Learn how to create and manage search objects in a .NET application using C# and the Azure.Search.Documents (v11) client library.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.devlang: csharp
ms.service: cognitive-search
ms.topic: how-to
ms.date: 10/04/2022
ms.custom: devx-track-csharp, devx-track-dotnet
---

# How to use Azure.Search.Documents in a C# .NET Application

This article explains how to create and manage search objects using C# and the [**Azure.Search.Documents**](/dotnet/api/overview/azure/search) (version 11) client library in the Azure SDK for .NET.

## About version 11

Azure SDK for .NET includes an [**Azure.Search.Documents**](/dotnet/api/overview/azure/search) client library from the Azure SDK team that is functionally equivalent to the previous client library, [Microsoft.Azure.Search](/dotnet/api/microsoft.azure.search). Version 11 is more consistent in terms of Azure programmability. Some examples include [`AzureKeyCredential`](/dotnet/api/azure.azurekeycredential) key authentication, and [System.Text.Json.Serialization](/dotnet/api/system.text.json.serialization) for JSON serialization.

As with previous versions, you can use this library to:

+ Create and manage search indexes, data sources, indexers, skillsets, and synonym maps
+ Load and manage search documents in an index
+ Execute queries, all without having to deal with the details of HTTP and JSON
+ Invoke and manage AI enrichment (skillsets) and outputs

The library is distributed as a single [Azure.Search.Documents NuGet package](https://www.nuget.org/packages/Azure.Search.Documents/), which includes all APIs used for programmatic access to a search service.

The client library defines classes like `SearchIndex`, `SearchField`, and `SearchDocument`, as well as operations like `SearchIndexClient.CreateIndex` and `SearchClient.Search` on the `SearchIndexClient` and `SearchClient` classes. These classes are organized into the following namespaces:

+ [`Azure.Search.Documents`](/dotnet/api/azure.search.documents)
+ [`Azure.Search.Documents.Indexes`](/dotnet/api/azure.search.documents.indexes)
+ [`Azure.Search.Documents.Indexes.Models`](/dotnet/api/azure.search.documents.indexes.models)
+ [`Azure.Search.Documents.Models`](/dotnet/api/azure.search.documents.models)

Azure.Search.Documents (version 11) targets version [`2020-06-30` of the Azure Cognitive Search REST API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/search/data-plane/Azure.Search/preview/2020-06-30). 

The client library doesn't provide [service management operations](/rest/api/searchmanagement/), such as creating and scaling search services and managing API keys. If you need to manage your search resources from a .NET application, use the [Microsoft.Azure.Management.Search](/dotnet/api/microsoft.azure.management.search) library in the Azure SDK for .NET.

## Upgrade to v11

If you have been using the previous version of the .NET SDK and you'd like to upgrade to the current generally available version, see [Upgrade to Azure Cognitive Search .NET SDK version 11](search-dotnet-sdk-migration-version-11.md).

## SDK requirements

+ Visual Studio 2019 or later.

+ Your own Azure Cognitive Search service. In order to use the SDK, you'll need the name of your service and one or more API keys. [Create a service in the portal](search-create-service-portal.md) if you don't have one.

+ Download the [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents) using **Tools** > **NuGet Package Manager** > **Manage NuGet Packages for Solution** in Visual Studio. Search for the package name `Azure.Search.Documents`.

Azure SDK for .NET conforms to [.NET Standard 2.0](/dotnet/standard/net-standard#net-implementation-support). 

## Example application

This article "teaches by example", relying on the [DotNetHowTo](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo) code example on GitHub to illustrate fundamental concepts in Azure Cognitive Search - specifically, how to create, load, and query a search index.

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

    Console.WriteLine("{0}", "Run queries...\n");
    RunQueries(indexClientForQueries);

    Console.WriteLine("{0}", "Complete.  Press any key to end application...\n");
    Console.ReadKey();
}
```

Next is a partial screenshot of the output, assuming you run this application with a valid service name and API keys:

:::image type="content" source="media/search-howto-dotnet-sdk/console-output.png" alt-text="Screenshot of the Console.WriteLine output from the sample program.":::

### Client types

The client library uses three client types for various operations: [`SearchIndexClient`](/dotnet/api/azure.search.documents.indexes.searchindexclient) to create, update, or delete indexes, [`SearchClient`](/dotnet/api/azure.search.documents.searchclient) to load or query an index, and [`SearchIndexerClient`](/dotnet/api/azure.search.documents.indexes.searchindexerclient) to work with indexers and skillsets. This article focuses on the first two. 

At a minimum, all of the clients require the service name or endpoint, and an API key. It's common to provide this information in a configuration file, similar to what you find in the `appsettings.json` file of the [DotNetHowTo sample application](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo). To read from the configuration file, add `using Microsoft.Extensions.Configuration;` to your program.

The following statement creates the index client used to create, update, or delete indexes. It takes a service endpoint and admin API key.

```csharp
private static SearchIndexClient CreateSearchIndexClient(IConfigurationRoot configuration)
{
    string searchServiceEndPoint = configuration["SearchServiceEndPoint"];
    string adminApiKey = configuration["SearchServiceAdminApiKey"];

    SearchIndexClient indexClient = new SearchIndexClient(new Uri(searchServiceEndPoint), new AzureKeyCredential(adminApiKey));
    return indexClient;
}
```

The next statement creates the search client used to load documents or run queries. `SearchClient` requires an index. You'll need an admin API key to load documents, but you can use a query API key to run queries. 

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

In the early stages of development, you might want to include a [`DeleteIndex`](/dotnet/api/azure.search.documents.indexes.searchindexclient.deleteindex) statement to delete a work-in-progress index so that you can recreate it with an updated definition. Sample code for Azure Cognitive Search often includes a deletion step so that you can rerun the sample.

The following line calls `DeleteIndexIfExists`:

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

> [!NOTE]
> You can always create the list of `Field` objects directly instead of using `FieldBuilder` if needed. For example, you may not want to use a model class or you may need to use an existing model class that you don't want to modify by adding attributes.
>

### Call CreateIndex in Main()

`Main` creates a new "hotels" index by calling the above method:

```csharp
Console.WriteLine("{0}", "Creating index...\n");
CreateIndex(indexName, indexClient);
```

## Use a model class for data representation

The DotNetHowTo sample uses model classes for the [Hotel](https://github.com/Azure-Samples/search-dotnet-getting-started/blob/master/DotNetHowTo/DotNetHowTo/Hotel.cs), [Address](https://github.com/Azure-Samples/search-dotnet-getting-started/blob/master/DotNetHowTo/DotNetHowTo/Address.cs), and [Room](https://github.com/Azure-Samples/search-dotnet-getting-started/blob/master/DotNetHowTo/DotNetHowTo/Room.cs) data structures. `Hotel` references `Address`, a single level complex type (a multi-part field), and `Room` (a collection of multi-part fields).

You can use these types to create and load the index, and to structure the response from a query:

```csharp
// Use-case: <Hotel> in a field definition
FieldBuilder fieldBuilder = new FieldBuilder();
var searchFields = fieldBuilder.Build(typeof(Hotel));

// Use-case: <Hotel> in a response
private static void WriteDocuments(SearchResults<Hotel> searchResults)
{
    foreach (SearchResult<Hotel> result in searchResults.GetResults())
    {
        Console.WriteLine(result.Document);
    }

    Console.WriteLine();
}
```

An alternative approach is to add fields to an index directly. The following example shows just a few fields.

   ```csharp
    SearchIndex index = new SearchIndex(indexName)
    {
        Fields =
            {
                new SimpleField("hotelId", SearchFieldDataType.String) { IsKey = true, IsFilterable = true, IsSortable = true },
                new SearchableField("hotelName") { IsFilterable = true, IsSortable = true },
                new SearchableField("hotelCategory") { IsFilterable = true, IsSortable = true },
                new SimpleField("baseRate", SearchFieldDataType.Int32) { IsFilterable = true, IsSortable = true },
                new SimpleField("lastRenovationDate", SearchFieldDataType.DateTimeOffset) { IsFilterable = true, IsSortable = true }
            }
    };
   ```

### Field definitions

Your data model in .NET and its corresponding index schema should support the search experience you'd like to give to your end user. Each top level object in .NET, such as a search document in a search index, corresponds to a search result you would present in your user interface. For example, in a hotel search application your end users may want to search by hotel name, features of the hotel, or the characteristics of a particular room. 

Within each class, a field is defined with a data type and attributes that determine how it's used. The name of each public property in each class maps to a field with the same name in the index definition. 

Take a look at the following snippet that pulls several field definitions from the Hotel class. Notice that Address and Rooms are C# types with their own class definitions (refer to the sample code if you want to view them). Both are complex types. For more information, see [How to model complex types](search-howto-complex-data-types.md).

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

    [JsonIgnore]
    public bool? SmokingAllowed => (Rooms != null) ? Array.Exists(Rooms, element => element.SmokingAllowed == true) : (bool?)null;

    [SearchableField]
    public Address Address { get; set; }

    public Room[] Rooms { get; set; }
```

#### Choosing a field class

When defining fields, you can use the base [`SearchField`](/dotnet/api/azure.search.documents.indexes.models.searchfield) class, or you can use derivative helper models that serve as "templates", with pre-configured properties.

Exactly one field in your index must serve as the document key (`IsKey = true`). It must be a string, and it must uniquely identify each document. It's also required to have `IsHidden = true`, which means it can't be visible in search results.

| Field type | Description and usage |
|------------|-----------------------|
| [`SearchField`](/dotnet/api/azure.search.documents.indexes.models.searchfield) | Base class, with most properties set to null, excepting `Name` which is required, and `AnalyzerName` which defaults to standard Lucene. |
| [`SimpleField`](/dotnet/api/azure.search.documents.indexes.models.simplefield) | Helper model. Can be any data type, is always non-searchable (it's ignored for full text search queries), and is retrievable (it's not hidden). Other attributes are off by default, but can be enabled. You might use a `SimpleField` for document IDs or fields used only in filters, facets, or scoring profiles. If so, be sure to apply any attributes that are necessary for the scenario, such as `IsKey = true` for a document ID. For more information, see [SimpleFieldAttribute.cs](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/src/Indexes/SimpleFieldAttribute.cs) in source code. |
| [`SearchableField`](/dotnet/api/azure.search.documents.indexes.models.searchablefield) | Helper model. Must be a string, and is always searchable and retrievable. Other attributes are off by default, but can be enabled. Because this field type is searchable, it supports synonyms and the full complement of analyzer properties. For more information, see the [SearchableFieldAttribute.cs](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/src/Indexes/SearchableFieldAttribute.cs) in source code. |

Whether you use the basic `SearchField` API or either one of the helper models, you must explicitly enable filter, facet, and sort attributes. For example, [IsFilterable](/dotnet/api/azure.search.documents.indexes.models.searchfield.isfilterable), [IsSortable](/dotnet/api/azure.search.documents.indexes.models.searchfield.issortable), and [IsFacetable](/dotnet/api/azure.search.documents.indexes.models.searchfield.isfacetable) must be explicitly attributed, as shown in the sample above.

#### Adding field attributes

Notice how each field is decorated with attributes such as `IsFilterable`, `IsSortable`, `IsKey`, and `AnalyzerName`. These attributes map directly to the [corresponding field attributes in an Azure Cognitive Search index](/rest/api/searchservice/create-index). The `FieldBuilder` class uses these properties to construct field definitions for the index.

#### Field type mapping

The .NET types of the properties map to their equivalent field types in the index definition. For example, the `Category` string property maps to the `category` field, which is of type `Edm.String`. There are similar type mappings between `bool?`, `Edm.Boolean`, `DateTimeOffset?`, and `Edm.DateTimeOffset` and so on. 

Did you happen to notice the `SmokingAllowed` property?

```csharp
[JsonIgnore]
public bool? SmokingAllowed => (Rooms != null) ? Array.Exists(Rooms, element => element.SmokingAllowed == true) : (bool?)null;
```

The `JsonIgnore` attribute on this property tells the `FieldBuilder` to not serialize it to the index as a field.  This is a great way to create client-side calculated properties you can use as helpers in your application.  In this case, the `SmokingAllowed` property reflects whether any `Room` in the `Rooms` collection allows smoking. If all are false, it indicates that the entire hotel doesn't allow smoking.

## Load an index

The next step in `Main` populates the newly created "hotels" index. This index population is done in the following method:
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

This method has four parts. The first creates an array of three `Hotel` objects each with three `Room` objects that will serve as our input data to upload to the index. This data is hard-coded for simplicity. In an actual application, data will likely come from an external data source such as an SQL database.

The second part creates an [`IndexDocumentsBatch`](/dotnet/api/azure.search.documents.models.indexdocumentsbatch) containing the documents. You specify the operation you want to apply to the batch at the time you create it, in this case by calling [`IndexDocumentsAction.Upload`](/dotnet/api/azure.search.documents.models.indexdocumentsaction.upload). The batch is then uploaded to the Azure Cognitive Search index by the [`IndexDocuments`](/dotnet/api/azure.search.documents.searchclient.indexdocuments) method.

> [!NOTE]
> In this example, we are just uploading documents. If you wanted to merge changes into existing documents or delete documents, you could create batches by calling `IndexDocumentsAction.Merge`, `IndexDocumentsAction.MergeOrUpload`, or `IndexDocumentsAction.Delete` instead. You can also mix different operations in a single batch by calling `IndexBatch.New`, which takes a collection of `IndexDocumentsAction` objects, each of which tells Azure Cognitive Search to perform a particular operation on a document. You can create each `IndexDocumentsAction` with its own operation by calling the corresponding method such as `IndexDocumentsAction.Merge`, `IndexAction.Upload`, and so on.
> 

The third part of this method is a catch block that handles an important error case for indexing. If your search service fails to index some of the documents in the batch, a `RequestFailedException` is thrown. An exception can happen if you're indexing documents while your service is under heavy load. **We strongly recommend explicitly handling this case in your code.** You can delay and then retry indexing the documents that failed, or you can log and continue like the sample does, or you can do something else depending on your application's data consistency requirements. An alternative is to use [SearchIndexingBufferedSender](/dotnet/api/azure.search.documents.searchindexingbufferedsender-1) for intelligent batching, automatic flushing, and retries for failed indexing actions. See [this example](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.Search.Documents/samples/Sample05_IndexingDocuments.md#searchindexingbufferedsender) for more context.

Finally, the `UploadDocuments` method delays for two seconds. Indexing happens asynchronously in your search service, so the sample application needs to wait a short time to ensure that the documents are available for searching. Delays like this are typically only necessary in demos, tests, and sample applications.

### Call UploadDocuments in Main()

The following code snippet sets up an instance of [`SearchClient`](/dotnet/api/azure.search.documents.searchclient) using the [`GetSearchClient`](/dotnet/api/azure.search.documents.indexes.searchindexclient.getsearchclient) method of indexClient. The indexClient uses an admin API key on its requests, which is required for loading or refreshing documents.

An alternate approach is to call `SearchClient` directly, passing in an admin API key on `AzureKeyCredential`.

```csharp
SearchClient searchClient = indexClient.GetSearchClient(indexName);

Console.WriteLine("{0}", "Uploading documents...\n");
UploadDocuments(searchClient);
```

## Run queries

First, set up a `SearchClient` that reads the service endpoint and query API key from **appsettings.json**:

```csharp
private static SearchClient CreateSearchClientForQueries(string indexName, IConfigurationRoot configuration)
{
    string searchServiceEndPoint = configuration["SearchServiceEndPoint"];
    string queryApiKey = configuration["SearchServiceQueryApiKey"];

    SearchClient searchClient = new SearchClient(new Uri(searchServiceEndPoint), indexName, new AzureKeyCredential(queryApiKey));
    return searchClient;
}
```

Second, define a method that sends a query request. 

Each time the method executes a query, it creates a new [`SearchOptions`](/dotnet/api/azure.search.documents.searchoptions) object. This object is used to specify additional options for the query such as sorting, filtering, paging, and faceting. In this method, we're setting the `Filter`, `Select`, and `OrderBy` property for different queries. For more information about the search query expression syntax, [Simple query syntax](/rest/api/searchservice/Simple-query-syntax-in-Azure-Search).

The next step is query execution. Running the search is done using the `SearchClient.Search` method. For each query, pass the search text to use as a string (or `"*"` if there's no search text), plus the search options created earlier. We also specify `Hotel` as the type parameter for `SearchClient.Search`, which tells the SDK to deserialize documents in the search results into objects of type `Hotel`.

```csharp
private static void RunQueries(SearchClient searchClient)
{
    SearchOptions options;
    SearchResults<Hotel> results;

    Console.WriteLine("Query 1: Search for 'motel'. Return only the HotelName in results:\n");

    options = new SearchOptions();
    options.Select.Add("HotelName");

    results = searchClient.Search<Hotel>("motel", options);

    WriteDocuments(results);

    Console.Write("Query 2: Apply a filter to find hotels with rooms cheaper than $100 per night, ");
    Console.WriteLine("returning the HotelId and Description:\n");

    options = new SearchOptions()
    {
        Filter = "Rooms/any(r: r/BaseRate lt 100)"
    };
    options.Select.Add("HotelId");
    options.Select.Add("Description");

    results = searchClient.Search<Hotel>("*", options);

    WriteDocuments(results);

    Console.Write("Query 3: Search the entire index, order by a specific field (lastRenovationDate) ");
    Console.Write("in descending order, take the top two results, and show only hotelName and ");
    Console.WriteLine("lastRenovationDate:\n");

    options =
        new SearchOptions()
        {
            Size = 2
        };
    options.OrderBy.Add("LastRenovationDate desc");
    options.Select.Add("HotelName");
    options.Select.Add("LastRenovationDate");

    results = searchClient.Search<Hotel>("*", options);

    WriteDocuments(results);

    Console.WriteLine("Query 4: Search the HotelName field for the term 'hotel':\n");

    options = new SearchOptions();
    options.SearchFields.Add("HotelName");

    //Adding details to select, because "Location" isn't supported yet when deserializing search result to "Hotel"
    options.Select.Add("HotelId");
    options.Select.Add("HotelName");
    options.Select.Add("Description");
    options.Select.Add("Category");
    options.Select.Add("Tags");
    options.Select.Add("ParkingIncluded");
    options.Select.Add("LastRenovationDate");
    options.Select.Add("Rating");
    options.Select.Add("Address");
    options.Select.Add("Rooms");

    results = searchClient.Search<Hotel>("hotel", options);

    WriteDocuments(results);
}
```

Third, define a method that writes the response, printing each document to the console:

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

### Call RunQueries in Main()

```csharp
SearchClient indexClientForQueries = CreateSearchClientForQueries(indexName, configuration);

Console.WriteLine("{0}", "Running queries...\n");
RunQueries(indexClientForQueries);
```

### Explore query constructs

Let's take a closer look at each of the queries in turn. Here's the code to execute the first query:

```csharp
options = new SearchOptions();
options.Select.Add("HotelName");

results = searchClient.Search<Hotel>("motel", options);

WriteDocuments(results);
```

In this case, we're searching the entire index for the word "motel" in any searchable field and we only want to retrieve the hotel names, as specified by the `Select` option. Here are the results:

```output
Name: Secret Point Motel

Name: Twin Dome Motel
```

In the second query, use a filter to select room with a nightly rate of less than $100. Return only the hotel ID and description in the results:

```csharp
options = new SearchOptions()
{
    Filter = "Rooms/any(r: r/BaseRate lt 100)"
};
options.Select.Add("HotelId");
options.Select.Add("Description");

results = searchClient.Search<Hotel>("*", options);
```

The above query uses an OData `$filter` expression, `Rooms/any(r: r/BaseRate lt 100)`, to filter the documents in the index. This uses the [any operator](./search-query-odata-collection-operators.md) to apply the 'BaseRate lt 100' to every item in the Rooms collection. For more information, see [OData filter syntax](./query-odata-filter-orderby-syntax.md).

In the third query, find the top two hotels that have been most recently renovated, and show the hotel name and last renovation date. Here's the code: 

```csharp
options =
    new SearchOptions()
    {
        Size = 2
    };
options.OrderBy.Add("LastRenovationDate desc");
options.Select.Add("HotelName");
options.Select.Add("LastRenovationDate");

results = searchClient.Search<Hotel>("*", options);

WriteDocuments(results);
```

In the last query, find all hotels names that match the word "hotel":

```csharp
options.Select.Add("HotelId");
options.Select.Add("HotelName");
options.Select.Add("Description");
options.Select.Add("Category");
options.Select.Add("Tags");
options.Select.Add("ParkingIncluded");
options.Select.Add("LastRenovationDate");
options.Select.Add("Rating");
options.Select.Add("Address");
options.Select.Add("Rooms");

results = searchClient.Search<Hotel>("hotel", options);

WriteDocuments(results);
```

This section concludes this introduction to the .NET SDK, but don't stop here. The next section suggests other resources for learning more about programming with Azure Cognitive Search.

## Next steps

+ Browse the API reference documentation for [Azure.Search.Documents](/dotnet/api/azure.search.documents) and [REST API](/rest/api/searchservice/)

+ Browse other code samples based on Azure.Search.Documents in [azure-search-dotnet-samples](https://github.com/Azure-Samples/azure-search-dotnet-samples) and [search-getting-started-dotnet](https://github.com/Azure-Samples/search-dotnet-getting-started)

+ Review [naming conventions](/rest/api/searchservice/Naming-rules) to learn the rules for naming various objects

+ Review [supported data types](/rest/api/searchservice/Supported-data-types)
