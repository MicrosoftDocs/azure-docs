---
title: 'Quickstart: Create a search index in .NET'
titleSuffix: Azure Cognitive Search
description: In this C# quickstart, learn how to create an index, load data, and run queries using the Azure.Search.Documents client library.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 10/28/2020
ms.custom: devx-track-csharp

---
# Quickstart: Create a search index using the Azure.Search.Documents client library

Use the new [Azure.Search.Documents (version 11) client library](/dotnet/api/overview/azure/search.documents-readme) to create a .NET Core console application in C# that creates, loads, and queries a search index.

[Download the source code](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/quickstart/v11) to start with a finished project or follow the steps in this article to create your own.

> [!NOTE]
> Looking for an earlier version? See [Create a search index using Microsoft.Azure.Search v10](search-get-started-dotnet-v10.md) instead.

## Prerequisites

Before you begin, have the following tools and services:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

+ An Azure Cognitive Search service. [Create a service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices). You can use a free service for this quickstart. 

+ [Visual Studio](https://visualstudio.microsoft.com/downloads/), any edition. Sample code was tested on the free Community edition of Visual Studio 2019.

+ [Azure.Search.Documents NuGet package](https://www.nuget.org/packages/Azure.Search.Documents/)

Azure SDK for .NET conforms to [.NET Standard 2.0](/dotnet/standard/net-standard#net-implementation-support), which means .NET Framework 4.6.1 and .NET Core 2.0 as minimum requirements.

## Set up your project

Assemble service connection information, and then start Visual Studio to create a new Console App project that can run on .NET Core.

<a name="get-service-info"></a>

### Copy a key and endpoint

Calls to the service require a URL endpoint and an access key on every request. As a first step, find the API key and URL to add to your project. You will specify both values when creating the client in a later step.

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

2. In **Settings** > **Keys**, get an admin key for full rights on the service, required if you are creating or deleting objects. There are two interchangeable primary and secondary keys. You can use either one.

   ![Get an HTTP endpoint and access key](media/search-get-started-postman/get-url-key.png "Get an HTTP endpoint and access key")

All requests require an api-key on every request sent to your service. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

### Install the Nuget package

1. In Visual Studio, create a new project using the Console App (.NET Core) template for C#.

1. Search for `Azure.Search.Documents` and select version 11.0 or later.

### Create a search client

1. In **Program.cs**, change the namespace to `AzureSearch.SDK.Quickstart.v11` and then add the following `using` directives.

   ```csharp
   using Azure;
   using Azure.Search.Documents;
   using Azure.Search.Documents.Indexes;
   using Azure.Search.Documents.Indexes.Models;
   using Azure.Search.Documents.Models;
   ```

1. Create two clients: [SearchIndexClient](/dotnet/api/azure.search.documents.indexes.searchindexclient) creates the index, and [SearchClient](/dotnet/api/azure.search.documents.searchclient) loads and queries an existing index. Both need the service endpoint and an admin API key for authentication with create/delete rights.

   ```csharp
   static void Main(string[] args)
   {
       string serviceName = "<YOUR-SERVICE-NAME>";
       string indexName = "hotels-quickstart-v11";
       string apiKey = "<YOUR-ADMIN-API-KEY>";

       // Create a SearchIndexClient to send create/delete index commands
       Uri serviceEndpoint = new Uri($"https://{serviceName}.search.windows.net/");
       AzureKeyCredential credential = new AzureKeyCredential(apiKey);
       SearchIndexClient idxclient = new SearchIndexClient(serviceEndpoint, credential);

       // Create a SearchClient to load and query documents
       SearchClient srchclient = new SearchClient(serviceEndpoint, indexName, credential);
    ```

## 1 - Create an index

This quickstart builds a Hotels index that you'll load with hotel data and execute queries against. In this step, define the fields in the index. Each field definition includes a name, data type, and attributes that determine how the field is used.

In this example, synchronous methods of the Azure.Search.Documents library are used for simplicity and readability. However, for production scenarios, you should use asynchronous methods to keep your app scalable and responsive. For example, you would use [CreateIndexAsync](/dotnet/api/azure.search.documents.indexes.searchindexclient.createindexasync) instead of [CreateIndex](/dotnet/api/azure.search.documents.indexes.searchindexclient.createindex).

1. Add an empty class definition to your project: **Hotel.cs**

1. In **Hotel.cs**, define the structure of a hotel document.

    ```csharp
    using System;
    using System.Text.Json.Serialization;

    namespace AzureSearch.SDK.Quickstart.v11
    {
        public class Hotel
        {
            [JsonPropertyName("hotelId")]
            public string Id { get; set; }

            [JsonPropertyName("hotelName")]
            public string Name { get; set; }

            [JsonPropertyName("hotelCategory")]
            public string Category { get; set; }

            [JsonPropertyName("baseRate")]
            public Int32 Rate { get; set; }

            [JsonPropertyName("lastRenovationDate")]
            public DateTime Updated { get; set; }
        }
    }
    ```

1. In **Program.cs**, create a [SearchIndex](/dotnet/api/azure.search.documents.indexes.models.searchindex) object by calling  [CreateIndex](/dotnet/api/azure.search.documents.indexes.searchindexclient.createindex) method on `SearchIndexClient`.

    ```csharp
    private static void CreateIndex(string indexName, SearchIndexClient indexClient)
    {
        FieldBuilder fieldBuilder = new FieldBuilder();
        var searchFields = fieldBuilder.Build(typeof(Hotel));
        var definition = new SearchIndex(indexName, searchFields);

        indexClient.CreateOrUpdateIndex(definition);
    }
    ```

   <!-- ```csharp
    // Define an index schema using SearchIndex
    // Create the index using SearchIndexClient
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

    Console.WriteLine("{0}", "Creating index...\n");
    idxclient.CreateIndex(index);
   ``` -->

Attributes on the field determine how it is used in an application. For example, the `IsFilterable` attribute must be assigned to every field that supports a filter expression.

In the Azure.Search.Documents client library, you can use [SearchableField](/dotnet/api/azure.search.documents.indexes.models.searchablefield) and [SimpleField](/dotnet/api/azure.search.documents.indexes.models.simplefield) to streamline field definitions. Both are derivatives of a [SearchField](/dotnet/api/azure.search.documents.indexes.models.searchfield) and can potentially simplify your code:

+ `SimpleField` can be any data type, is always non-searchable (it's ignored for full text search queries), and is retrievable (it's not hidden). Other attributes are off by default, but can be enabled. You might use a `SimpleField` for document IDs or fields used only in filters, facets, or scoring profiles. If so, be sure to apply any attributes that are necessary for the scenario, such as `IsKey = true` for a document ID. For more information, see [SimpleFieldAttribute.cs](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/src/Indexes/SimpleFieldAttribute.cs) in source code.

+ `SearchableField` must be a string, and is always searchable and retrievable. Other attributes are off by default, but can be enabled. Because this field type is searchable, it supports synonyms and the full complement of analyzer properties. For more information, see the [SearchableFieldAttribute.cs](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/src/Indexes/SearchableFieldAttribute.cs) in source code.

Whether you use the basic `SearchField` API or either one of the helper models, you must explicitly enable filter, facet, and sort attributes. For example, [IsFilterable](/dotnet/api/azure.search.documents.indexes.models.searchfield.isfilterable), [IsSortable](/dotnet/api/azure.search.documents.indexes.models.searchfield.issortable), and [IsFacetable](/dotnet/api/azure.search.documents.indexes.models.searchfield.isfacetable) must be explicitly attributed, as shown in the sample above. 

<a name="load-documents"></a>

## 2 - Load documents

Azure Cognitive Search searches over content stored in the service. In this step, you'll load JSON documents that conform to the hotel index you just created.

In Azure Cognitive Search, search documents are data structures that are both inputs to indexing and outputs from queries. As obtained from an external data source, document inputs might be rows in a database, blobs in Blob storage, or JSON documents on disk. In this example, we're taking a shortcut and embedding JSON documents for five hotels in the code itself. 

When uploading documents, you must use an [IndexDocumentsBatch](/dotnet/api/azure.search.documents.models.indexdocumentsbatch-1) object. An `IndexDocumentsBatch` object contains a collection of [Actions](/dotnet/api/azure.search.documents.models.indexdocumentsbatch-1.actions), each of which contains a document and a property telling Azure Cognitive Search what action to perform ([upload, merge, delete, and mergeOrUpload](search-what-is-data-import.md#indexing-actions)).

1. In **Program.cs**, create an array of documents and index actions, and then pass the array to `IndexDocumentsBatch`. The documents below conform to the hotels-quickstart-v11 index, as defined by the hotel class.

    ```csharp
    // Load documents (using a subset of fields for brevity)
    IndexDocumentsBatch<Hotel> batch = IndexDocumentsBatch.Create(
        IndexDocumentsAction.Upload(new Hotel { Id = "78", Name = "Upload Inn", Category = "hotel", Rate = 279, Updated = new DateTime(2018, 3, 1, 7, 0, 0) }),
        IndexDocumentsAction.Upload(new Hotel { Id = "54", Name = "Breakpoint by the Sea", Category = "motel", Rate = 162, Updated = new DateTime(2015, 9, 12, 7, 0, 0) }),
        IndexDocumentsAction.Upload(new Hotel { Id = "39", Name = "Debug Motel", Category = "motel", Rate = 159, Updated = new DateTime(2016, 11, 11, 7, 0, 0) }),
        IndexDocumentsAction.Upload(new Hotel { Id = "48", Name = "NuGet Hotel", Category = "hotel", Rate = 238, Updated = new DateTime(2016, 5, 30, 7, 0, 0) }),
        IndexDocumentsAction.Upload(new Hotel { Id = "12", Name = "Renovated Ranch", Category = "motel", Rate = 149, Updated = new DateTime(2020, 1, 24, 7, 0, 0) }));

    IndexDocumentsOptions idxoptions = new IndexDocumentsOptions { ThrowOnAnyError = true };

    Console.WriteLine("{0}", "Loading index...\n");
    srchclient.IndexDocuments(batch, idxoptions);
    ```

    Once you initialize the [IndexDocumentsBatch](/dotnet/api/azure.search.documents.models.indexdocumentsbatch-1) object, you can send it to the index by calling [IndexDocuments](/dotnet/api/azure.search.documents.searchclient.indexdocuments) on your [SearchClient](/dotnet/api/azure.search.documents.searchclient) object.

1. Because this is a console app that runs all commands sequentially, add a 2-second delay.

    ```csharp
    // Wait 2 seconds for indexing to complete before starting queries (for demo and console-app purposes only)
    Console.WriteLine("Waiting for indexing...\n");
    System.Threading.Thread.Sleep(2000);
    ```

    The 2-second delay compensates for indexing, which is asynchronous, so that all documents can be indexed before the queries are executed. Coding in a delay is typically only necessary in demos, tests, and sample applications.

## 3 - Search an index

You can get query results as soon as the first document is indexed, but for proper testing, wait until all documents are indexed.

This section adds two pieces of functionality: query logic, and results. For queries, use the [Search](/dotnet/api/azure.search.documents.searchclient.search) method. This method takes search text (the query string) as well as other [options](/dotnet/api/azure.search.documents.searchoptions).

The [SearchResults](/dotnet/api/azure.search.documents.models.searchresults-1) class represents the results.

1. In **Program.cs**, create a WriteDocuments method that prints search results to the console.

    ```csharp
    private static void WriteDocuments(SearchResults<Hotel> searchResults)
    {
        foreach (SearchResult<Hotel> response in searchResults.GetResults())
        {
            Hotel doc = response.Document;
            var score = response.Score;
            Console.WriteLine($"Name: {doc.Name}, Type: {doc.Category}, Rate: {doc.Rate}, Last-update: {doc.Updated}, Score: {score}");
        }

        Console.WriteLine();
    }
    ```

1. Create a RunQueries method to execute queries and return results. Results are Hotel objects.

    ```csharp
    private static void RunQueries(SearchClient srchclient)
    {
        SearchOptions options;
        SearchResults<Hotel> response;

        Console.WriteLine("Query #1: Search on the term 'motel' and list the relevance score for each match...\n");

        options = new SearchOptions()
        {
            Filter = "",
            OrderBy = { "" }
        };

        response = srchclient.Search<Hotel>("motel", options);
        WriteDocuments(response);

        Console.WriteLine("Query #2: Find hotels where 'type' equals hotel...\n");

        options = new SearchOptions()
        {
            Filter = "hotelCategory eq 'hotel'",
        };

        response = srchclient.Search<Hotel>("*", options);
        WriteDocuments(response);

        Console.WriteLine("Query #3: Filter on rates less than $200 and sort by when the hotel was last updated...\n");

        options = new SearchOptions()
        {
            Filter = "baseRate lt 200",
            OrderBy = { "lastRenovationDate desc" }
        };

        response = srchclient.Search<Hotel>("*", options);
        WriteDocuments(response);
    }
    ```

1. Add RunQueries to `Main()`.

    ```csharp
    Console.WriteLine("Starting queries...\n");
    RunQueries(srchclient);
    ```

This example shows the two [ways of matching terms in a query](search-query-overview.md#types-of-queries): full-text search, and filters:

+ Full-text search queries for one or more terms in searchable fields in your index. The first query is full text search. Full-text search produces relevance scores used to rank the results.

+ Filter is a boolean expression that is evaluated over [IsFilterable](/dotnet/api/azure.search.documents.indexes.models.searchfield.isfilterable) fields in an index. Filter queries either include or exclude values. As such, there is no relevance score associated with a filter query. The last two queries demonstrate filter search.

You can use full-text search and filters together or separately.

Both searches and filters are performed using the [SearchClient.Search](/dotnet/api/azure.search.documents.searchclient.search) method. A search query can be passed in the `searchText` string, while a filter expression can be passed in the [Filter](/dotnet/api/azure.search.documents.searchoptions.filter) property of the [SearchOptions](/dotnet/api/azure.search.documents.searchoptions) class. To filter without searching, just pass `"*"` for the `searchText` parameter of the [Search](/dotnet/api/azure.search.documents.searchclient.search) method. To search without filtering, leave the `Filter` property unset, or do not pass in a `SearchOptions` instance at all.

## Run the program

Press F5 to rebuild the app and run the program in its entirety. 

Output includes messages from [Console.WriteLine](/dotnet/api/system.console.writeline), with the addition of query information and results.

## Next steps

In this C# quickstart, you worked through a set of tasks to create an index, load it with documents, and run queries. At different stages, we took shortcuts to simplify the code for readability and comprehension. If you are comfortable with the basic concepts, we recommend the next article for an exploration of alternative approaches and concepts that will deepen your knowledge. 

> [!div class="nextstepaction"]
> [How to develop in .NET](search-howto-dotnet-sdk.md)

Want to optimize and save on your cloud spending?

> [!div class="nextstepaction"]
> [Start analyzing costs with Cost Management](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)
