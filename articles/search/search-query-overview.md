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
	ms.date="11/10/2015"
	ms.author="heidist"/>

# Queries in Azure Search
> [AZURE.SELECTOR]
- [Overview](search-query-overview.md)
- [Fiddler](search-fiddler.md)
- [.NET](search-query-dotnet.md)
- [REST](search-query-rest-api.md)

Custom solutions using Azure Search for an embedded search experience need to include code that constructs the search query and sends it to a search service for processing.

You can use either the .NET SDK or REST API to write methods for query execution. For preliminary testing or exploration, you can use tools like Fiddler  to send queries to your service.
