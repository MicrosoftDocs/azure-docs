<properties
	pageTitle="Build queries in Azure Search in .NET | Microsoft Azure | Hosted cloud search service"
	description="Build a search query in Azure search and use search parameters to filter, sort, and facet search results using the .NET library or SDK."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""
    tags="azure-portal"/>

<tags
	ms.service="search"
	ms.devlang="dotnet"
	ms.workload="search"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.date="11/10/2015"
	ms.author="heidist"/>

#Build queries in Azure Search in .NET
> [AZURE.SELECTOR]
- [Overview](search-query-overview.md)
- [Fiddler](search-fiddler.md)
- [.NET](search-query-dotnet.md)
- [REST](search-query-rest-api.md)

This article shows you how to build a query using the [Azure Search .NET SDK](https://msdn.microsoft.com/library/azure/dn951165.aspx). The content below is a subset of the [How to use Azure Search from a .NET Application](search-howto-dotnet-sdk.md). Refer to the parent article for end-to-end steps.

Prerequisites to creating a query include having previously established a connection to your search service, typically done via a `SearchServiceClient`.

The following code snippet creates a method that passes a search string input to a SearchDocuments method.

	private static void SearchDocuments(SearchIndexClient indexClient, string searchText, string filter = null)
	{
		// Execute search based on search text and optional filter
		var sp = new SearchParameters();
	
		if (!String.IsNullOrEmpty(filter))
		{
			sp.Filter = filter;
		}
	
		DocumentSearchResponse<Hotel> response = indexClient.Documents.Search<Hotel>(searchText, sp);
		foreach (SearchResult<Hotel> result in response)
		{
			Console.WriteLine(result.Document);
		}
	}
	
First, this method creates a new SearchParameters object. This is used to specify additional options for the query such as sorting, filtering, paging, and faceting. In this example, we're only setting the Filter property.

The next step is to actually execute the search query. This is done using the Documents.Search method. In this case, we pass the search text to use as a string, plus the search parameters created earlier. We also specify Hotel as the type parameter for Documents.Search, which tells the SDK to deserialize documents in the search results into objects of type Hotel.

Finally, this method iterates through all the matches in the search results, printing each document to the console.

Let's take a closer look at how this method is called:

	SearchDocuments(indexClient, searchText: "fancy wifi");
	SearchDocuments(indexClient, searchText: "*", filter: "category eq 'Luxury'");

In the first call, we're looking for all documents containing the query terms "fancy" or "wifi". In the second call, the search text is set to "*", which means "find everything". You can find more information about the search query expression syntax at [Simple query syntax in Azure Search](https://msdn.microsoft.com/library/azure/dn798920.aspx).

The second call uses an OData $filter expression, category eq 'Luxury'. This constrains the search to only return documents where the category field exactly matches the string "Luxury". You can find out more about the OData syntax at [OData Expression Syntax for Azure Search](https://msdn.microsoft.com/library/azure/dn798921.aspx).
