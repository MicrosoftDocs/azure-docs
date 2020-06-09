---
title: 'Search an index in .NET'
titleSuffix: Azure Cognitive Search
description: In this C# quickstart, learn how to connect and send queries to a search service on Azure.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 06/11/2020

---
# Quickstart: Search an index in C# using the .NET SDK

Create a .NET Core C# console application that connects to an Azure Cognitive Search service and submits query requests. The index is depoyed and managed by Microsoft so that you can focus on connections and queries.

## Prerequisites

Before you begin, you must have the following:

+ [Visual Studio](https://visualstudio.microsoft.com/downloads/), any edition.

## Create a .NET Core console app

1. In Visual Studio, create a new project using the Console App (.NET Core) template for C#.

1. Install the Azure Cognitive Search client library for .NET with NuGet. In **Tools** > **NuGet Package Manager**, select **Manage NuGet Packages for Solution**.

1. Browse for **Azure.Search.Documents** with **pre-release** selected to install the newest SDK.

1. Choose **version 1.0.0-preview.3** and click **Install**.

    :::image type="content" source="./media/search-get-started-dotnet/package-install.png" alt-text="Install package" border="true":::

1. Open **Program.cs** and overwrite the template with the following code:

    ```csharp
    using System;
    using Azure;
    using Azure.Search.Documents;
    using Azure.Search.Documents.Models;

    namespace quickstart_dotnet
    {
        class Program
        {
            static void Main(string[] args)
            {
                string serviceName = "azs-playground";
                string indexName = "nycjobs";
                string apiKey = "252044BE3886FE4A8E3BAA4F595114BB";

                // Create a SearchClient to send queries
                Uri serviceEndpoint = new Uri($"https://{serviceName}.search.windows.net/");
                AzureKeyCredential credential = new AzureKeyCredential(apiKey);
                SearchClient client = new SearchClient(serviceEndpoint, indexName, credential);

                // Select the top 5 jobs related to city research scientist
                string queryExpression = "city research scientist";

                SearchResults<SearchDocument> response = client.Search(queryExpression, new SearchOptions { Size = 5 });
                foreach (SearchResult<SearchDocument> result in response.GetResults())
                {
                    // Print out the title and job description 
                    string title = (string)result.Document["business_title"];
                    string description = (string)result.Document["job_description"];
                    Console.WriteLine($"{title}\n{description}\n");
                }
            }
        }
    }
    ```

## Send your first search query

Press **F5** to build and run the console application. The query is a simple free text search over the phrase "SQL Server Database Administrator".

Five search results, composed of the job title and job description, are returned to the console. While not entirely visible in the screenshot, the terms are in each description.


    :::image type="content" source="./media/search-get-started-dotnet/results-first-query.png" alt-text="Results of the first query" border="true":::



<!-- 
   ADD FIELDS TO RESULTS
            SearchResults<SearchDocument> response = client.Search(queryExpression, new SearchOptions { Size = 5 });
            foreach (SearchResult<SearchDocument> result in response.GetResults())
            {
                // Print out the title and job description 
                string title = (string)result.Document["business_title"];
                string jobNum = (string)result.Document["job_id"];
                string location = (string)result.Document["work_location"];
                string type = (string)result.Document["posting_type"];
                string description = (string)result.Document["job_description"];
                Console.WriteLine($"{title}\n{jobNum}\n{location}\n{type}\n{description}\n");
            } -->




<!-- ## Set up your environment

## 3 - Search an index

You can get query results as soon as the first document is indexed, but actual testing of your index should wait until all documents are indexed. 

This section adds two pieces of functionality: query logic, and results. For queries, use the [`Search`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.documentsoperationsextensions.search?view=azure-dotnet
) method. This method takes search text as well as other [parameters](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.searchparameters?view=azure-dotnet). 

The [`DocumentsSearchResult`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.documentsearchresult-1?view=azure-dotnet) class represents the results.


1. In Program.cs, create a WriteDocuments method that prints search results to the console.

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

1. Create a RunQueries method to execute queries and return results. Results are Hotel objects. You can use the select parameter to surface individual fields. If a field is not included in the select parameter, its corresponding Hotel property will be null.

    ```csharp
    private static void RunQueries(ISearchIndexClient indexClient)
    {
        SearchParameters parameters;
        DocumentSearchResult<Hotel> results;

        // Query 4 -filtered query
        Console.WriteLine("Query 4: Filter on ratings greater than 4");
        Console.WriteLine("Returning only these fields: HotelName, Rating:\n");
        parameters =
            new SearchParameters()
            {
                Filter = "Rating gt 4",
                Select = new[] { "HotelName", "Rating" }
            };
        results = indexClient.Documents.Search<Hotel>("*", parameters);
        WriteDocuments(results);

        // Query 5 - top 2 results
        Console.WriteLine("Query 5: Search on term 'boutique'");
        Console.WriteLine("Sort by rating in descending order, taking the top two results");
        Console.WriteLine("Returning only these fields: HotelId, HotelName, Category, Rating:\n");
        parameters =
            new SearchParameters()
            {
                OrderBy = new[] { "Rating desc" },
                Select = new[] { "HotelId", "HotelName", "Category", "Rating" },
                Top = 2
            };
        results = indexClient.Documents.Search<Hotel>("boutique", parameters);
        WriteDocuments(results);
    }
    ```

    There are two [ways of matching terms in a query](search-query-overview.md#types-of-queries): full-text search, and filters. A full-text search query searches for one or more terms in `IsSearchable` fields in your index. A filter is a boolean expression that is evaluated over `IsFilterable` fields in an index. You can use full-text search and filters together or separately.

    Both searches and filters are performed using the `Documents.Search` method. A search query can be passed in the `searchText` parameter, while a filter expression can be passed in the `Filter` property of the `SearchParameters` class. To filter without searching, just pass `"*"` for the `searchText` parameter. To search without filtering, just leave the `Filter` property unset, or do not pass in a `SearchParameters` instance at all.

1. In Program.cs, in main, uncomment the lines for "3 - Search". 

    ```csharp
    // Uncomment next 2 lines in "3 - Search an index"
    Console.WriteLine("{0}", "Searching documents...\n");
    RunQueries(indexClient);
    ```
1. The solution is now finished. Press F5 to rebuild the app and run the program in its entirety. 

    Output includes the same messages as before, with addition of query information and results.

 -->
## Next steps

In this C# quickstart, you ran a series queries against an available index, including a simple term search, filtered search, wildcard search, and proximity search.

Now that you're familiar with a few of the more common query forms, explore index creation and data ingestion with this C# tutorial:

> [!div class="nextstepaction"]
> [Index Azure SQL data using the .NET SDK](search-indexer-tutorial.md)
