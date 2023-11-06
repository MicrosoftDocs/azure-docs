---
title: Quickstart vector search
titleSuffix: Azure AI Search
description: Use the generally available REST APIs to call vector search.

author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: quickstart
ms.date: 11/02/2023
---

# Quickstart: Vector search using REST APIs

Get started with vector search in Azure AI Search using the **2023-11-01** REST APIs that create, load, and query a search index. 

Search indexes can have vector fields in the fields collection. When querying the search index, you can build vector-only queries, or create hybrid queries that target vector fields *and* textual fields configured for filters, sorts, facets, and semantic ranking.

> [!NOTE]
> Looking for [built-in data chunking and vectorization](vector-search-integrated-vectorization.md)? Try the [**Import and vectorize data** wizard](search-get-started-portal-import-vectors.md) instead.

## Prerequisites

+ [Postman app](https://www.postman.com/downloads/)

+ An Azure subscription. [Create one for free](https://azure.microsoft.com/free/).

+ Azure AI Search, in any region and on any tier. Most existing services support vector search. For a small subset of services created prior to January 2019, an index containing vector fields will fail on creation. In this situation, a new service must be created.

  For the optional [semantic ranking](semantic-search-overview.md) shown in the last example, your search service must be Basic tier or higher, with [semantic ranking enabled](semantic-how-to-enable-disable.md).

+ [Sample Postman collection](https://github.com/Azure-Samples/azure-search-postman-samples/tree/main/Quickstart-vectors), with requests targeting the **2023-11-01** API version of Azure AI Search.

+ Optional. The Postman collection includes a **Generate Embedding** request that can generate vectors from text. The collection provides a ready-to-use vector, but if you want to replace it, provide an [Azure OpenAI](https://aka.ms/oai/access) endpoint with a deployment of **text-embedding-ada-002**. The step for generating a custom embedding is the only step that requires an Azure OpenAI endpoint, Azure OpenAI key, model deployment name, and API version in the collection variables.

> [!NOTE]
> This quickstart is for the generally available version of [vector search](vector-search-overview.md). If you want to try integrated vectorization, currently in public preview, try [this quickstart](search-get-started-portal-import-vectors.md) instead.  

## About the sample data and queries

Sample data consists of text and vector descriptions for seven fictitious hotels.

+ Textual data is used for keyword search, semantic ranking, and capabilities that depend on text (filters, facets, and sorting). 

+ Vector data (text embeddings) is used for vector search. Currently, Azure AI Search doesn't generate vectors for you. For this quickstart, vector data was generated separately and copied into the "Upload Documents" request and into the query requests.

For vector queries, we used the **Generate Embedding** request that calls Azure OpenAI and outputs embeddings for a search string. If you want to formulate your own vector queries against the sample data, provide your Azure OpenAI connection information in the Postman collection variables. Your Azure OpenAI service must have a deployment of an embedding model that's identical to the one used to generate embeddings in your search corpus. 

For this quickstart, the following parameters were used: 
  
+ Model name: **text-embedding-ada-002**
+ Model version: **2**
+ API version: **2023-08-01-preview**.

## Set up your project

If you're unfamiliar with Postman, see [this quickstart](search-get-started-rest.md) for instructions on how to import collections and set variables.

1. [Fork or clone the azure-search-postman-samples repository](https://github.com/Azure-Samples/azure-search-postman-samples).

1. Start Postman and import the `AzureSearchQuickstartVectors 2023-11-01.postman_collection.json` collection.

1. Right-click the collection name and select **Edit** to set the collection's variables to valid values for Azure AI Search and Azure OpenAI.

1. Select **Variables** from the list of actions at the top of the page. Into **Current value**, provide the following values. Required and recommended values are specified.

    | Variable | Current value |
    |----------|---------------|
    | index-name | *index names are lower-case, no spaces, and can't start or end with dashes* |
    | search-service-name | *from Azure portal, get just the name of the service, not the full URL* |
    | search-api-version | 2023-11-01 |
    | search-api-key | *provide an admin key* |
    | openai-api-key | *optional. Set this value if you want to generate embeddings. Find this value in Azure portal.* |
    | openai-service-name | *optional. Set this value if you want to generate embeddings. Find this value in Azure portal.* |
    | openai-deployment-name | text-embedding-ada-002 |
    | openai-api-version | 2023-08-01-preview |

1. Save your changes.

You're now ready to send the requests to your search service. For each request, select the blue **Send** button. When you see a success message, move on to the next request.

## Create an index

Use the [Create or Update Index](/rest/api/searchservice/indexes/create-or-update) REST API for this request.

The index schema is organized around hotels content. Sample data consists of the names, descriptions, and locations of seven fictitious hotels. This schema includes fields for vector and traditional keyword search, with configurations for vector and semantic ranking. 

The following example is a subset of the full index. We trimmed the definition so that you can focus on field definitions, vector configuration, and optional semantic configuration.

```http
PUT https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}?api-version=2023-11-01
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "name": "hotels-vector-quickstart",
    "fields": [
        {
            "name": "HotelId", 
            "type": "Edm.String",
            "searchable": false, 
            "filterable": true, 
            "retrievable": true, 
            "sortable": false, 
            "facetable": false,
            "key": true
        },
        {
            "name": "HotelName", 
            "type": "Edm.String",
            "searchable": true, 
            "filterable": false, 
            "retrievable": true, 
            "sortable": true, 
            "facetable": false
        },
        {
            "name": "HotelNameVector",
            "type": "Collection(Edm.Single)",
            "searchable": true,
            "retrievable": true,
            "dimensions": 1536,
            "vectorSearchProfile": "my-vector-profile"
        },
        {
            "name": "Description", 
            "type": "Edm.String",
            "searchable": true, 
            "filterable": false, 
            "retrievable": true, 
            "sortable": false, 
            "facetable": false
        },
        {
            "name": "DescriptionVector",
            "type": "Collection(Edm.Single)",
            "searchable": true,
            "retrievable": true,
            "dimensions": 1536,
            "vectorSearchProfile": "my-vector-profile"
        },
        {
            "name": "Category", "type": "Edm.String",
            "searchable": true, 
            "filterable": true, 
            "retrievable": true, 
            "sortable": true, 
            "facetable": true
        },
        {
            "name": "Address", 
            "type": "Edm.ComplexType",
            "fields": [
                {
                    "name": "City", "type": "Edm.String",
                    "searchable": true, "filterable": true, "retrievable": true, "sortable": true, "facetable": true
                },
                {
                    "name": "StateProvince", "type": "Edm.String",
                    "searchable": true, "filterable": true, "retrievable": true, "sortable": true, "facetable": true
                }
            ]
        },
        {
            "name": "Location",
            "type": "Edm.GeographyPoint",
            "searchable": false, 
            "filterable": true, 
            "retrievable": true, 
            "sortable": true, 
            "facetable": false
        }
    ],
    "vectorSearch": {
        "algorithms": [
            {
                "name": "my-hnsw-vector-config-1",
                "kind": "hnsw",
                "hnswParameters": 
                {
                    "m": 4,
                    "efConstruction": 400,
                    "efSearch": 500,
                    "metric": "cosine"
                }
            },
            {
                "name": "my-hnsw-vector-config-2",
                "kind": "hnsw",
                "hnswParameters": 
                {
                    "m": 4,
                    "metric": "euclidean"
                }
            },
            {
                "name": "my-eknn-vector-config",
                "kind": "exhaustiveKnn",
                "exhaustiveKnnParameters": 
                {
                    "metric": "cosine"
                }
            }
        ],
        "profiles": [      
            {
                "name": "my-vector-profile",
                "algorithm": "my-hnsw-vector-config-1"
            }
      ]
    },
    "semantic": {
        "configurations": [
            {
                "name": "my-semantic-config",
                "prioritizedFields": {
                    "titleField": {
                        "fieldName": "HotelName"
                    },
                    "prioritizedContentFields": [
                        { "fieldName": "Description" }
                    ],
                    "prioritizedKeywordsFields": [
                        { "fieldName": "Tags" }
                    ]
                }
            }
        ]
    }
}
```

You should get a status HTTP 201 success.

**Key points:**

+ The `"fields"` collection includes a required key field, text and vector fields (such as `"Description"`, `"DescriptionVector"`) for keyword and vector search. Colocating vector and non-vector fields in the same index enables hybrid queries. For instance, you can combine filters, keyword search with semantic ranking, and vectors into a single query operation.

+ Vector fields must be `"type": "Collection(Edm.Single)"` with `"dimensions"` and `"vectorSearchProfile"` properties. See [Create or Update Index](/rest/api/searchservice/indexes/create-or-update) for property descriptions.

+ The `"vectorSearch"` section is an array of Approximate Nearest Neighbors (ANN) algorithm configurations and profiles. Supported algorithms include HNSW and exhaustive KNN. See [Relevance scoring in vector search](vector-search-ranking.md) for details.

+ [Optional]: The `"semantic"` configuration enables reranking of search results. You can rerank results in queries of type `"semantic"` for string fields that are specified in the configuration. See [Semantic ranking overview](semantic-search-overview.md) to learn more.

## Upload documents

Use the [Index Documents](/rest/api/searchservice/documents) REST API for this request.

For readability, the following excerpt shows just the fields used in queries, minus the vector values associated with `DescriptionVector`. Each vector field contains 1536 embeddings, so those values are omitted for readability.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/index?api-version=2023-11-01
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "value": [
        {
            "@search.action": "mergeOrUpload",
            "HotelId": "1",
            "HotelName": "Secret Point Motel",
            "HotelNameVector": [VECTOR ARRAY OMITTED],
            "Description": 
                "The hotel is ideally located on the main commercial artery of the city 
                in the heart of New York.",
            "DescriptionVector": [VECTOR ARRAY OMITTED],
            "Category": "Boutique",
            "Tags": [
                "pool",
                "air conditioning",
                "concierge"
            ],
        },
        {
            "@search.action": "mergeOrUpload",
            "HotelId": "2",
            "HotelName": "Twin Dome Hotel",
            "HotelNameVector": [VECTOR ARRAY OMITTED],
            "Description": 
                "The hotel is situated in a  nineteenth century plaza, which has been 
                expanded and renovated to the highest architectural standards to create a modern, 
                functional and first-class hotel in which art and unique historical elements 
                coexist with the most modern comforts.",
            "DescriptionVector": [VECTOR ARRAY OMITTED],
            "Category": "Boutique",
            "Tags": [
                "pool",
                "air conditioning",
                "free wifi",
                "concierge"
            ]
        },
        {
            "@search.action": "mergeOrUpload",
            "HotelId": "3",
            "HotelName": "Triple Landscape Hotel",
            "HotelNameVector": [VECTOR ARRAY OMITTED],
            "Description": 
                "The Hotel stands out for its gastronomic excellence under the management of 
                William Dough, who advises on and oversees all of the Hotel’s restaurant services.",
            "DescriptionVector": [VECTOR ARRAY OMITTED],
            "Category": "Resort and Spa",
            "Tags": [
                "air conditioning",
                "bar",
                "continental breakfast"
            ]
        }
        {
            "@search.action": "mergeOrUpload",
            "HotelId": "4",
            "HotelName": "Sublime Cliff Hotel",
            "HotelNameVector": [VECTOR ARRAY OMITTED],
            "Description": 
                "Sublime Cliff Hotel is located in the heart of the historic center of 
                Sublime in an extremely vibrant and lively area within short walking distance to 
                the sites and landmarks of the city and is surrounded by the extraordinary beauty 
                of churches, buildings, shops and monuments. 
                Sublime Cliff is part of a lovingly restored 1800 palace.",
            "DescriptionVector": [VECTOR ARRAY OMITTED],
            "Category": "Boutique",
            "Tags": [
                "concierge",
                "view",
                "24-hour front desk service"
            ]
        },
        {
            "@search.action": "mergeOrUpload",
            "HotelId": "13",
            "HotelName": "Historic Lion Resort",
            "HotelNameVector": [VECTOR ARRAY OMITTED],
            "Description": 
                "Unmatched Luxury.  Visit our downtown hotel to indulge in luxury 
                accommodations. Moments from the stadium, we feature the best in comfort",
            "DescriptionVector": [VECTOR ARRAY OMITTED],
            "Category": "Resort and Spa",
            "Tags": [
                "view",
                "free wifi",
                "pool"
            ]
        },
        {
            "@search.action": "mergeOrUpload",
            "HotelId": "48",
            "HotelName": "Nordick's Hotel",
            "HotelNameVector": [VECTOR ARRAY OMITTED],
            "Description": 
                "Only 90 miles (about 2 hours) from the nation's capital and nearby 
                most everything the historic valley has to offer.  Hiking? Wine Tasting? Exploring 
                the caverns?  It's all nearby and we have specially priced packages to help make 
                our B&B your home base for fun while visiting the valley.",
            "DescriptionVector": [VECTOR ARRAY OMITTED],
            "Category": "Boutique",
            "Tags": [
                "continental breakfast",
                "air conditioning",
                "free wifi"
            ],
        },
        {
            "@search.action": "mergeOrUpload",
            "HotelId": "49",
            "HotelName": "Old Carrabelle Hotel",
            "HotelNameVector": [VECTOR ARRAY OMITTED],
            "Description": 
                "Spacious rooms, glamorous suites and residences, rooftop pool, walking 
                access to shopping, dining, entertainment and the city center.",
            "DescriptionVector": [VECTOR ARRAY OMITTED],
            "Category": "Luxury",
            "Tags": [
                "air conditioning",
                "laundry service",
                "24-hour front desk service"
            ]
        }
    ]
}
```

**Key points:**

+ Documents in the payload consist of fields defined in the index schema. 

+ Vector fields contain floating point values. The dimensions attribute has a minimum of 2 and a maximum of 2048 floating point values each. This quickstart sets the dimensions attribute to 1536 because that's the size of embeddings generated by the Open AI's **text-embedding-ada-002** model.

## Run queries

Use the [Search POST](/rest/api/searchservice/documents/search-post) REST API for query request.

There are several queries to demonstrate various patterns. 

+ [Single vector search](#single-vector-search)
+ [Single vector search with filter](#single-vector-search-with-filter)
+ [Hybrid search](#hybrid-search)
+ [Semantic hybrid search with filter](#semantic-hybrid-search-with-filter)

The queries in this section are based on two strings:

+ search string: *"historic hotel walk to restaurants and shopping"*
+ vector query string (vectorized into a mathematical representation): *"classic lodging near running trails, eateries, retail"*

The vector query string is semantically similar to the search string, but has terms that don't exist in the search index. If you do a keyword search for "classic lodging near running trails, eateries, retail", results are zero. We use this example to show how you can get relevant results even if there are no matching terms.

### Single vector search

In this vector query, which is shortened for brevity, the `"value"` contains the vectorized text of the query input, `"fields"` determines which vector fields are searched, and `"k"` specifies the number of nearest neighbors to return.

The vector query string is *"classic lodging near running trails, eateries, retail"* - vectorized into 1536 embeddings for this query.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "count": true,
    "select": "HotelId, HotelName, Description, Category",
    "vectors": [
        {
            "value": [0.01944167, 0.0040178085
                . . . 
                010858015, -0.017496133],
            "k": 7,
            "fields": "DescriptionVector",
            "kind": "vector",
            "exhaustive": true
        }
    ]
}
```

The response for the vector equivalent of "classic lodging near running trails, eateries, retail" includes seven results. Each result provides a search score and the fields listed in `"select"`. In a similarity search, the response always includes `"k"` results ordered by the value similarity score.

```http
{
    "@odata.context": "https://my-demo-search.search.windows.net/indexes('hotels-vector-quickstart')/$metadata#docs(*)",
    "@odata.count": 7,
    "value": [
        {
            "@search.score": 0.857736,
            "HotelName": "Nordick's Motel",
            "Description": "Only 90 miles (about 2 hours) from the nation's capital and nearby most everything the historic valley has to offer.  Hiking? Wine Tasting? Exploring the caverns?  It's all nearby and we have specially priced packages to help make our B&B your home base for fun while visiting the valley."
        },
        {
            "@search.score": 0.8399129,
            "HotelName": "Old Carrabelle Hotel",
            "Description": "Spacious rooms, glamorous suites and residences, rooftop pool, walking access to shopping, dining, entertainment and the city center."
        },
        {
            "@search.score": 0.8383954,
            "HotelName": "Historic Lion Resort",
            "Description": "Unmatched Luxury.  Visit our downtown hotel to indulge in luxury accommodations. Moments from the stadium, we feature the best in comfort"
        },
        {
            "@search.score": 0.8254346,
            "HotelName": "Sublime Cliff Hotel",
            "Description": "Sublime Cliff Hotel is located in the heart of the historic center of Sublime in an extremely vibrant and lively area within short walking distance to the sites and landmarks of the city and is surrounded by the extraordinary beauty of churches, buildings, shops and monuments. Sublime Cliff is part of a lovingly restored 1800 palace."
        },
        {
            "@search.score": 0.82380056,
            "HotelName": "Secret Point Hotel",
            "Description": "The hotel is ideally located on the main commercial artery of the city in the heart of New York."
        },
        {
            "@search.score": 0.81514084,
            "HotelName": "Twin Dome Hotel",
            "Description": "The hotel is situated in a  nineteenth century plaza, which has been expanded and renovated to the highest architectural standards to create a modern, functional and first-class hotel in which art and unique historical elements coexist with the most modern comforts."
        },
        {
            "@search.score": 0.8133763,
            "HotelName": "Triple Landscape Hotel",
            "Description": "The Hotel stands out for its gastronomic excellence under the management of William Dough, who advises on and oversees all of the Hotel’s restaurant services."
        }
    ]
}
```

### Single vector search with filter

You can add filters, but the filters are applied to the non-vector content in your index. In this example, the filter applies to the `"Tags"` field, filtering out any hotels that don't provide free WIFI.

This example sets `vectorFilterMode` to pre-query filtering, which is the default, so you don't need to set it. It's listed here for awareness because it's a newer feature.

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "count": true,
    "select": "HotelName, Tags, Description",
    "filter": "Tags/any(tag: tag eq 'free wifi')",
    "vectorFilterMode": "PreFilter",
    "vectorQueries": [
        {
            "vector": [ VECTOR OMITTED ],
            "k": 7,
            "fields": "DescriptionVector",
            "kind": "vector",
            "exhaustive": true
        },
    ]
}
``` 

Response for the same vector query, with a post-processing filter, returns three hotels having free WIFI.

```http
{

    "@odata.count": 3,
    "value": [
        {
            "@search.score": 0.857736,
            "HotelName": "Nordick's Motel",
            "Description": "Only 90 miles (about 2 hours) from the nation's capital and nearby most everything the historic valley has to offer.  Hiking? Wine Tasting? Exploring the caverns?  It's all nearby and we have specially priced packages to help make our B&B your home base for fun while visiting the valley.",
            "Tags": [
                "continental breakfast",
                "air conditioning",
                "free wifi"
            ]
        },
        {
            "@search.score": 0.8383954,
            "HotelName": "Historic Lion Resort",
            "Description": "Unmatched Luxury.  Visit our downtown hotel to indulge in luxury accommodations. Moments from the stadium, we feature the best in comfort",
            "Tags": [
                "view",
                "free wifi",
                "pool"
            ]
        },
        {
            "@search.score": 0.81514084,
            "HotelName": "Twin Dome Hotel",
            "Description": "The hotel is situated in a  nineteenth century plaza, which has been expanded and renovated to the highest architectural standards to create a modern, functional and first-class hotel in which art and unique historical elements coexist with the most modern comforts.",
            "Tags": [
                "pool",
                "free wifi",
                "concierge"
            ]
        }
    ]
}
```

### Hybrid search

Hybrid search consists of keyword queries and vector queries in a single search request. This example runs the vector query and full text search concurrently:

+ search string: *"historic hotel walk to restaurants and shopping"*
+ vector query string (vectorized into a mathematical representation): *"classic lodging near running trails, eateries, retail"*

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "count": true,
    "search": "historic hotel walk to restaurants and shopping",
    "select": "HotelName, Description",
    "top": 7,
    "vectorQueries": [
        {
            "vector": [ VECTOR OMITTED],
            "k": 7,
            "fields": "DescriptionVector",
            "kind": "vector",
            "exhaustive": true
        }
    ]
}
```

Because this is a hybrid query, results are RRF-ranked. RRF evaluates search scores from various search results, takes the inverse, and then merges and sorts the combined results. The `top` number of results are returned.

```http
{
    "@odata.count": 7,
    "value": [
        {
            "@search.score": 0.03279569745063782,
            "HotelName": "Historic Lion Resort",
            "Description": "Unmatched Luxury.  Visit our downtown hotel to indulge in luxury accommodations. Moments from the stadium, we feature the best in comfort"
        },
        {
            "@search.score": 0.03226646035909653,
            "HotelName": "Sublime Cliff Hotel",
            "Description": "Sublime Cliff Hotel is located in the heart of the historic center of Sublime in an extremely vibrant and lively area within short walking distance to the sites and landmarks of the city and is surrounded by the extraordinary beauty of churches, buildings, shops and monuments. Sublime Cliff is part of a lovingly restored 1800 palace."
        },
        {
            "@search.score": 0.03226646035909653,
            "HotelName": "Old Carrabelle Hotel",
            "Description": "Spacious rooms, glamorous suites and residences, rooftop pool, walking access to shopping, dining, entertainment and the city center."
        },
        {
            "@search.score": 0.03205128386616707,
            "HotelName": "Nordick's Motel",
            "Description": "Only 90 miles (about 2 hours) from the nation's capital and nearby most everything the historic valley has to offer.  Hiking? Wine Tasting? Exploring the caverns?  It's all nearby and we have specially priced packages to help make our B&B your home base for fun while visiting the valley."
        },
        {
            "@search.score": 0.03128054738044739,
            "HotelName": "Triple Landscape Hotel",
            "Description": "The Hotel stands out for its gastronomic excellence under the management of William Dough, who advises on and oversees all of the Hotel’s restaurant services."
        },
        {
            "@search.score": 0.03100961446762085,
            "HotelName": "Twin Dome Hotel",
            "Description": "The hotel is situated in a  nineteenth century plaza, which has been expanded and renovated to the highest architectural standards to create a modern, functional and first-class hotel in which art and unique historical elements coexist with the most modern comforts."
        },
        {
            "@search.score": 0.03077651560306549,
            "HotelName": "Secret Point Hotel",
            "Description": "The hotel is ideally located on the main commercial artery of the city in the heart of New York."
        }
    ]
}
```

Because RRF merges results, it helps to review the inputs. The following results are from just the full text query. Top two results are Sublime Cliff Hotel and History Lion Resort, with Sublime Cliff Hotel having a much stronger BM25 relevance score.

```http
        {
            "@search.score": 2.2626662,
            "HotelName": "Sublime Cliff Hotel",
            "Description": "Sublime Cliff Hotel is located in the heart of the historic center of Sublime in an extremely vibrant and lively area within short walking distance to the sites and landmarks of the city and is surrounded by the extraordinary beauty of churches, buildings, shops and monuments. Sublime Cliff is part of a lovingly restored 1800 palace."
        },
        {
            "@search.score": 0.86421645,
            "HotelName": "Historic Lion Resort",
            "Description": "Unmatched Luxury.  Visit our downtown hotel to indulge in luxury accommodations. Moments from the stadium, we feature the best in comfort"
        },
```

In the vector-only query using HNSW for finding matches, Sublime Cliff Hotel drops to position four. But Historic Lion, which was second in full text search and third in vector search, doesn't experience the same range of fluctuation and thus appears as a top match in a homogenized result set.

```http
    "value": [
        {
            "@search.score": 0.857736,
            "HotelId": "48",
            "HotelName": "Nordick's Motel",
            "Description": "Only 90 miles (about 2 hours) from the nation's capital and nearby most everything the historic valley has to offer.  Hiking? Wine Tasting? Exploring the caverns?  It's all nearby and we have specially priced packages to help make our B&B your home base for fun while visiting the valley.",
            "Category": "Boutique"
        },
        {
            "@search.score": 0.8399129,
            "HotelId": "49",
            "HotelName": "Old Carrabelle Hotel",
            "Description": "Spacious rooms, glamorous suites and residences, rooftop pool, walking access to shopping, dining, entertainment and the city center.",
            "Category": "Luxury"
        },
        {
            "@search.score": 0.8383954,
            "HotelId": "13",
            "HotelName": "Historic Lion Resort",
            "Description": "Unmatched Luxury.  Visit our downtown hotel to indulge in luxury accommodations. Moments from the stadium, we feature the best in comfort",
            "Category": "Resort and Spa"
        },
        {
            "@search.score": 0.8254346,
            "HotelId": "4",
            "HotelName": "Sublime Cliff Hotel",
            "Description": "Sublime Cliff Hotel is located in the heart of the historic center of Sublime in an extremely vibrant and lively area within short walking distance to the sites and landmarks of the city and is surrounded by the extraordinary beauty of churches, buildings, shops and monuments. Sublime Cliff is part of a lovingly restored 1800 palace.",
            "Category": "Boutique"
        },
        {
            "@search.score": 0.82380056,
            "HotelId": "1",
            "HotelName": "Secret Point Hotel",
            "Description": "The hotel is ideally located on the main commercial artery of the city in the heart of New York.",
            "Category": "Boutique"
        },
        {
            "@search.score": 0.81514084,
            "HotelId": "2",
            "HotelName": "Twin Dome Hotel",
            "Description": "The hotel is situated in a  nineteenth century plaza, which has been expanded and renovated to the highest architectural standards to create a modern, functional and first-class hotel in which art and unique historical elements coexist with the most modern comforts.",
            "Category": "Boutique"
        },
        {
            "@search.score": 0.8133763,
            "HotelId": "3",
            "HotelName": "Triple Landscape Hotel",
            "Description": "The Hotel stands out for its gastronomic excellence under the management of William Dough, who advises on and oversees all of the Hotel’s restaurant services.",
            "Category": "Resort and Spa"
        }
    ]
```

### Semantic hybrid search with filter

Here's the last query in the collection: a hybrid query, with semantic ranking, filtered to show just those hotels within a 500-kilometer radius of Washington D.C. `vectorFilterMode` can be set to null, which is equivalent to the default (`preFilter` for newer indexes, `postFilter` for older ones).

```http
POST https://{{search-service-name}}.search.windows.net/indexes/{{index-name}}/docs/search?api-version=2023-11-01
Content-Type: application/json
api-key: {{admin-api-key}}
{
    "count": true,
    "search": "historic hotel walk to restaurants and shopping",
    "select": "HotelId, HotelName, Category, Description,Address/City, Address/StateProvince",
    "filter": "geo.distance(Location, geography'POINT(-77.03241 38.90166)') le 500",
    "vectorFilterMode": null,
    "facets": [ "Address/StateProvince"],
    "top": 7,
    "queryType": "semantic",
    "answers": "extractive|count-3",
    "captions": "extractive|highlight-true",
    "semanticConfiguration": "my-semantic-config",
    "vectorQueries": [
        {
            "vector": [ VECTOR OMITTED ],
            "k": 7,
            "fields": "DescriptionVector",
            "kind": "vector",
            "exhaustive": true
        }
    ]
}
```

Response is three hotels, filtered by location and faceted by StateProvince, semantically ranked to promote results that are closest to the search string query ("historic hotel walk to restaurants and shopping").

Now, Old Carabelle Hotel moves into the top spot. Without semantic ranking, Nordick's Hotel is number one. With semantic ranking, the machine comprehension models recognize that "historic" applies to hotel, within walking distance to dining (restaurants) and shopping.

```http
{
    "@odata.count": 3,
    "@search.facets": {
        "Address/StateProvince": [
            {
                "count": 1,
                "value": "NY"
            },
            {
                "count": 1,
                "value": "VA"
            }
        ]
    },
    "@search.answers": [],
    "value": [
        {
            "@search.score": 0.03306011110544205,
            "@search.rerankerScore": 2.5094974040985107,
            "HotelId": "49",
            "HotelName": "Old Carrabelle Hotel",
            "Description": "Spacious rooms, glamorous suites and residences, rooftop pool, walking access to shopping, dining, entertainment and the city center.",
            "Category": "Luxury",
            "Address": {
                "City": "Arlington",
                "StateProvince": "VA"
            }
        },
        {
            "@search.score": 0.03306011110544205,
            "@search.rerankerScore": 2.0370211601257324,
            "HotelId": "48",
            "HotelName": "Nordick's Motel",
            "Description": "Only 90 miles (about 2 hours) from the nation's capital and nearby most everything the historic valley has to offer.  Hiking? Wine Tasting? Exploring the caverns?  It's all nearby and we have specially priced packages to help make our B&B your home base for fun while visiting the valley.",
            "Category": "Boutique",
            "Address": {
                "City": "Washington D.C.",
                "StateProvince": null
            }
        },
        {
            "@search.score": 0.032258063554763794,
            "@search.rerankerScore": 1.6706111431121826,
            "HotelId": "1",
            "HotelName": "Secret Point Hotel",
            "Description": "The hotel is ideally located on the main commercial artery of the city in the heart of New York.",
            "Category": "Boutique",
            "Address": {
                "City": "New York",
                "StateProvince": "NY"
            }
        }
    ]
}
```

**Key points:**

+ Vector search is specified through the vector `"vectors.value"` property. Keyword search is specified through `"search"` property.

+ In a hybrid search, you can integrate vector search with full text search over keywords. Filters, spell check, and semantic ranking apply to textual content only, and not vectors. In this final query, there's no semantic `"answer"` because the system didn't produce one that was sufficiently strong.

+ Actual results include more detail, including semantic captions and highlights. Results have been modified for readability. You should run the request in the Postman collection to get the full structure of the response.

## Clean up

Azure AI Search is a billable resource. If it's no longer needed, delete it from your subscription to avoid charges.

## Next steps

As a next step, we recommend reviewing the demo code for [Python](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-python), [C#](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-dotnet), or [JavaScript](https://github.com/Azure/cognitive-search-vector-pr/tree/main/demo-javascript).
