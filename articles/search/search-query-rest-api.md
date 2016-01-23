<properties
	pageTitle="Build queries in Azure Search using REST calls | Microsoft Azure | Hosted cloud search service"
	description="Build a search query in Azure search and use search parameters to filter, sort, and facet search result using the .NET library or SDK."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""
    tags="azure-portal"/>

<tags
	ms.service="search"
	ms.devlang="rest-api"
	ms.workload="search"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.date="11/17/2015"
	ms.author="heidist"/>

# Build queries in Azure Search using REST calls
> [AZURE.SELECTOR]
- [Overview](search-query-overview.md)
- [Fiddler](search-fiddler.md)
- [.NET](search-query-dotnet.md)
- [REST](search-query-rest-api.md)

This article shows you how to construct a query against an index using the [Azure Search REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx). Some of the content below is from [Search Documents (Azure Search REST API)](https://msdn.microsoft.com/library/azure/dn798927.aspx). Refer to the parent article for more context.

Prerequisites to importing include having an existing index already in place, loaded with documents that provide searchable data.

To search your index using the REST API, you will issue a GET HTTP request. Your query parameters will be defined within the URL of the HTTP request.

**Request and Request Headers**:

In the URL, you will have to provide your service name, index name, and as well as the proper API version. The query string at the end of the URL will be where you provide the query parameters. One of the parameters in the query string must be the proper API version (the current API version is "2015-02-28" at the time of publishing this document).

As request headers, you will have to define the Content-Type and provide your service's Primary or Secondary Admin Key.

	GET https://[service name].search.windows.net/indexes/[index name]/docs?[query string]&api-version=2015-02-28
	Content-Type: application/JSON
	api-key:[primary admin key or secondary admin key]

Azure Search offers many options to create extremely powerful queries. To learn more about all the different parameters of a query string, please visit [this page](https://msdn.microsoft.com/library/azure/dn798927.aspx).

**Examples**:

Below are a few examples with various query strings. These samples use a dummy index named "hotels":

Search the entire index for the term "quality":

	GET https://[service name].search.windows.net/indexes/hotels/docs?search=quality&$orderby=lastRenovationDate desc&api-version=2015-02-28
	Content-Type: application/JSON
	api-key:[primary admin key or secondary admin key]

Search the entire index:

	GET https://[service name].search.windows.net/indexes/hotels/docs?search=*&api-version=2015-02-28
	Content-Type: application/JSON
	api-key:[primary admin key or secondary admin key]

Search the entire index and order by a specific field (lastRenovationDate):

	GET https://[service name].search.windows.net/indexes/hotels/docs?search=*&$orderby=lastRenovationDate desc&api-version=2015-02-28
	Content-Type: application/JSON
	api-key:[primary admin key or secondary admin key]

A successful query request will result in a Status Code of "200 OK" and the search results will be found in JSON format in the response body. To learn more, please visit the "Response" section of [this page](https://msdn.microsoft.com/library/azure/dn798927.aspx).
