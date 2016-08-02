<properties
    pageTitle="Create an Azure Search index using the REST API | Microsoft Azure | Hosted cloud search service"
    description="Create an index in code using the Azure Search HTTP REST API."
    services="search"
    documentationCenter=""
    authors="ashmaka"
    manager=""
    editor=""
    tags="azure-portal"/>

<tags
    ms.service="search"
    ms.devlang="rest-api"
    ms.workload="search"
    ms.topic="get-started-article"
    ms.tgt_pltfrm="na"
    ms.date="05/31/2016"
    ms.author="ashmaka"/>

# Create an Azure Search index using the REST API
> [AZURE.SELECTOR]
- [Overview](search-what-is-an-index.md)
- [Portal](search-create-index-portal.md)
- [.NET](search-create-index-dotnet.md)
- [REST](search-create-index-rest-api.md)


This article will walk you through the process of creating an Azure Search [index](https://msdn.microsoft.com/library/azure/dn798941.aspx) using the Azure Search REST API.

Before following this guide and creating an index, you should have already [created an Azure Search service](search-create-service-portal.md).

To create an Azure Search index using the REST API, you will issue a single HTTP POST request to your Azure Search service's URL endpoint. Your index definition will be contained in the request body as well-formed JSON content.


## I. Identify your Azure Search service's admin api-key
Now that you have provisioned an Azure Search service, you can issue HTTP requests against your service's URL endpoint using the REST API. However, *all* API requests must include the api-key that was generated for the Search service you provisioned. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

1. To find your service's api-keys you must log into the [Azure Portal](https://portal.azure.com/)
2. Go to your Azure Search service's blade
3. Click on the "Keys" icon

Your service will have *admin keys* and *query keys*.

 - Your primary and secondary *admin keys* grant full rights to all operations, including the ability to manage the service, create and delete indexes, indexers, and data sources. There are two keys so that you can continue to use the secondary key if you decide to regenerate the primary key, and vice-versa.
 - Your *query keys* grant read-only access to indexes and documents, and are typically distributed to client applications that issue search requests.

For the purposes of creating an index, you can use either your primary or secondary admin key.

## II. Define your Azure Search index using well-formed JSON
A single HTTP POST request to your service will create your index. The body of your HTTP POST request will contain a single JSON object that defines your Azure Search index.

1. The first property of this JSON object is the name of your index.
2. The second property of this JSON object is a JSON array named `fields` that contains a separate JSON object for each field in your index. Each of these JSON objects contain multiple name/value pairs for each of the field attributes including "name," "type," etc.

It is important that you keep your search user experience and business needs in mind when designing your index as each field must be assigned the [proper attributes](https://msdn.microsoft.com/library/azure/dn798941.aspx). These attributes control which search features (filtering, faceting, sorting full-text search, etc.) apply to which fields. For any attribute you do not specify, the default will be to enable the corresponding search feature unless you specifically disable it.

For our example, we've named our index "hotels" and defined our fields as follows:

```JSON
{
    "name": "hotels",  
    "fields": [
        {"name": "hotelId", "type": "Edm.String", "key": true, "searchable": false, "sortable": false, "facetable": false},
        {"name": "baseRate", "type": "Edm.Double"},
        {"name": "description", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false},
        {"name": "description_fr", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false, "analyzer": "fr.lucene"},
        {"name": "hotelName", "type": "Edm.String", "facetable": false},
        {"name": "category", "type": "Edm.String"},
        {"name": "tags", "type": "Collection(Edm.String)"},
        {"name": "parkingIncluded", "type": "Edm.Boolean", "sortable": false},
        {"name": "smokingAllowed", "type": "Edm.Boolean", "sortable": false},
        {"name": "lastRenovationDate", "type": "Edm.DateTimeOffset"},
        {"name": "rating", "type": "Edm.Int32"},
        {"name": "location", "type": "Edm.GeographyPoint"}
    ]
}
```

We have carefully chosen the index attributes for each field based on how we think they will be used in an application. For example, `hotelId` is a unique key that people searching for hotels likely won't know, so we disable full-text search for that field by setting `searchable` to `false`, which saves space in the index.

Please note that exactly one field in your index of type `Edm.String` must be the designated as the 'key' field.

The index definition above uses a custom language analyzer for the `description_fr` field because it is intended to store French text. See [the Language support topic on MSDN](https://msdn.microsoft.com/library/azure/dn879793.aspx) as well as the corresponding [blog post](https://azure.microsoft.com/blog/language-support-in-azure-search/) for more information about language analyzers.

## III. Issue the HTTP request
1. Using your index definition as the request body, issue an HTTP POST request to your Azure Search service endpoint URL. In the URL, be sure to use your service name as the host name, and put the proper `api-version` as a query string parameter (the current API version is `2015-02-28` at the time of publishing this document).
2. In the request headers, specify the `Content-Type` as `application/json`. You will also need to provide your service's admin key that you identified in Step I in the `api-key` header.


You will have to provide your own service name and api key to issue the request below:


    POST https://[service name].search.windows.net/indexes?api-version=2015-02-28
    Content-Type: application/json
    api-key: [api-key]


For a successful request, you should see status code 201 (Created). For more information on creating an index via the REST API, please visit the API reference on [MSDN](https://msdn.microsoft.com/library/azure/dn798941.aspx). For more information on other HTTP status codes that could be returned in case of failure, see [HTTP status codes (Azure Search)](https://msdn.microsoft.com/library/azure/dn798925.aspx).

When you're done with an index and want to delete it, just issue an HTTP DELETE request. For example, this is how we would delete the "hotels" index:

    DELETE https://[service name].search.windows.net/indexes/hotels?api-version=2015-02-28
    api-key: [api-key]


## Next
After creating an Azure Search index, you will be ready to [upload your content into the index](search-what-is-data-import.md) so you can start searching your data.
