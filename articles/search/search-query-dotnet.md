---
title: 'Query data to an Azure Search index in C# (.NET SDK) - Azure Search'
description: C# code example for building a search query in Azure Search. Add search parameters to filter and sort search results.
author: heidisteen
manager: cgronlun
ms.author: heidist
services: search
ms.service: search
ms.devlang: dotnet
ms.topic: quickstart
ms.date: 03/20/2019
---
# Quickstart: 3 - Query an Azure Search index in C#

This article shows you how to query [an Azure Search index](search-what-is-an-index.md) using C# and the [.NET SDK](https://aka.ms/search-sdk). Searching documents in your index is accomplished by performing these tasks:

> [!div class="checklist"]
> * Create a [`SearchIndexClient`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.searchindexclient?view=azure-dotnet) object to connect to a search index with read-only rights.
> * Create a [`SearchParameters`](https://docs.microsoft.com/dotnet/api/microsoft.azure.search.models.searchparameters?view=azure-dotnet) object containing the search or filter definition.
> * Call the `Documents.Search` method on `SearchIndexClient` to send queries to an index.

## Prerequisites

[Load an Azure Search index](search-import-data-dotnet.md) with the hotels sample data.

Obtain a query key used for read-only access to documents. Until now, you have used an admin API key so that you can create objects and content on a search service. But for query support in apps, we strongly recommend using a query key. For instructions, see [Create a query key](search-security-api-keys.md#create-query-keys).

## Create a client
Create an instance of the `SearchIndexClient` class so that you can give it a query key for read-only access (as opposed to the write-access rights conferred upon the `SearchServiceClient` used in the previous lesson).

This class has several constructors. The one you want takes your search service name, index name, and a [`SearchCredentials`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.search.searchcredentials?view=azure-dotnet) object as parameters. `SearchCredentials` wraps your api-key.

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

`SearchIndexClient` has a [`Documents`](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.search.searchindexclient.documents?view=azure-dotnet) property. This property provides all the methods you need to query Azure Search indexes.

## Construct SearchParameters
Searching with the .NET SDK is as simple as calling the `Documents.Search` method on your `SearchIndexClient`. This method takes a few parameters, including the search text, along with a `SearchParameters` object that can be used to further refine the query.

#### Types of Queries
The two main [query types](search-query-overview.md#types-of-queries) you will use are `search` and `filter`. A `search` query searches for one or more terms in all *searchable* fields in your index. A `filter` query evaluates a boolean expression over all *filterable* fields in an index. You can use searches and filters together or separately.

Both searches and filters are performed using the `Documents.Search` method. A search query can be passed in the `searchText` parameter, while a filter expression can be passed in the `Filter` property of the `SearchParameters` class. To filter without searching, just pass `"*"` for the `searchText` parameter. To search without filtering, just leave the `Filter` property unset, or do not pass in a `SearchParameters` instance at all.

#### Example Queries
The following sample code shows a few different ways to query the "hotels" index defined in [Create an Azure Search index in C#](search-create-index-dotnet.md#DefineIndex). Note that the documents returned with the search results are instances of the `Hotel` class, which was defined in [Import data to an Azure Search index in C#](search-import-data-dotnet.md#construct-indexbatch). The sample code makes use of a `WriteDocuments` method to output the search results to the console. This method is described in the next section.

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

## Handle search results
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

## Next steps

If you haven't done so already, review the sample code in [DotNetHowTo](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetHowTo) on GitHub, along with [How to use Azure Search from a .NET Application ](search-howto-dotnet-sdk.md) for more detailed descriptions of sample code. 