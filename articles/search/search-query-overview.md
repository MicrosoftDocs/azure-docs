<properties
	pageTitle="Queries in Azure Search | Microsoft Azure | Hosted cloud search service"
	description="Build a search query in Azure search and use search parameters to filter, sort, and facet search results."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""
    tags="azure-portal"/>

<tags
	ms.service="search"
	ms.devlang="na"
	ms.workload="search"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.date="01/23/2016"
	ms.author="heidist"/>

# Queries in Azure Search
> [AZURE.SELECTOR]
- [Overview](search-query-overview.md)
- [Search Explorer](search-explorer.md)
- [Fiddler](search-fiddler.md)
- [.NET](search-query-dotnet.md)
- [REST](search-query-rest-api.md)

Custom solutions that integrate Azure Search for an embedded search experience need to include code that constructs a search query and sends it to the search engine for processing.

You can use either the .NET SDK or REST API to write methods for query execution. For preliminary testing or exploration, you can use tools like the built-in Search Explorer in the Azure Portal  to query an index, or use Fiddler to issue any valid request to your search service. 

Visit [Videos, tutorials, demos and code samples](search-video-demo-tutorial-list.md) for a list of samples and walkthroughs demonstrating how to construct queries in code. Almost every sample we provide includes code that queries a search service.
