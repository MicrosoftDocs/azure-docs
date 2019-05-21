---
title: Explore REST APIs in Postman or Fiddler - Azure Search
description: How to use Postman or Fiddler to issue HTTP requests and REST API calls to Azure Search.
author: HeidiSteen
manager: cgronlun
services: search
ms.service: search
ms.devlang: rest-api
ms.topic: quickstart
ms.date: 03/12/2019
ms.author: heidist
ms.custom: seodec2018
---

# Quickstart: Explore Azure Search REST APIs using Postman or Fiddler

One of the easiest ways to explore the [Azure Search REST API](https://docs.microsoft.com/rest/api/searchservice) is using Postman or Fiddler to formulate HTTP requests and inspect the responses. With the right tools and these instructions, you can send requests and view responses before writing any code.

> [!div class="checklist"]
> * Download a web api test tool
> * Get the api-key and endpoint for your search service
> * Configure request headers
> * Create an index
> * Load an index
> * Search an index

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin and then [sign up for Azure Search](search-create-service-portal.md).

## Download tools

The following tools are widely used in web development, but if you are familiar with another tool, the instructions in this article should still apply.

+ [Postman desktop app](https://www.getpostman.com/)
+ [Telerik Fiddler](https://www.telerik.com/fiddler)

## Get the api-key and endpoint

REST calls require the service URL and an access key on every request. A search service is created with both, so if you added Azure Search to your subscription, follow these steps to get the necessary information:

1. In the Azure portal, in your search service **Overview** page, get the URL. An example endpoint might look like `https://my-service-name.search.windows.net`.

2. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

![Get an HTTP endpoint and access key](media/search-fiddler/get-url-key.png "Get an HTTP endpoint and access key")

All requests require an api-key on every request sent to your service. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.


## Configure headers

Each tool persists request header information for the session, which means you only have to enter the URL endpoint, api-version, api-key, and content-type once.

The full URL should look similar to the following example, only yours should have a valid replacement for the **`my-app`** placeholder name: `https://my-app.search.windows.net/indexes/hotels?api-version=2017-11-11`

Service URL composition includes the following elements:

+ HTTPS prefix.
+ Service URL, obtained from the portal.
+ Resource, an operation that creates an object on your service. In this step, it is an index named *hotels*.
+ api-version, a required lowercase string specified as "?api-version=2017-11-11" for the current version. [API versions](search-api-versions.md) are updated regularly. Including the api-version on each request gives you full control over which one is used.  

Request header composition includes two elements, content type and the api-key described in the previous section:

    api-key: <placeholder>
    Content-Type: application/json


### Postman

Formulate a request that looks like the following screenshot. Choose **PUT** as the verb. 

![Postman request header][6]

### Fiddler

Formulate a request that looks like the following screenshot. Choose **PUT** as the verb. Fiddler adds `User-Agent=Fiddler`. You can paste the two additional request headers on new lines below it. Include the content type and api-key for your service, using the admin access key for your service.

![Fiddler request header][1]

> [!Tip]
> Turn off web traffic to hide extraneous, unrelated HTTP activity. In Fiddler's **File** menu, turn off **Capture Traffic**. 

## 1 - Create an index

The body of the request contains the index definition. Adding the request body completes the request that produces your index.

Besides the index name, the most important component in the request is the fields collection. The fields collection defines the index schema. On each field, specify its type. String fields are used in full text search, so you might want to cast numeric data as strings if you need that content to be searchable.

Attributes on the field determine allowed action. The REST APIs allow many actions by default. For example, all strings are searchable, retrievable, filterable, and facetable by default. Often, you only have to set attributes when you need to turn a behavior off. For more information about attributes, see [Create Index (REST)](https://docs.microsoft.com/rest/api/searchservice/create-index).

          {
         "name": "hotels",  
         "fields": [
           {"name": "hotelId", "type": "Edm.String", "key":true, "searchable": false},
           {"name": "baseRate", "type": "Edm.Double"},
           {"name": "description", "type": "Edm.String", "filterable": false, "sortable": false, "facetable": false},
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


When you submit this request, you should get an HTTP 201 response, indicating the index was created successfully. You can verify this action in the portal, but note that the portal page has refresh intervals so it could take a minute or two to catch up.

If you get HTTP 504, verify the URL specifies HTTPS. If you see HTTP 400 or 404, check the request body to verify there were no copy-paste errors. An HTTP 403 typically indicates a problem with the api-key (either an invalid key or a syntax problem with how the api-key is specified).


### Postman

Copy the index definition to the request body, similar to the following screenshot, and then click **Send** on the top right to send the completed request.

![Postman request body][8]

### Fiddler

Copy the index definition to the request body, similar to the following screenshot, and then click **Execute** on the top right to send the completed request.

![Fiddler request body][7]

## 2 - Load documents

Creating the index and populating the index are separate steps. In Azure Search, the index contains all searchable data, which you can provide as JSON documents. To review the API for this operation, see [Add, update, or delete documents (REST)](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents).

+ Change the verb to **POST** for this step.
+ Change the endpoint to include `/docs/index`. The full URL should look like `https://my-app.search.windows.net/indexes/hotels/docs/index?api-version=2017-11-11`
+ Keep the request headers as-is. 

The Request Body contains four documents to be added to the hotels index.

         {
         "value": [
         {
             "@search.action": "upload",
             "hotelId": "1",
             "baseRate": 199.0,
             "description": "Best hotel in town",
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
             "@search.action": "upload",
             "hotelId": "3",
             "baseRate": 279.99,
             "description": "Surprisingly expensive",
             "hotelName": "Dew Drop Inn",
             "category": "Bed and Breakfast",
             "tags": ["charming", "quaint"],
             "parkingIncluded": true,
             "smokingAllowed": false,
             "lastRenovationDate": null,
             "rating": 4,
             "location": { "type": "Point", "coordinates": [-122.33207, 47.60621] }
           },
           {
             "@search.action": "upload",
             "hotelId": "4",
             "baseRate": 220.00,
             "description": "This could be the one",
             "hotelName": "A Hotel for Everyone",
             "category": "Basic hotel",
             "tags": ["pool", "wifi"],
             "parkingIncluded": true,
             "smokingAllowed": false,
             "lastRenovationDate": null,
             "rating": 4,
             "location": { "type": "Point", "coordinates": [-122.12151, 47.67399] }
           }
          ]
         }

In a few seconds, you should see an HTTP 200 response in the session list. This indicates the documents were created successfully. 

If you get a 207, at least one document failed to upload. If you get a 404, you have a syntax error in either the header or body of the request: verify you changed the endpoint to include `/docs/index`.

> [!Tip]
> For selected data sources, you can choose the alternative *indexer* approach which simplifies and reduces the amount of code required for indexing. For more information, see [Indexer operations](https://docs.microsoft.com/rest/api/searchservice/indexer-operations).


### Postman

Change the verb to **POST**. Change the URL to include `/docs/index`. Copy the documents into the request body, similar to the following screenshot, and then execute the request.

![Postman request payload][10]

### Fiddler

Change the verb to **POST**. Change the URL to include `/docs/index`. Copy the documents into the request body, similar to the following screenshot, and then execute the request.

![Fiddler request payload][9]

## 3 - Search an index
Now that an index and documents are loaded, you can issue queries against them using [Search Documents](https://docs.microsoft.com/rest/api/searchservice/search-documents) REST API.

+ Change the verb to **GET** for this step.
+ Change the endpoint to include query parameters, including search strings. A query URL might look like `https://my-app.search.windows.net/indexes/hotels/docs?search=motel&$count=true&api-version=2017-11-11`
+ Keep the request headers as-is

This query searches on the term "motel" and returns a count of the documents in the search results. The request and response should look similar to the following screenshot for Postman after you click **Send**. The status code should be 200.

 ![Postman query response][11]

### Tips for running our sample queries in Fiddler

The following example query is from the [Search Index operation (Azure Search API)](https://docs.microsoft.com/rest/api/searchservice/Search-Documents) article. Many of the example queries in this article include spaces, which are not allowed in Fiddler. Replace each space with a + character before pasting in the query string before attempting the query in Fiddler.

**Before spaces are replaced (in lastRenovationDate desc):**

        GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate desc&api-version=2017-11-11

**After spaces are replaced with + (in lastRenovationDate+desc):**

        GET /indexes/hotels/docs?search=*&$orderby=lastRenovationDate+desc&api-version=2017-11-11

## Get index properties
You can also query system information to get document counts and storage consumption: `https://my-app.search.windows.net/indexes/hotels/stats?api-version=2017-11-11`

In Postman, your request should look similar to the following, and the response includes a document count and space used in bytes.

 ![Postman system query][12]

Notice that the api-version syntax differs. For this request, use `?` to append the api-version. The ? separates the URL path from the query string, while & separates each 'name=value' pair in the query string. For this query, api-version is the first and only item in the query string.

For more information about this API, see [Get Index Statistics (REST)](https://docs.microsoft.com/rest/api/searchservice/get-index-statistics).


### Tips for viewing index statistic in Fiddler

In Fiddler, click the **Inspectors** tab, click the **Headers** tab, and then select the JSON format. You should see the document count and storage size (in KB).

## Next steps

REST clients are invaluable for impromptu exploration, but now that you know how the REST APIs work, you can move forward with code. For your next steps, see the following links:

+ [Quickstart: Create an index using .NET SDK](search-create-index-dotnet.md)
+ [Quickstart: Create an index (REST) using PowerShell](search-create-index-rest-api.md)

<!--Image References-->
[1]: ./media/search-fiddler/fiddler-url.png
[2]: ./media/search-fiddler/AzureSearch_Fiddler2_PostDocs.png
[3]: ./media/search-fiddler/AzureSearch_Fiddler3_Query.png
[4]: ./media/search-fiddler/AzureSearch_Fiddler4_QueryResults.png
[5]: ./media/search-fiddler/AzureSearch_Fiddler5_QueryStats.png
[6]: ./media/search-fiddler/postman-url.png
[7]: ./media/search-fiddler/fiddler-request.png
[8]: ./media/search-fiddler/postman-request.png
[9]: ./media/search-fiddler/fiddler-docs.png
[10]: ./media/search-fiddler/postman-docs.png
[11]: ./media/search-fiddler/postman-query.png
[12]: ./media/search-fiddler/postman-system-query.png