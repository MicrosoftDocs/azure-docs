<properties
	pageTitle="Import data to Azure Search using the REST API | Microsoft Azure | Hosted cloud search service"
	description="How to upload data to an index in Azure Search using the REST API."
	services="search"
	documentationCenter=""
	authors="HeidiSteen"
	manager="mblythe"
	editor=""
    tags=""/>

<tags
	ms.service="search"
	ms.devlang="rest-api"
	ms.workload="search"
	ms.topic="get-started-article"
	ms.tgt_pltfrm="na"
	ms.date="11/17/2015"
	ms.author="heidist"/>

# Import data to Azure Search using the REST API
> [AZURE.SELECTOR]
- [Overview](search-what-is-data-import.md)
- [Portal](search-import-data-portal.md)
- [.NET](search-import-data-dotnet.md)
- [REST](search-import-data-rest-api.md)
- [Indexers](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md)

This article shows you how to populate an index using the [Azure Search REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx). Some of the content below is from [Add, update, or delete documents (Azure Search REST API)](https://msdn.microsoft.com/library/azure/dn798930.aspx). Refer to the parent article for more context.

In order to push documents into your index using the REST API, you will issue POST HTTP requests to your service's URL endpoint.

**Request and Request Headers**: 

In the URL, you will have to provide your service name as well as the proper API version (the current API version is "2015-02-28" at the time of publishing this document).

In request headers, you will have to define the Content-Type and provide your service's Primary Admin Key.

	POST https://[servicename].search.windows.net/indexes/[indexname]/docs/index?api-version=2015-02-28
	Content-Type: application/JSON
	api-key:[primary admin key]


**Request Body**:


	{
		"value": [
			{
				"@search.action": "upload",
				"hotelId": "1",
				"baseRate": 199.0,
				"description": "Best hotel in town",
				"description_fr": "Meilleur hôtel en ville",
				"hotelName": "Fancy Stay",
				"category": "Luxury",
				"tags": ["pool", "view", "wifi", "concierge"],
				"parkingIncluded": false,
				"smokingAllowed": false,
				"lastRenovationDate": "2010-06-27T00:00:00Z",
				"rating": 5,
				"location": { "type": "Point", "coordinates": [-122.131577, 47.678581] }
			},
			{
				"@search.action": "upload",
				"hotelId": "2",
				"baseRate": 79.99,
				"description": "Cheapest hotel in town",
				"description_fr": "Hôtel le moins cher en ville",
				"hotelName": "Roach Motel",
				"category": "Budget",
				"tags": ["motel", "budget"],
				"parkingIncluded": true,
				"smokingAllowed": true,
				"lastRenovationDate": "1982-04-28T00:00:00Z",
				"rating": 1,
				"location": { "type": "Point", "coordinates": [-122.131577, 49.678581] }
			}
		]
	}

In this case, we are using "upload" as our search action. When updating and deleting existing documents you can use "merge", "mergeOrUpload", and "delete".

When updating your index, you will receive a status code of "200 OK" for a success. You will receive a "207" status code if at least one item in your request was not successfully indexed.

For more information on document actions and success/error responses, please see [this page](https://msdn.microsoft.com/library/azure/dn798930.aspx).
