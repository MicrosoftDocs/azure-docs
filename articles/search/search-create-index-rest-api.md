<properties
	pageTitle="Create an Azure Search index using a REST API | Microsoft Azure | Hosted cloud search service"
	description="Create an index in code using the Azure Search and an HTTP REST API."
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

# Create an Azure Search index using a REST API
> [AZURE.SELECTOR]
- [Overview](search-what-is-an-index.md)
- [Portal](search-create-index-portal.md)
- [.NET](search-create-index-dotnet.md)
- [REST](search-create-index-rest-api.md)

This article shows you how to create an index using the [Azure Search REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx). Some of the content below is from [Create Index (Azure Search REST API)](https://msdn.microsoft.com/library/azure/dn798941.aspx). Refer to the parent article for more context.

Prerequisites to creating an index include having previously established a connection to your search service, typically done via an 'httpClient'.

## Define index schema

To create index using the REST API, you will issue a POST request to your Azure Search URL endpoint. You will define the structure of your index using JSON in the request body.

**Request and Request Headers**:

In the below sample, you will have to use the URL endpoint of your service, specifically noting your service name and the proper API version (the current API version is "2015-02-28" at the time of publishing this document). In the Request Headers, you will also have to provide your service's Primary Admin Key that you received when [creating a service](https://msdn.microsoft.com/library/azure/dn798941.aspx/).

	POST https://[servicename].search.windows.net/indexes?api-version=2015-02-28
	Content-Type: application/JSON
	api-key:[primary admin key]


**Request Body**:

This is where you identify your index name ("hotels", in this case) as well as the [names, types, and attributes of the fields](https://msdn.microsoft.com/library/azure/dn798941.aspx).

	{
		"name": "hotels",  
		"fields": [
			{"name": "hotelId", "type": "Edm.String", "key": true, "searchable": false},
			{"name": "baseRate", "type": "Edm.Double"},
			{"name": "description", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false},
			{"name": "description_fr", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false, analyzer:"fr.lucene"},
			{"name": "hotelName", "type": "Edm.String"},
			{"name": "category", "type": "Edm.String"},
			{"name": "tags", "type": "Collection(Edm.String)"},
			{"name": "parkingIncluded", "type": "Edm.Boolean"},
			{"name": "smokingAllowed", "type": "Edm.Boolean"},
			{"name": "lastRenovationDate", "type": "Edm.DateTimeOffset"},
			{"name": "rating", "type": "Edm.Int32"},
			{"name": "location", "type": "Edm.GeographyPoint"}
		]
	}

For a successful request, you should see status code "201 Created". For more information on creating an index via the REST API, please visit [this page](https://msdn.microsoft.com/library/azure/dn798941.aspx).
