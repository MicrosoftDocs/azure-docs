---
title: 'Quickstart: search index (REST)'
titleSuffix: Azure AI Search
description: In quickstart, use Postman to call the Azure AI Search REST APIs to create, load, and query a search index.
zone_pivot_groups: URL-test-interface-rest-apis
manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.devlang: rest-api
ms.date: 01/19/2024
ms.custom:
  - mode-api
  - ignite-2023
---

# Quickstart: Create a search index in Azure AI Search using REST

Learn how to use the [Search REST APIs](/rest/api/searchservice) to create, load, and query a search index in Azure AI Search. 

The article uses the Postman app. [Download and import a Postman collection](https://github.com/Azure-Samples/azure-search-postman-samples/tree/main/Quickstart) or create requests manually using the instructions in this article.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

+ [Postman app](https://www.postman.com/downloads/), used for sending REST requests to Azure AI Search.

+ [Create](search-create-service-portal.md) or [find an existing Azure AI Search resource](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart. 

## Copy a key and URL

REST calls require the service endpoint and an API key on every request. You can get these values from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com), navigate to the **Overview** page, and copy the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

1. Under **Settings** > **Keys**, copy an admin key. Admin keys are used to add, modify, and delete objects. There are two interchangeable admin keys. Copy either one.

   :::image type="content" source="media/search-get-started-rest/get-url-key.png" alt-text="Screenshot of the URL and API keys in the Azure portal.":::

A valid API key establishes trust, on a per request basis, between the application sending the request and the search service handling it.

## Set collection variables

Postman provides collection variables, enclosed in brackets in a request, to reuse the same string on every request. We use collection variables for customer-specific values, such as `{{service-name}}` in the URI or an `{{admin-key}}` in the request header. 

A URI with multiple variables looks like this:

```http
https://{{service-name}}.search.windows.net/indexes/{{index-name}}?api-version={{api-version}}
```

A request header for Azure AI Search calls must have `Content-Type` set to `application/json`, and an `api-key` set to an API key of your search service. In this quickstart, the `api-key` in the request header is specified as variable.

1. Open the Postman app and import the [sample collection](https://github.com/Azure-Samples/azure-search-postman-samples/tree/main/Quickstart) or create a new one.

1. Select the collection's access menu, select **Edit**, and provide the search service name and an admin API key.

   :::image type="content" source="media/search-get-started-rest/postman-collection-variables.png" lightbox="media/search-get-started-rest/postman-collection-variables.png" alt-text="Screenshot of the Postman collection variable page." border="true":::

## Create an index

Use the [Create Index (REST)](/rest/api/searchservice/create-index) to specify a schema. The endpoint includes the `/indexes` collection and `hotels-quickstart` for the index name.

1. Set the verb to **PUT**.

1. Copy in this URL `https://{{service-name}}.search.windows.net/indexes/hotels-quickstart?api-version=2023-11-01`.

1. Under **Headers**, set `Content-Type` to `application/json` and set `api-key` to `{{admin-key}}`.

1. Under **Body** paste in index definition (copyable JSON is provided in the next section). Make sure the request body selection is **raw** and the type is to **JSON**

1. Select **Send**.

   :::image type="content" source="media/search-get-started-rest/postman-request.png" lightbox="media/search-get-started-rest/postman-request.png" alt-text="Screenshot of the PUT create index request.":::

### Index definition

The fields collection defines document structure. Each document must have these fields, and each field must have an [EDM data type](/rest/api/searchservice/supported-data-types). String fields are used in full text search. If you want numeric data to be searchable, make sure the data type is `Edm.String`. Other data types such as `Edm.Int32` are filterable, sortable, facetable, and retrievable but not full-text searchable.

Attributes on the field determine allowed actions. The REST APIs allow [many actions by default](/rest/api/searchservice/create-index#request-body). For example, all strings are searchable and retrievable by default. For REST APIs, you might only have to attributes if you need to turn off a behavior.

```json
{
    "name": "hotels-quickstart",  
    "fields": [
        {"name": "HotelId", "type": "Edm.String", "key": true, "filterable": true},
        {"name": "HotelName", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": true, "facetable": false},
        {"name": "Description", "type": "Edm.String", "searchable": true, "filterable": false, "sortable": false, "facetable": false, "analyzer": "en.lucene"},
        {"name": "Category", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true, "facetable": true},
        {"name": "Tags", "type": "Collection(Edm.String)", "searchable": true, "filterable": true, "sortable": false, "facetable": true},
        {"name": "ParkingIncluded", "type": "Edm.Boolean", "filterable": true, "sortable": true, "facetable": true},
        {"name": "LastRenovationDate", "type": "Edm.DateTimeOffset", "filterable": true, "sortable": true, "facetable": true},
        {"name": "Rating", "type": "Edm.Double", "filterable": true, "sortable": true, "facetable": true},
        {"name": "Address", "type": "Edm.ComplexType", 
        "fields": [
        {"name": "StreetAddress", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false, "searchable": true},
        {"name": "City", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true, "facetable": true},
        {"name": "StateProvince", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true, "facetable": true},
        {"name": "PostalCode", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true, "facetable": true},
        {"name": "Country", "type": "Edm.String", "searchable": true, "filterable": true, "sortable": true, "facetable": true}
        ]
     }
  ]
}
```

When you submit this request, you should get an HTTP 201 response, indicating the index was created successfully. You can verify the index exists in the portal.

> [!TIP]
> If you get HTTP 504, verify the URL specifies HTTPS. If you see HTTP 400 or 404, check the request body to verify there were no copy-paste errors. An HTTP 403 typically indicates a problem with the API key (either an invalid key or a syntax problem with how the API key is specified).

## Load documents

Creating and loading the index are separate steps. In Azure AI Search, the index contains all searchable data and queries execute on the search service. For REST calls, the data is provided as JSON documents. Use [Documents- Index REST API](/rest/api/searchservice/addupdate-or-delete-documents) for this task. 

The URL is extended to include the `docs` collections and `index` operation.

1. Set the verb to **POST**.

1. Copy in this URL `https://{{service-name}}.search.windows.net/indexes/hotels-quickstart/docs/index?api-version=2023-11-01`.

1. Set up the request headers as you did in the previous step.

1. Provide the JSON documents (copyable JSON is provided in the next section) in the body of the request.

1. Select **Send**.

   :::image type="content" source="media/search-get-started-rest/postman-docs.png" lightbox="media/search-get-started-rest/postman-docs.png" alt-text="Screenshot of a POST load documents request.":::

### JSON documents to load into the index

The Request Body contains four documents to be added to the hotels index.

```json
{
    "value": [
    {
    "@search.action": "upload",
    "HotelId": "1",
    "HotelName": "Secret Point Motel",
    "Description": "The hotel is ideally located on the main commercial artery of the city in the heart of New York. A few minutes away is Time's Square and the historic centre of the city, as well as other places of interest that make New York one of America's most attractive and cosmopolitan cities.",
    "Category": "Boutique",
    "Tags": [ "pool", "air conditioning", "concierge" ],
    "ParkingIncluded": false,
    "LastRenovationDate": "1970-01-18T00:00:00Z",
    "Rating": 3.60,
    "Address": 
        {
        "StreetAddress": "677 5th Ave",
        "City": "New York",
        "StateProvince": "NY",
        "PostalCode": "10022",
        "Country": "USA"
        } 
    },
    {
    "@search.action": "upload",
    "HotelId": "2",
    "HotelName": "Twin Dome Motel",
    "Description": "The hotel is situated in a  nineteenth century plaza, which has been expanded and renovated to the highest architectural standards to create a modern, functional and first-class hotel in which art and unique historical elements coexist with the most modern comforts.",
    "Category": "Boutique",
    "Tags": [ "pool", "free wifi", "concierge" ],
    "ParkingIncluded": false,
    "LastRenovationDate": "1979-02-18T00:00:00Z",
    "Rating": 3.60,
    "Address": 
        {
        "StreetAddress": "140 University Town Center Dr",
        "City": "Sarasota",
        "StateProvince": "FL",
        "PostalCode": "34243",
        "Country": "USA"
        } 
    },
    {
    "@search.action": "upload",
    "HotelId": "3",
    "HotelName": "Triple Landscape Hotel",
    "Description": "The Hotel stands out for its gastronomic excellence under the management of William Dough, who advises on and oversees all of the Hotel’s restaurant services.",
    "Category": "Resort and Spa",
    "Tags": [ "air conditioning", "bar", "continental breakfast" ],
    "ParkingIncluded": true,
    "LastRenovationDate": "2015-09-20T00:00:00Z",
    "Rating": 4.80,
    "Address": 
        {
        "StreetAddress": "3393 Peachtree Rd",
        "City": "Atlanta",
        "StateProvince": "GA",
        "PostalCode": "30326",
        "Country": "USA"
        } 
    },
    {
    "@search.action": "upload",
    "HotelId": "4",
    "HotelName": "Sublime Cliff Hotel",
    "Description": "Sublime Cliff Hotel is located in the heart of the historic center of Sublime in an extremely vibrant and lively area within short walking distance to the sites and landmarks of the city and is surrounded by the extraordinary beauty of churches, buildings, shops and monuments. Sublime Cliff is part of a lovingly restored 1800 palace.",
    "Category": "Boutique",
    "Tags": [ "concierge", "view", "24-hour front desk service" ],
    "ParkingIncluded": true,
    "LastRenovationDate": "1960-02-06T00:00:00Z",
    "Rating": 4.60,
    "Address": 
        {
        "StreetAddress": "7400 San Pedro Ave",
        "City": "San Antonio",
        "StateProvince": "TX",
        "PostalCode": "78216",
        "Country": "USA"
        }
    }
  ]
}
```

In a few seconds, you should see an HTTP 201 response in the session list. This indicates the documents were created successfully. 

If you get a 207, at least one document failed to upload. If you get a 404, you have a syntax error in either the header or body of the request: verify you changed the endpoint to include `/docs/index`.

## Search an index

Now that an index and document set are loaded, you can issue queries against them using [Search Documents REST API](/rest/api/searchservice/search-documents).

Use GET or POST to query an index. On a GET call, specify query parameters on the URI. On POST, specify query parameters in JSON. POST is preferred for setting multiple query parameters.

The URL is extended to include a query expression, specified using the `/docs/search` operator.

1. Set the verb to **GET**.

1. Copy in this URL `https://{{service-name}}.search.windows.net/indexes/hotels-quickstart/docs?search=*&$count=true&api-version=2023-11-01`. There's no JSON body for this request. All parameters are on the URI. On a GET request, the API version is preceded by an `&` character.

1. Select **Send**.

   This query is an empty and returns a count of the documents in the search results. The request and response should look similar to the following screenshot for Postman after you select **Send**. The status code should be 200.

   :::image type="content" source="media/search-get-started-rest/postman-query.png" lightbox="media/search-get-started-rest/postman-query.png" alt-text="Screenshot of a GET query request.":::

1. Set the verb to **POST**.

1. Copy in this URL `https://{{service-name}}.search.windows.net/indexes/hotels-quickstart/docs/search?api-version=2023-11-01`. On a POST request, the API version is preceded by a `?` character.

1. Copy in this JSON query and then select **Send**.

    ```json
    {
        "search": "lake view",
        "select": "HotelId, HotelName, Tags, Description",
        "searchFields": "Description, Tags",
        "count": true
    }
    ```

   The request and response should look similar to the following screenshot. For more query examples, including filters and sorting, see [Query examples](search-query-simple-examples.md).

   :::image type="content" source="media/search-get-started-rest/postman-query-post.png" lightbox="media/search-get-started-rest/postman-query-post.png" alt-text="Screenshot of a POST request and response in Postman.":::

## Get index properties

You can also use [Get Statistics](/rest/api/searchservice/get-index-statistics) to query for document counts and index size: 

```http
https://{{service-name}}.search.windows.net/indexes/hotels-quickstart/stats?api-version=2023-11-01
```

Adding `/stats` to your URL returns index information. In Postman, your request should look similar to the following, and the response includes a document count and space used in bytes.

:::image type="content" source="media/search-get-started-rest/postman-system-query.png" lightbox="media/search-get-started-rest/postman-system-query.png" alt-text="Screenshot of the Get Statistics request.":::

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

On a free service, remember the limitation of three indexes, indexers, and data sources. You can delete individual items in the portal to stay under the limit.

## Next steps

Now that you know how to perform basic tasks, try advanced features, such as indexers or [enrichment pipelines](cognitive-search-tutorial-blob.md) that add content transformations to indexing. We recommend the following article:

> [!div class="nextstepaction"]
> [Tutorial: Use REST and AI to generate searchable content from Azure blobs](cognitive-search-tutorial-blob.md)
