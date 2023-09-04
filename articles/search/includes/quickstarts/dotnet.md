---
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: include
ms.date: 06/09/2023
---

Build a console application using the [**Azure.Search.Documents**](/dotnet/api/overview/azure/search.documents-readme) client library to create, load, and query a search index. Alternatively, you can [download the source code](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/quickstart/v11) to start with a finished project or follow these steps to create your own.

#### Set up your environment

1. Start Visual Studio and create a new project for a console app.

1. In **Tools** > **NuGet Package Manager**, select **Manage NuGet Packages for Solution...**.

1. Select **Browse**.

1. Search for [Azure.Search.Documents package](https://www.nuget.org/packages/Azure.Search.Documents/) and select version 11.0 or later.

1. Select **Install** on the right to add the assembly to your project and solution.

#### Create a search client

1. In **Program.cs**, change the namespace to `AzureSearch.SDK.Quickstart.v11` and then add the following `using` directives.

   ```csharp
   using Azure;
   using Azure.Search.Documents;
   using Azure.Search.Documents.Indexes;
   using Azure.Search.Documents.Indexes.Models;
   using Azure.Search.Documents.Models;
   ```

1. Create two clients: [SearchIndexClient](/dotnet/api/azure.search.documents.indexes.searchindexclient) creates the index, and [SearchClient](/dotnet/api/azure.search.documents.searchclient) loads and queries an existing index. Both need the service endpoint and an admin API key for authentication with create/delete rights.

   Because the code builds out the URI for you, specify just the search service name in the "serviceName" property.

   ```csharp
    static void Main(string[] args)
    {
        string serviceName = "<your-search-service-name>";
        string apiKey = "<your-search-service-admin-api-key>";
        string indexName = "hotels-quickstart";

        // Create a SearchIndexClient to send create/delete index commands
        Uri serviceEndpoint = new Uri($"https://{serviceName}.search.windows.net/");
        AzureKeyCredential credential = new AzureKeyCredential(apiKey);
        SearchIndexClient adminClient = new SearchIndexClient(serviceEndpoint, credential);

        // Create a SearchClient to load and query documents
        SearchClient srchclient = new SearchClient(serviceEndpoint, indexName, credential);
        . . . 
    }
    ```

#### Create an index

This quickstart builds a Hotels index that you'll load with hotel data and execute queries against. In this step, define the fields in the index. Each field definition includes a name, data type, and attributes that determine how the field is used.

In this example, synchronous methods of the Azure.Search.Documents library are used for simplicity and readability. However, for production scenarios, you should use asynchronous methods to keep your app scalable and responsive. For example, you would use [CreateIndexAsync](/dotnet/api/azure.search.documents.indexes.searchindexclient.createindexasync) instead of [CreateIndex](/dotnet/api/azure.search.documents.indexes.searchindexclient.createindex).

1. Add an empty class definition to your project: **Hotel.cs**

1. Copy the following code into **Hotel.cs** to define the structure of a hotel document. Attributes on the field determine how it's used in an application. For example, the `IsFilterable` attribute must be assigned to every field that supports a filter expression.

    ```csharp
    using System;
    using System.Text.Json.Serialization;
    using Azure.Search.Documents.Indexes;
    using Azure.Search.Documents.Indexes.Models;

    namespace AzureSearch.Quickstart
    {
        public partial class Hotel
        {
            [SimpleField(IsKey = true, IsFilterable = true)]
            public string HotelId { get; set; }

            [SearchableField(IsSortable = true)]
            public string HotelName { get; set; }

            [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnLucene)]
            public string Description { get; set; }

            [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.FrLucene)]
            [JsonPropertyName("Description_fr")]
            public string DescriptionFr { get; set; }

            [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public string Category { get; set; }

            [SearchableField(IsFilterable = true, IsFacetable = true)]
            public string[] Tags { get; set; }

            [SimpleField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public bool? ParkingIncluded { get; set; }

            [SimpleField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public DateTimeOffset? LastRenovationDate { get; set; }

            [SimpleField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public double? Rating { get; set; }

            [SearchableField]
            public Address Address { get; set; }
        }
    }
    ```

   In the Azure.Search.Documents client library, you can use [SearchableField](/dotnet/api/azure.search.documents.indexes.models.searchablefield) and [SimpleField](/dotnet/api/azure.search.documents.indexes.models.simplefield) to streamline field definitions. Both are derivatives of a [SearchField](/dotnet/api/azure.search.documents.indexes.models.searchfield) and can potentially simplify your code:

   + `SimpleField` can be any data type, is always non-searchable (it's ignored for full text search queries), and is retrievable (it's not hidden). Other attributes are off by default, but can be enabled. You might use a `SimpleField` for document IDs or fields used only in filters, facets, or scoring profiles. If so, be sure to apply any attributes that are necessary for the scenario, such as `IsKey = true` for a document ID. For more information, see [SimpleFieldAttribute.cs](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/src/Indexes/SimpleFieldAttribute.cs) in source code.

   + `SearchableField` must be a string, and is always searchable and retrievable. Other attributes are off by default, but can be enabled. Because this field type is searchable, it supports synonyms and the full complement of analyzer properties. For more information, see the [SearchableFieldAttribute.cs](https://github.com/Azure/azure-sdk-for-net/blob/master/sdk/search/Azure.Search.Documents/src/Indexes/SearchableFieldAttribute.cs) in source code.

   Whether you use the basic `SearchField` API or either one of the helper models, you must explicitly enable filter, facet, and sort attributes. For example, [IsFilterable](/dotnet/api/azure.search.documents.indexes.models.searchfield.isfilterable), [IsSortable](/dotnet/api/azure.search.documents.indexes.models.searchfield.issortable), and [IsFacetable](/dotnet/api/azure.search.documents.indexes.models.searchfield.isfacetable) must be explicitly attributed, as shown in the sample above.

1. Add a second empty class definition to your project: **Address.cs**.  Copy the following code into the class.

   ```csharp
   using Azure.Search.Documents.Indexes;

    namespace AzureSearch.Quickstart
    {
        public partial class Address
        {
            [SearchableField(IsFilterable = true)]
            public string StreetAddress { get; set; }

            [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public string City { get; set; }

            [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public string StateProvince { get; set; }

            [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public string PostalCode { get; set; }

            [SearchableField(IsFilterable = true, IsSortable = true, IsFacetable = true)]
            public string Country { get; set; }
        }
    }
   ```

1. Create two more classes: **Hotel.Methods.cs** and **Address.Methods.cs** for ToString() overrides. These classes are used to render search results in the console output.  The contents of these classes aren't provided in this article, but you can copy the code from [files in GitHub](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/quickstart/v11/AzureSearchQuickstart-v11).

1. In **Program.cs**, create a [SearchIndex](/dotnet/api/azure.search.documents.indexes.models.searchindex) object, and then call the [CreateIndex](/dotnet/api/azure.search.documents.indexes.searchindexclient.createindex) method to express the index in your search service. The index also includes a [SearchSuggester](/dotnet/api/azure.search.documents.indexes.models.searchsuggester) to enable autocomplete on the specified fields.

   ```csharp
    // Create hotels-quickstart index
    private static void CreateIndex(string indexName, SearchIndexClient adminClient)
    {
        FieldBuilder fieldBuilder = new FieldBuilder();
        var searchFields = fieldBuilder.Build(typeof(Hotel));

        var definition = new SearchIndex(indexName, searchFields);

        var suggester = new SearchSuggester("sg", new[] { "HotelName", "Category", "Address/City", "Address/StateProvince" });
        definition.Suggesters.Add(suggester);

        adminClient.CreateOrUpdateIndex(definition);
    }
   ```

#### Load documents

Azure Cognitive Search searches over content stored in the service. In this step, you'll load JSON documents that conform to the hotel index you just created.

In Azure Cognitive Search, search documents are data structures that are both inputs to indexing and outputs from queries. As obtained from an external data source, document inputs might be rows in a database, blobs in Blob storage, or JSON documents on disk. In this example, we're taking a shortcut and embedding JSON documents for four hotels in the code itself.

When uploading documents, you must use an [IndexDocumentsBatch](/dotnet/api/azure.search.documents.models.indexdocumentsbatch-1) object. An `IndexDocumentsBatch` object contains a collection of [Actions](/dotnet/api/azure.search.documents.models.indexdocumentsbatch-1.actions), each of which contains a document and a property telling Azure Cognitive Search what action to perform ([upload, merge, delete, and mergeOrUpload](/azure/search/search-what-is-data-import#indexing-actions)).

1. In **Program.cs**, create an array of documents and index actions, and then pass the array to `IndexDocumentsBatch`. The documents below conform to the hotels-quickstart index, as defined by the hotel class.

    ```csharp
    // Upload documents in a single Upload request.
    private static void UploadDocuments(SearchClient searchClient)
    {
        IndexDocumentsBatch<Hotel> batch = IndexDocumentsBatch.Create(
            IndexDocumentsAction.Upload(
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
                }),
            IndexDocumentsAction.Upload(
                new Hotel()
                {
                    HotelId = "2",
                    HotelName = "Twin Dome Motel",
                    Description = "The hotel is situated in a  nineteenth century plaza, which has been expanded and renovated to the highest architectural standards to create a modern, functional and first-class hotel in which art and unique historical elements coexist with the most modern comforts.",
                    DescriptionFr = "L'hôtel est situé dans une place du XIXe siècle, qui a été agrandie et rénovée aux plus hautes normes architecturales pour créer un hôtel moderne, fonctionnel et de première classe dans lequel l'art et les éléments historiques uniques coexistent avec le confort le plus moderne.",
                    Category = "Boutique",
                    Tags = new[] { "pool", "free wifi", "concierge" },
                    ParkingIncluded = false,
                    LastRenovationDate = new DateTimeOffset(1979, 2, 18, 0, 0, 0, TimeSpan.Zero),
                    Rating = 3.60,
                    Address = new Address()
                    {
                        StreetAddress = "140 University Town Center Dr",
                        City = "Sarasota",
                        StateProvince = "FL",
                        PostalCode = "34243",
                        Country = "USA"
                    }
                }),
            IndexDocumentsAction.Upload(
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
                }),
            IndexDocumentsAction.Upload(
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
                    Rating = 4.60,
                    Address = new Address()
                    {
                        StreetAddress = "7400 San Pedro Ave",
                        City = "San Antonio",
                        StateProvince = "TX",
                        PostalCode = "78216",
                        Country = "USA"
                    }
                })
            );

        try
        {
            IndexDocumentsResult result = searchClient.IndexDocuments(batch);
        }
        catch (Exception)
        {
            // If for some reason any documents are dropped during indexing, you can compensate by delaying and
            // retrying. This simple demo just logs the failed document keys and continues.
            Console.WriteLine("Failed to index some of the documents: {0}");
        }
    }
    ```

    Once you initialize the [IndexDocumentsBatch](/dotnet/api/azure.search.documents.models.indexdocumentsbatch-1) object, you can send it to the index by calling [IndexDocuments](/dotnet/api/azure.search.documents.searchclient.indexdocuments) on your [SearchClient](/dotnet/api/azure.search.documents.searchclient) object.

1. Add the following lines to Main(). Loading documents is done using SearchClient, but the operation also requires admin rights on the service, which is typically associated with SearchIndexClient. One way to set up this operation is to get SearchClient through SearchIndexClient (adminClient in this example).

   ```csharp
    SearchClient ingesterClient = adminClient.GetSearchClient(indexName);

    // Load documents
    Console.WriteLine("{0}", "Uploading documents...\n");
    UploadDocuments(ingesterClient);
   ```

1. Because this is a console app that runs all commands sequentially, add a 2-second wait time between indexing and queries.

    ```csharp
    // Wait 2 seconds for indexing to complete before starting queries (for demo and console-app purposes only)
    Console.WriteLine("Waiting for indexing...\n");
    System.Threading.Thread.Sleep(2000);
    ```

    The 2-second delay compensates for indexing, which is asynchronous, so that all documents can be indexed before the queries are executed. Coding in a delay is typically only necessary in demos, tests, and sample applications.

#### Search an index

You can get query results as soon as the first document is indexed, but actual testing of your index should wait until all documents are indexed.

This section adds two pieces of functionality: query logic, and results. For queries, use the [Search](/dotnet/api/azure.search.documents.searchclient.search) method. This method takes search text (the query string) and other [options](/dotnet/api/azure.search.documents.searchoptions).

The [SearchResults](/dotnet/api/azure.search.documents.models.searchresults-1) class represents the results.

1. In **Program.cs**, create a **WriteDocuments** method that prints search results to the console.

    ```csharp
    // Write search results to console
    private static void WriteDocuments(SearchResults<Hotel> searchResults)
    {
        foreach (SearchResult<Hotel> result in searchResults.GetResults())
        {
            Console.WriteLine(result.Document);
        }

        Console.WriteLine();
    }

    private static void WriteDocuments(AutocompleteResults autoResults)
    {
        foreach (AutocompleteItem result in autoResults.Results)
        {
            Console.WriteLine(result.Text);
        }

        Console.WriteLine();
    }
    ```

1. Create a **RunQueries** method to execute queries and return results. Results are Hotel objects. This sample shows the method signature and the first query. This query demonstrates the Select parameter that lets you compose the result using selected fields from the document.

    ```csharp
    // Run queries, use WriteDocuments to print output
    private static void RunQueries(SearchClient srchclient)
    {
        SearchOptions options;
        SearchResults<Hotel> response;
        
        // Query 1
        Console.WriteLine("Query #1: Search on empty term '*' to return all documents, showing a subset of fields...\n");

        options = new SearchOptions()
        {
            IncludeTotalCount = true,
            Filter = "",
            OrderBy = { "" }
        };

        options.Select.Add("HotelId");
        options.Select.Add("HotelName");
        options.Select.Add("Address/City");

        response = srchclient.Search<Hotel>("*", options);
        WriteDocuments(response);
    ```

1. In the second query, search on a term, add a filter that selects documents where Rating is greater than 4, and then sort by Rating in descending order. Filter is a boolean expression that is evaluated over [IsFilterable](/dotnet/api/azure.search.documents.indexes.models.searchfield.isfilterable) fields in an index. Filter queries either include or exclude values. As such, there's no relevance score associated with a filter query.

    ```csharp
    // Query 2
    Console.WriteLine("Query #2: Search on 'hotels', filter on 'Rating gt 4', sort by Rating in descending order...\n");

    options = new SearchOptions()
    {
        Filter = "Rating gt 4",
        OrderBy = { "Rating desc" }
    };

    options.Select.Add("HotelId");
    options.Select.Add("HotelName");
    options.Select.Add("Rating");

    response = srchclient.Search<Hotel>("hotels", options);
    WriteDocuments(response);
    ```

1. The third query demonstrates searchFields, used to scope a full text search operation to specific fields.

    ```csharp
    // Query 3
    Console.WriteLine("Query #3: Limit search to specific fields (pool in Tags field)...\n");

    options = new SearchOptions()
    {
        SearchFields = { "Tags" }
    };

    options.Select.Add("HotelId");
    options.Select.Add("HotelName");
    options.Select.Add("Tags");

    response = srchclient.Search<Hotel>("pool", options);
    WriteDocuments(response);
    ```

1. The fourth query demonstrates facets, which can be used to structure a faceted navigation structure.

   ```csharp
    // Query 4
    Console.WriteLine("Query #4: Facet on 'Category'...\n");

    options = new SearchOptions()
    {
        Filter = ""
    };

    options.Facets.Add("Category");

    options.Select.Add("HotelId");
    options.Select.Add("HotelName");
    options.Select.Add("Category");

    response = srchclient.Search<Hotel>("*", options);
    WriteDocuments(response);
   ```

1. In the fifth query, return a specific document. A document lookup is a typical response to OnClick event in a result set.

   ```csharp
    // Query 5
    Console.WriteLine("Query #5: Look up a specific document...\n");

    Response<Hotel> lookupResponse;
    lookupResponse = srchclient.GetDocument<Hotel>("3");

    Console.WriteLine(lookupResponse.Value.HotelId);
   ```

1. The last query shows the syntax for autocomplete, simulating a partial user input of "sa" that resolves to two possible matches in the sourceFields associated with the suggester you defined in the index.

   ```csharp
    // Query 6
    Console.WriteLine("Query #6: Call Autocomplete on HotelName that starts with 'sa'...\n");

    var autoresponse = srchclient.Autocomplete("sa", "sg");
    WriteDocuments(autoresponse);
   ```

1. Add **RunQueries** to Main().

    ```csharp
    // Call the RunQueries method to invoke a series of queries
    Console.WriteLine("Starting queries...\n");
    RunQueries(srchclient);

    // End the program
    Console.WriteLine("{0}", "Complete. Press any key to end this program...\n");
    Console.ReadKey();
    ```

The previous queries show multiple [ways of matching terms in a query](/azure/search/search-query-overview#types-of-queries): full-text search, filters, and autocomplete.

Full text search and filters are performed using the [SearchClient.Search](/dotnet/api/azure.search.documents.searchclient.search) method. A search query can be passed in the `searchText` string, while a filter expression can be passed in the [Filter](/dotnet/api/azure.search.documents.searchoptions.filter) property of the [SearchOptions](/dotnet/api/azure.search.documents.searchoptions) class. To filter without searching, just pass `"*"` for the `searchText` parameter of the [Search](/dotnet/api/azure.search.documents.searchclient.search) method. To search without filtering, leave the `Filter` property unset, or don't pass in a `SearchOptions` instance at all.

#### Run the program

Press F5 to rebuild the app and run the program in its entirety.

Output includes messages from [Console.WriteLine](/dotnet/api/system.console.writeline), with the addition of query information and results.
