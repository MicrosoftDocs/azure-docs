<properties
    pageTitle="Query your Azure Search Index using the .NET SDK | Microsoft Azure | Hosted cloud search service"
    description="Build a search query in Azure search and use search parameters to filter and sort search results."
    services="search"
    documentationCenter=""
    authors="brjohnstmsft"
/>

<tags
    ms.service="search"
    ms.devlang="dotnet"
    ms.workload="search"
    ms.topic="get-started-article"
    ms.tgt_pltfrm="na"
    ms.date="05/23/2016"
    ms.author="brjohnst"/>

# Query your Azure Search index using the .NET SDK
> [AZURE.SELECTOR]
- [Overview](search-query-overview.md)
- [Portal](search-explorer.md)
- [.NET](search-query-dotnet.md)
- [REST](search-query-rest-api.md)

This article will show you how to query an index using the [Azure Search .NET SDK](https://msdn.microsoft.com/library/azure/dn951165.aspx).

Before beginning this walkthrough, you should already have [created an Azure Search index](search-what-is-an-index.md) and [populated it with data](search-what-is-data-import.md).

Note that all sample code in this article is written in C#. You can find the full source code [on GitHub](http://aka.ms/search-dotnet-howto).

## I. Identify your Azure Search service's query api-key
Now that you have created an Azure Search index, you are almost ready to issue queries using the .NET SDK. First, you will need to obtain one of the query api-keys that was generated for the search service you provisioned. The .NET SDK will send this api-key on every request to your service. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

1. To find your service's api-keys you must log into the [Azure Portal](https://portal.azure.com/)
2. Go to your Azure Search service's blade
3. Click on the "Keys" icon

Your service will have *admin keys* and *query keys*.

  - Your primary and secondary *admin keys* grant full rights to all operations, including the ability to manage the service, create and delete indexes, indexers, and data sources. There are two keys so that you can continue to use the secondary key if you decide to regenerate the primary key, and vice-versa.
  - Your *query keys* grant read-only access to indexes and documents, and are typically distributed to client applications that issue search requests.

For the purposes of querying an index, you can use one of your query keys. Your admin keys can also be used for queries, but you should use a query key in your application code as this better follows the [Principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege).

## II. Create an instance of the SearchIndexClient class
To issue queries with the Azure Search .NET SDK, you will need to create an instance of the `SearchIndexClient` class. This class has several constructors. The one you want takes your search service name, index name, and a `SearchCredentials` object as parameters. `SearchCredentials` wraps your api-key.

The code below creates a new `SearchIndexClient` for the "hotels" index (created in [Create an Azure Search index using the .NET SDK](search-create-index-dotnet.md)) using values for the search service name and api-key that are stored in the application's config file (`app.config` or `web.config`):

```csharp
string searchServiceName = ConfigurationManager.AppSettings["SearchServiceName"];
string queryApiKey = ConfigurationManager.AppSettings["SearchServiceQueryApiKey"];

SearchIndexClient indexClient = new SearchIndexClient(searchServiceName, "hotels", new SearchCredentials(queryApiKey));
```

`SearchIndexClient` has a `Documents` property. This property provides all the methods you need to query Azure Search indexes.

## III. Query your index
Searching with the .NET SDK is as simple as calling the `Documents.Search` method on your `SearchIndexClient`. This method takes a few parameters, including the search text, along with a `SearchParameters` object that can be used to further refine the query.

#### Types of Queries
The two main [query types](search-query-overview.md#types-of-queries) you will use are `search` and `filter`. A `search` query searches for one or more terms in all _searchable_ fields in your index. A `filter` query evaluates a boolean expression over all _filterable_ fields in an index.

Both searches and filters are performed using the `Documents.Search` method. A search query can be passed in the `searchText` parameter, while a filter expression can be passed in the `Filter` property of the `SearchParameters` class. To filter without searching, just pass `"*"` for the `searchText` parameter. To search without filtering, just leave the `Filter` property unset, or do not pass in a `SearchParameters` instance at all.

#### Example Queries

The following sample code shows a few different ways to query the "hotels" index defined in [Create an Azure Search index using the .NET SDK](search-create-index-dotnet.md#DefineIndex). Note that the documents returned with the search results are instances of the `Hotel` class, which was defined in [Data Import in Azure Search using the .NET SDK](search-import-data-dotnet.md#HotelClass). The sample code makes use of a `WriteDocuments` method to output the search results to the console. This method is described in the next section.

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

## IV. Handle search results
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

Here is what the results look like for the queries in the previous section, assuming the "hotels" index is populated with the sample data in [Data Import in Azure Search using the .NET SDK](search-import-data-dotnet.md):

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

The sample code above uses the console to output search results. You will likewise need to display search results in your own application. See [this sample on GitHub](https://github.com/Azure-Samples/search-dotnet-getting-started/tree/master/DotNetSample) for an example of how to render search results in an ASP.NET MVC-based web application.
