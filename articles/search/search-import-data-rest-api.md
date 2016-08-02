<properties
    pageTitle="Data upload in Azure Search using the REST API | Microsoft Azure | Hosted cloud search service"
    description="Learn how to upload data to an index in Azure Search using the REST API."
    services="search"
    documentationCenter=""
    authors="ashmaka"
    manager=""
    editor=""
    tags=""/>

<tags
    ms.service="search"
    ms.devlang="rest-api"
    ms.workload="search"
    ms.topic="get-started-article"
    ms.tgt_pltfrm="na"
    ms.date="05/31/2016"
    ms.author="ashmaka"/>

# Upload data to Azure Search using the REST API
> [AZURE.SELECTOR]
- [Overview](search-what-is-data-import.md)
- [.NET](search-import-data-dotnet.md)
- [REST](search-import-data-rest-api.md)

This article will show you how to use the [Azure Search REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx) to import data into an Azure Search index.

Before beginning this walkthrough, you should already have [created an Azure Search index](search-what-is-an-index.md).

In order to push documents into your index using the REST API, you will issue an HTTP POST request to your index's URL endpoint. The body of the HTTP request body is a JSON object containing the documents to be added, modified, or deleted.

## I. Identify your Azure Search service's admin api-key
When issuing HTTP requests against your service using the REST API, *each* API request must include the api-key that was generated for the Search service you provisioned. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

1. To find your service's api-keys you must log into the [Azure Portal](https://portal.azure.com/)
2. Go to your Azure Search service's blade
3. Click on the "Keys" icon

Your service will have *admin keys* and *query keys*.

  - Your primary and secondary *admin keys* grant full rights to all operations, including the ability to manage the service, create and delete indexes, indexers, and data sources. There are two keys so that you can continue to use the secondary key if you decide to regenerate the primary key, and vice-versa.
  - Your *query keys* grant read-only access to indexes and documents, and are typically distributed to client applications that issue search requests.

For the purposes of importing data into an index, you can use either your primary or secondary admin key.

## II. Decide which indexing action to use
When using the REST API, you will issue HTTP POST requests with JSON request bodies to your Azure Search index's endpoint URL. The JSON object in your HTTP request body will contain a single JSON array named "value" containing JSON objects representing documents you would like to add to your index, update, or delete.

Each JSON object in the "value" array represents a document to be indexed. Each of these objects contains the document's key and specifies the desired indexing action (upload, merge, delete, etc). Depending on which of the below actions you choose, only certain fields must be included for each document:

@search.action | Description | Necessary fields for each document | Notes
--- | --- | --- | ---
`upload` | An `upload` action is similar to an "upsert" where the document will be inserted if it is new and updated/replaced if it exists. | key, plus any other fields you wish to define | When updating/replacing an existing document, any field that is not specified in the request will have its field set to `null`. This occurs even when the field was previously set to a non-null value.
`merge` | Updates an existing document with the specified fields. If the document does not exist in the index, the merge will fail. | key, plus any other fields you wish to define | Any field you specify in a merge will replace the existing field in the document. This includes fields of type `Collection(Edm.String)`. For example, if the document contains a field `tags` with value `["budget"]` and you execute a merge with value `["economy", "pool"]` for `tags`, the final value of the `tags` field will be `["economy", "pool"]`. It will not be `["budget", "economy", "pool"]`.
`mergeOrUpload` | This action behaves like `merge` if a document with the given key already exists in the index. If the document does not exist, it behaves like `upload` with a new document. | key, plus any other fields you wish to define | -
`delete` | Removes the specified document from the index. | key only | Any fields you specify other than the key field will be ignored. If you want to remove an individual field from a document, use `merge` instead and simply set the field explicitly to null.

## III. Construct your HTTP request and request body
Now that you have gathered the necessary field values for your index actions, you are ready to construct the actual HTTP request and JSON request body to import your data.

#### Request and Request Headers
In the URL, you will need to provide your service name, index name ("hotels" in this case), as well as the proper API version (the current API version is `2015-02-28` at the time of publishing this document). You will need to define the `Content-Type` and `api-key` request headers. For the latter, use one of your service's admin keys.

    POST https://[search service].search.windows.net/indexes/hotels/docs/index?api-version=2015-02-28
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

## IV. Understand your HTTP response code
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

> [AZURE.NOTE] This often means that the load on your search service is reaching a point where indexing requests will begin to return `503` responses. In this case, we highly recommend that your client code back off and wait before retrying. This will give the system some time to recover, increasing the chances that future requests will succeed. Rapidly retrying your requests will only prolong the situation.

#### 429
A status code of `429` will be returned when you have exceeded your quota on the number of documents per index.

#### 503
A status code of `503` will be returned if none of the items in the request were successfully indexed. This error means that the system is under heavy load and your request can't be processed at this time.

> [AZURE.NOTE] In this case, we highly recommend that your client code back off and wait before retrying. This will give the system some time to recover, increasing the chances that future requests will succeed. Rapidly retrying your requests will only prolong the situation.

For more information on document actions and success/error responses, please see [Add, Update, or Delete Documents](https://msdn.microsoft.com/library/azure/dn798930.aspx). For more information on other HTTP status codes that could be returned in case of failure, see [HTTP status codes (Azure Search)](https://msdn.microsoft.com/library/azure/dn798925.aspx).

## Next
After populating your Azure Search index, you will be ready to start issuing queries to search for documents. See [Query Your Azure Search Index](search-query-overview.md) for details.
