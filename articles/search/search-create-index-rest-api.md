---
title: 'Quickstart: PowerShell and REST APIs - Azure Search'
description: Create, load, and query an index using PowerShell's Invoke-RestMethod and the Azure Search REST API.

ms.date: 06/10/2019
author: heidisteen
manager: cgronlun
ms.author: heidist
services: search
ms.service: search
ms.devlang: rest-api
ms.topic: conceptual
ms.custom: seodec2018
---
# Quickstart: Create an Azure Search index using PowerShell
> [!div class="op_single_selector"]
> * [PowerShell (REST)](search-create-index-rest-api.md)
> * [C#](search-create-index-dotnet.md)
> * [Postman (REST)](search-fiddler.md)
> * [Python](search-get-started-python.md)
> * [Portal](search-create-index-portal.md)
> 

This article walks you through the process of creating, loading, and querying an Azure Search [index](search-what-is-an-index.md) using PowerShell and the [Azure Search Service REST APIs](https://docs.microsoft.com/rest/api/searchservice/). The index definition and searchable content are provided in the request body as well-formed JSON content.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin and then [sign up for Azure Search](search-create-service-portal.md).

## Prerequisites

The following services and tools are used in this quickstart. 

+ [PowerShell 5.1 or later](https://github.com/PowerShell/PowerShell), using [Invoke-RestMethod](https://docs.microsoft.com/powershell/module/Microsoft.PowerShell.Utility/Invoke-RestMethod) for sequential and interactive steps.

+ [Create an Azure Search service](search-create-service-portal.md) or [find an existing service](https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices) under your current subscription. You can use a free service for this quickstart. 

## Get a key and URL

REST calls require the service URL and an access key on every request. A search service is created with both, so if you added Azure Search to your subscription, follow these steps to get the necessary information:

1. [Sign in to the Azure portal](https://portal.azure.com/), and in your search service **Overview** page, get the URL. An example endpoint might look like `https://mydemo.search.windows.net`.

2. In **Settings** > **Keys**, get an admin key for full rights on the service. There are two interchangeable admin keys, provided for business continuity in case you need to roll one over. You can use either the primary or secondary key on requests for adding, modifying, and deleting objects.

![Get an HTTP endpoint and access key](media/search-fiddler/get-url-key.png "Get an HTTP endpoint and access key")

All requests require an api-key on every request sent to your service. Having a valid key establishes trust, on a per request basis, between the application sending the request and the service that handles it.

## Connect to Azure Search

1. In PowerShell, create a **$headers** object to store the content-type and API key. Replace the admin API key (YOUR-ADMIN-API-KEY) with a key that is valid for your search service. You only have to set this header once for the duration of the session, but you will add it to every request. 

    ```powershell
    $headers = @{
    'api-key' = '<YOUR-ADMIN-API-KEY>'
    'Content-Type' = 'application/json' 
    'Accept' = 'application/json' }
    ```

2. Create a **$url** object that specifies the service's indexes collection. Replace the service name (YOUR-SEARCH-SERVICE-NAME) with a valid search service.

    ```powershell
    $url = "https://<YOUR-SEARCH-SERVICE-NAME>.search.windows.net/indexes?api-version=2019-05-06"
    ```

3. Run **Invoke-RestMethod** to send a GET request to the service and verify the connection. Add **ConvertTo-Json** so that you can view the responses sent back from the service.

    ```powershell
    Invoke-RestMethod -Uri $url -Headers $headers | ConvertTo-Json
    ```

   If the service is empty and has no indexes, results are similar to the following example. Otherwise, you'll see a JSON representation of index definitions.

    ```
    {
        "@odata.context":  "https://mydemo.search.windows.net/$metadata#indexes",
        "value":  [

                ]
    }
    ```

## 1 - Create an index

Unless you are using the portal, an index must exist on the service before you can load data. This step defines the index and pushes it to the service. The [Create Index REST API](https://docs.microsoft.com/rest/api/searchservice/create-index) is used for this step.

Required elements of an index include a name and a fields collection. The fields collection defines the structure of a *document*. Each field has a name, type, and attributes that determine how it's used (for example, whether it is full-text searchable, filterable, or retrievable in search results). Within an index, one of the fields of type `Edm.String` must be designated as the *key* for document identity.

This index is named "hotels-quickstart" and has the field definitions you see below. It's a subset of a larger [Hotels index](https://github.com/Azure-Samples/azure-search-sample-data/blob/master/hotels/Hotels_IndexDefinition.JSON) used in other walkthroughs. We trimmed it in this quickstart for brevity.

1. Paste this example into PowerShell to create a **$body** object containing the index schema.

    ```powershell
    $body = @"
    {
        "name": "hotels-quickstart",  
        "fields": [
            {"name": "HotelId", "type": "Edm.String", "key": "true", "filterable": "true"},
            {"name": "HotelName", "type": "Edm.String", "searchable": "true", "filterable": "false", "sortable": "true", "facetable": "false"},
            {"name": "Description", "type": "Edm.String", "searchable": "true", "filterable": "false", "sortable": "false", "facetable": "false", "analyzer": "en.lucene"},
            {"name": "Description_fr", "type": "Edm.String", "searchable": "true", "filterable": "false", "sortable": "false", "facetable": "false", "analyzer": "fr.lucene"},
            {"name": "Category", "type": "Edm.String", "searchable": "true", "filterable": "true", "sortable": "true", "facetable": "true"},
            {"name": "Tags", "type": "Collection(Edm.String)", "searchable": "true", "filterable": "true", "sortable": "false", "facetable": "true"},
            {"name": "ParkingIncluded", "type": "Edm.Boolean", "filterable": "true", "sortable": "true", "facetable": "true"},
            {"name": "LastRenovationDate", "type": "Edm.DateTimeOffset", "filterable": "true", "sortable": "true", "facetable": "true"},
            {"name": "Rating", "type": "Edm.Double", "filterable": "true", "sortable": "true", "facetable": "true"},
            {"name": "Address", "type": "Edm.ComplexType", 
            "fields": [
            {"name": "StreetAddress", "type": "Edm.String", "filterable": "false", "sortable": "false", "facetable": "false", "searchable": "true"},
            {"name": "City", "type": "Edm.String", "searchable": "true", "filterable": "true", "sortable": "true", "facetable": "true"},
            {"name": "StateProvince", "type": "Edm.String", "searchable": "true", "filterable": "true", "sortable": "true", "facetable": "true"},
            {"name": "PostalCode", "type": "Edm.String", "searchable": "true", "filterable": "true", "sortable": "true", "facetable": "true"},
            {"name": "Country", "type": "Edm.String", "searchable": "true", "filterable": "true", "sortable": "true", "facetable": "true"}
        ]
    }
    "@
    ```

2. Set the URI to the indexes collection on your service and the *hotels-quickstart* index.

    ```powershell
    $url = "https://<YOUR-SEARCH-SERVICE>.search.windows.net/indexes/hotels-quickstart?api-version=2019-05-06"
    ```

3. Run the command with **$url**, **$headers**, and **$body** to create the index on the service. 

    ```powershell
    Invoke-RestMethod -Uri $url -Headers $headers -Method Put -Body $body | ConvertTo-Json
    ```

    Results should look similar to this (truncated to the first two fields for brevity):

    ```
    {
        "@odata.context":  "https://mydemo.search.windows.net/$metadata#indexes/$entity",
        "@odata.etag":  "\"0x8D6A99E2DED96B0\"",
        "name":  "hotels-quickstart",
        "defaultScoringProfile":  null,
        "fields":  [
                    {
                        "name":  "hotelId",
                        "type":  "Edm.String",
                        "searchable":  false,
                        "filterable":  true,
                        "retrievable":  true,
                        "sortable":  false,
                        "facetable":  false,
                        "key":  true,
                        "indexAnalyzer":  null,
                        "searchAnalyzer":  null,
                        "analyzer":  null,
                        "synonymMaps":  ""
                    },
                    {
                        "name":  "baseRate",
                        "type":  "Edm.Double",
                        "searchable":  false,
                        "filterable":  true,
                        "retrievable":  true,
                        "sortable":  true,
                        "facetable":  true,
                        "key":  false,
                        "indexAnalyzer":  null,
                        "searchAnalyzer":  null,
                        "analyzer":  null,
                        "synonymMaps":  ""
                    },
    . . .
    ```

> [!Tip]
> For verification, you could also check the Indexes list in the portal.

<a name="load-documents"></a>

## 2 - Load documents

To push documents, use an HTTP POST request to your index's URL endpoint. The REST API for this task is [Add, Update, or Delete Documents](https://docs.microsoft.com/rest/api/searchservice/addupdate-or-delete-documents).

1. Paste this example into PowerShell to create a **$body** object containing the documents you want to upload. 

    This request includes two full and one partial record. The partial record demonstrates that you can upload incomplete documents. The `@search.action` parameter specifies how indexing is done. Valid values include upload, merge, mergeOrUpload, and delete. The mergeOrUpload behavior either creates a new document for hotelId = 3, or updates the contents if it already exists.

    ```powershell
    $body = @"
        "value": [
        {
        "@search.action": "upload",
        "HotelId": "1",
        "HotelName": "Secret Point Motel",
        "Description": "The hotel is ideally located on the main commercial artery of the city in the heart of New York. A few minutes away is Time's Square and the historic centre of the city, as well as other places of interest that make New York one of America's most attractive and cosmopolitan cities.",
        "Description_fr": "L'hôtel est idéalement situé sur la principale artère commerciale de la ville en plein cœur de New York. A quelques minutes se trouve la place du temps et le centre historique de la ville, ainsi que d'autres lieux d'intérêt qui font de New York l'une des villes les plus attractives et cosmopolites de l'Amérique.",
        "Category": "Boutique",
        "Tags": [ "pool", "air conditioning", "concierge" ],
        "ParkingIncluded": false,
        "LastRenovationDate": "1970-01-18T00:00:00Z",
        "Rating": 3.60,
        "Address": {
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
        "Description_fr": "L'hôtel est situé dans une place du XIXe siècle, qui a été agrandie et rénovée aux plus hautes normes architecturales pour créer un hôtel moderne, fonctionnel et de première classe dans lequel l'art et les éléments historiques uniques coexistent avec le confort le plus moderne.",
        "Category": "Boutique",
        "Tags": [ "pool", "free wifi", "concierge" ],
        "ParkingIncluded": false,
        "LastRenovationDate": "1979-02-18T00:00:00Z",
        "Rating": 3.60,
        "Address": {
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
        "Description_fr": "L'hôtel est situé dans une place du XIXe siècle, qui a été agrandie et rénovée aux plus hautes normes architecturales pour créer un hôtel moderne, fonctionnel et de première classe dans lequel l'art et les éléments historiques uniques coexistent avec le confort le plus moderne.",
        "Category": "Resort and Spa",
        "Tags": [ "air conditioning", "bar", "continental breakfast" ],
        "ParkingIncluded": true,
        "LastRenovationDate": "2015-09-20T00:00:00Z",
        "Rating": 4.80,
        "Address": {
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
        "Description_fr": "Le sublime Cliff Hotel est situé au coeur du centre historique de sublime dans un quartier extrêmement animé et vivant, à courte distance de marche des sites et monuments de la ville et est entouré par l'extraordinaire beauté des églises, des bâtiments, des commerces et Monuments. Sublime Cliff fait partie d'un Palace 1800 restauré avec amour.",
        "Category": "Boutique",
        "Tags": [ "concierge", "view", "24-hour front desk service" ],
        "ParkingIncluded": true,
        "LastRenovationDate": "1960-02-06T00:00:00Z",
        "Rating": 4.60,
        "Address": {
            "StreetAddress": "7400 San Pedro Ave",
            "City": "San Antonio",
            "StateProvince": "TX",
            "PostalCode": "78216",
            "Country": "USA"
                }
            }
        ]
    }
    "@
    ```

1. Set the endpoint to the *hotels-quickstart* docs collection and include the index operation (indexes/hotels-quickstart/docs/index).

    ```powershell
    $url = "https://<YOUR-SEARCH-SERVICE>.search.windows.net/indexes/hotels-quickstart/docs/index?api-version=2019-05-06"
    ```

1. Run the command with **$url**, **$headers**, and **$body** to load documents into the hotels-quickstart index.

    ```powershell
    Invoke-RestMethod -Uri $url -Headers $headers -Method Post -Body $body | ConvertTo-Json
    ```
    Results should look similar to the following example. You should see a [status code of 201](https://docs.microsoft.com/rest/api/searchservice/HTTP-status-codes).

    ```
    {
        "@odata.context":  "https://mydemo.search.windows.net/indexes/hotels-quickstart/$metadata#Collection(Microsoft.Azure.Search.V2017_11_11.IndexResult)",
        "value":  [
                    {
                        "key":  "1",
                        "status":  true,
                        "errorMessage":  null,
                        "statusCode":  201
                    },
                    {
                        "key":  "2",
                        "status":  true,
                        "errorMessage":  null,
                        "statusCode":  201
                    },
                    {
                        "key":  "3",
                        "status":  true,
                        "errorMessage":  null,
                        "statusCode":  201
                    },
                    {
                        "key":  "4",
                        "status":  true,
                        "errorMessage":  null,
                        "statusCode":  201
                    }
                ]
    }
    ```

## 3 - Search an index

This step shows you how to query an index using the [Search Documents API](https://docs.microsoft.com/rest/api/searchservice/search-documents).

1. Set the endpoint to the *hotels-quickstart* docs collection and add a **search** parameter to include query strings. This string is an empty search and it returns an unranked list of all documents.

    ```powershell
    $url = 'https://<YOUR-SEARCH-SERVICE>.search.windows.net/indexes/hotels-quickstart/docs?api-version=2019-05-06&search=*'
    ```

1. Run the command to send the **$url** to the service.

    ```powershell
    Invoke-RestMethod -Uri $url -Headers $headers | ConvertTo-Json
    ```

    Results should look similar to the following output.

    ```
    {
        "@odata.context":  "https://mydemo.search.windows.net/indexes/hotels-quickstart/$metadata#docs(*)",
        "value":  [
                    {
                        "@search.score":  1.0,
                        "hotelId":  "1",
                        "baseRate":  199.0,
                        "description":  "Best hotel in town",
                        "description_fr":  null,
                        "hotelName":  "Fancy Stay",
                        "category":  "Luxury",
                        "tags":  "pool view wifi concierge",
                        "parkingIncluded":  false,
                        "smokingAllowed":  false,
                        "lastRenovationDate":  "2010-06-27T00:00:00Z",
                        "rating":  5,
                        "location":  "@{type=Point; coordinates=System.Object[]; crs=}"
                    },
                    {
                        "@search.score":  1.0,
                        "hotelId":  "2",
                        "baseRate":  79.99,
                        "description":  "Cheapest hotel in town",
                        "description_fr":  null,
                        "hotelName":  "Roach Motel",
                        "category":  "Budget",
                        "tags":  "motel budget",
                        "parkingIncluded":  true,
                        "smokingAllowed":  true,
                        "lastRenovationDate":  "1982-04-28T00:00:00Z",
                        "rating":  1,
                        "location":  "@{type=Point; coordinates=System.Object[]; crs=}"
                    },
                    {
                        "@search.score":  1.0,
                        "hotelId":  "3",
                        "baseRate":  129.99,
                        "description":  "Close to town hall and the river",
                        "description_fr":  null,
                        "hotelName":  null,
                        "category":  null,
                        "tags":  "",
                        "parkingIncluded":  null,
                        "smokingAllowed":  null,
                        "lastRenovationDate":  null,
                        "rating":  null,
                        "location":  null
                    }
                ]
    }
    ```

Try a few other query examples to get a feel for the syntax. You can do a string search, verbatim $filter queries, limit the results set, scope the search to specific fields, and more.

```powershell
# Query example 1
# Search the entire index for the term 'budget'
# Return only the `hotelName` field, "Roach hotel"
$url = 'https://<YOUR-SEARCH-SERVICE>.search.windows.net/indexes/hotels-quickstart/docs?api-version=2019-05-06&search=budget&$select=hotelName'

# Query example 2 
# Apply a filter to the index to find hotels cheaper than $150 per night
# Returns the `hotelId` and `description`. Two documents match.
$url = 'https://<YOUR-SEARCH-SERVICE>.search.windows.net/indexes/hotels-quickstart/docs?api-version=2019-05-06&search=*&$filter=baseRate lt 150&$select=hotelId,description'

# Query example 3
# Search the entire index, order by a specific field (`lastRenovationDate`) in descending order
# Take the top two results, and show only `hotelName` and `lastRenovationDate`
$url = 'https://<YOUR-SEARCH-SERVICE>.search.windows.net/indexes/hotels-quickstart/docs?api-version=2019-05-06&search=*&$top=2&$orderby=lastRenovationDate desc&$select=hotelName,lastRenovationDate'
```
## Clean up 

You should delete the index if you no longer need it. A free service is limited to three indexes. You might want to delete any indexes you are not actively using so that you can step through other tutorials.

```powershell
# Set the URI to the hotel index
$url = 'https://mydemo.search.windows.net/indexes/hotels-quickstart?api-version=2019-05-06'

# Delete the index
Invoke-RestMethod -Uri $url -Headers $headers -Method Delete
```

## Next steps

Try adding French descriptions to the index. The following example includes French strings and demonstrates additional search actions. Use mergeOrUpload to create or add to existing fields. The following strings need to be UTF-8 encoded.

```json
{
    "value": [
        {
            "@search.action": "mergeOrUpload",
            "hotelId": "1",
            "description_fr": "Meilleur hôtel en ville"
        },
        {
            "@search.action": "merge",
            "hotelId": "2",
            "description_fr": "Hôtel le moins cher en ville"
        }
    ]
}
```
