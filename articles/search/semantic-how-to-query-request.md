---
title: Create a semantic query
titleSuffix: Azure Cognitive Search
description: Set a semantic query type to attach the deep learning models to query processing, inferring intent and context as part of search rank and relevance.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 03/02/2021
---
# Create a semantic query in Cognitive Search

> [!IMPORTANT]
> Semantic query type is in public preview, available through the preview REST API and Azure portal. Preview features are offered as-is, under [Supplemental Terms of Use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, learn how to attach the semantic query subsystems of Azure Cognitive Search to use semantic ranking, semantic captions, and semantic answer. Setting the queryType parameter to **semantic** enables these capabilities. 

During public preview, there is no charge for semantic search. However, as features transition to general availability, the cost of computations will become a billable event. Once billing decisions are finalized, you'll find cost information documented in the [pricing page](https://azure.microsoft.com/pricing/details/search/) and in [Estimate and manage costs](search-sku-manage-costs.md).

## Prerequisites

+ A search service at a Standard tier (S1, S2, S3), located in West US 2. Roll out is underway in other regions. Check back for updates about greater availability.

+ Access to semantic search preview: [sign up](https://aka.ms/TBD)

+ An existing search index, containing English content

+ A search client for sending queries

  The search client must support preview REST APIs on the query request. You can use [Postman](search-get-started-rest.md), [Visual Studio Code](search-get-started-vs-code.md), or code that you've modified to make REST calls to the preview APIs. You can also use [Search explorer](search-explorer.md) in Azure portal to submit a semantic query.

+ [A query request](/rest/api/searchservice/preview-api/search-documents) with the semantic option uses "api-version=2020-06-30-Preview", "queryType=semantic", "queryLanguage=en-us", and "searchFields=<ordered-field-list>".

## What's a semantic query?

In Cognitive Search, a query is a parameterized request that determines query processing and the shape of the response. A *semantic query* adds parameters that invoke the semantic query subsystems that can intuit context and meaning of matching results, and promote the more meaningful matches to the top.

The following request is representative of a semantic query.

```http
POST https://[service name].search.windows.net/indexes/[index name]/docs/search?api-version=2020-06-30-Preview      
{    
    "search": " Where was Alan Turing born?",    
    "queryType": "semantic",  
    "searchFields": "title,url,body",  
    "queryLanguage": "en-us",  
}
```

As with all queries in Cognitive Search, the request targets the documents collection of a single index. Furthermore, a semantic query undergoes the same sequence of parsing, analysis, and scanning as a non-semantic query. The difference lies in how relevance is computed. As defined in this preview release, a semantic query is one whose *results* are re-processed using advanced algorithms, providing a way to surface the matches deemed most relevant by the semantic ranker, rather than the scores assigned by the default similarity ranking algorithm. 

In this preview, only the top 50 matches from the initial results can be semantically ranked, and all results will include captions automatically. Optionally, you can specify an **`answer`** parameter on the request to invoke a language representation model. This model formulates up to 3 potential answers to the query, and bubbles them up to the top of the results.

## Query using REST APIs

The full specification of the REST API can be found at [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents).

Semantic queries are intended for natural language queries, questions like "what is the best plant for pollinators" or "how to fry an egg". If you want the response to include answers, you can add an  optional **`answer`** parameter on the request.

### Formulate the request

The following semantic query request uses the hotels-sample-index:

```http
POST https://[service name].search.windows.net/indexes/hotels-sample-index/docs/search?api-version=2020-06-30-Preview      
{    
    "search": "newer hotel with a nice restaurant and spa",
    "queryType": "semantic",
    "queryLanguage": "english",
    "searchFields": "HotelName, Category,Description",
    "select": "HotelId,HotelName,Description,Category,Tags",
    "count": true
}
```

In a semantic query, the order of fields in "searchFields" reflects the priority or relative importance of the field in semantic rankings. Only string fields or the top-level field in a collection can be used. 

+ Concise fields, such as HotelName or a title, should precede verbose fields like Description.

+ If your index has a URL field that is textual (human readable such as www.domain.com/name-of-the-document-and-other-details and not machine focused such as www.domain.com/?id=23463&param=eis), put it second in the list (put it first if there is no concise title field).

+ If there is only one field specified, then it will be considered as a descriptive field for semantic ranking of documents.  

+ If there are no fields specified, then all searchable fields will be considered for semantic ranking of documents. However, this is not recommended since it may not yield the most optimal results for your search index. 

### Review the response

Response for the above query returns the following match as the top pick. For more information about semantic responses, see [Semantic ranking and responses](semantic-how-to-query-response.md).

```json
"@odata.count": 29,
"value": [
    {
        "@search.score": 2.19843,
        "@search.semanticScore": 1.0491532748565078,
        "HotelId": "12",
        "HotelName": "Winter Panorama Resort",
        "Description": "Newly-renovated with large rooms, free 24-hr airport shuttle & a new restaurant. Rooms/suites offer mini-fridges & 49-inch HDTVs.",
        "Category": "Resort and Spa",
        "Tags": [
            "laundry service",
            "view",
            "coffee in lobby"
        ]
    },
```

### Parameters used in a semantic query

The following table summarizes the query parameters used in a semantic query. For a comprehensive list of all parameters, see [Search Documents (REST preview)](/rest/api/searchservice/preview-api/search-documents)

| Parameter | Description |
|----------|-------------|
| "queryType": "semantic" | Required for semantic queries. Invokes the semantic ranking algorithms and models. |
| "queryLanguage": "english" | Required for semantic queries. Currently, only `"en-us"` is implemented. |
| "searchFields": "<fields>" | Optional but recommended. Specifies the fields over which semantic ranking occurs. In contrast with simple and full query types, when used in a semantic query, this parameter is required. </br></br>The order in which fields are listed determines precedence, with "title" having priority over "url" and so forth, in how results are ranked. If you have a title or a short field that describes your document, we recommend that to be your first field. Follow that by the url (if any), then the body of the document, and then any other relevant fields. |
| "answers": "extractive" | Optional. Returns three possible answers to the query, derived from content in the document. |

## Query with Search explorer

The following query targets the built-in Hotels sample index, using API version 2020-06-30-Preview, and runs in Search explorer. The `$select` clause limits the results to just a few fields, making it easier to scan in the verbose JSON in Search explorer.

### With queryType=semantic

```json
search=I want a nice hotel on the water with a great restaurant&$select=HotelId,HotelName,Description,Tags&queryType=semantic&queryLanguage=english&searchFields=Description,Tags
```

The first few results are as follows.

```json
{
    "@search.score": 0.38330218,
    "@search.semanticScore": 0.9754053303040564,
    "HotelId": "18",
    "HotelName": "Oceanside Resort",
    "Description": "New Luxury Hotel.  Be the first to stay. Bay views from every room, location near the piper, rooftop pool, waterfront dining & more.",
    "Tags": [
        "view",
        "laundry service",
        "air conditioning"
    ]
},
{
    "@search.score": 1.8920634,
    "@search.semanticScore": 0.8829904259182513,
    "HotelId": "36",
    "HotelName": "Pelham Hotel",
    "Description": "Stunning Downtown Hotel with indoor Pool.  Ideally located close to theatres, museums and the convention center. Indoor Pool and Sauna and fitness centre.  Popular Bar & Restaurant",
    "Tags": [
        "view",
        "pool",
        "24-hour front desk service"
    ]
},
{
    "@search.score": 0.95706713,
    "@search.semanticScore": 0.8538530203513801,
    "HotelId": "22",
    "HotelName": "Stone Lion Inn",
    "Description": "Full breakfast buffet for 2 for only $1.  Excited to show off our room upgrades, faster high speed WiFi, updated corridors & meeting space. Come relax and enjoy your stay.",
    "Tags": [
        "laundry service",
        "air conditioning",
        "restaurant"
    ]
},
```

### With queryType (default)

For comparison, run the same query as above, removing `&queryType=semantic&queryLanguage=english&searchFields=Description,Tags`. Notice that there is no `"@search.semanticScore"` in these results.

```json
{
    "@search.score": 8.633856,
    "HotelId": "3",
    "HotelName": "Triple Landscape Hotel",
    "Description": "The Hotel stands out for its gastronomic excellence under the management of William Dough, who advises on and oversees all of the Hotel’s restaurant services.",
    "Tags": [
        "air conditioning",
        "bar",
        "continental breakfast"
    ]
},
{
    "@search.score": 6.407289,
    "HotelId": "40",
    "HotelName": "Trails End Motel",
    "Description": "Only 8 miles from Downtown.  On-site bar/restaurant, Free hot breakfast buffet, Free wireless internet, All non-smoking hotel. Only 15 miles from airport.",
    "Tags": [
        "continental breakfast",
        "view",
        "view"
    ]
},
{
    "@search.score": 5.843788,
    "HotelId": "14",
    "HotelName": "Twin Vertex Hotel",
    "Description": "New experience in the Making.  Be the first to experience the luxury of the Twin Vertex. Reserve one of our newly-renovated guest rooms today.",
    "Tags": [
        "bar",
        "restaurant",
        "air conditioning"
    ]
},
```

## Next steps

Recall that semantic ranking and responses are built over an initial result set. Any logic that improves the quality of the initial results will carry forward to semantic search. As a next step, review the features that contribute to initial results, including analyzers that affect how strings are tokenized, scoring profiles that can tune results, and the default relevance algorithm.

+ [Analyzers for text processing](search-analyzers.md)
+ [Similarity and scoring in Cognitive Search](index-similarity-and-scoring.md)
+ [Add scoring profiles](index-add-scoring-profiles.md)
+ [Semantic search overview](semantic-search-overview.md)
+ [Add spell check to query inputs](speller-how-to-add.md)
