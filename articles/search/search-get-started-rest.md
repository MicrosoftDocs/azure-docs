---
title: 'Quickstart: search index (REST)'
titleSuffix: Azure AI Search
description: In this quickstart, learn how to call the Azure AI Search REST APIs to create, load, and query a search index.
zone_pivot_groups: URL-test-interface-rest-apis
manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.devlang: rest-api
ms.date: 03/14/2024
ms.custom:
  - mode-api
  - ignite-2023
---

# Quickstart: Text search using REST

The REST APIs in Azure AI Search provide programmatic access to all of its capabilities, including preview features, and they're an easy way to learn how features work. In this quickstart, learn how to call the [Search REST APIs](/rest/api/searchservice) to create, load, and query a search index in Azure AI Search. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

+ [Visual Studio Code](https://code.visualstudio.com/download) with a [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).

+ [Azure AI Search](search-what-is-azure-search.md). [Create](search-create-service-portal.md) or [find an existing Azure AI Search resource](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart. 

## Download files

[Download a REST sample](https://github.com/Azure-Samples/azure-search-rest-samples/tree/main/Quickstart) from GitHub to send the requests in this quickstart. [Learn how](https://docs.github.com/get-started/start-your-journey/downloading-files-from-github).

Or, start a new file on your local system and create requests manually using the instructions in this article.

## Copy a search service key and URL

REST calls require the search service endpoint and an API key on every request. You can get these values from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com), navigate to the search service **Overview** page, and copy the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

1. Under **Settings** > **Keys**, copy an admin key. Admin keys are used to add, modify, and delete objects. There are two interchangeable admin keys. Copy either one.

   :::image type="content" source="media/search-get-started-rest/get-url-key.png" alt-text="Screenshot of the URL and API keys in the Azure portal.":::

## Set up Visual Studio Code

If you're not familiar with the REST client for Visual Studio Code, this section includes setup so that you can complete the tasks in this quickstart.

1. Start Visual Studio Code and select the **Extensions** tile.

1. Search for the REST client and select **Install**.

   :::image type="content" source="media/search-get-started-rest/rest-client-install.png" alt-text="Screenshot of the REST client install command.":::

1. Open or create new file named with either a `.rest` or `.http` file extension.

1. Paste in the following example. Replace the base URL and API key with the values you copied earlier.

   ```http
   @baseUrl = PUT-YOUR-SEARCH-SERVICE-ENDPOINT-HERE
   @apiKey = PUT-YOUR-SEARCH-SERVICE-API-KEY-HERE
    
    ### List existing indexes by name
    GET  {{baseUrl}}/indexes?api-version=2023-11-01&$select=name  HTTP/1.1
      Content-Type: application/json
      api-key: {{apiKey}}
    ```

1. Select **Send request**. A response should appear in an adjacent pane. If you have existing indexes, they're listed. Otherwise, the list is empty, but as long as the HTTP code is 200 OK, you're ready for the next steps.

   :::image type="content" source="media/search-get-started-rest/rest-client-request-setup.png" lightbox="media/search-get-started-rest/rest-client-request-setup.png" alt-text="Screenshot of a REST client configured for a search service request.":::

    **Key points:**
  
    + Parameters are specified using an `@` prefix.
    + `###` designates a REST call. The next line contains the request, which must include `HTTP/1.1`.
    + `Send request` should appear above the request.

## Create an index

Add a second request to your `.rest` file. [Create Index (REST)](/rest/api/searchservice/create-index) creates a search index and sets up the physical data structures on your search service.

1. Paste in the following example to create the hotels-quickstart index on your search service.

    ```http
    ### Create a new index
    POST {{baseUrl}}/indexes?api-version=2023-11-01  HTTP/1.1
      Content-Type: application/json
      api-key: {{apiKey}}
    
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

1. Select **Send request**. You should have an `HTTP/1.1 201 Created` response and the response body should include the JSON representation of the index schema. 

   If you get an `Header name must be a valid HTTP token ["{"]` error, make sure there's an empty line between the `api-key` and the body of the request. If you get HTTP 504, verify the URL specifies HTTPS. If you see HTTP 400 or 404, check the request body to verify there were no copy-paste errors. An HTTP 403 typically indicates a problem with the API key (either an invalid key or a syntax problem with how the API key is specified).

   You now have several requests in your file. Recall that `###` starts a new request, and each request executes independently.

   :::image type="content" source="media/search-get-started-rest/rest-client-multiple-calls.png" alt-text="Screenshot of REST client with multiple requests.":::

### About the index definition

Within the index schema, the fields collection defines document structure. Each document that you upload must have these fields, and each field must be assigned to an [EDM data type](/rest/api/searchservice/supported-data-types). String fields are used in full text search. If you want numeric data to be searchable, make sure the data type is `Edm.String`. Other data types such as `Edm.Int32` are filterable, sortable, facetable, and retrievable but not full-text searchable.

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

## Load documents

Creating and loading the index are separate steps. In Azure AI Search, the index contains all searchable data and queries execute on the search service. For REST calls, the data is provided as JSON documents. Use [Documents- Index REST API](/rest/api/searchservice/documents/) for this task. 

The URI is extended to include the `docs` collections and `index` operation.

1. Paste in the following example to upload JSON documents to the search index, and then select **Send request**.

    ```http
    ### Upload documents
    POST {{baseUrl}}/indexes/hotels-quickstart/docs/index?api-version=2023-11-01  HTTP/1.1
      Content-Type: application/json
      api-key: {{apiKey}}
    
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

In a few seconds, you should see an HTTP 201 response in the adjacent pane. If you get a 207, at least one document failed to upload. If you get a 404, you have a syntax error in either the header or body of the request: verify you changed the endpoint to include `/docs/index`.

## Run queries

Now that documents are loaded, you can issue queries against them using [Documents - Search Post (REST)](/rest/api/searchservice/documents/search-post).

The URI is extended to include a query expression, specified using the `/docs/search` operator.

1. Paste in the following example to query the search index, and then select **Send request**. A text search request always includes a `search` parameter. This example includes an optional `searchFields` parameter that constrains text search to specific fields.

    ```http
    ### Run a query
    POST {{baseUrl}}/indexes/hotels-quickstart/docs/search?api-version=2023-11-01  HTTP/1.1
        Content-Type: application/json
        api-key: {{apiKey}}
        
        {
            "search": "lake view",
            "select": "HotelId, HotelName, Tags, Description",
            "searchFields": "Description, Tags",
            "count": true
        }
    ```

1. Review the response in the adjacent pane. You should have a count indicating the number of matches found in the index, a search score indicating relevance, and values for each field listed in the `select` statement.

    ```json
    {
      "@odata.context": "https://my-demo.search.windows.net/indexes('hotels-quickstart')/$metadata#docs(*)",
      "@odata.count": 1,
      "value": [
        {
          "@search.score": 0.6189728,
          "HotelId": "4",
          "HotelName": "Sublime Cliff Hotel",
          "Description": "Sublime Cliff Hotel is located in the heart of the historic center of Sublime in an extremely vibrant and lively area within short walking distance to the sites and landmarks of the city and is surrounded by the extraordinary beauty of churches, buildings, shops and monuments. Sublime Cliff is part of a lovingly restored 1800 palace.",
          "Tags": [
            "concierge",
            "view",
            "24-hour front desk service"
          ]
        }
      ]
    }
    ```

## Get index properties

You can also use [Get Statistics](/rest/api/searchservice/indexes/get-statistics) to query for document counts and index size: 

1. Paste in the following example to query the search index, and then select **Send request**.

    ```http
    ### Get index statistics
    GET {{baseUrl}}/indexes/hotels-quickstart/stats?api-version=2023-11-01  HTTP/1.1
      Content-Type: application/json
      api-key: {{apiKey}}
    ```

1. Review the response. This operation is an easy way to get details about index storage.

    ```json
    {
      "@odata.context": "https://my-demo.search.windows.net/$metadata#Microsoft.Azure.Search.V2023_11_01.IndexStatistics",
      "documentCount": 4,
      "storageSize": 34707,
      "vectorIndexSize": 0
    }
    ```

## Clean up resources

When you're working in your own subscription, it's a good idea at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

You can also try this DELETE command:

```http
### Delete an index
DELETE  {{baseUrl}}/indexes/hotels-quickstart?api-version=2023-11-01 HTTP/1.1
    Content-Type: application/json
    api-key: {{apiKey}}
```

## Next step

Now that you're familiar with the REST client and making REST calls to Azure AI Search, try another quickstart that demonstrates vector support.

> [!div class="nextstepaction"]
> [Quickstart: Vector search using REST](search-get-started-vector.md)
