---
title: 'Create an index in code using PowerShell and the REST API - Azure Search'
description: Create a full text searchable index in code using HTTP requests and the Azure Search REST API.

ms.date: 03/01/2019
author: heidisteen
manager: cgronlun
ms.author: heidist
services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.custom: seodec2018
---
# Quickstart: Create an Azure Search index using PowerShell and the REST API
> [!div class="op_single_selector"]
> * [PowerShell (REST)](search-create-index-rest-api.md)
> * [C#](search-create-index-dotnet.md)
> * [Postman (REST)](search-fiddler.md)
> * [Portal](search-create-index-portal.md)
> 

This article walks you through the process of creating, loading, and querying an Azure Search [index](search-what-is-an-index.md) using PowerShell and the [Azure Search Service REST API](https://docs.microsoft.com/rest/api/searchservice/). The index definition and content is contained in the request body as well-formed JSON content.

## Prerequisites

+ [Create an Azure Search service](search-create-service-portal.md). You can use a free service for this quickstart.

+ [PowerShell](https://github.com/PowerShell/PowerShell). This quickstart assumes Windows.

+ URL endpoint and admin api-key of your Search service. A search service is created with both, so if you added Azure Search to your subscription, follow these steps to get the necessary information:

    1. In the Azure portal, [find your service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) in the service list.

    2. In **Overview**, get the URL. An example endpoint might look like `https://my-service-name.search.windows.net`.

    3. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on your request.

    ![Get an HTTP endpoint and access key](media/search-fiddler/get-url-key.png "Get an HTTP endpoint and access key")

    All requests require an api-key on every request sent to your service. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

## 1 - Define an index schema

A single HTTP POST request to your service will create your index. The body of your HTTP POST request will contain a single JSON object that defines your Azure Search index.

1. The first property of this JSON object is the name of your index.

2. The second property of this JSON object is a JSON array named `fields` that contains a separate JSON object for each field in your index. Each of these JSON objects contain multiple name/value pairs for each of the field attributes including "name," "type," etc.

It is important that you keep your search user experience and business needs in mind when designing your index as each field must be assigned the [proper attributes](https://docs.microsoft.com/rest/api/searchservice/Create-Index). These attributes control which search features (filtering, faceting, sorting full-text search, etc.) apply to which fields. For any attribute you do not specify, the default will be to enable the corresponding search feature unless you specifically disable it.

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

The index definition above uses a language analyzer for the `description_fr` field because it is intended to store French text. See [the Language support topic](https://docs.microsoft.com/rest/api/searchservice/Language-support) as well as the corresponding [blog post](https://azure.microsoft.com/blog/language-support-in-azure-search/) for more information about language analyzers.

## 2 - Post the request

1. Using your index definition as the request body, issue an HTTP POST request to your Azure Search service endpoint URL. In the URL, be sure to use your service name as the host name, and put the proper `api-version` as a query string parameter (the current API version is `2017-11-11` at the time of publishing this document).

2. In the request headers, specify the `Content-Type` as `application/json`. You will also need to provide your service's admin key that you identified in Step I in the `api-key` header.

You will have to provide your own service name and API-key to issue the request below:

    POST https://[service name].search.windows.net/indexes?api-version=2017-11-11
    Content-Type: application/json
    api-key: [api-key]


For a successful request, you should see status code 201 (Created). For more information on creating an index via the REST API, please visit the [API reference here](https://docs.microsoft.com/rest/api/searchservice/Create-Index). For more information on other HTTP status codes that could be returned in case of failure, see [HTTP status codes (Azure Search)](https://docs.microsoft.com/rest/api/searchservice/HTTP-status-codes).

When you're done with an index and want to delete it, just issue an HTTP DELETE request. For example, this is how we would delete the "hotels" index:

    DELETE https://[service name].search.windows.net/indexes/hotels?api-version=2017-11-11
    api-key: [api-key]

## 3 - Load data

In order to push documents into your index using the REST API, you will issue an HTTP POST request to your index's URL endpoint. The body of the HTTP request body is a JSON object containing the documents to be added, modified, or deleted.

### Decide which indexing action to use
When using the REST API, you will issue HTTP POST requests with JSON request bodies to your Azure Search index's endpoint URL. The JSON object in your HTTP request body will contain a single JSON array named "value" containing JSON objects representing documents you would like to add to your index, update, or delete.

Each JSON object in the "value" array represents a document to be indexed. Each of these objects contains the document's key and specifies the desired indexing action (upload, merge, delete). Depending on which of the below actions you choose, only certain fields must be included for each document:

| @search.action | Description | Necessary fields for each document | Notes |
| --- | --- | --- | --- |
| `upload` |An `upload` action is similar to an "upsert" where the document will be inserted if it is new and updated/replaced if it exists. |key, plus any other fields you wish to define |When updating/replacing an existing document, any field that is not specified in the request will have its field set to `null`. This occurs even when the field was previously set to a non-null value. |
| `merge` |Updates an existing document with the specified fields. If the document does not exist in the index, the merge will fail. |key, plus any other fields you wish to define |Any field you specify in a merge will replace the existing field in the document. This includes fields of type `Collection(Edm.String)`. For example, if the document contains a field `tags` with value `["budget"]` and you execute a merge with value `["economy", "pool"]` for `tags`, the final value of the `tags` field will be `["economy", "pool"]`. It will not be `["budget", "economy", "pool"]`. |
| `mergeOrUpload` |This action behaves like `merge` if a document with the given key already exists in the index. If the document does not exist, it behaves like `upload` with a new document. |key, plus any other fields you wish to define |- |
| `delete` |Removes the specified document from the index. |key only |Any fields you specify other than the key field will be ignored. If you want to remove an individual field from a document, use `merge` instead and simply set the field explicitly to null. |

### Construct your HTTP request and request body
Now that you have gathered the necessary field values for your index actions, you are ready to construct the actual HTTP request and JSON request body to import your data.

#### Request and Request Headers
In the URL, you will need to provide your service name, index name ("hotels" in this case), as well as the proper API version (the current API version is `2017-11-11` at the time of publishing this document). You will need to define the `Content-Type` and `api-key` request headers. For the latter, use one of your service's admin keys.

    POST https://[search service].search.windows.net/indexes/hotels/docs/index?api-version=2017-11-11
    Content-Type: application/json
    api-key: [admin key]

#### Request Body
```JSON
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
        },
        {
            "@search.action": "mergeOrUpload",
            "hotelId": "3",
            "baseRate": 129.99,
            "description": "Close to town hall and the river"
        },
        {
            "@search.action": "delete",
            "hotelId": "6"
        }
    ]
}
```

In this case, we are using `upload`, `mergeOrUpload`, and `delete` as our search actions.

Assume that this example "hotels" index is already populated with a number of documents. Note how we did not have to specify all the possible document fields when using `mergeOrUpload` and how we only specified the document key (`hotelId`) when using `delete`.

Also, note that you can only include up to 1000 documents (or 16 MB) in a single indexing request.

### Understand your HTTP response code
#### 200
After submitting a successful indexing request you will receive an HTTP response with status code of `200 OK`. The JSON body of the HTTP response will be as follows:

```JSON
{
    "value": [
        {
            "key": "unique_key_of_document",
            "status": true,
            "errorMessage": null
        },
        ...
    ]
}
```

#### 207
A status code of `207` will be returned when at least one item was not successfully indexed. The JSON body of the HTTP response will contain information about the unsuccessful document(s).

```JSON
{
    "value": [
        {
            "key": "unique_key_of_document",
            "status": false,
            "errorMessage": "The search service is too busy to process this document. Please try again later."
        },
        ...
    ]
}
```

> [!NOTE]
> This often means that the load on your search service is reaching a point where indexing requests will begin to return `503` responses. In this case, we highly recommend that your client code back off and wait before retrying. This will give the system some time to recover, increasing the chances that future requests will succeed. Rapidly retrying your requests will only prolong the situation.
>
>

#### 429
A status code of `429` will be returned when you have exceeded your quota on the number of documents per index.

#### 503
A status code of `503` will be returned if none of the items in the request were successfully indexed. This error means that the system is under heavy load and your request can't be processed at this time.

> [!NOTE]
> In this case, we highly recommend that your client code back off and wait before retrying. This will give the system some time to recover, increasing the chances that future requests will succeed. Rapidly retrying your requests will only prolong the situation.
>
>

For more information on document actions and success/error responses, please see [Add, Update, or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/AddUpdate-or-Delete-Documents). For more information on other HTTP status codes that could be returned in case of failure, see [HTTP status codes (Azure Search)](https://docs.microsoft.com/rest/api/searchservice/HTTP-status-codes).

## 6 - Search the index

This section shows you how to query an index using the [Search Document REST API](https://docs.microsoft.com/rest/api/searchservice/search-documents).

### Formulate your query
There are two ways to [search your index using the REST API](https://docs.microsoft.com/rest/api/searchservice/Search-Documents). One way is to issue an HTTP POST request where your query parameters are defined in a JSON object in the request body. The other way is to issue an HTTP GET request where your query parameters are defined within the request URL. POST has more [relaxed limits](https://docs.microsoft.com/rest/api/searchservice/Search-Documents) on the size of query parameters than GET. For this reason, we recommend using POST unless you have special circumstances where using GET would be more convenient.

For both POST and GET, you need to provide your *service name*, *index name*, and the proper *API version* (the current API version is `2017-11-11` at the time of publishing this document) in the request URL. For GET, the *query string* at the end of the URL is where you provide the query parameters. See below for the URL format:

    https://[service name].search.windows.net/indexes/[index name]/docs?[query string]&api-version=2017-11-11

The format for POST is the same, but with only api-version in the query string parameters.

#### Example Queries
Here are a few example queries on an index named "hotels". These queries are shown in both GET and POST format.

Search the entire index for the term 'budget' and return only the `hotelName` field:

```
GET https://[service name].search.windows.net/indexes/hotels/docs?search=budget&$select=hotelName&api-version=2017-11-11

POST https://[service name].search.windows.net/indexes/hotels/docs/search?api-version=2017-11-11
{
    "search": "budget",
    "select": "hotelName"
}
```

Apply a filter to the index to find hotels cheaper than $150 per night, and return the `hotelId` and `description`:

```
GET https://[service name].search.windows.net/indexes/hotels/docs?search=*&$filter=baseRate lt 150&$select=hotelId,description&api-version=2017-11-11

POST https://[service name].search.windows.net/indexes/hotels/docs/search?api-version=2017-11-11
{
    "search": "*",
    "filter": "baseRate lt 150",
    "select": "hotelId,description"
}
```

Search the entire index, order by a specific field (`lastRenovationDate`) in descending order, take the top two results, and show only `hotelName` and `lastRenovationDate`:

```
GET https://[service name].search.windows.net/indexes/hotels/docs?search=*&$top=2&$orderby=lastRenovationDate desc&$select=hotelName,lastRenovationDate&api-version=2017-11-11

POST https://[service name].search.windows.net/indexes/hotels/docs/search?api-version=2017-11-11
{
    "search": "*",
    "orderby": "lastRenovationDate desc",
    "select": "hotelName,lastRenovationDate",
    "top": 2
}
```

### Submit your HTTP request
Now that you have formulated your query as part of your HTTP request URL (for GET) or body (for POST), you can define your request headers and submit your query.

#### Request and Request Headers
You must define two request headers for GET, or three for POST:

1. The `api-key` header must be set to the query key you found in step I above. You can also use an admin key as the `api-key` header, but it is recommended that you use a query key as it exclusively grants read-only access to indexes and documents.
2. The `Accept` header must be set to `application/json`.
3. For POST only, the `Content-Type` header should also be set to `application/json`.

See below for an HTTP GET request to search the "hotels" index using the Azure Search REST API, using a simple query that searches for the term "motel":

```
GET https://[service name].search.windows.net/indexes/hotels/docs?search=motel&api-version=2017-11-11
Accept: application/json
api-key: [query key]
```

Here is the same example query, this time using HTTP POST:

```
POST https://[service name].search.windows.net/indexes/hotels/docs/search?api-version=2017-11-11
Content-Type: application/json
Accept: application/json
api-key: [query key]

{
    "search": "motel"
}
```

A successful query request will result in a Status Code of `200 OK` and the search results are returned as JSON in the response body. Here is what the results for the above query look like, assuming the "hotels" index is populated with the sample data provided in the next section (note that the JSON has been formatted for clarity).

```JSON
{
    "value": [
        {
            "@search.score": 0.59600675,
            "hotelId": "2",
            "baseRate": 79.99,
            "description": "Cheapest hotel in town",
            "description_fr": "Hôtel le moins cher en ville",
            "hotelName": "Roach Motel",
            "category": "Budget",
            "tags":["motel", "budget"],
            "parkingIncluded": true,
            "smokingAllowed": true,
            "lastRenovationDate": "1982-04-28T00:00:00Z",
            "rating": 1,
            "location": {
                "type": "Point",
                "coordinates": [-122.131577, 49.678581],
                "crs": {
                    "type":"name",
                    "properties": {
                        "name": "EPSG:4326"
                    }
                }
            }
        }
    ]
}
```

To learn more, please visit the "Response" section of [Search Documents](https://docs.microsoft.com/rest/api/searchservice/Search-Documents). For more information on other HTTP status codes that could be returned in case of failure, see [HTTP status codes (Azure Search)](https://docs.microsoft.com/rest/api/searchservice/HTTP-status-codes).

## Next steps

You can use PowerShell and the REST API to perform any operation supported by Azure Search. The REST API exposes all Azure Search functionality, including advanced features like AI-enriched indexing. For more information, review [REST API operations](https://docs.microsoft.com/rest/api/searchservice/).
